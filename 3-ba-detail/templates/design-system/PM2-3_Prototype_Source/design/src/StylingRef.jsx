/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Khối «Tra cứu kỹ thuật» của từng mục — học cách trình bày Components của HeroUI:
 * ① lớp CSS chia 3 nhóm · ② mỗi biến thể 1 ví dụ chạy thật kèm code · ③ file nguồn và bảng thuộc tính.
 * Dữ liệu sinh tự động từ code thật bằng (data/styling.json), không gõ tay. */
import { useState, useEffect } from 'react';
import styling from './data/styling.json';
import DialogIcon from '@/components/app/DialogIcon';
import './StylingRef.css';

const GROUP_LABELS = [['base', 'Cơ bản và kích thước'], ['variant', 'Biến thể'], ['state', 'Trạng thái']];
const SAFE = /^[a-z0-9 -]+$/;
const Chips = ({ list }) => (list.length ? <span className="sd-tags">{list.map((c) => <code key={c} className="sd-ref-chip">{/^[:[]/.test(c) ? c : '.' + c}</code>)}</span> : <span className="sd-muted">—</span>);

function ClassTable({ b }) {
  return <div className="sd-ref-class">
    <div className="sd-ref-class-head"><code>.{b.base}</code><span className="sd-muted">khai ở {b.files.join(' · ')}</span></div>
    <table className="sd-table sd-ref-table">
      <thead><tr><th scope="col">Nhóm</th><th scope="col">Lớp CSS</th></tr></thead>
      <tbody>{GROUP_LABELS.map(([k, label]) => <tr key={k}><th scope="row">{label}</th><td><Chips list={k === 'base' ? b.base_list : b[k]} /></td></tr>)}</tbody>
    </table>
  </div>;
}

function Example({ ex }) {
  if (!SAFE.test(ex.cls)) return null;
  /* lớp icon cỡ cố định (dlg-ic 22px) chỉ chứa hình — nhét nhãn chữ vào thì chữ tràn khỏi icon (_LayoutCheck 14/10/2026)
 ⇒ dựng bằng chính DialogIcon như màn thật, nhãn để cạnh icon */
  if (/(^|\s)dlg-ic(\s|$)/.test(ex.cls)) return <div className="sd-ref-example">
    <div className="sd-ref-example-stage sd-ref-example-icon"><DialogIcon level={/(^|\s)is-danger(\s|$)/.test(ex.cls) ? 'danger' : 'warn'} /><span className="sd-muted">{ex.label}</span></div>
    <pre className="sd-code">{'<DialogIcon level="' + (/is-danger/.test(ex.cls) ? 'danger' : 'warn') + '" />'}</pre>
  </div>;
  const html = '<' + ex.tag + ' class="' + ex.cls + '">' + ex.label + '</' + ex.tag + '>';
  return <div className="sd-ref-example">
    <div className="sd-ref-example-stage" dangerouslySetInnerHTML={{ __html: html }} />
    <pre className="sd-code">{'<' + ex.tag + ' className="' + ex.cls + '">…</' + ex.tag + '>'}</pre>
  </div>;
}

function Source({ s }) {
  return <div className="sd-ref-source">
    <div className="sd-ref-class-head"><code>{s.name}</code>{s.file ? <span className="sd-muted">{s.file}{s.css ? ' · ' + s.css : ''}</span> : <span className="sd-muted">không tìm thấy file nguồn</span>}</div>
    {s.about ? <div className="sd-ref-about">{s.about}</div> : null}
    {s.props && s.props.length ? <table className="sd-table sd-ref-table">
      <thead><tr><th scope="col">Thuộc tính</th><th scope="col">Kiểu</th><th scope="col">Mặc định</th><th scope="col">Ghi chú</th></tr></thead>
      <tbody>{s.props.map((p) => <tr key={p.name}><td><code>{p.name}</code></td><td>{p.type && p.type !== '—' ? <code>{p.type}</code> : <span className="sd-muted">—</span>}</td><td>{p.def ? <code>{p.def}</code> : <span className="sd-muted">—</span>}</td><td>{p.note || <span className="sd-muted">—</span>}</td></tr>)}</tbody>
    </table> : <div className="sd-muted">Không đọc được chữ ký hàm, xem trực tiếp file nguồn.</div>}
  </div>;
}

/* Sơ đồ cấu tạo (học Anatomy của HeroUI): đọc từ DOM của CHÍNH mẫu chạy thật trong khối, không gõ tay.
 Chỉ lấy phần tử có lớp CSS, sâu tối đa 4 tầng, tối đa 24 nút; đọc khi người dùng mở khối nên luôn khớp mẫu đang hiện */
function anatomyOf(id) {
  const stage = document.querySelector('#item-' + id + ' .sd-stage');
  if (!stage) return '';
  const out = []; const seen = new Set();
  const walk = (el, depth) => {
    for (const c of el.children) {
      if (out.length >= 24) return;
      if (c.closest('svg') && c.tagName.toLowerCase() !== 'svg') continue;
      const cls = typeof c.className === 'string' ? c.className.split(/\s+/).filter((x) => x && !/^css-|^ant-btn-(color|variant)|^sd-/.test(x)).slice(0, 3) : [];
      const tag = c.tagName.toLowerCase();
      const key = depth + tag + cls.join('.');
      if (cls.length && !seen.has(key)) { seen.add(key); out.push('  '.repeat(depth) + tag + '.' + cls.join('.')); walk(c, depth + 1); }
      else if (depth < 4) walk(c, cls.length ? depth + 1 : depth);
    }
  };
  walk(stage, 0);
  return out.join('\n');
}
function Anatomy({ id }) {
  const [tree, setTree] = useState('');
  useEffect(() => { setTree(anatomyOf(id)); }, [id]);
  if (!tree) return null;
  return <div className="sd-ref-sec"><div className="sd-label">Sơ đồ cấu tạo (đọc từ mẫu chạy thật)</div><pre className="sd-code">{tree}</pre></div>;
}

export function ItemStyling({ id }) {
  const d = styling.items[id];
  const [open, setOpen] = useState(false);
  if (!d) return null;
  const empty = !d.classes.length && !d.examples.length && !d.sources.length;
  return <details className="sd-ref sd-frame sd-fold" onToggle={(e) => setOpen(e.currentTarget.open)}>
    <summary className="sd-ref-summary sd-frame-head">CSS · tra cứu kỹ thuật<span className="sd-muted"> · lớp CSS {d.classes.length} · ví dụ biến thể {d.examples.length} · file nguồn {d.sources.length}</span></summary>
    {empty ? <div className="sd-muted">Không có lớp CSS riêng: mục này là cơ chế dùng chung (gọi hàm, thư viện ngoài hoặc kiểu gán trực tiếp), xem phần Usage ở trên.</div> : null}
    {open ? <Anatomy id={id} /> : null}
    {d.classes.length ? <div className="sd-ref-sec"><div className="sd-label">Lớp CSS</div><div className="sd-ref-grid">{d.classes.map((b) => <ClassTable key={b.base} b={b} />)}</div></div> : null}
    {d.examples.length ? <div className="sd-ref-sec"><div className="sd-label">{d.examples.some((x) => x.state) ? 'Ví dụ theo biến thể và trạng thái' : 'Ví dụ theo biến thể'}</div><div className="sd-ref-examples">{d.examples.map((ex) => <Example key={ex.cls} ex={ex} />)}</div></div> : null}
    {d.sources.length ? <div className="sd-ref-sec"><div className="sd-label">File nguồn và thuộc tính</div><div className="sd-ref-grid">{d.sources.map((s) => <Source key={s.name} s={s} />)}</div></div> : null}
  </details>;
}
