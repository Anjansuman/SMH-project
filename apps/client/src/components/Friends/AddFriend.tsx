import getUserData from "@/src/backend/get-user-data";
import { cn } from "@/src/lib/utils";
import { useUserSessionStore } from "@/src/store/user/useUserSessionStore";
import { User } from "@/src/types/prisma-types";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { BiLoader } from "react-icons/bi";
import UserCardModal from "../utility/UserCardModal";

export default function AddFriend() {
    const [inputValue, setInputValue] = useState<string>("")
    const [userData, setUserData] = useState<Partial<User> | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { session } = useUserSessionStore();

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            fetchUser();
        }
    }

    async function fetchUser() {
        setLoading(true);

        if (!inputValue || !session?.user?.token) {
            setLoading(false);
            return;
        }

        const data = await getUserData(inputValue, session.user.token);
        console.log(data);
        setUserData(data.data);
        setLoading(false);
    }

    return (
        <div className="w-[500px] h-[380px] absolute top-1/2 left-1/2 -translate-1/2 bg-neutral-800 border border-neutral-700 rounded-lg flex flex-col p-4 gap-y-4 ">
            <div className="w-full flex justify-end items-center">
                <div className="flex justify-center items-center p-0.5 bg-neutral-800 hover:bg-black ">
                    <RxCross2
                        className="text-neutral-200 stroke-1 size-5"
                    />
                </div>
            </div>
            <div className="bg-neutral-900 flex gap-x-2 rounded-lg justify-center items-center pr-2">
                <input
                    placeholder="Enter a userId"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "w-full h-10 bg-neutral-900 rounded-lg focus:outline-none px-3 "
                    )}
                />
                <div
                    className="flex justify-center items-center p-0.5 hover:bg-neutral-950 transition-colors rounded-full cursor-pointer"
                    onClick={fetchUser}
                >
                    <ChevronRight className="text-neutral-200 stroke-1 size-5" />
                </div>
            </div>
            {loading && (
                <div className="w-full flex justify-center items-center ">
                    <BiLoader className="animate-spin text-neutral-200 " />
                </div>
            )}
            <div className="w-full flex justify-center items-center ">
                {userData && (
                    <UserCardModal
                        name={userData.name!}
                        id={userData.id!}
                        email={userData.email!}
                        image={userData.image!}
                        walletAddress={userData.walletAddress}
                    />
                )}
            </div>
        </div>
    );
}
