const express = require('express')
const router = express.Router()
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
