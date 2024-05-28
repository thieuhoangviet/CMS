import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
const mongoURI = "mongodb+srv://duyvo:Minh3001@cluster0.a7ff2lm.mongodb.net/CMS?retryWrites=true&w=majority&appName=Cluster0"

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Kết nối thành công');
  } catch (err) {
    console.log('Database connection error:', err);
    process.exit(1);
  }
};

export default connectDB;

