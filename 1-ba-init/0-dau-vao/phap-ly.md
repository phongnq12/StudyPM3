# Danh mục pháp lý — Quản lý kho căng tin
| Số văn bản | Số điều khoản | Cập nhật | Trạng thái |
| --- | --- | --- | --- |
| 4 văn bản (18 tệp: 4 tệp văn bản chính, 14 tệp phụ lục, biểu mẫu) | 15 | 2026-10-28 | draft |

**File này dùng để làm gì.** Liệt kê các văn bản pháp luật và văn bản nghiệp vụ áp dụng cho dự án, rồi tách thành
từng điều khoản có ảnh hưởng tới nghiệp vụ của phần mềm: ai phải làm gì, với cái gì, trong bao lâu, theo mẫu nào. Đây
là mốc pháp lý của dự án: quy trình, business rule, trường dữ liệu bắt buộc sau này phải dẫn được về một điều khoản ở
đây (`PL:<mã điều khoản>`), không dẫn được thì ghi là giả định.
- Chỉ lấy điều khoản **chi phối nghiệp vụ** (thủ tục, thời hạn, thẩm quyền, biểu mẫu, điều kiện, đối tượng, chế tài);
  điều khoản chung (giải thích từ ngữ, hiệu lực thi hành…) không lấy, trừ khi chi phối nghiệp vụ.
- Mỗi điều khoản tách tới đơn vị nhỏ nhất có **một ý** (điều → khoản → điểm).
- Tóm tắt giữ nguyên con số theo văn bản, không diễn giải, không tính toán thêm.

**Lấy dữ liệu từ:**
- `0-inputs/phap-ly/`: bản text của Luật, Nghị định, Quyết định, Thông tư (danh sách và phạm vi từng văn bản: mục 0).
- `0-inputs/khac/`: văn bản nghiệp vụ có quy định trình tự làm việc (dự án này không có).
- `0-inputs/answers-2026-10-28.md`: câu trả lời của BA (bối cảnh phạm vi: bán hàng căng tin ngoài phạm vi, RQ-03).
- `0-inputs/answers-2026-10-29.md`: câu trả lời của BA (văn bản áp dụng RQ-48; phạm vi hàng hóa RQ-49; chi phí hợp lý RQ-53).
- `2-ba-overview/assumption_log.md`: giả định do BA chấp nhận (<span style="color:red">**<u>GD-0001</u>**</span>).
- `1-ba-init/open-questions.md`: các mã `[Q-xxx]` (câu hỏi), `[ASM-xxx]` (giả định) dẫn trong file.

**Được dùng ở:**
- `uc-phap-ly.md` (bước 1): ghép từng điều khoản với UC presales, để biết UC nào có căn cứ pháp lý, điều khoản nào
  chưa có UC thực hiện.
- Bước 2 /ba-overview: dựng quy trình (điều khoản thủ tục, thẩm quyền, thời hạn thành bước, làn, mốc thời gian),
  danh mục chức năng (cột Điều khoản); bước 5 quy trình chi tiết; bước 9 business rule (cột "Hướng BR").
- Bước 6 ERD: mục 3 "Biểu mẫu" để đối chiếu các trường bắt buộc theo luật.
- `brief.md` của từng chức năng: các điều khoản chi phối chức năng, tóm tắt chép từ đây.
- Tài liệu khác dẫn điều khoản bằng `PL:<mã điều khoản>`.

**Tóm tắt.** Thư mục `0-inputs/phap-ly/` có 4 văn bản trong 18 tệp: Luật Phòng, chống ma túy 120/2025/QH15; Nghị định
163/2026/NĐ-CP (tệp chính và 6 tệp danh mục, phụ lục); Nghị định 166/2026/NĐ-CP; Thông tư 79/2026/TT-BCA (tệp chính và 8
tệp phụ lục, biểu mẫu), cộng một tệp nén PDF trùng nội dung Thông tư 79. Cả bốn văn bản đều quy định về phòng, chống ma
túy và cai nghiện; phần chi phối nghiệp vụ kho căng tin chỉ nằm ở Thông tư 79 (14 điều khoản: hệ thống quản lý cơ sở cai
nghiện thông minh và mốc triển khai, vị trí việc làm căng tin, danh mục chất cấm, đồ vật cấm, duyệt giá bán căng tin, hệ
thống bán hàng căng tin) và Nghị định 163 (1 điều khoản: tiền
lưu ký dùng mua hàng tại căng tin). Luật 120, Nghị định 166 và mọi phụ lục, biểu mẫu lấy 0 điều khoản (lý do ở mục 1). BA xác nhận chỉ tệp chính Thông tư
79 và tệp chính Nghị định 163 áp dụng cho kho căng tin [SRC: 0-inputs/answers-2026-10-29.md, RQ-48].
Theo loại: 10 `đối tượng`, 5 `điều kiện` (một có loại phụ `thẩm quyền`, một có loại phụ `đối tượng`). Theo hướng BR: 13 `ràng buộc`, 2 không thành
rule ("—"). Hiệu lực: cả bốn văn bản có hiệu lực từ 2026-07-01 theo chính văn bản; Nghị định 163 tệp chính để trống số
hiệu và ngày ban hành, BA xác nhận tệp là bản chính thức, số và ngày lấy theo các tệp phụ lục (Q-004 đã quyết, ASM-002 đã xác nhận)
[SRC: 0-inputs/answers-2026-10-29.md, RQ-62]. Biểu mẫu: không văn bản nào có
mẫu phiếu nhập kho, phiếu điều chuyển, biên bản kiểm kê hàng căng tin; mẫu chứng từ kho do dự án tự thiết kế (Q-009 đã quyết, [SRC: 0-inputs/answers-2026-10-29.md, RQ-60]). Câu hỏi còn chờ: không còn. Q-008 tạm bỏ qua theo <span style="color:red">**<u>GD-0002</u>**</span> (RQ-59). Đã quyết: Q-004 (RQ-62), Q-009 (RQ-60), Q-010 (RQ-63), Q-011 (RQ-64, <span style="color:red">**<u>GD-0004</u>**</span>), Q-012 (RQ-65),
Q-013 (RQ-66), Q-005, Q-006 (chi phí hợp lý, <span style="color:red">**<u>GD-0001</u>**</span>, RQ-53), Q-007
(phạm vi hàng hóa, RQ-49). Số
điều khoản đã có UC: chưa có (`uc-phap-ly.md` chưa lập).

**Căn cứ chuẩn:** ISO/IEC/IEEE 29148:2018 mục 9.3 (BRS: chính sách, quy định, ràng buộc chi phối nghiệp vụ) và 5.2 (truy vết về nguồn: `PL:<mã>`); BABOK v3 mục 10.18 "Document Analysis", 10.9 "Business Rules Analysis" (văn bản luật là nguồn rule); OMG SBVR 1.5 (rule định nghĩa, rule hành vi).

