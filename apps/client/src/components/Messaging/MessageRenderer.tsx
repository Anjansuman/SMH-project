"use client";

import { useChatsStore } from "@/src/store/chats/useChatsStore";
import MessageBubble from "./MessageBubble";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import { useEffect, useRef } from "react";

export default function MessageRenderer() {
    const { roomChat, currentRoom } = useChatsStore();
    const { session } = useUserSessionStore();

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const messages = currentRoom ? roomChat[currentRoom.id] || [] : [];

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
        }
    }, [currentRoom?.id]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

    return (
        <div className="w-full flex flex-col gap-y-2 p-4 overflow-y-auto custom-scrollbar h-full">
            {messages.length > 0 ? (
                messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        chatMessage={message}
                        currentUserId={session?.user.id!}
                    />
                ))
            ) : (
                <div className="text-neutral-500 text-center mt-4">
                    No messages yet
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}
