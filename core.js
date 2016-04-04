var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramÃƒÂ¨tres
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport	= require('passport');
var util = require('util');
var https = require('https');

mongoose.connect('mongodb://192.168.1.13/requestAchievement');

var app = express();

var cors = require('cors');
app.use(cors());
app.use(cors({ origin: 'null', credentials: true }));
app.use(passport.initialize());

require('./routes/groupAchievementRoutes')(app);
require('./routes/oauthBnetRoutes')(passport, app);

var fs = require('fs');
var options = {
    key: fs.readFileSync('/etc/apache2/ssl/apache.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/apache.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

var server = https.createServer(options, app).listen(8080, function(){
      console.log("server started at port 8080");
});
