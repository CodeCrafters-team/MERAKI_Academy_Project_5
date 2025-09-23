const express = require("express");
const { 
getAllCourses,getCourseById,createCourse,deleteCourse
 , getCoursesByCategoryId} = require("../controllers/courses");

 const coursesRouter = express.Router();

coursesRouter.get("/", getAllCourses);
coursesRouter.get("/:id", getCourseById);
coursesRouter.post("/", createCourse);
coursesRouter.delete("/:id", deleteCourse);
coursesRouter.get("/categories/:category_id", getCoursesByCategoryId);


module.exports = coursesRouter;