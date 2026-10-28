# Phương pháp dựng prototype (đợt 2 `/ba-detail`)

Prototype là bản bấm được của UC đã qua G1. Khách và đội bấm đúng luồng đã chốt, thấy khác presales chỗ nào và vì
sao. Đặc tả màn (đợt 3) viết theo prototype; UC trỏ về route của prototype.

**Prototype không tạo nghiệp vụ mới.** Mỗi trang đến từ UC, mỗi trường từ ERD, mỗi nút đổi trạng thái từ máy trạng
thái, mỗi kiểm tra và thông báo từ BR, mỗi mục menu và nút theo quyền từ `Permission key` và ma trận tác nhân × use
case. Giao diện lấy từ design system PM2; bố cục xuất phát từ màn presales khách đã thấy.

Agent: ux-spec-designer. Template ghi chú: `3-ba-detail/templates/prototype/prototype.md` → đầu ra
`3-ba-detail/Prototype/CN-xx-<slug>/prototype-notes.md`. Checklist: `checklist-prototype.md` (mã `proto-<n>`).

## 1. Đầu vào và thứ nó sinh ra trên prototype

| Đầu vào | Đọc ở | Sinh ra trên prototype |
| --- | --- | --- |
| UC đã qua G1 | `3-ba-detail/use-case/CN-xx-<slug>/*.md` | Trang, luồng bấm, điểm vào (`0.A`), nhánh lỗi, màn đứng lại sau `END (Main)` |
| ERD lớp 3 | `2-ba-overview/3-erd/ERD_…` mục 4 (từ điển), 4.x (enum), 9 (nhạy cảm) | Trường nhập, cột danh sách, nhãn enum, ô ẩn với dữ liệu nhạy cảm |
| Máy trạng thái lớp 4 | `2-ba-overview/4-state-machine/SM_…` (bảng chuyển, chuyển bị cấm, ma trận trạng thái × thao tác) | Nút đổi trạng thái chỉ hiện ở trạng thái nguồn; tag trạng thái; trường chỉ đọc theo trạng thái |
| BR lớp 6 | `2-ba-overview/6-business-rules/BR_…` | Kiểm tra trước khi ghi, câu thông báo, giá trị tính sẵn |
| Phân quyền lớp 5 | `UCL_…` cột `Permission key`; `UCD_…` mục 1 (tác nhân), mục 4 (ma trận) | Vai trong "Đổi vai", menu theo vai, nút ẩn khi thiếu quyền, route chặn |
| Design system PM2 | `3-ba-detail/templates/design-system/design_system.md`, `PM2-3_Prototype_Source/design/public/AGENTS.md` | Component `App*`, token, khuôn loại màn (Danh sách, Chi tiết, Tạo mới, Chỉnh sửa, Cấu hình) |
| Màn presales | `1-ba-init/0-dau-vao/man-presales.md`, ảnh `man-presales/MP-xxx.png`, mã nguồn `0-inputs/presales/prototype/` | Bố cục, nhãn, thứ tự trường, tên menu — điểm xuất phát |

- Mã nguồn presales **chỉ đọc**: mở `0-inputs/presales/prototype/dist/assets/*.js` để xem nhãn, menu, quyền theo vai.
  Không chạy, không chép mã, không sửa.
- Design system PM2 thắng bản mẫu của skill `ba-design-system` khi khác (`du-an/agent-notes/_chung.md`).
- Nguồn mâu thuẫn (MP có trường mà ERD không có, nhãn MP khác glossary) → làm theo business layer, ghi khác biệt ở
  `prototype-notes.md` mục 4; không chắc thì `[Q-T<n>]`.

## 2. Quyết định MP → màn

Mỗi MP của UC trong CN (cột "Thuộc UC" của `man-presales.md`) có đúng một quyết định ở `prototype-notes.md` mục 3:

| Quyết định | Khi nào | Bắt buộc ghi |
| --- | --- | --- |
| Giữ | Màn presales khớp UC, ERD, BR; chỉ đổi giao diện sang design system | SCR, route |
| Sửa | Khớp mục đích nhưng thừa, thiếu trường, nút, trạng thái so với business layer | Từng chỗ sửa và nguồn (mã bảng.trường, BR, `SM mục n`) |
| Tách / Gộp | Một MP phục vụ nhiều UC khác tác nhân, quyền; hoặc nhiều MP cùng một UC | Lý do theo hạt UC (create-uc) |
| Bỏ | Không UC nào trong module cần | Q chặn G2 (quyết định bỏ màn khách đã thấy), dẫn PH nếu có |
| Mới | UC cần màn mà presales không có | UC và bước UC cần màn |

