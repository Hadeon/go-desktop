import { useCallback, useEffect, useState } from "react";
import ContentEditable from "react-contenteditable";
import "./App.css";
import { handleHotkeys } from "./utils/keybindings";
import { useFileOperations } from "./hooks/useFileOperations";
import { useConfirm } from "./hooks/useConfirm";
import { useEditorState } from "./hooks/useEditorState";
import { useScrollTracking } from "./hooks/useScrollTracking";
import { useTheme } from "./hooks/useTheme";
import ScrollArea from "./components/scroll-area";
import Navbar from "./components/Navbar";
import SettingsModal from "./components/settings-modal";

function App() {
  const { html, setHtml, statistics, updateStatistics } = useEditorState();
  const { scrollState, handleScroll, editorContainerRef } = useScrollTracking();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toggleSettings = () => setSettingsOpen((prev) => !prev);
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

  const { theme, applyTheme } = useTheme();
  //   applyTheme("oneDark");

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
      updateStatistics(content);
    }
  }, [unsaved, showConfirm, handleOpen]);

  const handleKeyDown = useCallback(
    async (e) => {
      await handleHotkeys(
        e,
        currentFilePath,
        handleSave,
        setHtml,
        updateStatistics,
        statistics
      );
    },
    [handleSave, currentFilePath]
  );

  const handleChange = (e) => {
    setHtml(e.target.value);
    setUnsaved(true);
    updateStatistics(e.target.value);
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
    applyTheme(theme);
  }, [theme]);

  return (
    <div id="App">
      <Navbar
        handleNew={handleNew}
        handleOpenFile={handleOpenFile}
        handleSave={handleSave}
        currentFilePath={currentFilePath}
        statistics={statistics}
        onSettingsClick={toggleSettings}
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
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

export default App;
