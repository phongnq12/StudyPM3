#!/usr/bin/env python3
"""Sinh sơ đồ BPMN 2.0 (draw.io) từ đặc tả JSON. Chỉ dùng thư viện chuẩn.

Cách dùng:
  python3 bpmn_drawio.py <dac-ta.json> <ra.drawio> [--xuat]
  --xuat: gọi draw.io CLI xuất thêm <ra>.drawio.svg (nhúng XML, sửa được) và <ra>.png (để tự xem).

Đặc tả JSON: xem ky-hieu.md mục 3 và templates/2-business-process/examples/PROC-01-nghi-phep.bpmn.json.
"""
import json, math, os, re, shutil, subprocess, sys
from xml.sax.saxutils import escape

# Kích thước lưới (px)
CW, RH = 210, 140            # rộng một cột, cao một hàng
POOL_HDR, LANE_HDR = 34, 30   # đầu pool, đầu lane (dọc, bên trái)
PAD_L, PAD_T = 10, 10         # lề trong lane
GAP_POOL = 60                 # khoảng cách giữa các pool
SIZE = {"task": (160, 80), "subprocess": (160, 80), "call": (160, 80), "start": (40, 40), "intermediate": (40, 40),
        "end": (40, 40), "gateway": (50, 50), "data": (40, 55), "store": (55, 55), "note": (170, 60)}

TASK = ("shape=mxgraph.bpmn.task;whiteSpace=wrap;html=1;rectStyle=rounded;size=10;fontSize=11;verticalAlign=middle;"
        "fillColor=#ffffff;strokeColor=#000000;")
EVENT = ("shape=mxgraph.bpmn.event;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;whiteSpace=wrap;"
         "perimeter=ellipsePerimeter;outlineConnect=0;aspect=fixed;fontSize=10;labelWidth=110;")
GATE = ("shape=mxgraph.bpmn.gateway2;html=1;verticalLabelPosition=top;verticalAlign=bottom;align=center;whiteSpace=wrap;"
        "perimeter=rhombusPerimeter;outlineConnect=0;fontSize=10;labelWidth=130;")
DATA = ("shape=mxgraph.bpmn.data;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;whiteSpace=wrap;"
        "size=15;fontSize=9;labelWidth=100;")
STORE = "shape=datastore;html=1;verticalLabelPosition=bottom;verticalAlign=top;align=center;whiteSpace=wrap;fontSize=9;labelWidth=100;"
NOTE = ("shape=partialRectangle;html=1;top=1;left=1;bottom=1;right=0;fillColor=none;align=left;verticalAlign=middle;"
        "spacingLeft=6;whiteSpace=wrap;fontSize=10;")
POOL = "swimlane;html=1;horizontal=0;startSize=%d;fillColor=none;fontSize=13;fontStyle=1;collapsible=0;container=1;" % POOL_HDR
LANE = "swimlane;html=1;horizontal=0;startSize=%d;fillColor=none;fontSize=11;fontStyle=0;collapsible=0;container=1;" % LANE_HDR
BLACK = "rounded=0;whiteSpace=wrap;html=1;fillColor=#f5f5f5;strokeColor=#000000;fontSize=11;fontStyle=1;"
SEQ = "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;endArrow=block;endFill=1;fontSize=9;labelBackgroundColor=#ffffff;"
MSG = ("edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;dashed=1;dashPattern=8 4;endArrow=block;endFill=0;startArrow=oval;"
       "startFill=0;fontSize=9;labelBackgroundColor=#ffffff;")
ASSOC = "edgeStyle=none;html=1;dashed=1;dashPattern=2 3;endArrow=none;fontSize=9;"
DASSOC = "edgeStyle=orthogonalEdgeStyle;html=1;dashed=1;dashPattern=2 3;endArrow=open;endFill=0;fontSize=9;"
HILITE = "fillColor=#dae8fc;strokeColor=#1f5fa8;strokeWidth=2;"

TASK_KIEU = {"abstract", "user", "service", "manual", "send", "receive", "businessRule", "script"}
SU_KIEN = {"none": "general", "message": "message", "timer": "timer", "conditional": "conditional", "signal": "signal",
           "link": "link", "error": "error", "escalation": "escalation", "terminate": "terminate", "multiple": "multiple"}
GW = {"xor": "outline=none;symbol=none;gwType=exclusive;", "and": "outline=none;symbol=none;gwType=parallel;",
      "or": "outline=end;symbol=general;", "su_kien": "outline=catching;symbol=multiple;",
      "complex": "outline=none;symbol=none;gwType=complex;"}
