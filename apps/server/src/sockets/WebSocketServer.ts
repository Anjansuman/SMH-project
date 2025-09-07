import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import { CustomWebSocket, MESSAGE_TYPE, SentMessageType } from "../types/web-socket-types";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma, { FriendshipStatus, MessageType } from "@repo/db/client";
import type DatabaseQueue from "../queue/DatabaseQueue";
import { databaseQueueInstance, redisCacheInstance } from "../services/init-services";
import RedisCache from "../cache/RedisCache";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

interface AuthUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
}

export default class WebsocketServer {
    private wss: WebSocketServer;
    private socketMapping: Map<string, CustomWebSocket>; // ws.id -> websocket
    private roomUsersMapping: Map<string, Set<string>>; // roomId -> [ws.id]
    private userSocket: Map<string, string>; // userId -> ws.id

    private databaseQueue: DatabaseQueue;
    private redisCache: RedisCache;

    constructor(server: Server) {
        this.wss = new WebSocketServer({ server });

        this.databaseQueue = databaseQueueInstance;
        this.redisCache = redisCacheInstance;

        this.socketMapping = new Map();
        this.roomUsersMapping = new Map();
        this.userSocket = new Map();

        this.init();
    }

    private init() {
        try {
            this.wss.on("connection", (ws: CustomWebSocket, req) => {
                this.validateConnection(ws, req);

                ws.on("message", (data: string) => {
                    this.handleMessage(ws, data);
                });

                ws.on("close", () => {
                    this.cleanupSocket(ws);
                });

                ws.on("error", (error: unknown) => {
                    this.handleError(error);
                    this.cleanupSocket(ws);
                });
            });
        } catch (error) {
            this.handleError(error);
        }
    }

    private validateConnection(ws: CustomWebSocket, req: any) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const authToken = url.searchParams.get("token");
        if (!authToken) {
            ws.close();
            return;
        }

