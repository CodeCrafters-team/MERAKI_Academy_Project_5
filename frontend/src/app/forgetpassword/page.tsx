"use client";

import React, { useState, useMemo } from "react";
import Stepper, { Step } from "../components/Stepper";
import axios from "axios";

const API_BASE = "https://meraki-academy-project-5-anxw.onrender.com";


function Page() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [codeErr, setCodeErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const codeOk = useMemo(() => /^\d{6}$/.test(code), [code]);
  const pwOk = useMemo(() => pw.length >= 8, [pw]);
  const pwMatch = useMemo(() => pw && pw === pw2, [pw, pw2]);

  const clearErrors = () => {
    setEmailErr(null);
    setCodeErr(null);
    setPwErr(null);
  };

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!emailOk) return setEmailErr("Invalid email.");
    setLoading(true);
    axios
      .post("https://meraki-academy-project-5-anxw.onrender.com/users/forgot_password", { email })
      .then((res) => {
        if (res.data?.success) {
          setStep(2);
        } else {
          setEmailErr(res.data.message || "Failed to send code.");
        }
      })
      .catch((err) => {
        setEmailErr(err.message || "Failed to send code.");
      })
      .finally(() => setLoading(false));
  };

    const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!emailOk) return setEmailErr('Invalid email.');
    if (!codeOk) return setCodeErr('Code must be 6 digits.');
    setLoading(true);

    axios
      .post("https://meraki-academy-project-5-anxw.onrender.com/users/verify_reset_code",{ email, code })
      .then(res => {
        if (res.data?.success) {
          setStep(3);
        } else {
            setCodeErr(res.data?.message || 'Failed to verify code.');
        }
      })
      .catch(err => {
        if (err.response?.data?.message) setCodeErr(err.response.data.message);
        else setCodeErr('Failed to verify code.');
      })
      .finally(() => setLoading(false));
  };

 const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    if (!pwOk) return setPwErr('Password must be at least 8 characters.');
    if (!pwMatch) return setPwErr('Passwords do not match.');
    setLoading(true);

    axios
      .put("https://meraki-academy-project-5-anxw.onrender.com/users/reset_password", { email, newPassword: pw})
      .then(res => {
        if (res.data?.success) {
          setStep(4);
        } else {
            setPwErr(res.data?.message || 'Failed to change password.');
        }
      })
      .catch(err => {
        if (err.response?.data?.message) setPwErr(err.response.data.message);
        else setPwErr('Failed to change password.');
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Stepper
        initialStep={1}
        externalStep={step}
        onStepChange={(s) => setStep(s)}
        onFinalStepCompleted={() => console.log("All steps completed!")}
        backButtonText="Back"
      >
        <Step>
          <h2 className="text-xl font-semibold mb-2">Recover Password</h2>
          <p>Please enter your email or mobile number to search for your account.</p>
          <form onSubmit={sendCode}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              className="w-full border rounded-lg p-2 mb-1"
            />
            {emailErr && (
              <p className="text-red-600 text-sm mb-2">{emailErr}</p>
            )}
            <button
              type="submit"
              disabled={loading || !emailOk}
              className="px-4 py-2 rounded-lg border disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Code"}
            </button>
          </form>
        </Step>

        <Step>
          <h2 className="text-xl font-semibold mb-2">Verify Code</h2>
          <p>Please check your email for a message with your code. Your code is 6 numbers long.</p>
          <form onSubmit={verifyCode}>
            <input
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="######"
              className="w-full border rounded-lg p-2 mb-1 text-center tracking-widest"
            />
            {codeErr && <p className="text-red-600 text-sm mb-2">{codeErr}</p>}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg border"
              >
                Change Email
              </button>
              <button
                type="submit"
                disabled={loading || !codeOk}
                className="px-4 py-2 rounded-lg border disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </form>
        </Step>

        <Step>
          <h2 className="text-xl font-semibold mb-2">Set New Password</h2>
          <p>Please enter a strong password with at least 8 characters.</p>
          <form onSubmit={resetPassword}>
            <input
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="New password"
              type="password"
              className="w-full border rounded-lg p-2 mb-2"
            />
            <input
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              placeholder="Confirm password"
              type="password"
              className="w-full border rounded-lg p-2 mb-2"
            />
            <br />
            {pwErr && <p className="text-red-600 text-sm mb-2">{pwErr}</p>}
            <button
              type="submit"
              disabled={loading || !pwOk || !pwMatch}
              className="px-4 py-2 rounded-lg border disabled:opacity-60 mt-1"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>
          </form>
        </Step>
        <Step>
          <h2 className="text-xl font-semibold mb-2">Success 🎉</h2>
          <p>You can now log in with your new password.</p>
          <a href="/login" className="underline">
            Go to login page
          </a>
        </Step>
      </Stepper>
    </div>
  );
}

export default Page;
