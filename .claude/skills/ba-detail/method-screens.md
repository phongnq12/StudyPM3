# Phương pháp đặc tả màn hình (đợt 3 `/ba-detail`)

Đặc tả màn hình là bản Dev dựng giao diện và QC kiểm từng trường, nút theo. Nó nối những thứ đã qua G0, G1: UC chi
tiết (hành vi), ERD và máy trạng thái (dữ liệu, trạng thái), BR (kiểm tra), phân quyền lớp 5 (permission key, ma trận
tác nhân × use case), với prototype của CN (đợt 2). **Màn hình không tạo nghiệp vụ mới.** Mỗi màn một file
`3-ba-detail/Screens/CN-xx-<slug>/SCR-xxx-<slug>.md` theo `3-ba-detail/templates/screens/screen.md`; quy ước chung viết
một lần ở `3-ba-detail/Screens/SCR-000-quy-uoc-chung.md` (template `templates/screens/scr-000.md`). Checklist:
`checklist-screens.md` (mã `scr-<n>`).

Nguồn: port từ `ba-screens` 1.0.0 của kit gốc (method M1–M6). Đổi: đường dẫn kit v3; nguồn trường, trạng thái, BR, quyền
theo business layer v3 (bảng dưới); M1 sinh khung từ dấu `data-*` của method-prototype.md mục 5; gate là G2 (kit gốc
G3); SCR-000 tạo ở lần chạy đợt 3 đầu tiên (kit gốc làm ở bước 2).

**Căn cứ chuẩn.** ISO 9241-110:2020 (bảy nguyên tắc tương tác, nhất là chống lỗi, tự mô tả, người dùng kiểm soát) và
WCAG 2.2 (tiếp cận) — quy ước chung ở SCR-000 mục 7, màn chỉ ghi phần khác; đặc tả trường theo thuộc tính data element
(ISO/IEC 11179: tên, định nghĩa, kiểu, miền giá trị) qua từ điển dữ liệu của ERD.

Ví dụ dưới đây là nghiệp vụ kế hoạch kiểm tra minh họa; mã bảng, BR, UC là mã giả, không chép sang tài liệu.

## 0. Cách dẫn nguồn theo business layer v3

| Cần dẫn | Kit gốc | Kit v3 | Đọc ở |
| --- | --- | --- | --- |
| Thuộc tính | `ENT-xxx.thuoc_tinh` | `` `Bang.truong` `` | `ERD_…` mục 4 (từ điển), 4.x (enum) |
| Ràng buộc dữ liệu | `erd-CN-xx` mục 10 | Cột Ràng buộc (`*`, `◐ khi…`, UK) ERD mục 4; `R-xx` mục 5 | `ERD_…` |
| Trạng thái | `ST-xxx` | Mã enum `CODE` kèm tên Việt, `SM mục n` | `SM_…` bảng trạng thái |
| Chuyển trạng thái | `TR-xxx` | `SM mục n: TU → DEN` | `SM_…` bảng chuyển, chuyển bị cấm |
| Thao tác theo trạng thái | `state-machine` mục 6 | `SM_…` mục "Ma trận trạng thái × thao tác" | `SM_…` |
| Business rule | `BR-xxx` | `BR-{nhóm}{nn} <tên ngắn>` | `BR_…` |
| Tác nhân | `ACT-xx` | `ACT-nn <Tên vai>` | `UCD_…` mục 1 |
| Quyền | `rules-CN-xx` mục 6 | Cột `Permission key` của `UCL_…`; `UCD_…` mục 4 | lớp 5 |
| Use case | `UC-xxx` | Mã WBS `<MA>.WEB.mm.cc.tt` kèm tên, bước UC | `3-ba-detail/use-case/CN-xx-<slug>/` |
| Màn presales | `MP-xxx` | `MP-xxx` | `1-ba-init/0-dau-vao/man-presales.md` |
| Quyết định MP → màn | `prototype-notes.md` mục 2 | `prototype-notes.md` mục 3 | `3-ba-detail/Prototype/CN-xx-<slug>/` |

Mã luôn đi kèm tên ngắn. Giả định: `GD-xxxx` (sổ dự án) hoặc `ASM-xxx` (dải CN), bôi đỏ như create-uc.

## 1. Nguyên tắc chung

