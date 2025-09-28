const express = require("express");
const { 
getAllCourses,getCourseById,createCourse,deleteCourse
 , getCoursesByCategoryId,updateCourse} = require("../controllers/courses");

 const coursesRouter = express.Router();

coursesRouter.get("/", getAllCourses);
coursesRouter.get("/categories/:category_id", getCoursesByCategoryId);
coursesRouter.get("/:id", getCourseById);
coursesRouter.post("/", createCourse);
coursesRouter.put("/:id", updateCourse);
coursesRouter.delete("/:id", deleteCourse);


module.exports = coursesRouter;