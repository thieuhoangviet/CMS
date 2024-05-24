import mongoose from 'mongoose';
import dotenv  from 'dotenv';
dotenv.config()
const mongoURI = process.env.CONNECTION

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Kết nối thành công');
  } catch (err) {
    console.log('Database connection error:', err);
    process.exit(1);
  }
};

export default connectDB;

  