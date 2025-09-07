"use client";

import { createContext } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const WebSocketContext = createContext<any | null>(null);

interface WebSocketProviderProps {
    children: React.ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
    const socket = useWebSocket();

    return (
        <WebSocketContext.Provider value={socket} >
            {children}
        </WebSocketContext.Provider>
    );
}

import { useContext } from "react";

export function useWebSocketContext() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocketContext must be used within a WebSocketProvider");
    }
    return context;
}