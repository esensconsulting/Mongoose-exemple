const db = require("./usersDB.js");
module.exports = function(app, path, ejs, fs) {

	app.get('/', function(req, res) {
		res.render('index');
	})

	app.get('/register', function(req, res){
		res.render('register');
	})

	app.post('/', function(req, res){
		db.login(req.body, (err, data) => {
			if (err) return res.send(err);
			req.session.userinfo = data;
			res.redirect('/task');
		})
	})

	app.get('/logout', function(req, res){
		req.session.destroy();
		res.redirect('/');
	})
	

	app.post('/register', function(req, res){
		db.register(req.body, (err, data) => {
			if (err) return res.send(err);
			req.session.userinfo = data;
			res.redirect('/task');
		})
	})
}