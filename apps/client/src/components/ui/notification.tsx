"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import FriendRequestModal from "@/src/components/utility/FriendRequestModal";
import SendCryptoModal from "../utility/SendCryptoModal";

type NotificationType = "FRIEND_REQUEST" | "PAYMENT_SENT" | "DEFAULT";

type Notification = {
    id: number;
    type: NotificationType;
    content: ReactNode;
};

type NotificationContextType = {
    notify: {
        friendRequest: (
            fromUser: {
                id: string;
                name: string;
                email: string;
                image: string;
                description?: string;
                friendshipId: string;
            }
        ) => void;
        paymentSent: (walletAddress?: string, id?: string) => void;
        custom: (content: ReactNode) => void;
    };
};

const NotificationContext = createContext<NotificationContextType | null>(null);

let idCounter = 0;
let notifyRef: NotificationContextType["notify"] | null = null; // ✅ global reference

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: number) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback(
        (type: NotificationType, content: ReactNode, autoClose = true) => {
            const id = ++idCounter;
            setNotifications((prev) => {
                const next = [{ id, type, content }, ...prev];
                return next.slice(0, 3); // ✅ limit to 3 stacked
            });

            if (autoClose) {
                setTimeout(() => removeNotification(id), 4000);
            }
        },
        [removeNotification]
    );

    const notify: NotificationContextType["notify"] = {
        friendRequest: (fromUser) => {
            addNotification(
                "FRIEND_REQUEST",
                <FriendRequestModal fromUser={fromUser} />,
                false // for now don't auto close the notification of friend request
            );
        },
        paymentSent: (walletAddress, id) => {
            addNotification(
                "PAYMENT_SENT",
                <SendCryptoModal
                    close={close}
                    walletAddress={walletAddress}
                    id={id}
                />,
                false
            );
        },
        custom: (content: ReactNode) => {
            addNotification("DEFAULT", content);
        },
    };

    notifyRef = notify;

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-4 w-80 select-none">
                <AnimatePresence>
                    {notifications.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="relative p-6 rounded-xl border border-neutral-700 bg-black text-neutral-200 flex flex-col gap-y-5 shadow-lg"
                        >
                            {n.content}
                            <button
                                onClick={() => removeNotification(n.id)}
                                className="absolute top-2 right-2 text-black bg-neutral-200/40 hover:bg-neutral-200/60 transition-colors cursor-pointer rounded-full p-0.5"
                            >
                                <X size={12} className="stroke-2" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx)
        throw new Error(
            "useNotification must be used inside NotificationProvider"
        );
    return ctx.notify;
}

export function notify() {
    if (!notifyRef) {
        throw new Error("NotificationProvider not mounted yet");
    }
    return notifyRef;
}
