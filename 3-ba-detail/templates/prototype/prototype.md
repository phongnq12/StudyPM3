# TEMPLATE — GHI CHÚ PROTOTYPE CỦA MỘT CHỨC NĂNG

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `3-ba-detail/Prototype/CN-xx-<slug>/prototype-notes.md` (đợt 2 của `/ba-detail CN-xx`). Xóa mọi khối
  HƯỚNG DẪN và dòng ví dụ trước khi commit. Giữ đủ heading.
- Phương pháp: .claude/skills/ba-detail/method-prototype.md. Checklist: .claude/skills/ba-detail/checklist-prototype.md.
- Chuẩn tham chiếu:
  · BABOK v3 mục 10.36 Prototyping — prototype để khách và đội thấy, góp ý sớm; ghi rõ khác bản trước ở đâu.
  · ISO 9241-110:2020 — nguyên tắc tương tác; WCAG 2.2 — tiếp cận (quy ước chung ở SCR-000 mục 7).
  · ISO/IEC/IEEE 29148:2018 mục 5.2 — truy vết: màn ↔ UC ↔ MP presales.
- Mã trang, trường, trạng thái, BR, quyền lấy đúng business layer v3 và UC: mã UC WBS `<MA>.WEB.mm.cc.tt`, `Bang.truong`,
  enum và `SM mục n`, `BR-{nhóm}{nn}`, `ACT-nn`, permission key. Mã luôn kèm tên ngắn.
- Mã SCR, Q, ASM, PH trong dải ID của CN (cột "Dải ID" của danh-muc-chuc-nang.md).
- Không ghi dữ liệu cá nhân thật, mật khẩu, token.
-->

# GHI CHÚ PROTOTYPE — {{CN-xx}} {{Tên chức năng}}

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| CN · Module WBS | {{CN-xx}} · `{{<MA>.WEB.mm}}` {{tên module}} |
| Nhánh · Commit đã bấm thử | `chuc-nang/{{CN-xx-slug}}` · `{{hash}}` |
| App | `3-ba-detail/Prototype/app/` · trang của CN `src/pages/{{CN-xx}}/` |
| Design system | Design System PM2 1.1.0 — màu chủ đạo {{mã màu, theo `du-an/cau-hinh.md`}} |
| Người soạn · Ngày | {{ux-spec-designer / tên}} · {{YYYY-MM-DD}} |
| Trạng thái | draft |

## 1. Thông tin chung

<!--
HƯỚNG DẪN
- Tóm tắt một lần: số UC, SCR, MP; nhóm route; vai bấm thử; kết quả build.
- "Vai" là tác nhân người của UCD mục 1 có ít nhất một UC trong CN.
-->

| Mục | Nội dung |
|---|---|
| Số UC của CN | {{n}} (`{{<MA>.WEB.mm.cc.tt}}` … ) |
| Số SCR | {{n}} — Giữ {{n}} · Sửa {{n}} · Tách/Gộp {{n}} · Mới {{n}} |
| Số MP của CN | {{n}} — Bỏ {{n}} |
| Nhóm route | `/{{nhom}}/…` |
| Vai bấm thử | {{ACT-nn Tên vai}}, … |
| Mục menu | {{Nhóm menu}} › {{Mục}} — `{{permission key}}` |
| Build | `npm run build` {{đạt / lỗi}} ngày {{YYYY-MM-DD}} |
| Dữ liệu mẫu | `src/pages/{{CN-xx}}/du-lieu-mau.js` — dữ liệu giả |

## 2. Bảng UC → màn

<!--
HƯỚNG DẪN
- Mỗi bước UC có màn hoặc thông báo một dòng. Cột Route, Điều khiển, Thông báo là giá trị điền ngược vào cột `Màn hình`,
  `Message thông báo` của UC (đang ghi `chưa chốt (prototype)`).
- Route đúng chuỗi trong `dang-ky.js`; thông báo đúng chuỗi trong `thong-bao.js`.
- UC tác nhân hệ thống không có màn: ghi nút giả lập "Chạy thử …".
-->

| UC | Bước / luồng | SCR | Route | Điều khiển | Thông báo (mã — nội dung) | `data-*` chính |
|---|---|---|---|---|---|---|
| {{<MA>.WEB.03.01.02}} {{Gửi duyệt kế hoạch}} | {{START}} | {{SCR-104}} | `{{/ke-hoach/:id}}` | {{nút "Gửi duyệt"}} | n/a | `{{data-sm="Ke_Hoach:DRAFT->SUBMITTED"}}` |
| {{<MA>.WEB.03.01.02}} | {{2.E1}} | {{SCR-104}} | `{{/ke-hoach/:id}}` | {{vùng thông báo}} | {{TB-104-02 — Kế hoạch chưa có quyết định kiểm tra. Hãy đính kèm quyết định rồi gửi lại.}} | `{{data-br="BR-A05"}}` |

