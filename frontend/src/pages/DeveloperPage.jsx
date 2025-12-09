import React from 'react';
import Card from '../components/Card.jsx';
import { useState } from 'react';
import { useEffect } from 'react';

const DeveloperPage = () => {
    const [developers, setDevelopers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5001/api/developers')
            .then((res) => res.json())
            .then((data) => {
                setDevelopers(data);
            })
            .catch((err) => {
                console.log("Error fetching developers: ", err);
            })
    }, []);

    return (
        <div className="developers">
            <h1 className="page-title">Developers</h1>
            <div className="all-cards">
                {developers.map((dev) => {
                    return (
                        <Card
                            cardType={'developer'}
                            name={dev.dev_name}
                            description={dev.dev_description === "" ? 'NO DESCRIPTION :(' : dev.dev_description}
                            image={dev.dev_image}
                            gamesCount={dev.dev_num_games}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default DeveloperPage;