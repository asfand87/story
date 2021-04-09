const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateStory, isLoggedIn, isAuthor } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const { index, renderNewForm, createStory, updateStoryForm, updateStory, deleteStory, showOneStory } = require("../controllers/storyController");


// get all the stories.
router.get("/", catchAsync(index));

// to make new story show form.
router.get("/new", isLoggedIn, catchAsync(renderNewForm));

// show story by id
router.get("/:id", catchAsync(showOneStory));

// for creating new story
router.post("/", isLoggedIn, validateStory, catchAsync(createStory));

// for updating story.
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(updateStoryForm));

// for updating one story by it;s Id
router.put("/:id", isLoggedIn, isAuthor, validateStory, catchAsync(updateStory));

// to delete story by it's id

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(deleteStory))
module.exports = router;