import { FaCopy } from "react-icons/fa";
import ToolTipComponent from "./TooltipComponent";
import { toast } from "sonner";
import { cn } from "@/src/lib/utils";
import { useWebSocket } from "@/src/hooks/useWebSocket";
import { notify } from "../ui/notification";

interface UserCardModalProps {
    name: string;
    id: string;
    email: string;
    image: string;
    walletAddress?: string;
}

export default function UserCardModal({ name, id, email, image, walletAddress }: UserCardModalProps) {

    const { handleSendFriendRequest } = useWebSocket();

    async function copyId() {
        await navigator.clipboard.writeText(id);
        toast.success('User ID copied to clipboard');
    }

    async function copyWalletAddress() {
        await navigator.clipboard.writeText(walletAddress!);
        toast.success('wallet address copied to clipboard')
    }

    function sendFriendRequest() {
        const payload = {
            userId: id,
        };
        handleSendFriendRequest(payload);
        toast.success("Friend request sent successfully!");
    }

    return (
        <div className="w-[400px] rounded-2xl bg-[#1c1c1c] border border-[#3d3932] overflow-hidden p-5 flex justify-center items-center ">
            <div className="w-full flex flex-col justify-center items-center gap-y-3">
                <div className="w-full flex justify-start items-center gap-x-3 overflow-hidden">
                    <img
                        src={image}
                        alt={name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full border border-[#3d3932]"
                    />
                    <div
                        className="w-full px-3 py-1 rounded-md bg-[#2c2c2c] border border-[#3d3932] text-[#D8CFBC] text-sm font-mono truncate flex justify-between items-center"
                    >
                        <div></div>
                        <div>
                            {name}
                        </div>
                        <ToolTipComponent content={"copy User ID"}>
                            <FaCopy size={12} className="cursor-pointer hover:text-[#D8CFBC] transition-colors " onClick={copyId} />
                        </ToolTipComponent>
                    </div>
                </div>

                <div className="w-full flex justify-start items-center gap-x-3">
                    <div className="flex items-center justify-center px-3 py-1 rounded-md bg-[#2c2c2c] border border-[#3d3932] text-[#D8CFBC] text-sm font-mono">
                        email:
                    </div>
                    <div className="w-full flex items-center justify-center px-3 py-1 rounded-md bg-[#2c2c2c] border border-[#3d3932] text-[#D8CFBC] text-sm font-mono">
                        {email}
                    </div>
                </div>

                <div className="w-full flex justify-start items-center gap-x-3">
                    <div className="min-w-32 w-fit flex items-center justify-center px-3 py-1 rounded-md bg-[#2c2c2c] border border-[#3d3932] text-[#D8CFBC] text-sm font-mono">
                        wallet address:
                    </div>
                    <div className={cn(
                        "w-full flex items-center px-3 py-1 rounded-md bg-[#2c2c2c] border border-[#3d3932] text-[#D8CFBC] text-sm font-mono",
                        walletAddress ? 'justify-between' : 'justify-center'
                    )}>
                        {walletAddress ? (
                            <>
                                <div></div>
                                <div className="w-40 truncate">
                                    {walletAddress}
                                </div>
                                <ToolTipComponent content={"copy Wallet Address"}>
                                    <FaCopy size={12} className="cursor-pointer hover:text-[#D8CFBC] transition-colors " onClick={copyWalletAddress} />
                                </ToolTipComponent>
                            </>
                        ) : (
                            'wallet is not configured yet'
                        )}
                    </div>
                </div>

                <div className="w-full flex justify-center items-center gap-x-3 mt-6">
                    <div
                        className="flex items-center justify-center px-5 py-1.5 rounded-md bg-[#2c2c2c] hover:bg-[#3c3c3c] transition-colors duration-200 ease-in-out border border-[#D8CFBC] text-[#D8CFBC] text-sm font-mono cursor-pointer"
                        onClick={() => {
                            if (walletAddress !== '' && id) {
                                notify().paymentSent(walletAddress, id);
                            } else {
                                toast.error(`${name} has not configured their wallet yet.`);
                            }
                        }}
                    >
                        Send Crypto
                    </div>
                    <div
                        className="flex items-center justify-center px-5 py-1.5 rounded-md bg-[#fb2c3656] hover:bg-[#fb2c3675] transition-colors duration-200 ease-in-out border border-red-400 text-[#D8CFBC] text-sm font-mono cursor-pointer"
                        onClick={sendFriendRequest}
                    >
                        Send Friend request
                    </div>
                </div>
            </div>
        </div>
    );
}