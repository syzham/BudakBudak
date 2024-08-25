import http from "http";
import path from "path";
import { Server } from "socket.io";
import express from "express";

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend/build")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' }});

const users = {};
const lobbies = [];

io.on("connection", socket => {
    const userId = socket.handshake.query.userId;
    if (!userId) return;
    users[userId] = socket.id;

    socket.on("createLobby", lobby => {
        const newLobby = {
            ...lobby,
            players: []
        };
        lobbies.push(newLobby);
    });

    socket.on("getLobby", lobbyCode => {
        const lobby = lobbies.find((x) => x.lobbyCode === lobbyCode);
        if (lobby) {
            io.to(users[userId]).emit("updateLobby", lobby);
        }
    })

    socket.on("joinLobby", lobbyDetails => {
        const lobby = lobbies.find((x) => x.lobbyCode === lobbyDetails.lobbyCode);
        if (lobby) {
            lobby.players.push({name: lobbyDetails.playerName});
            io.to(users[lobby.lobbyCode.concat("-Leader")]).emit("updateLobby", lobby);
            io.to(users[userId]).emit("redirect-lobby", lobbyDetails.lobbyCode);

            lobby.players.forEach((player) => {
                io.to(users[lobby.lobbyCode.concat("-", player.name)]).emit("updateLobby", lobby);
            });
        }
    })
})

const port = process.env.PORT || 4000;
httpServer.listen(port, () => {console.log('Server listening on port ' + port); });