## 3. Bảng MP → màn

<!--
HƯỚNG DẪN
- Mỗi MP của UC trong CN (cột "Thuộc UC" của 1-ba-init/0-dau-vao/man-presales.md) đúng một dòng. Màn Mới: cột MP ghi n/a.
- Quyết định: Giữ / Sửa / Tách / Gộp / Bỏ / Mới. Bỏ → Q chặn G2. Lý do dẫn mã nguồn (Bang.truong, BR, SM mục n, UC).
- Ảnh trước: 1-ba-init/0-dau-vao/man-presales/MP-xxx.png. Ảnh sau: anh/<SCR>-<mã luồng>.png.
-->

| MP | Tiêu đề presales | Quyết định | SCR | Route | Lý do | Nguồn |
|---|---|---|---|---|---|---|
| {{MP-045}} | {{Chi tiết kế hoạch}} | {{Sửa}} | {{SCR-104}} | `{{/ke-hoach/:id}}` | {{Bỏ ô "Người phối hợp"; thêm nút "Trả lại"}} | {{ERD mục 4 `Ke_Hoach`; SM mục 3: SUBMITTED → RETURNED}} |
| n/a | — | Mới | {{SCR-106}} | `{{/ke-hoach/:id/tra-lai}}` | {{UC cần hộp thoại nhập lý do trả lại}} | {{<MA>.WEB.03.01.04 bước 2}} |

## 4. Thay đổi so với presales

<!--
HƯỚNG DẪN
- Mỗi chỗ khác presales mà khách sẽ nhận ra một dòng: trường, nút, nhãn, thứ tự, menu, luồng.
- Nguồn là mã business layer hoặc UC; không có nguồn thì không được đổi — ghi Q.
-->

| # | SCR · MP | Presales | Prototype | Lý do | Nguồn |
|---|---|---|---|---|---|
| 1 | {{SCR-104 · MP-045}} | {{Ô "Người phối hợp"}} | {{Không có}} | {{Thực thể không có trường tương ứng}} | {{ERD mục 4 `Ke_Hoach` · Q-1xx}} |

## 5. Kết quả bấm thử theo luồng

<!--
HƯỚNG DẪN
- Mỗi luồng của mọi UC một dòng: main, mọi alternative (gồm 0.A), mọi exception (gồm *.E). Mã luồng đúng UC.
- Bước đã bấm ghi `route · điều khiển`; kết quả ghi trạng thái, thông báo, màn đứng lại — đối chiếu dòng cuối của luồng UC.
- Ảnh: anh/<SCR>-<mã luồng>.png (`*` viết ANY). Không có Playwright: "chưa chụp — không có Playwright".
- Không đạt do UC → báo phiên chính (SKILL.md bước 6), không sửa UC ở đây.
-->

| UC | Luồng | Vai | Các bước đã bấm | Kết quả thấy được | Đạt | Ảnh |
|---|---|---|---|---|:-:|---|
| {{<MA>.WEB.03.01.02}} | {{Main}} | {{ACT-02}} | {{`/ke-hoach/KH-0001` · nút "Gửi duyệt" → xác nhận "Gửi"}} | {{`SUBMITTED`; TB-104-01; đứng ở `/ke-hoach/KH-0001`}} | {{Đạt}} | {{anh/SCR-104-Main.png}} |
| {{<MA>.WEB.03.01.02}} | {{\*.E1}} | {{ACT-02}} | {{nút "Gửi duyệt" → "Hủy" ở hộp xác nhận}} | {{vẫn `DRAFT`; không thông báo}} | {{Đạt}} | {{anh/SCR-104-ANY.E1.png}} |
| {{<MA>.WEB.03.01.02}} | {{Thiếu quyền}} | {{ACT-05}} | {{gõ thẳng `/ke-hoach/KH-0001`}} | {{không thấy nút "Gửi duyệt"; menu không có mục}} | {{Đạt}} | {{—}} |

## 6. Câu hỏi mở

<!--
HƯỚNG DẪN
- Dẫn Q, ASM, PH của prototype ở chuc-nang/CN-xx/open-questions.md (mã trong dải). Không viết lại nội dung câu hỏi.
-->

| Mã | Nội dung ngắn | Chặn gate |
|---|---|---|
| {{Q-1xx}} | {{Bỏ MP-052 Thống kê nhanh}} | {{G2}} |
