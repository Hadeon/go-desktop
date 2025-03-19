import React, { useEffect, useState } from "react";
import "./scroll-area.css";
import HeaderNode from "./header-node";

const ScrollArea = ({ scrollTop, scrollHeight, clientHeight, statistics }) => {
  const [pageTicks, setPageTicks] = useState([]);

  useEffect(() => {
    const ticks = Array.from({ length: statistics.pageCount }, (_, index) => ({
      id: `page-${index + 1}`,
      page: index + 1,
    }));
    setPageTicks(ticks);
  }, [statistics.pageCount]);

  const handleScrollToPage = (page) => {
    const editor = document.getElementById("editor");
    if (editor) {
      const pageHeight = scrollHeight / statistics.pageCount;
      editor.scrollTo({
        top: pageHeight * (page - 1),
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
      {pageTicks.map((tick) => (
        <div
          key={tick.id}
          className="page-tick"
          onClick={() => handleScrollToPage(tick.page)}
        >
          {tick.page}
        </div>
      ))}
    </div>
  );
};

export default ScrollArea;
