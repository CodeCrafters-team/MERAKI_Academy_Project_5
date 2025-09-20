'use client';

import React, { useState } from "react";
import axios from "axios";
import "./style.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(false);
  const [loading,   setLoading]   = useState(false);
      const GOOGLE_LOGIN_URL = `http://localhost:5000/auth/google/login`;

  

  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`http://localhost:5000/users/login`, { email, password })
      .then((result) => {
        setLoading(true);
        if (result.data) {
          console.log(result.data);
          setMessage("Login successful");
          setStatus(true);
         setTimeout(() => router.push('/'), 800);

        } else {
          throw new Error();
        }
      })
      .catch((error) => {
        setStatus(false);
        if (error.response && error.response.data) {
          return setMessage(error.response.data.message);
        }
        setMessage("Error happened while Login, please try again");
      }).finally(() => setLoading(false));
  };

  

  return (
    <div className="Login" style={{ background: "#f2f4f7" }}>
      <div className="left-side">
        <h3>
          Learn with SmartPath <br /> draw your own path to creativity and success
        </h3>
        <img  style={{ width: "30em" }} src="/assets/img1.svg" alt="Learning" />
      </div>

      <div className={ "animate__animated  animate__fadeInLeft Form "}>
        <p className="Title">Login</p>
        <form onSubmit={handleLogin}>
          <input
          className=" animate__animated  animate__fadeInLeft animate__slow "
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
          className=" animate__animated  animate__fadeInRight animate__slow "
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-btn  animate__animated  animate__fadeInLeft animate__slow" type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="to-register  animate__animated  animate__fadeInUp animate__slow">
          Don&apos;t have an account? <a href="/register">Register</a>
        </div>

        {status
          ? message && <div className="SuccessMessage">{message}</div>
          : message && <div className="ErrorMessage">{message}</div>}

        <div className="or-sep">OR</div>

        <button
          type="button"
          className="google-btn animate__animated  animate__fadeInUp animate__slow"
           onClick={() => (window.location.href = GOOGLE_LOGIN_URL)}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="google-icon"
          />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
