export const handleHotkeys = async (
  e,
  currentFilePath,
  handleSave,
  updateHeaders
) => {
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
        {
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
            updateHeaders();
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
