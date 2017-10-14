var express = require('express'),
    ejs = require('ejs'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    router = express.Router();
var csrf = require('csurf'),
    csrfProtection = csrf();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(csrfProtection);

//GET:
router.get('/', (req, res) => {
    ejs.renderFile('./views/home.ejs', { csrfToken: req.csrfToken() }, (err, html) => {
        res.send(html);
    })
});
//POST:

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

module.exports = router;