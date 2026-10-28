/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Trang Design System PM2 — tra cứu control chuẩn khi dựng Prototype.
 * Khung trang = CHÍNH AppLayout của Prototype (đầu trang, menu ngang, sidebar, breadcrumb) và khuôn màn thật
 * (shell-head · card · card-title) —.
 * Bản 2 (10/10/2026) — * mỗi control 1 khối (mẫu chạy thật bên trái · quy tắc nguyên văn, cách dùng, màn đang dùng bên phải), không còn ảnh chụp; thêm trang Khuôn loại màn và Bộ luật UI/UX.
 * Định tuyến bằng hash (#/...) để chạy trên Vercel không cần cấu hình rewrite. Tên tiếng Anh (luật). */
import { useEffect, useMemo, useState } from 'react';
import tokensCss from '@/styles/tokens.css?raw';
import tokensJson from './data/pm2.tokens.json';
import AppLayout from '@/layout/AppLayout';
import AppTag from '@/components/app/AppTag';
import AppTabs from '@/components/app/AppTabs';
import AppSearchInput from '@/components/app/AppSearchInput';
import { AppButton, AppButtonWithIcon } from '@/components/app/AppButton';
import { Svg, IC } from '@/lib/icons';
import usage from './data/usage.json';
import harvest from './data/harvest.json';
import rulesData from './data/rules.json';
import referencesData from './data/references.json';
import { GROUPS, ALL_ITEMS } from './catalog';
import { ACCOUNTS } from '@/data/accountStore';   /* Theo màn: in tên vai trò thay mã (rà soát 14/10/2026) */
import Markdown, { Inline, stripMeta } from './Markdown';
/* mẫu code hiện trên trang bỏ mã QD trong chú thích — «// không dòng phụ» ⇒ «// không dòng phụ» */
const stripCodeMeta = (t) => String(t ?? '').replace(/\bQD-\d{2,4}\b(?:\s+D\d{1,2}\s?[A-C]?\b)?(?:\s*\([^()\n]*\))?\s*:?\s*/g, '').replace(/(\/\/|\/\*)\s*[—–-]\s*/g, '$1 ').replace(/(\/\/|\/\*)\s*(?=\n|$|\*\/)/g, '').replace(/[ \t]+$/gm, '');
import ShellHead from './ShellHead';
import { ItemGuideMain, ItemGuideExtra, Frame, Fold, SourceTag, guideStats, ChangelogPage, ContributingPage } from './GuidePages';
import pm1 from './data/pm1_foundation.json';
import pm1Diff from './data/pm1_pm2_diff.json';
import { ItemStyling } from './StylingRef';
import { ItemExamples } from './ItemExamples';   /* ví dụ kiểu HeroUI, mỗi biến thể chạy component thật kèm code */
import { PrinciplesPage, AllControlsPage } from './DocsPages';
import VersionNotice from '@/components/app/VersionNotice';   /* báo có bản live mới — dùng chung component của Prototype (kiểu PM5), giữ câu của */
import changelogData from './data/changelog.json';
import changelogSummary from './data/changelog_summary.json';
import rulesSummary from './data/rules_summary.json';
import uiuxLogo from './uiux-logo.svg';
import { PAGE_EN, GROUP_EN, MENU_EN, ITEM_EN, bi, itemTitle, groupTitle } from './labelsEn';   /* menu tiếng Anh, đầu mục «Tiếng Anh (Tiếng Việt)» */

const BRAND = { logo: uiuxLogo, alt: 'Logo UI/UX', title: 'Design System by TrangNT5', sub: 'Component & Screen Standards for PM2 Prototype' };   /* "câu Chuẩn control và prototype … cũng sửa sang EN" */
const OWNER = { initials: 'NT', name: 'Nguyễn Thùy Trang', role: 'QC Lead - BA' };   /* chỉ 1 vai duy nhất, không đổi tài khoản */
/* Đăng xuất = đi tới /__logout, Service Worker (ds_lock/sw.js) xoá khoá giải mã rồi về màn đăng nhập.
 * Chạy ở máy (vite dev, chưa có Service Worker) thì chỉ tải lại trang. */
const logoutDs = () => { location.href = navigator.serviceWorker && navigator.serviceWorker.controller ? '/__logout' : '/'; };

const PROTOTYPE = 'https://trangnt5-pm2-prototype.web.app';
const GROUP_ICONS = { 'screen-blocks': 'desk', mindset: 'dashboard', input: 'edit', button: 'approve', display: 'db', feedback: 'bell', popup: 'file', nav: 'menu', states: 'swap' };   /* states: thiếu icon ở menu trái (rà soát 14/10/2026) */
/* mục có mẫu rộng (bảng, lưới, khối form) ⇒ mẫu chiếm trọn chiều ngang, thông tin xuống dưới */
const WIDE = new Set(['detail-info', 'missing-hint', 'counter-tables', 'list-screen', 'lookup', 'student-list', 'schedule-fields', 'companions', 'route-options', 'config-days', 'history', 'settings-rows', 'grid', 'blocks', 'field-states', 'list-head', 'table', 'pager', 'filter-panel', 'table-calendar', 'exemption', 'notebox', 'page-actions', 'back', 'stepper', 'detail-blocks', 'status-tags']);
const PLAYBOOK_NAMES = { List: 'Danh sách', CreateEdit: 'Tạo mới · Chỉnh sửa', ViewDetail: 'Xem chi tiết', Others: 'Đặc thù (lưới lịch, popup lớn)' };
const PLAYBOOK_MATCH = {
  List: (r) => !/tao-moi|chinh-sua|\/(Q01|LH-\d{4}-\d{4})$|dang-ky-luot-tai-quay|cau-hinh-thoi-gian/.test(r),
  CreateEdit: (r) => /tao-moi|chinh-sua/.test(r),
  ViewDetail: (r) => /\/(Q01|LH-\d{4}-\d{4})$|cau-hinh-thoi-gian$/.test(r),
  Others: (r) => /dang-ky-luot-tai-quay/.test(r),
};
const componentUse = Object.fromEntries(usage.components.map((c) => [c.name, c]));
const harvestByName = Object.fromEntries(harvest.types.map((t) => [t.name, t]));
/* loại control đo trên màn (tên tiếng Việt) ⇒ mục catalog, để link By Screen dùng mã tiếng Anh */
const ITEM_BY_HARVEST = Object.fromEntries(ALL_ITEMS.flatMap((it) => [it.harvest, ...(it.alsoHarvest || [])].filter(Boolean).map((h) => [h, it])).reverse());
const driftTypes = harvest.types.filter((t) => t.variants.length > 1);
const ruleByCode = Object.fromEntries(rulesData.sections.flatMap((s) => s.rules.map((r) => [r.code, { ...r, section: s.title }])));
/* UX-J Kiểm thử Prototype và UX-K Vệ sinh thư mục Output BA là luật QUY TRÌNH, tách khỏi Bộ luật UI/UX sang trang riêng */
const isProcess = (s) => /\bUX-[JK]\b/.test(s.title);
const ruleCount = rulesData.sections.filter((s) => !isProcess(s)).reduce((n, s) => n + s.rules.length, 0);
const processCount = rulesData.sections.filter(isProcess).reduce((n, s) => n + s.rules.length, 0);
const openedRoutes = harvest.routes.filter((r) => r.opened);

/* 19/10/2026 «all-controls» đổi thành «all-components» — link cũ đã gửi đi vẫn mở đúng trang */
const readHash = () => (location.hash.replace(/^#\/?/, '').replace(/^all-controls$/, 'all-components') || 'overview');
/* bỏ ký hiệu nhấn mạnh của file luật khi trình bày cho người dựng màn — chữ giữ nguyên văn */
/* ký hiệu cấm trong luật nghĩa là «không/cấm» ⇒ đổi thành chữ trước khi bỏ emoji, không thì câu bị đảo nghĩa */
const banToText = (t) => String(t || '').replace(/\u26D4\uFE0F?\s*(\**)\s*(?=(không|cấm|KHÔNG|CẤM)[\s*`]|(không|cấm|KHÔNG|CẤM)$)/gu, '$1').replace(/\u26D4\uFE0F?\s*/gu, 'không ');
const clean = (t) => banToText(t).replace(/[\u{1F100}-\u{1F2FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').replace(/\s{2,}/g, ' ').trim();
const stripIcon = (t) => t.replace(/^[^\p{L}\p{N}]+/u, '').trim();

/* ── menu: đúng cấu trúc menu ngang + sidebar của AppLayout ── */
const PAGES = [
  { id: 'overview', icon: 'dashboard', label: 'Tổng quan' },
  { id: 'foundations', icon: 'chart', label: 'Nền tảng' },
  { id: 'principles', icon: 'file', label: 'Nguyên tắc thiết kế' },
  { id: 'all-components', icon: 'edit', label: 'Tất cả control', count: GROUPS.reduce((n, g) => n + g.items.length, 0) },
  { id: 'group/mindset', icon: GROUP_ICONS.mindset, label: 'Lưới · khối · trạng thái ô', count: GROUPS[0].items.length },
  { id: 'playbooks', icon: 'building', label: 'Khuôn loại màn' },
  { id: 'rules', icon: 'file', label: 'Bộ luật UI/UX', count: ruleCount },
  { id: 'process', icon: 'file', label: 'Quy trình dựng và kiểm Prototype', count: processCount },
  ...GROUPS.slice(1).map((g) => ({ id: 'group/' + g.id, icon: GROUP_ICONS[g.id], label: g.name, count: g.items.length })),
  { id: 'screens', icon: 'desk', label: 'Theo màn' },
  { id: 'drift', icon: 'warning', label: 'Báo cáo lệch', count: driftTypes.length },
  { id: 'pm1-diff', icon: 'swap', label: 'Lệch PM1 · PM2', count: pm1Diff.rows.length },
  { id: 'changelog', icon: 'calendar', label: 'Nhật ký phiên bản', count: changelogData.entries.length },
  { id: 'contributing', icon: 'users', label: 'Hướng dẫn đóng góp' },
];
/* trang tài liệu tra cứu — đọc nguyên văn file gốc qua references.json */
const REFERENCE_PAGES = [
  { id: 'messages', icon: 'bell', label: 'Message List', sub: 'Mã câu thông báo dùng trong Prototype — gọi msg(mã, …), không gõ cứng câu. Nguồn PM2_MessageList.md (Common Kit)' },
  { id: 'common', icon: 'file', label: 'Common Rules', sub: 'Quy tắc chung toàn hệ thống — đứng trên SRS. Nguồn CommonRules/common_rules.md' },
  { id: 'conventions', icon: 'file', label: 'Quy ước dựng code', sub: 'Quy ước FE, tên trường, mã trạng thái, ánh xạ lớp CSS, đặt tên. Nguồn TrangNT5_Prototype_FE_Conventions.md và thư mục Prototype_Conventions' },
  { id: 'standards', icon: 'chart', label: 'Chuẩn thiết kế đã chốt', sub: 'Màu trạng thái, khuôn màn, bàn giao FE. Nguồn thư mục DesignStandards' },
  { id: 'lessons', icon: 'warning', label: 'Ngoại lệ và lịch sử luật', sub: 'Ngoại lệ đã chốt so với Design System và lịch sử sửa bộ luật UX, 4 Khuôn loại màn. Lỗi đã phát hiện ở màn mẫu nằm ở trang Khuôn loại màn, mục Lỗi đã phát hiện của từng loại' },
];
PAGES.splice(PAGES.findIndex((p) => p.id === 'rules') + 1, 0, ...REFERENCE_PAGES.map((r) => ({ id: r.id, icon: r.icon, label: r.label, count: referencesData.references[r.id].reduce((n, d) => n + d.sections.length, 0) })));
PAGES.forEach((p) => { p.en = PAGE_EN[p.id] || (p.id.startsWith('group/') && GROUP_EN[p.id.slice(6)]) || p.label; });
const pageById = (id) => PAGES.find((p) => p.id === id);
const pageOf = (route) => pageById(route) || PAGES[0];
function layoutFor(route) {
  const item = (p) => ({ icon: p.icon, label: p.en + (p.count !== undefined ? ' (' + p.count + ')' : ''), href: '#/' + p.id, active: p.id === route });
  /* R1 — mỗi chủ đề 1 trang chủ: tách «Tư duy dựng màn» (cách dựng) khỏi «Tài liệu chuẩn» (tra cứu nguyên văn) · gộp 2 trang lệch vào «Độ nhất quán» */
  const mindset = ['principles', 'group/mindset', 'playbooks', 'rules', 'process'];
  const refs = REFERENCE_PAGES.map((r) => r.id);
  const drift = ['drift', 'pm1-diff'];
  const controls = [pageById('all-components'), ...PAGES.filter((p) => p.id.startsWith('group/') && p.id !== 'group/mindset')];
  const menu = [
    { ...item(PAGES[0]), label: 'Overview' },
    { ...item(PAGES[1]), label: 'Foundations' },
    /* menu trên chỉ hiện tên khối (dropdown: false), mục con chỉ ở menu trái ⇒ 2 menu không trùng nhau, như Prototype */
    { icon: 'dashboard', label: MENU_EN.mindset, dropdown: false, active: mindset.includes(route), children: mindset.map((id) => item(pageById(id))) },
    { icon: 'edit', label: MENU_EN.controls, dropdown: false, active: controls.some((p) => p.id === route), children: controls.map(item) },
    { icon: 'file', label: MENU_EN.refs, dropdown: false, active: refs.includes(route), children: refs.map((id) => item(pageById(id))) },
    { ...item(pageById('screens')), label: 'By Screen' },
    { icon: 'warning', label: MENU_EN.drift, dropdown: false, active: drift.includes(route), children: drift.map((id) => item(pageById(id))) },
    { ...item(pageById('changelog')), label: 'Changelog' },
    { ...item(pageById('contributing')), label: 'Contributing' },
  ];
  /* menu trái chỉ hiện các mục của khối đang chọn trên menu trên — như Prototype thật */
  const top = menu.find((m) => m.active) || menu[0];
  return { menu, sidebar: { group: top.label, items: top.children || [top] }, breadcrumb: [{ label: 'Design System', href: '#/overview' }, { label: pageOf(route).en }] };
}

/* Khu tìm kiếm đúng khuôn màn danh sách thật — 1 dòng cố định, KHÔNG dải gập «Điều kiện tìm kiếm»
 (markup chép từ ReceptionDeskList.jsx). Ô tìm luôn nằm trong khối lọc, ⛔ đặt trần ở đầu trang */
function SearchPanel({ value, onChange, placeholder }) {
  return <div className="shell-filters"><div className="filter-panel is-fixed">
    <div className="filter-body filter-row-main"><AppSearchInput className="filter-cell filter-wide" value={value} onChange={onChange} placeholder={placeholder} /></div>
  </div></div>;
}


function ScreenTags({ list }) {
  if (!list || !list.length) return <span className="sd-muted">Chưa đo thấy trên màn nào</span>;
  return <span className="sd-tags">{list.map((s) => { const route = s.split(' › ')[0]; return <a key={s} className="sd-tag" href={route.startsWith('/') ? PROTOTYPE + route : undefined} target="_blank" rel="noreferrer">{s}</a>; })}</span>;
}

/* 1 quy tắc nguyên văn từ; mã QD- là quyết định trong Sổ BA PM2 */
function RuleLine({ code }) {
  const r = ruleByCode[code];
  const qd = (rulesData.decisions || {})[code];
  /* QD hiện ý chính (changelog_summary.json), nguyên văn gập lại */
  const sum = (changelogSummary.entries || {})[code];
  /* giữ ý chính quyết định (đã chốt «QĐ viết ngắn gọn ý chính»), bỏ chip mã QD và bỏ khối Nguyên văn trùng Nhật ký phiên bản (R3) */
  if (qd) return <li className="sd-rule-line"><AppTag className="tag sd-rule">Đã chốt</AppTag><div>
    {sum ? <ul className="sd-qd-points">{sum.points.map((p) => <li key={p}><Inline text={p} /></li>)}</ul> : <Inline text={clean(qd.text)} />}
  </div></li>;
  if (!r) return <li className="sd-rule-line"><AppTag className="tag sd-rule">{code}</AppTag><span className="sd-muted">Mã dữ liệu chuẩn của dự án</span></li>;
  /* luật UX dài ⇒ ý chính 1 dòng (rules_summary.json), nguyên văn gập lại */
  const short = (rulesSummary.entries || {})[code];
  return <li className="sd-rule-line"><AppTag className="tag sd-rule">{code}</AppTag><div>
    <Inline text={short || clean(r.rule)} />
    {short ? <details className="sd-rule-th"><summary>Nguyên văn</summary><Inline text={clean(r.rule)} /></details> : null}
    {r.threshold ? <details className="sd-rule-th"><summary>Ngưỡng đo</summary><Inline text={clean(r.threshold)} /></details> : null}
  </div></li>;
}

/* Cách dùng: chuỗi ⇒ 1 khối; mảng { group?, label, code } ⇒ mỗi kiểu 1 khối riêng, có nút Chép */
function CopyCode({ text }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    const ok = () => { setDone(true); setTimeout(() => setDone(false), 1500); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, () => {});
    else { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } finally { t.remove(); } }
  };
  text = stripCodeMeta(text);
  return <div className="sd-code-wrap"><pre className="sd-code">{text}</pre><button type="button" className="sd-copy" onClick={copy} aria-label="Copy đoạn code">{done ? 'Copied' : 'Copy'}</button></div>;
}

/* mảng: { note } ⇒ dòng ghi chú · { group?, label, code, preview? } ⇒ 1 khối; có preview thì xếp cặp «nút chạy thật | code của nút đó» */
function UsageCode({ code }) {
  if (!Array.isArray(code)) return <CopyCode text={code} />;
  const rows = []; let lastGroup = null;
  code.forEach((s, i) => {
    if (s.note) { rows.push(<div key={i} className="sd-usage-note">{stripMeta(s.note)}</div>); return; }
    if (s.group && s.group !== lastGroup) rows.push(<div key={'g' + i} className="sd-usage-group">{stripMeta(s.group)}</div>);
    lastGroup = s.group || null;
    const Preview = s.preview;
    /* có preview: tên ⇒ control chạy thật ⇒ Usage (code) — xếp dọc */
    rows.push(<div key={i} className={'sd-usage-item' + (s.group ? ' is-grouped' : '') + (Preview ? ' is-pair' : '')}>
      <div className="sd-usage-label">{stripMeta(s.label)}</div>
      {Preview ? <div className="sd-usage-preview"><Preview /></div> : null}
      {Preview ? <div className="sd-usage-cap">Usage</div> : null}
      <CopyCode text={s.code} />
    </div>);
  });
  return <div className="sd-usage">{rows}</div>;
}

function ItemBlock({ item, index }) {
  const comps = item.components || (item.component ? [item.component] : []);
  const usedBy = [...new Set(comps.flatMap((c) => (componentUse[c] ? componentUse[c].usedBy : [])))];
  const harvested = [item.harvest, ...(item.alsoHarvest || [])].filter(Boolean).map((n) => harvestByName[n]).filter(Boolean);
  const Demo = item.demo; const wide = WIDE.has(item.id);
  return <section className={'sd-block' + (wide ? ' is-wide' : '')} id={'item-' + item.id}>
    <header className="sd-block-head">
      <span className="sd-block-no">{String(index + 1).padStart(2, '0')}</span>
      <h2 className="sd-block-title">{itemTitle(item)}</h2>
      <span className="sd-block-codes">{comps.map((c) => <code key={c}>{c}</code>)}</span>
      <ItemStatus usedBy={usedBy.length} harvested={harvested.length} stats={guideStats(item.id)} />
    </header>
    {/* khuôn khung Mẫu thật → Usage → Quy tắc → Khi dùng | Khi không dùng → khung phụ gập; Mẫu thật PHẢI đứng đầu (cổng BlockFidelity tìm #item-x .card đầu tiên) */}
    <div className="sd-frames">
      <Frame title="Live Demo (Mẫu thật)" cls="is-demo"><div className="sd-stage">{Demo ? <Demo /> : null}</div></Frame>
      <Frame title="Usage (Cách dùng)"><UsageCode code={item.code} /></Frame>
      <ItemExamples id={item.id} />
      {item.rules && item.rules.length ? <Frame title="Rules (Quy tắc)"><ul className="sd-rule-list">{item.rules.map((c) => <RuleLine key={c} code={c} />)}</ul></Frame> : null}
      <ItemGuideMain id={item.id} />
      <ItemGuideExtra id={item.id} nameOf={nameOf} />
      {comps.length || harvested.length ? <Fold title="Used in Screens (Màn đang dùng)"><div className="sd-meta">
        {comps.length ? <div className="sd-fact"><span className="sd-fact-k">Thư mục màn đang dùng</span>{usedBy.length ? <span className="sd-tags">{usedBy.map((s) => <span key={s} className="sd-tag is-static">{s}</span>)}</span> : <span className="sd-muted">qua component dùng chung khác</span>}</div> : null}
        {harvested.map((t) => <div key={t.name} className="sd-fact"><span className="sd-fact-k">Đo trên màn thật · {t.name}</span><span>{t.variants.reduce((n, v) => n + v.count, 0)} chỗ · {t.variants.length > 1 ? <a className="sd-badge is-drift" href="#/drift">{t.variants.length} kiểu — lệch</a> : t.variants.length ? <span className="sd-badge is-ok">Đồng nhất</span> : <span className="sd-badge">Chỉ hiện khi có trạng thái riêng</span>}</span></div>)}
      </div></Fold> : null}
      <ItemStyling id={item.id} />
    </div>
  </section>;
}

/* tình trạng của mục — đo được: số thư mục màn dùng component, có đo trên màn thật, số ý AI Inferred chờ duyệt */
const nameOf = (id) => { const it = ALL_ITEMS.find((x) => x.id === id); return it ? itemTitle(it) : id; };
function ItemStatus({ usedBy, harvested, stats }) {
  const live = usedBy > 0 || harvested > 0;
  return <span className="sd-block-status">
    <AppTag className={'tag ' + (live ? 'tag-completed' : 'tag-draft')}>{live ? 'Đang dùng trên màn' : 'Chưa đo thấy trên màn'}</AppTag>
  </span>;
}

function ItemList({ items }) {
  return <>
    {items.length > 3 ? <nav className="sd-jump is-grid">{items.map((it, i) => <a key={it.id} href={'#item-' + it.id} onClick={(e) => { e.preventDefault(); document.getElementById('item-' + it.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} title={itemTitle(it)}><span className="sd-jump-no">{String(i + 1).padStart(2, '0')}</span><span className="sd-jump-name">{itemTitle(it)}</span></a>)}</nav> : null}
    {items.map((it, i) => <ItemBlock key={it.id} item={it} index={i} />)}
  </>;
}

/* thứ tự dựng 1 màn mới — nội dung giữ nguyên văn bản danh sách cũ, chỉ đổi cách trình bày sang dạng bước */
const BUILD_STEPS = [
  { icon: 'building', title: 'Khuôn loại màn', href: '#/playbooks', cta: 'Mở Khuôn loại màn', desc: 'Xác định màn thuộc loại nào (Danh sách · Tạo/Sửa · Chi tiết · Đặc thù), đọc khuôn của loại đó.' },
  { icon: 'dashboard', title: 'Lưới · khối · trạng thái ô', href: '#/group/mindset', cta: 'Mở Lưới · khối · trạng thái ô', desc: 'Chia khối fields, chọn số cột cho từng ô, trạng thái bắt buộc, lỗi, khoá.' },
  { icon: 'view', title: 'Nhóm Control', cta: 'Gõ tên control vào ô tìm', desc: 'Gõ tên control vào ô tìm (vd «ô chọn», «tag», «xóa»), lấy đúng component và đoạn «Usage».' },
  { icon: 'file', title: 'Bộ luật UI/UX', href: '#/rules', cta: 'Mở Bộ luật UI/UX', desc: 'Tra mã luật khi cần nguyên văn ngưỡng.' },
  { icon: 'plus', title: 'Control chưa có mục', cta: 'src/components/app', desc: 'Dựng component chung trong src/components/app rồi thêm mục — lệnh deploy chặn nếu thiếu.' },
];

function Overview() {
  const found = harvest.types.filter((t) => t.variants.length);
  /* hàng thẻ số liệu theo khuôn StatRow (DesignStandards/tokens/StatRow.jsx): ô icon vuông nền xám · số 24px đậm · nhãn 12px dưới số */
  const stats = [['edit', ALL_ITEMS.length, 'mục control dựng chạy thật'], ['building', usage.components.length, 'components dùng chung'], ['file', ruleCount, 'luật UI/UX'], ['desk', openedRoutes.length, 'màn đã quét · ' + found.length + '/' + harvest.types.length + ' loại control'], ['warning', driftTypes.length, 'loại control đang lệch']];
  return <>
    <ShellHead icon="dashboard" title="Design System PM2" sub="Tra cứu control chuẩn trước khi dựng màn Prototype — mọi mẫu dùng chính component và CSS của Prototype" />
    <div className="sd-stats">{stats.map(([ic, n, t], i) => <div key={t} className={'sd-stat' + (i === 4 && n ? ' is-drift' : '')}><span className="sd-stat-icon"><Svg name={ic} /></span><span className="sd-stat-text"><b>{n}</b><span>{t}</span></span></div>)}</div>
    <div className="card sd-flow-card">
      <div className="sd-flow-head"><h2 className="card-title">Thứ tự dùng khi dựng 1 màn mới</h2></div>
      <ol className="sd-flow">
        {BUILD_STEPS.map((s, i) => <li key={s.title} className="sd-flow-step">
          <div className="sd-flow-rail"><span className="sd-flow-num">{i + 1}</span></div>
          <div className="sd-flow-body">
            <div className="sd-flow-top"><span className="sd-flow-icon"><Svg name={s.icon} /></span><span className="sd-flow-kicker">STEP {String(i + 1).padStart(2, '0')}</span></div>
            <h3 className="sd-flow-title">{s.title}</h3>
            <p className="sd-flow-desc">{s.desc}</p>
            {s.href ? <a className="sd-flow-link" href={s.href}>{s.cta}<Svg name="chevRight" /></a> : <span className="sd-flow-link is-static">{s.cta}</span>}
          </div>
        </li>)}
      </ol></div>
  </>;
}

/* ── Nền tảng: 9 phần theo khung design system quốc tế; số liệu đọc từ pm2.tokens.json (sinh từ CSS thật), luật trích nguyên văn bộ luật UI/UX ── */
const resolveToken = (v) => { let x = v; for (let i = 0; i < 6 && typeof x === 'string' && x.startsWith('{'); i++) x = x.slice(1, -1).split('.').reduce((o, k) => o[k], tokensJson).$value; return x; };
const luminance = ({ components }) => { const [r, g, b] = components.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const semanticColors = Object.entries(tokensJson.semantic.color).map(([k, t]) => ({ key: k, css: t.$extensions['vn.pm2'].css, source: t.$extensions['vn.pm2'].source, value: resolveToken(t.$value) }));
const colorByKey = Object.fromEntries(semanticColors.map((c) => [c.key, c.value]));
const COLOR_ROLES = [
  ['Action (Thao tác)', /^brand/, 'Nút chính, focus, mục đang chọn — xanh dương theo PM1 (pm1-look.css ghi đè tokens.css)'],
  ['Identity · Danger (Nhận diện · nguy hiểm)', /^(identity|danger)/, 'Đỏ chỉ cho thanh tiêu đề, logo, chấm chuông và thao tác nguy hiểm'],
  ['Link (Liên kết)', /^link/, 'Chỉ cho liên kết văn bản'],
  ['Status (Trạng thái)', /^(ok|warn|err|info)/, 'Thành công · cảnh báo · lỗi · thông tin — mỗi trạng thái 3 bậc chữ, nền, viền'],
  ['Text (Chữ)', /^ink/, '4 bậc; ink-4 chỉ cho icon trang trí và placeholder'],
  ['Surface · Border (Bề mặt và viền)', /^(page|surface|muted|hovered|line)/, 'Nền trang, nền thẻ, viền'],
  ['Dòng bảng và riêng màn', /^(row|unassigned)/, 'Nền dòng khi rê chuột, dòng quá giờ, dòng đang diễn ra, nhãn Chưa xếp'],
];
const CONTRAST_PAIRS = [
  ...['ink-1', 'ink-2', 'ink-3', 'ink-4', 'link', 'link-hover', 'brand', 'brand-hover', 'brand-active', 'identity', 'danger', 'ok', 'warn', 'err', 'info', 'unassigned'].map((k) => [k, 'surface']),
  ['ink-1', 'page'], ['ink-2', 'page'], ['ink-3', 'page'],
  ['ok', 'ok-bg'], ['warn', 'warn-bg'], ['err', 'err-bg'], ['info', 'info-bg'], ['brand', 'brand-weak'], ['identity', 'identity-weak'], ['link', 'brand-weak'],
].filter(([f, b]) => colorByKey[f] && colorByKey[b]);
const verdict = (r) => (r >= 4.5 ? ['tag-completed', 'Đạt AA'] : r >= 3 ? ['tag-pending', 'Chỉ chữ ≥ 18px hoặc icon'] : ['tag-rejected', 'Không dùng cho chữ']);
const typeScale = [...tokensCss.matchAll(/(--fs-[\w-]+)\s*:\s*([^;]+);\s*\/\*\s*([^*]*?)\s*\*\//g)].map((m) => ({ css: m[1], size: m[2].trim(), note: m[3].replace(/\s+/g, ' ').trim(), weight: (m[3].match(/^\s*(\d{3})/) || [, '400'])[1] }));
const groupOf = (name) => Object.entries(tokensJson.semantic[name] || {}).map(([k, t]) => ({ key: k, css: t.$extensions['vn.pm2'].css, raw: t.$value }));
const dimText = (v) => (v && v.unit ? v.value + v.unit : String(v));
const antdGlobal = tokensJson.component.antd.global;
const FOUNDATION_SECTIONS = [['fd-color', 'Màu'], ['fd-type', 'Chữ'], ['fd-space', 'Khoảng cách'], ['fd-grid', 'Lưới'], ['fd-radius', 'Bo góc'], ['fd-shadow', 'Đổ bóng'], ['fd-icon', 'Icon'], ['fd-motion', 'Chuyển động'], ['fd-bans', 'Điều cấm'], ['fd-writing', 'Văn phong UX']];

function RuleList({ codes }) {
  const list = codes.map((c) => ruleByCode[c]).filter(Boolean);
  return <div className="sd-md-table"><table className="sd-table sd-rules"><thead><tr><th>Mã</th><th>Quy tắc</th><th>Ngưỡng</th></tr></thead>
    <tbody>{list.map((r) => <tr key={r.code}><td><AppTag className="tag sd-rule">{r.code}</AppTag></td><td><Inline text={clean(r.rule)} /></td><td><Inline text={clean(r.threshold)} /></td></tr>)}</tbody></table></div>;
}
const SourceLine = ({ children }) => <p className="sd-source">Nguồn: {children}</p>;
/* khối bổ sung theo Design System PM1 — nhãn Based on Docs, chỗ mâu thuẫn PM2 đã bỏ */
const Pm1Tag = ({ src }) => <SourceTag label="Based on Docs" src={src || 'PM1 DS'} />;
function Pm1Block({ title = 'Bổ sung theo Design System PM1', src, points, rows, cols, children }) {
  return <div className="sd-pm1">
    <div className="sd-label">{title} <Pm1Tag src={src} /></div>
    {points ? <ul className="sd-pm1-list">{points.map((p, i) => <li key={i}><Inline text={typeof p === 'string' ? p : p.t} /></li>)}</ul> : null}
    {rows ? <div className="sd-md-table"><table className="sd-table"><thead><tr>{cols.map(([, h]) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{cols.map(([k]) => <td key={k}>{k === 'token' || k === 'name' || k === 'value' || k === 'icon' ? <code>{String(r[k])}</code> : String(r[k])}</td>)}</tr>)}</tbody></table></div> : null}
    {children}
  </div>;
}

function downloadTokens() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(tokensJson, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'pm2.tokens.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Foundations() {
  const counts = tokensJson.$extensions['vn.pm2'];
  const total = (o) => Object.values(o).reduce((n, v) => n + (v && v.$type ? 1 : v && typeof v === 'object' ? total(v) : 0), 0);
  return <>
    <ShellHead icon="chart" title="Foundations (Nền tảng)" sub={'Nền tảng thị giác (foundations) của PM2 — ' + total(tokensJson.primitive) + ' tokens primitive · ' + total(tokensJson.semantic) + ' tokens semantic · ' + total(tokensJson.component) + ' tokens component, sinh từ CSS thật lúc ' + new Date(counts.generatedAt).toLocaleString('vi-VN')}>
      <AppButtonWithIcon className="btn" onClick={downloadTokens} iconRaw={'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>'}>Tải pm2.tokens.json</AppButtonWithIcon>
    </ShellHead>
    <nav className="sd-jump" aria-label="Các phần của trang Nền tảng">{FOUNDATION_SECTIONS.map(([id, label]) => <a key={id} href={'#' + id} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{label}</a>)}</nav>

    <div className="card" id="fd-tokens"><h2 className="card-title">Design token (W3C DTCG)</h2>
      <p>File <code>pm2.tokens.json</code> theo định dạng <b>W3C Design Tokens Community Group</b> bản 2025.10, đọc được bằng Tokens Studio for Figma, Style Dictionary. Ba tầng:</p>
      <div className="sd-facts">
        <div className="sd-fact"><span className="sd-fact-k">primitive</span><span>Bảng màu gốc. Tên = họ màu theo sắc độ HSL + bậc độ tối ×1000 (sinh tự động; dải xám ngả xanh kiểu slate nằm trong họ <code>blue</code>). Không dùng thẳng trong màn.</span></div>
        <div className="sd-fact"><span className="sd-fact-k">semantic</span><span>Token theo vai trò — đúng các biến CSS <code>--color-*</code>, <code>--fs-*</code>, <code>--radius-*</code>… Màn chỉ dùng tầng này.</span></div>
        <div className="sd-fact"><span className="sd-fact-k">component</span><span>Khoá theme Ant Design (toàn cục và từng component); giá trị trùng token semantic thì trỏ alias về token đó.</span></div>
      </div>
      <SourceLine><code>src/styles/tokens.css</code> → <code>src/styles/pm1-look.css</code> (ghi đè) · <code>DesignStandards/tokens/pm2-antd-theme.js</code> · sinh bằng <code>_tools/TrangNT5_GenTokens.mjs</code> mỗi lần deploy</SourceLine>
    </div>

    <div className="card" id="fd-color"><h2 className="card-title">Color (Màu)</h2>
      {/* Màu chủ đạo: 2 màu nhìn là biết ngay — giá trị đọc thẳng token, đổi token thì khối tự đổi */}
      <div className="sd-color-role" id="fd-color-main"><div className="sd-label">Màu chủ đạo</div><p className="sd-muted">Thanh tiêu đề dùng đỏ nhận diện · nút chủ đạo dùng xanh thao tác (theo PM1)</p>
        <div className="sd-swatches">{[['Thanh tiêu đề: đỏ', 'identity'], ['Nút chủ đạo: xanh', 'brand']].map(([label, k]) => { const c = semanticColors.find((x) => x.key === k); return c ? <div key={k} className="sd-swatch"><span style={{ background: c.value.hex }} /><b>{label}</b><small>{c.css + ' · ' + c.value.hex}</small></div> : null; })}</div></div>
      {COLOR_ROLES.map(([label, re, note]) => { const list = semanticColors.filter((c) => re.test(c.key)); return list.length ? <div key={label} className="sd-color-role">
        <div className="sd-label">{label}</div><p className="sd-muted">{note}</p>
        <div className="sd-swatches">{list.map((c) => <div key={c.key} className="sd-swatch"><span style={{ background: c.value.alpha < 1 ? 'rgba(' + c.value.components.map((x) => Math.round(x * 255)).join(',') + ',' + c.value.alpha + ')' : c.value.hex }} /><code>{c.css}</code><small>{c.value.hex}{c.value.alpha < 1 ? ' · ' + Math.round(c.value.alpha * 100) + '%' : ''}</small></div>)}</div>
      </div> : null; })}
      <div className="sd-label">Cặp tương phản (contrast) — WCAG 2.2 mục 1.4.3: chữ thường ≥ 4.5:1, chữ ≥ 18px và icon ≥ 3:1</div>
      <div className="sd-md-table"><table className="sd-table"><thead><tr><th>Mẫu</th><th>Chữ</th><th>Nền</th><th>Tỉ lệ</th><th>Kết luận</th></tr></thead>
        <tbody>{CONTRAST_PAIRS.map(([f, b]) => { const r = contrast(colorByKey[f], colorByKey[b]); const [cls, txt] = verdict(r); return <tr key={f + b}>
          <td><span className="sd-contrast-sample" style={{ color: colorByKey[f].hex, background: colorByKey[b].hex }}>Aa Văn bản</span></td>
          <td><code>--color-{f}</code></td><td><code>--color-{b}</code></td><td>{r.toFixed(2)}:1</td><td><AppTag className={'tag ' + cls}>{txt}</AppTag></td></tr>; })}</tbody></table></div>
      <RuleList codes={['UX-C4', 'UX-L25']} />
      <SourceLine>tỉ lệ tính bằng công thức độ sáng tương đối của WCAG 2.2 trên giá trị token đang có hiệu lực</SourceLine>
    </div>

    <div className="card" id="fd-type"><h2 className="card-title">Typography (Chữ)</h2>
      <div className="sd-type-list">{typeScale.map((t) => <div key={t.css} className="sd-type-row">
        <span style={{ fontSize: 'var(' + t.css + ')', fontWeight: +t.weight, lineHeight: 1.4 }}>Quản lý lịch hẹn thăm gặp</span>
        <code>{t.css}</code><span className="sd-muted">{t.size} · {t.note}</span></div>)}</div>
      <RuleList codes={['UX-A1', 'UX-A2', 'UX-A3']} />
      <Pm1Block src="PM1 DS › Kiểu chữ" points={pm1.type} />
      <SourceLine><code>src/styles/tokens.css</code> (cỡ và độ đậm ghi kèm biến) · bộ luật UI/UX nhóm UX-A</SourceLine>
    </div>

    <div className="card" id="fd-space"><h2 className="card-title">Spacing (Khoảng cách)</h2>
      <p className="sd-muted">Mọi khoảng cách là bội số của 4px (UX-B5).</p>
      <div className="sd-space-scale">{[4, 8, 12, 16, 20, 24, 32].map((n) => <div key={n}><span style={{ width: n * 4 + 'px' }} /><code>{n}px</code></div>)}</div>
      <RuleList codes={['UX-B5', 'UX-B4', 'UX-L22']} />
      <Pm1Block src="PM1 DS › Khoảng cách" points={[pm1.spacingNote]} rows={pm1.spacing} cols={[['token', 'Token'], ['value', 'Giá trị'], ['use', 'Dùng khi']]} />
      <SourceLine>bộ luật UI/UX nhóm UX-B và UX-L (chưa có token khoảng cách riêng trong CSS)</SourceLine>
    </div>

    <div className="card" id="fd-grid"><h2 className="card-title">Layout Grid (Lưới)</h2>
      <div className="sd-grid12">{Array.from({ length: 12 }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
      {[[3, 3, 3, 3], [4, 4, 4], [6, 6], [3, 9]].map((row) => <div key={row.join('-')} className="sd-grid12 is-spans">{row.map((s, i) => <span key={i} style={{ gridColumn: 'span ' + s }}>span {s}</span>)}</div>)}
      <RuleList codes={['UX-B1', 'UX-B2', 'UX-B6']} />
      <SourceLine>bộ luật UI/UX nhóm UX-B · mẫu ô thật ở trang <a href="#/group/mindset">Lưới · khối · trạng thái ô</a></SourceLine>
    </div>

    <div className="card" id="fd-radius"><h2 className="card-title">Radius (Bo góc)</h2>
      <div className="sd-token-boxes">{groupOf('radius').map((r) => <div key={r.key}><span style={{ borderRadius: 'var(' + r.css + ')' }} /><code>{r.css}</code><small>{dimText(r.raw)}</small></div>)}</div>
      <RuleList codes={['UX-G2']} />
      <SourceLine><code>src/styles/tokens.css</code> — radius-lg, radius-xl, radius-2xl cùng 12px</SourceLine>
    </div>

    <div className="card" id="fd-shadow"><h2 className="card-title">Elevation (Đổ bóng)</h2>
      <div className="sd-token-boxes">{groupOf('shadow').map((s) => <div key={s.key}><span style={{ boxShadow: 'var(' + s.css + ')' }} /><code>{s.css}</code></div>)}</div>
      <Pm1Block src="PM1 DS › Đổ bóng" points={pm1.shadowRules} rows={pm1.shadow} cols={[['level', 'Bậc'], ['value', 'Giá trị'], ['use', 'Gán cho']]} />
      <SourceLine><code>src/styles/tokens.css</code> — bóng trung tính, không nhuốm màu nhấn; nút không có bóng (theme antd Button)</SourceLine>
    </div>

    <div className="card" id="fd-icon"><h2 className="card-title">Icon ({Object.keys(IC).length})</h2>
      <div className="sd-icons">{Object.keys(IC).map((k) => <div key={k}><Svg name={k} /><code>{k}</code></div>)}</div>
      <RuleList codes={['UX-A5', 'UX-A13', 'UX-C2', 'UX-C4', 'UX-F4']} />
      <Pm1Block src="PM1 DS › Bộ biểu tượng" points={pm1.icons.spec} />
      <Pm1Block title="Bảng hành động → icon của PM1 (tên icon lucide, tham chiếu khi chọn icon Svg của PM2)" src="PM1 DS › Bộ biểu tượng" rows={pm1.icons.map} cols={[['action', 'Hành động'], ['icon', 'Icon PM1']]} />
      <SourceLine><code>src/lib/icons.jsx</code> — gọi bằng <code>{'<Svg name="…" />'}</code> hoặc <code>AppButtonWithIcon icon="…"</code></SourceLine>
    </div>

    <div className="card" id="fd-motion"><h2 className="card-title">Motion (Chuyển động)</h2>
      <div className="sd-kv">{[...groupOf('easing').map((e) => [e.css, 'cubic-bezier(' + e.raw.join(', ') + ')']),
        ...Object.entries(antdGlobal).filter(([k]) => /^motion/.test(k)).map(([k, t]) => ['antd ' + k, t.$value.value + t.$value.unit])].map(([k, v]) => <div key={k}><code>{k}</code><span>{v}</span></div>)}</div>
      <Pm1Block title="Thời lượng — bổ sung theo Design System PM1" src="PM1 DS › Chuyển động" rows={pm1.motion.duration} cols={[['name', 'Tên'], ['ms', 'ms'], ['use', 'Dùng cho']]} />
      <Pm1Block title="Delay (Độ trễ)" src="PM1 DS › Chuyển động" rows={pm1.motion.delay} cols={[['name', 'Tên'], ['ms', 'ms'], ['use', 'Dùng cho']]} />
      <Pm1Block title="Đường cong và kiểu chuyển động" src="PM1 DS › Chuyển động" points={pm1.motion.rules} rows={pm1.motion.easing} cols={[['name', 'Tên'], ['value', 'Giá trị'], ['use', 'Dùng cho']]} />
      <SourceLine><code>src/styles/tokens.css</code> · theme antd <code>pm2-antd-theme.js</code> · Design System PM1 mục Chuyển động</SourceLine>
    </div>

    <div className="card" id="fd-bans"><h2 className="card-title">Điều cấm ({pm1.bans.length})</h2>
      <Pm1Block title="Điều cấm theo Design System PM1 (đã bỏ điều mâu thuẫn PM2)" src="PM1 DS › Quy tắc và cấm kỵ" points={pm1.bans} />
    </div>

    <div className="card" id="fd-writing"><h2 className="card-title">Văn phong UX (UX writing)</h2>
      <RuleList codes={['UX-A8', 'UX-A9', 'UX-A12', 'UX-A13', 'UX-A15', 'UX-L15', 'UX-E3', 'UX-E4', 'UX-L12', 'UX-L17']} />
      <SourceLine>bộ luật UI/UX · câu thông báo tra <code>PM2_MessageList.md</code> trước (UX-E3)</SourceLine>
    </div>
  </>;
}


function PlaybooksPage() {
  const [k, setK] = useState(rulesData.playbooks[0].name);
  return <>
    <ShellHead icon="building" title="Screen Patterns (Khuôn loại màn)" sub="4 khuôn theo loại màn của bộ dựng Prototype — đọc nguyên văn từ file Playbook. Dựng màn mới: chọn đúng loại, bám bố cục và Bộ câu hỏi chuẩn" />
    <AppTabs activeKey={k} onChange={setK} items={rulesData.playbooks.map((p) => {
      const screens = openedRoutes.filter((r) => PLAYBOOK_MATCH[p.name](r.route));
      return { key: p.name, id: 'sdPb' + p.name, label: PLAYBOOK_NAMES[p.name] || p.name, children: <div className="sd-pb">
        <div className="card"><div className="card-title-row"><h2 className="card-title">Màn mẫu đang chạy ({screens.length})</h2><code>{p.file}</code></div>
          <span className="sd-tags">{screens.map((r) => <a key={r.route} className="sd-tag" href={PROTOTYPE + r.route} target="_blank" rel="noreferrer">{r.route}</a>)}</span></div>
        {p.sections.map((s) => <div key={s.title} className="card"><h2 className="card-title"><Inline text={stripIcon(s.title).replace(/^#+\s*/, '')} /></h2><Markdown text={s.md} /></div>)}
      </div> };
    })} />
  </>;
}

function RulesPage({ process }) {
  const [q, setQ] = useState(''); const needle = q.trim().toLowerCase();
  const sections = rulesData.sections.filter((s) => isProcess(s) === !!process).map((s) => ({ ...s, rules: s.rules.filter((r) => !needle || [r.code, r.rule, r.threshold].join(' ').toLowerCase().includes(needle)) })).filter((s) => s.rules.length);
  return <>
    {process
      ? <ShellHead icon="file" title="Prototype Workflow (Quy trình dựng và kiểm Prototype)" sub={processCount + ' luật quy trình: kiểm thử Prototype và giữ sạch thư mục Output BA. Luật thiết kế giao diện xem ở Bộ luật UI/UX'} />
      : <ShellHead icon="file" title="UI/UX Rules (Bộ luật UI/UX)" sub={ruleCount + ' luật, đọc nguyên văn từ TrangNT5_UIUX_Rules.md của bộ dựng Prototype'} />}
    <SearchPanel value={q} onChange={setQ} placeholder="Tìm mã hoặc nội dung luật" />
    {sections.map((s) => <div key={s.title} className="card"><div className="card-title-row"><h2 className="card-title">{stripIcon(s.title)}</h2><span className="sd-muted">{s.rules.length} luật</span></div>
      <div className="sd-md-table"><table className="sd-table sd-rules"><thead><tr><th>Mã</th><th>Quy tắc</th><th>Ngưỡng</th></tr></thead>
        <tbody>{s.rules.map((r) => <tr key={r.code}><td><AppTag className="tag sd-rule">{r.code}</AppTag></td><td><Inline text={clean(r.rule)} /></td><td><Inline text={clean(r.threshold)} /></td></tr>)}</tbody></table></div></div>)}
    {!sections.length ? <div className="card"><p className="sd-muted">Không có luật khớp «{q}»</p></div> : null}
  </>;
}

function ReferencePage({ page }) {
  const docs = referencesData.references[page.id];
  const [k, setK] = useState(docs[0].file); const [q, setQ] = useState(''); const needle = q.trim().toLowerCase();
  const shown = (d) => d.sections.filter((s) => !needle || (s.title + ' ' + s.md).toLowerCase().includes(needle));
  const body = (d) => { const list = shown(d); return <div className="sd-pb">{list.map((s) => <div key={s.title} className="card"><h2 className="card-title"><Inline text={stripIcon(s.title).replace(/^#+\s*/, '')} /></h2><Markdown text={s.md} /></div>)}
    {!list.length ? <div className="card"><p className="sd-muted">Không có mục khớp «{q}»</p></div> : null}</div>; };
  return <>
    <ShellHead icon={page.icon} title={bi(PAGE_EN[page.id], page.label)} sub={page.sub} />
    <SearchPanel value={q} onChange={setQ} placeholder="Tìm trong tài liệu" />
    {docs.length > 1 ? <AppTabs activeKey={k} onChange={setK} items={docs.map((d) => ({ key: d.file, id: 'sdRef' + d.file.replace(/\W/g, ''), label: d.file.replace(/^TrangNT5_|\.md$/g, '') + ' (' + shown(d).length + ')', children: body(d) }))} /> : body(docs[0])}
  </>;
}

/* Phân loại màn theo ĐẶC THÙ để tham khảo khi dựng Prototype sau. 1 màn có thể thuộc nhiều loại.
 * Căn cứ: đường dẫn routes.js (tao-moi · :id · chinh-sua), màn dùng ListCalendar (Lịch theo buồng), AppointmentForm/CounterRegistration dùng TablePicker (lưới chọn giờ) */
const SCREEN_NAMES = {
  '/tong-quan': 'Tổng quan',
  '/lich-hen/tham-gap-truc-tiep': 'Thăm gặp trực tiếp · Danh sách',
  '/lich-hen/gap-truc-tiep-ngoai-le': 'Lịch hẹn gặp trực tiếp ngoại lệ · Danh sách',
  '/lich-hen/tham-gap-truc-tiep/tao-moi': 'Tạo lịch hẹn thăm gặp trực tiếp',
  '/lich-hen/tham-gap-truc-tiep/LH-2026-0914': 'Thăm gặp trực tiếp · Chi tiết',
  '/lich-hen/tham-gap-truc-tiep/LH-2026-0914/chinh-sua': 'Chỉnh sửa lịch hẹn thăm gặp trực tiếp',
  '/lich-hen/gap-truc-tiep-ngoai-le/LH-2026-0914': 'Lịch hẹn gặp trực tiếp ngoại lệ · Chi tiết',
  '/lich-hen/gap-truc-tiep-ngoai-le/LH-2026-0914/chinh-sua': 'Lịch hẹn gặp trực tiếp ngoại lệ · Chỉnh sửa',
  '/tiep-don/dang-ky-luot-tai-quay': 'Đăng ký lượt thăm gặp tại quầy',
  '/tiep-don/quay-tiep-don': 'Cài đặt quầy tiếp đón · Danh sách',
  '/tiep-don/quay-tiep-don/tao-moi': 'Cài đặt quầy tiếp đón · Tạo mới',
  '/tiep-don/quay-tiep-don/Q01/chinh-sua': 'Cài đặt quầy tiếp đón · Chỉnh sửa',
  '/tiep-don/quay-tiep-don/Q01': 'Chi tiết quầy tiếp đón',
  '/van-hanh-co-so/cau-hinh-thoi-gian': 'Cấu hình thời gian · Xem',
  '/van-hanh-co-so/cau-hinh-thoi-gian/chinh-sua': 'Cấu hình thời gian · Chỉnh sửa',
  '/quan-tri/thong-bao': 'Quản lý thông báo',
  '/quan-tri/cai-dat-thong-bao': 'Cài đặt thông báo',
};
const isConfig = (r) => /cau-hinh-thoi-gian|cai-dat-thong-bao/.test(r);
const isDetail = (r) => /\/(Q01|LH-\d{4}-\d{4})$/.test(r);
const SCREEN_KINDS = [
  { id: 'crud', name: 'CRUD danh mục', ref: 'Bộ 4 màn Danh sách · Tạo · Sửa · Chi tiết của 1 danh mục; Tạo nhiều bước, Sửa và Chi tiết chia tab', match: (r) => /^\/tiep-don\/quay-tiep-don/.test(r) },
  { id: 'calendar', name: 'Màn có Calendar', ref: 'Tab Lịch theo buồng: lưới lịch theo ngày, kéo thả đổi giờ phải nhập lý do', match: (r) => /^\/lich-hen\/(tham-gap-truc-tiep|gap-truc-tiep-ngoai-le)$/.test(r) },
  { id: 'booking', name: 'Màn đặt lịch', ref: 'Chọn ngày, chọn khung giờ trên lưới buồng (TablePicker), chống trùng buồng, thời lượng tự rút cuối ca', match: (r) => /\/tao-moi$|\/LH-\d{4}-\d{4}\/chinh-sua$|dang-ky-luot-tai-quay/.test(r) && !/quay-tiep-don/.test(r) },
  { id: 'list', name: 'Màn danh sách', ref: 'Bộ lọc, bảng, phân trang, tab trạng thái, thao tác hàng loạt, Xuất Excel', match: (r) => /^\/(lich-hen\/(tham-gap-truc-tiep|gap-truc-tiep-ngoai-le)|tiep-don\/quay-tiep-don|quan-tri\/thong-bao)$/.test(r) },
  { id: 'detail', name: 'Màn chi tiết', ref: 'Khối thông tin chỉ đọc, thanh nút đầu trang theo trạng thái, Lịch sử thao tác', match: (r) => isDetail(r) || r === '/van-hanh-co-so/cau-hinh-thoi-gian' },
  { id: 'edit', name: 'Màn chỉnh sửa', ref: 'Form nạp sẵn dữ liệu, hộp Thay đổi chưa lưu khi rời trang, thanh nút đầu và chân trang', match: (r) => /\/chinh-sua$/.test(r) },
  { id: 'create', name: 'Màn tạo mới', ref: 'Form trống theo bước, kiểm bắt buộc, lưu nháp hoặc lưu và gửi duyệt', match: (r) => /\/tao-moi$|dang-ky-luot-tai-quay/.test(r) },
  { id: 'config', name: 'Màn cấu hình · cài đặt', ref: 'Dữ liệu dựng sẵn, chỉ xem và sửa, không thêm không xóa', match: isConfig },
  { id: 'overview', name: 'Tổng quan', ref: 'Trang chủ sau đăng nhập', match: (r) => r === '/tong-quan' },
];

function ScreenTile({ r }) {
  const steps = r.types.includes('Thanh bước');
  return <div className="sd-screen-tile">
    <a className="sd-screen-name" href={PROTOTYPE + r.route} target="_blank" rel="noreferrer">{SCREEN_NAMES[r.route] || r.route}</a>
    <code className="sd-screen-route">{r.route}</code>
    <span className="sd-tags">{r.tabs ? <span className="sd-tag is-static">{r.tabs} tab</span> : null}{steps ? <span className="sd-tag is-static">Nhiều bước</span> : null}<span className="sd-tag is-static">{(ACCOUNTS.find((x) => x.key === r.account) || {}).role || r.account}</span></span>
    {r.types.length ? <Fold title={'Loại control (' + r.types.length + ')'}><span className="sd-tags">{r.types.map((t) => <a key={t} className="sd-tag" href={ITEM_BY_HARVEST[t] ? '#/component/' + ITEM_BY_HARVEST[t].id : '#/search/' + encodeURIComponent(t)}>{t}</a>)}</span></Fold> : null}
  </div>;
}

function ScreensPage() {
  const kinds = SCREEN_KINDS.map((k) => ({ ...k, list: openedRoutes.filter((r) => k.match(r.route)) })).filter((k) => k.list.length);
  return <>
    <ShellHead icon="desk" title="By Screen (Theo màn)" sub="Màn mẫu xếp theo đặc thù để tham khảo khi dựng Prototype sau — 1 màn có thể thuộc nhiều loại. Bấm tên màn để mở màn thật" />
    <div className="card"><span className="sd-tags">{kinds.map((k) => <a key={k.id} className="sd-tag" href={'#kind-' + k.id} onClick={(e) => { e.preventDefault(); const el = document.getElementById('kind-' + k.id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{k.name + ' (' + k.list.length + ')'}</a>)}</span></div>
    {kinds.map((k) => <div key={k.id} id={'kind-' + k.id} className="card sd-kind">
      <div className="card-title-row"><h2 className="card-title">{k.name}</h2><span className="sd-muted">{k.list.length} màn</span></div>
      <p className="sd-kind-ref">Tham khảo: {k.ref}</p>
      <div className="sd-screen-grid">{k.list.map((r) => <ScreenTile key={r.route} r={r} />)}</div>
    </div>)}
    <div className="card"><h2 className="card-title">Component dùng chung theo thư mục màn</h2><div className="sd-kv">{Object.entries(usage.screens).map(([s, list]) => <div key={s}><code>{s}</code><span>{list.join(' · ')}</span></div>)}</div></div>
  </>;
}

/* Danh sách chỗ PM1 và PM2 làm khác nhau, chờ rà — dữ liệu ở data/pm1_pm2_diff.json */
function Pm1DiffPage() {
  return <>
    <ShellHead icon="swap" title="PM1 vs PM2 (Lệch PM1 · PM2)" sub={pm1Diff.rows.length + ' chỗ Design System PM1 và PM2 làm khác nhau và kết quả TrangNT5 chốt từng dòng'} />
    <div className="card"><div className="sd-md-table"><table className="sd-table">
      <thead><tr><th>Mã</th><th>Chủ đề</th><th>PM1</th><th>PM2 trước khi chốt</th><th>Căn cứ PM2</th><th>Kết quả chốt</th></tr></thead>
      <tbody>{pm1Diff.rows.map((r) => { const d = r.decision || 'Chờ chốt'; const cls = /^Theo PM1/.test(d) ? 'tag-completed' : d === 'Giữ PM2' ? 'tag-category' : d === 'Bỏ' ? 'tag-cancelled' : 'tag-pending'; return <tr key={r.code}>
        <td><b>{r.code}</b></td><td>{stripMeta(r.topic)}</td><td>{stripMeta(r.pm1)}</td><td>{stripMeta(r.pm2)}</td><td>{stripMeta(r.basis) ? <code>{stripMeta(r.basis)}</code> : '—'}</td>
        <td><AppTag className={'tag ' + cls}>{d}</AppTag>{r.decisionNote ? <div className="sd-muted">{r.decisionNote}</div> : null}</td></tr>; })}</tbody></table></div>
      <SourceLine><code>design_system.html</code> của PM1 · code Prototype PM2 đo ngày 14/10/2026 · Sổ BA PM2</SourceLine></div>
  </>;
}

function DriftPage() {
  return <>
    <ShellHead icon="warning" title="Drift Report (Báo cáo lệch)" sub="Cùng control mà khác kiểu giữa các màn — chỉ so thuộc tính đúng bản chất từng loại, bỏ khác biệt do trạng thái. Sửa thì TrangNT5 duyệt theo cụm" />
    {!driftTypes.length ? <div className="card"><p>Không có chỗ lệch — mọi loại control đồng nhất giữa các màn.</p></div> : driftTypes.map((t) => { const parts = t.variants.map((v) => Object.fromEntries(v.sig.split(';').map((p) => p.split(':'))));
      const diff = Object.keys(parts[0]).filter((k) => new Set(parts.map((o) => o[k])).size > 1);
      return <div key={t.name} className="card"><div className="card-title-row"><h2 className="card-title">{t.name}</h2><span className="sd-badge is-drift">{t.variants.length} kiểu · khác ở {diff.join(', ')}</span></div>
        {t.variants.map((v, i) => <div key={i} className="sd-variant">{v.shot ? <img src={v.shot} alt={t.name + ' kiểu ' + (i + 1)} loading="lazy" /> : null}
          <div className="sd-variant-info"><b>{i === 0 ? 'Kiểu 1 — đa số' : 'Kiểu ' + (i + 1)}</b> · {v.count} chỗ · {diff.map((k) => <code key={k}>{k}: {parts[i][k]}</code>)}<div className="sd-gap"><ScreenTags list={v.screens} /></div></div></div>)}</div>; })}
  </>;
}

export default function DesignApp() {
  const [route, setRoute] = useState(readHash());
  const [query, setQuery] = useState('');
  useEffect(() => { const on = () => { setRoute(readHash()); setQuery(''); window.scrollTo(0, 0); }; window.addEventListener('hashchange', on); return () => window.removeEventListener('hashchange', on); }, []);
  const routeQuery = route.startsWith('search/') ? decodeURIComponent(route.slice(7)) : '';
  /* #/component/<mã> — mở đúng 1 mục, URL chỉ có chữ tiếng Anh */
  const routeItem = route.startsWith('component/') ? ALL_ITEMS.find((it) => it.id === route.slice(10)) : null;
  const q = (query || routeQuery).trim().toLowerCase();
  const results = useMemo(() => (q ? ALL_ITEMS.filter((it) => [it.name, ITEM_EN[it.id], it.aliases, it.component, (it.components || []).join(' '), it.harvest, (it.alsoHarvest || []).join(' '), (it.rules || []).join(' ')].join(' ').toLowerCase().includes(q)) : []), [q]);
  const L = layoutFor(routeItem ? 'group/' + routeItem.group : route);   /* trang 1 mục: menu và breadcrumb theo nhóm của mục */
  const group = GROUPS.find((g) => 'group/' + g.id === route);
  const search = <SearchPanel value={query} onChange={setQuery} placeholder="Tìm control: ô chọn, tag, xóa…" />;
  let body;
  if (q) body = <><ShellHead icon="view" title={'Kết quả tìm «' + (query || routeQuery) + '»'} sub={results.length + ' mục control'} />{search}<ItemList items={results} /></>;
  else if (routeItem) body = <><ShellHead icon="view" title={itemTitle(routeItem)} sub={groupTitle(GROUPS.find((g) => g.id === routeItem.group))} />{search}<ItemList items={[routeItem]} /></>;
  else if (group) body = <><ShellHead icon={GROUP_ICONS[group.id]} title={group.id === 'mindset' ? bi(GROUP_EN.mindset, 'Lưới · khối · trạng thái ô') : groupTitle(group)} sub={group.items.length + ' mục — mỗi khối: mẫu chạy thật bên trái, quy tắc nguyên văn và cách dùng bên phải'} />{search}<ItemList items={group.items} /></>;
  else if (route === 'foundations') body = <Foundations />;
  else if (route === 'principles') body = <PrinciplesPage />;
  else if (route === 'all-components') body = <AllControlsPage />;
  else if (route === 'playbooks') body = <PlaybooksPage />;
  else if (route === 'rules') body = <RulesPage key="rules" />;
  else if (route === 'process') body = <RulesPage key="process" process />;
  else if (REFERENCE_PAGES.some((r) => r.id === route)) body = <ReferencePage key={route} page={REFERENCE_PAGES.find((r) => r.id === route)} />;
  else if (route === 'screens' || route === 'screen-types') body = <ScreensPage />;
  else if (route === 'drift') body = <DriftPage />;
  else if (route === 'pm1-diff') body = <Pm1DiffPage />;
  else if (route === 'changelog') body = <ChangelogPage />;
  else if (route === 'contributing') body = <ContributingPage />;
  else body = <Overview />;
  /* dòng bản quyền cuối mọi trang, chữ xám nhỏ (đánh dấu bản quyền khéo léo, câu tiếng Anh) */
  /* VersionNotice đặt NGOÀI AppLayout: nằm trong .shell thì thành khối cuối, luật «khối cuối cách đáy 24px» áp nhầm (cổng ②d bắt 19/10/2026) */
  return <><AppLayout brand={BRAND} fixedAccount={OWNER} onLogout={logoutDs} menu={L.menu} sidebar={L.sidebar} breadcrumb={L.breadcrumb}>{body}<p className="sd-copyright">© 2026 TrangNT5 · Design System PM2 · All rights reserved.</p></AppLayout><VersionNotice label="TrangNT5 đã có nâng cấp phiên bản mới, bạn hãy F5 và trải nghiệm nhé!" /></>;
}
