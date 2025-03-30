import './GamePage.css'
import { Link } from "react-router-dom";

const CURRENT_CROWD_IMAGE = "https://projectawscrowdimages3bucket.s3.us-east-1.amazonaws.com/current-image.png";
const CROPPED_FACE_IMAGE = "https://projectawscrowdimages3bucket.s3.us-east-1.amazonaws.com/cropped-face-image.png";


function GamePage() {
  return (
    <div className='aboutPage'>
      <img className='waldoImg' src={CURRENT_CROWD_IMAGE} alt="A crowd of faces"></img>
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
          <img className='waldoimg' src={CROPPED_FACE_IMAGE} alt="Face of the 'waldo' you are trying to find"></img>
        </section>
        <h3>Your Chosen Waldo:</h3>
        <img className='yourPickedWaldo' src={CROPPED_FACE_IMAGE} alt="Face of the 'waldo' you picked by clicking"></img>
        {/* if correct brought to you won results page otherwise other page */}
        <Link to='/winner' title='Click to confrim your waldo'>Confrim</Link>
      </section>
    </div>
  )
}

export default GamePage
