#!/usr/bin/env python3
"""Kiểm tự động bộ tài liệu business layer của một dự án.

Đọc mọi file dự án dạng {LOẠI}_{MÃ}_{PHẠM VI}_vNN.md (LOẠI = BRD, QT, ERD, SM, UCD, UCL, BR) dưới thư mục
gốc, cùng sổ giả định, rồi báo:

  1. Mã được dẫn mà không có dòng định nghĩa ở tài liệu nào (và mã giả định không có trong sổ).
  2. Giả định: mỗi tài liệu dẫn những GD nào — trực tiếp, hoặc kế thừa qua mã mà dòng định nghĩa của mã
     đó đứng trên GD — và GD đó đang ở trạng thái gì.
  3. Cổng trạng thái (00_quy_uoc_chung mục 12): tài liệu `Chờ review` còn `[CẦN BA CHỐT]`; tài liệu
     `Đã duyệt` còn ❓, `chưa chốt (`, hoặc dẫn GD chưa chốt.
  4. Dẫn một mã đứng trên GD mà không mang theo GD đó trên cùng dòng.
  5. Tên ngắn đi kèm mã lệch tên ở dòng định nghĩa (BR, GS, D).
  6. Mã trạng thái trong máy trạng thái không có trong enum của ERD; `SM mục n` không có trong SM.
  7. Số ô ❓, `[CẦN BA CHỐT]`, `chưa chốt (`, `chờ lớp n`, `{{…}}` còn sót trong mỗi tài liệu.
  8. Điều khoản dẫn tới không có trong văn bản, nếu truyền --vbpl.

Dùng:
  python3 kiem_business_layer.py [thư_mục_gốc] [--log sổ.md] [--vbpl TT01=path.md ...]

Mặc định thư mục gốc là `2-ba-overview`, sổ là `<gốc>/assumption_log.md`. Thoát mã 1 khi có lỗi mức
Chặn, để gắn vào CI hoặc hook.
"""
import argparse
import os
import re
import sys
from collections import defaultdict

DOC_RE = re.compile(r'^(BRD|QT|ERD|SM|UCD|UCL|BR)_.+\.md$')

# Mã dẫn chiếu. Mã quy trình ({XX}-nn) trùng dạng với SH-01, CH-01… nên gom chung một mẫu hai chữ cái.
CODE_RE = re.compile(
    r'(?<![\w.-])('
    r'Q-(?:BR|B|P|E|A|U)\d{1,3}'
    r'|BR-[A-Z]{1,3}\d{2,3}'
    r'|GD-\d{4}'
    r'|(?:OBJ|BRQ|NFR|CON|ASM|DEP|ACT)-\d{2,3}'
    r'|(?:RK|TH|GS|CH|SH|SM)-\d{2,3}'
    r'|(?:D|N|R|E|S|P)-\d{2,3}'
    r'|[A-Z]{2}-\d{2}[A-Z]?'
    r')(?![\w-])')
UC_RE = re.compile(r'(?<![\w.])[A-Z][A-Z0-9]+\.(?:WEB|APP|KIOSK|API|JOB)(?:\.\d{2}){1,3}(?![\w.])')
ENUM_RE = re.compile(r'`([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+|[A-Z]{3,})`')
SM_SECTION_RE = re.compile(r'SM mục (\d+)')
LAW_RE = re.compile(r'\b([A-ZĐ][A-Za-zĐđ]*\d+[A-Za-z]*) Đ(\d+)(?:\.(\d+))?')
APPROVED_GD = {'Đã chốt', 'Đã cập nhật lớp'}
NAMED_FAMILIES = re.compile(r'^(BR-|GS-|D-)')


def strip_md(cell):
    cell = re.sub(r'<a id="[^"]*"></a>', '', cell)
    cell = re.sub(r'<[^>]+>', ' ', cell)
    return cell.replace('**', '').replace('`', '').strip()


def table_rows(text):
    for ln, line in enumerate(text.splitlines(), 1):
        if line.startswith('|') and not re.match(r'^\|\s*:?-{3}', line):
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            yield ln, line, cells


