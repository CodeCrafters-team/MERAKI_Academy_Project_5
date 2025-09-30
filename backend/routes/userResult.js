const express=require("express")
const authentication = require("../middleware/authentication");

const{getUserResults, getUserResultById} =require("../controllers/userResult")


const userResultRouter=express.Router()

userResultRouter.get("/user/:userId",authentication,getUserResults)
userResultRouter.get("/detail/:resultId",authentication,getUserResultById)




module.exports=userResultRouter