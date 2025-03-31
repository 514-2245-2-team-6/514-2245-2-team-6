import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GamePage from "./GamePage"; // Import your GamePage component
import WinResultsPage from "./WinResultsPage";
import LostResultsPage from "./LostResultsPage";
import "./App.css";
import LandingPage from "./LandingPage";
import { GameDataProvider } from "./GameData/GameDataProvider";

function App() {
  return (
		<GameDataProvider>
			<Router>
				<Routes>
					{/* Landing Page Route */}
					<Route
						path="/"
						element={<LandingPage/>}
					/>
					{/* Game Page Route */}
					<Route path="/game" element={<GamePage />} />
					{/* Win results Page Route */}
					<Route path="/winner" element={<WinResultsPage />} />
					{/* Lost results Page Route */}
					<Route path="/lost" element={<LostResultsPage />} />
				</Routes>
			</Router>
		</GameDataProvider>
  );
}

export default App;
