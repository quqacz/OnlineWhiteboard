const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    groupName: { type: String, required: true},
    entryCode: String,
    description: String,
    ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
    lessons:[{ type: Schema.Types.ObjectId, ref: 'Lesson' }]
});

module.exports = mongoose.model('Group', GroupSchema);