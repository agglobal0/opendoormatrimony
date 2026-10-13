const db = require('../config/db');
const { sanitizeProfileForPublic } = require('../utils/privacy');
const { calculateCompatibility } = require('../services/matchService');

exports.discoverMatches = async (req, res, next) => {
  try {
    const viewer = req.user;
    const {
      gender,
      min_age,
      max_age,
      denomination,
      city,
      state,
      country,
      education_level,
      occupation,
      marital_status,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      let myProfile = null;
      let blockedIds = [];

      if (viewer) {
        myProfile = mock.tables.profiles.find(p => p.user_id === viewer.id);
        blockedIds = mock.tables.blocked_profiles
          .filter(b => b.user_id === viewer.id || b.blocked_user_id === viewer.id)
          .map(b => (b.user_id === viewer.id ? b.blocked_user_id : b.user_id));
      }

      // Collect all joined profiles
      let all = mock.tables.profiles.map(p => {
        const user = mock.tables.users.find(u => u.id === p.user_id) || {};
        const faith = mock.tables.faith_information.find(f => f.profile_id === p.id) || {};
        const family = mock.tables.family_information.find(fam => fam.profile_id === p.id) || {};
        const prefs = mock.tables.marriage_preferences.find(pr => pr.profile_id === p.id) || {};

        return {
          ...p,
          user_email: user.email,
          user_phone: user.mobile_number,
          user_role: user.role,
          ...(faith || {}),
          ...(family || {}),
          ...(prefs || {})
        };
      });

      // Exclude admin profiles from candidate pool
      all = all.filter(p => p.user_role !== 'ADMIN' && p.user_role !== 'SUPER_ADMIN');

      // Exclude self and blocked users
      if (viewer) {
        all = all.filter(p => p.user_id !== viewer.id && !blockedIds.includes(p.user_id));
      }

      // Filter by target gender (if specified and not ALL)
      if (gender && gender.toUpperCase() !== 'ALL') {
        const genderFiltered = all.filter(p => p.gender === gender.toUpperCase());
        if (search) {
          const s = search.toLowerCase().trim();
          const hasMatchInGender = genderFiltered.some(p =>
            (p.first_name && p.first_name.toLowerCase().includes(s)) ||
            (p.last_name && p.last_name.toLowerCase().includes(s)) ||
            (p.user_email && p.user_email.toLowerCase().includes(s)) ||
            (p.city && p.city.toLowerCase().includes(s)) ||
            (p.occupation && p.occupation.toLowerCase().includes(s))
          );
          if (hasMatchInGender) {
            all = genderFiltered;
          }
          // If no match in selected gender tab, search across all so the user finds the person they searched for!
        } else {
          all = genderFiltered;
        }
      }

      // Filter by denomination
      if (denomination) {
        all = all.filter(p => p.denomination && p.denomination.toLowerCase().includes(denomination.toLowerCase()));
      }

      // Filter by location
      if (city) {
        all = all.filter(p => p.city && p.city.toLowerCase().includes(city.toLowerCase()));
      }
      if (state) {
        all = all.filter(p => p.state && p.state.toLowerCase().includes(state.toLowerCase()));
      }
      if (country) {
        all = all.filter(p => p.country && p.country.toLowerCase().includes(country.toLowerCase()));
      }

      // Filter by education & occupation
      if (education_level) {
        all = all.filter(p => p.education_level && p.education_level.toLowerCase().includes(education_level.toLowerCase()));
      }
      if (occupation) {
        all = all.filter(p => p.occupation && p.occupation.toLowerCase().includes(occupation.toLowerCase()));
      }
      if (marital_status) {
        all = all.filter(p => p.marital_status === marital_status);
      }

      // Keyword search
      if (search) {
        const s = search.toLowerCase().trim();
        all = all.filter(p =>
          (p.first_name && p.first_name.toLowerCase().includes(s)) ||
          (p.last_name && p.last_name.toLowerCase().includes(s)) ||
          (p.user_email && p.user_email.toLowerCase().includes(s)) ||
          (p.occupation && p.occupation.toLowerCase().includes(s)) ||
          (p.city && p.city.toLowerCase().includes(s)) ||
          (p.church_name && p.church_name.toLowerCase().includes(s)) ||
          (p.education_level && p.education_level.toLowerCase().includes(s))
        );
      }

      // Calculate compatibility and sanitize
      const sanitized = all.map(candidate => {
        const existingInterest = viewer ? mock.tables.interests.find(i => 
          (i.sender_id === viewer.id && i.receiver_id === candidate.user_id) ||
          (i.sender_id === candidate.user_id && i.receiver_id === viewer.id)
        ) : null;

        let interestStatus = null;
        if (existingInterest) {
          if (existingInterest.status === 'ACCEPTED') {
            interestStatus = 'ACCEPTED';
          } else if (existingInterest.sender_id === viewer.id) {
            interestStatus = 'SENT_PENDING';
          } else {
            interestStatus = 'RECEIVED_PENDING';
          }
        }

        const sanitizedItem = sanitizeProfileForPublic(candidate, viewer, interestStatus === 'ACCEPTED');
        const matchInfo = calculateCompatibility(myProfile, candidate);
        return {
          ...sanitizedItem,
          interest_status: interestStatus,
          compatibility_score: matchInfo.percentage,
          compatibility_highlights: matchInfo.highlights
        };
      });

      // Sort: Newest created profiles first (so real registered accounts are at the top), then compatibility
      sanitized.sort((a, b) => {
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        if (timeA !== timeB) return timeB - timeA;
        return (b.compatibility_score || 0) - (a.compatibility_score || 0);
      });

      const total = sanitized.length;
      const startIndex = (pageNum - 1) * limitNum;
      const paginated = sanitized.slice(startIndex, startIndex + limitNum);

      return res.json({
        success: true,
        data: paginated,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    }

    // Standard MySQL discover query
    let myProfile = null;
    if (viewer) {
      const [myProfiles] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [viewer.id]);
      if (myProfiles.length > 0) myProfile = myProfiles[0];
    }

    let queryStr = `
      SELECT p.*, f.church_name, f.denomination, f.is_baptized,
             fam.family_type, fam.family_values, fam.family_location,
             pr.min_age, pr.max_age
      FROM profiles p
      JOIN users u ON u.id = p.user_id AND u.status = 'ACTIVE'
      LEFT JOIN faith_information f ON f.profile_id = p.id
      LEFT JOIN family_information fam ON fam.profile_id = p.id
      LEFT JOIN marriage_preferences pr ON pr.profile_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (viewer) {
      queryStr += ` AND p.user_id != ? `;
      params.push(viewer.id);
    }

    if (gender && gender.toUpperCase() !== 'ALL') {
      queryStr += ` AND p.gender = ? `;
      params.push(gender.toUpperCase());
    }

    if (city) {
      queryStr += ` AND p.city LIKE ? `;
      params.push(`%${city}%`);
    }
    if (denomination) {
      queryStr += ` AND f.denomination LIKE ? `;
      params.push(`%${denomination}%`);
    }

    queryStr += ` ORDER BY p.created_at DESC `;

    const [results] = await db.query(queryStr, params);

    const mapped = (results || []).map(cand => {
      const match = calculateCompatibility(myProfile, cand);
      return {
        ...sanitizeProfileForPublic(cand, viewer, false),
        compatibility_score: match.percentage,
        compatibility_highlights: match.highlights
      };
    });

    res.json({
      success: true,
      data: mapped.slice(0, limitNum),
      pagination: {
        total: mapped.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(mapped.length / limitNum)
      }
    });
  } catch (err) {
    next(err);
  }
};
