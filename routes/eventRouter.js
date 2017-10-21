var express = require('express'),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    passport = require('passport');
var csrf = require('csurf'),
    csrfProtection = csrf();
var ObjectID = mongoose.Types.ObjectId;
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csrfProtection);
var User = require('../models/user');
var Event = require('../models/event');
const { check, oneOf, validationResult } = require('express-validator/check');

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}
//GET list event:
router.get('/list', loggedIn, (req, res) => {
    var uid = req.session.uid;
    User.findOne({ _id: uid }).populate('events').exec((err, data) => {
        if (err) {
            handleError(res, err.message, "Failed to find event");
        }
        else {
            res.render('listEvent.ejs', { csrfToken: req.csrfToken(), messages: '', data: data });
        }
    })
});
//GET add event page:
router.get('/', loggedIn, (req, res) => {
    var messages = req.flash('error');
    var success = req.flash('success');
    res.render('addEvent.ejs', { csrfToken: req.csrfToken(), messages: messages, messagesSuccess: success });
});

//POST an event:

router.post('/', loggedIn, (req, res) => {
    var uid = req.session.uid;

    req.checkBody('name', 'Name: Only letter or number are allowed, length 5-30').isLength({min: 5, max: 30}).matches(/^([^-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]{1,})$/);
    req.checkBody('description', 'Description: Only accept length 5-30').isLength({min: 5, max: 30});
    req.checkBody('location', 'Location: only accept length 5-30').isLength({min: 5, max: 30});
    var messages = [];
    var errValidate = req.validationErrors();
    if(errValidate) {                
        errValidate.forEach(function(error) {
            messages.push(error.msg);
        });
        res.render('addEvent.ejs', {csrfToken: req.csrfToken(), messages: messages});
    } else {
        var newEvent = new Event(req.body);
        newEvent.save(function (err, result) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/event');
            }
            else {
                User.findByIdAndUpdate({ _id: new ObjectID(uid) }, { '$push': { 'events': result._id } }, function (err, doc) {
                    if (err) {
                        handleError(res, err.message, "Failed to update event");
                    } else {
                        req.flash('success', 'Add event successfull');
                        res.redirect('/event');
                    }
                });
            }
        });
    }
    
});

//PUT an event:
router.put('/:id', (req, res) => {
    var uid = req.session.uid;
    console.log(uid);
    mongoose.connect(configDB.url, function () {
        db.collection("users").findAndModify({
            query: { id: mongojs.ObjectId(uid) },
            update:
            {
                $set:
                {
                    name: req.body.name,
                    description: req.body.description,
                    date: req.body.date,
                    location: req.body.location,
                    priority: req.body.priority
                }
            },
            new: true
        }, function (err, doc) {
            res.json(doc);
        });
    });
});

//DELETE an event:
router.delete('/:id', (req, res) => {
    var id = req.session.id;
    console.log(id);
    User.findOne({ id: mongoose.Types.ObjectId(id) }, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to delete event.");
        }
        if (doc) {
            doc.remove(function (err) {
                if (err) {
                    handleError(res, err.message, "Failed to delete event.");
                } else {
                    res.status(200).json(id);
                }
            });
        }
    });
});
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/user/login');
    }
}
module.exports = router;