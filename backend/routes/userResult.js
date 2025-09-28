const express=require("express")

const{getUserResults, getUserResultById} =require("../controllers/userResult")


const userResultRouter=express.Router()

userResultRouter.get("/user/:userId",getUserResults)
userResultRouter.get("/detail/:resultId",getUserResultById)




module.exports=userResultRouter