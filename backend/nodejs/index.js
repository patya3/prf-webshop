const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;
const dbURL = '<mongodbURl>';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('succesfull db connect');
});

mongoose.connection.on('error', (error) => {
  console.log('error', error);
});

require('./models/user.model');
require('./models/product.model');

const userModel = mongoose.model('user');

app.use(cookieParser('<hash>'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));

const whitelist = [
  'https://prf-webshop-3a0d8.web.app',
  'https://prf-webshop-3a0d8.firebaseapp.com',
  'http://localhost:4200',
  'http://localhost:3000',
  'https://pure-tundra-47206.herokuapp.com',
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Origin',
    'Origin',
    'Accept',
  ],
};

app.use(cors(corsOptions));

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    function (email, password, done) {
      userModel.findOne({ email: email }, function (err, user) {
        if (err) return done('Error during request.', null);
        if (!user) return done(null, false);
        user.comparePasswords(password, function (error, isMatch) {
          if (error) return done(error, false);
          if (!isMatch) return done(null, false);
          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  if (!user) return done('No user provided', null);
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  if (!user) return done('No user provided', null);
  return done(null, user);
});

app.use(
  expressSession({
    secret: '<hash>',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth.routes'));
app.use('/shop', require('./routes/shop.routes'));

// let angular handle all other routes
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server started on port`);
});
