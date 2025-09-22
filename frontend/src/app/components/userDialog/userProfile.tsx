"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

interface Props {
  userId: number;
}

export default function UserProfile({ userId }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
        setPreview(data.avatar_url || "/avatar.png");
      } catch (err) {
        console.error(err);
        showToastMessage("Error fetching user data!");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAvatar(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData();
    formData.append("name", (e.target as any).name.value);
    formData.append("email", (e.target as any).email.value);
    if (newAvatar) formData.append("avatar_url", newAvatar);

    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      setUser({
        ...user,
        name: (e.target as any).name.value,
        email: (e.target as any).email.value,
        avatar_url: preview,
      });
      setEditing(false);
      showToastMessage("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      showToastMessage("Failed to update profile!");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed || !user) return;

    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete account");
      showToastMessage("Account deleted successfully!");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      console.error(err);
      showToastMessage("Failed to delete account!");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="user-profile card p-4 mb-3 position-relative">
      {showToast && (
        <div className="toast show position-absolute top-0 end-0 m-3">
          <div className="toast-body">{toastMessage}</div>
        </div>
      )}

      <div className="d-flex align-items-center mb-3">
        <img
          src={preview || "/avatar.png"}
          alt="User Avatar"
          className="rounded-circle me-3"
          width={80}
          height={80}
        />
        <div>
          <h4>{user.name}</h4>
          <p className="mb-0">{user.email}</p>
        </div>
      </div>

      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button
          className="btn btn-outline-primary"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel Edit" : "Edit Profile"}
        </button>
        <button className="btn btn-outline-secondary">Change Password</button>
        <button className="btn btn-outline-danger" onClick={handleDelete}>
          Delete Account
        </button>
      </div>

      {editing && (
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" className="form-control mb-2" defaultValue={user.name} />
          <input type="email" name="email" className="form-control mb-2" defaultValue={user.email} />
          <label className="form-label">Change Avatar:</label>
          <input type="file" className="form-control mb-2" onChange={handleAvatarChange} />
          <button type="submit" className="btn btn-success">Save Changes</button>
        </form>
      )}
    </div>
  );
}