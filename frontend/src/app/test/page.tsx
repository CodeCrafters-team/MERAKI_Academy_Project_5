import React from 'react'

import ThemeToggle from '../components/ThemeToggle/themeToggle'
import  UserDialog from "../components/userDialog/userDialog"

import CourseSliders from '../components/CourseSlider/courseSlider'


function page() {
  return (
    <div>

       <UserDialog />
      <ThemeToggle/>

      <CourseSliders/>

    </div>
  )
}

export default page
