"use client";

import { useFeatureStore } from "@/src/store/featrues/useFeatureStore";
import { FeatureEnum } from "@/src/types/FeatureEnum";
import MessagingMainRenderer from "../Messaging/MessagingMainRenderer";
import FriendsMainScreenRenderer from "../Friends/FriendsMainScreenRenderer";
import useSubscribeEventHandler from "@/src/hooks/useSubscribeEventHandler";


export default function HomeRightComponent() {
    useSubscribeEventHandler();
    const { selectedFeature } = useFeatureStore();

    function currentFeature() {
        switch (selectedFeature) {
            case FeatureEnum.MESSAGING:
                return <MessagingMainRenderer />;

            case FeatureEnum.NAVIGATION:
                return <div>🧭 Navigation Component</div>;

            case FeatureEnum.SEND_CRYPTO:
                return <div>💸 Send Crypto Component</div>;

            case FeatureEnum.FRIENDS:
                return <FriendsMainScreenRenderer />;

            case FeatureEnum.SETTINGS:
                return <div>⚙️ Settings Component</div>;

            case FeatureEnum.ABOUT:
                return <div>ℹ️ About Component</div>;

            case FeatureEnum.REVIEW:
                return <div>⭐ Leave a Review Component</div>;

            case FeatureEnum.NONE:
            default:
                return <div>Select a feature from the sidebar</div>;
        }
    }

    return (
        <div className="h-full w-full px-6 pb-6 ">
            {currentFeature()}
        </div>
    );
}