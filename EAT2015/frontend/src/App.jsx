import React from 'react';
import Login from './pages/Login';
import { Home } from './pages/Home';
import Search  from './pages/Search';
import SignUp from "./pages/SignUp";
// import { Test } from "./pages/Test";
import ChangeEmail from "./pages/ChangeEmail";

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
      <nav className="flex items-center justify-between py-4 px-6 bg-gray-800 text-white text-xl">
      <Link to="/" className="font-semibold hover:text-gray-300">Home</Link>
        <Link to="/login" className="hover:text-gray-300">Login</Link>
        <Link to="/SignUp" className="hover:text-gray-300">Sign Up</Link>
    </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SearchHistory" element={<Search />} />
          <Route path="/ChangeEmail" element ={<ChangeEmail/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;