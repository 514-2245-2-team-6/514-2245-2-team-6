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

	useEffect(() => {
		const handleMouseMove = (event) => {
			const cursorX = event.clientX;
			const cursorY = event.clientY;

			const actualLeft = faceBoundingBox.Left * window.innerWidth;
			const actualRight = actualLeft + faceBoundingBox.Width * window.innerWidth;
			const actualTop = faceBoundingBox.Top * window.innerHeight;
			const actualBottom = actualTop + faceBoundingBox.Height * window.innerHeight;

			const horizontalDistance = cursorX < actualLeft
				? actualLeft - cursorX
				: cursorX > actualRight
				? cursorX - actualRight
				: 0;

			const verticalDistance = cursorY < actualTop
				? actualTop - cursorY
				: cursorY > actualBottom
				? cursorY - actualBottom
				: 0;

			const distanceAway = Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);

			const proximityHint = distanceAway < 50 
				? 'Red Hot' 
				: distanceAway < 150 
				? 'Warm' 
				: 'Cold';

			const sideHint = cursorX < actualLeft
				? 'Waldo is on the left of your cursor!'
				: cursorX > actualRight
				? 'Waldo is on the right of your cursor!'
				: 'Waldo is on the center of your cursor!';

			setHint([proximityHint, sideHint]);
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, [faceBoundingBox, setHint]);

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
		<section className='hintsSection'>		
			<h2>Hints</h2>
			<ul>
				<li>{hint[0]}</li>
				<li>{hint[1]}</li>
			</ul>
		</section>
      </section>
    </div>
  )
}

export default GamePage
