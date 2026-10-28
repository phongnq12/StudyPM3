# TEMPLATE — ĐẶC TẢ MỘT MÀN HÌNH

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `3-ba-detail/Screens/CN-xx-<slug>/SCR-xxx-<slug>.md` (đợt 3 của `/ba-detail CN-xx`), mỗi SCR một file.
  Xóa mọi khối HƯỚNG DẪN và dòng ví dụ trước khi commit. Giữ đủ heading.
- Phương pháp: .claude/skills/ba-detail/method-screens.md. Checklist: .claude/skills/ba-detail/checklist-screens.md.
- Chuẩn tham chiếu:
  · ISO 9241-110:2020 — bảy nguyên tắc tương tác; WCAG 2.2 — tiếp cận (qua SCR-000 mục 7).
  · ISO/IEC 11179 — mỗi trường đủ nhãn, kiểu, bắt buộc, mặc định, miền giá trị, nguồn.
- Người đọc: Dev dựng màn, QC kiểm từng trường, nút mà không phải hỏi lại.
- Chỉ ghi phần khác `3-ba-detail/Screens/SCR-000-quy-uoc-chung.md`; phần dùng chung dẫn "theo SCR-000 mục x".
- Dẫn mã, không chép luồng UC, phát biểu BR, định nghĩa trường. Mã theo business layer v3: `Bang.truong` (ERD mục 4),
  enum kèm `SM mục n`, `SM mục n: TU → DEN`, `BR-{nhóm}{nn}`, `ACT-nn`, permission key (UCL), mã UC WBS. Mã kèm tên ngắn.
- Khung lập từ dấu `data-*` của trang có `data-scr` này (method-screens.md mục 2): không thêm dòng không có dấu.
- Ba giá trị đặc biệt: `n/a` (chắc chắn không có), `[CẦN XÁC NHẬN: Q-xxx]` (chưa biết, con số chưa có nguồn), ASM
  (hành vi suy luận, chờ xác nhận). Không ô trống, không dùng "—" thay các giá trị này.
-->

# {{SCR-xxx}} — {{Tên màn}}

## 1. Thông tin chung

| SCR | CN | MP nguồn | Quyết định MP → màn | UC (bước) | Actor | Prototype | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {{SCR-xxx}} | {{CN-xx}} | {{MP-xxx / n/a (màn mới)}} | {{Giữ / Sửa / Tách / Gộp / Mới}} (prototype-notes.md mục 3) | {{<MA>.WEB.mm.cc.tt <tên> (bước …)}} | {{ACT-nn <Tên vai>}} | `{{route}}` · `src/pages/{{CN-xx}}/{{TenMan}}/` | draft |

Ảnh: trước (presales) `1-ba-init/0-dau-vao/man-presales/{{MP-xxx}}.png`; sau (prototype)
`3-ba-detail/Prototype/{{CN-xx-slug}}/anh/{{SCR-xxx}}-Main.png`.
Khung: {{sinh từ data-* / lập tay từ data-* (ghi lý do)}}.

## 2. Mục đích

{{Màn giúp ai làm việc gì; một đến ba câu; dẫn UC, BRQ. Không mô tả giao diện.}}

## 3. Vào và ra

| Hướng | Từ / tới | Khi nào | Dữ liệu mang theo |
| --- | --- | --- | --- |
| Vào | {{SCR-xxx / menu}} | {{nút, sự kiện}} | {{mã bản ghi / n/a}} |
| Ra | {{SCR-xxx}} | {{sau hành động nào}} | {{mã bản ghi / n/a}} |

Tiêu điểm khi vào màn và thứ tự Tab: theo SCR-000 mục 7; khác thì ghi ở đây ({{trường nhận tiêu điểm đầu tiên}}).

## 4. Trường

<!--
HƯỚNG DẪN
- Mỗi `data-ent` trên trang một dòng. Kiểu: mã khối AGENTS.md hoặc component `App*` của design system PM2.
- Miền giá trị, độ dài: dẫn ERD (kiểu, ràng buộc, enum mục 4.x); chỉ ghi giới hạn màn thêm. Con số không nguồn → [CẦN XÁC NHẬN].
-->

| # | Nhãn | Thuộc tính | Kiểu nhập / hiển thị | Bắt buộc | Mặc định | Miền giá trị, độ dài | Chỉ đọc khi | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | {{glossary}} | {{`Bang.truong` / Δ hoặc BR-xxx <tên> (tính) / không lưu}} | {{`date` (DateTimeInput)}} | {{Có / Không / Có điều kiện (BR-xxx <tên> hoặc ◐ ERD) / n/a (chỉ hiển thị)}} | {{trống / <giá trị>}} | {{theo ERD: kiểu, ràng buộc, enum / n/a}} | {{`CODE` (SM mục n); ACT-nn <tên> / n/a}} | {{ERD mục 4 `Bang`; MP-xxx; điều khoản biểu mẫu}} |

