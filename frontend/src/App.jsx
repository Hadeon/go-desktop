import { useState } from "react";
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

  const handleChange = (e) => {
    setHtml(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
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
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    let filename = currentFilePath;
    if (!filename) {
      filename = await SaveFileDialog();
      if (filename) {
        setCurrentFilePath(filename);
      }
    }
    if (filename) {
      try {
        if (currentFilePath) {
          await SaveCurrentFile(filename, html);
        } else {
          await SaveText(filename, html);
        }
        alert("File saved successfully!");
      } catch (error) {
        console.error("Error saving file:", error);
        alert("Error saving file!");
      }
    }
  };

  const handleOpen = async () => {
    console.log("Open button clicked");
    const filename = await OpenFileDialog();
    if (filename) {
      const content = await OpenText(filename);
      setHtml(content);
      setCurrentFilePath(filename);
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
        />
      </div>
    </div>
  );
}

export default App;
