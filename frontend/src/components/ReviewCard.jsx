import React from 'react';

const ReviewCard = ({ id, title, text, date, rating, game_title, username, onEdit, onDelete }) => {
    return (
        <div className="review-card">
            <div className="review-header">
                <h1 id="review-game">{game_title}</h1>
                <p id="rating">{rating}/5</p>
            </div>
            <h2 id="review-title">{title}</h2>
            <div className="user-info">
                <div className="user-profile">
                    <i className="fi fi-rr-mode-portrait"></i>
                    <h4 id="username">{username}</h4>
                </div>
                <p id="post-date">{(date ?? '').toString().substring(0, 10)}</p>
            </div>
            <p id="review-body">{text}</p>
            <div className="review-actions">
                <button onClick={() => onEdit?.(id)} className="btn edit">Edit</button>
                <button onClick={() => onDelete?.(id)} className="btn delete">Delete</button>
            </div>
        </div>
    );
};

export default ReviewCard;
