const { promisify } = require('util')
const mysql = require("mysql2");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
dotenv.config({ path: './.env' })
const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});
const auth = (req, res, next) => {
    const token = req.headers.token
    try {
        const result = jwt.verify(token, process.env.jwtSecret);
        req.userId = result.id
        next();
    } catch (error) {
        res.status(401).json({ message: "un-authorized" })
    }
}

module.exports = auth