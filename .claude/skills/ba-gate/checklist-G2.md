# Checklist G2 — Giao diện khớp nghiệp vụ

Phạm vi: đợt 2, 3 `/ba-detail CN-xx`: trang của CN trong app chung `3-ba-detail/Prototype/app/src/pages/CN-xx/`, ghi chú
`3-ba-detail/Prototype/CN-xx-<slug>/`, đặc tả màn `3-ba-detail/Screens/CN-xx-<slug>/` (file app chung chỉ khi nhánh
của CN đã sửa).
Reviewer (quality-reviewer, mỗi phiên một chế độ): chất lượng, nhất quán, pháp lý, presales. Cột "Ai kiểm" cho biết dòng
nào máy kiểm, dòng nào reviewer nào chấm. Còn một dòng mức "Chặn" chưa đạt → gate KHÔNG ĐẠT
(kit/standards/gate-procedure.md mục 3).
Chấm cùng `checklist-chung.md` (mã `chung-<số>`) và checklist bước `.claude/skills/ba-detail/checklist-prototype.md`
(mã `proto-<số>`), `checklist-screens.md` (mã `scr-<số>`); reviewer chấm lại dòng Chặn máy chưa kiểm (skill ba-gate,
"Đọc trước"). Mã dòng trong hồ sơ: `G2-<số>`. Quy trình chạy: skill ba-gate.
Nguồn: kit/thiet-ke/thiet-ke-kit.md bảng G3 (kit gốc), đổi theo kit v3: prototype là một app chung, design system PM2.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Cổng máy `check-all --chuc-nang CN-xx` đạt | Máy | Chặn |
| 2 | G1 còn hiệu lực (UC đã điền ngược `Màn hình`, `Message thông báo` thì G1 đã chạy lại) | Máy | Chặn |
| 3 | Có trang `Prototype/app/src/pages/CN-xx/`, ghi chú `Prototype/CN-xx-<slug>/`, đặc tả `Screens/CN-xx-<slug>/SCR-xxx-*.md` | Máy | Chặn |
| 4 | `npm run build` trong `3-ba-detail/Prototype/app/` đạt tại commit đã kiểm | Phiên chính | Chặn |
| 5 | Mọi UC của CN có màn (SCR) và luồng bấm được; mỗi SCR dẫn UC có thật của CN | Agent nhất quán | Chặn |
| 6 | Bấm thử mọi luồng chính, thay thế, ngoại lệ của UC đạt (ghi chú prototype ghi kết quả từng luồng); thứ tự bấm đúng thứ tự bước UC | Agent nhất quán | Chặn |
| 7 | Trường, nút đổi trạng thái, thông báo dẫn đúng ERD, SM, BR, UC; không trường, nút, thông báo ngoài nghiệp vụ đã qua G0, G1 | Agent nhất quán | Chặn |
| 8 | Ẩn hiện theo quyền khớp `Permission key`, ma trận tác nhân × UC | Agent nhất quán | Chặn |
| 9 | Trường bắt buộc theo biểu mẫu luật có trên màn; dữ liệu mật, cá nhân chỉ hiện cho tác nhân được phép | Agent pháp lý | Chặn |
| 10 | Mỗi MP presales của CN có quyết định MP → SCR (giữ, sửa, bỏ, mới) kèm lý do; MP bỏ có BA xác nhận; thay đổi có ảnh | Agent presales | Chặn |
| 11 | Đặc tả màn rõ, kiểm chứng được; chỉ ghi phần khác `SCR-000-quy-uoc-chung.md` | Agent chất lượng | Chặn |
| 12 | Hành vi không nguồn có ASM trong dải của CN | Agent chất lượng | Nên sửa |
| 13 | Theo design system PM2 (`3-ba-detail/templates/design-system/design_system.md`: token, component `App*`, luật UI/UX); màu chủ đạo theo `du-an/cau-hinh.md`; không dùng màu đỏ, xanh dương của PM2 làm màu chủ đạo; không lấy nghiệp vụ, câu thông báo, dữ liệu mẫu của PM2 | Agent chất lượng | Nên sửa |
| 14 | Không nghiệp vụ mới: chỗ prototype làm lộ hổng của UC đã sửa ở UC trước (G1 chạy lại), không sửa màn để né | Agent nhất quán | Chặn |
| 15 | Không còn Q `mở` chặn G2 | Máy | Chặn |
| 16 | Thuật ngữ đúng glossary, kể cả chữ hiển thị của prototype | Máy | Nên sửa |
