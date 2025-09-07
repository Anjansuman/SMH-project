import WebSocketClient from "../socket/socket";


let client: WebSocketClient | null = null;
let currentUserToken: string | null = null;

export function getWebSocketClient(token: string) {

    if(client && currentUserToken === token) {
        return client;
    }

    if(client && currentUserToken !== token) {
        client.close();
        client = null;
    }

    client = new WebSocketClient(`ws://localhost:8080/ws?token=${token}`);
    currentUserToken = token;

    return client;
}

export function cleanWebSocketClient() {
    if(client) {
        client.close();
    }
    client = null;
    currentUserToken = null;
}

export function getcurrentUserToken() {
    return currentUserToken;
}