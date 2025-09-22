import React from 'react'
import CourseSlider from '../components/CourseSlider/courseSlider'
import CategoryList from "../components/CategoryList/CategoryList"


import About from '../components/about/page'


function page() {
  return (
    <div>
      
      <div> 
        <About/>
        <CourseSlider/>
          <CategoryList />
        
      </div>
   
    </div>
  )
}

export default page
