const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cons = require('consolidate')
const index = require('./routes/index')
const user = require('./routes/users')

var serverConfig = require('./config.js').serverConfig
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect(serverConfig.dbAddress,{ useNewUrlParser: true })
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err))

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
app.use('/user', user)


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


app.listen('3001', function () {
    console.log('App listening on port ' + 3001 + '!')
})

http.createServer(function (req, res) {
    res.writeHead(301, {
        "Location": "https://" + req.headers['host'] + req.url
    });
    res.end();
}).listen(80);

module.exports = app
