/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Nút xoá cho ô chọn có tìm (attachSearch ở form Tạo mới / Chỉnh sửa / Đăng ký tại quầy) — CÙNG hành vi ô lọc ở danh sách
 * (cùng loại control thì cả hệ thống xử lý giống nhau):
 * bình thường hiện mũi tên · đã có giá trị và rê chuột ⇒ dấu x tròn xám đứng đúng chỗ mũi tên (như antd allowClear).
 * Bấm x ⇒ về lựa chọn đầu (rỗng) rồi phát change ⇒ form xử lý như người dùng tự bỏ chọn (ô bắt buộc sẽ báo thiếu khi kiểm). */
const X_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';

export function addLookupClear(wrapper, select) {
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'lookup-clear'; btn.tabIndex = -1;
  btn.setAttribute('aria-label', 'Xóa lựa chọn'); btn.innerHTML = X_ICON;
  btn.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); });   /* không làm ô mất/nhận focus, không mở danh sách */
  btn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    if (select.disabled || select.selectedIndex <= 0) return;
    select.selectedIndex = 0;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  wrapper.appendChild(btn);
  /* gọi lại mỗi lần ô đồng bộ giá trị: có giá trị và không bị khoá thì mới cho xoá */
  return () => wrapper.classList.toggle('has-value', select.selectedIndex > 0 && !select.disabled);
}
