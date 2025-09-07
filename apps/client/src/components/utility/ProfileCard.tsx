import { cn } from "@/src/lib/utils";
import Image from "next/image";
import { FaCopy } from "react-icons/fa";
import { toast } from 'sonner';
import ToolTipComponent from "./TooltipComponent";

interface ProfileCardProps {
    className?: string;
    variant?: 'ghost' | 'golden';
    image?: string;
    name: string;
    id: string;
    email?: string;
    onClick?: () => void;
    copyText?: string;
}

export default function ProfileCard({ className, variant = 'ghost', name, image, id, email, onClick, copyText }: ProfileCardProps) {

    async function copyId() {
        await navigator.clipboard.writeText(id);
        toast.success('user id copied to clipboard');
    }

    return (
        <div
            className={cn(
                "w-full border rounded-lg px-4 py-2 ",
                variant === 'ghost' ? 'border-neutral-700 text-neutral-200 ' : 'border-[#565449] text-[#D8CFBC] ',
                'flex justify-between items-center gap-x-3',
                className
            )}
            onClick={onClick}
        >
            <div
                className="h-8 w-8 rounded-full border border-neutral-600 overflow-hidden cursor-pointer"
            >
                {image ? (<Image
                    src={image}
                    alt={name}
                    unoptimized
                    width={32}
                    height={32}
                    className="h-8 w-8 object-cover"
                />) : (
                    <div className="w-8 h-8 flex justify-center items-center bg-neutral-200 rounded-full "></div>
                )}
            </div>
            <div className="w-full ">
                <div className="w-full flex justify-between items-center">
                    <div>
                        {name}
                    </div>
                    <ToolTipComponent content={"copy UserId"}>
                        <FaCopy size={12} className="cursor-pointer hover:text-[#D8CFBC] transition-colors " onClick={copyId} />
                    </ToolTipComponent>
                </div>
                <div className={cn(
                    "text-sm ",
                    variant === 'ghost' ? 'text-neutral-200/70' : 'text-[#D8CFBC]/70 '
                )}>
                    {email}
                </div>
            </div>
        </div>
    );
}