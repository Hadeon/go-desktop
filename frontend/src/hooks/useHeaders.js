import { useState } from "react";

export function useHeaders() {
  const [headers, setHeaders] = useState([]);

  const updateHeaders = () => {
    const editor = document.getElementById("editor");
    if (editor) {
      const headerElements = editor.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const editorContainer = document.getElementById("editor-container");

      const headerPositions = Array.from(headerElements).map(
        (header, index) => {
          if (!header.id) {
            header.id = `header-${index}`;
          }
          const rect = header.getBoundingClientRect();
          const containerRect = editorContainer.getBoundingClientRect();
          return {
            id: header.id,
            top: rect.top - containerRect.top + editorContainer.scrollTop,
          };
        }
      );

      setHeaders(headerPositions);
    }
  };

  return { headers, updateHeaders };
}
