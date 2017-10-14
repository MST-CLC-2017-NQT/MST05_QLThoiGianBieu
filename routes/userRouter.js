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

// Login
router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/event',
    failureRedirect: './login',
    failureFlash: true
}));

router.get('/login', (req, res) => {
    var messages = req.flash('error');
    res.render('login.ejs', { csrfToken: req.csrfToken(), messages: messages });
});


// Logout
router.post('/logout', function (req, res) {
    req.logout();
    res.redirect('./login');
})


// Login check
router.get('/loggedin', function(req, res, next) {
    if (req.isAuthenticated()){
        res.redirect('/event');
        return next();
    }
    res.redirect('./login');
});


// Register
router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: './login',
    failureRedirect: './signup',
    failureFlash: true
}));
router.get('/signup', function(req, res, next) {
    var messages = req.flash('error');
    res.render('register.ejs', { csrfToken: req.csrfToken(), messages: messages });
});


module.exports = router;