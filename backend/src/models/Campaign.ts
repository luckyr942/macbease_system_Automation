import mongoose, { Schema, Document } from 'mongoose';

export type CampaignAudience =
    | 'ALL_USERS'
    | 'STUDENTS'
    | 'TEACHERS'
    | 'ALUMNI'
    | 'ADMINS'
    | 'SPECIFIC_UNIVERSITY'
    | 'SPECIFIC_COMMUNITY';

export type CampaignType = 'push' | 'email' | 'announcement' | 'sms';

export interface ICampaign extends Document {
    title: string;
    message: string;
    image?: string;
    audience: CampaignAudience;
    audienceFilter?: string; // university or community ID
    type: CampaignType;
    scheduledTime?: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
    sentCount: number;
    failedCount: number;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
    {
        title: { type: String, required: true, trim: true },
        message: { type: String, required: true },
        image: { type: String },
        audience: {
            type: String,
            enum: [
                'ALL_USERS',
                'STUDENTS',
                'TEACHERS',
                'ALUMNI',
                'ADMINS',
                'SPECIFIC_UNIVERSITY',
                'SPECIFIC_COMMUNITY',
            ],
            required: true,
        },
        audienceFilter: { type: String },
        type: {
            type: String,
            enum: ['push', 'email', 'announcement', 'sms'],
            default: 'email',
        },
        scheduledTime: { type: Date },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        status: {
            type: String,
            enum: ['draft', 'scheduled', 'running', 'completed', 'failed'],
            default: 'draft',
        },
        sentCount: { type: Number, default: 0 },
        failedCount: { type: Number, default: 0 },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