- Đúng: "MP-045 · Sửa · SCR-104 · bỏ ô 'Người phối hợp' vì `Cuoc_Kiem_Tra` không có trường tương ứng; thêm nút
  'Trả lại' theo `SM mục 3: SUBMITTED → RETURNED`."
- Sai: "MP-045 · Giữ" trong khi trang mới khác presales ba trường, không ghi lý do.
- Sai: giữ ô "Người phối hợp" vì "khách đã thấy" dù ERD không có — đó là nghiệp vụ mới; ghi Q, không dựng.

Mã SCR cấp ở bước này, trong dải ID của CN (`[SCR-T<n>]` nếu nhiều agent; phiên chính cấp số). Một SCR là một màn
hoặc một hộp thoại có trường hay quyết định riêng; tab chỉ đổi cách xem cùng dữ liệu thì không tách SCR.

## 3. App chung — dựng lần đầu (P1)

Một app cho cả dự án: `3-ba-detail/Prototype/app/`. CN đầu tiên chạy đợt 2 dựng khung trong commit riêng
`spec(CN-xx/prototype): dựng khung app chung`. CN sau chỉ thêm `src/pages/CN-xx/`.

1. Chép `3-ba-detail/templates/design-system/PM2-3_Prototype_Source/` sang `app/` (trừ `node_modules/`, `dist*/`).
   Không sửa bản trong `templates/`.
2. **Bỏ** phần nghiệp vụ PM2:
   - `src/pages/*` (mọi màn PM2), `src/data/*` (store, seed, `messageCatalog` nội dung PM2, ma trận quyền PM2).
   - Component trong `src/components/app/` import tầng `src/data` hoặc mang nghiệp vụ PM2, ví dụ
     `AppointmentStatusTag`, `CancelAppointmentDialog`, `DeleteAppointmentDialog`, `ExemptionFields`, `ExemptionInfo`,
     `NotifyRecipientsField`, `SimulatedCardPicker`, `TableCalendar`, `VisitConditions`, `RelativeDetailBody`,
     `Pm1SyncBar` (HANDOFF.md mục 2, 4); file `src/lib/` chứa luật PM2 (tự hủy lịch, quỹ thăm, khung giờ…).
     Còn phân vân: bỏ, chạy `npm run build`, lỗi import nào thì xét lại.
   - Trang Design System (`design/`, `design.html`, `vite.design.config.js`): nó import màn PM2. Tài liệu tham chiếu
     vẫn đọc ở `templates/design-system/`.
3. **Giữ:** `src/theme/`, `src/styles/` (token), `src/components/app/` còn lại, `src/layout/`, tiện ích chung
   trong `src/lib/`, cấu hình Vite, Tailwind, PostCSS, `package.json` (đổi `name`, `description` sang tên dự án).
4. **Đổi màu chủ đạo** sang màu chủ đạo của dự án (`du-an/cau-hinh.md`; chưa có thì `[CẦN BA CHỐT]`): `colorPrimary` và mọi chỗ `#076DB6` trong
   `antdTheme.js`, `--color-brand` trong `tokens.css`, `Input.activeShadow` theo cùng sắc. Sắc độ hover, nền nhạt:
   bỏ giá trị xanh dương cứng, để thuật toán theme của antd sinh từ `colorPrimary`; cần giá trị cứng thì `[ASM-T<n>]`.
5. **Đăng ký theo CN, không sửa file chung:** `src/routes.js`, `src/layout/menuConfig.js`, `App.jsx` gom trang của
   mọi CN bằng `import.meta.glob('./pages/CN-*/dang-ky.js', { eager: true })`. Mỗi CN tự khai route, mục menu, quyền
   trong `dang-ky.js` của mình, nên nhánh CN song song không đụng nhau.
6. **Vai và đăng nhập giả lập:** bỏ `DEMO_LOGIN` (mật khẩu trong mã — CLAUDE.md luật 9). Màn đăng nhập chỉ chọn vai
   trong danh sách tác nhân người của `UCD_…` mục 1 (`ACT-nn <Tên vai>`); menu góc phải có "Đổi vai" như presales.
   `src/khung/vai.js` giữ danh sách vai; `can(permissionKey)` trả lời theo quyền CN khai.
7. **Kho dữ liệu giả** chạy localStorage như PM2, mỗi CN một khóa `<ma>.CN-xx.*`; có nút "Đặt lại dữ liệu mẫu".
8. `.gitignore` của app: `node_modules/`, `dist/`. Không commit hai thư mục đó.
9. Màu, chữ, khoảng cách chỉ dùng `var(--*)` và theme; không viết mã màu thô trong trang.

Khung app là file tầng dự án dùng chung. Sau lần dựng đầu, CN không sửa khung; cần sửa → Q đề xuất cho BA lead.

