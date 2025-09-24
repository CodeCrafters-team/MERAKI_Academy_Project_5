'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { updateProfile } from "@/redux/slices/authSlice";
import "./userDialog.css"; 


const CLOUD_NAME = "dkgru3hra";
const UPLOAD_PRESET = "project-4";

interface UserDialogProps {
  onClose: () => void;
}

export default function UserDialog({ onClose }: UserDialogProps) {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const userId = auth.userId;

  const [user, setUser] = useState(auth);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (auth) setUser(auth);
  }, [auth]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);

    const localUrl = URL.createObjectURL(file);
    setUser(prev => prev ? { ...prev, avatarUrl: localUrl } : prev);
  };

  const handleSave = async () => {
    if (!user) return;
    if (!userId) {
      setError("User ID is missing!");
      return;
    }

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

      const updatedData: any = {};
      if (user.firstName) updatedData.firstName = user.firstName;
      if (user.lastName) updatedData.lastName = user.lastName;
      if (user.age !== undefined) updatedData.age = user.age;
      if (user.email) updatedData.email = user.email;
      if (avatarUrl) updatedData.avatarUrl = avatarUrl;

      await axios.put(
        `http://localhost:5000/users/${userId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      dispatch(updateProfile(updatedData));
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-modal " >
      <div className="profile-container">
        <div className="profile-photo-section">
          <div className="profile-photo-wrapper">
            <img
              src={user.avatarUrl || "/default-avatar.png"}
              className="profile-photo"
              alt="Avatar"
              onClick={() => setPreviewOpen(true)}
            />
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload" className="upload-label">
              Choose Photo
            </label>
          </div>
        </div>

        <div className="profile-info-section">
          <h2 className="profile-title">My Profile</h2>
          <div className="form-inputs-container">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                className="form-input"
                placeholder="First Name"
                value={user.firstName || ""}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                className="form-input"
                placeholder="Last Name"
                value={user.lastName || ""}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                className="form-input"
                placeholder="Age"
                value={user.age || ""}
                onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-update-profile"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
          {message && <div className="message success">{message}</div>}
          {error && <div className="message error">{error}</div>}
        </div>
      </div>
      {previewOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75 d-flex justify-content-center align-items-center"
          style={{ zIndex: 1055 }}
          onClick={() => setPreviewOpen(false)}
        >
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            className="rounded"
            style={{ maxWidth: "90%", maxHeight: "90%" }}
            alt="Avatar Preview"
          />
        </div>
      )}
    </div>
  );
}