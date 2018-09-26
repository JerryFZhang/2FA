var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cons = require('consolidate')
var index = require('./routes/index')
const version = require('./package.json').version
var app = express()

require('greenlock-express').create({
    // Let's Encrypt v2 is ACME draft 11
    version: 'draft-11'
        // Note: If at first you don't succeed, switch to staging to debug
        // https://acme-staging-v02.api.letsencrypt.org/directory

        ,
    server: 'https://acme-v02.api.letsencrypt.org/directory'
        // Where the certs will be saved, MUST have write access

        ,
    configDir: '~/.config/acme/'
        // You MUST change this to a valid email address

        ,
    email: 'jerry.fengwei@gmail.com'
        // You MUST change these to valid domains
        // NOTE: all domains will validated and listed on the certificate

        ,
    approveDomains: ['my.warmer.com', 'www.my.warmer.com']
        // You MUST NOT build clients that accept the ToS without asking the user

        ,
    agreeTos: true,
    app: require('express')().use('/', function (req, res) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end('Hello, World!\n\n💚 🔒.js');
        })
        // Join the community to get notified of important updates

        ,
    communityMember: true
        // Contribute telemetry data to the project

        ,
    telemetry: true
    //, debug: true
}).listen(80, 443);
'use strict';
// returns an instance of greenlock.js with additional helper methods
var glx = require('greenlock-express').create({
    server: 'https://acme-v02.api.letsencrypt.org/directory'
        // Note: If at first you don't succeed, stop and switch to staging:
        // https://acme-staging-v02.api.letsencrypt.org/directory

        ,
    version: 'draft-11' // Let's Encrypt v2 (ACME v2)
        // If you wish to replace the default account and domain key storage plugin

        ,
    store: require('le-store-certbot').create({
            configDir: require('path').join(require('os').homedir(), 'acme', 'etc'),
            webrootPath: '/tmp/acme-challenges'
        })
        // Contribute telemetry data to the project

        ,
    telemetry: true,
    approveDomains: approveDomains
});
var server = glx.listen(80, 443, function () {
    console.log("Listening on port 80 for ACME challenges and 443 for express app.");
});
var plainServer = server.unencrypted;
plainServer.on('error', function (err) {});
var http01 = require('le-challenge-fs').create({
    webrootPath: '/tmp/acme-challenges'
});

function approveDomains(opts, certs, cb) {
    // This is where you check your database and associated
    // email addresses with domains and agreements and such
    // Opt-in to submit stats and get important updates
    opts.communityMember = true;
    // If you wish to replace the default challenge plugin, you may do so here
    opts.challenges = {
        'http-01': http01
    };
    // The domains being approved for the first time are listed in opts.domains
    // Certs being renewed are listed in certs.altnames
    if (certs) {
        opts.domains = certs.altnames;
    } else {
        opts.email = 'john.doe@example.com';
        opts.agreeTos = true;
    }
    // NOTE: you can also change other options such as `challengeType` and `challenge`
    // opts.challengeType = 'http-01';
    // opts.challenge = require('le-challenge-fs').create({});
    cb(null, {
        options: opts,
        certs: certs
    });
}
// handles acme-challenge and redirects to https
require('http').createServer(glx.middleware(require('redirect-https')())).listen(80, function () {
    console.log("Listening for ACME http-01 challenges on", this.address());
});
var app = require('express')();
app.use('/', function (req, res) {
    res.end('Hello, World!');
});
// handles your app
require('https').createServer(glx.httpsOptions, app).listen(443, function () {
    console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});
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
    res.render('err')
    console.log(err)
})
module.exports = app
