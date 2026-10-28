# Viết mục tiêu, yêu cầu nghiệp vụ và NFR

Phần tra cứu của skill [`create-brd`](../SKILL.md). Đọc phần lõi trước (mục "Yêu cầu nghiệp vụ là gì", "Vấn đề và giải pháp"). File này nói **cách viết** ba thứ nằm ở mục 2, 7 và 9 của BRD: `OBJ`, `BRQ`, `NFR`. Tên cột và ô của từng bảng: [`dien-tung-muc.md`](dien-tung-muc.md).

Mọi ví dụ là **mã minh họa** lấy từ [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md) (quy chế `QC01`, dự án `DA1`). Không chép sang BRD thật. Mã và tên ngắn chép đúng chuỗi ở bảng mã chuẩn của file đó; mã ngoài bảng là **mã minh họa riêng của skill**.

## Mục tiêu nghiệp vụ (`OBJ`)

### Mục tiêu là gì, và khác KPI ra sao

**Mục tiêu** là điều tổ chức muốn đạt được nhờ dự án, nói bằng kết quả nghiệp vụ. **KPI** là phép đo cho biết đã đạt tới đâu. Hai thứ này luôn đi cặp: mục tiêu không có KPI thì không ai biết đã đạt chưa, KPI không có mục tiêu thì là một con số vô chủ. Template đặt chúng cùng một dòng và quy ước **một `OBJ` một KPI** (**lựa chọn của skill**: template chỉ có một cột KPI, không nói rõ): cần đo hai thứ khác nhau thì tách thành hai `OBJ`, để `Hiện tại`, `Mục tiêu` và `Thời hạn` của dòng chỉ có một nghĩa.

Một mục tiêu cũng không phải một việc làm (*"triển khai cổng đặt lịch"* là hoạt động, không phải kết quả) và không phải một tính năng. Kết quả là điều xảy ra **sau khi** việc làm xong, ở phía tổ chức: khách không còn xếp hàng, trung tâm không còn vượt hạn mức.

### Năm tiêu chí SMART

Mỗi `OBJ` phải qua năm câu hỏi này. Chỉ cần một câu không trả lời được là `OBJ` chưa đạt.

| Tiêu chí | Câu hỏi kiểm | Thể hiện ở cột |
|---|---|---|
| **S** — Cụ thể (Specific) | Một người lạ đọc có hiểu cùng một kết quả không? Chủ thể và đối tượng rõ chưa? | `Mục tiêu` |
| **M** — Đo được (Measurable) | Có công thức tính (tử số, mẫu số), nguồn dữ liệu đo, tần suất đo không? Có giá trị hiện tại không? | `Chỉ số đo — KPI`, `Hiện tại` |
| **A** — Khả thi (Achievable) | Giá trị đích có căn cứ, hoặc khách đã chấp nhận? Khoảng cách từ hiện tại tới đích có hợp lý không? | `Mục tiêu` (giá trị đích) kèm nguồn |
| **R** — Liên quan (Relevant) | Giải quyết đúng vấn đề nào ở mục 1.2? Đạt mục tiêu này có làm vấn đề đó nhẹ đi không? | `Vấn đề giải quyết` |
| **T** — Có thời hạn (Time-bound) | Có mốc thời gian, và mốc 0 tính từ đâu? | `Thời hạn` |

Hai chỗ hay sai. **Khả thi** không do AI đánh giá: AI không có căn cứ để nói "90% là khả thi". Giá trị đích phải đến từ hợp đồng, khách hoặc BA; AI chỉ đề xuất kèm `[CẦN BA CHỐT]`. **Liên quan** kiểm theo chiều ngược: nếu `OBJ` đạt mà `P-xx` vẫn còn nguyên thì mục tiêu đo nhầm thứ.

### Bảng đạt và không đạt

| Câu | Đạt? | Lý do |
|---|---|---|
| "Nâng cao trải nghiệm khách" | Không | Không đo được, không có giá trị hiện tại, đích hay hạn |
| "Triển khai cổng đặt lịch trực tuyến" | Không | Là hoạt động và là giải pháp. Hỏi tiếp: làm xong thì tổ chức đạt được gì |
| "Giảm thời gian chờ" | Không | Giảm từ bao nhiêu xuống bao nhiêu, đo ở đâu, đến khi nào — cả ba trống |
| "90% lịch hẹn được đặt trực tuyến" | Chưa | Có đích, thiếu thời hạn và giá trị hiện tại |
| "Số lịch hẹn vượt hạn mức quy chế giảm từ khoảng 5% xuống 0%" | Chưa | "Khoảng" — giá trị hiện tại không có nguồn đo |
| "Tỷ lệ lịch hẹn do khách tự đặt trực tuyến tăng từ 0% (khảo sát hiện trạng) lên ≥ 90% sau 3 tháng kể từ ngày vận hành chính thức" | **Đạt** | Đủ KPI, hiện tại có nguồn, đích, hạn có mốc 0. Là dạng khai triển trong bảng của `OBJ-01` ("từ 0% lên 90% sau 3 tháng vận hành") |
| "100% lịch hẹn trong tháng không vượt hạn mức của `QC01 Đ5.1`, đo hằng tháng từ sổ lịch hẹn, từ tháng thứ hai sau vận hành" | **Đạt** | Mục tiêu tuân thủ vẫn có KPI và hạn; giá trị hiện tại cần số đo thật, chưa có thì `chưa chốt (<ai>)` kèm `Q-B` |

