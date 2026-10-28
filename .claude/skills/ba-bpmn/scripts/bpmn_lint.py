#!/usr/bin/env python3
"""Kiểm lỗi BPMN 2.0 trên file draw.io (.drawio hoặc .drawio.svg có nhúng XML). Chỉ dùng thư viện chuẩn.

Cách dùng:
  python3 bpmn_lint.py <tệp.drawio[.svg]> [tệp khác ...] [--bang-buoc <PROC-xx.md>] [--cap 0|1|2]
  --bang-buoc: so ID bước PROC-xx.yy trong bảng bước (mục "Bảng bước") với ID task trên sơ đồ.
  --cap 1: sơ đồ cấp 1 (bản đồ tổng): phần tử chính là sub-process thu gọn; bỏ kiểm bảng bước.
  --cap 0: sơ đồ cấp 0 (luồng chính): kiểm như cấp 1.
  Ô draw.io bọc trong <object> / <UserObject> (khi BA thêm liên kết, tooltip, dữ liệu) vẫn được đọc.
Mã thoát 1 khi có lỗi mức "Chặn merge". Mã kiểm tra khớp checklist.md của skill ba-bpmn.
"""
import base64, html, re, sys, urllib.parse, zlib
import xml.etree.ElementTree as ET

CHAN, NEN, GOI = "Chặn merge", "Nên sửa", "Gợi ý"


def style_dict(s):
    d = {}
    for part in (s or "").split(";"):
        if "=" in part:
            k, v = part.split("=", 1)
            d[k.strip()] = v.strip()
        elif part.strip():
            d[part.strip()] = "1"
    return d


def text(v):
    v = re.sub(r"<br\s*/?>", " ", v or "")
    return html.unescape(re.sub(r"<[^>]+>", "", v)).strip()


def load_models(path):
    raw = open(path, encoding="utf-8").read()
    if path.endswith(".svg"):
        m = re.search(r'content="([^"]+)"', raw)
        if not m:
            sys.exit(f"{path}: không thấy XML draw.io nhúng (xuất lại với -e)")
        raw = html.unescape(m.group(1))
    root = ET.fromstring(raw)
    models = []
    for dg in root.iter("diagram"):
        gm = dg.find("mxGraphModel")
        if gm is None:
            data = (dg.text or "").strip()
            xml = urllib.parse.unquote(zlib.decompress(base64.b64decode(data), -15).decode("utf-8"))
            gm = ET.fromstring(xml)
        models.append((dg.get("name", ""), gm))
    return models


def classify(c):
    st = c["st"]
    b = st.get("bpmn", "")
    shape = st.get("shape", "")
    if c["edge"]:
        if b in ("seq", "message", "assoc", "data"):
            return b
        if st.get("dashed") == "1":
            if st.get("startArrow") == "oval":
                return "message"
            if st.get("endArrow") in ("none", None) or st.get("endArrow") == "none":
                return "assoc"
            if st.get("endArrow") == "open":
                return "data"
            return "assoc"
        return "seq"
    if b:
        return b.split(":")[0]
    if shape == "mxgraph.bpmn.task":
        return "subprocess" if st.get("isLoopSub") == "1" else "task"
    if shape == "mxgraph.bpmn.event":
        o = st.get("outline", "")
        return {"standard": "start", "end": "end", "boundInt": "boundary", "boundNonint": "boundary",
                "eventInt": "start", "eventNonint": "start"}.get(o, "intermediate")
    if shape == "mxgraph.bpmn.gateway2":
        return "gateway"
    if shape == "mxgraph.bpmn.data":
        return "data"
    if shape == "datastore":
        return "store"
    if "swimlane" in st:
        return "swimlane"
    return "other"


