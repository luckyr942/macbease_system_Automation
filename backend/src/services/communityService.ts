import Community from '../models/Community';

export const getCommunities = async (page = 1, limit = 20) => {
    const total = await Community.countDocuments();
    const communities = await Community.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('moderators', 'name email');
    return { communities, total, page, totalPages: Math.ceil(total / limit) };
};

export const createCommunity = async (data: any) => {
    return Community.create(data);
};

export const updateCommunity = async (id: string, data: any) => {
    return Community.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCommunity = async (id: string) => {
    return Community.findByIdAndDelete(id);
};

export const assignModerator = async (communityId: string, userId: string) => {
    return Community.findByIdAndUpdate(
        communityId,
        { $addToSet: { moderators: userId } },
        { new: true }
    );
};

export const getCommunityStats = async () => {
    const total = await Community.countDocuments();
    const [totalMembersResult, totalModeratorsResult] = await Promise.all([
        Community.aggregate([
            { $project: { memberCount: { $size: '$members' } } },
            { $group: { _id: null, total: { $sum: '$memberCount' } } },
        ]),
        Community.aggregate([
            { $project: { modCount: { $size: '$moderators' } } },
            { $group: { _id: null, total: { $sum: '$modCount' } } },
        ]),
    ]);
    return {
        total,
        totalMembers: totalMembersResult[0]?.total || 0,
        activeModerators: totalModeratorsResult[0]?.total || 0,
    };
};
