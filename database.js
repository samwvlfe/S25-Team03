const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 2999;
//STOP FORGETTING DEPENDENCIES YOU IDIOT

// KEEP THE ORDER JSON PARSING BEFORE MIDDLEWARE
app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 't3db-instance.cmypylkqlfup.us-east-1.rds.amazonaws.com',
    user: 't3admin',
    password: 'JlziWBbT4LmgEEbJsCwW',
    database: 'GoodDriverIncentiveT3',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to Amazon RDS MySQL database');
    }
});

//Log the middleware, need more logging
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        if (!req.body) {
            console.error('Error: req.body is undefined');
            return res.status(400).json({ error: 'Invalid JSON body' });
        }

        const logData = {
            user_id: req.body.user_id || 0,  // Default to 0
            user_type: req.body.user_type || 'Unknown',  // Default to 'Unknown'
            action: req.method,
            details: req.body
        };

        // Send log to central logging service
        axios.post('http://127.0.0.1:4000/log', logData)
            .then(() => console.log(`Sent log to logging service: ${req.method} on ${req.originalUrl}`))
            .catch(err => console.error('Failed to send log:', err.message));

    }
    next();
});

//The post route, will be abused
app.post('/api/about', (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const { team_number, version_number, release_date, product_name, product_description, user_id, user_type } = req.body;

    const query = `INSERT INTO AboutPage (team_number, version_number, release_date, product_name, product_description) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [team_number, version_number, release_date, product_name, product_description], (err, result) => {
        if (err) {
            console.error('Database insert failed:', err);
            res.status(500).json({ error: 'Database insert failed', details: err });
        } else {
            console.log(`Inserted about page data with ID: ${result.insertId}`);
            res.status(201).json({ message: 'About page updated successfully', id: result.insertId });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
