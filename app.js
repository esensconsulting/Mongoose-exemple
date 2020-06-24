/*=====================Initialisation=====================*/
const express = require("express");
require('dotenv').config();
const app  = express();
const http = require('http').Server(app);
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const sanitizer = require('express-auto-sanitize')
const url = 'mongodb://'+ process.env.DB_HOST +':'+ process.env.DB_PORT +'/' + process.env.DB_NAME;
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
//global var
_ = require('underscore')
MODELS = {};
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

require('./models/user.js')(mongoose);
require('./models/task.js')(mongoose);

// Middleware session
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));


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


app.use(sanitizer({query: false,body: true,cookies: false,original: false,}));

// middlewere de secu
app.use(function (req, res, next) {
	const nonSecurePaths = ['/', '/register', '/css/signin.css', '/img/favicon.ico', '/img/logo.svg'];
	if ( _.contains(nonSecurePaths, req.path) ) 
		return next();
	else if (!req.session.userinfo) {
		res.redirect('/');
	} else {
		next();
	}
});

app.enable('trust proxy');
/*======================routes==========================*/ 

/*------include fichier------*/
require('./src/users.js')(app, path, ejs, fs);
require('./src/task.js')(app, path, ejs, fs);

/*======================route fichier static (public)====================*/
app.use("/css", express.static(__dirname + '/public/css'));
app.use("/img", express.static(__dirname + '/public/img'));
app.use("/js", express.static(__dirname + '/public/js'));

/*==================start serv==================*/
http.listen(process.env.PORT, function(){
	console.log('listening on *:' + process.env.PORT);
});