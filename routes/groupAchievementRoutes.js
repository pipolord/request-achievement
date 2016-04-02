var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){
	app.use(bodyParser.json());

	var groupSchema = {
	    idAchievement:String,
	    idAuthor:String,
	    dateBegin : Date,
	    dateEnd : Date,
	    reward : String,
	    comments : String,
			vocal : Boolean,
	};

	var Group = mongoose.model('groups', groupSchema);

	//LISTE DES GROUPES
	app.get('/groups', function (req, res) {
	    Group.find(function (err, doc) {
	        res.json(doc);
	    })
	});

	//ENREGISTREMENT DUN GROUPE
	app.post('/groups', function (req, res, next) {
	    Group.create(req.body, function (err, result) {
	        if (err) return next(err);
	        res.json(result);
		  })
	});

	//LISTE DES GROUPES POUR UN HF
	app.get('/groupsachievement/:id', function (req, res, next) {
		Group.find({idAchievement : req.params.id}, function (err, post) {
	    if (err) return next(err);
	    res.json(post);
	  });
	});
}
