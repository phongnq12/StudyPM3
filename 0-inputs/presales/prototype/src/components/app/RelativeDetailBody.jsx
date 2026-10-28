/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Thân popup "Thông tin chi tiết thân nhân" dùng chung mọi màn: avatar chữ tắt + họ tên ở đầu, các dòng thông tin bên dưới */
import AppTag from '@/components/app/AppTag';
import { relativeDetailRows, relativeInitials } from '@/lib/relativeDetail';

/**
 * Thuộc tính của RelativeDetailBody (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {object} props.relative - Bản ghi thân nhân cần hiện, dựng avatar chữ tắt, họ tên và các dòng thông tin, bỏ trống thì hiện khối rỗng.
 */
export default function RelativeDetailBody({ relative }) {
  if (!relative) return <div className="adjust" id="ctTnThan" />;
  const rows = relativeDetailRows(relative, (tagClass, label) => <AppTag className={tagClass}>{label}</AppTag>);
  return (
    <>
      <div className="relative-detail-head">
        <div className="relative-avatar">{relativeInitials(relative.fullName)}</div>
        <div className="relative-detail-name">{relative.fullName}</div>
      </div>
      <div className="adjust" id="ctTnThan">
        {rows.map(([label, value]) => [<div className="adjust-label" key={label + 'l'}>{label}</div>, <div className="adjust-value" key={label + 'v'}>{value}</div>])}
      </div>
    </>
  );
}
