// Dùng: node kit/tools/ba-verify/office.cjs <file.docx|file.xlsx> [sheetNameFilter]
const { execFileSync } = require('child_process');
const path = require('path');

const file = process.argv[2];
const filter = process.argv[3];

function unz(entry) {
  try {
    return execFileSync('unzip', ['-p', file, entry], { maxBuffer: 1 << 30 }).toString('utf8');
  } catch (e) { return ''; }
}
function list() {
  try {
    return execFileSync('unzip', ['-Z1', file], { maxBuffer: 1 << 28 }).toString('utf8').split(/\r?\n/);
  } catch (e) { return []; }
}
const dec = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

function docx() {
  let xml = unz('word/document.xml');
  // tables -> mark rows/cells
  xml = xml.replace(/<w:tab\/>/g, '\t');
  xml = xml.replace(/<w:br\/>/g, '\n');
  // paragraph & cell boundaries
  const out = [];
  // Split into paragraphs
  const paras = xml.split(/<w:p[ >]/).slice(1);
  for (const p of paras) {
    const texts = [...p.matchAll(/<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g)].map(m => dec(m[1]));
    const line = texts.join('');
    out.push(line);
  }
  console.log(out.join('\n'));
  // Also dump tables in a row-wise way
  console.log('\n\n===== TABLES (row-wise) =====');
  const tbls = xml.split(/<w:tbl>/).slice(1);
  tbls.forEach((t, i) => {
    console.log(`\n--- table ${i + 1} ---`);
    const rows = t.split(/<w:tr[ >]/).slice(1);
    for (const r of rows) {
      const cells = r.split(/<w:tc>/).slice(1).map(c =>
        [...c.matchAll(/<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g)].map(m => dec(m[1])).join('').trim()
      );
      if (cells.length) console.log(cells.join(' | '));
    }
  });
}

function colToNum(col) { let n = 0; for (const ch of col) n = n * 26 + (ch.charCodeAt(0) - 64); return n; }

function xlsx() {
  const ss = [];
  const ssXml = unz('xl/sharedStrings.xml');
  if (ssXml) {
    for (const m of ssXml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
      const t = [...m[1].matchAll(/<t(?: [^>]*)?>([\s\S]*?)<\/t>/g)].map(x => dec(x[1])).join('');
      ss.push(t);
    }
  }
  const wb = unz('xl/workbook.xml');
  const rels = unz('xl/_rels/workbook.xml.rels');
  const relMap = {};
  for (const m of rels.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)) relMap[m[1]] = m[2];
  const sheets = [];
  for (const m of wb.matchAll(/<sheet[^>]*name="([^"]*)"[^>]*r:id="([^"]+)"/g)) {
    sheets.push({ name: dec(m[1]), target: relMap[m[2]] });
  }
  if (!sheets.length) {
    list().filter(f => /^xl\/worksheets\/sheet\d+\.xml$/.test(f)).forEach((f, i) => sheets.push({ name: 'sheet' + (i + 1), target: f.replace('xl/', '') }));
  }
  for (const sh of sheets) {
    if (filter && !sh.name.toLowerCase().includes(filter.toLowerCase())) continue;
    let p = sh.target.startsWith('/') ? sh.target.slice(1) : 'xl/' + sh.target.replace(/^\.\//, '');
    const sx = unz(p);
    console.log(`\n\n########## SHEET: ${sh.name} ##########`);
    if (!sx) { console.log('(empty/unreadable)'); continue; }
    // Dòng rỗng có định dạng là thẻ tự đóng <row r="2" .../>: phải nhận riêng, không thì số dòng bị lệch.
    for (const rm of sx.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
      const soDong = /\br="(\d+)"/.exec(rm[1]);
      if (!soDong || !rm[2]) continue;
      const cells = {};
      let maxc = 0;
      for (const cm of rm[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = cm[1], body = cm[2] || '';
        const rAttr = /r="([A-Z]+)\d+"/.exec(attrs);
        const ci = rAttr ? colToNum(rAttr[1]) : 0;
        const t = /t="([^"]+)"/.exec(attrs);
        let v = '';
        const vm = /<v>([\s\S]*?)<\/v>/.exec(body);
        const isM = /<is>([\s\S]*?)<\/is>/.exec(body);
        if (t && t[1] === 's' && vm) v = ss[+vm[1]] ?? '';
        else if (t && t[1] === 'inlineStr' && isM) v = [...isM[1].matchAll(/<t(?: [^>]*)?>([\s\S]*?)<\/t>/g)].map(x => dec(x[1])).join('');
        else if (vm) v = dec(vm[1]);
        // Ô chứa "|" ghi thành "\\|" để không lẫn với dấu tách ô " | ".
        v = String(v).replace(/\r?\n/g, ' ⏎ ').replace(/\|/g, '\\|').trim();
        if (v) { cells[ci] = v; if (ci > maxc) maxc = ci; }
      }
      if (!Object.keys(cells).length) continue;
      const arr = [];
      for (let i = 1; i <= maxc; i++) arr.push(cells[i] ?? '');
      console.log(`r${soDong[1]}: ` + arr.join(' | '));
    }
  }
}

const ext = path.extname(file).toLowerCase();
if (ext === '.docx') docx();
else if (ext === '.xlsx') xlsx();
else console.error('unsupported: ' + ext);
