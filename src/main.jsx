import React from "react";
import ReactDOM from "react-dom/client";
import Game from "./Game";
import { SocketProvider } from "./context/SocketContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <Game />
  </SocketProvider>
);
