import React from "react";
import {
  FiSettings,
  FiFolder,
  FiSave,
  FiFilePlus,
  FiCopy,
} from "react-icons/fi";

const Navbar = ({
  handleNew,
  handleOpenFile,
  handleSave,
  handleSaveAs,
  currentFilePath,
  statistics,
  onSettingsClick,
}) => {
  return (
    <div id="navbar">
      <button className="clickable" onClick={handleNew}>
        <FiFilePlus size={18} color="var(--button-background-color)" />
      </button>
      <button className="clickable" onClick={handleOpenFile}>
        <FiFolder size={18} color="var(--button-background-color)" />
      </button>
      <button className="clickable" onClick={handleSave}>
        <FiSave size={18} color="var(--button-background-color)" />
      </button>
      <button className="clickable" onClick={handleSaveAs}>
        <FiCopy size={18} color="var(--button-background-color)" />
      </button>
      <text
        style={{ marginLeft: "2rem", userSelect: "none", cursor: "default" }}
      >
        {currentFilePath}
      </text>
      {/* TEMPORARY STATISTICS */}
      {/* WE WILL MOVE THIS ELSEWHERE, FOR NOW ITS HELPFUL TO SEE */}
      {/* <div>
        <span>Words: {statistics.wordCount}</span>
        <span>Headers: {statistics.headerCount}</span>
        <span>Pages: {statistics.pageCount}</span>
      </div> */}
      <button id="settings-button" onClick={onSettingsClick}>
        <FiSettings size={18} color="var(--button-background-color)" />
      </button>
    </div>
  );
};

export default Navbar;