### 1.1 Màn chỉ hiện nghiệp vụ đã chốt
- Mọi trường, nút, kiểm tra, thông báo, phần ẩn hiện trỏ về mã đã qua gate: `Bang.truong`, `SM mục n`, BR, ACT,
  permission key, UC. Không trỏ được → thiếu của business layer hoặc UC, không phải của màn: đề xuất Q, không tự thêm.
- Trường, nút có trên MP presales mà nghiệp vụ không có → không đặc tả; đợt 2 đã quyết bỏ (`prototype-notes.md` mục 3).
- Đúng: ô "Người phối hợp" có trên MP-045 nhưng `Cuoc_Kiem_Tra` không có trường tương ứng → không có ở SCR-104;
  `prototype-notes.md` mục 3 ghi Sửa, bỏ ô, kèm Q.
- Sai: thêm "Người phối hợp" vào mục 4 với nguồn "MP-045" vì "khách đã thấy".

### 1.2 Chỉ ghi phần khác SCR-000
- Định dạng ngày, số; phân trang; xác nhận trước khi xóa; thông báo dùng chung; trạng thái đang tải, lỗi, không quyền:
  dẫn "theo SCR-000 mục x", không chép lại. Mục 9 liệt kê điểm màn này khác SCR-000, kèm lý do.
- Đúng: mục 8 "Đang tải, lỗi, không có quyền: theo SCR-000 mục 6. Trống: 'Chưa có kế hoạch kiểm tra nào'
  (<MA>.WEB.03.01.05 Xem danh sách kế hoạch)."
- Sai: chép bảng bốn thông báo dùng chung TB-000-01…04 vào từng SCR.

### 1.3 Dẫn, không chép; một nơi định nghĩa
- Không chép luồng UC, phát biểu BR, định nghĩa trường. Ghi mã và phần riêng của màn (nhãn, kiểu, vị trí, câu thông
  báo).
- Danh mục màn, quyết định MP → màn ở `prototype-notes.md` mục 2, 3; quyền ở lớp 5. Không lập lại các bảng đó trong
  `3-ba-detail/Screens/`.
- Đúng: mục 5 "Duyệt | … | ACT-03 Trưởng đoàn kiểm tra · `ke-hoach.duyet` (UCL)".
- Sai: thêm bảng "Phân quyền màn hình" cuối SCR-105, khác ma trận ở UCD mục 4.

### 1.4 Cần đổi màn → sửa prototype trước
- Đặc tả theo prototype đã qua đợt 2. Thấy màn sai so với nghiệp vụ → sửa prototype (`--lop prototype`), lập lại
  khung, rồi mới sửa đặc tả. Không viết đặc tả khác màn để "sửa sau".
- Không sửa nghiệp vụ cho khớp màn: màn hổng nghiệp vụ → Q, quay về UC (SKILL.md bước 6) hoặc lớp 1–6 (Q chặn gate).
- Đúng: SCR-104 thiếu nút "Trả lại" mà `SM mục 3: SUBMITTED → RETURNED` có và UC phủ → sửa prototype thêm nút
  `data-sm="Ke_Hoach:SUBMITTED->RETURNED"`, rồi viết mục 5.
- Sai: ghi nút "Trả lại" vào mục 5 trong khi prototype chưa có, ghi chú "Dev tự thêm".

## 2. M1 — Khung lập từ `data-*`
- Đợt 2 đã gắn dấu (method-prototype.md mục 5): `data-scr`, `data-uc`, `data-ent`, `data-br`, `data-sm`, `data-perm`.
- Khung SCR lập từ dấu của trang có `data-scr` đó: mỗi `data-ent` một dòng mục 4, mỗi nút (có `data-sm` hoặc
  `data-uc`) một dòng mục 5, mỗi `data-br` ít nhất một dòng mục 6, mỗi `data-perm` và `data-sm` dạng `Bang:TT1|TT2`
  một ô mục 8. Agent điền phần còn lại (nhãn, kiểu, mặc định, điều kiện, câu thông báo).
- Chưa có script sinh khung: agent đọc mã trang `src/pages/CN-xx/<TenMan>/` (grep `data-`), lập tay, ghi ở mục 1
  "khung lập tay từ data-*".
