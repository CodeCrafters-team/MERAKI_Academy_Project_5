const express=require("express")

const { getAllQuizzes,getQuizById,submitQuiz }=require("../controllers/quizzes")


const quizzRouter=express.Router()

quizzRouter.get("/quizzes",getAllQuizzes)
quizzRouter.get("/:id",getQuizById)
quizzRouter.post("/:id/submit",submitQuiz)



module.exports=quizzRouter