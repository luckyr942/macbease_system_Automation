import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
    eventId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    amount: number;
    status: 'active' | 'used' | 'cancelled' | 'refunded';
    purchasedAt: Date;
    createdAt: Date;
}

const TicketSchema = new Schema<ITicket>(
    {
        eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['active', 'used', 'cancelled', 'refunded'],
            default: 'active',
        },
        purchasedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<ITicket>('Ticket', TicketSchema);
