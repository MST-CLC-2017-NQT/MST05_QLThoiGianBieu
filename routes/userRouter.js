var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    passport = require('passport');
    mongoose = require('mongoose');
var User = require('../models/user');
var csrf = require('csurf'),
    csrfProtection = csrf();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(csrfProtection);

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/MST05_QLThoiGianBieu";

router.route('/')
    .get((req, res) => {
        res.render('home.ejs');
    });

router.get('/register', function(req, res, next) {
    var messages = req.flash('error');
    res.render('register.ejs', { csrfToken: req.csrfToken(), messages: messages });
});

router.post('/register', passport.authenticate('local.signup', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/login', (req, res) => {
    var messages = req.flash('error');
    res.render('login.ejs', { csrfToken: req.csrfToken(), messages: messages });
});

router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/addEvent', (req, res) => {
    var messages = req.flash('error');
    res.render('addEvent.ejs', { messages: 'nqt' });
    //res.render('./ejs/addEvent.ejs', {csrfToken: req.csrfToken(), messages: messages});
});

module.exports = router;