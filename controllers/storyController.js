// this is what i have searched for searching the database for locations
// https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
const Story = require("../models/story");


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports.index =
    async (req, res, next) => {
        if (!req.query.search) {
            const results = await Story.find({});
            results.sort();
            res.render("story/index", { results });
        } else {
            const search = req.query.search;
            const regex = new RegExp(escapeRegex(search), 'gi');
            const results = await Story.find({ location: regex });
            if (results.length < 1) {
                req.flash("error", "No stories found!");
                return res.redirect("/story");
            }
            results.sort();
            res.render("story/index", { results });
        }

    }

module.exports.showOneStory = async (req, res, next) => {
    const { id } = req.params;
    const story = await Story.findById(id).populate({
        path: "comments",
        populate: {
            path: "author",
        }
    }).populate("author");
    if (!story) {
        req.flash("error", "Cannot find this story!");
        return res.redirect("/story");
    }

    res.render("story/story", { story });
};

module.exports.renderNewForm = async (req, res, next) => {
    res.render("story/new")
}

module.exports.createStory = async (req, res, next) => {
    // req.files is an array from mutller



    const story = new Story(req.body.story);

    // returning an array and inserting that in story.image
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    story.images = imgs;
    story.author = req.user._id;
    await story.save();
    // console.log(story);
    req.flash("success", "Successfully made new story");
    res.redirect(`/story/${story._id}`);


};

module.exports.updateStoryForm = async (req, res, next) => {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
        req.flash("error", "story not found!");
        return res.redirect("/story");
    }
    res.render("story/edit", { story });
};

module.exports.updateStory = async (req, res, next) => {
    const { story } = req.body;
    const { id } = req.params;
    // console.log(req.body);
    const updatedStory = await Story.findByIdAndUpdate(id, story);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await updatedStory.images.push(...imgs);
    await updatedStory.save();

    if (!updatedStory) {
        req.flash("error", "story not found!");
        return res.redirect("/story");
    }
    req.flash("success", "Successfully updated the story");
    res.redirect(`/story/${updatedStory._id}`)
};

module.exports.deleteStory = async (req, res, next) => {
    const { id } = req.params;
    const deleteItem = await Story.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Story");
    res.redirect("/story");
};