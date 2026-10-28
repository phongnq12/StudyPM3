# Điền từng mục của template Quy trình nghiệp vụ

Phần tra cứu của skill [`create-bp`](../SKILL.md). Đọc phần lõi trước. Thứ tự các mục dưới đây là thứ tự của
[`business_process.md`](../../../../2-ba-overview/templates/2-business-process/business_process.md). Mỗi mục có một câu
**Định nghĩa**, rồi bảng `Cột/ô | Điền gì | Viết thế nào | Đừng viết`. Mọi mã, tên, con số, điều khoản trong ví
dụ là **mã minh họa** lấy từ [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md); không chép sang
tài liệu dự án. Mã không có trong bảng mã chuẩn (mục 3 của file đó) — như `D-04`, `GS-02`, `QT-01`, `QC01 Đ6.2` — là **mã minh họa riêng của skill**, không trùng nghĩa với mã nào của bảng. Cách đặt ô căn cứ, `Q-…`, `GD-xxxx`, ❓ `[CẦN BA CHỐT]`: theo
[`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md), không nhắc lại ở từng ô.

Bóc bước và vẽ sơ đồ nằm riêng ở [`buoc-va-so-do.md`](buoc-va-so-do.md); cách ghi để lớp 3–6 nhận được nằm ở
[`ung-vien-cho-lop-sau.md`](ung-vien-cho-lop-sau.md). Cuối file này có mục "Điền vào BRD" và bảng các chỗ template tự mâu thuẫn.

## Phần đầu file

Gồm tiêu đề, khối giới thiệu, bảng Thông tin tài liệu, bảng Version control và khối Phê duyệt.

**Định nghĩa:** phần định danh tài liệu và cho người đọc biết trong mười giây tài liệu này chứa gì, dựng từ đâu, đọc thế nào.

| Cột/ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `# QUY TRÌNH {{TÊN DOMAIN}} — {{DỰ ÁN}}` | Tên domain bằng chữ hoa, tên dự án | `QUY TRÌNH THĂM GẶP — <tên dự án>` | Mã dự án thay cho tên |
| Khối giới thiệu, dòng 1 | Số đếm **đúng** của tài liệu: số quy trình, số tác vụ nền, số tham số cấu hình; nguồn dựng | *"**3 quy trình, 2 tác vụ nền và 4 tham số cấu hình** của lịch hẹn, dựng từ quy chế QC01 và khảo sát hiện trạng."* Mỗi lần thêm, bỏ một mục thì sửa số | Số đếm chép từ bản cũ; nguồn ghi chung chung "tài liệu khách hàng" |
| Khối giới thiệu, các dòng còn lại | Giữ nguyên các dòng của template, **trừ hai dòng mâu thuẫn skill** (xem bảng cuối file, dòng 12 và 13): dòng 3 chỉ kể bốn loại nút không số, dòng 4 chỉ kể ba loại nguồn của Căn cứ. Sửa hai dòng đó **trong file dự án** | Dòng 3: thêm loại thứ năm — nút giao sang quy trình khác. Dòng 4: *"Cột **Căn cứ** dẫn văn bản pháp luật, `D-xx`, `CH-xx`, `GS-xx`, `GD-xxxx`, `OBJ-xx`/`BRQ-xx` của BRD, hoặc khảo sát hiện trạng (trích nguyên văn); sau lượt điền ngược thêm `BR-…`."* Dòng nói về 🟡 xóa nếu tài liệu **không có** bước 🟡 nào | Viết lại các dòng còn lại bằng chữ khác — mỗi tài liệu một kiểu thì người đọc phải đọc lại |
| Khối giới thiệu, đường dẫn ERD | Dòng `Mã kỹ thuật ở [ERD](../3-erd/{{file}})` của template | ERD chưa có thì ghi *"Mã kỹ thuật ở ERD — `chờ lớp 3`"* và bỏ liên kết; lớp 3 thay bằng đường dẫn thật | Đường dẫn tới file chưa tồn tại |
| Khối giới thiệu, câu cuối: `Tài liệu **không** chứa …` | Câu "không chứa gì, nằm ở đâu" — `00_quy_uoc_chung` mục 3.1 bắt buộc, template đã có sẵn | Thay `{{…}}` bằng hai ý: không chứa gì, và nó nằm ở đâu. Ví dụ: *"Tài liệu **không** chứa tên bảng, mã kỹ thuật, vòng đời trạng thái, danh sách use case, nội dung từng business rule — xem ERD, máy trạng thái, lớp 5, lớp 6."* Lớp chưa có thì ghi `chờ lớp n` thay đường dẫn | Câu chung chung kiểu "không chứa nội dung ngoài phạm vi"; để nguyên `{{…}}` |
| Mã tài liệu | `QT_{MÃ DỰ ÁN}_{PHẠM VI}` — `00_quy_uoc_chung.md` mục 2 | `QT_<mã dự án>_LichHen` (phạm vi viết PascalCase không dấu) | Có đuôi `_v00` — số phiên bản ở dòng dưới |
| Dự án · Phân hệ | Tên dự án và tên phân hệ mà tài liệu này phủ | Đúng chữ ở BRD | Mã dự án thay cho tên |
| Phiên bản · Trạng thái | `v{NN}` · một trong `Nháp · Chờ review · Đã duyệt · Hết hiệu lực` | AI chỉ đặt tới `Chờ review`, và chỉ sau khi reviewer độc lập đã chạy | `Đã duyệt` do AI tự đặt |
| Người soạn · Người review · Người duyệt | Tên kèm vai trò, đủ ba người | Người review hoặc người duyệt chưa có thì `chưa chốt (<ai>)` khi mới khởi tạo | Để trống; ghi AI làm người review hoặc người duyệt |
| Mức mật | Một trong `Nội bộ · Hạn chế · Mật` | Chọn theo nội dung nhạy cảm nhất của tài liệu | Để "Công khai" |
| Tài liệu cấp trên | Đường dẫn BRD đã dẫn ở mục 1 | `../1-brd/<file BRD>` | Đường dẫn tuyệt đối |
| Version control | Một dòng mỗi phiên bản, đúng mẫu `00_quy_uoc_chung.md` mục 3.3: dòng hiện tại tô xanh in đậm; ngày `YYYY-MM-DD` | Cột Mô tả liệt kê: số quy trình `LH-01` đến `LH-03`, số tác vụ nền, số tham số, quyết định `D-xx`, thuật ngữ. Mỗi quyết định của BA ghi **BA chốt dd/mm/yyyy**. Những chỗ `chờ lớp n` ghi một dòng. Lượt điền ngược ghi riêng một dòng: *"Điền ngược: cột Căn cứ thêm BR-…; dòng Business rule ở bảng Nguồn"* | Kể lại từng lần sửa giữa chừng; chép dòng Version control của skill |
| Phê duyệt | Ba dòng có sẵn của template: BA soạn · Product owner / Khách hàng · Tech lead (`00_quy_uoc_chung.md` mục 3.4) | Để trống đến khi có người ký; chỉ người điền, AI không điền | Điền tên người chưa ký |

## Mục 1 — Phạm vi và nguồn

**Định nghĩa:** ranh giới của tài liệu — nghiệp vụ nào được đặc tả ở đây, nghiệp vụ nào chỉ nối vào, và từ nguồn nào mà dựng.

| Cột/ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Trong phạm vi | Các nghiệp vụ domain này đặc tả, phân cách bằng `·` | Lấy từ BRD mục phạm vi: *"Đặt và duyệt lịch hẹn · Hủy lịch hẹn · Nhắc lịch"*. Mỗi nghiệp vụ phải có quy trình phủ — đây là cổng ra của lớp 2 | Chức năng, màn hình; nghiệp vụ không thuộc BRD |
| Ngoài phạm vi | Mỗi dòng một nội dung thuộc domain khác hoặc tài liệu khác, kèm nơi đặc tả | *"Cấp tài khoản khách — đặc tả tại **QT-04**; tài liệu này chỉ nối vào."* Mã `QT-nn` hoặc tên tài liệu. Nội dung chưa ai đặc tả thì ghi một câu hỏi vào mục 11.3 thay vì ghi "ngoài phạm vi" | Nội dung không ai đặc tả mà vẫn ghi "ngoài phạm vi" |
| Bảng Nguồn — Nguồn | Tên nguồn, một dòng một nguồn | BRD · Business rule (nếu đã có) · từng văn bản pháp luật · khảo sát hiện trạng · dự toán | Gộp nhiều văn bản một dòng |
| Bảng Nguồn — Đường dẫn | Đường dẫn tương đối; văn bản pháp luật ghi **số hiệu** — Điều và đường dẫn tới tệp | `QC01 — Điều 5, 7 · <đường dẫn>`. Viết tắt `QC01` khai **một lần** ở đây, các mục sau dùng `QC01 Đ5.1` | Đường dẫn tuyệt đối trên máy cá nhân |
| Bảng Nguồn — Vai trò | Nguồn này dùng cho phần nào của tài liệu | *"Nghĩa vụ lịch hẹn → bước và điểm kiểm soát"*. Văn bản đã rà toàn văn mà không sinh bước thì ghi rõ: *đã rà toàn văn, không sinh quy trình — vì …* | "Tham khảo" |

Business rule: lớp 6 chạy sau nên khi viết lớp 2 **chưa có** file BR. Dòng Business rule trong bảng Nguồn ghi
`chưa có (lớp 6 chạy sau)` — và được thay bằng đường dẫn thật ở lượt điền ngược.

### 1.1. Thuật ngữ

**Định nghĩa:** các danh từ nghiệp vụ chi tiết của domain, mỗi từ một nghĩa. Thuật ngữ cấp tổ chức nằm ở BRD mục 5; ở đây
chỉ chi tiết của domain (xem [`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) dòng "Thuật ngữ chi tiết của
domain"). Mọi danh từ nghiệp vụ dùng trong tài liệu phải có mặt ở đây — đây là cổng ra.

| Cột/ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Dòng giới thiệu "Các loại khóa định nghĩa ở mục 3…" | Dòng chỉ đường tới mục 3, 3.1, 6 | Giữ nguyên; bỏ vế "Các loại khóa" nếu mục 3 không có khối khóa | Dòng nói tới khối đã xóa |
| Tiêu đề nhóm `#### a. …` | Gom thuật ngữ theo **khái niệm**: đối tượng được quản lý, số liệu, thời hạn, danh mục | Chữ cái a, b, c… liên tiếp. Nhóm Phê duyệt và chứng từ là nhóm cuối, lấy chữ cái kế tiếp (template ghi `{{x}}`) | Xếp theo thứ tự chữ cái tiếng Việt, hoặc theo thứ tự xuất hiện trong văn bản |
| Thuật ngữ | Một từ hoặc cụm, in đậm | Đúng chữ đã dùng trong bảng bước và văn bản nguồn. Một khái niệm một tên — đã chọn *"lịch hẹn"* thì không còn chỗ nào viết tên khác cho cùng khái niệm | Hai tên cho một khái niệm; từ mà không ai dùng trong tài liệu |
| Định nghĩa | Nghĩa trong domain này, đủ để phân biệt với từ gần nghĩa | Có **ví dụ số cụ thể** khi dễ nhầm; dẫn `D-xx`, `GS-xx`, `CH-xx` thay vì chép lại: *"**Lượt đã dùng** — lịch hẹn trong tuần đang bị chiếm bởi một lịch hẹn ở Chờ duyệt, Đã duyệt, Đã đến hẹn, hoặc Đã hủy muộn. Số lượt mỗi tuần: `CH-01`."* | Định nghĩa vòng tròn; quy tắc có chữ "phải", "không được" (chuyển thành `GS-xx` hoặc điểm kiểm soát) |
| Thực thể ERD | Tên bảng ERD ứng với thuật ngữ, trong backtick | ERD chưa có thì: thuật ngữ **sẽ có bảng** ghi `chờ lớp 3` (`create-erd` điền); thuật ngữ là **khái niệm tính toán** thì **để trống**, đúng comment của template. Ví dụ: *Lượt đã dùng* — `chờ lớp 3` (lớp 3 điền `Quy_Luot`); *Lượt còn lại* — để trống vì là số tính. Ghi vào Version control: *"Cột Thực thể ERD chờ lớp 3."* | Tự đặt tên bảng; để trống ô của thuật ngữ sẽ có bảng; ghi `—` ở cột này (lựa chọn của skill: một cách ghi cho một nghĩa); xóa cột |
| Bảng nhóm "Phê duyệt và chứng từ" — Thuật ngữ, Định nghĩa | Các động từ workflow: **Gửi duyệt**, **Duyệt**, **Từ chối**, **Trả về**, và loại chứng từ dùng ở mục 8 | Mỗi thuật ngữ nói rõ *ai làm, đối tượng đổi sang trạng thái nào (tên tiếng Việt)*. Bảng này **hai cột**, không có Thực thể ERD, vì mục tiêu là hành động, không phải thực thể. Chứng từ có bảng thì đặt vào nhóm khái niệm phía trên, có cột Thực thể ERD | Thêm cột ERD vào bảng hai cột; mô tả nút bấm |
| Nhóm "Phê duyệt và chứng từ" cả nhóm | Chỉ giữ khi domain **có** phê duyệt hoặc chứng từ | Domain không có thì xóa nhóm và ghi một dòng trong Version control | Giữ bảng với `{{}}` |

## Mục 2 — Tác nhân

**Định nghĩa:** ai tham gia domain — người, tổ chức, hệ thống ngoài, và "Hệ thống" — và mỗi bên làm gì. Đây là **nguồn** để lớp 5
lấy tên và cấp `ACT-nn`.

| Cột/ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tác nhân | Tên **vai trò**, in đậm | Vai người: **đúng chữ BRD mục 4** (cột Bên liên quan), ví dụ *"**Nhân viên tiếp đón**"*. Tên khác trong văn bản pháp luật ghi ở cột Căn cứ; lệch nghĩa thì ghi `Q-P…`, không tự đổi. Tác nhân hệ thống, hệ thống ngoài, tác vụ nền do mục này đặt tên. Tên được giữ **nguyên chữ** ở lớp 5 và ở mọi bảng bước | Tên người; "Người dùng", "Admin" |
| Vai trò trong {domain} | Các thao tác nghiệp vụ tác nhân này làm, phân cách bằng `·` | Động từ + đối tượng, đúng với những bước trong Phần A: *"Duyệt hoặc từ chối yêu cầu đặt lịch · Nhận báo lịch chờ duyệt quá hạn"* | Quyền kỹ thuật (`lich_hen.approve`); thao tác không xuất hiện ở bước nào |
| Căn cứ | Điều khoản phân công, hoặc `D-xx` khi dự án chọn người làm, hoặc ❓ | `QC01 Đ6.1` · `D-04 Nhân viên tiếp đón duyệt thay Giám đốc trung tâm` | Để trống. Hàng "Hệ thống" ghi `—` |
| Hàng **Hệ thống** | Việc hệ thống **tự làm**: kiểm tra, tính, ghi sổ, chạy nền | Đúng tên "Hệ thống" ở mọi bảng bước. Hệ thống ngoài thì một hàng riêng, tên hệ thống | Gộp hệ thống ngoài vào "Hệ thống" |
| Dòng **Tách nhiệm bắt buộc — COSO** | Danh sách cặp việc **không được do cùng một người** — đây là nguồn của lớp 5 và lớp 6 | *"Người đặt hộ yêu cầu không tự duyệt yêu cầu đó (`QC01 Đ6.3`)."* Mỗi cặp ứng với một điểm kiểm soát loại **Tách nhiệm** ở Phần A và mục 9. Nội dung có mã do lớp 6 cấp | Chỉ ghi chung chung "tách nhiệm theo quy định" |
| Câu "Mỗi thao tác workflow là một quyền riêng" | Liệt kê các thao tác workflow của domain | *gửi duyệt, duyệt, từ chối, trả về, hủy* — mỗi thao tác một quyền, nên mỗi thao tác sẽ thành một UC riêng ở lớp 5 | Ma trận quyền: ma trận chi tiết ở lớp 5 và SRS |

## Mục 3 — Bản đồ quy trình và dữ liệu trục

**Định nghĩa:** bức tranh các quy trình của domain nối với nhau thế nào, và (khi có) dữ liệu sổ cái mà các quy trình cùng ghi.
Bản đồ **luôn có**; khối dữ liệu trục **chỉ dùng khi domain có sổ cái, tồn kho, ví, quỹ lượt** — tức đối tượng có số dư thay đổi
qua nhiều quy trình và phải bảo toàn.

| Cột/ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Sơ đồ bản đồ | Mỗi quy trình trong tài liệu một nút, nối bằng cạnh nhãn **điều kiện** kích hoạt quy trình sau | `A[LH-01 Đặt và duyệt lịch hẹn] -- "khách hủy lịch chờ duyệt hoặc đã duyệt" --> B[LH-02 Hủy lịch hẹn]`. Quy trình thuộc tài liệu khác dùng nút `QT-xx` hoặc `{XX}-nn` của domain khác; tô khác để thấy là ngoài tài liệu. Nút ghi **mã + tên** | Bước bên trong quy trình; nút không có mã; cạnh không nhãn |
| Khối dữ liệu trục (bốn bảng nhỏ) | Dùng khi domain có sổ cái, tồn, ví | Xem các dòng dưới. Domain không có thì **xóa cả khối** (từ "Bảng dữ liệu trục" tới hết "Các loại khóa") và bỏ vế "Các loại khóa" ở dòng giới thiệu mục 1.1 | Bịa "dữ liệu trục" cho domain chỉ có chứng từ phê duyệt |
| Bảng dữ liệu trục — Bảng | Thực thể sổ: nơi mọi quy trình ghi vào hoặc đọc ra để tính | Tên bảng ERD; ERD chưa có thì tên nghiệp vụ tiếng Việt kèm ❓ (một câu hỏi `Q-P` chung cho cả tài liệu: *tên thực thể chờ lớp 3*) | Bảng chỉ một quy trình dùng |
| — Trả lời | Câu hỏi nghiệp vụ mà bảng này trả lời | *"Khách này còn bao nhiêu lịch hẹn trong tuần này?"* | Mô tả cột của bảng |
| — Ai ghi | Quy trình nào tạo, quy trình nào sửa | *"LH-01 trừ lượt · LH-02 trả lượt"* | Tên tác nhân |
| Loại biến động | Mỗi cách làm số dư đổi, một dòng; định nghĩa ở 1.1 | Cột `Loại` in đậm; `Dấu` là `+` hoặc `−` (hoặc cả hai nếu tùy trường hợp); `Quy trình` là mã quy trình gây ra | Loại không có quy trình |
| Nguyên tắc bảo toàn | Đẳng thức luôn đúng của sổ | *"Lượt còn lại = `CH-01` − lượt đã dùng; lượt đã dùng = số lịch của người đó trong tuần ở Chờ duyệt, Đã duyệt, Đã đến hẹn, cộng số lịch Đã hủy muộn."* ERD sẽ lấy làm `R-xx` | Đẳng thức không kiểm được bằng số liệu |
| Các loại khóa — Khóa | Tên khóa, in đậm | Khóa là trạng thái chặn **suy ra từ dữ liệu**, hệ thống tự áp, **không lưu cờ riêng**. *"Khóa lịch đã qua ngày hẹn"* | Khóa do người bấm; khóa phải lưu cột cờ |
| — Bật khi | Điều kiện dữ liệu làm khóa có hiệu lực | *ngày hẹn < hôm nay* — số dẫn `CH-xx` | Sự kiện bấm nút |
| — Chặn | Những thao tác bị chặn khi khóa bật | *duyệt, từ chối, sửa, hủy* | "Mọi thao tác" |
| — Gỡ khi | Điều kiện gỡ; không gỡ được thì ghi **không gỡ** | *không gỡ — lịch đã qua là lịch sử* | Để trống |
| — Căn cứ | `D-xx`, điều khoản, hoặc `GS-xx` | `D-08 Không duyệt lịch đã qua ngày hẹn` | — |

### 3.1. Quy tắc dùng chung

**Định nghĩa:** quy tắc **tính toán, ghi sổ, đồng thời, giao dịch, làm tròn, múi giờ** mà nhiều quy trình cùng áp. Phép thử
"bỏ trình tự đi câu còn đúng không?": còn đúng và là cách tính hoặc cách ghi thì là `GS-xx`; nếu là định nghĩa thì thuộc 1.1; nếu là
nghĩa vụ cưỡng chế tại một bước thì là điểm kiểm soát. `GS-xx` là **ứng viên BR** của lớp 6.

| Cột/ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `GS-nn`, tên ngắn, in đậm: **GS-01 Tuần tính từ thứ Hai, giờ Việt Nam** | Mã duy nhất, không dùng lại. Tên ngắn là một cụm danh từ | Mã không có tên |
| Quy tắc | Một hoặc hai câu khẳng định, có **công thức hoặc ví dụ số**, nêu quy trình áp | *"Tuần tính từ 00:00 thứ Hai tới 23:59 Chủ nhật theo giờ Việt Nam; lịch được tính vào tuần của **ngày hẹn**. Áp cho LH-01, LH-02."* Tham số dẫn `CH-xx` | "Hệ thống phải bảo đảm đúng" — không kiểm được; con số trần; nhắc bước hay màn hình |

Domain không có quy tắc dùng chung thì giữ tiêu đề 3.1 và ghi một dòng *Không có quy tắc dùng chung*; không xóa mục.

## Mục 4 — Quyết định thiết kế

**Định nghĩa:** nhật ký các lựa chọn nghiệp vụ của dự án, theo kiểu Architecture Decision Record — chỗ mà nguồn đầu vào **im lặng
hoặc cho nhiều cách**, và BA đã chọn một. Một `D-xx` đáng ghi khi đủ ba điều: nguồn không quy định (hoặc cho phép nhiều cách); có
phương án khác hợp lý; ảnh hưởng ít nhất một bước hoặc một quy trình. Điều đã có điều khoản thì **không** là `D-xx`: dẫn điều khoản.

| Cột/ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Dòng "Các mã … đã bỏ" | Mã `D-xx` đã bỏ khỏi bảng | *Các mã D-04, D-30 đã bỏ, không dùng lại.* Không có thì ghi *Chưa có mã nào bị bỏ* | Xóa dòng của mã đã bỏ khỏi bảng đã phát hành; đánh ⊘ thay vì xóa |
| Mã | `D-nn` in đậm | Mã tăng dần, duy nhất | Dùng lại mã đã bỏ |
| Nhóm | Mảng nghiệp vụ mà quyết định thuộc về | *Phê duyệt · Lượt · Hủy · Thông báo* — dùng lại các nhóm đã có | Mỗi quyết định một nhóm mới |
| Quyết định | **Chọn gì, vì sao, loại phương án nào**, phạm vi áp và ngoại lệ — template không có cột riêng cho "vì sao" và "loại", nên gộp vào ô này bằng ba câu ngắn | *"Nhân viên tiếp đón duyệt thay Giám đốc trung tâm. Vì Giám đốc trung tâm không trực hằng ngày. Loại: Giám đốc trung tâm duyệt mọi lịch. Áp cho LH-01 bước 4; ngoại lệ lịch có người đại diện cơ quan — vẫn do Giám đốc trung tâm duyệt."* | Chỉ ghi kết quả không có lý do; ghi giải pháp kỹ thuật |
| Ngày chốt · người chốt | `BA chốt dd/mm/yyyy`, tên người | **AI được tạo dòng `D-xx` ở trạng thái đề xuất**, ghi `❓ chờ BA chốt — Q-P03` kèm một dòng ở mục 11.3 có đề xuất mặc định. Chỉ khi BA ký thì đổi thành `BA chốt dd/mm/yyyy` | Ngày điền hộ BA; để trống |

## Phần A, B… — nhóm quy trình

**Định nghĩa:** tiêu đề `# PHẦN A — {{NHÓM QUY TRÌNH}}` gom các quy trình cùng một chặng nghiệp vụ. Nhóm theo *chặng của vòng đời việc*
(tiếp nhận → xử lý → kết thúc), không theo tác nhân. Mỗi phần một tiêu đề cấp 1, chữ cái liên tiếp A, B, C. Domain ít quy trình thì chỉ
một Phần A. Khối lặp nằm **dưới** tiêu đề phần và lặp cho từng quy trình, theo thứ tự mã.

## Khối lặp cho mỗi quy trình

Tiêu đề `## {{XX-01}}. {{Tên quy trình}}` — mã đúng hệ `{XX}-nn`; tên là **động từ + đối tượng**: *"Đặt và duyệt lịch hẹn"*, không phải *"Quản lý lịch hẹn"*. Quy trình con hậu tố chữ: `LH-01B`; khi nào tách xem phần lõi.

### Bảng thông tin quy trình

**Định nghĩa:** thẻ lý lịch của quy trình theo ISO 9001 mục 4.4 và SIPOC — kết quả, chủ, bắt đầu từ đâu, giao cho ai, chạy bao lâu một lần.

| Dòng | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mục đích | **Kết quả nghiệp vụ** quy trình tạo ra, một câu | *"Mỗi yêu cầu đặt lịch có quyết định duyệt hoặc từ chối trước ngày hẹn, và khách biết kết quả."* Chủ ngữ là việc được hoàn tất | Danh sách các bước; "Quy trình này nhằm quản lý…" |
| Chủ quy trình | **Một** vai trò chịu trách nhiệm cuối cho kết quả, lấy từ mục 2 | *"Giám đốc trung tâm"*. Chủ ≠ người làm nhiều bước nhất. Không phải "Hệ thống" — hệ thống không chịu trách nhiệm | Hai chủ; người cụ thể |
| Kích hoạt | **Sự kiện nghiệp vụ** bắt đầu quy trình: một yêu cầu đến, một thời điểm tới, một điều kiện dữ liệu thành đúng, một tác nhân quyết định | *"Khách có nhu cầu lịch hẹn."* Quy trình bắt đầu bởi `N-xx` thì ghi *"`N-01` phát cảnh báo"* | Thao tác giao diện: "Khách bấm nút Đặt lịch" |
| Đầu vào từ | **Nhà cung cấp** (SIPOC): quy trình, tác nhân, hoặc chứng từ cung cấp đầu vào | *"Khách — yêu cầu đặt lịch; LH-03 — lịch hẹn còn hiệu lực"*. Quy trình do tác nhân tự bắt đầu thì ghi tác nhân đó | Để trống |
| Đầu ra kích hoạt | **Khách hàng** (SIPOC): quy trình kích hoạt tiếp theo và điều kiện | *"LH-03 khi buổi hẹn diễn ra · QT-01 khi cần gửi thông báo"*. Bên nhận không phải quy trình (khách nhận thông báo) ghi ở bước báo, không ghi ở đây; không có quy trình nào theo sau thì ghi `—` | Quy trình tiếp theo không kèm điều kiện |
| Tần suất | Quy trình chạy bao lâu một lần | *Hằng ngày · theo sự kiện · 200 lượt/tháng* — con số ghi kèm nguồn đo; chưa biết thì `chưa chốt (<ai>)` | Con số không nguồn |
| Chỉ số theo dõi | Chỉ số đo hiệu quả, **kiểm được**, ngưỡng dẫn `CH-xx` | *"Thời gian từ gửi yêu cầu tới duyệt ≤ `CH-04` giờ (mã minh họa riêng của skill)."* Template ghi "không bắt buộc": **giữ dòng và ghi `—`** khi không có, để mọi quy trình cùng một hình | Chỉ số mơ hồ ("nhanh hơn") |
| Căn cứ | Mọi nguồn mà quy trình dựa vào, phân cách `·` | VBPL · `BR-…` (sau điền ngược) · `D-xx` · `GS-xx` · `CH-xx`. Phải **khớp** với những gì nêu ở cột Căn cứ của bảng bước: nguồn nào đã dẫn ở bước thì có ở đây và ngược lại | Căn cứ mà không bước nào dùng |

### Bảng các bước

**Định nghĩa:** trình tự các việc từ sự kiện kích hoạt tới kết quả. **Một bước = một tác nhân + một động từ + một đối tượng.** Cách bóc
bước, hạt của bước và quy tắc đánh số: [`buoc-va-so-do.md`](buoc-va-so-do.md).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Bước | Số thứ tự `1, 2, 3…` liền mạch; bước ngoài phạm vi viết `🟡 5` | Mỗi số ứng với **đúng một nút** `B{số}` trong sơ đồ. Bước thuộc nhánh vẫn đánh số liền | Số `3a`, `3.1`; bỏ số; trùng số |
| Tác nhân | **Một** vai trò đúng chữ ở mục 2, hoặc "Hệ thống" | *"Nhân viên tiếp đón"*. Hệ thống tự làm thì "Hệ thống" | "Nhân viên tiếp đón / Giám đốc trung tâm"; hai tác nhân một ô |
| Hành động | Động từ + đối tượng; chỗ **quyết định** in đậm; nêu trạng thái đích bằng tên tiếng Việt khi bước làm đổi trạng thái | *"Nhân viên tiếp đón **duyệt hoặc từ chối** yêu cầu đặt lịch"*; *"Hệ thống **kiểm còn lượt** của khách trong tuần của ngày hẹn"*; *"Hệ thống giữ một lượt, chuyển yêu cầu sang Chờ duyệt"* | Nút, màn, ô nhập, API, tên bảng, mã trạng thái; "và" nối hai việc không cùng một giao dịch |
| Căn cứ | Nguồn **của bước này**, 0–n, phân cách `·` | Bước có kiểm tra, quyết định, ghi sổ, hoặc nghĩa vụ phải có căn cứ: `QC01 Đ5.1 · CH-01`. Bước chỉ chuyển giao đơn thuần: `—` | Điều khoản trơ không kèm điều và khoản; quy tắc có con số trần |
| Chứng từ | Chứng từ bước **sinh ra hoặc dùng** | Có mẫu ban hành: **Mẫu số** in đậm. Không có mẫu: *không có mẫu*. Không sinh chứng từ: `—`. Chứng từ nội bộ hệ thống, không văn bản nào yêu cầu lập, cũng ghi *không có mẫu* — phân biệt ở mục 8.2 / 8.3 | Chứng từ không xuất hiện ở mục 8 |
| Dòng 🟡 | Bước ngoài phạm vi: nghĩa vụ có thật, hệ thống **không** xây chức năng | Tô vàng cả dòng bằng `<span style="color:#B8860B">`; số bước ghi `🟡 6`; cột Căn cứ nêu nghĩa vụ **và** nơi BRD loại ra khỏi phạm vi. Chưa rõ BRD loại hay không thì ❓ và `Q-P…` — chỉ BRD hoặc BA quyết | Tô vàng bước vì khó làm |

**Chú dưới bảng bước (lựa chọn của skill — template chưa có chỗ này).** Bước hệ thống chạy cùng request với bước người ngay trước thì thêm một câu chú, ví dụ *"Bước 2–3 chạy cùng request với bước 1; khoảng chờ nằm giữa bước 3 và bước 4."* Lớp 4, 5 dựa vào câu này để gắn bước hệ thống vào bước người (chuyển là 👤, dẫn dải `LH-01 bước 1–3`).

### Sơ đồ

**Định nghĩa:** hình của chính bảng bước, theo BPMN dựng bằng Mermaid, để nhìn một lần thấy đường rẽ và chỗ bàn giao. Không thêm
việc mà bảng không có.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nút bắt đầu `S0` | Chép **Kích hoạt** thành một sự kiện | `S0([Khách có nhu cầu lịch hẹn])` | Nút bấm |
| Nút `B{số}` | Mỗi bước một nút, **đúng số của bảng** | `B1["B1. Gửi yêu cầu đặt lịch"]` — hoạt động hình chữ nhật; chỗ quyết định hình thoi `B2{"B2. Còn lượt?"}` | Hai nút cùng số; nút mang số không có trong bảng |
| Nút không số | Bắt đầu, kết thúc, **nhánh chặn**, kết quả con của bước đứng ngay trước, bước chuyển sang quy trình khác | `X1(["Chặn — hết lượt"])` · `R1>"Lịch đã duyệt"]` · `E1[["Sang LH-03"]]`. Kết quả con dùng hình cờ `>"…"]`, **không** dùng hình sự kiện `(["…"])` vì sự kiện kết thúc không có luồng ra | Nút không số cho việc có người làm |
| Cạnh | Nhãn là điều kiện của cổng; cạnh qua làn có nhãn là **cái được bàn giao** hoặc **khoảng chờ** | `B2 -- "Còn lượt" --> B3`; `B3 -- "chờ duyệt" --> B4` | Cổng chỉ có một cạnh ra |
| Làn | `subgraph` theo tác nhân, khi có từ hai tác nhân | `subgraph L1["Khách"]` | Làn không có bước |

Ký hiệu đầy đủ và ví dụ hoàn chỉnh: [`buoc-va-so-do.md`](buoc-va-so-do.md).

### Trường hợp biên

**Định nghĩa:** những tình huống chạm ngưỡng, hiếm, hoặc ngoài luồng chính mà QC phải kiểm. Mỗi dòng là **một tình huống kiểm thử được**:
có dữ kiện cụ thể và kết quả quan sát được.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tình huống | Một kịch bản đủ dữ kiện để dựng testcase | *"Khách gửi yêu cầu cho khách đã dùng đủ `CH-01` lượt trong tuần."* Có số thì dẫn `CH-xx`, có biên thì ghi đúng biên: "đúng bằng ngưỡng", "ít hơn một giờ" | Nhiều tình huống một dòng; mô tả chung "dữ liệu không hợp lệ" |
| Xử lý | **Một** trong bốn kiểu, in đậm, rồi hệ quả và căn cứ | **Chặn** — hệ thống không cho tiếp, bản ghi không đổi · **Cho phép kèm điều kiện** — tiếp tục khi có điều kiện bổ sung (người có thẩm quyền, lý do) · **Cho phép** — dạng không điều kiện, dùng cho ca đúng biên mà hệ thống vẫn cho đi tiếp (ví dụ còn đúng một lượt); đây là lựa chọn của skill cho chỗ `Cho phép …` của template · **Cảnh báo** — tiếp tục, hệ thống ghi nhận và báo · **Chuyển quy trình** — việc chuyển cho quy trình khác (nêu mã). Kết thúc bằng căn cứ: *`QC01 Đ5.1`*, hoặc *BA chốt dd/mm/yyyy*, hoặc ❓ `Q-P…` | Kiểu xử lý thứ năm; "xử lý theo quy định"; ngày chốt hộ BA |

Quy tắc: mọi nút `Chặn` trong sơ đồ có **ít nhất một** dòng ở đây; mọi cổng có điều kiện số có **một dòng đúng biên**; mỗi ngoại lệ thủ
công hiện có (xem `buoc-va-so-do.md`) hoặc là dòng ở đây, hoặc là bước 🟡.

### Điểm kiểm soát bắt buộc

**Định nghĩa:** điều mà hệ thống phải cưỡng chế hoặc phải ghi nhận ở quy trình này, theo phân loại của template (dựa trên COSO). Bốn loại: **Ngăn chặn** (không cho
xảy ra), **Phát hiện** (cho xảy ra nhưng ghi và báo ngay), **Tách nhiệm** (hai việc không do một người), **Phê duyệt** (chỉ có hiệu
lực khi người có thẩm quyền chấp thuận).

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Dòng `**Điểm kiểm soát bắt buộc:**` | Mỗi điểm một cụm phân cách `·`; cụm có chủ ngữ, **phải / không được / chỉ khi**, điều kiện, và nơi áp | *"Hệ thống không cho giữ lượt khi khách đã dùng đủ `CH-01` lượt trong tuần (B2) · Người đặt hộ yêu cầu không được tự duyệt yêu cầu đó (B4)."* Mục 9 chép lại từng điểm này | Điểm không gắn bước; điểm không kiểm được; điểm trùng một câu trong bảng bước mà không thêm gì |

## Mục 5 — Tác vụ nền của hệ thống

**Định nghĩa:** những việc hệ thống tự chạy **theo lịch hoặc theo ngưỡng thời gian**, không do tác nhân kích. Bản chất là cảnh báo hoặc
chuyển trạng thái tự động, và tác vụ **tự làm trọn**: không bàn giao cho người nào làm tiếp. Domain không có thì giữ tiêu đề và ghi *Không có tác vụ nền* (số đếm ở khối giới thiệu ghi `0`).

Dòng mở đầu: ghi **múi giờ** thật (*"Giờ chạy theo giờ Việt Nam (UTC+7)."*), giữ hai câu về **khóa chống lặp** và **tự đóng**.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `N-nn`, in đậm | Duy nhất, không dùng lại | — |
| Tác vụ | Việc tác vụ làm, động từ + đối tượng | *"Nhắc lịch hôm trước"* (`N-01`) | Tên job kỹ thuật |
| Nguồn dữ liệu | Thực thể hoặc chứng từ tác vụ quét | *"Lịch hẹn ở Đã duyệt có ngày hẹn = ngày mai"* (tên nghiệp vụ, ERD chưa có) | Tên bảng chưa có trong ERD |
| Tham số | Mọi con số của tác vụ, dẫn `CH-xx` | `CH-03 Giờ chạy nhắc lịch` | Con số trần |
| Lịch chạy | Khi nào chạy | *hằng ngày vào giờ `CH-03`*; chạy theo chu kỳ thì dẫn tham số chu kỳ | "Định kỳ"; giờ ghi trần |
| Người nhận | Tác nhân nhận cảnh báo, hoặc "Hệ thống" nếu tự chuyển trạng thái | Tên đúng chữ mục 2 | Người nhận không có ở mục 2 |
| Khóa chống lặp | **Tổ hợp trường** định danh một cảnh báo, để chạy lại không tạo trùng | *"lịch hẹn + ngày nhắc"* | "Không gửi trùng" — không nói trùng theo cái gì |
| Kết quả | Việc tác vụ tạo ra, và điều kiện tự đóng | *"Cảnh báo, không tự sửa dữ liệu. Tự đóng khi lịch được hủy hoặc đã qua ngày hẹn."* Tác vụ tự đổi trạng thái thì ghi trạng thái đích: *"`N-02` chuyển lịch Đã duyệt sang Đã đến hẹn."* | Không nêu điều kiện tự đóng |

Một tác vụ phát sinh việc cho người thì cũng xuất hiện ở dòng **Kích hoạt** của quy trình nhận việc (*"`N-03` phát hiện lệch quỹ lượt"*): phần có người là một quy trình bắt đầu bằng hẹn giờ, còn `N-xx` làm trọn phần của máy.

### 5.1. Sự kiện nhận từ hệ thống ngoài

**Định nghĩa:** những thông báo mà hệ thống ngoài gửi vào, buộc domain phản ứng. Khác `N-xx` ở chỗ **sự kiện đến từ bên ngoài**, không do lịch.
Domain không có hệ thống ngoài thì giữ tiêu đề và ghi *Không có sự kiện từ hệ thống ngoài*.

Template **không định nghĩa** hai cột `Quy trình chung` và `Nhãn`; skill đọc như sau (lựa chọn của skill):

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Sự kiện từ {hệ thống} | Tên hệ thống trong tiêu đề cột; sự kiện là một câu | *"Hệ thống CRM: khách chuyển chi nhánh."* | Sự kiện mà không nói hệ thống gửi |
| Quy trình chung | Quy trình `QT-nn` hoặc `XX-nn` **xử lý** sự kiện | `LH-02 Hủy lịch hẹn` | Tên chức năng |
| Nhãn | Nhãn nghiệp vụ hệ thống gắn lên bản ghi bị ảnh hưởng để người dùng thấy nguyên nhân | *"Hủy do khách chuyển chi nhánh"* — tiếng Việt, ngắn | Mã kỹ thuật |
| Tác động | Điều xảy ra cho dữ liệu và tác nhân | *"Lịch ở Chờ duyệt hoặc Đã duyệt chuyển sang Đã hủy, lượt được trả lại, khách nhận thông báo."* | Cách tích hợp: API, hàng đợi |

## Mục 6 — Tham số cấu hình

**Định nghĩa:** các con số hoặc lựa chọn mà nghiệp vụ cho phép đổi **mà không sửa quy trình**. Con số cấu hình được **không** ghi trần trong bước,
biên, điểm kiểm soát — luôn dẫn `CH-xx`. Con số **luật định cứng** (văn bản ghi cứng, không cho đổi) thì ghi số kèm biên và điều khoản ngay trong ô, vì nó không cấu hình được; lớp 6 ghi là 🔒. Không chắc con số nào thuộc loại nào thì xếp vào `CH-xx` ở dạng đề xuất và ghi `Q-P…`.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `CH-nn`, in đậm | Duy nhất, không dùng lại | — |
| Tham số | Tên nghiệp vụ của tham số, đúng chuỗi ở dòng định nghĩa | *"Số lịch hẹn mỗi tuần"* (`CH-01`) | Tên khóa cấu hình kỹ thuật |
| Đơn vị | lần · giờ · ngày · người · % | Một đơn vị | Hai đơn vị |
| Mặc định đề xuất | Giá trị đề xuất **kèm nguồn**; luôn là **đề xuất**, BA chốt trước triển khai | *"2 — QC01 Đ5.1"* | Giá trị không nguồn; ghi như đã chốt |
| Phạm vi áp | Cấp mà giá trị có thể khác nhau | Trung tâm · Khu vực · Toàn hệ thống | "Mọi nơi" khi đã có khác biệt thật |
| Nơi lưu | Nơi giá trị được lưu và có **lịch sử thay đổi** | Tên nghiệp vụ: *"Tham số lịch hẹn"* | Tên bảng chưa có trong ERD |
| Người cấu hình | Vai trò được đổi giá trị | Tên đúng chữ mục 2 | "Admin" |
| Quy trình dẫn | Mọi quy trình, `N-xx`, `GS-xx` dùng tham số | `LH-01 · LH-02 · N-01` — phải khớp với những chỗ dẫn `CH-xx` thật | Quy trình không dùng |

Dòng **Ràng buộc giá trị:** miền hợp lệ từng tham số — *"`CH-01` số nguyên ≥ 0, không vượt `QC01 Đ5.1` · `CH-02` số giờ nguyên, từ 24 đến 168 (sàn luật `QC01 Đ7.2`)."* Đây là ràng buộc nội tại của tham số.
Câu mở đầu của mục (*chụp vào chứng từ lúc tạo*) nghĩa là: giá trị `CH-xx` có hiệu lực lúc chứng từ được tạo được **lưu theo chứng từ**; đổi tham số về sau không đổi chứng từ cũ.

## Mục 7 — Truy vết một ví dụ

**Định nghĩa:** một kịch bản số cụ thể đi qua nhiều quy trình, chứng minh các quy tắc bảo toàn và `GS-xx` khớp nhau. Dùng làm
testcase đầu–cuối. Template ghi hai cột `{{Sổ 1}}` `{{Sổ 2}}`; domain không có sổ thì mỗi cột là **một đối tượng đổi theo kịch bản** (số lượt còn,
trạng thái lịch).

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Đoạn bối cảnh | Nhân vật, dữ liệu đầu, các tham số `CH-xx` đang dùng | *"Khách A đặt lịch hẹn. `CH-01` = 1 (trung tâm cấu hình thấp hơn mặc định), `CH-02` = 24."* | Bối cảnh không có số |
| Thời điểm | Một mốc thời gian cụ thể | *Thứ Hai 08:00* | "Ban đầu", "sau đó" |
| Việc | Một việc kèm mã quy trình và bước | *"A gửi yêu cầu (`LH-01` bước 1–3) — còn lượt"* | Việc không rõ thuộc bước nào |
| Cột đối tượng | Giá trị sau việc đó | *Lượt còn: 1 → 0* | Giá trị không tính được từ quy tắc |
| Dòng `→ *…*` | Phép kiểm đẳng thức cuối | *"Lượt còn = 1 − 0 = 1 khớp nguyên tắc bảo toàn."* | Kết luận không có phép tính |

Ví dụ (minh họa): bối cảnh trên; hàng 1 *Thứ Hai — A gửi yêu cầu (`LH-01` bước 1–3), còn lượt → lịch Chờ duyệt, lượt còn lại 0*; hàng 2 *Thứ Ba — A gửi yêu cầu thứ hai cho cùng tuần, hết lượt → Chặn, không đổi*; hàng 3 *Thứ Tư — Nhân viên tiếp đón duyệt (`LH-01` bước 4) → Đã duyệt, lượt còn lại 0*; hàng 4 *Thứ Năm — A hủy khi còn hơn `CH-02` giờ (`LH-02`) → Đã hủy, lượt còn lại 1*; dòng kiểm: *lượt còn lại = `CH-01` − lượt đã dùng = 1 − 0 = 1*.

## Mục 8 — Bảng tổng hợp chứng từ

**Định nghĩa:** mọi chứng từ xuất hiện ở cột Chứng từ của các bảng bước, gom theo ba loại. Mỗi chứng từ trong bảng bước phải có mặt đúng một
lần ở 8.1, 8.2 hoặc 8.3 và ngược lại. Lớp 3 dựa vào bảng này để dựng thực thể loại Chứng từ.

### 8.1. Chứng từ có mẫu ban hành

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Chứng từ | Tên chứng từ đúng như văn bản ban hành | *"Giấy đề nghị lịch hẹn"* | Tên tự đặt |
| Mẫu số | Số hiệu mẫu | *Mẫu MH-01* (mã minh họa riêng của skill) | Mẫu không có số hiệu |
| Phụ lục | Phụ lục chứa mẫu | *Phụ lục II* | — |
| Văn bản ban hành | Số hiệu văn bản | `QC01` | Chỉ ghi tên chung |
| Điều khoản yêu cầu lập | Điều khoản buộc lập chứng từ | `QC01 Đ6.2` | Điều khoản không buộc lập |
| Quy trình | Mã quy trình, bước sinh chứng từ | `LH-01 bước 1` | — |

Chứng từ có mẫu ban hành thì hệ thống **dùng đúng mẫu**, không tự thiết kế lại. Không có chứng từ loại này thì ghi *Không có chứng từ có mẫu ban hành* (không xóa mục).

### 8.2. Chứng từ không có mẫu

**Định nghĩa:** văn bản có điều khoản **yêu cầu lập** nhưng không ban hành mẫu; dự án tự thiết kế nội dung.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Chứng từ | Tên | *"Quyết định duyệt lịch hẹn"* | — |
| Điều khoản yêu cầu lập | Nơi văn bản buộc lập; không có điều khoản thì chứng từ thuộc 8.3 | `QC01 Đ6.2` | Để trống |
| Nội dung bắt buộc phải có | Các thông tin tối thiểu, lấy từ điều khoản | *"khách, số người, ngày hẹn, người duyệt, ngày duyệt"* | Tên trường kỹ thuật, bố cục |
| Quy trình | Mã quy trình, bước | `LH-01 bước 4` | — |

### 8.3. Chứng từ nội bộ của hệ thống

**Định nghĩa:** chứng từ hoặc phiếu hệ thống tự sinh để vận hành — **không** văn bản nào yêu cầu lập. Template chỉ có một dòng `{{Phiếu A · phiếu B}}`.
Viết thành một đoạn, mỗi chứng từ kèm quy trình sinh ra nó: *"Yêu cầu lịch hẹn (`LH-01` bước 1) · Cảnh báo nhắc lịch (`N-01`)."* Không có thì *Không có chứng từ nội bộ*.

## Mục 9 — Điểm kiểm soát bắt buộc, tổng hợp

**Định nghĩa:** mọi điểm kiểm soát của từng quy trình, gom một bảng để thấy toàn cảnh. Là tổng hợp, **không** có điểm nào chỉ xuất hiện ở đây. Căn cứ để đưa
một điểm vào: trong căn cứ có chữ **phải, trước khi, không được** — hệ thống cưỡng chế, người dùng không bỏ qua được. Điểm loại Phát hiện: "không bỏ
qua được" nghĩa là hệ thống luôn ghi nhận và báo, người dùng không tắt được (template ghi cả hai ý nên skill đọc thế).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| # | Số thứ tự liên tục toàn tài liệu, **không đánh lại** sau khi phát hành | 1, 2, 3. Lớp khác dẫn `QT_DA1_LichHen mục 9 điểm 2` — mục 9 thuộc **tài liệu**, không thuộc một quy trình | Đánh lại số khi bỏ một điểm |
| Điểm kiểm soát | Chép **đúng** câu từ dòng "Điểm kiểm soát bắt buộc" của quy trình | *"Hệ thống không cho giữ lượt khi khách đã dùng đủ `CH-01` lượt trong tuần."* | Điểm mới không có ở Phần A |
| Loại kiểm soát | **Một** trong bốn: Ngăn chặn · Phát hiện · Tách nhiệm · Phê duyệt | Ngăn chặn: không cho xảy ra. Phát hiện: xảy ra rồi báo. Tách nhiệm: hai việc hai người. Phê duyệt: cần người thẩm quyền chấp thuận. Khó phân loại thì chọn loại *chính* | Hai loại một ô; loại thứ năm |
| Quy trình | Mã quy trình và số bước | `LH-01 bước 2` | Chỉ ghi mã quy trình |
| Căn cứ | Như cột Căn cứ ở bước | `QC01 Đ5.1 · CH-01` (sau điền ngược: `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1 · CH-01`) | — |

## Mục 10 — Quy trình chưa có Use case

**Định nghĩa:** danh sách các **bước người làm trên hệ thống** mà sau khi lớp 5 cấp UC vẫn **không UC nào phủ** — để thấy chỗ hở giữa nghiệp vụ và chức năng. Bước 🟡 **không** vào đây:
nó đã có dòng ở bảng bước và lớp 6 lấy trực tiếp từ đó. Mục này **điền sau lớp 5** (`create-ucl` ghi vào đây khi kiểm quy tắc 100%), không điền ở lớp 2.

Lớp 2 để mục này thế nào: giữ tiêu đề và bảng, thêm đúng một dòng — ba ô đều ghi `chờ lớp 5`. `create-ucl` điền khi chạy kiểm tra quy tắc 100%, trước lớp 6; khi đó xóa dòng này và điền, hoặc thay bằng một dòng *Không có bước nào chưa có Use case*.
Ghi vào Version control: *"Mục 10 chờ lớp 5."*


| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Quy trình | Mã quy trình **kèm số bước** và tên bước | `LH-01 bước 4 Duyệt hoặc từ chối yêu cầu đặt lịch` — khớp với cách `create-ucl` ghi | Chỉ mã quy trình; bước 🟡; bước đã có UC phủ |
| Nghĩa vụ | Việc phải có UC mà chưa có | *"Nhân viên tiếp đón duyệt hoặc từ chối yêu cầu — chưa có UC phủ"* | Lý do kỹ thuật |
| Căn cứ | Dòng kiểm ở `use_case_list` mục 6, hoặc điều khoản làm nghĩa vụ có thật | *"UCL mục 6 dòng 4 · `QC01 Đ5.2`"* | Trống |

## Mục 11 — Rủi ro còn lại, điểm tạm hoãn, câu hỏi

### 11.1. Rủi ro còn lại

**Định nghĩa:** điều có thể làm quy trình sai hoặc không đạt mục tiêu mà tài liệu chưa xử lý hết. Mã `RK-nn` (`00_quy_uoc_chung.md` mục 4).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `RK-nn` | — | — |
| Rủi ro | Điều có thể xảy ra, một câu | *"Hai khách cùng lúc gửi yêu cầu cho lượt cuối."* | Rủi ro dự án chung chung |
| Căn cứ bị ảnh hưởng | Mã `D-xx`, `GS-xx`, điều khoản mà rủi ro chạm | `GS-02 · QC01 Đ5.1` | — |
| Mức | Mức độ của rủi ro: Cao · Trung bình · Thấp | Mức do BA chọn; AI đề xuất | Để trống |
| Biện pháp | Việc đã làm hoặc sẽ làm | *"Ghi lượt theo thứ tự nhận (`GS-02`)."* | — |
| Cần khách xác nhận văn bản | `✓` hoặc `—` | `✓` khi rủi ro chạm nghĩa vụ pháp lý | — |

### 11.2. Điểm tạm hoãn

**Định nghĩa:** việc đã rõ, đã hiểu, nhưng cố ý chưa làm ở phiên bản này, kèm điều kiện để mở lại — khác câu hỏi 11.3 (chưa ai trả lời), giả định (tạm coi là đúng) và rủi ro 11.1 (có thể xảy ra). Mã `TH-nn` và vị trí khối: [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6. Không có điểm nào thì giữ khối và ghi *Không có*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `TH-nn` | — | — |
| Nội dung | Điều tạm hoãn | *"Quy trình gia hạn lịch hẹn"* | — |
| Ngày tạm hoãn | `dd/mm/yyyy` | — | — |
| Điều kiện mở lại | Sự kiện hoặc quyết định làm điều kiện làm tiếp | *"Khi khách hàng xác nhận bằng văn bản có gia hạn"* | "Khi rảnh" |

### 11.3. Câu hỏi cần chốt

**Định nghĩa:** điểm chưa ai trả lời. Phân biệt với giả định `GD-xxxx` ở [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 4. Mã `Q-P{nn}`
(`P` là lớp Process) — tiền tố cố định theo [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `Q-Pnn` | — | — |
| Câu hỏi | Câu hỏi cụ thể | *"Lượt lịch hẹn tính theo tuần của ngày gửi hay tuần của ngày hẹn?"* | "Cần làm rõ quy trình" |
| Kịch bản | Một ca cụ thể làm lộ câu hỏi | *"Chủ nhật 23:59 gửi yêu cầu cho thứ Hai tuần sau."* | Không có ví dụ |
| Đề xuất mặc định | Câu trả lời đề nghị, để BA chấp nhận tạm khi cần | *"Tính theo tuần của ngày hẹn."* | Không đề xuất |
| Người chốt | Tên người | `chưa chốt (<ai>)` nếu chưa rõ | Để trống |
| Quyết định | Rỗng khi còn mở; sau khi chốt: `✅ dd/mm/yyyy: …`; chấp nhận tạm: `→ GD-xxxx` | — | AI điền hộ |

Hết câu hỏi mở thì ghi *Không còn câu mở*.

## Mục 12 — Nguồn

**Định nghĩa:** theo `00_quy_uoc_chung.md` mục 6 — ở cuối tài liệu, cho biết phần nào của tài liệu dựng từ tệp nào. Khác bảng Nguồn ở mục 1: mục 1 nói **tài liệu nào được dùng làm nguồn** và vai trò; mục 12 nói **nội dung nào của tài liệu này nằm ở tệp nào**.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nội dung | Phần của tài liệu | *"Mục 8 — chứng từ"*, *"LH-01"* | — |
| Đường dẫn | Tệp hoặc văn bản nguồn, đường dẫn tương đối | `<đường dẫn QC01>` | Đường dẫn không tồn tại |

## Template còn tự mâu thuẫn

| # | Chỗ | Vấn đề | Cách xử lý của skill |
|---|---|---|---|
| 1 | 1.1 Thuật ngữ | Dòng chú "để trống khi là khái niệm tính toán" nhưng dòng mẫu ghi `Bang` hoặc `—`; bảng nhóm Phê duyệt không có cột ERD | Theo dòng chú (template thắng): ô **trống** = khái niệm tính toán; thuật ngữ sẽ có bảng ghi `chờ lớp 3`; không dùng `—` ở cột này (lựa chọn của skill). Bảng Phê duyệt giữ hai cột |
| 2 | Quyết định (mục 4) | "ADR" mà không có cột lý do và phương án bị loại | Gộp vào ô Quyết định |
| 3 | 5.1 | Hai cột `Quy trình chung`, `Nhãn` chưa định nghĩa | Đọc như bảng 5.1 ở trên (lựa chọn của skill) |
| 4 | Mục 9 | Nói "hệ thống cưỡng chế" nhưng có loại Phát hiện | Đọc "cưỡng chế" với Phát hiện là hệ thống luôn ghi và báo |
| 5 | Mục 10 | Cột `Nghĩa vụ` chưa định nghĩa; chưa nói để trống thế nào ở lớp 2 | Một dòng `chờ lớp 5` ở cả ba ô; `create-ucl` điền (`00_quy_uoc_chung.md` mục 10); định nghĩa dòng theo cách `create-ucl` ghi (bước người làm chưa có UC) |
| 6 | 11.2, 11.3 | Không có tiền tố mã | `TH-nn`, `Q-Pnn` — theo `00_quy_uoc_chung.md` mục 4 và 3 |
| 7 | Mục 1 và 12 | Hai bảng nguồn chồng nhau | Mục 1 là nguồn và vai trò; mục 12 là nội dung nằm ở tệp nào |
| 8 | Mục 7 | Cột `{{Sổ 1}}` `{{Sổ 2}}` giả định có sổ | Cột là đối tượng đổi theo kịch bản |
| 9 | Bảng thông tin quy trình | "Chỉ số theo dõi — không bắt buộc" | Giữ dòng, ghi `—` khi không có |
| 10 | Mục 5, 5.1 | Không nói khi domain không có | Giữ tiêu đề, ghi *Không có …* |
| 11 | Khối HƯỚNG DẪN và khối giới thiệu | Chú thích ở đầu file nằm trong `<!-- -->` | Xóa mọi khối `<!-- HƯỚNG DẪN -->` trước khi phát hành, giữ khối giới thiệu `>` |
| 12 | Khối giới thiệu, dòng 3 | Chỉ kể bốn loại nút không số (bắt đầu, kết thúc, nhánh chặn, kết quả con); skill dùng năm — thêm nút giao sang quy trình khác `E1` | Sửa dòng này trong file dự án: thêm loại thứ năm. Template tự mâu thuẫn: sơ đồ mẫu của chính nó có `E1[[Sang …]]` |
| 13 | Khối giới thiệu, dòng 4 | Nói Căn cứ chỉ dẫn ba loại nguồn (văn bản pháp luật, `D-xx`, `CH-xx`); skill còn cho `GS-xx`, `GD-xxxx`, `OBJ-xx`/`BRQ-xx`, khảo sát hiện trạng, và `BR-…` sau điền ngược | Sửa dòng này trong file dự án cho đủ các loại nguồn |
| 14 | Sơ đồ — nút `[[ ]]` | Template gọi là Call Activity, nghĩa BPMN là chờ quy trình con xong rồi đi tiếp; nút không số `E1` dùng cho "giao rồi hết" | Nút có số `B{n}[[ ]]` đúng nghĩa Call Activity. Nút không số `E1` dùng lệch nghĩa (lựa chọn của skill): phần của quy trình này kết thúc, quy trình đích bắt đầu theo dòng `Đầu ra kích hoạt` |
| 15 | Trường hợp biên — kiểu xử lý | Chỉ liệt kê Chặn · Cho phép kèm điều kiện · Cảnh báo · Chuyển quy trình, nhưng ô mẫu ghi `Chặn / Cho phép …` | Thêm dạng **Cho phép** không điều kiện cho ca đúng biên (lựa chọn của skill) |

## Điền vào BRD

**Định nghĩa:** việc lớp 2 làm trên BRD trước cổng ra, theo [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10 (cột "Skill điền" ghi `create-bp`). Quy trình viết bước 6.

| Ô của BRD | Điền gì | Viết thế nào |
|---|---|---|
| Mục 6.2 cột `Quy trình` | Mã quy trình của nhóm, kèm tên ngắn | `LH-01 Đặt và duyệt lịch hẹn` · `LH-02 Hủy lịch hẹn`; thay chỗ `chờ lớp 2` |
| Mục 6.2 cột `Tài liệu chi tiết` | Đường dẫn tới file quy trình | `../2-business-process/QT_<mã dự án>_LichHen_v00.md`, đường dẫn tương đối |
| Mục 12 cột `Quy trình` | Mã quy trình phủ từng `BRQ` | `LH-01 Đặt và duyệt lịch hẹn` ở dòng của `BRQ-01`; `BRQ` không có quy trình phủ thì ghi lý do ở đây và ở cổng ra |
| Version control của BRD | Một dòng về việc vừa điền | Điền là sửa không đổi nghĩa — ở mọi trạng thái thêm một gạch đầu dòng vào dòng phiên bản hiện tại, không tăng `vNN`, không đổi trạng thái (`00_quy_uoc_chung.md` mục 3.3): *"điền từ QT_<mã>_v00, không đổi nghĩa"*. Không ghi "BA chốt" |

Chỉ điền hai ô này; không sửa nội dung khác của BRD. Thấy BRD nói khác quy trình (ví dụ phạm vi) thì ghi `Q-P…` ở mục 11.3, không tự sửa BRD.
