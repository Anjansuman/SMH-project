"use client";

import Image from "next/image";
import { useUserSessionStore } from "../../store/user/useUserSessionStore";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { RxExit } from "react-icons/rx";
import { signOut } from "next-auth/react";
import LogoutModal from "../utility/LogoutModal";


export default function NavbarProfile() {
    const { session } = useUserSessionStore();
    const [userPanel, setUserPanel] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setUserPanel(false);
            }
        }
        if (userPanel) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [userPanel]);

    return (
        <div className="relative">
            <div
                className="h-8 w-8 rounded-full border border-neutral-600 overflow-hidden cursor-pointer"
                onClick={() => setUserPanel(true)}
            >
                <Image
                    src={session?.user.image || "/default-avatar.png"}
                    alt={session?.user.name || "user"}
                    unoptimized
                    width={32}
                    height={32}
                    className="h-8 w-8 object-cover"
                />
            </div>

            {userPanel && <UserPanel ref={panelRef} />}
        </div>
    );
}

const UserPanel = React.forwardRef<HTMLDivElement>((_, ref) => {
    const userPanelButtons = ["Profile", "Friends", "Wallet", "Logout"];
    const [openLogoutModal, setOpenLogoutModal] = useState<boolean>(false);


    function handleOnClick(button: string) {
        if (button === 'Logout') {
            signOut({
                callbackUrl: '/'
            })
            // setOpenLogoutModal(true);
        }
    }

    return (
        <div
            ref={ref}
            className="absolute z-30 mt-2 right-0 w-30 rounded-lg border border-neutral-700 bg-neutral-900 text-white shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95"
        >
            {userPanelButtons.map((button, index) => (
                <button
                    key={index}
                    className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors duration-150 hover:bg-neutral-800 ",
                        index < userPanelButtons.length - 1 && "border-b border-neutral-700",
                        button === 'Logout' ? 'text-red-500' : '',
                        'flex justify-center items-center gap-x-2'
                    )}
                    onClick={() => handleOnClick(button)}
                >
                    {button === 'Logout' && (
                        <RxExit />
                    )}
                    {button}
                </button>
            ))}
            <LogoutModal
                openLogoutModal={openLogoutModal}
                setOpenLogoutModal={setOpenLogoutModal}
            />
        </div>
    );
});

