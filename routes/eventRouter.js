var express = require('express'),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    router = express.Router();
var csrf = require('csurf'),
    csrfProtection = csrf();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(csrfProtection);
var User = require('../models/user');

//GET:
router.get('/', (req, res) => {
    ejs.renderFile('./views/home.ejs', { csrfToken: req.csrfToken() }, (err, html) => {
        res.send(html);
    })
});
router.get('/listEvent', (req, res) => {
    res.render('listEvent.ejs', {messages: ''});
});

//POST:
router.post('/', (req, res) => {
    //var user = new User();
    var uid = req.session.id;
    let name = req.body.name;
    let description = req.body.description;
    let date = req.body.date;
    let location = req.body.location;
    let priority = req.body.priority;
    User.findById({uid}, (err, user) => {
        if(err){
            res.end(err)
        }
        else {
            user.event.push({id: new ObjectId(), name: name, description:description, date:date, location:location, priority:priority});
            res.end(user);
        }
        
    })
    
});
//PUT:
router.put('/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);
    mongoose.connect(configDB.url, function() {
        db.collection("users").findAndModify({
            query: {_id: mongojs.ObjectId(id)},
            update: 
                {$set: 
                    {
                        name: req.body.name, 
                        description: req.body.description, 
                        date: req.body.date, 
                        location: req.body.location, 
                        priority: req.body.priority
                    }
                },
            new: true}, function (err, doc) {
                  res.json(doc);
        });
    });
});

//DELETE:
router.delete('/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);
    mongoose.connect(configDB.url, function() {
        db.collection("users").remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
            res.json(doc);
            //res.redirect("");
        });
    });
});

module.exports = router;