import AutomationLog from '../models/AutomationLog';

export const getLogs = async (filters: any = {}, page = 1, limit = 50) => {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.action) query.action = new RegExp(filters.action, 'i');

    const total = await AutomationLog.countDocuments(query);
    const logs = await AutomationLog.find(query)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return { logs, total, page, totalPages: Math.ceil(total / limit) };
};

export const createLog = async (data: {
    action: string;
    status: 'success' | 'error' | 'warning';
    details: string;
    meta?: Record<string, any>;
}) => {
    return AutomationLog.create(data);
};
