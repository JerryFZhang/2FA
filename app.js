var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cons = require('consolidate')
var index = require('./routes/index')
var mongoose = require('mongoose')
var db = mongoose.connection
const version = require('./package.json').version
var app = express()
const Client = require('authy-client').Client;
const authy = new Client({
    key: "h7GPkzc0gB5ao08jwGzVqzHeZcJPRMoo"
});

// const http = require('http');
const https = require('https');
// function handler(req, res) {
//   res.end('Hello World!');
// }
// // http.createServer(handler).listen(80);
// https.createServer(handler).listen(443)

// const PROD = true;
// const lex = require('greenlock-express').create({
//   version: 'draft-11',
//   server: PROD ? 'https://acme-v02.api.letsencrypt.org/directory' : 'https://acme-staging-v02.api.letsencrypt.org/directory',
//   approveDomains: (opts, certs, cb) => {
//     if (certs) {
//       // change domain list here
//       opts.domains = ['www.jerry.work', 'jerry.work']
//     } else { 
//       // change default email to accept agreement
//       opts.email = 'jerry.fengwei@gmail.com'; 
//       opts.agreeTos = true;
//     }
//     cb(null, { options: opts, certs: certs });
//   }
//   // optional: see "Note 3" at the end of the page
//   // communityMember: true
// });
// const middlewareWrapper = lex.middleware;

// const redirectHttps = require('redirect-https');

var fs = require('fs');
var account;
var password;
var phoneNumber;

try {
    var data = fs.readFileSync('Account.txt', 'utf8');
    var array = data.match(/[^\r\n]+/g);
    account = array[0];
    password = array[1];
    phoneNumber = array[2];
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
    var err = new Error('Not Found')
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
// http.createServer(lex.middleware(redirectHttps())).listen(80);
// https.createServer(
//     lex.httpsOptions, 
//     middlewareWrapper(handler)
//   ).listen(433);
var privateKey = fs.readFileSync( './key.pem' );
var certificate = fs.readFileSync( './csr.crt' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);

module.exports = app