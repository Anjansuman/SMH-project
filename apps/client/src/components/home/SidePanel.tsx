"use client";

import { useRef, useState } from "react";
import { BiSolidMessage, BiCurrentLocation, BiTransfer } from "react-icons/bi";
import { RiInfoCardFill, RiSettings3Fill } from "react-icons/ri";
import { MdOutlineSegment, MdRateReview } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { cn } from "@/src/lib/utils";
import ProfileCard from "../utility/ProfileCard";
import gsap from "gsap";
import React from "react";
import ToolTipComponent from "../utility/TooltipComponent";
import { useFeatureStore } from "@/src/store/featrues/useFeatureStore";
import { FeatureEnum } from "@/src/types/FeatureEnum";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import { notify } from "../ui/notification";

export default function SidePanel() {
    const [collapsed, setCollapsed] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const textRefs = useRef<HTMLSpanElement[]>([]);
    const { session } = useUserSessionStore();

    const sideBarTop = [
        { name: "Messaging", icon: <BiSolidMessage size={20} />, type: FeatureEnum.MESSAGING },
        { name: "Navigation", icon: <BiCurrentLocation size={20} />, type: FeatureEnum.NAVIGATION },
        { name: "Send crypto", icon: <BiTransfer size={20} />, type: FeatureEnum.SEND_CRYPTO },
        { name: "Friends", icon: <FaUserFriends size={20} />, type: FeatureEnum.FRIENDS }
    ];

    const sideBarBottom = [
        { name: "About", icon: <RiInfoCardFill size={20} />, type: FeatureEnum.ABOUT },
        { name: "Settings", icon: <RiSettings3Fill size={20} />, type: FeatureEnum.SETTINGS },
        { name: "Leave a Review", icon: <MdRateReview size={20} />, type: FeatureEnum.REVIEW }
    ];

    const togglePanel = () => {
        if (!panelRef.current) return;

        if (!collapsed) {
            gsap.to(panelRef.current, { width: "5.5rem", duration: 0.3, ease: "power2.inOut" });
            gsap.to(textRefs.current, { opacity: 0, duration: 0.2, stagger: 0.05 });
        } else {
            gsap.to(panelRef.current, { width: "25rem", duration: 0.3, ease: "power2.inOut" });
            gsap.to(textRefs.current, { opacity: 1, duration: 0.2, stagger: 0.05, delay: 0.1 });
        }
        setCollapsed(!collapsed);
    };

    return (
        <>
            <div
                ref={panelRef}
                className={cn(
                    "w-[25rem] bg-black h-screen rounded-r-xl border-r border-neutral-700",
                    "flex flex-col justify-between items-center",
                    "px-5 py-10 overflow-hidden"
                )}
            >
                <div className="w-full flex flex-col gap-y-2 ">
                    <div className="w-full flex justify-end cursor-pointer" onClick={togglePanel}>
                        <MdOutlineSegment size={30} />
                    </div>
                    <ProfileCard
                        name={session?.user.name || ""}
                        email={session?.user.email || ""}
                        id={session?.user.id || ""}
                        image={session?.user.image || ""}
                    />
                </div>

                <div className="w-full flex flex-col gap-y-2">
                    {sideBarTop.map((e, index) => (
                        <SideButton
                            key={index}
                            name={e.name}
                            icon={e.icon}
                            type={e.type}
                            textRef={(el) => {
                                if (el) textRefs.current[index] = el;
                            }}
                            collapsed={!collapsed}
                        />
                    ))}
                </div>

                <div className="w-full">
                    {sideBarBottom.map((e, index) => (
                        <SideButton
                            key={index + sideBarTop.length}
                            name={e.name}
                            icon={e.icon}
                            type={e.type}
                            textRef={(el) => {
                                if (el) textRefs.current[index + sideBarTop.length] = el;
                            }}
                            collapsed={!collapsed}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

interface SideButtonProps {
    name: string;
    icon: React.ReactNode;
    type: FeatureEnum;
    onClick?: () => void;
    textRef?: (el: HTMLSpanElement | null) => void;
    collapsed: boolean;
}

function SideButton({ name, icon, type, onClick, textRef, collapsed }: SideButtonProps) {
    const { updateSeletedFeature } = useFeatureStore();

    const handleClick = () => {
        if (name === "Send crypto") {
            notify().paymentSent();
        } else {
            updateSeletedFeature(type);
        }

        if (onClick) onClick();
    };

    return (
        <ToolTipComponent content={name}>
            <div
                className={cn(
                    "flex justify-start items-center gap-x-2 px-4 py-2 rounded-md hover:bg-neutral-900 text-neutral-200",
                    "cursor-pointer "
                )}
                onClick={handleClick}
            >
                <div>{icon}</div>
                {collapsed && (
                    <span ref={textRef} className="transition-opacity duration-200">
                        {name}
                    </span>
                )}
            </div>
        </ToolTipComponent>
    );
}
