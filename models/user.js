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
    userId: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    verifyToken: String
})

// authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({
        email: email,
    }, function (err, user) {
        if (err) {
            return callback(err)
        } else if (!user) {
            err = new Error('User not found.')
            err.status = 401
            return callback(err)
        }
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return callback(err)
            }
            if (result === true) {
                return callback(null, user)
            } else {
                return callback()
            }
        })
    })
}

// UserSchema.post('findOneAndUpdate', function (doc) {
//     User.update({
//         _id: mongoose.Types.ObjectId(doc.userId)
//     }, {
//         updatedAt: Date.now()
//     }, (err, user) => {
//         if (err) {
//             console.log(err)
//         }
//     })
// })

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this
    var id = new mongoose.mongo.ObjectId()
    user._id = id
    user.userId = id
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})

const User = mongoose.model('User', UserSchema)
module.exports = User