import { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key'] as string;
    const validKey = process.env.API_KEY || 'dev-key-macbease-2024';

    if (!apiKey || apiKey !== validKey) {
        res.status(401).json({ error: 'Unauthorized — invalid or missing API key' });
        return;
    }
    next();
};

export const roleGuard = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // In production, extract role from JWT. Here we use a header for simplicity.
        const role = req.headers['x-admin-role'] as string;
        if (!role || !allowedRoles.includes(role)) {
            res.status(403).json({ error: 'Forbidden — insufficient permissions' });
            return;
        }
        next();
    };
};