SIDE = {"phai": (1, 0.5), "trai": (0, 0.5), "tren": (0.5, 0), "duoi": (0.5, 1)}


def loi(msg):
    sys.exit("LỖI đặc tả: " + msg)


def q(s):
    return escape(str(s), {'"': "&quot;"})


def node_style(n):
    loai, kieu = n["loai"], n.get("kieu", "")
    if loai in ("task", "subprocess", "call"):
        k = kieu or "abstract"
        if k not in TASK_KIEU:
            loi(f"{n['id']}: kieu task '{k}' không hợp lệ ({', '.join(sorted(TASK_KIEU))})")
        s = TASK + "taskMarker=%s;" % k
        if loai in ("subprocess", "call"):
            s += "isLoopSub=1;"
        if loai == "call":
            s += "strokeWidth=3;"
        if n.get("lap") == "chuan":
            s += "isLoopStandard=1;"
        elif n.get("lap") == "song_song":
            s += "isLoopMultiParallel=1;"
        elif n.get("lap") == "tuan_tu":
            s += "isLoopMultiSeq=1;"
        if n.get("nhan_manh"):
            s += HILITE
        return s + "bpmn=%s:%s;" % (loai, k)
    if loai in ("start", "intermediate", "end", "boundary"):
        sk = n.get("su_kien", "none")
        if sk not in SU_KIEN:
            loi(f"{n['id']}: su_kien '{sk}' không hợp lệ ({', '.join(SU_KIEN)})")
        if loai == "start":
            outline = "standard"
        elif loai == "end":
            outline = "end"
        elif loai == "boundary":
            outline = "boundInt" if n.get("ngat", True) else "boundNonint"
        else:
            outline = "throwing" if n.get("huong") == "throw" else "catching"
        sym = SU_KIEN[sk]
        if loai != "end" and sk == "terminate":
            loi(f"{n['id']}: terminate chỉ dùng cho end")
        return EVENT + "outline=%s;symbol=%s;bpmn=%s:%s:%s;" % (outline, sym, loai, sk, n.get("huong", ""))
    if loai == "gateway":
        k = kieu or "xor"
        if k not in GW:
            loi(f"{n['id']}: kieu gateway '{k}' không hợp lệ ({', '.join(GW)})")
        return GATE + GW[k] + "bpmn=gateway:%s;" % k
    if loai == "data":
        return DATA + "bpmnTransferType=%s;bpmn=data;" % n.get("kieu", "none")
    if loai == "store":
        return STORE + "bpmn=store;"
    if loai == "note":
        return NOTE + "bpmn=note;"
    loi(f"{n.get('id')}: loai '{loai}' không hợp lệ")


def label(n):
    t = n.get("ten", "")
    if n["loai"] in ("task", "subprocess", "call"):
        top = n.get("ma", n["id"] if re.match(r"^PROC-\d+(\.\d+)?$", n["id"]) else "")
        s = ("<b>%s</b> " % top if top else "") + t
        if n.get("ghi_chu"):
            s += "<br><font style='font-size:9px' color='#555555'>%s</font>" % n["ghi_chu"]
        return s
    return t


