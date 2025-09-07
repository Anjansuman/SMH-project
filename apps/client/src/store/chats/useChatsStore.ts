import { ChatMessage } from "@/src/types/prisma-types";
import { create } from "zustand";

interface Room {
    id: string;
    name: string;
    image?: string | null;
    email?: string | null;
    walletAddress?: string | null;
    friendId?: string | null;
}

interface ChatsStore {
    rooms: Room[];
    roomChat: Record<string, ChatMessage[]>; // key = roomId / friendshipId
    currentRoom: Room | null;

    // Room functions
    setRooms: (rooms: Room[]) => void;
    appendRoom: (room: Room) => void;
    clearRooms: () => void;
    updateCurrentRoom: (room: Room) => void;

    // Chat functions
    setMessages: (roomId: string, messages: ChatMessage[]) => void;
    appendMessage: (roomId: string, message: ChatMessage) => void;
    clearRoom: (roomId: string) => void;
    clearAll: () => void;
}

export const useChatsStore = create<ChatsStore>((set) => ({
    rooms: [],
    roomChat: {},
    currentRoom: null,

    // Room management
    setRooms: (rooms) => set({ rooms }),
    appendRoom: (room) =>
        set((state) => ({
            rooms: [...state.rooms, room],
        })),
    clearRooms: () => set({ rooms: [] }),
    updateCurrentRoom: (room: Room) => set({
        currentRoom: room,
    }),

    // Chat management
    setMessages: (roomId, messages) =>
        set((state) => ({
            roomChat: {
                ...state.roomChat,
                [roomId]: messages,
            },
        })),

    appendMessage: (roomId, message) =>
        set((state) => ({
            roomChat: {
                ...state.roomChat,
                [roomId]: [...(state.roomChat[roomId] || []), message],
            },
        })),

    clearRoom: (roomId) =>
        set((state) => {
            const newRoomChat = { ...state.roomChat };
            delete newRoomChat[roomId];
            return { roomChat: newRoomChat };
        }),

    clearAll: () => set({ roomChat: {} }),
}));
