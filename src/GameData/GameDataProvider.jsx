import { useState, useEffect } from "react";
import LambdaExecutor from "../LambdaFunctions";
import placeholderCurrentCrowdImage from "../assets/PlaceholderBackgroundImg.jpeg";
import placeholderCroppedFaceImage from "../assets/waldoPlaceholderImg.jpeg";
import GameDataContext from "./GameDataContext";

const API_GATEWAY_BASE_URL = 'https://hg4ccwetq9.execute-api.us-east-1.amazonaws.com/prod/';
const CURRENT_CROWD_IMAGE = "https://projectawscrowdimages3bucket.s3.us-east-1.amazonaws.com/current-image.png";
const CROPPED_FACE_IMAGE = "https://projectawscrowdimages3bucket.s3.us-east-1.amazonaws.com/cropped-face-image.png";


export const GameDataProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [currentCrowdImage, setCurrentCrowdImage] = useState(placeholderCurrentCrowdImage);
	const [croppedFaceImage, setCroppedFaceImage] = useState(placeholderCroppedFaceImage);
	const [faceBoundingBox, setFaceBoundingBox] = useState(undefined);

	useEffect(() => {
		async function setStateAfterAPICall() {
			const lambdaExecutor = new LambdaExecutor(API_GATEWAY_BASE_URL);
			const result = await lambdaExecutor.getRandomCroppedFace();
			const boundingBox = result['bounding_box'];

			setCurrentCrowdImage(CURRENT_CROWD_IMAGE);
			setCroppedFaceImage(CROPPED_FACE_IMAGE);
			setFaceBoundingBox(boundingBox);
			setIsLoading(false);
		}

		setStateAfterAPICall();
	}, []);

	return (
		<GameDataContext.Provider
			value={
				{
					isLoading,
					setIsLoading,
					currentCrowdImage,
					setCurrentCrowdImage,
					croppedFaceImage,
					setCroppedFaceImage,
					faceBoundingBox,
					setFaceBoundingBox,
					API_GATEWAY_BASE_URL
				}
			}
		>
			{children}
		</GameDataContext.Provider>
	);
};