/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppButton · AppButtonWithIcon — bọc antd Button như bộ App* của PM1.
 * className = lớp giao diện thiết kế đã duyệt (.nut · .nut-hong · .ib · .pg-nav · .dt-back…); lớp app-reset trả antd về mặc định trình duyệt (styles/antd-reset.css).
 * data-fe khai sẵn để cổng UIUX và FE tra đúng tên component. */
import { Button } from 'antd';
import { Svg } from '@/lib/icons';
import './AppExtraControls.css';   /* vòng xoay của nút loading */

/* nút không có chữ (chỉ icon) ⇒ trình đọc màn hình đọc theo title (WCAG 4.1.2) */
const nameFromTitle = (rest, textual) => (!textual && rest.title && rest['aria-label'] == null ? { 'aria-label': rest.title } : null);

/**
 * Thuộc tính của AppButton (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.className - Lớp giao diện chuẩn của nút, ghép sau lớp `app-reset`.
 * @param {ReactNode} props.children - Nội dung nút, không phải chữ hoặc số thì nút lấy `title` làm `aria-label` khi chưa có tên đọc riêng.
 */
export function AppButton({ className = '', children, ...rest }) {
  return <Button className={'app-reset ' + className} data-fe="AppButton" {...nameFromTitle(rest, typeof children === 'string' || typeof children === 'number')} {...rest}>{children}</Button>;
}

/* icon = key in lib/icons · iconRaw = custom strokes · iconLinecap/iconLinejoin = null to omit the attribute
 * iconAfter: icon AFTER the text (e.g. the Next page button) */
/* loading: đang xử lý (góp ý Designer) ⇒ icon đổi thành vòng xoay cùng cỡ, nút khoá bấm, aria-busy — chữ giữ nguyên để nút không đổi bề rộng */
export function AppButtonWithIcon({ className = '', icon, iconRaw, iconLinecap, iconLinejoin, iconStrokeWidth, iconClassName, iconAfter, loading, children, ...rest }) {
  const svg = loading ? <span className="btn-loading-ring" aria-hidden="true" /> : <Svg name={icon} raw={iconRaw} linecap={iconLinecap} linejoin={iconLinejoin} strokeWidth={iconStrokeWidth} className={iconClassName} />;
  const onlyIcon = children == null || children === '';
  const busy = loading ? { disabled: true, 'aria-busy': 'true' } : null;
  return (
    <Button className={'app-reset ' + className + (loading ? ' is-loading' : '')} data-fe={'AppButtonWithIcon' + (onlyIcon ? ':isOnlyIcon' : '')} {...nameFromTitle(rest, !onlyIcon)} {...rest} {...busy}>
      {!iconAfter && svg}{children}{iconAfter && svg}
    </Button>
  );
}
