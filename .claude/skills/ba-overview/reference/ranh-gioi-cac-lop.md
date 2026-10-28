# Ranh giới giữa các lớp

Phần tra cứu của skill [`ba-overview`](../SKILL.md). **Một bảng duy nhất** — hai skill ở hai bên một
ranh giới cùng dẫn về đây, không skill nào tự viết lại phiên bản của mình.

## 1. Nội dung nào thuộc lớp nào

Chuẩn theo `00_quy_uoc_chung.md` mục 1 "Quy tắc nguồn sự thật", chi tiết hóa:

| Nội dung | Lớp sở hữu — định nghĩa ở đây | Lớp khác làm gì |
|---|---|---|
| Vấn đề, mục tiêu đo được, phạm vi trong/ngoài, bên liên quan | 1 BRD | Dẫn `OBJ-xx`, `BRQ-xx`, `SH-xx` |
| Yêu cầu phi chức năng mức nghiệp vụ | 1 BRD mục 9 | SRS chi tiết hóa con số kỹ thuật |
| Thuật ngữ cấp tổ chức | 1 BRD mục 5 | Dẫn |
| Thuật ngữ chi tiết của domain | 2 Quy trình mục 1.1 | Dẫn; ERD ghi tên bảng tương ứng ở cột Thực thể ERD |
| Bước, thứ tự, ai làm bước nào, bàn giao, khoảng chờ | 2 Quy trình | Dẫn `QK-01 bước 3` |
| **Tên vai** của tác nhân người | 1 BRD mục 4 cột Bên liên quan | Quy trình mục 2 giữ đúng chữ; lớp 5 giữ đúng chữ khi cấp `ACT-nn` |
| Tác nhân và **thao tác của họ trong domain**; tác nhân hệ thống, hệ thống ngoài | 2 Quy trình mục 2 | Lớp 5 lấy làm nguồn, cấp `ACT-nn`, phân loại QĐ 671 |
| **Tách nhiệm** — cặp thao tác không được cùng một người | Nguồn: Quy trình mục 2 "Tách nhiệm bắt buộc" và điểm kiểm soát mục 9 loại Tách nhiệm. Nội dung có mã: 6 Business rule | ERD `R-xx` loại Tách nhiệm chỉ là phép kiểm dữ liệu (`nguoi_duyet_id ≠ nguoi_lap_id`) dẫn BR; SM ghi ở cột Điều kiện, dẫn BR; UCD mục 1.2 liệt kê **mọi** cặp, dẫn quy trình và BR |
| Quyết định nghiệp vụ của dự án | 2 Quy trình mục 4 `D-xx` | Dẫn |
| Quy tắc tính toán, ghi sổ dùng chung | 2 Quy trình mục 3.1 `GS-xx` | Lớp 6 coi là **ứng viên BR**; ERD, SM dẫn `GS-xx` |
| Tham số cấu hình | 2 Quy trình mục 6 `CH-xx` | BR ⚙️ dẫn `CH-xx`; không ghi con số trần |
| Tác vụ nền | 2 Quy trình mục 5 `N-xx` | SM ghi ⚙️ `N-xx`; lớp 5 sinh UC tác nhân hệ thống |
| Điểm kiểm soát bắt buộc | 2 Quy trình mục 9 | Lớp 6 coi là **ứng viên BR** |
| Tên bảng, tên trường, kiểu, mã enum, quan hệ, bản số | 3 ERD | Mọi lớp dẫn đúng chuỗi |
| Ràng buộc ở **dạng dữ liệu** — kiểu, độ dài, miền, bắt buộc tuyệt đối, duy nhất, bản số của quan hệ | 3 ERD cột Ràng buộc và sơ đồ | Khi ràng buộc đến từ một quy tắc nghiệp vụ, ERD dẫn mã BR ở cột Nguồn (một hoặc nhiều mã); BR phát biểu nội dung, không chép lại dạng dữ liệu |
| Đẳng thức đối soát, ràng buộc liên bảng | 3 ERD mục 5 `R-xx` | Dẫn hai chiều: `R-xx` dẫn BR ở cột Nguồn; BR dẫn `R-xx` như cách kiểm |
| Trạng thái, chuyển hợp lệ, chuyển bị cấm | 4 Máy trạng thái | Quy trình, UC dẫn `SM mục n` |
| Tác nhân có mã, phân loại, tách nhiệm giữa tác nhân | 5 `use_case_diagram` | Dẫn `ACT-nn` |
| Danh sách UC, mã UC, permission key, cây WBS | 5 `use_case_list` | create-uc nhận dòng, viết thân |
| Ràng buộc **theo ngữ cảnh** hoặc **liên thuộc tính**, nghĩa vụ, cấm, tính toán có căn cứ | 6 Business rule | Lớp khác dẫn `BR-{nhóm}{nn}` sau lượt điền ngược |
| Màn hình, route, nhãn, câu thông báo, API | ngoài business layer — `/ba-detail` | Business layer không ghi |

