/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Quản lý thông báo — Danh sách thông báo: dựng theo màn /thong-bao của PM1 (app thật).
 * Giữ của PM1: tiêu đề + dòng phụ · nút «Đánh dấu tất cả đã đọc» chỉ hiện khi còn chưa đọc · 3 tab Tất cả / Chưa đọc / Đã đọc · ô tìm
 * · «Chọn tất cả trong trang» + xoá nhiều dòng có hộp xác nhận · mỗi dòng: tiêu đề, nội dung, «x phút trước» + Chưa đọc / Đã đọc · 20 dòng/trang.
 * Khác PM1: nội dung ghi rõ từng ý (người gửi · ai gặp ai · khi nào, ở đâu · lý do), bấm dòng mở thẳng bản ghi cần xử lý. */
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { toast } from '@/lib/legacyUi';
import { msg, msgParts } from '@/lib/msg';
import { RichText, key } from '@/lib/richText';
import { normalizeSearchText } from '@/lib/text';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import AppModal from '@/components/app/AppModal';
import AppSelect, { PAGE_SIZE_OPTIONS } from '@/components/app/AppSelect';
import AppSearchInput from '@/components/app/AppSearchInput';
import DialogCloseButton from '@/components/app/DialogCloseButton';
import { currentAccount } from '@/data/accountStore';
import { markAllRead, markRead, notificationsFor, onNotificationsChange, plainText, removeNotifications, timeAgo } from '@/data/notificationStore';
import NotificationText from '@/layout/NotificationText';
import { ADMIN_BREADCRUMB, ADMIN_MENU, ADMIN_SIDEBAR } from '@/layout/menuConfig';
import './NotificationList.css';
import DialogIcon from '@/components/app/DialogIcon';
import PageSelect from '@/components/app/PageSelect';   /* ô «Chọn trang» cạnh chữ «Trang X/Y» */

const BELL = '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>';
const TABS = [
  { key: 'all', label: 'Tất cả', test: () => true },
  { key: 'unread', label: 'Chưa đọc', test: (n) => !n.isRead },
  { key: 'read', label: 'Đã đọc', test: (n) => n.isRead },
];

