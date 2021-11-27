const passport = require('passport');
require('../utils/passport')(passport);
const User = require("../models/user");
const jwt = require('jsonwebtoken');

function getToken (headers) {
    if (headers && headers.authorization) {

      const parted = headers.authorization.split(' ');

      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
}

module.exports = {
    async signUp (req, res) {
        if (!req.body.username || !req.body.password) {
          res.json({success: false, msg: 'Please pass username and password.'});
        } else {
          const newUser = new User(req.body);

          newUser.save(function(err) {
            if (err) {
              return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
          });
        }
    },
    async signIn (req, res) {
        User.findOne({ username: req.body.username }, function(err, user) {

          if (err) throw err;
      
          if (!user) {
            res.status(401).json({success: false, msg: 'Authentication failed. User not found.'});
          } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                // if user is found and password is right create a token
                const token = jwt.sign(user.toJSON(), 'config.secret');
                // return the information including token as JSON
                res.json(token);
              } else {
                res.status(401).json({success: false, msg: 'Authentication failed. Wrong password.'});
              }
            });
          }
        });
    },

    checkToken(req, res, next) {
        const token = getToken(req.headers);

        if (token) {
            next();
        } else {
            return res.status(403).send({success: false, msg: 'Unauthorized.'});
        }
    }
}