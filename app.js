var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var cons = require('consolidate')
var index = require('./routes/index')
const version = require('./package.json').version
var app = express()

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
    console.log(account);
    console.log(password);
    console.log(phoneNumber);
} catch (e) {
    console.log('Error:', e.stack);
}
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