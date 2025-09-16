"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("No user found, please login first.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/users/verifyCode/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Verification failed");
        return;
      }

      setMessage("Verification successful! Redirecting...");
      router.push("/home"); // الصفحة التالية بعد التحقق
    } catch (err) {
      setMessage("Server error, please try again later.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Verify Code</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        /><br/>
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
