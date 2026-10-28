/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* joinText(...) — join content, MERGING adjacent strings into ONE text node exactly like the HTML version concatenates strings.
 * Two adjacent text nodes lay out sub-pixel differently from one node (measured 34–40 px diff on the quota note of the Detail screen). */
import { cloneElement } from 'react';

export function joinText(...parts) {
  const out = [];
  parts.flat(Infinity).forEach((p) => {
    if (p == null || p === false || p === '') return;
    if ((typeof p === 'string' || typeof p === 'number') && (typeof out[out.length - 1] === 'string')) out[out.length - 1] += String(p);
    else out.push(typeof p === 'number' ? String(p) : p);
  });
  return out.map((p, i) => (typeof p === 'string' ? p : cloneElement(p, { key: i })));
}
