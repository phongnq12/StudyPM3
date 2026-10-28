# Ghi để lớp sau nhận được

Phần tra cứu của skill [`create-bp`](../SKILL.md). Đọc phần lõi trước. Lớp 2 là lớp **đầu tiên giao việc** cho bốn lớp sau: ERD, máy trạng thái, tác nhân và use case, business rule. Người làm lớp 3 hay lớp 6 **không phải mở lại** văn bản pháp luật hay khảo sát để hiểu một dòng của quy trình — nên mỗi thứ sau đây phải ghi sao cho bên nhận lấy được ngay. Mã, tên, con số trong ví dụ là **mã minh họa** của [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md); mã không có trong bảng mã chuẩn của file đó là **mã minh họa riêng của skill**. Dòng "Đầu vào, đầu ra của từng lớp" ở [`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) mục 3 là bảng gốc; file này nói **cách ghi** để bảng đó thành hiện thực.

## 1. Bảng bàn giao tổng

| Thứ ở lớp 2 | Giao cho | Bên nhận lấy gì | Điều kiện để nhận được |
|---|---|---|---|
| Thuật ngữ mục 1.1 | Lớp 3 | Ứng viên thực thể, thuộc tính, enum | Mỗi thuật ngữ một nghĩa; ví dụ số khi dễ nhầm; cột Thực thể ERD: `chờ lớp 3` cho thuật ngữ sẽ có bảng, để trống cho khái niệm tính toán |
| Bảng dữ liệu trục, loại biến động, nguyên tắc bảo toàn (mục 3) | Lớp 3 | Thực thể sổ; `R-xx` đẳng thức | Nguyên tắc bảo toàn viết thành đẳng thức có tham số |
| Chứng từ (mục 8) | Lớp 3 | Thực thể loại Chứng từ; trường bắt buộc | Mỗi chứng từ đúng một dòng ở 8.1, 8.2 hoặc 8.3; mục 8.1, 8.2 có mẫu số hoặc nội dung bắt buộc |
| Tham số `CH-xx` (mục 6) | Lớp 3, lớp 6 | Nơi lưu và miền giá trị (lớp 3); quy tắc ⚙️ (lớp 6) | Cột Nơi lưu, Ràng buộc giá trị đủ |
| Bước, tác nhân, trạng thái đích (Phần A) | Lớp 4 | Sự kiện gây chuyển trạng thái, ai kích hoạt | Mỗi bước đổi trạng thái nêu **tên tiếng Việt** của trạng thái đích |
| Tác vụ nền `N-xx`, sự kiện ngoài 5.1 | Lớp 4, lớp 5 | Chuyển ⚙️ và 🔗 (lớp 4); UC tác nhân hệ thống (lớp 5) | Đủ cột; điều kiện tự đóng; khóa chống lặp |
| Tác nhân mục 2, bước người làm | Lớp 5 | Tên tác nhân; UC trong bước "người làm trên hệ thống" | Tên giữ **nguyên chữ**; bước 🟡 đánh dấu rõ |
| `GS-xx`, điểm kiểm soát (mục 9), `D-xx` bất biến, căn cứ ở bước | Lớp 6 | Ứng viên business rule | Câu độc lập khỏi trình tự; căn cứ có điều khoản |

## 2. Cho lớp 3 — ERD

| Thứ | Ghi thế nào | Ví dụ minh họa | Đừng |
|---|---|---|---|
| **Thuật ngữ mục 1.1** | Một khái niệm một dòng; ghi *loại*: đối tượng quản lý (có vòng đời), danh mục (ít đổi), chứng từ, số liệu tính toán. Cột Thực thể ERD: thuật ngữ sẽ có bảng ghi `chờ lớp 3` — lớp 3 điền; khái niệm tính toán **để trống** (theo comment của template) | *Lượt đã dùng* — `chờ lớp 3` (lớp 3 điền `Quy_Luot`) · *Lượt còn lại* — để trống vì là số tính (`CH-01` − lượt đã dùng) · *Lịch hẹn* — `chờ lớp 3` | Tự đặt tên bảng; để trống ô của thuật ngữ mà ERD sẽ có bảng |
| **Dữ liệu trục** (chỉ khi domain có sổ) | Bảng, câu hỏi nghiệp vụ nó trả lời, quy trình ghi. Nguyên tắc bảo toàn ghi thành **đẳng thức** | *Lượt còn lại = `CH-01` − lượt đã dùng; lượt đã dùng = số lịch trong tuần ở Chờ duyệt, Đã duyệt, Đã đến hẹn, cộng số lịch Đã hủy muộn* — lớp 3 lấy làm `R-xx` | Mô tả cột, kiểu dữ liệu |
| **Chứng từ mục 8** | Chứng từ có mẫu: mẫu số, văn bản, điều khoản. Chứng từ không mẫu: **nội dung bắt buộc** liệt kê đủ | *Quyết định duyệt lịch hẹn — khách, số người, ngày hẹn, người duyệt, ngày duyệt* | Tên trường kỹ thuật; thiếu nội dung bắt buộc nên lớp 3 phải đi tìm lại văn bản |
| **Tham số mục 6** | **Nơi lưu**, **Phạm vi áp**, **Ràng buộc giá trị**, và nhắc "chụp vào chứng từ lúc tạo" | *`CH-02` giờ nguyên 0 đến 168 — chụp vào lịch hẹn lúc tạo* | Bỏ ràng buộc giá trị; lớp 3 sẽ không biết miền |
| **Hạn, ngưỡng, số liệu của tác vụ nền** | Nguồn dữ liệu `N-xx` nêu tên nghiệp vụ của thực thể quét | *Lịch hẹn ở Đã duyệt có ngày hẹn = ngày mai* | Tên bảng chưa có trong ERD |

**Dấu hiệu bên nhận sẽ vướng:** một danh từ xuất hiện ở bảng bước nhưng không có ở 1.1, hoặc có ở 1.1 nhưng không bước nào dùng. Cả hai là lỗi của lớp 2 (cổng ra: thuật ngữ đủ cho mọi danh từ nghiệp vụ).

## 3. Cho lớp 4 — máy trạng thái

Lớp 2 không vẽ trạng thái, nhưng **bước là sự kiện** gây chuyển. Muốn lớp 4 đọc được, mỗi bước **làm đổi trạng thái** của một đối tượng cần ghi ba điều trong cột Hành động hoặc Căn cứ: **ai kích hoạt** (cột Tác nhân), **đối tượng** và **trạng thái đích bằng tên tiếng Việt**. Mã trạng thái là việc của ERD.

| Thứ | Ghi thế nào | Ví dụ minh họa |
|---|---|---|
| Bước người làm đổi trạng thái | Chuyển 👤 ở lớp 4; hành động nêu trạng thái đích | *"Nhân viên tiếp đón **duyệt** yêu cầu — lịch chuyển sang Đã duyệt"* — lớp 4 dẫn `LH-01 bước 4` ở cột Ai — sự kiện |
| Bước hệ thống chạy **cùng request** với bước người ngay trước | Chuyển vẫn là 👤 của tác nhân bước người; chú dưới bảng bước nói rõ "bước 2–3 chạy cùng request với bước 1" | *"Giữ một lượt, chuyển yêu cầu sang Chờ duyệt"* (`LH-01` bước 3) — lớp 4 ghi 👤 Khách, dẫn dải `LH-01 bước 1–3` |
| Bước hệ thống **tự chạy**, không người nào đang thao tác | Chuyển ⚙️; hành động nêu trạng thái đích | Thường là tác vụ nền `N-xx` (dòng kế tiếp); sự kiện từ hệ thống ngoài là 🔗 (dòng sau nữa) |
| Tác vụ nền đổi trạng thái | `N-xx`, cột Kết quả ghi trạng thái đích | *"`N-02` chuyển lịch Đã duyệt sang Đã đến hẹn khi đã qua ngày hẹn"* |
| Sự kiện từ hệ thống ngoài (5.1) | Lớp 4 đánh 🔗; cột Tác động ghi trạng thái đích | *"chuyển trung tâm → lịch sang Đã hủy"* |
| Điều kiện để chuyển | Ở bước kiểm trước đó, ghi căn cứ ngay cột Căn cứ; lớp 4 dẫn bước đó | `LH-01 bước 2` `QC01 Đ5.1 · CH-01` |
| Khóa suy ra từ dữ liệu (mục 3) | Ghi rõ "suy ra, không lưu cờ" | *Khóa lịch đã qua ngày hẹn* — lớp 4 coi là trạng thái suy Δ nếu đúng |

Quy trình **không** liệt kê toàn bộ vòng đời; vòng đời một thực thể là việc của lớp 4. Thấy mình viết "Nháp → Chờ duyệt → Đã duyệt" như một chuỗi trạng thái thì đó là sai lớp — chỉ ghi chuyển do **bước này** gây.

## 4. Cho lớp 5 — tác nhân và use case

| Thứ | Ghi thế nào | Bên nhận làm gì |
|---|---|---|
| **Tác nhân mục 2** | Tên vai trò **nguyên chữ** văn bản; vai trò gồm các thao tác; căn cứ phân công | Lớp 5 cấp `ACT-nn`, phân loại theo QĐ 671; **không đổi chữ** |
| **Bước người làm trên hệ thống** | Tác nhân là người, không có 🟡 | Mỗi bước (hoặc nhóm bước liền nhau cùng người, cùng lần ngồi) thành một hoặc nhiều dòng UC theo hạt của `create-uc` |
| **Bước 🟡** | Đánh dấu bằng 🟡 và nêu nơi BRD loại ra | Lớp 5 **không** sinh UC; lớp 6 giữ nghĩa vụ |
| **Tác vụ nền `N-xx`** | Đủ lịch chạy, nguồn, người nhận, khóa chống lặp, tự đóng | Mỗi `N-xx` thành một UC tác nhân hệ thống |
| **Sự kiện ngoài 5.1** | Hệ thống gửi, sự kiện, tác động | UC tác nhân hệ thống ngoài; cần cơ chế xác thực máy–máy |
| **Tách nhiệm** | Mỗi cặp việc không do cùng một người, ghi ở mục 2 và mục 9 loại Tách nhiệm | Lớp 5 mô tả quan hệ giữa các tác nhân; UC kiểm khi thực thi |
| **Thao tác workflow** | Câu "mỗi thao tác workflow là một quyền riêng" liệt kê đủ gửi duyệt, duyệt, từ chối, trả về, hủy | Mỗi thao tác một UC và một `Permission key` |

Lớp 2 **không** gán permission key, không đặt mã UC, không chép luồng UC. Mục 10 ở lớp 2 là chỗ lớp 5 ghi ngược lại các bước người làm mà vẫn chưa có UC.

## 5. Cho lớp 6 — business rule

Lớp 6 gom **ứng viên** từ năm lớp trước; ở lớp 2 có ba loại ứng viên và hai loại tham số. Viết sao cho lớp 6 tách được từng câu, biết rõ chủ thể, nghĩa vụ, căn cứ.

| Ứng viên | Ghi ở đâu | Cách ghi | Ví dụ minh họa |
|---|---|---|---|
| **`GS-xx`** | Mục 3.1 | Một hoặc hai câu khẳng định; có **công thức hoặc ví dụ số**; nêu quy trình áp. Chủ ngữ là *việc tính*, không phải bước. Đúng khi **bỏ trình tự câu vẫn đúng** | **GS-01 Tuần tính từ thứ Hai, giờ Việt Nam** — tuần tính từ 00:00 thứ Hai tới 23:59 Chủ nhật theo giờ Việt Nam; lịch tính vào tuần của ngày hẹn. Áp cho LH-01, LH-02 |
| **Điểm kiểm soát** | Dòng cuối mỗi quy trình và mục 9 | Chủ ngữ + **phải / không được / chỉ khi** + điều kiện, kèm bước áp. Loại kiểm soát cho lớp 6 biết 🔒 hay ⚙️ có khả năng: Ngăn chặn, Phê duyệt, Tách nhiệm thường là hành vi bắt buộc | *"Hệ thống không cho gửi yêu cầu khi khách đã dùng đủ `CH-01` lượt (B2)."* — Ngăn chặn |
| **`D-xx` bất biến** | Mục 4 | Chỉ `D-xx` nào phát biểu điều **đúng bất kể bước** mới là ứng viên: ghi trong ô Quyết định bằng câu khẳng định có phạm vi áp. `D-xx` nói cách tổ chức quy trình thì ở lại lớp 2. Điều đã có điều khoản (như `QC01 Đ6.3`) thì dẫn điều khoản, không lập `D-xx` | `D-06` (mã minh họa riêng của skill): *"Lịch đã qua ngày hẹn không được duyệt, sửa hay hủy"* — bất biến, đúng ở mọi bước |
| **`CH-xx`** | Mục 6 | Cột Quy trình dẫn phải **khớp** chỗ dùng thật. Mỗi `CH-xx` cho lớp 6 biết một quy tắc ⚙️ phải tồn tại | `CH-01` → lớp 6 `BR-A01` |
| **Căn cứ ở bước** | Cột Căn cứ bảng bước | Điều khoản đủ số hiệu, điều, khoản; con số kèm biên; **trích nguyên văn** khi nguồn không phải văn bản pháp luật | `QC01 Đ5.1`; hoặc *`Khảo sát_TrungTamA.xlsx` sheet "Lịch hẹn" dòng 12: "mỗi tuần chỉ hai lịch"* |

Điều **không** ghi: không gán mã `BR-` (lớp 6 cấp); không viết một câu quy tắc đứng riêng trong thân quy trình mà không có nơi neo (GS, điểm kiểm soát, căn cứ ở bước). Quy tắc chỉ có nghĩa trong trình tự (*"sau khi duyệt thì báo khách"*) **ở lại lớp 2** là bước, không chuyển thành ứng viên.

Ba điều giúp lớp 6 không làm sai:

| Điều | Vì sao |
|---|---|
| **Số thứ tự `#` ở mục 9 không đổi** sau khi phát hành | Lớp 6 dẫn *"`QT_DA1_LichHen mục 9 điểm 2`"*; đổi số là gãy dẫn chiếu |
| Mã `GS-xx`, `CH-xx`, `D-xx` không dùng lại | Lớp 6 và các lớp khác đã dẫn |
| Con số cứng luật định ghi kèm biên và điều khoản **trong ô**, không chuyển thành `CH-xx` | Lớp 6 phân biệt 🔒 với ⚙️ qua chính việc này |

## 6. Việc của lớp 2 trong lượt điền ngược

Lớp 6 chạy sau cùng, rồi **lượt điền ngược** quay lại sửa lớp 1, 2, 4, 5 ([`ba-overview/SKILL.md`](../../ba-overview/SKILL.md) mục "Thứ tự chạy"; thủ tục chi tiết ở skill `create-br`). Phía lớp 2 có **ba việc do lớp 6 chạy** (dòng 1–3) và **hai chỗ do lớp 3 và lớp 5 điền** khi chạy lớp của họ (dòng 4–5):

| # | Ai chạy | Chỗ ở lớp 2 | Làm gì | Không làm |
|---|---|---|---|---|
| 1 | Lớp 6 | **Mọi ô `Căn cứ`**: dòng Căn cứ của bảng thông tin quy trình, cột Căn cứ của bảng bước, căn cứ ở cuối mỗi dòng trường hợp biên, cột Căn cứ của mục 9; và dòng Business rule ở bảng Nguồn mục 1 | Chỗ nào đang dẫn điều khoản mà nay đã có BR thì thêm mã BR kèm tên ngắn **đứng trước**: `QC01 Đ5.1 · CH-01` → `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1 · CH-01`. Dòng Business rule ở bảng Nguồn: thay `chưa có (lớp 6 chạy sau)` bằng đường dẫn thật | Xóa điều khoản; sửa nội dung bước; thêm mã BR chưa chốt (mức ❓) |
| 2 | Lớp 6 | Mục 3.1 `GS-xx`, mục 6 `CH-xx` | Giữ nguyên — hai mục này vẫn là **nguồn** của chính chúng; BR dẫn `GS-xx` | Thay nội dung `GS-xx` bằng mã BR |
| 3 | Lớp 6 | Version control | Ghi lượt điền ngược: đây là sửa không đổi nghĩa — ở mọi trạng thái thêm một gạch đầu dòng vào dòng phiên bản hiện tại, không tăng `vNN`, không đổi trạng thái (`00_quy_uoc_chung.md` mục 3.3). Ví dụ: *"Điền ngược từ BR_<mã>_v00: thêm mã BR vào cột Căn cứ (12 chỗ)."* | Ghi `BA chốt dd/mm/yyyy` hộ BA |
| 4 | Lớp 3 | Đường dẫn ERD ở khối giới thiệu và cột **Thực thể ERD** ở mục 1.1 | Thay `chờ lớp 3` bằng đường dẫn và tên bảng ứng với từng thuật ngữ (`ranh-gioi-cac-lop.md`); khái niệm tính toán giữ ô trống | Điền ở lớp 2 |
| 5 | Lớp 5 | **Mục 10** | Thay `chờ lớp 5` bằng các bước người làm chưa có UC (`LH-01 bước 4 …`), khi chạy kiểm tra quy tắc 100% trước lớp 6 | Điền ở lớp 2 |

Người chạy lớp 2 cần làm gì khi lượt điền ngược đến? **Chỉ nhận** — kiểm hai chiều: mỗi mã BR thêm vào có đúng tên ngắn như ở file BR; mỗi `GS-xx` mà BR dẫn có thật và còn đúng nội dung. Thấy BR nói **khác** bước hay `GS-xx` thì dừng, ghi `Q-P…` ở mục 11.3 với cả hai phát biểu; **không tự sửa bên nào**.

Hai điều lớp 2 phải làm **từ đầu** để lượt điền ngược trơn tru:

| Việc | Vì sao |
|---|---|
| Mỗi ô Căn cứ ghi **điều khoản đủ số hiệu** hoặc `GS-xx` / `D-xx` / `CH-xx` / `GD-xxxx` — không ghi "theo quy định" | Lớp 6 tìm ứng viên bằng ô này; ô mờ thì ứng viên mất |
| Không bịa mã `BR-…` trước khi lớp 6 cấp (`ba-overview`, mục "Thứ tự chạy", bước 1) | Mã bịa trùng mã thật sẽ dẫn sai nghĩa |
