var User = require('../models/User.js')
const router = express.Router()

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
                res
                    .cookie('auth', token)
                    .json({success: true, message: 'loginSuccess', token: token})
            }
        })
    } else {
        res.send('login failed')
    }
})

router.post('/token', (req, res) => {
    if (req.body.username) {
        User.sms(lowerCase(req.body.username), (err, cb) => {
            if (err) {
                res.send(err)

            } else {
                res.send(cb)
            }
        })
    } else {
        res.send('login failed')
    }
})

router.post('/verify', (req, res) => {
    if (req.body.username && req.body.password) {
        console.log("username pass word exists")
        User.verify(req.body.token, req.body.password, lowerCase(req.body.username), (err, cb) => {
            if (err) {
                console.log(err)
            }
            if (cb == true) {
                res
                    .send('success')
                    .status(200)
            } else {
                res.send('login failed')
                console.log(cb)
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
            if (err) {
                res.send(err)
                console.log(err)
            }
            if (cb == true) {
                res
                    .send('success')
                    .status(200)
            } else {
                res.send(err)
                console.log(err)
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
    res
        .clearCookie('auth')
        .send('logout success')
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
