module.exports = (mongoose) => {
	let Schema = mongoose.Schema;

	let User = new Schema({
		name: {
			type: String,
			required: true
		},
		email:{
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		created: { type: Date },
		updated: { type: Date },
	});

	User.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	MODELS.User = mongoose.model('User', User);
}