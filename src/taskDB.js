module.exports = {
	getUsersExceptU: (id, callback) => {
		MODELS.User.find({ _id: {$ne: id}}).exec((err,data) => {
			callback(err, data);
		})
	},
	add: (task, callback) => {
		new MODELS.Task(task).save((err, data) => {
			if (err) return callback(err, null)
				return callback(null, data)
		})
	},
	getall: (id, callback) => {
		MODELS.Task.find({ users: id}).populate('users', ['name', '_id']).exec((err,data) => {
			callback(err, data);
		})
	},
	delete: (_id, userId, callback) => {
		MODELS.Task.deleteOne({ _id: _id, users: userId }, function (err) {
			if (err) return callback(err, null)
			return callback(err, null)
		});
	}
}