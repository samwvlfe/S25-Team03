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
import Test from './pages/Test.tsx';

export default function Navigation() {
    return (
        <Router>
            <div>
                <div className="web-header">
                    <h2 className="logo">Logo</h2>
                    
                    <nav className="nav-bar">
                        <ul>
                            <li>
                                <Link to="/">About</Link>
                            </li>
                            <li>
                                <Link to="/test">Test</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <Routes>
                    <Route path="/test" element={<Test/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<About tNumber={3} vNumber={2} relDate={"2/6/2025"} prodName={"Driver Incentive Program"} prodDesc={"Hello, World!"}/>} />
                </Routes>
            </div>
        </Router>
    )
}