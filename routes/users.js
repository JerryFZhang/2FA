var User = require('../models/User.js')
const express = require('express')
const lowerCase = require('lower-case')
const router = express.Router()

router.post('/login', (req, res) => {
    if (req.body.password) {
        User.authenticate(lowerCase('123'), req.body.password, (err, user) => {
            if (err) {
                console.log(err)
            }
            if (!user) {
                res.send('Incorrect password' + err)
            } else {
                res.send('Verified')
            }
        })
    } else {
        res.send('Missing Password')
    }
})
router.post('/token', (req, res) => {
    if (req.body.username) {
        User.sms(lowerCase(req.body.username), (err, cb) => {
            if (err) res.send(err)
            res.send(cb)
        })
    } else {
        res.send('Please enter a username.')
    }
})
router.post('/verify', (req, res) => {
    if (req.body.token) {
        User.verify(req.body.token, lowerCase("123"), (err, cb) => {
            if (err) res.send(err)
            res.send(cb)
        })
    } else {
        res.send("SMS code is missing")
    }
})
router.post('/reset', (req, res) => {
    if (req.body.username && req.body.password) {
        User.resetPassword(req.query.username, req.body.password, (err) => {
            if (err) {
                res.send(err)
                console.log(err)
            }
            if (cb == true) {
                res.send('success').status(200)
            } else {
                res.send(err)
                console.log(err)
            }
        })
    } else {
        res.status("Missing Password or Username")
    }
})

module.exports = router