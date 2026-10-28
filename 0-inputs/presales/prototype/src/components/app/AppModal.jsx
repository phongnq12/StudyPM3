/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppModal — bọc antd Modal. antd lo: cổng đưa ra body · Escape · bấm nền để đóng · giữ focus trong popup.
 * Giao diện theo thiết kế đã duyệt: lớp phủ .mask (flex căn giữa) > khung .dlg (≤ 520px) — vẽ bằng modalRender.
 * forceRender: popup có sẵn trong DOM từ đầu như bản HTML (cổng UIUX đếm cả popup đang ẩn).
 * Đóng popup ⇒ trả focus về phần tử giữ focus lúc mở (bản HTML không dời focus nên nút vừa bấm vẫn giữ focus). dlgStyle: style riêng khung .dlg */
import { useEffect, useRef } from 'react';
import { Modal } from 'antd';

/**
 * Thuộc tính của AppModal (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Mã định danh gắn vào lớp phủ bọc ngoài popup.
 * @param {boolean} props.open - Bật thì hiện popup và nhớ phần tử đang giữ focus, tắt thì trả focus về phần tử đó.
 * @param {function} props.onClose - Gọi khi người dùng nhấn Esc hoặc bấm ra nền ngoài khung popup.
 * @param {string} props.labelledBy - Mã phần tử tiêu đề, gắn vào `aria-labelledby` của khung popup để trình đọc màn hình đọc tên.
 * @param {string} props.dlgClassName - Lớp CSS của khung popup, thêm lớp riêng như `dlg dlg-notify` để đổi giao diện.
 * @param {object} props.dlgStyle - Style riêng gắn thẳng vào khung `.dlg` của popup.
 * @param {ReactNode} props.children - Nội dung bên trong khung popup, thường gồm phần đầu, thân và chân.
 */
export default function AppModal({ id, open, onClose, labelledBy, dlgClassName = 'dlg', dlgStyle, children }) {
  const previousFocus = useRef(null);
  useEffect(() => {
    /* nhớ cả trạng thái viền focus lúc mở: nút bấm chuột ⇒ không viền, nút bấm phím ⇒ có viền — trả lại y trạng thái đó */
    if (open) { const a = document.activeElement; previousFocus.current = a ? { element: a, hadFocusRing: a.matches(':focus-visible') } : null; return; }
    const prev = previousFocus.current; previousFocus.current = null;
    if (prev && prev.element !== document.body && document.contains(prev.element) && typeof prev.element.focus === 'function') prev.element.focus({ preventScroll: true, focusVisible: prev.hadFocusRing });
  }, [open]);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      forceRender
      mask={false}
      closable={false}
      footer={null}
      keyboard
      maskClosable
      focusTriggerAfterClose={false}
      width="auto"
      transitionName=""
      className="app-reset"
      rootClassName="app-reset"
      wrapClassName={'app-reset-wrap mask' + (open ? ' on' : '')}
      wrapProps={{ id }}
      modalRender={() => <div className={dlgClassName} style={dlgStyle} role="dialog" aria-modal="true" aria-labelledby={labelledBy} data-fe="Modal">{children}</div>}
    />
  );
}
