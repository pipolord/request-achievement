var cookieParser = require('cookie-parser');
var session = require('express-session');
var BnetStrategy = require('passport-bnet').Strategy;
var mongoose = require("mongoose");
var https = require("https");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(passport, app, Users){
  	app.use(bodyParser.json());
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
        callbackURL: "https://localhost:8081/auth/bnet/callbacknet/callback" },
      function(accessToken, refreshToken, profile, done) {
        Users.findOne({idBnet : profile.id}, function(err, oldUser){
            if(oldUser){
              console.log("here");
              Users.findByIdAndUpdate(oldUser.id, profile.token, function (err, post) {
                  if (err) return next(err);
                  done(null,oldUser);
              });
            }
            else {
              console.log(profile);
              var options = {
                host: 'eu.api.battle.net',
                path: '/wow/user/characters?access_token='+profile.token
              };


              https.get(options, function (response) {
                response.setEncoding('utf8')
                response.on('data', function(data){
                  data = JSON.parse(data);
                  var newUser = new Users({
                      idBnet      : profile.id ,
                      provider    : profile.provider,
                      battletag   : profile.battletag,
                      token       : profile.token,
                      characters  : data.characters
                  }).save(function(err,newUser){
                      if(err) throw err;
                      done(null, newUser);
                  });
                });
                response.on('error', console.error)
              })
            }
        });
      })
  );


  // configure Express
  app.use(cookieParser());
  app.use(session({ secret: 'blizzard',
                    saveUninitialized: true,
                    resave: true }));

app.use(function(req, res, next) {
                      res.header('Access-Control-Allow-Credentials', true);
                      res.header('Access-Control-Allow-Origin', req.headers.origin);
                      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                      res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
                      if ('OPTIONS' == req.method) {
                          res.send(200);
                      } else {
                          next();
                      }
});


  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/auth/github', passport.authenticate('github'));

  app.get('/auth/github/callback',
          passport.authenticate('github', { failureRedirect: '/' }),
          function(req, res){
          });

  app.get('/auth/bnet',
          passport.authenticate('bnet'), function(req, res) {
          });

  app.get('/auth/bnet/callbacknet/callback',
          passport.authenticate('bnet', { failureRedirect: '/' }),
          function(req, res){
            //Aremplacer + tard
            res.redirect('http://localhost/request-achievement/');
          });

  app.get('/', function(req, res) {
    if(req.isAuthenticated()) {
      console.log("HERE");
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

  app.get('/user/', function(req, res) {
    if(req.isAuthenticated()) {
      res.send(req.user);
    }
  });

  app.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function (err) {
      //Aremplacer + tard
      res.redirect('http://localhost/request-achievement/');
    });
  });


}
