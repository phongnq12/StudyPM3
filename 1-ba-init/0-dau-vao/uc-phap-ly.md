# Ma trận UC presales × pháp lý — Quản lý kho căng tin
| Số UC presales | Có căn cứ pháp lý | Không có căn cứ | Số điều khoản | Có UC | Chưa có UC | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 31 | 5 | 26 | 12 | 10 | 2 (mục 3: 1 áp dụng chung, 1 ngoài phần mềm; 0 lý do "chưa có UC") | 2026-10-29 | draft |

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
- `1-ba-init/0-dau-vao/uc-presales.md`: danh sách UC presales (mã gốc, tên, actor, mô tả luồng). Cột "Actor" trống ở
  cả 31 UC [PH-001]; người làm từng UC lấy theo quyết định Q-001 (cán bộ căng tin lập, quản lý danh mục, giá, nhà cung
  cấp, kho; Trưởng cơ sở phê duyệt, từ chối, hủy phê duyệt; tổ kiểm kê đếm, lập biên bản kiểm kê)
  [SRC: 0-inputs/answers-2026-10-28.md, RQ-05, RQ-07, RQ-15, RQ-32, RQ-40].
- `1-ba-init/0-dau-vao/phap-ly.md` mục 2: danh sách điều khoản (chủ thể, hành vi, đối tượng, loại).
- `1-ba-init/0-dau-vao/quy-trinh-presales.md`: bước quy trình presales; presales không gắn UC cho bước nào [Q-014], nên
  bước chỉ dùng để thấy UC nằm ở khâu nào (ví dụ QP-04.05 "Duyệt đề xuất giá bán ≤ giá bán lẻ ĐP; mặt hàng không thuộc
  TT79 Đ16").
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

Tìm một mã: mở `1-ba-init/open-questions.md`, tìm đúng mã (ví dụ `Q-005`). "n/a" là không cần mã nào.

**Tóm tắt.** 5 trên 31 UC presales có căn cứ pháp lý, cả 5 thuộc giá bán và giá nhập: danh mục hàng hóa căng tin,
phê duyệt, từ chối, hủy phê duyệt đơn giá bán (`PM3CSCN.WEB.10.01.01` → `04`) và giá nhập theo nhà cung cấp
(`PM3CSCN.WEB.15.03.01`). 26 UC không có căn cứ: 15 `chưa tìm thấy` (mọi UC lập, duyệt, từ chối, hủy phê duyệt, in
phiếu nhập kho, phiếu điều chuyển, biên bản kiểm kê — [Q-019]; hồ sơ nhà cung cấp và danh mục hàng hóa theo nhà cung
cấp — [Q-020]), 9 `tiện ích` (tra cứu, xem, kết xuất, theo dõi lịch sử), 2 `quản trị hệ thống` (danh mục kho, cấu
hình hạn mức cảnh báo), 0 `nội bộ`. Lý do: các văn bản trong `0-inputs/phap-ly/` chỉ chi phối giá bán và loại hàng của
căng tin, không có điều khoản nào về chứng từ kho, kiểm kê hàng căng tin hay nhà cung cấp (`phap-ly.md` mục 3, [PH-006]).
10 trên 12 điều khoản có UC; 2 điều khoản không có UC: `TT79-2026/Đ6.K2` (áp dụng chung: vị trí việc làm căng tin) và
`TT79-2026/Đ41.K7` (ngoài phần mềm: sử dụng tiền qua hệ thống bán hàng căng tin, ngoài phạm vi theo RQ-03; hệ thống
bán hàng tự đọc dữ liệu kho theo RQ-54). Không điều
khoản nào ở lý do `chưa có UC`, nên không có phát hiện loại `điều khoản chưa có UC`. Mục 1 có 22 cặp: theo quan hệ 1
`thực hiện`, 10 `ràng buộc`, 1 `dữ liệu`, 10 `đối tượng`; theo cách ghép 22 `đối chiếu`, 0 `presales` (quy trình
presales nhắc "TT79 Đ16" ở bước QP-04.05 nhưng không gắn bước với UC [Q-014]). 9 cặp dựa trên giả định chờ xác nhận: [ASM-006]
(8 cặp — hàng hóa căng tin nhập từ nhà cung cấp thuộc diện "đưa vào cơ sở cai nghiện ma túy" của Điều 16, nên danh mục
hàng hóa căng tin không được có thứ thuộc Điều 16), [ASM-004] (1 cặp — hủy phê duyệt giá bán thuộc thẩm quyền duyệt
giá bán của Trưởng cơ sở). 1 cặp (giá nhập ↔ Điều 41 khoản 4) dựa trên giả định BA đã chấp nhận `<span style="color:red">**<u>GD-0001</u>**</span>`: chi phí
hợp lý tính bên ngoài hệ thống, người dùng nhập giá bán lớn hơn hoặc bằng giá nhập (Q-005, Q-006 đã quyết theo RQ-53).
Cặp ghép còn chờ câu hỏi: Q-008 (đồ vật cấm có tính bao bì không). Q-007 (phạm vi hàng hóa) đã quyết theo RQ-49: hai câu
của TT79 Đ41.K4 và NĐ163 Đ120.K3 coi là cùng nghĩa, hệ thống không phân loại nhóm hàng. Q-017 đã quyết theo RQ-52: việc
lập đề xuất giá bán (hộp "Quyết định giá bán") thuộc `PM3CSCN.WEB.10.01.01` [PH-017]. Văn bản áp dụng: TT79 và NĐ163
(tệp chính) [SRC: 0-inputs/answers-2026-10-29.md, RQ-48].

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

| Quan hệ | Nghĩa là | Số cặp | Ví dụ |
| --- | --- | --- | --- |
| thực hiện | UC chính là việc điều khoản bắt phải làm | 1 | `TT79-2026/Đ41.K4` "Giá bán … phải được Trưởng cơ sở cai nghiện ma túy duyệt" ↔ `PM3CSCN.WEB.10.01.02` Phê duyệt đơn giá bán hàng hóa căng tin trước khi công bố |
| ràng buộc | Điều khoản đặt điều kiện, thời hạn hoặc quy định ai có quyền lên việc UC làm | 10 | `TT79-2026/Đ16.K4` (rượu, bia, thuốc lá … cấm đưa vào cơ sở) ↔ `PM3CSCN.WEB.10.01.02`: Trưởng cơ sở loại trừ đồ vật cấm khi duyệt giá đầu của mặt hàng |
| dữ liệu | Điều khoản quy định nội dung, thông tin mà UC phải ghi lại hoặc dùng để đối chiếu | 1 | `TT79-2026/Đ41.K4` "sau khi trừ chi phí hợp lý" ↔ `PM3CSCN.WEB.15.03.01` Quản lý giá nhập hàng hóa theo từng nhà cung cấp và từng đợt nhập |
| đối tượng | Điều khoản xác định ai, cái gì thuộc phạm vi UC quản lý | 10 | `TT79-2026/Đ41.K4` "lương thực, thực phẩm và đồ dùng sinh hoạt thiết yếu" ↔ `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin |

| Văn bản | Mã điều khoản | UC presales | Quan hệ | Ghép vì | Cách ghép |
| --- | --- | --- | --- | --- | --- |
| Nghị định 163/2026/NĐ-CP | NĐ163-2026/Đ120.K3 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng "lương thực, thực phẩm, hàng hóa và các đồ dùng thiết yếu khác tại căng tin" ↔ phạm vi mặt hàng của danh mục hàng hóa căng tin; chủ thể (người cai nghiện) và hành vi (sử dụng tiền lưu ký mua) thuộc bán hàng, ngoài phạm vi theo [SRC: 0-inputs/answers-2026-10-28.md, RQ-03], nên không ghép UC thực hiện; điều khoản thuộc Mục 12 (cai nghiện bắt buộc); phạm vi hàng coi là cùng nghĩa với `TT79-2026/Đ41.K4`, hệ thống không phân loại nhóm hàng, Trưởng cơ sở kiểm khi duyệt giá đầu [SRC: 0-inputs/answers-2026-10-29.md, RQ-49] (Q-007 đã quyết) | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K1 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "các loại vũ khí, vật liệu nổ, tiền chất thuốc nổ, công cụ hỗ trợ" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001): danh mục không được có thứ thuộc khoản này [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K1 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng, mặt hàng chưa có giá duyệt thì không bán được [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16" cùng việc với UC phê duyệt đơn giá bán | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K2 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "các chất ma túy, … chất gây mê, chất độc, … hóa chất, độc dược; các loại thuốc chữa bệnh, phòng bệnh" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001); thuốc có tính khi có chỉ định y tế không chờ Q-008 [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K2 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16"; cách xét thuốc chờ Q-008 | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K3 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "chất cháy và các chất, đồ vật dễ cháy" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001); mặt hàng như bật lửa có thuộc khoản này không chờ Q-008 [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K3 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16"; phạm vi khoản chờ Q-008 | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K4 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "rượu, bia, đồ uống có cồn, thuốc lá, thuốc lá điện tử, thuốc lá nung nóng, thuốc lào, xì gà các loại và các chất kích thích khác" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001); "chất kích thích khác" gồm gì chờ Q-008 [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K4 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16"; phạm vi khoản chờ Q-008 | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K5 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "các thiết bị dùng để đun nấu, đồ dùng bằng kim loại, sành, sứ, đá, đất nung, thủy tinh, phích nước" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001); bao bì kim loại, thủy tinh của hàng ăn uống có tính không chờ Q-008 [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K5 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16"; bao bì chờ Q-008 | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K6 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "các tài sản có giá trị …; các loại máy ghi âm, máy ghi hình, máy nghe, nhìn, đồng hồ, điện thoại, bộ đàm …" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001) [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K6 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16" | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K7 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "sách, báo bằng tiếng nước ngoài chưa qua kiểm duyệt; các ấn phẩm về tôn giáo, tín ngưỡng không được phép lưu hành; tranh ảnh, phim, băng, đĩa có nội dung …" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001) [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K7 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16" | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K8 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng cấm đưa vào cơ sở "các loại bài lá, các phương tiện, công cụ dùng để đánh bạc …; các đồ vật khác có thể gây mất an toàn cơ sở cai nghiện ma túy …" ↔ mặt hàng cán bộ căng tin thêm vào danh mục hàng hóa căng tin (Q-001) [ASM-006] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ16.K8 | `PM3CSCN.WEB.10.01.02` | ràng buộc | Trưởng cơ sở loại trừ chất cấm, đồ vật cấm Điều 16 khi duyệt giá đầu của mặt hàng [SRC: 0-inputs/answers-2026-10-28.md, RQ-24]; bước QP-04.05 "Duyệt đề xuất giá bán … mặt hàng không thuộc TT79 Đ16" | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ41.K4 | `PM3CSCN.WEB.10.01.01` | đối tượng | Đối tượng căng tin bán "lương thực, thực phẩm và đồ dùng sinh hoạt thiết yếu cho người cai nghiện ma túy" ↔ phạm vi mặt hàng của danh mục hàng hóa căng tin; coi là cùng nghĩa với `NĐ163-2026/Đ120.K3`, hệ thống không phân loại nhóm hàng [SRC: 0-inputs/answers-2026-10-29.md, RQ-49] (Q-007 đã quyết); UC này cũng gồm việc lập đề xuất giá bán (hộp "Quyết định giá bán") trình Trưởng cơ sở duyệt [SRC: 0-inputs/answers-2026-10-29.md, RQ-52] (Q-017 đã quyết) | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ41.K4 | `PM3CSCN.WEB.10.01.02` | thực hiện | Chủ thể "Trưởng cơ sở cai nghiện ma túy" ↔ người phê duyệt đơn giá bán (Q-001); hành vi "duyệt" ↔ "Phê duyệt"; đối tượng "giá bán lương thực, thực phẩm và các loại hàng hóa" ↔ "đơn giá bán hàng hóa căng tin"; hai điều kiện "sau khi trừ chi phí hợp lý" (chi phí hợp lý tính bên ngoài hệ thống, giá bán nhập vào lớn hơn hoặc bằng giá nhập [SRC: 0-inputs/answers-2026-10-29.md, RQ-53] `<span style="color:red">**<u>GD-0001</u>**</span>`; Q-005, Q-006 đã quyết) và "không được cao hơn giá bán lẻ tại địa phương đối với hàng hóa cùng loại" đặt lên chính việc duyệt (bước QP-04.05 "≤ giá bán lẻ ĐP") | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ41.K4 | `PM3CSCN.WEB.10.01.03` | ràng buộc | Từ chối là nhánh không đồng ý của việc duyệt giá bán do Trưởng cơ sở cai nghiện ma túy làm (Q-001; bước QP-04.06 "Đồng ý?" nhánh "Không, ghi lý do"); giá bán cao hơn giá bán lẻ tại địa phương đối với hàng hóa cùng loại không được duyệt | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ41.K4 | `PM3CSCN.WEB.10.01.04` | ràng buộc | Hủy phê duyệt rút lại giá bán đã được Trưởng cơ sở cai nghiện ma túy duyệt; người duyệt là người hủy duyệt [SRC: 0-inputs/answers-2026-10-28.md, RQ-40]; điều khoản chỉ nói "duyệt", không nói hủy duyệt [ASM-004] | đối chiếu |
| Thông tư 79/2026/TT-BCA | TT79-2026/Đ41.K4 | `PM3CSCN.WEB.15.03.01` | dữ liệu | Giá bán được duyệt "sau khi trừ chi phí hợp lý" ↔ giá nhập theo từng nhà cung cấp và từng đợt nhập là số liệu đối chiếu khi duyệt (đề xuất giá bán kèm giá nhập, chi phí hợp lý, giá bán lẻ địa phương [SRC: 0-inputs/answers-2026-10-28.md, RQ-08]); chi phí hợp lý tính bên ngoài hệ thống, người dùng nhập giá bán lớn hơn hoặc bằng giá nhập [SRC: 0-inputs/answers-2026-10-29.md, RQ-53] `<span style="color:red">**<u>GD-0001</u>**</span>` (Q-005, Q-006 đã quyết; ASM-005 đã xác nhận) | đối chiếu |

- Một dòng cho một cặp (điều khoản, UC). Một UC dựa trên nhiều điều khoản → nhiều dòng; sắp theo văn bản, rồi mã điều
  khoản, rồi mã gốc UC.
- Văn bản: ghi đúng tên ở `phap-ly.md` mục 1 (máy đối chiếu).
- Không ghép theo chữ trùng: các UC tra cứu, kết xuất cùng đối tượng (ví dụ `PM3CSCN.WEB.10.01.05` có chữ "lịch sử thay
  đổi giá") không ghép với `TT79-2026/Đ41.K4` vì không cùng hành vi "duyệt".
- `TT79-2026/Đ16.K1` → `K8` không ghép với UC phiếu nhập kho (`PM3CSCN.WEB.09.01.01`) hay danh mục hàng hóa theo nhà
  cung cấp (`PM3CSCN.WEB.15.02.01`): phiếu nhập chỉ chọn mặt hàng đã có trong danh mục của nhà cung cấp
  [SRC: 0-inputs/answers-2026-10-28.md, RQ-16], và điểm kiểm đồ vật cấm BA đã chốt là lúc duyệt giá đầu của mặt hàng
  [SRC: 0-inputs/answers-2026-10-28.md, RQ-24].

## 2. UC presales không có căn cứ pháp lý
Cách đọc bảng: mỗi dòng một UC presales không dựa trên điều khoản nào ở `phap-ly.md`. Cột "Lý do" cho biết vì
sao, cột "Q / PH" là câu hỏi hoặc phát hiện đi kèm ("n/a" là không cần).

| Lý do | Nghĩa là | Cần làm gì | Ví dụ trong file này | Số UC |
| --- | --- | --- | --- | --- |
| tiện ích | Việc phục vụ người dùng (tra cứu, kết xuất, xem bảng điều hành, báo cáo, nhắc hạn, thông báo), luật không bắt buộc | Không cần căn cứ luật | `PM3CSCN.WEB.09.01.06` Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu nhập kho căng tin | 9 |
| quản trị hệ thống | Việc vận hành phần mềm: tài khoản, phân quyền, danh mục, cấu hình | Không cần căn cứ luật | `PM3CSCN.WEB.09.04.02` Thêm/Sửa/Xóa kho | 2 |
| nội bộ | Nghiệp vụ do đơn vị tự đặt ra, luật không điều chỉnh | Không cần căn cứ luật; có văn bản nội bộ thì phải ghép ở mục 1 | Không có trong file này | 0 |
| chưa tìm thấy | Nghiệp vụ có vẻ phải theo luật, nhưng văn bản trong `0-inputs/` không có điều khoản tương ứng | Bắt buộc có câu hỏi: thiếu văn bản hay không do luật điều chỉnh; trả lời trước G1 | `PM3CSCN.WEB.09.01.01` Tạo / Cập nhật phiếu nhập kho hàng hóa căng tin mới nhập từ nhà cung cấp | 15 |

| Mã gốc | Tên (nguyên văn) | Lý do | Q / PH |
| --- | --- | --- | --- |
| `PM3CSCN.WEB.09.01.01` | Tạo / Cập nhật phiếu nhập kho hàng hóa căng tin mới nhập từ nhà cung cấp | chưa tìm thấy | [Q-019]; liên quan Q-009, Q-010, PH-006 |
| `PM3CSCN.WEB.09.01.02` | Phê duyệt phiếu nhập kho hàng hóa căng tin và tăng tồn kho | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.01.03` | Từ chối phiếu nhập kho hàng hóa căng tin | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.01.04` | Hủy phê duyệt phiếu nhập kho hàng hóa căng tin | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.01.05` | In phiếu nhập kho hàng hóa căng tin phục vụ lưu trữ kế toán | chưa tìm thấy | [Q-019]; liên quan Q-009 (mẫu chứng từ, chế độ kế toán), PH-006 |
| `PM3CSCN.WEB.09.01.06` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu nhập kho căng tin | tiện ích | n/a |
| `PM3CSCN.WEB.09.02.01` | Tạo phiếu xuất kho, điều chuyển nhu yếu phẩm sang quầy bán căng tin | chưa tìm thấy | [Q-019]; liên quan Q-009, Q-010, PH-006 |
| `PM3CSCN.WEB.09.02.02` | Phê duyệt phiếu xuất kho / điều chuyển hàng hóa căng tin | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.02.03` | Từ chối phiếu xuất kho / điều chuyển hàng hóa căng tin | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.02.04` | Hủy phê duyệt phiếu xuất kho / điều chuyển | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.02.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu xuất kho, điều chuyển | tiện ích | n/a |
| `PM3CSCN.WEB.09.03.01` | Lập biên bản kiểm kê số lượng tồn kho thực tế tại quầy căng tin và ghi nhận chênh lệch | chưa tìm thấy | [Q-019]; liên quan Q-009, Q-010, PH-006 |
| `PM3CSCN.WEB.09.03.02` | Phê duyệt kết quả kiểm kê và thực hiện điều chỉnh số dư kho tự động | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.03.03` | Từ chối kết quả kiểm kê khi phát hiện sai sót | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.03.04` | Hủy phê duyệt biên bản kiểm kê tồn kho | chưa tìm thấy | [Q-019]; liên quan Q-010 |
| `PM3CSCN.WEB.09.03.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất biên bản kiểm kê kho căng tin | tiện ích | n/a |
| `PM3CSCN.WEB.09.04.01` | Xem/Tìm kiếm danh sách kho | tiện ích | n/a |
| `PM3CSCN.WEB.09.04.02` | Thêm/Sửa/Xóa kho | quản trị hệ thống | n/a |
| `PM3CSCN.WEB.09.04.03` | Cấu hình hạn mức cảnh báo | quản trị hệ thống | n/a |
| `PM3CSCN.WEB.09.04.04` | Theo dõi lịch sử Nhập/Điều chuyển kho | tiện ích | n/a |
| `PM3CSCN.WEB.10.01.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh mục hàng hóa và lịch sử thay đổi giá | tiện ích | n/a |
| `PM3CSCN.WEB.15.01.01` | Quản lý hồ sơ nhà cung cấp hàng hóa căng tin | chưa tìm thấy | [Q-020] |
| `PM3CSCN.WEB.15.01.02` | Tra cứu và kết xuất danh sách nhà cung cấp hàng hóa căng tin | tiện ích | n/a |
| `PM3CSCN.WEB.15.02.01` | Quản lý danh mục hàng hóa cung ứng theo từng nhà cung cấp | chưa tìm thấy | [Q-020] |
| `PM3CSCN.WEB.15.02.02` | Tra cứu và kết xuất danh mục hàng hóa theo nhà cung cấp | tiện ích | n/a |
| `PM3CSCN.WEB.15.03.02` | Tra cứu và kết xuất lịch sử giá nhập theo nhà cung cấp | tiện ích | n/a |

- Lý do: một trong bốn giá trị ở bảng trên; `chưa tìm thấy` **bắt buộc** có Q.
- Một UC không được vừa ở mục 1 vừa ở mục 2.
- `chưa tìm thấy` (15 UC): 13 UC lập, duyệt, từ chối, hủy phê duyệt, in chứng từ kho (phiếu nhập kho, phiếu xuất kho /
  điều chuyển, biên bản kiểm kê) là UC xử lý chứng từ làm thay đổi tồn kho; `0-inputs/phap-ly/` không có văn bản về chứng
  từ kho, kiểm kê hàng hóa căng tin, chế độ kế toán (`phap-ly.md` mục 0, mục 3) [Q-019]. 2 UC hồ sơ nhà cung cấp và
  danh mục hàng hóa theo nhà cung cấp: `0-inputs/` không có văn bản về lựa chọn, quản lý nhà cung cấp của cơ sở
  [Q-020].
- `tiện ích` (9 UC): tên UC là tra cứu, xem, kết xuất hoặc theo dõi lịch sử; UC không tạo, không duyệt chứng từ.
- `quản trị hệ thống` (2 UC): danh mục kho và cấu hình hạn mức cảnh báo (tồn tối thiểu, số ngày cảnh báo do cán bộ
  căng tin thiết lập, không duyệt [SRC: 0-inputs/answers-2026-10-28.md, RQ-33]).

## 3. Điều khoản chưa có UC presales
Cách đọc bảng: mỗi dòng một điều khoản ở `phap-ly.md` chưa có UC presales nào thực hiện. Cột "Lý do" cho biết
vì sao, cột "PH" là phát hiện đi kèm.

| Lý do | Nghĩa là | Cần làm gì | Ví dụ trong file này | Số điều khoản |
| --- | --- | --- | --- | --- |
| chưa có UC | Điều khoản chi phối nghiệp vụ mà báo giá chưa có UC làm việc đó | Bắt buộc có phát hiện loại `điều khoản chưa có UC`; bước 2 quyết thêm UC hay ngoài phạm vi | Không có trong file này | 0 |
| áp dụng chung | Điều khoản nêu phạm vi, nội dung chung hoặc chế tài cho cả quy trình, không gắn riêng UC nào | Không cần UC riêng | `TT79-2026/Đ6.K2` vị trí việc làm "căng tin" | 1 |
| ngoài phần mềm | Việc làm hoàn toàn trên giấy, ngoài hệ thống | Ghi rõ căn cứ vì sao ngoài phần mềm | `TT79-2026/Đ41.K7` sử dụng tiền trong căng tin qua hệ thống bán hàng căng tin | 1 |

| Mã điều khoản | Tóm tắt | Lý do | PH |
| --- | --- | --- | --- |
| `TT79-2026/Đ6.K2` | Khung danh mục vị trí việc làm tại cơ sở cai nghiện ma túy công lập có vị trí "căng tin" trong nhóm "Tham mưu, hành chính, tổng hợp; …". Điều khoản xác định vị trí việc làm của người dùng (cán bộ căng tin theo Q-001, từ chuẩn chờ Q-013), chung cho mọi UC do cán bộ căng tin làm, không gắn riêng UC nào | áp dụng chung | n/a |
| `TT79-2026/Đ41.K7` | "Việc sử dụng tiền trong căng tin được thực hiện qua hệ thống bán hàng căng tin trong cơ sở cai nghiện ma túy, bảo đảm minh bạch, thuận tiện trong quản lý giao dịch". Việc này do Hệ thống bán hàng căng tin làm, là hệ thống khác, ngoài phạm vi phần mềm kho [SRC: 0-inputs/answers-2026-10-28.md, RQ-03]; Hệ thống bán hàng căng tin tự đọc dữ liệu kho (giá bán theo lô, khóa và mở khóa bán tại kho), phần mềm kho không có UC tích hợp riêng [SRC: 0-inputs/answers-2026-10-29.md, RQ-54] (Q-015 đã quyết) | ngoài phần mềm | PH-015 (điểm chạm với Hệ thống bán hàng căng tin, Q-015 đã quyết B) |

- Lý do: một trong ba giá trị ở bảng trên; `chưa có UC` **bắt buộc** có PH loại `điều khoản chưa có UC`.
- `TT79-2026/Đ41.K7` ghi `ngoài phần mềm` theo nghĩa ngoài hệ thống của dự án (việc nằm ở Hệ thống bán hàng căng tin),
  không phải việc trên giấy.
