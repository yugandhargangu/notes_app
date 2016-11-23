/**
 * @file
 * 
 * This file is application start up file. It contains all module declarations.
 */

// declare lib variables
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');

// declare routes
var index = require('./routes/index');
var notes = require('./routes/notes');

// declare models
var models = require('./models');

var app = express();

// set config
app.set('config', config);
// set models
app.set('models', models);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(cookieParser());
app.use(session({
	secret : config.http.session_token
}));
app.use(express.static(path.join(__dirname, 'public')));

// add routes
app.use('/', index);
app.use('/notes', notes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	console.error(err.message);
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
