import {Button, ListGroup} from "react-bootstrap";
import React, {useEffect} from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT =
    window.location.host.indexOf("localhost") >= 0
        ? "http://127.0.0.1:4000"
        : window.location.host;


export function Lobby() {
    const [lobbyCode, setLobbyCode] = React.useState('');
    const [socket, setSocket] = React.useState(null);
    const [lobby, setLobby] = React.useState({players:[]});

    useEffect(() => {
        const userId = localStorage.getItem("currentPlayer")??"";

        if (socket) {
            socket.on("updateLobby", newLobby => {
                setLobby(newLobby);
                setLobbyCode(newLobby.lobbyCode);
            });

        }
        else if (userId !== "") {
            const newSocket = socketIOClient(ENDPOINT, { query: { userId }});
            setSocket(newSocket);
            const lobbyCode = localStorage.getItem("lobby");
            if (lobbyCode !== "") {
                newSocket.emit("getLobby", lobbyCode);
            }
        }
        else if (lobbyCode !== "") {
            const userId = lobbyCode.concat("-Leader");
            const newSocket = socketIOClient(ENDPOINT, { query: { userId }});
            setTimeout(() => {newSocket.emit("createLobby",
                {
                    lobbyCode: lobbyCode,
                }
            )}, 1000);
            setSocket(newSocket);
        }

    }, [socket, lobby, lobbyCode]);

    const lobbyHandler = (e) => {
        e.preventDefault();
        const newCode = ((Math.floor(Math.random() * (999 - 100 + 1)) + 100).toString());
        setLobbyCode(newCode);
    }

    return (
        <div>
            <h1>New Lobby</h1>
            <p>{lobbyCode}</p>
            <form onSubmit={lobbyHandler}>
                {lobbyCode === '' && <Button variant="primary" type="submit">Create New Lobby</Button>}
                <ListGroup>
                    {lobby.players.map((player, index) => (
                        <ListGroup.Item key={index}>
                            {player.name}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </form>
        </div>
    )
}