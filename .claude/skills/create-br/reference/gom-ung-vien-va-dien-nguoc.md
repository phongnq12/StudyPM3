# Gom ứng viên và lượt điền ngược

Phần tra cứu của skill [`create-br`](../SKILL.md). Đọc phần lõi trước. Cơ chế chung — vì sao lớp 6 chạy sau cùng, ba bước xử lý, thứ tự — đã nằm ở [`ba-overview/SKILL.md`](../../ba-overview/SKILL.md) mục "Thứ tự chạy"; file này chỉ nói **chỗ tìm, cách nhận biết, cách xử lý** và **thủ tục từng lớp**. Mọi mã trong file là **mã minh họa** của [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md).

## 1. Ứng viên là gì, kết cục là gì

**Ứng viên** là một chỗ ở lớp 1–5 đang phát biểu hoặc dẫn một thứ *có thể* là business rule: một điều khoản luật được dẫn trần, một `GS-xx`, một điểm kiểm soát, một điều kiện chuyển trạng thái. Lớp 1–5 được phép dẫn luật trần vì lúc đó lớp 6 chưa cấp mã; việc của lớp 6 là gom lại, quyết từng cái, và cấp mã.

Mỗi ứng viên kết thúc ở **đúng một** trong ba kết cục.

| Kết cục | Khi nào | Ghi ở đâu |
|---|---|---|
| **Thành BR** | Qua được "Có phải business rule không" ở phần lõi | Một dòng trong bảng quy tắc; cột `Căn cứ` dẫn **chính ứng viên** (`GS-06`, `QT_DA1_LichHen mục 9 điểm 3`) và văn bản gốc nếu có |
| **Gộp vào BR khác** | Cùng nghĩa với một BR đã có (cùng chủ thể, cùng nghĩa vụ, cùng điều kiện) — thường là cùng một điều luật được nhiều lớp dẫn | Cột `Căn cứ` của BR đó liệt kê thêm nguồn, cột `Áp tại` liệt kê thêm chỗ áp |
| **Loại** | Rơi vào một dòng của bảng ở mục 3 | Bảng "Ứng viên đã loại" (mục 5 dưới đây): nguồn, phát biểu gốc, lý do **riêng**, nơi nội dung ấy đang được giữ |

Cổng ra của lớp 6 (ở `ba-overview`): *mọi ứng viên đã thành BR hoặc ghi lý do loại*. Không có kết cục thứ tư "chưa xét".

## 2. Nguồn ứng viên ở từng lớp

