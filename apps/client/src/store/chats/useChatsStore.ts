import { ChatMessage } from "@/src/types/prisma-types";
import { create } from "zustand";

// Minimal room type
interface BaseRoom {
    id: string;
    name: string;
}

// Friendship as room
interface FriendRoom extends BaseRoom {
    image?: string;
    email?: string;
    walletAddress?: string;
}

// Union of both
type Room = BaseRoom | FriendRoom;

interface ChatsStore {
    roomChat: Record<string, ChatMessage[]>; // key = roomId / friendshipId
    rooms: Room[];

    // Chat actions
    setMessages: (roomId: string, messages: ChatMessage[]) => void;
    appendMessage: (roomId: string, message: ChatMessage) => void;
    clearRoomChat: (roomId: string) => void;
    clearAllChats: () => void;

    // Room actions
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    updateRoom: (roomId: string, updates: Partial<Room>) => void;
    removeRoom: (roomId: string) => void;
    clearRooms: () => void;
}

export const useChatStore = create<ChatsStore>((set) => ({
    roomChat: {},
    rooms: [],

    // Chat actions
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

    clearRoomChat: (roomId) =>
        set((state) => {
            const newRoomChat = { ...state.roomChat };
            delete newRoomChat[roomId];
            return { roomChat: newRoomChat };
        }),

    clearAllChats: () => set({ roomChat: {} }),

    // Room actions
    setRooms: (rooms) => set({ rooms }),

    addRoom: (room) =>
        set((state) => ({
            rooms: [...state.rooms, room],
        })),

    updateRoom: (roomId, updates) =>
        set((state) => ({
            rooms: state.rooms.map((room) =>
                room.id === roomId ? { ...room, ...updates } : room
            ),
        })),

    removeRoom: (roomId) =>
        set((state) => ({
            rooms: state.rooms.filter((room) => room.id !== roomId),
        })),

    clearRooms: () => set({ rooms: [] }),
}));
