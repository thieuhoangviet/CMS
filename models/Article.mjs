import mongoose from 'mongoose';


const contentSchema = new mongoose.Schema({
  content_id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  createdat: { type: Date, default: Date.now },
  updatedat: { type: Date, default: Date.now },
});

const articleShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  article_slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: [contentSchema],
  excerpt: {
    type: String,
  },
  image: {
    type: String,
  },
  draft: {
    type: Boolean,
    default: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  published_at: {
    type: Date,
  },
  create_at: {
    type: Date,
    default: Date.now,
  },
  update_at: {
    type: Date,
    default: Date.now,
  },
}, { collection: 'article_ex' })

export default mongoose.model('Article', articleShema);