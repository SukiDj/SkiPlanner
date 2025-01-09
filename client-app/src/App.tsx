import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Map from './features/Map/Map'
import NavBar from './features/NavBar/NavBar'
import HotelList from './features/HotelList/HotelList'
import SkiResortList from './features/SkiResortsList/SkiResortList'

function App() {

  return (
    <>
    <NavBar/>
    <div className='container'>
      <div className='mapContainer'>
        <Map/>
      </div>
      <div className='listContainer'>
        <SkiResortList/>
      </div>
    </div>
    
    
    </>
    
  )
}

export default App
