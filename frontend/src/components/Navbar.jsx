import React from 'react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    
    const handleSearch = (e) => {
        if (e.key === "Enter") {
            navigate("/", {
                state: { scrollToTitle: searchTerm.toLowerCase()}
            });
        } 
    }

    return (
        <header>
            <h1 id="site">
                <Link to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <span id="vg">VG</span>
                    <span id="rp">RP</span>
                </Link>
            </h1>

            <nav>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/reviews" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Reviews</NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/gamers" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Gamers</NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/developers" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Developers</NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/platforms" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Platforms</NavLink>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/genres" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Genres</NavLink>
            </nav>

            <div className="utility-list">
                <div className="search-bar">
                    <i className="fi fi-rr-search"></i>
                    <input type="text" 
                        role="searchbox" 
                        placeholder="Search games..." 
                        value={searchTerm}
                        onChange={(e) => {setSearchTerm(e.target.value)}}
                        onKeyDown={handleSearch}
                    />
                </div>
                <div className="header-menu">
                    <a href="">
                        <i className="fi fi-rr-menu-burger"></i>
                    </a>
                </div>
            </div>
        </header>
    )
}

export default Navbar;