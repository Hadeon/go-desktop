import { useState } from "react";
import { CalculateStatistics } from "../../wailsjs/go/main/App";

export function useEditorState() {
  const [html, setHtml] = useState("");
  const [statistics, setStatistics] = useState({
    wordCount: 0,
    headerCount: 0,
    pageCount: 0,
    headerPositions: [],
  });

  const updateStatistics = async (text) => {
    const stats = await CalculateStatistics(text);
    setStatistics(stats);
  };

  return { html, setHtml, statistics, setStatistics, updateStatistics };
}
