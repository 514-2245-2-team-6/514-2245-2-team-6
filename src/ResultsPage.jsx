import './ResultsPage.css'
import './App.jsx'
import waldo from './assets/waldo.png'
import { Link } from "react-router-dom";
import { useContext } from 'react';
import GameDataContext from './GameData/GameDataContext.js';

function LostResultsPage() {
	const {
		score,
		SECONDS_GIVEN,
		accuracy,
		streak,
		secondsRemaining,
	} = useContext(GameDataContext);

  return (
    <div className='losttResultsPage'>
      <section className='results'>
        <h1>Your Results</h1>
        <h2>{
					accuracy >= 1 ?
						'You found Waldo!' :
						'You did not find Waldo.'
				}</h2>
        <p>Your Score: <span>{score}/10</span></p>
        <p>Your Streak: {streak}</p>
        <p>Time Taken: {SECONDS_GIVEN - secondsRemaining} seconds</p>
        <p>Accuracy: {Math.round(accuracy * 100)}%</p>
        <Link to='/' title='Click to play again'>Play Again</Link>
        <img src={waldo} alt='clipart of waldo'></img>
      </section>
      <div className='redStripee'></div>
      <div className='redStripee'></div>
    </div>
  )
}

export default LostResultsPage
