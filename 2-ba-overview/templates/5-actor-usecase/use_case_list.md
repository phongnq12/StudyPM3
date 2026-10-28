# TEMPLATE — DANH SÁCH USE CASE VÀ WBS CHỨC NĂNG

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `UCL_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`. Bản quản lý tiến độ vẫn giữ ở Excel `WBS_{MÃ}_{PHẠM VI}_vNN.xlsx`, cùng cột.
- Quy ước chung: ../00_quy_uoc_chung.md
- Chuẩn tham chiếu:
  · PMI PMBOK 7 và Practice Standard for WBS — quy tắc 100%: tổng nút con bằng đúng nút cha, không trùng, không sót; mỗi gói công việc có từ điển WBS.
  · ISO 21511:2018 Work breakdown structures for project and programme management.
  · Quyết định 671/QĐ-BTTTT năm 2024 Phụ lục II, III, V — danh sách yêu cầu chức năng, chuyển đổi sang use case, phân loại B·M·T và độ phức tạp theo số giao dịch.
  · Cockburn — mức mục tiêu ☁ 🌊 🐟.
-->

# DANH SÁCH USE CASE — {{DỰ ÁN}} {{PHẠM VI}}

> **{{n}} use case** trên **{{n}} chức năng**, **{{n}} module**, mã hóa theo cây WBS `{{PHÂN HỆ}}.{{NỀN TẢNG}}.{{MODULE}}.{{CHỨC NĂNG}}.{{TÍNH NĂNG}}`.
> Mỗi tính năng là **một use case** — **một thao tác** của một tác nhân lên hệ thống, **một quyền** (permission key), một kết quả, theo định nghĩa của skill `create-uc` — và nối về **mã gốc trong dự toán** để giữ phạm vi đã ký.
> Tác nhân theo [sơ đồ use case](use_case_diagram.md); căn cứ pháp lý theo [ma trận truy vết](traceability_matrix.md).
> Tài liệu **không** chứa luồng chi tiết của từng use case (đặc tả UC ở `/ba-detail`) và tiến độ thực hiện (Excel WBS).

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| Mã tài liệu | `UCL_{{MÃ}}_{{PHẠM VI}}` |
| Dự án · Phân hệ | {{}} · {{}} |
| Phiên bản · Trạng thái | v{{NN}} · {{}} |
| Người soạn · Người review · Người duyệt | {{}} |
| Mức mật | {{Nội bộ · Hạn chế · Mật}} |
| Dự toán gốc | `{{file}}` — phiên bản {{}}, ngày {{}} |

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">YYYY-MM-DD</span>** | <span style="color:green">{{PIC}}</span> | <span style="color:green">- Khởi tạo tài liệu.</span> |

## Phê duyệt

| Vai trò | Họ tên | Ngày | Ý kiến |
|---|---|---|---|
| BA soạn | | | |
| Product owner / Khách hàng | | | |
| Tech lead | | | |

---

## 1. Quy ước mã

```
{{DA1}} . {{WEB}} . {{03}} . {{01}} . {{01}}
   │          │        │      │      └─ Tính năng = Use case — 2 chữ số
   │          │        │      └──────── Chức năng — 2 chữ số
   │          │        └─────────────── Module — 2 chữ số
   │          └──────────────────────── Nền tảng: WEB · APP · KIOSK · API · JOB
   └─────────────────────────────────── Dự án + phân hệ
```

| Cấp | Ví dụ | Ý nghĩa |
|---|---|---|
| Phân hệ | `{{DA1}}` | {{DA1 — Trung tâm dịch vụ khách hàng}} |
| Nền tảng | `{{DA1.WEB}}` | {{Web}} |
| Module | `{{DA1.WEB.03}}` | {{03 — Lịch hẹn}} |
| Chức năng | `{{DA1.WEB.03.01}}` | {{Quản lý lịch hẹn}} |
| Tính năng — Use case | `{{DA1.WEB.03.01.01}}` | {{Lưu nháp lịch hẹn}} |

**Quy tắc:** mã đã phát hành **không đánh lại**; tính năng bỏ đánh dấu ⊘ và giữ dòng · thứ tự tính năng trong một chức năng: **thêm → sửa → đổi trạng thái → xóa → tìm kiếm → xem chi tiết → kết xuất → nghiệp vụ riêng**.

**Ký hiệu cột:**

| Cột | Giá trị |
|---|---|
| Mức | ☁ tóm lược · 🌊 mục tiêu người dùng · 🐟 chức năng con |
| BMT — QĐ 671 | **B** bắt buộc · **M** mong muốn · **T** tùy chọn |
| Độ phức tạp — QĐ 671 | **Đơn giản** ≤ 3 giao dịch · **Trung bình** 4–7 · **Phức tạp** > 7 |
| Ưu tiên | **P1** MVP · **P2** · **P3** |
| Tầng pháp lý | 🟢 T1 · 🟡 T2 · 🔴 T3 — định nghĩa ở ma trận truy vết |

---

## 2. Tổng hợp