Mục tiêu về **tuân thủ pháp luật** được phép và nên có: *"không vi phạm"* là một giá trị đích đo được (số vi phạm = 0), miễn có cách đo.

### Khi chưa có số

Nếu đầu vào không cho số hiện tại hoặc số đích, đừng chọn cách viết `OBJ` mơ hồ để né. Ghi giá trị còn thiếu là `chưa chốt (<ai>)`, thêm một dòng `Q-B` với đề xuất mặc định (**khi AI viết** thì đề xuất đi kèm `[CẦN BA CHỐT]`), và ghi nguồn khách có thể cung cấp số đó. Khi còn ô `chưa chốt (<ai>)`, `OBJ` đó **chưa đo được**, nên chưa qua cổng ra của lớp 1 ("mọi `OBJ` đo được"). Trong lúc soạn (`Nháp`) cho phép ghi như vậy để không mất dấu; trước khi chuyển `Chờ review`, BA phải có số từ khách, hoặc `OBJ` đó bị rút khỏi mục 2 và chỉ còn là `Q-B` (cách xử lý này là **lựa chọn của skill**, suy ra từ cổng ra "mọi `OBJ` đo được" của `ba-overview`). Lớp 2 không bắt đầu khi còn `OBJ` như vậy.

## Yêu cầu nghiệp vụ (`BRQ`)

### Một dòng `BRQ` gồm những gì

Mỗi `BRQ` có sáu thứ ghép lại; thiếu thứ nào là chưa phải một yêu cầu dùng được (`00_quy_uoc_chung` mục 7 gọi là "cần thiết", "rõ nghĩa", "kiểm chứng được", "có căn cứ"):

| Thứ | Ở cột | Câu hỏi kiểm |
|---|---|---|
| **Một nhu cầu** | `Yêu cầu` | Có thể bỏ riêng nửa sau của câu mà nửa đầu vẫn đứng được không? Nếu được thì đang có hai nhu cầu |
| **Có lý do** | `Lý do` | "Bỏ yêu cầu này đi thì thiếu nghiệp vụ hay thiếu tuân thủ?" Trả lời được trong một câu |
| **Gắn một mục tiêu** | `Mục tiêu` (mã `OBJ`) | Đạt `BRQ` này có đưa `OBJ` đó tiến lên không |
| **Có căn cứ** | `Căn cứ` | Dẫn được tới văn bản, tài liệu khách, `GD-xxxx`, hoặc ❓ kèm `Q-B` |
| **Có ưu tiên** | `Ưu tiên` | `M · S · C · W` kèm lý do khi khác `M` |
| **Kiểm chứng được** | `Tiêu chí chấp nhận` | Viết được một testcase đạt hoặc không đạt, không cần hỏi lại người viết |

### Viết thế này, đừng viết thế này

| Đừng viết | Viết thế này | Vì sao |
|---|---|---|
| Hệ thống cho phép khách đặt lịch qua màn hình đặt lịch | Khách phải gửi được yêu cầu đặt lịch mà không phải tới trung tâm | Chủ ngữ là khách; bỏ "màn hình" đi câu vẫn đúng |
| Nhân viên tiếp đón bấm nút Duyệt để xác nhận yêu cầu | Trung tâm phải xét duyệt hoặc từ chối mọi yêu cầu đặt lịch trước ngày hẹn — `QC01 Đ6.1` | Nút là giải pháp; "xét duyệt" là nghiệp vụ. Chép đúng `BRQ-01` ở `vi-du-xuyen-suot.md` |
| Mỗi khách chỉ đặt tối đa 2 lịch hẹn mỗi tuần | Trung tâm không được cho lịch hẹn vượt hạn mức quy chế — `QC01 Đ5.1` | Con số hạn mức thuộc business rule (lớp 6); BRQ nêu nghĩa vụ và dẫn điều |
| Nhân viên tiếp đón lập phiếu hẹn rồi Giám đốc trung tâm ký | Trung tâm phải có phiếu xác nhận lịch hẹn được người có thẩm quyền ký | Ai làm bước nào là quy trình (lớp 2) |
| Hệ thống phải nhanh và thân thiện | Nhân viên tiếp đón xử lý hết số yêu cầu của ngày trong giờ làm việc mà không phải làm thêm giờ | Câu đầu không kiểm chứng được; câu sau đo được ở kết quả nghiệp vụ |
| Trung tâm phải nhận yêu cầu đặt lịch **và** gửi thông báo cho khách **và** lưu nhật ký | Tách thành ba `BRQ` có ba tiêu chí chấp nhận riêng | Một dòng một nhu cầu; ba nhu cầu có thể được ưu tiên và nghiệm thu riêng |
| Khách yêu cầu có báo cáo | Trung tâm phải gửi báo cáo định kỳ cho cơ quan quản lý cấp trên theo `<điều khoản>` | "Khách yêu cầu" không phải căn cứ; tìm điều khoản hoặc nguyên văn câu của khách |

