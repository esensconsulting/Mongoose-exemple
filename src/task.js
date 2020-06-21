const db = require("./taskDB.js");
module.exports = function(app, path, ejs, fs) {

	app.get('/task', function(req, res) {
		db.getUsersExceptU(req.session.userinfo._id, (err, data) => {
			db.getall(req.session.userinfo._id, (err, task) => {
				res.render('task', {name: req.session.userinfo.name, users: data, task: task});
			})
		})
		
	})

	app.post('/task/add', function(req, res) {
		if (!req.body.users) req.body.users = [];
		req.body.users.push(req.session.userinfo._id);
		db.add(req.body, (err, data) => {
			
			res.redirect("/task");
		})
	})
}