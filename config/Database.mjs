import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://hoangviet:wqnwXzNFNCcqH21g@cluster0.a7ff2lm.mongodb.net/CMS?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Kết nối thành công');
  } catch (err) {
    console.log('Kết nối thất bại');
    process.exit(1);
  }
};

export default connectDB;
// const mongoose = require('mongoose');
// const mongoURI = 'mongodb+srv://hoangviet:wqnwXzNFNCcqH21g@cluster0.a7ff2lm.mongodb.net/CMS?retryWrites=true&w=majority&appName=Cluster0';
  
//   const connectDB = async () => {
//     try {
//       await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//       console.log('Kết nối thành công');
//     } catch (err) {
//       console.log('Database connection error:', err);
//       process.exit(1);
//     }
//   };
  
//   module.exports = connectDB;
  