import React from "react";
import "./scroll-area.css"; // Create this stylesheet for style overrides

const ScrollArea = ({ scrollTop, scrollHeight, clientHeight }) => {
  // Calculate scroll percent (0-100)
  const maxScroll = scrollHeight - clientHeight;
  const scrollPercent = maxScroll ? (scrollTop / maxScroll) * 100 : 0;

  return (
    <div className="scroll-area-container">
      <div
        className="scroll-indicator"
        style={{ height: `${scrollPercent}%` }}
      ></div>
      {/* Future expansion: header markers, ticks, and click handlers to jump to headers */}
    </div>
  );
};

export default ScrollArea;
