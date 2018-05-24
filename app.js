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

app.use(function (request, response, next) {
  if (request.session.user) {
    next();
  } else if (request.path == '/login') {
    next();
  } else {
    response.redirect('/login');
  }
});

app.get('/', function (request, response) {
  console.log(request.session);
  
  response.send('narf');
});

app.get('/login', function (request, response) {
  request.session.user = 'paul';
  request.session.food = {};
  
  response.send('login');
});

app.listen(8080, function () {
  console.log('Listening on port 8080');
});