- Đúng: CN-02 thêm `src/pages/CN-02/dang-ky.js` khai 4 route và 2 mục menu; không chạm `menuConfig.js`.
- Sai: CN-02 sửa thẳng `menuConfig.js`, xung đột với nhánh CN-01 khi merge.

## 4. Trang của CN (P2)

```
src/pages/CN-xx/
├── dang-ky.js        route, mục menu (nhóm, nhãn, permission key), SCR ↔ route
├── quyen.js          permission key → ACT, chép từ UCD mục 4 và UCL
├── du-lieu-mau.js    dữ liệu giả của CN
├── thong-bao.js      câu thông báo theo mã TB-<SCR>-<nn>
└── <TenMan>/         mỗi SCR một thư mục: <TenMan>.jsx, CSS riêng nếu cần
```

- Route chữ thường không dấu, nối bằng `-`, theo khuôn PM2: `/<nhóm>/<tính năng>`, trang con `tao-moi`, `:id`,
  `:id/chinh-sua`. Nhóm lấy theo module WBS để không trùng CN khác.
- Mỗi UC có ít nhất một trang hoặc hộp thoại chứa trigger chính; UC tác nhân hệ thống không có trang thì có nút
  "Chạy thử <tên UC>" trong vùng giả lập để bấm thử được (ghi rõ là giả lập).
- Khuôn loại màn theo `AGENTS.md` (`list-screen`, `detail-info`, `blocks`, `field-states`…); không tự chế component.
- Nhãn theo glossary; nhãn MP khác mà cùng nghĩa thì giữ nhãn MP, ghi `prototype-notes.md` mục 4.
- Không đưa mã nội bộ, căn cứ pháp lý lên giao diện (luật UX-A8, UX-A12 của AGENTS.md).

- Đúng: UC `<MA>.WEB.03.01.02 Gửi duyệt kế hoạch` có nút "Gửi duyệt" trên `/ke-hoach/:id`, chỉ hiện khi
  `Ke_Hoach.trang_thai = DRAFT`.
- Sai: trang `/ke-hoach/gui-duyet` riêng có form nhập lại kế hoạch — UC gửi duyệt là thao tác trên bản ghi đã có.

## 5. Đánh dấu truy vết `data-*` (P3)

Mọi phần tử mang nghiệp vụ có dấu để đợt 3 lập khung đặc tả và reviewer đối chiếu. Mã đúng như nguồn, không dấu cách
trong một mã; nhiều mã cách nhau bằng dấu cách.

| Thuộc tính | Gắn vào | Giá trị | Ví dụ |
| --- | --- | --- | --- |
| `data-scr` | Phần tử gốc của trang, hộp thoại | Mã SCR | `data-scr="SCR-104"` |
| `data-uc` | Phần tử gốc; trigger của UC (nút, liên kết) | Mã UC WBS | `data-uc="<MA>.WEB.03.01.02"` |
| `data-ent` | Ô nhập, ô hiển thị, cột bảng | `Bang.truong` đúng ERD | `data-ent="Ke_Hoach.ngay_bat_dau"` |
| `data-br` | Chỗ kiểm tra hoặc chỗ hiện thông báo của BR; ô tính sẵn | Mã BR | `data-br="BR-A03"` |
| `data-sm` | Nút đổi trạng thái: `Bang:TU->DEN`. Phần tử chỉ hiện ở một số trạng thái: `Bang:TT1\|TT2` | Enum đúng ERD | `data-sm="Ke_Hoach:DRAFT->SUBMITTED"` |
| `data-perm` | Mục menu, nút, vùng ẩn khi thiếu quyền | Permission key ở UCL | `data-perm="ke-hoach.gui-duyet"` |

- Mỗi trường trên trang có `data-ent`; trường lọc không lưu ghi `data-ent="khong-luu"`.
- Mỗi chuyển 👤 ở máy trạng thái mà UC của CN phủ có đúng một nút `data-sm`; chuyển bị cấm không có nút.
- Đúng: `<AppButton data-uc="<MA>.WEB.03.01.02" data-sm="Ke_Hoach:DRAFT->SUBMITTED" data-perm="ke-hoach.gui-duyet">Gửi duyệt</AppButton>`
- Sai: `<button data-tr="gui">Gửi duyệt</button>` (mã tự đặt, không truy được về SM, không theo quyền).

## 6. Kiểm tra và thông báo (P4)

- Mỗi kiểm tra trên trang dẫn BR (`data-br`) hoặc ràng buộc dữ liệu ở ERD (bắt buộc `*`, kiểu, độ dài). Kiểm tra
  không có nguồn → không dựng, `[Q-T<n>]`.
- Câu thông báo viết cho người dùng cuối: chuyện gì xảy ra, cần làm gì; mã `TB-<số SCR>-<nn>` trong `thong-bao.js`.
  Thông báo dùng chung (lưu thành công, mất kết nối, không có quyền) dẫn SCR-000, không viết lại.