| Lớp | Tìm ở đâu | Nhận biết ứng viên | Thường thành |
|---|---|---|---|
| **Văn bản gốc** (đầu vào `/ba-init`) | Toàn văn từng văn bản đã liệt kê ở BRD mục 1.3 và template 1.2 | Câu có **phải · không được · chỉ được · cấm · tối đa · tối thiểu · trong thời hạn · được tính bằng · là** | HV 🔒 hoặc ⚙️; ĐN cho các định nghĩa dùng để tính |
| **1 BRD** | Mục 1.3 căn cứ pháp lý và chính sách; mục 8 nhóm quy tắc dự kiến; mục 10 ràng buộc; cột Căn cứ của từng `BRQ` mục 7 | Điều khoản được dẫn kèm một `BRQ` mà `BRQ` đó nói *phải/không được* | HV; mục 10 là điều kiện bên ngoài nên chỉ thành BR khi là nghĩa vụ của chính hệ thống |
| **2 Quy trình** — `GS-xx` | Mục 3.1 Quy tắc dùng chung | Câu mà bỏ trình tự đi vẫn đúng: cách tính, làm tròn, ghi sổ, múi giờ nghiệp vụ | ĐN (tính, làm tròn) hoặc HV (ghi sổ phải …) |
| **2** — cột `Căn cứ` của bảng bước | Bảng các bước của mỗi quy trình | Bước có căn cứ là điều khoản nêu nghĩa vụ, cấm, thời hạn; bước dẫn `D-xx` hoặc `CH-xx` | HV; bước là chỗ **áp**, câu nghĩa vụ là nội dung |
| **2** — bảng `Trường hợp biên` | Bảng Tình huống · Xử lý dưới mỗi quy trình | Dòng có xử lý **Chặn** hoặc **Cảnh báo**: nó nói hệ thống phản ứng thế nào, tức đã có mức cưỡng chế (Chặn → 🔒 hoặc ⚙️, Cảnh báo → ⚠️ nếu nguồn chỉ khuyến nghị). Dòng *Cho phép kèm điều kiện* thường là điều kiện của 🔑 | HV, mức theo chuỗi chọn ở `loai-va-cuong-che.md` mục 2 |
| **2** — dòng `Điểm kiểm soát bắt buộc` | Dòng cuối mỗi quy trình (sau Trường hợp biên) | Liệt kê điều hệ thống phải cưỡng chế; thường trùng một dòng ở mục 9 | HV; trùng thì gộp |
| **2** — điểm kiểm soát | Mục 9 Điểm kiểm soát bắt buộc (tổng hợp). Dẫn theo dạng `<mã tài liệu QT> mục 9 điểm n` | Mỗi dòng có chữ **phải, trước khi, không được**; loại kiểm soát Ngăn chặn · Phê duyệt · Tách nhiệm thường là HV 🔒 | HV |
| **2** — `D-xx` | Mục 4 Quyết định thiết kế | **Chỉ** `D-xx` nào phát biểu một bất biến đúng bất kể bước nào (*Chỉ nhận đặt lịch trực tuyến*). `D-xx` quy định cách tổ chức quy trình thì ở lại lớp 2 | HV hoặc ĐN; `D-xx` **vẫn là nguồn ứng viên**, giữ nguyên ở lớp 2, BR dẫn `D-xx` ở cột Căn cứ. `D-xx` BA đã chốt là bất biến thì BR mức 🔒 (không đẩy xuống ⚠️) |
| **2** — `CH-xx` | Mục 6 Tham số cấu hình, cột `Quy trình dẫn` | Mỗi `CH-xx` là con số của một quy tắc nào đó. `CH-xx` là **tham số**, không phải ứng viên theo nghĩa nội dung; nó cho biết **quy tắc ⚙️ phải tồn tại** | HV ⚙️ dẫn `CH-xx`. `CH-xx` không BR nào dẫn thì hỏi: tham số chết, hay thiếu quy tắc? |
| **2** — thuật ngữ cần định nghĩa tính được | Mục 1.1 | Thuật ngữ mà ở chỗ khác hệ thống phải *đếm* hoặc *phân loại* theo nó (*lượt hẹn*) | ĐN |
| **3 ERD** — `R-xx` | Mục 5.1 đẳng thức và ràng buộc toàn vẹn; 5.3 trạng thái suy | `R-xx` **có căn cứ pháp lý riêng** trong cột Nguồn (không chỉ `GS-xx`) là ứng viên; loại Tách nhiệm, Loại trừ thường là ứng viên | HV; BR dẫn `R-xx`, không chép đẳng thức; lượt điền ngược thêm mã BR vào cột Nguồn của `R-xx` |
| **3 ERD** — ràng buộc dạng dữ liệu | Từ điển dữ liệu mục 4: bản số của quan hệ (dòng khóa ngoại), `UK`, `*`, `◐` mà cột Nguồn dẫn điều khoản, `D-xx` hoặc `GS-xx` nghiệp vụ | Ràng buộc dữ liệu có **nguồn nghiệp vụ** (*một hồ sơ chỉ có một sổ lịch hẹn* làm quan hệ 1–1). Ràng buộc chỉ nhìn một thuộc tính là đủ (kiểu, độ dài, miền, bắt buộc tuyệt đối) thì **không** phải ứng viên | HV hoặc ĐN; BR phát biểu **nội dung**, dẫn tên bảng hoặc trường, không chép dạng dữ liệu; lượt điền ngược thêm mã BR vào cột Nguồn của đúng dòng đó |
| **4 Máy trạng thái** — điều kiện | Cột `Điều kiện` của từng bảng chuyển; ô điều kiện chặn dùng chung `SM-09` | Điều kiện là **câu có động từ nghĩa vụ** (còn lượt; khác người lập; đủ hồ sơ) và có căn cứ | HV `chỉ được … khi` |
| **4** — dòng `Cấm:` | Dòng **Cấm:** ở cuối mỗi máy (chuyển không hợp lệ, người lập tự duyệt, mở lại trạng thái ■…) | Mỗi mục là một điều bị cấm; nếu có căn cứ nghiệp vụ thì là ứng viên, thường trùng ô cấm của ma trận | HV `không được` |
| **4** — ma trận trạng thái × thao tác | Mục "Ma trận trạng thái × thao tác" | Ô cấm một thao tác ở một trạng thái *và* có căn cứ nghiệp vụ (*đã duyệt thì không được sửa số người*) | HV |
| **4** — `SM-nn` nguyên tắc | Mục 1.1 | Chỉ `SM-nn` mang căn cứ pháp lý hay nghiệp vụ riêng (`SM-07` người lập không tự duyệt). `SM-nn` kỹ thuật (`SM-04`, `SM-08`) thì loại | HV |
| **5 Use case** | Cột `Ghi chú` của `use_case_list` mục 3 (căn cứ tối thiểu); `use_case_diagram` mục 1 cột `Căn cứ vai trò` và mục 1.2 bảng tách nhiệm giữa tác nhân | Điều khoản dẫn trần ở cột Ghi chú và cột Căn cứ vai trò; cặp tách nhiệm | HV |
| **Quy trình mục 1, 8.1, 10** | Chứng từ có mẫu ban hành; Quy trình mục 10 (bước người làm chưa có UC, do lớp 5 điền trước lớp 6) | Nghĩa vụ phải lập, phải lưu, phải ký theo mẫu | HV; mẫu vào Phụ lục A, nghĩa vụ chưa có UC vào Phụ lục B |

