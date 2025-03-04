const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 2998;
const secretKey = process.env.JWT_SECRET || 'ALGh772kUXAXo5Hew7/hHwad+O4HzVobucOsydiEtw2F75kzvn4GHYAJOJXSP8QcwWKEP/b2Dhr0yLCEKaL5Zg==';

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
        console.log('Connected to MySQL database');
    }
});

// Function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(user, secretKey, { expiresIn: '2h' });
};

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// **User Registration Route**
app.post('/api/register', async (req, res) => {
    const { username, password, name, companyID } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO GoodDriverIncentiveT3.Driver (Username, PasswordHash, Name, TotalPoints, CompanyID) 
                       VALUES (?, ?, ?, 0, ?)`;

        db.query(query, [username, hashedPassword, name, companyID || 1], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error', details: err });

            res.status(201).json({ message: 'User registered successfully', userID: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error hashing password' });
    }
});

// **User Login Route**
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const userQuery = `
        SELECT DriverID AS id, Username, PasswordHash, 'Driver' AS userType FROM GoodDriverIncentiveT3.Driver WHERE Username = ? 
        UNION 
        SELECT SponsorUserID AS id, Username, PasswordHash, 'SponsorUser' AS userType FROM GoodDriverIncentiveT3.SponsorUser WHERE Username = ?
    `;

    db.query(userQuery, [username, username], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0]; // Get first matching user
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // Generate JWT Token
        const token = generateToken({ id: user.id, username: user.Username, userType: user.userType });

        // Return user data with token
        res.json({
            token,
            user: {
                id: user.id,
                username: user.Username,
                userType: user.userType
            }
        });
    });
});

// **User Information Fetch Route**
app.get('/api/user', authenticateToken, (req, res) => {
    let query;
    let params = [req.user.username];

    if (req.user.userType === 'Driver') {
        query = `SELECT DriverID AS id, Username, Name, TotalPoints, CompanyID 
                 FROM GoodDriverIncentiveT3.Driver 
                 WHERE Username = ?`;
    } else if (req.user.userType === 'SponsorUser') {
        query = `SELECT SponsorUserID AS id, Username, CompanyID 
                 FROM GoodDriverIncentiveT3.SponsorUser 
                 WHERE Username = ?`;
    } else {
        return res.status(400).json({ error: 'Invalid user type' });
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json(results[0]); // Send user details for frontend display
    });
});

// Start server
app.listen(port, () => {
    console.log(`User authentication service running at http://127.0.0.1:${port}/`);
});
