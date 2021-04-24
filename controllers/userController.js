// https://www.npmjs.com/package/locus
const User = require("../models/user");
const nodemailer = require("nodemailer");


const crypto = require("crypto");
const { waterfall } = require("async");


// form rendering function for registeration.

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
    req.flash("success", "Successfully logged you out!");
    res.redirect("/story");
};

module.exports.renderForgot = async (req, res) => {
    res.render('users/forgot');
}

module.exports.forgot = async (req, res, next) => {
    waterfall([
        (done) => {
            crypto.randomBytes(20, async (err, buf) => {
                var token = buf.toString('hex');
                await done(err, token);
            });
        },
        async (token, done) => {
            await User.findOne({ email: req.body.email }, async (err, user) => {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                await user.save(async (err) => {
                    await done(err, token, user);
                });
            });
        },
        async (token, user, done) => {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'asfand0085@gmail.com',
                    pass: process.env.GMAILPW,
                }
            });

            var mailOptions = {
                to: user.email,
                from: 'asfand0085@gmail.com',
                subject: 'Password Reset For Story.com',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, async (err) => {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                await done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/forgot');
    });
}

// this route is for resting the password
module.exports.passwordReset = async (req, res) => {
    await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async (err, user) => {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('users/reset', { token: req.params.token });
    });
};

module.exports.postPassword = async (req, res) => {
    waterfall([
        async (done) => {
            await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.setPassword(req.body.password, async (err) => {
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;

                        await user.save((err) => {
                            req.logIn(user, async (err) => {
                                await done(err, user);
                            });
                        });
                    })
                } else {
                    req.flash("error", "Passwords do not match.");
                    return res.redirect('back');
                }
            });
        },
        (user, done) => {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'asfand1987@gmail.com',
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'asfand0085:gmail.com',
                subject: 'Your password for story.com',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, async (err) => {
                req.flash('success', 'Success! Your password has been changed.');
                await done(err);
            });
        }
    ], async (err) => {
        res.redirect('/story');
    });
}