## 5. Hành động

<!--
HƯỚNG DẪN
- Mỗi nút có `data-uc` hoặc `data-sm` một dòng. Nút đổi trạng thái chỉ hiện ở trạng thái nguồn của chuyển.
-->

| Nút / hành động | Hiển thị khi (trạng thái, ACT) | Bật khi | Kết quả (chuyển trạng thái, SCR, thông báo) | Xác nhận | Quyền |
| --- | --- | --- | --- | --- | --- |
| {{nhãn}} | {{`CODE` (SM mục n); ACT-nn (BR-xxx <tên>)}} | {{điều kiện / luôn}} | {{SM mục n: TU → DEN; về SCR-xxx; TB-xxx-01}} | {{Có / Không (SCR-000 mục 4)}} | {{ACT-nn · `permission.key` (UCL)}} |

## 6. Kiểm tra dữ liệu và thông báo

<!--
HƯỚNG DẪN
- Điều kiện kiểm đã chốt ở ERD (ràng buộc mục 4, R-xx mục 5) và BR: dẫn mã ở cột "BR / kỹ thuật", KHÔNG chép lại giới
  hạn, biên. Mục này chỉ chốt thời điểm kiểm, chuỗi hiển thị (chép đúng thong-bao.js) và chỗ hiện.
- Kiểm tra màn cần mà ERD, BR không có → Q, không thêm điều kiện mới ở màn.
- Không đưa con số [CẦN XÁC NHẬN], CH-xx chưa chốt vào câu thông báo.
-->

| Trường | Điều kiện | Kiểm khi | BR / kỹ thuật | Thông báo | Hiện ở |
| --- | --- | --- | --- | --- | --- |
| {{nhãn}} | {{điều kiện ngắn}} | {{rời ô / bấm <nút>}} | {{BR-xxx <tên> / kỹ thuật (ERD `*`)}} | {{TB-xxx-01}} | {{cạnh trường / vùng thông báo (SCR-000 mục 7)}} |

| Mã | Nội dung | Loại (thành công / lỗi / cảnh báo / thông tin) | Khi nào |
| --- | --- | --- | --- |
| {{TB-xxx-01}} | {{câu cho người dùng cuối, chép đúng prototype}} | {{lỗi}} | {{BR, bước UC}} |

## 7. Danh sách

| Mục | Nội dung |
| --- | --- |
| Cột | {{nhãn (`Bang.truong`)}}, … |
| Sắp xếp mặc định | {{}} |
| Bộ lọc, tìm kiếm | {{trường, mặc định}} |
| Thao tác trên dòng | {{}} |
| Phạm vi dữ liệu | {{UC mục 2 · BR-xxx}} |
| Kết quả rỗng | {{}} |

Không có danh sách → "Không có".

## 8. Hiển thị theo trạng thái và quyền

<!--
HƯỚNG DẪN
- Hàng: trường, nút, vùng. Cột: trạng thái của thực thể chính (enum) và ACT. Ô: hiện / ẩn / chỉ đọc.
- Khớp ma trận trạng thái × thao tác của SM, UCD mục 4, dấu data-sm, data-perm. Dữ liệu nhạy cảm (ERD mục 9) ghi rõ ô ẩn.
-->

| Thành phần | {{`CODE_1`}} | {{`CODE_2`}} | {{ACT-nn}} | {{ACT-mm}} |
| --- | --- | --- | --- | --- |
| {{trường, nút, vùng}} | {{hiện / ẩn / chỉ đọc}} | | | |

Bốn trạng thái của màn: đang tải, lỗi, không có quyền theo SCR-000 mục 6. Trống: {{nội dung riêng}}.

## 9. Khác với SCR-000

| Quy ước | SCR-000 | Màn này | Lý do, nguồn |
| --- | --- | --- | --- |
| {{}} | {{mục x: …}} | {{}} | {{}} |

Không có → "Không — theo SCR-000".

## 10. Câu hỏi mở

Dẫn Q, ASM của màn ở `chuc-nang/{{CN-xx}}/open-questions.md`.

| Mã | Nội dung ngắn | Chặn gate |
| --- | --- | --- |
| {{Q-1xx}} | {{}} | {{G2 / G4 / —}} |
