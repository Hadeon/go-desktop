import { useState, useCallback, useRef, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import "./App.css";
import {
  OpenText,
  SaveText,
  OpenFileDialog,
  SaveFileDialog,
  SaveCurrentFile,
} from "../wailsjs/go/main/App";
import { handleHotkeys } from "./utils/keybindings";

function App() {
  const [html, setHtml] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState("");
  const [unsaved, setUnsaved] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmPromiseRef = useRef(null);
  const currentFilePathRef = useRef("");

  // Update ref whenever state changes
  const updateFilePath = (path) => {
    currentFilePathRef.current = path;
    setCurrentFilePath(path);
  };

  // showConfirmDialog returns a promise that resolves true/false
  const showConfirmDialog = useCallback((message) => {
    setConfirmMessage(message);
    setConfirmVisible(true);
    return new Promise((resolve) => {
      confirmPromiseRef.current = resolve;
    });
  }, []);

  const handleConfirmYes = useCallback(() => {
    if (confirmPromiseRef.current) confirmPromiseRef.current(true);
    setConfirmVisible(false);
  }, []);

  const handleConfirmNo = useCallback(() => {
    if (confirmPromiseRef.current) confirmPromiseRef.current(false);
    setConfirmVisible(false);
  }, []);

  // Reset state for a new file with unsaved check using showConfirmDialog
  const handleNew = useCallback(async () => {
    if (unsaved) {
      const result = await showConfirmDialog(
        "You have unsaved changes. Continue and lose changes?"
      );
      if (!result) return;
    }
    setHtml("");
    updateFilePath("");
    setUnsaved(false);
  }, [unsaved, showConfirmDialog]);

  const handleSave = useCallback(async () => {
    const editorContent = document.getElementById("editor").innerHTML;
    const currentPath = currentFilePathRef.current;
    console.log("HandleSave called with currentFilePath:", currentPath);

    try {
      if (!currentPath) {
        const filename = await SaveFileDialog();
        if (!filename) return;

        await SaveText(filename, editorContent);
        updateFilePath(filename);
      } else {
        await SaveCurrentFile(currentPath, editorContent);
      }
      console.log("Save completed to:", currentFilePathRef.current);
      setUnsaved(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving file: " + (error?.message || "Unknown error"));
    }
  }, []); // No dependencies needed as we use ref

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

  const handleOpen = async () => {
    if (unsaved) {
      const result = await showConfirmDialog(
        "You have unsaved changes. Continue and lose changes?"
      );
      if (!result) return;
    }
    console.log("Open button clicked");
    const filename = await OpenFileDialog();
    if (filename) {
      const content = await OpenText(filename);
      setHtml(content);
      updateFilePath(filename);
      setUnsaved(false);
    }
  };

  // Warn on close if unsaved changes exist
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
      <div id="navbar">
        <button className="clickable" onClick={handleNew}>
          New
        </button>
        <button className="clickable" onClick={handleOpen}>
          Open
        </button>
        <button className="clickable" onClick={handleSave}>
          Save
        </button>
        <button>{currentFilePath}</button>
      </div>
      <div id="editor-container">
        <ContentEditable
          id="editor"
          html={html}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Start writing here..."
          className="editable-content"
        />
      </div>
      {confirmVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{confirmMessage}</p>
            <button onClick={handleConfirmYes}>Yes</button>
            <button onClick={handleConfirmNo}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
