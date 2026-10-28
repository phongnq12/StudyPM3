/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Hiển thị đoạn markdown của file luật (Playbook) — đủ dùng cho bảng, gạch đầu dòng, trích dẫn, chữ đậm, mã.
 * Nguồn là file luật nội bộ của; vẫn thoát HTML trước khi đổi định dạng. */
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* trang KHÔNG hiện nhãn nguồn và mã quyết định QD — dữ liệu gốc giữ nguyên, chỉ lọc khi vẽ.
 * Gỡ: `Verified (…)` · `Based on Docs (…)` · `AI Inferred` · `Unverified` · `PM2 QD-xxx` · mã phương án · rồi dọn ngoặc, dấu phân cách còn trơ lại */
const SRC_LABEL = /`?\b(?:Verified|Based on Docs)\s*\((?:[^()]|\([^()]*\))*\)`?|`?\b(?:AI Inferred|Unverified)\b`?/g;
const HAS_META = /\b(?:Verified|Based on Docs|AI Inferred|Unverified|QD-\d{2,4})\b|\(\s*D\d+\s*[A-C]?\s*\)/;
const QD_CODE = /(?:\bSổ(?:\s+BA)?\s+)?(?:\bPM2\s+)?`?\bQD-\d{2,4}\b`?/g;
const OPT_CODE = /\bD\d{1,2}\s?[A-C]\b/g;   /* mã phương án chỉ gỡ khi nằm trong ngoặc có mã QD */
const ONLY_HISTORY = /^(?:\s|[,·;:–—-]|và|ĐỔI|đổi|chốt|\d{1,2}\/\d{1,2}(?:\/\d{4})?)*$/;
const tidy = (x) => x.replace(/\s*[,·;]\s*(?=[,·;:)]|$)/g, '').replace(/^\s*[,·;:]\s*/, '').replace(/(?:\s*[·,]\s*){2,}/g, ' · ').replace(/[ \t]{2,}/g, ' ').trim();
export function stripMeta(text) {
  const raw = String(text ?? '');
  if (!HAS_META.test(raw)) return raw;   /* chỉ dọn chuỗi CÓ mã/nhãn — chuỗi khác giữ nguyên từng ký tự */
  /* ① ngoặc chứa mã: xử lý TRỌN cả dấu bọc *(…)* — ngoặc chỉ còn ngày/dấu phân cách thì bỏ cả cặp, kể cả dấu * bọc ngoài */
  let s = raw.replace(SRC_LABEL, '').replace(/(\*?)\(((?:[^()]|\([^()]*\))*)\)(\*?)/g, (m, a, inner, b) => {
    if (!inner.trim()) return a === b ? '' : a + b;   /* ngoặc chỉ chứa nhãn nguồn vừa gỡ ⇒ bỏ cả dấu * bọc */
    if (!/QD-\d|\bD\d{1,2}\s?[A-C]\b/.test(inner) || (a !== b)) return /QD-\d/.test(inner) ? a + '(' + tidy(inner.replace(QD_CODE, '')) + ')' + b : m;
    const c = tidy(inner.replace(QD_CODE, '').replace(OPT_CODE, ''));
    return ONLY_HISTORY.test(c) ? '' : a + '(' + c + ')' + b;
  });
  /* ② chữ đậm chỉ chứa mã (****) bỏ cả cặp ** · ③ mã còn lẻ trong câu */
  s = s.replace(/\*\*\s*(?:PM2\s+)?`?QD-\d{2,4}`?\s*\*\*/g, '').replace(QD_CODE, '');
  return s.split('\n').map((l) => l.replace(/[ \t]{2,}/g, ' ').replace(/\s*[—–]\s*(?=[:)])/g, '').replace(/\s+([,;:)]|\.(?=\s|$))/g, '$1').replace(/([,·;])\s*(?=[,·;:])/g, '').replace(/\(\s*\)/g, '').replace(/^\s*[·,;]\s*|\s*[·,;]\s*$/g, '')).join('\n').trim();
}
/* đoạn mã `…` cất ra trước, đổi định dạng xong mới trả lại — để dấu * trong mã không phá chữ đậm */
export function inline(text) {
  const codes = [];
  return escapeHtml(stripMeta(text))
    .replace(/`([^`]+)`/g, (m, x) => { codes.push(x); return '\u0000' + (codes.length - 1) + '\u0000'; })
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/~~([^~]+)~~/g, '<s>$1</s>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/\u0000(\d+)\u0000/g, (m, i) => '<code>' + codes[+i] + '</code>')
    /* thẻ HTML có trong file gốc (bảng Common Rules, Standards): <br> xuống dòng · <span style=…> bỏ thẻ giữ chữ — rà soát 14/10/2026: 63 chỗ hiện nguyên văn */
    .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
    .replace(/&lt;\/?span(?:\s[^&]*?)?&gt;/gi, '');
}
const BLOCK_START = /^\s*(```|\||>|#{1,6} |[-·*]\s+|\d+\.\s+|---+\s*$)/;   /* dòng mở khối riêng — ⛔ nối vào đoạn văn trước */
const cellsOf = (line) => line.replace(/^\|/, '').replace(/\|\s*$/, '').split(/(?<!\\)\|/).map((c) => c.trim());

