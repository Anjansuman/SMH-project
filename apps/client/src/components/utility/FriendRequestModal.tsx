"use client";

import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { BiBlock } from "react-icons/bi";
import { toast } from "sonner";
import ToolTipComponent from "./TooltipComponent";
import { useWebSocket } from "@/src/hooks/useWebSocket";

interface FriendRequestModalProps {
    fromUser: {
        id: string,
        name: string,
        email: string,
        image: string,
        description?: string,
        friendshipId: string,
    },
}

export default function FriendRequestModal({ fromUser }: FriendRequestModalProps) {

    const { handleAcceptFriendRequest } = useWebSocket();

    async function copyId() {
        await navigator.clipboard.writeText(fromUser.id);
        toast.success('user id copied to clipboard');
    }

    function onAccept() {
        const payload = {
            userId: fromUser.id,
            friendshipId: fromUser.friendshipId,
        };
        handleAcceptFriendRequest(payload);
    }

    function onReject() {

    }

    function onBlock() {

    }

    return (
        <div className="text-neutral-200 flex flex-col gap-y-5 ">
            <div className="w-full flex justify-center items-center ">
                <div className="w-full flex justify-center items-center text-lg font-light ">
                    Friend Request
                </div>
            </div>
            <div className="w-full flex justify-between items-center gap-x-3">
                <div className="w-fit flex justify-start items-center gap-x-4 ">
                    <div
                        className="h-9 w-9 rounded-full border border-neutral-600 overflow-hidden cursor-pointer"
                    >
                        <Image
                            src={fromUser.image}
                            alt={fromUser.name}
                            unoptimized
                            width={36}
                            height={36}
                            className="object-cover"
                        />
                    </div>
                    <div className="w-fit ">
                        <div className="w-full flex justify-between items-center">
                            <div>
                                {fromUser.name}
                            </div>
                        </div>
                        <div className={cn(
                            "text-sm text-neutral-200/70 "
                        )}>
                            {fromUser.email}
                        </div>
                    </div>
                </div>
                <ToolTipComponent content={"copy UserId"}>
                    <FaCopy size={12} className="cursor-pointer hover:text-[#D8CFBC] transition-colors " onClick={copyId} />
                </ToolTipComponent>
            </div>
            <div className="w-full flex justify-center items-center gap-x-3 text-xs ">
                <div
                    className="px-3 py-1.5 rounded-sm bg-green-500/30 border border-green-500/70 cursor-pointer hover:-translate-y-0.5 transition-transform "
                    onClick={onAccept}
                >
                    Accept
                </div>
                <div className="px-3 py-1.5 rounded-sm bg-red-500/30 border border-red-500/70 cursor-pointer hover:-translate-y-0.5 transition-transform ">
                    Reject
                </div>
            </div>
            <div className="text-sm text-neutral-200/70 flex justify-between items-center ">
                <div>
                    {fromUser.description ? fromUser.description : 'Hey! Let\'s be friends.'}
                </div>
                <ToolTipComponent content={"Block user"}>
                    <BiBlock
                        size={20}
                        className="text-red-500/70 cursor-pointer hover:text-red-500/80 transition-transform "
                    />
                </ToolTipComponent>
            </div>
        </div>
    );
}