const express=require("express")
const{getAllLessons,getLessonById,createLesson,deleteLesson,getLessonByModulesId ,  updateLesson}=require("../controllers/lessons")


const lessonsRouter=express.Router()


lessonsRouter.get("/",getAllLessons)
lessonsRouter.get("/:id",getLessonById)
lessonsRouter.post("/",createLesson)
lessonsRouter.delete("/:id",deleteLesson)
lessonsRouter.get("/module/:module_id",getLessonByModulesId)
lessonsRouter.put("/:id", updateLesson);

module.exports=lessonsRouter