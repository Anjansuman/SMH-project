import HomeRightComponent from "@/src/components/home/HomeRightComponent";
import SidePanel from "@/src/components/home/SidePanel";
import HomeNavbar from "@/src/components/navbars/HomeNavbar";
import { GET_LOGGED_IN_USER_DATA } from "@/src/routes/routes";
import { useChatStore } from "@/src/store/chats/useChatsStore";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import axios from "axios";


export default async function Home() {

    const { session } = useUserSessionStore();
    const {  } = useChatStore();

    const response = await axios.get(
        `${GET_LOGGED_IN_USER_DATA}/${session?.user.id}`,
        {
            headers: {
                Authorization: session?.user.token,
            },
        },
    );



    return (
        <div className="h-full w-full flex ">
            <HomeNavbar />
            <SidePanel />
            <div className="w-full text-neutral-200 pt-30 ">
                <HomeRightComponent />
            </div>
        </div>
    );
}