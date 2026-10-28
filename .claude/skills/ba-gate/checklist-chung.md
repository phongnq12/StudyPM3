# Checklist chung — áp cho mọi gate (G0, G1, G2)

Chấm cùng `checklist-Gx.md` của gate đang chạy, trên các file trong phạm vi gate
(`node kit/tools/ba-verify/gate-check.mjs --pham-vi Gx [--chuc-nang CN-xx]`). Mã dòng trong hồ sơ: `chung-<số>`.
Còn một dòng mức "Chặn" chưa đạt → gate KHÔNG ĐẠT.
Căn cứ chuẩn: ISO/IEC 20246:2017 (tiêu chí vào: dòng 11, 12; review riêng từng người: 13; vấn đề có vị trí, bằng
chứng, phân loại mức: 14; tiêu chí ra: 15, 16; hồ sơ: 17) và ISO/IEC/IEEE 29148:2018 mục 5.2 (đặc tính yêu cầu, xem
kit/standards/requirement-quality.md). Cột "Ai kiểm": "Máy" là `gate-check.mjs --may` (gồm check-all);
"Phiên chính" là phiên điều phối gate (skill ba-gate) tự kiểm trước khi ghi kết luận.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Yêu cầu, rule, quyết định có nguồn `[SRC: …]` hoặc căn cứ theo `00_quy_uoc_chung.md` mục 9; không có nguồn thì có `[ASM-xxx]` (tầng chức năng) hoặc `GD-xxxx` (business layer) và dòng trong sổ tương ứng (CLAUDE.md luật 1) | Agent chất lượng | Chặn |
| 2 | Không tự điền con số nghiệp vụ (tiền, ngày, thời hạn, tỷ lệ, hạn mức): có nguồn hoặc ghi `[CẦN XÁC NHẬN]` (luật 2) | Agent chất lượng, pháp lý | Chặn |
| 3 | Đúng template: đủ heading, đúng thứ tự, không đổi tên heading; ID đúng kit/standards/id-convention.md và dải của CN (luật 3) | Agent chất lượng | Nên sửa |
| 4 | Chỉ sửa tài liệu của tầng, chức năng mình; file tầng dự án chỉ thêm dòng, không sửa dòng của chức năng khác (luật 4) | Agent nhất quán | Chặn |
| 5 | ID mới, đổi trạng thái có trong trace.csv của tầng (luật 6) | Máy | Chặn |
| 6 | Mâu thuẫn giữa các nguồn không tự chọn: có Q ghi đủ phương án kèm nguồn (luật 7) | Agent nhất quán, pháp lý | Chặn |
| 7 | Thuật ngữ đúng `du-an/glossary.md`; sơ đồ theo kit/standards/notation.md, quy trình theo skill ba-bpmn (luật 8) | Máy, agent chất lượng | Nên sửa |
| 8 | Không có mật khẩu, token, dữ liệu cá nhân thật (luật 9) | Agent chất lượng | Chặn |
| 9 | Không sửa, xóa tệp trong `0-inputs/` (trừ `0-inputs/answers-*.md`) (luật 10) | Máy | Chặn |
| 10 | Q còn `mở` có cột "Chặn gate" là gate này: không còn (kit/standards/gate-procedure.md mục 5) | Máy | Chặn |
| 11 | Gate trước còn hiệu lực (G0 với G1; G1 với G2) | Máy | Chặn |
| 12 | Commit đã kiểm là commit reviewer đã đọc; phạm vi không đổi từ commit đó tới lúc ghi hồ sơ | Máy | Chặn |
| 13 | Mỗi chế độ review là một phiên riêng, khác phiên viết và phiên sửa; người sửa là phiên mới | Phiên chính | Chặn |
| 14 | Mỗi lỗi mức Chặn có vị trí (file:dòng) và bằng chứng; lỗi không có bằng chứng không tính Chặn | Phiên chính | Chặn |
| 15 | Mọi dòng của checklist-Gx và checklist này có kết quả ở hồ sơ mục 7 (Đạt / Không đạt / Không áp dụng kèm lý do) | Phiên chính | Chặn |
| 16 | Không quá 2 vòng sửa; hết vòng còn Chặn → KHÔNG ĐẠT, chuyển BA | Phiên chính | Chặn |
| 17 | Hồ sơ gate đủ các mục của kit/templates/ho-so/gate.md, bảng đầu đúng cột; `gate-check.mjs` đọc được | Máy | Chặn |
| 18 | Ba giá trị đặc biệt dùng đúng (skill create-uc mục "Ba giá trị đặc biệt"): `n/a` chỉ cho thứ chắc chắn không có; chưa biết ghi `chưa chốt (<ai>)`; chưa có nguồn ghi `[CẦN BA CHỐT] <phát biểu>` (chỉ AI ghi); con số chưa có nguồn ghi `[CẦN XÁC NHẬN]` | Agent chất lượng | Chặn |
| 19 | Mã dẫn trong văn bản kèm tên ngắn; không ô trống mang nghĩa mơ hồ, không "như trên" | Agent chất lượng | Nên sửa |
