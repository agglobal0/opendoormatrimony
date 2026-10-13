/**
 * Integrated Relational Database Engine & In-Memory Store
 * Filtered to exact requested Christian member profiles:
 * 1. Kamal Guraya (Male) - ankitguraya@gmail.com
 * 2. Muskan Kaur (Female) - muskan@gmail.com
 * 3. Joshua Masih (Male) - joshua.masih@example.com
 * 4. Grace Matthew (Female) - grace.matthew@example.com
 * Plus Church Super Admin (admin@opendoormatrimony.org)
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// In-Memory tables structure
const tables = {
  users: [],
  profiles: [],
  faith_information: [],
  family_information: [],
  marriage_preferences: [],
  interests: [],
  saved_profiles: [],
  blocked_profiles: [],
  reports: [],
  notifications: [],
  contact_requests: [],
  success_stories: [],
  site_settings: [],
  admin_audit_logs: [],
  faqs: []
};

// Populate default store
function initMemoryStore() {
  const hashedPassword = bcrypt.hashSync('Password@123', 10);

  // Settings
  tables.site_settings = [
    { key_name: 'site_name', key_value: 'Open Door Matrimony', category: 'GENERAL', description: 'Public website name' },
    { key_name: 'site_tagline', key_value: 'Faith. Family. Forever.', category: 'GENERAL', description: 'Website subtitle & motto' },
    { key_name: 'church_name', key_value: 'The Open Door Church', category: 'CHURCH', description: 'Parent Church Name' },
    { key_name: 'church_location', key_value: 'Khojewala, Kapurthala - Jalandhar Road, Punjab, India', category: 'CHURCH', description: 'Church main campus location' },
    { key_name: 'church_website', key_value: 'https://theopendoorchurch.org', category: 'CHURCH', description: 'Official church website url' },
    { key_name: 'contact_email', key_value: 'matrimony@theopendoorchurch.org', category: 'CONTACT', description: 'Official marriage bureau email' },
    { key_name: 'contact_phone', key_value: '+91 98765 43210', category: 'CONTACT', description: 'Helpdesk phone number' },
    { key_name: 'office_hours', key_value: 'Tuesday - Sunday: 9:00 AM - 5:00 PM (Monday Closed)', category: 'CONTACT', description: 'Bureau office operational hours' },
    { key_name: 'hero_heading', key_value: 'Find a Life Partner Who Shares Your Faith & Values', category: 'HOMEPAGE', description: 'Homepage hero banner heading' },
    { key_name: 'hero_subheading', key_value: 'A trusted Christian matrimonial community supervised by The Open Door Church, helping individuals and families take a prayerful, guided step toward holy matrimony.', category: 'HOMEPAGE', description: 'Hero subtitle text' },
    { key_name: 'scripture_verse', key_value: '“Therefore what God has joined together, let no one separate.” — Mark 10:9', category: 'HOMEPAGE', description: 'Featured biblical marriage verse' },
    { key_name: 'privacy_policy_intro', key_value: 'At Open Door Matrimony, privacy and family dignity are paramount. Contact numbers and sensitive personal identification remain strictly shielded until mutual interest is confirmed and pastoral introduction is requested.', category: 'LEGAL', description: 'Privacy summary' }
  ];

  // FAQs
  tables.faqs = [
    { id: 'faq-01', question: 'How does the church verification process work?', answer: 'Every registered profile is manually verified by our church pastoral and administrative committee. We cross-verify submitted details and pastor references before granting the church-verified badge.', category: 'Verification', sort_order: 1, is_active: true },
    { id: 'faq-02', question: 'Is my phone number and email address visible to the public?', answer: 'No. In alignment with our strict privacy framework, your contact details (phone, email, exact home address) are never displayed publicly. They are only disclosed after mutual interest is established and an introduction is approved.', category: 'Privacy & Safety', sort_order: 2, is_active: true },
    { id: 'faq-03', question: 'Is this a dating website or a matrimonial bureau?', answer: 'This is strictly a Christian Matrimonial Bureau focused on honorable, family-involved, Christ-centered marriages. We do not support casual dating, unmonitored chat rooms, or unverified browsing.', category: 'General', sort_order: 3, is_active: true },
    { id: 'faq-04', question: 'What denomination profiles are welcome?', answer: 'While supervised by The Open Door Church, Khojewala, our platform warmly welcomes born-again Christians from various Christian denominations (Evangelical, Pentecostal, CNI, Baptist, Independent, Methodist, etc.) who adhere to biblical Christian faith.', category: 'Faith & Church', sort_order: 4, is_active: true },
    { id: 'faq-05', question: 'Can parents or guardians register on behalf of their children?', answer: 'Yes. Parents, elder siblings, and pastors can create and manage profiles with the candidate’s full knowledge and consent.', category: 'Family & Process', sort_order: 5, is_active: true }
  ];

  // Success Stories
  tables.success_stories = [
    { id: 'story-01', couple_names: 'Pastor Rohan & Sarah Masih', groom_name: 'Rohan Masih', bride_name: 'Sarah Bhatti', marriage_date: '2025-01-18', wedding_photo_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', story: 'We both were praying for a spouse dedicated to ministry. Through Open Door Matrimony, our families connected respectfully. With pastoral guidance from The Open Door Church, our marriage was solemnized in January 2025.', church_blessing_notes: 'Solemnized with blessings at The Open Door Church main sanctuary.', is_published: true, created_at: new Date('2025-01-20') },
    { id: 'story-02', couple_names: 'David & Priya Gill', groom_name: 'David Gill', bride_name: 'Priya Sahota', marriage_date: '2024-11-12', wedding_photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', story: 'Living in Canada, finding someone with rooted Punjabi Christian values was challenging. Open Door Matrimony connected us safely with verified background checks. Today we are joyfully married.', church_blessing_notes: 'Blessed during annual family thanksgiving convention.', is_published: true, created_at: new Date('2024-11-15') }
  ];

  // 1. ADMINS
  tables.users = [
    { id: 'usr-admin-01', email: 'admin@opendoormatrimony.org', password_hash: hashedPassword, mobile_number: '+919876500001', role: 'SUPER_ADMIN', status: 'ACTIVE', is_verified: true, membership_tier: 'COVENANT_GOLD', connect_credits: 999, is_membership_active: true, created_at: new Date('2024-01-01') },
    
    // 2. KAMAL GURAYA
    { id: 'usr-kamal-01', email: 'ankitguraya@gmail.com', password_hash: hashedPassword, mobile_number: '+919814012345', role: 'USER', status: 'ACTIVE', is_verified: true, membership_tier: 'FREE', connect_credits: 0, is_membership_active: false, created_at: new Date('2024-02-01') },
    
    // 3. MUSKAN KAUR
    { id: 'usr-muskan-01', email: 'muskan@gmail.com', password_hash: hashedPassword, mobile_number: '+919814054321', role: 'USER', status: 'ACTIVE', is_verified: true, membership_tier: 'FREE', connect_credits: 0, is_membership_active: false, created_at: new Date('2024-02-01') },
    
    // 4. JOSHUA MASIH
    { id: 'usr-joshua-01', email: 'joshua.masih@example.com', password_hash: hashedPassword, mobile_number: '+919811100001', role: 'USER', status: 'ACTIVE', is_verified: true, membership_tier: 'COVENANT_GOLD', connect_credits: 20, is_membership_active: true, created_at: new Date('2024-02-01') },
    
    // 5. GRACE MATTHEW
    { id: 'usr-grace-01', email: 'grace.matthew@example.com', password_hash: hashedPassword, mobile_number: '+919822200001', role: 'USER', status: 'ACTIVE', is_verified: true, membership_tier: 'BLESSED_SILVER', connect_credits: 10, is_membership_active: true, created_at: new Date('2024-02-01') },

    // 6. ROHAN MASIH
    { id: 'usr-rohan-01', email: 'rohan@gmail.com', password_hash: hashedPassword, mobile_number: '+919814099999', role: 'USER', status: 'ACTIVE', is_verified: true, membership_tier: 'FREE', connect_credits: 0, is_membership_active: false, created_at: new Date('2024-02-01') }
  ];

  // Profiles (Only the 4 requested candidate profiles)
  tables.profiles = [
    {
      id: 'prof-kamal-01',
      user_id: 'usr-kamal-01',
      first_name: 'Kamal',
      last_name: 'Guraya',
      gender: 'MALE',
      dob: '1997-04-18',
      height_cm: 178,
      marital_status: 'NEVER_MARRIED',
      mother_tongue: 'Punjabi',
      languages_spoken: 'Punjabi, Hindi, English',
      education_level: 'B.Tech IT / Computer Science',
      education_field: 'Information Technology',
      occupation: 'Software Engineer',
      employed_in: 'PRIVATE_SECTOR',
      annual_income_range: 'Rs. 15 - 20 Lakhs',
      city: 'Jalandhar',
      state: 'Punjab',
      country: 'India',
      about_me: 'Born-again Christian seeking a sincere, godly partner who loves Christ and family.',
      profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      verification_status: 'VERIFIED',
      completion_percentage: 100,
      privacy_contact: 'MUTUAL_INTEREST_ONLY',
      privacy_photo: 'REGISTERED_ONLY',
      created_at: new Date('2024-02-01')
    },
    {
      id: 'prof-muskan-01',
      user_id: 'usr-muskan-01',
      first_name: 'Muskan',
      last_name: 'Kaur',
      gender: 'FEMALE',
      dob: '1999-07-22',
      height_cm: 165,
      marital_status: 'NEVER_MARRIED',
      mother_tongue: 'Punjabi',
      languages_spoken: 'Punjabi, Hindi, English',
      education_level: 'M.Sc Nursing / Healthcare',
      education_field: 'Medical & Healthcare',
      occupation: 'Healthcare Professional',
      employed_in: 'PRIVATE_SECTOR',
      annual_income_range: 'Rs. 10 - 15 Lakhs',
      city: 'Kapurthala',
      state: 'Punjab',
      country: 'India',
      about_me: 'Devoted born-again believer praying for a God-fearing life partner.',
      profile_photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      verification_status: 'VERIFIED',
      completion_percentage: 100,
      privacy_contact: 'MUTUAL_INTEREST_ONLY',
      privacy_photo: 'REGISTERED_ONLY',
      created_at: new Date('2024-02-01')
    },
    {
      id: 'prof-joshua-01',
      user_id: 'usr-joshua-01',
      first_name: 'Joshua',
      last_name: 'Masih',
      gender: 'MALE',
      dob: '1996-03-12',
      height_cm: 178,
      marital_status: 'NEVER_MARRIED',
      mother_tongue: 'Punjabi',
      languages_spoken: 'Punjabi, English, Hindi',
      education_level: 'B.Tech / M.S.',
      education_field: 'Computer Science',
      occupation: 'Senior Software Engineer',
      employed_in: 'PRIVATE_SECTOR',
      annual_income_range: 'Rs. 18 - 25 Lakhs',
      city: 'Jalandhar',
      state: 'Punjab',
      country: 'India',
      about_me: 'Born-again believer living in Jalandhar. Love worship music and youth mentoring. Seeking a God-fearing Christian life partner.',
      profile_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      verification_status: 'VERIFIED',
      completion_percentage: 100,
      privacy_contact: 'MUTUAL_INTEREST_ONLY',
      privacy_photo: 'REGISTERED_ONLY',
      created_at: new Date('2024-02-01')
    },
    {
      id: 'prof-grace-01',
      user_id: 'usr-grace-01',
      first_name: 'Grace',
      last_name: 'Matthew',
      gender: 'FEMALE',
      dob: '1998-05-14',
      height_cm: 165,
      marital_status: 'NEVER_MARRIED',
      mother_tongue: 'Punjabi',
      languages_spoken: 'Punjabi, English, Hindi',
      education_level: 'B.Sc / M.Sc Nursing',
      education_field: 'Nursing & Critical Care',
      occupation: 'Senior Staff Nurse',
      employed_in: 'HEALTHCARE',
      annual_income_range: 'Rs. 9 - 12 Lakhs',
      city: 'Jalandhar',
      state: 'Punjab',
      country: 'India',
      about_me: 'Dedicated Christian healthcare worker. Active in church choir and Sunday school. Looking for a godly, loving life partner.',
      profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      verification_status: 'VERIFIED',
      completion_percentage: 100,
      privacy_contact: 'MUTUAL_INTEREST_ONLY',
      privacy_photo: 'REGISTERED_ONLY',
      created_at: new Date('2024-02-01')
    },
    {
      id: 'prof-rohan-01',
      user_id: 'usr-rohan-01',
      first_name: 'Rohan',
      last_name: 'Masih',
      gender: 'MALE',
      dob: '1996-08-20',
      height_cm: 180,
      marital_status: 'NEVER_MARRIED',
      mother_tongue: 'Punjabi',
      languages_spoken: 'Punjabi, Hindi, English',
      education_level: 'B.Tech IT / Computer Science',
      education_field: 'Information Technology',
      occupation: 'Software Engineer',
      employed_in: 'PRIVATE_SECTOR',
      annual_income_range: 'Rs. 16 - 22 Lakhs',
      city: 'Jalandhar',
      state: 'Punjab',
      country: 'India',
      about_me: 'Devoted born-again believer, active in church youth ministry. Seeking a God-fearing Christian life partner.',
      profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      verification_status: 'VERIFIED',
      completion_percentage: 100,
      privacy_contact: 'MUTUAL_INTEREST_ONLY',
      privacy_photo: 'REGISTERED_ONLY',
      created_at: new Date('2024-02-01')
    }
  ];

  // Faith Information
  tables.faith_information = [
    {
      id: 'faith-kamal',
      profile_id: 'prof-kamal-01',
      church_name: 'The Open Door Church, Khojewala',
      denomination: 'Evangelical / Pentecostal',
      is_baptized: true,
      born_again_year: 2017,
      church_involvement: 'Worship and youth ministry',
      ministry_involvement: 'Sunday school coordinator',
      faith_description: 'Born again believer walking with Christ.',
      pastor_reference_name: 'Pastor Harpreet Masih',
      pastor_reference_phone: '+919814011111'
    },
    {
      id: 'faith-muskan',
      profile_id: 'prof-muskan-01',
      church_name: 'The Open Door Church, Khojewala',
      denomination: 'Evangelical / Pentecostal',
      is_baptized: true,
      born_again_year: 2018,
      church_involvement: 'Choir and prayer fellowship',
      ministry_involvement: 'Community medical camp volunteer',
      faith_description: 'Walking daily with Jesus Christ.',
      pastor_reference_name: 'Pastor Harpreet Masih',
      pastor_reference_phone: '+919814011111'
    },
    {
      id: 'faith-joshua',
      profile_id: 'prof-joshua-01',
      church_name: 'The Open Door Church, Khojewala',
      denomination: 'Evangelical / Pentecostal',
      is_baptized: true,
      born_again_year: 2015,
      church_involvement: 'Choir and youth outreach',
      ministry_involvement: 'Youth mentoring coordinator',
      faith_description: 'Saved by grace through faith in Jesus Christ.',
      pastor_reference_name: 'Pastor Harpreet Masih',
      pastor_reference_phone: '+919814011111'
    },
    {
      id: 'faith-grace',
      profile_id: 'prof-grace-01',
      church_name: 'The Open Door Church, Khojewala',
      denomination: 'Evangelical / Pentecostal',
      is_baptized: true,
      born_again_year: 2016,
      church_involvement: 'Hospital medical ministry & choir',
      ministry_involvement: 'Sunday school teacher',
      faith_description: 'Devoted believer seeking God in all things.',
      pastor_reference_name: 'Pastor Harpreet Masih',
      pastor_reference_phone: '+919814011111'
    },
    {
      id: 'faith-rohan',
      profile_id: 'prof-rohan-01',
      church_name: 'The Open Door Church, Khojewala',
      denomination: 'Evangelical / Pentecostal',
      is_baptized: true,
      born_again_year: 2016,
      church_involvement: 'Worship team & youth mentor',
      ministry_involvement: 'Youth ministry leader',
      faith_description: 'Walking faithfully with Jesus Christ as personal Lord and Savior.',
      pastor_reference_name: 'Pastor Harpreet Masih',
      pastor_reference_phone: '+919814011111'
    }
  ];

  // Family Information
  tables.family_information = [
    {
      id: 'fam-kamal',
      profile_id: 'prof-kamal-01',
      father_occupation: 'Govt Service (Retd)',
      mother_occupation: 'Homemaker',
      brothers_count: 1,
      sisters_count: 0,
      family_type: 'NUCLEAR',
      family_values: 'TRADITIONAL_CHRISTIAN',
      family_location: 'Jalandhar, Punjab',
      about_family: 'God-fearing Punjabi Christian family.'
    },
    {
      id: 'fam-muskan',
      profile_id: 'prof-muskan-01',
      father_occupation: 'Business',
      mother_occupation: 'Homemaker',
      brothers_count: 0,
      sisters_count: 1,
      family_type: 'NUCLEAR',
      family_values: 'TRADITIONAL_CHRISTIAN',
      family_location: 'Kapurthala, Punjab',
      about_family: 'Respectful Christian family rooted in faith.'
    },
    {
      id: 'fam-joshua',
      profile_id: 'prof-joshua-01',
      father_occupation: 'Senior Officer (Retd)',
      mother_occupation: 'Homemaker',
      brothers_count: 1,
      sisters_count: 0,
      family_type: 'NUCLEAR',
      family_values: 'TRADITIONAL_CHRISTIAN',
      family_location: 'Jalandhar, Punjab',
      about_family: 'Respected, prayerful Christian family dedicated to church community.'
    },
    {
      id: 'fam-grace',
      profile_id: 'prof-grace-01',
      father_occupation: 'Education Officer (Retd)',
      mother_occupation: 'Teacher',
      brothers_count: 0,
      sisters_count: 1,
      family_type: 'NUCLEAR',
      family_values: 'TRADITIONAL_CHRISTIAN',
      family_location: 'Jalandhar, Punjab',
      about_family: 'Educated and faith-centered Christian household.'
    },
    {
      id: 'fam-rohan',
      profile_id: 'prof-rohan-01',
      father_occupation: 'Senior Engineer (Retd)',
      mother_occupation: 'Teacher',
      brothers_count: 1,
      sisters_count: 0,
      family_type: 'NUCLEAR',
      family_values: 'TRADITIONAL_CHRISTIAN',
      family_location: 'Jalandhar, Punjab',
      about_family: 'Respectful Christian family deeply grounded in faith.'
    }
  ];

  // Marriage Preferences
  tables.marriage_preferences = [
    {
      id: 'pref-kamal',
      profile_id: 'prof-kamal-01',
      min_age: 21,
      max_age: 28,
      min_height_cm: 155,
      max_height_cm: 175,
      preferred_marital_status: 'NEVER_MARRIED',
      preferred_education: 'Graduate / Post Graduate',
      preferred_occupation: 'Healthcare / Education / IT',
      preferred_denominations: 'Evangelical, Pentecostal, CNI',
      preferred_locations: 'Punjab, Chandigarh, NRI',
      general_expectations: 'Seeking a sincere believer with love for the Lord.'
    },
    {
      id: 'pref-muskan',
      profile_id: 'prof-muskan-01',
      min_age: 24,
      max_age: 32,
      min_height_cm: 170,
      max_height_cm: 185,
      preferred_marital_status: 'NEVER_MARRIED',
      preferred_education: 'Graduate / Post Graduate',
      preferred_occupation: 'Software Engineer / Professional / Business',
      preferred_denominations: 'Evangelical, Pentecostal, CNI',
      preferred_locations: 'Punjab, Chandigarh, NRI',
      general_expectations: 'Looking for a Christ-centered brother in faith.'
    },
    {
      id: 'pref-joshua',
      profile_id: 'prof-joshua-01',
      min_age: 22,
      max_age: 30,
      min_height_cm: 155,
      max_height_cm: 175,
      preferred_marital_status: 'NEVER_MARRIED',
      preferred_education: 'Graduate / Post Graduate',
      preferred_occupation: 'Healthcare / Professional',
      preferred_denominations: 'Evangelical, Pentecostal, CNI',
      preferred_locations: 'Punjab, Chandigarh, Abroad',
      general_expectations: 'Seeking a sincere Christian sister with loving family values.'
    },
    {
      id: 'pref-grace',
      profile_id: 'prof-grace-01',
      min_age: 25,
      max_age: 33,
      min_height_cm: 172,
      max_height_cm: 188,
      preferred_marital_status: 'NEVER_MARRIED',
      preferred_education: 'Professional / Graduate / Engineer',
      preferred_occupation: 'Software Engineer / Professional',
      preferred_denominations: 'Evangelical, Pentecostal, CNI',
      preferred_locations: 'Punjab, Chandigarh, Abroad',
      general_expectations: 'Looking for a godly life companion with prayerful character.'
    },
    {
      id: 'pref-rohan',
      profile_id: 'prof-rohan-01',
      min_age: 22,
      max_age: 29,
      min_height_cm: 155,
      max_height_cm: 175,
      preferred_marital_status: 'NEVER_MARRIED',
      preferred_education: 'Graduate / Post Graduate',
      preferred_occupation: 'Healthcare / Education / IT',
      preferred_denominations: 'Evangelical, Pentecostal, CNI',
      preferred_locations: 'Punjab, Chandigarh, NRI',
      general_expectations: 'Looking for a God-fearing sister with loving Christian character.'
    }
  ];

  // Seed sample interests between these profiles
  tables.interests = [
    {
      id: 'int-01',
      sender_id: 'usr-kamal-01',
      receiver_id: 'usr-muskan-01',
      status: 'ACCEPTED',
      message: 'Praise the Lord Muskan. I have reviewed your profile and would be blessed to connect through pastoral facilitation.',
      introduction_requested: true,
      created_at: new Date('2024-02-10')
    },
    {
      id: 'int-02',
      sender_id: 'usr-joshua-01',
      receiver_id: 'usr-grace-01',
      status: 'ACCEPTED',
      message: 'Praise the Lord Grace. I read your profile and felt led in prayer to connect.',
      introduction_requested: true,
      created_at: new Date('2024-02-12')
    },
    {
      id: 'int-03',
      sender_id: 'usr-rohan-01',
      receiver_id: 'usr-muskan-01',
      status: 'ACCEPTED',
      message: 'Praise the Lord Muskan. I have reviewed your profile and would be honored to connect through the church matrimonial bureau.',
      introduction_requested: false,
      created_at: new Date('2024-02-12')
    }
  ];

  // Seed Notifications
  tables.notifications = [
    {
      id: 'notif-01',
      user_id: 'usr-kamal-01',
      title: 'Mutual Interest Confirmed!',
      message: 'Muskan Kaur accepted your express interest. Pastoral introduction is enabled.',
      type: 'INTEREST_ACCEPTED',
      link_url: '/dashboard/interests',
      is_read: false,
      created_at: new Date('2024-02-11')
    },
    {
      id: 'notif-02',
      user_id: 'usr-muskan-01',
      title: 'New Interest Received',
      message: 'Kamal Guraya expressed interest in your matrimonial profile.',
      type: 'INTEREST_RECEIVED',
      link_url: '/dashboard/interests',
      is_read: true,
      created_at: new Date('2024-02-10')
    }
  ];

  // Seed Saved
  tables.saved_profiles = [
    { id: 'save-01', user_id: 'usr-kamal-01', saved_user_id: 'usr-muskan-01', created_at: new Date() },
    { id: 'save-02', user_id: 'usr-joshua-01', saved_user_id: 'usr-grace-01', created_at: new Date() }
  ];

  tables.reports = [];
}

initMemoryStore();

// Relational Query Processor for seamless local memory execution
async function query(sql, params = []) {
  const cleanSql = sql.trim();
  const lower = cleanSql.toLowerCase();

  // 1. Health check: SELECT 1
  if (lower.startsWith('select 1')) {
    return [[{ val: 1 }], []];
  }

  // 2. Select Settings
  if (lower.includes('from `site_settings`') || lower.includes('from site_settings')) {
    if (lower.includes('where `key_name` = ?') || lower.includes('where key_name = ?')) {
      const match = tables.site_settings.find(s => s.key_name === params[0]);
      return [match ? [match] : [], []];
    }
    return [[...tables.site_settings], []];
  }

  // 3. Select FAQs
  if (lower.includes('from `faqs`') || lower.includes('from faqs')) {
    return [[...tables.faqs], []];
  }

  // 4. Select Success Stories
  if (lower.includes('from `success_stories`') || lower.includes('from success_stories')) {
    return [[...tables.success_stories], []];
  }

  // 5. Select Single User by Email
  if ((lower.includes('from `users`') || lower.includes('from users')) && (lower.includes('where email = ?') || lower.includes('where `email` = ?'))) {
    const user = tables.users.find(u => u.email.toLowerCase() === (params[0] || '').toLowerCase());
    return [user ? [user] : [], []];
  }

  // 6. Select Single User by ID
  if ((lower.includes('from `users`') || lower.includes('from users')) && (lower.includes('where id = ?') || lower.includes('where `id` = ?'))) {
    const user = tables.users.find(u => u.id === params[0]);
    return [user ? [user] : [], []];
  }

  // 7. Full Profile Query (Joined user, profile, faith, family, prefs)
  if (lower.includes('from `profiles`') || lower.includes('from profiles')) {
    const joined = tables.profiles.map(p => {
      const user = tables.users.find(u => u.id === p.user_id) || {};
      const faith = tables.faith_information.find(f => f.profile_id === p.id) || {};
      const family = tables.family_information.find(fam => fam.profile_id === p.id) || {};
      const prefs = tables.marriage_preferences.find(pr => pr.profile_id === p.id) || {};

      return {
        ...p,
        user_email: user.email,
        user_phone: user.mobile_number,
        user_role: user.role,
        user_status: user.status,
        // Faith
        church_name: faith.church_name || '',
        denomination: faith.denomination || '',
        is_baptized: faith.is_baptized !== false,
        born_again_year: faith.born_again_year || null,
        church_involvement: faith.church_involvement || '',
        ministry_involvement: faith.ministry_involvement || '',
        faith_description: faith.faith_description || '',
        pastor_reference_name: faith.pastor_reference_name || '',
        pastor_reference_phone: faith.pastor_reference_phone || '',
        // Family
        father_occupation: family.father_occupation || '',
        mother_occupation: family.mother_occupation || '',
        brothers_count: family.brothers_count || 0,
        sisters_count: family.sisters_count || 0,
        family_type: family.family_type || 'NUCLEAR',
        family_values: family.family_values || 'TRADITIONAL_CHRISTIAN',
        family_location: family.family_location || '',
        about_family: family.about_family || '',
        // Preferences
        min_age: prefs.min_age || 20,
        max_age: prefs.max_age || 35,
        min_height_cm: prefs.min_height_cm || 150,
        max_height_cm: prefs.max_height_cm || 190,
        preferred_marital_status: prefs.preferred_marital_status || 'NEVER_MARRIED',
        preferred_education: prefs.preferred_education || '',
        preferred_occupation: prefs.preferred_occupation || '',
        preferred_denominations: prefs.preferred_denominations || '',
        preferred_locations: prefs.preferred_locations || '',
        general_expectations: prefs.general_expectations || ''
      };
    });

    if (lower.includes('where p.user_id = ?') || lower.includes('where user_id = ?')) {
      const match = joined.find(j => j.user_id === params[0]);
      return [match ? [match] : [], []];
    }
    if (lower.includes('where p.id = ?') || lower.includes('where id = ?')) {
      const match = joined.find(j => j.id === params[0]);
      return [match ? [match] : [], []];
    }

    return [joined, []];
  }

  // 8. Notifications
  if (lower.includes('from `notifications`') || lower.includes('from notifications')) {
    if (lower.includes('where user_id = ?') || lower.includes('where `user_id` = ?')) {
      const userNotifs = tables.notifications.filter(n => n.user_id === params[0]);
      userNotifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return [userNotifs, []];
    }
    return [[...tables.notifications], []];
  }

  // 9. Interests
  if (lower.includes('from `interests`') || lower.includes('from interests')) {
    return [[...tables.interests], []];
  }

  // 10. Saved Profiles
  if (lower.includes('from `saved_profiles`') || lower.includes('from saved_profiles')) {
    if (lower.includes('where user_id = ?') || lower.includes('where `user_id` = ?')) {
      const saved = tables.saved_profiles.filter(s => s.user_id === params[0]);
      return [saved, []];
    }
    return [[...tables.saved_profiles], []];
  }

  // 11. Reports
  if (lower.includes('from `reports`') || lower.includes('from reports')) {
    return [[...tables.reports], []];
  }

  // Fallback for general insert/update/delete
  return [[], []];
}

module.exports = {
  tables,
  query,
  initMemoryStore
};
