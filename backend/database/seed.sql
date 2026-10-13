-- =====================================================================
-- The Open Door Church, Khojewala - Christian Matrimonial Platform
-- Curated Seed Data: Muskan, Kamal, Joshua, Grace + Church Admins
-- Default Password for all seed accounts: Password@123
-- =====================================================================

USE `tod_matrimony`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SITE SETTINGS (CMS)
INSERT INTO `site_settings` (`key_name`, `key_value`, `category`, `description`) VALUES
('site_name', 'Open Door Matrimony', 'GENERAL', 'Public website name'),
('site_tagline', 'Faith. Family. Forever.', 'GENERAL', 'Website subtitle & motto'),
('church_name', 'The Open Door Church', 'CHURCH', 'Parent Church Name'),
('church_location', 'Khojewala, Kapurthala - Jalandhar Road, Punjab, India', 'CHURCH', 'Church main campus location'),
('church_website', 'https://theopendoorchurch.org', 'CHURCH', 'Official church website url'),
('contact_email', 'matrimony@theopendoorchurch.org', 'CONTACT', 'Official marriage bureau email'),
('contact_phone', '+91 98765 43210', 'CONTACT', 'Helpdesk phone number'),
('office_hours', 'Tuesday - Sunday: 9:00 AM - 5:00 PM (Monday Closed)', 'CONTACT', 'Bureau office operational hours'),
('hero_heading', 'Find a Life Partner Who Shares Your Faith & Values', 'HOMEPAGE', 'Homepage hero banner heading'),
('hero_subheading', 'A trusted Christian matrimonial community supervised by The Open Door Church, helping individuals and families take a prayerful, guided step toward holy matrimony.', 'HOMEPAGE', 'Hero subtitle text'),
('scripture_verse', '“Therefore what God has joined together, let no one separate.” — Mark 10:9', 'HOMEPAGE', 'Featured biblical marriage verse'),
('privacy_policy_intro', 'At Open Door Matrimony, privacy and family dignity are paramount. Contact numbers and sensitive personal identification remain strictly shielded until mutual interest is confirmed and pastoral introduction is requested.', 'LEGAL', 'Privacy summary');

-- 2. FAQS
INSERT INTO `faqs` (`id`, `question`, `answer`, `category`, `sort_order`) VALUES
('faq-01', 'How does the church verification process work?', 'Every registered profile is manually verified by our church pastoral and administrative committee. We cross-verify submitted details and pastor references before granting the church-verified badge.', 'Verification', 1),
('faq-02', 'Is my phone number and email address visible to the public?', 'No. In alignment with our strict privacy framework, your contact details (phone, email, exact home address) are never displayed publicly. They are only disclosed after mutual interest is established and an introduction is approved.', 'Privacy & Safety', 2),
('faq-03', 'Is this a dating website or a matrimonial bureau?', 'This is strictly a Christian Matrimonial Bureau focused on honorable, family-involved, Christ-centered marriages. We do not support casual dating, unmonitored chat rooms, or unverified browsing.', 'General', 3),
('faq-04', 'What denomination profiles are welcome?', 'While supervised by The Open Door Church, Khojewala, our platform warmly welcomes born-again Christians from various Christian denominations (Evangelical, Pentecostal, CNI, Baptist, Independent, Methodist, etc.) who adhere to biblical Christian faith.', 'Faith & Church', 4),
('faq-05', 'Can parents or guardians register on behalf of their children?', 'Yes. Parents, elder siblings, and pastors can create and manage profiles with the candidate’s full knowledge and consent.', 'Family & Process', 5);

