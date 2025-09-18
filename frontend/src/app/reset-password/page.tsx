'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
const router = useRouter();
const [newPassword, setNewPassword] = useState('');
const [message, setMessage] = useState('');

const handleResetPassword = async () => {
    const email = localStorage.getItem('resetEmail');

    if (!email) {
    setMessage('No email found. Please request a reset again.');
    return;
    }

    if (!newPassword) return setMessage('New password required');

    try {
    const res = await fetch('http://localhost:5000/users/reset_password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();

    if (data.success) {
        localStorage.removeItem('resetEmail'); 
        router.push('/login');
    } else {
        setMessage(data.message || 'Password reset failed');
    }
    } catch (err) {
    console.error(err);
    setMessage('Server error');
    }
};

return (
    <div>
    <h2>Reset Password</h2>
    <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
    />
    <button onClick={handleResetPassword}>Update Password</button>
    {message && <p>{message}</p>}
    </div>
);
}
