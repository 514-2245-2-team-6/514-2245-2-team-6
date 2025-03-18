import './App.css'
import placeHolderWaldo from './assets/waldoPlaceholderImg.jpeg'
import placeHolderWaldoBackground from './assets/PlaceholderBackgroundImg.jpeg'

function App() {
  return (
    <div className='landingPage'>
      <img className='backgroundImg' src={placeHolderWaldoBackground} alt="Background image of a blurred out waldo crowd you are looking at"></img>
      <h1>Welcome To The Where's Waldo Game!!</h1>
      <p>Your <span>Goal</span> is to find "Waldo" before the timer runs out!</p>
      <p>You have 30 seconds...</p>
      <section>
        <img className='waldoimg' src={placeHolderWaldo} alt="Face of the 'waldo' you are trying to find"></img>
        <div className='magnifyingBlockOne'></div>
        <div className='magnifyingBlockTwo'></div>
      </section>
      <button>Play Now</button>
    </div>
  )
}

export default App
