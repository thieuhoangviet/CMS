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
    required: false, // Hoặc có thể bỏ "required: false" vì giá trị mặc định là false
  },
  emailVerified: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model('User', UserSchema);

export default User;
// const mongoose = require('mongoose');
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
