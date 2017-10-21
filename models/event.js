var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


var eventSchema = new Schema({
    name: {
        type: String, validate: [
            function (name) {
                return name.length >= 5 && name.length <= 30;
            },
            'Must be between 5 and 30 characters'
        ], match: [/^([^-!$%^&*()_+|~=`{}[\]:/;<>?,.@#]{1,})$/, 'Only letter or number are allowed']
    },
    description: {
        type: String, validate: [
            function (description) {
                return description.length >= 5 && description.length <= 30;
            },
            'Must be between 5 and 30 characters'
        ]
    },
    date: { type: Date},
    location: {
        type: String, validate: [
            function (location) {
                return (location.length >= 5 && location.length <= 30);
            },
            'Must be between 5 and 30 characters'
        ]
    },
    priority: {
        type: String, validate: [
            function (priority) {
                return priority === 'Important' || priority === 'Unimportant';
            },
            'Must be \'Important\' or \'Unimportant\''
        ]
    }
})

module.exports = mongoose.model('Event', eventSchema);