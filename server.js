 var express = require('express');
var app = express();
var port = 8080;
var router = express.Router();
var morgan = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var flash = require('connect-flash');
var passport = require('passport');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var configDB = require('./config/database.js');
require('./config/passport');
//database config:
mongoose.connect(configDB.url);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'anystringtotext',
    resave: true,
    saveUninitialized: true, 
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000}          
}));
app.use(function(req, res, next) {
    res.session = req.session;
    next();   
});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(flash());
app.use(validator());
app.use(passport.initialize());
app.use(passport.session());
//
app.use(express.static('stylesheets'));
// Routes
app.use('/', require('./routes/userRouter'));
app.use('/', require('./routes/eventRouter'));

app.listen(port, () => {
    console.log("Listening on port: " + port);
});