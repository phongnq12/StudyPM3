/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* PM2 · WEB-02 Quầy tiếp đón — DỮ LIỆU MẪU KHOÁ TIẾNG ANH (Màn hình luôn hiện TÊN NGHIỆP VỤ.
 Module bên dưới dựng lại khoá cũ bằng lớp chuyển đổi (chỉ dùng trong Prototype, FE bỏ qua). */
const COUNTER_STATUS = {
  DRAFT: { label: 'Nháp' },
  ACTIVE: { label: 'Hoạt động' },
  INACTIVE: { label: 'Vô hiệu hóa' }
};
const VISIT_ZONES = [
  {
    "code": "TC01",
    "name": "Phòng thăm gặp chung số 1"
  },
  {
    "code": "TC02",
    "name": "Phòng thăm gặp chung số 2"
  },
  {
    "code": "TR01",
    "name": "Phòng thăm gặp riêng số 1"
  }
];
const RECEPTION_COUNTERS = [
  {
    "code": "Q01",
    "name": "Quầy tiếp đón số 1",
    "location": "Sảnh chính, tầng 1",
    "phoneNumber": "1101",
    "staffCount": 2,
    "zoneCodes": [
      "TC01",
      "TC02"
    ],
    "procedureMinutes": 5,
    "allowNewRegistration": true,
    "note": "",
    "status": "ACTIVE",
    "hasStaffOnDuty": true,
    "workingHours": {
      "morning": {
        "from": "07:30",
        "to": "11:00"
      },
      "afternoon": {
        "from": "13:30",
        "to": "16:30"
      }
    },
    "capacities": [
      {
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5,
          6
        ],
        "from": "07:30",
        "to": "11:00",
        "maxSlots": 24,
        "reservedSlots": 4,
        "note": ""
      },
      {
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5,
          6
        ],
        "from": "13:30",
        "to": "16:30",
        "maxSlots": 20,
        "reservedSlots": 4,
        "note": ""
      }
    ],
    "todayBookedCount": 30,
    "todayCheckedInCount": 12
  },
  {
    "code": "Q02",
    "name": "Quầy tiếp đón số 2",
    "location": "Sảnh chính, tầng 1",
    "phoneNumber": "1102",
    "staffCount": 1,
    "zoneCodes": [
      "TC01",
      "TR01"
    ],
    "procedureMinutes": 5,
    "allowNewRegistration": false,
    "note": "",
    "status": "ACTIVE",
    "hasStaffOnDuty": true,
    "workingHours": {
      "morning": {
        "from": "07:30",
        "to": "11:00"
      },
      "afternoon": {
        "from": "13:30",
        "to": "16:30"
      }
    },
    "capacities": [
      {
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5,
          6
        ],
        "from": "07:30",
        "to": "11:00",
        "maxSlots": 16,
        "reservedSlots": 2,
        "note": ""
      },
      {
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5,
          6
        ],
        "from": "13:30",
        "to": "16:30",
        "maxSlots": 14,
        "reservedSlots": 2,
        "note": ""
      }
    ],
    "todayBookedCount": 13,
    "todayCheckedInCount": 5
  },
  {
    "code": "Q03",
    "name": "Quầy tiếp đón số 3 (dự phòng)",
    "location": "Cổng phụ khu B",
    "phoneNumber": "",
    "staffCount": 1,
    "zoneCodes": [
      "TC02"
    ],
    "procedureMinutes": 5,
    "allowNewRegistration": false,
    "note": "Đang khai năng lực",
    "status": "DRAFT",
    "hasStaffOnDuty": false,
    "workingHours": {
      "morning": {
        "from": "08:00",
        "to": "11:00"
      },
      "afternoon": {
        "from": "",
        "to": ""
      }
    },
    "capacities": [],
    "todayBookedCount": 0,
    "todayCheckedInCount": 0
  },
  {
    "code": "Q04",
    "name": "Quầy tiếp đón khu A cũ",
    "location": "Nhà A, tầng trệt",
    "phoneNumber": "1201",
    "staffCount": 1,
    "zoneCodes": [
      "TC01"
    ],
    "procedureMinutes": 6,
    "allowNewRegistration": false,
    "note": "Ngừng dùng sau khi chuyển sảnh",
    "status": "INACTIVE",
    "hasStaffOnDuty": false,
    "workingHours": {
      "morning": {
        "from": "08:00",
        "to": "11:00"
      },
      "afternoon": {
        "from": "",
        "to": ""
      }
    },
    "capacities": [
      {
        "daysOfWeek": [
          1,
          2,
          3,
          4,
          5
        ],
        "from": "08:00",
        "to": "11:00",
        "maxSlots": 10,
        "reservedSlots": 0,
        "note": ""
      }
    ],
    "todayBookedCount": 0,
    "todayCheckedInCount": 0
  },
  {
    "code": "Q05",
    "name": "Quầy tiếp đón ưu tiên",
    "location": "Sảnh chính, tầng 1",
    "phoneNumber": "1103",
    "staffCount": 1,
    "zoneCodes": [
      "TR01"
    ],
    "procedureMinutes": 8,
    "allowNewRegistration": false,
    "note": "Phục vụ thân nhân cao tuổi",
    "status": "ACTIVE",
    "hasStaffOnDuty": false,
    "workingHours": {
      "morning": {
        "from": "08:00",
        "to": "11:00"
      },
      "afternoon": {
        "from": "",
        "to": ""
      }
    },
    "capacities": [
      {
        "daysOfWeek": [
          0,
          6
        ],
        "from": "08:00",
        "to": "11:00",
        "maxSlots": 8,
        "reservedSlots": 2,
        "note": "Cuối tuần"
      }
    ],
    "todayBookedCount": 0,
    "todayCheckedInCount": 0
  }
];
function counterToLegacy(c) {
  const r = { ma: c.code, ten: c.name, viTri: c.location, dienThoai: c.phoneNumber, soCanBo: c.staffCount, pk: c.zoneCodes.slice(), thoiGianThuTuc: c.procedureMinutes,
    choDangKyMoi: c.allowNewRegistration, ghiChu: c.note, tt: COUNTER_STATUS[c.status].label, canBoTruc: c.hasStaffOnDuty, datHomNay: c.todayBookedCount, daCheckIn: c.todayCheckedInCount };
  const g = c.workingHours || {}; r.gioLamViec = {}; if (g.morning) r.gioLamViec.sang = { tu: g.morning.from, den: g.morning.to }; if (g.afternoon) r.gioLamViec.chieu = { tu: g.afternoon.from, den: g.afternoon.to };
  r.nangLuc = (c.capacities || []).map(function (k) { return { ngay: k.daysOfWeek.slice(), tu: k.from, den: k.to, toiDa: k.maxSlots, rieng: k.reservedSlots, ghiChu: k.note }; });
  return r;
}