def gw_kind(c):
    b = c["st"].get("bpmn", "")
    if b.startswith("gateway:"):
        return b.split(":")[1]
    st = c["st"]
    if st.get("gwType") == "exclusive":
        return "xor"
    if st.get("gwType") == "parallel":
        return "and"
    if st.get("outline") == "end":
        return "or"
    if st.get("outline") == "catching":
        return "su_kien"
    return "xor"


def ev_detail(c):
    st = c["st"]
    return st.get("outline", ""), st.get("symbol", "")


def lint(path, cap, steps):
    out = []
    links = {"throw": set(), "catch": set()}
    for name, gm in load_models(path):
        cells = {}
        boc = {}  # mxCell nằm trong <object> / <UserObject>: id và nhãn ở thẻ bọc
        for w in gm.iter():
            if w.tag in ("object", "UserObject"):
                mc = w.find("mxCell")
                if mc is not None:
                    boc[id(mc)] = w
        for x in gm.iter("mxCell"):
            w = boc.get(id(x))
            cid = x.get("id") or (w.get("id") if w is not None else None)
            if cid is None:
                continue
            val = x.get("value")
            if val is None and w is not None:
                val = w.get("label")
            cells[cid] = {"id": cid, "val": text(val), "st": style_dict(x.get("style")), "parent": x.get("parent"),
                          "edge": x.get("edge") == "1", "src": x.get("source"), "tgt": x.get("target"), "vertex": x.get("vertex") == "1"}
        for c in cells.values():
            c["k"] = classify(c) if (c["edge"] or c["vertex"]) else "layer"
        # pool, lane
        roots = {cid for cid, c in cells.items() if c["k"] == "layer"}
        for c in cells.values():
            if c["k"] == "swimlane":
                c["k"] = "pool" if c["parent"] in roots else "lane"
            if c["k"] == "other" and c["vertex"] and c["st"].get("bpmn") == "blackpool":
                c["k"] = "blackpool"
        msg_ends = set()
        for c in cells.values():
            if c["k"] == "message":
                msg_ends.update([c["src"], c["tgt"]])
        for c in cells.values():
            if c["k"] == "other" and c["id"] in msg_ends and c["parent"] in roots:
                c["k"] = "blackpool"

        def pool_of(cid):
            seen = 0
            while cid in cells and seen < 50:
                c = cells[cid]
                if c["k"] in ("pool", "blackpool"):
                    return cid
                cid = c["parent"]
                seen += 1
            return None

        def lane_of(cid):
            c = cells.get(cid)
            while c and c["k"] not in ("lane", "pool"):
                c = cells.get(c["parent"])
            return c["id"] if c and c["k"] == "lane" else None

        def nm(cid):
            c = cells.get(cid, {})
            return f'{cid} "{c.get("val", "")[:40]}"'

        flow_kinds = ("task", "subprocess", "call", "gateway", "intermediate", "start", "end", "boundary")
        nodes = [c for c in cells.values() if c["k"] in flow_kinds]
        seq_in, seq_out = {}, {}
        for c in cells.values():
            if c["k"] == "seq":
                seq_out.setdefault(c["src"], []).append(c)
                seq_in.setdefault(c["tgt"], []).append(c)
                if pool_of(c["src"]) != pool_of(c["tgt"]):
                    out.append((CHAN, "B04", f"sequence flow {nm(c['src'])} → {nm(c['tgt'])} vượt ra ngoài pool; giữa hai pool phải dùng message flow"))
            if c["k"] == "message":
                ps, pt = pool_of(c["src"]), pool_of(c["tgt"])
                if ps is None or pt is None or ps == pt:
                    out.append((CHAN, "B05", f"message flow {nm(c['src'])} → {nm(c['tgt'])} phải nối hai pool khác nhau"))
                for e in (c["src"], c["tgt"]):
                    if cells.get(e, {}).get("k") == "gateway":
                        out.append((CHAN, "B13", f"message flow không được nối vào gateway {nm(e)}"))
        pools = [c for c in cells.values() if c["k"] == "pool"]
        for p in pools:
            members = [n for n in nodes if pool_of(n["id"]) == p["id"]]
            if not members:
                continue
            # trang tiếp nối: link event bắt thay cho bắt đầu, link event ném thay cho kết thúc
            link = lambda n, o: n["k"] == "intermediate" and ev_detail(n) == (o, "link")
            if not any(n["k"] == "start" or link(n, "catching") for n in members):
                out.append((CHAN, "B01", f"pool {nm(p['id'])} không có sự kiện bắt đầu"))
            if not any(n["k"] == "end" or link(n, "throwing") for n in members):
                out.append((CHAN, "B01", f"pool {nm(p['id'])} không có sự kiện kết thúc"))
            has_lanes = any(c["k"] == "lane" and c["parent"] == p["id"] for c in cells.values())
            for n in members:
                if has_lanes and n["k"] != "boundary" and lane_of(n["id"]) is None:
                    out.append((NEN, "B10", f"{nm(n['id'])} nằm trong pool có lane nhưng không thuộc lane nào"))
            flow_count = sum(1 for n in members if n["k"] in ("task", "subprocess", "call", "gateway", "intermediate"))
            if flow_count > 30:
                out.append((GOI, "B15", f"pool {nm(p['id'])} có {flow_count} phần tử luồng; nên tách sub-process (≤ khoảng 30)"))
        for n in nodes:
            i, o = len(seq_in.get(n["id"], [])), len(seq_out.get(n["id"], []))
            k = n["k"]
            outline, sym = ev_detail(n)
            if k == "start":
                if i:
                    out.append((CHAN, "B02", f"sự kiện bắt đầu {nm(n['id'])} có sequence flow đi vào"))
                if not o:
                    out.append((CHAN, "B03", f"sự kiện bắt đầu {nm(n['id'])} không có sequence flow đi ra"))
            elif k == "end":
                if o:
                    out.append((CHAN, "B02", f"sự kiện kết thúc {nm(n['id'])} có sequence flow đi ra"))
                if not i:
                    out.append((CHAN, "B03", f"sự kiện kết thúc {nm(n['id'])} không có sequence flow đi vào"))
            elif k == "boundary":
                if not o:
                    out.append((CHAN, "B03", f"sự kiện biên {nm(n['id'])} không có luồng ngoại lệ đi ra"))
                if cells.get(n["parent"], {}).get("k") not in ("task", "subprocess", "call"):
                    out.append((NEN, "B03", f"sự kiện biên {nm(n['id'])} không gắn vào task / sub-process"))
            elif k == "intermediate" and sym == "link":
                if outline == "throwing":
                    links["throw"].add(n["val"].split(":")[0].strip())
                    if not i:
                        out.append((CHAN, "B03", f"link event ném {nm(n['id'])} không có sequence flow đi vào"))
                else:
                    links["catch"].add(n["val"].split(":")[0].strip())
                    if not o:
                        out.append((CHAN, "B03", f"link event bắt {nm(n['id'])} không có sequence flow đi ra"))
            else:
                if not i:
                    out.append((CHAN, "B03", f"{nm(n['id'])} không có sequence flow đi vào (mọi phần tử giữa luồng cần đầu vào)"))
                if not o:
                    out.append((CHAN, "B03", f"{nm(n['id'])} không có sequence flow đi ra (luồng treo)"))
            if k in ("task", "subprocess", "call", "start", "end", "boundary") and not n["val"]:
                out.append((NEN, "B08", f"{n['id']} chưa có nhãn"))
            if k == "gateway":
                kind = gw_kind(n)
                if i >= 2 and o >= 2:
                    out.append((NEN, "B07", f"gateway {nm(n['id'])} vừa gộp vừa tách; tách thành hai gateway"))
                if o >= 2 and kind in ("xor", "or"):
                    if not n["val"]:
                        out.append((NEN, "B06", f"gateway tách {n['id']} chưa có câu hỏi"))
                    elif not n["val"].endswith("?"):
                        out.append((GOI, "B06", f"gateway {nm(n['id'])}: nhãn nên là câu hỏi, kết thúc bằng dấu '?'"))
                    for f in seq_out.get(n["id"], []):
                        if not f["val"] and f["st"].get("startArrow") != "dash":
                            out.append((CHAN, "B06", f"nhánh ra {nm(f['tgt'])} của gateway {nm(n['id'])} chưa có nhãn điều kiện"))
                if o == 1 and i == 1:
                    out.append((GOI, "B07", f"gateway {nm(n['id'])} chỉ có một vào một ra; bỏ gateway thừa"))
            if k in ("task", "subprocess", "call") and o >= 2 and cap != 1:   # cấp 1: nhãn là đối tượng chuyển giao, không phải điều kiện
                labels = [f["val"] for f in seq_out.get(n["id"], [])]
                if any(labels):
                    out.append((NEN, "B12", f"{nm(n['id'])} có nhiều sequence flow ra có điều kiện; dùng gateway để rẽ nhánh"))
        task_ids = {n["id"] for n in nodes if n["k"] in ("task", "subprocess", "call")}
        if steps is not None and cap != 1:
            on_diagram = {t for t in task_ids if re.match(r"^PROC-\d+\.\d+$", t)}
            for s in sorted(steps - on_diagram):
                out.append((CHAN, "B11", f"bước {s} có trong bảng bước nhưng không có trên sơ đồ"))
            for s in sorted(on_diagram - steps):
                out.append((CHAN, "B11", f"task {s} có trên sơ đồ nhưng không có trong bảng bước"))
        if cap == 1:
            for n in nodes:
                if n["k"] == "task":
                    out.append((NEN, "B16", f"sơ đồ cấp 1 nên dùng sub-process thu gọn, không dùng task: {nm(n['id'])}"))
    return out, links


