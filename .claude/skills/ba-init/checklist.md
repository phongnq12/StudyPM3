# Checklist bước 1 — danh mục đầu vào

Agent tự kiểm trước khi báo xong; reviewer ở G0 chấm phần danh mục theo bảng này. Cột "Máy": `dau-vao-check.mjs`
kiểm được (Có) hay cần đọc (Không).

| # | Kiểm | Máy | Mức |
| --- | --- | --- | --- |
| 1 | uc-presales.md mục 0 ghi đúng tệp, sheet, cột mã, cột tên | Có | Chặn |
| 2 | Mỗi UC: mã và tên khớp nguyên văn tệp gốc theo số dòng | Có | Chặn |
| 3 | Không sót dòng UC nào trong tệp gốc | Có | Chặn |
| 4 | Mô tả luồng, actor chép nguyên văn; không có lời đánh giá trong cột nội dung | Không | Chặn |
| 5 | Phân hệ lấy đúng dòng nhóm gần nhất phía trên | Không | Nên sửa |
| 6 | Mã trùng, dòng không mã có phát hiện (open-questions mục 3) | Có (mã trùng) | Chặn |
| 7 | quy-trinh-presales.md mục 0 có mọi tệp, mọi trang sơ đồ chứa quy trình | Có (trang drawio) | Chặn |
| 8 | Mọi ô bước, cổng có nhãn của sơ đồ có ở mục 2 hoặc mục 3; tên bước khớp nguyên văn nhãn | Có (drawio, bpmn) | Chặn |
| 9 | "Đi tới" đủ mọi mũi tên giữa hai bước đã ghi, giữ nhãn mũi tên | Có (thiếu) | Chặn |
| 10 | UC presales của bước chỉ chép từ mapping presales, mã có trong uc-presales.md; không tự gắn | Có (mã) / Không (tự gắn) | Chặn |
| 11 | Quy trình chi tiết ghi đúng bước tổng mà nó mở rộng; cấp tổng / chi tiết đúng | Có (mã có thật) / Không | Nên sửa |
| 12 | UC presales không bước nào gắn có ở mục 4 kèm PH | Có | Chặn |
| 13 | Mọi MP trong JSON có trong man-presales.md và ngược lại, cột "Vị trí" khớp JSON; HTML tĩnh: mỗi tệp có ít nhất một MP | Có | Chặn |
| 14 | Mỗi MP có ảnh, hoặc cột "Ghi chú" ghi lý do | Có | Chặn |
| 15 | Mỗi MP gắn UC presales có thật, hoặc "—" kèm phát hiện | Có | Chặn |
| 16 | Màn gắn UC có căn cứ (tiêu đề, trường, nút khớp UC); không chắc thì có ASM | Không | Nên sửa |
| 17 | Mỗi văn bản có số hiệu, ngày hiệu lực lấy từ tệp, hoặc `[CẦN XÁC NHẬN]` kèm Q; "Số điều khoản lấy" khớp mục 2 | Có (số điều khoản) / Không | Chặn |
| 18 | Mã điều khoản đúng định dạng, không lặp; loại thuộc 7 loại; tệp nguồn có thật | Có | Chặn |
| 19 | Chỉ lấy điều khoản chi phối nghiệp vụ; mỗi mã một ý (tách tới khoản, điểm khi cần) | Không | Nên sửa |
| 20 | Chủ thể, hành vi, đối tượng bằng từ của văn bản; một chủ thể, một hành vi mỗi dòng | Không | Nên sửa |
| 21 | Tóm tắt giữ nguyên con số, đơn vị, chủ thể như văn bản; không tính toán | Không | Chặn |
| 22 | Hướng BR thuộc sáu loại hoặc "—"; điều kiện, thời hạn, thẩm quyền luôn có hướng BR | Có | Chặn |
| 23 | Biểu mẫu kèm văn bản có dòng ở mục 3, đủ trường | Không | Nên sửa |
| 24 | Ma trận: mỗi UC presales ở mục 1 hoặc mục 2 (không cả hai); mỗi điều khoản ở mục 1 hoặc mục 3 | Có | Chặn |
| 25 | Ma trận: văn bản khớp phap-ly.md; quan hệ, cách ghép, lý do đúng danh sách; "chưa tìm thấy" có Q, "chưa có UC" có PH | Có | Chặn |
| 26 | Ghép theo chủ thể, hành vi, đối tượng, không theo chữ trùng; không ghép chắc thì có ASM; lý do mục 2 không dùng để né | Không | Chặn |
| 27 | Mâu thuẫn giữa văn bản, giữa UC và luật, giữa lane và actor có Q ghi đủ phương án, chặn G0 | Không | Chặn |
| 28 | Glossary: thuật ngữ theo luật; từ đồng nghĩa ở cột "Không dùng"; có nguồn | Không | Nên sửa |
| 29 | open-questions mục 1, 2: mã, trạng thái, cột "Chặn gate" hợp lệ; đã quyết có người quyết | Có | Chặn |
| 30 | open-questions mục 3 (phát hiện): mã PH, loại, trạng thái hợp lệ, bước `1`; "Q liên quan" trỏ Q có thật | Có | Chặn |
| 31 | trace.csv có dòng cho mọi QP, QT, MP, PH, Q, ASM | Có (trace-check) | Chặn |
| 32 | Không sửa gì trong `0-inputs/` (trừ `answers-*.md`); không sửa tay man-presales.json | Không (git diff) | Chặn |
| 33 | Mỗi route trong `route_chua_mo`, `lech_nguon` của JSON có dòng ở mục 3; cột "Xử lý" có PH, Q hoặc ghi đã xem tay | Có (có dòng) | Chặn |
| 34 | Duyệt đúng bản: có `dist/` thì duyệt dist, trừ khi `nguon.md` ghi "Duyệt bằng: link" kèm lý do; màn chính không trống hàng loạt, không chỉ thấy màn đăng nhập | Không | Chặn |
| 35 | Bản đồ quy trình: mã QT-nn đúng định dạng, không lặp; mỗi QT có trigger, kết quả, ít nhất một UC presales hoặc điều khoản; UC, điều khoản có thật | Có | Chặn |
| 36 | Mỗi QT gom theo thủ tục, đối tượng nghiệp vụ (không theo màn, phân hệ); tên là động từ + đối tượng theo glossary | Không | Nên sửa |
| 37 | Mỗi QT có thư mục `cap-2/QT-nn-<slug>/` và dòng chỉ mục ở file tổng mục 2; `QT-nn.md` mục 2 có đúng các UC của QT ở file tổng mục 1; thứ tự theo trình tự luật rồi luồng màn; trình tự luật khác luồng màn có PH | Có (thư mục, UC khớp) / Không | Chặn |
| 38 | Mỗi chỗ nối `khoảng trống` có PH và dòng ở `QT-nn.md` mục 3; chỗ nối `khớp` trả lời được bốn câu bằng nguồn; QT có UC có sơ đồ `QT-nn.drawio.svg` đạt lint | Có (PH, sơ đồ) / Không | Chặn |
| 39 | Đối chiếu hai chiều: mỗi UC presales thuộc ít nhất một QT hoặc ở mục 6.1 (`chưa rõ` có Q); mỗi QT không UC ở mục 6.2 có Q | Có | Chặn |
| 40 | Chuyển giao ở mục 3, hệ thống ngoài ở mục 4 trỏ QT có thật | Có | Nên sửa |
| 41 | Sơ đồ BPMN cấp 1 (và cấp 0 khi hơn khoảng 8 QT) theo skill ba-bpmn; `bpmn_lint` không còn lỗi Chặn merge | Có | Chặn |
| 42 | Bản đồ không có bảng bước, gateway; không sửa, gộp, bỏ UC presales | Không | Chặn |
