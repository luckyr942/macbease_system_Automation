import { Router, Request, Response } from 'express';
import Notification from '../models/Notification';
import User from '../models/User';
import AutomationLog from '../models/AutomationLog';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { status, page, limit } = req.query;
        const query: any = {};
        if (status) query.status = status;

        const total = await Notification.countDocuments(query);
        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .skip(((Number(page) || 1) - 1) * (Number(limit) || 20))
            .limit(Number(limit) || 20)
            .populate('userId', 'name email');

        res.json({ notifications, total, page: Number(page) || 1 });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (_req: Request, res: Response) => {
    try {
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const [sentToday, failedToday, pendingToday, totalSent, totalAll] = await Promise.all([
            Notification.countDocuments({ status: 'sent', sentAt: { $gte: todayStart } }),
            Notification.countDocuments({ status: 'failed', createdAt: { $gte: todayStart } }),
            Notification.countDocuments({ status: 'pending', createdAt: { $gte: todayStart } }),
            Notification.countDocuments({ status: 'sent' }),
            Notification.countDocuments(),
        ]);
        const deliveryRate = totalAll > 0 ? Math.round((totalSent / totalAll) * 100) : 0;
        res.json({ sentToday, failedToday, pendingToday, deliveryRate });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/send', async (req: Request, res: Response) => {
    try {
        const { title, message, audience, type } = req.body;

        const userQuery: any = { active: true, banned: false };
        if (audience && audience !== 'ALL_USERS') {
            const roleMap: Record<string, string> = {
                STUDENTS: 'student',
                TEACHERS: 'teacher',
                ALUMNI: 'alumni',
                ADMINS: 'admin',
            };
            if (roleMap[audience]) userQuery.role = roleMap[audience];
        }

        const users = await User.find(userQuery).select('_id');
        const notifications = users.map((u) => ({
            title,
            message,
            userId: u._id,
            type: type || 'in_app',
            status: 'sent' as const,
            sentAt: new Date(),
        }));

        await Notification.insertMany(notifications);

        await AutomationLog.create({
            action: 'NOTIFICATION_SENT',
            status: 'success',
            details: `"${title}" sent to ${users.length} users (${audience || 'ALL_USERS'})`,
        });

        res.json({ sent: users.length });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
