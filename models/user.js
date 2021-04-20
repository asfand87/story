const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,


});

// pluging passport local mongoose in our user model.
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);