
'use client';

import { useDispatch } from 'react-redux';
import { setCredentials } from '@/redux/slices/authSlice';
import { AppDispatch } from '@/redux/store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
const dispatch = useDispatch<AppDispatch>();
const router = useRouter();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("avatarUrl", data.user.avatarUrl);

        router.push("/");
      } else {
        console.log("Login error:", data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

const handleForgotPassword = async () => {
  if (!email) {
    console.log("Email is required");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/users/forgot_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("resetEmail", email);

      console.log("Verification code sent. Go to verify page.");
      router.push("/verify-password");        
    } else {
      console.log("Error sending code:", data.message);
    }
  } catch (err) {
    console.error("Forgot password error:", err);
  }
};


return (
    <div>
    <div>
        <h2>Login</h2>
        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button
        onClick={handleLogin}>
        Login
        </button>

        <button
        onClick={handleForgotPassword}>
        Forgot Password
      </button>
    </div>
    </div>
);
}
