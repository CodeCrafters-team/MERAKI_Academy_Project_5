'use client'
import React from "react";


const passportLogin=()=>{
const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/google";
}

  return (
    <div style={{ padding: 20 }}>
      <h1>Google Sign In Test</h1>
      <button
        onClick={handleGoogleLogin}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Sign in with Google
      </button>
    </div>
  );

}



export default passportLogin;

