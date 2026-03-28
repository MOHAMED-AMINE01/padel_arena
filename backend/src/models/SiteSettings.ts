import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  phone: { type: String, default: '+33 2 00 00 00 00' },
  email: { type: String, default: 'contact@padelarena.fr' },
  address: { type: String, default: '123 Avenue du Padel, 41100 Vendôme' },
  availability: { type: String, default: '08:00 — 23:00, Sept jours sur sept' },
  googleMapsUrl: { type: String, default: 'https://maps.google.com' },
  socialLinks: {
    instagram: { type: String, default: '#' },
    facebook: { type: String, default: '#' },
    twitter: { type: String, default: '#' }
  },
  updatedAt: { type: Date, default: Date.now }
});

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
