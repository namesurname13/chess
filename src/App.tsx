import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Training from "./pages/Training";
import OnlineGame from "./pages/OnlineGame";
import Tournament from "./pages/Tournament";
import Misc from "./pages/Misc";
import styles from "./App.module.scss";

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/training" element={<Training />} />
          <Route path="/online-game" element={<OnlineGame />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/misc" element={<Misc />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
