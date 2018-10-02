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

// authenticate input against database
UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({
        username: username,
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
UserSchema.statics.verify = function (token, password, username, callback) {
    User.findOne({
        username: username
    }).exec(function (err, user) {
        console.log("Verify Token");
        console.log(user)
        if (err) {
            console.error('Verify Token User Error: ', err);
            res.status(500).json(err);
        }
        authy.verifyToken({
            authyId: user.authyId,
            token: token
        }, function (err, tokenRes) {
            if (err) {
                console.log("Verify Token Error: ", err);
                res.status(500).json(err);
                return;
            }
            console.log("Verify Token Response: ", tokenRes);
            if (tokenRes.success) {
                req.session.authy = true;
            }
            res.status(200).json(tokenRes);
        });
    });
};

UserSchema.statics.sms = function (username, callback) {
    User.findOne({
        username: username,
    }, function (err, user) {
        console.log("Send SMS");
        console.log(user);
        if (err) {
            console.log('SendSMS', err);
            res.status(500).json(err);
            return;
        }
        authy.requestSms({
            authyId: user.authyId
        }, {
            force: true
        }, function (err, smsRes) {
            if (err) {
                console.log('ERROR requestSms', err);
                res.status(500).json(err);
                return;
            }
            console.log("requestSMS response: ", smsRes);
            res.status(200).json(smsRes);
        });

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


// Send a text message via twilio to this user
UserSchema.methods.sendMessage =
    function (message, successCallback, errorCallback) {
        const self = this;
        const toNumber = `+${self.countryCode}${self.phone}`;

        twilioClient.messages.create({
            to: toNumber,
            body: message,
        }).then(function () {
            successCallback();
        }).catch(function (err) {
            errorCallback(err);
        });
    };

const User = mongoose.model('user', UserSchema)
module.exports = User