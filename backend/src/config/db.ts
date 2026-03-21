import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/macbease';
        await mongoose.connect(uri);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
