import { Router, Request, Response } from 'express';
import * as campaignService from '../services/campaignService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query;
        const result = await campaignService.getCampaigns(Number(page) || 1, Number(limit) || 20);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const campaign = await campaignService.createCampaign(req.body);
        res.status(201).json(campaign);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.id);
        if (!campaign) { res.status(404).json({ error: 'Not found' }); return; }
        res.json(campaign);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/run', async (req: Request, res: Response) => {
    try {
        const result = await campaignService.runCampaign(req.params.id);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/stats', async (req: Request, res: Response) => {
    try {
        const stats = await campaignService.getCampaignStats(req.params.id);
        res.json(stats);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
