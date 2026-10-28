# PM3 Prototype — Quản lý kho căng tin

<!-- Copyright © 2026 TrangNT5 — All Rights Reserved. -->

Prototype PM3 (Quản lý kho căng tin) dựng lại từ mã nguồn Prototype PM2 của TrangNT5, dùng chung component `App*`, token, theme và khung trang. Bản này chỉ còn màn Đăng nhập và chức năng **Giá nhập theo nhà cung cấp**; các màn PM2 vẫn còn mã nguồn trong `src/pages` nhưng đã gỡ khỏi menu và định tuyến. Bản PM3 không kèm trang Design System.

| | |
|:---|:---|
| **Tác giả** | TrangNT5 |
| **Phiên bản** | 1.1.0 — mã nguồn chốt lúc 11:55 ngày 21/10/2026 (thêm màn Đăng nhập, luật tự hủy lịch Từ chối duyệt theo số giờ giữ chỗ) |
| **Ghi chú bàn giao** | [HANDOFF.md](HANDOFF.md) — phần nào dùng lại, phần nào cần thay khi lên sản phẩm |

## Chạy thử

Yêu cầu Node.js 20.19 trở lên.

```bash
npm install
npm run dev              # http://localhost:5176
npm run build            # xuất ra dist/
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

## Màn hình Prototype

| Đường dẫn | Màn hình |
|:---|:---|
| `/dang-nhap` | Đăng nhập. Đăng nhập xong vào thẳng `/hang-hoa/gia-nhap` |
| `/hang-hoa/gia-nhap` | Danh sách giá nhập theo nhà cung cấp (tìm kiếm, lọc, Xuất Excel, Xóa) |
| `/hang-hoa/gia-nhap/tao-moi` | Thêm dòng giá nhập (kèm hộp Quyết định giá bán) |
| `/hang-hoa/gia-nhap/:id` | Chi tiết dòng giá nhập |
| `/hang-hoa/gia-nhap/:id/chinh-sua` | Cập nhật dòng giá nhập |


## Tài khoản demo

Đăng nhập bằng tài khoản giả lập **admin / Admin@123** (khai ở `DEMO_LOGIN`, `src/data/accountStore.js`). Vào trong, đổi vai ở menu góc phải, mục **Đăng nhập tài khoản khác**; nút **Đăng xuất** về lại màn đăng nhập. Lựa chọn lưu trong localStorage.

| Tài khoản | Vai trò | Quyền chính |
|:---|:---|:---|
| Nguyễn Văn Hùng | Người phụ trách căng tin | Xem, Xuất Excel, Thêm, Sửa, Xóa dòng giá nhập |
| Trần Thị Mai | Kế toán | Xem danh sách, xem chi tiết, Xuất Excel. Không thấy Thêm, Sửa, Xóa |

Ma trận đầy đủ nằm ở `SCREEN_ACCESS` trong `src/data/accountStore.js`, mọi màn kiểm quyền qua hàm `can(screen, action, record)`.

## Dữ liệu

- Toàn bộ dữ liệu lưu ở localStorage (khoá `pm3_gia_nhap_v1`), chưa gọi API. Dữ liệu mẫu ở `src/data/seed/PM3_PurchasePrice_Data.js`, ngày tính tương đối từ hôm nay.
- Mở lại vào ngày khác: mọi mốc ngày đã lưu tự dời theo số ngày đã trôi để các dòng giữ đúng Khai trước / Hiện hành / Hết hiệu lực.
- Muốn nạp lại dữ liệu mẫu: xóa localStorage của trang rồi tải lại.

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
