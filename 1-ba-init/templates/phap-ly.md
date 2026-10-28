# Danh mục pháp lý — <tên dự án>
| Số văn bản | Số điều khoản | Cập nhật | Trạng thái |
| --- | --- | --- | --- |
| | | YYYY-MM-DD | draft |

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
- `0-inputs/khac/`: văn bản nghiệp vụ có quy định trình tự làm việc (nếu có).
- `0-inputs/answers-<ngày>.md`: câu trả lời của BA (văn bản nào áp dụng, hiệu lực…).
- `1-ba-init/open-questions.md`: các mã `[Q-xxx]` (câu hỏi), `[ASM-xxx]` (giả định) dẫn trong file.

**Được dùng ở:**
- `uc-phap-ly.md` (bước 1): ghép từng điều khoản với UC presales, để biết UC nào có căn cứ pháp lý, điều khoản nào
  chưa có UC thực hiện.
- Bước 2 /ba-overview: dựng quy trình (điều khoản thủ tục, thẩm quyền, thời hạn thành bước, làn, mốc thời gian),
  danh mục chức năng (cột Điều khoản); bước 5 quy trình chi tiết; bước 9 business rule (cột "Hướng BR").
- Bước 6 ERD: mục 3 "Biểu mẫu" để đối chiếu các trường bắt buộc theo luật.
- `brief.md` của từng chức năng: các điều khoản chi phối chức năng, tóm tắt chép từ đây.
- Tài liệu khác dẫn điều khoản bằng `PL:<mã điều khoản>`.

**Tóm tắt.** Vài dòng bằng lời thường, đếm từ mục 1–3: số văn bản (văn bản nào không áp dụng và vì sao); số điều khoản
theo văn bản; theo loại; số điều khoản có hướng BR (theo từng hướng) và không; hiệu lực (bao nhiêu chờ xác nhận, câu
hỏi nào); số biểu mẫu đã có, chưa có trường; số điều khoản đã có UC (theo `uc-phap-ly.md`, khi đã có); phần còn chờ.

**Căn cứ chuẩn:** ISO/IEC/IEEE 29148:2018 mục 9.3 (BRS: chính sách, quy định, ràng buộc chi phối nghiệp vụ) và 5.2 (truy vết về nguồn: `PL:<mã>`); BABOK v3 mục 10.18 "Document Analysis", 10.9 "Business Rules Analysis" (văn bản luật là nguồn rule); OMG SBVR 1.5 (rule định nghĩa, rule hành vi).

## 0. Văn bản đầu vào
Các văn bản BA đưa vào `0-inputs/` để làm căn cứ pháp lý cho dự án. Cột "Văn bản quy định về" chép Điều 1 "Phạm vi điều
chỉnh" của chính văn bản (văn bản không chia điều: lấy tiêu đề và phần nêu nội dung). Áp dụng cho dự án đến đâu xem mục 1.

| # | Văn bản | Tên đầy đủ | Văn bản quy định về | Áp dụng cho dự án | Tệp đầu vào |
| --- | --- | --- | --- | --- | --- |
| 1 | <loại> <số hiệu> (<cơ quan>, YYYY-MM-DD) | <trích yếu trên văn bản> | <Điều 1 Phạm vi điều chỉnh> [SRC: 0-inputs/phap-ly/<tệp>, Điều 1, dòng n] | có / không — như mục 1 | `0-inputs/phap-ly/<tệp>` |

- Mỗi tệp trong `0-inputs/phap-ly/` (và văn bản nghiệp vụ trong `0-inputs/khac/` được lấy điều khoản) một dòng, thứ tự
  như mục 1. Không tự tra văn bản ngoài `0-inputs/`.
- Văn bản được dẫn tới nhưng không có trong `0-inputs/`: ghi một dòng dưới bảng, trỏ câu hỏi.

## 1. Văn bản
Cách đọc bảng: mỗi dòng một văn bản. "Hiệu lực" là tình trạng theo chính văn bản và văn bản khác trong `0-inputs/` (còn
/ hết / chưa có hiệu lực, văn bản nào bãi bỏ văn bản nào). "Áp dụng cho dự án": văn bản có chi phối nghiệp vụ của phần
mềm không, phần nào, BA đã xác nhận chưa. "Số điều khoản lấy": số dòng của văn bản đó ở mục 2.

| Văn bản | Số hiệu | Cơ quan ban hành | Ngày ban hành | Ngày hiệu lực | Hiệu lực | Áp dụng cho dự án | Số điều khoản lấy | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Thông tư … | …/YYYY/TT-… | | | | còn / hết / chưa có hiệu lực | có / không — lý do | | [SRC: 0-inputs/phap-ly/<tệp>] |