| Module | Số chức năng | Số use case | P1 | B | M | T | Đơn giản | Trung bình | Phức tạp |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| {{03 Lịch hẹn}} | | | | | | | | | |
| **Tổng** | | | | | | | | | |

---

## 3. Danh sách

<!--
Cột 1–9 giữ ĐÚNG thứ tự WBS Excel hiện có: No · Group · Nền tảng · Module · Chức năng · Tính năng · Actor · Mã UC gốc · Ghi chú.
Cột bổ sung đặt sau, để dán qua lại Excel không lệch.
Dòng cấp Phân hệ, Nền tảng, Module, Chức năng chỉ điền đến cột tên của cấp đó.
"Mã UC gốc" = {mã nhóm dự toán} / UC{số dòng dự toán} — ví dụ B-II.2 / UC031.
"Ghi chú" dẫn bước quy trình, D-xx, SM mục, BR — đây là sở cứ tối thiểu.
-->

| No | Group | Nền tảng | Module | Chức năng | Tính năng | Actor | Mã UC gốc | Ghi chú | Mức | BMT | Độ phức tạp | Ưu tiên | Tầng | Trạng thái đặc tả |
|---|---|---|---|---|---|---|---|---|:-:|:-:|:-:|:-:|:-:|---|
| {{DA1}} | {{DA1 – Trung tâm dịch vụ khách hàng}} | | | | | | | | | | | | | |
| {{DA1.WEB}} | | {{Web}} | | | | | | | | | | | | |
| {{DA1.WEB.03}} | | | {{03 – Lịch hẹn}} | | | | | | | | | | | |
| {{DA1.WEB.03.01}} | | | | {{Quản lý lịch hẹn}} | | | {{B-II.2}} | {{LH-01 bước 1 · D-01}} | ☁ | | | | | |
| {{DA1.WEB.03.01.01}} | | | | | {{Lưu nháp lịch hẹn}} | {{Khách}} | {{B-II.2 / UC031}} | {{LH-01 bước 1 · kiểm không trùng}} | 🌊 | B | Trung bình | P1 | 🟡 T2 | {{Chưa · Nháp · Review · Chốt}} |

---

## 4. Mô tả giao dịch — QĐ 671 Phụ lục III

<!-- Chỉ cần cho use case đưa vào dự toán. Mỗi giao dịch là một cặp tác nhân gửi → hệ thống phản hồi. Số giao dịch quyết định độ phức tạp. -->

| Mã UC | Tên use case | Tác nhân | Giao dịch | Số giao dịch | BMT | Độ phức tạp |
|---|---|---|---|---:|:-:|:-:|
| {{}} | {{}} | {{}} | 1. {{Tác nhân làm gì}}<br>2. {{Hệ thống phản hồi gì}}<br>3. {{}} | {{3}} | B | Đơn giản |

---

## 5. Từ điển WBS — cho mỗi chức năng

<!-- PMI Practice Standard for WBS — từ điển WBS. Dùng để giao việc và nghiệm thu. -->

| Chức năng | Mô tả phạm vi | Đầu ra bàn giao | Tiêu chí hoàn thành | Phụ thuộc |
|---|---|---|---|---|
| {{DA1.WEB.03.01}} | {{}} | {{Đặc tả UC · màn hình · API · testcase}} | {{}} | {{}} |

---

## 6. Kiểm tra quy tắc 100%

| Kiểm tra | Kết quả |
|---|---|
| Mọi nhóm chức năng trong dự toán có ít nhất một tính năng | {{✅ / thiếu: …}} |
| Không tính năng nào trùng mục tiêu với tính năng khác | |
| Mọi bước quy trình do người thực hiện có use case phủ | {{Không phủ: liệt kê ở quy trình mục 10}} |
| Mọi chuyển trạng thái 👤 ở máy trạng thái có use case phủ | |

---

## 7. Câu hỏi cần chốt

| Mã | Câu hỏi | Kịch bản | Đề xuất mặc định | Người chốt | Quyết định |
|---|---|---|---|---|---|
| Q-U01 | {{}} | {{}} | {{}} | {{}} | {{}} |

---

## 8. Rủi ro còn lại

| Mã | Rủi ro | Căn cứ bị ảnh hưởng | Mức | Biện pháp | Cần khách xác nhận văn bản |
|---|---|---|:-:|---|:-:|
| RK-01 | {{}} | {{}} | C · TB · T | {{}} | Có · Không |

---

## 9. Điểm tạm hoãn

<!-- Việc đã rõ nhưng cố ý chưa làm ở phiên bản này. Không có thì ghi *Không có*. -->

| Mã | Nội dung | Ngày tạm hoãn | Điều kiện mở lại |
|---|---|---|---|
| TH-01 | {{}} | {{DD/MM/YYYY}} | {{}} |

---

## 10. Nguồn

| Tài liệu | Dùng cho |
|---|---|
| `{{file dự toán}}` sheet `PL2.Functions`, `PL3.UseCase` | Mã gốc, giao dịch, phân loại |
| `{{WBS.xlsx}}` | Cây mã, tiến độ |
