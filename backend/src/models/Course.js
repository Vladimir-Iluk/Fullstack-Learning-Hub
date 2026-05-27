/**
 * ═══════════════════════════════════════════════════════
 * Mongoose Model: Course
 * Topic #17: NoSQL + MongoDB + Mongoose
 * ═══════════════════════════════════════════════════════
 * Гнучка структура для курсів з вкладеними лекціями.
 * ═══════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

// ── Sub-schema: Lecture (nested document) ──
const lectureSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  video_url: { type: String, default: null },
  duration_minutes: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  is_free: { type: Boolean, default: false },
}, { _id: true, timestamps: true });

// ── Sub-schema: Module ──
const moduleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  lectures: [lectureSchema],
}, { _id: true });

// ── Main Course Schema ──
const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Назва курсу обов\'язкова'],
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Опис курсу обов\'язковий'],
    maxlength: 2000,
  },
  short_description: {
    type: String,
    maxlength: 300,
  },
  instructor_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'fullstack', 'devops', 'mobile', 'data-science', 'design'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  original_price: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: 'UAH',
  },
  thumbnail_url: {
    type: String,
    default: '/static/images/default-course.jpg',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  modules: [moduleSchema],
  total_duration_hours: {
    type: Number,
    default: 0,
  },
  students_count: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews_count: {
    type: Number,
    default: 0,
  },
  is_published: {
    type: Boolean,
    default: true,
  },
  is_featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// ── Pre-save hook: generate slug ──
courseSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// ── Virtual: discount percentage ──
courseSchema.virtual('discount_percent').get(function () {
  if (!this.original_price || this.original_price <= this.price) return 0;
  return Math.round(((this.original_price - this.price) / this.original_price) * 100);
});

// ── Index for search and pagination (Topic #19) ──
courseSchema.index({ category: 1, is_published: 1 });
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ price: 1 });
courseSchema.index({ createdAt: -1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;
