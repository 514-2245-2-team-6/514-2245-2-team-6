import { useState, useEffect } from "react";
import LambdaExecutor from "../LambdaFunctions";
import placeholderCurrentCrowdImage from "../assets/PlaceholderBackgroundImg.jpeg";
import placeholderCroppedFaceImage from "../assets/waldoPlaceholderImg.jpeg";
import GameDataContext from "./GameDataContext";
import { API_GATEWAY_BASE_URL, CROPPED_FACE_IMAGE_URL, CURRENT_CROWD_IMAGE_URL } from "./aws-constants";


export const GameDataProvider = ({ children }) => {
	const SECONDS_GIVEN = 30;
	const TIMER_THRESHOLD = 5;
	const MAX_SCORE = 10;

	const [isLoading, setIsLoading] = useState(true);
	const [currentCrowdImage, setCurrentCrowdImage] = useState(placeholderCurrentCrowdImage);
	const [croppedFaceImage, setCroppedFaceImage] = useState(placeholderCroppedFaceImage);
	const [faceBoundingBox, setFaceBoundingBox] = useState(undefined);
	const [score, setScore] = useState(0);
	const [accuracy, setAccuracy] = useState(0);
	const [secondsRemaining, setSecondsRemaining] = useState(SECONDS_GIVEN);
	const [streak, setStreak] = useState(0);
	const [hint, setHint] = useState(['', '']);
	const lambdaExecutor = new LambdaExecutor(API_GATEWAY_BASE_URL);

	const setStateAfterAPICall = async () => {
		const result = await lambdaExecutor.getRandomCroppedFace();
		const boundingBox = JSON.parse(result['bounding_box']);

		setCurrentCrowdImage(CURRENT_CROWD_IMAGE_URL);
		setCroppedFaceImage(CROPPED_FACE_IMAGE_URL);
		setFaceBoundingBox(boundingBox);
		setIsLoading(false);
	};

	useEffect(() => {
		setStateAfterAPICall();
	}, []);

	return (
		<GameDataContext.Provider
			value={
				{
					lambdaExecutor,
					isLoading, setIsLoading,
					currentCrowdImage, setCurrentCrowdImage,
					croppedFaceImage, setCroppedFaceImage,
					faceBoundingBox, setFaceBoundingBox,
					score, setScore,
					accuracy, setAccuracy,
					streak, setStreak,
					secondsRemaining, setSecondsRemaining,
					hint, setHint,
					SECONDS_GIVEN, TIMER_THRESHOLD, MAX_SCORE,
					setStateAfterAPICall
				}
			}
		>
			{children}
		</GameDataContext.Provider>
	);
};