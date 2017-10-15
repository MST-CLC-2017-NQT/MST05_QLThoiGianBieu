var express = require('express'),
    morgan = require('morgan'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    flash = require('connect-flash'),
    passport = require('passport'),
    expressHbs = require ('express-handlebars'),
    validator = require('express-validator'),
    MongoStore = require('connect-mongo')(session),
    configDB = require('./config/database.js');
var port = 8080;
var app = express();

// setup 




var router = express.Router();

require('./config/passport');

//database config:
mongoose.connect(configDB.url);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    secret: 'anystringtotext',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(function(req, res, next) {
    res.session = req.session;
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(validator());
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// CSS
app.use(express.static('stylesheets'));
// Routes
app.use('/user', require('./routes/userRouter'));
app.use('/event', require('./routes/eventRouter'));
// listen port 8080
app.listen(port, () => {
    console.log("Listening on port: " + port);
});

//get home page
app.get('/', (req, res) => {
    res.redirect('/user/loggedin');
})