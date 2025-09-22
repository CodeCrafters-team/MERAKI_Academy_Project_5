"use client";

import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode, setDarkMode } from "../../../redux/slices/themeSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import { useEffect } from "react";
import "./themeToggle.css";

export default function ThemeToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") dispatch(setDarkMode(true));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      className={`theme-btn ${darkMode ? "dark" : "light"}`}
      onClick={() => dispatch(toggleDarkMode())}
    >
      <i className={`bi ${darkMode ? "bi-moon-fill" : "bi-sun-fill"}`}></i>
    </button>
  );
}
  ;
