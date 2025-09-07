const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const API_URL = BACKEND_URL + '/api/v1';
export const SIGNIN_URL = API_URL + '/sign-in';
export const GET_USER_WITH_ID = API_URL + '/get-user-data';
export const GET_LOGGED_IN_USER_DATA = API_URL + '/get-user';
export const GET_USER_CHAT = API_URL + '/get-user-chats';
export const SET_USER_WALLET = API_URL + '/set-user-wallet';