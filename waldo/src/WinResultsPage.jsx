import './WinResultsPage.css'
import './App.jsx'

function WinResultsPage() {
  return (
    <div className='winResultsPage'>
      <h1>Your Results</h1>
      <h2>Great Job, You Found Waldo! Congrats!!</h2>
      <p>Your Score: <span>350</span></p>
      <p>Your Streak: 6</p>
      <p>Time Taken: 8 seconds</p>
      <p>Accuracy: 100%</p>
      <a href='' title='Click to play again'>Play Again</a>
    </div>
  )
}

export default WinResultsPage
