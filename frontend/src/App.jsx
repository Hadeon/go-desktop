import { useState, useCallback, useRef } from "react";
import ContentEditable from "react-contenteditable";
import "./App.css";
import {
  OpenText,
  SaveText,
  OpenFileDialog,
  SaveFileDialog,
  SaveCurrentFile,
} from "../wailsjs/go/main/App";

function App() {
  const [html, setHtml] = useState("");
  const [currentFilePath, setCurrentFilePath] = useState("");
  // Use ref to always have access to latest filepath
  const currentFilePathRef = useRef("");

  // Update ref whenever state changes
  const updateFilePath = (path) => {
    currentFilePathRef.current = path;
    setCurrentFilePath(path);
  };

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
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving file: " + (error?.message || "Unknown error"));
    }
  }, []); // No dependencies needed as we use ref

  const handleKeyDown = useCallback(
    async (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            console.log("Cmd+S pressed, current filepath:", currentFilePath);
            await handleSave();
            break;
          case "b":
            e.preventDefault();
            document.execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            document.execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            document.execCommand("underline");
            break;
          case "l":
            e.preventDefault();
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const parentElement = range.commonAncestorContainer.parentElement;
              if (parentElement.tagName === "H1") {
                document.execCommand("formatBlock", false, "p");
              } else {
                document.execCommand("formatBlock", false, "h1");
                document.execCommand("justifyCenter");
              }
            }
            break;
          case "H":
            if (e.shiftKey) {
              e.preventDefault();
              document.execCommand("insertHorizontalRule");
            }
            break;
          default:
            break;
        }
      } else {
        switch (e.key) {
          case "Tab":
            e.preventDefault();
            document.execCommand("insertText", false, "\t");
            break;
          default:
            break;
        }
      }
    },
    [handleSave]
  );

  const handleChange = (e) => {
    setHtml(e.target.value);
  };

  const handleOpen = async () => {
    console.log("Open button clicked");
    const filename = await OpenFileDialog();
    if (filename) {
      const content = await OpenText(filename);
      setHtml(content);
      updateFilePath(filename);
    }
  };

  return (
    <div id="App">
      <div id="navbar">
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
    </div>
  );
}

export default App;