export function Inline({ text, className }) { return <span className={className} dangerouslySetInnerHTML={{ __html: inline(text || '') }} />; }

export default function Markdown({ text }) {
  const lines = String(text || '').split('\n');
  const out = []; let i = 0; let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      const code = []; i++; while (i < lines.length && !/^\s*```/.test(lines[i])) { code.push(lines[i]); i++; } i++;
      out.push(<pre key={key++} className="sd-code">{code.join('\n')}</pre>);
      continue;
    }
    if (line.trim().startsWith('|')) {
      const rows = []; while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
      const body = rows.filter((r) => !/^\|[\s:|-]+\|$/.test(r));
      const [head, ...rest] = body;
      /* cột số thứ tự «#» / «STT» giữ hẹp — trước đó bảng chia đều nên cột # chiếm nửa bảng (rà soát 14/10/2026) */
      const narrow = cellsOf(head).map((c) => /^(#|STT|Số)$/i.test(c.replace(/[*`]/g, '').trim()));
      out.push(<div className="sd-md-table" key={key++}><table className="sd-table"><thead><tr>{cellsOf(head).map((c, j) => <th key={j} className={narrow[j] ? 'sd-col-num' : undefined} dangerouslySetInnerHTML={{ __html: inline(c) }} />)}</tr></thead>
        <tbody>{rest.map((r, k) => <tr key={k}>{cellsOf(r).map((c, j) => <td key={j} dangerouslySetInnerHTML={{ __html: inline(c) }} />)}</tr>)}</tbody></table></div>);
      continue;
    }
    if (/^\s*([-·*]|\d+\.)\s+/.test(line)) {
      const items = []; while (i < lines.length && /^\s*([-·*]|\d+\.)\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*([-·*]|\d+\.)\s+/, '')); i++; }
      out.push(<ul key={key++} className="sd-md-list">{items.map((t, k) => <li key={k} dangerouslySetInnerHTML={{ __html: inline(t) }} />)}</ul>);
      continue;
    }
    if (line.startsWith('>')) {
      const q = []; while (i < lines.length && lines[i].startsWith('>')) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(<blockquote key={key++} className="sd-md-quote" dangerouslySetInnerHTML={{ __html: q.map(inline).join('<br>') }} />);
      continue;
    }
    if (/^#{1,6} /.test(line)) { out.push(<h4 key={key++} className="sd-md-h" dangerouslySetInnerHTML={{ __html: inline(line.replace(/^#+ /, '')) }} />); i++; continue; }
    if (line.trim() && !/^---+$/.test(line.trim())) {
      /* nối dòng mềm 19/10/2026: câu bị ngắt giữa chừng trong file nguồn (dòng trước chưa hết câu) gộp vào cùng 1 đoạn, để trình duyệt tự xuống dòng theo bề rộng màn.
 * Dòng đã kết thúc bằng dấu câu thì giữ là đoạn riêng như cũ. */
      let para = line.trim(); i++;
      while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i]) && !/[.:!?)»"*]$/.test(para)) { para += ' ' + lines[i].trim(); i++; }
      out.push(<p key={key++} className="sd-md-p" dangerouslySetInnerHTML={{ __html: inline(para) }} />);
      continue;
    }
    i++;
  }
  return <div className="sd-md">{out}</div>;
}
