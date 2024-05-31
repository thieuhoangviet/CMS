import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const mongoURI = "mongodb+srv://hoangviet:wqnwXzNFNCcqH21g@cluster0.a7ff2lm.mongodb.net/CMS?retryWrites=true&w=majority&appName=Cluster0"

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Kết nối thành công');
  } catch (err) {
    console.log('Kết nối thất bại');
    process.exit(1);
  }
};

export default connectDB;

