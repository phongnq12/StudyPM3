# PM2 Prototype và Design System

<!-- Copyright © 2026 TrangNT5 — All Rights Reserved. -->

Mã nguồn Prototype giao diện PM2 cùng trang Design System PM2, dùng làm bản mẫu tham chiếu khi dựng FE chính thức. Giao diện, luồng thao tác, phân quyền và câu thông báo trong bản này đã được duyệt. Design System dùng chính component của Prototype, nên 2 phần luôn khớp nhau.

| | |
|:---|:---|
| **Tác giả** | TrangNT5 |
| **Phiên bản** | 1.1.0 — mã nguồn chốt lúc 11:55 ngày 21/10/2026 (thêm màn Đăng nhập, luật tự hủy lịch Từ chối duyệt theo số giờ giữ chỗ) |
| **Ghi chú bàn giao** | [HANDOFF.md](HANDOFF.md) — phần nào dùng lại, phần nào cần thay khi lên sản phẩm |

## Chạy thử

Yêu cầu Node.js 20.19 trở lên.

```bash
npm install

# Prototype
npm run dev              # http://localhost:5174
npm run build            # xuất ra dist/

# Design System
npm run dev:design       # http://localhost:5177/design.html
npm run build:design     # xuất ra dist-design/
```

## Công nghệ

- React 19 · Vite 7 · React Router 7
- Ant Design 5.29 (kèm `@ant-design/v5-patch-for-react-19`) · Tailwind CSS 3 (tiền tố `tw-`, tắt preflight)
- lucide-react (icon) · dayjs (ngày giờ) · exceljs (xuất Excel)

## Cấu trúc thư mục

| Thư mục | Nội dung |
|:---|:---|
| `src/theme/` | Cấu hình Ant Design, nguồn duy nhất về màu, cỡ chữ, bo góc của control antd. Prototype và Design System dùng chung |
| `src/styles/` | Token CSS (`tokens.css`), CSS nền và CSS dùng chung |
| `src/components/app/` | Bộ component dùng chung `App*` dựng trên antd, cùng cách đặt tên với FE PM1 |
| `src/layout/` | Khung trang: header, menu ngang, sidebar, breadcrumb, chuông thông báo |
| `src/pages/` | Màn hình, mỗi màn 1 thư mục, CSS riêng của màn đặt cạnh |
| `src/data/` | Kho dữ liệu chạy bằng localStorage, danh mục câu thông báo, ma trận phân quyền |
| `src/data/seed/` | Dữ liệu mẫu theo khuôn `{ items, pagination }` |
| `src/lib/` | Hàm tiện ích dùng chung |
| `src/routes.js` | Khai báo đường dẫn, nguồn duy nhất cho mọi liên kết giữa các màn |
| `design/src/` | Mã nguồn trang Design System: trang tài liệu, danh mục control, mẫu khối màn |
| `design/src/data/` | Nội dung hiển thị của Design System (luật UI/UX, hướng dẫn, nhật ký phiên bản, token dạng W3C DTCG) |
| `design/public/` | Ảnh chụp màn hình và control · `AGENTS.md`, `llms.txt` là bản Design System dạng văn bản cho trợ lý AI lập trình |
| `design.html` · `vite.design.config.js` | Điểm vào và cấu hình build của Design System |

## Màn hình Prototype

| Đường dẫn | Màn hình |
|:---|:---|
| `/dang-nhap` | Đăng nhập. Chưa đăng nhập mà mở màn khác thì tự chuyển về đây, đăng nhập xong quay lại đúng màn đang mở |
| `/lich-hen/tham-gap-truc-tiep` | Danh sách lịch hẹn thăm gặp trực tiếp |
| `/lich-hen/tham-gap-truc-tiep/lich-theo-buong` | Lịch theo buồng (kéo thả điều chỉnh) |
| `/lich-hen/tham-gap-truc-tiep/tao-moi` | Tạo mới lịch hẹn |
| `/lich-hen/tham-gap-truc-tiep/:id` | Chi tiết lịch hẹn |
| `/lich-hen/tham-gap-truc-tiep/:id/chinh-sua` | Chỉnh sửa lịch hẹn |
| `/lich-hen/gap-truc-tiep-ngoai-le` | Danh sách đơn gặp trực tiếp ngoại lệ, kèm Chi tiết, Chỉnh sửa, Lịch theo buồng |
| `/tiep-don/dang-ky-luot-tai-quay` | Đăng ký lượt thăm gặp tại quầy |
| `/tiep-don/quay-tiep-don` | Danh sách quầy tiếp đón, kèm Tạo mới, Chi tiết, Chỉnh sửa |
| `/van-hanh-co-so/cau-hinh-thoi-gian` | Cấu hình thời gian thăm gặp |
| `/quan-tri/thong-bao` | Danh sách thông báo |
| `/quan-tri/cai-dat-thong-bao` | Cài đặt thông báo |

