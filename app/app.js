var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const winston = require('winston');
const Elasticsearch = require('winston-elasticsearch');

const esTransportOpts = {
  level: 'info',
  clientOpts: {
    node: "http://localhost:9200",

  }
};

const loggerElastic = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logfile.log", level: 'error' }), //save errors on file
    new Elasticsearch(esTransportOpts) //everything info and above goes to elastic
  ]
});

loggerElastic.info("prueba");

for(i=0; i<10000;i++){
  console.log({"nombre":"es una prueba"})
}

if (process.env.NODE_ENV !== 'production') {
  loggerElastic.add(new winston.transports.Console({ //we also log to console if we're not in production
    format: winston.format.simple()
  }));
}
// try {
//   throw new Error('An error has occurred.');
// } catch (e) {
//   loggerelastic
//     .error(e)
//     .then(() => console.error(e)); // eslint-disable-line no-console
// }



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
