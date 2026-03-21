import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunity extends Document {
    name: string;
    description: string;
    university: string;
    members: mongoose.Types.ObjectId[];
    moderators: mongoose.Types.ObjectId[];
    category: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        university: { type: String, required: true },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        category: { type: String, default: 'general' },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<ICommunity>('Community', CommunitySchema);
