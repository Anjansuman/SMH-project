import axios from "axios";
import { GET_USER_CHAT } from "../routes/routes";
import { ChatMessage } from "../types/prisma-types";


export default async function getUserChats(roomId: string, token: string) {
    try {

        const res = await axios.get(
            `${GET_USER_CHAT}/${roomId}`,
            {
                headers: {
                    Authorization: token,
                },
            },
        );

        if (!res.data.success) {
            throw new Error(res.data.message || "Failed to fetch messages");
        }

        return res.data.data as ChatMessage[];
    } catch (error) {
        console.error('Error: ', error);
        return [];
    }
}