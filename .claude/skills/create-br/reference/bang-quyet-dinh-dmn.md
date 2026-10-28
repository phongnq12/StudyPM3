# Bảng quyết định (DMN)

Phần tra cứu của skill [`create-br`](../SKILL.md). Đọc phần lõi và `loai-va-cuong-che.md` trước. Mọi mã, tên, con số, điều khoản trong file này là **minh họa**. `BR-A03` theo bảng mã chuẩn của `vi-du-xuyen-suot.md`; `BR-A08`, `BR-A09`, `CH-04`…`CH-06`, `QC01 Đ7.3`, `Đ8.1`, `Đ8.2` là **mã minh họa riêng của skill** (danh sách ở `SKILL.md`).

## 1. Khi nào dùng bảng thay vì câu

Template: quy tắc nhiều điều kiện viết bằng bảng quyết định theo OMG DMN 1.5. Bảng không thay cho quy tắc; nó là **cách trình bày** một quy tắc mà câu văn trở nên khó đọc hoặc dễ sót.

| Dùng bảng khi | Dùng câu khi |
|---|---|
| Kết quả phụ thuộc **từ hai điều kiện** trở lên, mỗi điều kiện có nhiều giá trị | Một điều kiện, một kết quả |
| Câu phải dùng "nếu … thì …, ngược lại …, trừ khi …" lồng nhau | Câu đọc một lần là hiểu |
| Có **ngưỡng, khoảng số** `CH-xx` chia kết quả thành nhiều bậc | Chỉ có một biên |
| Người kiểm (QC) cần liệt kê tổ hợp để viết testcase | |

Mỗi bảng **gắn với một mã BR**; cột `Nội dung` của mã đó viết một câu tổng quát ("`Mức ưu tiên duyệt` được xác định theo bảng quyết định dưới đây"), bảng đặt ngay dưới bảng quy tắc của nhóm. Bảng không có mã riêng. Một bảng cho ra hai loại kết quả khác nhau về bản chất, hoặc các dòng cần hai mức cưỡng chế khác nhau, thì là hai quy tắc: tách hai mã, hai bảng.

## 2. Cấu trúc bảng

Template cho một khung: `# | điều kiện… | → kết quả | Ghi chú`, tiêu đề `Bảng quyết định BR-A0x — {{tên}} · chính sách trúng: {{U}}`.

| Thành phần | Quy định |
|---|---|
| Tiêu đề | `Bảng quyết định <mã BR> — <tên> · chính sách trúng: <U hoặc F>`. Tên là danh từ nghiệp vụ |
| Cột `#` | Số thứ tự dòng bắt đầu từ 1. Với chính sách F, số thứ tự **là** thứ tự ưu tiên, nên đổi chỗ dòng là đổi nghĩa — không đánh lại số khi sắp xếp |
| Cột điều kiện | Một cột một **đầu vào**. Tên cột là khái niệm nghiệp vụ (thuộc tính của thực thể, trạng thái, vai trò), không phải tên trường hay tên điều khiển. Giá trị trong ô: tên tiếng Việt như trong từ vựng; khoảng số dùng `≥`, `<`; ngưỡng là `CH-xx` |
| Ô `—` | Điều kiện này **không ảnh hưởng** ở dòng đó (DMN gọi là *any*). Không dùng để nói "không áp dụng" cho một điều kiện chưa rõ |
| Cột `→ kết quả` | Một hoặc hai cột đầu ra có mũi tên ở tên cột. Kết quả là điều nghiệp vụ ("Lượt được trả lại"), không phải hành động giao diện. Một bảng một **loại** kết quả |
| Cột `Ghi chú` | Căn cứ riêng cho dòng đó (`QC01 Đ7.2`) hoặc ❓ kèm `Q-BR…` nếu dòng đó chưa có nguồn. Căn cứ chung của cả bảng nằm ở dòng của mã BR |

**Con số trong bảng.** Template và bài giới thiệu đều nói ngưỡng là cấu hình được; `00_quy_uoc_chung` mục 7 chỉ định cách ghi: **ô của bảng ghi `CH-xx`**, giá trị thật ở Quy trình mục 6. Ngưỡng do luật định cứng (mức 🔒) thì ghi số kèm biên ngay trong ô và dẫn căn cứ ở `Ghi chú`. Cần ngưỡng cấu hình mà `CH-xx` chưa có thì ghi `CH-xx ❓` và thêm dòng đề nghị bổ sung ở Điểm cần chốt.

## 3. Chính sách trúng

Chính sách trúng nói **khi một bộ đầu vào khớp nhiều dòng thì lấy dòng nào**. Template liệt kê hai chính sách; DMN còn nhiều hơn.

