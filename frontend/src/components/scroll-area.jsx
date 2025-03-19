import React, { useEffect, useState } from "react";
import "./scroll-area.css";
import HeaderNode from "./header-node";

const ScrollArea = ({ scrollTop, scrollHeight, clientHeight, headers }) => {
  const [headerPositions, setHeaderPositions] = useState([]);

  useEffect(() => {
    setHeaderPositions(headers);
  }, [headers]);

  const handleScrollToHeader = (top) => {
    const editor = document.getElementById("editor");
    if (editor) {
      editor.scrollTo({
        top: top,
        behavior: "smooth",
      });
    }
  };

  const maxScroll = scrollHeight - clientHeight;
  const scrollPercent = maxScroll ? (scrollTop / maxScroll) * 100 : 0;

  return (
    <div className="scroll-area-container">
      <div
        className="scroll-indicator"
        style={{ height: `${scrollPercent}%` }}
      ></div>
      {headerPositions.map((header, index) => (
        <HeaderNode
          key={header.id}
          top={header.top}
          onClick={() => handleScrollToHeader(header.top)}
          style={{ marginTop: index === 0 ? 0 : "10px" }}
        />
      ))}
    </div>
  );
};

export default ScrollArea;
