import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default class token {

    static signToken(name: string, email: string, id: string) {
        try {
            const secret = process.env.JWT_SECRET;

            if (!secret) {
                return {
                    success: false,
                    cause: 'JWT secret failed to load',
                    data: null,
                }
            }

            const jwtPayload = {
                name: name,
                email: email,
                id: id,
            }

            const token = 'Bearer ' + jwt.sign(jwtPayload, secret);
            return {
                success: true,
                cause: 'token validated',
                data: token,
            };
        } catch (error) {
            console.error("Error in signing token: ", error);
            return {
                success: false,
                cause: error,
                data: null
            }
        }
    }

    static verifyToken(req: Request, res: Response, next: NextFunction) {
        try {

            const secret = process.env.JWT_SECRET;

            if (!secret) {
                res.status(500).json({
                    message: 'Internal server error',
                });
                return;
            }

            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer")) {
                res.status(401).json({
                    message: 'Unauthorised token',
                });
                return;
            }

            const token = authHeader.split(' ')[1];

            if(!token) {
                res.status(404).json({
                    message: "Token not found",
                });
                return;
            }

            jwt.verify(token, secret, (err, decoded) => {
                if(err) {
                    res.status(500).json({
                        message: 'Not authorised',
                    });
                    return;
                }
                req.user = decoded as AuthUser;
                next();
            });

        } catch (error) {
            console.error("Error in verifying token: ", error);
            res.status(500).json({
                message: 'Internal server error',
            });
            return;
        }
    }

}