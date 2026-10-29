# Cấu hình dự án

**File này dùng để làm gì:** ghi các tham số riêng của dự án mà kit dùng chung đọc tới. Điền một lần khi mở dự án,
trước `/ba-init`. Mọi agent đọc file này trước khi làm (CLAUDE.md).

**Cách đọc bảng:** mỗi dòng một tham số. Cột "Nguồn" ghi nơi quyết định (`0-inputs/answers-<ngày>.md`, hợp đồng, email
đã lưu). Chưa có thì ghi `[CẦN XÁC NHẬN]`, không tự đặt.

| Tham số | Giá trị | Dùng ở | Nguồn |
| --- | --- | --- | --- |
| Mã dự án `<MA>` | PM3CSCN | Mã UC WBS `<MA>.<NỀN TẢNG>.<MODULE>.cc.tt`, tên tài liệu business layer `*_<MA>_<PV>_vNN.md`, khóa localStorage prototype `<ma>.CN-xx.*` | 0-inputs/answers-2026-10-29.md, RQ-69 |
| Tên dự án | Quản lý kho căng tin | `khoi-tao.mjs --ten`, tiêu đề sổ, README | 0-inputs/presales/prototype/README.md; tên khởi tạo /ba-init |
| Khách hàng | Cơ sở cai nghiện ma túy công lập | BRD, bên liên quan | 0-inputs/answers-2026-10-29.md, RQ-71 |
| Nền tảng | WEB | Mã UC WBS | 0-inputs/answers-2026-10-29.md, RQ-69 |
| Design system | Design System PM2 1.1.0 (`3-ba-detail/templates/design-system/`) | Prototype, đặc tả màn | {{}} |
| Màu chủ đạo | {{tên màu, mã hex}} | Khung prototype (`antdTheme.js`, `tokens.css`), đặc tả màn khung chung, checklist prototype, G2 | {{}} |
| Git host | GitHub | Mở PR (`gh` / `glab`) | remote origin (github.com) |
