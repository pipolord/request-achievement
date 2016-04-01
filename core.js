var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramÃƒÂ¨tres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//mongoose.connect('mongodb://localhost/blog');

var app = express();
app.use(bodyParser.json());

require('./routes/groupAchievementRoutes')(app);


app.listen(8080);
