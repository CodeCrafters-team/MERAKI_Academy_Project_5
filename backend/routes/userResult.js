import express from "express"

import {getUserResults, getUserResultById} from "../controllers/userResult";


const userResultRouter=express.Router()

userResultRouter.get("/:userId",getUserResults)
userResultRouter.get("/detail/:resultId",getUserResultById)




module.exports=userResultRouter