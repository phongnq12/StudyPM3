# Checklist đợt 2 — prototype

Agent tự kiểm trước khi báo xong; reviewer chấm ở G2 (`ba-gate G2 CN-xx`) cùng `checklist-screens.md`. Phương pháp:
`method-prototype.md` (số mục ghi cuối mỗi dòng). Cột "Máy": `Có` = kiểm được bằng script hoặc lệnh (grep `data-*`, `npm run build`,
`git diff`; chưa có script thì reviewer chấm thay), `Không` = phải đọc hoặc bấm. Mức: `Chặn` = còn thì G2 KHÔNG ĐẠT.

| # | Kiểm | Máy | Mức |
| --- | --- | --- | --- |
| proto-1 | Mỗi UC của CN có ít nhất một trang hoặc hộp thoại chứa trigger chính, mang `data-uc` đúng mã; UC tác nhân hệ thống có nút "Chạy thử" giả lập (method mục 4) | Có | Chặn |
| proto-2 | Mỗi MP của UC trong CN có đúng một quyết định (Giữ / Sửa / Tách / Gộp / Bỏ) ở `prototype-notes.md` mục 3, có lý do và nguồn; màn Mới dẫn UC, bước (method mục 2) | Có | Chặn |
| proto-3 | MP Bỏ có Q chặn G2 trong `chuc-nang/CN-xx/open-questions.md` (method mục 2) | Có | Chặn |
| proto-4 | Mỗi trường có `data-ent` là `Bang.truong` có trong ERD (hoặc `khong-luu`); không trường nào ngoài ERD (method mục 5) | Có | Chặn |
| proto-5 | Mỗi nút đổi trạng thái có `data-sm` là chuyển có trong `SM_…`; mỗi chuyển 👤 mà UC của CN phủ có đúng một nút; chuyển bị cấm không có nút (method mục 5) | Có | Chặn |
| proto-6 | Nút đổi trạng thái chỉ hiện ở trạng thái nguồn (đã bấm thử với bản ghi ở trạng thái khác) (method mục 5, 9) | Không | Chặn |
| proto-7 | Mỗi kiểm tra, thông báo lỗi có `data-br` là BR có thật, hoặc là ràng buộc ERD; không kiểm tra không nguồn (method mục 6) | Có | Chặn |
| proto-8 | Menu, nút, vùng theo quyền có `data-perm` là key có trong UCL; vai không có quyền không thấy mục menu, gõ thẳng route bị chặn (đã bấm thử) (method mục 3, 5, 9) | Không | Chặn |
| proto-9 | Dữ liệu nhạy cảm (ERD mục 9) ẩn với vai không được phép (method mục 1) | Không | Chặn |
| proto-10 | Bấm thử đủ main, mọi alternative (gồm `0.A`), mọi exception (gồm `*.E`) của mọi UC; mỗi luồng có vai, bước, kết quả thấy được, Đạt; không còn Không đạt (method mục 9) | Không | Chặn |
| proto-11 | `npm run build` trong `3-ba-detail/Prototype/app/` đạt (method mục 8) | Có | Chặn |
| proto-12 | Chỉ ghi `src/pages/CN-xx/` và `3-ba-detail/Prototype/CN-xx-<slug>/` (lần đầu thêm khung app, commit riêng); không sửa trang CN khác, khung chung (method mục 3) | Có | Chặn |
| proto-13 | Khung lần đầu: không còn trang, dữ liệu, câu thông báo, ma trận quyền PM2; màu chủ đạo theo `du-an/cau-hinh.md`; không còn `#076DB6`, `#D0202B` (trừ khi đó là màu đã chốt) (method mục 3) | Có | Chặn |
| proto-14 | Không mật khẩu, token, dữ liệu cá nhân thật trong mã và dữ liệu mẫu; đăng nhập chỉ chọn vai (method mục 3, 7) | Có | Chặn |
| proto-15 | `node_modules/`, `dist/` không được commit (`.gitignore` của app có hai dòng đó) (method mục 3) | Có | Chặn |
| proto-16 | Route, chuỗi thông báo cho từng bước UC ghi `chưa chốt (prototype)` đã chuyển cho phiên chính để điền ngược UC (method mục 9) | Có | Chặn |
| proto-17 | Mã SCR trong dải ID của CN, không trùng; mỗi trang gốc có `data-scr` (method mục 2, 5) | Có | Chặn |
| proto-18 | Dữ liệu mẫu đủ bản ghi ở mỗi trạng thái bắt đầu của UC và cho từng exception (method mục 7) | Không | Nên sửa |
| proto-19 | Dùng component `App*`, khuôn màn của AGENTS.md, token `var(--*)`; không mã màu thô trong `src/pages/CN-xx/` (method mục 4, 3) | Có | Nên sửa |
| proto-20 | Câu thông báo có mã `TB-<SCR>-<nn>`, viết cho người dùng cuối; không mã kỹ thuật, không con số chưa chốt (method mục 6) | Không | Nên sửa |
| proto-21 | Nhãn theo glossary; nhãn khác MP ghi ở `prototype-notes.md` mục 4; không đưa mã nội bộ, căn cứ pháp lý lên giao diện (UX-A8, UX-A12) (method mục 4) | Không | Nên sửa |
| proto-22 | Ảnh bấm thử (khi có Playwright) ở `CN-xx-<slug>/anh/<SCR>-<mã luồng>.png`; không có thì ghi lý do (method mục 9) | Có | Nên sửa |
| proto-23 | `prototype-notes.md` đủ heading template; Q, ASM, PH mới trong dải, có dòng trace | Có | Nên sửa |
