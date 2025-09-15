const express = require("express");
const { 
getAllCourses,getCourseById,createCourse,deleteCourse
 } = require("../controllers/courses");

 const coursesRouter = express.Router();

coursesRouter.get("/", getAllCourses);
coursesRouter.get("/:id", getCourseById);
coursesRouter.post("/", createCourse);
coursesRouter.delete("/:id", deleteCourse);

module.exports = coursesRouter;