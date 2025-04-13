import { useContext, useEffect, useState } from 'react';
import './GamePage.css'
import GameDataContext from "./GameData/GameDataContext";
// import LambdaExecutor from './LambdaFunctions';
import { useNavigate } from 'react-router-dom';

function GamePage() {
	const {
		currentCrowdImage,
		croppedFaceImage,
		faceBoundingBox,
		score, setScore,
		setAccuracy,
		streak, setStreak,
		secondsRemaining, setSecondsRemaining,
		hint, setHint,
		SECONDS_GIVEN, TIMER_THRESHOLD, MAX_SCORE
	} = useContext(GameDataContext);

	const navigate = useNavigate(); // Hook to access history

	const [timerInterval, setTimerInterval] = useState(null);
	const [showHint, setShowHint] = useState(false);

	// Starts the timer
	useEffect(() => {
		console.log('Starting timer...');

		setSecondsRemaining(SECONDS_GIVEN);
		const timerInterval = setInterval(
			() => {
				console.log('Seconds remaining:', secondsRemaining);

				setSecondsRemaining(secondsRemaining => {
					if ((secondsRemaining-1) === 0) {
						console.log('Time\'s up!');
						navigate('/results');
						clearInterval(timerInterval);
					};
					return secondsRemaining - 1
				});
			},
			1000
		);
		setTimerInterval(timerInterval);
	}, []);

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

	const calculateScore = (clickCoordinates, secondsRemaining, setAccuracy, setStreak) => {
		const isCorrect = didClickCorrectFace(clickCoordinates);
		let horizontalDistanceAway = 0;
		let verticalDistanceAway = 0;

		const actualLeft = faceBoundingBox.Left;
		const actualRight = faceBoundingBox.Left + faceBoundingBox.Width;
		const actualTop = faceBoundingBox.Top;
		const actualBottom = faceBoundingBox.Top + faceBoundingBox.Height;

		if (isCorrect) {
			setStreak(prevStreak => prevStreak + 1);
		}
		else {
			setStreak(0);

			if (clickCoordinates.left < actualLeft) {
				horizontalDistanceAway = actualLeft - clickCoordinates.left;
			}
			else if (clickCoordinates.left > actualRight) {
				horizontalDistanceAway = clickCoordinates.left - actualRight;
			}

			if (clickCoordinates.top < actualTop) {
				verticalDistanceAway = actualTop - clickCoordinates.top;
			}
			else if (clickCoordinates.top > actualBottom) {
				verticalDistanceAway = clickCoordinates.top - actualBottom;
			}
		}

		let distanceAway = Math.sqrt(horizontalDistanceAway ** 2 + verticalDistanceAway ** 2);
		console.log({
			horizontalDistanceAway,
			verticalDistanceAway,
			distanceAway
		});

		const totalScoreTime = SECONDS_GIVEN - TIMER_THRESHOLD;
		let timerModifier = (secondsRemaining / totalScoreTime);
		const distanceModifier = (1-distanceAway);
		setAccuracy(distanceModifier);

		if (timerModifier > 1) {
			timerModifier = 1;
		}

		const score = Math.floor(
			MAX_SCORE * timerModifier * distanceModifier
		);

		console.log({
			secondsRemaining,
			totalScoreTime,
			MAX_SCORE,
			timerModifier,
			distanceModifier,
			score
		})

		return score;
	}

	// hint functionality
	const handleMouseMove = (event) => {
		const mouse = getCoordinatesFromOnClickEvent(event);

		const actualLeft = faceBoundingBox.Left;
		const actualRight = faceBoundingBox.Left + faceBoundingBox.Width;
		const actualTop = faceBoundingBox.Top;
		const actualBottom = faceBoundingBox.Top + faceBoundingBox.Height;

		// Calculate the distance between the mouse and the center of the box
		const boxCenterX = (actualLeft + actualRight) / 2;
		const boxCenterY = (actualTop + actualBottom) / 2;

		const dx = mouse.left - boxCenterX;
		const dy = mouse.top - boxCenterY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		console.log(`mouse: ${mouse.left}, ${mouse.top}`);
		console.log(`boxCenterX: ${boxCenterX}, boxCenterY: ${boxCenterY}`);
		console.log(`distance: ${distance}`);
		console.log(`dx: ${dx}, dy: ${dy}`);

		let proximityHint = '';
		// Set the hint based on the distance
		if (distance < 0.03) {
			proximityHint = 'Red Hot!';
		} else if (distance < 0.12) {
			proximityHint = 'Warmer';
		} else {
			proximityHint = 'Cold';
		}

		console.log(`proximityHint: ${proximityHint}`);

		let directionHint = '';
		// Set the hint based on the direction
		if(Math.abs(dx) > Math.abs(dy)) {
			// If the cursor is to the left or right of the face
			if(dx < 0) {
				directionHint = 'To the right of your cursor';
			} else {
				directionHint = 'To the left of your cursor';
			}
		} else {
			// If the cursor is above or below the face
			if(dy < 0) {
				directionHint = 'Below your cursor';
			} else {
				directionHint = 'Above your cursor';
			}
		}

		console.log(`directionHint: ${directionHint}`);


		// Update the hint if it's different from the previous hint
		setHint(prev => {
			// If the hint is the same as the previous hint, return the previous hint
			if(prev[0] === proximityHint && prev[1] === directionHint) {
				return prev;
			// Else If the hint is different from the previous hint, return the new hint
			} else {
				return [proximityHint, directionHint];
			}
		});
	};


	const routeToResultsPage = () => {
		navigate('/results');
	}

  return (
    <div className='aboutPage'>
			<section className="waldoImgContainer">
				<img
					key={currentCrowdImage}
					className='waldoImg'
					src={`${currentCrowdImage}?${new Date().getTime()}`}
					alt="A crowd of faces"
					onClick={(event) => {
						const clickCoordinates = getCoordinatesFromOnClickEvent(event);
						const isCorrect = didClickCorrectFace(clickCoordinates);
						const score = calculateScore(clickCoordinates, secondsRemaining, setAccuracy, setStreak);
						setScore(score);
						clearInterval(timerInterval);
						routeToResultsPage(isCorrect);
					}}
					onMouseMove={handleMouseMove}
					role='button'
				></img>
			</section>
      <section className='gamePanel'>
        <h1>Time Left</h1>
        <section className='timer'>
          <p className='time'> {secondsRemaining} </p>
          <p>Seconds</p>
        </section>
        <p className='margin'><span>Last Score:</span> {score} | <span>Streak:</span> {streak}</p>
				<section className="stripeSeperator">
					<div className='redStripe'></div>
					<div className='redStripe'></div>
				</section>
        <h2>Find This Waldo</h2>
        <section>
          <img
						key={croppedFaceImage}
						className='waldoimg'
						src={`${croppedFaceImage}?${new Date().getTime()}`}
						alt="Face of the 'waldo' you are trying to find">

						</img>
        </section>
				{showHint ||
					<button
						className='hintButton'
						onClick={() => {
							setShowHint(true);
						}}
					>Reveal Hints</button>
				}
				{hint[0] && hint[1] && showHint && (
					<section className='hintsSection'>
						<h2>Hints</h2>
						<p
							className={
								hint[0] === 'Red Hot!' ?
									'redHotHint' :
									hint[0] === 'Warmer' ?
										'warmerHint' :
										'coldHint'
							}
						>{hint[0]}</p>
						<p>{hint[1]}</p>
					</section>
				)}
      </section>
    </div>
  )
}

export default GamePage
