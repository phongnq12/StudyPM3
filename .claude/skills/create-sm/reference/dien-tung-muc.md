# Điền từng mục của template Máy trạng thái

Phần tra cứu của skill [`create-sm`](../SKILL.md). Đọc phần lõi trước. Template:
[`state_machine.md`](../../../../2-ba-overview/templates/4-state-machine/state_machine.md). Các mục dưới đây đi **đúng thứ
tự template**. Mọi ví dụ dùng thế giới của [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md) và là **mã minh họa**, khớp bảng mã chuẩn mục 3 và bảng chuyển chuẩn mục 4 của file đó. Mã ngoài bảng — `N-04`, `S-02`, `D-05`, `Thong_Bao_Nhac`, `AVAILABLE`, `EXHAUSTED` — là **mã minh họa riêng của skill**, không trùng nghĩa với mã nào của bảng.

Quy ước chung cho mọi ô: không để trống — không có thì `n/a` (chắc chắn không có), chưa biết thì
`chưa chốt (<ai>)`, AI chưa tìm được căn cứ thì ❓ `[CẦN BA CHỐT] <phát biểu>`
([`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 3). Dòng mẫu ở mỗi mục theo đúng thứ tự cột của template.

## Template lệch — cách xử lý

Thứ bậc là `00_quy_uoc_chung.md` → template → skill. Từ 27/10/2026 template đã có sẵn dòng Thông tin
tài liệu, bảng Phê duyệt, câu "không chứa gì", bảng câu hỏi bảy cột và ba khối cuối (Rủi ro còn lại, Điểm tạm
hoãn, Nguồn) — điền theo template, không thêm; vị trí các khối ở
[`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6. **Điền ngay khi sao file ở bước 1**,
không để dồn đến lúc tự soát. Bảng dưới chỉ còn chỗ template vẫn lệch hoặc tự mâu thuẫn; xử lý như dưới và liệt kê
vào Version control.

| Chỗ | Template | Xử lý |
|---|---|---|
| Khối giới thiệu | Có câu "không chứa gì", nhưng không nêu số đếm | Thêm số đếm (số máy, số nhóm, số máy Δ) theo mục 3.1 của `00_quy_uoc_chung`; số đếm là bản chép, phải khớp mục 1.3. Giữ câu "không chứa gì, nằm ở đâu" của template ở cuối khối |
| Ngày ở Version control | `YYYY-MM-DD` | Đúng; ngày trong ô quyết định BA là `dd/mm/yyyy` — hai định dạng khác nhau, theo `00_quy_uoc_chung` mục 3.3 |
| `SM-03` dẫn bảng nhật ký | Mặc định `{{Nhat_Ky_Thay_Doi}}` | ERD của dự án chưa chắc có bảng này. ERD có thì dẫn đúng tên bảng; không có thì **giữ `SM-03` kèm ❓ và một dòng `S-xx`**, không bịa tên bảng |
| Mẫu sơ đồ không có điều kiện | Chú thích nói nhãn mũi tên là `Ai — sự kiện [điều kiện]` nhưng sơ đồ mẫu bỏ phần `[điều kiện]` | Theo chú thích: nhãn ghi `Ai — sự kiện [điều kiện ngắn]`. Điều kiện ngắn là **tên** rút gọn (`[còn lượt]`), không chép quy tắc; chi tiết ở bảng chuyển |
| Mẫu sơ đồ của template | Có mũi tên `PENDING_APPROVAL --> DRAFT` (trả về) | Chỉ là mẫu; chỉ giữ khi dự án có chuyển trả về |
| Cột `Tên trạng thái` ở bảng chuyển | Lặp lại cột `Từ → Đến` | Là bản chép tên Việt của cột trước, để người đọc không phải tra bảng trạng thái. Lệch với cột `Hiển thị` là lỗi bản chép |
| Ma trận | Một mục, "đối tượng phức tạp nhất" | Tối thiểu **một** ma trận; dự án thêm cho máy khác bằng cách nhân bản đúng mẫu mục đó, không đổi cột |
| Mức đếm của `Tác động` | Ví dụ nêu ba giá trị trong ô, dòng ⚙️ lại ghi "Chỉ nhắc" | Dùng bốn giá trị, định nghĩa ở mục "Sự kiện ngoài" bên dưới |
| Ký hiệu 🧪 | Mục 1.2 ghi "do ERD đề xuất" | `00_quy_uoc_chung` mục 5 thắng template; xem [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 5 dòng "Ký hiệu 🧪". Chép nghĩa theo mục 5 vào mục 1.2 của file dự án |
| Các khối `<!-- … -->` | `HƯỚNG DẪN DÙNG TEMPLATE`, `KHỐI LẶP CHO MỖI MÁY`, `HẾT KHỐI LẶP`, `UML trong Mermaid`, chú thích cột UML, chú thích máy Δ, chú thích ISO 29119-4, chú thích nguyên tắc | **Xóa hết** mọi khối `<!-- … -->` trong file dự án, kể cả khối không mang tên HƯỚNG DẪN — đây là lựa chọn của skill (bước 7 của `ba-overview` chỉ nêu khối `HƯỚNG DẪN`). Nội dung chúng đã nằm trong skill này |

## Phần đầu file

| Phần | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mọi khối `<!-- … -->` (`HƯỚNG DẪN DÙNG TEMPLATE`, `KHỐI LẶP`, `UML trong Mermaid`…) | Không điền | **Xóa hết** khi phát hành (bước cuối của quy trình) | Giữ lại bất kỳ khối chú thích nào của template |
| Tiêu đề `# MÁY TRẠNG THÁI — {{DỰ ÁN}} {{DOMAIN}}` | Tên dự án và domain | `MÁY TRẠNG THÁI — DA1 Lịch hẹn khách hàng` (minh họa); tên domain đúng chữ ở quy trình | "Sơ đồ trạng thái" hay tên màn hình |
| Khối giới thiệu `> Đặc tả vòng đời…` | Bốn câu hỏi của `00_quy_uoc_chung` mục 3.1: chứa gì (kèm số đếm), dựng từ đâu, đọc thế nào, không chứa gì | Một khối trích dẫn. Nêu: "{{n}} máy trạng thái, {{n}} nhóm, {{n}} máy dẫn xuất Δ"; dẫn quy trình và ERD nguồn bằng link; nhắc hai nơi khác nhau thì quy trình chuẩn nghiệp vụ, ERD chuẩn mã. Câu "Không viết lại quy tắc" giữ nguyên; câu cuối là câu "không chứa gì": quy tắc nghiệp vụ nằm ở business rule, bước quy trình ở quy trình, màn hình và nút ở SRS | Số đếm không khớp mục 1.3; lặp lại cả bảng ký hiệu |

## Thông tin tài liệu

**Định nghĩa:** các thông tin quản lý tài liệu theo ISO 9001 mục 7.5.2, để biết đây là bản nào, dựng trên
bản nào của quy trình và ERD.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã tài liệu | `SM_{MÃ DỰ ÁN}_{PHẠM VI}` | Không có `_v{NN}`; `PHẠM VI` PascalCase tiếng Việt không dấu: `SM_DA1_LichHen` (minh họa) | Mã có đuôi phiên bản |
| Dự án · Phân hệ | Tên dự án, phân hệ | Đúng chữ ở quy trình nguồn | Để trống |
| Phiên bản · Trạng thái | `v00 · Nháp` — trạng thái một trong `Nháp · Chờ review · Đã duyệt · Hết hiệu lực` | Một dòng như template; phiên bản khớp dòng tô xanh ở Version control | Trạng thái tự đặt ("đang làm") |
| Quy trình nguồn · ERD nguồn | Phiên bản cụ thể của hai tài liệu mà SM dựng trên | `v01 · v01` kèm link. Quy trình hoặc ERD lên phiên bản thì phải rà lại SM và cập nhật ô này | Chỉ ghi tên file không có phiên bản |
| Người soạn · Người review · Người duyệt | Người, kèm vai trò | AI **không** ghi tên người duyệt | Tự điền người duyệt |
| Mức mật | `Nội bộ · Hạn chế · Mật` | Chọn một | Để trống |

## Version control

**Định nghĩa:** lịch sử phát hành của tài liệu. Chỉ bản hiện tại tô xanh.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tên version | `v00`, `v01`… ; dòng hiện tại có `(hiện tại)` | Dòng hiện tại in đậm tô xanh theo mẫu `00_quy_uoc_chung` mục 3.3. Tăng số khi phát hành bản mới có thay đổi được duyệt; sửa lỗi chính tả không tăng | Hai dòng cùng tô xanh |
| Ngày cập nhật | `YYYY-MM-DD` | Ngày phát hành của phiên bản đó | `dd/mm/yyyy` ở cột này |
| PIC | Tên người chịu trách nhiệm phiên bản | Một tên | Tên AI thay cho người |
| Mô tả | Bản này dựng trên gì và đổi gì | *Dựng theo QT LH-01 v01 và ERD v01: 2 máy trạng thái theo 1 nhóm, gồm 1 máy lưu và 1 máy dẫn xuất Δ* (khớp dòng mẫu mục 1.3 bên dưới — số máy ở đây luôn bằng số hàng máy của mục 1.3, không lấy từ mẫu template) Quyết định BA ghi **BA chốt dd/mm/yyyy**; lượt điền ngược ghi *Thêm mã BR vào cột Điều kiện của … dòng*; việc điền ERD mục 4 ghi *Điền SM mục n vào ERD mục 4 cho `trang_thai` của …* (ghi ở **Version control của ERD**, theo `00_quy_uoc_chung.md` mục 10); bỏ nguyên tắc ghi *Bỏ SM-xx: lý do* | Kể lại các lần sửa giữa chừng |

Skill không có bảng Version control riêng; phiên bản của skill theo bảng của
[`ba-overview`](../../ba-overview/SKILL.md).

## Phê duyệt

**Định nghĩa:** chữ ký xác nhận tài liệu, theo `00_quy_uoc_chung` mục 3.4; template có sẵn ba dòng.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Vai trò · Họ tên · Ngày · Ý kiến | BA soạn, Product owner / Khách hàng, Tech lead | Giữ ba dòng. Để người ký điền; ngày `DD/MM/YYYY`. AI chỉ chừa hàng | Điền thay người ký |

---

## 1. Quy ước chung

### 1.1. Nguyên tắc

**Định nghĩa:** các quy ước áp cho **mọi máy** trong tài liệu, để bảng chuyển từng máy khỏi nhắc lại.
`SM-01` … `SM-09` là **nguyên tắc chung**, không phải mã máy (xem "Mã và tên" ở phần lõi). Template dặn *giữ,
sửa hoặc bỏ theo dự án*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `SM-nn` | Giữ số của nguyên tắc còn dùng; bỏ thì ghi *Các mã SM-xx đã bỏ, không dùng lại* ở đầu bảng; nguyên tắc mới lấy số kế tiếp | Đánh lại số khi bỏ một dòng; dùng `SM-nn` để gọi một máy |
| Quy ước | Nguyên tắc, một đến hai câu, dạng **phải · không được · chỉ khi** | Câu khẳng định, chủ ngữ là hệ thống hoặc tác nhân. Chép từ template rồi chỉnh theo dự án | Quy tắc nghiệp vụ riêng của một máy — nó thuộc bảng chuyển của máy đó, hoặc lớp 6 |
| Căn cứ | Nguồn của nguyên tắc | `ERD mục 4`, `GS-xx`, `QT mục 2 tách nhiệm`; nguyên tắc không có nguồn ghi `—` (chỉ khi **chắc** là nguyên tắc tự đặt của tài liệu) | Để trống |

Từng nguyên tắc nghĩa là gì và điền thế nào:

| Mã | Nghĩa | Khi chỉnh theo dự án |
|---|---|---|
| `SM-01` | Mã trạng thái là enum tiếng Anh đúng ERD; giao diện chỉ hiện tên Việt ở cột `Hiển thị` | Hầu như giữ nguyên |
| `SM-02` | Trạng thái dẫn xuất **không lưu cờ**, tính khi truy vấn; máy dẫn xuất ký hiệu Δ | Bỏ nếu dự án không có máy Δ — ghi lý do |
| `SM-03` | Mỗi chuyển ghi một dòng nhật ký: từ, đến, lý do, người hoặc hệ thống, thời điểm | Dẫn đúng tên bảng nhật ký ở ERD; ERD chưa có thì ❓ và `S-xx` |
| `SM-04` | Chuyển bằng cập nhật có điều kiện `WHERE trang_thai = :tu` kèm phiên bản bản ghi; bản ghi đã đổi thì báo *đã được xử lý*, tải lại; bấm hai lần chỉ ghi một lần | Dẫn `GS-xx` về khóa lạc quan; sửa nếu dự án không dùng phiên bản bản ghi |
| `SM-05` | Trạng thái ■ không quay lại; làm lại thì tạo bản ghi mới. **Ngoại lệ ghi rõ trong bảng** của máy có ngoại lệ | ■ là trạng thái **không có chuyển ra**. Mỗi ngoại lệ nằm ở **bảng chuyển của máy đó** và ở dòng ghi chú dưới bảng; sơ đồ của trạng thái có ngoại lệ **không vẽ `--> [*]`** ([`chuyen-trang-thai.md`](chuyen-trang-thai.md) mục 5). Trạng thái còn chuyển ra thường xuyên thì bỏ ■ thay vì xin ngoại lệ |
| `SM-06` | Hủy, từ chối, trả về, mở lại: bắt buộc lý do; có ngoại lệ thì liệt kê | Điền ngoại lệ vào `{{}}`; không có thì xóa cụm "Ngoại lệ". "Bắt buộc lý do" khi áp vào một chuyển thì ghi ở cột **`Điều kiện`** của chuyển đó (không ở `Ai — sự kiện`) |
| `SM-07` | Mỗi chuyển do người là một quyền riêng; người lập không tự duyệt | Dẫn quy trình mục 2 (tách nhiệm); giữ nguyên câu. Hiểu "quyền riêng" **theo thao tác**: cùng một thao tác từ nhiều trạng thái nguồn (hủy từ chờ duyệt và từ đã duyệt) là một quyền, một hàng ở ma trận; chuyển khác vai hoặc khác quyền thì tách (lựa chọn của skill, vì lớp 5 cấp một permission key cho một thao tác). "Người lập không tự duyệt" ghi ở cột `Điều kiện` của chuyển duyệt, dẫn BR sau lớp 6 |
| `SM-08` | Chuyển kéo theo ghi sổ khác thì mọi thứ chạy trong một giao dịch; cột `Hệ quả` ghi đủ phần kéo theo | Dẫn `GS-xx` về ghi sổ. Nhật ký `SM-03` luôn là một bảng khác và có ở mọi chuyển nên **không tính** là "ghi sổ khác" |
| `SM-09` | Điều kiện chặn áp cho **mọi** máy, để bảng chuyển không nhắc lại (ví dụ: thực thể đã khóa kỳ thì mọi chuyển bị chặn) | Điền điều kiện thật, dẫn BR hoặc `GS-xx`; **không có điều kiện chung nào thì bỏ `SM-09`** và ghi vào danh sách mã đã bỏ |

### 1.2. Ký hiệu

**Định nghĩa:** bảng giải nghĩa các ký hiệu dùng trong tài liệu; giữ nguyên bộ ký hiệu của template, mỗi
ký hiệu dùng ở tài liệu thì phải có mặt ở bảng này.

| Ký hiệu | Nghĩa trong tài liệu SM | Dùng ở đâu |
|---|---|---|
| 👤 | Người thao tác; **luôn kèm vai trò** đúng tên ở quy trình mục 2 | Cột `Ai — sự kiện`, ma trận |
| ⚙️ | Hệ thống tự chuyển: do sự kiện khác trong hệ thống, tác vụ nền `N-xx`, hoặc hết thời gian | Cột `Ai — sự kiện`, mục sự kiện ngoài |
| 🔗 | Sự kiện từ hệ thống ngoài (theo quy trình mục 5.1) | Như trên |
| ■ | Trạng thái kết thúc — **không có chuyển ra**; sau mã trong bảng trạng thái | Cột `Mã` của bảng trạng thái, sơ đồ `--> [*]` |
| **Δ** | Máy dẫn xuất: không lưu trạng thái | Tiêu đề máy, cột `Loại` |
| 🧪 | **Do tài liệu tự đề xuất, nguồn phía trên chưa nêu** — nghĩa theo `00_quy_uoc_chung` mục 5, xem [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 5. Ở SM dùng cho: một chuyển mà quy trình không có bước tương ứng (hết thời gian, hoàn tác, hủy hàng loạt); một trạng thái có ở enum ERD nhưng không bước quy trình nào sinh ra nó. Mỗi 🧪 kèm một dòng `S-xx` ở mục cuối (lựa chọn của skill) | Cột `Từ → Đến`, `Mã` |
| ❓ | Cần BA hoặc khách chốt, kèm mã `S-xx` | Mọi ô |

### 1.3. Danh sách máy trạng thái

**Định nghĩa:** mục lục của mọi máy: mỗi máy là vòng đời của một thực thể ERD, xếp theo nhóm. Từ đây
đếm ra số đếm ở khối giới thiệu và ở Version control.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `#` | Hàng nhóm: chữ cái `A`, `B`… (in đậm). Hàng máy: **số mục** của máy trong tài liệu, đúng số ở tiêu đề. Một thực thể có hai trường enum độc lập (hai trục) thì **hai hàng máy**, cùng `Thực thể ERD`, tên máy nói rõ trục | Máy đầu tiên là **2** vì mục 1 là Quy ước. Đây là số mà lớp 5, 6 dẫn `SM mục n` | Đánh số liên tục từ 1; số khác với số mục trong thân |
| Máy | Tên máy bằng tiếng Việt; hàng nhóm ghi tên nhóm in đậm | Danh từ nghiệp vụ: `Lịch hẹn`, `Quỹ lượt` | Tên bảng ở cột này; tên màn hình |
| Thực thể ERD | Tên bảng trong backtick, **đúng ERD**; máy Δ ghi bảng mà giá trị Δ gắn vào. Hai máy cùng một bảng thì thêm tên trường: `` `Lich_Hen.trang_thai_duyet` `` | `` `Lich_Hen` `` | Tên bảng tự đặt; nhiều bảng trong một ô |
| Loại | Một trong ba: **Lưu** · **Δ** · **Lưu, suy từ bảng con** | Định nghĩa ba loại ở "Thực thể nào cần máy", phần lõi. Chọn theo ERD: có cột lưu không, ai đặt giá trị | Loại thứ tư; ghi Δ cho máy có cột `trang_thai` |
| Quy trình | Mã quy trình tạo ra vòng đời đó | `LH-01` (minh họa); nhiều quy trình thì cách nhau bằng `·` | Mã bước; mã không có trong quy trình |

Dòng **Không có máy trạng thái** nằm ngay dưới bảng:

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Danh sách thực thể | **Chỉ** thực thể có trường `trang_thai` (hoặc giá trị Δ, bảng ở ERD mục 5.3) **mà không thỏa ba điều kiện cần máy**. Thực thể không có `trang_thai` thì không thuộc phạm vi dòng này (lựa chọn của skill — dòng này là chỗ trả lời cổng ra "mọi `trang_thai` có máy hoặc có lý do") | `Thong_Bao_Nhac` giá trị gán lúc tạo không đổi · `Phieu_In` lập một lần, không sửa · …; mỗi thực thể kèm lý do một cụm. Chọn lý do trong: *chỉ ghi thêm · lập một lần không sửa · chỉ một giá trị · giá trị gán lúc tạo không đổi*. `Nhat_Ky_Thay_Doi` không có `trang_thai` nên **không** ghi ở đây | Bỏ lặng lẽ thực thể có `trang_thai`; ghi lý do mơ hồ ("không quan trọng"); ghi thực thể không có `trang_thai` cho đủ dòng |

Dòng mẫu (minh họa):

| # | Máy | Thực thể ERD | Loại | Quy trình |
|---|---|---|---|---|
| **A** | **Đặt lịch hẹn** | | | |
| 2 | Lịch hẹn | `Lich_Hen` | Lưu | LH-01 |
| 3 | Tình trạng lượt của khách | `Quy_Luot` | Δ | LH-01 |

---

# Nhóm máy (ví dụ `# NHÓM A — {{TÊN NHÓM}}`)

**Định nghĩa:** tiêu đề gom các máy cùng một nghiệp vụ. Tên nhóm là tên nhóm quy trình ở quy trình
phần A/B…; khớp hàng nhóm ở mục 1.3. Không có bảng riêng.

## Khối lặp cho mỗi máy

### Tiêu đề và câu tóm vòng đời

**Định nghĩa:** tiêu đề nói máy này của thực thể nào; câu tóm nói vòng đời đi thế nào và quyết định thiết
kế chính.

| Phần | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `## {{n}}. {{Tên máy}} — {{Ten_Bang}} {{· Δ}}` | Số mục, tên máy, tên bảng ERD | `## 2. Lịch hẹn — Lich_Hen`; máy Δ thêm `· Δ`. Số mục khớp cột `#` của mục 1.3 | Tên bảng khác ERD |
| Câu tóm | Một câu: từ đâu tới đâu, ai quyết; kèm `D-xx` và ngày BA chốt nếu có | *Lịch hẹn đi từ nháp qua chờ duyệt tới một trong ba trạng thái cuối; nhân viên quyết định duyệt hay từ chối (D-05, BA chốt 27/10/2026).* (minh họa) | Mô tả từng bước; viết lại quy tắc |

### Bảng trạng thái

**Định nghĩa:** danh sách mọi trạng thái của máy, mã theo ERD, nghĩa theo quy trình — trả lời "đối tượng
có thể ở những đâu".

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | **Enum tiếng Anh đúng ERD**, trong backtick; trạng thái kết thúc (không có chuyển ra) thêm ` ■` sau mã; 🧪 nếu do SM đề xuất. Trạng thái đầu xếp trước. Trạng thái còn chuyển ra thì **không** ■ | `` `PENDING_APPROVAL` ``, `` `COMPLETED` ■ `` | Mã dịch lại, thêm hoặc bớt chữ so với ERD; giá trị enum ERD bị thiếu |
| Hiển thị | **Tên tiếng Việt** hiện trên giao diện, theo quy trình | `Chờ duyệt` | Tên khác với cột `Tên trạng thái` của bảng chuyển |
| Nghĩa | Một câu: đối tượng ở trạng thái này nghĩa là gì và đang chờ gì | *Khách đã gửi, chờ nhân viên quyết; lượt đã bị giữ.* Trạng thái ■ ghi thêm vì sao là ■ | Mô tả thao tác ("bấm nút…"); phát biểu lại quy tắc |
| Sửa được | ✅ nếu người dùng sửa được dữ liệu của bản ghi ở trạng thái này, `—` nếu không | Sửa có điều kiện vẫn ghi ✅ ở đây, điều kiện ghi vào ô của hàng "Sửa" trong ma trận. Phải khớp: hàng "Sửa" có ✅ ở trạng thái nào thì cột này ✅ ở trạng thái đó | ✅ cho trạng thái chỉ cho phép một vài trường; để trống |

Dòng mẫu (minh họa):

| Mã | Hiển thị | Nghĩa | Sửa được |
|---|---|---|:-:|
| `DRAFT` | Nháp | Khách đã nhập, chưa gửi; chưa giữ lượt | ✅ |
| `PENDING_APPROVAL` | Chờ duyệt | Đã gửi, chờ nhân viên quyết; lượt đang bị giữ | — |
| `APPROVED` | Đã duyệt | Nhân viên đã duyệt; lượt vẫn giữ; còn đường hoàn thành và hủy | — |
| `COMPLETED` ■ | Đã đến hẹn | Đã qua ngày hẹn và được hệ thống chốt | — |
| `REJECTED` ■ | Từ chối | Nhân viên từ chối kèm lý do; lượt được trả | — |
| `CANCELLED` ■ | Đã hủy | Khách đã hủy; lượt được trả hay ghi `huy_muon` theo `BR-A03` | — |

Một thực thể có **hai trục độc lập** (ví dụ trạng thái duyệt và trạng thái thanh toán của cùng một chứng từ) là hai
trường enum ở ERD, nên là **hai máy** ở mục 1.3 (hoặc hai vùng song song trong một máy, theo UML Region và
orthogonality của Harel) — không gộp thành một enum tích của hai trục. Xem "Sáu tính chất nhận diện" ở phần lõi.

### Sơ đồ Mermaid

**Định nghĩa:** hình của bảng chuyển — nhìn một lần thấy đầu, cuối, lối ra. Sinh **từ** bảng chuyển; hai
cái lệch nhau là lỗi.

| Phần | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `state "Tên Việt" as CODE` | Mỗi trạng thái một dòng | Mã đúng ERD làm id; tên Việt đúng cột `Hiển thị` | id khác mã ERD |
| `[*] --> CODE : …` | Trạng thái đầu, ghi ai lập | **Đúng một** mũi tên `[*]` mỗi máy (UML cho tối đa một chuyển ra từ trạng thái đầu của mỗi vùng), ứng với dòng `→ CODE` ở bảng chuyển. Máy có nhiều đường tạo mới thì cho mọi đường vào cùng một trạng thái đầu. Muốn vẽ nhiều mũi tên `[*]` thì đó là **lệch chuẩn có chủ ý**: ghi ở dòng ghi chú dưới bảng chuyển *lệch UML: nhiều điểm vào* kèm lý do | Hai mũi tên `[*]` mà không ghi lệch chuẩn |
| `CODE --> [*]` | Mỗi ■ **không có ngoại lệ** một mũi tên về `[*]` | **Không** vẽ cho trạng thái không phải ■, và không vẽ cho ■ có ngoại lệ `SM-05`. Mũi tên ngoại lệ đi ra thêm nhãn `ngoại lệ SM-05` | Mũi tên ra khỏi ■ không nhãn; `X --> [*]` cho trạng thái còn chuyển ra |
| `A --> B : Ai — sự kiện [điều kiện ngắn]` | Mỗi dòng bảng chuyển một mũi tên | Nhãn rút gọn: vai trò, động từ, điều kiện thành một cụm. Không dùng dấu `;` trong nhãn (Mermaid coi là kết thúc câu) | Chép nguyên ô Điều kiện vào nhãn |
| `state CODE { … }` | Trạng thái lồng Harel, khi cần | Chỉ khi thỏa điều kiện ở `chuyen-trang-thai.md` | Lồng để cho đẹp |

Sơ đồ hoàn chỉnh và cách kiểm sơ đồ với bảng: [`chuyen-trang-thai.md`](chuyen-trang-thai.md).

### Bảng chuyển trạng thái

**Định nghĩa:** mỗi dòng là **một sự kiện** làm đối tượng đi từ trạng thái này sang trạng thái kia, theo
UML `sự kiện [điều kiện] / hành động`: cột `Ai — sự kiện` = sự kiện, `Điều kiện` = điều kiện canh, `Hệ
quả` = hành động. Mỗi dòng sinh ≥ 1 testcase hợp lệ; mỗi điều kiện sinh ≥ 1 testcase âm (29119-4).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Từ → Đến | Mã trạng thái nguồn → đích, trong backtick. Chuyển tạo mới thì bỏ trống phần trước mũi tên: `→ \`DRAFT\`` | Đúng mã ERD. **Một đích mỗi dòng.** Cùng sự kiện, điều kiện, hệ quả từ nhiều nguồn thì gộp một dòng: `` `PENDING_APPROVAL`, `APPROVED` → `CANCELLED` ``; hệ quả khác nhau giữa các nguồn thì tách dòng (testcase vẫn tính mỗi nguồn một lần) | Nhiều đích trong một dòng; chuyển ra khỏi ■ mà không ghi ngoại lệ |
| Tên trạng thái | Bản chép tên Việt của cột trước | `Nháp → Chờ duyệt` | Khác cột `Hiển thị` |
| Ai — sự kiện | Ký hiệu 👤 ⚙️ 🔗, rồi **vai trò hoặc nguồn**, rồi **sự kiện kèm mã quy trình** | 👤: `👤 Khách — LH-01 bước 1–3` (bước hệ thống cùng request với bước người ngay trước thì chuyển là 👤 của bước người, dẫn dải bước — quy tắc ở [`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) mục 2); ⚙️: `⚙️ N-02 chốt lịch đã qua ngày hẹn` (tự chạy theo lịch hoặc sự kiện); 🔗: `🔗 {{hệ thống}} — {{sự kiện}}` | Vai trò không có ở quy trình mục 2; động từ chung ("xử lý"); hai sự kiện trong một dòng; `khác người lập` hay `có lý do` (đó là điều kiện) |
| Điều kiện | Điều kiện **dẫn** — mã kèm tên ngắn, hoặc văn bản kèm điều khoản. **Mọi** điều kiện ở cột này, kể cả tách nhiệm (người duyệt khác người lập) và bắt buộc lý do (`SM-06`). Điều kiện chỉ quyết **chuyển có xảy ra hay không**; nhánh trả lượt hay ghi sổ khác là **Hệ quả**. `**Kiểm lại**` chỉ khi điều kiện bước trước có thể đổi trong khoảng chờ và không được giữ chỗ (xem `chuyen-trang-thai.md` mục 3) | `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1`; `Trước ngày hẹn — QC01 Đ6.1 · người duyệt khác người lập — QC01 Đ6.3`. Chưa có BR thì `QC01 Đ5.1` hoặc `GS-xx`. Không điều kiện thì `n/a`; hủy chỉ cần trạng thái nguồn thì ghi `Lịch đang ở một trong hai trạng thái nguồn` | Phát biểu lại quy tắc bằng lời; số trần ("3 người") không `CH-xx`; điều kiện UI ("khi nút bật"); nhánh hệ quả ("trước 24 giờ thì trả lượt") |
| Hệ quả | Cái **kéo theo** khi chuyển xảy ra: ghi sổ, khóa sửa, thông báo. Nhật ký `SM-03` mặc định có ở mọi chuyển, không ghi lại | `Không giữ lượt`; `Khóa sửa; thông báo nhân viên (N-01)`; `Trong một giao dịch: giữ một lượt ở Quy_Luot (R-01)`; nhánh theo quy tắc: `Trong một giao dịch: trả lượt nếu hủy trước CH-02 giờ, ngược lại ghi huy_muon = đúng — BR-A03`. Phần kéo theo ghi sổ khác (không kể nhật ký `SM-03`) thì bắt đầu bằng **Trong một giao dịch** (`SM-08`) | Bỏ trống; mô tả thao tác UI; viết hệ quả của chuyển khác |

Dòng mẫu (minh họa; trích bảng chuyển chuẩn ở `vi-du-xuyen-suot.md` mục 4, điều kiện sau lớp 6 sẽ có `BR-A01` đứng trước `QC01`):

| Từ → Đến | Tên trạng thái | Ai — sự kiện | Điều kiện | Hệ quả |
|---|---|---|---|---|
| → `DRAFT` | → Nháp | 👤 Khách — LH-01 bước 1 (lập nháp) | n/a | Không giữ lượt |
| `DRAFT` → `PENDING_APPROVAL` | Nháp → Chờ duyệt | 👤 Khách — LH-01 bước 1–3 | Còn lượt trong tuần của ngày hẹn: `QC01 Đ5.1` | Trong một giao dịch: giữ một lượt ở `Quy_Luot` (R-01) |
| `PENDING_APPROVAL` → `APPROVED` | Chờ duyệt → Đã duyệt | 👤 Nhân viên tiếp đón — LH-01 bước 4 | Trước ngày hẹn: `QC01 Đ6.1` · người duyệt khác người lập: `QC01 Đ6.3`. **Không** kiểm lại lượt: lượt đã giữ từ lúc gửi | Báo khách |
| `PENDING_APPROVAL` → `REJECTED` | Chờ duyệt → Từ chối | 👤 Nhân viên tiếp đón — LH-01 bước 4 | Bắt buộc lý do: `SM-06` | Trong một giao dịch: trả lượt ở `Quy_Luot` (R-01); báo khách |
| `PENDING_APPROVAL` → `REJECTED` 🧪 | Chờ duyệt → Từ chối | ⚙️ N-04 quá ngày hẹn mà chưa duyệt (**đề xuất**, ❓ S-01) | Đã qua ngày hẹn: `QC01 Đ6.1` | Như dòng từ chối; lý do ghi *quá hạn*; báo khách |
| `PENDING_APPROVAL`, `APPROVED` → `CANCELLED` | Chờ duyệt, Đã duyệt → Đã hủy | 👤 Khách — LH-02 | Lịch đang ở một trong hai trạng thái nguồn | Trong một giao dịch: trả lượt nếu hủy trước `CH-02` giờ, ngược lại ghi `huy_muon` = đúng — theo `BR-A03` (R-01); báo khách |
| `APPROVED` → `COMPLETED` | Đã duyệt → Đã đến hẹn | ⚙️ N-02 chốt lịch đã qua ngày hẹn | Đã qua ngày hẹn | Không ghi sổ |

(`N-02`, `CH-02`, `R-01`, `BR-A03` có trong `vi-du-xuyen-suot.md`; `N-04`, `S-01`, `D-05` là mã minh họa riêng của skill.)

Dưới bảng là hai thứ không thuộc cột nào:

| Phần | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Ghi chú chặn hoặc nhắc | Một đến ba câu về điều kiện chặn, nhắc, ngoại lệ của ■, lệch chuẩn UML có chủ ý | *`N-01` nhắc lịch hôm trước ngày hẹn, giờ theo `CH-03`; không tự chuyển.* Máy có ngoại lệ của `SM-05` thì ghi *ngoại lệ của `SM-05`: `X` → `Y` vì …* (ví dụ chuẩn không có ngoại lệ). Nhiều mũi tên `[*]` thì ghi *lệch UML: nhiều điểm vào* kèm lý do | Quy tắc mới chưa có ở đâu |
| **Cấm** | Chuyển **người đọc dễ tưởng hợp lệ** mà không được phép | Cách nhau bằng `·`: *`REJECTED`, `CANCELLED` hoặc `COMPLETED` → bất kỳ trạng thái nào · người lập tự duyệt · mở lại ■ · `DRAFT` → `APPROVED` không qua chờ duyệt.* Ô `—` của ma trận mặc nhiên là cấm, không lặp lại ở đây | Liệt kê mọi cặp không có chuyển; để trống khi máy có duyệt |

### Máy dẫn xuất Δ

**Định nghĩa:** máy của một trạng thái **không lưu**, suy ra khi truy vấn từ dữ liệu khác. Thay bảng chuyển
bằng bảng dưới và vẫn vẽ sơ đồ. **Giữ bảng trạng thái** (`Mã · Hiển thị · Nghĩa`) nhưng **bỏ cột `Sửa được`**:
không ai sửa được một trạng thái không lưu (lựa chọn của skill).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Trạng thái | Mã và tên Việt của giá trị Δ | Mã lấy từ dòng "Giá trị dẫn xuất Δ" của ERD; ERD chưa đặt mã thì 🧪 và ghi `S-xx` về ERD | Mã tự đặt không báo ERD |
| Công thức suy ra | Biểu thức truy vấn trên trường ERD, dẫn `GS-xx` hoặc `R-xx` — **đúng một công thức**, cùng với công thức ở `chuyen-trang-thai.md` mục 6 | `CH-01 − Quy_Luot.da_dung > 0`, với `da_dung` theo `R-01` | Công thức dùng cờ không có trong ERD; công thức đếm lại tập trạng thái mà `R-xx` đã định nghĩa khác đi |
| Đổi khi | Sự kiện (thường là chuyển ở máy khác) **làm giá trị đổi sang trạng thái này** | `Có chuyển trả lượt làm da_dung giảm: PENDING_APPROVAL → REJECTED, hủy sớm → CANCELLED (BR-A03)` | "Khi dữ liệu đổi"; mọi chuyển của máy nguồn, kể cả chuyển không đổi vế nào của `R-xx` |

Ví dụ hoàn chỉnh: [`chuyen-trang-thai.md`](chuyen-trang-thai.md) mục 6.

---

## Sự kiện ngoài và tác vụ nền tác động trạng thái

**Định nghĩa:** những sự kiện **không do người thao tác trên chính hệ thống** mà vẫn khiến trạng thái đổi
hoặc bị chặn: hệ thống ngoài báo tới (🔗) và tác vụ nền chạy theo lịch (⚙️). Cùng với cột `Ai — sự kiện`
của từng máy, đây là **Event List** của lớp 4. Lịch chạy chu kỳ **không chép** — nằm ở quy trình mục 5.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Nguồn | 🔗 kèm tên hệ thống ngoài, hoặc ⚙️ kèm mã `N-xx` | Đúng tên ở quy trình mục 5.1 (🔗) hoặc mục 5 (⚙️) | Tên hệ thống không có ở quy trình |
| Sự kiện | Việc xảy ra, kèm thời điểm hoặc chu kỳ **bằng cách dẫn** | `Mỗi ngày lúc giờ chạy của N-01` hoặc `Hệ thống CRM báo khách bị đưa vào danh sách hạn chế` | Giờ chạy ghi trần (lịch đổi thì SM lệch) |
| Máy bị tác động | `SM mục n` — tên máy | Có thể nhiều máy, cách nhau bằng `·` | Máy không tồn tại ở mục 1.3 |
| Tác động | Đúng **một** trong bốn giá trị dưới | Định nghĩa dưới | Câu dài thay giá trị |

Bốn giá trị của `Tác động`:

| Giá trị | Nghĩa | Kiểm bằng |
|---|---|---|
| **Tự chuyển** | Sự kiện làm đối tượng đổi trạng thái | Có **một dòng ⚙️ hoặc 🔗** tương ứng ở bảng chuyển của máy bị tác động |
| **Chỉ chặn** | Sự kiện không đổi trạng thái nhưng **chặn** một chuyển | Xuất hiện ở cột `Điều kiện` của chuyển bị chặn |
| **Chỉ nhắc** | Sự kiện gửi nhắc hoặc cảnh báo, không đổi trạng thái | Không có dòng ở bảng chuyển; ghi ở dòng ghi chú dưới bảng |
| **Chỉ liệt kê** | Ghi để biết, không ảnh hưởng máy hiện tại | Không có dòng nào khác; lý do ghi ở ô `Sự kiện` |

Dòng mẫu (minh họa):

| Nguồn | Sự kiện | Máy bị tác động | Tác động |
|---|---|---|---|
| ⚙️ N-01 | Nhắc lịch lúc giờ chạy của N-01 hôm trước ngày hẹn | SM mục 2 — Lịch hẹn | Chỉ nhắc, không tự chuyển |
| ⚙️ N-02 | Chốt lịch đã qua ngày hẹn | SM mục 2 — Lịch hẹn | Tự chuyển: `APPROVED` → `COMPLETED` |
| ⚙️ N-04 (minh họa riêng của skill) 🧪 | Quá ngày hẹn mà chưa duyệt | SM mục 2 — Lịch hẹn | Tự chuyển: `PENDING_APPROVAL` → `REJECTED` (❓ S-01) |
| 🔗 Hệ thống CRM (minh họa) | Khách bị đưa vào danh sách hạn chế | SM mục 2 — Lịch hẹn | Chỉ chặn: không duyệt được; điều kiện ở chuyển `PENDING_APPROVAL` → `APPROVED` |

**Chuyển do hết thời gian** (dòng riêng, nằm dưới bảng): liệt kê mọi chuyển mà **thời gian trôi qua** là sự
kiện — hạn duyệt, hạn thanh toán, tự đóng khi quá hạn. Mỗi chuyển có đủ: máy, từ → đến, hạn **dẫn `CH-xx`**,
và `N-xx` thực hiện. Không có chuyển nào thì ghi *không có* kèm lý do (ví dụ: *mọi chuyển do người hoặc do
sự kiện ngoài*). Cách tìm: xem mọi `CH-xx` ở quy trình mục 6 có đơn vị ngày, giờ, phút; mọi bước quy trình
ghi "quá hạn", "tự động"; mọi ■ mà không có ai đóng.

---

## Ma trận trạng thái × thao tác

**Định nghĩa:** bảng một chiều là **trạng thái**, chiều kia là **thao tác lên đối tượng**; ô cho biết thao
tác có được phép ở trạng thái đó không. Là bảng **rút gọn từ** bảng "trạng thái × sự kiện" của 29119-4 mục 5.2.8 (chỉ thao tác của người; ⚙️ và 🔗 sinh testcase từ bảng chuyển): ô `—` là
chuyển không hợp lệ và **phải có testcase âm**. Cách dựng từng bước và sinh testcase:
[`ma-tran-va-testcase.md`](ma-tran-va-testcase.md).

| Phần | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `— {{đối tượng phức tạp nhất}}` | Tên thực thể có nhiều trạng thái và nhiều thao tác nhất | Tối thiểu một ma trận; nhân bản mục nếu cần thêm máy | Ma trận cho máy hai trạng thái |
| Dòng "Cột là **trạng thái** của … — mục n" | Số mục của máy | `Cột là **trạng thái** của lịch hẹn — mục 2` | Số mục sai |
| Cột `Thao tác — ai` | Một thao tác lên đối tượng, kèm vai trò và bước quy trình | `Gửi duyệt — Khách, LH-01 bước 1–3`. Gồm **cả thao tác không đổi trạng thái** (xem, sửa, xóa). Quyền tính theo thao tác: hủy từ hai trạng thái là một hàng | Thao tác UI (bấm nút); chuyển do ⚙️ hoặc 🔗 (đã có ở bảng chuyển) |
| Cột trạng thái (một cột mỗi trạng thái) | Đúng tên Việt theo `Hiển thị`, đúng số và thứ tự trạng thái mục 2 | Mỗi trạng thái của máy một cột | Gộp hai trạng thái một cột; thiếu trạng thái |
| Ô | ✅ được phép (kèm điều kiện thêm nếu có), `—` không được phép | `✅` hoặc `✅ còn lượt: QC01 Đ5.1` hoặc `—` | Ô trống; "có thể" |
| Dòng cuối "Ô **—** hiện nút vô hiệu…" | Quyết định cách ô `—` hiện với người dùng | Giữ câu mẫu: hiện nút vô hiệu kèm lý do, hoặc ẩn — **quyết ở SRS**, không quyết ở đây | Tự chọn một cách |

## Câu hỏi và điểm chưa rõ

**Định nghĩa:** mọi điều lớp này chưa chốt được, mỗi điều một dòng; chưa có ai trả lời thì là `S-xx`, đã có
câu trả lời tạm mà các lớp dựa vào thì là `GD-xxxx` trong sổ (xem `so-cu-va-gia-dinh.md` mục 4).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Dòng "Đã chốt, đã đưa vào thân tài liệu" | Mã `S-xx` đã ✅ cùng ngày | `S-03, S-04 — 27/10/2026`; không có thì `không có` | Liệt kê câu hỏi đã chốt mà thân tài liệu chưa sửa |
| Mã | `S-nn` | Số kế tiếp, không dùng lại | `Q-…` (tiền tố của template là `S-`) |
| Máy | `SM mục n` | Câu hỏi không thuộc máy nào thì `chung` | Để trống |
| Câu hỏi | Điều chưa rõ, một câu | *Lịch quá ngày hẹn mà chưa duyệt thì thành gì?* | Câu hỏi mở không có hậu quả cụ thể |
| Kịch bản | Tình huống cụ thể làm câu hỏi hiện ra | *Khách gửi lịch thứ Hai cho thứ Ba, nhân viên không duyệt tới thứ Tư.* | "Trường hợp đặc biệt" |
| Đề xuất mặc định | Đề xuất để BA chấp nhận hoặc đổi | *Tự chuyển `REJECTED` với lý do "quá hạn", báo khách.* Đề xuất phải đủ để dev và QC làm tiếp | Để trống; chỉ nhắc lại câu hỏi |
| Người chốt | Tên người hoặc vai có quyền chốt câu hỏi | `BA`, `Giám đốc trung tâm`; cột bắt buộc theo `00_quy_uoc_chung` mục 6 — không có tên thì `chưa chốt (<ai>)` | Để trống; ghi tên AI |
| Quyết định | `chưa chốt (<ai>)` hoặc `✅ DD/MM/YYYY: …` hoặc `→ GD-xxxx` | AI không điền ✅ | AI tự điền quyết định |

Dòng mẫu (minh họa):

| Mã | Máy | Câu hỏi | Kịch bản | Đề xuất mặc định | Người chốt | Quyết định |
|---|---|---|---|---|---|---|
| S-01 | SM mục 2 | Lịch quá ngày hẹn mà chưa duyệt thì thành gì | Gửi thứ Hai cho thứ Ba, nhân viên không duyệt tới thứ Tư | Tự chuyển `REJECTED` lý do *quá hạn*, trả lượt, báo khách | BA | chưa chốt (BA) |
| S-02 | SM mục 2 | Khách bỏ một lịch nháp thì lịch nháp đó thành gì | Lưu nháp rồi không bao giờ gửi | Không có chuyển; nháp không giữ lượt nên để nguyên, không hết hạn | BA | chưa chốt (BA) |

## Rủi ro còn lại · Điểm tạm hoãn · Nguồn

Ba khối này đã có trong template, đặt ngay sau mục "Câu hỏi và điểm chưa rõ" theo thứ tự Rủi ro → Điểm tạm hoãn → Nguồn; Nguồn luôn là mục cuối. Số mục là `{{n}}`, đánh theo "Đánh số mục cuối" bên dưới (`00_quy_uoc_chung.md` mục 6).

### Rủi ro còn lại

**Định nghĩa:** rủi ro riêng của lớp 4 mà tài liệu chưa loại bỏ được, kèm biện pháp. Không có thì giữ mục và ghi *Không có* kèm lý do một câu.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `RK-nn` | Liên tục, theo `00_quy_uoc_chung` mục 4 | Mã trùng |
| Rủi ro | Một rủi ro, một câu | *🧪 chưa có xác nhận của khách*; *■ không có đường sửa lại* | Rủi ro dự án chung |
| Căn cứ bị ảnh hưởng | Máy, chuyển, `S-xx`, `GD-xxxx` mà rủi ro chạm tới | `SM mục 2: PENDING_APPROVAL → REJECTED` · `S-01` | Để trống |
| Mức | `C` · `TB` · `T` | Một trong ba | Viết đủ chữ "Cao", "Thấp" |
| Biện pháp | Việc đã hoặc sẽ làm | Có người và mốc | "Theo dõi" |
| Cần khách xác nhận văn bản | `Có` · `Không` | `Có` khi cần văn bản của khách làm căn cứ | Để trống |

### Điểm tạm hoãn

**Định nghĩa:** việc đã rõ, đã hiểu, nhưng cố ý chưa làm ở phiên bản này (`00_quy_uoc_chung.md` mục 6). Không có thì giữ mục và ghi *Không có*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `TH-nn` (mã do bộ skill đặt) | Liên tục | Mã trùng |
| Nội dung | Việc hoãn | *Hủy hàng loạt khi trung tâm đóng cửa — chưa lập chuyển.* | Điểm đã quyết, hoặc điều chưa hiểu (đó là `S-xx`) |
| Ngày tạm hoãn | `DD/MM/YYYY` | Ngày BA đồng ý hoãn; chưa biết thì `chưa chốt (<ai>)` | AI tự điền ngày |
| Điều kiện mở lại | Sự kiện hoặc mốc cụ thể | *Khi khách xác nhận bằng văn bản.* | "Khi cần" |

### Nguồn

**Định nghĩa:** các tài liệu SM dựng từ đâu, dùng cho phần nào (`00_quy_uoc_chung` mục 6). Luôn là mục cuối.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tài liệu | Link tương đối | Quy trình nguồn, ERD nguồn, văn bản pháp luật (khai viết tắt `QC01`) | Nguồn không dẫn ở thân |
| Dùng cho | Phần của SM dùng nguồn đó | *Bước gây chuyển, tác nhân, `N-xx`, `D-xx`* (quy trình) · *Mã enum, bảng, trường* (ERD) · *điều kiện chuyển nào* (văn bản). Văn bản đã rà toàn văn mà không sinh nội dung cho lớp này thì vẫn ghi một dòng *đã rà toàn văn, không sinh …* | Để trống |

## Đánh số mục cuối

Template viết `{{n}}` cho mọi mục sau khối máy. Máy cuối cùng là mục `m` thì đánh liên tục:

| Mục | Số |
|---|---|
| Sự kiện ngoài và tác vụ nền tác động trạng thái | `m + 1` |
| Ma trận trạng thái × thao tác (mục thứ hai nhân bản thì số kế tiếp) | `m + 2` |
| Câu hỏi và điểm chưa rõ | `m + 3` |
| Rủi ro còn lại | `m + 4` |
| Điểm tạm hoãn | `m + 5` |
| Nguồn | `m + 6` |

Số mục **của máy** (2, 3, …) là mã dẫn `SM mục n` và khớp cột `#` ở mục 1.3 — không đánh lại. Số mục sau khối máy chỉ để
đọc, không ai dẫn; dòng "Cột là **trạng thái** của … — mục n" của ma trận dẫn số mục **của máy**, không phải số của
chính ma trận.
