const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");


router.get("/register", (req, res) => {
    res.render("users/register");
})

router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // once the user is registered log them in
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Story");
            res.redirect("/story");
        });
        // console.log(registeredUser);

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }

}))

// login 

router.get("/login", catchAsync(async (req, res) => {
    res.render("users/login");
}));

const option = { failureFlash: true, failureRedirect: "/login" };

// if the user is authenticated then we know person is loged in
router.post("/login", passport.authenticate('local', option), (req, res) => {
    req.flash("success", "Welcome Back!");
    // console.log(req.session);
    const redirectUrl = req.session.returnTo || "/story";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get("/logout", catchAsync(async (req, res) => {
    req.logout();
    req.flash("success", "Successfully loged you out!");
    res.redirect("/story");

}))




module.exports = router;