var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebaseAdmin = require('firebase-admin');
var AWS = require('aws-sdk');

var fs = require('fs');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert("C:/IPN/Secrets/TopicosDeControl/ProjectManagement/projectmanagement-52985-firebase-adminsdk-96p9x-dfb49fdb93.json"),
  databaseURL: "https://projectmanagement-52985.firebaseio.com"
});

AWS.config.loadFromPath('./aws.config.json');

var auth = require('./models/auth.js');
var projects = require('./routes/projects.js');

auth.setFirebaseAuth(firebaseAdmin.auth());

var app = express();

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth.authN);
app.set('etag', false);

app.use('/projects', projects);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
      .json({
        message: err.message,
        error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
