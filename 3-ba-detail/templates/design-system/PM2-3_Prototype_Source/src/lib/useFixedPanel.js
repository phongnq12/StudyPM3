/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Bảng chọn mở kiểu position:fixed — khung cha có overflow (bảng, thẻ, panel, khung ví dụ) không cắt được bảng.
 * Cách đặt giống visitDatePicker.js: nằm dưới ô cách 6px, tràn phải thì dịch vào, sát đáy màn mà phía trên đủ chỗ thì lật lên trên ô.
 * Đặt xong đo lại vị trí thật rồi bù lệch — tổ tiên có transform (ngăn kéo AppDrawer) làm fixed tính theo tổ tiên đó chứ không theo màn.
 * Bảng vẫn nằm trong DOM của component nên luật bấm ra ngoài thì đóng không đổi. Tên tiếng Anh (luật). */
import { useLayoutEffect, useRef } from 'react';

const GAP = 6, EDGE = 8;

export default function useFixedPanel(open, anchorRef, align = 'left') {
  const panelRef = useRef(null);
  useLayoutEffect(() => {
    if (!open) return undefined;
    const place = () => {
      const p = panelRef.current, a = anchorRef.current;
      if (!p || !a) return;
      const n = a.getBoundingClientRect();
      Object.assign(p.style, { position: 'fixed', right: 'auto', bottom: 'auto', left: '0px', top: '0px' });
      const w = p.offsetWidth, h = p.offsetHeight;
      let x = align === 'right' ? n.right - w : n.left;
      if (x + w > innerWidth - EDGE) x = innerWidth - w - EDGE; if (x < EDGE) x = EDGE;
      let y = n.bottom + GAP; if (y + h > innerHeight - EDGE && n.top - h - GAP > EDGE) y = n.top - h - GAP;
      const o = p.getBoundingClientRect();   /* (0,0) đặt ra nằm đâu thật ⇒ phần lệch do tổ tiên có transform */
      p.style.left = (x - o.left) + 'px'; p.style.top = (y - o.top) + 'px';
    };
    place();
    addEventListener('scroll', place, true); addEventListener('resize', place);
    return () => { removeEventListener('scroll', place, true); removeEventListener('resize', place); };
  }, [open, align]);
  return panelRef;
}
