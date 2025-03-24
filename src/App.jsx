import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import GamePage from "./GamePage"; // Import your GamePage component
import WinResultsPage from "./WinResultsPage";
import LostResultsPage from "./LostResultsPage";
import "./App.css";
import placeHolderWaldo from "./assets/waldoPlaceholderImg.jpeg";
import placeHolderWaldoBackground from "./assets/PlaceholderBackgroundImg.jpeg";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Route */}
        <Route
          path="/"
          element={
            <div className="landingPage">
              <img
                className="backgroundImg"
                src={placeHolderWaldoBackground}
                alt="Background image of a blurred out waldo crowd you are looking at"
              />
              <h1>Welcome To The Where's Waldo Game!!</h1>
              <p>
                Your <span>Goal</span> is to find "Waldo" before the timer runs out!
              </p>
              <p>You have 30 seconds...</p>
              <section>
                <img
                  className="waldoimg"
                  src={placeHolderWaldo}
                  alt="Face of the 'waldo' you are trying to find"
                />
                <div className="magnifyingBlockOne"></div>
                <div className="magnifyingBlockTwo"></div>
              </section>
              <Link to="/game" title="Click to play the Where's Waldo game">
                Play Now
              </Link>
            </div>
          }
        />
        {/* Game Page Route */}
        <Route path="/game" element={<GamePage />} />
        {/* Win results Page Route */}
        <Route path="/winner" element={<WinResultsPage />} />
        {/* Lost results Page Route */}
        <Route path="/lost" element={<LostResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
