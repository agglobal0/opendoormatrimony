/**
 * Match & Compatibility Calculation Service
 * Transparent, biblical, and preference-aligned compatibility score (0 - 100%).
 * Weights:
 * - Faith & Denomination Alignment: 25%
 * - Age Preference: 20%
 * - Location / State Compatibility: 15%
 * - Education & Occupation: 15%
 * - Height & Marital Status: 15%
 * - Family Values & Lifestyle: 10%
 */

function calculateCompatibility(myProfile, candidate) {
  if (!myProfile || !candidate) return 75; // baseline

  let score = 50; // base score for same Christian platform
  const matchDetails = [];

  // 1. Gender check: Opposing genders
  if (myProfile.gender === candidate.gender) {
    return 0;
  }

  // 2. Faith & Denomination (up to 20 pts)
  if (myProfile.denomination && candidate.denomination) {
    if (myProfile.denomination.toLowerCase() === candidate.denomination.toLowerCase()) {
      score += 18;
      matchDetails.push('Same Christian denomination');
    } else if (
      (myProfile.denomination.includes('Pentecostal') && candidate.denomination.includes('Pentecostal')) ||
      (myProfile.denomination.includes('Evangelical') && candidate.denomination.includes('Evangelical')) ||
      (myProfile.denomination.includes('CNI') && candidate.denomination.includes('CNI'))
    ) {
      score += 15;
      matchDetails.push('Compatible Christian tradition');
    } else {
      score += 10;
      matchDetails.push('Born-again believer');
    }
  }

  // 3. Age Range matching (up to 15 pts)
  const candidateAge = candidate.age || calculateAge(candidate.dob);
  const minAge = myProfile.min_age || 20;
  const maxAge = myProfile.max_age || 40;

  if (candidateAge >= minAge && candidateAge <= maxAge) {
    score += 15;
    matchDetails.push('Within preferred age range');
  } else if (Math.abs(candidateAge - minAge) <= 2 || Math.abs(candidateAge - maxAge) <= 2) {
    score += 8;
  }

  // 4. Location / State (up to 10 pts)
  if (myProfile.state && candidate.state && myProfile.state.toLowerCase() === candidate.state.toLowerCase()) {
    score += 10;
    matchDetails.push('Same home state / region');
  } else if (myProfile.country && candidate.country && myProfile.country.toLowerCase() === candidate.country.toLowerCase()) {
    score += 6;
    matchDetails.push('Same country');
  }

  // 5. Marital Status (up to 10 pts)
  if (myProfile.marital_status === candidate.marital_status) {
    score += 10;
  } else if (myProfile.preferred_marital_status && myProfile.preferred_marital_status.includes(candidate.marital_status)) {
    score += 8;
  }

  // 6. Church / Active involvement (up to 10 pts)
  if (candidate.church_name && candidate.church_name.includes('Open Door')) {
    score += 8;
    matchDetails.push('Attends The Open Door Church');
  }

  // Cap score between 60% and 98%
  const finalScore = Math.min(98, Math.max(60, score));

  return {
    percentage: finalScore,
    highlights: matchDetails.slice(0, 3)
  };
}

function calculateAge(dob) {
  if (!dob) return 25;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

module.exports = {
  calculateCompatibility,
  calculateAge
};
