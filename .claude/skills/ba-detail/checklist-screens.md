# Checklist đợt 3 — đặc tả màn hình

Agent tự kiểm trước khi báo xong; reviewer chấm ở G2 (`ba-gate G2 CN-xx`) cùng `checklist-prototype.md`. Phương pháp:
`method-screens.md` (số mục ghi cuối mỗi dòng). Cột "Máy": `Có` = kiểm được bằng script (đối chiếu `data-*` ↔ đặc tả, trace-check,
term-check; chưa có script thì reviewer chấm thay), `Không` = phải đọc. Mức: `Chặn` = còn thì G2 KHÔNG ĐẠT.
Port từ checklist `ba-screens` 1.0.0 của kit gốc (19 dòng), đổi nguồn theo business layer v3, thêm dòng SCR-000.

| # | Kiểm | Máy | Mức |
| --- | --- | --- | --- |
| scr-1 | Mỗi `data-scr` trên prototype của CN có đúng một file đặc tả và ngược lại; mục 1 ghi MP nguồn, quyết định MP → màn khớp `prototype-notes.md` mục 3 (method mục 3) | Có | Chặn |
| scr-2 | Mỗi bước UC có màn hình phục vụ ở một SCR; mỗi SCR dẫn UC và bước (method mục 3) | Không | Chặn |
| scr-3 | Mỗi trường có `` `Bang.truong` `` (hoặc Δ / BR công thức, hoặc "không lưu"); khớp `data-ent` trên prototype (method mục 2, 4) | Có | Chặn |
| scr-4 | Trường mà ERD dẫn biểu mẫu luật là bắt buộc trên màn, hoặc có lý do (method mục 4) | Không | Chặn |
| scr-5 | Kiểu trường dùng tên control của design system PM2 (mã khối AGENTS.md hoặc component `App*`) (method mục 4) | Không | Nên sửa |
| scr-6 | Mỗi hành động có điều kiện hiển thị theo trạng thái và actor; nút đổi trạng thái khớp `data-sm`, chỉ hiện ở trạng thái nguồn của chuyển (method mục 5) | Có | Chặn |
| scr-7 | Quyền dẫn ACT và permission key của UCL; không ma trận phân quyền riêng trong `3-ba-detail/Screens/` (method mục 1.3, 5) | Không | Chặn |
| scr-8 | Xóa, hủy, từ chối, gửi có bước xác nhận theo SCR-000 mục 4 (method mục 5) | Không | Nên sửa |
| scr-9 | Mỗi kiểm tra dẫn BR, ràng buộc ERD, hoặc ghi "kỹ thuật"; mỗi BR kiểm dữ liệu mà UC của màn dẫn có ở ít nhất một SCR của CN (method mục 6) | Có | Chặn |
| scr-10 | Thông báo mã `TB-<SCR>-<nn>`, viết cho người dùng cuối, khớp BR gây ra, chép đúng `thong-bao.js`; không mã kỹ thuật, không con số chưa chốt (method mục 6) | Có | Nên sửa |
| scr-11 | Màn danh sách có cột, sắp xếp mặc định, bộ lọc, thao tác trên dòng, kết quả rỗng; phạm vi dữ liệu dẫn UC mục 2 (method mục 7) | Không | Nên sửa |
| scr-12 | Đủ bốn trạng thái của màn (riêng hoặc dẫn SCR-000 mục 6) (method mục 8) | Không | Chặn |
| scr-13 | Bảng hiển thị theo trạng thái và quyền khớp ma trận trạng thái × thao tác của SM, `UCD_…` mục 4, dấu `data-sm`, `data-perm`; dữ liệu nhạy cảm (ERD mục 9) chỉ hiện cho actor được phép (method mục 8) | Không | Chặn |
| scr-14 | Không trường, nút, thông báo ngoài nghiệp vụ đã qua gate, ngoài prototype (method mục 1.1, 2) | Có | Chặn |
| scr-15 | Phần dùng chung dẫn SCR-000, không chép; mục 9 liệt kê đủ điểm khác SCR-000 kèm lý do (method mục 1.2, 9) | Không | Nên sửa |
| scr-16 | Hành vi không nguồn có ASM; Q, ASM, SCR trong dải ID của CN, có dòng trace (SCR: `lien_ket` tới UC, bảng ERD, `SM mục n`, BR); không còn mã giữ chỗ (method mục 9) — máy: `trace-check` | Có | Chặn |
| scr-17 | Đủ heading template; thuật ngữ đúng glossary — máy: `term-check` | Có | Nên sửa |
| scr-18 | Mỗi trường có miền giá trị (dẫn ERD hoặc `[CẦN XÁC NHẬN]`) và nguồn; không ô trống (method mục 4) | Không | Nên sửa |
| scr-19 | Mỗi kiểm tra ghi "Hiện ở"; thông báo lỗi nói lỗi gì và cách sửa; tiếp cận, bàn phím theo SCR-000 mục 7, phần khác ở mục 9 (method mục 6, 8) | Không | Nên sửa |
| scr-20 | Có `3-ba-detail/Screens/SCR-000-quy-uoc-chung.md` (lần đầu: tạo theo template, commit riêng); mỗi quy ước có nguồn (AGENTS.md, MP, `0-inputs/`); con số, mức WCAG không nguồn là `[CẦN XÁC NHẬN]` kèm Q (method mục 10) | Có | Chặn |
| scr-21 | Chỉ ghi `3-ba-detail/Screens/CN-xx-<slug>/` (lần đầu thêm SCR-000); không sửa đặc tả CN khác | Có | Chặn |
