const db = require('../config/db');
const { sanitizeProfileForPublic } = require('../utils/privacy');

function calculateCompletion(p, faith, family, prefs) {
  let score = 20; // basic registration
  if (p.height_cm && p.marital_status && p.occupation && p.education_level && p.about_me) score += 20;
  if (faith && faith.church_name && faith.denomination) score += 20;
  if (family && (family.father_occupation || family.mother_occupation || family.family_location)) score += 20;
  if (prefs && (prefs.min_age || prefs.preferred_denominations)) score += 10;
  if (p.profile_photo) score += 10;
  return Math.min(100, score);
}

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      let profile = mock.tables.profiles.find(p => p.user_id === userId);
      if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

      // Update base profile
      Object.assign(profile, {
        first_name: data.first_name || profile.first_name,
        last_name: data.last_name || profile.last_name,
        gender: data.gender || profile.gender,
        dob: data.dob || profile.dob,
        height_cm: data.height_cm !== undefined ? parseInt(data.height_cm, 10) : profile.height_cm,
        marital_status: data.marital_status || profile.marital_status,
        mother_tongue: data.mother_tongue || profile.mother_tongue,
        languages_spoken: data.languages_spoken || profile.languages_spoken,
        education_level: data.education_level || profile.education_level,
        education_field: data.education_field || profile.education_field,
        occupation: data.occupation || profile.occupation,
        employed_in: data.employed_in || profile.employed_in,
        annual_income_range: data.annual_income_range || profile.annual_income_range,
        city: data.city || profile.city,
        state: data.state || profile.state,
        country: data.country || profile.country,
        about_me: data.about_me || profile.about_me,
        profile_photo: data.profile_photo || profile.profile_photo
      });

      // Update faith
      let faith = mock.tables.faith_information.find(f => f.profile_id === profile.id);
      if (faith) {
        Object.assign(faith, {
          church_name: data.church_name || faith.church_name,
          denomination: data.denomination || faith.denomination,
          is_baptized: data.is_baptized !== undefined ? data.is_baptized : faith.is_baptized,
          born_again_year: data.born_again_year || faith.born_again_year,
          church_involvement: data.church_involvement || faith.church_involvement,
          ministry_involvement: data.ministry_involvement || faith.ministry_involvement,
          faith_description: data.faith_description || faith.faith_description,
          pastor_reference_name: data.pastor_reference_name || faith.pastor_reference_name,
          pastor_reference_phone: data.pastor_reference_phone || faith.pastor_reference_phone
        });
      }

      // Update family
      let family = mock.tables.family_information.find(fam => fam.profile_id === profile.id);
      if (family) {
        Object.assign(family, {
          father_occupation: data.father_occupation || family.father_occupation,
          mother_occupation: data.mother_occupation || family.mother_occupation,
          brothers_count: data.brothers_count !== undefined ? parseInt(data.brothers_count, 10) : family.brothers_count,
          sisters_count: data.sisters_count !== undefined ? parseInt(data.sisters_count, 10) : family.sisters_count,
          family_type: data.family_type || family.family_type,
          family_values: data.family_values || family.family_values,
          family_location: data.family_location || family.family_location,
          about_family: data.about_family || family.about_family
        });
      }

      // Update preferences
      let prefs = mock.tables.marriage_preferences.find(pr => pr.profile_id === profile.id);
      if (prefs) {
        Object.assign(prefs, {
          min_age: data.min_age !== undefined ? parseInt(data.min_age, 10) : prefs.min_age,
          max_age: data.max_age !== undefined ? parseInt(data.max_age, 10) : prefs.max_age,
          min_height_cm: data.min_height_cm !== undefined ? parseInt(data.min_height_cm, 10) : prefs.min_height_cm,
          max_height_cm: data.max_height_cm !== undefined ? parseInt(data.max_height_cm, 10) : prefs.max_height_cm,
          preferred_marital_status: data.preferred_marital_status || prefs.preferred_marital_status,
          preferred_education: data.preferred_education || prefs.preferred_education,
          preferred_occupation: data.preferred_occupation || prefs.preferred_occupation,
          preferred_denominations: data.preferred_denominations || prefs.preferred_denominations,
          preferred_locations: data.preferred_locations || prefs.preferred_locations,
          general_expectations: data.general_expectations || prefs.general_expectations
        });
      }

      profile.completion_percentage = calculateCompletion(profile, faith, family, prefs);

      const user = mock.tables.users.find(u => u.id === userId);
      const fullProfile = { ...profile, ...(faith || {}), ...(family || {}), ...(prefs || {}) };

      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        profile: sanitizeProfileForPublic(fullProfile, user)
      });
    }

    // Standard MySQL update flow
    const [profiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [userId]);
    if (!profiles || profiles.length === 0) return res.status(404).json({ success: false, message: 'Profile not found.' });

    const p = profiles[0];
    await db.query(`
      UPDATE profiles
      SET first_name = COALESCE(?, first_name),
          last_name = COALESCE(?, last_name),
          height_cm = COALESCE(?, height_cm),
          marital_status = COALESCE(?, marital_status),
          mother_tongue = COALESCE(?, mother_tongue),
          languages_spoken = COALESCE(?, languages_spoken),
          education_level = COALESCE(?, education_level),
          education_field = COALESCE(?, education_field),
          occupation = COALESCE(?, occupation),
          employed_in = COALESCE(?, employed_in),
          annual_income_range = COALESCE(?, annual_income_range),
          city = COALESCE(?, city),
          state = COALESCE(?, state),
          country = COALESCE(?, country),
          about_me = COALESCE(?, about_me)
      WHERE id = ?
    `, [
      data.first_name, data.last_name, data.height_cm, data.marital_status, data.mother_tongue,
      data.languages_spoken, data.education_level, data.education_field, data.occupation,
      data.employed_in, data.annual_income_range, data.city, data.state, data.country, data.about_me, p.id
    ]);

    await db.query(`
      UPDATE faith_information
      SET church_name = COALESCE(?, church_name),
          denomination = COALESCE(?, denomination),
          is_baptized = COALESCE(?, is_baptized),
          born_again_year = COALESCE(?, born_again_year),
          church_involvement = COALESCE(?, church_involvement),
          ministry_involvement = COALESCE(?, ministry_involvement),
          faith_description = COALESCE(?, faith_description),
          pastor_reference_name = COALESCE(?, pastor_reference_name),
          pastor_reference_phone = COALESCE(?, pastor_reference_phone)
      WHERE profile_id = ?
    `, [
      data.church_name, data.denomination, data.is_baptized, data.born_again_year,
      data.church_involvement, data.ministry_involvement, data.faith_description,
      data.pastor_reference_name, data.pastor_reference_phone, p.id
    ]);

    res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    next(err);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const profile = mock.tables.profiles.find(p => p.user_id === userId);
      if (profile) {
        profile.profile_photo = photoUrl;
        profile.completion_percentage = Math.min(100, profile.completion_percentage + 10);
      }
      return res.json({ success: true, message: 'Profile photo uploaded successfully. Under church review.', photo_url: photoUrl });
    }

    await db.query('UPDATE profiles SET profile_photo = ? WHERE user_id = ?', [photoUrl, userId]);
    res.json({ success: true, message: 'Profile photo uploaded successfully.', photo_url: photoUrl });
  } catch (err) {
    next(err);
  }
};

