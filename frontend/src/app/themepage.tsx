"use client";
import 'bootstrap-icons/font/bootstrap-icons.css'
import ThemeToggle from "./components/ThemeToggle/themeToggle";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

export default function Home() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <div className="container py-5">
        <ThemeToggle />
       
        <button className="btn btn-primary"></button>
      </div>
    </div>
  );
}