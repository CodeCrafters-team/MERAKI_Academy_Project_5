const express=require("express")
const{getAllLessons,getLessonById,createLesson,deleteLesson,getLessonByModulesId}=require("../controllers/lessons")


const lessonsRouter=express.Router()


lessonsRouter.get("/",getAllLessons)
lessonsRouter.get("/:id",getLessonById)
lessonsRouter.post("/",createLesson)
lessonsRouter.delete("/:id",deleteLesson)
lessonsRouter.get("/:module_id",getLessonByModulesId)

module.exports=lessonsRouter