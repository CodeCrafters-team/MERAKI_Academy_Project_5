import React from 'react'
import Loading from './components/LottiePlayer/Loading'

export default function page() {
  return (
    <div   className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }} >
<div role="status" style={{ alignItems: 'center', width :"50rem" }}>
  <span>
<Loading />
</span>
      </div>
    </div>
  )
}
