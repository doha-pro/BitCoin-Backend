const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth')
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
router.post("/register", (req, res) => {
    const { name, email, password, passwordConfirmation } = req.body;
    db.query('SELECT email FROM users where email=?', [email], async(error, results) => {
        if (error) {
            console.log(error)
        }
        if (results.length > 0) {
            return res.status(401).send("message:This email is already used ")
        } else {
            if (password !== passwordConfirmation) {
                return res.status(401).send("message: Password don't match")

            } else {
                let hashedPassword = await bcrypt.hash(password, 8);
                db.query("INSERT INTO users SET ?", { name: name, email: email, password: hashedPassword }, (error, results) => {
                    if (error) {
                        console.log(error)
                    } else {
                        return res.status(200).send("Succesfull")
                            // return res.send("WEEEEEEEEEEEEEEEEEEEEEEEE")
                    }
                });

            }
        }



    })
})

router.post("/login", (req, res) => {
    try {
        const { email, password } = req.body

        db.query("SELECT * FROM users where email = ?", [email], async(error, results) => {
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).send(" message:Email or password is incorrect ")

            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.jwtSecret, { expiresIn: process.env.jwtExpiration });
                console.log(`the token is ${token}`)

                res.status(200).send("your token is " + token)
            }
        })

    } catch (error) {
        console.log(error)

    }

})






module.exports = router;