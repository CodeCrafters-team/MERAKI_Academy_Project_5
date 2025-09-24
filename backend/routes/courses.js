const express = require("express");
const { 
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  getCoursesByCategoryId,
  getTrendingCourses,
  getMostSellingCourses
} = require("../controllers/courses");

const coursesRouter = express.Router();

coursesRouter.get("/", getAllCourses);
coursesRouter.get("/categories/:category_id", getCoursesByCategoryId);
coursesRouter.get("/trending", getTrendingCourses);
coursesRouter.get("/most-selling", getMostSellingCourses);
coursesRouter.get("/:id", getCourseById);
coursesRouter.post("/", createCourse);
coursesRouter.delete("/:id", deleteCourse);

module.exports = coursesRouter;
