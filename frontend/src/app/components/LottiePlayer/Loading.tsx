"use client"
import React from 'react'
import Lottie from 'lottie-react'
import animationData from '../../../../public/animations/eWuZQz7Ukj.json'

const Loading = () => {
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

export default Loading