Cách gom thực tế: duyệt từng nguồn ở bảng trên theo thứ tự lớp 1 → 5, ghi mỗi ứng viên một dòng vào bảng làm việc (cột: `#` · nguồn · phát biểu gốc · kết cục · mã BR hoặc lý do). Bảng làm việc không nằm trong tài liệu; chỉ phần **loại** vào tài liệu. Duyệt cuối cùng ngược lại: lấy từng `CH-xx`, từng `GS-xx`, từng dòng mục 9, từng dòng Chặn/Cảnh báo ở Trường hợp biên, từng dòng `Cấm:` của SM đối chiếu bảng làm việc để chắc không sót.

## 3. Loại ứng viên — lý do và nơi giữ

Lý do loại phải là **lý do riêng của ứng viên đó**, không chép một câu dùng cho mọi dòng.

| Ứng viên là | Phép thử | Nơi nội dung được giữ |
|---|---|---|
| **Một bước quy trình** | Có chữ *sau khi, rồi, tiếp theo, bước* và bỏ trình tự đi thì câu mất nghĩa | Quy trình, bước tương ứng |
| **Ràng buộc nội tại một thuộc tính** | Nhìn một thuộc tính là đủ: kiểu, độ dài, miền, bắt buộc tuyệt đối, duy nhất | ERD cột Ràng buộc |
| **Một chuyển trạng thái hoặc điều kiện của nó đã được SM phủ** | Câu mô tả *đổi từ đâu sang đâu*. Nhưng nếu điều kiện chứa một quy tắc có căn cứ thì **điều kiện** là ứng viên, **chuyển** thì loại | SM mục n |
| **Cơ chế kỹ thuật** | Giao dịch, khóa, đồng thời, chống bấm đôi: không có chủ thể nghiệp vụ, không căn cứ nghiệp vụ | `GS-xx` kỹ thuật, `SM-04`, `SM-08`, SRS |
| **Phân quyền thuần** | Chỉ nói vai nào được thao tác gì | Lớp 5, ma trận tác nhân × UC, `Permission key` |
| **Câu thông báo, nhãn, bố cục** | Nhắc màn hình, nút, thông báo | `/ba-detail`, prototype |
| **Mục tiêu hoặc chỉ tiêu** | Nói *cần đạt* chứ không nói *được/không được* | BRD mục 2, `OBJ-xx` |
| **Chỉ báo hiệu suất, SLA** | Con số về thời gian đáp ứng, sẵn sàng | BRD mục 9 NFR |
| **Thuật ngữ chỉ để hiểu** | `X là …` nhưng hệ thống không dùng để đếm hay phân loại | BRD mục 5 hoặc Quy trình mục 1.1 |
| **Thao tác ngoài phạm vi hệ thống (🟡)** | Bước tô vàng ở Quy trình | Quy trình; nếu là **nghĩa vụ pháp lý** thì **không loại** mà vào Phụ lục B |
| **Trùng một BR đã có** | Cùng chủ thể, cùng nghĩa vụ | Gộp (kết cục thứ hai), không phải loại |
| **Không có nguồn, chỉ là mong muốn** | Không điều khoản, không mã, không người chốt | Chờ chốt: BR mức ❓ kèm `[CẦN BA CHỐT]`, không loại |

