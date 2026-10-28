# Checklist G1 — Use case chi tiết của chức năng

Phạm vi: đợt 1 `/ba-detail CN-xx`: UC chi tiết của mọi UC trong module WBS của CN, ở
`3-ba-detail/use-case/CN-xx-<slug>/`, cùng `chuc-nang/CN-xx/` (trừ sổ, trace, hồ sơ gate).
Reviewer (quality-reviewer, mỗi phiên một chế độ, chạy theo đợt — skill ba-gate "Reviewer mỗi gate"): chất lượng, nhất
quán, pháp lý, presales, qc, ngoại lệ. Cột "Ai kiểm" cho biết dòng nào máy kiểm, dòng nào reviewer nào chấm. Còn một
dòng mức "Chặn" chưa đạt → gate KHÔNG ĐẠT (kit/standards/gate-procedure.md mục 3).
Chấm cùng `checklist-chung.md` (mã `chung-<số>`) và checklist bước `.claude/skills/ba-detail/checklist-uc.md` (mã
`uc-<số>`); mục "Soát trước khi đóng một UC" của skill create-uc; reviewer chấm lại dòng Chặn máy chưa kiểm (skill
ba-gate, "Đọc trước"). Mã dòng trong hồ sơ: `G1-<số>`. Quy trình chạy: skill ba-gate.
Nguồn: kit/thiet-ke/thiet-ke-kit.md bảng G2 (dòng use case), đổi theo kit v3: UC chi tiết dựng sau business layer đã qua G0.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Cổng máy `check-all --chuc-nang CN-xx` đạt | Máy | Chặn |
| 2 | G0 còn hiệu lực (hồ sơ `du-an/G0.md` ĐẠT) | Máy | Chặn |
| 3 | Mọi UC của module (UCL, theo Module WBS của CN ở `danh-muc-chuc-nang.md`) có đúng một file `<mã UC WBS>-<slug>.md` theo TEMPLATE_UC; trường `id` đúng mã | Máy | Chặn |
| 4 | Không UC ngoài module; không UC mới không có dòng ở UCL | Máy, agent nhất quán | Chặn |
| 5 | Mỗi file giữ đủ mục của TEMPLATE_UC, đã xóa khối hướng dẫn; mục "Soát trước khi đóng một UC" của create-uc đạt | Agent chất lượng | Chặn |
| 6 | Mỗi bước kiểm, quyết, ghi, gửi có sở cứ theo bốn bước của create-uc (business layer → tài liệu khách → `GD-xxxx`/ASM → `[CẦN BA CHỐT]`); sở cứ mở ra nói đúng điều UC gán cho nó | Agent chất lượng | Chặn |
| 7 | Luồng chính khớp thứ tự bước của QT (lớp 2) mà UC phủ; tác nhân khớp UCD, UCL | Agent nhất quán | Chặn |
| 8 | Thực thể, trường, enum dẫn đúng ERD; tiền, hậu điều kiện và chuyển trạng thái khớp SM | Agent nhất quán | Chặn |
| 9 | Quy tắc dẫn đúng BR (mã kèm tên ngắn); con số kèm biên hoặc `[CẦN XÁC NHẬN]` | Agent nhất quán | Chặn |
| 10 | `Permission key` của UC khớp UCL; tiền điều kiện về quyền khớp ma trận tác nhân × UC | Agent nhất quán | Chặn |
| 11 | Chín câu soát nhánh (create-uc `reference/chin-cau-soat.md`) đều có trả lời: nhánh, `theo quy tắc chung <mã>`, hoặc `không áp dụng (lý do)`; ngoại lệ ghi dữ liệu đã nhập, bản ghi | Agent ngoại lệ | Chặn |
| 12 | Mỗi tiêu chí nghiệm thu, mỗi nhánh viết được ca kiểm thử đúng sai rõ ràng; con số có biên | Agent qc | Chặn |
| 13 | UC presales của module có UC chi tiết phủ hoặc lý do; ý UC khớp tên, mô tả luồng, màn presales | Agent presales | Chặn |
| 14 | Thẩm quyền, thời hạn, trình tự trong UC đúng điều khoản được dẫn (mở văn bản gốc) | Agent pháp lý | Chặn |
| 15 | Phát hiện (PH) của CN còn `mở` đều có Q | Máy | Chặn |
| 16 | Không còn Q `mở` chặn G1 | Máy | Chặn |
| 17 | Thuật ngữ đúng glossary | Máy | Nên sửa |
| 18 | Reviewer độc lập của create-uc đã chạy cho mọi UC; phát hiện đã sửa hoặc có lý do (nhật ký điều phối `du-an/reports/dieu-phoi/`) | Agent chất lượng | Chặn |
| 19 | Mọi UC ở `trang_thai` `cho-duyet` hoặc `da-chot`; không còn `[CẦN BA CHỐT]` | Máy | Chặn |
| 20 | Không tạo nghiệp vụ mới ngoài business layer đã qua G0 (trường, kiểm tra, trạng thái, quyền, UC); chỗ hổng ở lớp 1–6 có Q, không sửa lớp | Agent nhất quán | Chặn |
