# Checklist G0 — Gate tầng dự án

Phạm vi: bước 1 `/ba-init` (danh mục đầu vào, bản đồ quy trình QT-nn đã chốt) và bước 2 `/ba-overview` (sáu lớp
business layer, lượt điền ngược, danh mục chức năng).
Reviewer (quality-reviewer, mỗi phiên một chế độ): chất lượng, nhất quán, pháp lý, presales. Cột "Ai kiểm" cho biết
dòng nào máy kiểm (`gate-check.mjs --may G0`, gồm check-all), dòng nào reviewer nào chấm. Còn một dòng mức "Chặn" chưa
đạt → gate KHÔNG ĐẠT (kit/standards/gate-procedure.md mục 3).
Chấm cùng `checklist-chung.md` (mã `chung-<số>`) và checklist bước: `.claude/skills/ba-init/checklist.md` (mã
`init-<số>`); mục "Soát trước khi đóng" của sáu skill lớp `create-brd`, `create-bp`, `create-erd`, `create-sm`,
`create-ucl`, `create-br` (mã `brd-soat`, `bp-soat`, `erd-soat`, `sm-soat`, `ucl-soat`, `br-soat` kèm câu đầu của ô);
cổng ra từng lớp ở `.claude/skills/ba-overview/SKILL.md` mục "Cổng vào, cổng ra"; reviewer chấm lại dòng Chặn máy chưa
kiểm (skill ba-gate, "Đọc trước"). Mã dòng trong hồ sơ: `G0-<số>`. Quy trình chạy: skill ba-gate.
Nguồn: kit/thiet-ke/thiet-ke-kit.md bảng G0 (19 dòng), đổi theo đầu ra kit v3: PROC → QT-nn, tám phần overview → sáu lớp
theo template `2-ba-overview/templates/` (bộ sdlc v3), danh mục chức năng theo module WBS.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Cổng máy bước 1 đạt: `dau-vao-check` không LỖI (UC presales, màn presales, pháp lý, ma trận UC × điều khoản, bản đồ quy trình, sổ câu hỏi, trace.csv) | Máy | Chặn |
| 2 | Bản đồ quy trình đã chốt: mã QT-nn hợp lệ; mỗi UC presales thuộc ít nhất một QT hoặc ở bản đồ mục 6.1 (`chưa rõ` có Q); QT không UC có Q | Máy | Chặn |
| 3 | Mỗi điều khoản loại thủ tục, thời hạn, thẩm quyền gắn UC presales (qua đó tới QT) hoặc có lý do ở `uc-phap-ly.md` mục 3 | Máy, agent pháp lý | Chặn |
| 4 | Mỗi MP gắn UC presales có thật, hoặc có PH | Máy | Chặn |
| 5 | Sơ đồ BPMN hợp lệ: bản đồ cấp 0, 1, `cap-2/` (bước 1); mỗi QT của bản đồ có `QT_<MA>_<PV>_<QT-nn>.drawio.svg` ở lớp 2, đạt `bpmn_lint` | Máy | Chặn |
| 6 | Lớp 2 giữ đúng danh sách QT-nn, trigger, kết quả, UC presales của bản đồ đã chốt (không thêm, tách, gộp QT); chuyển giao giữa các QT khớp hai đầu | Agent nhất quán | Chặn |
| 7 | Mỗi QT có trigger, kết quả, tác nhân, căn cứ; bảng bước một tác nhân một việc, khớp số bước trên sơ đồ; bảng bước có BA chốt (Version control ghi **BA chốt dd/mm/yyyy**) | Agent chất lượng | Chặn |
| 8 | BRD: mọi `OBJ` đo được (KPI, hiện tại, mục tiêu, thời hạn); mọi `BRQ` có đúng một `OBJ`, căn cứ, tiêu chí chấp nhận kiểm chứng được; `OBJ`, `BRQ` đạt 29148 | Agent chất lượng | Chặn |
| 9 | ERD: mọi chứng từ, danh mục, sổ trong QT có thực thể hoặc lý do không lưu; không hai thực thể cùng nghĩa; mọi trường trạng thái có enum | Agent nhất quán | Chặn |
| 10 | Máy trạng thái: mọi `trang_thai` có máy hoặc ở dòng "Không có máy trạng thái"; mã trạng thái khớp enum ERD; `SM mục n` dẫn có thật | Máy, agent nhất quán | Chặn |
| 11 | UCL: mã UC là mã WBS ở cột `No` (không tiền tố `UC-`); mỗi dòng tính năng một UC theo hạt create-uc; mọi dòng có `Permission key`; quy tắc 100% (UCL mục 6) đạt hoặc liệt kê đủ chỗ thiếu | Agent nhất quán | Chặn |
| 12 | Mọi tác nhân gốc presales gắn được `ACT-nn`; thẩm quyền dẫn luật | Agent pháp lý | Chặn |
| 13 | BR: mọi ứng viên từ lớp 1–5 (điều khoản, điểm kiểm soát, `GS-xx`, điều kiện chuyển trạng thái) đã thành `BR-{nhóm}{nn}` hoặc có lý do loại; mỗi BR có loại ĐN/HV, mức cưỡng chế, cột `Áp tại` | Agent nhất quán | Chặn |
| 14 | Lượt điền ngược xong: mọi chỗ ở lớp 1–5 dẫn điều khoản đã có BR mang mã BR kèm tên ngắn, giữ điều khoản; BR còn ❓ chưa điền; Version control tài liệu bị điền đã ghi | Agent nhất quán | Chặn |
| 15 | Danh mục chức năng: mỗi CN đúng một module WBS; mỗi UC của UCL thuộc đúng một CN; không CN rỗng | Máy | Chặn |
| 16 | Danh mục chức năng: phụ thuộc CN không vòng; thứ tự làm sau CN phụ thuộc; dải ID có, từ 101, không chồng nhau; mỗi QT ghi CN chạm tới, khớp hai đầu với cột "QT liên quan" | Máy | Chặn |
| 17 | CN quá lớn (trên 30 UC) | Máy | Cảnh báo |
| 18 | Mọi tài liệu sáu lớp ở trạng thái `Chờ review` hoặc `Đã duyệt`; không còn `[CẦN BA CHỐT]`; `kiem_business_layer.py` không còn lỗi Chặn | Máy | Chặn |
| 19 | Giả định `GD-xxxx` được dẫn có dòng trong `2-ba-overview/assumption_log.md`, nội dung chỗ dẫn khớp dòng sổ, có người chốt; mã đứng trên GD mang theo GD (`00_quy_uoc_chung.md` mục 9) | Máy, agent chất lượng | Chặn |
| 20 | Mỗi UC presales thuộc đúng một CN (UCL cột `Mã UC gốc` → module → `danh-muc-chuc-nang.md`), hoặc có lý do (ngoài phạm vi, trùng, gộp); phát hiện so với presales ghi đủ (PH) | Agent presales | Chặn |
| 21 | Mỗi điều khoản được dẫn ở lớp 1–6 đúng nội dung văn bản gốc; BR dẫn đúng điều khoản; không sót nghĩa vụ loại thủ tục, thời hạn, thẩm quyền | Agent pháp lý | Chặn |
| 22 | Không còn Q `mở` chặn G0 | Máy | Chặn |
| 23 | Thuật ngữ đúng glossary | Máy | Nên sửa |
| 24 | Cách chia CN và thứ tự làm có BA chốt (Version control của danh mục ghi **BA chốt dd/mm/yyyy**) | Agent nhất quán | Chặn |
