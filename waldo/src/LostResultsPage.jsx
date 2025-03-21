import './LostResultsPage.css'
import placeHolderWaldo from './assets/waldoPlaceholderImg.jpeg'
import placeHolderWaldoBackground from './assets/PlaceholderBackgroundImg.jpeg'

function LostResultsPage() {
  return (
    <div className='aboutPage'>
      <img className='backgroundImg' src={placeHolderWaldoBackground} alt="Background image of a blurred out waldo crowd you are looking at"></img>
      <section>
        <h1>Time Left</h1>
        <section className='timer'>
          <p>22</p>
          <p>Seconds</p>
        </section>
        <p><span>Score:</span> 300 | <span>Streak:</span> 5</p>
        <div className='redStripe'></div>
        <div className='redStripe'></div>
        <h2>Where's Waldo??</h2>
        <section>
          <img className='waldoimg' src={placeHolderWaldo} alt="Face of the 'waldo' you are trying to find"></img>
          <div className='magnifyingBlockOne'></div>
          <div className='magnifyingBlockTwo'></div>
        </section>
        <h3>Your Chosen Waldo:</h3>
        <img className='yourPickedWaldo' src={placeHolderWaldo} alt="Face of the 'waldo' you picked by clicking"></img>
        {/* if correct brought to you won results page otherwise other page */}
        <a href='' title='Click to confrim your waldo'>Confrim</a>
      </section>
    </div>
  )
}

export default LostResultsPage
