import React from 'react';
import ReviewCard from '../components/ReviewCard.jsx';
import { useState, useEffect } from 'react';

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/api/reviews")
            .then((res) => res.json())
            .then((data) => {
                setReviews(data);
            })
            .catch((err) => {
                console.log("Error fetching reviews: ", err);
            })
    }, [])


    return (
        <div className="reviews">
            <h1 className="page-title">Reviews</h1>
            <div className="review-cards">
                {reviews.map((review) => {
                    return(
                        <ReviewCard 
                            title={review.rev_title}
                            text={review.rev_text}
                            date={review.rev_date.substring(0, 10)}
                            rating={review.rating}
                            game_title={review.game_title}
                            username={review.username}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default ReviewPage;