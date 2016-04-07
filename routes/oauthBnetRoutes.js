var cookieParser = require('cookie-parser');
var session = require('express-session');
var BnetStrategy = require('passport-bnet').Strategy;

module.exports = function(passport, app){

  var BNET_ID ="xyzcvd8sfjx5sketq27e8ttsvdbnttgm";
  var BNET_SECRET ="J87hBCwy6TuW4tj4JsNJYRJJSc8W4pZD";

  passport.serializeUser(function(user, done) {
      done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
      done(null, obj);
  });

  // Use the BnetStrategy within Passport.
  passport.use(
    new BnetStrategy(
      { clientID: BNET_ID,
        clientSecret: BNET_SECRET,
        scope: "wow.profile sc2.profile",
        callbackURL: "https://91.121.168.68:3001/auth/bnet/callbacknet/callback" },
      function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          return done(null, profile);
        });
      })
  );


  // configure Express
  app.use(cookieParser());
  app.use(session({ secret: 'blizzard',
                    saveUninitialized: true,
                    resave: true }));

  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
          passport.authenticate('github', { failureRedirect: '/' }),
          function(req, res){
            res.redirect('/');
          });

  app.get('/auth/bnet',
          passport.authenticate('bnet'), function(req, res) {

          });

  app.get('/auth/bnet/callbacknet/callback',
          passport.authenticate('bnet', { failureRedirect: '/' }),
          function(req, res){
            res.redirect('/');
          });

  app.get('/', function(req, res) {
    if(req.isAuthenticated()) {
      var output = '<h1>Express OAuth Test</h1>' + req.user.id + '<br>';
      if(req.user.battletag) {
        output += req.user.battletag + '<br>';
      }
      output += '<a href="/logout">Logout</a>';
      res.send(output);
    } else {
      res.send('<h1>Express OAuth Test</h1>' +
               '<a href="/auth/github">Login with Github</a><br>' +
               '<a href="/auth/bnet">Login with Bnet</a>');
    }
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


}
