import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import WebsocketServer from "./sockets/WebSocketServer";
import router from "./routes/routes";


dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use(
    cors({
        origin: "*"
    }),
);

app.use('/api/v1', router);

new WebsocketServer(server);

const PORT = 8080;

server.listen(PORT);
