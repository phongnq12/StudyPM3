/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Thanh báo phiên bản mới — cơ chế dò chép NGUYÊN PM5 STG (nguyên văn: "t mún làm theo PM5").
 * Giao diện: kiểu A «pill nổi giữa đáy», bỏ hiệu ứng mưa và nắng ("Làm theo cái này nhé") — chi tiết ở VersionNotice.css.
 * Nguồn: bundle pm5-stag-fe.aequitas.dev index-DpX_cVRq.js (hook x5 · v5 · RE, component PE · O5) và index-DvB2YLZF.css (module _j4xxw_).
 * Cách dò (giữ đúng PM5):
 * - Chữ ký = các script type=module của trang (bỏ script của server dev), bỏ ?query, sắp xếp, nối bằng "|". Build mới ⇒ tên file có hash đổi ⇒ chữ ký đổi.
 * - Tải lại /index.html không qua bộ nhớ đệm mỗi 5 phút, và mỗi lần tab hiện lại hoặc cửa sổ được focus; 2 lần dò cách nhau tối thiểu 60 giây.
 * - Bỏ qua khi tab ẩn, khi mất mạng, khi tải lỗi.
 * - Ẩn khi mất mạng và 4 giây sau khi có mạng lại. Bấm Đóng ⇒ ẩn tới khi có bản build KHÁC nữa.
 * Gắn ở App.jsx (Prototype, chữ PM5) và DesignApp.jsx (trang Design System, truyền câu của qua prop label) — đặt ngoài AppLayout, KHÔNG gắn vào AppLayout dùng chung. */
import { useEffect, useRef, useState } from 'react';
import { AppButton } from '@/components/app/AppButton';
import logo from '@/assets/logo-cand.svg';
import './VersionNotice.css';

/* chuỗi nguyên văn PM5 */
const REGION_LABEL = 'Thông báo phiên bản mới';
const LABEL = 'Đã có phiên bản mới của hệ thống';
const ACTION_LABEL = 'Tải lại ngay';
const DISMISS_LABEL = 'Đóng thông báo phiên bản mới';
const NEW_LABEL = 'Mới';   /* chữ cạnh icon động */

const CHECK_INTERVAL_MS = 300 * 1000;
const MIN_GAP_MS = 60 * 1000;
const RECONNECT_HOLD_MS = 4000;
const DEV_SCRIPT = /(^|\/)@(vite\/|react-refresh|id\/|fs\/)/;


const ICON_REFRESH = <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5" /><path d="M3 21v-5h5" /></svg>;
const ICON_CLOSE = <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" /></svg>;

const signatureOf = (doc) => {
  const list = [...doc.querySelectorAll('script[type="module"][src]')]
    .map((s) => s.getAttribute('src') ?? '').filter((src) => src && !DEV_SCRIPT.test(src))
    .map((src) => src.split('?')[0]).sort((a, b) => a.localeCompare(b));
  return list.length ? list.join('|') : undefined;
};
const RUNNING_SIGNATURE = signatureOf(document);
const fetchLatestSignature = async () => {
  const res = await fetch('/index.html', { cache: 'no-cache' });
  if (!res.ok) return undefined;
  return signatureOf(new DOMParser().parseFromString(await res.text(), 'text/html'));
};

/* xem trước trên site không cần chờ bản build mới: thêm ?preview=version-notice vào link */
const PREVIEW_SIGNATURE = new URLSearchParams(globalThis.location?.search).get('preview') === 'version-notice' ? 'preview' : undefined;

