import React from 'react'

const GameCard = ({image, rating, title, description, release_date, devs, platforms, genres}) => {
    return (
        <div className='card' id='game-card'>
            <div className="image-container">
                <img src={image} alt="game image" />
                <p className='game-rating'>{rating}/5</p>
            </div>
            <h2 className='card-name'>{title}</h2>
            <div className="scroll-container">
                <p className='card-description'>{description.replace(/<[^>]+>/g, "")}</p>
            </div>
            <div className="card-info">
                <div className="game-release"><span>RELEASE DATE:</span><span>{release_date}</span></div>
                <div className="game-developers"><span>DEVELOPER(S):</span><span>{devs}</span></div>
                <div className="game-platforms"><span>PLATFORM(S):</span><span>{platforms}</span></div>
                <div className="game-genres"><span>GENRE(S):</span><span>{genres}</span></div>
            </div>
            <button id='game-reviews'>SEE REVIEWS</button>
        </div>
    )
}

export default GameCard