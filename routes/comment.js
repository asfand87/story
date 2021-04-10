const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateComment, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const { makeComment, updateCommentForm, updateComment, deleteComment } = require('../controllers/commentsController');


// to make comment
router.post("/", isLoggedIn, validateComment, catchAsync(makeComment));

// to show comment update form.
router.get("/:commentId/edit", isLoggedIn, isReviewAuthor, catchAsync(updateCommentForm));

//get update and delete comment by theiry id.
router.route("/:commentId")
    .put(isLoggedIn, validateComment, isReviewAuthor, catchAsync(updateComment))
    .delete(isLoggedIn, isReviewAuthor, catchAsync(deleteComment))


module.exports = router;