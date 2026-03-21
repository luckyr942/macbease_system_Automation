import { Router, Request, Response } from 'express';
import * as analyticsService from '../services/analyticsService';

const router = Router();

router.get('/overview', async (_req: Request, res: Response) => {
    try {
        const overview = await analyticsService.getOverview();
        res.json(overview);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/growth', async (req: Request, res: Response) => {
    try {
        const days = Number(req.query.days) || 30;
        const growth = await analyticsService.getUserGrowth(days);
        res.json(growth);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/engagement', async (_req: Request, res: Response) => {
    try {
        const engagement = await analyticsService.getNotificationEngagement();
        res.json(engagement);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/revenue', async (_req: Request, res: Response) => {
    try {
        const revenue = await analyticsService.getRevenueStats();
        res.json(revenue);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
