import { Router, Request, Response } from 'express';
import * as eventService from '../services/eventService';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query;
        const result = await eventService.getEvents(Number(page) || 1, Number(limit) || 20);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json(event);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body);
        res.json(event);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await eventService.deleteEvent(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/registrations', async (req: Request, res: Response) => {
    try {
        const registrations = await eventService.getEventRegistrations(req.params.id);
        res.json(registrations);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats/overview', async (_req: Request, res: Response) => {
    try {
        const stats = await eventService.getEventStats();
        res.json(stats);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
