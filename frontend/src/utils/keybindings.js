// Function to generate a unique random ID
const generateUniqueHeaderId = (existingIds) => {
  let newId;
  do {
    newId = `header-${Math.random().toString(36).substr(2, 9)}`;
  } while (existingIds.has(newId));
  return newId;
};

export const handleHotkeys = async (
  e,
  currentFilePath,
  handleSave,
  setHtml,
  updateStatistics,
  statistics
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

          // Use statistics to check for existing header IDs
          const existingIds = new Set(
            statistics.headerPositions.map((h) => h.id)
          );

          headers.forEach((header) => {
            if (!header.id) {
              const headerId = generateUniqueHeaderId(existingIds);
              header.id = headerId;
              console.log("✅ Assigned Unique ID:", headerId);
              existingIds.add(headerId);
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
