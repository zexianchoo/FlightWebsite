import React, { useState } from 'react'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import SignUp from './pages/SIgnUp.jsx'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path = "/" element={<Home /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
