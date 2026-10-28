# Ma trận UC presales × pháp lý — <tên dự án>
| Số UC presales | Có căn cứ pháp lý | Không có căn cứ | Số điều khoản | Có UC | Chưa có UC | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | YYYY-MM-DD | draft |

**File này dùng để làm gì.** Nối hai danh mục với nhau: UC presales (những việc phần mềm đã chào giá sẽ làm,
`uc-presales.md`) và điều khoản pháp luật (`phap-ly.md`). Mục đích là kiểm cả hai chiều:
- Mỗi UC presales phải **có căn cứ pháp lý**: ít nhất một điều khoản làm căn cứ (mục 1), hoặc ghi rõ vì sao không có
  (mục 2).
- Mỗi điều khoản phải **có UC thực hiện**: có UC làm việc điều khoản quy định (mục 1), hoặc ghi rõ vì sao không có
  (mục 3). Điều khoản chưa có UC là dấu hiệu báo giá đang thiếu chức năng luật bắt buộc.

Đọc mục 1 theo văn bản để thấy mỗi điều khoản rơi vào UC nào; lọc theo cột "UC presales" để thấy một UC dựa trên những
điều khoản nào. Đây là bảng **ghép đề xuất**: chỉ nối, không đánh giá UC đúng sai, không thêm UC. BA xác nhận ở vòng
hỏi của bước 1.

**Lấy dữ liệu từ:**
- `1-ba-init/0-dau-vao/uc-presales.md`: danh sách UC presales (mã gốc, tên, actor, mô tả luồng).
- `1-ba-init/0-dau-vao/phap-ly.md` mục 2: danh sách điều khoản (chủ thể, hành vi, đối tượng, loại).
- `1-ba-init/0-dau-vao/quy-trinh-presales.md` (nếu có): bước quy trình presales gắn UC, để biết UC nằm ở khâu nào.
- `1-ba-init/open-questions.md`: các mã `[Q-xxx]` (câu hỏi), `[ASM-xxx]` (giả định), `[PH-xxx]` (phát hiện) dẫn trong file (giải thích ngay dưới).

**Được dùng ở:**
- Bước 2 /ba-overview: ma trận UC × quy trình (biết bước nào của quy trình có căn cứ luật); quyết định giữ hay bỏ UC
  (UC có căn cứ luật thì không được bỏ).
- Bước 4: yêu cầu nghiệp vụ có nguồn từ luật.
- Bước 9: business rule (rule dẫn về điều khoản, điều khoản dẫn về UC).
- Gate: UC "chưa tìm thấy" căn cứ (mục 2) phải được trả lời trước G1; điều khoản "chưa có UC" (mục 3) đi kèm phát hiện
  cho bước 2 quyết.

**Q, PH, ASM là gì, nằm ở đâu.** Cả ba là mã trong sổ câu hỏi của bước 1 `1-ba-init/open-questions.md` (từ bước 2 trở đi: `du-an/open-questions.md`):
| Mã | Là gì | Nằm ở | Ai xử lý |
| --- | --- | --- | --- |
| `Q-xxx` | **Câu hỏi**: điều BA không tự quyết được, cần khách hoặc PM trả lời (kèm các phương án, hỏi ai, chặn gate nào) | `1-ba-init/open-questions.md` mục 1 "Câu hỏi" | Khách, PM trả lời; BA ghi quyết định |
| `PH-xxx` | **Phát hiện**: chỗ thiếu, chỗ lệch BA thấy khi đối chiếu các nguồn (ví dụ luật có mà báo giá chưa có) | `1-ba-init/open-questions.md` mục 3 "Phát hiện" | Bước 2 quyết; cần khách trả lời thì kèm một Q |
| `ASM-xxx` | **Giả định**: điều BA tạm coi là đúng để làm tiếp khi nguồn chưa nói rõ | `1-ba-init/open-questions.md` mục 2 "Giả định" | BA, khách xác nhận hoặc bác bỏ |

Tìm một mã: mở `1-ba-init/open-questions.md`, tìm đúng mã (ví dụ `Q-026`). "n/a" là không cần mã nào.

**Tóm tắt.** Vài dòng bằng lời thường, đếm từ mục 1–3: số UC có căn cứ, không có (theo từng lý do; bao nhiêu
"chưa tìm thấy" đang chờ câu hỏi); số điều khoản có UC, chưa có (theo lý do, PH nào); số cặp ở mục 1 theo quan hệ, theo
cách ghép; số cặp dựa trên giả định và các giả định chính (mã, số cặp, nội dung một câu).

**Căn cứ chuẩn:** ISO/IEC/IEEE 29148:2018 mục 5.2.8 (truy vết hai chiều giữa yêu cầu và nguồn) và 9.3 (BRS: quy định
chi phối nghiệp vụ); BABOK v3 mục 7.1 "Trace Requirements" (quan hệ derive, satisfy) và 10.9 "Business Rules Analysis".

## 1. Ma trận (theo văn bản, theo mã điều khoản)
Cách đọc bảng: mỗi dòng là một cặp (điều khoản, UC presales). Một điều khoản rơi vào nhiều UC, hoặc một UC dựa
trên nhiều điều khoản, thì có nhiều dòng.
- **Văn bản, Mã điều khoản**: như `phap-ly.md`. **UC presales**: mã gốc trong `uc-presales.md`.
- **Quan hệ**: điều khoản liên quan tới UC theo cách nào (bảng dưới).
- **Ghép vì**: một câu chỉ ra chỗ khớp giữa điều khoản và UC: ai làm (chủ thể ↔ người dùng của UC), làm gì (hành vi ↔
  tên UC), với cái gì (đối tượng ↔ thông tin UC xử lý). Có `[ASM-xxx]` ở cuối là ghép theo giả định, chờ BA xác nhận.
