import fs from 'fs';

// QUAN TRỌNG: chỉ nạp jsdom ở đây. mermaid PHẢI được import SAU khi global.window
// đã tồn tại, nếu không nó khởi tạo DOMPurify với window rỗng và ném
// "DOMPurify.sanitize is not a function" khi parse flowchart / stateDiagram.
let JSDOM;
try {
  ({ JSDOM } = await import('jsdom'));
} catch {
  console.error('Thiếu phụ thuộc. Chạy:  cd kit/tools/ba-verify && npm install');
  console.error('(phải cài tại thư mục chứa script — Node phân giải node_modules từ đó đi lên)');
  process.exit(2);
}

const dom = new JSDOM('<!doctype html><html><body><div id="x"></div></body></html>', { pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
try { Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true }); } catch {}
global.HTMLElement = dom.window.HTMLElement;
global.SVGElement = dom.window.SVGElement;
global.Element = dom.window.Element;
global.DOMPurify = undefined;
if (!dom.window.SVGElement.prototype.getBBox) {
  dom.window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 100, height: 20 });
}

// Chỉ import mermaid sau khi global.window / document đã sẵn sàng.
let mermaid;
try {
  mermaid = (await import('mermaid')).default;
} catch {
  console.error('Thiếu phụ thuộc. Chạy:  cd kit/tools/ba-verify && npm install');
  process.exit(2);
}
mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });

const src = fs.readFileSync(process.argv[2], 'utf8');
const blocks = [...src.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)].map(m => m[1]);
console.log(`Kiểm tra ${blocks.length} sơ đồ Mermaid (v${mermaid.version ? mermaid.version() : '11'})\n`);

let fail = 0;
for (let i = 0; i < blocks.length; i++) {
  const kind = blocks[i].trim().split(/[\s\n]/)[0];
  try {
    await mermaid.parse(blocks[i]);
    console.log(`  [${i + 1}] ${kind.padEnd(18)} ✅ parse OK`);
  } catch (e) {
    fail++;
    console.log(`  [${i + 1}] ${kind.padEnd(18)} ❌ ${String(e.message || e).split('\n')[0]}`);
    const m = /line (\d+)/i.exec(String(e.message || ''));
    if (m) console.log(`        → dòng ${m[1]}: ${blocks[i].split('\n')[+m[1] - 1]}`);
  }
}
console.log(fail ? `\n❌ ${fail}/${blocks.length} sơ đồ lỗi` : `\n✅ Cả ${blocks.length} sơ đồ parse sạch`);
process.exit(fail ? 1 : 0);
