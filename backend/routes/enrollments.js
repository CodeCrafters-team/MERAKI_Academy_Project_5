const express=require("express")

const{getAllEnrollment,getEnrollmentById,getEnrollmentsByUser,createEnrollment,deleteEnrollment , checkEnrollmentForUserCourse}=require("../controllers/enrollment")
const authentication = require("../middleware/authentication");

const enrollmentRouter=express.Router()


enrollmentRouter.get("/",getAllEnrollment)
enrollmentRouter.get("/:id",getEnrollmentById)
enrollmentRouter.delete("/:user_id",getEnrollmentsByUser)
enrollmentRouter.post("/",createEnrollment)
enrollmentRouter.delete("/:id",deleteEnrollment)
enrollmentRouter.get("/check/:courseId", authentication,checkEnrollmentForUserCourse);


module.exports=enrollmentRouter