- **Cách ghép**: `presales` khi chính UC presales nhắc tới văn bản, điều khoản; `đối chiếu` khi BA so nội dung hai bên
  để ghép.

| Quan hệ | Nghĩa là | Ví dụ |
| --- | --- | --- |
| thực hiện | UC chính là việc điều khoản bắt phải làm | Điều khoản "Trưởng phòng duyệt đơn" ↔ UC "Duyệt đơn" |
| ràng buộc | Điều khoản đặt điều kiện, thời hạn hoặc quy định ai có quyền lên việc UC làm | Điều khoản "duyệt trong 03 ngày" ↔ UC "Duyệt đơn" |
| dữ liệu | Điều khoản quy định nội dung, thông tin mà UC phải ghi lại hoặc dùng để đối chiếu | Điều khoản "Đơn theo Mẫu số 01" ↔ UC "Tạo đơn" |
| đối tượng | Điều khoản xác định ai, cái gì thuộc phạm vi UC quản lý | Điều khoản "áp dụng với người có hợp đồng từ 12 tháng" ↔ UC "Tạo đơn" |

Bản dự án: thêm cột "Số cặp" và lấy ví dụ là cặp thật trong file.

| Văn bản | Mã điều khoản | UC presales | Quan hệ | Ghép vì | Cách ghép |
| --- | --- | --- | --- | --- | --- |
| Thông tư … | TT79-2026/Đ12.K2 | `<mã gốc>` | thực hiện | <chủ thể, hành vi của điều khoản khớp actor, tên UC> | đối chiếu |

- Một dòng cho một cặp (điều khoản, UC). Một UC dựa trên nhiều điều khoản → nhiều dòng; sắp theo văn bản, rồi mã điều
  khoản, rồi mã gốc UC.
- Văn bản: ghi đúng tên ở `phap-ly.md` mục 1 (máy đối chiếu).
- Quan hệ: một trong bốn giá trị ở bảng trên.
- Ghép vì: một câu chỉ ra chỗ khớp (chủ thể ↔ actor, hành vi ↔ tên UC, đối tượng ↔ dữ liệu của UC). Không chắc →
  thêm `[ASM-xxx]` ở cuối ô.
- Cách ghép: `presales` (UC presales hoặc quy trình presales nhắc thẳng văn bản, điều khoản) / `đối chiếu` (agent so
  nội dung).

## 2. UC presales không có căn cứ pháp lý
Cách đọc bảng: mỗi dòng một UC presales không dựa trên điều khoản nào ở `phap-ly.md`. Cột "Lý do" cho biết vì
sao, cột "Q / PH" là câu hỏi hoặc phát hiện đi kèm ("n/a" là không cần).

| Lý do | Nghĩa là | Cần làm gì |
| --- | --- | --- |
| tiện ích | Việc phục vụ người dùng (tra cứu, kết xuất, xem bảng điều hành, báo cáo, nhắc hạn, thông báo), luật không bắt buộc | Không cần căn cứ luật |
| quản trị hệ thống | Việc vận hành phần mềm: tài khoản, phân quyền, danh mục, cấu hình | Không cần căn cứ luật |
| nội bộ | Nghiệp vụ do đơn vị tự đặt ra, luật không điều chỉnh | Không cần căn cứ luật; có văn bản nội bộ thì phải ghép ở mục 1 |
| chưa tìm thấy | Nghiệp vụ có vẻ phải theo luật, nhưng văn bản trong `0-inputs/` không có điều khoản tương ứng | Bắt buộc có câu hỏi: thiếu văn bản hay không do luật điều chỉnh; trả lời trước G1 |

Bản dự án: thêm cột "Ví dụ trong file này", "Số UC".

| Mã gốc | Tên (nguyên văn) | Lý do | Q / PH |
| --- | --- | --- | --- |

- Lý do: một trong bốn giá trị ở bảng trên; `chưa tìm thấy` **bắt buộc** có Q.
- Một UC không được vừa ở mục 1 vừa ở mục 2.

## 3. Điều khoản chưa có UC presales
Cách đọc bảng: mỗi dòng một điều khoản ở `phap-ly.md` chưa có UC presales nào thực hiện. Cột "Lý do" cho biết
vì sao, cột "PH" là phát hiện đi kèm.

| Lý do | Nghĩa là | Cần làm gì |
| --- | --- | --- |
| chưa có UC | Điều khoản chi phối nghiệp vụ mà báo giá chưa có UC làm việc đó | Bắt buộc có phát hiện loại `điều khoản chưa có UC`; bước 2 quyết thêm UC hay ngoài phạm vi |
| áp dụng chung | Điều khoản nêu phạm vi, nội dung chung hoặc chế tài cho cả quy trình, không gắn riêng UC nào | Không cần UC riêng |
| ngoài phần mềm | Việc làm hoàn toàn trên giấy, ngoài hệ thống | Ghi rõ căn cứ vì sao ngoài phần mềm |

Bản dự án: thêm cột "Ví dụ trong file này", "Số điều khoản".

| Mã điều khoản | Tóm tắt | Lý do | PH |
| --- | --- | --- | --- |

- Lý do: một trong ba giá trị ở bảng trên; `chưa có UC` **bắt buộc** có PH loại `điều khoản chưa có UC`.
