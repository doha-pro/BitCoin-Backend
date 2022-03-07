const express = require('express')
const router = express.Router();
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
const superagent = require('superagent');


// get all data 
router.get("/", async(req, res) => {
    console.log(req.headers)

    try {
        if (req.headers.token) {
            let getAllData = { uid: "", investments: "" }
            const decodedJwt = await promisify(jwt.verify)(req.headers.token, process.env.jwtSecret)
            console.log(decodedJwt);
            getAllData.uid = decodedJwt;
            db.query('SELECT * FROM Investments where uid =?', [decodedJwt.id], (error, results) => {
                if (!results) {

                    return res.status(404).send("no results");
                }
                getAllData.investments = results;
                req.investments = getAllData
                console.log(req.investments)
                return res.status(200).send(getAllData.investments)
            })

        } else {
            console.log("you are not logged in")
        }

    } catch (error) {
        console.log(error)

    }



})

// Get by id 
router.get("/show/:id", async(req, res) => {
    const id = +req.params.id
    const decodedJwt = await promisify(jwt.verify)(req.headers.token, process.env.jwtSecret)
    const uid = decodedJwt.id
    console.log(+req.params.id)
    try {
        db.query("SELECT * FROM Investments where id=?  and uid = ? ", [
            [id],
            [uid]
        ], (error, results) => {
            if (results) {
                return res.status(200).send(results)
            } else {
                return res.status(404).send('there is no such investement')
            }

        })

    } catch (error) {
        console.log(error)
    }
})


router.delete("/delete/:id", (req, res) => {

    const id = +req.params.id

    try {
        db.query("SELECT * FROM Investments where id=? ", [id], (error, results) => {
            if (results.length == 1) {
                db.query('DELETE FROM Investments WHERE id=?', [id], (error, results) => {
                    if (results) {
                        return res.status(200).send(`Investement with id ${id} is deleted `)
                    }
                })
            } else {
                return res.status(404).send("Not found")
            }
        })

    } catch (error) {
        console.log(error)

    }
})


router.put("/edit/:id", (req, res) => {
    const id = +req.params.id
    let { value } = req.body
    try {
        db.query("UPDATE Investments SET value = ? WHERE id = ?", [
            [value],
            [id]
        ], (error, results) => {
            if (results) {

                return res.status(200).send("updated");
            } else {
                return res.status(400).send("notfound");
            }

        })

    } catch (error) {
        console.log(error)


    }


})

router.post("/invest", async(req, res) => {
    var data = { price: "", date: "" }
    const { value } = req.body;

    try {
        // COINAPI
        // const res = await superagent.get('https://rest.coinapi.io/v1/assets/BTC?apikey=FE4D06D2-273E-45EF-A491-E6E198668DE7');

        // NOMICS APIS
        const res = await superagent.get('https://api.nomics.com/v1/currencies/ticker?key=df6cbe9bbf472a23013ebaf9e2182160aed0c6e3&ids=BTC,ETH,XRP&interval=1d,30d&convert=EUR&platform-currency=ETH&per-page=100&page=1');
        if (req.body) {
            const body = res.body[0];
            // COIN API
            // data.price = body.price_usd
            // data.date = body.data_end;

            // NOMICS APIS
            data.price = body.price
            data.date = body.price_date;
            req.data = data;
            console.log(data)

        } else {
            console.log()
        }
        const decodedJwt = await promisify(jwt.verify)(req.headers.token, process.env.jwtSecret);
        const uid = decodedJwt.id;
        db.query("INSERT INTO Investments SET ?", {
            price: data.price,
            value: value,
            uid: uid
        }, (error, results) => {
            if (results) {
                console.log("done")
            }

        })



    } catch (err) {
        console.log(err.message);

    };
    res.send("Investment is send succesfully")


})
module.exports = router;