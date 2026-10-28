/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Phím tắt — hiện tên phím trong câu hướng dẫn, nhiều phím nối bằng dấu +.
 * keys: mảng tên phím, vd ['Ctrl', 'S']. Dùng thẻ kbd để trình đọc màn hình hiểu là phím. */
import { Fragment } from 'react';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppKbd (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.keys - Mảng tên phím, mỗi phím vẽ trong thẻ `kbd` và nối nhau bằng dấu `+`.
 */
export default function AppKbd({ keys = [] }) {
  return <span className="app-kbd-group">{keys.map((keyName, i) => <Fragment key={i}>{i ? <span className="app-kbd-plus" aria-hidden="true">+</span> : null}<kbd className="app-kbd">{keyName}</kbd></Fragment>)}</span>;
}
