import mongoose from 'mongoose';

const articleShema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  article_slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: Array,
    required: true,
  },
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
  }
}, {
  collection: "Article",
  timestamps: true
})


export default mongoose.model('Article', articleShema);