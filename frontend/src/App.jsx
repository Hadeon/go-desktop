import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { handleHotkeys } from "./utils/keybindings";
import { useFileOperations } from "./hooks/useFileOperations";
import { useConfirm } from "./hooks/useConfirm";
import { useEditorState } from "./hooks/useEditorState";
import { useScrollTracking } from "./hooks/useScrollTracking";
import { useTheme } from "./hooks/useTheme";
import ScrollArea from "./components/scroll-area";
import Navbar from "./components/nav-bar";
import SettingsModal from "./components/settings-modal";
import Editor from "./components/editor";

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
    handleSaveAs,
    handleOpen,
    updateFilePath,
  } = useFileOperations();

  const { theme, applyTheme } = useTheme();

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
  }, [unsaved, showConfirm, handleOpen, updateStatistics]);

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
    [handleSave, currentFilePath, setHtml, updateStatistics, statistics]
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
  }, [theme, applyTheme]);

  return (
    <div id="App">
      <Navbar
        handleNew={handleNew}
        handleOpenFile={handleOpenFile}
        handleSave={handleSave}
        handleSaveAs={handleSaveAs}
        currentFilePath={currentFilePath}
        statistics={statistics}
        onSettingsClick={toggleSettings}
      />
      <div
        id="editor-wrapper"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <Editor
          html={html}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          editorContainerRef={editorContainerRef}
        />
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
