/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô «Tài liệu đính kèm» — không bắt buộc.
 * Mỗi tệp tối đa 10MB (Common Rules DATA-02): vượt thì chặn, báo E001-14, không nhận tệp. Prototype chỉ giữ tên và dung lượng, không tải lên máy chủ.
 * value: [{ name, size }] · onChange(list) */
import { useRef, useState } from 'react';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { msg } from '@/lib/msg';
import './AttachmentField.css';

const MAX_BYTES = 10 * 1024 * 1024;   /* DATA-02 */
const ICON_CLIP = '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>';
const ICON_X = '<path d="M18 6 6 18M6 6l12 12"/>';
export const sizeText = (b) => (b >= 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');

/**
 * Thuộc tính của AttachmentField (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Id của khối, cũng là tiền tố id ô chọn tệp `{id}Input` và chữ lỗi `{id}Loi`.
 * @param {array} props.value - Danh sách tệp đã chọn dạng `{ name, size }`, hiện tên và dung lượng kèm nút Bỏ tệp.
 * @param {function} props.onChange - Gọi khi thêm tệp không vượt 10MB hoặc bỏ 1 tệp, nhận danh sách tệp mới.
 */
export default function AttachmentField({ id, value = [], onChange }) {
  const input = useRef(null);
  const [error, setError] = useState('');
  const pick = (e) => {
    const files = [...(e.target.files || [])];
    const tooBig = files.filter((f) => f.size > MAX_BYTES);
    setError(tooBig.length ? msg('E001-14', '10MB') : '');
    const ok = files.filter((f) => f.size <= MAX_BYTES).map((f) => ({ name: f.name, size: f.size }));
    if (ok.length) onChange(value.concat(ok));
    e.target.value = '';
  };
  return (
    <div className="attach-field" id={id}>
      <input ref={input} type="file" multiple hidden onChange={pick} id={id + 'Input'} />
      <AppButtonWithIcon htmlType="button" className="btn attach-btn" iconRaw={ICON_CLIP} onClick={() => input.current && input.current.click()}>Chọn tệp</AppButtonWithIcon>
      {value.length ? (
        <ul className="attach-list">
          {value.map((f, i) => (
            <li key={f.name + i}><span className="attach-name">{f.name}</span><span className="attach-size">{sizeText(f.size)}</span>
              <AppButtonWithIcon htmlType="button" className="attach-remove" title="Bỏ tệp" aria-label={'Bỏ tệp ' + f.name} iconRaw={ICON_X} onClick={() => onChange(value.filter((_, j) => j !== i))} /></li>
          ))}
        </ul>) : null}
      {error ? <span className="field-error on" id={id + 'Loi'}>{error}</span> : null}
    </div>
  );
}
