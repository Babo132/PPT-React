import { createContext } from "react";
import { useSocket } from "../Hooks/useSocket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { Online, socket } = useSocket("http://localhost:3300");
  return (
    <>
      <SocketContext.Provider value={{ socket, Online }}>
        {children}
      </SocketContext.Provider>
    </>
  );
};