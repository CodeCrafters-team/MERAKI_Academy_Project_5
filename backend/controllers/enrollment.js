 const pool=require("pg")


const getAllEnrollment=async (req,res)=>{

try{
const result= await pool.query(`SELECT * FROM enrollments`)

if(!result){

res.status(404).json({
   success: true,
      message: "Enrollment Not Found",
      data: result.rows,
})

}
res.status(200).json({
    success:true,
    message:"Fitched Data Succefully"
})

} 

catch(err){
    res.status(500).json({
    success:false,
    message:"Server Error"
})

}


} 


const getEnrollmentById=async(req,res)=>{

try{

const{id}=req.params
const result=await pool.query(`SELECT * FROM enrollments WHERE id=$1 `,[id])

if(result.rows.length===0){
    res.status(404).json({
        success:false,
        message:"Enrollment Not Found"
    })
}
 res.status(200).json({
        success:success,
        message:"Fitched Data Succefully",
        data:result.rows[0]
    })


}catch(err){
      res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
}

}

const createEnrollment=async(req,res)=>{
try{
const {user_id,course_id,enroll_at,user,course}=req.body
const result=pool.query(`INSERT INTO enrollments (user_id,course_id,enroll_at,user,course)VALUE($1,$2,$3,$4,$5)RETURNING *`,[

user_id || null,
course_id || null,
enroll_at || null,
 user || null,
course || null
])
 res.status(200).json({
success:true,
message:"Enrollment Created Successfully",
data:result.rows[0]

 })

}catch(err){
    res.status(500).json({
        success: false,
        message: "Server Error",
        error: err.message,
      });
}

}










module.exports={getAllEnrollment,getEnrollmentById,createEnrollment}