import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import LoginPopup from './LoginPopup.jsx';
import SignUpPage from './SignUpPopup.jsx';

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    return (
        <>
            <header>
                <h1 id="site">
                    <Link to="/">
                        <span id="vg">VG</span>
                        <span id="rp">RP</span>
                    </Link>
                </h1>

                <nav>
                    <Link to="/reviews">Reviews</Link>
                    <Link to="/gamers">Gamers</Link>
                    <Link to="/developers">Developers</Link>
                    <Link to="/platforms">Platforms</Link>
                    <Link to="/genres">Genres</Link>
                </nav>

                <div className="utility-list">
                    <div className="search-bar">
                        <i className="fi fi-rr-search"></i>
                        <input type="text" role="searchbox" placeholder="Search"/>
                    </div>
                
                    <div className="header-menu">
                        <a href="" onClick={(e) => {
                            e.preventDefault();
                            setShowLogin(true);
                        }}>
                            <i className="fi fi-rr-circle-user"></i>
                        </a>
                        {showLogin && <LoginPopup setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />}
                        {showSignUp && <SignUpPage setShowSignUp={setShowSignUp} setShowLogin={setShowLogin}/>}
                    </div>
                </div>
            </header>
            <div className="welcome-container">
                <p className="welcome-text"></p>
            </div>
        </>
    )
}

export default Navbar;