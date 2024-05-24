import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  verificationCode: {
    type: String,
    required: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  collection: 'User'
});

const User = mongoose.model('User', UserSchema);

export default User;

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     default: 'user'
//   },
//   verificationCode: {
//     type: String,
//     required: false
//   },
//   emailVerified: {
//     type: Boolean,
//     default: false
//   }
// });

// const User = mongoose.model('User', UserSchema);

// module.exports = User;
