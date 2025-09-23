const express = require("express");
const {
    completeLesson,
    uncompleteLesson,
    getCourseProgress,
} = require("../controllers/progress");
const authentication = require("../middleware/authentication");

const progressRouter = express.Router();

progressRouter.post("/complete", completeLesson);
progressRouter.post("/uncomplete", uncompleteLesson);
progressRouter.get("/course/:courseId",authentication, getCourseProgress);

module.exports = progressRouter;