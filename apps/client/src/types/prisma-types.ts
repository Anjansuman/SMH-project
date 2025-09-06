
// ------------------ TYPES ----------------- //

export enum FriendshipStatus {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    BLOCKED = "BLOCKED",
}

export enum MessageType {
    MESSAGE = "MESSAGE",
    PAYMENT = "PAYMENT",
    LOCATION = "LOCATION",
    FRIEND_REQUEST = "FRIEND_REQUEST",
    JOIN_NEW_GROUP = "JOIN_NEW_GROUP",
    LEAVE_GROUP = "LEAVE_GROUP",
}

// ------------------ MODELS ----------------- //

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string | null;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    walletAddress?: string | null;

    // Relations
    sentFriendRequests?: Friendship[];
    receivedFriendRequests?: Friendship[];
    Rooms?: Room[];
    ChatMessage?: ChatMessage[];
}

export interface Friendship {
    id: string;
    createdAt: Date;
    status: FriendshipStatus;

    // Relations
    senderId: string;
    sender?: User;
    receiverId: string;
    receiver?: User;
}

export interface Room {
    id: string;
    private: boolean;

    // Relations
    users?: User[];
    chatMessage?: ChatMessage[];
}

export interface ChatMessage {
    id: string;
    message: string;
    createdAt: Date;

    senderId: string;
    sender?: User;

    roomId: string;
    room?: Room;
}
