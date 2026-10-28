/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Nút X đóng popup DÙNG CHUNG — khuôn vuông có viền (chuẩn hoá mọi nút X popup).
 * Kích thước đo từ nút X của popup «Thông tin chi tiết thân nhân»: cao 36px, đệm ngang 10px, viền 1px, bo 6px, icon 16px nét 2. */
import { AppButtonWithIcon } from '@/components/app/AppButton';
import './DialogCloseButton.css';

const ICON_CLOSE = '<path d="M18 6L6 18M6 6l12 12"/>';

/**
 * Thuộc tính của DialogCloseButton (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {function} props.onClick - Gọi khi người dùng bấm nút X.
 * @param {string} props.title - Chữ gợi ý hiện khi rê chuột lên nút, nhãn đọc màn hình luôn là `Đóng`.
 */
export default function DialogCloseButton({ onClick, title = 'Đóng' }) {
  return <AppButtonWithIcon className="dlg-close" onClick={onClick} title={title} aria-label="Đóng" iconRaw={ICON_CLOSE} iconLinejoin={null} />;
}
