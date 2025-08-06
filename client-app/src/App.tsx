import 'semantic-ui-css/semantic.min.css'
import './App.css'
import Map from './features/Map/Map'
import NavBar from './features/NavBar/NavBar'
import HotelList from './features/HotelList/HotelList'
import SkiResortList from './features/SkiResortsList/SkiResortList'
import SkiSlopes from './features/SkiSlopes/SkiSlopes'
import { useStore } from './stores/store'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { ToastContainer } from 'react-toastify'

function App() {
  
  
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <NavBar/>
      <Outlet/>
    </>
    
  )
}

export default observer(App)
