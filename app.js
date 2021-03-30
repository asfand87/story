const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const storyRoutes = require("./routes/story");
const commentRoutes = require("./routes/comment");


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

// story routes.
app.use("/story", storyRoutes);
// comment Routes
app.use('/story/:id/comment', require("./routes/comment"));
// index route.
app.get("/", (req, res) => {
    res.render("home");
});

// for all the routes.
// app.all("*", (req, res, next) => {
//     next(new ExpressError("page not found", 404));
// });
// app.use((err, req, res, next) => {
//     // const { statusCode = 500, message = "some thing went wrong" } = err;
//     const { statusCode = 500 } = err;
//     if (!err.message) err.message = "Oh no some thing went wrong!";
//     res.status(statusCode).send({ err });

// });

app.listen(3000, () => {
    console.log("serving on post 3000");
});