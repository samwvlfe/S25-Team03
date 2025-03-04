const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const winston = require('winston');
const moment = require('moment-timezone');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 2999;

app.use(express.json());
app.use(cors());

// Database connection
const db = mysql.createConnection({
    host: 'cpsc4911.cobd8enwsupz.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: '4911Admin2025',
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
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

// Create Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: path.join(logsDir, 'audit.log') })]
});

// Set session user for MySQL queries
const setSessionUser = (userId, userType, callback) => {
    const query = `SET @current_user_id = ?, @current_user_type = ?`;
    db.query(query, [userId || 1, userType || 'Admin'], (err) => {
        if (err) {
            console.error("Failed to set session user variables:", err);
        }
        callback();
    });
};

// Logging function
const logAudit = (user_id, user_type, action, details) => {
    const timestamp = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
    const safeUserID = user_id || 0;
    const safeUserType = user_type || 'Unknown';
    const safeDetails = details ? JSON.stringify(details) : 'No additional details';

    // Log to file
    logger.info({ user_id: safeUserID, user_type: safeUserType, action, details: safeDetails, timestamp });

    // Insert log into MySQL AuditLog table
    const query = `INSERT INTO AuditLog (UserID, UserType, Timestamp, Action, Details) VALUES (?, ?, ?, ?, ?)`;
    db.query(query, [safeUserID, safeUserType, timestamp, action, safeDetails], (err) => {
        if (err) {
            console.error('Failed to save log to DB:', err);
        } else {
            console.log('Audit log successfully saved to database');
        }
    });
};

// Get latest about page data
app.get('/api/about', (req, res) => {
    db.query(`SELECT *, CONVERT_TZ(release_date, 'UTC', 'America/New_York') AS release_date_EST FROM AboutPage ORDER BY release_date DESC LIMIT 1`, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Database query failed', details: err });
        } else {
            res.json(results[0]);
        }
    });
});

// Middleware for logging database modifications
app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.body) {
        logAudit(req.body.user_id, req.body.user_type, req.method, req.body);
    }
    next();
});

// Insert new about page data
app.post('/api/about', (req, res) => {
    const { team_number, version_number, release_date, product_name, product_description, user_id, user_type } = req.body;
    
    setSessionUser(user_id, user_type, () => {
        const query = `INSERT INTO AboutPage (team_number, version_number, release_date, product_name, product_description) VALUES (?, ?, ?, ?, ?)`;

        db.query(query, [team_number, version_number, release_date, product_name, product_description], (err, result) => {
            if (err) {
                console.error('Database insert failed:', err);
                return res.status(500).json({ error: 'Database insert failed', details: err });
            }
            logAudit(user_id, user_type, 'INSERT', { id: result.insertId, ...req.body });
            res.status(201).json({ message: 'About page updated successfully', id: result.insertId });
        });
    });
});

// Update about page data
app.put('/api/about/:id', (req, res) => {
    const { team_number, version_number, release_date, product_name, product_description, user_id, user_type } = req.body;
    const { id } = req.params;
    
    setSessionUser(user_id, user_type, () => {
        const query = `UPDATE AboutPage SET team_number = ?, version_number = ?, release_date = ?, product_name = ?, product_description = ? WHERE id = ?`;

        db.query(query, [team_number, version_number, release_date, product_name, product_description, id], (err, result) => {
            if (err) {
                console.error('Database update failed:', err);
                return res.status(500).json({ error: 'Database update failed', details: err });
            }
            logAudit(user_id, user_type, 'UPDATE', req.body);
            res.json({ message: 'About page updated successfully' });
        });
    });
});

// Delete an about page entry
app.delete('/api/about/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, user_type } = req.body;
    
    setSessionUser(user_id, user_type, () => {
        const query = `DELETE FROM AboutPage WHERE id = ?`;

        db.query(query, [id], (err, result) => {
            if (err) {
                console.error('Database delete failed:', err);
                return res.status(500).json({ error: 'Database delete failed', details: err });
            }
            logAudit(user_id, user_type, 'DELETE', { id });
            res.json({ message: 'About page deleted successfully' });
        });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
