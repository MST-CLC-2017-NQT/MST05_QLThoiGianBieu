var express = require('express'),
    ejs = require('ejs'),
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

//DELETE:

module.exports = router;