## 2. Các cặp hay nhầm

| Cặp | Phép thử | Thuộc bên trái khi | Thuộc bên phải khi |
|---|---|---|---|
| **BRD ↔ Quy trình** | Câu có nêu ai làm, bước mấy không? | Nói tổ chức cần đạt gì, vì sao: *"Cho khách đặt lịch hẹn trực tuyến tại mọi chi nhánh"* | Nói ai làm bước nào, theo thứ tự nào: *"Nhân viên tiếp đón lập phiếu hẹn, Giám đốc trung tâm ký"* |
| **BRD mục 8 ↔ BR** | Có phát biểu nội dung quy tắc không? | BRD chỉ **đếm** nhóm quy tắc và trỏ file | BR phát biểu từng quy tắc |
| **Quy trình ↔ Use case** | Có khoảng chờ, có chuyển giao giữa người không? | Nhiều người, nhiều lượt, có bàn giao hoặc chờ việc khác xảy ra | Một người, một lần ngồi, một bước ghi — UC là phần nằm **bên trong một bước "người làm trên hệ thống"** của quy trình. Quy trình không chép nội dung UC |
| **Quy trình ↔ BR** | Bỏ trình tự đi, câu còn đúng không? | Câu chỉ có nghĩa trong trình tự: *"Sau khi duyệt, báo khách"* | Câu đúng bất kể đang ở bước nào: *"Người đặt hộ không được tự duyệt lịch hẹn"*. Ở lớp 2 ghi thành `GS-xx` hoặc điểm kiểm soát, lớp 6 cấp mã BR |
| **BRD mục 4 ↔ Quy trình mục 2 ↔ Lớp 5 tác nhân** | Tên vai đặt ở đâu? | BRD đặt **tên vai** người (viết trước). Quy trình là **nguồn** thao tác, căn cứ phân công, và đặt tên cho tác nhân hệ thống | Lớp 5 cấp `ACT-nn`, phân loại QĐ 671, vẽ tổng quát hóa. Tên giữ nguyên chữ của BRD và quy trình; lệch thì câu hỏi, không tự đổi |
| **ERD ↔ BR** | Ràng buộc có viết được thành cấu trúc dữ liệu không? | Viết được — bản số, `UK`, `*`, miền giá trị, `R-xx`: ERD thể hiện, và dẫn BR ở cột Nguồn nếu ràng buộc đến từ quy tắc nghiệp vụ. *"Một khách chỉ có một hồ sơ liên hệ"* → quan hệ `\|\|--\|\|`, khóa ngoại `UK`, Nguồn `BR-…` | Không viết được — phụ thuộc trạng thái, tác nhân, kênh, thời điểm: *"Lịch hẹn đã duyệt thì không được sửa ngày hẹn"*. Chỉ BR phát biểu; ERD có thể nhắc ở Mô tả, dẫn mã BR |
| **ERD ↔ từ điển dữ liệu SRS** | Có nhắc tới màn hình, cách nhập không? | Tên, kiểu, bắt buộc tuyệt đối, miền giá trị, nguồn | Nhãn hiển thị, định dạng nhập, thứ tự trường, validate theo màn — để `/ba-detail` |
| **ERD ↔ Máy trạng thái** | Đang liệt kê giá trị hay mô tả chuyển? | ERD liệt kê mã enum của `trang_thai` và trỏ `SM mục n` | SM mô tả chuyển, điều kiện, hệ quả. **Mã trạng thái lấy đúng ERD**; lệch thì ERD thắng về mã, quy trình thắng về nghiệp vụ |
| **Máy trạng thái ↔ BR** | Ô điều kiện đang phát biểu quy tắc hay dẫn quy tắc? | SM là **nơi áp**: ô Điều kiện chỉ dẫn mã kèm tên ngắn | BR là **nội dung**. Guard chưa có BR thì ô Điều kiện dẫn văn bản hoặc `GS-xx`, lượt điền ngược thêm BR |
| **Máy trạng thái ↔ Lớp 5** | Chuyển do ai? | Mỗi chuyển 👤 là một thao tác | Mỗi chuyển 👤 phải có **ít nhất một UC** phủ — kiểm ở `use_case_list` mục 6 |
| **Máy trạng thái ↔ Quy trình** | Đang theo dõi một đối tượng hay một chuỗi việc? | Vòng đời **một thực thể** | Tiến độ một chuỗi việc của nhiều người. Bước quy trình là *sự kiện* gây chuyển — SM dẫn `QK-01 bước 3` ở cột Ai — sự kiện |
| **👤 hay ⚙️ cho một chuyển** | Bước gây chuyển có chạy cùng request với một bước người ngay trước không? | Có — bước hệ thống là phần còn lại của thao tác người (ví dụ `LH-01 bước 2–3` sau bước 1): chuyển là **👤** của tác nhân bước người, dẫn cả dải bước `LH-01 bước 1–3`. Quy trình ghi bước đó tác nhân "Hệ thống" như thường, nhưng khi bàn giao cho lớp 4, 5 thì gắn vào bước người | Không — hệ thống tự chạy theo lịch hoặc sự kiện, không người nào đang thao tác: chuyển là **⚙️**, dẫn `N-xx` hoặc sự kiện. Chuyển do hệ thống ngoài: **🔗** |
| **Lớp 5 ↔ create-uc** | Đang viết một dòng hay một luồng? | Lớp 5 cấp **dòng**: mã, tên, tác nhân, permission key, mã dự toán, căn cứ tối thiểu ở cột Ghi chú | create-uc viết **thân**: luồng, nhánh, sở cứ từng bước. Lớp 5 không viết luồng |

