
// if we are not running in production require .env package.
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// https://www.npmjs.com/package/dotenv
require('dotenv').config();

const express = require("express");
// https://www.npmjs.com/package/morgan
const morgan = require("morgan");
const path = require("path");
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
// https://www.npmjs.com/package/ejs-mate
const ejsMate = require("ejs-mate");
// https://www.npmjs.com/package/express-session
const session = require("express-session");
// my own defined error class
const ExpressError = require('./utils/ExpressError');
// https://www.npmjs.com/package/connect-flash
const flash = require("connect-flash");
// https://www.npmjs.com/package/method-override
const methodOverride = require("method-override");
// https://www.npmjs.com/package/passport
const passport = require("passport");
// https://www.npmjs.com/package/passport-local
const LocalStrategy = require("passport-local");
//User model.
const User = require("./models/user");
//https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 8080;

const storyRoutes = require("./routes/story");
const commentRoutes = require("./routes/comment");
const userRoutes = require("./routes/user");

const dbUrl = 'mongodb://localhost:27017/story' || process.env.URL;
// process.env.URL;

// connecting to the database.
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected");
});

// initializing app
const app = express();


app.use(morgan("dev"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// for parsing json when using req.
app.use(express.urlencoded({ extended: true }));

// method override for put and delete.
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.STORESECRET,
    }
})
store.on("error", function (e) {
    console.log("Session store error", e)
})
// options for session
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
// setting up session 
app.use(session(sessionConfig));

// telling app to use flash.
app.use(flash());

// telling app to use passport and configuring it. 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// middlewear for passing items globally.

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// story routes.
app.use("/story", storyRoutes);
// comment Routes
app.use('/story/:id/comment', commentRoutes);
// user Routes
app.use("/", userRoutes);

// index Route.
app.get("/", (req, res) => {
    res.redirect('/story');
});



// for all the routes.
app.all("*", (req, res, next) => {
    let text = (req.params[0]);
    let pathText = (text.slice(1));
    return next(new ExpressError(`Page ${pathText} Not Found`, 404));
});

//error middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no some thing went wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(PORT, HOST, () => {
    console.log(`Server connected at http://localhost:${PORT}`);
});