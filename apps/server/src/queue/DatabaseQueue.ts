import Bull from "bull";
import { JobOption, QueueJobTypes } from "../types/database-queue-type";
import prisma, { FriendshipStatus, MessageType } from "@repo/db/client";
import RedisCache from "../cache/RedisCache";
import { redisCacheInstance } from "../services/init-services";
import { connect } from "http2";

interface CreateChatMessageJobType {
    id: string; // senderId
    roomId: string;
    senderId: string;
    message: string;
    createdAt: Date;
}

interface CreateFriendshipJobType {
    id: string,
    senderId: string;
    receiverId: string;
    friendshipStatus: FriendshipStatus;
}

interface UpdateFriendshipJobType {
    id: string,
    senderId: string;
    receiverId: string;
    friendshipStatus: FriendshipStatus;
}

const REDIS_URL = process.env.REDIS_URL;

export default class DatabaseQueue {
    private databaseQueue: Bull.Queue;
    private redisCache: RedisCache;
    private defaultJobOptions: JobOption = {
        attempts: 3,
        delay: 1000,
        removeOnComplete: 10,
        removeOfFail: 5
    };

    constructor() {
        this.databaseQueue = new Bull("database-operations", {
            redis: REDIS_URL,
        });
        this.redisCache = redisCacheInstance;
        this.setupProcessors();
    }

    private setupProcessors() {
        this.databaseQueue.process(
            QueueJobTypes.CREATE_CHAT_MESSAGE,
            this.createChatMessageProcessor.bind(this),
        );
        this.databaseQueue.process(
            QueueJobTypes.CREATE_FRIENDSHIP,
            this.createFriendShipProcessor.bind(this),
        );
        this.databaseQueue.process(
            QueueJobTypes.UPDATE_FRIENDSHIP,
            this.updateFriendShipProcessor.bind(this),
        );
    }

private async createChatMessageProcessor(job: Bull.Job) {
    try {
        const { id, roomId, senderId, message, createdAt }: CreateChatMessageJobType = job.data;


        let createChatMessage;

        const room = await prisma.room.findUnique({
            where: { id: roomId },
        });

        if (room) {
            createChatMessage = await prisma.chatMessage.create({
                data: {
                    id,
                    message,
                    senderId,
                    roomId,
                    createdAt,
                },
            });
        } else {
            // 2. Try Friendship instead
            const friendship = await prisma.friendship.findUnique({
                where: { id: roomId },
            });

            if (!friendship) {
                throw new Error(`No Room or Friendship found with id ${roomId}`);
            }

            createChatMessage = await prisma.chatMessage.create({
                data: {
                    id,
                    message,
                    senderId,
                    friendshipId: roomId,
                    createdAt,
                },
            });
        }

        return {
            success: true,
            chatMessage: createChatMessage,
        };
    } catch (error) {
        console.error("Error while processing chat message create: ", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}


    private async createFriendShipProcessor(job: Bull.Job) {
        try {
            const { id, senderId, receiverId, friendshipStatus }: CreateFriendshipJobType =
                job.data;

            const createFriendship = await prisma.friendship.create({
                data: {
                    id: id,
                    senderId,
                    receiverId,
                    status: friendshipStatus,
                },
            });

            // add this friend to redis to stop resending requests
            // await this.redisCache.updateUser(senderId, {
                
            // })

            return {
                success: true,
                friendship: createFriendship,
            };
        } catch (error) {
            console.error("Error while processing friendship create: ", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    private async updateFriendShipProcessor(job: Bull.Job) {
        try {
            const { id, senderId, receiverId, friendshipStatus }: UpdateFriendshipJobType =
                job.data;

            const updateFriendship = await prisma.friendship.update({
                where: {
                    id,
                    senderId,
                    receiverId,
                },
                data: {
                    status: friendshipStatus,
                },
            });

            return {
                success: true,
                updatedCount: updateFriendship,
            };
        } catch (error) {
            console.error("Error while processing friendship update: ", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }

    public async createChatMessage(
        id: string, // senderId
        roomId: string,
        senderId: string,
        message: string,
        createdAt: Date,
        options?: Partial<JobOption>,
    ) {
        return await this.databaseQueue
            .add(
                QueueJobTypes.CREATE_CHAT_MESSAGE,
                { id, roomId, senderId, message, createdAt },
                { ...this.defaultJobOptions, ...options },
            )
            .catch((error) =>
                console.error("Failed to enqueue chat message: ", error),
            );
    }

    public async createFriendShip(
        id: string, // friendshipId generated
        senderId: string,
        receiverId: string,
        friendshipStatus: FriendshipStatus,
        options?: Partial<JobOption>,
    ) {
        return await this.databaseQueue
            .add(
                QueueJobTypes.CREATE_FRIENDSHIP,
                { id, senderId, receiverId, friendshipStatus },
                { ...this.defaultJobOptions, ...options },
            )
            .catch((error) =>
                console.error("Failed to enqueue friendship create: ", error),
            );
    }

    public async updateFriendShip(
        id: string, // friendshipId
        senderId: string,
        receiverId: string,
        friendshipStatus: FriendshipStatus,
        options?: Partial<JobOption>,
    ) {
        return await this.databaseQueue
            .add(
                QueueJobTypes.UPDATE_FRIENDSHIP,
                { id, senderId, receiverId, friendshipStatus },
                { ...this.defaultJobOptions, ...options },
            )
            .catch((error) =>
                console.error("Failed to enqueue friendship update: ", error),
            );
    }
}
