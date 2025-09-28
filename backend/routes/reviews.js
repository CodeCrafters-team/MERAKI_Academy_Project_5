const express = require("express");

const {
    getReviewsByCourseId,
    createReview,
    updateReview,
    deleteReview,
    getInstructorReviews
} = require("../controllers/reviews");
const reviewRouter = express.Router();

reviewRouter.get("/course/:course_id", getReviewsByCourseId);
reviewRouter.post("/", createReview);
reviewRouter.put("/:id", updateReview);
reviewRouter.delete("/:id", deleteReview);
reviewRouter.get("/instructors/:id", getInstructorReviews);


module.exports = reviewRouter;