import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function Loading() {
  return (
    <div 
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="spinner-grow " role="status" style={{width: '7rem', height: '7rem', color:"#77B0E4"}} >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Loading;