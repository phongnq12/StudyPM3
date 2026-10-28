/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Thanh công cụ — gom các nút thao tác cùng nhóm (trên bảng, trên khối), chia nhóm bằng vạch ngăn.
 * Bàn phím theo WAI-ARIA APG Toolbar: Tab vào thanh 1 lần, mũi tên trái phải đi giữa các nút, Home và End tới nút đầu, cuối.
 * groups: mảng nhóm, mỗi nhóm là mảng phần tử nút. */
import { Fragment, useRef } from 'react';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppToolbar (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.label - Tên đọc màn hình của thanh công cụ, gắn vào `aria-label` của khối `role=toolbar`.
 * @param {array} props.groups - Mảng nhóm nút, mỗi nhóm vẽ trong `app-toolbar-group` và ngăn với nhóm trước bằng vạch dọc.
 */
export default function AppToolbar({ label, groups = [] }) {
  const bar = useRef(null);
  const onKey = (e) => {
    const btns = [...bar.current.querySelectorAll('button:not([disabled])')];
    const i = btns.indexOf(document.activeElement); if (i < 0) return;
    const go = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: btns.length - 1 }[e.key];
    if (go === undefined) return;
    e.preventDefault(); btns[(go + btns.length) % btns.length].focus();
  };
  return <div className="app-toolbar" role="toolbar" aria-label={label} ref={bar} onKeyDown={onKey}>
    {groups.map((g, i) => <Fragment key={i}>{i ? <span className="app-toolbar-sep" role="separator" aria-orientation="vertical" /> : null}<span className="app-toolbar-group">{g}</span></Fragment>)}
  </div>;
}
