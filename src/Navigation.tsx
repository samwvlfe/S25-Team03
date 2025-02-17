import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import About from './pages/About.tsx';
import Signup from './pages/Signup.tsx';
import Login from './pages/Login.tsx';
import Support from './pages/Support.tsx';
import logo from './logo.svg';
import accountIcon from './signin.svg';

export default function Navigation() {
    return (
        <Router>
            <div>
                <div className="web-header">
                    <Link to="/">
                        <div className="logo">
                            <img src={logo}/>
                            <p><b>AlienBaba</b>.com</p>
                        </div>
                    </Link>
                    <nav className="nav-bar">
                        <ul>
                            <li>
                                <Link to="/support">Support</Link>
                            </li>
                            <li>
                                <Link to="/signin">
                                    <img src={accountIcon}/>
                                    Sign In
                                </Link>
                            </li>
                            <li className="account-button">
                                <Link to="/signup">Sign Up</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <Routes>
                    <Route path="/support" element={<Support/>} />
                    <Route path="/signin" element={<Login />} />
                    <Route path="/singup" element={<Signup/>} />
                    <Route path="/" element={<About/>} />
                </Routes>
            </div>
        </Router>
    )
}