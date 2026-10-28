/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Chuông thông báo ở header — dựng theo PM1 (NotificationBell + NotificationDropdown của app thật):
 * badge đếm số CHƯA ĐỌC (quá 99 ⇒ 99+) · bấm mở dropdown 360px · đầu: «Thông báo» + «Đánh dấu đã đọc» · tối đa 10 dòng mới nhất
 * · dòng chưa đọc: tiêu đề đậm, nền xanh nhạt, viền trái xanh, chấm «Chưa đọc» · cuối: «Xem tất cả thông báo».
 * Bấm 1 dòng: đánh dấu đã đọc rồi mở thẳng bản ghi cần xử lý. */
import { useEffect, useState } from 'react';
import { Svg } from '@/lib/icons';
import { DROPDOWN_LIMIT, UNREAD_BADGE_MAX, markAllRead, markRead, notificationsFor, onNotificationsChange, timeAgo } from '@/data/notificationStore';
import { ROUTES } from '@/routes';
import NotificationText from './NotificationText';
import './NotificationBell.css';

export default function NotificationBell({ accountKey }) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(() => notificationsFor(accountKey));
  useEffect(() => onNotificationsChange(() => setList(notificationsFor(accountKey))), [accountKey]);
  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('click', close); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', onKey); };
  }, [open]);
  const unread = list.filter((n) => !n.isRead).length;
  const openItem = (n) => { markRead(n.id); setOpen(false); if (n.actionUrl) location.href = n.actionUrl; };
  return (
    <div className={'bell' + (open ? ' is-open' : '')} id="nutChuong" role="button" tabIndex={0} aria-label="Thông báo" aria-haspopup="dialog" aria-expanded={open} data-no-tooltip
      onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setOpen(!open); }}
      onKeyDown={(e) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.nativeEvent.stopImmediatePropagation(); setOpen(!open); } }}>
      <Svg name="bell" linejoin={null} />
      {unread > 0 && <span className="bell-dot" id="chuongDem">{unread > UNREAD_BADGE_MAX ? UNREAD_BADGE_MAX + '+' : unread}</span>}
      {open && (
        <div className="noti-pop" id="hopThongBao" role="dialog" aria-label="Thông báo" onClick={(e) => e.stopPropagation()}>
          <div className="noti-pop-head">
            <b>Thông báo</b>
            <button type="button" className="noti-link" id="nutDocHet" onClick={() => markAllRead(accountKey)}>Đánh dấu đã đọc</button>
          </div>
          <div className="noti-pop-body">
            {list.length === 0 ? <div className="noti-empty">Chưa có thông báo nào</div> : list.slice(0, DROPDOWN_LIMIT).map((n) => (
              <button type="button" key={n.id} className={'noti-item' + (n.isRead ? '' : ' is-unread')} data-ma={n.recordCode} onClick={() => openItem(n)}>
                <span className="noti-title"><NotificationText text={n.title} /></span>
                <span className="noti-body is-one-line"><NotificationText text={n.body} /></span>
                <span className="noti-meta">{timeAgo(n.createdAt)}{!n.isRead && <span className="noti-unread"><i />Chưa đọc</span>}</span>
              </button>
            ))}
          </div>
          <div className="noti-pop-foot"><a className="noti-link" id="lnkXemTatCa" href={ROUTES.notificationList}>Xem tất cả thông báo</a></div>
        </div>
      )}
    </div>
  );
}