        const token = authToken.split(' ')[1];
        if (!token) {
            ws.close();
            return;
        }
        this.extractToken(ws, token);
    }

    private extractToken(ws: CustomWebSocket, token: string) {
        try {
            jwt.verify(token, JWT_SECRET!, async (err, decoded) => {
                if (err) {
                    ws.close();
                    return;
                }
                const decodedUser = decoded as AuthUser;
                await this.connectUser(ws, decodedUser.id);
            });
        } catch (error) {
            console.error("Error in extracting token: ", error);
            ws.close();
        }
    }

    private async connectUser(ws: CustomWebSocket, userId: string) {
        const validatedUser = await this.validateUserInDB(userId);

        if (!validatedUser) {
            ws.close();
            return;
        }

        // ✅ FIX 1: assign id before using it in socketMapping
        ws.id = this.getSocketId();

        const existingUser = this.socketMapping.get(ws.id);
        if (existingUser && existingUser.readyState === WebSocket.OPEN) {
            existingUser.close();
            this.cleanupSocket(existingUser); // cleanup old socket
        }

        // ✅ always initialize ws.user here
        ws.user = {
            id: validatedUser.id,
            name: validatedUser.name,
        };

        this.socketMapping.set(ws.id, ws);
        this.createRooms(ws, validatedUser);
    }

    private async createRooms(
        ws: CustomWebSocket,
        validatedUser: {
            id: string;
            name: string;
            email: string;
            image: string | null;
            walletAddress: string | null;
            Rooms: { id: string; private: boolean }[];
            sentFriendRequests: {
                id: string;
            }[];
            receivedFriendRequests: {
                id: string;
            }[];
        }
    ) {
        await this.redisCache.setUser(validatedUser.id, validatedUser);
        this.userSocket.set(validatedUser.id, ws.id);

        try {

            for (const friend of validatedUser.sentFriendRequests) {
                const usersInRoom = this.roomUsersMapping.get(friend.id) ?? new Set<string>();
                usersInRoom.add(ws.id);
                this.roomUsersMapping.set(friend.id, usersInRoom);
            }

            for (const friend of validatedUser.receivedFriendRequests) {
                const usersInRoom = this.roomUsersMapping.get(friend.id) ?? new Set<string>();
                usersInRoom.add(ws.id);
                this.roomUsersMapping.set(friend.id, usersInRoom);
            }

            for (const room of validatedUser.Rooms) {
                const usersInRoom = this.roomUsersMapping.get(room.id) ?? new Set<string>();
                usersInRoom.add(ws.id);
                this.roomUsersMapping.set(room.id, usersInRoom);
            }
        } catch (error) {
            console.error("Error while setting rooms: ", error);
            return;
        }
    }

    private handleMessage(ws: CustomWebSocket, data: string) {
        try {
            const message = JSON.parse(data);
            const { type, payload } = message;

            switch (type) {
                case MESSAGE_TYPE.JOIN_CHAT:
                    this.handleJoinChat(ws, payload);
                    break;

                case MESSAGE_TYPE.LEAVE_CHAT:
                    // TODO: implement leave logic
                    break;

                case MESSAGE_TYPE.SEND_CHAT_MESSAGE:
                    this.handleSendMessage(ws, payload);
                    break;

                case MESSAGE_TYPE.SEND_FRIEND_REQUEST:
                    this.handleSendFriendRequest(ws, payload);
                    break;

                case MESSAGE_TYPE.ACCEPT_FRIEND_REQUEST:
                    this.handleAcceptFriendRequest(ws, payload);
                    break;

                case MESSAGE_TYPE.SEND_CRYPTO:
                    this.handleSendCrypto(ws, payload);
                    break;

                default:
                    console.error("UNKNOWN MESSAGE TYPE: ", type);
                    break;
            }
        } catch (error) {
            this.handleError(error);
            return;
        }
    }

    private async handleJoinChat(ws: CustomWebSocket, payload: any) {
        try {
            // TODO: implement join chat logic
        } catch (error) {
            this.handleError(error);
        }
    }

    private async handleSendMessage(ws: CustomWebSocket, payload: any) {
        try {
            if (!ws.user) {
                console.error("Attempted to send message without authenticated user");
                return;
            }

            const { id, roomId, message } = payload;
            const user = await this.redisCache.getUser(ws.user.id);

            if (!user) {
                console.error("user doesn't exist in cache");
                return;
            }

            const createdAt = new Date();

            const sendingMessage: SentMessageType = {
                type: MESSAGE_TYPE.SEND_CHAT_MESSAGE,
                payload: {
                    roomId: roomId,
                    id: id,
                    message: message,
                    createdAt: createdAt,
                    senderId: ws.user.id,
                },
            };

            this.broadcastMessage(
                sendingMessage,
                roomId,
                ws.user.id,
            );

            this.databaseQueue.createChatMessage(
                id,
                roomId,
                ws.user.id,
                message,
                createdAt,
            );
        } catch (error) {
            console.error("Error in sending message: ", error);
            return;
        }
    }

    private async handleSendFriendRequest(ws: CustomWebSocket, payload: any) {
        try {
            if (!ws.user) {
                console.error("Attempted to send friend request without authenticated user");
                return;
            }

            const { userId } = payload;
            if (!userId) return;

            const user = await this.redisCache.getUser(ws.user.id);
            if (!user) return;

            const receiverSocketId = this.userSocket.get(userId);
            if (!receiverSocketId) return;

            const friendshipId = this.getUuid();

            const eventData: SentMessageType = {
                type: MESSAGE_TYPE.SEND_FRIEND_REQUEST,
                payload: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    friendshipId: friendshipId,
                },
            };

            this.broadcastMessage(eventData, undefined, undefined, receiverSocketId);

            this.databaseQueue.createFriendShip(
                friendshipId,
                ws.user.id,
                userId,
                FriendshipStatus.PENDING,

            );
        } catch (error) {
            console.error("Error in sending friend request: ", error);
        }
    }

    private async handleAcceptFriendRequest(ws: CustomWebSocket, payload: any) {
        try {
            if (!ws.user) {
                console.error("Attempted to send friend request without authenticated user");
                return;
            }

            const { friendshipId, userId } = payload;
            if (!userId) return;

            const user = await this.redisCache.getUser(ws.user.id);
            if (!user) return;

            const senderSocketId = this.userSocket.get(userId);
            if (!senderSocketId) return;

            const event_data: SentMessageType = {
                type: MESSAGE_TYPE.ACCEPT_FRIEND_REQUEST,
                payload: {
                    name: user.name,
                    message: "Friend request accepted",
                },
            };

            this.broadcastMessage(
                event_data,
                undefined,
                undefined,
                senderSocketId,
            );

            const usersInRoom = this.roomUsersMapping.get(friendshipId) ?? new Set<string>();
            usersInRoom.add(ws.id);
            usersInRoom.add(senderSocketId);
            this.roomUsersMapping.set(friendshipId, usersInRoom);

            // update this in database queue
            this.databaseQueue.updateFriendShip(
                friendshipId,
                userId,
                ws.user.id,
                FriendshipStatus.ACCEPTED,
            );

        } catch (error) {

        }
    }

    private async handleSendCrypto(ws: CustomWebSocket, payload: any) {

        const { id, amount } = payload;

        if (!id || !amount) {
            return;
        }

        const user = await this.redisCache.getUser(ws.user.id);

        if (!user) {
            console.error("User not available in cache");
            return;
        }

        const receiver = this.userSocket.get(id);
        if(!receiver) {
            return;
        }

        const event_data: SentMessageType = {
            type: MESSAGE_TYPE.SEND_CRYPTO,
            payload: {
                name: user.name,
                amount: amount,
            },
        };

        this.broadcastMessage(event_data, undefined, undefined, receiver);
    }

    private broadcastMessage(
        message: any,
        roomId?: string,
        excludeSocketId?: string,
        onlySocketId?: string
    ) {
        if (onlySocketId) {
            const socketIdExists = this.socketMapping.get(onlySocketId);
            if (socketIdExists && socketIdExists.readyState === WebSocket.OPEN) {
                socketIdExists.send(JSON.stringify(message));
            }
            return;
        }

        const userSocketIds = this.roomUsersMapping.get(roomId!);
        userSocketIds?.forEach((socketId) => {
            if (excludeSocketId === socketId) return;
            const userSocketId = this.socketMapping.get(socketId);
            if (userSocketId && userSocketId.readyState === WebSocket.OPEN) {
                userSocketId.send(JSON.stringify(message));
            }
        });
    }

    private cleanupSocket(ws: CustomWebSocket) {
        if (ws.id && this.socketMapping.has(ws.id)) {
            this.socketMapping.delete(ws.id);
        }
    }

    private async validateUserInDB(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                walletAddress: true,
                Rooms: true,
                sentFriendRequests: {
                    select: { id: true }, // friendship id where user is sender
                },
                receivedFriendRequests: {
                    select: { id: true }, // friendship id where user is receiver
                },
            },
        });
    }

    private getUuid() {
        return uuid();
    }

    private getSocketId() {
        return uuid();
    }

    private handleError(error: unknown) {
        if (error instanceof Error) {
            console.error("WEBSOCKET error: ", error);
        } else {
            console.error("unknown WEBSOCKET error", error);
        }
    }
}
