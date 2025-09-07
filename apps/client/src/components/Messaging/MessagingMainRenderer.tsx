import { useChatsStore } from "@/src/store/chats/useChatsStore";
import MessagingLeftPanel from "./MessagingLeftPanel";
import MessagingRightPanel from "./MessagingRightPanel";


export default function MessagingMainRenderer() {

    const { currentRoom } = useChatsStore();

    return (
        <div className="h-full w-full rounded-lg border border-neutral-700 overflow-hidden flex ">
            <MessagingLeftPanel />
            {currentRoom ? (
                <MessagingRightPanel />
            ) : (
                <div className="w-full h-full bg-neutral-950/90 flex justify-center items-center text-neutral-200/70 select-none">
                    Select any user or room to start chatting
                </div>
            )}
        </div>
    );
}