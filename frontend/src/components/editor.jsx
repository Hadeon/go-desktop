import React from "react";
import ContentEditable from "react-contenteditable";

const Editor = ({
  html,
  onChange,
  onKeyDown,
  onScroll,
  editorContainerRef,
}) => {
  return (
    <div
      id="editor-container"
      ref={editorContainerRef}
      style={{ flex: 1, overflowY: "auto" }}
    >
      <ContentEditable
        id="editor"
        html={html}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        placeholder="Start writing here..."
        className="editable-content"
      />
    </div>
  );
};

export default Editor;
