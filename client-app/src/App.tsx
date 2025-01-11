import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Map from './features/Map/Map'
import NavBar from './features/NavBar/NavBar'
import HotelList from './features/HotelList/HotelList'
import SkiResortList from './features/SkiResortsList/SkiResortList'
import SkiSlopes from './features/SkiSlopes/SkiSlopes'
import { useStore } from './stores/store'
import { observer } from 'mobx-react-lite'

function App() {


  const {skiResortStore : {selectedResort}} = useStore() 

  
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
    {selectedResort && <SkiSlopes/>}
    
    </>
    
  )
}

export default observer(App)
