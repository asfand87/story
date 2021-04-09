const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateComment, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");
const { makeComment, updateCommentForm, updateComment, deleteComment } = require('../controllers/commentsController');



router.post("/", isLoggedIn, validateComment, catchAsync(makeComment));

router.get("/:commentId/edit", isLoggedIn, isReviewAuthor, catchAsync(updateCommentForm));

router.put("/:commentId", isLoggedIn, validateComment, isReviewAuthor, catchAsync(updateComment))

router.delete("/:commentId", isLoggedIn, isReviewAuthor, catchAsync(deleteComment))

module.exports = router;