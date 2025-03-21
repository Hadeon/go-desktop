import React from "react";
import { useTheme } from "../hooks/useTheme";
import { themes } from "../theme-config";

const SettingsModal = ({ onClose }) => {
  const { theme, applyTheme } = useTheme();

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ minWidth: "300px" }}>
        <h2 style={{ marginBottom: "1rem" }}>Settings</h2>
        <label
          htmlFor="theme-selector"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          Select Theme:
        </label>
        <select
          id="theme-selector"
          value={theme}
          onChange={(e) => applyTheme(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #000000",
            color: "#000000",
            fontSize: "1rem",
          }}
        >
          {Object.keys(themes).map((themeKey) => (
            <option key={themeKey} value={themeKey}>
              {themeKey}
            </option>
          ))}
        </select>

        <button onClick={onClose} style={{ marginTop: "1rem" }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