function useNewVersion() {
  const [latest, setLatest] = useState(PREVIEW_SIGNATURE);
  useEffect(() => {
    if (!RUNNING_SIGNATURE || PREVIEW_SIGNATURE) return undefined;
    let stopped = false;
    let lastCheck = 0;
    const check = () => {
      if (stopped || document.visibilityState !== 'visible' || globalThis.navigator?.onLine === false) return;
      const now = Date.now();
      if (now - lastCheck < MIN_GAP_MS) return;
      lastCheck = now;
      fetchLatestSignature().then((sig) => { if (!stopped && sig) setLatest(sig === RUNNING_SIGNATURE ? undefined : sig); }).catch(() => { /* lỗi mạng tạm thời: lần sau dò lại */ });
    };
    const timer = setInterval(check, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', check);
    globalThis.addEventListener('focus', check);
    return () => { stopped = true; clearInterval(timer); document.removeEventListener('visibilitychange', check); globalThis.removeEventListener('focus', check); };
  }, []);
  return { hasUpdate: latest !== undefined, latestSignature: latest };
}

function useNetworkState() {
  const isOff = () => globalThis.navigator?.onLine === false;
  const [offline, setOffline] = useState(isOff);
  const [justReconnected, setJustReconnected] = useState(false);
  const wasOffline = useRef(isOff());
  const holdTimer = useRef();
  useEffect(() => {
    const clearHold = () => { if (holdTimer.current !== undefined) { clearTimeout(holdTimer.current); holdTimer.current = undefined; } };
    const onOffline = () => { wasOffline.current = true; clearHold(); setJustReconnected(false); setOffline(true); };
    const onOnline = () => {
      setOffline(false);
      if (wasOffline.current) { clearHold(); setJustReconnected(true); holdTimer.current = setTimeout(() => { holdTimer.current = undefined; setJustReconnected(false); }, RECONNECT_HOLD_MS); }
    };
    globalThis.addEventListener('offline', onOffline);
    globalThis.addEventListener('online', onOnline);
    return () => { globalThis.removeEventListener('offline', onOffline); globalThis.removeEventListener('online', onOnline); clearHold(); };
  }, []);
  return { offline, justReconnected };
}

/* ① icon động thay chữ New (ngôi sao lấp lánh) */
const ICON_NEW = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></svg>;

/**
 * @param {object} props
 * @param {string} props.label - Tuỳ chọn. Chữ chính trên thanh. Mặc định là chữ PM5 «Đã có phiên bản mới của hệ thống»; trang Design System truyền câu của.
 * @param {string} props.actionLabel - Tuỳ chọn. Chữ nút tải lại. Mặc định «Tải lại ngay».
 */
export default function VersionNotice({ label = LABEL, actionLabel = ACTION_LABEL }) {
  const { hasUpdate, latestSignature } = useNewVersion();
  const { offline, justReconnected } = useNetworkState();
  const [dismissed, setDismissed] = useState();
  const visible = hasUpdate && !(offline || justReconnected) && latestSignature !== dismissed;
  /* đang xem thử (?preview=version-notice) thì bỏ đuôi đó rồi mới tải lại — tải lại nguyên link thì thanh bật lại mãi (báo 19/10/2026) */
  const reload = () => {
    if (!PREVIEW_SIGNATURE) { globalThis.location.reload(); return; }
    const url = new URL(globalThis.location.href);
    url.searchParams.delete('preview');
    globalThis.location.replace(url.toString());
  };
  const dismiss = () => setDismissed(latestSignature);
  return (
    <div className="vn-region" role="status" aria-live="polite" aria-label={REGION_LABEL}>
      {visible && (
        <div className="vn-chip" key={latestSignature}>
          <span className="vn-seal" aria-hidden="true"><img src={logo} alt="" /></span>
          <span className="vn-new" aria-hidden="true"><span className="vn-new-icon">{ICON_NEW}</span>{NEW_LABEL}</span>
          <span className="vn-label">{label}</span>
          <AppButton type="link" size="small" className="vn-action" onClick={reload}><span className="vn-action-icon" aria-hidden="true">{ICON_REFRESH}</span>{actionLabel}</AppButton>
          <AppButton type="link" size="small" className="vn-close" aria-label={DISMISS_LABEL} title="Đóng" onClick={dismiss}>{ICON_CLOSE}</AppButton>
        </div>
      )}
    </div>
  );
}
