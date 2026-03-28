import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String }, // Cloudinary URL
  socialLinks: {
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
