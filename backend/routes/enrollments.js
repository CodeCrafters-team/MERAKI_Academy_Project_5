const express=require("express")

const{getAllEnrollment,getEnrollmentById,getEnrollmentsByUser,createEnrollment,deleteEnrollment , checkEnrollmentForUserCourse ,getWeeklySales}=require("../controllers/enrollment")
const authentication = require("../middleware/authentication");

const enrollmentRouter=express.Router()



enrollmentRouter.get("/",getAllEnrollment)
enrollmentRouter.get("/weekly-sales", getWeeklySales);
enrollmentRouter.get("/:id",getEnrollmentById)
enrollmentRouter.get("/user/:user_id",getEnrollmentsByUser)
enrollmentRouter.post("/",createEnrollment)
enrollmentRouter.delete("/:id",deleteEnrollment)
enrollmentRouter.get("/check/:courseId", authentication,checkEnrollmentForUserCourse);



module.exports=enrollmentRouter