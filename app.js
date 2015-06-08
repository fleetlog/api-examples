var express = require('express'),
  session = require('express-session'),
  port = process.env.PORT || 3001,
  app = express(),
  request = require('request'),
  cookieParser = require('cookie-parser'),
  passport = require("passport"),
  OAuth2Strategy = require("passport-oauth2");

var API_BASE_URL = 'https://api.fleetlog.com.au';
var CLIENT_ID = process.env.FLEETLOG_CLIENT_ID || 'test';
var CLIENT_SECRET = process.env.FLEETLOG_CLIENT_SECRET || 'testsecret';


passport.use(new OAuth2Strategy({
    authorizationURL: 'https://fleetlog.com.au/connect',
    tokenURL: API_BASE_URL+'/v2/token',
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: "http://localhost:3001/redirect",
    state: 'ah01'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, {accessToken: accessToken});
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});


app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


// Initial page redirecting to Fleetlog's oAuth page
app.get('/auth', passport.authenticate('oauth2'));


app.get('/redirect',  passport.authenticate('oauth2', { successRedirect: '/welcome', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/welcome');
  });


app.get('/welcome', function (req, res) {
  if(req.session.passport.user) {
    request.get({ url: API_BASE_URL+'/v2/me', headers: {Authorization: "Bearer "+req.session.passport.user.accessToken}}, function(err, result, body) {
      console.log(body)
      res.send('You are logged in.<br>User: ' +  JSON.stringify(body));
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
