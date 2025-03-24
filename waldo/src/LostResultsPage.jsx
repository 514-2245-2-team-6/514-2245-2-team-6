import './LostResultsPage.css'
import './App.jsx'
import waldo from './assets/waldo.png'
import { Link } from "react-router-dom";

function LostResultsPage() {
  return (
    <div className='losttResultsPage'>
      <section className='results'>
        <h1>Your Results</h1>
        <h2>Better Luck Next Time, You Didn't Find Waldo!</h2>
        <p>Your Score: <span>350</span></p>
        <p>Your Streak: 6</p>
        <p>Time Taken: 8 seconds</p>
        <p>Accuracy: 100%</p>
        <Link to='/' title='Click to play again'>Play Again</Link>
        <img src={waldo} alt='clipart of waldo'></img>
      </section>
      <div className='redStripee'></div>
      <div className='redStripee'></div>
    </div>
  )
}

export default LostResultsPage
