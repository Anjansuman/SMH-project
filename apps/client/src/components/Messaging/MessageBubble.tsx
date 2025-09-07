"use client";

import { ChatMessage } from "@/src/types/prisma-types";

interface MessageBubbleProps {
    chatMessage: ChatMessage;
    currentUserId: string;
}

export default function MessageBubble({ chatMessage, currentUserId }: MessageBubbleProps) {
    const isSentByCurrentUser = chatMessage.senderId === currentUserId;

    const createdAt = new Date(chatMessage.createdAt);
    const hours = createdAt.getHours();
    const minutes = createdAt.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

    return (
        <div
            className={`flex w-full ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`
                    max-w-[70%] px-3 py-1 rounded-xl break-words
                    ${isSentByCurrentUser ? "bg-[#393731] text-white rounded-br-none" : "bg-gray-800 text-neutral-200 rounded-bl-none"}
                `}
            >
                <p className="text-sm mr-4">{chatMessage.message}</p>
                <span className="text-[8px] text-neutral-400 float-right mt-1">
                    {formattedTime}
                </span>
            </div>
        </div>
    );
}
