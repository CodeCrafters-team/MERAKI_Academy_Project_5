import express from "express"

import { getAllQuizzes,getQuizById,submitQuiz } from "../controllers/quizzes";


const quizzRouter=express.Router()

quizzRouter.get("/quizzes",getAllQuizzes)
quizzRouter.get("/:id",getQuizById)
quizzRouter.get("/:id/submit",submitQuiz)



module.exports=quizzRouter