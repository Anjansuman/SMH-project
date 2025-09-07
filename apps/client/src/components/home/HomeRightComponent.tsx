"use client";

import { useFeatureStore } from "@/src/store/featrues/useFeatureStore";
import { FeatureEnum } from "@/src/types/FeatureEnum";
import MessagingMainRenderer from "../Messaging/MessagingMainRenderer";
import FriendsMainScreenRenderer from "../Friends/FriendsMainScreenRenderer";
import useSubscribeEventHandler from "@/src/hooks/useSubscribeEventHandler";
import { useEffect } from "react";
import { useChatsStore } from "@/src/store/chats/useChatsStore";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import axios from "axios";
import { GET_LOGGED_IN_USER_DATA } from "@/src/routes/routes";
import Navigation from "../Navigation/Navigation";

export default function HomeRightComponent() {
    useSubscribeEventHandler();

    const { selectedFeature } = useFeatureStore();
    const { session } = useUserSessionStore();
    const { setRooms } = useChatsStore();

    useEffect(() => {
        if (!session?.user?.id || !session?.user?.token) return;

        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `${GET_LOGGED_IN_USER_DATA}/${session.user.id}`,
                    {
                        headers: {
                            Authorization: session.user.token,
                        },
                    }
                );

                const { data } = response.data;

                const userRooms = (data.Rooms || []).map((room: { id: string, name: string }) => ({
                    id: room.id,
                    name: room.name,
                }));

                const friendRooms = (data.friends || []).map((friend: {
                    friendshipId: string,
                    name: string,
                    image: string,
                    email: string,
                    walletAddress: string,
                    id: string,
                }) => ({
                    id: friend.friendshipId,
                    name: friend.name,
                    image: friend.image,
                    email: friend.email,
                    walletAddress: friend.walletAddress,
                    friendId: friend.id,
                }));

                const allRooms = [...userRooms, ...friendRooms];
                setRooms(allRooms);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };

        fetchUserData();
    }, [session?.user?.id, session?.user?.token, setRooms]);

    function currentFeature() {
        switch (selectedFeature) {
            case FeatureEnum.MESSAGING:
                return <MessagingMainRenderer />;

            case FeatureEnum.NAVIGATION:
                return <Navigation />;

            case FeatureEnum.FRIENDS:
                return <FriendsMainScreenRenderer />;

            // case FeatureEnum.SETTINGS:
            //     return <div>⚙️ Settings Component</div>;

            // case FeatureEnum.ABOUT:
            //     return <div>ℹ️ About Component</div>;

            // case FeatureEnum.REVIEW:
            //     return <div>⭐ Leave a Review Component</div>;

            case FeatureEnum.NONE:
            default:
                return <div>Select a feature from the sidebar</div>;
        }
    }

    return <div className="h-full w-full px-6 pb-6 ">{currentFeature()}</div>;
}
