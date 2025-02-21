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
            </div>
            <div className="info-container">
                <h2>Join. Drive. Earn.</h2>
                <ul>
                    <li>
                        📝 Apply to a Sponsor
                        <hr/>
                        When you join our site you will see all of our sponsored partners. Apply to as many or as little as you want — your future may be a click away!
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
            <div className="info-container">
                <h2>Management Made Easy.</h2>
                <ul>
                    <li>
                        📄 Discover Top Talent
                        <hr/>
                        Save yourself time with AlienBaba's comprehensive application system to find the ideal candidate for the job!
                    </li>
                    <li>
                        🤝 Sponsors Help Sponsors
                        <hr/>
                        Have a work partner that would be AlienBaba material? You can help them easily set up an account and add them to our site!
                    </li>
                    <li>
                        ⚙️ Ultimate Control
                        <hr/>
                        We provide our sponsored partners with a suite of adaptive utilities. Tailor your sponsor page and catalog to your exact specificiations.
                    </li>
                </ul>
            </div>
        </div>
    )
}