def read_steps(md):
    t = open(md, encoding="utf-8").read()
    m = re.search(r"##\s*\d*\.?\s*Bảng bước(.*?)(\n##\s|\Z)", t, re.S)
    body = m.group(1) if m else t
    return set(re.findall(r"^\|\s*(PROC-\d+\.\d+)\s*\|", body, re.M))


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    cap, steps, files = 2, None, []
    i = 0
    while i < len(args):
        if args[i] == "--cap":
            cap = int(args[i + 1]); i += 2
            if cap == 0:
                cap = 1  # cấp 0 (luồng chính) kiểm theo luật cấp 1
        elif args[i] == "--bang-buoc":
            steps = read_steps(args[i + 1]); i += 2
        else:
            files.append(args[i]); i += 1
    allout, throws, catches = [], set(), set()
    for f in files:
        o, links = lint(f, cap, steps)
        allout += [(m, c, f"{f}: {s}") for m, c, s in o]
        throws |= links["throw"]; catches |= links["catch"]
    for t in sorted(throws - catches):
        allout.append((NEN, "B09", f"link event ném '{t}' không có link event bắt cùng tên trong các tệp đã kiểm"))
    for t in sorted(catches - throws):
        allout.append((NEN, "B09", f"link event bắt '{t}' không có link event ném cùng tên trong các tệp đã kiểm"))
    order = {CHAN: 0, NEN: 1, GOI: 2}
    allout.sort(key=lambda x: (order[x[0]], x[1]))
    for m, c, s in allout:
        print(f"{m} | {c} | {s}")
    n = sum(1 for m, _, _ in allout if m == CHAN)
    print(f"BPMN LINT: {'ĐẠT' if n == 0 else 'KHÔNG ĐẠT'} — Chặn merge {n}, Nên sửa {sum(1 for m,_,_ in allout if m == NEN)}, Gợi ý {sum(1 for m,_,_ in allout if m == GOI)}")
    sys.exit(1 if n else 0)


if __name__ == "__main__":
    main()
