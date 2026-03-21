import Ticket from '../models/Ticket';
import Event from '../models/Event';

export const purchaseTicket = async (eventId: string, userId: string) => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.currentParticipants >= event.maxParticipants) {
        throw new Error('Event is full');
    }

    const ticket = await Ticket.create({
        eventId,
        userId,
        amount: event.ticketPrice,
    });

    event.currentParticipants += 1;
    await event.save();

    return ticket;
};

export const getTicketStats = async () => {
    const totalTickets = await Ticket.countDocuments({ status: 'active' });
    const revenueResult = await Ticket.aggregate([
        { $match: { status: { $in: ['active', 'used'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Per-event breakdown
    const eventBreakdown = await Ticket.aggregate([
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
                eventName: '$event.name',
                sold: 1,
                revenue: 1,
                remaining: { $subtract: ['$event.maxParticipants', '$sold'] },
            },
        },
        { $sort: { revenue: -1 } },
    ]);

    return { totalTickets, totalRevenue, eventBreakdown };
};
