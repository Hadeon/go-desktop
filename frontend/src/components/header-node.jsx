import React, { useState } from "react";
import "./header-node.css";

const HeaderNode = ({ text, onClick, style, headerText }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="header-node"
      onClick={onClick}
      style={{ ...style, cursor: "pointer", position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="header-node-circle">{text}</div>

      {isHovered && (
        <div className="tooltip">{headerText || "Untitled Chapter"}</div>
      )}
    </div>
  );
};

export default HeaderNode;
