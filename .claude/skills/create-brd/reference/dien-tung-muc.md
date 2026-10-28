# Điền từng mục của template BRD

Phần tra cứu của skill [`create-brd`](../SKILL.md). Đọc phần lõi trước. Thứ tự dưới đây theo đúng thứ tự trong [`brd.md`](../../../../2-ba-overview/templates/1-brd/brd.md). Mỗi mục có một câu **Định nghĩa**, rồi bảng mỗi dòng là một cột hoặc một ô.

Mọi ví dụ là **mã minh họa**, lấy từ [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md) (quy chế giả định `QC01`, hệ thống lịch hẹn `DA1`). Không chép sang BRD thật. Mã ngoài bảng mã chuẩn của file đó — như `SYS-01` và tên nhóm quy tắc `A` — là mã minh họa riêng của skill.

**Quy ước mọi ô** (theo [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 3): không để trống. Chắc chắn không có thì `—` hoặc `n/a`; chưa biết, đang chờ một người thì `chưa chốt (<ai>)`; ô lớp sau sẽ điền thì `chờ lớp n` (không ❓, không `Q-B`); chưa tìm được căn cứ thì AI ghi ❓ `[CẦN BA CHỐT] <phát biểu>` và thêm một dòng `Q-B`. Bảng không có cột căn cứ riêng thì ghi căn cứ cuối ô chính dạng `— <nguồn>`. Ví dụ in nghiêng của template phải được thay hết.

## Tiêu đề và khối giới thiệu

**Định nghĩa:** dòng tiêu đề và khối trích dẫn ngay dưới nó, giúp người mở file biết trong 10 giây tài liệu chứa gì, dựng từ đâu, đọc thế nào, và không chứa gì.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `# BRD — {{TÊN DỰ ÁN}} {{PHÂN HỆ}}` | Tên dự án và phân hệ bằng chữ, đúng chữ ở mọi tài liệu khác | `BRD — Lịch hẹn khách` (minh họa) | Tên viết tắt nội bộ mà khách không dùng |
| Dòng 1 của khối: `{{n}} mục tiêu, {{n}} yêu cầu, {{n}} bên liên quan … dựng từ {{nguồn}}` | **Số đếm thật** của `OBJ`, `BRQ`, `SH` trong thân tài liệu, `{{phạm vi}}` và loại nguồn (văn bản pháp luật, khảo sát, feedback) | Điền cuối cùng, đếm từ bảng; mỗi lần thêm/bỏ mã phải đếm lại — đây là bản chép, thân thắng khi lệch | Số ước chừng, số của bản trước |
| Dòng 2: `Mỗi BRQ gắn một OBJ, một căn cứ, tiêu chí chấp nhận` | Giữ nguyên câu cam kết của template; nó là phép thử mà reviewer dùng | Giữ | Sửa nhẹ đi thành "hầu hết" |
| Dòng 3: chi tiết luồng ở QT, ràng buộc ở BR, không đặc tả màn hình và dữ liệu | Hai đường dẫn tới thư mục lớp 2 và lớp 6, và câu nói BRD **không chứa** màn hình, dữ liệu | Theo đúng bốn câu của `00_quy_uoc_chung` mục 3.1: chứa gì (có số), dựng từ đâu, đọc thế nào (mã, ký hiệu), không chứa gì và nằm ở đâu | Liệt kê nội dung từng mục; đó là mục lục, không phải khối giới thiệu |

## Thông tin tài liệu

**Định nghĩa:** thẻ lý lịch của tài liệu theo ISO 9001:2015 mục 7.5.2 — định danh, thuộc dự án nào, ai chịu trách nhiệm, ở trạng thái nào, ai được đọc.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã tài liệu | `BRD_{MÃ DỰ ÁN}_{PHẠM VI}` | `BRD_DA1_LichHen` (minh họa). `PHẠM VI` PascalCase tiếng Việt không dấu, đúng `00_quy_uoc_chung` mục 2 | Thêm số phiên bản vào mã (phiên bản ở ô riêng) |
| Dự án · Phân hệ | Tên dự án, tên phân hệ mà BRD này phủ | Một dự án có nhiều phân hệ thì mỗi phân hệ một BRD, hoặc nêu rõ phân hệ nào trong phạm vi | Tên chung chung |
| Khách hàng · Đơn vị sử dụng | Bên ký hợp đồng và đơn vị thực sự dùng hệ thống; hai bên khác nhau thì ghi cả hai | `Công ty … (khách hàng) · các chi nhánh thuộc công ty (đơn vị sử dụng)` | Chỉ ghi một bên khi có hai |
| Phiên bản hiện tại · Trạng thái | `v{NN}` khớp dòng "hiện tại" của Version control; trạng thái một trong `Nháp · Chờ review · Đã duyệt · Hết hiệu lực` | `v00 · Nháp` | Trạng thái tự chế ("Gần xong") |
| Người soạn · Người review · Người duyệt | Tên kèm vai trò, đủ ba người; chưa có người review thì `chưa chốt (<ai>)` | `Tên — BA` · `Tên — BA review chéo` · `Tên — Đại diện khách hàng` | Ghi AI làm người duyệt hoặc người review (tên agent reviewer độc lập không thay cho người); người soạn có thể ghi AI hỗ trợ nhưng người duyệt luôn là người |
| Mức mật | `Nội bộ · Hạn chế · Mật` | Chọn theo nội dung nhạy cảm nhất của tài liệu (số liệu, văn bản chưa công bố) | Để "Công khai" |

## Version control

**Định nghĩa:** lịch sử thay đổi của tài liệu theo mẫu `00_quy_uoc_chung` mục 3.3; cũng là nơi ghi các lần điền ô chờ lớp và lượt điền ngược (`00_quy_uoc_chung.md` mục 10). Skill lớp không có bảng riêng — phiên bản của skill theo bảng của `ba-overview`.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tên version | `v00`, `v01`… Dòng hiện tại có `<br>(hiện tại)`, tô xanh, in đậm | Tăng `NN` khi phát hành bản mới có thay đổi được duyệt; sửa chính tả không tăng | Hai dòng cùng "hiện tại" |
| Ngày cập nhật | `YYYY-MM-DD` | `2026-10-27` | `27/10/2026` — dạng `DD/MM/YYYY` dùng cho ngày trong thân tài liệu (ngày ký, ngày tạm hoãn, "BA chốt"), không dùng ở cột này |
| PIC | Người chịu trách nhiệm bản đó | Tên người | "Nhóm BA" |
| Mô tả | Thay đổi của bản; mỗi quyết định của BA ghi **BA chốt dd/mm/yyyy: …** | `- Điền ngược mục 8 và 12 sau lớp 6.` `- BA chốt 28/10/2026: OBJ-01 đích 90%.` | Kể lại các lần sửa giữa chừng. Lượt điền ngược không ghi vào đây thì lớp 2–6 không truy ngược được |

## Phê duyệt

**Định nghĩa:** ai xác nhận BRD là nền cho các lớp sau, theo ISO/IEC/IEEE 29148 mục 6.4 và BABOK 5.5. Chỉ người điền, AI không điền.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Vai trò | Các dòng có sẵn của template: BA soạn · Đại diện khách hàng — người tài trợ dự án · Product owner · Tech lead (khối do `00_quy_uoc_chung` mục 3.4 bắt buộc) | Dòng `Đại diện khách hàng — người tài trợ dự án` và dòng `Product owner` là một `SH` có vai trò `Duyệt` ở mục 4; `BA soạn` và `Tech lead` là đội dự án, không có dòng `SH` (`Tech lead` ở đây và `Dev lead` ở RACI là một vai) | Dòng khách hàng hoặc PO mà người đó không có trong mục 4 |
| Họ tên · Ngày · Ý kiến | Tên người; ngày ký `DD/MM/YYYY`; ý kiến kèm điều kiện nếu có | Để trống tới khi người đó thật sự duyệt | AI tự điền tên hoặc ngày |

---

## Mục 1 — Bối cảnh và vấn đề nghiệp vụ

**Định nghĩa:** trả lời "hiện nay chuyện gì đang diễn ra và nó gây hại gì", theo BABOK 6.1 Analyze Current State và 29148 9.3.2 Business purpose. Chỉ nêu **vấn đề**, không nêu giải pháp (xem "Vấn đề và giải pháp" ở phần lõi).

### 1.1. Bối cảnh

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Đoạn văn bối cảnh | Đơn vị đang làm nghiệp vụ gì, theo cách nào, **quy mô** (số trung tâm, số người dùng, số giao dịch trong năm) | Một hai đoạn văn xuôi, mỗi con số kèm nguồn: *"Các trung tâm nhận khoảng … yêu cầu đặt lịch mỗi tháng (khảo sát hiện trạng, sheet …)"* | Lịch sử thành lập đơn vị; quảng cáo phần mềm; con số không nguồn |

### 1.2. Vấn đề và cơ hội

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `#` | `P-nn`, đánh số liên tục | Một dòng một vấn đề. Cơ hội đánh `P-nn` luôn, mở đầu ô bằng "Cơ hội:" | Hai vấn đề trong một dòng |
| Vấn đề hoặc cơ hội | Thực tế đang gây hại, mô tả bằng hiện tượng quan sát được | *Khách phải tới trung tâm xếp hàng để đăng ký, trung bình mất nửa ngày* | "Chưa có phần mềm đặt lịch" (giải pháp viết ngược); "quy trình chưa tối ưu" (không quan sát được) |
| Bằng chứng — số liệu, khảo sát, feedback | Nguồn chứng minh có thật và nguyên văn câu hoặc số | *Khảo sát hiện trạng, sheet 2, dòng 14: "…" (trích nguyên văn)* | Tên file trơn không chỗ cụ thể; ý kiến người soạn |
| Hệ quả nếu không giải quyết | Cái giá cụ thể: thời gian, chi phí, sai sót, vi phạm văn bản | *Khách bỏ cuộc không đặt được lịch; nhân viên tiếp đón nhận đăng ký sai lượt, có thể vượt hạn mức của `QC01 Đ5.1`* | "Kém hiệu quả", "không hiện đại" |

### 1.3. Căn cứ pháp lý và chính sách

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Văn bản | Tên đầy đủ kèm **viết tắt** dùng ở mọi nơi trong dự án | *Quy chế lịch hẹn (QC01)* | Hai viết tắt cho một văn bản |
| Số hiệu · ngày | Số hiệu, ngày ban hành đúng như bản gốc | Chép từ trang đầu văn bản | Số hiệu viết theo trí nhớ |
| Hiệu lực | Ngày có hiệu lực; còn hiệu lực hay bị sửa đổi, thay thế | *Có hiệu lực từ …; sửa đổi bởi …* | Bỏ trống khi văn bản đã bị thay |
| Vai trò với dự án | `Nguồn chính` kèm điều, khoản đã dùng; `Nguồn tham khảo`; hoặc `Đã rà, không sinh yêu cầu` | **Nguồn chính** — Đ5.1, Đ5.2, Đ6.1, Đ6.3, Đ7.2. Chỉ ghi điều đã đọc và thật sự sinh `BRQ` | Ghi cả văn bản mà chưa đọc toàn văn |

**Kết luận rà soát** (đoạn dưới bảng): với mỗi văn bản đã rà nhưng không sinh yêu cầu, một dòng *đã rà toàn văn, không sinh yêu cầu* kèm **lý do** ("quy định thủ tục hành chính của cơ quan cấp trên, không chạm nghiệp vụ lịch hẹn"). Đây là ghi chép chống rà lại.

---

## Mục 2 — Mục tiêu nghiệp vụ

**Định nghĩa:** trả lời "sau khi xong, tổ chức muốn đạt cái gì, đo bằng gì, đến hạn nào", theo BABOK 6.2 Define Future State và tiêu chí SMART. Cách viết từng `OBJ`, ví dụ đạt và không đạt: [`muc-tieu-va-yeu-cau.md`](muc-tieu-va-yeu-cau.md).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `OBJ-nn` | Một `OBJ` một KPI | Dùng lại mã đã bỏ |
| Mục tiêu | Kết quả nghiệp vụ mong muốn của tổ chức, một câu, chủ ngữ là tổ chức | *Khách đặt lịch hẹn mà không phải tới trung tâm xếp hàng* | Tính năng, màn hình; hai kết quả trong một câu |
| Chỉ số đo — KPI | **Cách tính** — tử số, mẫu số, nguồn dữ liệu đo, tần suất | *Tỷ lệ lịch hẹn do khách tự đặt trực tuyến trên tổng lịch hẹn trong tháng, lấy từ sổ lịch hẹn* | Tên chỉ số trơn ("tỷ lệ hài lòng") không nói cách tính |
| Hiện tại | **Giá trị đang có** (baseline), kèm ngày đo và nguồn | *0% (mọi lịch đăng ký trực tiếp) — khảo sát hiện trạng* | Số ước đoán; để trống. Chưa đo thì `chưa chốt (<ai>)` kèm `Q-B` |
| Mục tiêu (giá trị đích) | Giá trị cần đạt kèm đơn vị và biên | *≥ 90% — hợp đồng, phụ lục KPI* | Khoảng mơ hồ ("khoảng 90%"); số AI tự nghĩ ra (dùng `[CẦN BA CHỐT] đề xuất …`) |
| Thời hạn | Mốc thời gian đo, có điểm mốc 0 rõ | *Sau 3 tháng kể từ ngày vận hành chính thức* | "Sớm nhất có thể"; "3 tháng" không nói tính từ đâu |
| Vấn đề giải quyết | Một hoặc nhiều `P-nn` mà mục tiêu này giải quyết | `P-01` | `P-nn` không tồn tại ở mục 1.2 |

Dòng mẫu đạt (minh họa) — dạng khai triển trong bảng của `OBJ-01` ở `vi-du-xuyen-suot.md` ("Tỷ lệ lịch hẹn đặt trực tuyến tăng từ 0% lên 90% sau 3 tháng vận hành"):

| Mã | Mục tiêu | KPI | Hiện tại | Mục tiêu | Thời hạn | Vấn đề |
|---|---|---|---|---|---|---|
| OBJ-01 | Khách đặt lịch hẹn mà không phải tới trung tâm xếp hàng | Số lịch hẹn do khách tự đặt trực tuyến ÷ tổng số lịch hẹn trong tháng | 0% (khảo sát hiện trạng) | ≥ 90% | Sau 3 tháng kể từ ngày vận hành chính thức | P-01 |

---

## Mục 3 — Phạm vi

**Định nghĩa:** ranh giới của dự án — cái gì trong, cái gì ngoài và ai lo phần ngoài — theo 29148 9.3.3 Business scope.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Trong phạm vi | Các nhóm nghiệp vụ dự án sẽ phủ, cách nhau bằng `·` | *Đặt lịch · Duyệt lịch · Nhắc lịch · Hủy lịch* — đúng tên nhóm quy trình mà lớp 2 sẽ dùng | Tính năng; thứ không có căn cứ trong hợp đồng hoặc dự toán |
| Ngoài phạm vi — Nội dung | Thứ có thể bị tưởng là trong phạm vi mà không làm | *Đối chiếu giấy tờ tại cổng* | Thứ chẳng ai tưởng là trong phạm vi |
| Ngoài phạm vi — Lý do | Vì sao không làm, kèm nguồn | *Hợp đồng, phụ lục 1: "không bao gồm quản lý cổng"* | Lý do cảm tính |
| Ngoài phạm vi — Xử lý ở đâu | Bộ phận, hệ thống hoặc giai đoạn lo thay | *Nhân viên quầy, ngoài hệ thống* (sẽ thành bước 🟡 ở lớp 2) | `chưa chốt` khi có thể hỏi được; "không ai" |
| Giai đoạn | MVP P1 gồm …, P2 gồm … | Mỗi nhóm trong phạm vi ở đúng một giai đoạn; khớp với ưu tiên `BRQ` ở mục 7 | Giai đoạn mâu thuẫn ưu tiên MoSCoW |

### 3.1. Sơ đồ ngữ cảnh

**Định nghĩa:** một bức tranh cho thấy hệ thống ở giữa và mọi bên trao đổi thông tin nghiệp vụ với nó. Không phải sơ đồ kiến trúc, không vẽ API.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Hình chữ nhật `[…]` | Tác nhân (người) | `U1[Khách]`, `U2[Nhân viên tiếp đón]` | Chức năng, màn hình |
| Hình tròn `(( ))` | **Hệ thống đang xây**, một hình duy nhất | `S((Hệ thống lịch hẹn))` | Chia hệ thống thành module (thuộc lớp 2, 5) |
| Hình `[[ ]]` | Hệ thống ngoài, kèm tên | `EXT1[[Hệ thống CRM — SYS-01]]` (`SYS-01` là mã minh họa riêng của skill) | Hệ thống không có luồng với hệ thống đang xây |
| Mũi tên và nhãn | **Luồng thông tin nghiệp vụ**, một nhãn một luồng, hướng đúng chiều đi. Mũi tên từ hệ thống ngoài có thể mang tên sự kiện nghiệp vụ (template ghi `{{sự kiện}}`) | `Yêu cầu lịch hẹn`, `Kết quả duyệt`, `Trạng thái khách` | Tên API, giao thức, "gọi REST" |

Mọi hệ thống ở mục 3.2 và mọi tác nhân ở các `SH` có vai trò `Dùng` phải xuất hiện. Bên liên quan không có luồng thông tin với hệ thống (người duyệt ngân sách) thì không vào sơ đồ; bên nhận báo cáo thì có, vì có luồng ra.

### 3.2. Hệ thống liên quan

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Hệ thống | Tên và mã hệ thống ngoài | `SYS-01 — Hệ thống CRM` (`SYS-01` là mã minh họa riêng của skill) | Hệ thống chưa tồn tại mà viết như đã có |
| Chủ sở hữu | Đơn vị chịu trách nhiệm vận hành | Tên đơn vị | `chưa chốt` khi tài liệu tích hợp có ghi |
| Chiều | `Vào` (gửi vào hệ thống này) · `Ra` · `Hai chiều` | Tính theo hệ thống đang xây | Bỏ trống |
| Dữ liệu trao đổi | Loại thông tin nghiệp vụ trao đổi | *Trạng thái khách (đang dùng dịch vụ, ngừng dịch vụ, chuyển chi nhánh)* | Danh sách trường, định dạng bản tin |
| Nguồn sự thật của | **Dữ liệu mà hệ thống đó là chủ duy nhất**; hệ thống đang xây chỉ nhận bản sao, không tự tạo hay sửa | *Thông tin khách hàng* | Hai hệ thống cùng là nguồn sự thật của một dữ liệu; để trống khi hệ thống ngoài có dữ liệu |

Cột `Nguồn sự thật của` là trung tâm để lớp 2 và lớp 3 biết dữ liệu nào hệ thống đang xây không được tự tạo. Nguồn của từng dòng ghi cuối ô `Dữ liệu trao đổi`: `— <tài liệu tích hợp>`.

---

## Mục 4 — Bên liên quan

**Định nghĩa:** ai có lợi ích trong dự án hoặc bị nó ảnh hưởng, **bao gồm cả bên không thao tác hệ thống**, theo kỹ thuật BABOK 10.43 Stakeholder List, Map, or Personas. Với tác nhân **người**, bên liên quan ⊇ tác nhân; tác nhân hệ thống và hệ thống ngoài không có dòng `SH` (hệ thống ngoài ở mục 3.2, tác nhân hệ thống do Quy trình mục 2 đặt tên). Cột `Bên liên quan` là nơi **đặt tên vai** của tác nhân người trước tiên; Quy trình mục 2 và lớp 5 giữ đúng chữ. Lớp 5 lấy các dòng có vai trò `Dùng` để cấp `ACT-nn`. Chỉ đội dự án (BA, Dev lead) không có dòng `SH` ở đây — họ có cột riêng ở RACI.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `SH-nn` | Một dòng một **vai trò**, không phải một người | Một dòng cho hai vai trò khác nhau |
| Bên liên quan | Tên vai trò hoặc tổ chức, **đúng chữ** sẽ dùng ở quy trình mục 2 | `SH-01 Giám đốc trung tâm`, `SH-02 Nhân viên tiếp đón`, `SH-03 Khách` | Tên người; tên khác với quy trình |
| Thuộc | Đơn vị hoặc tổ chức người đó thuộc, nội bộ hay bên ngoài | *Trung tâm dịch vụ — nội bộ* · *Khách — bên ngoài* | Bỏ trống với bên ngoài |
| Quan tâm chính | Điều họ muốn hoặc lo; kèm nguồn nếu có | *Không phải xếp hàng; biết ngay lịch đã được duyệt chưa — khảo sát, mục …* | Mô tả chức danh thay vì quan tâm |
| Ảnh hưởng | `Cao · Trung bình · Thấp` — khả năng họ làm dự án đổi hướng hoặc dừng | Chấm theo bằng chứng (ký hợp đồng, duyệt ngân sách = Cao) | Chấm theo chức danh |
| Mức quan tâm | `Cao · Trung bình · Thấp` — họ để tâm tới dự án nhiều mức nào | Người dùng hằng ngày thường Cao quan tâm, Thấp ảnh hưởng. `Trung bình` xử lý theo phần lõi, mục "Bên liên quan và tác nhân" (lựa chọn của skill) | Cùng giá trị cho mọi dòng |
| Vai trò trong dự án | Một hoặc vài giá trị: `Duyệt · Dùng · Tư vấn · Được thông báo`, cách nhau `·` | `Duyệt` cho `SH-01 Giám đốc trung tâm` (duyệt ngân sách, không thao tác hệ thống); `Dùng` cho `SH-02 Nhân viên tiếp đón` và `SH-03 Khách`; một vai vừa quyết định vừa thao tác thì ghi `Duyệt · Dùng`. **`Dùng` = thao tác hệ thống** | `Dùng` cho bên không thao tác; thiếu `Dùng` cho người thao tác |

Tổ hợp `Ảnh hưởng × Mức quan tâm` quyết định cách làm việc: xem bảng ở phần lõi, mục "Bên liên quan và tác nhân".

### 4.1. Ma trận RACI cho sản phẩm tài liệu

**Định nghĩa:** ai làm gì với **các sản phẩm tài liệu của giai đoạn phân tích** (chốt phạm vi, chốt quy tắc…), không phải vai trò vận hành hệ thống. `R` thực hiện · `A` chịu trách nhiệm cuối · `C` được hỏi ý kiến · `I` được thông báo.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Cột `Hạng mục` | Sản phẩm hoặc quyết định cần chốt | *Chốt mục tiêu và KPI · Chốt phạm vi · Chốt quy trình · Chốt business rule · Xác nhận danh sách tác nhân · Nghiệm thu nghiệp vụ* | Thao tác vận hành ("duyệt lịch hẹn") |
| Cột `SH-nn` | Chọn những `SH` thật sự tham gia chốt, tối đa vài người chủ chốt | Đúng mã ở bảng trên | Đưa mọi `SH` vào |
| Cột `BA`, `Dev lead` | Đội dự án | `R` cho BA ở hầu hết hàng; `I` hoặc `C` cho Dev lead | `A` cho BA: người chịu trách nhiệm cuối phải là bên có thẩm quyền của khách |
| Ô chữ `R`, `A`, `C`, `I` | Một chữ cái; nếu một người vừa `A` vừa `R` ghi `A/R` | **Mỗi hàng đúng một `A`**, ít nhất một `R` | Hàng không có `A`; hàng có hai `A` |

Cột `Dev lead` của RACI và dòng `Tech lead` ở Phê duyệt là **một vai** (`00_quy_uoc_chung` mục 3.4 dùng nhãn sau, template RACI dùng nhãn trước). RACI do **BA chốt**. AI điền đề xuất dựa trên cột `Vai trò trong dự án` và đánh ❓ ở tên hàng, cùng một `Q-B`.

---

## Mục 5 — Thuật ngữ

**Định nghĩa:** những từ nghiệp vụ cấp tổ chức dùng trong BRD mà người ngoài nghiệp vụ có thể hiểu khác nhau. Thuật ngữ chi tiết của domain thuộc quy trình mục 1.1; các lớp sau **dẫn** bảng này, không định nghĩa lại.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Thuật ngữ | Từ hoặc cụm từ **đúng chữ** dùng trong BRD, in đậm | **Lượt lịch hẹn đã dùng**, **Lịch hẹn** | Từ chung ai cũng hiểu; hai từ đồng nghĩa cho một khái niệm |
| Định nghĩa | Một hai câu, đủ để phân biệt với từ gần nghĩa | *Lịch hẹn ở Chờ duyệt, Đã duyệt, Đã đến hẹn, hoặc Đã hủy muộn; được tính vào hạn mức lịch hẹn mỗi tuần của khách* | Định nghĩa vòng quanh; chép nguyên điều luật nếu dài |
| Căn cứ | Văn bản, điều, hoặc tài liệu khách nơi từ đó được định nghĩa | `QC01 Đ5.1 Tối đa 2 lịch hẹn mỗi tuần` | Bỏ trống; nếu tự định nghĩa thì `GD-xxxx` hoặc ❓ |

---

## Mục 6 — Mô hình nghiệp vụ

**Định nghĩa:** mô tả nghiệp vụ **trước và sau** khi có giải pháp, ở mức tổ chức. Cách làm chi tiết theo bước và người là việc của lớp 2.

### 6.1. Hiện trạng — As-Is

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Đoạn tóm tắt As-Is | Cách làm hiện nay trong một hai đoạn, **điểm đau** (trỏ `P-nn`), và các **chứng từ giấy** hoặc công cụ đang dùng | *Khách tới trung tâm, ghi tên vào sổ đăng ký giấy (…) — xem `P-01`. Nhân viên tiếp đón duyệt trên sổ, báo lại bằng điện thoại.* Căn cứ: biên bản khảo sát, mẫu chứng từ | Bảng bước chi tiết, sơ đồ swimlane (lớp 2); mô tả của giải pháp mới |

### 6.2. Mong muốn — To-Be

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nhóm quy trình | Nhóm nghiệp vụ, đúng tên nhóm ở mục 3 `Trong phạm vi` | `Lịch hẹn` | Tên nhóm khác với mục 3 |
| Quy trình | Mã quy trình thuộc nhóm — `QT-nn` hoặc `{XX}-nn` — khi lớp 2 đã có; lượt đầu: tên nghiệp vụ kèm `chờ lớp 2` | `LH-01 Đặt và duyệt lịch hẹn` · `LH-02 Hủy lịch hẹn`; lượt đầu: *Đặt và duyệt lịch hẹn — chờ lớp 2* | Bịa mã khi lớp 2 chưa cấp; ❓ hoặc `Q-B` cho ô này (đây là ô chờ lớp, không phải câu hỏi) |
| Thay đổi so với hiện trạng | Điều gì **đổi** so với 6.1, nói bằng nghiệp vụ, trỏ `P-nn` hoặc `BRQ-nn` | *Khách tự gửi yêu cầu không tới trung tâm; nhân viên tiếp đón duyệt trước ngày hẹn* | Mô tả màn hình; "chuyển lên hệ thống" trơn |
| Tài liệu chi tiết | Đường dẫn tương đối tới file lớp 2; lượt đầu `chờ lớp 2` | `../2-business-process/{file}` | Đường dẫn đoán |

Hai cột `Quy trình` và `Tài liệu chi tiết` do `create-bp` điền khi viết lớp 2, trước cổng ra của lớp đó (`00_quy_uoc_chung.md` mục 10).

---

## Mục 7 — Yêu cầu nghiệp vụ

**Định nghĩa:** danh sách nhu cầu nghiệp vụ mà giải pháp phải đáp ứng — mỗi dòng một `BRQ`. Thuộc tính viết tốt theo 29148 5.2.5 (`00_quy_uoc_chung` mục 7). Cách viết, bảng "viết thế này / đừng viết thế này": [`muc-tieu-va-yeu-cau.md`](muc-tieu-va-yeu-cau.md).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `BRQ-nn` | Mã bỏ ghi ⊘ và liệt kê ở đầu bảng | Dùng lại mã |
| Yêu cầu | **Một** nhu cầu, câu khẳng định, chủ ngữ là tổ chức hoặc tác nhân nghiệp vụ, dùng *phải · không được · chỉ khi* | *Trung tâm phải xét duyệt hoặc từ chối mọi yêu cầu đặt lịch trước ngày hẹn* (`BRQ-01`) | "Hệ thống cho phép…", màn hình, nút; hai nhu cầu nối bằng "và"; "kịp thời", "đầy đủ" không định nghĩa |
| Lý do | **Vì sao** cần, trả lời "bỏ đi thì mất gì" (thiếu nghiệp vụ hay thiếu tuân thủ) | *Để không còn đăng ký trực tiếp, khách biết kết quả trước ngày đến (P-01)* | Lặp lại cột Yêu cầu |
| Mục tiêu | **Một** mã `OBJ-nn` mà yêu cầu phục vụ | `OBJ-01` | Hai mã; mã không tồn tại. Phục vụ hai mục tiêu thì tách `BRQ` hoặc chọn mục tiêu chính và nêu mục tiêu phụ ở cột Lý do |
| Căn cứ | Một hoặc nhiều nguồn, cách nhau `·`: văn bản + điều khoản; khảo sát nguyên văn; `GD-xxxx`; ❓ + `Q-B` | `QC01 Đ6.1 Duyệt trước ngày hẹn` | Bỏ trống; "theo yêu cầu khách" không chỗ cụ thể |
| Ưu tiên | `M` phải có · `S` nên có · `C` có thì tốt · `W` không làm giai đoạn này | `M` | Chọn `M` cho tất cả. Nghĩa vụ pháp luật thường là `M`; khác thì ghi lý do ở cột Lý do |
| Tiêu chí chấp nhận | Điều kiện để chứng minh yêu cầu **đã được đáp ứng**, dạng *Given / When / Then* hoặc mệnh đề đo được | *Mọi yêu cầu đặt lịch có kết quả duyệt hoặc từ chối trước ngày hẹn: 100% yêu cầu đã gửi trước hạn có kết quả trước 17 giờ ngày hôm trước* | "Hệ thống hoạt động tốt"; điều kiện chỉ quan sát được trên giao diện |
| Bên đề xuất | `SH-nn` đã nêu yêu cầu | `SH-02` | Tên người; `SH` chưa có ở mục 4. Yêu cầu sinh từ văn bản mà không ai đề xuất: ghi `SH` của cơ quan ban hành. Mục 4 chưa có dòng đó thì **thêm một dòng `SH` cho cơ quan ban hành** (bên không thao tác, vai trò chọn theo bằng chứng, thường `Được thông báo`) rồi dẫn nó; không ghi tên cơ quan trần, không để trống — **lựa chọn của skill** |

---

## Mục 8 — Chính sách và quy tắc nghiệp vụ

**Định nghĩa:** chỗ BRD cho thấy **có bao nhiêu nhóm quy tắc** và chúng nằm ở đâu, theo nhóm Directives (business policy, business rule) của BMM. BRD chỉ **đếm và trỏ**, không phát biểu nội dung quy tắc — phát biểu là việc của lớp 6. Lượt đầu chưa có lớp 6 nên điền theo "Các chỗ chờ lớp sau" ở phần lõi, do `create-br` điền.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nhóm quy tắc | Tên nhóm đúng như lớp 6 đặt (chữ cái nhóm kèm tên) | `A — Hạn mức lịch hẹn` (tên nhóm là mã minh họa riêng của skill) | Tên nhóm tự đặt khi lớp 6 chưa cấp; lượt đầu ghi `chờ lớp 6` |
| Số quy tắc | Số đếm từ lớp 6, kiểu số | `4` (nhóm `A` có `BR-A01` đến `BR-A04`) | Con số ước lượng; bản chép lệch lớp 6 (lớp 6 thắng); lượt đầu ghi `chờ lớp 6` |
| Căn cứ chính | Văn bản hoặc nguồn chính của nhóm, từ mục 1.3 | `QC01 Đ5.1 · Đ6.3 · Đ7.2` | Văn bản chưa có ở mục 1.3 |
| Tài liệu chi tiết | Đường dẫn và số mục của file BR | `../6-business-rules/{file}` mục `{n}`; lượt đầu `chờ lớp 6` | Nội dung quy tắc |

---

## Mục 9 — Yêu cầu phi chức năng mức nghiệp vụ

**Định nghĩa:** những đòi hỏi về **chất lượng** mà nghiệp vụ buộc phải có — bảo mật, tin cậy, hiệu năng, dễ dùng, tương thích, lưu vết — nhóm theo ISO/IEC 25010:2023. Chỉ mức nghiệp vụ; con số kỹ thuật (mili giây, dung lượng, thuật toán) để SRS. Cách viết: [`muc-tieu-va-yeu-cau.md`](muc-tieu-va-yeu-cau.md), phần NFR.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `NFR-nn` | Một mã một yêu cầu, kể cả khi cùng nhóm | Gộp nhiều yêu cầu một dòng |
| Nhóm ISO 25010 | Tên nhóm bằng tiếng Việt kèm tên chuẩn: `Bảo mật — Security`, `Tin cậy — Reliability`, `Hiệu năng — Performance efficiency`, `Dễ dùng — Interaction capability`, `Tương thích — Compatibility`. Template còn có dòng `Lưu trữ, kiểm toán` (thuộc Security — accountability); thêm dòng cho nhóm khác khi có yêu cầu | Giữ các dòng dựng sẵn; nhóm nào chưa có yêu cầu thì ô Yêu cầu ghi `n/a` kèm lý do ngắn, `Căn cứ` ghi `—`, `Ưu tiên` ghi `n/a` (**lựa chọn của skill**, template không nói) | Xóa dòng im lặng |
| Yêu cầu | Đòi hỏi chất lượng ở mức nghiệp vụ, **kiểm chứng được** (template không có cột tiêu chí chấp nhận nên mệnh đề đo được nằm ngay trong ô này) | *Dữ liệu khách chỉ nhân viên tiếp đón được phân công xem; mọi lần xem được ghi người, thời điểm* | "Bảo mật tốt"; "AES-256"; "phản hồi dưới 2 giây" |
| Căn cứ | Văn bản, hợp đồng, hoặc nhu cầu bên liên quan | `khảo sát hiện trạng, mục …` (bảng mã chuẩn không có điều khoản bảo mật); hoặc ❓ kèm `Q-B` | Bỏ trống |
| Ưu tiên | `M · S · C · W` | `M` | — |

Dòng bảo mật về dữ liệu nhạy cảm do `create-erd` đối chiếu với ERD mục 9 khi viết lớp 3, thêm hoặc sửa nếu thiếu (`00_quy_uoc_chung.md` mục 10). Lượt đầu viết theo đầu vào, **không** ghi `chờ lớp 3`.

---

## Mục 10 — Ràng buộc, giả định, phụ thuộc

**Định nghĩa:** ba loại điều kiện bên ngoài dự án mà BRD đứng trên đó. Nếu một điều sai, dự án sẽ bị ảnh hưởng — cột cuối nói ảnh hưởng ra sao. Phân biệt `ASM-nn` với `GD-xxxx`: xem mục "Tìm căn cứ" ở phần lõi.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Loại | `Ràng buộc` · `Giả định` · `Phụ thuộc` | Ba loại phân biệt như bảng dưới | Loại sai (một giả định mà có người chịu trách nhiệm và hạn thì là phụ thuộc) |
| Mã | `CON-nn` · `ASM-nn` · `DEP-nn`, đánh số riêng từng loại | `CON-01`, `ASM-01`, `DEP-01` | Dùng chung một dãy số |
| Nội dung | Phát biểu một điều; căn cứ ghi cuối ô dạng `— <nguồn>`; `ASM` chưa nguồn thì dẫn `GD-xxxx` bôi đỏ, hoặc `[CẦN BA CHỐT]` nếu AI viết | Xem bảng ví dụ dưới | Căn cứ trống; nhiều điều trong một ô |
| Ảnh hưởng nếu sai | Hậu quả cụ thể lên mục tiêu, phạm vi, tiến độ khi điều kiện không đúng | *OBJ-01 không đo được vì không có số liệu lịch hẹn* | "Ảnh hưởng dự án" |

| Loại | Là gì | Ví dụ (minh họa) |
|---|---|---|
| Ràng buộc `CON` | Điều **đã bị áp từ ngoài**, dự án không thương lượng: thời hạn, ngân sách, văn bản bắt buộc, nền tảng khách chỉ định | *Bàn giao MVP trước … — hợp đồng, Điều …* |
| Giả định `ASM` | Điều **được coi là đúng** để BRD đi tiếp, chưa có ai cam kết cụ thể | *Các trung tâm có nhân viên tiếp đón duyệt lịch trong giờ hành chính — biên bản khảo sát, mục …* |
| Phụ thuộc `DEP` | Việc **bên khác phải làm** thì dự án mới đúng tiến độ hoặc đúng nghĩa, có người chịu trách nhiệm và hạn | *Hệ thống CRM (`SYS-01`) cung cấp sự kiện trạng thái khách trước … — thỏa thuận tích hợp* |

---

## Mục 11 — Tiêu chí thành công và chuyển đổi

**Định nghĩa:** khi nào nghiệp vụ coi dự án thành công, và việc gì phải làm để chuyển từ cách làm cũ sang cách làm mới (transition requirements, BABOK 2.3: dữ liệu cũ, đào tạo, chạy song song). Mức nghiệp vụ, không phải kế hoạch kỹ thuật.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Hạng mục | Một trong bốn hạng mục dựng sẵn, thêm nếu cần | Giữ bốn dòng: Tiêu chí nghiệm thu nghiệp vụ · Chuyển đổi dữ liệu · Đào tạo · Vận hành song song | Xóa dòng; hạng mục không áp dụng thì `n/a` kèm lý do |
| Nội dung | **Tiêu chí nghiệm thu nghiệp vụ:** hai tầng — lúc bàn giao, mọi `BRQ` ưu tiên `M` đạt tiêu chí chấp nhận (mục 7); sau vận hành, các `OBJ` đạt đích theo `Thời hạn`. **Chuyển đổi dữ liệu:** dữ liệu cũ nào cần mang sang, ai xác nhận số đúng. **Đào tạo:** ai cần học gì, trước mốc nào. **Song song:** thời gian chạy cả hai cách và điều kiện tắt cách cũ | *Số lịch hẹn đang chờ trên sổ giấy được nhập sang trước ngày vận hành; Giám đốc trung tâm xác nhận số liệu đã khớp* | Kế hoạch di trú kỹ thuật; điều kiện nghiệm thu không trỏ về `OBJ`/`BRQ` |
| Người chịu trách nhiệm | Tên **vai trò** (`SH-nn`) chịu trách nhiệm | `SH-01` | Tên đội chung chung |

---

## Mục 12 — Truy vết

**Định nghĩa:** bảng nối ngược từ mục tiêu xuống quy trình, quy tắc, use case, để thấy mỗi yêu cầu có được phủ không. Điền hai cột đầu ngay; ba cột sau do skill của lớp tương ứng điền khi viết lớp đó — `Quy trình` ← `create-bp`, `Use case` ← `create-ucl`, `Business rule` ← `create-br` (`00_quy_uoc_chung.md` mục 10; phần lõi, "Các chỗ chờ lớp sau").

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mục tiêu | `OBJ-nn` | Lặp lại ở mỗi dòng của cùng `OBJ` | — |
| Yêu cầu nghiệp vụ | `BRQ-nn`, **một dòng một `BRQ`** | Khớp đúng mục 7 | `BRQ` không có dòng; `BRQ` không có `OBJ` |
| Quy trình | Mã `QT-nn` hoặc `{XX}-nn` (kèm bước nếu cần) phủ yêu cầu; nhiều mã cách nhau `·` | `LH-01 bước 4` | Lượt đầu: `chờ lớp 2`. Bịa mã khi lớp 2 chưa cấp |
| Business rule | Mã `BR-{nhóm}{nn}` kèm tên ngắn | `BR-A04 Người đặt hộ không tự duyệt` | Lượt đầu: `chờ lớp 6`. `BRQ` không sinh quy tắc thì `—` kèm lý do |
| Use case | **Mã UC theo G2** — mã WBS ở cột `No` của lớp 5, không tiền tố `UC-` | `DA1.WEB.03.01.04` · `DA1.WEB.03.01.05` | Lượt đầu: `chờ lớp 5`. Mã dự toán thay mã UC |

Mỗi `BRQ` phải xuống được **ít nhất một** quy trình, business rule hoặc use case; `BRQ` ưu tiên `W` ghi `—` kèm "ngoài giai đoạn". Ngược lại, quy trình hoặc UC nào truy ngược không về được `BRQ` nào là dấu hiệu thiếu `BRQ` hoặc phạm vi trôi.

---

## Mục 13 — Rủi ro còn lại

**Định nghĩa:** rủi ro **còn lại sau biện pháp** đã tính, làm yếu một căn cứ của BRD — một giả định sai, một văn bản chưa chắc, một bên chưa cam kết. Không phải rủi ro dự án thông thường (nhân sự, tiến độ chung).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `RK-nn` | — | — |
| Rủi ro | Điều có thể xảy ra, nêu cả hậu quả | *Khách đổi hạn mức lịch hẹn mà không báo, các quy tắc dựa trên `QC01 Đ5.1` sai* | Rủi ro không gắn căn cứ nào |
| Căn cứ bị ảnh hưởng | Mã bị yếu đi: `BRQ-nn`, `OBJ-nn`, `ASM-nn`, `DEP-nn`, `GD-xxxx` | `ASM-01 · BRQ-03` | Bỏ trống |
| Khả năng | `C · TB · T` (cao, trung bình, thấp) | Chấm theo bằng chứng | Mọi rủi ro cùng `TB` |
| Tác động | `C · TB · T` | — | — |
| Biện pháp | Việc đã làm hoặc sẽ làm để giảm | *Xin xác nhận bằng văn bản trước khi chốt lớp 6* | "Theo dõi" trơn |
| Cần khách xác nhận văn bản | `Có · Không` | `Có` khi rủi ro chỉ khách giải quyết được | — |

Mỗi `ASM-nn`, `DEP-nn` có "Ảnh hưởng nếu sai" lớn nên sinh một `RK`.

## Mục 14 — Câu hỏi cần chốt

**Định nghĩa:** những điểm **chưa ai trả lời** và chưa có gì dựa vào, mã `Q-Bnn`. Khác `GD-xxxx` ở chỗ chưa có câu trả lời tạm (`so-cu-va-gia-dinh.md` mục 4). Không còn câu mở thì ghi *Không còn câu mở*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `Q-Bnn` | Grep sổ giả định trước khi thêm | Trùng câu hỏi đã có |
| Câu hỏi | Điều cần trả lời, đủ để người đọc không cần ngữ cảnh | *Hạn mức lịch hẹn tính theo tuần lịch hay tuần trượt 7 ngày?* | Câu hỏi có/không không nói chọn gì |
| Kịch bản | Một tình huống **cụ thể** làm câu hỏi thành vấn đề | *Khách đặt thứ Bảy và thứ Hai kế tiếp: hai tuần hay một?* | Mô tả trừu tượng |
| Đề xuất mặc định | Câu trả lời AI hoặc người soạn đề nghị | *Tuần lịch, thứ Hai tới Chủ nhật* | Để trống; BA không có gì để chấp nhận hay bác |
| Người chốt | Ai quyết | `BA + khách` | Tên chung chung |
| Quyết định | Khi chốt: `✅ dd/mm/yyyy: …`. Chấp nhận tạm thì `→ GD-xxxx` | `✅ 28/10/2026: tuần lịch` | AI tự điền ✅ |

## Mục 15 — Điểm tạm hoãn

**Định nghĩa:** những điều được hoãn **có chủ đích**, kèm điều kiện để mở lại. Khối do `00_quy_uoc_chung` mục 6 bắt buộc, template đã có sẵn ở mục 15 (vị trí các khối cuối: [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6). Mã `TH-nn` do bộ skill đặt. Điểm tạm hoãn khác câu hỏi `Q-B` (chưa ai trả lời), giả định (tạm coi là đúng) và rủi ro (có thể xảy ra). Không có điểm nào thì giữ khối và ghi *Không có*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `TH-nn` | — | — |
| Nội dung | Điều được hoãn có chủ đích | *Hủy lịch hàng loạt khi trung tâm đóng cửa* | Điều chưa ai nghĩ tới (đó là câu hỏi) |
| Ngày tạm hoãn | `DD/MM/YYYY` | — | — |
| Điều kiện mở lại | Sự kiện hoặc quyết định khiến điểm này quay lại | *Khi khách chốt phạm vi giai đoạn 2* | "Sau này" |

## Mục 16 — Nguồn

**Định nghĩa:** danh sách mọi tài liệu BRD dựng từ đó, theo `00_quy_uoc_chung` mục 6. Là mục cuối của template (sau mục 15 Điểm tạm hoãn). Cũng là nơi **khai viết tắt** của văn bản pháp luật một lần.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tài liệu | Tên đầy đủ kèm viết tắt dùng trong BRD | *Quy chế lịch hẹn — `QC01`* | Văn bản đã dùng mà không có dòng ở đây |
| Đường dẫn | Đường dẫn tương đối tới file trong thư mục đầu vào `/ba-init` | `../../input/…` | Đường dẫn tuyệt đối trên máy cá nhân; link chết |
| Dùng cho | Mục nào của BRD dùng tài liệu này | *Mục 1.3, `BRQ-01` đến `BRQ-03`, `NFR-01`* | "Tham khảo chung" |
