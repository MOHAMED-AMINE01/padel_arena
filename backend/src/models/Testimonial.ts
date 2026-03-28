import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, default: 5 },
  avatar: { type: String }, // Cloudinary URL
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
