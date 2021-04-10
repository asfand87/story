const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateStory, isLoggedIn, isAuthor } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const { index, renderNewForm, createStory, updateStoryForm, updateStory, deleteStory, showOneStory } = require("../controllers/storyController");



// to get index page and to post to the story page.
router.route("/")
    .get(catchAsync(index))
    .post(isLoggedIn, validateStory, catchAsync(createStory))


// to render new form.
router.get("/new", isLoggedIn, catchAsync(renderNewForm));


// get single story, update and delete it by it's id.
router.route("/:id")
    .get(catchAsync(showOneStory))
    .put(isLoggedIn, isAuthor, validateStory, catchAsync(updateStory))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteStory))




router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(updateStoryForm));


module.exports = router;