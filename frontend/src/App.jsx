import { useState } from "react";
import ContentEditable from "react-contenteditable";
import "./App.css";

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
        default:
          break;
      }
    }
  };

  return (
    <div id="App">
      <div id="navbar">
        <span>File</span>
        <span>Save</span>
        <span>Options</span>
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
