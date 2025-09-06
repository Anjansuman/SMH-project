import { toast } from "sonner";
import { notifyAnywhere, useNotification } from "../components/ui/notification";


export default class EventHandler {

    static handleChatMessage(payload: unknown) {
        try {

        } catch (error) {

        }
    }

    static handleFriendRequest(payload: unknown) {
        const requestPayload = payload as {
            email: string,
            id: string,
            image: string,
            name: string,
            friendshipId: string,
        };

        notifyAnywhere().friendRequest({
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

}