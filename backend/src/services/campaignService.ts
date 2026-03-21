import Campaign from '../models/Campaign';
import User from '../models/User';
import Notification from '../models/Notification';
import AutomationLog from '../models/AutomationLog';
import { emailQueue } from '../queues/emailQueue';

export const createCampaign = async (data: any) => {
    const campaign = await Campaign.create(data);
    await AutomationLog.create({
        action: 'CAMPAIGN_CREATED',
        status: 'success',
        details: `Campaign "${campaign.title}" created`,
        meta: { campaignId: campaign._id },
    });
    return campaign;
};

export const getCampaigns = async (page = 1, limit = 20) => {
    const total = await Campaign.countDocuments();
    const campaigns = await Campaign.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    return { campaigns, total, page, totalPages: Math.ceil(total / limit) };
};

export const getCampaignById = async (id: string) => {
    return Campaign.findById(id);
};

export const runCampaign = async (id: string) => {
    const campaign = await Campaign.findById(id);
    if (!campaign) throw new Error('Campaign not found');

    campaign.status = 'running';
    await campaign.save();

    // Build user query based on audience
    const userQuery: any = { active: true, banned: false };
    switch (campaign.audience) {
        case 'STUDENTS':
            userQuery.role = 'student';
            break;
        case 'TEACHERS':
            userQuery.role = 'teacher';
            break;
        case 'ALUMNI':
            userQuery.role = 'alumni';
            break;
        case 'ADMINS':
            userQuery.role = 'admin';
            break;
        case 'SPECIFIC_UNIVERSITY':
            if (campaign.audienceFilter) userQuery.university = campaign.audienceFilter;
            break;
        case 'SPECIFIC_COMMUNITY':
            if (campaign.audienceFilter) userQuery.communities = campaign.audienceFilter;
            break;
    }

    const users = await User.find(userQuery).select('_id email name');

    // Create notifications and queue emails
    let queued = 0;
    for (const user of users) {
        const notification = await Notification.create({
            title: campaign.title,
            message: campaign.message,
            userId: user._id,
            campaignId: campaign._id,
            type: campaign.type === 'email' ? 'email' : 'in_app',
            status: 'pending',
        });

        if (campaign.type === 'email') {
            await emailQueue.add('send-email', {
                notificationId: notification._id.toString(),
                to: user.email,
                subject: campaign.title,
                html: `<div style="font-family:sans-serif;padding:20px"><h2>${campaign.title}</h2><p>${campaign.message}</p></div>`,
            });
        }

        queued++;
    }

    await AutomationLog.create({
        action: 'CAMPAIGN_STARTED',
        status: 'success',
        details: `Campaign "${campaign.title}" dispatched to ${queued} users`,
        meta: { campaignId: id, queued },
    });

    return { status: 'campaign started', queued };
};

export const getCampaignStats = async (id: string) => {
    const [pending, sent, failed] = await Promise.all([
        Notification.countDocuments({ campaignId: id, status: 'pending' }),
        Notification.countDocuments({ campaignId: id, status: 'sent' }),
        Notification.countDocuments({ campaignId: id, status: 'failed' }),
    ]);
    return { pending, sent, failed, total: pending + sent + failed };
};
