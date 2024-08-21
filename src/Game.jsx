import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "./context/SocketContext";

const options = [
  { id: 0, name: "Piedra", emoji: "🪨", beats: 2 },
  { id: 1, name: "Papel", emoji: "📄", beats: 0 },
  { id: 2, name: "Tijera", emoji: "✂️", beats: 1 },
];

function OptionButton({ option, handlePlay, disabled }) {
  return (
    <button
      className="px-4 py-2 m-2 text-xl font-bold text-white bg-yellow-500 rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
      onClick={() => handlePlay(option.id)}
      title={option.name}
    >
      {option.emoji}
    </button>
  );
}

function useChoices() {
  const [userChoice, setUserChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [userMessage, setUserMessage] = useState(null);
  const [opponentMessage, setOpponentMessage] = useState(null);
  const [result, setResult] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [espera, setEspera] = useState(false);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.emit("join-room");

    socket.on("unido-a-la-sala", () => {
      console.log("Unido a la sala.");
      setEspera(false);
    });

    socket.on("en-espera", () => {
      console.log("En espera.");
      setEspera(true);
    });

    socket.on("resultado", (result) => {
      setResult(result);
    })

    socket.on("disconnect", () => {
      console.log("Fuera de la sala");
    });

    return () => {
      socket.off("unido-a-la-sala");
      socket.off("en-espera");
      socket.off("disconnect");
      socket.off("resultado");
    };
  }, [socket, userChoice]);

  useEffect(() => {
    if (userChoice !== null) {
      setUserMessage(
        `Has elegido ${options[userChoice]?.emoji} - ${options[userChoice]?.name}`
      );
    }
  }, [userChoice]);

  useEffect(() => {
    if (opponentChoice !== null) {
      setOpponentMessage(
        `El oponente ha elegido ${options[opponentChoice]?.emoji} - ${options[opponentChoice]?.name}`
      );
    }
  }, [opponentChoice]);

  const handlePlay = (choice) => {
    setUserChoice(choice);
    setDisabled(true);

    // Enviar la elección al servidor
    socket.emit("jugada", choice);
  };

  const reset = () => {
    setUserChoice(null);
    setOpponentChoice(null);
    setUserMessage(null);
    setOpponentMessage(null);
    setResult(null);
    setDisabled(false);
  };

  return {
    userChoice,
    opponentChoice,
    userMessage,
    opponentMessage,
    result,
    disabled,
    espera,
    handlePlay,
    reset,
  };
}

export default function Game() {
  const { Online } = useContext(SocketContext);
  const {
    userChoice,
    opponentChoice,
    userMessage,
    opponentMessage,
    result,
    espera,
    disabled,
    handlePlay,
    reset,
  } = useChoices();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      {!espera && (<div className="rounded-lg p-4 bg-gray-500">
        <h1 className="text-3xl mb-4 text-center font-bold">¡A jugar!</h1>
        <div className="max-w-md mx-auto">
          {options.map((option) => (
            <OptionButton
              key={option.id}
              option={option}
              handlePlay={handlePlay}
              disabled={disabled}
            />
          ))}
          {userChoice !== null && <p className="text-xl mt-4">{userMessage}</p>}
          {opponentChoice !== null && (
            <p className="text-xl mt-4">{opponentMessage}</p>
          )}
          {result?.resultado !== null && (
            <div className="mt-8">
              {result?.resultado === 0 && <p className="text-xl mt-4">🤷🏽‍♀️ Empate</p>}
              {result?.resultado === 1 && (
                <p className="text-xl mt-4">
                  ✅ Has ganado con {options[userChoice]?.name} contra{" "} {options[result.opponentChoice]?.name}
                  {options[opponentChoice]?.name}
                </p>
              )}
              {result?.resultado === 2 && (
                <p className="text-xl mt-4">
                  ❌ Has perdido con {options[userChoice]?.name} contra{" "} {options[result.opponentChoice]?.name}
                  {options[opponentChoice]?.name}
                </p>
              )}
              {result && (<button
                className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
                onClick={reset}
              >
                Jugar de nuevo
              </button>)}
              {result && (<button
                className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
                onClick={reset}
              >
                SALIR SALA
              </button>)}
            </div>
          )}
        </div>
        <p>
          Estado del servidor:{" "}
          {Online ? (
            <span className="text-success">Si jala pa'</span>
          ) : (
            <span className="text-danger">No jaló esta madre</span>
          )}
        </p>
      </div>)}
      {espera && ("espera en fila perro")}
    </div>
  );
}
