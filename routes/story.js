const express = require("express");
const router = express.Router({ mergeParams: true });
const Story = require("../models/story")
const { validateStory } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");


// get all the stories.
router.get("/", catchAsync(async (req, res) => {
    const results = await Story.find({});
    results.sort();
    res.render("story/index", { results });
}));

// to make new story show form.
router.get("/new", catchAsync(async (req, res) => {
    res.render("story/new")
}))

// show story by id
router.get("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const story = await Story.findById(id).populate("comments");
    if (!story) {
        req.flash("error", "Cannot find this story!");
        return res.redirect("/story");
    }
    // console.log(story);
    res.render("story/story", { story });
}))

// for creating new story
router.post("/", validateStory, catchAsync(async (req, res, next) => {
    const story = new Story(req.body.story);
    await story.save();
    req.flash("success", "Successfully made new story");
    res.redirect("/story");
}))

// for updating story.
router.get("/:id/edit", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "story not found!");
        return res.redirect("/story");
    }
    res.render("story/edit", { story });
}))

// for updating one story by it;s Id
router.put("/:id", validateStory, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { story } = req.body;
    const updatedStory = await Story.findByIdAndUpdate(id, story);
    if (!updatedStory) {
        req.flash("error", "story not found!");
        return res.redirect("/story");
    }
    req.flash("success", "Successfully updated the story");
    res.redirect(`/story/${updatedStory._id}`)
}))

// to delete story by it's id

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const deleteItem = await Story.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Story");
    res.redirect("/story");
}))



module.exports = router;