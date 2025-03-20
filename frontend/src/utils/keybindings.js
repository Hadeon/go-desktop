let headerCount = 0; // Track assigned header IDs

export const handleHotkeys = async (
  e,
  currentFilePath,
  handleSave,
  setHtml,
  updateStatistics
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
      case "l": {
        e.preventDefault();
        document.execCommand("formatBlock", false, "h1");

        setTimeout(() => {
          const editor = document.getElementById("editor");
          if (!editor) return;

          let newHtml = editor.innerHTML;
          const headers = editor.querySelectorAll("h1, h2, h3, h4, h5, h6");

          headers.forEach((header) => {
            if (!header.id) {
              const headerId = `header-${headerCount++}`;
              header.id = headerId;
              console.log("✅ Assigned ID to new header:", headerId);
            }
          });

          setHtml(newHtml);
          updateStatistics(newHtml);
        }, 10);
        break;
      }
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
