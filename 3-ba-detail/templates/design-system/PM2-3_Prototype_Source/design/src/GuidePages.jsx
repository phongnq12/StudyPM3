/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Khung hướng dẫn chuẩn của từng mục · Nhật ký phiên bản và Hướng dẫn đóng góp —.
 * Mỗi ý mang nhãn nguồn: Verified (trích luật, quyết định có mã) · Based on Docs (suy từ nguồn ghi rõ) · AI Inferred (chờ). */
import AppTag from '@/components/app/AppTag';
import { Inline, stripMeta } from './Markdown';
import ShellHead from './ShellHead';
import guides from './data/guides.json';
import changelog from './data/changelog.json';
import changelogSummary from './data/changelog_summary.json';
import versionInfo from './data/version.json';   /* số phiên bản semver (_GenVersion.cjs) */

/* trang KHÔNG hiện nhãn nguồn — nhãn vẫn giữ trong guides.json để đội rà, chỉ ẩn khi vẽ */
export function SourceTag() { return null; }

const SECTIONS = [
  /* mọi tiêu đề khung có tên tiếng Anh trong ngoặc */
  ['use', 'When to Use (Khi dùng)'], ['avoid', 'When Not to Use (Khi không dùng)'], ['anatomy', 'Anatomy (Cấu tạo)'], ['states', 'Variants & States (Biến thể và trạng thái)'],
  ['a11y', 'Accessibility (Truy cập)'], ['writing', 'UX Writing (Cách viết chữ)'],
];
/* mỗi câu 1 gạch đầu dòng: tách ở dấu chấm hết câu, bỏ qua dấu chấm trong `code`, số thập phân và viết tắt vd. */
const sentences = (t) => String(t).split(/(?<=[^\s`.]{2}[.!?])\s+(?=[A-ZĐÀ-Ỹ«"*(])/u).filter(Boolean);
/* ý có hidden: true là ý đã đo ra SAI — giữ trong dữ liệu để truy vết, không vẽ */
const Points = ({ list }) => <ul className="sd-guide-list">{list.filter((p) => !p.hidden).flatMap((p, i) => sentences(p.t).map((s, j) => <li key={i + '-' + j}><span><Inline text={s} /></span></li>))}</ul>;

export function guideStats(id) {
  const g = guides[id]; if (!g) return null;
  const all = Object.entries(g).filter(([k]) => k !== 'related').flatMap(([, v]) => v);
  return { total: all.length, ai: all.filter((p) => p.label === 'AI Inferred').length };
}

/* Khuôn khung của mỗi control: Frame = khung mở sẵn · Fold = khung gập mặc định */
export const Frame = ({ title, children, cls }) => <div className={'sd-frame' + (cls ? ' ' + cls : '')}><div className="sd-frame-head">{title}</div><div className="sd-frame-body">{children}</div></div>;
export const Fold = ({ title, children }) => <details className="sd-frame sd-fold"><summary className="sd-frame-head">{title}</summary><div className="sd-frame-body">{children}</div></details>;

/* khung chính: Khi dùng | Khi không dùng, 2 cột */
export function ItemGuideMain({ id }) {
  const g = guides[id];
  if (!g) return <Frame title="When to Use · When Not to Use (Khi dùng · Khi không dùng)"><span className="sd-muted">Chưa có nội dung cho mục này.</span></Frame>;
  return <div className="sd-frame-pair">
    <Frame title="When to Use (Khi dùng)" cls="is-use"><Points list={g.use || []} /></Frame>
    <Frame title="When Not to Use (Khi không dùng)" cls="is-avoid"><Points list={g.avoid || []} /></Frame>
  </div>;
}

/* khung phụ, gập mặc định: Nên/Không nên · Cấu tạo · Biến thể · Truy cập · Cách viết chữ; Mục liên quan để ngoài vì là đường dẫn */
export function ItemGuideExtra({ id, nameOf }) {
  const g = guides[id]; if (!g) return null;
  return <>
    {(g.dos && g.dos.length) || (g.donts && g.donts.length) ? <Fold title="Do · Don't (Nên · Không nên)"><div className="sd-dodont">
      <div className="sd-do"><div className="sd-dodont-head">Do (Nên)</div><Points list={g.dos || []} /></div>
      <div className="sd-dont"><div className="sd-dodont-head">Don't (Không nên)</div><Points list={g.donts || []} /></div>
    </div></Fold> : null}
    {SECTIONS.filter(([k]) => k !== 'use' && k !== 'avoid' && g[k] && g[k].length).map(([k, label]) => <Fold key={k} title={label}><Points list={g[k]} /></Fold>)}
    {g.related && g.related.length ? <div className="sd-guide-related"><span className="sd-label">Related (Mục liên quan)</span>
      <span className="sd-tags">{g.related.map((r) => <a key={r} className="sd-tag" href={'#item-' + r} onClick={(e) => { const el = document.getElementById('item-' + r); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else { e.preventDefault(); location.hash = '#/search/' + encodeURIComponent(nameOf(r)); } }}>{nameOf(r)}</a>)}</span></div> : null}
  </>;
}

/* nội dung Sổ BA giữ nguyên văn, chỉ bỏ ký hiệu emoji nhấn mạnh như trang Bộ luật */
/* ký hiệu cấm trong luật nghĩa là «không/cấm» ⇒ đổi thành chữ trước khi bỏ emoji, không thì câu bị đảo nghĩa */
const banToText = (t) => String(t || '').replace(/\u26D4\uFE0F?\s*(\**)\s*(?=(không|cấm|KHÔNG|CẤM)[\s*`]|(không|cấm|KHÔNG|CẤM)$)/gu, '$1').replace(/\u26D4\uFE0F?\s*/gu, 'không ');
const noEmoji = (t) => banToText(t).replace(/[\u{1F100}-\u{1F2FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').replace(/\s{2,}/g, ' ').trim();
/* Changelog theo chuẩn Keep a Changelog — mỗi phiên bản 1 khối (số phiên bản · ngày · tiêu đề 1 dòng), mỗi ý 1 tag Added / Changed / Fixed.
 * Bỏ nhãn khu vực, trạng thái, giờ chốt, dòng «Yêu cầu»; nguyên văn đầy đủ ở Sổ BA PM2. Câu hỏi chưa chốt không lên nhật ký (lọc ở_GenChangelog.cjs). */
const summaryOf = (e) => changelogSummary.entries[e.code] || {};
const CHANGE_TYPES = ['Added', 'Changed', 'Fixed'];
const byType = (items) => [...items].sort((a, b) => CHANGE_TYPES.indexOf(a.type) - CHANGE_TYPES.indexOf(b.type));
const releases = () => {
  const m = new Map();
  for (const e of changelog.entries) { if (!m.has(e.version)) m.set(e.version, []); m.get(e.version).push(e); }
  return [...m].map(([version, list]) => list.length === 1
    ? { version, date: list[0].date, title: summaryOf(list[0]).title, items: summaryOf(list[0]).items || [] }
    : { version, date: list[0].date, title: 'Bản phát hành đầu tiên', items: list.map((e) => ({ type: summaryOf(e).type, text: summaryOf(e).title })) });
};

export function ChangelogPage() {
  const list = releases();
  return <>
    <ShellHead icon="calendar" title="Changelog (Nhật ký phiên bản)" sub={'Bản hiện tại v' + versionInfo.current + ' · ' + list.length + ' phiên bản, mới nhất lên đầu · Nguyên văn quyết định lưu tại Sổ BA PM2'} />
    {list.map((r) => <div key={r.version} className="card sd-release" id={'v' + r.version}>
      <div className="card-title-row"><h2 className="card-title">{'v' + r.version}</h2><span className="sd-muted">{r.date}</span></div>
      {r.title ? <div className="sd-release-title">{r.title}</div> : null}
      <ul className="sd-release-items">{byType(r.items).map((it) => <li key={it.text}><span className={'sd-ctype sd-ctype-' + String(it.type).toLowerCase()}>{it.type}</span><Inline text={it.text} /></li>)}</ul>
    </div>)}
  </>;
}

/* Bản nháp quy trình đóng góp — nhãn nguồn từng bước, chờ */
const CONTRIB_STEPS = [
  { t: 'Tra trước khi đề xuất: tìm control trên trang này (ô tìm ở Tổng quan), đọc Bộ luật UI/UX và Khuôn loại màn của loại màn đang dựng.', label: 'AI Inferred' },
  { t: 'Đã có control phù hợp thì dùng đúng component và lớp CSS dùng chung, không tự viết kiểu riêng cho màn.', label: 'Verified', src: 'UX-L2 · UX-L24' },
  { t: 'Chưa có hoặc cần đổi thì gửi đề xuất cho TrangNT5: màn nào, ảnh chụp, lý do, control gần nhất đã có trên trang này.', label: 'AI Inferred' },
  { t: 'TrangNT5 chốt thì ghi quyết định vào Sổ BA PM2 thành 1 dòng QD kèm nguyên văn lời chốt.', label: 'Verified', src: 'Sổ BA PM2' },
  { t: 'Mỗi lời chốt ghi vào đúng 1 nhà (Bộ luật UI/UX, Playbook hoặc Knowhow chức năng), đổi luật thì sửa thẳng dòng cũ.', label: 'Verified', src: 'UX-K2' },
  { t: 'Sửa component dùng chung trong Prototype rồi deploy Prototype trước, sau đó mới deploy trang Design System.', label: 'Verified', src: 'TrangNT5_DeployDesign.cjs' },
  { t: 'Deploy Design System qua đủ cổng: mã nguồn yên 10 phút · phủ component · build · độ khớp Khối màn thật · truy cập WCAG 2.2 AA · deploy · đo bản live · độ phủ CSS. Hỏng cổng nào thì không lên site.', label: 'Verified', src: 'TrangNT5_DeployDesign.cjs' },
  { t: 'Nhật ký phiên bản và file token pm2.tokens.json tự sinh lại mỗi lần deploy, không sửa tay.', label: 'Verified', src: 'TrangNT5_GenChangelog.cjs · TrangNT5_GenTokens.mjs' },
];
const DONE = [
  { t: 'Có mẫu chạy thật dựng bằng chính component của Prototype.', label: 'Based on Docs', src: 'TrangNT5_BlockFidelity.mjs' },
  { t: 'Gắn mã luật UI/UX liên quan và đoạn code cách dùng.', label: 'Based on Docs', src: 'catalog.jsx' },
  { t: 'Đủ khung hướng dẫn: khi dùng, khi không dùng, cấu tạo, trạng thái, Nên và Không nên, truy cập, cách viết chữ, mục liên quan.', label: 'Verified', src: 'QD-379' },
  { t: 'Quét axe 0 lỗi WCAG 2.2 AA trên mọi trang.', label: 'Verified', src: 'TrangNT5_A11yCheck.mjs' },
  { t: 'Các ý AI Inferred trong khung đã được TrangNT5 duyệt và đổi nhãn.', label: 'AI Inferred' },
];

export function ContributingPage() {
  return <>
    <ShellHead icon="users" title="Contributing (Hướng dẫn đóng góp)" sub="Quy trình đề xuất, duyệt và đưa 1 control hay 1 quy tắc mới lên Design System PM2 — bản nháp chờ TrangNT5 duyệt" />
    <div className="card"><h2 className="card-title">Contribution Process (Quy trình đóng góp)</h2>
      <ol className="sd-steps">{CONTRIB_STEPS.map((s, i) => <li key={i}><SourceTag label={s.label} src={s.src} /><span>{s.t}</span></li>)}</ol></div>
    <div className="card"><h2 className="card-title">Định nghĩa xong (Definition of Done) cho 1 mục mới</h2><Points list={DONE} /></div>
  </>;
}
