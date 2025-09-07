import { useChatsStore } from "@/src/store/chats/useChatsStore";
import Image from "next/image";
import { toast } from "sonner";
import { notify } from "../ui/notification";



export default function CurrentMessagingRoom() {

    const { currentRoom } = useChatsStore();

    return (
        <div className="absolute flex justify-between items-center top-0 left-0 w-full h-20 bg-black border-b border-neutral-800 px-5 py-2 select-none ">
            <div className="flex justify-start items-center gap-x-3">
                <div
                    className="h-8 w-8 rounded-full border border-neutral-600 overflow-hidden cursor-pointer"
                >
                    {currentRoom && currentRoom.image ? (<Image
                        src={currentRoom.image}
                        alt={currentRoom.name}
                        unoptimized
                        width={32}
                        height={32}
                        className="h-8 w-8 object-cover"
                    />) : (
                        <div className="w-8 h-8 flex justify-center items-center bg-neutral-700 rounded-full "></div>
                    )}
                </div>
                <div className=" ">
                    {currentRoom?.name}
                </div>
            </div>
            <div>
                <div
                    className="flex justify-center items-center px-4 py-2 text-[#D8CFBC] font-extralight border border-[#565449] rounded-lg cursor-pointer hover:-translate-y-0.5 transition-transform active:translate-y-0.5 "
                    onClick={() => {
                        if(currentRoom && currentRoom.walletAddress && currentRoom.friendId) {
                            notify().paymentSent(currentRoom.walletAddress, currentRoom.friendId);
                        } else {
                            toast.error(`${currentRoom?.name} has not configured their wallet yet.`)
                        }
                    }}
                >
                    Send crypto
                </div>
            </div>
        </div>
    );
}