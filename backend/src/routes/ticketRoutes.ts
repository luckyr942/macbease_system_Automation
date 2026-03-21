import { Router, Request, Response } from 'express';
import * as ticketService from '../services/ticketService';
import Ticket from '../models/Ticket';

const router = Router();

router.post('/purchase', async (req: Request, res: Response) => {
    try {
        const { eventId, userId } = req.body;
        const ticket = await ticketService.purchaseTicket(eventId, userId);
        res.status(201).json(ticket);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/by-event', async (_req: Request, res: Response) => {
    try {
        const breakdown = await Ticket.aggregate([
            { $group: { _id: '$eventId', sold: { $sum: 1 }, revenue: { $sum: '$amount' } } },
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            { $unwind: '$event' },
            {
                $project: {
                    event: '$event.name',
                    sold: 1,
                    total: '$event.maxParticipants',
                    price: '$event.ticketPrice',
                    revenue: 1,
                    remaining: { $subtract: ['$event.maxParticipants', '$sold'] },
                },
            },
            { $sort: { revenue: -1 } },
        ]);
        res.json(breakdown);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/stats', async (_req: Request, res: Response) => {
    try {
        const stats = await ticketService.getTicketStats();
        res.json(stats);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
