import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "./context/SocketContext";

const options = [
  { id: 0, name: "Piedra", emoji: "🪨", beats: 2 },
  { id: 1, name: "Papel",  emoji: "📄", beats: 0 },
  { id: 2, name: "Tijera", emoji: "✂️", beats: 1 },
];

function OptionButton({ option, handlePlay, disabled }) {
  return (
    <button
      className="px-4 py-2 m-2 text-xl font-bold text-white bg-yellow-500 rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
      onClick={!disabled ? () => handlePlay(option.id) : undefined}
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
  const [disconnect, setDisconnect] = useState(false);
  const [salasActivas, setSalasActivas] = useState([]);
  const [jugar, setJugar] = useState(null);
  const [puedeJugar, setPuedeJugar] = useState(null);
  const [ver, setVer] = useState(false);

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const handleEnEspera = () => {
      setPuedeJugar(false);
    };

    const handleUnidoSala = () => {
      setPuedeJugar(true);
    };

    const handleDisconnect = () => {
      setDisconnect(true);
    };

    const handleResultado = (result) => {
      setResult(result);
    };

    const handleActualizarSalas = (salas) => {
      setSalasActivas(salas);
      console.log(salasActivas);

    };

    if (jugar && socket) {
      socket.on("en-espera", handleEnEspera);
      socket.on("unido-a-la-sala", handleUnidoSala);
      socket.on("disconnect", handleDisconnect);
      socket.on("resultado", handleResultado);
      socket.on("actualizar-salas", handleActualizarSalas);
    }

    return () => {
      if (socket) {
        socket.off("en-espera", handleEnEspera);
        socket.off("unido-a-la-sala", handleUnidoSala);
        socket.off("disconnect", handleDisconnect);
        socket.off("resultado", handleResultado);
        socket.off("actualizar-salas", handleActualizarSalas);
      }
    };
  }, [jugar, socket]);

  useEffect(() => {
    if (userChoice !== null) {
      setUserMessage(
        `Has elegido ${options[userChoice]?.emoji} - ${options[userChoice]?.name}`
      );
    }
  }, [userChoice]);

  useEffect(() => {
    if (socket) {
      const handleListaSalas = (salas) => {
        setSalasActivas(salas);
      };
  
      socket.on("lista-salas", handleListaSalas);
  
      return () => {
        socket.off("lista-salas", handleListaSalas);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (opponentChoice !== null) {
      setOpponentMessage(
        `El oponente ha elegido ${options[opponentChoice]?.emoji} - ${options[opponentChoice]?.name}`
      );
    }
  }, [opponentChoice]);

  useEffect(() => {
    const handleReiniciarPartida = () => {
      reset(); 
    };

    if (socket) {
      socket.on("reiniciar-partida", handleReiniciarPartida);

      return () => {
        socket.off("reiniciar-partida", handleReiniciarPartida);
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleSalaEstado = (data) => {
      setJugadoresSala(data.jugadores);
    };

    if (socket) {
      socket.on("sala-estado", handleSalaEstado);

      return () => {
        socket.off("sala-estado", handleSalaEstado);
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleResultado = (data) => {
      
      if (data.jugador1 && data.jugador2) {
        setUserChoice(data.jugador1.choice);
        setOpponentChoice(data.jugador2.choice);
        setUserMessage(
          `Jugador 1 eligió ${options[data.jugador1.choice]?.emoji} - ${options[data.jugador1.choice]?.name}`
        );
        setOpponentMessage(
          `Jugador 2 eligió ${options[data.jugador2.choice]?.emoji} - ${options[data.jugador2.choice]?.name}`
        );
        setResult({
          resultado: data.jugador1.resultado,
        });
      }
    };
  
    if (socket) {
      socket.on("resultado", handleResultado);
  
      return () => {
        socket.off("resultado", handleResultado);
      };
    }
  }, [socket]);

  const handlePlay = (choice) => {
    setUserChoice(choice);
    setDisabled(true);
    socket.emit("jugada", choice);
  };

  const QuiereJugar = (partida, salaId = null) => {
    setJugar(partida);
    if (partida === true) {
      socket.emit("Quiere-jugar");
    } else if (partida === false && salaId) {
      console.log("SI QUIERE VER EL WEY");
      setVer(true)
      console.log("SI QUIERE VER EL WEY 2");
      socket.on("jugada-ver", (choice) =>{
        console.log(choice);
        console.log("hola");
        
        
      })
      
      setSalaSeleccionada(salaId);
      
      socket.emit("ver", salaId);
    } else {
      socket.emit("obtener-lista-salas");
    }
  };


  const reset = () => {
    setUserChoice(null);
    setOpponentChoice(null);
    setUserMessage(null);
    setOpponentMessage(null);
    setResult(null);
    setDisabled(false);
    setDisconnect(false);
    setJugar(null);
    setPuedeJugar(null);
    setVer(false);
  };

  return {
    userChoice,
    opponentChoice,
    userMessage,
    opponentMessage,
    result,
    ver,
    disabled,
    jugar,
    puedeJugar,
    disconnect,
    handlePlay,
    QuiereJugar,
    salasActivas,
    reset,
  };
}

export default function Game() {
  const { socket } = useContext(SocketContext); 
  const {
    userChoice,
    opponentChoice,
    userMessage,
    opponentMessage,
    result,
    disabled,
    ver,
    jugar,
    puedeJugar,
    QuiereJugar,
    disconnect,
    handlePlay,
    salasActivas,
    reset,
  } = useChoices();

  const handleReiniciarPartida = () => {
    if (socket) {
      socket.emit("reiniciar-partida");
    }
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      {jugar == null ? (
        <div className="rounded-lg p-4 bg-gray-500">
          <h1 className="text-3xl mb-4 text-center font-bold">BIENVENIDO AL JUEGO</h1>
          <p className="text-xl mb-4 text-center font-mono">¿Qué quieres hacer?</p>
          <div className="">
            <div className="flex items-center justify-center mt-8 gap-8">
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
                onClick={() => QuiereJugar(true)}
              >
                Unirme a sala
              </button>
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
                onClick={() => QuiereJugar(false)}
              >
                Solo mirar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {ver == true ? (
            <div>
              <h4>Jugador 1</h4>
            {/* LO QUE ESCOGIÓ EL JUGADOR 1 */}
              <h4>Jugador 2</h4>
              {/* LO QUE ESCOGIÓ EL JUGAODR 2 */}

              <h4>REsultado de la partida</h4>
              {/* Resultado de la partida*/}
            </div>
          ):(
            <div>
          {jugar === true ? (
            puedeJugar === false ? (
              <div className="text-white">
                Esperando jugador 2
              </div>
            ) : (
              <div className="rounded-lg p-4 bg-gray-500">
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
                  {opponentChoice !== null && <p className="text-xl mt-4">{opponentMessage}</p>}
                  {result?.resultado !== null && (
                    <div className="mt-8">
                      {result?.resultado === 0 && <p className="text-xl mt-4">🤷🏽‍♀️ Empate</p>}
                      {result?.resultado === 1 && (
                        <p className="text-xl mt-4">
                          ✅ Has ganado con {options[userChoice]?.name} contra {options[result.opponentChoice]?.name}
                        </p>
                      )}
                      {result?.resultado === 2 && (
                        <p className="text-xl mt-4">
                          ❌ Has perdido con {options[userChoice]?.name} contra {options[result.opponentChoice]?.name}
                        </p>
                      )}
                      {result && (
                        <>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
                            onClick={() => QuiereJugar(null)}
                          >
                            Volver al menú principal
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <div className="bg-gray-500 p-4 rounded-lg">
              <h1 className="text-3xl mb-4 text-center font-bold">Salas Activas</h1>
              <ul>
                {salasActivas?.length > 0 ? (
                  salasActivas?.map((sala, index) => (
                    <div>
                      <li key={index} className="text-xl mb-2">
                        Sala {index + 1} - Jugadores: {sala.jugadores}
                      </li>
                      <button onClick={() => QuiereJugar(false, sala.salaId)}>Ver Sala</button>
                    </div>
                  ))
                ) : (
                  <li className="text-xl mb-2">No hay salas activas</li>
                )}
              </ul>
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 mt-4 border-b-4 border-yellow-700"
                onClick={() => QuiereJugar(null)}
              >
                Volver
              </button>
            </div>
          )}
          </div>
          )}
          {disconnect && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
              <div className="bg-gray-800 text-white p-8 rounded-lg">
                <h2 className="text-2xl mb-4">Conexión perdida</h2>
                <p>Tu conexión se ha perdido. Por favor, vuelve a intentar.</p>
                <button
                  className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-black font-semibold py-2 px-4 border-b-4 border-yellow-700"
                  onClick={() => window.location.reload()}
                >
                  Recargar página
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
