import Event from '../models/Event';
import Ticket from '../models/Ticket';

export const getEvents = async (page = 1, limit = 20) => {
    const total = await Event.countDocuments();
    const events = await Event.find()
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    return { events, total, page, totalPages: Math.ceil(total / limit) };
};

export const createEvent = async (data: any) => {
    return Event.create(data);
};

export const updateEvent = async (id: string, data: any) => {
    return Event.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEvent = async (id: string) => {
    return Event.findByIdAndDelete(id);
};

export const getEventRegistrations = async (eventId: string) => {
    const tickets = await Ticket.find({ eventId })
        .populate('userId', 'name email role')
        .sort({ purchasedAt: -1 });
    return tickets;
};

export const getEventStats = async () => {
    const total = await Event.countDocuments();
    const upcoming = await Event.countDocuments({ status: 'upcoming' });
    const live = await Event.countDocuments({ status: 'live' });
    const completed = await Event.countDocuments({ status: 'completed' });
    return { total, upcoming, live, completed };
};
