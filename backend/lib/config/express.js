import models from '../app/models';

var express = require('express')
var glob = require('glob')

// var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var compress = require('compression')
var methodOverride = require('method-override')

var cors = require('cors')

module.exports = function (app, config) {
  var env = process.env.NODE_ENV || 'development'
  app.locals.ENV = env
  app.locals.ENV_DEVELOPMENT = env === 'development'

  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(async (req, res, next) => {
    req.context = {
      models,
    };
    next();
  });
  app.use(cookieParser())
  app.use(compress())
  app.use(express.static(config.root + '/../public'))
  app.use(methodOverride())
  // CORS
  app.use(cors())

  var controllers = glob.sync(config.root + '/app/controllers/*.js')
  controllers.forEach(function (controller) {
    require(controller)(app)
  })

  app.use(function (req, res, next) {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500)
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      })
    })
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    })
  })

  return app
}
