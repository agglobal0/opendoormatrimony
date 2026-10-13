const db = require('../config/db');
const { createNotification } = require('../services/notificationService');

const MEMBERSHIP_PLANS = [
  {
    id: 'plan-silver',
    tier: 'BLESSED_SILVER',
    name: 'Blessed Silver Plan',
    duration_months: 3,
    price_inr: 999,
    connect_credits: 15,
    popular: false,
    tagline: 'Ideal for Christian individuals and families taking initial steps.',
    features: [
      '15 Direct Connection Requests',
      'Church-Supervised Contact Shield',
      'Download & Print Official Bio-Data PDF',
      'Standard Pastoral Background Review',
      'View Detailed Family & Faith Profiles'
    ]
  },
  {
    id: 'plan-gold',
    tier: 'COVENANT_GOLD',
    name: 'Covenant Gold Plan',
    duration_months: 6,
    price_inr: 1999,
    connect_credits: 999, // Unlimited
    popular: true,
    tagline: 'Most recommended plan with complete pastoral facilitation.',
    features: [
      'Unlimited Connection Requests',
      'Direct Pastoral Introduction Facilitation',
      'Priority Church Pastoral Verification Badge',
      'Highlighted Profile in Match Search',
      'Direct Pastor Reference Verification',
      'Phone & Email Notification Alerts'
    ]
  },
  {
    id: 'plan-royal',
    tier: 'GRACE_ROYAL',
    name: 'Grace Royal Plan',
    duration_months: 12,
    price_inr: 3499,
    connect_credits: 999, // Unlimited
    popular: false,
    tagline: 'Complete matrimonial ministry guidance & pre-marital counseling.',
    features: [
      'Dedicated Church Bureau Matrimonial Counselor',
      'Unlimited Connections & Family Introductions',
      'Pre-Marital Pastoral Counseling Session',
      'Full Family & Baptism Document Verification',
      'Personal Assistance by Church Bureau Director',
      'Valid for 1 Full Year'
    ]
  }
];

exports.getPlans = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: MEMBERSHIP_PLANS
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const user = mock.tables.users.find(u => u.id === userId);
      const profile = mock.tables.profiles.find(p => p.user_id === userId);

      const tier = user?.membership_tier || 'FREE';
      const isActive = user?.is_membership_active || tier !== 'FREE';
      const credits = user?.connect_credits ?? 0;
      const currentPlan = MEMBERSHIP_PLANS.find(p => p.tier === tier) || null;

      return res.json({
        success: true,
        data: {
          user_id: userId,
          email: user?.email,
          membership_tier: tier,
          is_membership_active: Boolean(isActive),
          connect_credits: credits,
          plan_details: currentPlan,
          membership_expires_at: user?.membership_expires_at || null
        }
      });
    }

    const [rows] = await db.query(
      'SELECT id, email, role, is_verified, membership_tier, connect_credits, is_membership_active, membership_expires_at FROM users WHERE id = ?',
      [userId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const u = rows[0];
    const tier = u.membership_tier || 'FREE';
    const isActive = u.is_membership_active || tier !== 'FREE';
    const currentPlan = MEMBERSHIP_PLANS.find(p => p.tier === tier) || null;

    res.json({
      success: true,
      data: {
        user_id: u.id,
        email: u.email,
        membership_tier: tier,
        is_membership_active: Boolean(isActive),
        connect_credits: u.connect_credits || 0,
        plan_details: currentPlan,
        membership_expires_at: u.membership_expires_at
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.upgradeMembership = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { plan_id, payment_method = 'UPI_ONLINE' } = req.body;

    const plan = MEMBERSHIP_PLANS.find(p => p.id === plan_id || p.tier === plan_id);
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid membership plan selected.' });
    }

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + plan.duration_months);

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const user = mock.tables.users.find(u => u.id === userId);
      const profile = mock.tables.profiles.find(p => p.user_id === userId);

      if (user) {
        user.membership_tier = plan.tier;
        user.is_membership_active = true;
        user.connect_credits = plan.connect_credits;
        user.membership_expires_at = expiryDate;
      }

      await createNotification(
        userId,
        `${plan.name} Activated! ✓`,
        `Your ${plan.name} has been successfully activated. You can now express interest and connect with Christian candidates.`,
        'MEMBERSHIP_ACTIVATED',
        '/dashboard'
      );

      return res.json({
        success: true,
        message: `Congratulations! Your ${plan.name} has been successfully activated.`,
        data: {
          membership_tier: plan.tier,
          plan_name: plan.name,
          is_membership_active: true,
          connect_credits: plan.connect_credits,
          membership_expires_at: expiryDate,
          payment_reference: `TOD-PAY-${Date.now().toString().slice(-6)}`
        }
      });
    }

    await db.query(
      'UPDATE users SET membership_tier = ?, is_membership_active = TRUE, connect_credits = ?, membership_expires_at = ? WHERE id = ?',
      [plan.tier, plan.connect_credits, expiryDate, userId]
    );

    await createNotification(
      userId,
      `${plan.name} Activated! ✓`,
      `Your ${plan.name} has been successfully activated. You can now express interest and connect with Christian candidates.`,
      'MEMBERSHIP_ACTIVATED',
      '/dashboard'
    );

    res.json({
      success: true,
      message: `Congratulations! Your ${plan.name} has been activated.`,
      data: {
        membership_tier: plan.tier,
        plan_name: plan.name,
        is_membership_active: true,
        connect_credits: plan.connect_credits,
        membership_expires_at: expiryDate
      }
    });
  } catch (err) {
    next(err);
  }
};
