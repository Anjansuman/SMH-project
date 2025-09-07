import { Router } from "express";
import signInController from "../controllers/signInController";
import userAuthMiddleware from "../middleware/userAuthMiddleware";
import getUserDataController from "../controllers/getUserDataController";
import getUserController from "../controllers/getUserController";
import getRoomMessagesController from "../controllers/getRoomMessagesController";
import setUserWalletController from "../controllers/setUserWalletController";

const router = Router();

router.post('/sign-in', signInController);

// for fetching user data for sending friend requests
router.get('/get-user-data/:userId', userAuthMiddleware, getUserDataController);

// for fetching user data
router.get('/get-user/:userId', userAuthMiddleware, getUserController);
router.get('/get-user-chats/:roomId', userAuthMiddleware, getRoomMessagesController);

router.put('/set-user-wallet', userAuthMiddleware, setUserWalletController);

export default router;