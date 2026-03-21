import mongoose, { Schema, Document } from 'mongoose';

export type AdminRoleType =
    | 'superAdmin'
    | 'communityManager'
    | 'eventManager'
    | 'supportAdmin'
    | 'marketingAdmin';

export interface IAdminRole extends Document {
    userId: mongoose.Types.ObjectId;
    role: AdminRoleType;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

const AdminRoleSchema = new Schema<IAdminRole>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        role: {
            type: String,
            enum: ['superAdmin', 'communityManager', 'eventManager', 'supportAdmin', 'marketingAdmin'],
            required: true,
        },
        permissions: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model<IAdminRole>('AdminRole', AdminRoleSchema);
