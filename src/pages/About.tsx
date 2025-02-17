import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div className="container">
            <h1>About Us</h1>
            <ul>
                <li>Team {data ? data.team_number : "..."}</li>
                <li>Version {data ? data.version_number : "..."}</li>
                <li>{data ? data.release_date : "..."}</li>
                <li>{data ? data.product_name : "..."}</li>
                <li>{data ? data.product_description : "..."}</li>
            </ul>
        </div>
    )
}