def build(spec):
    pools = spec["pools"]
    nodes = spec["nodes"]
    flows = spec.get("flows", [])
    by_id = {}
    for n in nodes:
        if n["id"] in by_id:
            loi("trùng id " + n["id"])
        by_id[n["id"]] = n
    lane_of = {}
    white = [p for p in pools if not p.get("thu_gon")]
    black = [p for p in pools if p.get("thu_gon")]
    for p in white:
        if not p.get("lanes"):
            p["lanes"] = [{"id": p["id"] + "_L", "ten": ""}]
        for l in p["lanes"]:
            lane_of[l["id"]] = (p, l)
    maxcol = 0
    rows = {}
    for n in nodes:
        if n["loai"] == "boundary":
            continue
        if n.get("lane") not in lane_of:
            loi(f"{n['id']}: lane '{n.get('lane')}' không có")
        maxcol = max(maxcol, float(n.get("cot", 0)))
        h = SIZE[n["loai"]][1] + (40 if n["loai"] in ("start", "intermediate", "end", "data", "store") else 0)
        need = math.ceil(float(n.get("hang", 0)) + 0.5 + h / 2 / RH - 1e-6)   # số hàng lane cần để chứa phần tử
        rows[n["lane"]] = max(rows.get(n["lane"], 0), need - 1)
    width = POOL_HDR + LANE_HDR + PAD_L + int((maxcol + 1) * CW) + 30
    width = max(width, int(spec.get("rong_toi_thieu", 0)))
    cells = []
    geo = {}   # id -> (abs_x, abs_y, w, h)
    y = 0
    top_black = [b for b in black if b.get("vi_tri", "tren") == "tren"]
    bot_black = [b for b in black if b.get("vi_tri", "tren") == "duoi"]

    def col_x(c):
        return POOL_HDR + LANE_HDR + PAD_L + c * CW

    def put_black(b, yy):
        c0 = float(b.get("cot", 0))
        w = int(float(b.get("so_cot", 2)) * CW - 20)
        x = col_x(c0)
        cells.append(f'<mxCell id="{q(b["id"])}" value="{q(b["ten"])}" style="{BLACK}bpmn=blackpool;" vertex="1" parent="1">'
                     f'<mxGeometry x="{x}" y="{yy}" width="{w}" height="50" as="geometry"/></mxCell>')
        geo[b["id"]] = (x, yy, w, 50)

    if top_black:
        for b in top_black:
            put_black(b, 0)
        y = 50 + GAP_POOL
    lane_abs = {}
    for p in white:
        lane_h = {}
        for l in p["lanes"]:
            lane_h[l["id"]] = max(int(l.get("cao", 0)), (rows.get(l["id"], 0) + 1) * RH + 2 * PAD_T)
        ph = sum(lane_h.values())
        cells.append(f'<mxCell id="{q(p["id"])}" value="{q(p["ten"])}" style="{POOL}bpmn=pool;" vertex="1" parent="1">'
                     f'<mxGeometry x="0" y="{y}" width="{width}" height="{ph}" as="geometry"/></mxCell>')
        geo[p["id"]] = (0, y, width, ph)
        ly = 0
        for l in p["lanes"]:
            h = lane_h[l["id"]]
            cells.append(f'<mxCell id="{q(l["id"])}" value="{q(l["ten"])}" style="{LANE}bpmn=lane;" vertex="1" parent="{q(p["id"])}">'
                         f'<mxGeometry x="{POOL_HDR}" y="{ly}" width="{width - POOL_HDR}" height="{h}" as="geometry"/></mxCell>')
            lane_abs[l["id"]] = (POOL_HDR, y + ly)
            ly += h
        y += ph + GAP_POOL
    for b in bot_black:
        put_black(b, y)
    for b in [b for b in black if b.get("vi_tri") == "phai"]:   # pool thu gọn bên phải, ngang hàng một lane / hàng
        if b.get("lane") not in lane_abs:
            loi(f"{b['id']}: pool thu gọn vi_tri 'phai' cần 'lane' hợp lệ")
        w = int(float(b.get("so_cot", 1.4)) * CW)
        lx, ly = lane_abs[b["lane"]]
        yy = ly + PAD_T + float(b.get("hang", 0)) * RH + RH / 2 - 30
        cells.append(f'<mxCell id="{q(b["id"])}" value="{q(b["ten"])}" style="{BLACK}bpmn=blackpool;" vertex="1" parent="1">'
                     f'<mxGeometry x="{width + 60}" y="{yy:.0f}" width="{w}" height="60" as="geometry"/></mxCell>')
        geo[b["id"]] = (width + 60, yy, w, 60)

    def grid(lane, c, r):
        lx, ly = lane_abs[lane]
        return (lx + LANE_HDR + PAD_L + c * CW + CW / 2, ly + PAD_T + r * RH + RH / 2)

    for n in nodes:
        if n["loai"] == "boundary":
            continue
        w, h = SIZE[n["loai"]]
        if n["loai"] == "note" and n.get("cao"):
            h = n["cao"]
        cx, cy = grid(n["lane"], float(n.get("cot", 0)), float(n.get("hang", 0)))
        ax, ay = cx - w / 2 + n.get("dx", 0), cy - h / 2 + n.get("dy", 0)
        lx, ly = lane_abs[n["lane"]]
        geo[n["id"]] = (ax, ay, w, h)
        cells.append(f'<mxCell id="{q(n["id"])}" value="{q(label(n))}" style="{node_style(n)}" vertex="1" parent="{q(n["lane"])}">'
                     f'<mxGeometry x="{ax - lx:.0f}" y="{ay - ly:.0f}" width="{w}" height="{h}" as="geometry"/></mxCell>')
    for n in nodes:
        if n["loai"] != "boundary":
            continue
        host = n.get("gan")
        if host not in geo or by_id.get(host, {}).get("loai") not in ("task", "subprocess", "call"):
            loi(f"{n['id']}: boundary phải 'gan' vào một task / subprocess")
        hx, hy, hw, hh = geo[host]
        pos = float(n.get("vi_tri_bien", 0.75))
        rx, ry = hw * pos - 18, hh - 18
        geo[n["id"]] = (hx + rx, hy + ry, 36, 36)
        cells.append(f'<mxCell id="{q(n["id"])}" value="{q(label(n))}" style="{node_style(n)}labelWidth=90;" vertex="1" parent="{q(host)}">'
                     f'<mxGeometry x="{rx:.0f}" y="{ry:.0f}" width="36" height="36" as="geometry"/></mxCell>')

    for i, f in enumerate(flows):
        a, b = f["tu"], f["den"]
        for e in (a, b):
            if e not in geo:
                loi(f"luồng {a} → {b}: không có phần tử '{e}'")
        loai = f.get("loai", "seq")
        st = {"seq": SEQ, "message": MSG, "assoc": ASSOC, "data": DASSOC}.get(loai)
        if st is None:
            loi(f"luồng {a} → {b}: loai '{loai}' không hợp lệ (seq, message, assoc, data)")
        if f.get("mac_dinh"):
            st += "startArrow=dash;startFill=0;"
        if "ra" in f:
            ex, ey = SIDE[f["ra"]] if isinstance(f["ra"], str) else f["ra"]
            st += f"exitX={ex};exitY={ey};exitDx=0;exitDy=0;"
        if "vao" in f:
            nx, ny = SIDE[f["vao"]] if isinstance(f["vao"], str) else f["vao"]
            st += f"entryX={nx};entryY={ny};entryDx=0;entryDy=0;"
        st += "bpmn=%s;" % loai
        pts = ""
        if f.get("qua"):
            ps = []
            for d in f["qua"]:
                if "lane" in d:
                    ps.append(grid(d["lane"], float(d.get("cot", 0)), float(d.get("hang", 0))))
                else:
                    ps.append((d["x"], d["y"]))
            pts = '<Array as="points">' + "".join(f'<mxPoint x="{x:.0f}" y="{y_:.0f}"/>' for x, y_ in ps) + "</Array>"
        cells.append(f'<mxCell id="f{i}" value="{q(f.get("nhan", ""))}" style="{st}" edge="1" parent="1" source="{q(a)}" target="{q(b)}">'
                     f'<mxGeometry relative="1" as="geometry">{pts}</mxGeometry></mxCell>')

    if spec.get("chu_giai", True):
        lx = 0
        ly = y + (60 if bot_black else 0)
        txt = ("<b>Ký hiệu BPMN 2.0</b><br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)"
               "<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process"
               "<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association")
        if spec.get("chu_giai_them"):
            txt += "<br>" + spec["chu_giai_them"]
        cells.append(f'<mxCell id="chu_giai" value="{q(txt)}" style="rounded=0;whiteSpace=wrap;html=1;align=left;verticalAlign=top;'
                     f'spacingLeft=8;spacingTop=4;fontSize=10;fillColor=#fafafa;strokeColor=#999999;bpmn=legend;" vertex="1" parent="1">'
                     f'<mxGeometry x="{lx}" y="{ly}" width="560" height="{78 + 15 * math.ceil(len(spec.get("chu_giai_them", "")) / 95)}" as="geometry"/></mxCell>')
    name = spec.get("ten", "BPMN")
    return ('<mxfile host="ba-bpmn"><diagram name="%s" id="bpmn"><mxGraphModel grid="1" gridSize="10" page="0" math="0" shadow="0">'
            '<root><mxCell id="0"/><mxCell id="1" parent="0"/>%s</root></mxGraphModel></diagram></mxfile>') % (q(name), "".join(cells))


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    out = sys.argv[2]
    open(out, "w", encoding="utf-8").write(build(spec))
    print("Đã ghi", out)
    if "--xuat" in sys.argv:
        exe = shutil.which("drawio") or "/Applications/draw.io.app/Contents/MacOS/draw.io"
        if not os.path.exists(exe) and not shutil.which(exe):
            sys.exit("Chưa có draw.io desktop để xuất .drawio.svg. Cài: brew install --cask drawio (macOS) hoặc tải ở "
                     "https://www.drawio.com. File " + out + " đã ghi; cài xong chạy lại với --xuat.")
        base = re.sub(r"\.drawio$", "", out)
        subprocess.run([exe, "-x", "-f", "svg", "-e", "-b", "10", "-o", base + ".drawio.svg", out], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        subprocess.run([exe, "-x", "-f", "png", "-s", "1", "-o", base + ".png", out], check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print("Đã xuất", base + ".drawio.svg", "và", base + ".png")


if __name__ == "__main__":
    main()