| Chính sách | Tên | Nghĩa | Dùng khi | Yêu cầu với bảng |
|---|---|---|---|---|
| **U** | Unique — duy nhất | Mỗi bộ đầu vào khớp **tối đa một** dòng | Mặc định. Các dòng loại trừ nhau | Không có chồng lấn; mọi tổ hợp có đúng một dòng (nếu thiếu thì ghi rõ tổ hợp ngoài miền) |
| **F** | First — dòng đầu tiên khớp | Dòng nào khớp trước (từ trên xuống) thì thắng | Có dòng **đặc biệt** đứng trước và dòng **mặc định** cuối bảng | Dòng cụ thể đặt trước, dòng chung đặt sau; có dòng cuối bắt mọi trường hợp còn lại, hoặc chứng minh các dòng trước đã phủ hết |
| **A** | Any | Nhiều dòng có thể khớp, nhưng **kết quả phải giống nhau** | Rút gọn bảng khi hai dòng khác điều kiện nhưng cùng kết quả | Mọi cặp dòng chồng lấn phải cùng kết quả. Thường rút lại được về U |
| **P** | Priority | Nhiều dòng khớp, lấy kết quả có **độ ưu tiên cao nhất** theo một thứ tự khai trước | Kết quả là một danh sách xếp bậc ("Từ chối" mạnh hơn "Cảnh báo") | Khai thứ tự ưu tiên của kết quả ngay dưới bảng. Hiếm dùng |

Template chỉ nêu U và F; A và P hợp lệ về DMN nhưng chỉ dùng khi đã khai rõ trong tiêu đề và có lý do. Các chính sách tập hợp (C, R, O) cho ra nhiều kết quả cùng lúc nên trái nguyên tắc "một quy tắc một kết quả"; không dùng.

Chọn **U** trước. Chuyển sang F khi bảng U bắt buộc nhắc lại điều kiện của dòng đặc biệt ở mọi dòng còn lại, khiến bảng dài và dễ sai.

## 4. Kiểm đủ tổ hợp và chồng lấn

Làm bốn bước, ghi kết quả vào ghi chú soát (không cần đưa vào tài liệu nếu bảng đạt).

| Bước | Việc |
|---|---|
| 1 | **Liệt kê miền của từng cột điều kiện.** Cột giá trị rời rạc: liệt kê hết giá trị (đủ trạng thái, đủ vai trò). Cột số: chia thành khoảng liền kề phủ hết miền hợp lệ |
| 2 | **Nhân ra số tổ hợp.** Số tổ hợp = tích số giá trị của các cột. Ô `—` trải ra mọi giá trị của cột đó |
| 3 | **Với mỗi tổ hợp, đếm số dòng khớp.** U: mỗi tổ hợp đúng một. F: ít nhất một, và dòng đầu khớp là dòng mong đợi. Đếm bằng cách cộng số tổ hợp mỗi dòng phủ (dòng có ô `—` phủ nhiều tổ hợp) — tổng phải bằng số tổ hợp ở bước 2 khi là U |
| 4 | **Kiểm biên của khoảng số.** Hai khoảng liền kề phải dùng đúng một cặp `≥` và `<` cho cùng một ngưỡng; không dùng khoảng đóng hai đầu (`[70]–[89]`) với số có phần thập phân, vì 89,5 rơi vào khoảng trống |

Lỗi thường gặp:

| Lỗi | Dấu hiệu | Sửa |
|---|---|---|
| Thiếu tổ hợp | Tổng tổ hợp các dòng phủ nhỏ hơn tích miền | Thêm dòng, hoặc ghi vào `Ghi chú` rằng tổ hợp đó không xảy ra và vì sao (nếu thật sự không xảy ra, ví dụ trạng thái Nháp chưa giữ lượt) |
| Chồng lấn trong U | Một tổ hợp khớp hai dòng | Thu hẹp một dòng, hoặc đổi sang F và sắp thứ tự |
| Chồng lấn trong F mà không ý thức | Dòng chung đứng trước dòng cụ thể | Đổi thứ tự: cụ thể trước |
| F thiếu dòng mặc định | Có tổ hợp không dòng nào khớp | Thêm dòng cuối mọi ô `—`, hoặc chứng minh đã phủ |
| Khoảng số hở | `< CH-03` và `> CH-03` bỏ sót đúng bằng `CH-03` | `< CH-03` và `≥ CH-03` |
| Khoảng số dùng con số trần | Ô ghi `≥ 7` | `≥ CH-03` |
| Kết quả là hành động giao diện | "Hiện hộp thoại" | Viết kết quả nghiệp vụ |

## 5. Ví dụ hoàn chỉnh (minh họa)

### 5.1. Chính sách U

Mã `BR-A03` của ví dụ xuyên suốt (ĐN ⚙️, quy tắc suy ra) nói khách hủy lịch trước giờ hẹn `CH-02` giờ thì lượt được trả lại. Giả sử quy chế có thêm trường hợp trung tâm hủy (ví dụ xuyên suốt chỉ có trường hợp khách hủy); khi đó hai điều kiện sinh bốn tổ hợp nên viết thành bảng. Vì là ĐN, testcase của bảng là ca **tính đúng** cho từng dòng, không phải ca bị chặn.

