const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { renderRegister, register, renderLogin, login, logout } = require("../controllers/userController");


router.route("/register")
    .get(renderRegister)
    .post(catchAsync(register))

// login form 
router.route("/login")
    .get(catchAsync(renderLogin))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: "/login" }), login);

// logout route.
router.get("/logout", catchAsync(logout));




module.exports = router;