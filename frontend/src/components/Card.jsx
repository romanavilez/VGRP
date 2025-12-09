import React from 'react'

const Card = ({cardType, name, description, image, gamesCount}) => {
    let buttonId;
    if (cardType === 'developer') buttonId = 'developer-games';
    else if (cardType === 'genre') buttonId = 'genre-games';
    else if (cardType === 'platform') buttonId = 'platform-games';

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
            <button id={buttonId}>VIEW GAME LIST</button>
        </div>
    )
}

export default Card