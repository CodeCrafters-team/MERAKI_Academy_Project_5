'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { updateProfile, deleteAccount } from "@/redux/slices/authSlice";

const CLOUD_NAME = "dkgru3hra";
const UPLOAD_PRESET = "project-4";

interface UserDialogProps {
  onClose: () => void;
}

export default function UserDialog({ onClose }: UserDialogProps) {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const userId = Number(auth.userId)
  console.log(auth)
  console.log(userId);
  

  const [user, setUser] = useState(auth);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (auth) setUser(auth);
  }, [auth]);

  useEffect(() => {
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal fade show';
    document.body.appendChild(backdrop);

    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);

    return () => {
      document.body.classList.remove('modal-open');
      backdrop.remove();
      window.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);

    const localUrl = URL.createObjectURL(file);
    setUser((prev) => (prev ? { ...prev, avatarUrl: localUrl } : prev));
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
      if (user.firstName != null) updatedData.firstName = user.firstName;
      if (user.lastName  != null) updatedData.lastName  = user.lastName;
      if (user.age !== undefined && user.age !== null) updatedData.age = user.age;
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      dispatch(deleteAccount());
      setConfirmOpen(false);
      onClose();
    } catch (err) {
      setError("Failed to delete account. Please try again.");
    }
  };

  if (!user) return null;

  const fullName = `${user.firstName ?? ""}${user.firstName && user.lastName ? " " : ""}${user.lastName ?? ""}`;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Main Modal */}
      <div
        className="modal fade show"
        style={{ display: 'block' }}
        role="dialog"
        aria-modal="true"
        onMouseDown={handleBackdropClick}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Profile</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center ">
                      <div className="ratio ratio-1x1 mb-3" style={{ maxWidth: 220, margin: "0 auto" }}>
                        <img
                          src={
                            user.avatarUrl ||
                            "https://thumbs.dreamstime.com/b/icono-de-perfil-avatar-predeterminado-imagen-vectorial-usuario-medios-sociales-209162840.jpg"
                          }
                          className="rounded img-fluid"
                          alt="Profile"
                          style={{ objectFit: 'cover' }}
                          onClick={() => setPreviewOpen(true)}
                        />
                      </div>

                      <div className="d-grid gap-2">
                        <label htmlFor="file-upload" className="btn btn-outline-secondary">
                          Choose Photo
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                      </div>

                      <h6 className="mt-3 mb-0 fw-bold">
                        {fullName || "User"}
                      </h6>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-8">
                  <h6 className="fw-bold mb-3">Profile information</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <input
                        id="firstName"
                        className="form-control"
                        placeholder="First Name"
                        value={user.firstName || ""}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <input
                        id="lastName"
                        className="form-control"
                        placeholder="Last Name"
                        value={user.lastName || ""}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="age" className="form-label">Age</label>
                      <input
                        id="age"
                        type="number"
                        className="form-control"
                        placeholder="Age"
                        value={user.age ?? ""}
                        onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={user.email || ""}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                      />
                    </div>

                    {message && (
                      <div className="col-12">
                        <div className="alert alert-success mb-0">{message}</div>
                      </div>
                    )}
                    {error && (
                      <div className="col-12">
                        <div className="alert alert-danger mb-0">{error}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary border-0" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Update Profile"}
              </button>
              <button className="btn btn-outline-danger " onClick={() => setConfirmOpen(true)}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {previewOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPreviewOpen(false);
          }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">Avatar Preview</h6>
                  <button className="btn-close" onClick={() => setPreviewOpen(false)} />
                </div>
                <div className="modal-body text-center">
                  <img
                    src={user.avatarUrl || "/default-avatar.png"}
                    className="img-fluid rounded"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                    alt="Avatar Preview"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}

      {confirmOpen && (
        <>
          <div className="modal fade show" style={{ display: 'block' }} onMouseDown={(e) => {
            if (e.target === e.currentTarget) setConfirmOpen(false);
          }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title">Confirm Delete</h6>
                  <button className="btn-close" onClick={() => setConfirmOpen(false)} />
                </div>
                <div className="modal-body">
                  Are you sure you want to delete your account? This action cannot be undone.
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete}>
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </>
  );
}
