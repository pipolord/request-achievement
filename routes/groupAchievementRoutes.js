var mongoose = require("mongoose");
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramÃƒÂ¨tres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){


//LISTE DES GROUPES
	app.get('/groups', function (req, res) {
	        res.json([{id: "555", title : "Goulet de chanteguerre", date : "15/05/2016", recompense: "10po"},
										{id: "575", title : "S'enforcer une banane dans le cul", date : "01/04/2016", recompense: "Moustafa"}]);
	});
}
