'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [age,       setAge]       = useState<number | ''>('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [message,   setMessage]   = useState('');
  const [status,    setStatus]    = useState<boolean | null>(null); 
  const [loading,   setLoading]   = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setStatus(null);

    try {
      setLoading(true);
      const res = await fetch('https://meraki-academy-project-5-anxw.onrender.com/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          age,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok && (data?.success ?? true)) {
        setStatus(true);
        setMessage('Registration successful. Redirecting...');
        router.push('/');
        setTimeout(() => router.push('/login'), 800);
      } else {
        setStatus(false);
        setMessage(data?.message || 'Error happened while register, please try again');
      }
    } catch (err) {
      setStatus(false);
      setMessage('Network error, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login" style={{ background: '#f2f4f7' }}>
      <div className="left-side">
        <h3 >
          Learn with SmartPath <br /> draw your own path to creativity and success
        </h3>
        <img
          style={{ width: '30em' }}
          src="/assets/img1.svg"
          alt="Learning"
        />
      </div>

      <div className="animate__animated animate__fadeInLeft   Form">
        <p className="Title animate__animated animate__fadeInDown  animate__slow">Register</p>

        <form onSubmit={handleRegister}>
          <input
            className="animate__animated animate__fadeInLeft animate__slow"
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="animate__animated animate__fadeInRight animate__slow"
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            className="animate__animated animate__fadeInLeft animate__slow"
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            min={0}
          />
          <input
            className="animate__animated animate__fadeInRight animate__slow"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="animate__animated animate__fadeInLeft animate__slow"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="register-btn animate__animated animate__fadeInUp animate__slow" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="to-login animate__animated animate__fadeInUp animate__slow">
          Already have an account? <a href='/login'>Login</a>
        </div>

        {status === true  && message && <div className="SuccessMessage">{message}</div>}
        {status === false && message && <div className="ErrorMessage">{message}</div>}

        <div className="or-sep">OR</div>

        <button type="button" className="google-btn animate__animated animate__fadeInUp animate__slow" onClick={() => (window.location.href = '/auth/google')}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Register;
