import React from 'react'

const ReviewCard = ({title, text, date, rating, game_title, username}) => {
    return (
        <div className="review-card">
            <div className="review-header">
                <h1 id='review-game'>{game_title}</h1>
                <p id='rating'>{rating}/5</p>
            </div>
            <h2 id='review-title'>{title}</h2>
            <div className="user-info">
                <div className="user-profile">
                    <i className="fi fi-rr-mode-portrait"></i>
                    <h4 id='username'>{username}</h4>
                </div>
                <p id='post-date'>{date}</p>
            </div>
            <p id="review-body">{text}</p>
        </div>
    )
}

export default ReviewCard