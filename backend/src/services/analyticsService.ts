import User from '../models/User';
import Campaign from '../models/Campaign';
import Notification from '../models/Notification';
import Community from '../models/Community';
import Event from '../models/Event';
import Ticket from '../models/Ticket';

export const getOverview = async () => {
    const [
        totalUsers,
        students,
        teachers,
        alumni,
        communities,
        events,
        ticketsSold,
        notificationsSentToday,
        totalCampaigns,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'teacher' }),
        User.countDocuments({ role: 'alumni' }),
        Community.countDocuments(),
        Event.countDocuments(),
        Ticket.countDocuments({ status: { $in: ['active', 'used'] } }),
        Notification.countDocuments({
            status: 'sent',
            sentAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
        Campaign.countDocuments(),
    ]);

    return {
        totalUsers,
        students,
        teachers,
        alumni,
        communities,
        events,
        ticketsSold,
        notificationsSentToday,
        totalCampaigns,
    };
};

export const getUserGrowth = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const growth = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
        { $project: { date: '$_id', count: 1, _id: 0 } },
    ]);

    return growth;
};

export const getNotificationEngagement = async () => {
    const [total, sent, failed] = await Promise.all([
        Notification.countDocuments(),
        Notification.countDocuments({ status: 'sent' }),
        Notification.countDocuments({ status: 'failed' }),
    ]);

    const successRate = total > 0 ? Math.round((sent / total) * 100) : 0;
    return { total, sent, failed, successRate };
};

export const getRevenueStats = async () => {
    const result = await Ticket.aggregate([
        { $match: { status: { $in: ['active', 'used'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return { totalRevenue: result[0]?.total || 0 };
};
