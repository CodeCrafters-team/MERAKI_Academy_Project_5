import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

function Test() {
  return (
    <div 
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="spinner-grow " role="status" style={{width: '5rem', height: '5rem', color:"blue"}} >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Test;