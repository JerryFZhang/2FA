var express = require('express')
var router = express.Router()
// const request = require('request')
const version = require('../package.json').version
var authMiddleware = new AuthMiddleware()
const request = require('request')

// START OF HOMEPAGE
router.get('/', function (req, res, next) {
  res.render("yo")
})

module.exports = router
