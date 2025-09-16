"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"login" | "verify">("login");
  const [userId, setUserId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "login") {
      try {
        const res = await fetch("http://localhost:5000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.requires2FA) {
          setMessage("Verification code sent to your email.");
          setStep("verify");
          setUserId(data.user.id);
          if (!data.passwordCorrect) {
            setMessage("Password incorrect, please verify with code to update info.");
          }
        } else {
          setMessage(data.message || "Login failed");
        }
      } catch (err) {
        console.error(err);
        setMessage("Server error");
      }
    } else if (step === "verify") {
      try {
        const res = await fetch(`http://localhost:5000/users/verifyCode/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: verificationCode }),
        });

        const data = await res.json();

        if (data.success) {
          setMessage("User verified! You can now update your info.");
        } else {
          setMessage(data.message || "Verification failed");
        }
      } catch (err) {
        console.error(err);
        setMessage("Server error");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={step === "verify"}
        />
        {step === "login" && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        )}
        {step === "verify" && (
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        )}
        <button type="submit">{step === "login" ? "Login" : "Verify"}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
