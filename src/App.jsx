import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GamePage from "./GamePage"; // Import your GamePage component
import LostResultsPage from "./ResultsPage";
import "./App.css";
import LandingPage from "./LandingPage";
import { GameDataProvider } from "./GameData/GameDataProvider";

function App() {
	useEffect(() => {
		console.log("App component mounted");
	}, []);

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
					<Route path="/results" element={<LostResultsPage />} />
				</Routes>
			</Router>
		</GameDataProvider>
  );
}

export default App;
