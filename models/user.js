const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: { type: String, reqired: true},
    lastName: { type: String, reqired: true},
    username: { type: String, reqired: true},
    imageUrl: {type: String, default: 'https://wiki.dave.eu/images/4/47/Placeholder.png'},
    imageFileName: {String, default: ''},
    password: String,
    groups: [{ type: Schema.Types.ObjectId, ref: 'Group'}]

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);