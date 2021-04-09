require('dotenv').config()
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ExpressError = require("./utils/expressError");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");



const storyRoutes = require("./routes/story");
const commentRoutes = require("./routes/comment");
const userRoutes = require("./routes/user");


// connecting to the database.
mongoose.connect("mongodb+srv://Asfand:test123@cluster0.hfbjn.mongodb.net/stories?retryWrites=true&w=majority", {
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// for parsing json when using req.
app.use(express.urlencoded({ extended: true }));

// method override for put and delete.
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

// options for session
const sessionConfig = {
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
    res.render("home");
});




// for all the routes.
app.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404));
});

//error middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh no some thing went wrong!";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("serving on post 3000");
});