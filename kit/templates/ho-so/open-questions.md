# Câu hỏi mở và quyết định — <tầng: dự án / CN-xx>

Một sổ cho ba loại mục: câu hỏi (mục 1), giả định (mục 2), phát hiện (mục 3). Câu hỏi đi trọn vòng đời trên một dòng:
mở → đã quyết (hoặc bỏ). Dòng `đã quyết` là sổ quyết định của dự án; agent đọc để không hỏi lại. File của dự án:
`1-ba-init/open-questions.md` (bước 1) và `du-an/open-questions.md` (từ bước 2; mã đánh số tiếp nối sổ bước 1); của
chức năng: `chuc-nang/CN-xx/open-questions.md`.

**Căn cứ chuẩn:** ISO/IEC/IEEE 29148:2018 mục 5.2 (giả định là thuộc tính phải ghi rõ, theo dõi); BABOK v3 mục 10.26 "Item Tracking" (câu hỏi đi trọn vòng đời: mở, phân công, quyết định, nguồn).

## 1. Câu hỏi
| Q | Câu hỏi | Phương án | Liên quan (ID) | Hỏi ai | Chặn gate | Ngày mở | Trạng thái | Quyết định | Người quyết, ngày | Nguồn quyết định | Mức rủi ro | Phương án tạm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Q-001 | | A: … [SRC: …] / B: … [SRC: …] | | BA / PM / khách / <vai trò> | G0 / G1 / G2 / G3 / G4 / — | YYYY-MM-DD | mở | | | | cao / trung bình / thấp | A / B / ASM-xxx / dừng — chặn <gate> |

- Phương án: bắt buộc với mâu thuẫn nguồn, ghi đủ mọi phương án kèm nguồn; giữ nguyên cả sau khi đã quyết.
- Chặn gate: theo kit/standards/gate-procedure.md mục 5. Mâu thuẫn nguồn → gate của bước đang làm (tầng dự án: G0);
  con số → G4; quyết định Bỏ UC presales → G2; UC presales chưa tìm thấy căn cứ pháp lý (uc-phap-ly.md mục 2) → G1;
  câu hỏi phạm vi → "—".
- Trạng thái: `mở` / `đã quyết` / `bỏ`.
- Người quyết: "BA" (BA xác nhận, chưa có xác nhận của khách) hoặc vai trò phía khách. Quyết định của BA được liệt kê
  lại ở SRS và mô tả PR để BA lead chấp nhận.
- Nguồn quyết định: `0-inputs/answers-<ngày>.md, RQ-xx` hoặc tài liệu của khách trong `0-inputs/`.
- Mức rủi ro (bắt buộc với Q `mở`): hậu quả nếu đoán sai. `cao` — sai luồng, dữ liệu, pháp lý hoặc phạm vi;
  `trung bình` — sai một rule, một màn; `thấp` — câu chữ, hiển thị. Q đã quyết giữ nguyên giá trị để tính chỉ số.
- Phương án tạm (bắt buộc với Q `mở`): đang làm theo phương án nào trong lúc chờ — `A` / `B` (theo cột Phương án),
  `ASM-xxx` (giả định đặt cho câu này), hoặc `dừng — chặn <gate>` khi không được làm tạm (mâu thuẫn nguồn, Bỏ UC
  presales). Không đoán im lặng: phương án tạm luôn ghi ra để người đọc biết tài liệu đang dựa vào đâu.
- Đúng: "Q-104 | … | A: 03 ngày làm việc [SRC: …] / B: 05 ngày làm việc [SRC: …] | … | mở | … | cao | A".
- Sai: "Q-104 | … | mở | … | | " (thiếu mức rủi ro, không biết tài liệu đang theo phương án nào).

## 2. Giả định
| ASM | Nội dung | Ở đâu | Q liên quan | Ngày | Trạng thái | Nguồn xác nhận | Mức rủi ro |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ASM-001 | | <file, mục> | Q-xxx | YYYY-MM-DD | mở | | cao / trung bình / thấp |

- Trạng thái: `mở` / `đã xác nhận` / `sai` (giả định bị bác: tài liệu đã làm theo phải sửa; đếm cho chỉ số "tồn đọng
  hóa ra sai") / `bỏ` (không còn cần, không phải vì sai).
- Mức rủi ro: như cột cùng tên ở mục 1.
- ASM chuyển `sai` → mọi chỗ dẫn ASM đó phải sửa theo quyết định thật; layer đã qua gate thì gate mất hiệu lực.

## 3. Phát hiện
Khoảng trống, chỗ lệch, chỗ thừa thấy được khi đối chiếu presales (UC, quy trình, màn) với văn bản pháp luật. Khác câu
hỏi: phát hiện không chờ ai trả lời, bước sau tự đóng (bằng UC, BR, SCR…); cần người quyết thì mở thêm Q và ghi ở cột
"Q liên quan". Chỉ **thêm** dòng, không sửa nội dung, không xóa dòng cũ; chỉ đổi cột Trạng thái, Đóng ở.

**Căn cứ chuẩn:** BABOK v3 mục 6.4 "Define Change Strategy" (phân tích khoảng trống), 10.26 "Item Tracking" (mỗi mục có nguồn, người xử lý, trạng thái tới khi đóng).

| PH | Đối tượng | Bước | Chức năng | Phát hiện | Loại | Nguồn | Đề xuất | Q liên quan | Trạng thái | Đóng ở |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PH-001 | `<mã gốc>` / MP-xxx / QP-xx.yy / `<mã điều khoản>` | 1 | | | | [SRC: …] | | — | mở | |

- Đối tượng: mã gốc UC presales, mã màn, mã bước quy trình presales, mã điều khoản, hoặc ID kit.
- Bước: số bước của kit (1–12).
- Loại: `thiếu luồng` / `thiếu rule` / `thiếu actor` / `thiếu dữ liệu` / `thiếu trạng thái` / `thiếu màn` /
  `màn không thuộc UC` / `UC không thuộc quy trình` / `điều khoản chưa có UC` / `trường thừa` / `trùng lặp` /
  `khác luật` / `ngoài phạm vi` / `trình tự khác luồng màn`.
- Q liên quan: Q-xxx khi phát hiện cần người quyết; không cần → "—".
- Trạng thái: `mở` / `đóng`. Đóng ở: UC-xxx, BR-xxx, SCR-xxx hoặc Q-xxx. Bước 8 (use case) của từng chức năng đóng
  dòng thuộc chức năng đó. Dòng phát hiện sau khi chức năng đã merge: ghi kèm gợi ý `/ba-cr`.
