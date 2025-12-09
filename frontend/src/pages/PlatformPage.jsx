import React from 'react';
import Card from '../components/Card.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

const PlatformPage = () => {
    const [platforms, setPlatforms] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/platforms')
            .then((res) => res.json())
            .then((data) => {
                setPlatforms(data);
            })
            .catch((err) => {
                console.log("Failed fetching platforms: ", err);
            })
    }, [])

    return (
        <div className="platforms">
            <h1 className="page-title">Platforms</h1>
            <div className="all-cards">
                {platforms.map((platform) => {
                    return(
                        <Card 
                            cardType={'platform'}
                            name={platform.plat_name}
                            description={platform.plat_description}
                            image={platform.plat_image}
                            gamesCount={platform.plat_num_games}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default PlatformPage;