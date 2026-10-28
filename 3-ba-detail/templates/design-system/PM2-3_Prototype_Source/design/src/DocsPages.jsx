/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* 2 trang tài liệu học theo HeroUI: Nguyên tắc thiết kế · Tất cả control.
 * Nguyên tắc: mỗi ý trỏ về 1 mã luật hoặc quyết định đã chốt, chữ lấy từ rules.json (đọc thẳng) — không tự viết.
 * Tất cả control: thẻ mỗi mục catalog theo nhóm, bấm thẻ mở đúng mục (tuyến tìm #/search/…). */
import { itemTitle, groupTitle } from './labelsEn';
import rulesData from './data/rules.json';
import usage from './data/usage.json';
import { GROUPS } from './catalog';
import ShellHead from './ShellHead';
import { Inline } from './Markdown';
import { SourceTag } from './GuidePages';
import './DocsPages.css';

const ruleByCode = Object.fromEntries(rulesData.sections.flatMap((s) => s.rules.map((r) => [r.code, r])));
/* ký hiệu cấm trong luật nghĩa là «không/cấm» ⇒ đổi thành chữ TRƯỚC khi bỏ emoji, không thì câu bị đảo nghĩa (cùng hàm banToText của DesignApp.jsx) */
const banToText = (t) => String(t || '').replace(/⛔️?\s*(\**)\s*(?=(không|cấm|KHÔNG|CẤM)[\s*`]|(không|cấm|KHÔNG|CẤM)$)/gu, '$1').replace(/⛔️?\s*/gu, 'không ');
const clean = (t) => banToText(t).replace(/[\u{1F100}-\u{1F2FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').replace(/\s{2,}/g, ' ').trim();

/* nhóm nguyên tắc — mỗi dòng là 1 mã luật UX hoặc 1 quyết định QD; dòng nào mã không còn trong Bộ luật thì tự ẩn */
const PRINCIPLES = [
  ['Một control, một cách dựng', 'Màn mới gọi component dùng chung, không tự dựng lại control.', ['UX-L1', 'UX-L2']],
  ['Hình dạng đồng nhất', 'Cùng loại control thì cùng cao, bo, màu trên mọi màn; mọi thứ thẳng 1 đường giữa dòng.', ['UX-A6', 'UX-C1', 'UX-A3']],
  ['Màu theo vai trò', 'Màu lấy từ token, không gõ mã màu trong màn; số đếm khác tag.', ['UX-A4', 'UX-A7', 'UX-A16']],
  ['Chữ viết cho người dùng', 'Không đưa mã nội bộ, căn cứ pháp lý lên giao diện; cùng 1 khái niệm cùng 1 chữ.', ['UX-A8', 'UX-A12', 'UX-A15']],
  ['Câu thông báo theo mã', 'Mọi câu thông báo gọi theo mã trong Message List, không gõ cứng.', ['UX-E1', 'UX-M1']],
];
const FIXED = [
  ['Chỉ có giao diện sáng', 'PM2 là phần mềm nghiệp vụ dùng tại cơ quan, Prototype và PM1 đều không có chế độ tối. Token đã tách tầng primitive · semantic nên thêm sau được nếu cần.', 'QD-406'],
  ['Đạt WCAG 2.2 AA', 'Mọi trang Design System quét axe trước khi deploy, còn 1 lỗi là không deploy.', 'QD-379'],
  ['Mẫu là component thật', 'Mỗi mục trên trang này chạy chính component và CSS của Prototype, không dùng ảnh chụp.', 'QD-379'],
];

export function PrinciplesPage() {
  return <>
    <ShellHead icon="file" title="Design Principles (Nguyên tắc thiết kế)" sub="Các nguyên tắc đứng sau mọi control PM2 — mỗi ý trỏ về luật hoặc quyết định đã chốt" />
    {PRINCIPLES.map(([title, sum, codes]) => {
      const rules = codes.map((c) => [c, ruleByCode[c]]).filter(([, r]) => r);
      return <div className="card" key={title}><h2 className="card-title">{title}</h2>
        <p className="sd-dp-sum">{sum}</p>
        <ul className="sd-dp-list">{rules.map(([c, r]) => <li key={c}><SourceTag label="Verified" src={c} /><span><Inline text={clean(r.rule)} /></span></li>)}</ul>
      </div>;
    })}
    <div className="card"><h2 className="card-title">Phạm vi đã chốt</h2>
      <ul className="sd-dp-list">{FIXED.map(([t, d, src]) => <li key={t}><SourceTag label="Verified" src={src} /><span><b>{t}.</b> {d}</span></li>)}</ul>
    </div>
  </>;
}

const usedSet = new Set(usage.components.filter((c) => c.usedBy && c.usedBy.length).map((c) => c.name));
export function AllControlsPage() {
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);
  return <>
    <ShellHead icon="edit" title="All Components (Tất cả control)" sub={total + ' mục trong ' + GROUPS.length + ' nhóm — bấm 1 thẻ để mở mục đó'} />
    {GROUPS.map((g) => <div className="card" key={g.id}><h2 className="card-title">{groupTitle(g)} <span className="sd-dp-count">({g.items.length})</span></h2>
      <div className="sd-dp-grid">{g.items.map((it) => {
        const comps = it.components || (it.component ? [it.component] : []);
        const live = comps.some((c) => usedSet.has(c));
        return <a key={it.id} className="sd-dp-tile" href={'#/component/' + it.id}>   {/* URL tiếng Anh theo mã mục, không mang chữ có dấu */}
          <span className="sd-dp-tile-name">{itemTitle(it)}</span>
          <span className="sd-dp-tile-meta">{comps.length ? comps.join(' · ') : 'khuôn CSS'}</span>
          <span className={'sd-dp-tile-state' + (live ? ' is-live' : '')}>{live ? 'Đang dùng trên màn' : 'Chưa đo thấy trên màn'}</span>
        </a>;
      })}</div>
    </div>)}
  </>;
}
