import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    title: string;
    message: string;
    userId: mongoose.Types.ObjectId;
    campaignId?: mongoose.Types.ObjectId;
    type: 'push' | 'email' | 'in_app';
    status: 'pending' | 'sent' | 'failed';
    sentAt?: Date;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
        type: {
            type: String,
            enum: ['push', 'email', 'in_app'],
            default: 'in_app',
        },
        status: {
            type: String,
            enum: ['pending', 'sent', 'failed'],
            default: 'pending',
        },
        sentAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
