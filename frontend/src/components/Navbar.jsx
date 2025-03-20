import React from "react";

const Navbar = ({ handleNew, handleOpenFile, handleSave, currentFilePath }) => {
  return (
    <div id="navbar">
      <button className="clickable" onClick={handleNew}>
        New
      </button>
      <button className="clickable" onClick={handleOpenFile}>
        Open
      </button>
      <button className="clickable" onClick={handleSave}>
        Save
      </button>
      <button>{currentFilePath}</button>
      {/* TEMPORARY STATISTICS */}
      {/* WE WILL MOVE THIS ELSEWHERE, FOR NOW ITS HELPFUL TO SEE */}
      {/* <div>
        <span>Words: {statistics.wordCount}</span>
        <span>Headers: {statistics.headerCount}</span>
        <span>Pages: {statistics.pageCount}</span>
      </div> */}
    </div>
  );
};

export default Navbar;
