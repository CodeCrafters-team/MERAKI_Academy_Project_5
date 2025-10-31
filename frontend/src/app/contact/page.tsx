"use client";

import React, { useState } from "react";
import "./style.css";
import ContactSection from "../components/LottiePlayer/ContactSection";

const Contact = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [message,   setMessage]   = useState("");

  const [status,    setStatus]    = useState<boolean | null>(null);
  const [feedback,  setFeedback]  = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setFeedback("");

    try {
      setLoading(true);
      const res = await fetch("https://meraki-academy-project-5-anxw.onrender.com/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });

      const data = await res.json();

      if (res.ok && data?.success) {
        setStatus(true);
        setFeedback("Your message has been sent successfully ✅");
        setFirstName("");
        setLastName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus(false);
        setFeedback(data?.message || "Failed to send message ❌");
      }
    } catch (err) {
      setStatus(false);
      setFeedback("Network error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ContactPage" style={{ background: "#f2f4f7" }}>
        <div className="left-side">
        <h3>
          We would love to hear from you <br />
          Send us your thoughts anytime
        </h3>
        <div  className="m-5" style={{width:"45rem"}}><ContactSection /></div>
      
      </div>
      <div className="animate__animated animate__fadeInLeft Form">
        <p className="Title animate__animated animate__fadeInDown animate__slow">
          Contact Us
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="animate__animated animate__fadeInLeft animate__slow"
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="animate__animated animate__fadeInRight animate__slow"
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className="animate__animated animate__fadeInLeft animate__slow"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="animate__animated animate__fadeInRight animate__slow"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
          />

          <button
            className="register-btn  animate__animated animate__fadeInUp animate__slow"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status === true  && feedback && (
          <div className="SuccessMessage">{feedback}</div>
        )}
        {status === false && feedback && (
          <div className="ErrorMessage">{feedback}</div>
        )}
      </div>

    
    </div>
  );
};

export default Contact;
