const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const app = express();
const port = process.env.PORT || 2998;

// Middleware
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

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create Winston logger for file-based logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: path.join(logsDir, 'audit.log') })
    ]
});

// Function to log database changes to a file only
const logAudit = (action, details, user_id, user_type) => {
    const logMessage = {
        action: action,
        details: details,
        user_id: user_id,
        user_type: user_type,
        timestamp: new Date().toISOString()
    };

    // Write to local file only (no database interaction)
    logger.info(logMessage);
    console.log(`Audit log entry created: ${action} - ${details}`);
};

// Table name for the about page
const aboutTable = 'AboutPage';

// Get the latest about page data
app.get('/api/about', (req, res) => {
    db.query(`SELECT * FROM ${aboutTable} ORDER BY release_date DESC LIMIT 1`, (err, results) => {
        if (err) {
            const errorMsg = 'Database query failed';
            console.error(errorMsg, err);
            res.status(500).json({ error: errorMsg, details: err });
        } else {
            console.log('Fetched latest about page data');
            res.json(results[0]);
        }
    });
});

// Add new about page data
app.post('/api/about', (req, res) => {
    const { team_number, version_number, release_date, product_name, product_description, user_id, user_type } = req.body;
    const ip_address = req.ip;
    const query = `INSERT INTO ${aboutTable} (team_number, version_number, release_date, product_name, product_description) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [team_number, version_number, release_date, product_name, product_description], (err, result) => {
        if (err) {
            const errorMsg = 'Database insert failed';
            console.error(errorMsg, err);
            res.status(500).json({ error: errorMsg, details: err });
        } else {
            logAudit('INSERT', `Added about page data with ID: ${result.insertId}`, user_id, user_type);
            console.log(`Inserted new about page data with ID: ${result.insertId}`);
            res.status(201).json({ message: 'About page updated successfully', id: result.insertId });
        }
    });
});

// Update existing about page data
app.put('/api/about/:id', (req, res) => {
    const id = req.params.id;
    const { team_number, version_number, release_date, product_name, product_description, user_id, user_type } = req.body;
    const ip_address = req.ip;
    const query = `UPDATE ${aboutTable} SET team_number=?, version_number=?, release_date=?, product_name=?, product_description=? WHERE id=?`;

    db.query(query, [team_number, version_number, release_date, product_name, product_description, id], (err, result) => {
        if (err) {
            const errorMsg = 'Database update failed';
            console.error(errorMsg, err);
            res.status(500).json({ error: errorMsg, details: err });
        } else {
            logAudit('UPDATE', `Updated about page data with ID: ${id}`, user_id, user_type);
            console.log(`Updated about page data with ID: ${id}`);
            res.json({ message: 'About page data updated successfully' });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});