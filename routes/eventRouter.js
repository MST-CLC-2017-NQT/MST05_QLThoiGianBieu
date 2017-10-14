var express = require('express'),
    ejs = require('ejs'),
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

//DELETE:

module.exports = router;