class Doc:
    def __init__(self, path):
        self.path = path
        self.name = os.path.basename(path)
        self.kind = DOC_RE.match(self.name).group(1)
        self.text = open(path, encoding='utf-8').read()
        self.lines = self.text.splitlines()
        m = re.search(r'\|\s*Phiên bản\s*·\s*Trạng thái\s*\|\s*([^|]+)\|', self.text)
        self.status = ''
        if m:
            parts = [p.strip() for p in m.group(1).split('·')]
            self.status = parts[-1] if len(parts) > 1 else ''


def load_docs(root):
    docs = []
    for d, _, files in os.walk(root):
        for f in sorted(files):
            if DOC_RE.match(f):
                docs.append(Doc(os.path.join(d, f)))
    return docs


def load_log(path):
    gds = {}
    if not os.path.exists(path):
        return gds
    text = open(path, encoding='utf-8').read()
    for _, _, cells in table_rows(text):
        if len(cells) >= 9:
            m = re.search(r'GD-\d{4}', strip_md(cells[0]))
            if m:
                gds[m.group(0)] = strip_md(cells[8])
    return gds


def collect_definitions(docs):
    """Mã → (tài liệu, dòng, tên ngắn, các GD trên dòng định nghĩa)."""
    defs = {}
    for doc in docs:
        for ln, line, cells in table_rows(doc.text):
            first = strip_md(cells[0])
            m = CODE_RE.match(first) or UC_RE.match(first)
            if not m:
                continue
            code = m.group(0)
            short = first[len(code):].strip(' .—-:')
            gds = set(re.findall(r'GD-\d{4}', line))
            defs.setdefault(code, (doc.name, ln, short, gds))
        for ln, line in enumerate(doc.lines, 1):
            m = re.match(r'^#{2,3}\s+(?:\d+\.\s+)?([A-Z]{2}-\d{2}[A-Z]?)\.?\s*(.*)', line)
            if m:
                defs.setdefault(m.group(1), (doc.name, ln, m.group(2).strip(), set()))
    return defs


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('root', nargs='?', default='2-ba-overview')
    ap.add_argument('--log')
    ap.add_argument('--vbpl', action='append', default=[], help='VIẾT_TẮT=đường_dẫn văn bản pháp luật')
    a = ap.parse_args()
    log_path = a.log or os.path.join(a.root, 'assumption_log.md')

    docs = load_docs(a.root)
    if not docs:
        print(f'Không thấy tài liệu dự án nào dưới {a.root}.')
        return 0
    gd_status = load_log(log_path)
    defs = collect_definitions(docs)
    block, warn = [], []

    erd_enums = set()
    for d in docs:
        if d.kind == 'ERD':
            erd_enums |= set(ENUM_RE.findall(d.text))
    sm_sections = set()
    for d in docs:
        if d.kind == 'SM':
            sm_sections |= set(re.findall(r'^##\s+(\d+)\.', d.text, re.M))

    laws = {}
    for spec in a.vbpl:
        abbr, _, p = spec.partition('=')
        laws[abbr] = open(p, encoding='utf-8').read()

    summary = []
    for d in docs:
        direct_gd, inherited_gd = set(), defaultdict(set)
        for ln, line in enumerate(d.lines, 1):
            for m in CODE_RE.finditer(line):
                code = m.group(0)
                if code.startswith('GD-'):
                    direct_gd.add(code)
                    if code not in gd_status:
                        block.append(f'{d.name}:{ln} dẫn {code} nhưng sổ giả định không có mã này')
                    continue
                if code not in defs:
                    block.append(f'{d.name}:{ln} dẫn {code} nhưng không tài liệu nào định nghĩa mã này')
                    continue
                ddoc, dln, short, gds = defs[code]
                if (ddoc, dln) == (d.name, ln):
                    continue
                for g in gds:
                    inherited_gd[g].add(code)
                    if g not in line:
                        warn.append(f'{d.name}:{ln} dẫn {code} — mã này đứng trên {g} — mà không mang theo {g}')
                if short and NAMED_FAMILIES.match(code):
                    after = line[m.end():].lstrip(' `*')
                    if after[:1].isalpha() and after[:1].isupper():
                        if not after.lower().startswith(short.lower()[:max(8, len(short) // 2)]):
                            warn.append(f'{d.name}:{ln} tên ngắn của {code} lệch dòng định nghĩa ({ddoc}:{dln} "{short}")')
            for m in UC_RE.finditer(line):
                if m.group(0) not in defs:
                    block.append(f'{d.name}:{ln} dẫn mã UC {m.group(0)} nhưng danh sách use case không có')
            for m in SM_SECTION_RE.finditer(line):
                if sm_sections and m.group(1) not in sm_sections:
                    block.append(f'{d.name}:{ln} dẫn SM mục {m.group(1)} nhưng tài liệu máy trạng thái không có mục đó')
            for m in LAW_RE.finditer(line):
                abbr, art, cl = m.group(1), m.group(2), m.group(3)
                if abbr not in laws:
                    continue
                body = laws[abbr]
                am = re.search(rf'(?m)^\W*Điều {art}\b', body)
                if not am:
                    block.append(f'{d.name}:{ln} dẫn {abbr} Đ{art} nhưng văn bản không có Điều {art}')
                    continue
                nxt = re.search(rf'(?m)^\W*Điều {int(art) + 1}\b', body[am.end():])
                seg = body[am.end(): am.end() + nxt.start()] if nxt else body[am.end():]
                if cl and not re.search(rf'(?m)^\s*{cl}\.', seg):
                    block.append(f'{d.name}:{ln} dẫn {abbr} Đ{art}.{cl} nhưng Điều {art} không có khoản {cl}')
        if d.kind == 'SM' and erd_enums:
            for ln, line in enumerate(d.lines, 1):
                for e in ENUM_RE.findall(line):
                    if e not in erd_enums and not e.endswith('_GROUP'):
                        warn.append(f'{d.name}:{ln} mã trạng thái `{e}` không có trong enum của ERD')

        cnt = {
            '❓': d.text.count('❓'),
            'CẦN BA CHỐT': d.text.count('[CẦN BA CHỐT]'),
            'chưa chốt': d.text.count('chưa chốt ('),
            'chờ lớp': len(re.findall(r'chờ lớp \d', d.text)),
            '{{…}}': d.text.count('{{'),
        }
        all_gd = direct_gd | set(inherited_gd)
        open_gd = sorted(g for g in all_gd if gd_status.get(g) not in APPROVED_GD)
        if d.status.startswith('Chờ review') and cnt['CẦN BA CHỐT']:
            block.append(f'{d.name}: trạng thái Chờ review nhưng còn {cnt["CẦN BA CHỐT"]} [CẦN BA CHỐT]')
        if d.status.startswith('Đã duyệt'):
            for k in ('❓', 'CẦN BA CHỐT', 'chưa chốt', '{{…}}'):
                if cnt[k]:
                    block.append(f'{d.name}: trạng thái Đã duyệt nhưng còn {cnt[k]} {k}')
            if open_gd:
                block.append(f'{d.name}: trạng thái Đã duyệt nhưng dẫn giả định chưa chốt: ' +
                             ', '.join(f'{g} ({gd_status.get(g, "không có trong sổ")})' for g in open_gd))
        summary.append((d, cnt, sorted(direct_gd), dict(inherited_gd), open_gd))

    print('# Kiểm business layer\n')
    print('| Tài liệu | Trạng thái | ❓ | [CẦN BA CHỐT] | chưa chốt | chờ lớp | {{…}} | GD dẫn trực tiếp | GD kế thừa | GD chưa chốt |')
    print('|---|---|--:|--:|--:|--:|--:|---|---|---|')
    for d, c, dg, ig, og in summary:
        inh = ', '.join(f'{g} (qua {", ".join(sorted(v))})' for g, v in sorted(ig.items())) or '—'
        print(f'| {d.name} | {d.status or "?"} | {c["❓"]} | {c["CẦN BA CHỐT"]} | {c["chưa chốt"]} | '
              f'{c["chờ lớp"]} | {c["{{…}}"]} | {", ".join(dg) or "—"} | {inh} | {", ".join(og) or "—"} |')
    print(f'\n## Chặn ({len(block)})\n')
    for x in block or ['Không có.']:
        print(f'- {x}')
    print(f'\n## Cảnh báo ({len(warn)})\n')
    for x in warn or ['Không có.']:
        print(f'- {x}')
    return 1 if block else 0


if __name__ == '__main__':
    sys.exit(main())