### Tiêu chí chấp nhận

**Tiêu chí chấp nhận là điều kiện để người ngoài tự kiểm một `BRQ` đã được đáp ứng hay chưa.** Hai dạng được template cho phép.

| Dạng | Khi nào dùng | Ví dụ (minh họa) |
|---|---|---|
| **Given / When / Then** | Nhu cầu có điều kiện và kết quả theo tình huống | *Given yêu cầu đặt lịch gửi trước hạn · When đến 17 giờ ngày hôm trước · Then yêu cầu đã có kết quả duyệt hoặc từ chối* |
| **Mệnh đề đo được** | Nhu cầu có thể thành một phép đếm hoặc tỷ lệ | *100% yêu cầu gửi đúng hạn có kết quả trước 17 giờ ngày hôm trước* |

Tiêu chí viết ở **kết quả nghiệp vụ**, không viết ở giao diện. *"Then hệ thống hiển thị thông báo xanh"* thuộc prototype; *"Then khách biết kết quả trước ngày hẹn"* thuộc BRD. Từ cấm không định nghĩa: nhanh, dễ, thân thiện, kịp thời, đầy đủ, phù hợp, hiệu quả. Dùng được khi kèm số hoặc điều kiện.

Phép thử cuối: đưa tiêu chí cho một người QC chưa từng gặp dự án. Họ có viết được ít nhất một testcase có hai kết quả "đạt/không đạt" mà không hỏi lại không? Không thì viết lại.

### Ưu tiên MoSCoW

| Giá trị | Nghĩa | Dấu hiệu dùng |
|---|---|---|
| `M` — Must | Thiếu thì không nghiệm thu được, hoặc vi phạm văn bản bắt buộc | `BRQ` sinh từ nghĩa vụ pháp luật; `BRQ` mà thiếu thì `OBJ` không đạt |
| `S` — Should | Rất nên có, nhưng thiếu thì có đường vòng tạm chấp nhận được | Đường vòng ghi ở cột `Lý do` |
| `C` — Could | Có thì tốt, làm khi còn nguồn lực | Gắn với `OBJ` phụ |
| `W` — Won't (giai đoạn này) | Đã ghi nhận nhưng không làm ở giai đoạn này | Phải khớp một dòng "ngoài phạm vi" hoặc giai đoạn sau ở mục 3 |

Gần như mọi `BRQ` đều `M` là dấu hiệu chưa phân tích ưu tiên: hỏi lại "nếu chỉ còn nửa nguồn lực, bỏ cái nào".

### Căn cứ và bên đề xuất

