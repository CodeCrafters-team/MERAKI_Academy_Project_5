const express=require("express")
const authentication = require("../middleware/authentication");
const { getAllQuizzes,getQuizById,submitQuiz }=require("../controllers/quizzes")


const quizzRouter=express.Router()

quizzRouter.get("/",getAllQuizzes)
quizzRouter.get("/:id",getQuizById)
quizzRouter.post("/:id/submit", authentication,submitQuiz)



module.exports=quizzRouter