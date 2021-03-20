/* jshint esversion:6 */

const mongoose = require('mongoose');
// Mongoose configuration
mongoose.connect("mongodb://localhost/basic-authoriza",{
  useUnifiedTopology: true,
  useNewUrlParser: true
});
//BBDD name changed
const session     = require("express-session");
const createMongoStorage = require("connect-mongo");
const MongoStore = createMongoStorage(session);
//const MongoStore  = require("connect-mongo")(session);

const express     = require('express');
const path        = require('path');
const logger      = require('morgan');
const favicon     = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser  = require('body-parser');

const app         = express();


const authController = require('./routes/authController');
const siteController = require('./routes/siteController');


mongoose.Promise = global.Promise; //esto lo mismo no viene aqui
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(__dirname + '/node_modules/bootstrap/dist')); //nuevo por bootstrap

app.use(session({
    secret: "basic-auth-secret",
    saveUninitialized: true, //Added
    resave: true, //added
    cookie: { maxAge: 60000 },
    store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));


//app.use('/', index);
//app.use('/users', users);
app.use('/', authController);
app.use('/', siteController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
