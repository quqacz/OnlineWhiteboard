const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    topic: {type: String, required: true},
    canvasContent: {type: String, default: ''},
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model('Lesson', LessonSchema);