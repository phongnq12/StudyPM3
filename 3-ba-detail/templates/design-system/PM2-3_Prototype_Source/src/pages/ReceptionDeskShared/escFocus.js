/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Escape closes the popup and returns focus to its opener, like the HTML version */
import { useEffect, useRef } from 'react';

export function useEscapeRestoreFocus(isOpen, close) {
  const opener = useRef(null);
  const openRef = useRef(isOpen); openRef.current = isOpen;
  const closeRef = useRef(close); closeRef.current = close;
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape' || !openRef.current) return;
      const button = opener.current;
      closeRef.current();
      setTimeout(() => { if (button && button.isConnected && document.activeElement === document.body) button.focus({ preventScroll: true }); }, 30);
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, []);
  return () => { opener.current = document.activeElement; };
}
