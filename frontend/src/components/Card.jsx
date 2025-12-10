import React from 'react'
import { useNavigate } from 'react-router-dom';

const Card = ({cardType, name, description, image, gamesCount}) => {
    const navigate = useNavigate();
    const handleDevGameList = () => {
        if (cardType === 'developer') {
            navigate("/", {
                state: {devFilter: name}
            });
        } else if (cardType === 'platform') {
            navigate("/", {
                state: {platFilter: name}
            });
        } else if (cardType === 'genre') {
            navigate("/", {
                state: {genreFilter: name}
            });
        }
    }

    return (
        <div className='card'>
            <div className="image-container">
                <img src={image} alt="card image" />
            </div>
            <h2 className='card-name'>{name}</h2>
            <div className="scroll-container">
                <p className='card-description'>{description.replace(/<[^>]+>/g, "")}</p>
            </div>
            <div className="card-info">
                <div className="games-count"><span>GAMES COUNT:</span><span>{gamesCount}</span></div>
            </div>
            <button onClick={handleDevGameList}>VIEW GAME LIST</button>
        </div>
    )
}

export default Card