-- 3. SUCCESS STORIES
INSERT INTO `success_stories` (`id`, `couple_names`, `groom_name`, `bride_name`, `marriage_date`, `wedding_photo_url`, `story`, `church_blessing_notes`, `is_published`) VALUES
('story-01', 'Pastor Rohan & Sarah Masih', 'Rohan Masih', 'Sarah Bhatti', '2025-01-18', 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80', 'We both were praying for a spouse dedicated to ministry. Through Open Door Matrimony, our families connected respectfully. With pastoral guidance from The Open Door Church, our marriage was solemnized in January 2025.', 'Solemnized with blessings at The Open Door Church main sanctuary.', TRUE),
('story-02', 'David & Priya Gill', 'David Gill', 'Priya Sahota', '2024-11-12', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', 'Living in Canada, finding someone with rooted Punjabi Christian values was challenging. Open Door Matrimony connected us safely with verified background checks. Today we are joyfully married.', 'Blessed during annual family thanksgiving convention.', TRUE);

-- 4. USERS
-- Password for all accounts: Password@123 ($2a$10$wEkgzJ2kE9WpZ8fXp.xLTu2oM1C.65eXk8uR/vW4PqE8IqYI4c.wK)
INSERT INTO `users` (`id`, `email`, `password_hash`, `mobile_number`, `role`, `status`, `is_verified`) VALUES
('usr-admin-01', 'admin@opendoormatrimony.org', '$2a$10$wEkgzJ2kE9WpZ8fXp.xLTu2oM1C.65eXk8uR/vW4PqE8IqYI4c.wK', '+919876500001', 'SUPER_ADMIN', 'ACTIVE', TRUE),
('usr-kamal-01', 'ankitguraya@gmail.com', '$2a$10$wEkgzJ2kE9WpZ8fXp.xLTu2oM1C.65eXk8uR/vW4PqE8IqYI4c.wK', '+919814012345', 'USER', 'ACTIVE', TRUE),
('usr-muskan-01', 'muskan@gmail.com', '$2a$10$wEkgzJ2kE9WpZ8fXp.xLTu2oM1C.65eXk8uR/vW4PqE8IqYI4c.wK', '+919814054321', 'USER', 'ACTIVE', TRUE),
('usr-joshua-01', 'joshua.masih@example.com', '$2a$10$wEkgzJ2kE9WpZ8fXp.xLTu2oM1C.65eXk8uR/vW4PqE8IqYI4c.wK', '+919811100001', 'USER', 'ACTIVE', TRUE),
('usr-grace-01', 'grace.matthew@example.com', '$2a$10$wEkgzJ2kE9WpZ8fXp.xLTu2oM1C.65eXk8uR/vW4PqE8IqYI4c.wK', '+919822200001', 'USER', 'ACTIVE', TRUE);

-- 5. PROFILES
INSERT INTO `profiles` (`id`, `user_id`, `first_name`, `last_name`, `gender`, `dob`, `height_cm`, `marital_status`, `mother_tongue`, `languages_spoken`, `education_level`, `education_field`, `occupation`, `employed_in`, `annual_income_range`, `city`, `state`, `country`, `about_me`, `profile_photo`, `verification_status`, `completion_percentage`) VALUES
('prof-admin-01', 'usr-admin-01', 'Bureau', 'Director', 'MALE', '1985-05-15', 178, 'NEVER_MARRIED', 'Punjabi', 'Punjabi, English, Hindi', 'Master of Divinity / MBA', 'Theology & Administration', 'Church Administrator', 'MINISTRY_CHURCH', 'Rs. 8 - 10 Lakhs', 'Jalandhar', 'Punjab', 'India', 'Serving as bureau coordinator for The Open Door Church community.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'VERIFIED', 100),
('prof-kamal-01', 'usr-kamal-01', 'Kamal', 'Guraya', 'MALE', '1997-04-18', 178, 'NEVER_MARRIED', 'Punjabi', 'Punjabi, Hindi, English', 'B.Tech IT / Computer Science', 'Information Technology', 'Software Engineer', 'PRIVATE_SECTOR', 'Rs. 15 - 20 Lakhs', 'Jalandhar', 'Punjab', 'India', 'Born-again Christian seeking a sincere, godly partner who loves Christ and family.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'VERIFIED', 100),
('prof-muskan-01', 'usr-muskan-01', 'Muskan', 'Kaur', 'FEMALE', '1999-07-22', 165, 'NEVER_MARRIED', 'Punjabi', 'Punjabi, Hindi, English', 'M.Sc Nursing / Healthcare', 'Medical & Healthcare', 'Healthcare Professional', 'PRIVATE_SECTOR', 'Rs. 10 - 15 Lakhs', 'Kapurthala', 'Punjab', 'India', 'Devoted born-again believer praying for a God-fearing life partner.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', 'VERIFIED', 100),
('prof-joshua-01', 'usr-joshua-01', 'Joshua', 'Masih', 'MALE', '1996-03-12', 178, 'NEVER_MARRIED', 'Punjabi', 'Punjabi, English, Hindi', 'B.Tech / M.S.', 'Computer Science', 'Senior Software Engineer', 'PRIVATE_SECTOR', 'Rs. 18 - 25 Lakhs', 'Jalandhar', 'Punjab', 'India', 'Born-again believer living in Jalandhar. Love worship music and youth mentoring. Seeking a God-fearing Christian life partner.', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', 'VERIFIED', 100),
('prof-grace-01', 'usr-grace-01', 'Grace', 'Matthew', 'FEMALE', '1998-05-14', 165, 'NEVER_MARRIED', 'Punjabi', 'Punjabi, English, Hindi', 'B.Sc / M.Sc Nursing', 'Nursing & Critical Care', 'Senior Staff Nurse', 'HEALTHCARE', 'Rs. 9 - 12 Lakhs', 'Jalandhar', 'Punjab', 'India', 'Dedicated Christian healthcare worker. Active in church choir and Sunday school. Looking for a godly, loving life partner.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'VERIFIED', 100);

-- 6. FAITH INFORMATION
INSERT INTO `faith_information` (`id`, `profile_id`, `church_name`, `denomination`, `is_baptized`, `born_again_year`, `church_involvement`, `ministry_involvement`, `faith_description`, `pastor_reference_name`, `pastor_reference_phone`) VALUES
('faith-kamal', 'prof-kamal-01', 'The Open Door Church, Khojewala', 'Evangelical / Pentecostal', TRUE, 2017, 'Worship and youth ministry', 'Sunday school coordinator', 'Born again believer walking with Christ.', 'Pastor Harpreet Masih', '+919814011111'),
('faith-muskan', 'prof-muskan-01', 'The Open Door Church, Khojewala', 'Evangelical / Pentecostal', TRUE, 2018, 'Choir and prayer fellowship', 'Community medical camp volunteer', 'Walking daily with Jesus Christ.', 'Pastor Harpreet Masih', '+919814011111'),
('faith-joshua', 'prof-joshua-01', 'The Open Door Church, Khojewala', 'Evangelical / Pentecostal', TRUE, 2015, 'Choir and youth outreach', 'Youth mentoring coordinator', 'Saved by grace through faith in Jesus Christ.', 'Pastor Harpreet Masih', '+919814011111'),
('faith-grace', 'prof-grace-01', 'The Open Door Church, Khojewala', 'Evangelical / Pentecostal', TRUE, 2016, 'Hospital medical ministry & choir', 'Sunday school teacher', 'Devoted believer seeking God in all things.', 'Pastor Harpreet Masih', '+919814011111');

-- 7. FAMILY INFORMATION
INSERT INTO `family_information` (`id`, `profile_id`, `father_occupation`, `mother_occupation`, `brothers_count`, `sisters_count`, `family_type`, `family_values`, `family_location`, `about_family`) VALUES
('fam-kamal', 'prof-kamal-01', 'Govt Service (Retd)', 'Homemaker', 1, 0, 'NUCLEAR', 'TRADITIONAL_CHRISTIAN', 'Jalandhar, Punjab', 'God-fearing Punjabi Christian family.'),
('fam-muskan', 'prof-muskan-01', 'Business', 'Homemaker', 0, 1, 'NUCLEAR', 'TRADITIONAL_CHRISTIAN', 'Kapurthala, Punjab', 'Respectful Christian family rooted in faith.'),
('fam-joshua', 'prof-joshua-01', 'Senior Officer (Retd)', 'Homemaker', 1, 0, 'NUCLEAR', 'TRADITIONAL_CHRISTIAN', 'Jalandhar, Punjab', 'Respected, prayerful Christian family dedicated to church community.'),
('fam-grace', 'prof-grace-01', 'Education Officer (Retd)', 'Teacher', 0, 1, 'NUCLEAR', 'TRADITIONAL_CHRISTIAN', 'Jalandhar, Punjab', 'Educated and faith-centered Christian household.');

-- 8. MARRIAGE PREFERENCES
INSERT INTO `marriage_preferences` (`id`, `profile_id`, `min_age`, `max_age`, `min_height_cm`, `max_height_cm`, `preferred_marital_status`, `preferred_education`, `preferred_occupation`, `preferred_denominations`, `preferred_locations`, `general_expectations`) VALUES
('pref-kamal', 'prof-kamal-01', 21, 28, 155, 175, 'NEVER_MARRIED', 'Graduate / Post Graduate', 'Healthcare / Education / IT', 'Evangelical, Pentecostal, CNI', 'Punjab, Chandigarh, NRI', 'Seeking a sincere believer with love for the Lord.'),
('pref-muskan', 'prof-muskan-01', 24, 32, 170, 185, 'NEVER_MARRIED', 'Graduate / Post Graduate', 'Software Engineer / Professional / Business', 'Evangelical, Pentecostal, CNI', 'Punjab, Chandigarh, NRI', 'Looking for a Christ-centered brother in faith.'),
('pref-joshua', 'prof-joshua-01', 22, 30, 155, 175, 'NEVER_MARRIED', 'Graduate / Post Graduate', 'Healthcare / Professional', 'Evangelical, Pentecostal, CNI', 'Punjab, Chandigarh, Abroad', 'Seeking a sincere Christian sister with loving family values.'),
('pref-grace', 'prof-grace-01', 25, 33, 172, 188, 'NEVER_MARRIED', 'Professional / Graduate / Engineer', 'Software Engineer / Professional', 'Evangelical, Pentecostal, CNI', 'Punjab, Chandigarh, Abroad', 'Looking for a godly life companion with prayerful character.');

-- 9. SAMPLE INTERESTS
INSERT INTO `interests` (`id`, `sender_id`, `receiver_id`, `status`, `message`, `introduction_requested`) VALUES
('int-01', 'usr-kamal-01', 'usr-muskan-01', 'ACCEPTED', 'Praise the Lord Muskan. I have reviewed your profile and would be blessed to connect through pastoral facilitation.', TRUE),
('int-02', 'usr-joshua-01', 'usr-grace-01', 'ACCEPTED', 'Praise the Lord Grace. I read your profile and felt led in prayer to connect.', TRUE);

SET FOREIGN_KEY_CHECKS = 1;
