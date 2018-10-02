const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cons = require('consolidate')
const index = require('./routes/index')
const users = require('./routes/users')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017',{ useNewUrlParser: true })
const db = mongoose.connection
const app = express()
const Client = require('authy-client').Client;
const authy = new Client({
    key: "h7GPkzc0gB5ao08jwGzVqzHeZcJPRMoo"
});
const http = require('http');
const https = require('https');
const fs = require('fs');
const privateKey = fs.readFileSync('./domain-key.txt', 'utf8');
const certificate = fs.readFileSync('./domain-crt.txt', 'utf8');

try {
    const data = fs.readFileSync('Account.txt', 'utf8');
    const array = data.match(/[^\r\n]+/g);
    const account = array[0];
    const password = array[1];
    const phoneNumber = array[2];
} catch (e) {
    console.log('Error:', e.stack);
}
exports.sms = function (req, res) {
    authy.requestSms({
        authyId: 102974249
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
};
// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', index)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    // render the error page
    res.status(err.status || 500)
    res.send('err')
    console.log(err)
})
https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(443)

http.createServer(function (req, res) {
    res.writeHead(301, {
        "Location": "https://" + req.headers['host'] + req.url
    });
    res.end();
}).listen(80);

module.exports = app
