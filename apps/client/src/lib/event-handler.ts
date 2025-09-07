import { toast } from "sonner";
import { notify } from "../components/ui/notification";
import { useChatsStore } from "../store/chats/useChatsStore";
import { useUserSessionStore } from "../store/user/useUserSessionStore";


export default class EventHandler {

    static handleChatMessage(payload: unknown) {
        const chatMessagePayload = payload as {
            roomId: string,
            id: string,
            message: string,
            createdAt: Date,
            senderId: string,
        }

        const { session } = useUserSessionStore.getState();

        if(chatMessagePayload.senderId === session?.user.id) return;

        const { appendMessage } = useChatsStore.getState();
        appendMessage(chatMessagePayload.roomId, {
            id: chatMessagePayload.id,
            message: chatMessagePayload.message,
            createdAt: chatMessagePayload.createdAt,
            senderId: chatMessagePayload.senderId,
            roomId: chatMessagePayload.roomId,
        });
    }

    static handleFriendRequest(payload: unknown) {
        const requestPayload = payload as {
            email: string,
            id: string,
            image: string,
            name: string,
            friendshipId: string,
        };

        notify().friendRequest({
            id: requestPayload.id,
            name: requestPayload.name,
            email: requestPayload.email,
            image: requestPayload.image,
            friendshipId: requestPayload.friendshipId,
        });
    }

    static handleAcceptFriendRequest(payload: unknown) {
        const acceptFriendshipRequest = payload as {
            name: string,
            email: string,
        };
        toast.success(`${acceptFriendshipRequest.name} accepted your Friend request.`)
    }

    static handleSendCrypto(payload: unknown) {
        const sendCryptoPayload = payload as {
            name: string,
            amount: number,
        };
        toast.success(`${sendCryptoPayload.name} has sent you ${sendCryptoPayload.amount} SOL`);
    }

}