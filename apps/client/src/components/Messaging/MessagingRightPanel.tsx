import { useState, useEffect, KeyboardEvent } from "react";
import { cn } from "@/src/lib/utils";
import CurrentMessagingRoom from "./CurrentMessagingRoom";
import MessageRenderer from "./MessageRenderer";
import { useChatsStore } from "@/src/store/chats/useChatsStore";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import { ChevronRight } from "lucide-react";
import { useWebSocket } from "@/src/hooks/useWebSocket";
import getUserChats from "@/src/backend/get-user-chats";


export default function MessagingRightPanel() {
    const { currentRoom, appendMessage, setMessages } = useChatsStore();
    const { session } = useUserSessionStore();
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const { handleSendChatMessage } = useWebSocket();

    // Fetch messages whenever room changes
    useEffect(() => {
        if (!currentRoom) return;

        const loadMessages = async () => {
            try {
                setLoading(true);
                const messages = await getUserChats(currentRoom.id, session?.user.token!);
                setMessages(currentRoom.id, messages); // store in Zustand
            } catch (err) {
                console.error("Failed to load messages:", err);
            } finally {
                setLoading(false);
            }
        };

        loadMessages();
    }, [currentRoom]);

    const sendMessage = () => {
        if (!messageText.trim() || !currentRoom) return;

        const payload = {
            id: crypto.randomUUID(),
            roomId: currentRoom.id,
            senderId: session?.user.id || "",
            message: messageText,
            createdAt: new Date(),
        };

        setMessageText("");
        handleSendChatMessage({
            id: payload.id,
            roomId: payload.roomId,
            message: payload.message,
        });

        appendMessage(currentRoom.id, payload); // update local state
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="h-full w-full flex flex-col relative bg-black">
            <CurrentMessagingRoom />

            <div className="flex-1 overflow-y-auto px-3 py-2">
                {loading ? (
                    <div className="text-neutral-500 text-center mt-4">Loading messages...</div>
                ) : (
                    <MessageRenderer />
                )}
            </div>

            <div className="w-full h-16 px-3 py-2 border-t border-neutral-800 flex items-center relative">
                <input
                    placeholder="Type a message..."
                    value={messageText}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setMessageText(e.target.value)}
                    className={cn(
                        "w-full h-10 bg-neutral-900 rounded-md focus:outline-none px-3 text-white placeholder:text-neutral-500 pr-12"
                    )}
                />
                <div
                    onClick={sendMessage}
                    className="absolute right-5 top-1/2 -translate-y-1/2 flex justify-center items-center p-1 hover:bg-neutral-950 transition-colors rounded-full cursor-pointer"
                >
                    <ChevronRight className="text-neutral-200 stroke-1 w-5 h-5" />
                </div>
            </div>
        </div>
    );
}
