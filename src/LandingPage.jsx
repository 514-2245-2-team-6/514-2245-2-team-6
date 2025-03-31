import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import { useContext } from "react";
import GameDataContext from "./GameData/GameDataContext";

function LandingPage() {
	const {
		currentCrowdImage,
		croppedFaceImage,
	} = useContext(GameDataContext);

	console.log({croppedFaceImage});

	return (
		<div className="landingPage">
			<img
				key={currentCrowdImage}
				className="backgroundImg"
				src={`${currentCrowdImage}?${new Date().getTime()}`}
				alt="Blurred crowd of people"
			/>
			<h1>Welcome To The Where's Waldo Game!!</h1>
			<p>
				Your <span>Goal</span> is to find "Waldo" before the timer runs out!
			</p>
			<p>You have 30 seconds...</p>
			<section>
				<img
					key={croppedFaceImage}
					className="waldoimg"
					src={`${croppedFaceImage}?${new Date().getTime()}`}
					alt="Face of the 'waldo' you are trying to find"
				/>
				<div className="magnifyingBlockOne"></div>
				<div className="magnifyingBlockTwo"></div>
			</section>
			<Link to="/game" title="Click to play the Where's Waldo game">
				Play Now
			</Link>
		</div>
	);
}

export default LandingPage;