Nghi ngờ giữa "loại" và "thành BR" thì chọn **thành BR mức ❓** kèm `Q-BR…`: loại nhầm làm mất quy tắc, còn giữ nhầm thì BA gạt một dòng.

## 4. Cấp mã, điền `Áp tại` và `Liên quan`

Sau khi xử lý ứng viên, chia nhóm theo khối nghiệp vụ, đặt chữ nhóm, cấp số (quy ước ở phần lõi, mục "Mã và tên"). Rồi điền hai cột nối sang các lớp khác:

| Cột | Điền từ đâu |
|---|---|
| `Áp tại` | **Mọi** chỗ mà các ứng viên gộp vào BR này đang đứng: `LH-01 bước 2`, `SM mục 2: DRAFT → PENDING_APPROVAL`, `Lich_Hen.so_nguoi`. Một BR ⚙️ nối nhiều chỗ thì liệt kê đủ — kể cả mọi chỗ lớp 1, 2, 3, 4, 5 đang dẫn trần, vì lượt điền ngược lấy `Áp tại` làm danh sách việc. Quy tắc không áp được vào đâu ở các lớp hiện có thì ghi `chưa chốt (<ai>)` hoặc ❓ — đó là dấu hiệu thiếu bước quy trình hoặc thiếu chuyển trạng thái |
| `Liên quan` | Mã UC (WBS ở cột `No` của `use_case_list`, G2) của các UC thực hiện bước hoặc chuyển ở `Áp tại`, cộng BR, `D-xx`, `R-xx`, `CH-xx` có quan hệ. Chưa có UC thì ghi `chưa chốt (BA)` và xem Phụ lục B |

## 5. Bảng "Ứng viên đã loại"

Template không có chỗ cho kết cục "loại", trong khi cổng ra của `ba-overview` đòi *ghi lý do loại*. Xử lý: thêm bảng bổ sung riêng `Ứng viên đã loại`, đặt **ngay trước Phụ lục A** (sau Danh sách điểm cần chốt, Rủi ro còn lại `RK-nn`, Điểm tạm hoãn `TH-nn`), theo `00_quy_uoc_chung.md` mục 6.

