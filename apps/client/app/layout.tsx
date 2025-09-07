import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import SessionSetter from "../src/components/utility/SessionSetter";
import { Toaster } from "sonner";
import { NotificationComponent } from "@/src/components/utility/NotificationComponent";
import Providers from './providers';

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hashed",
    description: "The place where you get every services.",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en">
            <body className={geist.className}>
                <Providers>
                    <NotificationComponent>
                        {children}
                        <Toaster theme="dark" />
                        <SessionSetter session={session} />
                    </NotificationComponent>
                </Providers>
            </body>
        </html>
    );
}
