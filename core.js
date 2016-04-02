var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramÃƒÂ¨tres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

mongoose.connect('mongodb://192.168.1.13/requestAchievement');

var app = express();

var cors = require('cors');
app.use(cors());
app.use(cors({ origin: 'null', credentials: true }));

require('./routes/groupAchievementRoutes')(app);


app.listen(8080);
