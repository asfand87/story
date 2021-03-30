const express = require("express");
const router = express.Router({ mergeParams: true });
const Story = require("../models/story")
const { validateStory } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(async (req, res) => {
    const results = await Story.find({});
    results.sort();
    res.render("story/index", { results });
}));


router.get("/new", catchAsync(async (req, res) => {
    res.render("story/new")
}))

// show route.
router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const story = await Story.findById(id).populate("comments");
    // console.log(story);
    res.render("story/story", { story });
}))

// for creating new story
router.post("/", validateStory, catchAsync(async (req, res, next) => {
    const story = new Story(req.body.story);
    await story.save();
    res.redirect("/story");
}))

// for updating story.
router.get("/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    res.render("story/edit", { story });
}))

router.put("/:id", validateStory, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { story } = req.body;
    const updatedStory = await Story.findByIdAndUpdate(id, story);
    res.redirect(`/story/${updatedStory._id}`)
}))


router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleteItem = await Story.findByIdAndDelete(id);
    res.redirect("/story");
}))



module.exports = router;