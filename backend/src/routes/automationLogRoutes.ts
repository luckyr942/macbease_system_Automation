import { Router, Request, Response } from 'express';
import * as automationService from '../services/automationService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { status, action, page, limit } = req.query;
        const result = await automationService.getLogs(
            { status, action },
            Number(page) || 1,
            Number(limit) || 50
        );
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
