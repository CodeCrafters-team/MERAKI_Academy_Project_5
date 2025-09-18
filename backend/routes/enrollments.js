const express=require("express")

const{getAllEnrollment,getEnrollmentById,getEnrollmentsByUser,createEnrollment,deleteEnrollment}=require("../controllers/enrollment")

const enrollmentRouter=express.Router()


enrollmentRouter.get("/",getAllEnrollment)
enrollmentRouter.get("/:id",getEnrollmentById)
enrollmentRouter.delete("/:user_id",getEnrollmentsByUser)
enrollmentRouter.post("/",createEnrollment)
enrollmentRouter.delete("/:id",deleteEnrollment)

module.exports=enrollmentRouter