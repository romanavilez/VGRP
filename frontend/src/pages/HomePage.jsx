import { React, useEffect, useState  } from 'react';
import GameCard from '../components/GameCard.jsx';

const HomePage = () => {
    const [games, setGames] = useState([]);
    const [sortedGames, setSortedGames] = useState([]);

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
        setSortedGames(sorted);
    }, [games])

    return (
        <div className="home">
            <div className="home-header">
                <h1 className="page-title">All Games</h1>
                <div className="filter" id="game-filter">
                    <h2 className='filter-name'>Developer</h2>
                    <div className="dropdown-box">
                        <h2 className='dropdown-box-text'></h2>
                        <ul className='dropdown-list'>
                            <li>Dev 1</li>
                            <li>Dev 2</li>
                            <li>Dev 3</li>
                        </ul>
                    </div>
                </div>
                <div className="filter" id="plat-filter">
                    <h2 className='filter-name'>Platform</h2>
                    <div className="dropdown-box">
                        <h2 className='dropdown-box-text'></h2>
                        <ul className='dropdown-list'>
                            <li>Plat 1</li>
                            <li>Plat 2</li>
                            <li>Plat 3</li>
                        </ul>
                    </div>
                </div>
                <div className="filter" id="genre-filter">
                    <h2 className='filter-name'>Genre</h2>
                    <div className="dropdown-box">
                        <h2 className='dropdown-box-text'></h2>
                        <ul className='dropdown-list'>
                            <li>Genre 1</li>
                            <li>Genre 2</li>
                            <li>Genre 3</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="all-cards">
                {sortedGames.map((game) => {
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