## 3. Đầu vào, đầu ra của từng lớp

| Lớp | Nhận từ | Giao cho |
|---|---|---|
| 1 BRD | Đầu ra `/ba-init` | `OBJ`, `BRQ` → 2 · `SH` → 5 · NFR → SRS · nhóm quy tắc → 6 |
| 2 Quy trình | BRD, văn bản pháp luật, hiện trạng | Bước → 4, 5, 6 · thuật ngữ, dữ liệu trục, chứng từ → 3 · tác nhân → 5 · `N-xx` → 4, 5 · `GS-xx`, điểm kiểm soát → 6 · `CH-xx` → 6 |
| 3 ERD | Quy trình mục 1.1, 3, 3.1, 8 · bản vẽ gốc | Tên bảng, trường, enum → 4, 5, 6, `/ba-detail` · dữ liệu nhạy cảm → BRD mục 9 |
| 4 Máy trạng thái | ERD enum · quy trình bước, `N-xx` | Chuyển 👤 → 5 · điều kiện → 6 · ma trận trạng thái × thao tác → testcase |
| 5 Tác nhân, UC | Quy trình mục 2 và bước · SM chuyển 👤 · dự toán · BRD `SH` | Dòng UC + permission key → create-uc · ma trận tác nhân × UC → ma trận quyền SRS |
| 6 Business rule | Văn bản pháp luật · BRD · quy trình `GS`, điểm kiểm soát, `CH` · SM điều kiện · ERD ràng buộc, bản số, `R-xx` | Mã `BR` → lượt điền ngược lớp 1, 2, 3, 4, 5 · sở cứ của create-uc · testcase |
