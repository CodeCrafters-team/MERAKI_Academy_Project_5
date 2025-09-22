import React from 'react'
import CourseSlider from '../components/CourseSlider/courseSlider'




import About from '../components/about/page'
import UserDialog from "../components/userDialog/userDialog"

function page() {
  return (
    <div>
      
      <div> 
        <About/>
        <CourseSlider/>
        <UserDialog/>
       
        
      </div>
   
    </div>
  )
}

export default page