- Không có số hiệu hoặc ngày hiệu lực trong tệp: ghi `[CẦN XÁC NHẬN]` kèm Q. Không tự tra rồi điền.
- "Áp dụng cho dự án": BA xác nhận ở vòng hỏi của bước 1.
- "Số điều khoản lấy": số dòng của văn bản ở mục 2 (máy đếm lại). Văn bản áp dụng mà lấy 0 điều khoản → ghi lý do
  trong cột "Áp dụng cho dự án".

## 2. Điều khoản
Cách đọc bảng:
- **Mã điều khoản**: `<loại văn bản><số>-<năm>/Đ<điều>.K<khoản>.<điểm>`, ví dụ `NĐ163-2026/Đ73.K2.b` là Nghị định
  163/2026, Điều 73 khoản 2 điểm b. Loại: L luật, NQ nghị quyết, NĐ nghị định, QĐ quyết định, TT thông tư, CT chỉ thị. Văn bản không có
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

| Loại | Điều khoản nói về | Thường nhận ra qua chữ | Sau này dùng để | Hướng BR thường gặp | Ví dụ |
| --- | --- | --- | --- | --- | --- |
| thủ tục | Các bước phải làm, làm theo thứ tự nào | "trình tự", "các bước", "sau khi … thì …" | Vẽ các bước trong quy trình nghiệp vụ | — (thành bước quy trình); ràng buộc khi bắt buộc đúng thứ tự | "phải có ý kiến Trưởng phòng trước khi trình Giám đốc" |
| thời hạn | Bao lâu, khi nào, bao lâu một lần | "trong thời hạn", "tối đa", "tối thiểu", "định kỳ" | Đặt mốc thời gian, nhắc hạn, cảnh báo quá hạn | thời hạn | "duyệt trong thời hạn 03 ngày làm việc" |
| thẩm quyền | Ai (cơ quan, chức danh) có quyền làm, quyết định, ký | "có thẩm quyền", "quyết định", "phê duyệt", "cấp" | Phân vai người dùng: ai được thấy, được duyệt, được ký | phân quyền | "Giám đốc duyệt nghỉ trên 05 ngày" |
| biểu mẫu | Phải dùng mẫu giấy tờ nào | "theo Mẫu số …", "Phụ lục …" | Xác định thông tin phần mềm phải lưu, phải in ra (mục 3) | — (thành thông tin lưu); kiểm liên trường khi các ô trên mẫu liên quan nhau | "đơn xin nghỉ theo Mẫu số 01" |
| điều kiện | Phải có, phải đạt gì; được hoặc không được làm gì | "phải", "bảo đảm", "không được", "tiêu chuẩn" | Làm tiêu chí kiểm tra, điều kiện chặn hoặc cho phép trong phần mềm | ràng buộc; suy diễn khi dùng để phân loại; tính toán khi có định mức | "chỉ được nghỉ phép năm khi đã làm đủ 12 tháng" |
| đối tượng | Áp dụng cho ai, cho việc gì; phạm vi, nội dung gồm những gì | "áp dụng đối với", "gồm" | Xác định phạm vi: phần mềm quản lý những ai, những nội dung nào | ràng buộc, suy diễn; — khi chỉ nêu phạm vi chung | "áp dụng với người có hợp đồng từ 12 tháng" |
| chế tài | Vi phạm thì bị xử lý, chịu hậu quả gì | "bị đình chỉ", "bị thu hồi", "xử lý" | Ghi hậu quả phần mềm phải theo dõi sau khi có quyết định xử lý | suy diễn; tính toán khi có mức tiền | "nghỉ quá hạn bị coi là nghỉ không lương" |

Bản dự án: thêm cột "Số điều khoản" và lấy ví dụ là điều khoản thật trong file.

**Hướng BR là gì.** BR (business rule) là **quy tắc nghiệp vụ**: một điều luật bắt buộc mà phần mềm phải tự áp dụng
khi người dùng làm việc, ví dụ tự chặn khi chưa đủ điều kiện, tự nhắc khi sắp quá hạn, tự tính một con số, chỉ cho đúng
người được bấm nút. Cột "Hướng BR" ghi **dự kiến** điều khoản đó sẽ thành loại quy tắc nào. Ở bước này chỉ ghi hướng;
câu quy tắc cụ thể viết ở bước 9, khi đó BA có thể đổi hướng nếu thấy chưa đúng. Có 7 giá trị:

