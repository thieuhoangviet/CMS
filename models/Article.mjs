import mongoose from 'mongoose';
import slugify from 'slugify';


const contentSchema = new mongoose.Schema({
  content_id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  createdat: { type: Date, default: Date.now },
  updatedat: { type: Date, default: Date.now },
});

const articleShema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  article_slug: {
    type: String
    // required: true,
    // unique: true,
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
})

articleShema.pre('validate', function (next) {
  console.log(typeof this.slug)
  if (typeof this.slug === 'string' && !this.article_slug) {
    console.log('Pre-validate middleware called');
    this.article_slug = slugify(this.slug, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('CMS', articleShema);