const express = require("express");
const router = express.router();
const User = require("../models/user");


router.get("/register", (req, res) => {
    res.render("users/register")
})









module.exports = router;