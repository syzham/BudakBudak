import {Button, FormControl} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT =
    window.location.host.indexOf("localhost") >= 0
        ? "http://127.0.0.1:4000"
        : window.location.host;

export function JoinLobby() {
    const [roomCode, setRoomCode] = useState("");
    const [socket, setSocket] = React.useState(null);
    const [playerName, setPlayerName] = useState("");

    useEffect(() => {
        if (socket) {
            socket.on("redirect-lobby", x => {
                localStorage.setItem("lobby", x);
                window.location.href = '/lobby';
            });
        }
    }, [socket]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (roomCode === "") {
            alert("Please enter a Room Code!");
        }
        if (playerName === "") {
            alert("Please enter a Player Name");
        }

        const userId = roomCode.concat("-", playerName);
        localStorage.setItem("currentPlayer", userId);

        const newSocket = socketIOClient(ENDPOINT, { query: { userId }});
        setSocket(newSocket);
        setTimeout(() => {newSocket.emit("joinLobby",
            {
                lobbyCode: roomCode,
                playerName: playerName
            }
        )}, 1000);
    }

    return (
        <div>
            <form onSubmit={submitHandler} style={{ width: "10%" }}>
                <FormControl
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    type="text"
                    placeholder="Room Code"
                ></FormControl>
                <FormControl
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    type="text"
                    placeholder="Player Name"
                ></FormControl>
                <Button variant="primary" type="submit" style={{marginTop: "1rem"}}>Play</Button>
            </form>
        </div>
    )
}
