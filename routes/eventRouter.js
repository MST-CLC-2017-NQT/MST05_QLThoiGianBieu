var express = require('express'),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    router = express.Router();
var csrf = require('csurf'),
    csrfProtection = csrf();
var ObjectID = mongoose.Types.ObjectId;
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csrfProtection);
var User = require('../models/user');

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}
//GET list event:

router.get('/list', (req, res) => {
    var uid = req.session.uid;
    User.find({_id:uid}, (err,data) =>{
        if(err){
            handleError(res, err.message, "Failed to find event");
        }
        else {
            
            res.render('listEvent.ejs', {csrfToken: req.csrfToken(),messages: '', data:data});
        }
    });
    // MongoClient.connect(url, function(err,db) {
    //     var query ={};
    //     db.collection('users').find(query).toArray(function(err, result) {
    //         db.close();
    //         res.render('listEvent.ejs',{csrfToken: req.csrfToken(),messages: '', data: result});
    //     });
    // });  
    
});

//GET add event page:
router.get('/', (req, res) => {
    res.render('addEvent.ejs', {csrfToken: req.csrfToken(),messages: ''});
});

//POST an event:
router.post('/', (req, res) => {
    //var user = new User();
    var uid = req.session.uid;
    console.log(uid);
    let name = req.body.name;
    let description = req.body.description;
    let date = req.body.date;
    let location = req.body.location;
    let priority = req.body.priority;
    var updateDoc = { id: new ObjectID(), name: name, description: description, date: date, location: location, priority: "important" };
    User.update({ _id: new ObjectID(uid) }, { '$push': { 'events': updateDoc } }, function (err, doc) {
        if (err) {
            User.update({ _id: new ObjectID(uid) }, { '$set': { 'events': [updateDoc] } }, function (err, doc) {
                if (err) {
                    handleError(res, err.message, "Failed to update student");
                } else {
                    res.status(200).json(doc);
                }
            });
        } else {
            res.redirect('/event');
            
        }
    });


});

//PUT an event:
router.put('/:id', (req, res) => {
    //var id = req.params.id;
    var id = req.session.id;
    console.log(id);
    mongoose.connect(configDB.url, function () {
        db.collection("users").findAndModify({
            query: { _id: mongojs.ObjectId(id) },
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
    var id = req.params.id;
    console.log(id);
    mongoose.connect(configDB.url, function () {
        db.collection("users").remove({ _id: mongojs.ObjectId(id) }, function (err, doc) {
            res.json(doc);
            //res.redirect("");
        });
    });
});

module.exports = router;