const mongoose = require('mongoose');

const tenantSchoolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  name: { type: String, required: true },
  motto: { type: String },
  country: { type: String },
  countryCode: { type: String },
  flagEmoji: { type: String },
  city: { type: String },
  stateOrRegion: { type: String },
  currencySymbol: { type: String, default: '₦' },
  currencyCode: { type: String, default: 'NGN' },
  primaryEmail: { type: String },
  phone: { type: String },
  subdomain: { type: String },
  logoUrl: { type: String },
  subscriptionPlan: { type: String, default: 'professional' },
  billingCycle: { type: String, default: 'annual' },
  annualPriceFormatted: { type: String },
  subscriptionStatus: { type: String, default: 'active' },
  subscriptionExpiry: { type: String },
  schoolTierMode: { type: String, default: 'k12_tertiary' },
  unlockedTiers: [{ type: String }],
  unlockedServices: {
    cbt: { type: Boolean, default: true },
    alumniCommunity: { type: Boolean, default: true },
    digitalIdStudio: { type: Boolean, default: true },
    parentPortal: { type: Boolean, default: true },
    bursaryGateways: { type: Boolean, default: true }
  },
  stats: {
    totalStudents: { type: Number, default: 0 },
    totalStaff: { type: Number, default: 0 },
    totalClasses: { type: Number, default: 0 },
    activeSession: { type: String, default: '2026/2027' },
    totalRevenueCollected: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('TenantSchool', tenantSchoolSchema);
