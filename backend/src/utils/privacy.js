/**
 * Privacy & Data Protection Masking Helper
 * Strict Christian matrimonial privacy model:
 * Phone, Email, exact address, family contacts are NEVER shown publicly.
 * Only revealed if:
 * 1. Mutual interest is ACCEPTED and user requested contact, OR
 * 2. Current viewing user is ADMIN/SUPER_ADMIN, OR
 * 3. User is viewing their own profile.
 */

function sanitizeProfileForPublic(profile, viewer = null, hasMutualInterest = false) {
  if (!profile) return null;

  const isSelf = viewer && viewer.id === profile.user_id;
  const isAdmin = viewer && (viewer.role === 'ADMIN' || viewer.role === 'SUPER_ADMIN');
  const canViewContact = isSelf || isAdmin || hasMutualInterest;

  // Calculate age from dob
  let age = null;
  if (profile.dob) {
    const birthDate = new Date(profile.dob);
    const today = new Date();
    age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  }

  const sanitized = {
    id: profile.id,
    user_id: profile.user_id,
    first_name: profile.first_name,
    last_name: canViewContact ? profile.last_name : `${profile.last_name ? profile.last_name[0] : ''}.`,
    gender: profile.gender,
    age: age,
    dob: isSelf || isAdmin ? profile.dob : undefined,
    height_cm: profile.height_cm,
    marital_status: profile.marital_status,
    mother_tongue: profile.mother_tongue,
    languages_spoken: profile.languages_spoken,
    education_level: profile.education_level,
    education_field: profile.education_field,
    occupation: profile.occupation,
    employed_in: profile.employed_in,
    annual_income_range: profile.annual_income_range,
    city: profile.city,
    state: profile.state,
    country: profile.country,
    about_me: profile.about_me,
    profile_photo: profile.profile_photo,
    verification_status: profile.verification_status,
    completion_percentage: profile.completion_percentage,
    created_at: profile.created_at,

    // Faith
    church_name: profile.church_name,
    denomination: profile.denomination,
    is_baptized: profile.is_baptized,
    born_again_year: profile.born_again_year,
    church_involvement: profile.church_involvement,
    ministry_involvement: profile.ministry_involvement,
    faith_description: profile.faith_description,

    // Family
    family_type: profile.family_type,
    family_values: profile.family_values,
    family_location: profile.family_location,
    about_family: profile.about_family,
    father_occupation: profile.father_occupation,
    mother_occupation: profile.mother_occupation,
    brothers_count: profile.brothers_count,
    sisters_count: profile.sisters_count,

    // Preferences
    min_age: profile.min_age,
    max_age: profile.max_age,
    min_height_cm: profile.min_height_cm,
    max_height_cm: profile.max_height_cm,
    preferred_marital_status: profile.preferred_marital_status,
    preferred_education: profile.preferred_education,
    preferred_occupation: profile.preferred_occupation,
    preferred_denominations: profile.preferred_denominations,
    preferred_locations: profile.preferred_locations,
    general_expectations: profile.general_expectations
  };

  if (canViewContact) {
    sanitized.email = profile.user_email || profile.email;
    sanitized.mobile_number = profile.user_phone || profile.mobile_number;
    sanitized.pastor_reference_name = profile.pastor_reference_name;
    sanitized.pastor_reference_phone = profile.pastor_reference_phone;
  } else {
    sanitized.email = '[Hidden for Privacy]';
    sanitized.mobile_number = '[Available upon Mutual Interest]';
    sanitized.pastor_reference_name = '[Verified by Church Bureau]';
    sanitized.pastor_reference_phone = undefined;
  }

  return sanitized;
}

module.exports = {
  sanitizeProfileForPublic
};
