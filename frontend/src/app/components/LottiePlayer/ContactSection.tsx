"use client"
import React from 'react'
import Lottie from 'lottie-react'
import animationData from '../../../../public/animations/mYV7QVEbgd.json'

const ContactSection = () => {
  return (
    <div>
      <Lottie 
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  )
}

export default ContactSection
