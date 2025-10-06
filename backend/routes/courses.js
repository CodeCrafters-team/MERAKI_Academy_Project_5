const express = require("express");
const { 
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  getCoursesByCategoryId,
  getTrendingCourses,
  getMostSellingCourses,
  getCoursesByInstructor,
  updateCourse,
  getAllCoursesForAdmin,
  searchCourses
} = require("../controllers/courses");

const coursesRouter = express.Router();

coursesRouter.get("/", getAllCourses);
coursesRouter.get("/categories/:category_id", getCoursesByCategoryId);
coursesRouter.get("/trending", getTrendingCourses);
coursesRouter.get("/most-selling", getMostSellingCourses);
coursesRouter.get("/search", searchCourses);

coursesRouter.get("/:id", getCourseById);
coursesRouter.get("/instructor/:id", getCoursesByInstructor);
coursesRouter.post("/", createCourse);
coursesRouter.put("/:id", updateCourse);
coursesRouter.delete("/:id", deleteCourse);
coursesRouter.get("/admin/all", getAllCoursesForAdmin);



module.exports = coursesRouter;