- Không thêm dòng không có dấu trên prototype; không bỏ dòng có dấu. Dấu sai hoặc thiếu → sửa prototype (mục 1.4).
- Đúng: SCR-104 có 5 ô `data-ent`, 2 nút `data-sm` → mục 4 có 5 dòng, mục 5 có 2 dòng chuyển trạng thái.
- Sai: mục 4 có 7 dòng, 2 dòng không có ô tương ứng trên prototype.

## 3. Mục 1–3 — Thông tin chung, mục đích, vào và ra
- Mục 1: SCR, tên theo glossary, CN, MP nguồn và quyết định MP → màn (Giữ / Sửa / Tách / Gộp / Mới, dẫn
  `prototype-notes.md` mục 3), UC và bước UC màn phục vụ, actor, route và thư mục trang prototype, ảnh trước và sau.
- Mục 2: màn giúp ai làm việc gì, một đến ba câu, dẫn UC, BRQ. Không mô tả giao diện ở đây.
- Mục 3: vào từ đâu (SCR, menu, thông báo), mang theo dữ liệu gì; ra đi đâu sau mỗi hành động. Khớp luồng UC và
  `dang-ky.js` của CN (menu).
- Đúng: "Vào: SCR-103 nút 'Tạo kế hoạch' (mới) hoặc bấm dòng kế hoạch `DRAFT` (mở bản nháp). Ra: SCR-103 sau Gửi duyệt,
  Lưu nháp, Hủy."
- Sai: mục 3 "Từ menu" trong khi `dang-ky.js` không có SCR-104 trên menu.

## 4. M2 — Trường (mục 4)
Mỗi trường một dòng:
- **Nhãn:** thuật ngữ glossary; giữ nhãn MP nếu cùng nghĩa, khác thì ghi lý do ở mục 9.
- **Thuộc tính:** `` `Bang.truong` `` của ERD mục 4. Trường tính: Δ hoặc BR công thức. Trường chỉ để lọc: "không lưu".
- **Kiểu nhập / hiển thị:** tên control của design system PM2: mã khối trong `AGENTS.md` (`text-input`,
  `search-select`, `date`, `attachment`…) hoặc component `App*` (`AppSelect`, `AppSearchSelect`, `DateTimeInput`,
  `AttachmentField`…). Không tự đặt tên component.
- **Bắt buộc:** Có / Không / Có điều kiện (dẫn BR hoặc `◐ khi…` của ERD). Trường mà ERD dẫn biểu mẫu luật ở cột Nguồn
  phải bắt buộc trên màn, hoặc có lý do.
- **Mặc định:** giá trị khi mở màn; "trống" cũng ghi.
- **Miền giá trị, độ dài:** dẫn ERD (enum mục 4.x, kiểu, ràng buộc); chỉ ghi giới hạn màn thêm. Không có nguồn →
  `[CẦN XÁC NHẬN]`; trường chỉ hiển thị, tính toán → "theo ERD".
- **Chỉ đọc khi:** trạng thái và actor làm trường không sửa được; dẫn ma trận trạng thái × thao tác của SM hoặc BR.
- **Nguồn:** ERD mục 4, MP, điều khoản biểu mẫu. Mã kèm tên.
- Không ô trống: không có thì `n/a`; chưa biết thì `[CẦN XÁC NHẬN: Q-xxx]`. Định dạng theo SCR-000 mục 2; chỉ ghi khi khác.
- Đúng: "Ngày bắt đầu | `Ke_Hoach.ngay_bat_dau` | `date` (DateTimeInput) | Có | trống | theo ERD (`*`, date) | từ `SUBMITTED`
  (SM mục 3) | ERD mục 4; MP-045".
- Sai: "Ngày bắt đầu | — | text | Có | | | |" (không thuộc tính, kiểu tự đặt, ô trống).

## 5. M3 — Hành động (mục 5)
- Mỗi nút, hành động: điều kiện hiển thị (trạng thái nào, actor nào), điều kiện bật / tắt, kết quả (chuyển trạng thái,
  sang SCR nào, thông báo nào), quyền (ACT, permission key).
