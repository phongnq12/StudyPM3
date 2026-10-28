# Checklist sơ đồ BPMN

Cột "Lint" là mã kiểm tra tự động của `scripts/bpmn_lint.py`; dòng không có mã thì reviewer kiểm bằng mắt.

| # | Kiểm tra | Lint | Mức khi vi phạm |
| --- | --- | --- | --- |
| 1 | Quy trình vẽ BPMN 2.0 bằng draw.io (`.drawio.svg` nhúng XML); không có Mermaid flowchart hay ô và mũi tên | check-all | Chặn merge |
| 2 | `bpmn_lint` không còn lỗi Chặn merge | — | Chặn merge |
| 3 | Mỗi pool có sự kiện bắt đầu và kết thúc (trang tiếp nối: link event bắt / ném thay thế); không phần tử nào treo (thiếu đầu vào hoặc đầu ra) | B01–B03 | Chặn merge |
| 4 | Sequence flow nằm trong một pool; message flow chỉ giữa hai pool, không nối gateway | B04, B05, B13 | Chặn merge |
| 5 | Gateway XOR / OR tách nhánh: mọi nhánh ra có nhãn điều kiện (trừ nhánh mặc định) | B06 | Chặn merge |
| 6 | Cấp 2: tập ID task trên sơ đồ trùng tập ID bảng bước | B11 | Chặn merge |
| 7 | Cấp 2: mỗi dòng chuyển giao mục 6 là một message flow giữa đúng bước và pool PROC kia | — | Chặn merge |
| 8 | Cấp 2 khớp cấp 1: sự kiện bắt đầu là trigger; các sự kiện kết thúc của cấp 2 gộp lại đúng cột Kết quả của PROC ở process-overview.md | — | Chặn merge |
| 9 | Loại task đúng ai làm, làm ở đâu (user, manual, service, send, receive, businessRule); cấp 2 không còn task abstract | — | Nên sửa |
| 10 | Task tên động từ + danh từ glossary; sự kiện là trạng thái; gateway tách có câu hỏi kết thúc bằng "?"; mỗi kết quả khác nhau một sự kiện kết thúc tên khác nhau | B06, B08 | Nên sửa |
| 11 | Lane là vai trò theo actors.md; mọi phần tử nằm trong lane | B10 | Nên sửa |
| 12 | Mỗi dòng bảng nhánh ngoại lệ có trên sơ đồ (sự kiện biên hoặc nhánh gateway) | — | Nên sửa |
| 13 | Rẽ nhánh qua gateway, không qua nhiều luồng có điều kiện từ task; không gateway vừa gộp vừa tách | B07, B12 | Nên sửa |
| 14 | Cấp 0, cấp 1: PROC là sub-process thu gọn; bên ngoài là pool thu gọn; link event có cặp ném và bắt; dự án hơn khoảng 8 PROC có trang cấp 0 luồng chính | B09, B16 | Nên sửa |
| 15 | AND tách có AND gộp trước bước cần chờ đủ | — | Gợi ý |
| 16 | Bố cục trái sang phải, luồng chính thẳng, ngoại lệ ở dưới, không chữ đè (đã xem PNG) | — | Gợi ý |
| 17 | Không quá khoảng 30 phần tử luồng mỗi pool; quá thì tách sub-process | B15 | Gợi ý |
| 18 | Đặc tả `.bpmn.json` lưu cạnh sơ đồ và khớp sơ đồ, hoặc đã xóa khi BA sửa tay | — | Gợi ý |
