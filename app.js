/*=====================Initialisation=====================*/
const express = require("express");
require('dotenv').config();
const app  = express();
const http = require('http').Server(app);
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser')
const url = 'mongodb://'+ process.env.DB_HOST +':'+ process.env.DB_PORT +'/' + process.env.DB_NAME;
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
/*======================================================*/

mongoose.connect(url, { useNewUrlParser: true });

let db = mongoose.connection;
db.on('error', function(err){
	console.log('Fail to connect')
	process.exit(1)
});
db.once('open', function() {
	console.log('Connected')
});

// Middleware session
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use(minify({cache: __dirname + '/cache'}));

// session in ram or redis
if (!process.env.DEV) {
	app.use(session({
		resave: false, 
		saveUninitialized: false,
		secret: process.env.COOKIE,
		store: new RedisStore
	}));
} else {
	app.use(session(
	{
		secret: process.env.COOKIE,
		saveUninitialized: false,
		resave: false
	}
	));
}

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 

app.enable('trust proxy');

/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));

/*==================start serv==================*/
http.listen(process.env.PORT, function(){
	console.log('listening on *:' + process.env.PORT);
});