# Design system dùng cho dự án

Nguồn: Design System PM2 (tác giả TrangNT5, phiên bản 1.1.0, mã nguồn chốt 21/10/2026), chép nguyên bộ vào
`PM2-3_Prototype_Source/`. Không sửa bản chép: cần đổi thì sửa ở nguồn rồi chép lại. Dự án dùng design system khác
thì thay thư mục này và ghi lại ở `du-an/cau-hinh.md`.

## Đọc gì, theo thứ tự

| Cần | File | Ghi chú |
| --- | --- | --- |
| Luật UI/UX, danh mục control, cách dùng (dạng văn bản cho agent) | [AGENTS.md](PM2-3_Prototype_Source/design/public/AGENTS.md) | Sinh tự động; mỗi ý có nhãn nguồn Verified / Based on Docs / AI Inferred |
| Token màu, chữ, khoảng cách, bo góc | [tokens.css](PM2-3_Prototype_Source/src/styles/tokens.css), [pm2.tokens.json](PM2-3_Prototype_Source/design/src/data/pm2.tokens.json) (W3C DTCG) | Không viết mã màu thô, luôn dùng `var(--*)` |
| Theme Ant Design | [antdTheme.js](PM2-3_Prototype_Source/src/theme/antdTheme.js) | Nguồn duy nhất màu, cỡ chữ, bo góc control antd |
| Component dùng chung `App*` | [src/components/app/](PM2-3_Prototype_Source/src/components/app/) | 79 file dựng trên antd |
| Bàn giao, phần dùng lại / phải thay | [HANDOFF.md](PM2-3_Prototype_Source/HANDOFF.md), [README.md](PM2-3_Prototype_Source/README.md) | |
| Ảnh màn mẫu | [design/public/screens/](PM2-3_Prototype_Source/design/public/screens/) | Màn của PM2 (lịch hẹn thăm gặp), chỉ để tham khảo khuôn |

Chạy thử (Node.js ≥ 20.19): `npm install`, rồi `npm run dev:design` (http://localhost:5177/design.html).

## Lưu ý khi áp cho dự án
- Đây là design system của **PM2**: nội dung nghiệp vụ, câu thông báo (`messageCatalog`, Message List PM2), ma trận
  quyền, dữ liệu mẫu là của PM2 — không dùng cho dự án. Chỉ lấy lớp giao diện: token, theme, component, luật UI/UX.
- Màu thương hiệu chưa thống nhất trong chính nguồn: `tokens.css` ghi màu chủ đạo đỏ `#D0202B`, HANDOFF.md mục 4 ghi
  `antdTheme.js` đã dùng xanh dương `#076DB6`. Màu chủ đạo của dự án ghi ở `du-an/cau-hinh.md`, kèm nguồn quyết định
  (thường theo prototype presales); chưa chốt thì hỏi BA trước khi dựng khung prototype.
- Luật UX-A8, UX-A12 (không đưa mã nội bộ, căn cứ pháp lý lên giao diện) áp cho prototype và đặc tả màn của dự án.
