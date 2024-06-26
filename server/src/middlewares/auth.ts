import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../services/firebaseAdmin';
import { DecodedIdToken } from 'firebase-admin/auth';

interface CustomRequest extends Request {
    user?: DecodedIdToken;
}

export const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        req.user = decodedToken;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const isAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    if (!user || !user.is_admin) {
        return res.status(403).json({ message: 'Admin privileges are required' });
    }
    return next();
};
