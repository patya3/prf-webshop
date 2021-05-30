const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();
const userModel = mongoose.model('user');

router.route('/login').post((req, res, next) => {
  if (req.body.email && req.body.password) {
    passport.authenticate('local', function (error, user) {
      if (error)
        return res
          .status(500)
          .send({ successfull: false, error: 'Internal server error.' });
      req.logIn(user, (error) => {
        if (error)
          return res.status(500).send({
            successfull: false,
            error: 'There is no user with this email or the password is wrong.',
          });
        return res.status(200).send({
          successfull: true,
          msg: 'Successfully loged in.',
          user: user,
        });
      });
    })(req, res, next);
  } else {
    return res.status(400).send({
      successfull: false,
      error: 'False request, need email and password.',
    });
  }
});

router.route('/register').post((req, res, next) => {
  if (req.body.email && req.body.password) {
    userModel.findOne({ email: req.body.email }, (error, user) => {
      if (error)
        return res
          .status(500)
          .send({ successfull: false, error: 'Internal server error.' });

      if (user)
        return res.status(400).send({
          successfull: false,
          error: 'A user with this email is already exists.',
        });
      const newUser = new userModel({
        email: req.body.email,
        password: req.body.password,
      });

      newUser.save((err) => {
        if (err)
          return res
            .status(500)
            .send({ successfull: false, error: 'Internal server error.' });

        return res
          .status(200)
          .send({ successfull: true, msg: 'Successfull registration.' });
      });
    });
  } else {
    return res
      .status(400)
      .send({ successfull: false, error: 'Email and password is needed.' });
  }
});

router.route('/logout').post((req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res
      .status(200)
      .send({ successfull: true, msg: 'Successfull logout.' });
  } else {
    return res
      .status(403)
      .send({ successfull: false, error: 'No user was logged in.' });
  }
});

router.route('/is-authenticated').get((req, res, next) => {
  return res.status(200).send(req.isAuthenticated() ? true : false);
});

module.exports = router;
