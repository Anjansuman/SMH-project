import { WebSocket } from "ws";


export interface CustomWebSocket extends WebSocket {
    id: string;
    user: {
        id: string,
    }
}

export interface SentMessageType {
    type: MESSAGE_TYPE;
    payload: any;
}


export enum MESSAGE_TYPE {
    JOIN_GROUP = 'JOIN_GROUP',
    LEAVE_GROUP = 'LEAVE_GROUP',
    EXIT_GROUP = 'EXIT_GROUP',

    JOIN_CHAT = 'JOIN_CHAT',
    LEAVE_CHAT = 'LEAVE_CHAT',
    EXIT_CHAT = 'EXIT_CHAT',

    SEND_CHAT_MESSAGE = 'SEND_CHAT_MESSAGE',

    SEND_MONEY_IN_CRYPTO = 'SEND_MONEY_IN_CRYPTO',
    SEND_MONEY_IN_CASH = 'SEND_MONEY_IN_CASH',
}