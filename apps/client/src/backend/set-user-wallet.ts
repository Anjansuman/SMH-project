import axios from "axios";
import { SET_USER_WALLET } from "../routes/routes";


export default async function setUserWallet(walletAddress: string, token: string) {
    try {

        const response = await axios.put(
            `${SET_USER_WALLET}`,
            {
                walletAddress: walletAddress,
            }, {
                headers: {
                    Authorization: token,
                },
            },
        );

        return response;
        
    } catch (error) {
        console.error("Error while setting wallet: ", error);
        return;
    }
}