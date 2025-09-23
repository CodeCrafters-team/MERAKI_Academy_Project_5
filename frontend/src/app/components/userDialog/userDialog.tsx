'use client';

import { useEffect, useState } from "react";
import axios from "axios";

interface UserDialogProps {
  userId: string;
  avatar: string;
  onClose: () => void;
}

interface User {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  avatarUrl: string;
}

const CLOUD_NAME = "dkgru3hra";
const UPLOAD_PRESET = "project-4";

export default function UserDialog({ userId, avatar, onClose }: UserDialogProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`http://localhost:5000/users/${userId}`)
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user data.");
        setLoading(false);
      });
  }, [userId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);

    const localUrl = URL.createObjectURL(file);
    setUser(prev => prev ? { ...prev, avatarUrl: localUrl } : prev);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      let avatarUrl = user.avatarUrl;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );
        avatarUrl = res.data.secure_url;
      }

      await axios.put(`http://localhost:5000/users/${userId}`, {
        ...user,
        avatarUrl
      });

      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      await axios.delete(`http://localhost:5000/users/${userId}`);
      setMessage("Account deleted successfully!");
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error("Failed to delete account:", err);
      setError("Failed to delete account. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>×</button>
        <h2 className="text-xl font-bold mb-4">Profile</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-center">
            <img
              src={user.avatarUrl || "/default-avatar.png"}
              className="w-24 h-24 rounded-full mb-2 object-cover"
              alt="Avatar"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <input
            className="border p-2 rounded"
            placeholder="First Name"
            value={user.firstName}
            onChange={e => setUser({ ...user, firstName: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Last Name"
            value={user.lastName}
            onChange={e => setUser({ ...user, lastName: e.target.value })}
          />
          <input
            type="number"
            className="border p-2 rounded"
            placeholder="Age"
            value={user.age}
            onChange={e => setUser({ ...user, age: Number(e.target.value) })}
          />
          <input
            type="email"
            className="border p-2 rounded"
            placeholder="Email"
            value={user.email}
            onChange={e => setUser({ ...user, email: e.target.value })}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-500 text-black py-2 rounded mt-2" 
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>

          <button
            onClick={handleDelete}
            disabled={saving}
            className="bg-red-500 text-black py-2 rounded mt-2" 
          >
            {saving ?  "Processing..." : "Delete Account"}
          </button>

          {message && <div className="text-green-600 mt-2">{message}</div>}
          {error && <div className="text-red-600 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}
