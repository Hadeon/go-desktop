import { useCallback, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import "./App.css";
import { handleHotkeys } from "./utils/keybindings";
import { useFileOperations } from "./hooks/useFileOperations";
import { useConfirm } from "./hooks/useConfirm";
import { useEditorState } from "./hooks/useEditorState";
import { useHeaders } from "./hooks/useHeaders";
import { useScrollTracking } from "./hooks/useScrollTracking";
import ScrollArea from "./components/scroll-area";
import Navbar from "./components/Navbar";

function App() {
  // HOOKS
  const { html, setHtml, statistics, updateStatistics } = useEditorState();
  const { headers, updateHeaders } = useHeaders();
  const { scrollState, handleScroll, editorContainerRef } = useScrollTracking();
  const { confirmMessage, confirmVisible, showConfirm, confirmYes, confirmNo } =
    useConfirm();
  const {
    currentFilePath,
    unsaved,
    setUnsaved,
    handleSave,
    handleOpen,
    updateFilePath,
  } = useFileOperations();

  // NEW FILE HANDLER
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

  // OPEN FILE HANDLER
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
      updateStatistics(content);
    }
  }, [unsaved, showConfirm, handleOpen]);

  // HOTKEY HANDLING
  const handleKeyDown = useCallback(
    async (e) => {
      await handleHotkeys(
        e,
        currentFilePath,
        handleSave,
        updateHeaders,
        setHtml
      );
    },
    [handleSave, currentFilePath]
  );

  // CONTENT CHANGE HANDLER
  const handleChange = (e) => {
    setHtml(e.target.value);
    setUnsaved(true);
    updateStatistics(e.target.value);
  };

  // WINDOW CLOSE HANDLING
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

  return (
    <div id="App">
      <Navbar
        handleNew={handleNew}
        handleOpenFile={handleOpenFile}
        handleSave={handleSave}
        currentFilePath={currentFilePath}
        statistics={statistics}
      />
      <div
        id="editor-wrapper"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          id="editor-container"
          ref={editorContainerRef}
          style={{ flex: 1, overflowY: "auto" }}
        >
          <ContentEditable
            id="editor"
            html={html}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            placeholder="Start writing here..."
            className="editable-content"
          />
        </div>
        <ScrollArea
          scrollTop={scrollState.scrollTop}
          scrollHeight={scrollState.scrollHeight}
          clientHeight={scrollState.clientHeight}
          statistics={statistics}
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
