import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LambdaExecutor from './LambdaFunctions';
import { useContext, useState } from "react";
import GameDataContext from "./GameData/GameDataContext";
import './LandingPage.css';

function LandingPage() {
	const {
		currentCrowdImage,
		croppedFaceImage,
		lambdaExecutor,
		setStateAfterAPICall
	} = useContext(GameDataContext);

	const [selectedFile, setSelectedFile] = useState(null);
	const [message, setMessage] = useState("");

	const handleFileChange = (event) => {
		setSelectedFile(event.target.files[0]);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setMessage("Please select an image first.");
			return;
		}

		const reader = new FileReader();
		reader.onloadend = async () => {
			try {
				const base64Image = reader.result.split(",")[1];
				const payload = { image_data: base64Image };

				const result = await lambdaExecutor.uploadImage(payload);
				await setStateAfterAPICall();
				console.log("Upload Lambda result:", result);

				setMessage(result.body || "Upload successful!");
			} catch (error) {
				console.error("Upload failed:", error);
				setMessage("Failed to upload image.");
			}
		};

		reader.readAsDataURL(selectedFile);
	};

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
			<section className="magnifyingGlass">
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

			<div className="uploadSection">
				<div className="heading">
  				<h3>Want to use your own image?</h3>
					<p>(Must be PNG format and less than 1 MB)</p>
				</div>
  				<input type="file" accept="image/*" onChange={handleFileChange} />
  				<button className="uploadButton" onClick={handleUpload}>Upload Custom Image</button>
  				{message && <p style={{ color: 'white' }}>{message}</p>}
			</div>

		</div>
	);
}

export default LandingPage;