"use client";
import { useEffect } from "react";

const OAuthSuccess =()=> {
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const token = p.get("token");
    console.log(token);
    const userId = p.get("userId");
    console.log(userId)
    const avatar = p.get("avatar");
    console.log(token, userId, avatar);

    if (token) {
      localStorage.setItem("token", token);
      if (userId) localStorage.setItem("userId", userId);
      if (avatar) localStorage.setItem("avatar", avatar);
    }

    window.location.replace("/");
  }, []);

  return <></>;
}

export default OAuthSuccess