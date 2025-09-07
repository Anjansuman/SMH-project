import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';


export default function userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {

        const authToken = req.headers.authorization;

        if (!authToken || !authToken.startsWith('Bearer')) {
            res.status(400).json({
                success: false,
                message: 'user authentication failed',
            });
            return;
        }

        const token = authToken.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if (!token) {
            res.status(400).json({
                success: false,
                message: 'Token not found'
            });
            return;
        }

        if (!secret) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
            return;
        }

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Not authorized' });
                return;
            }
            req.user = decoded as AuthUser;
            next();
        });

    } catch (error) {
        console.error("Error while user auth: ", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}