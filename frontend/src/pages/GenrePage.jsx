import React from 'react';
import Card from '../components/Card.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

const GenrePage = () => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/genres')
            .then((res) => res.json())
            .then((data) => {
                setGenres(data);
            })
            .catch((err) => {
                console.log("Failed fetching genres: ", err);
            })
    }, []);

    return (
        <div className="genres">
            <h1 className="page-title">Genres</h1>
            <div className="all-cards">
                {genres.map((genre) => {
                    return(
                        <Card
                            cardType={'genre'}
                            name={genre.genre_name}
                            description={genre.genre_description}
                            image={genre.genre_image}
                            gamesCount={genre.genre_num_games}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default GenrePage;