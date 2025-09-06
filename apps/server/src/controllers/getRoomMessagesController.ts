import { Request, Response } from "express";
import prisma from "@repo/db/client";

export default async function getRoomMessagesController(req: Request, res: Response) {
    try {
        const { roomId } = req.params;

        if (!roomId) {
            res.status(400).json({
                success: false,
                message: "Room ID is required",
            });
            return;
        }

        // Fetch messages by roomId (this could be a Room.id or Friendship.id)
        // here the problem is any one can fetch this messages
        const messages = await prisma.chatMessage.findMany({
            where: { roomId },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                message: true,
                createdAt: true,
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },
        });

        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
        console.error("Error in getRoomMessagesController:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
