var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    passport = require('passport');

var csrf = require('csurf'),
    csrfProtection = csrf();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(csrfProtection);

// Login
router.post('/login', passport.authenticate('local.signin', {
    successRedirect: '/event/list',
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
        res.redirect('/event/list');
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