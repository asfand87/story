const User = require("../models/user");


module.exports.renderRegister = (req, res, next) => {
    res.render("users/register");
};


module.exports.register = async (req, res, next) => {
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

};

module.exports.renderLogin = async (req, res, next) => {
    res.render("users/login");
}

module.exports.login = (req, res) => {
    req.flash("success", `Welcome Back ${req.user.username} `);
    // console.log(req.session);
    const redirectUrl = req.session.returnTo || "/story";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = async (req, res, next) => {
    req.logout();
    req.flash("success", "Successfully loged you out!");
    res.redirect("/story");
};