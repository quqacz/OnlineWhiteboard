const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: { type: String, reqired: true},
    lastName: { type: String, reqired: true},
    username: { type: String, reqired: true},
    imageUrl: {type: String},
    imageFileName: {type: String},
    password: {type: String},
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group'}],
    lightTheme: {type: Boolean, default: true}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);