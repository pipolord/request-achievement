var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app, Users){
	app.use(bodyParser.json());

	app.post('/userdefaultcharacter/:id', function (req, res, next) {
    Users.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
	});

}
