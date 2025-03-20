import React from "react";

const SettingsModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ minWidth: "300px" }}>
        <h2 style={{ marginBottom: "1rem" }}>Settings</h2>
        <p>Coming soon: Theme selection, preferences, etc.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SettingsModal;
