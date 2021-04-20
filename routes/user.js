const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { renderRegister, register, renderLogin, login, logout, renderForgot, forgot, passwordReset, postPassword } = require("../controllers/userController");
const { validateUser } = require("../middleware")


router.route("/register")
    .get(renderRegister)
    .post(validateUser, catchAsync(register))

// login form 
router.route("/login")
    .get(catchAsync(renderLogin))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), login);

// logout route.
router.get("/logout", catchAsync(logout));

// forgot password routes. 

router.route('/forgot')
    .get(renderForgot)
    // sending link to the user in this route.
    .post(catchAsync(forgot));



// this route is to show new password route.
router.route('/reset/:token').get(catchAsync(passwordReset));
// this route is for posting new user password to user model.
post(catchAsync(postPassword));
module.exports = router;