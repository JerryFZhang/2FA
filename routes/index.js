var express = require('express')
var router = express.Router()
// const request = require('request')
const version = require('../package.json').version
const request = require('request')
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
module.exports = router
