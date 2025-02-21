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
                    <li>
                        📝 Apply to a Sponsor
                        <hr/>
                        Joining our site will provide you with a comprehensive list of sponsors all looking for someone like you to join the team! Apply to as many or as little as you want — your future may be a click away!
                    </li>
                    <li>
                        🚚 Drive Safe
                        <hr/>
                        Once a sponsor has hired you, make sure to follow their driving guidelines. Driving to your sponsor's specifications will net you points!
                    </li>
                    <li>
                        🪙 Get Rewarded
                        <hr/>
                        After you earn enough points, you can navigate over to your sponsor's catalog. There you will be able to redeem your points for all sorts of exciting rewards!
                    </li>
                </ul>
            </div>
        </div>
    )
}