const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

var morgan = require('morgan');
app.use(morgan('dev'));

app.use(body_parser.urlencoded({extended: false}));
app.use(express.static('public'));

var session = require('express-session');
app.use(session({
  secret: process.env.SECRET_KEY || 'dev',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,
    domain: 'dev.neutron.education',
    secure: false
  }
}));

//--- passport config ---//
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: 'fNbtvxl9nxRQCf51R0y6FAdLC',
    consumerSecret: 'a4gMx6LBnZSpgAIgjOdvGKarH6MfFbNxSh4vAyFZUyXcRtiAGF',
    callbackURL: "http://dev.neutron.education:8080/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    //console.log(profile);
    
    // save the session
    // create user profile
    done(null, profile.id);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

// app.use(function (request, response, next) {
//   if (request.session.user) {
//     next();
//   } else if (request.path == '/login') {
//     next();
//   } else {
//     response.redirect('/login');
//   }
// });

app.get('/', function (request, response) {
  console.log(request.user);
  
  response.send('narf');
});

//--- passport routes ---//
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter'), function (req, resp) {
    console.log(req.user);
    resp.redirect("/");
  });

app.listen(8080, function () {
  console.log('Listening on port 8080');
});
