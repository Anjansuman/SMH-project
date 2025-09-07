import axios from "axios";
import { GET_USER_WITH_ID } from "../routes/routes";


export default async function getUserData(userId: string, token: string) {
    try {

        const { data } = await axios.get(
            `${GET_USER_WITH_ID}/${userId}`,
            {
                headers: {
                    Authorization: `${token}`,
                },
            },
        );

        return data;
        
    } catch (error) {
        console.error("Error while fetching user data: ", error);
        return null;
    }
}