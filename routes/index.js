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


router.get('/', function (req, res, next) {
    res.render('login')
})
router.get('/auth', function (req, res, next) {
    res.render('auth')
})
router.get('/logged-in', function (req, res, next) {
    res.render('logged-in')
})

module.exports = router