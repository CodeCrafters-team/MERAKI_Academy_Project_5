"use client";

import { useState } from "react";
import UserDialog from "../components/userDialog/userDialog"; // عدّل المسار حسب مكان الملف

export default function Page() {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="container py-5">
      <button
        className="btn btn-primary"
        onClick={() => setShowProfileModal(true)}
      >
        Open Profile Modal
      </button>

      {showProfileModal && (
        <UserDialog onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}