| Nguồn | Phát biểu gốc | Lý do loại | Nơi nội dung đang được giữ |
|---|---|---|---|
| `QT_DA1_LichHen mục 9 điểm 3` | Hệ thống báo khách kết quả duyệt | Là bước quy trình, chỉ có nghĩa trong trình tự | `LH-01 bước 5` |
| `Lich_Hen.so_nguoi` (ERD) | Số người đi cùng từ 1 đến 3 | Ràng buộc nội tại một thuộc tính | ERD cột Ràng buộc |

Không có ứng viên nào bị loại thì ghi *Không có ứng viên bị loại*.

## 6. Lượt điền ngược

**Thời điểm.** Lượt này chạy **sau** reviewer độc lập và sau khi bộ BR đã sửa xong (bước 7 của quy trình viết), rồi mới kiểm cổng ra — để mã BR không lan sang năm lớp rồi mới bị đổi. Hệ quả: nếu review bỏ một BR thì chưa có gì để thu hồi ở các lớp kia.

**Việc làm.** Mọi chỗ ở lớp 1, 2, 3, 4, 5 đang dẫn trực tiếp điều khoản mà nay đã có BR tương ứng được **thêm mã BR kèm tên ngắn đứng trước điều khoản**, **giữ nguyên điều khoản** — không xóa, không thay. Dạng chuẩn do `ba-overview` quy định: `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1`.

Quy tắc chung cho cả năm lớp:

| Quy tắc | Nội dung |
|---|---|
| Chỉ thêm mã | Không sửa nội dung của lớp đó và **không xóa điều khoản**. Thấy lớp đó nói **khác** BR: dừng, ghi một dòng `Q-BR…` ở Điểm cần chốt với cả hai phát biểu, báo người dùng; không tự sửa bên nào |
| Mã và tên ngắn | Chép **đúng** chuỗi trong ô `Mã` của BR, đúng bảng mã chuẩn của `vi-du-xuyen-suot.md` |
| BR ở mức ❓ | **Chưa điền ngược.** Ghi vào Điểm cần chốt: *"khi chốt `BR-A05`, điền ngược tại …"*. Điền sớm sẽ đưa quy tắc chưa chốt vào tài liệu mà người khác tin |
| Kiểm hai chiều | Với mỗi BR: mở từng chỗ ở `Áp tại` xem đã có mã BR chưa. Với mỗi mã BR tìm thấy ở lớp 1, 2, 3, 4, 5: tìm ngược ở bộ BR xem có thật và đúng tên ngắn không. Với mỗi điều khoản gốc đã có chỗ dẫn: còn nguyên sau khi điền |

