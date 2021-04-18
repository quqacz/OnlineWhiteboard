const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: String,
    lastName: String,
    username: String,
    password: String,
    groups: [{ type: Schema.Types.ObjectId, ref: 'User'}]

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);