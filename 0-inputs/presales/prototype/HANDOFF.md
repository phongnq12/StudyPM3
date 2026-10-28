# Ghi chú bàn giao cho Dev Lead

<!-- Copyright © 2026 TrangNT5 — All Rights Reserved. -->

Prototype dùng cùng nền tảng với FE PM1 (React 19, Vite, Ant Design 5, Tailwind), nên lớp giao diện và Design System dùng lại được. Tầng dữ liệu, form và một số màn thao tác DOM trực tiếp cần thay khi lên sản phẩm. Số liệu dưới đây đo bằng script trên `src` (190 file, 19.824 dòng) ngày 20/10/2026.

## 1. Khác biệt với stack FE PM1

| FE PM1 dùng | Prototype | Ghi chú |
|:---|:---|:---|
| zustand | Chưa có | Trạng thái đang giữ bằng `useState` và các module trong `src/data` |
| react-query | Chưa có | Chưa gọi API, dữ liệu đọc ghi localStorage |
| yup / zod | Chưa có | Luật kiểm nhập viết trong code từng form |

## 2. Dùng lại được

- `src/theme/antdTheme.js` và `src/styles/tokens.css`: toàn bộ màu, cỡ chữ, bo góc, khoảng cách. Bản token chuẩn W3C DTCG có sẵn ở `design/src/data/pm2.tokens.json`.
- 79 file trong `src/components/app/`: bộ component `App*` dựng trên antd. 6 component đang import thẳng tầng dữ liệu, nên tách sang nhận dữ liệu qua props: `AppointmentStatusTag`, `CancelAppointmentDialog`, `ExemptionFields`, `NotifyRecipientsField`, `SimulatedCardPicker`, `TableCalendar`.
- Trang Design System: danh mục control, khuôn loại màn, bộ luật UI/UX có nguồn từng luật. Dùng làm chuẩn đối chiếu khi review giao diện FE thật. `design/public/AGENTS.md` là cùng nội dung ở dạng văn bản, đưa thẳng cho trợ lý AI lập trình đọc được.
- `src/routes.js`: đường dẫn đã theo mẫu PM1. Riêng `readRouteId()` đọc `location`, nên đổi sang `useParams`.
- `src/data/messageCatalog.js` cùng hàm `msg()`: câu thông báo tra theo mã Message List, 187 lời gọi ở 33 file.
- `SCREEN_ACCESS` và hàm `can()` trong `src/data/accountStore.js`: ma trận quyền theo màn và vai trò. Chỉ cần thay `currentAccount()` bằng người dùng của phiên đăng nhập thật.
- Enum trạng thái, nhãn và màu chip: chép thành file constants.
- `src/data/seed/`: dữ liệu mẫu khuôn `{ items, pagination }`, dùng làm mock khi Backend chưa sẵn sàng.

## 3. Cần thay khi lên sản phẩm

| Hạng mục | Số đo | Hướng xử lý đề xuất |
|:---|:---|:---|
| Tầng dữ liệu | 12 file dùng localStorage · 137 lệnh import tầng `src/data` ở 42 file | Lớp gọi API + hook react-query. Lớp đổi khoá cũ `fromLegacy` / `toLegacy` trong `appointmentStore.js` bỏ được |
| Luật nghiệp vụ chạy ở trình duyệt | `formActions.js` 704 dòng · `CounterRegistration/engine.js` 1.027 dòng · `autoCancel.js` · ghi lịch sử và gửi thông báo ở 14 file | Tự hủy lịch, gửi thông báo, ghi lịch sử, giữ suất, kiểm trùng lịch nên chuyển về Backend. FE giữ phần kiểm trước khi gửi |
| Thao tác DOM trực tiếp | 256 chỗ `document` / `window` / `location` ở 45 file · 23 chỗ `innerHTML` · 2 chỗ `createRoot` ngoài `main.jsx` | Nặng nhất là `engine.js` (màn Đăng ký tại quầy), `lib/legacyUi.js` (tooltip, toast), `lib/searchSelect.js`, `AppointmentForm/visitDatePicker.js`. Viết lại thành component React |
| Form và kiểm nhập | 5 chỗ dùng antd `Form`, lỗi ô nhập chèn vào DOM bằng tay | antd Form + schema yup hoặc zod |
| Điều hướng | 27 chỗ `location.href` | Đổi sang `useNavigate`. Xem mục 4 trước khi đổi |
| Giờ hệ thống | 149 chỗ `new Date()` / `Date.now()` ở 38 file | Gom về 1 hàm lấy giờ, sau này đồng bộ giờ máy chủ |
| HTML dạng chuỗi | 6 chỗ `dangerouslySetInnerHTML` | Đổi sang JSX để tránh XSS khi dữ liệu do người dùng nhập |
| Style viết thẳng | 58 chỗ `style={{}}` ở 21 file | Chuyển sang class hoặc token |

