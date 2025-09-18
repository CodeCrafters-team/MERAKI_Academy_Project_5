'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const router = useRouter();

const handleRegister = async () => {
    const res = await fetch('http://localhost:5000/users/register', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName, email, password }),
    headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

if (data.success) {
router.push('/');
} else {
console.log(data.message || 'Error register');
}
};

return (
    <div>
    <div>
        <h1>Register</h1>

        <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        />

        <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        />

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
        onClick={handleRegister}
        >
        Register
        </button>
    </div>
    </div>
);
}
