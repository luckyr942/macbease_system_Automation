import User from '../models/User';

export const getUsers = async (filters: any = {}, page = 1, limit = 20) => {
    const query: any = {};
    if (filters.role) query.role = filters.role;
    if (filters.university) query.university = new RegExp(filters.university, 'i');
    if (filters.search) {
        query.$or = [
            { name: new RegExp(filters.search, 'i') },
            { email: new RegExp(filters.search, 'i') },
        ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-pushToken');

    return { users, total, page, totalPages: Math.ceil(total / limit) };
};

export const getUserStats = async () => {
    const [total, students, teachers, alumni, admins, active, banned] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'student' }),
        User.countDocuments({ role: 'teacher' }),
        User.countDocuments({ role: 'alumni' }),
        User.countDocuments({ role: 'admin' }),
        User.countDocuments({ active: true }),
        User.countDocuments({ banned: true }),
    ]);

    return { total, students, teachers, alumni, admins, active, banned };
};

export const banUser = async (userId: string) => {
    return User.findByIdAndUpdate(userId, { banned: true, active: false }, { new: true });
};

export const unbanUser = async (userId: string) => {
    return User.findByIdAndUpdate(userId, { banned: false, active: true }, { new: true });
};
