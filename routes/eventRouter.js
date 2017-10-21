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
router.get('/list',loggedIn, (req, res) => {
    var uid = req.session.uid;
    User.find({_id:uid}, (err,data) =>{
        if(err){
            handleError(res, err.message, "Failed to find event");
        }
        else {
            
            res.render('listEvent.ejs', {csrfToken: req.csrfToken(),messages: '', data:data});
        }
    });
    
});
//GET add event page:
router.get('/',loggedIn, (req, res) => {
    res.render('addEvent.ejs', {csrfToken: req.csrfToken(),messages: ' '});
});

//POST an event:

router.post('/',loggedIn, (req, res) => {
    //var user = new User();
    var uid = req.session.uid;
    console.log(uid);
    let name = req.body.name;
    let description = req.body.description;
    let date = req.body.date;
    let location = req.body.location;
    let priority = req.body.priority;
    // req.checkBody('name', 'Name: only accept letter and number(A-Z, 0-9), length 5-20').isLength({min: 5, max: 20}).matches(/[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ0-9]/);
    // req.checkBody('description', 'Description: only accept length 5-30').isLength({min: 5, max: 30});
    // req.checkBody('location', 'Location: only accept length 2-20').isLength({min: 2, max: 20});
    // var messages = [];
    // var errValidate = req.validationErrors();
     var updateDoc = {name: name, description: description, date: date, location: location, priority: "Important" };
    // if(errValidate) {                
    //     errValidate.forEach(function(error) {
    //         messages.push(error.msg);
    //     });
    //     res.render('addEvent.ejs', {csrfToken: req.csrfToken(), messages: messages});
    // } else {
    //     User.update({ _id: new ObjectID(uid) }, { '$push': { 'events': updateDoc } }, function (err, doc) { 
    //         if (err) {
    
    //             User.update({ _id: new ObjectID(uid) }, { '$set': { 'events': [updateDoc] } }, function (err, doc) {
    //                 if (err) {
    //                     handleError(res, err.message, "Failed to update student");
    //                 } else {
    //                     res.status(200).json(doc);
    //                 }
    //             });
    //         } else {
    //             res.redirect('/event');
                
    //         }
    //     });
    // }
    User.findOne({ _id: new ObjectID(uid) }).exec((err,user) => {
        var newEvent = new Event(updateDoc);
        user.events.push(newEvent);
        user.save();
    })
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
    User.findOne({id: mongoose.Types.ObjectId(id)}, function(err, doc) {
        if(err) {
            handleError(res, err.message, "Failed to delete event.");
        } 
        if(doc) {
            doc.remove(function (err) {
                if(err) {
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