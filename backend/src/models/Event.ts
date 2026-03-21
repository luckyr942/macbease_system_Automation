import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
    name: string;
    description: string;
    date: Date;
    location: string;
    maxParticipants: number;
    currentParticipants: number;
    ticketPrice: number;
    communityId?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    status: 'upcoming' | 'live' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        date: { type: Date, required: true },
        location: { type: String, required: true },
        maxParticipants: { type: Number, default: 100 },
        currentParticipants: { type: Number, default: 0 },
        ticketPrice: { type: Number, default: 0 },
        communityId: { type: Schema.Types.ObjectId, ref: 'Community' },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['upcoming', 'live', 'completed', 'cancelled'],
            default: 'upcoming',
        },
    },
    { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
