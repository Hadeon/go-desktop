import { useState, useCallback, useRef, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import "./App.css";
import { handleHotkeys } from "./utils/keybindings";
import { useFileOperations } from "./hooks/useFileOperations";
import { useConfirm } from "./hooks/useConfirm";
import ScrollArea from "./components/scroll-area";

function App() {
  const [html, setHtml] = useState("");
  const [headers, setHeaders] = useState([]);
  const {
    currentFilePath,
    unsaved,
    setUnsaved,
    handleSave,
    handleOpen,
    updateFilePath,
  } = useFileOperations();
  const { confirmMessage, confirmVisible, showConfirm, confirmYes, confirmNo } =
    useConfirm();

  const [scrollState, setScrollState] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });
  const editorContainerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (editorContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        editorContainerRef.current;
      setScrollState({ scrollTop, scrollHeight, clientHeight });
    }
  }, []);

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
      console.log("Header positions:", headerPositions);
      setHeaders(headerPositions);
    }
  };

  const handleNew = useCallback(async () => {
    if (unsaved) {
      const result = await showConfirm(
        "You have unsaved changes. Continue and lose changes?"
      );
      if (!result) return;
    }
    setHtml("");
    updateFilePath("");
    setUnsaved(false);
  }, [unsaved, showConfirm, setUnsaved, updateFilePath]);

  const handleOpenFile = useCallback(async () => {
    if (unsaved) {
      const result = await showConfirm(
        "You have unsaved changes. Continue and lose changes?"
      );
      if (!result) return;
    }
    const content = await handleOpen();
    if (content !== null) {
      setHtml(content);
      updateHeaders();
    }
  }, [unsaved, showConfirm, handleOpen]);

  const handleKeyDown = useCallback(
    async (e) => {
      await handleHotkeys(e, currentFilePath, handleSave);
    },
    [handleSave, currentFilePath]
  );

  const handleChange = (e) => {
    setHtml(e.target.value);
    setUnsaved(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsaved]);

  useEffect(() => {
    updateHeaders();
  }, [html]);

  useEffect(() => {
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
      console.log("Detected headers on startup:", headerPositions);
      setHeaders(headerPositions);
    }
  }, []);

  return (
    <div id="App">
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
      </div>
      <div
        id="editor-wrapper"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          id="editor-container"
          ref={editorContainerRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: "auto" }}
        >
          <ContentEditable
            id="editor"
            html={html}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start writing here..."
            className="editable-content"
          />
        </div>
        <ScrollArea
          scrollTop={scrollState.scrollTop}
          scrollHeight={scrollState.scrollHeight}
          clientHeight={scrollState.clientHeight}
          headers={headers}
        />
      </div>
      {confirmVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{confirmMessage}</p>
            <button onClick={confirmYes}>Yes</button>
            <button onClick={confirmNo}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