| Hướng BR | Nghĩa là | Phần mềm sẽ làm gì | Ví dụ |
| --- | --- | --- | --- |
| ràng buộc | Luật bắt buộc phải có, phải làm, hoặc cấm làm | Kiểm tra và không cho làm tiếp, hoặc ghi là "không đạt", khi chưa đúng | "chỉ được nghỉ phép năm khi đã làm đủ 12 tháng" |
| thời hạn | Luật đặt mốc thời gian: hạn tối đa, tối thiểu, chu kỳ | Tính ngày đến hạn, nhắc trước, báo quá hạn | "duyệt trong thời hạn 03 ngày làm việc" |
| phân quyền | Luật quy định ai (chức danh, cơ quan) được làm hoặc được quyết một việc | Chỉ người có đúng vai trò mới thấy nút và được thao tác | "Giám đốc duyệt nghỉ trên 05 ngày" |
| tính toán | Luật cho một con số phải tính ra hoặc so với định mức (tỷ lệ, mức tiền, số người) | Tự tính từ số liệu đã nhập rồi so với định mức | "trừ 1 ngày phép cho mỗi 2 ngày nghỉ không phép" |
| suy diễn | Luật dạng "nếu xảy ra … thì …": từ một tình huống suy ra kết quả, hậu quả hoặc cách phân loại | Tự đưa ra kết luận hoặc đề xuất khi gặp tình huống đó | "nghỉ quá hạn bị coi là nghỉ không lương" |
| kiểm liên trường | Các thông tin trên cùng một mẫu phải khớp nhau | Kiểm ngay khi nhập, báo lỗi nếu hai ô mâu thuẫn | "Đến ngày không trước Từ ngày" |
| — | Điều khoản không thành quy tắc: chỉ mô tả một việc trong trình tự làm việc, hoặc một mẫu giấy tờ | Không có quy tắc riêng: việc đó thành một bước trong quy trình, mẫu giấy tờ thành thông tin phần mềm lưu | "hồ sơ gồm đơn theo Mẫu số 01" |

Loại `điều kiện`, `thời hạn`, `thẩm quyền` luôn có hướng BR, không để "—". Mọi điều khoản có hướng BR phải được bước 9
dùng tới; không dùng thì bước 9 ghi lý do. Bản dự án: thêm cột "Số điều khoản" và lấy ví dụ là điều khoản thật trong file.

| Mã điều khoản | Văn bản | Điều, khoản, điểm | Loại | Chủ thể | Hành vi | Đối tượng | Tóm tắt | Hướng BR | Hiệu lực | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TT79-2026/Đ12.K2 | Thông tư 79/2026/TT-BCA | Điều 12 khoản 2 | thời hạn | Trưởng phòng | duyệt | đơn nghỉ phép | … | thời hạn | còn | [SRC: 0-inputs/phap-ly/<tệp>, Điều 12 khoản 2] |

- Thứ tự dòng: theo văn bản (thứ tự mục 1), rồi theo điều, khoản, điểm.
- Loại: `thủ tục` / `thời hạn` / `thẩm quyền` / `biểu mẫu` / `điều kiện` / `đối tượng` / `chế tài`.
  Một điều khoản có hai loại (vừa thủ tục vừa thời hạn): tách theo điểm nếu được; không tách được thì ghi loại chính,
  loại phụ đặt trong ngoặc.
- Chủ thể, hành vi, đối tượng: **từ ngữ của văn bản**, ngắn (cụm danh từ, động từ), không đổi sang từ của presales.
  Chủ thể: ai phải làm, được làm (cơ quan, chức danh, người). Hành vi: động từ chính (lập, duyệt, gửi, lưu, công
  khai). Đối tượng: cái bị tác động (hồ sơ, biên bản, đơn). Văn bản không nêu → "—".
- Hướng BR: loại business rule mà điều khoản sẽ thành ở bước 9 (`ba-rules` method.md mục 1): `ràng buộc` /
  `tính toán` / `suy diễn` / `phân quyền` / `thời hạn` / `kiểm liên trường`; không thành rule → "—" (thủ tục thành
  bước quy trình, biểu mẫu thành dữ liệu). Bước 1 chỉ ghi hướng, **không** cấp BR, không viết câu rule.
  Loại `điều kiện`, `thời hạn`, `thẩm quyền` luôn có hướng BR (thường là `ràng buộc`, `thời hạn`, `phân quyền`).

## 3. Biểu mẫu
Cách đọc bảng: mỗi dòng một biểu mẫu mà điều khoản ở mục 2 bắt dùng. "Các trường trên biểu mẫu" là các mục phải điền
theo thứ tự trên mẫu; bước 6 (ERD) dùng để đối chiếu dữ liệu phần mềm phải lưu.

| Mã điều khoản | Tên biểu mẫu | Các trường trên biểu mẫu | Nguồn |
| --- | --- | --- | --- |

Bước 6 (ERD) dùng mục này để đối chiếu thuộc tính bắt buộc theo luật.
