const bcrypt = require('bcrypt');
module.exports = {
	register: (user, callback) => {
		MODELS.User.findOne({'email': user.email}).exec((err,data) => {
			if (err) return callback(err, null);
			if (data) return callback('user already exist', null);
			bcrypt.hash(user.password, 10, function(err, hash) {
				if (err) return callback(err, null);
				new MODELS.User({email: user.email, name: user.name, password: hash}).save(function(err, data){
					if (err) console.log(err)
						return callback(null, data);
				});
			})
		})
	},
	login: (user, callback) => {
		MODELS.User.findOne({'email': user.email}).exec((err,data) => {
			if(!data) return callback("Bad email", null);
			bcrypt.compare(user.password, data.password, function(err, bool) {
				if (!bool) return callback("Bad password", null);
				return callback(null, data);
			})
		})
		
	}
}