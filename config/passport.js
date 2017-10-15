var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
const { check, oneOf, validationResult } = require('express-validator/check');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('name', 'Invalid name').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 6 });
    var errors = req.validationErrors();

    if (errors) {

        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {

        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Fail to register' });
        }

        var newUser = new User();
        newUser.name = req.body.name;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 3 });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ 'email': email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user || !user.validPassword(password)) {
            return done(null, false, { message: 'Username or password are incorrect' });
        }
        console.log(user.id);
        req.session.uid = user.id;
        console.log(req.session.uid);
        return done(null, user);
    });
}));