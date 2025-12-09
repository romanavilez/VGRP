import React from 'react'

const GamerCard = ({tag, dob, bio, avatar}) => {
    return (
        <div className='card' id='gamer-card'>
            <div className="image-container">
                <img src={avatar} alt="gamer image" />
            </div>
            <h2 className='card-name'>{tag}</h2>
            <div className="scroll-container">
                <p className='card-description'>{bio}</p>
            </div>
            <div className="card-info">
                <div className="game-release"><span>DOB:</span><span>{dob}</span></div>
            </div>
            <button id='gamer-games'>VIEW GAMES PLAYED</button>
        </div>
    )
}

export default GamerCard