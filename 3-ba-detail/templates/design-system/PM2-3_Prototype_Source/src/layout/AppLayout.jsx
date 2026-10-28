/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Page frame — 60px brand-red header (base.css .hd) · horizontal menu like PM1 · sidebar of the active group · breadcrumb row
 * Ported from the HTML markup + veMenu/veSidebar/thuGon (same CSS classes in base/pm2-base.css).
 * menu item: { icon, label, href?, active?, children? } · sidebar: { group, items } · breadcrumb item: { label, href?, onClick? } (last = current page) */
import { useEffect, useState } from 'react';
import logo from '@/assets/logo-cand.svg';
import { Svg } from '@/lib/icons';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { installHints, installTooltip, notifyInDevelopment } from '@/lib/legacyUi';
import { MENU, SIDEBAR } from './menuConfig';
import { ACCOUNTS, FACILITY_NAME, canOpenPath, currentAccount, logout, switchAccount } from '@/data/accountStore';
import { ROUTES } from '@/routes';
import NotificationBell from './NotificationBell';

const go = (href) => () => { location.href = href; };
/* mục menu thả xuống và sidebar có href để Tab tới được · bấm thì chặn điều hướng mặc định, giữ đúng hành vi cũ
 * (có href ⇒ chuyển trang · mục đang mở ⇒ không làm gì · chưa có màn ⇒ báo đang phát triển). Giữ data-onclick cho LeaveGuard. */
const menuClick = (item) => (e) => { e.preventDefault(); if (item.href) go(item.href)(); else if (!item.active) notifyInDevelopment(); };

/* Breadcrumb — tách khỏi khung trang để trang Design System gọi đúng code thật (góp ý Designer).
 * items: [{ label, href?, onClick? }] — mục cuối là màn hiện tại, chữ đậm, không bấm. */
export function Breadcrumb({ items }) {
  const current = items[items.length - 1];
  /* WAI-ARIA APG Breadcrumb: vùng nav có nhãn · mục cấp trên có href nên Tab tới được và Enter mở được · cấp cuối aria-current=page.
 * Giữ data-onclick để LeaveGuard vẫn chặn rời trang khi đang nhập dở. */
  return <nav className="bc" aria-label="Breadcrumb">
    {items.slice(0, -1).map((b) => (
      <span key={b.label} style={{ display: 'contents' }}>
        <a data-onclick="1" href={b.href || '#'} onClick={(e) => { e.preventDefault(); if (b.onClick) b.onClick(e); else go(b.href)(); }}>{b.label}</a>
        <Svg name="chevRight" linejoin={null} />
      </span>
    ))}
    <b aria-current="page">{current.label}</b>
  </nav>;
}
/* ẩn mục menu của màn vai trò hiện tại không được mở; nhóm mà mọi mục có đường dẫn đều bị ẩn thì ẩn cả nhóm */
const visibleItems = (items) => items.filter((x) => !x.href || canOpenPath(x.href));
const visibleGroups = (menu) => menu.filter((g) => (g.children ? !(g.children.some((c) => c.href) && !visibleItems(g.children).some((c) => c.href)) : !g.href || canOpenPath(g.href)))
  .map((g) => (g.children ? { ...g, children: visibleItems(g.children) } : g));

/* menu theo luồng: menu ngang chỉ hiện tên nhóm, KHÔNG thả xuống; mục con chỉ ở sidebar (tránh trùng 2 menu) — áp cả Prototype và trang Design System.
 * Bấm nhóm ⇒ mở mục đầu có đường dẫn; nhóm chưa có màn nào ⇒ báo đang phát triển */
const groupClick = (group) => {
  const target = group.href || (group.children && (group.children.find((c) => c.href) || {}).href);
  return target ? go(target) : notifyInDevelopment;
};

function NavBar({ cluster, menu }) {
  return (
    <nav className="nav" id="nav">
      {visibleGroups(menu || MENU(cluster)).map((group) => (
        <div className="nv" key={group.label}>
          <AppButtonWithIcon className={'nv-b' + (group.active ? ' on' : '')} onClick={groupClick(group)} icon={group.icon}>
            <span>{group.label}</span>
          </AppButtonWithIcon>
        </div>
      ))}
    </nav>
  );
}

function SideBar({ cluster, sidebar, collapsed }) {
  const s = sidebar || SIDEBAR[cluster];
  return (
    <aside className={'sb' + (collapsed ? ' min' : '')} id="sb">
      <nav className="sb-nav" tabIndex={0} aria-label={s.group}>
        <div className="sb-g">{s.group}</div>
        {visibleItems(s.items).map((item) => (
          <a key={item.label} className={'sb-i' + (item.active ? ' on' : '')} title={item.label} data-onclick={item.href || !item.active ? '1' : undefined}
            href={item.href || '#'} aria-current={item.active ? 'page' : undefined} onClick={menuClick(item)}>
            <Svg name={item.icon} /><span>{item.label}</span>
            {item.active && <span className="sb-dot" />}
          </a>
        ))}
      </nav>
    </aside>
  );
}

/* cluster: key in menuConfig · menu / sidebar: page-specific config (copied from MENU / SIDE of the HTML page)
 * descriptions: tooltip text by button label · overlays: popups rendered after the frame */
