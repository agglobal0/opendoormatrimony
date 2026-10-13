-- =====================================================================
-- The Open Door Church, Khojewala - Christian Matrimonial Platform
-- Database Schema (MySQL 8.0+)
-- Database: tod_matrimony
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `tod_matrimony` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `tod_matrimony`;

-- Disable foreign key checks during initialization
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `mobile_number` VARCHAR(30) NOT NULL UNIQUE,
  `role` ENUM('USER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER',
  `status` ENUM('ACTIVE', 'SUSPENDED', 'PENDING_DELETION', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
  `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
  `last_login_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PROFILES TABLE
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('MALE', 'FEMALE') NOT NULL,
  `dob` DATE NOT NULL,
  `height_cm` INT NULL,
  `marital_status` ENUM('NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'AWAITING_DIVORCE') NOT NULL DEFAULT 'NEVER_MARRIED',
  `mother_tongue` VARCHAR(100) NOT NULL DEFAULT 'Punjabi',
  `languages_spoken` VARCHAR(255) NOT NULL DEFAULT 'Punjabi, Hindi, English',
  `education_level` VARCHAR(100) NOT NULL,
  `education_field` VARCHAR(150) NULL,
  `occupation` VARCHAR(150) NOT NULL,
  `employed_in` ENUM('PRIVATE_SECTOR', 'GOVERNMENT', 'BUSINESS', 'SELF_EMPLOYED', 'MINISTRY_CHURCH', 'DEFENCE', 'HEALTHCARE', 'EDUCATION', 'NOT_WORKING') NOT NULL DEFAULT 'PRIVATE_SECTOR',
  `annual_income_range` VARCHAR(100) NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL DEFAULT 'Punjab',
  `country` VARCHAR(100) NOT NULL DEFAULT 'India',
  `about_me` TEXT NULL,
  `profile_photo` VARCHAR(500) NULL,
  `verification_status` ENUM('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'PENDING',
  `verification_notes` TEXT NULL,
  `completion_percentage` INT NOT NULL DEFAULT 20,
  `privacy_contact` ENUM('PUBLIC_VERIFIED', 'MUTUAL_INTEREST_ONLY', 'ADMIN_APPROVAL_ONLY') NOT NULL DEFAULT 'MUTUAL_INTEREST_ONLY',
  `privacy_photo` ENUM('PUBLIC', 'REGISTERED_ONLY', 'VERIFIED_ONLY') NOT NULL DEFAULT 'REGISTERED_ONLY',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_profiles_gender` (`gender`),
  INDEX `idx_profiles_dob` (`dob`),
  INDEX `idx_profiles_city` (`city`),
  INDEX `idx_profiles_verification` (`verification_status`),
  INDEX `idx_profiles_education` (`education_level`),
  INDEX `idx_profiles_occupation` (`occupation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PROFILE PHOTOS TABLE
DROP TABLE IF EXISTS `profile_photos`;
CREATE TABLE `profile_photos` (
  `id` VARCHAR(36) PRIMARY KEY,
  `profile_id` VARCHAR(36) NOT NULL,
  `photo_url` VARCHAR(500) NOT NULL,
  `is_primary` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_approved` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  INDEX `idx_photos_profile` (`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. FAITH INFORMATION TABLE
DROP TABLE IF EXISTS `faith_information`;
CREATE TABLE `faith_information` (
  `id` VARCHAR(36) PRIMARY KEY,
  `profile_id` VARCHAR(36) NOT NULL UNIQUE,
  `church_name` VARCHAR(200) NOT NULL DEFAULT 'The Open Door Church, Khojewala',
  `denomination` VARCHAR(100) NOT NULL DEFAULT 'Evangelical / Independent Pentecostal',
  `is_baptized` BOOLEAN NOT NULL DEFAULT TRUE,
  `born_again_year` INT NULL,
  `church_involvement` VARCHAR(255) NULL,
  `ministry_involvement` VARCHAR(255) NULL,
  `faith_description` TEXT NULL,
  `pastor_reference_name` VARCHAR(150) NULL,
  `pastor_reference_phone` VARCHAR(50) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  INDEX `idx_faith_denomination` (`denomination`),
  INDEX `idx_faith_church` (`church_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. FAMILY INFORMATION TABLE
DROP TABLE IF EXISTS `family_information`;
CREATE TABLE `family_information` (
  `id` VARCHAR(36) PRIMARY KEY,
  `profile_id` VARCHAR(36) NOT NULL UNIQUE,
  `father_occupation` VARCHAR(150) NULL,
  `mother_occupation` VARCHAR(150) NULL,
  `brothers_count` INT NOT NULL DEFAULT 0,
  `sisters_count` INT NOT NULL DEFAULT 0,
  `family_type` ENUM('NUCLEAR', 'JOINT') NOT NULL DEFAULT 'NUCLEAR',
  `family_values` ENUM('TRADITIONAL_CHRISTIAN', 'MODERATE', 'LIBERAL') NOT NULL DEFAULT 'TRADITIONAL_CHRISTIAN',
  `family_location` VARCHAR(150) NULL,
  `about_family` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. MARRIAGE PREFERENCES TABLE
DROP TABLE IF EXISTS `marriage_preferences`;
CREATE TABLE `marriage_preferences` (
  `id` VARCHAR(36) PRIMARY KEY,
  `profile_id` VARCHAR(36) NOT NULL UNIQUE,
  `min_age` INT NOT NULL DEFAULT 20,
  `max_age` INT NOT NULL DEFAULT 35,
  `min_height_cm` INT NULL,
  `max_height_cm` INT NULL,
  `preferred_marital_status` VARCHAR(150) NOT NULL DEFAULT 'NEVER_MARRIED',
  `preferred_education` VARCHAR(255) NULL,
  `preferred_occupation` VARCHAR(255) NULL,
  `preferred_denominations` VARCHAR(255) NULL,
  `preferred_locations` VARCHAR(255) NULL,
  `family_expectations` TEXT NULL,
  `general_expectations` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. INTERESTS TABLE
DROP TABLE IF EXISTS `interests`;
CREATE TABLE `interests` (
  `id` VARCHAR(36) PRIMARY KEY,
  `sender_id` VARCHAR(36) NOT NULL,
  `receiver_id` VARCHAR(36) NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'DECLINED', 'WITHDRAWN') NOT NULL DEFAULT 'PENDING',
  `message` VARCHAR(500) NULL,
  `introduction_requested` BOOLEAN NOT NULL DEFAULT FALSE,
  `introduction_notes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_sender_receiver` (`sender_id`, `receiver_id`),
  INDEX `idx_interests_sender` (`sender_id`),
  INDEX `idx_interests_receiver` (`receiver_id`),
  INDEX `idx_interests_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. SAVED PROFILES TABLE
DROP TABLE IF EXISTS `saved_profiles`;
CREATE TABLE `saved_profiles` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `saved_user_id` VARCHAR(36) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`saved_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_saved` (`user_id`, `saved_user_id`),
  INDEX `idx_saved_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. BLOCKED PROFILES TABLE
DROP TABLE IF EXISTS `blocked_profiles`;
CREATE TABLE `blocked_profiles` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `blocked_user_id` VARCHAR(36) NOT NULL,
  `reason` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`blocked_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uk_user_blocked` (`user_id`, `blocked_user_id`),
  INDEX `idx_blocked_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. REPORTS TABLE
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` VARCHAR(36) PRIMARY KEY,
  `reporter_id` VARCHAR(36) NOT NULL,
  `reported_user_id` VARCHAR(36) NOT NULL,
  `reason` ENUM('FAKE_PROFILE', 'INAPPROPRIATE_CONTENT', 'HARASSMENT', 'FRAUD_SCAM', 'MISLEADING_INFO', 'ALREADY_MARRIED', 'OTHER') NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
  `admin_notes` TEXT NULL,
  `resolved_by` VARCHAR(36) NULL,
  `resolved_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`resolved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  INDEX `idx_reports_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. NOTIFICATIONS TABLE
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` VARCHAR(36) PRIMARY KEY,
  `user_id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('INTEREST_RECEIVED', 'INTEREST_ACCEPTED', 'INTEREST_DECLINED', 'PROFILE_VERIFIED', 'PROFILE_REJECTED', 'PROFILE_UNDER_REVIEW', 'ADMIN_ALERT', 'INTRODUCTION_FACILITATED') NOT NULL,
  `link_url` VARCHAR(255) NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_notifications_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. CONTACT REQUESTS TABLE (Public contact form)
DROP TABLE IF EXISTS `contact_requests`;
CREATE TABLE `contact_requests` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('NEW', 'IN_PROGRESS', 'REPLIED', 'ARCHIVED') NOT NULL DEFAULT 'NEW',
  `admin_reply` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_contact_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. SUCCESS STORIES TABLE
DROP TABLE IF EXISTS `success_stories`;
CREATE TABLE `success_stories` (
  `id` VARCHAR(36) PRIMARY KEY,
  `couple_names` VARCHAR(200) NOT NULL,
  `groom_name` VARCHAR(100) NOT NULL,
  `bride_name` VARCHAR(100) NOT NULL,
  `marriage_date` DATE NOT NULL,
  `wedding_photo_url` VARCHAR(500) NULL,
  `story` TEXT NOT NULL,
  `church_blessing_notes` TEXT NULL,
  `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_stories_published` (`is_published`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. SITE SETTINGS TABLE (CMS for Church & Brand)
DROP TABLE IF EXISTS `site_settings`;
CREATE TABLE `site_settings` (
  `key_name` VARCHAR(100) PRIMARY KEY,
  `key_value` TEXT NOT NULL,
  `category` ENUM('GENERAL', 'CHURCH', 'CONTACT', 'HOMEPAGE', 'LEGAL', 'SOCIAL') NOT NULL DEFAULT 'GENERAL',
  `description` VARCHAR(255) NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. ADMIN AUDIT LOGS TABLE
DROP TABLE IF EXISTS `admin_audit_logs`;
CREATE TABLE `admin_audit_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `admin_id` VARCHAR(36) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target_type` VARCHAR(50) NOT NULL,
  `target_id` VARCHAR(36) NULL,
  `details_json` JSON NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `idx_audit_admin` (`admin_id`),
  INDEX `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. FAQS TABLE (CMS for Church FAQs)
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `question` VARCHAR(300) NOT NULL,
  `answer` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'General',
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
