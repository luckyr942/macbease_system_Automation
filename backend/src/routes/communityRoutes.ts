import { Router, Request, Response } from 'express';
import * as communityService from '../services/communityService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query;
        const result = await communityService.getCommunities(Number(page) || 1, Number(limit) || 20);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const community = await communityService.createCommunity(req.body);
        res.status(201).json(community);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const community = await communityService.updateCommunity(req.params.id, req.body);
        res.json(community);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await communityService.deleteCommunity(req.params.id);
        res.json({ message: 'Community deleted' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/:id/moderators', async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const community = await communityService.assignModerator(req.params.id, userId);
        res.json(community);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (_req: Request, res: Response) => {
    try {
        const stats = await communityService.getCommunityStats();
        res.json(stats);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
