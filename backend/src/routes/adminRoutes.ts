import { Router, Request, Response } from 'express';
import AdminRole from '../models/AdminRole';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const roles = await AdminRole.find().populate('userId', 'name email');
        res.json(roles);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/roles', async (req: Request, res: Response) => {
    try {
        const { userId, role, permissions } = req.body;
        const adminRole = await AdminRole.findOneAndUpdate(
            { userId },
            { role, permissions },
            { upsert: true, new: true }
        );
        res.json(adminRole);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/roles/:userId', async (req: Request, res: Response) => {
    try {
        await AdminRole.findOneAndDelete({ userId: req.params.userId });
        res.json({ message: 'Admin role removed' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
