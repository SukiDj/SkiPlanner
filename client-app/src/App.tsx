import 'semantic-ui-css/semantic.min.css'
import './App.css'
import NavBar from './features/NavBar/NavBar'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { websocketService } from './services/websocketService'

function App() {
  
  useEffect(() => {
    websocketService.connectWebSocket();
  }, []);
  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <NavBar/>
      <Outlet/>
    </>
    
  )
}

export default observer(App)