/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* PageActions — cặp thanh nút đầu trang và chân trang dựng từ 1 cấu hình.
 * Màn khai 1 mảng nút rồi gọi <PageHeadActions actions={a} /> và <PageFooter actions={a} />: 2 thanh cùng bộ nút, cùng thứ tự, cùng hàm xử lý.
 * Mỗi nút: { id, label, onClick, className = 'form-btn', icon, iconRaw, iconLinejoin, disabled, hidden, title, left }
 * left: nút đứng bên trái chân trang (Quay lại bước trước, Hủy) — đầu trang vẫn giữ đúng thứ tự đọc: nhóm trái rồi nhóm phải.
 * Id: thanh ĐẦU MÀN giữ id gốc (cổng UIUX, engine, E2E tra theo id này). Từ mọi màn chỉ còn thanh đầu màn ghim, PageFooter không vẽ. */
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';

const ordered = (actions) => { const list = actions.filter(Boolean); return [...list.filter((a) => a.left), ...list.filter((a) => !a.left)]; };

function ActionButton({ a, idSuffix }) {
  const common = { className: (a.className || 'form-btn') + (a.hidden ? ' is-hidden-block' : ''), id: a.id ? a.id + idSuffix : undefined, onClick: a.onClick, disabled: a.disabled, title: a.title };
  /* nút không icon (vd Hủy) ⇒ AppButton, tránh khung svg rỗng chiếm chỗ */
  if (!a.icon && !a.iconRaw) return <AppButton {...common}>{a.label}</AppButton>;
  return <AppButtonWithIcon {...common} icon={a.icon} iconRaw={a.iconRaw} iconLinejoin={a.iconLinejoin}>{a.label}</AppButtonWithIcon>;
}

export function PageHeadActions({ actions }) {
  return <div className="page-head-actions">{ordered(actions).map((a) => <ActionButton key={a.id || a.label} a={a} idSuffix="" />)}</div>;
}

/* form nhiều bước — Quay lại bước trước (trái) và Tiếp tục (phải) nằm ở CUỐI nội dung bước như Ant Design Steps, Material Stepper;
 * thanh đầu màn chỉ giữ nút chính (Lưu nháp, nút lưu cuối). Nhận cùng dạng mảng nút như PageHeadActions. */
export function StepNav({ actions }) {
  const list = actions.filter(Boolean);
  return (
    <div className="step-nav">
      {list.filter((a) => a.left).map((a) => <ActionButton key={a.id || a.label} a={a} idSuffix="" />)}
      <div className="step-nav-spacer" />
      {list.filter((a) => !a.left).map((a) => <ActionButton key={a.id || a.label} a={a} idSuffix="" />)}
    </div>
  );
}

export function PageFooter() {
  return null;   /* 1 thanh nút duy nhất ở đầu màn (ghim) */
}
export function PageFooterLegacy({ actions }) {
  const list = actions.filter(Boolean);
  return (
    <div className="form-footer">
      {list.filter((a) => a.left).map((a) => <ActionButton key={a.id || a.label} a={a} idSuffix="" />)}
      <div className="form-footer-spacer" />
      {list.filter((a) => !a.left).map((a) => <ActionButton key={a.id || a.label} a={a} idSuffix="" />)}
    </div>
  );
}
