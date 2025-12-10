import { React, useEffect, useState  } from 'react';
import GameCard from '../components/GameCard.jsx';

const HomePage = () => {
    const [games, setGames] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [platforms, setPlatforms] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [filteredDev, setFilteredDeveloper] = useState();
    const [filteredPlat, setFilteredPlatform] = useState();
    const [filteredGenre, setFilteredGenre] = useState();

    // Fetch all games
    useEffect(() => {
        fetch("http://localhost:5001/api/games")
            .then((res) => res.json())
            .then((data) => {
                setGames(data);
            })
            .catch((err) => {
                console.log("Error fetching games:", err);
            });
    }, []);

    useEffect(() => {
        const sorted = [...games].sort((a, b) => b.overall_rating - a.overall_rating);
        setFilteredGames(sorted);
    }, [games])

    // Fetch all developers
    useEffect(() => {
        fetch("http://localhost:5001/api/developers")
            .then((res) => res.json())
            .then((data) => {
                setDevelopers(data);
            })
            .catch((err) => {
                console.log("Error fetching developers:", err);
            });
    }, []);

    // Fetch all platforms
    useEffect(() => {
        fetch("http://localhost:5001/api/platforms")
            .then((res) => res.json())
            .then((data) => {
                setPlatforms(data);
            })
            .catch((err) => {
                console.log("Error fetching platforms:", err);
            });
    }, []);

    // Fetch all genres
    useEffect(() => {
        fetch("http://localhost:5001/api/genres")
            .then((res) => res.json())
            .then((data) => {
                setGenres(data);
            })
            .catch((err) => {
                console.log("Error fetching genres:", err);
            });
    }, []);

    // search functionality
    useEffect(() => {
        const searchedGame = location.state?.scrollToTitle;
        let gameTitle;
        if (searchedGame) {
            const matchedGame = filteredGames.find((game) => {
                if (game.game_title.toLowerCase() === searchedGame) {
                    gameTitle = game.game_title;
                    console.log("matched game");
                    console.log(gameTitle);
                    return true;
                }
                console.log("didn't match game");
                return false;
            });
            if (matchedGame) {
                const gameCard = document.querySelector(`[data-title="${gameTitle}"]`);
                if (gameCard) {
                    gameCard.scrollIntoView({behavior: "smooth", block: "center"});
                    gameCard.style.color = '#EFBF04';
                    gameCard.style.transition = 'color 0.5s ease-in-out'
                    const card = gameCard.parentElement;
                    card.style.border = '7px solid #EFBF04';

                    setTimeout(() => {
                        gameCard.style.color = '';
                        card.style.border = '';
                    }, 2500);
                }
            }
        }
    }, [location.state]);

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (filteredDev) params.append("developer", filteredDev);
        if (filteredPlat) params.append("platform", filteredPlat);
        if (filteredGenre) params.append("genre", filteredGenre);

        fetch(`http://localhost:5001/api/games/filter?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setFilteredGames(data);
            })
            .catch((err) => {
                console.log("Error fetching filtered games: ", err);
            });
    }

    const resetFilters = () => {
        const sorted = [...games].sort((a, b) => b.overall_rating - a.overall_rating);
        setGames(sorted);
        setFilteredGames(games);
        const devSelection = document.querySelector('#dev-selection');
        const platformSelection = document.querySelector('#plat-selection');
        const genreSelection = document.querySelector('#genre-selection');
        devSelection.textContent = "";
        platformSelection.textContent = "";
        genreSelection.textContent = "";
        setFilteredDeveloper(null);
        setFilteredPlatform(null);
        setFilteredGenre(null);
    }

    return (
        <div className="home">
            <div className="home-header">
                <h1 className="page-title">All Games</h1>
                <div className="filter" id="dev-filter">
                    <h2 className='filter-name'>Developer</h2>
                    <div className="dropdown-box">
                        <div className='dropdown-text'>
                            <h2 id='dev-selection'>{filteredDev}</h2>
                            <i className="fi fi-rr-dropdown-select"></i>
                        </div>
                        <ul className='dropdown-list' id='dev-list'>
                            {developers.map((dev) => {    
                                return <li onClick={() => setFilteredDeveloper(dev.dev_name)}>{dev.dev_name}</li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className="filter" id="plat-filter">
                    <h2 className='filter-name'>Platform</h2>
                    <div className="dropdown-box">
                        <div className='dropdown-text'>
                            <h2 id='plat-selection'>{filteredPlat}</h2>
                            <i className="fi fi-rr-dropdown-select"></i>
                        </div>
                        <ul className='dropdown-list' id='plat-list'>
                            {platforms.map((platform) => {
                                return <li onClick={() => setFilteredPlatform(platform.plat_name)}>{platform.plat_name}</li>
                            })}
                        </ul>
                    </div>
                </div>
                <div className="filter" id="genre-filter">
                    <h2 className='filter-name'>Genre</h2>
                    <div className="dropdown-box">
                        <div className='dropdown-text'>
                            <h2 id='genre-selection'>{filteredGenre}</h2>
                            <i className="fi fi-rr-dropdown-select"></i>
                        </div>
                        <ul className='dropdown-list' id='genre-list'>
                            {genres.map((genre) => {
                                return <li onClick={() => setFilteredGenre(genre.genre_name)}>{genre.genre_name}</li>
                            })}
                        </ul>
                    </div>
                </div>
                <button id='apply-filter' onClick={applyFilters}>Apply Filters</button>
                <button id='reset-filter' onClick={resetFilters}>Reset Filters</button>

            </div>
            <div className="all-cards">
                {filteredGames.map((game) => {
                    return (
                        <GameCard
                            image={game.game_image}
                            rating={game.overall_rating}
                            title={game.game_title}
                            description={game.game_description}
                            release_date={game.release_date.substring(0, 10)}
                            devs={game.developers}
                            platforms={game.platforms}
                            genres={game.genres}
                        />
                    )
                })}
            </div>
        </div>
    );
}

export default HomePage;