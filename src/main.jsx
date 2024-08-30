// main.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./Game";
import { ListaSalas } from "./ListaSalas";
// import { Accion } from "./Accion";
import { SocketProvider } from "./context/SocketContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <Router>
      <Routes>
        {/* <Route path="/" element={<Accion />} /> */}
        <Route path="/" element={<Game />} />
      </Routes>
    </Router>
  </SocketProvider>
);
