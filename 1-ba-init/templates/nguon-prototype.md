# Nguồn prototype presales
<!-- BA chép file này thành 0-inputs/presales/prototype/nguon.md khi nhận prototype. Bắt buộc khi presales bàn giao
     bằng link; có dist/ hoặc ma-nguon/ thì vẫn nên ghi để biết bản nào, ai bàn giao. -->

| Mục | Giá trị |
| --- | --- |
| Link | https://<tên-app>.web.app/ |
| Ngày bàn giao | YYYY-MM-DD |
| Người bàn giao | <vai trò, ví dụ: presales> |
| Phiên bản | <commit, tag hoặc ngày build nếu có> |
| Duyệt bằng | <để trống: dist khi có, không thì link; ghi `link` để bắt duyệt bằng link> |
| Ghi chú | <tài khoản demo nếu cần: ghi vai trò, không ghi mật khẩu> |

Cột "Mục" giữ đúng chữ: `kit/tools/ba-verify/quet-prototype.mjs` đọc dòng "Link" và "Duyệt bằng". Không ghi mật khẩu,
token vào repo.

## Đặt prototype vào `0-inputs/presales/prototype/`

Có gì đặt nấy, cần ít nhất một trong ba dạng đầu:

| Đặt vào | Khi nào | Kit dùng để |
| --- | --- | --- |
| `dist/` (hoặc `build/`, `out/`) có `index.html` | Presales gửi bản build (thư mục sau `npm run build`) | Duyệt chính: kit mở server cục bộ, không phụ thuộc link còn sống |
| `nguon.md` (file này) có dòng "Link" | Presales gửi link đã deploy (Firebase Hosting, Vercel…) | Duyệt khi không có `dist/`; có cả hai thì đối chiếu danh sách route |
| Tệp `.html` | Prototype HTML tĩnh nhiều trang | Duyệt từng tệp |
| `ma-nguon/` | Presales gửi mã nguồn (repo, zip có `package.json`) | Tùy chọn. Kit **không chạy** mã nguồn; chỉ đọc khai báo route để không sót màn. Nguồn cho bước 10 |

- Giữ nguyên cấu trúc thư mục presales gửi; không sửa gì bên trong (CLAUDE.md luật 10).
- Không có `dist/` nhưng có mã nguồn: nhờ presales hoặc Dev build (`npm install && npm run build`) rồi đặt thư mục
  kết quả vào `dist/`. Kit không tự build mã nguồn của bên khác.
- App gọi dữ liệu thật (Firebase, API) mà bản `dist/` chạy cục bộ không tải được dữ liệu (màn trống) → ghi `link` ở
  dòng "Duyệt bằng", lý do ở "Ghi chú".