## 0. Văn bản đầu vào
Các văn bản BA đưa vào `0-inputs/` để làm căn cứ pháp lý cho dự án. Cột "Văn bản quy định về" chép Điều 1 "Phạm vi điều
chỉnh" của chính văn bản (văn bản không chia điều: lấy tiêu đề và phần nêu nội dung). Áp dụng cho dự án đến đâu xem mục 1.

"dòng n" trong mọi `[SRC]` của file này là số dòng trong bản chữ `.ba-cache/ban-chu/<đường dẫn tệp gốc>.txt` (docx do
`kit/tools/ba-verify/office.cjs` chuyển; `Phụ luc II.doc` do textutil chuyển).

| # | Văn bản | Tên đầy đủ | Văn bản quy định về | Áp dụng cho dự án | Tệp đầu vào |
| --- | --- | --- | --- | --- | --- |
| 1 | Luật 120/2025/QH15 (Quốc hội, 2025-12-10) | Luật Phòng, chống ma túy | "Luật này quy định về phòng, chống ma túy; quản lý người sử dụng trái phép chất ma túy; cai nghiện ma túy; trách nhiệm của cá nhân, gia đình, cơ quan, tổ chức trong phòng, chống ma túy; quản lý nhà nước và hợp tác quốc tế về phòng, chống ma túy." [SRC: 0-inputs/phap-ly/Luật 120/120_2025_QH15_666019.docx, Điều 1, dòng 13] | không — như mục 1 | `0-inputs/phap-ly/Luật 120/120_2025_QH15_666019.docx` |
| 2 | Nghị định 163/2026/NĐ-CP (Chính phủ, 2026-05-15 [SRC: 0-inputs/answers-2026-10-29.md, RQ-62]) | Quy định chi tiết và hướng dẫn thi hành một số điều của Luật Phòng, chống ma túy | "Nghị định này quy định chi tiết khoản 5 Điều 11, khoản 4 Điều 12, … khoản 8 Điều 42 của Luật Phòng, chống ma túy; biện pháp để tổ chức, hướng dẫn thi hành Điều 17, Điều 19, Điều 20, khoản 2 Điều 21, Điều 23, …" (Điều 1 liệt kê các điều, khoản của Luật được quy định chi tiết) [SRC: 0-inputs/phap-ly/Nghị định 163/NGHỊ ĐỊNH 163.docx, Điều 1, dòng 23] | có — như mục 1 | `0-inputs/phap-ly/Nghị định 163/NGHỊ ĐỊNH 163.docx` |
| 3 | Danh mục phụ lục kèm Nghị định 163/2026/NĐ-CP | Danh mục phụ lục | Liệt kê 5 phụ lục: I mẫu văn bản giám sát điện tử; II biểu mẫu kiểm soát hoạt động hợp pháp liên quan đến ma túy; III biểu mẫu quản lý người sử dụng trái phép chất ma túy; IV trang thiết bị tối thiểu phục vụ cai nghiện; V mẫu văn bản công tác cai nghiện, quản lý sau cai nghiện [SRC: 0-inputs/phap-ly/Nghị định 163/DANH MỤC PHỤ LỤC.docx, bảng, dòng 1–25] | không — như mục 1 | `0-inputs/phap-ly/Nghị định 163/DANH MỤC PHỤ LỤC.docx` |
| 4 | Phụ lục I Nghị định 163/2026/NĐ-CP | Các mẫu văn bản thực hiện biện pháp giám sát điện tử | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lục I.docx, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/Nghị định 163/Phụ lục I.docx` |
| 5 | Phụ lục II Nghị định 163/2026/NĐ-CP | Danh mục biểu mẫu kiểm soát các hoạt động hợp pháp liên quan đến ma túy | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ luc II.doc, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/Nghị định 163/Phụ luc II.doc` |
| 6 | Phụ lục III Nghị định 163/2026/NĐ-CP | Danh mục biểu mẫu quản lý người sử dụng trái phép chất ma túy | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lục III 18.5 11h09.docx, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/Nghị định 163/Phụ lục III 18.5 11h09.docx` |
| 7 | Phụ lục IV Nghị định 163/2026/NĐ-CP | Danh mục trang thiết bị tối thiểu phục vụ hoạt động cai nghiện ma túy | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lụ IV.docx, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/Nghị định 163/Phụ lụ IV.docx` |
| 8 | Phụ lục V Nghị định 163/2026/NĐ-CP | Các mẫu văn bản thực hiện công tác cai nghiện, quản lý sau cai nghiện ma túy | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lục V18.5 10h40.docx, tiêu đề, dòng 1] | không — như mục 1 | `0-inputs/phap-ly/Nghị định 163/Phụ lục V18.5 10h40.docx` |
| 9 | Nghị định 166/2026/NĐ-CP (Chính phủ, 2026-05-15) | Quy định hồ sơ, trình tự, thủ tục xác định tình trạng nghiện ma túy | "Nghị định này quy định về hồ sơ, trình tự, thủ tục xác định tình trạng nghiện ma túy quy định tại khoản 7, Điều 31 Luật Phòng, chống ma túy." [SRC: 0-inputs/phap-ly/Nghị định 166/166_2026_ND-CP_705807.docx, Điều 1, dòng 16] | không — như mục 1 | `0-inputs/phap-ly/Nghị định 166/166_2026_ND-CP_705807.docx` |
| 10 | Thông tư 79/2026/TT-BCA (Bộ Công an, 2026-06-05) | Quy định về khung danh mục vị trí việc làm, điều kiện nhân sự, quy trình cai nghiện ma túy và chế độ của người cai nghiện ma túy tại cơ sở cai nghiện ma túy công lập, trường giáo dưỡng; trang phục của lao động hợp đồng tại cơ sở cai nghiện ma túy công lập | "Thông tư này hướng dẫn và quy định về các nội dung: khung danh mục vị trí việc làm, điều kiện nhân sự, quy trình cai nghiện ma túy và chế độ của người cai nghiện ma túy tại cơ sở cai nghiện ma túy công lập, trường giáo dưỡng; trang phục của lao động hợp đồng tại cơ sở cai nghiện ma túy công lập." [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 1, dòng 23] | có — như mục 1 | `0-inputs/phap-ly/TT79/1. Thông tư số 79.docx` |
| 11 | Phụ lục I Thông tư 79/2026/TT-BCA | Các mẫu văn bản thực hiện công tác cai nghiện ma túy tại cơ sở cai nghiện ma túy công lập | Danh mục Mẫu số 01 → Mẫu số 08 (hồ sơ quản lý người cai nghiện tự nguyện, bệnh án, phiếu đánh giá xếp loại, quyết định khen thưởng, biên bản vi phạm, quyết định kỷ luật, sổ theo dõi thăm gặp và gửi tiền lưu ký, sổ theo dõi liên lạc) [SRC: 0-inputs/phap-ly/TT79/1.1. Phụ lục I.docx, tiêu đề và bảng, dòng 1–21] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.1. Phụ lục I.docx` |
| 12 | Phụ lục I Mẫu số 01 Thông tư 79/2026/TT-BCA | Hồ sơ quản lý người cai nghiện ma túy tự nguyện | Tiêu đề mẫu [SRC: 0-inputs/phap-ly/TT79/1.1.1. Phụ lục I - Mẫu số 1.docx, tiêu đề, dòng 12] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.1.1. Phụ lục I - Mẫu số 1.docx` |
| 13 | Phụ lục I Mẫu số 02 Thông tư 79/2026/TT-BCA | Bệnh án điều trị cắt cơn nghiện ma túy | Tiêu đề mẫu [SRC: 0-inputs/phap-ly/TT79/1.1.2. Phụ lục I - Mẫu Số 2.docx, tiêu đề, dòng 6] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.1.2. Phụ lục I - Mẫu Số 2.docx` |
| 14 | Phụ lục I Mẫu số 03 → 08 Thông tư 79/2026/TT-BCA | Phiếu đánh giá, xếp loại người cai nghiện ma túy (Mẫu số 03) và Mẫu số 04 → 08 trong cùng tệp | Tệp tên "Mẫu số 3" chứa Mẫu số 03 (dòng 1), 04 (dòng 210), 05 (dòng 241), 06 (dòng 289), 07 Sổ theo dõi thăm gặp và gửi tiền lưu ký (dòng 320), 08 (dòng 530) [SRC: 0-inputs/phap-ly/TT79/1.1.3. Phụ lục I- Mẫu số 3.docx, tiêu đề các mẫu, dòng 1–530] [PH-005] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.1.3. Phụ lục I- Mẫu số 3.docx` |
| 15 | Phụ lục II Thông tư 79/2026/TT-BCA | Thời gian biểu hoạt động hằng ngày của người cai nghiện ma túy tại cơ sở cai nghiện ma túy công lập | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/TT79/1.2. Phụ lục II.docx, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.2. Phụ lục II.docx` |
| 16 | Phụ lục III Thông tư 79/2026/TT-BCA | Tiêu chí, thang điểm đánh giá, xếp loại người cai nghiện ma túy tại cơ sở cai nghiện ma túy công lập | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/TT79/1.3. Phụ lục III.docx, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.3. Phụ lục III.docx` |
| 17 | Phụ lục IV Thông tư 79/2026/TT-BCA | Mẫu trang phục của người lao động hợp đồng tại cơ sở cai nghiện ma túy công lập | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/TT79/1.4. Phụ lục IV.docx, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.4. Phụ lục IV.docx` |
| 18 | Phụ lục V Thông tư 79/2026/TT-BCA | Trang phục của người cai nghiện ma túy tại cơ sở cai nghiện ma túy công lập | Tiêu đề phụ lục [SRC: 0-inputs/phap-ly/TT79/1.5. Phụ lục V.docx, tiêu đề, dòng 2] | không — như mục 1 | `0-inputs/phap-ly/TT79/1.5. Phụ lục V.docx` |

- `0-inputs/phap-ly/TT79/Thông tư số 79 - PDF.zip`: bản PDF của Thông tư 79 và phụ lục, trùng nội dung các tệp docx ở
  dòng 10 → 18 (theo phiên chính); không đọc riêng, không lấy điều khoản riêng.
- Văn bản được dẫn tới nhưng không có trong `0-inputs/` (chỉ để biết, không chi phối kho căng tin): văn bản bị bãi bỏ
  Luật 73/2021/QH14 (Luật 120 Điều 55 khoản 2, dòng 489); Nghị định 105/2021/NĐ-CP, 116/2021/NĐ-CP (Nghị định 163 Điều
  150 khoản 3, dòng 1434–1436); Thông tư 29/2022/TT-BLĐTBXH, Quyết định 1565/QĐ-BCA, 1567/QĐ-BCA (Thông tư 79 Điều 51
  khoản 2, dòng 494–497). Văn bản về chế độ kế toán, mẫu chứng từ kho mà UC `PM3CSCN.WEB.09.01.05` "In phiếu nhập kho
  hàng hóa căng tin phục vụ lưu trữ kế toán" cần: không có; mẫu chứng từ kho do dự án tự thiết kế (Q-009 đã quyết) [SRC: 0-inputs/answers-2026-10-29.md, RQ-60]. Phiếu nhập kho, phiếu
  điều chuyển, biên bản kiểm kê, hồ sơ nhà cung cấp là nghiệp vụ nội bộ, không có văn bản điều chỉnh khác [SRC: 0-inputs/answers-2026-10-29.md, RQ-55] [SRC: 0-inputs/answers-2026-10-29.md, RQ-56]. Quy chế, nội quy căng tin của cơ sở: không có (Q-010 đã quyết) [SRC: 0-inputs/answers-2026-10-29.md, RQ-63].

## 1. Văn bản
Cách đọc bảng: mỗi dòng một văn bản. "Hiệu lực" là tình trạng theo chính văn bản và văn bản khác trong `0-inputs/` (còn
/ hết / chưa có hiệu lực, văn bản nào bãi bỏ văn bản nào). "Áp dụng cho dự án": văn bản có chi phối nghiệp vụ của phần
mềm không, phần nào, BA đã xác nhận chưa. "Số điều khoản lấy": số dòng của văn bản đó ở mục 2.

| Văn bản | Số hiệu | Cơ quan ban hành | Ngày ban hành | Ngày hiệu lực | Hiệu lực | Áp dụng cho dự án | Số điều khoản lấy | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Luật 120/2025/QH15 | 120/2025/QH15 | Quốc hội | 2025-12-10 | 2026-07-01 (Điều 55 khoản 1, dòng 488) | còn | không — Luật không có điều khoản về căng tin, kho, hàng hóa bán cho người cai nghiện; nội dung căng tin do Thông tư 79 hướng dẫn. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Luật 120/120_2025_QH15_666019.docx, dòng 3–4, 488] |
| Nghị định 163/2026/NĐ-CP | 163/2026/NĐ-CP (tệp chính ghi "Số:       /2026/NĐ-CP", để trống số; các tệp phụ lục ghi 163/2026/NĐ-CP; BA xác nhận bản chính thức, ASM-002 đã xác nhận [SRC: 0-inputs/answers-2026-10-29.md, RQ-62]) | Chính phủ | 2026-05-15 (tệp chính ghi "ngày     tháng      năm 2026", để trống; các tệp phụ lục ghi ngày 15 tháng 5 năm 2026; BA xác nhận [SRC: 0-inputs/answers-2026-10-29.md, RQ-62]) | 2026-07-01 (Điều 150 khoản 1, dòng 1432) | còn | có — chỉ Điều 120 khoản 3 (tiền lưu ký dùng mua hàng tại căng tin). BA xác nhận áp dụng (tệp chính) [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 1 | [SRC: 0-inputs/phap-ly/Nghị định 163/NGHỊ ĐỊNH 163.docx, dòng 3, 8, 1432] |
| Danh mục phụ lục kèm Nghị định 163/2026/NĐ-CP | 163/2026/NĐ-CP (ghi trên tệp) | Chính phủ | 2026-05-15 (ghi trên tệp) | theo Nghị định 163 (2026-07-01) | còn | không — danh mục tên phụ lục, không có nội dung căng tin. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Nghị định 163/DANH MỤC PHỤ LỤC.docx, dòng 2–3] |
| Phụ lục I Nghị định 163/2026/NĐ-CP | 163/2026/NĐ-CP (ghi trên tệp) | Chính phủ | 2026-05-15 (ghi trên tệp) | theo Nghị định 163 (2026-07-01) | còn | không — mẫu văn bản giám sát điện tử, không liên quan kho căng tin. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lục I.docx, dòng 3] |
| Phụ lục II Nghị định 163/2026/NĐ-CP | 163/2026/NĐ-CP (ghi trên tệp) | Chính phủ | 2026-05-15 (ghi trên tệp) | theo Nghị định 163 (2026-07-01) | còn | không — biểu mẫu kiểm soát hoạt động hợp pháp liên quan đến ma túy; Mẫu số 09 "Phiếu nhập/xuất kho chất ma túy, tiền chất, mẫu chất ma túy" là phiếu kho chất ma túy, không phải phiếu kho hàng hóa căng tin. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ luc II.doc, dòng 4–5, 27, 459] |
| Phụ lục III Nghị định 163/2026/NĐ-CP | 163/2026/NĐ-CP (ghi trên tệp) | Chính phủ | 2026-05-15 (ghi trên tệp) | theo Nghị định 163 (2026-07-01) | còn | không — biểu mẫu quản lý người sử dụng trái phép chất ma túy. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lục III 18.5 11h09.docx, dòng 4–5] |
| Phụ lục IV Nghị định 163/2026/NĐ-CP | 163/2026/NĐ-CP (ghi trên tệp) | Chính phủ | 2026-05-15 (ghi trên tệp) | theo Nghị định 163 (2026-07-01) | còn | không — trang thiết bị tối thiểu phục vụ cai nghiện, không có mục căng tin, kho hàng. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lụ IV.docx, dòng 3] |
| Phụ lục V Nghị định 163/2026/NĐ-CP | 163/2026/NĐ-CP (ghi trên tệp) | Chính phủ | 2026-05-15 (ghi trên tệp) | theo Nghị định 163 (2026-07-01) | còn | không — mẫu văn bản cai nghiện, quản lý sau cai nghiện, không có mẫu về căng tin. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Nghị định 163/Phụ lục V18.5 10h40.docx, dòng 2] |
| Nghị định 166/2026/NĐ-CP | 166/2026/NĐ-CP | Chính phủ | 2026-05-15 | 2026-07-01 (Điều 9 khoản 1, dòng 90) | còn | không — chỉ quy định hồ sơ, trình tự xác định tình trạng nghiện ma túy. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/Nghị định 166/166_2026_ND-CP_705807.docx, dòng 3–4, 90] |
| Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA | Bộ Công an | 2026-06-05 | 2026-07-01 (Điều 51 khoản 1, dòng 493) | còn | có — Điều 6 khoản 2 (vị trí việc làm căng tin), Điều 16 (chất cấm, đồ vật cấm), Điều 41 khoản 4, 7 (căng tin, giá bán, hệ thống bán hàng căng tin). BA xác nhận áp dụng (tệp chính) [SRC: 0-inputs/answers-2026-10-29.md, RQ-48]. Bổ sung Điều 5 khoản 1 điểm a, khoản 2, Điều 52 khoản 4 (hệ thống quản lý cơ sở cai nghiện thông minh) [SRC: 0-inputs/answers-2026-10-29.md, RQ-91] [SRC: 0-inputs/answers-2026-10-29.md, RQ-97] | 14 | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, dòng 4, 8, 493] |
| Phụ lục I Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (ghi trên tệp) | Bộ Công an | 2026-06-05 (ghi trên tệp) | theo Thông tư 79 (2026-07-01) | còn | không — danh mục mẫu văn bản công tác cai nghiện, không có mẫu về căng tin, kho. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.1. Phụ lục I.docx, dòng 3] |
| Phụ lục I Mẫu số 01 Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (theo Phụ lục I; tệp mẫu không ghi số) | Bộ Công an | 2026-06-05 (theo Phụ lục I) | theo Thông tư 79 (2026-07-01) | còn | không — hồ sơ quản lý người cai nghiện tự nguyện. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.1.1. Phụ lục I - Mẫu số 1.docx, dòng 1–12] |
| Phụ lục I Mẫu số 02 Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (theo Phụ lục I; tệp mẫu không ghi số) | Bộ Công an | 2026-06-05 (theo Phụ lục I) | theo Thông tư 79 (2026-07-01) | còn | không — bệnh án điều trị cắt cơn. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.1.2. Phụ lục I - Mẫu Số 2.docx, dòng 1–6] |
| Phụ lục I Mẫu số 03 → 08 Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (theo Phụ lục I; tệp mẫu không ghi số) | Bộ Công an | 2026-06-05 (theo Phụ lục I) | theo Thông tư 79 (2026-07-01) | còn | không — Mẫu số 07 "Sổ theo dõi thăm gặp và gửi tiền lưu ký" phục vụ lưu ký, thăm gặp (ngoài phạm vi kho căng tin theo RQ-03); các mẫu còn lại về đánh giá, khen thưởng, kỷ luật, liên lạc. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.1.3. Phụ lục I- Mẫu số 3.docx, dòng 1, 210, 241, 289, 320, 530] |
| Phụ lục II Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (ghi trên tệp) | Bộ Công an | 2026-06-05 (ghi trên tệp) | theo Thông tư 79 (2026-07-01) | còn | không — thời gian biểu hằng ngày của người cai nghiện. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.2. Phụ lục II.docx, dòng 3] |
| Phụ lục III Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (ghi trên tệp) | Bộ Công an | 2026-06-05 (ghi trên tệp) | theo Thông tư 79 (2026-07-01) | còn | không — tiêu chí, thang điểm đánh giá, xếp loại. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.3. Phụ lục III.docx, dòng 4] |
| Phụ lục IV Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (ghi trên tệp) | Bộ Công an | 2026-06-05 (ghi trên tệp) | theo Thông tư 79 (2026-07-01) | còn | không — mẫu trang phục người lao động hợp đồng. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.4. Phụ lục IV.docx, dòng 4] |
| Phụ lục V Thông tư 79/2026/TT-BCA | 79/2026/TT-BCA (ghi trên tệp) | Bộ Công an | 2026-06-05 (ghi trên tệp) | theo Thông tư 79 (2026-07-01) | còn | không — trang phục người cai nghiện. BA xác nhận không áp dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-48] | 0 | [SRC: 0-inputs/phap-ly/TT79/1.5. Phụ lục V.docx, dòng 4] |

- Cột "Hiệu lực" ghi "còn" vì ngày hiệu lực 2026-07-01 ghi trong chính văn bản đã qua so với ngày cập nhật file; chưa có
  văn bản nào trong `0-inputs/` bãi bỏ bốn văn bản này.
- Nghị định 163: tệp chính để trống số hiệu và ngày ban hành; tên hai tệp phụ lục có ghi giờ ("18.5 11h09", "18.5 10h40")
  [PH-004]. Q-004 đã quyết: tệp là bản chính thức, dùng số hiệu, ngày theo tệp phụ lục [SRC: 0-inputs/answers-2026-10-29.md, RQ-62]. Mã điều khoản ở mục 2 dùng `NĐ163-2026` theo số ghi trên các tệp phụ lục và theo phần căn cứ của
  Thông tư 79 ("Nghị định số 163/2026/NĐ-CP", dòng 16); ASM-002 đã xác nhận [SRC: 0-inputs/answers-2026-10-29.md, RQ-62].

## 2. Điều khoản
Cách đọc bảng:
- **Mã điều khoản**: `<loại văn bản><số>-<năm>/Đ<điều>.K<khoản>.<điểm>`, ví dụ `TT79-2026/Đ41.K4` là Thông tư 79/2026,
  Điều 41 khoản 4. Loại: L luật, NQ nghị quyết, NĐ nghị định, QĐ quyết định, TT thông tư, CT chỉ thị. Văn bản không có
  số hiệu (đề cương, hướng dẫn nội bộ) dùng mã `VB-<tên-ngắn>/<mục>`. Tài liệu khác dẫn bằng `PL:<mã>`.
- **Loại**: xem giải thích ngay dưới.
- **Chủ thể, Hành vi, Đối tượng**: ai — làm gì — với cái gì, dùng đúng từ của văn bản. "—" là văn bản không nêu.
- **Tóm tắt**: nội dung điều khoản, giữ nguyên con số.
- **Hướng BR**: xem giải thích ngay dưới.
- **Hiệu lực**: còn / hết / chưa có hiệu lực, hoặc chờ xác nhận. **Nguồn**: tệp gốc, điều khoản và số dòng.

**Loại là gì.** Cột "Loại" cho biết điều khoản **nói về chuyện gì** trong luật: trình tự, thời gian, ai có quyền,
mẫu giấy tờ, điều kiện, phạm vi áp dụng hay hình thức xử lý. Loại giúp biết điều khoản sẽ được dùng ở đâu khi làm phần
mềm. Mỗi điều khoản ghi một loại chính. Nếu điều khoản vừa thuộc loại này vừa thuộc loại khác mà không tách nhỏ được,
loại phụ ghi trong ngoặc. Khác với "Hướng BR": Loại nói **luật quy định gì**, Hướng BR nói **phần mềm sẽ làm gì** với
quy định đó. Có 7 loại:

| Loại | Điều khoản nói về | Thường nhận ra qua chữ | Sau này dùng để | Hướng BR thường gặp | Số điều khoản | Ví dụ |
| --- | --- | --- | --- | --- | --- | --- |
| thủ tục | Các bước phải làm, làm theo thứ tự nào | "trình tự", "các bước", "sau khi … thì …" | Vẽ các bước trong quy trình nghiệp vụ | — (thành bước quy trình); ràng buộc khi bắt buộc đúng thứ tự | 0 | Không có trong file này |
| thời hạn | Bao lâu, khi nào, bao lâu một lần | "trong thời hạn", "tối đa", "tối thiểu", "định kỳ" | Đặt mốc thời gian, nhắc hạn, cảnh báo quá hạn | thời hạn | 0 | Không có trong file này |
| thẩm quyền | Ai (cơ quan, chức danh) có quyền làm, quyết định, ký | "có thẩm quyền", "quyết định", "phê duyệt", "cấp" | Phân vai người dùng: ai được thấy, được duyệt, được ký | phân quyền | 0 (1 là loại phụ) | `TT79-2026/Đ41.K4`: "Giá bán … phải được Trưởng cơ sở cai nghiện ma túy duyệt" (loại phụ) |
| biểu mẫu | Phải dùng mẫu giấy tờ nào | "theo Mẫu số …", "Phụ lục …" | Xác định thông tin phần mềm phải lưu, phải in ra (mục 3) | — (thành thông tin lưu); kiểm liên trường khi các ô trên mẫu liên quan nhau | 0 | Không có trong file này |
| điều kiện | Phải có, phải đạt gì; được hoặc không được làm gì | "phải", "bảo đảm", "không được", "tiêu chuẩn" | Làm tiêu chí kiểm tra, điều kiện chặn hoặc cho phép trong phần mềm | ràng buộc; suy diễn khi dùng để phân loại; tính toán khi có định mức | 5 | `TT79-2026/Đ41.K4`: giá bán "không được cao hơn giá bán lẻ tại địa phương đối với hàng hóa cùng loại" |
| đối tượng | Áp dụng cho ai, cho việc gì; phạm vi, nội dung gồm những gì | "áp dụng đối với", "gồm" | Xác định phạm vi: phần mềm quản lý những ai, những nội dung nào | ràng buộc, suy diễn; — khi chỉ nêu phạm vi chung | 10 | `TT79-2026/Đ16.K4`: rượu, bia, thuốc lá… là đồ vật cấm đưa vào cơ sở |
| chế tài | Vi phạm thì bị xử lý, chịu hậu quả gì | "bị đình chỉ", "bị thu hồi", "xử lý" | Ghi hậu quả phần mềm phải theo dõi sau khi có quyết định xử lý | suy diễn; tính toán khi có mức tiền | 0 | Không có trong file này |

**Hướng BR là gì.** BR (business rule) là **quy tắc nghiệp vụ**: một điều luật bắt buộc mà phần mềm phải tự áp dụng
khi người dùng làm việc, ví dụ tự chặn khi chưa đủ điều kiện, tự nhắc khi sắp quá hạn, tự tính một con số, chỉ cho đúng
người được bấm nút. Cột "Hướng BR" ghi **dự kiến** điều khoản đó sẽ thành loại quy tắc nào. Ở bước này chỉ ghi hướng;
câu quy tắc cụ thể viết ở bước 9, khi đó BA có thể đổi hướng nếu thấy chưa đúng. Có 7 giá trị:

| Hướng BR | Nghĩa là | Phần mềm sẽ làm gì | Số điều khoản | Ví dụ |
| --- | --- | --- | --- | --- |
| ràng buộc | Luật bắt buộc phải có, phải làm, hoặc cấm làm | Kiểm tra và không cho làm tiếp, hoặc ghi là "không đạt", khi chưa đúng | 13 | `TT79-2026/Đ16.K4`: mặt hàng thuộc nhóm rượu, bia, thuốc lá… không được đưa vào cơ sở |
| thời hạn | Luật đặt mốc thời gian: hạn tối đa, tối thiểu, chu kỳ | Tính ngày đến hạn, nhắc trước, báo quá hạn | 0 | Không có trong file này |
| phân quyền | Luật quy định ai (chức danh, cơ quan) được làm hoặc được quyết một việc | Chỉ người có đúng vai trò mới thấy nút và được thao tác | 0 | Không có ở cột Hướng BR; `TT79-2026/Đ41.K4` còn mang ý phân quyền (Trưởng cơ sở duyệt giá), xem ghi chú dưới bảng |
| tính toán | Luật cho một con số phải tính ra hoặc so với định mức (tỷ lệ, mức tiền, số người) | Tự tính từ số liệu đã nhập rồi so với định mức | 0 | Không có trong file này |
| suy diễn | Luật dạng "nếu xảy ra … thì …": từ một tình huống suy ra kết quả, hậu quả hoặc cách phân loại | Tự đưa ra kết luận hoặc đề xuất khi gặp tình huống đó | 0 | Không có trong file này |
| kiểm liên trường | Các thông tin trên cùng một mẫu phải khớp nhau | Kiểm ngay khi nhập, báo lỗi nếu hai ô mâu thuẫn | 0 | Không có trong file này |
| — | Điều khoản không thành quy tắc: chỉ mô tả một việc trong trình tự làm việc, hoặc một mẫu giấy tờ | Không có quy tắc riêng: việc đó thành một bước trong quy trình, mẫu giấy tờ thành thông tin phần mềm lưu | 2 | `TT79-2026/Đ6.K2`: "căng tin" là một vị trí việc làm của cơ sở |

| Mã điều khoản | Văn bản | Điều, khoản, điểm | Loại | Chủ thể | Hành vi | Đối tượng | Tóm tắt | Hướng BR | Hiệu lực | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NĐ163-2026/Đ120.K3 | Nghị định 163/2026/NĐ-CP | Điều 120 khoản 3 (câu cuối) | đối tượng | người cai nghiện | sử dụng mua | lương thực, thực phẩm, hàng hóa và các đồ dùng thiết yếu khác tại căng tin của cơ sở cai nghiện ma túy công lập | Tiền lưu ký của người cai nghiện được sử dụng mua lương thực, thực phẩm, hàng hóa và các đồ dùng thiết yếu khác tại căng tin của cơ sở cai nghiện ma túy công lập; thanh toán tiền gửi thư, liên lạc điện thoại; gửi về cho thân nhân hoặc nhận lại (nếu còn) khi chấp hành xong quyết định. Điều 120 thuộc Mục 12 "Chế độ đối với người nghiện bị áp dụng biện pháp đưa đi cai nghiện bắt buộc tại cơ sở cai nghiện ma túy công lập" Q-007 đã quyết: câu này và `TT79-2026/Đ41.K4` coi là cùng nghĩa; hệ thống không kiểm nhóm hàng, Trưởng cơ sở kiểm khi duyệt giá đầu [SRC: 0-inputs/answers-2026-10-29.md, RQ-49] [SRC: 0-inputs/answers-2026-10-28.md, RQ-24] | — | còn | [SRC: 0-inputs/phap-ly/Nghị định 163/NGHỊ ĐỊNH 163.docx, Điều 120 khoản 3, dòng 1232; Mục 12, dòng 1167–1168] |
| TT79-2026/Đ5.K1.a | Thông tư 79/2026/TT-BCA | Điều 5 khoản 1 điểm a | điều kiện (đối tượng) | — | được kết nối, đồng bộ | phần mềm quản lý cơ sở cai nghiện; cơ sở dữ liệu quốc gia về dân cư; cơ sở dữ liệu người nghiện ma túy và người bị quản lý sau cai nghiện ma túy | Hệ thống quản lý cơ sở cai nghiện thông minh gồm: a) Phần mềm quản lý cơ sở cai nghiện được kết nối, đồng bộ với cơ sở dữ liệu quốc gia về dân cư; cơ sở dữ liệu người nghiện ma túy và người bị quản lý sau cai nghiện ma túy. BA xác nhận phần mềm kho căng tin thuộc hệ thống này [SRC: 0-inputs/answers-2026-10-29.md, RQ-91]; phạm vi dữ liệu kết nối, đồng bộ theo <span style="color:red">**<u>GD-0007</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-96] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 5 khoản 1 điểm a, dòng 38–39] |
| TT79-2026/Đ5.K2 | Thông tư 79/2026/TT-BCA | Điều 5 khoản 2 | điều kiện | — | bảo đảm | tính công khai, minh bạch, thống nhất của việc triển khai hệ thống quản lý cơ sở cai nghiện thông minh | Triển khai hệ thống quản lý cơ sở cai nghiện thông minh là hoạt động chuyển đổi số trong lĩnh vực cai nghiện ma túy; việc thực hiện phải bảo đảm tính công khai, minh bạch, thống nhất theo các quy định tại Thông tư này [SRC: 0-inputs/answers-2026-10-29.md, RQ-91] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 5 khoản 2, dòng 41] |
| TT79-2026/Đ6.K2 | Thông tư 79/2026/TT-BCA | Điều 6 khoản 2 | đối tượng | — | — | vị trí việc làm "căng tin" (nhóm tham mưu, hành chính, tổng hợp) | Khung danh mục vị trí việc làm tại cơ sở cai nghiện ma túy công lập có nhóm "Tham mưu, hành chính, tổng hợp; tổ chức cán bộ; kế hoạch tài chính; văn thư; thủ quỹ; …; tiếp dân; căng tin; …". Thuật ngữ chuẩn: "người phụ trách căng tin" (TT79 Đ41.K2, K3), từ `cán bộ căng tin` không dùng (Q-013 đã quyết) [SRC: 0-inputs/answers-2026-10-29.md, RQ-66] | — | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 6 khoản 2, dòng 46] |
| TT79-2026/Đ16.K1 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 1 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | các loại vũ khí, vật liệu nổ, tiền chất thuốc nổ, công cụ hỗ trợ | Chất cấm, đồ vật cấm đưa vào cơ sở cai nghiện ma túy gồm: các loại vũ khí, vật liệu nổ, tiền chất thuốc nổ, công cụ hỗ trợ theo quy định của Luật Quản lý, sử dụng vũ khí, vật liệu nổ và công cụ hỗ trợ | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 1, dòng 184] |
| TT79-2026/Đ16.K2 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 2 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | chất ma túy, tiền chất ma túy, chất hướng thần; chất gây mê, chất độc, chất gây ngứa, chất phóng xạ, hóa chất, độc dược; các loại thuốc chữa bệnh, phòng bệnh | Chất cấm, đồ vật cấm gồm: các chất ma túy, tiền chất ma túy, chất hướng thần hoặc có chứa chất ma túy; chất gây mê, chất độc, chất gây ngứa, chất phóng xạ, hóa chất, độc dược; các loại thuốc chữa bệnh, phòng bệnh (trừ trường hợp có chỉ định của cơ quan y tế có thẩm quyền) Q-008 tạm bỏ qua: chưa xét bao bì, hệ thống không phân loại theo bao bì, Trưởng cơ sở kiểm khi duyệt giá đầu — <span style="color:red">**<u>GD-0002</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-59] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 2, dòng 185] |
| TT79-2026/Đ16.K3 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 3 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | chất cháy và các chất, đồ vật dễ cháy | Chất cấm, đồ vật cấm gồm: chất cháy và các chất, đồ vật dễ cháy khi tiếp xúc với không khí hoặc các đồ vật khác Q-008 tạm bỏ qua: chưa xét bao bì, hệ thống không phân loại theo bao bì, Trưởng cơ sở kiểm khi duyệt giá đầu — <span style="color:red">**<u>GD-0002</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-59] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 3, dòng 186] |
| TT79-2026/Đ16.K4 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 4 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | rượu, bia, đồ uống có cồn, thuốc lá, thuốc lá điện tử, thuốc lá nung nóng, thuốc lào, xì gà, các chất kích thích khác | Chất cấm, đồ vật cấm gồm: rượu, bia, đồ uống có cồn, thuốc lá, thuốc lá điện tử, thuốc lá nung nóng, thuốc lào, xì gà các loại và các chất kích thích khác Q-008 tạm bỏ qua: chưa xét bao bì, hệ thống không phân loại theo bao bì, Trưởng cơ sở kiểm khi duyệt giá đầu — <span style="color:red">**<u>GD-0002</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-59] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 4, dòng 187] |
| TT79-2026/Đ16.K5 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 5 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | thiết bị dùng để đun nấu, đồ dùng bằng kim loại, sành, sứ, đá, đất nung, thủy tinh, phích nước | Chất cấm, đồ vật cấm gồm: các thiết bị dùng để đun nấu, đồ dùng bằng kim loại, sành, sứ, đá, đất nung, thủy tinh, phích nước Q-008 tạm bỏ qua: chưa xét bao bì, hệ thống không phân loại theo bao bì, Trưởng cơ sở kiểm khi duyệt giá đầu — <span style="color:red">**<u>GD-0002</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-59] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 5, dòng 188] |
| TT79-2026/Đ16.K6 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 6 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | tài sản có giá trị; máy ghi âm, máy ghi hình, máy nghe, nhìn, đồng hồ, điện thoại, bộ đàm, máy thu phát tín hiệu khác | Chất cấm, đồ vật cấm gồm: các tài sản có giá trị như tiền, vàng, kim cương, đá quý…; các loại máy ghi âm, máy ghi hình, máy nghe, nhìn, đồng hồ, điện thoại, bộ đàm và các loại máy thu phát tín hiệu khác (trừ những thiết bị y tế để bảo đảm sức khỏe cho người cai nghiện ma túy theo chỉ định của cơ quan y tế có thẩm quyền) | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 6, dòng 189] |
| TT79-2026/Đ16.K7 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 7 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | sách, báo bằng tiếng nước ngoài chưa qua kiểm duyệt; ấn phẩm tôn giáo, tín ngưỡng không được phép lưu hành; tranh ảnh, phim, băng, đĩa có nội dung xấu | Chất cấm, đồ vật cấm gồm: sách, báo bằng tiếng nước ngoài chưa qua kiểm duyệt; các ấn phẩm về tôn giáo, tín ngưỡng không được phép lưu hành; tranh ảnh, phim, băng, đĩa có nội dung mê tín dị đoan, phản động, đồi trụy, gây ảnh hưởng xấu đến công tác quản lý, giáo dục người cai nghiện ma túy | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 7, dòng 190] |
| TT79-2026/Đ16.K8 | Thông tư 79/2026/TT-BCA | Điều 16 khoản 8 | đối tượng | — | cấm đưa vào cơ sở cai nghiện ma túy | bài lá, phương tiện, công cụ đánh bạc; đồ vật khác có thể gây mất an toàn | Chất cấm, đồ vật cấm gồm: các loại bài lá, các phương tiện, công cụ dùng để đánh bạc dưới mọi hình thức; các đồ vật khác có thể gây mất an toàn cơ sở cai nghiện ma túy, người cai nghiện ma túy có thể dùng để bỏ trốn, gây nguy hại cho bản thân người cai nghiện ma túy và người khác, ảnh hưởng xấu đến vệ sinh môi trường | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 16 khoản 8, dòng 191] |
| TT79-2026/Đ41.K4 | Thông tư 79/2026/TT-BCA | Điều 41 khoản 4 (đoạn 1) | điều kiện (thẩm quyền) | Trưởng cơ sở cai nghiện ma túy | duyệt | giá bán lương thực, thực phẩm và các loại hàng hóa | Căn cứ điều kiện cụ thể, các cơ sở cai nghiện ma túy tổ chức hoạt động căng tin để bán lương thực, thực phẩm và đồ dùng sinh hoạt thiết yếu cho người cai nghiện ma túy. Giá bán lương thực, thực phẩm và các loại hàng hóa phải được Trưởng cơ sở cai nghiện ma túy duyệt sau khi trừ chi phí hợp lý, nhưng không được cao hơn giá bán lẻ tại địa phương đối với hàng hóa cùng loại Q-005, Q-006 đã quyết: chi phí hợp lý tính bên ngoài hệ thống; người dùng nhập giá bán lớn hơn hoặc bằng giá nhập — <span style="color:red">**<u>GD-0001</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-53] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 41 khoản 4, dòng 440] |
| TT79-2026/Đ41.K7 | Thông tư 79/2026/TT-BCA | Điều 41 khoản 7 | điều kiện | — | sử dụng tiền trong căng tin được thực hiện qua | hệ thống bán hàng căng tin | Việc sử dụng tiền trong căng tin được thực hiện qua hệ thống bán hàng căng tin trong cơ sở cai nghiện ma túy, bảo đảm minh bạch, thuận tiện trong quản lý giao dịch | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 41 khoản 7, dòng 444] |
| TT79-2026/Đ52.K4 | Thông tư 79/2026/TT-BCA | Điều 52 khoản 4 | điều kiện | các cơ sở cai nghiện ma túy công lập | bảo đảm | điều kiện về cơ sở vật chất, trang thiết bị | Ứng dụng khoa học công nghệ trong quản lý, điều hành cơ sở cai nghiện ma túy công lập quy định tại Điều 5 của Thông tư này được thực hiện sau khi các cơ sở cai nghiện ma túy công lập bảo đảm điều kiện về cơ sở vật chất, trang thiết bị [SRC: 0-inputs/answers-2026-10-29.md, RQ-91] | ràng buộc | còn | [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 52 khoản 4, dòng 506] |

Ghi chú khi chép:
- `TT79-2026/Đ41.K4` có ba ý trong cùng khoản không chia điểm: (1) cơ sở tổ chức căng tin bán lương thực, thực phẩm, đồ
  dùng sinh hoạt thiết yếu (đối tượng); (2) Trưởng cơ sở cai nghiện ma túy duyệt giá bán (thẩm quyền, hướng `phân
  quyền`); (3) giá bán "sau khi trừ chi phí hợp lý" và "không được cao hơn giá bán lẻ tại địa phương đối với hàng hóa
  cùng loại" (điều kiện, hướng `ràng buộc`); cách hiểu "sau khi trừ chi phí hợp lý" theo <span style="color:red">**<u>GD-0001</u>**</span>
  (chi phí hợp lý tính bên ngoài hệ thống, giá bán nhập vào lớn hơn hoặc bằng giá nhập) [SRC: 0-inputs/answers-2026-10-29.md, RQ-53]. Định dạng mã (kit/standards/id-convention.md) chỉ tách tới điểm nên giữ một
  mã; loại chính `điều kiện`, loại phụ `thẩm quyền`; bước 9 dựng cả rule ràng buộc giá và rule phân quyền duyệt từ mã này.
- `TT79-2026/Đ41.K4` đoạn 2 ("Nếu cơ sở cai nghiện ma túy không có điều kiện tổ chức căng tin, hằng tuần phải tập hợp
  nhu cầu, nguyện vọng mua hàng hóa …", dòng 441) không lấy: áp dụng cho cơ sở không có căng tin. Q-011 đã quyết: phần mềm hỗ trợ việc này
  bằng phiếu đặt hàng hóa từ đơn hàng nhưng ngoài phạm vi lần này — <span style="color:red">**<u>GD-0004</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-64].
- `NĐ163-2026/Đ120.K3` chỉ lấy câu cuối (tiền lưu ký dùng mua hàng tại căng tin); phần tiếp nhận tiền thăm gặp, tiền gửi
  qua bưu điện thuộc lưu ký, ngoài phạm vi kho căng tin.
- `TT79-2026/Đ16.K1` → `K8`: lấy đủ tám khoản vì Điều 16 là danh mục đóng; BA đã xác nhận Trưởng cơ sở loại trừ đồ vật
  cấm khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; hệ thống không kiểm nhóm hàng
  [SRC: 0-inputs/answers-2026-10-29.md, RQ-49]. Cách hiểu bao bì kim loại, thủy tinh: Q-008 tạm bỏ qua, chưa xét bao bì, hệ thống không phân loại
  theo bao bì, Trưởng cơ sở kiểm khi duyệt giá đầu — <span style="color:red">**<u>GD-0002</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-59].
- `TT79-2026/Đ5.K1.a`, `TT79-2026/Đ5.K2`, `TT79-2026/Đ52.K4`: lần lập đầu xếp vào "đã xét, không lấy"; bổ sung theo
  /ba-init --bo-sung vì BA xác nhận phần mềm kho căng tin thuộc hệ thống quản lý cơ sở cai nghiện thông minh [SRC: 0-inputs/answers-2026-10-29.md, RQ-91]
  [SRC: 0-inputs/answers-2026-10-29.md, RQ-97].
- Đã xét, không lấy (bán hàng, lưu ký ngoài phạm vi kho căng tin theo [SRC: 0-inputs/answers-2026-10-28.md, RQ-03]):
  Thông tư 79 Điều 41 khoản 1, 2, 3, 5, 6, 8 (nhận tiền lưu ký; người phụ trách căng tin ghi số tiền vào sổ; mua qua sổ,
  ký xác nhận; Trưởng cơ sở hạn chế mua hàng tại căng tin "không quá 10 ngày", dòng 436–445); Thông tư 79 Điều 40
  (quản lý tiền mặt, đồ lưu ký, dòng 429–435); Thông tư 79 Điều 17, 18 (thu giữ, xử lý đồ vật cấm, dòng 192–219);
  Thông tư 79 Điều 5 khoản 1 điểm b (hệ thống trang thiết bị công nghệ, không phải phần mềm, dòng 40); Nghị định 163 Điều 113 (chế độ cấp đồ
  dùng sinh hoạt, dòng 1173–1192) — Q-012 đã quyết: đồ dùng cấp phát không qua kho căng tin [SRC: 0-inputs/answers-2026-10-29.md, RQ-65]; Nghị định 163 Điều 118 khoản 1 điểm b (chi phí hợp lý của lao động trị liệu,
  dòng 1216) — Q-006 đã quyết: chi phí hợp lý tính bên ngoài hệ thống, <span style="color:red">**<u>GD-0001</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-53]; Nghị định 163 Điều 31, 41–45 và Phụ lục II Mẫu số 09 (kho, phiếu nhập/xuất kho chất ma túy, không
  phải hàng căng tin); Luật 120 Điều 46 khoản 1 điểm c, khoản 2 điểm g (thu, chi tài chính; phòng, chống thẩm lậu ma túy
  vào cơ sở, dòng 398, 407) — nêu chung, không chi phối nghiệp vụ kho căng tin.

## 3. Biểu mẫu
Cách đọc bảng: mỗi dòng một biểu mẫu mà điều khoản ở mục 2 bắt dùng. "Các trường trên biểu mẫu" là các mục phải điền
theo thứ tự trên mẫu; bước 6 (ERD) dùng để đối chiếu dữ liệu phần mềm phải lưu.

| Mã điều khoản | Tên biểu mẫu | Các trường trên biểu mẫu | Nguồn |
| --- | --- | --- | --- |

Không có dòng: không điều khoản nào ở mục 2 bắt dùng biểu mẫu. Các văn bản trong `0-inputs/phap-ly/` không có mẫu phiếu
nhập kho, phiếu xuất kho / điều chuyển, biên bản kiểm kê, đề xuất giá bán cho hàng hóa căng tin [PH-006]. Mẫu chứng từ kho do dự án tự thiết kế (Q-009 đã quyết) [SRC: 0-inputs/answers-2026-10-29.md, RQ-60], nên mục này
không có dòng biểu mẫu theo luật.
Mẫu số 07 "Sổ theo dõi thăm gặp và gửi tiền lưu ký" (Thông tư 79 Phụ lục I) và Mẫu số 09 "Phiếu nhập/xuất kho chất ma
túy, tiền chất, mẫu chất ma túy" (Nghị định 163 Phụ lục II) không thuộc nghiệp vụ kho căng tin (mục 1).

Bước 6 (ERD) dùng mục này để đối chiếu thuộc tính bắt buộc theo luật.
