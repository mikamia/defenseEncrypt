'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');
// var crypto = require('crypto');
// var iterations = 1;
// var bytes = 64;

router.post('/login', function (req, res, next) {
  User.findOne({
    where: req.body
  })
  .then(function (user) {
    if (!user) throw HttpError(401);
    req.login(user, function (err) {
      if (err) next(err);
      else res.json(user);
    });
  })
  .catch(next);
});

router.post('/signup', function (req, res, next) {
  // var salt = crypto.randomBytes(16).toString('base64');
  // var buffer = crypto.pbkdf2Sync(req.body.password, salt, iterations, bytes);
  // var hash = buffer.toString('base64');
  // console.log("HASH",hash);
  // console.log("REQBODY", req.body);
  // req.body.password = hash;
  User.create(req.body)
  .then(function (user) {
    req.login(user, function (err) {
      if (err) next(err);
      else res.status(201).json(user);
    });
  })
  .catch(next);
});

router.get('/me', function (req, res, next) {
  res.json(req.user);
});

router.delete('/me', function (req, res, next) {
  req.logout();
  res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;
