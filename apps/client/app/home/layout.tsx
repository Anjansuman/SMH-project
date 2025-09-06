import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import SessionSetter from "@/src/components/utility/SessionSetter";
import { WebSocketProvider } from "@/src/providers/WebSocketProvider";


export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    return (
        <div>
            <WebSocketProvider>
                {children}
                <SessionSetter session={session} />
            </WebSocketProvider>
        </div>
    );
}