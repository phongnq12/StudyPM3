#!/usr/bin/env node
// Đọc sơ đồ quy trình presales (draw.io, BPMN 2.0 XML) ra bản chữ: trang, lane, ô (bước, cổng, sự kiện, chữ, dữ liệu),
// mũi tên. Bước 1 (/ba-init): phiên chính chạy để agent đọc bản chữ thay cho tệp XML; dau-vao-check.mjs dùng hàm
// docSoDo() để đối chiếu 1-ba-init/0-dau-vao/quy-trinh-presales.md với tệp gốc. Quy trình dạng docx, xlsx dùng office.cjs.
// Không cần cài gì (giải nén trang draw.io bằng zlib của Node).
//
// Dùng: node kit/tools/ba-verify/doc-quy-trinh.mjs <tệp.drawio|tệp.drawio.svg|tệp.bpmn|tệp.xml>
//
// Loại ô (cột "Loại" của danh mục):
//   bước    : việc làm (task, sub-process, hình chữ nhật có chữ)
//   cổng    : rẽ nhánh (rhombus, gateway)
//   sự kiện : bắt đầu, kết thúc, trung gian (ellipse, event)
//   chữ     : ô text, nhãn rời, chú thích (không bắt buộc vào danh mục)
//   dữ liệu : tài liệu, kho dữ liệu, ghi chú (không bắt buộc vào danh mục)
// Lane, pool (swimlane) không phải ô: ghi thành cột lane của ô nằm trong nó.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const giaiMa = (s) => (s ?? '')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&amp;/g, '&');
// Nhãn draw.io có thể là HTML: bỏ thẻ, <br> và xuống dòng thành một dấu cách.
export const nhanSach = (s) => giaiMa(giaiMa(s ?? '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' '))
  .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

function thuocTinh(the) {
  const ra = {};
  for (const m of the.matchAll(/([\w:-]+)\s*=\s*"([^"]*)"/g)) ra[m[1]] = m[2];
  return ra;
}

// Nội dung một trang draw.io: <mxGraphModel> để thẳng, hoặc nén (base64 → inflateRaw → decodeURIComponent).
function giaiNenTrang(noiDung) {
  const t = noiDung.trim();
  if (t.startsWith('<')) return t;
  if (!t) return '';
  const nen = zlib.inflateRawSync(Buffer.from(t, 'base64')).toString('utf8');
  return decodeURIComponent(nen);
}

function loaiTuStyle(style, coNhan) {
  const s = (style ?? '').toLowerCase();
  if (/(^|;)swimlane|bpmn=(pool|lane|blackpool)|shape=(mxgraph\.bpmn\.)?(pool|lane)/.test(s)) return 'lane';
  if (/edgelabel/.test(s)) return 'nhan-mui-ten';
  if (/(^|;)text(;|$)|bpmn=legend/.test(s)) return 'chữ';
  // Cổng trước sự kiện: cổng draw.io cũ (mxgraph.bpmn.shape;symbol=exclusiveGw) cũng có "outline=".
  if (/rhombus|gateway|gwtype|symbol=\w*gw\b/.test(s)) return 'cổng';
  if (/ellipse|shape=mxgraph\.bpmn\.event|bpmn=event|outline=(standard|end|catching|throwing|boundint|eventint)/.test(s)) return 'sự kiện';
  if (/shape=(note|document|datastore|cylinder|partialrectangle|mxgraph\.bpmn\.data)|shape=mxgraph\.flowchart\.(document|database)/.test(s)) return 'dữ liệu';
  return coNhan ? 'bước' : 'khác';
}

function docTrangDrawio(ten, xml) {
  const o = new Map(); // id → ô
  const noi = [];
  // <object|UserObject label=".." id=".."><mxCell .../></object>: id, nhãn ở thẻ bọc.
  const boc = [...xml.matchAll(/<(object|UserObject)\b([^>]*)>([\s\S]*?)<\/\1>/g)];
  const cell = [];
  for (const m of boc) {
    const tt = thuocTinh(m[2]);
    const c = m[3].match(/<mxCell\b([^>]*?)\/?>/);
    if (c) cell.push({ ...thuocTinh(c[1]), id: tt.id, value: tt.label ?? '' });
  }
  const conLai = xml.replace(/<(object|UserObject)\b[^>]*>[\s\S]*?<\/\1>/g, '');
  for (const m of conLai.matchAll(/<mxCell\b([^>]*?)\/?>/g)) cell.push(thuocTinh(m[1]));

  for (const c of cell) {
    if (!c.id) continue;
    const nhan = nhanSach(c.value);
    if (c.edge === '1') { noi.push({ id: c.id, tu: c.source ?? '', toi: c.target ?? '', nhan }); continue; }
    if (c.vertex !== '1') continue;
    o.set(c.id, { id: c.id, nhan, loai: loaiTuStyle(c.style, !!nhan), cha: c.parent ?? '' });
  }
  // Nhãn đặt trên mũi tên (ô con của edge) gộp vào nhãn mũi tên.
  for (const [id, x] of o) {
    const n = noi.find((e) => e.id === x.cha);
    if (n && (x.loai === 'nhan-mui-ten' || x.loai === 'chữ' || x.loai === 'bước')) {
      n.nhan = [n.nhan, x.nhan].filter(Boolean).join(' ');
      o.delete(id);
    } else if (x.loai === 'nhan-mui-ten') o.delete(id);
  }
  // Lane của ô: lane gần nhất theo chuỗi cha; pool lồng lane ghi "Pool / Lane".
  const laneCua = (id) => {
    const ds = [];
    for (let x = o.get(id)?.cha, i = 0; x && i < 50; x = o.get(x)?.cha, i++) if (o.get(x)?.loai === 'lane' && o.get(x).nhan) ds.unshift(o.get(x).nhan);
    return ds.join(' / ');
  };
  const ra = [];
  for (const x of o.values()) if (x.loai !== 'lane' && x.loai !== 'khác') ra.push({ id: x.id, nhan: x.nhan, loai: x.loai, lane: laneCua(x.id) });
  const lane = [...o.values()].filter((x) => x.loai === 'lane').map((x) => ({ id: x.id, nhan: x.nhan, lane: laneCua(x.id) }));
  return { ten, lane, o: ra, noi: noi.filter((e) => e.tu && e.toi) };
}

function docDrawio(text) {
  const trang = [];
  const ds = [...text.matchAll(/<diagram\b([^>]*)>([\s\S]*?)<\/diagram>/g)];
  if (!ds.length && /<mxGraphModel/.test(text)) return [docTrangDrawio('', text)];
  ds.forEach((m, i) => {
    const tt = thuocTinh(m[1]);
    trang.push(docTrangDrawio(nhanSach(tt.name) || `Trang ${i + 1}`, giaiNenTrang(m[2])));
  });
  return trang;
}

// BPMN 2.0 XML (Camunda, bpmn.io, Visio xuất). Mỗi <process> là một trang; lane theo <lane><flowNodeRef>.
const LOAI_BPMN = [
  [/^(task|userTask|serviceTask|manualTask|scriptTask|sendTask|receiveTask|businessRuleTask|subProcess|callActivity|transaction)$/, 'bước'],
  [/Gateway$/, 'cổng'],
  [/Event$/, 'sự kiện'],
  [/^(dataObjectReference|dataStoreReference|textAnnotation)$/, 'dữ liệu'],
];
function docBpmn(text) {
  const x = text.replace(/<(\/?)[\w-]+:/g, '<$1'); // bỏ tiền tố namespace bpmn:, bpmn2:
  const thamGia = new Map([...x.matchAll(/<participant\b([^>]*)>/g)].map((m) => thuocTinh(m[1])).map((t) => [t.processRef, nhanSach(t.name)]));
  const trang = [];
  for (const p of x.matchAll(/<process\b([^>]*)>([\s\S]*?)<\/process>/g)) {
    const tp = thuocTinh(p[1]);
    const than = p[2];
    const laneCua = new Map();
    const lane = [];
    for (const l of than.matchAll(/<lane\b([^>]*)>([\s\S]*?)<\/lane>/g)) {
      const tl = thuocTinh(l[1]);
      lane.push({ id: tl.id, nhan: nhanSach(tl.name), lane: '' });
      for (const r of l[2].matchAll(/<flowNodeRef>\s*([^<\s]+)\s*<\/flowNodeRef>/g)) laneCua.set(r[1], nhanSach(tl.name));
    }
    const o = [];
    const noi = [];
    for (const m of than.matchAll(/<(\w+)\b([^>]*?)(\/>|>)/g)) {
      const [, the, attr] = m;
      const t = thuocTinh(attr);
      if (the === 'sequenceFlow') { noi.push({ id: t.id, tu: t.sourceRef ?? '', toi: t.targetRef ?? '', nhan: nhanSach(t.name) }); continue; }
      const loai = LOAI_BPMN.find(([re]) => re.test(the))?.[1];
      if (!loai || !t.id) continue;
      const nhan = the === 'textAnnotation' ? nhanSach(than.slice(m.index).match(/<text>([\s\S]*?)<\/text>/)?.[1]) : nhanSach(t.name);
      o.push({ id: t.id, nhan, loai, lane: laneCua.get(t.id) ?? '' });
    }
    trang.push({ ten: nhanSach(tp.name) || thamGia.get(tp.id) || tp.id, lane, o, noi });
  }
  return trang;
}

// Đọc một tệp sơ đồ. Trả về { dang: 'drawio' | 'bpmn', trang: [{ ten, lane, o: [{ id, nhan, loai, lane }], noi }] }.
export function docSoDo(file) {
  let text = fs.readFileSync(file, 'utf8');
  // .drawio.svg: sơ đồ draw.io nằm trong thuộc tính content của thẻ <svg>.
  const svg = /^\s*(<\?xml[^>]*>\s*)?(<!DOCTYPE[^>]*>\s*)?<svg\b/.test(text) && text.match(/<svg\b[^>]*\scontent="([^"]*)"/);
  if (svg) text = giaiMa(svg[1]);
  if (/<(\w+:)?definitions\b/.test(text) && /<(\w+:)?process\b/.test(text)) return { dang: 'bpmn', trang: docBpmn(text) };
  if (/<mxfile\b|<mxGraphModel\b/.test(text)) return { dang: 'drawio', trang: docDrawio(text) };
  throw new Error(`${file}: không phải draw.io hay BPMN 2.0 XML`);
}

export const LA_SO_DO = (f) => /\.(drawio|bpmn|bpmn2)$/i.test(f) || /\.drawio\.(xml|svg)$/i.test(f);

// Bản chữ cho agent: mỗi trang một khối; ô theo thứ tự trong tệp; mũi tên ghi theo nhãn ô.
export function banChu(file) {
  const { dang, trang } = docSoDo(file);
  const ra = [`# ${path.basename(file)} (${dang}), ${trang.length} trang`];
  for (const t of trang) {
    const theoId = new Map(t.o.map((x) => [x.id, x]));
    const ten = (id) => (theoId.get(id) ? `${id} "${theoId.get(id).nhan}"` : id);
    ra.push('', `########## TRANG: ${t.ten} ##########`);
    if (t.lane.length) ra.push(`Lane: ${t.lane.map((l) => (l.lane ? `${l.lane} / ${l.nhan}` : l.nhan)).join(' | ')}`);
    ra.push('Ô (id | loại | lane | nhãn):');
    for (const x of t.o) ra.push(`  ${x.id} | ${x.loai} | ${x.lane || '—'} | ${x.nhan || '(trống)'}`);
    ra.push('Mũi tên (từ → tới [nhãn]):');
    for (const e of t.noi) ra.push(`  ${ten(e.tu)} → ${ten(e.toi)}${e.nhan ? ` [${e.nhan}]` : ''}`);
  }
  return ra.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const f = process.argv[2];
  if (!f) { console.error('Dùng: node kit/tools/ba-verify/doc-quy-trinh.mjs <tệp.drawio|tệp.bpmn>'); process.exit(2); }
  try {
    console.log(banChu(f));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
