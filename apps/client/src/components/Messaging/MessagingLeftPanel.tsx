"use client";

import { useChatsStore } from "@/src/store/chats/useChatsStore";
import ProfileCard from "../utility/ProfileCard";
import { useState, useMemo } from "react";
import { cn } from "@/src/lib/utils";

export default function MessagingLeftPanel() {
    const { rooms, updateCurrentRoom } = useChatsStore();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredRooms = useMemo(() => {
        if (!searchQuery.trim()) return rooms;
        return rooms.filter((room) =>
            room.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [rooms, searchQuery]);

    return (
        <div className="h-full w-[30rem] bg-black/90 border-r border-neutral-800 flex flex-col gap-y-4 p-3">

            <div className="border-b border-neutral-800 pb-2">
                <input
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                        "w-full h-10 bg-neutral-900 rounded-lg focus:outline-none px-3 text-white placeholder:text-neutral-500"
                    )}
                />
            </div>

            <div className="flex-1 flex flex-col gap-y-1 overflow-y-auto custom-scrollbar ">
                {filteredRooms && filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                        <ProfileCard
                            key={room.id}
                            className="cursor-pointer select-none"
                            name={room.name}
                            id={room.walletAddress || room.id}
                            copyText={'copy Wallet Address'}
                            image={room.image || ""}
                            email={room.email || ""}
                            onClick={() => updateCurrentRoom(room)}
                        />
                    ))
                ) : (
                    <div className="p-4 text-neutral-500 text-center">
                        No users or rooms found
                    </div>
                )}
            </div>
        </div>
    );
}
