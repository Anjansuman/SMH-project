import { useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import { MESSAGE_TYPE } from "../types/web-socket-types";
import EventHandler from "../lib/event-handler";


export default function useSubscribeEventHandler() {

    const { subscribeToHandler, unsubscribeToHandler } = useWebSocket();

    useEffect(() => {

        subscribeToHandler(
            MESSAGE_TYPE.SEND_FRIEND_REQUEST,
            EventHandler.handleFriendRequest
        );

        subscribeToHandler(
            MESSAGE_TYPE.ACCEPT_FRIEND_REQUEST,
            EventHandler.handleAcceptFriendRequest
        )

        return () => {
            unsubscribeToHandler(
                MESSAGE_TYPE.SEND_FRIEND_REQUEST,
                EventHandler.handleFriendRequest
            );

            unsubscribeToHandler(
                MESSAGE_TYPE.ACCEPT_FRIEND_REQUEST,
                EventHandler.handleAcceptFriendRequest
            )
        }

    }, [
        subscribeToHandler,
        unsubscribeToHandler
    ]);

}