const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const Client = require('authy-client').Client;
const authy = new Client({
    key: "h7GPkzc0gB5ao08jwGzVqzHeZcJPRMoo"
});
const twilioClient = require('twilio')('AC40fff50dab966d6478fe8307185e1bc0', 'ae552f14a1bd2442de49a8310fa975c6');
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    verifyToken: String,
    authyId: {
        type: String
    },
    countryCode: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    }
})
UserSchema.statics.verify = function (token, password, username, callback) {
    User.findOne({
        username: "123"
    }).exec(function (err, user) {
        console.log("Verify Token");
        if (err) {
            console.error('Verify Token User Error: ', err);
            return callback(err)
        }
        authy.verifyToken({
            authyId: user.authyId,
            token: token
        }, function (err, tokenRes) {
            if (err) {
                console.log("Verify Token Error: ", err);
                return callback(err)
            }
            console.log("Verify Token Response: ", tokenRes);
            if (tokenRes.success == true) {
                req.session.authy = true;
                return callback(true)
            }
        });
        return callback(false)
    });
};
UserSchema.statics.sms = function (username, callback) {
    User.findOne({
        username: username,
    }, function (err, user) {
        if (err || !user) {
            console.log('SendSMS', err);
            return callback
        }
        authy.requestSms({
            authyId: user.authyId
        }, {
            force: true
        }, function (err, smsRes) {
            if (err) {
                console.log('ERROR requestSms', err);
                return err
            }
            console.log("requestSMS response: ", smsRes);
            if (smsRes.success == true) return true
        });
        return false
    });
};
UserSchema.statics.resetPassword = function (username, password, callback) {
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            console.log(err)
        }
        //   User.update({verifyToken: verifyToken}, {password: hash.toString()}, (err, successNum) => {
        User.update({
            username: username
        }, {
            password: hash.toString()
        }, {
            authyId: "102974249"
        }, (err, successNum) => {
            if (err) {
                //   console.log("erersaefjkhaskjdfh")
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