## Trang Design System

Điều hướng bằng hash (`design.html#/…`). Các nhóm trang chính:

- **Nền tảng và nguyên tắc:** Tổng quan, Nền tảng (màu, chữ, khoảng cách), Nguyên tắc thiết kế.
- **Control:** Tất cả control, Lưới · khối · trạng thái ô, Khuôn loại màn (Danh sách, Chi tiết, Tạo mới, Chỉnh sửa, Cấu hình, Lịch, Đặt lịch).
- **Luật và quy ước:** Bộ luật UI/UX, Quy ước dựng code, Message List, Common Rules, Chuẩn thiết kế đã chốt.
- **Đối chiếu:** Theo màn, Báo cáo lệch, Lệch PM1 · PM2, Nhật ký phiên bản.

Mỗi luật trên trang có cột nguồn ghi rõ căn cứ chốt luật.

## Tài khoản demo

Đăng nhập bằng tài khoản giả lập **admin / Admin@123** (khai ở `DEMO_LOGIN`, `src/data/accountStore.js`). Vào trong, đổi vai ở menu góc phải, mục **Đăng nhập tài khoản khác**; nút **Đăng xuất** về lại màn đăng nhập. Lựa chọn lưu trong localStorage.

| Tài khoản | Vai trò | Quyền chính |
|:---|:---|:---|
| Nguyễn Thùy Trang | Cán bộ Tổ tham mưu | Xem, tạo, sửa, xóa, hủy lịch hẹn. Không duyệt |
| Trưởng Cơ Sở | Trưởng cơ sở | Chỉ xem lịch hẹn thường. Duyệt và từ chối đơn ngoại lệ |
| Nguyễn Thùy Linh | Cán bộ Tổ thăm gặp | Toàn quyền lịch hẹn thường, kể cả duyệt và kéo thả trên Lịch theo buồng |

Ma trận đầy đủ nằm ở `SCREEN_ACCESS` trong `src/data/accountStore.js`, mọi màn kiểm quyền qua hàm `can(screen, action, record)`.

## Dữ liệu

- Toàn bộ dữ liệu lưu ở localStorage của trình duyệt, chưa gọi API.
- Prototype khởi động **rỗng**: không có lịch hẹn, quầy, buồng mẫu, người dùng tự tạo từ đầu. Danh mục người cai nghiện, thân nhân, dãy nhà và cấu hình giờ mặc định vẫn có sẵn.
- Muốn nạp bộ lịch hẹn và quầy mẫu: đổi `START_EMPTY` thành `false` trong `src/data/legacyData.js`, rồi xóa localStorage của trang.
- Design System tự nạp dữ liệu mẫu riêng (`design/src/seed.js`) để các control chạy thật.

## Quy ước

- Đường dẫn: kebab-case tiếng Việt, theo mẫu FE PM1 `tao-moi` · `:id` · `:id/chinh-sua`.
- Tên trường: camelCase tiếng Anh. Hậu tố `…Date` / `…At` cho ngày, `…Code` / `…Id` cho mã, `is…` / `has…` cho cờ.
- Trạng thái: enum tiếng Anh IN HOA (`PENDING_APPROVAL`), màn hình hiện nhãn tiếng Việt.
- Ngày giờ: hiển thị `DD/MM/YYYY`, `DD/MM/YYYY HH:mm`. Lưu `YYYY-MM-DD`.
- Câu thông báo: gọi theo mã Message List, ví dụ `msg('E001-01', 'đủ giờ bắt đầu và giờ kết thúc suất riêng theo dạng HH:mm')`, danh mục ở `src/data/messageCatalog.js`.
- Thuộc tính `data-fe` trên phần tử ghi tên component FE tương ứng, dùng làm móc cho test tự động.

## Tài liệu liên quan

- Design System PM2 bản live: https://trangnt5-pm2-design-system.vercel.app (có mật khẩu, liên hệ TrangNT5)
- Prototype bản live: https://pm2-prototype-iota.vercel.app

© 2026 TrangNT5. All rights reserved.
