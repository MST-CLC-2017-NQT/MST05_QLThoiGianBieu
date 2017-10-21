var mongoose = require('mongoose');
var Event = require('../models/event');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;

var userSchema = new Schema({
    name: { type: String, required: true, maxlength: [30, 'Only be maximum 30 characters'], match: [/^([^-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]{1,})$/, 'Only letter or number are allowed'] },
    email: { type: String, required: true, match: [/.+\@.+\..+/, 'Only email are allowed'] },
    password: { type: String, required: true },
    events: []
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);