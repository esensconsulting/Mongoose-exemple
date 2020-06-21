module.exports = (mongoose) => {
	let Schema = mongoose.Schema;

	let Task = new Schema({
		name: {
			type: String,
			required: true
		},
		desc:{
			type: String,
			required: false
		},
		users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		created: { type: Date },
		updated: { type: Date },
	});

	Task.pre('save', function(next){
		now = new Date();
		this.updated = now;
		if ( !this.created ) {
			this.created = now;
		}
		next();
	});

	MODELS.Task = mongoose.model('Task', Task);
}