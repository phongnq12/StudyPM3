/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Kết quả quay về Danh sách sau Tạo / Sửa — cùng cách màn mẫu Danh sách lịch hẹn:
 * - ?created=<mã> · ?updated=<mã>: báo toast rồi tô sáng dòng bằng rowClassName theo state ('row-new' · 'is-fading').
 * - Đếm 3 giây TỪ KHI dòng đã vẽ trong bảng (chờ dòng có mặt rồi mới cuộn tới và bắt đầu đếm).
 * - Báo xong thì bỏ tham số khỏi URL (history.replaceState) ⇒ tải lại trang không báo lặp.
 * useListResult({ tableSelector, created, updated, deleted }) — created / updated / deleted(code, params) trả câu toast; trả { highlight, rowClassName }
 * params: URLSearchParams lúc mở trang (vd ?moved=<n> của màn Sửa buồng khi đổi quầy) — mọi tham số kết quả đều bị bỏ khỏi URL sau khi báo */
import { useEffect, useState } from 'react';
import { delayFromPageStart, toast } from '@/lib/legacyUi';

const RESULT_PARAMS = ['created', 'updated', 'deleted', 'moved'];

/**
 * Thuộc tính của useListResult (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.tableSelector - Bộ chọn CSS của bảng, dùng tìm dòng có `data-row-key` trùng mã vừa tạo hoặc sửa để cuộn tới.
 * @param {function} props.created - Gọi khi URL có `created`, nhận mã và tham số URL, trả câu toast báo tạo thành công.
 * @param {function} props.updated - Gọi khi URL có `updated`, nhận mã và tham số URL, trả câu toast báo sửa thành công.
 * @param {function} props.deleted - Gọi khi URL có `deleted`, nhận mã và tham số URL, trả câu toast báo xoá, không truyền thì không báo.
 */
export function useListResult({ tableSelector, created, updated, deleted }) {
  const [highlight, setHighlight] = useState({ code: '', faded: false });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const createdCode = params.get('created'), updatedCode = params.get('updated'), deletedCode = params.get('deleted');
    const code = createdCode || updatedCode;
    if (!code && !deletedCode) return undefined;
    const timer = setTimeout(() => {
      if (deletedCode && deleted) toast(deleted(deletedCode, params));
      if (code) { toast(createdCode ? created(code, params) : updated(code, params)); setHighlight({ code, faded: false }); }
      RESULT_PARAMS.forEach((k) => params.delete(k));
      const rest = params.toString();
      history.replaceState(history.state, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
    }, delayFromPageStart(500));
    return () => clearTimeout(timer);
  }, []);

  /* chờ dòng có mặt trong bảng (tối đa 2 giây) ⇒ cuộn tới dòng, đếm 3 giây rồi mờ dần */
  useEffect(() => {
    if (!highlight.code || highlight.faded) return undefined;
    let fadeTimer = null, frame = 0, tries = 0;
    const selector = tableSelector + ' tr[data-row-key="' + highlight.code.replace(/"/g, '\\"') + '"]';
    const waitRow = () => {
      const tr = document.querySelector(selector);
      if (tr && tr.classList.contains('row-new')) {
        tr.scrollIntoView({ block: 'center', behavior: 'smooth' });
        fadeTimer = setTimeout(() => setHighlight((h) => (h.code === highlight.code ? { ...h, faded: true } : h)), 3000);
        return;
      }
      if (++tries < 120) frame = requestAnimationFrame(waitRow);
    };
    frame = requestAnimationFrame(waitRow);
    return () => { cancelAnimationFrame(frame); if (fadeTimer) clearTimeout(fadeTimer); };
  }, [highlight.code, highlight.faded]);

  const rowClassName = (r) => (highlight.code === r.code ? 'row-new' + (highlight.faded ? ' is-fading' : '') : '');
  return { highlight, setHighlight, rowClassName };
}
