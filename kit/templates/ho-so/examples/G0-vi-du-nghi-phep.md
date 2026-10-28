# G0 — du-an Nghỉ phép (hư cấu)

| Gate | Tầng | Kết luận | Commit đã kiểm | Ngày | Vòng sửa | Lỗi Chặn còn |
| --- | --- | --- | --- | --- | --- | --- |
| G0 | du-an | KHÔNG ĐẠT | 7274df8 | 2026-10-26 | 0 | 3 |

> Ví dụ lấy từ lần chạy thử cơ chế gate (2026-10-26) trên kết quả bước 1 của dự án hư cấu
> `kit/tools/ba-verify/tests/fixture-init/`, có cài sẵn 3 lỗi máy không bắt được. Bước 2 chưa có nên các dòng G0 cần
> overview ghi "Không áp dụng". Chưa chạy vòng sửa. Lỗi #4 không cài, reviewer tự tìm ra.

## 1. Phạm vi và commit đã kiểm
| Mục | Giá trị |
| --- | --- |
| Bước trong phạm vi | 1 (danh mục đầu vào); bước 2 chưa có |
| Nhánh | du-an/khung |
| Checklist | `checklist-G0.md`, `checklist-chung.md`, `.claude/skills/ba-init/checklist.md` |
| Số file trong phạm vi | 6: `1-ba-init/0-dau-vao/` (man-presales.json, man-presales.md, phap-ly.md, so-phat-hien.md, uc-presales.md), `du-an/glossary.md` |

## 2. Kết quả cổng máy
| Lần | Commit | LỖI | CẢNH BÁO | Xử lý |
| --- | --- | --- | --- | --- |
| 1 | 7274df8 | 0 | 1 | Đạt. Cảnh báo: dòng "Máy" chưa có script G0-1…6, 8…10, 16, 17 (đều cần bước 2) |

Lỗi máy còn lại: không có. Ba lỗi cài sẵn đều qua được cổng máy (đúng loại lỗi cần reviewer).

## 3. Báo cáo reviewer
| Chế độ | Vòng | Phiên (agent) | Chặn | Nên sửa | Gợi ý | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| chất lượng | 1 | quality-reviewer | 2 | 1 | 4 | Bắt cả 3 lỗi cài |
| nhất quán | 1 | quality-reviewer | 2 | 2 | 5 | Bắt cả 3 lỗi cài |
| pháp lý | 1 | quality-reviewer | 1 | 3 | 3 | Đối chiếu 1/1 mã điều khoản với văn bản gốc |
| presales | 1 | quality-reviewer | 2 | 2 | 1 | Tìm thêm lỗi #4 |

## 4. Lỗi theo mức và xử lý
| # | Mức | Checklist | Vị trí | Lỗi | Reviewer | Xử lý |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Chặn | init-14, chung-2, G0-13 | 1-ba-init/0-dau-vao/phap-ly.md:14 | Tóm tắt Điều 5 tự điền "3 ngày làm việc"; văn bản gốc: "trong thời hạn quy định" | chất lượng; pháp lý; nhất quán; presales (Gợi ý) | Còn |
| 2 | Chặn | init-4 | 1-ba-init/0-dau-vao/uc-presales.md:16 | Mô tả luồng UC `3` chèn lời đánh giá "(thiếu lọc theo trạng thái, nên bổ sung)"; gốc: "Tìm đơn theo ngày" | chất lượng; presales; nhất quán; pháp lý (Gợi ý) | Còn |
| 3 | Chặn | G0-14 | 1-ba-init/0-dau-vao/so-phat-hien.md:5 | UC `2` có hành động "duyệt" nhưng prototype không có nút, màn Duyệt; sổ phát hiện chưa ghi | presales; nhất quán (Gợi ý) | Còn |
| 4 | Nên sửa | init-10 | 1-ba-init/0-dau-vao/man-presales.md:10 | MP-002 "Từ chối đơn" gắn UC `3` (Tra cứu); khớp UC `2` (duyệt hoặc từ chối) | chất lượng; nhất quán; pháp lý; presales | Còn |
| 5 | Nên sửa | init-10 | 1-ba-init/0-dau-vao/man-presales.md:9 | MP-001 có nút "Từ chối" nhưng chỉ gắn `3` | nhất quán | Còn |
| 6 | Nên sửa | init-13 | 1-ba-init/0-dau-vao/phap-ly.md:14 | Điều 5 có cả thẩm quyền và thời hạn, chỉ ghi loại "thời hạn" | pháp lý; chất lượng (Gợi ý) | Còn |
| 7 | Nên sửa | init-11 | 1-ba-init/0-dau-vao/phap-ly.md:9 | Cơ quan ban hành, hiệu lực "còn" không có trong tệp gốc mà vẫn dẫn nguồn | pháp lý; nhất quán (Gợi ý) | Còn |
| 8 | Nên sửa | init-17 | du-an/glossary.md:4 | Thiếu "Trưởng phòng" (chủ thể thẩm quyền ở Điều 5, actor UC `2`) | pháp lý; nhất quán (Gợi ý) | Còn |
| 9 | Nên sửa | G0-14 | 1-ba-init/0-dau-vao/so-phat-hien.md:5 | Tab "Tệp đính kèm" ngoài mô tả UC `1`, chưa có PH loại `trường thừa` | presales | Còn |
| 10 | Gợi ý | init-5 | 1-ba-init/0-dau-vao/uc-presales.md:14-16 | Cột Phân hệ chỉ ghi "A", nên ghi kèm tên | chất lượng; pháp lý; presales; nhất quán | Còn |
| 11 | Gợi ý | chung-3 | du-an/trace.csv:2-6 | Cột `ten` của MP là "Màn presales n", nên dùng tiêu đề màn | chất lượng; nhất quán | Còn |

