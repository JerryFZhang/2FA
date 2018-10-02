const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

var UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    verifyToken: String
})

// authenticate input against database
UserSchema.statics.authenticate = function (userName, password, callback) {
    User.findOne({
        userName: userName,
    }, function (err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            err = new Error('User not found.')
            err.status = 401
            return callback(err)
        }
        bcrypt.compare(password, user.password, function (err, result) {
            console.log(password)
            console.log(user.password)
            console.log(result)

            if (err) {
                return callback(err)
                console.log("noooo")
            }
            if (result === true) {
                console.log("yay")
                return callback(null, user)
            } else {
                console.log("ayyayays")
                return callback()
            }
        })
    })
}

UserSchema.statics.resetPassword = function (userName, password, callback) {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) {
        console.log(err)
      }
    //   User.update({verifyToken: verifyToken}, {password: hash.toString()}, (err, successNum) => {
      User.update({userName: userName}, {password: hash.toString()}, (err, successNum) => {

        if (err) {
          console.log(err)
          callback(err)
        }
        callback()
      })
    })
  }

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this
    var id = new mongoose.mongo.ObjectId()
    user._id = id
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})

const User = mongoose.model('user', UserSchema)
module.exports = User