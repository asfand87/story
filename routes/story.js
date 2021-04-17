const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateStory, isLoggedIn, isAuthor } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const { index, renderNewForm, createStory, updateStoryForm, updateStory, deleteStory, showOneStory } = require("../controllers/storyController");
// https://www.npmjs.com/package/multer
const multer = require('multer');
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

// to get index page and to post to the story page.
router.route("/")
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateStory, catchAsync(createStory))
// testing purposes for mutler
// .post(upload.array('image'), (req, res) => {
//     console.log(req.files, req.body);
// });


// to render new form.
router.get("/new", isLoggedIn, catchAsync(renderNewForm));


// get single story, update and delete it by it's id.
router.route("/:id")
    .get(catchAsync(showOneStory))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateStory, catchAsync(updateStory))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteStory))




router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(updateStoryForm));


module.exports = router;