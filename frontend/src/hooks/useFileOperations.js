import { useState, useRef, useCallback } from "react";
import {
  OpenText,
  SaveText,
  OpenFileDialog,
  SaveFileDialog,
  SaveCurrentFile,
  SaveAs,
} from "../../wailsjs/go/main/App";

export function useFileOperations() {
  const [currentFilePath, setCurrentFilePath] = useState("");
  const [unsaved, setUnsaved] = useState(false);
  const currentFilePathRef = useRef("");

  const updateFilePath = useCallback((path) => {
    currentFilePathRef.current = path;
    setCurrentFilePath(path);
  }, []);

  const handleSave = useCallback(async () => {
    const editorContent = document.getElementById("editor").innerHTML;
    try {
      if (!currentFilePathRef.current) {
        const filename = await SaveFileDialog();
        if (!filename) return;
        await SaveText(filename, editorContent);
        updateFilePath(filename);
      } else {
        await SaveCurrentFile(currentFilePathRef.current, editorContent);
      }
      setUnsaved(false);
    } catch (error) {
      alert("Error saving file: " + (error?.message || "Unknown error"));
    }
  }, [updateFilePath]);

  const handleSaveAs = useCallback(async () => {
    const editorContent = document.getElementById("editor").innerHTML;
    try {
      const newFilename = await SaveAs(editorContent);
      if (newFilename) {
        updateFilePath(newFilename);
        setUnsaved(false);
      }
    } catch (error) {
      alert("Error saving file as: " + (error?.message || "Unknown error"));
    }
  }, [updateFilePath]);

  const handleOpen = useCallback(async () => {
    const filename = await OpenFileDialog();
    if (filename) {
      const content = await OpenText(filename);
      updateFilePath(filename);
      setUnsaved(false);
      return content;
    }
    return null;
  }, [updateFilePath]);

  return {
    currentFilePath,
    unsaved,
    setUnsaved,
    handleSave,
    handleOpen,
    handleSaveAs,
    updateFilePath,
    currentFilePathRef,
  };
}
