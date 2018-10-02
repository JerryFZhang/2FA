const express = require('express')
const router = express.Router()
// const request = require('request')
const version = require('../package.json').version

const request = require('request')
const multer = require('multer')
const User = require('../models/User.js')
const _ = require('lodash')
const lowerCase = require('lower-case')
const fs = require('fs')

var jwt = require('jsonwebtoken')
var jwtSecret = 'bsud!32*(SAHGxna1)'
// START OF HOMEPAGE
router.get('/', function (req, res, next) {
    res.render('login')
})
router.get('/auth', function (req, res, next) {
    res.render('auth')
})
router.get('/logged-in', function (req, res, next) {
    res.render('logged-in')
})
// router.get('/users/', function (req, res, next) {
//     res.send('user')
// })

router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        User.authenticate(lowerCase(req.body.username), req.body.password, (err, user) => {
            if (err) {
                console.log(err)
            }
            if (err || !user) {
                res.send('incorrect password')
            } else {
                var token = grantAccess(user)
                res.cookie('auth', token).json({
                    success: true,
                    message: 'loginSuccess',
                    token: token
                })
            }
        })
    } else {
        res.send('login failed')
    }
})

router.post('/token', (req, res) => {
    console.log(req)

    if (req.body.username) {
        User.sms(lowerCase(req.body.username), (err, user) => {
            if (err) {
                console.log(err)
            }
            if (err || !user) {
                res.send('Username does not exist')
            } else {
                res.cookie('auth', username).json({
                    success: true,
                    message: 'loginSuccess',
                    username: username
                })
                res.redirect("auth")
            }
        })
    } else {
        res.send('login failed')
    }
})

router.post('/verify', (req, res) => {
    console.log("in verify")
    if (req.body.username && req.body.password) {
    console.log("username pass word exists")
        User.verify(req.body.token, req.body.password, lowerCase(req.body.username), (err, user) => {

            if (err) {
                console.log(err)
            }
            if (err || !user) {
                res.send('incorrect password')
            } else {
                var token = grantAccess(user)
                res.cookie('auth', token).json({
                    success: true,
                    message: 'loginSuccess',
                    token: token
                })
            }
        })
    } else {
        res.send('login failed')
    }
})

router.post('/reset', (req, res) => {
    console.log(req.body)
    var token = req.query.token
    if (req.body.password) {
        User.resetPassword(req.query.username, req.body.password, (err) => {
            // console.log("err")
            if (err) {
                console.log(err)
            } else {
                res.send('reset password success')
            }
        })
    } else {
        res.status(404)
    }
})

router.post('/sms', (req, res) => {
    console.log(req.body)
    var token = req.query.token
    if (req.body.username) {
        User.sendAuthyToken(req.query.username, (err) => {
            // console.log("err")
            if (err) {
                console.log(err)
            } else {
                res.send('reset password success')
            }
        })
    } else {
        res.status(404)
    }
})

// logout
router.get('/logout', function (req, res, next) {
    res.clearCookie('auth').send('logout success')
})

function grantAccess(user) {
    const payload = {
        username: user.email,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
    }
    var token = jwt.sign(payload, jwtSecret)
    return token
}


module.exports = router