- Nút đổi trạng thái chỉ hiện ở trạng thái nguồn của chuyển (`SM_…` bảng chuyển); chuyển bị cấm không có nút.
- Xóa, hủy, từ chối, gửi: có bước xác nhận theo SCR-000 mục 4, trừ khi nguồn nói khác.
- Đúng: "Duyệt | `SUBMITTED`; ACT-03 Trưởng đoàn của đơn vị lập (BR-B02 Duyệt trong phạm vi đơn vị) | `SM mục 3:
  SUBMITTED → APPROVED`; TB-104-03; về SCR-103 | Có | `ke-hoach.duyet`".
- Sai: "Duyệt | Luôn hiển thị | Duyệt kế hoạch | Lãnh đạo" (không trạng thái, không chuyển, tên vai thay ACT, thiếu key).

## 6. M4 — Kiểm tra dữ liệu và thông báo (mục 6)
- **Nguồn của kiểm tra là ERD (cột Ràng buộc mục 4, `R-xx` mục 5) và BR.** Mục 6 không chép lại giới hạn, biên: dẫn
  mã ở cột BR / kỹ thuật; chỉ chốt thời điểm kiểm, chuỗi hiển thị (chép đúng prototype) và chỗ hiện.
  - Đúng: "Ngày kết thúc | trước Ngày bắt đầu | rời ô | BR-A03 Khoảng ngày kế hoạch hợp lệ | TB-104-01 | cạnh trường".
  - Sai: ghi lại "không trước Ngày bắt đầu; bằng Ngày bắt đầu → đạt" ở mục 6 (hai nơi định nghĩa, lệch khi sửa một nơi).
- Mỗi kiểm tra một dòng: trường, điều kiện, thời điểm kiểm (rời ô / bấm nút), BR hoặc "kỹ thuật" (định dạng, bắt
  buộc `*` của ERD). Kiểm tra màn cần mà không có BR, không có ràng buộc ERD → thiếu ở business layer: Q, không thêm.
- Mỗi BR kiểm dữ liệu mà UC của màn dẫn ở cột Sở cứ có ít nhất một dòng ở một SCR của CN.
- Thông báo riêng mã `TB-<số SCR>-<nn>`; thông báo dùng chung dẫn TB-000-xx. Viết cho người dùng cuối: chuyện gì xảy
  ra, cần làm gì; phản ánh đúng BR gây ra; không mã lỗi kỹ thuật; chép đúng chuỗi trong `thong-bao.js` của CN.
- Cột "Hiện ở": cạnh trường hay vùng thông báo, theo SCR-000 mục 7; câu nói lỗi gì và cách sửa (WCAG 3.3.1, 3.3.3).
- Không đưa con số `[CẦN XÁC NHẬN]`, `CH-xx` chưa chốt vào câu thông báo.
- Đúng: "Tệp đính kèm | chưa có | bấm Gửi duyệt | BR-A05 Kế hoạch gửi duyệt phải kèm quyết định | TB-104-02 'Kế hoạch
  chưa có quyết định kiểm tra. Hãy đính kèm quyết định rồi gửi lại.'"
- Sai: "TB-104-02 'Lỗi E1032: thiếu file (tối đa 10 MB)'" (mã kỹ thuật, con số tự đặt).

## 7. M5 — Danh sách, tra cứu (mục 7)
- Màn có danh sách: cột (nhãn, `Bang.truong`), sắp xếp mặc định, bộ lọc và tìm kiếm (trường, mặc định), thao tác trên
  dòng, kết quả rỗng. Phân trang, vị trí điều khiển theo SCR-000 mục 3.
- Phạm vi dữ liệu (chỉ bản ghi của đơn vị mình) dẫn mục 2 "Phạm vi dữ liệu" của UC và BR phân quyền, không viết lại.
- Màn không có danh sách → "Không có".
- Đúng: "Sắp xếp mặc định: Ngày lập giảm dần [SRC: MP-044]; lọc Trạng thái mặc định `SUBMITTED` cho ACT-03
  (<MA>.WEB.03.01.06 bước 1)."
- Sai: "Danh sách hiển thị dữ liệu phù hợp" (không cột, không sắp xếp, mơ hồ).

## 8. M6 — Trạng thái màn, hiển thị theo trạng thái và quyền (mục 8)
- Bốn trạng thái của màn: trống, đang tải, lỗi, không có quyền. Phần giống SCR-000 mục 6 dẫn; thường chỉ ghi nội dung
  Trống và lỗi riêng.
- Bảng **hiển thị theo trạng thái và quyền**: hàng là trường, nút, vùng; cột là trạng thái của thực thể chính và ACT;
  ô: hiện / ẩn / chỉ đọc. Khớp ma trận trạng thái × thao tác của SM, ma trận tác nhân × use case (UCD mục 4) và dấu
  `data-sm`, `data-perm` trên prototype.
- Dữ liệu nhạy cảm (ERD mục 9) chỉ hiện cho actor được phép; ghi rõ ô ẩn.
- Tiếp cận, bàn phím: theo SCR-000 mục 7; màn chỉ ghi tiêu điểm khi vào màn (mục 3) và điểm khác (mục 9).
- Đúng: "Lý do trả lại | `RETURNED`: chỉ đọc · `DRAFT`, `SUBMITTED`: ẩn | ACT-02 thấy kế hoạch của mình".
- Sai: mục 8 "Hiển thị tùy quyền người dùng".

## 9. Mục 9–10 — Khác SCR-000, câu hỏi
- Mục 9: mỗi điểm khác SCR-000 một dòng: quy ước, ở SCR-000, ở màn này, lý do, nguồn. Không có → "Không — theo SCR-000".
- Mục 10: dẫn Q, ASM của màn ở `chuc-nang/CN-xx/open-questions.md`, mã trong dải ID của CN (`[Q-T<n>]`,
  `[ASM-T<n>]` khi nhiều agent).
- Hành vi không có nguồn (vị trí, mặc định, thứ tự cột suy từ MP mà không chắc) → ASM.

## 10. SCR-000 — lần đầu
- Lần chạy đợt 3 đầu tiên của dự án tạo `3-ba-detail/Screens/SCR-000-quy-uoc-chung.md` theo `templates/screens/scr-000.md`,
  commit riêng `spec(CN-xx/screens): SCR-000 quy ước màn chung`. CN sau chỉ dẫn; cần thêm quy ước → Q đề xuất.
- Nguồn theo thứ tự: luật UI/UX đã chốt của design system PM2 (`AGENTS.md`, mục Nguyên tắc và khối "Câu thông báo
  gọi theo mã"); màn presales (ảnh, `man-presales.json`); yêu cầu giao diện trong `0-inputs/`. Không thiết kế mới.
- Con số (số dòng mỗi trang, thời gian phiên), mức WCAG không có nguồn → `[CẦN XÁC NHẬN]` kèm Q.
- Đúng: "Phân trang | theo khuôn `list-screen` AGENTS.md; số dòng mỗi trang [CẦN XÁC NHẬN: Q-104]".
- Sai: "Phân trang 20 dòng" không nguồn.

## 11. Lỗi hay gặp
- Trường không có `Bang.truong`; kiểm tra tự đặt, không BR, không ràng buộc ERD.
- Thêm trường, nút, thông báo không có trên prototype hoặc ngoài nghiệp vụ đã qua gate.
- Nút đổi trạng thái hiện ở mọi trạng thái; thiếu điều kiện theo actor, thiếu permission key.
- Thiếu trạng thái trống, lỗi, không có quyền; chép quy ước chung thay vì dẫn SCR-000.
- Lập danh mục màn, ma trận phân quyền riêng trong `3-ba-detail/Screens/`.
- Viết đặc tả khác prototype rồi định sửa prototype sau.
- Câu thông báo có mã kỹ thuật hoặc con số chưa chốt; mô tả theo pixel, màu thay vì component và token.
- Báo lỗi chỉ bằng màu đỏ của ô, không có câu; nhãn chỉ là chữ gợi ý trong ô.
- Ô trống trong bảng trường; dùng "—" thay `n/a` hay `[CẦN XÁC NHẬN: Q-xxx]`.

## Lịch sử quy tắc
- 2026-10-26: kit gốc `ba-screens` 1.0.0 — port từ kit v1 (bảng trường, hành động, bốn trạng thái, thông báo, dẫn
  SCR-000); viết mới M1–M6; căn cứ ISO 9241-110, WCAG 2.2.
- 2026-10-27: port sang PM9 `/ba-detail` 0.1.0: đường dẫn `3-ba-detail/`; nguồn trường, trạng thái, BR, quyền theo
  business layer v3 (mục 0); M1 dùng dấu `data-*` của method-prototype.md; gate G2; thêm mục 10 SCR-000 lần đầu.
