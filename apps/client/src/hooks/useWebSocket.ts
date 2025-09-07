import { useEffect, useRef } from "react";
import WebSocketClient, { MessagePayload } from "../socket/socket"
import { MESSAGE_TYPE } from "../types/web-socket-types";
import { useUserSessionStore } from "../store/user/useUserSessionStore";
import { cleanWebSocketClient, getWebSocketClient } from "../lib/singleton-socket";



export const useWebSocket = () => {
    const socket = useRef<WebSocketClient | null>(null);
    const lastUserIdRef = useRef<string | null>(null);
    const { session } = useUserSessionStore();

    useEffect(() => {

        if(!session || !session.user || !session.user.token) {
            return;
        }

        const token = session.user.token;

        if(lastUserIdRef.current === token) {
            socket.current = getWebSocketClient(token);
            return;
        }

        lastUserIdRef.current = token;
        socket.current = getWebSocketClient(token);

        return () => {
            if(lastUserIdRef.current !== token) {
                cleanWebSocketClient();
                socket.current = null;
            }
        }

    }, [session]);

    function subscribeToHandler(type: string, handler: (payload: unknown) => void) {
        if (!socket.current) {
            console.warn('Attempting to subscribe but no socket connection available');
            return;
        }
        socket.current.subscribe_to_handlers(type, handler);
    }

    function unsubscribeToHandler(type: string, handler: (payload: unknown) => void) {
        if (!socket.current) {
            console.warn('Attempting to subscribe but no socket connection available');
            return;
        }
        socket.current.unsubscribe_to_handlers(type, handler);
    }

    function handleSendChatMessage(payload: unknown) {
        const message: MessagePayload = {
            type: MESSAGE_TYPE.SEND_CHAT_MESSAGE,
            payload: payload,
        };
        if(socket.current) {
            socket.current.send_message(message);
        }
    }

    function handleSendFriendRequest(payload: unknown) {
        const message: MessagePayload = {
            type: MESSAGE_TYPE.SEND_FRIEND_REQUEST,
            payload: payload,
        };


        if(socket.current) {
            socket.current.send_message(message);
        }
    }

    function handleSendCrypto(payload: unknown) {
        const message: MessagePayload = {
            type: MESSAGE_TYPE.SEND_CRYPTO,
            payload: payload,
        };
        if(socket.current) {
            socket.current.send_message(message);
        }
    }

    function handleAcceptFriendRequest(payload: unknown) {
        const message: MessagePayload = {
            type: MESSAGE_TYPE.ACCEPT_FRIEND_REQUEST,
            payload: payload,
        };
        if(socket.current) {
            socket.current.send_message(message);
        }
    }

    return {
        socket: socket.current,
        isConnected: socket.current?.is_connected || false,
        subscribeToHandler,
        unsubscribeToHandler,
        handleSendChatMessage,
        handleSendFriendRequest,
        handleSendCrypto,
        handleAcceptFriendRequest,
    }

}