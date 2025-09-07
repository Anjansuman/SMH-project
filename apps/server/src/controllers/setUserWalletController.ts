import prisma from "@repo/db/client";
import { Request, Response } from "express";


export default async function setUserWalletController(req: Request, res: Response) {
    try {

        const { walletAddress } = req.body;

        if(!walletAddress) {
            res.status(401).json({
                success: false,
                message: 'Wallet not found',
            });
            return;
        }

        if(!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                message: 'User not found in token',
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });

        if(!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                walletAddress: walletAddress,
            },
        });

        res.status(200).json({
            success: true,
            message: 'wallet address updated',
        });
        return;
        
    } catch (error) {
        console.error('Error in setting wallet to user: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}