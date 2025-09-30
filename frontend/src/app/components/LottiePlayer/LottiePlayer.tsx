"use client"
import React from 'react'
import Lottie from 'lottie-react'
import animationData from '../../../../public/animations/xPnyakTZXq.json'

const LottiePlayer = () => {
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

export default LottiePlayer
