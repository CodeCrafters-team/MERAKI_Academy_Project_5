const express = require("express");
const {
    completeLesson,
    uncompleteLesson,
    getCourseProgress,
    checkLessonComplete
} = require("../controllers/progress");
const authentication = require("../middleware/authentication");

const progressRouter = express.Router();

progressRouter.post("/complete", completeLesson);
progressRouter.post("/uncomplete", uncompleteLesson);
progressRouter.get("/course/:courseId",authentication, getCourseProgress);
progressRouter.get("/lesson/:lessonId",authentication, checkLessonComplete);



module.exports = progressRouter;