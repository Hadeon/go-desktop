import { useState } from "react";
import ContentEditable from "react-contenteditable";
import "./App.css";
import {
  OpenText,
  SaveText,
  OpenFileDialog,
  SaveFileDialog,
} from "../wailsjs/go/main/App";

function App() {
  const [html, setHtml] = useState("");

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
    }
  };

  const handleSave = async () => {
    console.log("Save button clicked");
    const filename = await SaveFileDialog();
    if (filename) {
      await SaveText(filename, html);
      alert("File saved successfully!");
    }
  };

  const handleOpen = async () => {
    console.log("Open button clicked");
    const filename = await OpenFileDialog();
    if (filename) {
      const content = await OpenText(filename);
      setHtml(content);
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
        <button className="clickable">Options</button>
      </div>
      <ContentEditable
        id="editor"
        html={html}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start writing here..."
      />
    </div>
  );
}

export default App;
