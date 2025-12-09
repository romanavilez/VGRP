import React from 'react';
import GamerCard from '../components/GamerCard.jsx';
import { useState, useEffect } from 'react';

const GamerPage = () => {
    const [gamers, setGamers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5001/api/gamers")
            .then((res) => res.json())
            .then((data) => {
                setGamers(data);
            })
            .catch((err) => {
                console.log("Failed fetching gamers: ", err);
            })
    }, [])

    return (
        <div className="gamers">
            <h1 className="page-title">Gamers</h1>
            <div className="all-cards">
                {gamers.map((gamer) => {
                    return(
                        <GamerCard
                            tag={gamer.gamer_tag}
                            dob={gamer.gamer_dob.substring(0,10)}
                            bio={gamer.bio}
                            avatar={gamer.avatar}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default GamerPage;