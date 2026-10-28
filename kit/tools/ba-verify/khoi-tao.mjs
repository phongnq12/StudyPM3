#!/usr/bin/env node
// Khởi tạo hồ sơ tầng dự án từ template (bước 1 /ba-init, bước 3 của SKILL): du-an/glossary.md, du-an/open-questions.md,
// du-an/trace.csv. Giữ heading và dòng tiêu đề bảng; bỏ dòng mẫu, đoạn hướng dẫn của template (dòng mẫu như Q-001,
// PH-001 làm trace-check báo ID không có trong trace.csv). Không ghi đè file đã có.
// Dùng: node kit/tools/ba-verify/khoi-tao.mjs [--goc <repo>] [--ten "<tên dự án>"]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { thamSo, timGoc } from './lib.mjs';

const TEP = [
  ['kit/templates/ho-so/glossary.md', 'du-an/glossary.md'],
  ['kit/templates/ho-so/open-questions.md', '1-ba-init/open-questions.md'],
  ['kit/templates/ho-so/open-questions.md', 'du-an/open-questions.md'],
  ['kit/templates/ho-so/trace.csv', 'du-an/trace.csv'],
];

// Bản rỗng của một template markdown: heading, dòng tiêu đề và dòng phân cách của mỗi bảng.
export function banRong(text, ten) {
  const ra = [];
  const dong = text.split(/\r?\n/);
  for (let i = 0; i < dong.length; i++) {
    const d = dong[i];
    if (/^#{1,6}\s/.test(d)) {
      if (ra.length) ra.push('');
      ra.push(d.replace('<tên dự án>', ten).replace('<tầng: dự án / CN-xx>', 'dự án'));
      continue;
    }
    // Dòng tiêu đề bảng: dòng kế là phân cách | --- |. Bảng lồng trong mục hướng dẫn (thụt lề) bỏ qua.
    if (d.startsWith('|') && /^\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(dong[i + 1] ?? '')) {
      ra.push(d, dong[i + 1]);
      i++;
      while (i + 1 < dong.length && dong[i + 1].startsWith('|')) i++;
    }
  }
  return `${ra.join('\n')}\n`;
}

export function khoiTao({ goc, ten = '<tên dự án>' }) {
  const ra = [];
  for (const [mau, dich] of TEP) {
    const f = path.join(goc, dich);
    if (fs.existsSync(f)) { ra.push(`giữ nguyên ${dich} (đã có)`); continue; }
    const t = fs.readFileSync(path.join(goc, mau), 'utf8');
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, mau.endsWith('.csv') ? `${t.split(/\r?\n/)[0]}\n` : banRong(t, ten));
    ra.push(`tạo ${dich}`);
  }
  return ra;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = thamSo(process.argv.slice(2));
  const goc = a.goc ? path.resolve(a.goc) : timGoc(process.cwd());
  for (const x of khoiTao({ goc, ten: typeof a.ten === 'string' ? a.ten : undefined })) console.log(x);
}
