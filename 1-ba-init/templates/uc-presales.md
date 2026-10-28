# Danh mục UC presales — <tên dự án>
| Nguồn | Mức presales | Số UC | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- |
| [SRC: 0-inputs/presales/uc/<tệp>.xlsx, <sheet>] | 1 (chỉ danh sách) / 2 (có mô tả luồng) | | YYYY-MM-DD | draft |

**File này dùng để làm gì.** Chép lại danh sách UC (use case, trường hợp sử dụng) trong hồ sơ chào giá: mỗi UC
là một việc phần mềm đã hứa làm cho một người dùng, ví dụ "Lập kế hoạch kiểm tra" cho Chuyên viên
nghiệp vụ. Đây là **mốc phạm vi** của dự án: những gì đã chào giá. Mọi chức năng, yêu cầu sau này phải dẫn được về một UC ở
đây (`PS:<mã gốc>`), hoặc được ghi rõ là thêm mới ngoài báo giá.
- Chép **nguyên văn** từ file presales: không sửa, không gộp, không tách, không đánh giá đúng sai.
- Mã gốc là số thứ tự trong file presales, không phải mã của kit; nơi khác dẫn bằng `PS:<mã gốc>`.
- Quyết định với từng UC (Giữ / Làm rõ / Tách / Gộp / Mở rộng / Bỏ / Thêm mới) **không ghi ở đây**, chỉ ghi ở
  `2-ba-overview/5-actor-usecase/uc-overview.md` (bước 2).

**Lấy dữ liệu từ:**
- `0-inputs/presales/uc/<tệp>.xlsx`: danh sách UC (vị trí cột, dòng: mục 0); sheet danh sách tác nhân nếu có.
- `1-ba-init/open-questions.md`: các mã `[Q-xxx]` (câu hỏi), `[ASM-xxx]` (giả định), `[PH-xxx]` (phát hiện) dẫn trong file.

**Được dùng ở:**
- Bước 1: `uc-phap-ly.md` (ghép UC với điều khoản luật), `man-presales.md` (gắn màn prototype với UC).
- Bước 2 /ba-overview: quyết định giữ, bỏ, tách, gộp từng UC (`uc-overview.md`); điền cột "Chức năng" (UC thuộc chức
  năng CN-xx nào); ma trận UC × quy trình.
- `brief.md` của từng chức năng: danh sách UC presales của chức năng.
- Yêu cầu, use case chi tiết ở các bước sau dẫn về UC gốc bằng `PS:<mã gốc>`.

**Tóm tắt.** Vài dòng bằng lời thường, đếm từ mục 1–2: số UC, mức presales (có mô tả luồng không); mã trùng, dòng
thiếu mã; số UC theo phân hệ cấp 1; phân loại có sẵn trong file chào giá (nếu có); số tác nhân, tác nhân không có trong
danh sách tác nhân của file chào giá; câu hỏi còn chờ.

**Căn cứ chuẩn:** BABOK v3 mục 4.3 "Confirm Elicitation Results" (ghi nhận nguyên văn kết quả thu thập); ISO/IEC/IEEE 29148:2018 mục 5.2 (thuộc tính yêu cầu, gồm truy vết về nguồn: mỗi yêu cầu sau này dẫn `PS:<mã gốc>`).

## 0. Vị trí trong nguồn
Mục này cho biết danh sách UC nằm ở đâu trong file chào giá (tệp, sheet, dòng tiêu đề, cột mã, cột tên), để máy
kiểm đối chiếu từng dòng với file gốc. Người đọc nghiệp vụ có thể bỏ qua.

| Tệp | Sheet | Dòng tiêu đề | Cột mã | Cột tên |
| --- | --- | --- | --- | --- |
| 0-inputs/presales/uc/<tệp>.xlsx | <tên sheet> | 3 | 1 | 2 |

Dòng tiêu đề: số dòng trong Excel của dòng tên cột; máy tìm dòng UC bị sót từ dòng kế tiếp. Cột đánh số từ 1 theo thứ
tự ô trong dòng (ô trống ở giữa vẫn tính). `kit/tools/ba-verify/dau-vao-check.mjs` dùng bảng này để đối chiếu từng dòng
danh mục với dòng trong file gốc (mã và tên phải khớp nguyên văn) và tìm dòng UC bị sót. Nhiều tệp hoặc nhiều sheet:
mỗi tệp, sheet một dòng.

## 1. Danh mục
Cách đọc bảng: mỗi dòng một UC, chép nguyên văn file chào giá.
- **Mã gốc**: số thứ tự UC trong file chào giá. Tài liệu khác dẫn bằng `PS:<mã gốc>`.
- **Tên**: tên UC, thường là "động từ + đối tượng".
- **Actor**: người dùng hoặc hệ thống thực hiện UC, viết như file chào giá (bảng tác nhân dưới).
- **Phân hệ**: nhóm chức năng trong file chào giá, ghi đủ các cấp.
- **Mô tả luồng**: các bước người dùng làm và phần mềm phản hồi; `<br>` là xuống dòng trong ô gốc.
- **Nguồn**: vị trí trong file chào giá. **Chức năng**: UC thuộc chức năng CN-xx nào; bước 1 để trống, bước 2 điền.

Tác nhân (cột "Actor"): bảng "Viết tắt | Là ai (theo file chào giá) | Số UC", lấy từ danh sách tác nhân của file chào
giá kèm [SRC]. Tác nhân không có trong danh sách đó → ghi rõ, kèm câu hỏi.

| Mã gốc | Tên (nguyên văn) | Actor (nguyên văn) | Phân hệ | Mô tả luồng (nguyên văn, nếu có) | Nguồn | Chức năng |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | [SRC: 0-inputs/presales/uc/<tệp>.xlsx, <sheet>, dòng <n>] | |

- Nguồn ghi đúng dạng `[SRC: <tệp>, <sheet>, dòng <n>]` (n là số dòng trong Excel) để máy đối chiếu được.

- Cột "Chức năng" (CN-xx) để trống ở bước 1; bước 2 (`/ba-overview`) điền.
- Mã gốc trùng nhau trong file presales: giữ cả hai dòng, ghi phát hiện và câu hỏi.
- Dòng không có mã gốc: ghi "—" ở cột mã, ghi phát hiện.

## 2. Thống kê
Cách đọc bảng: số UC theo từng nhóm chức năng của file chào giá; dòng in đậm là cộng của nhóm cấp 1. "Có mô tả
luồng" là số UC có cột "Mô tả luồng".

| Phân hệ | Số UC | Có mô tả luồng |
| --- | --- | --- |
