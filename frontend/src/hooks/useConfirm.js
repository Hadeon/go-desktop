import { useState, useCallback, useRef } from "react";

export function useConfirm() {
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const confirmPromiseRef = useRef(null);

  const showConfirm = useCallback((message) => {
    setConfirmMessage(message);
    setConfirmVisible(true);
    return new Promise((resolve) => {
      confirmPromiseRef.current = resolve;
    });
  }, []);

  const confirmYes = useCallback(() => {
    if (confirmPromiseRef.current) confirmPromiseRef.current(true);
    setConfirmVisible(false);
  }, []);

  const confirmNo = useCallback(() => {
    if (confirmPromiseRef.current) confirmPromiseRef.current(false);
    setConfirmVisible(false);
  }, []);

  return { confirmMessage, confirmVisible, showConfirm, confirmYes, confirmNo };
}
