import {Routes,Route} from "react-router-dom"
import './App.css'
import Home from "./Pages/Home"
import Auth from "./Pages/Auth"
import Profile from "./Pages/Profile"

function App() {
 
  return (
    <>
      <Routes >
        <Route path={'/'} element={<Home />}/>
        <Route path={'/auth'} element={<Auth />}/>
        <Route path={'/profile'} element={<Profile />}/>
        <Route />
      </Routes>
    </>
  )
}

export default App
