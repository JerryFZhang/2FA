const express = require('express')
const router = express.Router()
const multer = require('multer')
const User = require('../models/User.js')
const _ = require('lodash')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, serverConfig.uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})

router.get('/', function (req, res, next) {
  var query = {}
  if (req.query.userId) {
    query.userId = req.query.userId
    User.findOne(query, 'email userId', (err, user) => {
      if (err) {
        console.log('find user error ', err)
        res.status(500).send('unable to find user')
      } else {
        res.send(user)
      }
    })
  } else {
    User.find('email userId', (err, users) => {
      if (err) {
        console.log('find user error ', err)
        res.status(500).send('unable to find user')
      } else {
        res.send(users)
      }
    })
  }
})

// // update
// router.put('/', function (req, res, next) {
//   var query = {
//     email: req.user.email
//   }
//   var updates = _.pick(req.body, ['firstName', 'lastName'])
//   console.log('updates', updates)
//   User.findOneAndUpdate(query, updates, (err, user) => {
//     if (err) {
//       console.log('find user error ', err)
//       res.status(500).send('unable to find user')
//     } else {
//       if (!user) {
//         res.status(500).send('unable to find user')
//       } else {
//         res.send('user update success')
//       }
//     }
//   })
// })

// logout
router.get('/logout', function (req, res, next) {
  res.clearCookie('auth').send('logout success')
})
module.exports = router