/* brand (tùy chọn): { logo, alt, title, sub } — trang Design System đặt nhận diện riêng; Prototype không truyền ⇒ quốc huy + tên phần mềm */
/**
 * Thuộc tính của AppLayout (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.cluster - Khóa cụm trong `menuConfig`, dùng lấy menu và sidebar mặc định khi không truyền riêng.
 * @param {array} props.menu - Menu ngang riêng của trang, mỗi mục gồm `icon`, `label`, `href`, `active`, `children`, bỏ trống thì lấy theo `cluster`.
 * @param {object} props.sidebar - Sidebar riêng của trang dạng `{ group, items }`, bỏ trống thì lấy theo `cluster`.
 * @param {array} props.breadcrumb - Các mục đường dẫn dạng `{ label, href, onClick }`, mục cuối là màn hiện tại in đậm.
 * @param {object} props.descriptions - Chữ gợi ý theo nhãn nút, nạp vào tooltip một lần lúc dựng khung.
 * @param {ReactNode} props.children - Nội dung chính của trang, đặt trong vùng `.shell`.
 * @param {ReactNode} props.overlays - Các popup vẽ sau khung trang.
 * @param {object} props.brand - Nhận diện riêng dạng `{ logo, alt, title, sub }`, bỏ trống thì dùng quốc huy và tên phần mềm.
 * @param {object} props.fixedAccount - Tài khoản cố định dạng `{ initials, name, role }`, truyền vào thì ẩn menu đổi tài khoản.
 * @param {function} props.onLogout - Chỉ dùng kèm `fixedAccount`: truyền vào thì hiện nút Đăng xuất cạnh tên tài khoản.
 */
export default function AppLayout({ cluster, menu, sidebar, breadcrumb, descriptions = {}, children, overlays, brand, fixedAccount, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  useEffect(() => { installHints(); installTooltip(descriptions); }, []);
  /* account menu (PM1): click outside or Esc closes — same as moMenuTk in pm2-base.js */
  useEffect(() => {
    if (!accountOpen) return undefined;
    const close = () => setAccountOpen(false);
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('click', close); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', onKey); };
  }, [accountOpen]);
  const account = currentAccount();
  const [accountListOpen, setAccountListOpen] = useState(false);
  const crumbs = breadcrumb;
  return (
    <>
      <div className="app">
        <header className="hd">
          <AppButtonWithIcon className="hd-menu" onClick={notifyInDevelopment} title="Mở menu" aria-label="Menu" icon="menu" iconLinejoin={null} />
          <img className="hd-logo" src={brand ? brand.logo : logo} alt={brand ? brand.alt : 'Quốc huy'} />
          <div className="hd-name">
            <div className="hd-n1">{brand ? brand.title : 'Quản lý thăm gặp và gọi điện có hình ảnh'}</div>
            <div className="hd-n2">{brand ? brand.sub : FACILITY_NAME}</div>
          </div>
          <div className="hd-sp" />
          <NotificationBell accountKey={account.key} />
          <div className="hd-sep" />
          {fixedAccount ? (   /* trang Design System: 1 người cố định, không đổi tài khoản */
            <div className="acct acct-fixed" style={{ cursor: 'default' }}>
              <div className="acct-av">{fixedAccount.initials}</div>
              <div>
                <div className="acct-n">{fixedAccount.name}</div>
                <div className="acct-r">{fixedAccount.role}</div>
              </div>
              {onLogout && (   /* trang Design System có Đăng xuất (xoá khoá giải mã) */
                <button type="button" className="acct-logout" onClick={onLogout}
                  style={{ marginLeft: 14, height: 30, padding: '0 11px', border: '1px solid rgba(255,255,255,.5)', borderRadius: 6, background: 'rgba(255,255,255,.08)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6, font: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  <Svg raw={'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'} style={{ width: 16, height: 16, flex: 'none' }} />Đăng xuất
                </button>
              )}
            </div>
          ) : (
          <div className={'acct' + (accountOpen ? ' is-open' : '')} onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setAccountOpen(!accountOpen); }}>
            <div className="acct-av">{account.initials}</div>
            <div>
              <div className="acct-n">{account.name}</div>
              <div className="acct-r">{account.role}</div>
            </div>
            <Svg raw={'<path d="m6 9 6 6 6-6"/>'} className="acct-car" />
            <div className="acct-menu" role="menu" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="acct-mi" role="menuitem" onClick={() => setAccountListOpen(!accountListOpen)}>
                <Svg raw={'<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/>'} />Đăng nhập tài khoản khác
              </button>
              {accountListOpen && ACCOUNTS.filter((a) => a.key !== account.key).map((a) => (
                <button type="button" key={a.key} className="acct-mi acct-mi-account" role="menuitem" data-account={a.key} onClick={() => switchAccount(a.key)}>
                  <span className="acct-mi-av">{a.initials}</span><span><b>{a.name}</b><br /><small>{a.role}</small></span>
                </button>
              ))}
              <button type="button" className="acct-mi" role="menuitem" onClick={() => { logout(); location.href = ROUTES.login; }}>{/* */}
                <Svg raw={'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'} />Đăng xuất
              </button>
            </div>
          </div>
          )}
        </header>
        <NavBar cluster={cluster} menu={menu} />
        <div className="body">
          <div className={'sb-wrap' + (collapsed ? ' min' : '')} id="sbWrap">
            <SideBar cluster={cluster} sidebar={sidebar} collapsed={collapsed} />
            <AppButtonWithIcon className="sb-tog" onClick={() => setCollapsed((x) => !x)} title={collapsed ? 'Mở rộng' : 'Thu gọn'} icon="chevLeft" />
          </div>
          <div className="rt">
            {/* breadcrumb là dòng đầu của khung trắng, bỏ dải riêng phía trên — khung trang còn 2 tầng như PM1 */}
            <main className="main">
              <section className="shell"><Breadcrumb items={crumbs} />{children}</section>
            </main>
          </div>
        </div>
      </div>
      <div className="toast-area" id="vungToast" aria-live="polite" />
      {overlays}
    </>
  );
}
