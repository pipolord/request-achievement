var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended : false});

/*module.export = function(app){*/
	var groupSchema = {
		date : String, 
		recompense: String
	};
	var group = mongoose.model("groups", groupSchema, "groups");
	console.log("chat");
	group.create({date:"prout"}, function (err, result) { 
		console.log("chat");
		if (err) {
			return next(err);
		}
		res.json(result); 
		console.log("bite");
	});


/*}*/
