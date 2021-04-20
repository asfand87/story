const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { renderRegister, register, renderLogin, login, logout, renderForgot, forgot } = require("../controllers/userController");
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
    .post(catchAsync(forgot));


module.exports = router;