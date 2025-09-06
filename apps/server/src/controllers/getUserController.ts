import { Request, Response } from "express";
import prisma from "@repo/db/client";

export default async function getUserController(req: Request, res: Response) {
    try {
        const { userId } = req.params;

        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required",
            });
            return;
        }

        // Find user with rooms
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                walletAddress: true,
                Rooms: true,
            },
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }

        // Get all friendships where user is either sender or receiver and status = ACCEPTED
        const friendships = await prisma.friendship.findMany({
            where: {
                status: "ACCEPTED",
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            select: {
                id: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        walletAddress: true
                    },
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        walletAddress: true,
                    },
                },
            },
        });

        // Extract the "other user" from each friendship
        const friends = friendships.map((f) =>
            f.sender.id === userId ? f.receiver : f.sender
        );

        res.status(200).json({
            success: true,
            data: {
                ...user,
                friends,
            },
        });
    } catch (error) {
        console.error("Error in getUserController:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
