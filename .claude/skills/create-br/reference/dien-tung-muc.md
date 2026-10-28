# Điền từng mục của template Business Rule

Phần tra cứu của skill [`create-br`](../SKILL.md). Đọc phần lõi trước. Template: [`business_rules.md`](../../../../2-ba-overview/templates/6-business-rules/business_rules.md). Mọi mã, tên, con số, điều khoản trong ví dụ là **minh họa** theo [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md), không chép sang tài liệu dự án.

Mục đi theo đúng thứ tự của template. Mỗi mục có một câu **Định nghĩa** rồi bảng `Cột/ô | Điền gì | Viết thế nào | Đừng viết`. Ba giá trị đặc biệt (`n/a`, `chưa chốt (<ai>)`, ❓ `[CẦN BA CHỐT]`), cách tìm căn cứ, `Q-…`, `GD-xxxx`: theo [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md), không nhắc lại ở từng ô.

## Chỗ template còn thiếu hoặc im lặng

Thứ bậc: `00_quy_uoc_chung` → template → skill. Từ 27/10/2026 template đã có đủ các khối mà `00_quy_uoc_chung` mục 3 và 6 bắt buộc (câu "không chứa gì", dòng Thông tin tài liệu, Phê duyệt, bảng câu hỏi đủ cột, Rủi ro còn lại, Điểm tạm hoãn) — điền theo template, xem [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6. Bảng dưới chỉ giữ những chỗ template vẫn im lặng và skill phải quy định.

| Chỗ | Tình trạng | Cách xử lý |
|---|---|---|
| **Ứng viên đã loại** | Cổng ra của `ba-overview` đòi ghi lý do loại; template không có chỗ | Bảng bổ sung riêng của lớp 6, đặt **sau Điểm tạm hoãn, ngay trước Phụ lục A** (`00_quy_uoc_chung.md` mục 6; xem [`gom-ung-vien-va-dien-nguoc.md`](gom-ung-vien-va-dien-nguoc.md) mục 5) |
| **Tên ngắn** của quy tắc | `00_quy_uoc_chung` mục 4 yêu cầu dẫn mã kèm tên ngắn; template không có cột tên | Viết tên ngắn ở dòng thứ hai của ô `Mã` |
| **Đánh dấu suy luận** | Template nói "đánh dấu rõ là suy luận hoặc chờ chốt" nhưng không nói đánh dấu ở đâu | Ô `Căn cứ` ghi `Suy luận từ …`, ô `Cưỡng chế` ghi ❓ ([`loai-va-cuong-che.md`](loai-va-cuong-che.md) mục 4) |
| Cột `Thực thể neo` của catalog (bài giới thiệu) | Template không có | **Thực thể neo thể hiện qua chủ thể của câu** ở `Nội dung`; cần chỉ đúng bảng thì ghi tên bảng ERD trong ô `Nội dung`. `Áp tại` là **nơi kiểm**, không phải thực thể neo (lựa chọn của skill) |
| Đánh số mục | Template ghi `{{n}}` | Mục nhóm bắt đầu từ `2`, mỗi nhóm một số; các mục sau nhóm cuối đánh tiếp theo thứ tự template: Thống kê, Danh sách điểm cần chốt, Rủi ro còn lại, Điểm tạm hoãn, (Ứng viên đã loại), Phụ lục A, Phụ lục B, Nguồn tra cứu. Mục Nguồn tra cứu luôn là mục cuối và lùi số |
| Chú thích `<!-- -->` | Template có nhiều khối: HƯỚNG DẪN, giải thích ký hiệu ở 1.3, mẫu RuleSpeak và `KHỐI LẶP`, ghi chú bảng quyết định, `HẾT KHỐI LẶP` | Xóa **tất cả** trong file dự án, không chỉ khối HƯỚNG DẪN |

## Đầu file

**Định nghĩa:** phần nhận diện tài liệu và giữ lịch sử thay đổi — trả lời *tài liệu này là gì, của ai, đang ở bản nào*.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tên file | `BR_{MÃ DỰ ÁN}_{PHẠM VI}_v{NN}.md` | Theo `00_quy_uoc_chung` mục 2. `PHẠM VI` PascalCase tiếng Việt không dấu | Tên file theo hệ khác (mã quy tắc kiểu `BR-D02-001`, tiền tố domain) |
| Mọi chú thích `<!-- … -->` của template | — | Đọc để hiểu chuẩn rồi **xóa hết** ở bước cuối quy trình | Giữ lại bất kỳ chú thích nào khi phát hành |
| Tiêu đề `# BUSINESS RULE — {{DỰ ÁN}} {{PHẠM VI}}` | Tên dự án và phạm vi bằng chữ | `BUSINESS RULE — DA1 Lịch hẹn` | `BR` viết tắt không có chữ |

### Khối giới thiệu (bốn dòng trích dẫn, trong đó dòng 3 là dòng đếm)

**Định nghĩa:** khối trả lời bốn câu của `00_quy_uoc_chung` mục 3.1 — chứa gì (có số đếm), dựng từ đâu, đọc thế nào, không chứa gì. Template đã có đủ bốn câu.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Dòng 1 "Bộ quy tắc … trích xuất trực tiếp từ …" | Tên các văn bản pháp luật, chính sách là nguồn chính | Liệt kê tên nguồn chính ngắn gọn; nguồn bổ sung từ lớp 2–5 nếu có thể nói thêm: *"… và các quyết định `D-xx`, quy tắc dùng chung `GS-xx` đã chốt ở quy trình"* | Dẫn cả danh sách văn bản — chi tiết ở mục 1.2 |
| Dòng 2 "Mỗi quy tắc dẫn đúng điều, khoản, điểm …" | Câu cam kết về căn cứ và về quy tắc suy luận | Giữ nguyên câu của template | Bỏ vế "không trộn lẫn" |
| Dòng 4 — **không chứa gì** (`> Tài liệu **không** chứa …`) | Những thứ tài liệu không chứa và nơi chúng nằm | Giữ câu của template: trình tự bước (quy trình nghiệp vụ), chuyển trạng thái (máy trạng thái), kiểu và độ dài trường (ERD), màn hình và câu thông báo (SRS). Phân quyền thuộc lớp 5: thêm vào vế đầu nếu dự án cần nêu | Bỏ câu này; chép lại nguyên văn câu mẫu mà không kiểm vế nào đúng với dự án |
| Dòng 3 — đếm "**{{n}} quy tắc** trong **{{n}} nhóm**: …" | Số quy tắc, số nhóm, số theo từng mức | Ghi mọi mức có số khác 0: `12 🔒 · 5 ⚙️ · 2 🔑 · 1 ⚠️ · 3 ❓`. Tổng các mức bằng số quy tắc. **Bản chép — nguồn là mục Thống kê** | Số đếm gõ tay lệch Thống kê; bỏ qua 🔑 ⚠️ |

### Thông tin tài liệu

**Định nghĩa:** bảng định danh theo ISO 9001:2015 mục 7.5.2.

| Dòng | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã tài liệu | `BR_{MÃ}_{PHẠM VI}` | Trùng tên file bỏ `_vNN` | Mã tự đặt khác tên file |
| Phiên bản · Trạng thái | `v00 · Nháp` | Trạng thái theo `00_quy_uoc_chung` mục 3.2: Nháp · Chờ review · Đã duyệt · Hết hiệu lực | `Hoàn thành`, `Final` |
| Dự án · Phân hệ | Tên dự án và phân hệ, hai ô cách nhau `·` | `DA1 · Lịch hẹn` (minh họa) | Ô trống |
| Người soạn · Người review · Người duyệt | Ba tên kèm vai trò, một ô, cách nhau `·` | `NamLH — BA · <tên reviewer> · <tên người duyệt>`. Người review điền sau khi review xong | Tên AI làm người duyệt; AI chỉ là người soạn nếu người dùng ghi |
| Mức mật | Một trong `Nội bộ · Hạn chế · Mật` | Chọn theo nội dung nhạy cảm nhất của tài liệu | Giá trị ngoài ba giá trị này |

### Version control

**Định nghĩa:** lịch sử các phiên bản của **tài liệu này**. Không có bảng Version control riêng cho skill; phiên bản skill theo `ba-overview`.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tên version | `v00`, `v01`… | Dòng hiện tại tô xanh, in đậm, ghi `(hiện tại)` theo mẫu `00_quy_uoc_chung` mục 3.3 | Tô xanh nhiều dòng |
| Ngày cập nhật | `YYYY-MM-DD` | Ngày phát hành bản đó | `dd/mm/yyyy` |
| PIC | Tên người chịu trách nhiệm bản này | `NamLH` | Tên nhóm |
| Mô tả | Thay đổi của bản đó, mỗi ý một gạch đầu dòng | `- Khởi tạo tài liệu: trích 14 quy tắc từ QC01.` Quyết định của BA ghi `BA chốt dd/mm/yyyy: …`. Lượt điền ngược sang tài liệu khác thì ghi ở tài liệu **đó** | `BA chốt` do AI tự ghi |

### Phê duyệt

**Định nghĩa:** bảng ký duyệt theo `00_quy_uoc_chung` mục 3.4, đã có sẵn ba dòng trong template.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Vai trò | Ba dòng của template: BA soạn · Product owner / Khách hàng · Tech lead | Giữ nguyên | Xóa dòng, đổi tên vai |
| Họ tên | Tên người giữ vai | Để trống cho tới khi có người duyệt | Điền tên người chưa duyệt |
| Ngày | Ngày ký | `DD/MM/YYYY`; để trống cho tới khi duyệt | Ngày dự kiến |
| Ý kiến | Ý kiến của người duyệt | Để trống cho tới khi duyệt | AI tự ghi ý kiến |

---

## Mục 1 — Phạm vi và nguồn

**Định nghĩa:** nói bộ quy tắc phủ khối nghiệp vụ nào, dựng từ văn bản nào, đọc ký hiệu ra sao. Trả lời *tài liệu này đáng tin tới đâu và nhìn vào đâu*.

### 1.1. Phạm vi

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| "Tài liệu phủ {{n}} khối nghiệp vụ" | Số khối bằng số nhóm ở các mục sau | Số khớp khối giới thiệu | Số khối khác số nhóm mà không giải thích |
| Dòng **{{Khối}}** — {{mô tả}} | Mỗi khối một dòng: tên khối, một câu mô tả nó điều chỉnh việc gì | `**A — Lịch hẹn** — việc khách đặt, hủy lịch hẹn và trung tâm duyệt lịch.` Chữ nhóm khớp mục nhóm. BRD mục 8 ở lượt đầu là `chờ lớp 6` — lớp 6 điền theo chữ nhóm này ở lượt điền ngược | Liệt kê quy tắc ở đây |
| "Kèm khối phụ thuộc trực tiếp" | Khối thuộc domain khác mà quy tắc của tài liệu này đụng tới | Tên khối kèm mã quy tắc hoặc quy trình bên đó; không có thì `n/a` | Chép quy tắc của khối khác — chỉ dẫn |

### 1.2. Văn bản đối chiếu

**Định nghĩa:** danh sách văn bản đã đọc để dựng bộ quy tắc, kể cả văn bản không sinh quy tắc nào. Để người sau không phải rà lại.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Văn bản | Tên văn bản kèm **viết tắt** dùng ở cột Căn cứ | `Quy chế đặt lịch (QC01)` — viết tắt khai một lần ở đây và ở mục Nguồn | Viết tắt không khai |
| Số hiệu · ngày | Số hiệu và ngày ban hành | `12/QC-… · 05/03/2024` (minh họa) | Bỏ số hiệu |
| Hiệu lực | Còn hiệu lực, ngày hiệu lực, hay đã thay thế | `Có hiệu lực từ 01/04/2024`; bị thay thì ghi văn bản thay | Để trống hoặc `còn` |
| Vai trò | **Nguồn chính** hay nguồn hỗ trợ, và nó cung cấp loại quy tắc nào | `**Nguồn chính** — số lượt, điều kiện duyệt, hủy lịch` | `Tham khảo` không nói tham khảo cái gì |
| **Kết luận rà soát** | Mỗi văn bản **đã rà toàn văn mà không sinh quy tắc** + lý do | `Quy chế nội bộ khác …: đã rà toàn văn, không sinh quy tắc — chỉ quy định thủ tục hành chính của cơ quan cấp trên.` | Ghi "không liên quan" trơ |

### 1.3. Quy ước ký hiệu

**Định nghĩa:** bảng giải nghĩa ký hiệu mức cưỡng chế và loại quy tắc, để dev và QC hiểu cùng một nghĩa. **Phần cố định của template — giữ nguyên.**

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Bảng ký hiệu 🔒 ⚙️ 🔑 ⚠️ ❓ (bốn cột Ký hiệu · Nghĩa · Mức cưỡng chế SBVR · Hệ thống làm gì) | Giữ **cả năm dòng** của template, kể cả mức tài liệu không dùng | Giữ nguyên chữ. Chi tiết mức và phép thử: [`loai-va-cuong-che.md`](loai-va-cuong-che.md) mục 2 | Xóa dòng mức chưa dùng; sửa nghĩa mức cho khác SBVR |
| Bảng **Loại quy tắc** — cột Loại, Nghĩa | Hai dòng ĐN và HV | Giữ nguyên | Thêm loại thứ ba (xem ánh xạ bảy loại cũ ở `loai-va-cuong-che.md` mục 6) |
| Bảng Loại — cột Ví dụ | **Thay** hai ví dụ `{{…}}` bằng **một ví dụ thật của dự án** cho mỗi loại, lấy từ bảng quy tắc bên dưới | ĐN: *Lượt hẹn là lịch hẹn ở trạng thái Chờ duyệt hoặc Đã duyệt.* HV: *Mỗi khách chỉ được đặt tối đa `CH-01` lịch hẹn mỗi tuần.* | Ví dụ không có mã trong bảng quy tắc |
| **Lưu ý thuật ngữ** | Thuật ngữ chuẩn dùng xuyên suốt tài liệu và nơi định nghĩa | *"Dùng **khách**, không dùng "người đặt lịch"; **nhân viên tiếp đón** theo Quy trình mục 1.1. Trích nguyên văn thì giữ chữ gốc."* Chỉ **dẫn** nơi định nghĩa (BRD mục 5, Quy trình mục 1.1), không định nghĩa lại | Định nghĩa lại thuật ngữ đã có ở lớp trước |

---

## Mục 2 trở đi — Mỗi nhóm một mục

**Định nghĩa:** một nhóm là tập quy tắc cùng điều chỉnh một khối nghiệp vụ; mỗi nhóm một chữ cái, một bảng quy tắc, và các bảng quyết định thuộc quy tắc của nhóm. Câu hỏi nhóm trả lời: *khối việc này bị ràng buộc bởi những điều gì*. Khối `KHỐI LẶP CHO MỖI NHÓM` được nhân lên cho từng nhóm.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `## n. Nhóm A — {{Tên nhóm}}` | Chữ nhóm và tên nhóm | `## 2. Nhóm A — Lịch hẹn`. Tên là danh từ nghiệp vụ, khớp 1.1 | Tên nhóm theo màn hình hay phân hệ phần mềm |
| Dòng mã đã bỏ (nếu có) | Các mã bỏ trong nhóm này | *Các mã BR-B04, BR-B09 đã bỏ, không dùng lại.* — đặt ngay dưới tiêu đề | Xóa dòng đã phát hành mà không ghi |

### Bảng quy tắc — bảy cột

**Định nghĩa:** mỗi dòng một business rule — catalog theo Business Rules Manifesto và BABOK 10.9. Một mã một quy tắc, một quy tắc một mức; thứ tự dòng theo chủ đề, không theo thứ tự quy trình.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| **Mã** | `BR-{nhóm}{nn}` và, dòng thứ hai trong ô, **tên ngắn** | `**BR-A01**<br>*Tối đa CH-01 lịch hẹn mỗi tuần*`. Mã duy nhất, không đánh lại, không dùng lại mã đã bỏ. Quy ước đầy đủ ở phần lõi, mục "Mã và tên" | Mã mới cho quy tắc cũ đổi chữ; tên ngắn mỗi nơi một kiểu |
| **Nội dung** | **Một** phát biểu theo mẫu RuleSpeak: chủ thể là khái niệm nghiệp vụ, **phải · không được · chỉ được … khi · là · được tính bằng**; **in đậm** động từ chính | Xem ví dụ bên dưới và [`loai-va-cuong-che.md`](loai-va-cuong-che.md) mục 3. Giá trị liệt kê dùng tên tiếng Việt. Số cấu hình là `CH-xx`. Quy tắc nhiều điều kiện: một câu tổng quát rồi *"được xác định theo bảng quyết định dưới đây"* | Nhắc màn hình, nút, thông báo, bước số; câu ghép hai nghĩa vụ; số cấu hình trần; "nên", "có thể"; tên trường ERD dạng `so_nguoi` (dùng tên nghiệp vụ, trừ khi buộc chỉ đúng một trường) |
| **Căn cứ** | Nguồn của quy tắc: điều, khoản, điểm; hoặc mã lớp trước kèm tên ngắn; hoặc `GD-xxxx` | `QC01 Đ5.1` · `GS-06 Làm tròn tiền` · `QC01 Đ5.1 · D-01 Chỉ nhận đặt lịch trực tuyến`. Quy tắc **suy luận**: `**Suy luận** từ QC01 Đ5.1 + Đ7.2: <bước suy>`. Chưa có nguồn: ❓ `[CẦN BA CHỐT] <phát biểu>`. Con số kèm biên | Ô trống; "theo quy định"; dẫn trần số điều không nói của văn bản nào; nguồn chỉ là chính BR khác |
| **Loại** | `ĐN` hoặc `HV` | Phép thử "làm trái được không" ở [`loai-va-cuong-che.md`](loai-va-cuong-che.md) mục 1; canh giữa | Loại thứ ba; ô trống |
| **Cưỡng chế** | Đúng **một** ký hiệu trong 🔒 ⚙️ 🔑 ⚠️ ❓ | Chuỗi câu hỏi chọn mức ở `loai-va-cuong-che.md` mục 2. ĐN chỉ nhận 🔒 ⚙️ ❓. Quy tắc ⚙️ phải có `CH-xx` trong `Nội dung`; 🔑 phải nêu *ai* mở ngoại lệ; suy luận và chờ chốt là ❓ | Hai ký hiệu trong một ô; 🔒 cho quy tắc suy luận; ⚙️ không `CH-xx` |
| **Áp tại** | **Nơi quy tắc được kiểm** ở lớp 2–4: bước quy trình, chuyển trạng thái, trường ERD | `LH-01 bước 2` · `SM mục 2: DRAFT → PENDING_APPROVAL` · `` `Quy_Luot.da_dung` ``. Nhiều nơi thì cách nhau bằng `·`. Dẫn theo ranh giới ở `00_quy_uoc_chung.md` mục 9 | Màn hình, route, API; ô trống (không có chỗ áp thì `chưa chốt (<ai>)` kèm ❓) |
| **Liên quan** | Lớp 5 và quan hệ chéo: mã UC (cột `No` của `use_case_list`, G2), hoặc nhóm UC; BR, `D-xx`, `R-xx` có quan hệ | `DA1.WEB.03.01.03 · BR-A02`. Cả chức năng cùng chịu quy tắc thì ghi mã cấp Chức năng của WBS, ví dụ `DA1.WEB.03.01`, thay vì từng UC. Chưa có UC thì `chưa chốt (BA)` và xem Phụ lục B | Tên UC không kèm mã; mã UC không có trong `use_case_list` |

Dòng điền mẫu (minh họa, bốn mã đầu theo bảng mã chuẩn của `vi-du-xuyen-suot.md`, `BR-A05` là mã minh họa riêng của skill):

| Mã | Nội dung | Căn cứ | Loại | Cưỡng chế | Áp tại | Liên quan |
|---|---|---|:-:|:-:|---|---|
| **BR-A01**<br>*Tối đa CH-01 lịch hẹn mỗi tuần* | Mỗi khách **chỉ được** đặt tối đa `CH-01` lịch hẹn mỗi tuần; tuần tính từ thứ Hai | QC01 Đ5.1 · GS-01 Tuần tính từ thứ Hai, giờ Việt Nam | HV | ⚙️ | LH-01 bước 2 · SM mục 2: `DRAFT` → `PENDING_APPROVAL` | DA1.WEB.03.01.03 |
| **BR-A02**<br>*Định nghĩa lượt đã dùng* | Lượt hẹn đã dùng **là** lịch hẹn ở trạng thái Chờ duyệt, Đã duyệt, Đã đến hẹn, hoặc Đã hủy muộn | QC01 Đ5.1 · Đ7.2 · R-01 | ĐN | 🔒 | `Quy_Luot.da_dung` | BR-A01 · R-01 |
| **BR-A03**<br>*Hủy sớm được trả lượt* | Khách hủy lịch trước giờ hẹn ít nhất `CH-02` giờ **thì** lượt được trả lại | QC01 Đ7.2 | ĐN | ⚙️ | LH-02 · SM mục 2: `PENDING_APPROVAL`, `APPROVED` → `CANCELLED` | DA1.WEB.03.01.06 |
| **BR-A04**<br>*Người đặt hộ không tự duyệt* | Nhân viên tiếp đón **không được** duyệt lịch hẹn do chính mình đặt hộ khách | QC01 Đ6.3 · QT_DA1_LichHen mục 9 điểm 2 | HV | 🔒 | LH-01 bước 4 | DA1.WEB.03.01.04 |
| **BR-A05**<br>*Đã duyệt không sửa số người* | Lịch hẹn ở trạng thái Đã duyệt **không được** sửa số người đi cùng, trừ khi Giám đốc trung tâm cho phép | **Suy luận** từ QC01 Đ6.1: lịch đã duyệt là cơ sở để chuẩn bị đón khách, văn bản chưa nói được sửa hay không và ai cho phép | HV | ❓ | SM mục 2: ma trận `APPROVED` × Sửa | `chưa chốt (BA)` |

Bốn điều dễ sai mà các dòng trên minh họa. `BR-A01` là HV ⚙️: có người cố đặt vượt quá mức nên hệ thống chặn theo `CH-01`. `BR-A02` và `BR-A03` là **ĐN**: không ai "làm trái" được, hệ thống chỉ tính đúng hoặc sai, nên testcase là ca tính đúng chứ không phải ca bị chặn; `BR-A03` là ⚙️ vì có `CH-02` (sàn luật 24 giờ), còn `BR-A02` là 🔒 vì định nghĩa cố định. `BR-A04` dùng 🔒 vì điều khoản nói thẳng, không có người nào được miễn. `BR-A05` có chữ "trừ khi" nên là ứng viên mức 🔑, nhưng ai được cho phép là suy luận, chưa có nguồn — nên ô Cưỡng chế là ❓, `Q-BR…` đề xuất mặc định "🔑, Giám đốc trung tâm".

### Bảng quyết định

**Định nghĩa:** cách trình bày một quy tắc nhiều điều kiện theo OMG DMN — mỗi dòng một tổ hợp điều kiện và kết quả của nó, kiểm đủ mọi tổ hợp. Dùng khi nào, chính sách trúng, kiểm tổ hợp, ví dụ đầy đủ: [`bang-quyet-dinh-dmn.md`](bang-quyet-dinh-dmn.md). Không có bảng nào thì không thêm bảng; bỏ khối này.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `**Bảng quyết định BR-A0x — {{tên}}** · chính sách trúng: {{U}}` | Mã BR mà bảng thuộc về, tên bảng, chính sách trúng | `**Bảng quyết định BR-A03 — Hủy sớm được trả lượt** · chính sách trúng: U`. U — duy nhất, F — dòng đầu tiên khớp; A, P chỉ khi có lý do | Bảng không gắn mã; không khai chính sách |
| Cột `#` | Số dòng | Với F, số dòng là thứ tự ưu tiên | Đánh lại số khi sắp xếp F |
| Cột điều kiện (`{{Điều kiện 1}}`, `{{Điều kiện 2}}`, nhân thêm nếu cần) | Một cột một đầu vào; tên cột là khái niệm nghiệp vụ | `Bên hủy` · `Thời điểm hủy so với giờ hẹn`. Giá trị rời rạc dùng tên tiếng Việt; khoảng số `≥`, `<`; ngưỡng `CH-xx`. Ô `—` là điều kiện không ảnh hưởng | Tên trường, tên điều khiển; con số cấu hình trần; `—` cho điều kiện chưa rõ |
| Cột `→ {{Kết quả}}` | Kết quả nghiệp vụ của tổ hợp | `→ Lượt hẹn`: `Được trả lại` / `Không được trả lại` | Hành động giao diện ("hiện hộp thoại") |
| Cột `Ghi chú` | Căn cứ riêng của dòng, hoặc ❓ kèm `Q-BR…` | `QC01 Đ7.2` | Căn cứ chung của cả bảng (nằm ở dòng BR) |

Kiểm đủ tổ hợp và chồng lấn là **bắt buộc** trước khi đóng.

---

## Mục Thống kê

**Định nghĩa:** bảng đếm quy tắc theo nhóm, loại, mức — để thấy cân đối của bộ quy tắc và đối chiếu số đếm ở các nơi khác. Số liệu là **nguồn** của mọi bản chép: khối giới thiệu, BRD mục 8.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nhóm | Chữ nhóm và tên | `A — Lịch hẹn` | Nhóm không có ở các mục trên |
| Số BR | Số quy tắc đang hiệu lực (không đếm mã đã bỏ) | Bằng ĐN + HV và bằng 🔒 + ⚙️ + 🔑 + ⚠️ + ❓ | Số tay lệch |
| ĐN · HV | Số quy tắc từng loại | Tổng hai cột bằng Số BR | |
| 🔒 · ⚙️ · 🔑 · ⚠️ · ❓ | Số quy tắc từng mức | Mỗi quy tắc đếm đúng một cột | Đếm một quy tắc vào hai cột |
| Dòng **Tổng** | Tổng cộng mọi nhóm | In đậm | |
| Ghi chú dưới bảng `*{{…}}*` | Điều cần để đọc đúng số đếm | Một quy tắc nhiều điều kiện được tính là **một**; quy tắc đã bỏ không tính. Template cho phép ghi chú "một quy tắc đếm ở hai cột"; **skill chọn không đếm hai cột** (lựa chọn của skill): mỗi quy tắc đúng một mức, nên nếu thấy cần đếm hai cột thì đó là quy tắc ghép phải tách. Không có gì cần nói thì ghi *Mỗi quy tắc đếm đúng một cột loại và một cột mức* | Ghi chú trống nghĩa |

## Mục Danh sách điểm cần chốt

**Định nghĩa:** các câu hỏi mở của riêng lớp này — mỗi dòng là một điểm chưa ai trả lời, kèm đề xuất để BA chốt nhanh. Đây là bảng câu hỏi theo `00_quy_uoc_chung` mục 6; template đã có đủ bảy cột (cột đầu là `Mã`, mã mẫu `Q-BR01`, cột `Người chốt` mẫu `{{BA + khách}}`). Phân biệt `Q-…` với `GD-xxxx` ở `so-cu-va-gia-dinh.md` mục 4. AI **không** tự tạo `GD-xxxx`.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | Mã câu hỏi | `Q-BR01`, `Q-BR02`… (tiền tố `Q-BR` do `00_quy_uoc_chung.md` mục 4 đặt) | Số trơn; mã trùng `R-xx` của ERD hay chữ nhóm |
| Vấn đề | Điều chưa rõ, một câu | *Văn bản không nói ai được cho phép sửa lịch đã duyệt.* | Câu hỏi chung chung ("cần làm rõ BR-A05") |
| Kịch bản | Một tình huống **cụ thể** khiến câu hỏi quan trọng | *Khách nhập nhầm số người; nhân viên tiếp đón đã duyệt; muốn sửa.* | Không có kịch bản |
| BR liên quan | Mã BR kèm tên ngắn; kèm **chỗ phải điền ngược** nếu BR đang ở ❓ | `BR-A05 Đã duyệt không sửa số người` — khi chốt: điền ngược tại SM mục 2 ma trận | Mã trơ |
| Đề xuất mặc định | Mức hoặc nội dung đề xuất, để BA gật đầu là xong | *🔑 — Giám đốc trung tâm được cho phép, bắt buộc lý do.* | Để trống |
| Người chốt | Tên người hoặc vai | `BA + khách` | `Ai đó` |
| Quyết định | Trống tới khi chốt; chốt thì `✅ dd/mm/yyyy: …` | Khi chốt, sửa dòng quy tắc, bỏ ❓, điền ngược nếu cần | Chốt mà quy tắc vẫn ❓ |

Không còn câu mở thì ghi *Không còn câu mở*.

---

## Mục Rủi ro còn lại

**Định nghĩa:** rủi ro **còn lại sau biện pháp** đã tính, làm yếu một căn cứ của bộ quy tắc. Mục cấp 2 có sẵn trong template (`## {{n}}. Rủi ro còn lại`), nằm sau Danh sách điểm cần chốt, trước Điểm tạm hoãn. Khối bắt buộc theo `00_quy_uoc_chung` mục 6; vị trí và mã ở [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6. Không có thì ghi *Không có rủi ro còn lại*, không bỏ mục.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `RK-nn` | Hai chữ số, duy nhất trong tài liệu | Mã trùng |
| Rủi ro | Điều có thể xảy ra, nêu cả hậu quả | *Văn bản gốc sắp sửa đổi điều làm `BR-A01` sai hạn mức* | Rủi ro không gắn căn cứ nào |
| Căn cứ bị ảnh hưởng | Mã bị yếu đi | `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1` | Bỏ trống |
| Mức | `C · TB · T` (cao, trung bình, thấp) | Một giá trị; canh giữa | Mọi rủi ro cùng `TB` |
| Biện pháp | Việc đã làm hoặc sẽ làm để giảm | *Xin khách xác nhận bằng văn bản trước khi chốt `BR-A01`* | "Theo dõi" trơn |
| Cần khách xác nhận văn bản | `Có` hoặc `Không` | `Có` khi chỉ khách giải quyết được | Bỏ trống |

## Mục Điểm tạm hoãn

**Định nghĩa:** việc đã rõ, đã hiểu, nhưng cố ý chưa làm ở phiên bản này, kèm điều kiện mở lại. Khác câu hỏi (chưa ai trả lời), giả định (tạm coi là đúng) và rủi ro (có thể xảy ra). Mục cấp 2 có sẵn trong template, sau Rủi ro còn lại, trước Phụ lục A; mã `TH-nn` do bộ skill đặt (`00_quy_uoc_chung.md` mục 6). Không có thì ghi *Không có điểm tạm hoãn*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `TH-nn` | Hai chữ số, duy nhất trong tài liệu | Mã trùng |
| Nội dung | Việc cố ý chưa làm | *Chưa viết quy tắc về lịch hẹn ngày lễ* | Câu hỏi còn mở (đó là `Q-BR…`) |
| Ngày tạm hoãn | Ngày quyết định hoãn | `DD/MM/YYYY` | `YYYY-MM-DD` (dành cho Version control) |
| Điều kiện mở lại | Điều kiện kiểm chứng được | *Khi khách phát hành văn bản hướng dẫn thay `QC01`* | "Khi có thời gian" |

## Mục Ứng viên đã loại *(bảng bổ sung riêng của lớp 6, đặt sau Điểm tạm hoãn, ngay trước Phụ lục A; xem `gom-ung-vien-va-dien-nguoc.md` mục 5)*

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nguồn | Chỗ ở lớp 1–5 nơi ứng viên đứng | `QT_DA1_LichHen mục 9 điểm 3` | Chung chung "lớp 2" |
| Phát biểu gốc | Câu của ứng viên | Chép ngắn, giữ nghĩa | Diễn giải lại |
| Lý do loại | Lý do **riêng** | *Là bước quy trình, chỉ có nghĩa trong trình tự* | Một câu cho mọi dòng |
| Nơi nội dung đang được giữ | Mã nơi giữ | `LH-01 bước 5` | Để trống |

---

## Mục Phụ lục A — Biểu mẫu pháp lý liên quan

**Định nghĩa:** danh sách mẫu biểu **do văn bản gốc ban hành** mà quy tắc nhắc tới, để người đọc biết quy tắc nào gắn mẫu nào. Chứng từ do Quy trình sở hữu (mục 8.1); Phụ lục A chỉ **nối** mẫu với quy tắc.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mẫu | Số hiệu mẫu | `Mẫu 03/TG` (minh họa) | Mẫu tự thiết kế của dự án (thuộc Quy trình mục 8.2) |
| Tên | Tên mẫu | Đúng tên trong văn bản | Đặt lại tên |
| Ban hành kèm | Văn bản và điều, phụ lục ban hành mẫu | `QC01 Phụ lục II` | Văn bản không có trong 1.2 |
| Trường dữ liệu chính | Trường mà **mẫu bắt buộc** có, tên nghiệp vụ | `Họ tên khách, quan hệ, ngày hẹn, số người đi cùng` | Chép toàn bộ mẫu; kiểu dữ liệu (thuộc ERD) |
| BR liên quan | Mã BR kèm tên ngắn quy định về mẫu | `BR-A06 Lập đủ trường theo mẫu` | Mã trơ |

Không có mẫu nào thì ghi *Không có*.

## Mục Phụ lục B — Nghĩa vụ chưa có use case

**Định nghĩa:** những nghĩa vụ mà văn bản đặt ra nhưng hiện chưa có chức năng nào trong hệ thống phủ, để không ai tưởng là đã phủ. Nguồn: Quy trình mục 10 — nay là danh sách **bước người làm chưa có UC**, do `create-ucl` điền ở lớp 5 (khi chạy kiểm tra quy tắc 100%, trước lớp 6; `00_quy_uoc_chung.md` mục 10) — và bước 🟡 là nghĩa vụ pháp lý. **Điều khoản** lấy từ cột Căn cứ của bước quy trình đó.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| # | Số thứ tự | `1`, `2`… | |
| Nghĩa vụ | Việc ai đó phải làm | *nhân viên quầy đối chiếu giấy tờ khi khách tới* | Nghĩa vụ đã có UC phủ |
| Căn cứ | Điều khoản của bước quy trình chứa nghĩa vụ (cột Căn cứ của bảng bước) | `QC01 Đ8.1` (điều khoản minh họa riêng) | Ô trống |
| BR | BR phát biểu nghĩa vụ này; chưa có thì ghi lý do | `BR-A07 Đối chiếu giấy tờ` hoặc `chưa có BR — nghĩa vụ ngoài hệ thống` | Mã trơ |
| Quy trình | Quy trình và bước chứa nghĩa vụ | `LH-01 bước 6 🟡` | Để trống |

Không có nghĩa vụ nào thì ghi *Không có*.

## Mục Nguồn tra cứu

**Định nghĩa:** nơi người sau mở được nguồn của từng phần — khối **Nguồn** của `00_quy_uoc_chung` mục 6.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nội dung | Phần tài liệu hoặc nhóm quy tắc dùng nguồn | `Nhóm A — Lịch hẹn` | Chung chung |
| Đường dẫn | Đường dẫn tương đối tới văn bản, tới lớp 1–5 đã dùng, tới `assumption_log.md` | `../2-business-process/business_process.md` · `../../inputs/QC01.pdf` | Đường dẫn tuyệt đối trên máy cá nhân |

Hai việc cuối trước khi đóng mục này: liệt kê **mọi** viết tắt đã dùng ở cột Căn cứ nếu 1.2 chưa khai; và ghi các tài liệu đã bị sửa khi điền ngược.
