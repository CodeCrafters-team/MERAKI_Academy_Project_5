
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
    const res = await fetch('http://localhost:5000/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (data.success) {
    dispatch(
        setCredentials({
        token: data.token,
        userId: data.user.id,
        avatarUrl: data.user.avatarUrl,
        })
    );

    router.push('/');
    } else {
    console.log('Login error');
    }
};

return (
    <div>
    <div>
        <h2>Logi</h2>
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
    </div>
    </div>
);
}
