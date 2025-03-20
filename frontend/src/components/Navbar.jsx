import React from "react";
import { FiSettings, FiFolder, FiSave, FiFilePlus } from "react-icons/fi";

const Navbar = ({
  handleNew,
  handleOpenFile,
  handleSave,
  currentFilePath,
  statistics,
  onSettingsClick,
}) => {
  return (
    <div id="navbar">
      <button className="clickable" onClick={handleNew}>
        <FiFilePlus size={18} color="var(--text-color)" />
      </button>
      <button className="clickable" onClick={handleOpenFile}>
        <FiFolder size={18} color="var(--text-color)" />
      </button>
      <button className="clickable" onClick={handleSave}>
        <FiSave size={18} color="var(--text-color)" />
      </button>
      <button>{currentFilePath}</button>
      {/* TEMPORARY STATISTICS */}
      {/* WE WILL MOVE THIS ELSEWHERE, FOR NOW ITS HELPFUL TO SEE */}
      {/* <div>
        <span>Words: {statistics.wordCount}</span>
        <span>Headers: {statistics.headerCount}</span>
        <span>Pages: {statistics.pageCount}</span>
      </div> */}
      <button id="settings-button" onClick={onSettingsClick}>
        <FiSettings size={18} color="var(--text-color)" />
      </button>
    </div>
  );
};

export default Navbar;
