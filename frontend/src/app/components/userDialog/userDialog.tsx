"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import UserProfile from "./userProfile";

export default function UserDialog() {
  const [open, setOpen] = useState(false);

  const { userId, avatarUrl } = useSelector((state: RootState) => state.auth);

  if (!userId || !avatarUrl) return null;

  return (
    <>
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="rounded-circle"
        width={50}
        height={50}
        style={{ cursor: "pointer" }}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div className="dialog-overlay" onClick={() => setOpen(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-close float-end"
              aria-label="Close"
              onClick={() => setOpen(false)}
            ></button>
            <UserProfile userId={userId} />
          </div>
        </div>
      )}
    </>
  );
}

//import UserDialog from "../userDialog/userDialog";
/* <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <a className="navbar-brand" href="#">My Profile</a>

      <div className="ms-auto d-flex align-items-center">
        <UserDialog />
      </div>
    </nav> */