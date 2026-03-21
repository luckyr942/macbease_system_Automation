import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin' | 'alumni';
    university: string;
    communities: mongoose.Types.ObjectId[];
    active: boolean;
    banned: boolean;
    pushToken?: string;
    lastActive?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        role: {
            type: String,
            enum: ['student', 'teacher', 'admin', 'alumni'],
            default: 'student',
        },
        university: { type: String, required: true },
        communities: [{ type: Schema.Types.ObjectId, ref: 'Community' }],
        active: { type: Boolean, default: true },
        banned: { type: Boolean, default: false },
        pushToken: { type: String },
        lastActive: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
