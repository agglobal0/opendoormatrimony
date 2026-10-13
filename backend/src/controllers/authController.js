const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { hashPassword, comparePassword, generateToken } = require('../utils/security');
const { sanitizeProfileForPublic } = require('../utils/privacy');
const { createNotification } = require('../services/notificationService');

exports.register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      mobile_number,
      first_name,
      last_name,
      gender,
      dob,
      city = 'Jalandhar',
      state = 'Punjab',
      country = 'India',
      education_level = 'Graduate',
      occupation = 'Professional',
      church_name = 'The Open Door Church, Khojewala',
      denomination = 'Evangelical / Pentecostal'
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    if (db.isMock()) {
      const mock = require('../config/mockDb');
      if (mock.tables.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const userId = uuidv4();
      const profileId = uuidv4();
      const passwordHash = await hashPassword(password);

      const newUser = {
        id: userId,
        email: normalizedEmail,
        password_hash: passwordHash,
        mobile_number,
        role: 'USER',
        status: 'ACTIVE',
        is_verified: false,
        created_at: new Date()
      };

      const newProfile = {
        id: profileId,
        user_id: userId,
        first_name,
        last_name,
        gender,
        dob,
        height_cm: req.body.height_cm || 170,
        marital_status: req.body.marital_status || 'NEVER_MARRIED',
        mother_tongue: req.body.mother_tongue || 'Punjabi',
        languages_spoken: req.body.languages_spoken || 'Punjabi, Hindi, English',
        education_level,
        education_field: req.body.education_field || '',
        occupation,
        employed_in: req.body.employed_in || 'PRIVATE_SECTOR',
        annual_income_range: req.body.annual_income_range || '',
        city,
        state,
        country,
        about_me: req.body.about_me || 'Born-again Christian seeking a godly partner.',
        profile_photo: (req.body.profile_photo && (req.body.profile_photo.startsWith('http://') || req.body.profile_photo.startsWith('https://') || req.body.profile_photo.startsWith('data:image/')))
          ? req.body.profile_photo
          : (gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
        verification_status: 'PENDING',
        completion_percentage: 100,
        privacy_contact: 'MUTUAL_INTEREST_ONLY',
        privacy_photo: 'REGISTERED_ONLY',
        created_at: new Date()
      };

      mock.tables.users.push(newUser);
      mock.tables.profiles.push(newProfile);
      mock.tables.faith_information.push({
        id: uuidv4(),
        profile_id: profileId,
        church_name,
        denomination,
        is_baptized: req.body.is_baptized !== false,
        born_again_year: req.body.born_again_year || null,
        church_involvement: req.body.church_involvement || '',
        ministry_involvement: req.body.ministry_involvement || '',
        faith_description: req.body.faith_description || '',
        pastor_reference_name: req.body.pastor_reference_name || '',
        pastor_reference_phone: req.body.pastor_reference_phone || ''
      });
      mock.tables.family_information.push({
        id: uuidv4(),
        profile_id: profileId,
        father_occupation: req.body.father_occupation || '',
        mother_occupation: req.body.mother_occupation || '',
        brothers_count: req.body.brothers_count || 0,
        sisters_count: req.body.sisters_count || 0,
        family_type: req.body.family_type || 'NUCLEAR',
        family_values: req.body.family_values || 'TRADITIONAL_CHRISTIAN',
        family_location: `${city}, ${state}`,
        about_family: req.body.about_family || ''
      });
      mock.tables.marriage_preferences.push({
        id: uuidv4(),
        profile_id: profileId,
        min_age: req.body.min_age || (gender === 'MALE' ? 20 : 24),
        max_age: req.body.max_age || (gender === 'MALE' ? 30 : 35),
        min_height_cm: 150,
        max_height_cm: 190,
        preferred_marital_status: 'NEVER_MARRIED',
        preferred_education: '',
        preferred_occupation: '',
        preferred_denominations: denomination,
        preferred_locations: state,
        general_expectations: req.body.general_expectations || ''
      });

      // Send welcome notification
      await createNotification(
        userId,
        'Welcome to Open Door Matrimony!',
        'Your profile has been submitted for church verification. You can discover profiles while pastoral verification is in progress.',
        'PROFILE_UNDER_REVIEW',
        '/dashboard/profile'
      );

      const token = generateToken({ id: userId, email: normalizedEmail, role: 'USER' });
      return res.status(201).json({
        success: true,
        message: 'Registration successful. Welcome to Open Door Matrimony.',
        token,
        user: {
          id: userId,
          email: normalizedEmail,
          role: 'USER',
          is_verified: false,
          membership_tier: 'FREE',
          is_membership_active: false,
          connect_credits: 0
        },
        profile: sanitizeProfileForPublic(newProfile, newUser)
      });
    }

    // Standard MySQL flow
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const userId = uuidv4();
    const profileId = uuidv4();
    const passwordHash = await hashPassword(password);

    await db.query(
      `INSERT INTO users (id, email, password_hash, mobile_number, role, status, is_verified, created_at)
       VALUES (?, ?, ?, ?, 'USER', 'ACTIVE', FALSE, NOW())`,
      [userId, normalizedEmail, passwordHash, mobile_number]
    );

    await db.query(
      `INSERT INTO profiles (id, user_id, first_name, last_name, gender, dob, education_level, occupation, city, state, country, verification_status, completion_percentage, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', 60, NOW())`,
      [profileId, userId, first_name, last_name, gender, dob, education_level, occupation, city, state, country]
    );

    await db.query(
      `INSERT INTO faith_information (id, profile_id, church_name, denomination, is_baptized)
       VALUES (?, ?, ?, ?, TRUE)`,
      [uuidv4(), profileId, church_name, denomination]
    );

    await db.query(
      `INSERT INTO family_information (id, profile_id, family_location)
       VALUES (?, ?, ?)`,
      [uuidv4(), profileId, `${city}, ${state}`]
    );

    await db.query(
      `INSERT INTO marriage_preferences (id, profile_id, min_age, max_age)
       VALUES (?, ?, ?, ?)`,
      [uuidv4(), profileId, gender === 'MALE' ? 20 : 24, gender === 'MALE' ? 30 : 35]
    );

    await createNotification(
      userId,
      'Welcome to Open Door Matrimony!',
      'Your profile has been submitted for church verification. Our pastoral bureau will review your details shortly.',
      'PROFILE_UNDER_REVIEW',
      '/dashboard/profile'
    );

    const token = generateToken({ id: userId, email: normalizedEmail, role: 'USER' });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to Open Door Matrimony.',
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        role: 'USER',
        is_verified: false,
        membership_tier: 'FREE',
        is_membership_active: false,
        connect_credits: 0
      },
      profile: { id: profileId, user_id: userId, first_name, last_name, gender, verification_status: 'PENDING' }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const user = mock.tables.users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
      }

      if (user.status === 'SUSPENDED') {
        return res.status(403).json({ success: false, message: 'Your account has been suspended by the church administration. Please contact the bureau.' });
      }

      const match = await comparePassword(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
      }

      const profile = mock.tables.profiles.find(p => p.user_id === user.id);
      const token = generateToken({ id: user.id, email: user.email, role: user.role });

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
          membership_tier: user.membership_tier || 'FREE',
          is_membership_active: Boolean(user.is_membership_active || (user.membership_tier && user.membership_tier !== 'FREE')),
          connect_credits: user.connect_credits || 0
        },
        profile: profile ? sanitizeProfileForPublic(profile, user) : null
      });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const user = users[0];
    if (user.status === 'SUSPENDED') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by the church administration.' });
    }

    const match = await comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const [profiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [user.id]);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: Boolean(user.is_verified),
        membership_tier: user.membership_tier || 'FREE',
        is_membership_active: Boolean(user.is_membership_active || (user.membership_tier && user.membership_tier !== 'FREE')),
        connect_credits: user.connect_credits || 0
      },
      profile: profiles.length > 0 ? sanitizeProfileForPublic(profiles[0], user) : null
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const user = mock.tables.users.find(u => u.id === userId);
      const profile = mock.tables.profiles.find(p => p.user_id === userId);
      const faith = mock.tables.faith_information.find(f => f.profile_id === (profile ? profile.id : null));
      const family = mock.tables.family_information.find(fam => fam.profile_id === (profile ? profile.id : null));
      const prefs = mock.tables.marriage_preferences.find(pr => pr.profile_id === (profile ? profile.id : null));

      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      const fullProfile = profile ? {
        ...profile,
        user_email: user.email,
        user_phone: user.mobile_number,
        user_role: user.role,
        ...(faith || {}),
        ...(family || {}),
        ...(prefs || {})
      } : null;

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
          membership_tier: user.membership_tier || 'FREE',
          is_membership_active: Boolean(user.is_membership_active || (user.membership_tier && user.membership_tier !== 'FREE')),
          connect_credits: user.connect_credits || 0
        },
        profile: fullProfile ? sanitizeProfileForPublic(fullProfile, user) : null
      });
    }

    const [users] = await db.query('SELECT id, email, mobile_number, role, is_verified, membership_tier, connect_credits, is_membership_active FROM users WHERE id = ?', [userId]);
    if (!users || users.length === 0) return res.status(404).json({ success: false, message: 'User not found.' });

    const [profiles] = await db.query(`
      SELECT p.*, f.church_name, f.denomination, f.is_baptized, f.born_again_year, f.church_involvement, f.ministry_involvement, f.faith_description, f.pastor_reference_name, f.pastor_reference_phone,
             fam.father_occupation, fam.mother_occupation, fam.brothers_count, fam.sisters_count, fam.family_type, fam.family_values, fam.family_location, fam.about_family,
             pr.min_age, pr.max_age, pr.min_height_cm, pr.max_height_cm, pr.preferred_marital_status, pr.preferred_education, pr.preferred_occupation, pr.preferred_denominations, pr.preferred_locations, pr.general_expectations
      FROM profiles p
      LEFT JOIN faith_information f ON f.profile_id = p.id
      LEFT JOIN family_information fam ON fam.profile_id = p.id
      LEFT JOIN marriage_preferences pr ON pr.profile_id = p.id
      WHERE p.user_id = ?
    `, [userId]);

    const u = users[0];
    res.json({
      success: true,
      user: {
        id: u.id,
        email: u.email,
        role: u.role,
        is_verified: Boolean(u.is_verified),
        membership_tier: u.membership_tier || 'FREE',
        is_membership_active: Boolean(u.is_membership_active || (u.membership_tier && u.membership_tier !== 'FREE')),
        connect_credits: u.connect_credits || 0
      },
      profile: profiles.length > 0 ? sanitizeProfileForPublic(profiles[0], users[0]) : null
    });
  } catch (err) {
    next(err);
  }
};
