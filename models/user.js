const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

// pluging passport local mongoose in our user model.
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);