`Căn cứ` theo thứ tự tìm ở [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 2; nguồn đặc thù của BRD ở phần lõi, mục "Tìm căn cứ". `Bên đề xuất` là `SH-nn` đã nêu nhu cầu trong thực tế (người dùng, khách hàng, cơ quan quản lý); phải là một dòng có thật ở mục 4. Một `BRQ` mà không `SH` nào đứng sau thì kiểm lại xem có phải yêu cầu thừa không.

### Trùng, thừa, thiếu

Soát `BRQ` theo ba chiều trước khi đóng:

| Chiều | Câu hỏi | Hành động |
|---|---|---|
| **Thừa** | `BRQ` này có phục vụ `OBJ` nào, có `SH` nào cần không? | Không có gì phía trên: bỏ (ghi ⊘) hoặc hỏi `Q-B` |
| **Trùng** | Hai `BRQ` có cùng tiêu chí chấp nhận không? | Gộp thành một; mã bỏ ghi ở đầu bảng, không dùng lại |
| **Thiếu** | Mỗi nghĩa vụ trong văn bản nguồn chính ở mục 1.3 có `BRQ` phủ chưa? Mỗi `P-xx` có `BRQ` nào đáp ứng không? | Thêm `BRQ`, hoặc ghi ở mục 1.3 là *đã rà, không sinh yêu cầu* với lý do |

## Yêu cầu phi chức năng mức nghiệp vụ (`NFR`)

### NFR mức nghiệp vụ khác số liệu kỹ thuật của SRS ra sao

**NFR mức nghiệp vụ là đòi hỏi chất lượng mà nghiệp vụ buộc phải có, nói bằng hậu quả nghiệp vụ.** Số liệu kỹ thuật chi tiết (thời gian phản hồi mili giây, số người dùng đồng thời, dung lượng, thuật toán mã hóa) là việc của SRS. Ranh giới nằm ở người hiểu được: người nghiệp vụ hiểu và kiểm được câu NFR ở BRD mà không cần kiến thức kỹ thuật.

| Nhóm ISO/IEC 25010:2023 | NFR mức nghiệp vụ (BRD mục 9) | Chi tiết kỹ thuật (SRS, ngoài BRD) |
|---|---|---|
| Bảo mật — Security | Dữ liệu khách chỉ nhân viên tiếp đón được phân công xem; mọi lần xem được ghi người và thời điểm | Cơ chế xác thực, mã hóa, chính sách mật khẩu |
| Tin cậy — Reliability | Khách đặt được lịch vào mọi ngày trong tuần, kể cả cuối tuần; sự cố không làm mất lịch đã gửi | Mức sẵn sàng theo phần trăm, thời gian phục hồi |
| Hiệu năng — Performance efficiency | Nhân viên tiếp đón xử lý hết số yêu cầu của một ngày trong giờ làm việc mà không phải chờ hệ thống | Thời gian phản hồi, số người dùng đồng thời |
| Dễ dùng — Interaction capability | Khách không có kỹ năng máy tính vẫn gửi được yêu cầu mà không cần nhờ nhân viên tiếp đón hướng dẫn | Tuân thủ chuẩn khả dụng, kích thước chữ |
| Tương thích — Compatibility | Trạng thái khách ở hệ thống lịch hẹn luôn khớp với Hệ thống CRM | Định dạng bản tin, tần suất đồng bộ |
| Lưu trữ, kiểm toán (dòng của template; thuộc Security — accountability) | Mọi thay đổi chứng từ có nhật ký người, thời điểm, lý do, giữ đủ thời hạn pháp luật quy định | Cấu trúc bảng nhật ký, kỳ lưu trữ cụ thể trên hạ tầng |

Ngoài sáu dòng dựng sẵn, ISO 25010:2023 còn Functional suitability (đã được các `BRQ` phủ, không viết lại thành NFR), Maintainability, Flexibility và Safety. Thêm dòng khi khách có đòi hỏi thật; ví dụ *"Trung tâm tự đổi số lịch hẹn mỗi tuần khi quy chế thay đổi mà không cần nhờ đơn vị phát triển"* là Flexibility ở mức nghiệp vụ, và sẽ dẫn tới tham số cấu hình `CH-xx` ở lớp 2.

### Cách viết một NFR

| Quy tắc | Giải thích |
|---|---|
| **Một NFR một đòi hỏi, có thể kiểm** | Template không có cột tiêu chí chấp nhận cho `NFR`, nên mệnh đề đo được nằm ngay trong ô `Yêu cầu` |
| **Nói điều nghiệp vụ cần, không nói cách làm** | *"Chỉ nhân viên tiếp đón được phân công xem thông tin khách"* đúng; *"dùng RBAC"* là giải pháp |
| **Có căn cứ** | Văn bản, hợp đồng, hoặc nhu cầu của một `SH`. Không có thì ❓ kèm `Q-B`, không bịa |
| **Có số nghiệp vụ nếu số đó là của nghiệp vụ** | "trong giờ làm việc", "trước 17 giờ" đúng; "dưới 2 giây" không (SRS) |
| **Không có nhóm nào thì nói là không có** | Dòng dựng sẵn mà nghiệp vụ không đòi gì: ô `Yêu cầu` ghi `n/a` kèm lý do (ví dụ *"không có đòi hỏi tương thích — hệ thống độc lập"*), không xóa dòng. Ô `Căn cứ` ghi `—` và ô `Ưu tiên` ghi `n/a` vì MoSCoW chỉ áp cho yêu cầu có thật — **lựa chọn của skill**, template không nói |

Phép thử phân biệt NFR với `BRQ`: nếu câu mô tả một việc tổ chức phải làm được (nhận yêu cầu, duyệt) thì đó là `BRQ`; nếu mô tả mức chất lượng của việc đó (nhanh tới đâu, ai được xem, mất dữ liệu thì sao) thì đó là `NFR`.
