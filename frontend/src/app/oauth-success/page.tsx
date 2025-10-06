"use client";
import { useEffect } from "react";
import { loginSuccess } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";



const OAuthSuccess =()=> {
  
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
const token = p.get("token");
const userId = p.get("userId");
const avatar = p.get("avatar");
const email = p.get("email");
const firstName = p.get("firstName");
const lastName = p.get("lastName");
const roleName = p.get("roleName");
const phoneNumber = p.get("phoneNumber");
const country = p.get("country");

if (token) localStorage.setItem("token", token);
if (userId) localStorage.setItem("userId", userId);
if (avatar) localStorage.setItem("avatar", avatar);
if (email) localStorage.setItem("email", email);
if (firstName) localStorage.setItem("firstName", firstName);
if (lastName) localStorage.setItem("lastName", lastName);
if (roleName) localStorage.setItem("roleName", roleName);
if (phoneNumber) localStorage.setItem("phoneNumber", (phoneNumber));
if (country) localStorage.setItem("country", country);

    window.location.replace("/");
  }, []);

  return <></>;
}

export default OAuthSuccess