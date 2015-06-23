/**
 * Module dependencies.
 */
var qs = require('querystring');

var express = require('express'),
  session = require('express-session'),
  port = process.env.PORT || 3001,
  request = require('request'),
  cookieParser = require('cookie-parser'),
  passport = require("passport"),
  OAuth2Strategy = require("passport-oauth2");

var fleetlog = require('../../lib/fleetlog');

/*
 Example of the authorization code grant type

 The authorization code flow is a "three-legged OAuth" configuration.
 In this configuration, the user authenticates himself with the resource server
 and gives the app consent to access his protected resources without divulging username/passwords to the client app.
 */

var fleetlogRoutes = {
  apiBaseURL: 'https://api.fleetlog.com.au',
  authorizationURL: 'https://dev.fleetlog.com.au/connect'
};

if (process.env.NODE_ENV == 'dev') {
  fleetlogRoutes.apiBaseURL = 'http://localhost:3000';
  fleetlogRoutes.authorizationURL ='http://localhost/fleetlog/www/connect';
}

var app =  module.exports =express();

var API_BASE_URL = fleetlogRoutes.apiBaseURL;
var CLIENT_ID = process.env.FLEETLOG_CLIENT_ID || 'test';
var CLIENT_SECRET = process.env.FLEETLOG_CLIENT_SECRET || 'testsecret';


passport.use(new OAuth2Strategy({
    authorizationURL: fleetlogRoutes.authorizationURL,
    tokenURL: API_BASE_URL+'/v2/token',
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:3001/redirect",
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, {accessToken: accessToken});
  }
));


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});

// middleware

app.use(cookieParser());
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat'
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


// Initial page redirecting to Fleetlog's oAuth page
app.get('/auth', passport.authenticate('oauth2'));

app.get('/redirect', passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/welcome');
  });


app.get('/welcome', function (req, res) {
  var user = req.session.passport.user || {};
  var token = process.env.TOKEN || user.accessToken; // DEV

  if(token) {
    // Get Identity
    fleetlog.identity(token, function (err, userObject){
      if (err) {return res.send("ERROR")}
      console.log(userObject)

      res.send('You are logged in.<br>User: '+userObject.email );
    });
    fleetlog.getVehicles(token, null, function (err, vehicles){
      //if (err) {return res.send("ERROR")}
      console.log(err, vehicles)
    });
  } else {
    res.redirect('/');
  }
});


app.get('/', function (req, res) {
  res.send('<a href="/auth">Log in with Fleetlog</a>');
});


// Start server
app.listen(port);
console.log('Express server started on port ' + port);
