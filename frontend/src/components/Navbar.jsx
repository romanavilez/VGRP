import React from 'react';
import { Link } from 'react-router-dom';

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