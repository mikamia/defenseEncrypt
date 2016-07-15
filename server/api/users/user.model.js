'use strict';

var Sequelize = require('sequelize');


var db = require('../../_db');
var crypto = require('crypto');
var iterations = 1;
var bytes = 64;

var User = db.define('user', {
  name: Sequelize.STRING,
  photo: {
    type: Sequelize.STRING,
    defaultValue: '/images/default-photo.jpg'
  },
  phone: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type:Sequelize.STRING,
    set: function(val){
      var salt = crypto.randomBytes(16).toString('base64');
      var buffer = crypto.pbkdf2Sync(val, salt, iterations, bytes);
      var hash = buffer.toString('base64');
      this.setDataValue('password', hash);
      this.setDataValue('salt', salt);
    },
    get: function(){
      return this.getDataValue('password');
    }
  },
  salt: {
    type: Sequelize.STRING,
    get: function(){
      return this.getDataValue('salt');
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  googleId: Sequelize.STRING,
  twitterId: Sequelize.STRING,
  githubId: Sequelize.STRING
});

module.exports = User;
