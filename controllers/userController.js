// https://www.npmjs.com/package/locus
const User = require("../models/user");
const nodemailer = require("nodemailer");

<<<<<<< HEAD
const crypto = require("crypto");
const { waterfall } = require("async");

=======
// form rendering function for registeration.
>>>>>>> master
module.exports.renderRegister = (req, res, next) => {
    res.render("users/register");
};

// register function.
module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        // console.log(user);
        // eval(require("locus"))
        // if (req.body.adminCode === "secretcode123") {
        //     user.isAdmin = true;
        // }
        // to make admin i m going to my mongodb database and making user.isAdmin true to make any user admin.
        const registeredUser = await User.register(user, password);
        // once the user is registered log them in
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Story");
            res.redirect("/story");
        });



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

module.exports.renderForgot = async (req, res) => {
    res.render('users/forgot');
}

module.exports.forgot = async (req, res) => {
    waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            })
        },
        (token, done) => {
            User.findOne({ email: req.body.email }, async (err, user) => {
                if (!user) {
                    req.flash("error", 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordToken = Date.now() + 3600000; // 1hour 
                await user.save();
            })
        }
    ])
}