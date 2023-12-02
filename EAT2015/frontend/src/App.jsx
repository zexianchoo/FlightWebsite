import React from 'react';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import SignUp from "./pages/SIgnUp"
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link // Import Link
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;