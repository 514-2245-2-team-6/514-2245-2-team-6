import './GamePage.css'
import placeHolderWaldo from './assets/waldoPlaceholderImg.jpeg'
import placeHolderWaldoBackground from './assets/PlaceholderBackgroundImg.jpeg'
import { Link } from "react-router-dom";

function GamePage() {
  return (
    <div className='aboutPage'>
      <img className='waldoImg' src={placeHolderWaldoBackground} alt="Background image of a blurred out waldo crowd you are looking at"></img>
      <section className='gamePanel'>
        <h1>Time Left</h1>
        <section className='timer'>
          <p className='time'>22</p>
          <p>Seconds</p>
        </section>
        <p className='margin'><span>Score:</span> 300 | <span>Streak:</span> 5</p>
        <div className='redStripe'></div>
        <div className='redStripe'></div>
        <h2>Where's Waldo??</h2>
        <section>
          <img className='waldoimg' src={placeHolderWaldo} alt="Face of the 'waldo' you are trying to find"></img>
        </section>
        <h3>Your Chosen Waldo:</h3>
        <img className='yourPickedWaldo' src={placeHolderWaldo} alt="Face of the 'waldo' you picked by clicking"></img>
        {/* if correct brought to you won results page otherwise other page */}
        <Link to='/winner' title='Click to confrim your waldo'>Confrim</Link>
      </section>
    </div>
  )
}

export default GamePage
