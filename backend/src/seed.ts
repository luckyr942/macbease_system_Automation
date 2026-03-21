import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db';
import User from './models/User';
import Community from './models/Community';
import Event from './models/Event';
import Campaign from './models/Campaign';
import Ticket from './models/Ticket';
import Notification from './models/Notification';
import AutomationLog from './models/AutomationLog';
import AdminRole from './models/AdminRole';

const universities = ['LPU', 'DU', 'IIT Delhi', 'BITS Pilani', 'VIT Vellore'];
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Myra', 'Sara', 'Aadhya', 'Isha', 'Kiara', 'Riya', 'Priya', 'Neha', 'Pooja', 'Rohan', 'Karan', 'Rahul', 'Amit', 'Sneha', 'Divya', 'Meera', 'Shreya', 'Tanvi'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Verma', 'Jain', 'Rao', 'Chauhan'];

const seed = async () => {
    await connectDB();

    // Clear existing data
    await Promise.all([
        User.deleteMany({}),
        Community.deleteMany({}),
        Event.deleteMany({}),
        Campaign.deleteMany({}),
        Ticket.deleteMany({}),
        Notification.deleteMany({}),
        AutomationLog.deleteMany({}),
        AdminRole.deleteMany({}),
    ]);

    console.log('🗑️  Cleared existing data');

    // Create users
    const roles: Array<'student' | 'teacher' | 'admin' | 'alumni'> = ['student', 'student', 'student', 'student', 'student', 'teacher', 'alumni', 'admin'];
    const users = [];
    for (let i = 0; i < 120; i++) {
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[i % lastNames.length];
        users.push({
            name: `${fn} ${ln}`,
            email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@macbease.com`,
            role: roles[i % roles.length],
            university: universities[i % universities.length],
            active: Math.random() > 0.1,
            banned: Math.random() < 0.05,
            lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        });
    }
    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create communities
    const communityData = [
        { name: 'NightOwls', description: 'Late-night study & chill community', university: 'LPU', category: 'lifestyle' },
        { name: 'Telugu Yuvsena', description: 'Telugu student association', university: 'LPU', category: 'cultural' },
        { name: 'LPU Agriculture', description: 'Agriculture department community', university: 'LPU', category: 'academic' },
        { name: 'LPU NCC', description: 'National Cadet Corps', university: 'LPU', category: 'defence' },
        { name: 'Code Warriors', description: 'Competitive programming club', university: 'IIT Delhi', category: 'tech' },
        { name: 'Startup Hub', description: 'Entrepreneurship community', university: 'BITS Pilani', category: 'business' },
        { name: 'Photography Club', description: 'Capture the moment', university: 'VIT Vellore', category: 'creative' },
    ];

    const communities = [];
    for (const c of communityData) {
        const memberSlice = createdUsers.filter((u) => u.university === c.university).slice(0, 15);
        communities.push({
            ...c,
            members: memberSlice.map((u) => u._id),
            moderators: memberSlice.slice(0, 2).map((u) => u._id),
        });
    }
    const createdCommunities = await Community.insertMany(communities);
    console.log(`🏘️  Created ${createdCommunities.length} communities`);

    // Create events
    const eventData = [
        { name: 'BGMI Tournament', description: 'Battle Grounds Mobile India championship', location: 'LPU Auditorium', ticketPrice: 100, maxParticipants: 200, status: 'live' },
        { name: 'Holi Celebration 2026', description: 'Grand Holi fest with DJ and colors', location: 'DU Campus Ground', ticketPrice: 50, maxParticipants: 500, status: 'upcoming' },
        { name: 'AI Workshop', description: 'Hands-on AI/ML workshop with industry experts', location: 'IIT Delhi Lab', ticketPrice: 200, maxParticipants: 80, status: 'upcoming' },
        { name: 'Startup Pitch Night', description: 'Present your startup idea to investors', location: 'BITS Innovation Lab', ticketPrice: 0, maxParticipants: 50, status: 'upcoming' },
        { name: 'Photography Contest', description: 'Annual photography competition', location: 'VIT Gallery', ticketPrice: 30, maxParticipants: 100, status: 'completed' },
    ];

    const createdEvents = await Event.insertMany(
        eventData.map((e, i) => ({
            ...e,
            date: new Date(Date.now() + (i - 2) * 7 * 24 * 60 * 60 * 1000),
            communityId: createdCommunities[i % createdCommunities.length]._id,
            createdBy: createdUsers[0]._id,
            currentParticipants: Math.floor(Math.random() * e.maxParticipants * 0.7),
        }))
    );
    console.log(`🎉 Created ${createdEvents.length} events`);

    // Create tickets
    const tickets = [];
    for (const event of createdEvents) {
        const count = Math.floor(Math.random() * 30) + 10;
        for (let i = 0; i < count; i++) {
            tickets.push({
                eventId: event._id,
                userId: createdUsers[i % createdUsers.length]._id,
                amount: (event as any).ticketPrice || 0,
                status: Math.random() > 0.1 ? 'active' : 'used',
                purchasedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
            });
        }
    }
    await Ticket.insertMany(tickets);
    console.log(`🎟️  Created ${tickets.length} tickets`);

    // Create campaigns
    const campaigns = [
        { title: 'BGMI Tournament Live', message: 'Register now before slots close!', audience: 'STUDENTS', type: 'push', status: 'completed', priority: 'high', sentCount: 340 },
        { title: 'Weekly Newsletter', message: 'Check out this week\'s events and community updates', audience: 'ALL_USERS', type: 'email', status: 'completed', priority: 'medium', sentCount: 1200 },
        { title: 'Holi Celebration Invite', message: 'Join the grand Holi fest! Colors, DJ, and food!', audience: 'ALL_USERS', type: 'push', status: 'scheduled', priority: 'high', sentCount: 0 },
        { title: 'Alumni Connect', message: 'Reconnect with your batchmates at the alumni meet', audience: 'ALUMNI', type: 'email', status: 'draft', priority: 'low', sentCount: 0 },
    ];
    await Campaign.insertMany(campaigns);
    console.log(`📢 Created ${campaigns.length} campaigns`);

    // Create notifications
    const notifs = [];
    for (let i = 0; i < 50; i++) {
        notifs.push({
            title: `Notification ${i + 1}`,
            message: `This is notification message ${i + 1}`,
            userId: createdUsers[i % createdUsers.length]._id,
            type: ['push', 'email', 'in_app'][i % 3],
            status: ['sent', 'sent', 'sent', 'pending', 'failed'][i % 5],
            sentAt: i % 5 < 3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        });
    }
    await Notification.insertMany(notifs);
    console.log(`🔔 Created ${notifs.length} notifications`);

    // Create automation logs
    const logs = [
        { action: 'EMAIL_SENT', status: 'success', details: 'Email sent to 4,200 users — Weekly Newsletter' },
        { action: 'PUSH_SENT', status: 'success', details: 'Push notification delivered — BGMI Tournament' },
        { action: 'EMAIL_FAILED', status: 'error', details: 'Failed to send email to 34 users — bounced addresses' },
        { action: 'CAMPAIGN_CREATED', status: 'success', details: 'Campaign "Holi Celebration Invite" created' },
        { action: 'CAMPAIGN_STARTED', status: 'success', details: 'Campaign "Weekly Newsletter" dispatched to 1,200 users' },
        { action: 'USER_BANNED', status: 'warning', details: 'User spam@test.com banned for spam activity' },
        { action: 'COMMUNITY_CREATED', status: 'success', details: 'Community "NightOwls" created with 15 initial members' },
        { action: 'EVENT_CREATED', status: 'success', details: 'Event "BGMI Tournament" created — 200 max participants' },
        { action: 'TICKET_SOLD', status: 'success', details: '120 tickets sold for BGMI Tournament' },
        { action: 'PUSH_SENT', status: 'success', details: '340 push notifications sent for BGMI Tournament' },
    ];
    await AutomationLog.insertMany(
        logs.map((l, i) => ({ ...l, timestamp: new Date(Date.now() - i * 3600000) }))
    );
    console.log(`📋 Created ${logs.length} automation logs`);

    // Create admin roles
    await AdminRole.insertMany([
        { userId: createdUsers[0]._id, role: 'superAdmin', permissions: ['all'] },
        { userId: createdUsers[1]._id, role: 'communityManager', permissions: ['manage_communities', 'view_users'] },
        { userId: createdUsers[2]._id, role: 'eventManager', permissions: ['manage_events', 'view_tickets'] },
        { userId: createdUsers[3]._id, role: 'marketingAdmin', permissions: ['manage_campaigns', 'send_notifications'] },
    ]);
    console.log('👑 Created admin roles');

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
};

seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