## 4. Điểm cần biết trước khi sửa

- **Design System phụ thuộc Prototype.** Trang Design System import 9 module trong `src/pages` (ví dụ `CounterRegistration/engine`, `AppointmentList/widgets`) để dựng mẫu khối màn thật. Đổi tên hoặc viết lại các module đó thì chạy `npm run build:design` để kiểm.
- **Nội dung Design System nằm ở JSON.** Luật, hướng dẫn, nhật ký phiên bản trong `design/src/data/*.json` là dữ liệu hiển thị, sửa trực tiếp file JSON.
- **CSS toàn cục theo màn.** Mỗi màn có file CSS riêng nạp theo route, dùng class toàn cục. Điều hướng đang dùng `location.href` (tải lại trang) có chủ ý, để CSS của 2 màn không chồng lên nhau. Đổi sang `useNavigate` thì cần chuyển CSS sang CSS Modules hoặc Tailwind trước.
- **Lớp `@layer reset` trong `styles/antd-reset.css`.** Lớp này gỡ style mặc định của một số control antd (nút, tag, tab, popup) để giữ đúng thiết kế đã duyệt. Thứ tự lớp: antd < reset < CSS của dự án.
- **Màu thương hiệu.** `theme/antdTheme.js` đã dùng xanh dương `#076DB6`. Riêng `Input.activeShadow` vẫn còn sắc đỏ `rgba(208,32,43,.14)`, giữ nguyên để khớp giao diện hiện tại, nên đổi sang `rgba(7,109,182,.14)` khi rà lại theme.
- **Thanh báo phiên bản mới** (`VersionNotice`) dò bản build mới bằng cách so chữ ký `/index.html`, không cần API riêng.
- **Tailwind** đã cài với tiền tố `tw-` nhưng chưa màn nào dùng.
- **Dung lượng build.** Chunk `exceljs` khoảng 937KB và chunk chính khoảng 569KB vượt ngưỡng cảnh báo 500KB của Vite. Nên nạp `exceljs` bằng `import()` lúc người dùng bấm Xuất Excel.
- **Đăng nhập giả lập.** Màn `/dang-nhap` kiểm tài khoản `DEMO_LOGIN` ngay ở trình duyệt và lưu cờ phiên ở localStorage hoặc sessionStorage (`isLoggedIn`, `login`, `logout` trong `accountStore.js`). Trình duyệt tự động (`navigator.webdriver`) được bỏ qua cổng để công cụ kiểm thử chạy được. Bản thật thay bằng API đăng nhập và SSO; bố cục màn và câu thông báo (`E001-01`, `SE001-05`) dùng lại được.
- **Phần giả lập.** Đổi tài khoản ở menu góc phải và `SimulatedCardPicker` (giả lập quẹt thẻ) chỉ phục vụ demo, bản thật thay bằng đăng nhập và đầu đọc thẻ thật. `Pm1SyncBar` là tính năng thật (giờ đồng bộ và nút Đồng bộ lại), chỉ phần nối dữ liệu PM1 đang giả lập.
- **Khởi động rỗng.** Cờ `START_EMPTY` trong `src/data/legacyData.js`, xem README mục Dữ liệu.

© 2026 TrangNT5. All rights reserved.