- Không đưa con số `[CẦN XÁC NHẬN]` hay `CH-xx` chưa chốt vào câu; không mã lỗi kỹ thuật.
- Backend vẫn phải kiểm lại; prototype chỉ thể hiện chỗ và cách báo lỗi (create-uc nguyên tắc 4).

- Đúng: `TB-104-01` "Ngày kết thúc phải sau ngày bắt đầu. Hãy chọn lại ngày kết thúc." gắn `data-br="BR-A03"`.
- Sai: "Lỗi E102: vi phạm ràng buộc 30 ngày" (mã kỹ thuật, con số chưa chốt).

## 7. Dữ liệu mẫu (P5)

- Dữ liệu giả, đủ để bấm mọi luồng: ít nhất một bản ghi ở mỗi trạng thái mà UC của CN bắt đầu từ đó, và bản ghi làm
  rơi vào từng exception (trùng, quá hạn, thiếu quyền).
- Không dữ liệu cá nhân thật (CLAUDE.md luật 9): tên "Nguyễn Văn A", số giấy tờ `000000000001`, đơn vị "Cơ sở cai
  nghiện mẫu số 1". Danh mục dùng chung lấy đúng enum ERD.

## 8. Chạy, build (P6)

Trong `3-ba-detail/Prototype/app/` (Node.js ≥ 20.19):

```bash
npm install          # lần đầu, cần mạng; không commit node_modules/
npm run build        # bắt buộc đạt trước commit; cảnh báo kích thước chunk không tính là lỗi
npm run dev          # http://localhost:5174 để bấm thử (Bash run_in_background)
```

Build lỗi → sửa trang của CN; lỗi nằm ở khung → báo phiên chính, không sửa khung (trừ lần dựng đầu).

## 9. Bấm thử theo luồng UC (P7)

Mỗi UC của CN bấm đủ: main flow, từng alternative (gồm `0.A[n]`), từng exception (gồm `*.E[n]` bỏ dở). Mỗi luồng
một dòng ở `prototype-notes.md` mục 5: UC, mã luồng, vai, các bước đã bấm (route · điều khiển), kết quả thấy được (trạng
thái, thông báo, màn đứng lại), Đạt / Không đạt, ảnh.

- Có Playwright MCP: mở `npm run dev`, đổi vai, bấm theo bước UC, chụp màn đứng lại của mỗi luồng vào
  `3-ba-detail/Prototype/CN-xx-<slug>/anh/<SCR>-<mã luồng>.png` (`*` viết `ANY`, ví dụ `SCR-104-ANY.E1.png`).
  Kiểm cả vai không có quyền: menu ẩn, route bị chặn.
- Không có Playwright: mô tả từng bước bằng chữ, cột Ảnh ghi "chưa chụp — không có Playwright".
- Kết quả bấm khác dòng cuối của luồng UC → Không đạt. Lỗi do prototype → sửa, bấm lại. Lỗi do UC (luồng không
  bấm được, thiếu bước) → báo phiên chính (SKILL.md bước 6), không sửa UC.
- Xong: liệt kê route và chuỗi thông báo cho từng bước UC đang ghi `chưa chốt (prototype)`, để điền ngược.

- Đúng: "<MA>.WEB.03.01.02 · 2.E1 · ACT-02 · `/ke-hoach/KH-0001` · nút 'Gửi duyệt' khi thiếu tệp đính kèm → TB-104-02,
  vẫn `DRAFT`, đứng ở `/ke-hoach/KH-0001` · Đạt · SCR-104-2.E1.png"
- Sai: "Đã bấm thử, chạy tốt."

## 10. Lỗi hay gặp
- Thêm trường, nút, câu chữ "cho đủ" không có trong ERD, BR, UC; giữ trường presales mà business layer không có.
- Nút đổi trạng thái hiện ở mọi trạng thái; menu không theo vai.
- Sửa khung app chung, file của CN khác; commit `node_modules/`.
- Mật khẩu, dữ liệu cá nhân thật trong mã; màu thô thay token; còn màu đỏ, xanh dương PM2.
- Bấm thử chỉ luồng chính; báo "Đạt" không có bước và kết quả.
- Sửa prototype khác UC để "cho chạy được" thay vì báo phiên chính sửa UC.

## Lịch sử quy tắc
- 2026-10-27: viết mới cho `/ba-detail` 0.1.0 (thay khung `ba-prototype` của kit gốc): app chung từ design system
  PM2, đăng ký trang theo CN, dấu `data-scr`, `data-uc`, `data-ent`, `data-br`, `data-sm`, `data-perm`; bấm thử theo
  luồng UC create-uc.
