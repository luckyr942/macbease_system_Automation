import { Router, Request, Response } from 'express';
import * as userService from '../services/userService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { role, university, search, page, limit } = req.query;
        const result = await userService.getUsers(
            { role, university, search },
            Number(page) || 1,
            Number(limit) || 20
        );
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (_req: Request, res: Response) => {
    try {
        const stats = await userService.getUserStats();
        res.json(stats);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/ban', async (req: Request, res: Response) => {
    try {
        const user = await userService.banUser(req.params.id);
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.patch('/:id/unban', async (req: Request, res: Response) => {
    try {
        const user = await userService.unbanUser(req.params.id);
        res.json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