| Lớp | Chỗ điền | Cách điền (minh họa) |
|---|---|---|
| **1 BRD** | **Mục 8** Chính sách và quy tắc nghiệp vụ (lượt đầu là `chờ lớp 6`) | Mỗi nhóm một dòng: tên nhóm, số quy tắc (lấy từ Thống kê), căn cứ chính, đường dẫn tới file BR kèm mục. Ví dụ: *A — Lịch hẹn · 4 · QC01 Đ5.1, Đ6.3, Đ7.2 · `../6-business-rules/BR_….md` mục 2*. Mục 8 chỉ đếm, không phát biểu quy tắc. Chữ nhóm do lớp 6 đặt, lớp 6 điền vào đây |
| | **Mục 12** Truy vết, cột `Business rule` | Mỗi `BRQ` có ít nhất một mã BR, hoặc ghi rõ vì sao không (*thuần giải pháp*, *thuộc NFR*). Kiểm: mọi `BRQ` xuống được ít nhất một QT, BR hoặc UC |
| **2 Quy trình** | **Mọi cột và dòng `Căn cứ`**: dòng `Căn cứ` đầu mỗi quy trình, cột `Căn cứ` của bảng bước, ô xử lý của bảng Trường hợp biên (chỗ ghi căn cứ), dòng `Điểm kiểm soát bắt buộc` cuối mỗi quy trình, cột `Căn cứ` của mục 9; cộng **dòng BR ở bảng Nguồn mục 1** | `QC01 Đ5.1 · CH-01` → `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1 · CH-01`. Chỗ nào đang dẫn `GS-xx` mà `GS-xx` đã thành BR thì thêm mã BR trước `GS-xx`. Không sửa mục 3.1 `GS-xx` và mục 6 `CH-xx` — hai mục đó vẫn là nguồn của chính chúng |
| **4 Máy trạng thái** | Cột **`Điều kiện`** của từng bảng chuyển; ô điều kiện chặn dùng chung `SM-09` | `Còn lượt trong tuần của ngày hẹn — QC01 Đ5.1` → `Còn lượt trong tuần của ngày hẹn — BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1`. **Thêm mã, giữ điều khoản**; guard chưa có BR thì giữ nguyên văn bản hoặc `GS-xx` |
| **5 Use case** | **UCL** cột **`Ghi chú`** ở mục 3 của `use_case_list` | `QK-… bước 1 · QC01 Đ5.1` → `QK-… bước 1 · BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1`. Đây là **sở cứ tối thiểu** mà `create-uc` sẽ dẫn |
| | **UCD** cột **`Căn cứ vai trò`** ở mục 1 và bảng **tách nhiệm** mục 1.2 | Cặp tách nhiệm đang dẫn `QT_DA1_LichHen mục 9 điểm 2 · QC01 Đ6.3` → `BR-A04 Người đặt hộ không tự duyệt · QT_DA1_LichHen mục 9 điểm 2 · QC01 Đ6.3` |
| **3 ERD** | Cột Nguồn của từ điển dữ liệu mục 4 (kể cả dòng khóa ngoại mang bản số của quan hệ, `UK`) · cột Nguồn của `R-xx` mục 5 · chỗ Mô tả đang ghi *xem business rule — <tên>* | Thêm mã BR kèm tên ngắn trước căn cứ đang có, giữ điều khoản; một ô có thể nhận nhiều BR, cách `·` (`BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · BR-A02 Định nghĩa lượt đã dùng · QC01 Đ5.1`). Thấy dạng dữ liệu ở ERD lệch với câu trong BR (ví dụ BR nói 1–1 mà ERD vẽ 1–N) thì ghi `Q-BR…`, không tự sửa ERD |

Nhiều BR cùng áp tại một ô thì liệt kê đủ, cách nhau bằng `·`.

### Ghi Version control

Cách ghi Version control **của tài liệu bị sửa** — sửa không đổi nghĩa — ở mọi trạng thái thêm một gạch đầu dòng vào dòng phiên bản hiện tại, không tăng `vNN`, không đổi trạng thái (`00_quy_uoc_chung.md` mục 3.3); AI không ghi "BA chốt" — theo [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 3.3. Skill này không đặt cách khác. Chỉ thêm mẫu câu cho dòng mô tả: `- Điền ngược từ BR_<mã>_v00: thêm mã BR vào cột Căn cứ (n chỗ).`

## 7. Từ ứng viên sang Phụ lục A và B

| Phụ lục | Lấy từ | Quy tắc |
|---|---|---|
| **A — Biểu mẫu pháp lý liên quan** | Quy trình mục 8.1 Chứng từ có mẫu ban hành — bắt buộc dùng đúng mẫu | Chỉ mẫu **do văn bản gốc ban hành** và có BR liên quan. Trường dữ liệu chính chỉ là các trường mà **mẫu bắt buộc**; tên trường dữ liệu và kiểu thuộc ERD |
| **B — Nghĩa vụ chưa có use case** | Quy trình mục 10 — nay là danh sách **bước người làm chưa có UC**, do `create-ucl` điền ở lớp 5 trước lớp 6; bước 🟡 là nghĩa vụ pháp lý. **Điều khoản** lấy từ cột `Căn cứ` của bước quy trình đó | Mỗi dòng nói nghĩa vụ, căn cứ, BR nếu đã có, quy trình liên quan. Mục đích: không ai tưởng đã có chức năng phủ nghĩa vụ này |
