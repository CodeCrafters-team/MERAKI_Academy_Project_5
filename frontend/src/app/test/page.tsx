import React from 'react'
import ThemeToggle from '../components/ThemeToggle/themeToggle'
import  UserDialog from "../components/userDialog/userDialog"

function page() {
  return (
    <div>
       <UserDialog />
      <ThemeToggle/>
    </div>
  )
}

export default page