/* ============================================================================
 KHO DỮ LIỆU DÙNG CHUNG — PM2 · WEB-02 Quầy tiếp đón
 Dùng cho 3 màn: Danh sách · Thêm mới · Chỉnh sửa.
 Lưu trên trình duyệt (localStorage) để Thêm mới hoặc Chỉnh sửa xong thì Danh sách
 thấy ngay. Mọi lần đọc ghi đều bọc try/catch — trình duyệt chặn lưu trữ thì màn
 vẫn chạy bằng dữ liệu gốc.

 VÒNG ĐỜI — theo chuẩn Danh mục PM5 (Knowhow WEB-02 mục C.1 điều 2):
 Nháp → Hoạt động ⇄ Vô hiệu hóa · rời Nháp thì ⛔ quay lại được · chỉ Nháp xóa được.
 NHÃN ĐANG MỞ / TẠM ĐÓNG — ⛔ phải trạng thái (điều 3): tự tính theo GIỜ LÀM VIỆC của
 quầy, chia Buổi sáng và Buổi chiều.
 ============================================================================ */
(function (w) {
  const KHO = 'pm2_quay_tiep_don_ds_v3';   /* v3: thêm giờ làm việc sáng / chiều */

  /* 🟢 Verified (prototype lịch hẹn + đăng ký tại quầy): Q01 Q02, TC01 TC02.
 🟠 AI Inferred: Q03 Q04 Q05, TR01 và mọi con số năng lực là dữ liệu giả lập. */
  const PHAN_KHU = VISIT_ZONES.map(function (z) { return { ma: z.code, ten: z.name }; });
  const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const THU_DAY = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const T2_T7 = [1, 2, 3, 4, 5, 6], T2_T6 = [1, 2, 3, 4, 5];

  const GOC = RECEPTION_COUNTERS.map(counterToLegacy);

  function doc() {
    try {
      const s = localStorage.getItem(KHO);
      if (s) return JSON.parse(s);
    } catch (e) { /* ⛔ đọc được ⇒ dùng dữ liệu gốc */ }
    return JSON.parse(JSON.stringify(GOC));
  }
  function ghi(ds) {
    try { localStorage.setItem(KHO, JSON.stringify(ds)); } catch (e) { /* ⛔ ghi được ⇒ chỉ giữ trong phiên */ }
  }
  function tim(ma) { return doc().find(q => q.ma === ma) || null; }
  function luu(q) {
    const ds = doc();
    const i = ds.findIndex(x => x.ma === q.ma);
    if (i >= 0) ds[i] = q; else ds.push(q);
    ghi(ds);
  }
  function xoa(ma) { ghi(doc().filter(q => q.ma !== ma)); }
  function doiTrangThai(ma, tt) { const q = tim(ma); if (q) { q.tt = tt; luu(q); } return q; }
  function datLai() { try { localStorage.removeItem(KHO); } catch (e) {} }

  function tenPK(ma) { const p = PHAN_KHU.find(x => x.ma === ma); return p ? p.ten : ma; }
  function phut(g) { return (+String(g).slice(0, 2)) * 60 + (+String(g).slice(3, 5)); }

  /* BRD 4.3: tổng suất tự tính từ bảng năng lực — 🟠 AI Inferred: tính cho HÔM NAY */
  function khungTrongNgay(q, thu) { return (q.nangLuc || []).filter(k => (k.ngay || []).indexOf(thu) >= 0); }
  function tongSuat(q, thu) { return khungTrongNgay(q, thu == null ? new Date().getDay() : thu).reduce((s, k) => s + (+k.toiDa || 0), 0); }

  /* GIỜ LÀM VIỆC — 🟢 Verified: theo giờ làm việc cài cho Quầy,
 chia sáng và chiều. Một buổi được để trống (quầy chỉ làm 1 buổi) —
 🟡 Based on Docs (WEB-50 tab 3, trích ở màn Đăng ký lượt tại quầy): "Một ca có thể để trống".
 🟠 AI Inferred: giờ làm việc áp cho MỌI ngày, vì ⛔ nói tới ngày trong tuần. */
  const BUOI = [{ k: 'sang', ten: 'Buổi sáng' }, { k: 'chieu', ten: 'Buổi chiều' }];
  function buoiCo(q) {
    const g = q.gioLamViec || {};
    return BUOI.filter(b => g[b.k] && g[b.k].tu && g[b.k].den).map(b => ({ ten: b.ten, tu: g[b.k].tu, den: g[b.k].den }));
  }
  function moTaGio(q) {
    const ds = buoiCo(q);
    return ds.length ? ds.map(b => b.ten + ' ' + b.tu + '–' + b.den).join(' · ') : 'Chưa khai giờ làm việc';
  }
  /* Nhãn Đang mở / Tạm đóng — chỉ có nghĩa với quầy Hoạt động */
  function tinhMoCua(q, luc) {
    if (q.tt !== 'Hoạt động') return null;
    const d = luc || new Date();
    const bay = d.getHours() * 60 + d.getMinutes();
    const ds = buoiCo(q);
    const trong = ds.find(b => bay >= phut(b.tu) && bay < phut(b.den));
    if (trong) return { mo: true, chu: 'Đang mở', tip: 'Đang trong giờ làm việc ' + trong.ten.toLowerCase() + ' ' + trong.tu + '–' + trong.den };
    return { mo: false, chu: 'Tạm đóng', tip: ds.length ? 'Ngoài giờ làm việc — ' + moTaGio(q) : 'Quầy chưa khai giờ làm việc' };
  }

  /* MSG-WEB-02-01 — tìm 2 khung chồng lấn trong cùng 1 ngày */
  function timChongLan(nangLuc) {
    for (let t = 0; t < 7; t++) {
      const ds = nangLuc.filter(k => (k.ngay || []).indexOf(t) >= 0 && k.tu && k.den)
        .slice().sort((a, b) => phut(a.tu) - phut(b.tu));
      for (let i = 1; i < ds.length; i++) if (phut(ds[i].tu) < phut(ds[i - 1].den)) return [ds[i - 1], ds[i]];
    }
    return null;
  }

  w.QUAY = { KHO, PHAN_KHU, THU, THU_DAY, doc, ghi, tim, luu, xoa, doiTrangThai, datLai,
             tenPK, phut, khungTrongNgay, tongSuat, BUOI, buoiCo, moTaGio, tinhMoCua, timChongLan };
})(window);