Gộp: lỗi #1, #2 có reviewer ghi "Gợi ý" vì ngoài chế độ, lấy mức cao hơn là Chặn. Sau lần thử này agent được sửa: lỗi
ngoài chế độ vẫn ghi đúng mức.

## 5. Vòng sửa
| Vòng | Agent sửa (phiên mới) | Số lỗi giao | Đã sửa | Không sửa | Cần BA | Commit sau sửa |
| --- | --- | --- | --- | --- | --- | --- |

Chưa chạy (lần thử chỉ kiểm phần review). Lần thật: #1, #2, #6, #7 → business-analyst; #4, #5 → ux-spec-designer;
#3, #8, #9, #11 → phiên chính (sổ phát hiện, glossary, trace).

## 6. Câu hỏi cho BA
| Q | Câu hỏi | Chặn gate | Vì sao agent không tự quyết |
| --- | --- | --- | --- |
| (đề xuất) | Thời hạn duyệt đơn nghỉ phép là bao lâu, quy định ở văn bản nào? Có bổ sung văn bản đó vào `0-inputs/phap-ly/` không? | G4 | Con số không có trong nguồn (gate-procedure mục 5: chỉ chặn G4) |
| (đề xuất) | Nút "Từ chối" trên màn danh sách của Nhân viên: màn dùng chung hai vai hay lỗi prototype? | — | Phải hiểu ý khách |

## 7. Kết luận
**KHÔNG ĐẠT** — còn 3 lỗi Chặn (#1, #2, #3).

| # | Kiểm (checklist) | Mức | Kết quả | Bằng chứng, lỗi liên quan |
| --- | --- | --- | --- | --- |
| G0-1…G0-12, G0-15…G0-17 | (cần đầu ra bước 2) | Chặn / Nên sửa | Không áp dụng — chưa có bước 2 | |
| G0-13 | Mỗi điều khoản được dẫn đúng nội dung | Chặn | Không đạt | #1 |
| G0-14 | Phát hiện so với presales ghi đủ | Chặn | Không đạt | #3, #9 |
| G0-18 | Không còn Q `mở` chặn G0 | Chặn | Đạt | Máy: Q-001 chặn G4 |
| G0-19 | Thuật ngữ đúng glossary | Nên sửa | Đạt | Máy |
| init-4 | Mô tả luồng, actor chép nguyên văn | Chặn | Không đạt | #2 |
| init-10 | Màn gắn UC có căn cứ | Nên sửa | Không đạt | #4, #5 |
| init-14 | Tóm tắt giữ nguyên con số như văn bản | Chặn | Không đạt | #1 |
| init-1…3, 6…9, 12, 15, 16, 18…23 | (xem checklist bước 1) | | Đạt | Máy và reviewer |
| chung-2 | Không tự điền con số | Chặn | Không đạt | #1 |
| chung-1, 3…17 | (xem checklist chung) | | Đạt | |

## 8. Chi phí
| Phiên | Số phiên | Token (nếu biết) | Thời gian |
| --- | --- | --- | --- |
| Reviewer | 4 (song song) | ~205 nghìn (44k, 57k, 48k, 55k) | ~1,5 phút |
| Sửa | 0 | — | — |
| Tổng | 4 | ~205 nghìn | ~1,5 phút |
