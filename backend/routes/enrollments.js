const express=require("express")

const{getAllEnrollment,getEnrollmentById,createEnrollment,deleteEnrollment}=require("../controllers/enrollment")

const enrollmentRouter=express.Router()


enrollmentRouter.get("/",getAllEnrollment)
enrollmentRouter.get("/:id",getEnrollmentById)
enrollmentRouter.post("/",createEnrollment)
enrollmentRouter.delete("/:id",deleteEnrollment)

module.exports=enrollmentRouter