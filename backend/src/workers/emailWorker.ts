import { Worker, Job } from 'bullmq';
import { Resend } from 'resend';
import Notification from '../models/Notification';
import AutomationLog from '../models/AutomationLog';
import { redisConnection } from '../queues/emailQueue';

const resend = new Resend(process.env.RESEND_API_KEY || '');

interface EmailJobData {
    notificationId: string;
    to: string;
    subject: string;
    html: string;
}

const emailWorker = new Worker<EmailJobData>(
    'email-dispatch',
    async (job: Job<EmailJobData>) => {
        const { notificationId, to, subject, html } = job.data;

        try {
            await resend.emails.send({
                from: 'MacBease <noreply@macbease.com>',
                to,
                subject,
                html,
            });

            await Notification.findByIdAndUpdate(notificationId, {
                status: 'sent',
                sentAt: new Date(),
            });

            await AutomationLog.create({
                action: 'EMAIL_SENT',
                status: 'success',
                details: `Email sent to ${to}: ${subject}`,
                meta: { notificationId, to },
            });
        } catch (error: any) {
            await Notification.findByIdAndUpdate(notificationId, {
                status: 'failed',
            });

            await AutomationLog.create({
                action: 'EMAIL_FAILED',
                status: 'error',
                details: `Failed to send email to ${to}: ${error.message}`,
                meta: { notificationId, to, error: error.message },
            });

            throw error;
        }
    },
    {
        connection: redisConnection,
        concurrency: 50,
    }
);

emailWorker.on('completed', (job) => {
    console.log(`📧 Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`❌ Email job ${job?.id} failed:`, err.message);
});

export default emailWorker;
