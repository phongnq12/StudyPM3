/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Nhập khẩu Excel — thân hộp thoại 3 bước, đối chiếu Design System PM1. Đặt trong AppModal rộng 720px.
 * ① Tải tệp mẫu ② Chọn tệp .xlsx tối đa 10MB, hiện tiến độ % khi đọc ③ Xem trước 10 dòng, dòng lỗi tô đỏ và nêu lý do.
 * Nút Nhập dữ liệu do màn gọi đặt ở chân hộp thoại, chỉ bấm được khi errorCount = 0. Chữ hiển thị truyền vào qua labels. */
import { AppButtonWithIcon } from '@/components/app/AppButton';
import AppTable from '@/components/app/AppTable';
import './AppPm1Controls.css';

const DOWNLOAD = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>';
const UPLOAD = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/>';

/**
 * Thuộc tính của AppImportExcel (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {object} props.labels - Chữ hiển thị gồm `template`, `templateButton`, `pick`, `dropHint`, `preview`, `errorCount`, `errorColumn`, trong đó `{0}` thay bằng số dòng lỗi.
 * @param {string} props.fileName - Tên tệp đã chọn, hiện trong vùng chọn tệp thay cho chữ gợi ý.
 * @param {number} props.percent - Tiến độ đọc tệp từ 0 tới 100, chỉ hiện thanh tiến độ khi là số.
 * @param {array} props.columns - Các cột bảng xem trước, mỗi cột gồm `key` và `title`, luôn thêm cột lỗi ở cuối.
 * @param {array} props.rows - Các dòng xem trước, dòng có trường `error` tô đỏ, mảng rỗng thì ẩn bước 3.
 * @param {function} props.onTemplate - Gọi khi người dùng bấm nút tải tệp mẫu.
 * @param {function} props.onPick - Gọi khi người dùng chọn tệp, nhận đối tượng tệp đầu tiên.
 */
export default function AppImportExcel({ labels, fileName, percent, columns = [], rows = [], onTemplate, onPick }) {
  const errorCount = rows.filter((r) => r.error).length;
  return <div className="app-import" data-fe="AppImportExcel">
    <div className="app-import-step"><span className="app-import-no">1</span><span>{labels.template}</span>
      <AppButtonWithIcon className="form-btn" iconRaw={DOWNLOAD} onClick={onTemplate}>{labels.templateButton}</AppButtonWithIcon></div>
    <div className="app-import-step"><span className="app-import-no">2</span><span>{labels.pick}</span>
      <label className="app-import-drop"><input type="file" accept=".xlsx" onChange={(e) => onPick && onPick(e.target.files[0])} />
        <span className="app-import-drop-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: UPLOAD }} /></span>
        <span>{fileName || labels.dropHint}</span></label>
      {typeof percent === 'number' ? <div className="app-import-progress" role="progressbar" aria-label="Tiến độ nhập tệp Excel" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: percent + '%' }} /><b>{percent}%</b></div> : null}</div>
    {rows.length ? <div className="app-import-step is-preview"><span className="app-import-no">3</span><span>{labels.preview}{errorCount ? ' · ' + labels.errorCount.replace('{0}', errorCount) : ''}</span>
      <div className="app-import-table"><AppTable rowKey="key" dataSource={rows} rowClassName={(r) => (r.error ? 'is-error' : '')}
        columns={[...columns.map((c) => ({ key: c.key, title: c.title, render: (r) => r[c.key] || '—' })), { key: 'error', title: labels.errorColumn, className: 'app-import-err', render: (r) => r.error || '—' }]} /></div></div> : null}
  </div>;
}
