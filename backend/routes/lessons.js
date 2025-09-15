const express=require("express")
const{getAllLessons,getLessonById,createLesson,deleteLesson}=require("../controllers/lessons")


const lessonsRouter=express.Router()


lessonsRouter.get("/",getAllLessons)
lessonsRouter.get("/:id",getLessonById)
lessonsRouter.post("/",createLesson)
lessonsRouter.delete("/:id",deleteLesson)


module.exports={lessonsRouter}