| Mã | Nội dung | Căn cứ | Loại | Cưỡng chế | Áp tại | Liên quan |
|---|---|---|:-:|:-:|---|---|
| **BR-A03**<br>*Hủy sớm được trả lượt* | Việc lượt hẹn có được trả lại khi lịch bị hủy được xác định theo bảng quyết định BR-A03 dưới đây | QC01 Đ7.2 | ĐN | ⚙️ | LH-02 · SM mục 2: `PENDING_APPROVAL`, `APPROVED` → `CANCELLED` | DA1.WEB.03.01.06 |

**Bảng quyết định BR-A03 — Hủy sớm được trả lượt** · chính sách trúng: U

| # | Bên hủy | Thời điểm hủy so với giờ hẹn | → Lượt hẹn | Ghi chú |
|---|---|---|---|---|
| 1 | Khách | Cách giờ hẹn ≥ `CH-02` giờ | Được trả lại | QC01 Đ7.2 |
| 2 | Khách | Cách giờ hẹn < `CH-02` giờ | Không được trả lại | QC01 Đ7.2 |
| 3 | Trung tâm | — | Được trả lại | QC01 Đ7.3 (điều khoản minh họa riêng) |

Kiểm: cột `Bên hủy` có hai giá trị (Khách, Trung tâm); cột thời điểm chia hai khoảng liền kề quanh `CH-02`, một bên `≥`, một bên `<`. Số tổ hợp = 2 × 2 = 4. Dòng 1 phủ 1 tổ hợp, dòng 2 phủ 1, dòng 3 có ô `—` nên phủ 2 (trung tâm ≥ và < `CH-02`). Tổng 4 = 4, không tổ hợp nào hai dòng → đạt U.

### 5.2. Chính sách F

Quy tắc về loại giấy tờ phải xuất trình khi đến hẹn (minh họa; "diện hạn chế" là khái niệm bịa cho ví dụ). Cả bảng chỉ cho **một loại kết quả**: loại giấy tờ.

**Bảng quyết định BR-A08 — Giấy tờ phải xuất trình khi đến hẹn** · chính sách trúng: F

| # | Khách thuộc diện hạn chế | Khách đã từng đến hẹn | → Giấy tờ phải xuất trình | Ghi chú |
|---|---|---|---|---|
| 1 | Có | — | Giấy tờ gốc kèm giấy phép của Giám đốc trung tâm | QC01 Đ8.1 |
| 2 | Không | Chưa | Giấy tờ gốc | QC01 Đ8.2 |
| 3 | — | — | Bản sao giấy tờ | Dòng mặc định |

Kiểm: miền 2 × 2 = 4 tổ hợp. (Có, Đã) → dòng 1; (Có, Chưa) → dòng 1; (Không, Chưa) → dòng 2; (Không, Đã) → dòng 3. Dòng 1 và dòng 3 **chồng lấn** ở hai tổ hợp đầu; chính sách F cho dòng 1 thắng vì đứng trước, đó là ý định. Có dòng 3 cuối bảng bắt mọi tổ hợp còn lại nên không hở. Viết bằng U thì dòng 3 phải kê ra tận (Không, Đã) và dòng 1, 2 phải nhắc lại điều kiện — dài hơn mà không rõ hơn.

### 5.3. Khoảng số

Quy tắc xếp mức ưu tiên duyệt theo số ngày còn lại tới ngày hẹn (minh họa).

**Bảng quyết định BR-A09 — Mức ưu tiên duyệt** · chính sách trúng: U

| # | Số ngày còn lại tới ngày hẹn | → Mức ưu tiên | Ghi chú |
|---|---|---|---|
| 1 | < `CH-04` | Khẩn | ❓ Q-BR04: `CH-04` chưa có ở Quy trình mục 6 |
| 2 | ≥ `CH-04` và < `CH-05` | Thường | |
| 3 | ≥ `CH-05` | Thấp | |

Kiểm: miền là số ngày ≥ 0. Ba khoảng liền kề `[0, CH-04)`, `[CH-04, CH-05)`, `[CH-05, ∞)`; mỗi ngưỡng một cặp `<` / `≥` nên không hở, không chồng. Đòi hỏi `CH-04 < CH-05`, ghi vào "Ràng buộc giá trị" ở Quy trình mục 6 khi lớp 2 nhận `CH-04`, `CH-05`.

### 5.4. Một bảng lỗi để nhận ra

| # | Khách | Số lịch hẹn đã đặt tháng này | → Kết quả |
|---|---|---|---|
| 1 | Khách quen | ≤ 2 | Được duyệt |
| 2 | Khách quen | ≥ 2 | Cần nhân viên tiếp đón xem xét |
| 3 | Khách mới | < 2 | Được duyệt |

Chính sách U. Lỗi: dòng 1 và 2 cùng khớp khi số lần bằng 2 (chồng lấn); không dòng nào bao tổ hợp (Khách mới, ≥ 2) (thiếu); `2` là con số trần thay vì `CH-xx`. Sửa: `< CH-06` và `≥ CH-06` cho cả hai loại khách, thêm dòng cho (Khách mới, ≥ `CH-06`).