export default function NotificationList() {
  const account = currentAccount();
  const [list, setList] = useState(() => notificationsFor(account.key));
  useEffect(() => onNotificationsChange(() => setList(notificationsFor(account.key))), []);
  const [tab, setTab] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState(() => new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  const searched = useMemo(() => {
    const k = normalizeSearchText(keyword.trim());
    return k ? list.filter((n) => normalizeSearchText(plainText(n.title + ' ' + n.body)).includes(k)) : list;
  }, [list, keyword]);
  const rows = searched.filter(TABS.find((t) => t.key === tab).test);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageRows = rows.slice((current - 1) * pageSize, current * pageSize);
  const unread = list.filter((n) => !n.isRead).length;
  const allPicked = pageRows.length > 0 && pageRows.every((n) => picked.has(n.id));
  /* chỉ xoá dòng đã chọn CÒN HIỆN trong danh sách đang lọc — chặn xoá nhầm dòng bị ẩn */
  const pickedIds = rows.filter((n) => picked.has(n.id)).map((n) => n.id);

  const changeTab = (k) => { setTab(k); setPage(1); setPicked(new Set()); };
  const changeKeyword = (v) => { setKeyword(v); setPage(1); setPicked(new Set()); };   /* đổi từ khoá bỏ chọn như đổi tab */
  const togglePick = (id) => setPicked((s) => { const x = new Set(s); if (x.has(id)) x.delete(id); else x.add(id); return x; });
  const togglePage = () => setPicked((s) => { const x = new Set(s); pageRows.forEach((n) => (allPicked ? x.delete(n.id) : x.add(n.id))); return x; });
  const openItem = (n) => { markRead(n.id); if (n.actionUrl) window.open(n.actionUrl, '_blank'); };   /* PM1: ở màn danh sách mở tab mới */
  const readAll = () => { markAllRead(account.key); toast(msg('I001-73')); };
  const confirmDelete = () => { const n = pickedIds.length; removeNotifications(pickedIds); setPicked(new Set()); setConfirmOpen(false); toast(msg('I001-04', key(n) + ' thông báo')); };

  return (
    <AppLayout menu={ADMIN_MENU} sidebar={ADMIN_SIDEBAR} breadcrumb={[...ADMIN_BREADCRUMB, { label: 'Quản lý thông báo' }]}
      overlays={
        <AppModal id="dlgXoaThongBao" open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <div className="dlg-h"><h3 className="dlg-t"><DialogIcon level="danger" /><RichText text={msgParts('C001-01', key(pickedIds.length) + ' thông báo', '').title} /></h3><DialogCloseButton onClick={() => setConfirmOpen(false)} /></div>
          <div className="dlg-b"><div className="dlg-text"><RichText text={msgParts('C001-01', key(pickedIds.length) + ' thông báo', '').body} /></div>   {/* MSG-CF C001-01 */}</div>
          <div className="dlg-f">
            <AppButton className="btn" onClick={() => setConfirmOpen(false)}>Hủy</AppButton>
            <AppButton className="btn btn-danger" id="nutXacNhanXoa" onClick={confirmDelete}>Xóa thông báo</AppButton>
          </div>
        </AppModal>
      }>
      <div className="shell-head">
        <div className="shell-title">
          <Svg raw={BELL} />
          <div className="shell-text">
            <h1>Danh sách thông báo</h1>
          </div>
        </div>
        <div className="head-actions">
          {pickedIds.length > 0 && <AppButtonWithIcon className="btn btn-danger-ghost" id="nutXoaChon" onClick={() => setConfirmOpen(true)}
            iconRaw={'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'}>{'Xóa ' + pickedIds.length + ' thông báo'}</AppButtonWithIcon>}
          {unread > 0 && <AppButtonWithIcon className="btn" id="nutDocTatCa" onClick={readAll} iconRaw={'<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>'}>Đánh dấu tất cả đã đọc</AppButtonWithIcon>}
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => { const n = searched.filter(t.test).length; return (
          <AppButton key={t.key} className={'tab-btn' + (tab === t.key ? ' on' : '') + (n === 0 && tab !== t.key ? ' is-empty' : '')} onClick={() => changeTab(t.key)}>
            <span className="tab-label">{t.label}</span><span className="tab-number">{n}</span>
          </AppButton>); })}
      </div>

      <div className="noti-tools">
        <AppSearchInput className="noti-search" id="oTimThongBao" value={keyword} onChange={changeKeyword}
          placeholder="Tìm theo mã lịch hẹn, tên thân nhân, tên người cai nghiện" />
        <label className="noti-pick-all"><input type="checkbox" id="chkChonTrang" checked={allPicked} disabled={!pageRows.length} onChange={togglePage} />Chọn tất cả trong trang</label>
      </div>

      <div className="noti-list" id="dsThongBao" data-no-tooltip>
        {pageRows.length === 0 ? <div className="noti-list-empty">Không có thông báo</div> : pageRows.map((n) => (
          <div key={n.id} className={'noti-row' + (n.isRead ? '' : ' is-unread') + (picked.has(n.id) ? ' is-picked' : '')} data-ma={n.recordCode}>
            <input type="checkbox" className="noti-row-check" aria-label="Chọn thông báo" checked={picked.has(n.id)} onChange={() => togglePick(n.id)} />
            <button type="button" className="noti-row-main" onClick={() => openItem(n)}>
              <span className="noti-row-title"><NotificationText text={n.title} /></span>
              <span className="noti-row-lines">{(n.lines || [n.body]).map((l) => <span key={l}><NotificationText text={l} /></span>)}</span>
              <span className="noti-row-meta">{timeAgo(n.createdAt)}
                {n.isRead ? <span className="noti-read">• Đã đọc</span> : <span className="noti-unread"><i />Chưa đọc</span>}</span>
            </button>
            {/* thông báo gộp của thao tác hàng loạt ⇒ nút mở Danh sách lọc đúng các lịch đó */}
            {n.bulkCodes && n.bulkCodes.length > 1 && <AppButtonWithIcon className="btn noti-row-action" id={'nutXemLoat' + n.id} onClick={() => openItem(n)} icon="view">{'Xem ' + n.bulkCodes.length + ' lịch hẹn'}</AppButtonWithIcon>}
          </div>
        ))}
      </div>

      <div className="pager">
        <AppButtonWithIcon className="pg-nav" id="pgTruoc" disabled={current <= 1} icon="chevLeft" onClick={() => setPage(current - 1)}>Trang trước</AppButtonWithIcon>
        <div className="pg-center">
          <span className="pg-i">Tổng số: <b id="pgTong">{rows.length}</b></span>
          <span className="pg-v" />
          <span className="pg-i">Trang <b id="pgSo">{current + '/' + pageCount}</b></span>
          <span className="pg-v" />
          <span className="pg-i">Chọn trang</span>
          <PageSelect id="pgChonTrang" current={current} total={pageCount} onChange={setPage} />
          <span className="pg-v" />
          <span className="pg-i">Chọn số bản ghi</span>
          <AppSelect id="pgCo" width={61} value={pageSize} options={PAGE_SIZE_OPTIONS} showSearch={false} allowClear={false} onChange={(v) => { setPageSize(+v); setPage(1); }} />
          <span className="pg-i">trên 1 trang</span>
        </div>
        <AppButtonWithIcon className="pg-nav" id="pgSau" disabled={current >= pageCount} icon="chevRight" iconAfter onClick={() => setPage(current + 1)}>Trang sau</AppButtonWithIcon>
      </div>
    </AppLayout>
  );
}
