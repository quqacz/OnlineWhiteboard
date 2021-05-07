const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    groupName: { type: String, required: true},
    entryCode: { type: String, require: true},
    description: String,
    imageUrl: {type: String, default: 'https://wiki.dave.eu/images/4/47/Placeholder.png'},
    imageFileName: {String, default: ''},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    lessons:[{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    students: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Group', GroupSchema);