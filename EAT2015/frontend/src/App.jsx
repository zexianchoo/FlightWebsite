import React from 'react';
import Login from './pages/Login';
import { Home } from './pages/Home';
import SignUp from "./pages/SignUp";
// import { Test } from "./pages/Test";
// import ChangeEmail from "./pages/ChangeEmail";

import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link 
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <Link to="/">Home</Link> | <Link to="/login">Login</Link> | <Link to="/SignUp">Sign Up</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          {/* <Route path="/ChangeEmail" element ={<ChangeEmail/>} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;