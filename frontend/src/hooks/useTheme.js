import { useState, useEffect } from "react";
import { themes } from "../theme-config";

export function useTheme() {
  // Load theme from localStorage or default to One Dark
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "oneDark"
  );

  // Function to apply theme
  const applyTheme = (themeKey) => {
    const themeVariables = themes[themeKey] || themes.oneDark;

    Object.keys(themeVariables).forEach((key) => {
      document.documentElement.style.setProperty(key, themeVariables[key]);
    });

    localStorage.setItem("theme", themeKey);
    setTheme(themeKey);
  };

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  return { theme, applyTheme };
}
