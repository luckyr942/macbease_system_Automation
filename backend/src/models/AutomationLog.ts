import mongoose, { Schema, Document } from 'mongoose';

export interface IAutomationLog extends Document {
    action: string;
    status: 'success' | 'error' | 'warning';
    details: string;
    meta?: Record<string, any>;
    timestamp: Date;
}

const AutomationLogSchema = new Schema<IAutomationLog>({
    action: { type: String, required: true },
    status: {
        type: String,
        enum: ['success', 'error', 'warning'],
        required: true,
    },
    details: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAutomationLog>('AutomationLog', AutomationLogSchema);
