import { useContext } from 'react';
import './GamePage.css'
import GameDataContext from "./GameData/GameDataContext";
// import LambdaExecutor from './LambdaFunctions';
import { useNavigate } from 'react-router-dom';

function GamePage() {
	const {
		currentCrowdImage,
		croppedFaceImage,
		faceBoundingBox,
		// API_GATEWAY_BASE_URL,
	} = useContext(GameDataContext);
	const navigate = useNavigate(); // Hook to access history

	const getCoordinatesFromOnClickEvent = (event) => {
		const x = event.clientX;
		const y = event.clientY;

		// Get element clicked
		const element = event.target;

		// Get percent from left of element clicked
		const percentFromLeft = (x - element.offsetLeft) / element.offsetWidth;

		// Get percent from top of element clicked
		const percentFromTop = (y - element.offsetTop) / element.offsetHeight;

		console.log({
			x,
			y,
			element,
			percentFromLeft,
			percentFromTop
		})

		return {
			left: percentFromLeft,
			top: percentFromTop
		}
	}

	const didClickCorrectFace = (clickCoordinates) => {
		// const body = JSON.stringify({
		// 	...clickCoordinates,
		// 	bounding_box: faceBoundingBox
		// })

		// const lambdaExecutor = new LambdaExecutor(API_GATEWAY_BASE_URL);
		// const result = lambdaExecutor.verifyFaceSelection(body);
		// return result.isCorrect;

		const actualLeft = faceBoundingBox.Left;
		const actualRight = faceBoundingBox.Left + faceBoundingBox.Width;
		const actualTop = faceBoundingBox.Top;
		const actualBottom = faceBoundingBox.Top + faceBoundingBox.Height;

		console.log({
			left: actualLeft,
			mouseLeft: clickCoordinates.left,
			right: actualRight,
			top: actualTop,
			mouseTop: clickCoordinates.top,
			bottom: actualBottom,
		})

		if (
			clickCoordinates.left > actualLeft &&
			clickCoordinates.left < actualRight &&
			clickCoordinates.top > actualTop &&
			clickCoordinates.top < actualBottom
		) {
			return true;
		}
	}

	const routeToResultsPage = (isCorrect) => {
		if (isCorrect) {
			navigate('/winner'); // Navigate to /winner without page reload
		} else {
			navigate('/lost'); // Navigate to /lost without page reload
		}
	}

  return (
    <div className='aboutPage'>
      <img
				key={currentCrowdImage}
				className='waldoImg'
				src={`${currentCrowdImage}?${new Date().getTime()}`}
				alt="A crowd of faces"
				onClick={(event) => {
					const clickCoordinates = getCoordinatesFromOnClickEvent(event);
					const isCorrect = didClickCorrectFace(clickCoordinates);
					routeToResultsPage(isCorrect);
				}}
				role='button'
			></img>
      <section className='gamePanel'>
        <h1>Time Left</h1>
        <section className='timer'>
          {/* <p className='time'>22</p> */}
          <p>Don't worry, you have forever</p>
        </section>
        {/* <p className='margin'><span>Score:</span> N/A | <span>Streak:</span> 5</p> */}
        <div className='redStripe'></div>
        <div className='redStripe'></div>
        <h2>Where's Waldo??</h2>
        <section>
          <img
						key={croppedFaceImage}
						className='waldoimg'
						src={`${croppedFaceImage}?${new Date().getTime()}`}
						alt="Face of the 'waldo' you are trying to find">

						</img>
        </section>
        <h3>Your Chosen Waldo:</h3>
        {/* <img className='yourPickedWaldo' src={croppedFaceImage} alt="Face of the 'waldo' you picked by clicking"></img> */}
        {/* if correct brought to you won results page otherwise other page */}
        {/* <Link to='/winner' title='Click to confrim your waldo'>Confrim</Link> */}
      </section>
    </div>
  )
}

export default GamePage
