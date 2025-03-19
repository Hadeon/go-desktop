import React, { useEffect, useState } from "react";
import "./scroll-area.css";
import HeaderNode from "./header-node";

const ScrollArea = ({
  scrollTop,
  scrollHeight,
  clientHeight,
  headers,
  statistics,
}) => {
  const [pageTicks, setPageTicks] = useState([]);

  useEffect(() => {
    // Create an array of pages with either headers or ticks
    const ticks = Array.from({ length: statistics.pageCount }, (_, index) => ({
      id: `page-${index + 1}`,
      page: index + 1,
      headers: [],
    }));

    // Assign headers to their respective pages (from Go)
    headers.forEach((header) => {
      const pageIndex = header.page - 1; // Convert 1-based to 0-based index
      if (ticks[pageIndex]) {
        ticks[pageIndex].headers.push(header);
      }
    });

    setPageTicks(ticks);
  }, [statistics.pageCount, headers]);

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

      {pageTicks.map((tick) => (
        <div key={tick.id} className="page-tick-container">
          {tick.headers.length > 0 ? (
            tick.headers.map((header) => (
              <HeaderNode
                key={header.id}
                text={header.page}
                onClick={() => handleScrollToHeader(header.top)}
                style={{ marginTop: "10px" }}
              />
            ))
          ) : (
            <div
              className="page-tick"
              onClick={() => handleScrollToPage(tick.page)}
            >
              {tick.page}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScrollArea;
