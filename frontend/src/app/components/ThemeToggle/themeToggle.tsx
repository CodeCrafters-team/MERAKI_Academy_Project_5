"use client";

import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode, setDarkMode } from "../../../redux/slices/themeSlice";
import type { RootState, AppDispatch } from "../../../redux/store";
import { useEffect } from "react";
import "./themeToggle.css";

function ThemeToggle() {
  const dispatch = useDispatch<AppDispatch>();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      dispatch(setDarkMode(true));
    } else {
      dispatch(setDarkMode(false));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    if (darkMode) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <button
      className={`theme-btn ${darkMode ? "dark" : "light"}`}
      onClick={() => dispatch(toggleDarkMode())}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <i className={`bi ${darkMode ? "bi-moon-fill" : "bi-sun-fill"}`}></i>
    </button>
  );
}

export default ThemeToggle;