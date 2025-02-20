import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ship from '../spaceship.svg';
import flame from '../flame.svg';

export default function About() {
    // Obtaining all the info from the backend.
    // Using a hook to ge the data from the database.
    const [data, setData] = useState(null);

    // Making use of Axios to call the API.
    useEffect(() => {
        axios.get('http://localhost:2999/api/about')
            .then(response => {
                setData(response.data)
            })
            .catch(error => {
                console.log('Error fetching data: ', error);
            });
    }, []);

    // Returning all necessary data from the database.
    // Additional logic is in case the data isn't fully loaded.
    return (
        <div>
            <div className="about-header">
                <div className="starfield"/>
                <div className="banner">
                    <h1>AlienBaba — Safe Shuttling Starts Here</h1>
                    <div className="ship">
                        <img src={ship} height="100px"/>
                        <img src={flame} height="40px"/>
                    </div>
                    <p className="team-info">Team {data ? data.team_number : "..."} &#9900; Version {data ? data.version_number : "..."} &#9900; {data ? data.release_date : "..."}</p>
                </div>
                <div className="starfield" />
            </div>
            <div className="info-container">
                <h2>{data ? data.product_name : "..."}</h2>
                <p>{data ? data.product_description : "..."}</p>
                <ul>
                    <li>Points System</li>
                    <li>Rewards Catalog</li>
                    <li>Responsive Applications</li>
                    <li>Sponsor Controls</li>
                </ul>
            </div>
        </div>
    )
}