exports.getProfileById = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const viewer = req.user;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const profile = mock.tables.profiles.find(p => p.user_id === targetUserId || p.id === targetUserId);
      if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });

      const user = mock.tables.users.find(u => u.id === profile.user_id);
      const faith = mock.tables.faith_information.find(f => f.profile_id === profile.id);
      const family = mock.tables.family_information.find(fam => fam.profile_id === profile.id);
      const prefs = mock.tables.marriage_preferences.find(pr => pr.profile_id === profile.id);

      // Check mutual interest
      let hasMutualInterest = false;
      if (viewer) {
        hasMutualInterest = mock.tables.interests.some(
          i => ((i.sender_id === viewer.id && i.receiver_id === profile.user_id) || (i.sender_id === profile.user_id && i.receiver_id === viewer.id)) && i.status === 'ACCEPTED'
        );
      }

      const fullProfile = {
        ...profile,
        user_email: user ? user.email : '',
        user_phone: user ? user.mobile_number : '',
        user_role: user ? user.role : 'USER',
        ...(faith || {}),
        ...(family || {}),
        ...(prefs || {})
      };

      return res.json({
        success: true,
        profile: sanitizeProfileForPublic(fullProfile, viewer, hasMutualInterest)
      });
    }

    const [profiles] = await db.query(`
      SELECT p.*, u.email as user_email, u.mobile_number as user_phone, u.role as user_role,
             f.church_name, f.denomination, f.is_baptized, f.born_again_year, f.church_involvement, f.ministry_involvement, f.faith_description, f.pastor_reference_name, f.pastor_reference_phone,
             fam.father_occupation, fam.mother_occupation, fam.brothers_count, fam.sisters_count, fam.family_type, fam.family_values, fam.family_location, fam.about_family,
             pr.min_age, pr.max_age, pr.min_height_cm, pr.max_height_cm, pr.preferred_marital_status, pr.preferred_education, pr.preferred_occupation, pr.preferred_denominations, pr.preferred_locations, pr.general_expectations
      FROM profiles p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN faith_information f ON f.profile_id = p.id
      LEFT JOIN family_information fam ON fam.profile_id = p.id
      LEFT JOIN marriage_preferences pr ON pr.profile_id = p.id
      WHERE p.user_id = ? OR p.id = ?
    `, [targetUserId, targetUserId]);

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    let hasMutualInterest = false;
    if (viewer) {
      const [interests] = await db.query(`
        SELECT id FROM interests
        WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))
          AND status = 'ACCEPTED'
      `, [viewer.id, profiles[0].user_id, profiles[0].user_id, viewer.id]);
      hasMutualInterest = interests && interests.length > 0;
    }

    res.json({
      success: true,
      profile: sanitizeProfileForPublic(profiles[0], viewer, hasMutualInterest)
    });
  } catch (err) {
    next(err);
  }
};
