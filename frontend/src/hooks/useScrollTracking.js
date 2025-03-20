import { useState, useCallback, useRef } from "react";

export function useScrollTracking() {
  const [scrollState, setScrollState] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });

  const editorContainerRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (editorContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        editorContainerRef.current;
      setScrollState({ scrollTop, scrollHeight, clientHeight });
    }
  }, []);

  return { scrollState, handleScroll, editorContainerRef };
}
