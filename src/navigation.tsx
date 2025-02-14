import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import About from './pages/About.tsx';
import Login from './pages/Login.tsx'
import Support from './pages/Support.tsx';
import logo from './logo.svg';

export default function Navigation() {
    return (
        <Router>
            <div>
                <div className="web-header">
                    <div className="logo">
                        <img src={logo}/>
                        <p><b>AlienBaba</b>.com</p>
                    </div>
                    
                    <nav className="nav-bar">
                        <ul>
                            <li>
                                <Link to="/">About</Link>
                            </li>
                            <li>
                                <Link to="/support">Support</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <Routes>
                    <Route path="/support" element={<Support/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<About/>} />
                </Routes>
            </div>
        </Router>
    )
}