'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPassword() {
const router = useRouter();
const [email, setEmail] = useState('');
const [code, setCode] = useState('');
const [message, setMessage] = useState('');

const handleVerifyCode = async () => {
    if (!email || !code) return setMessage('Email and code are required');

    try {
    const res = await fetch('http://localhost:5000/users/verify_reset_code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }), 
    });

    const data = await res.json();

    if (data.success) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } else {
        setMessage(data.message || 'Invalid code');
    }
    } catch (err) {
    console.error(err);
    setMessage('Server error');
    }
};

return (
    <div>
    <h2>Enter Verification Code</h2>
    <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
    />
    <input
        type="text"
        placeholder="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
    />
    <button onClick={handleVerifyCode}>Verify Code</button>
    {message && <p>{message}</p>}
    </div>
);
}
