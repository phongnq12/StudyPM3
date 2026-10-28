# Ràng buộc, giá trị dẫn xuất và dữ liệu nhạy cảm

Phần tra cứu của skill [`create-erd`](../SKILL.md). Đọc phần lõi trước. Mã và tên trong ví dụ là **mã minh họa** của [thế giới xuyên suốt](../../ba-overview/reference/vi-du-xuyen-suot.md); thực thể thêm vào cho đủ ca (như `Dot_Hen_Tap_The`, `Danh_Sach_Han_Che`) là *giả định minh họa*. Mã không có trong bảng mã chuẩn của thế giới xuyên suốt (`R-02` đến `R-05`, `nguoi_duyet_id`…) là **mã minh họa riêng của skill**.

## 1. Ràng buộc nằm ở đâu: `*`, `◐`, `R-xx`, BR, validate

Một ràng buộc có bốn chỗ đặt. Ranh giới chính thức nằm ở [`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) mục 2, hai dòng **ERD ↔ BR** và **ERD ↔ từ điển dữ liệu SRS**; bảng dưới là phép thử áp dụng, không viết lại ranh giới.

| Ràng buộc | Chỗ đặt | Ví dụ minh họa | Vì sao ở đó |
|---|---|---|---|
| Nhìn **một cột** là đủ: kiểu, độ dài, miền, bắt buộc **tuyệt đối**, duy nhất | ERD, cột `Ràng buộc`: `*`, miền, `UK trong …` | `so_nguoi` `*` · 1–3; `ma` `*` UK trong trung tâm | Mọi cửa ghi (màn hình, import, API) đều phải tuân; không đổi theo ngữ cảnh |
| Bắt buộc **có hay không có giá trị** tùy một cột khác **cùng dòng** | ERD, cột `Ràng buộc`: `◐ khi …` | `ly_do_tu_choi` `◐` khi `trang_thai` = `REJECTED` | Điều kiện đọc được từ chính dòng dữ liệu, kiểm được ở tầng lưu |
| Đúng **giữa nhiều bảng** hoặc nhiều dòng; không cột nào diễn đạt được | ERD mục 5.1 `R-xx` | `Quy_Luot.da_dung` = số `Lich_Hen` đang hiệu lực trong tuần | Cần kiểm lại sau khi nhiều bản ghi đổi; có tác vụ đối soát |
| Phụ thuộc **tác nhân, kênh, trạng thái của nghiệp vụ, thời điểm**; hoặc quan hệ **giữa các giá trị** của nhiều cột | Lớp 6, Business rule | *"Phiếu đã duyệt thì không được sửa số tiền"*; *"`ngay_hen` phải sau ngày đặt ít nhất một ngày"* | Đổi khi luật đổi; cần căn cứ, mức cưỡng chế, người chịu trách nhiệm |
| Nhãn, định dạng nhập, thứ tự trường, chuỗi lỗi, validate theo màn | `/ba-detail` | *"Hiện lỗi đỏ dưới ô số người"* | Là giải pháp |

**Ba câu hỏi theo thứ tự** để quyết một ràng buộc đi đâu:

| # | Câu hỏi | Có → | Không → |
|---|---|---|---|
| 1 | Chỉ cần nhìn **một cột** (kiểu, độ dài, khoảng, duy nhất theo phạm vi) để biết đúng sai? | Cột `Ràng buộc`: `*` hoặc miền hoặc `UK` | Hỏi tiếp |
| 2 | Đang nói **cột này có phải có giá trị hay không** tùy giá trị một cột khác **của cùng dòng**, và không cần biết ai làm, ở kênh nào? | `◐ khi …` | Hỏi tiếp |
| 3 | Là **đẳng thức hoặc quan hệ toàn vẹn qua nhiều bảng hoặc nhiều dòng**, kiểm bằng truy vấn, không phụ thuộc người làm? | `R-xx` ở mục 5.1 | Là ràng buộc ngữ cảnh: **BR**. Cột `Ràng buộc` để trống; ở Mô tả ghi *xem business rule — <tên nghiệp vụ>* kèm văn bản hoặc `GS-xx` nếu có, hoặc ❓ kèm `Q-E`. Lượt điền ngược sau lớp 6 thêm mã BR vào chỗ này |

`◐` chỉ nói về **có hay không có giá trị**, không nói về **giá trị là bao nhiêu**. Template cho `◐` điều kiện ghi ở cột Ràng buộc, còn `ranh-gioi-cac-lop.md` đẩy ràng buộc "liên thuộc tính" sang BR; hai điều không mâu thuẫn nếu `◐` giữ đúng vai trên. *"`ten_nhan_vien_duyet` bắt buộc khi đã duyệt"* là `◐`. *"`ngay_hen` không được trước `ngay_dat`"* là liên thuộc tính về giá trị — BR, không viết ở cột.

Cách phát hiện ràng buộc ngữ cảnh đã lọt vào cột `Ràng buộc`: cụm *"chỉ … mới được"*, *"khi … duyệt rồi thì khóa"*, tên một vai, tên một kênh, tên một thao tác. Gặp thì chuyển và để lại một dòng dẫn:

| Viết sai ở cột `Ràng buộc` | Viết đúng |
|---|---|
| `*` · chỉ nhân viên được sửa khi `PENDING_APPROVAL` | `*` ở cột Ràng buộc; quy tắc sửa dẫn ở Mô tả: *"quy tắc sửa — xem business rule về sửa lịch hẹn đang chờ duyệt"* (tên nghiệp vụ; lượt điền ngược thêm mã BR) hoặc ❓ kèm `Q-E` |
| `*` · ≤ 3 | `*` · 1–3 nếu 3 là giới hạn **cứng** của luật; nếu 3 là tham số đổi được thì `*` · `≤ CH-xx`, không ghi 3 trần |
| `◐` khi tác nhân là Khách | Chuyển BR; ở cột ghi `*` hoặc bỏ |

## 2. Giá trị dẫn xuất Δ và công thức

**Δ** là giá trị mà nghiệp vụ cần đọc nhưng **tính được** từ dữ liệu đã lưu, nên không có cột. Mỗi Δ ghi **ngay dưới bảng trường của thực thể mà nó mô tả**:

```text
**Giá trị dẫn xuất Δ:** so_luot_con = CH-01 − Quy_Luot.da_dung theo (khach_hang_id, tuan) — GS-xx
```

Một Δ gồm ba phần: **tên** (`snake_case`, không trùng tên cột), **công thức** (đủ để một dev viết truy vấn mà không hỏi lại: phép tính, bảng nguồn, khóa nhóm, điều kiện lọc, múi giờ), và **căn cứ** `GS-xx` hoặc `D-xx`. Công thức tham chiếu **tham số** bằng `CH-xx`, không bằng con số.

**Khi nào là Δ, khi nào là cột lưu.** Quay lại câu 1 của phép thử thực thể ([`thuc-the-va-quan-he.md`](thuc-the-va-quan-he.md) mục 2): tính được từ dữ liệu đã có mà không cần ai nhập thêm thì Δ. Chỉ lưu khi tính **không** được — dữ liệu gốc sẽ mất (chụp) hoặc đã đổi nghĩa (giá dịch vụ tại ngày đặt).

**Ngoại lệ duy nhất cho thứ tính được:** khi nghiệp vụ cần một bản ghi tổng hợp làm điểm **khóa hoặc giữ chỗ** — ví dụ `Quy_Luot.da_dung`, một dòng để khóa khi giữ lượt cho nhiều yêu cầu đến cùng lúc — thì lưu như phi chuẩn hóa có chủ đích, và phải có đủ ba thứ: lý do ghi ở đoạn mô tả bảng; `R-xx` loại Đối soát; ai cập nhật (bước quy trình hoặc tác vụ). Lý do "tính đắt" hay hiệu năng **không** đủ: đó là thiết kế vật lý. Phần suy ra từ bản ghi tổng hợp (số lượt còn lại) vẫn là Δ.

| Thứ | Là gì | Vì sao |
|---|---|---|
| `so_luot_con` | Δ | Bằng tham số trừ đã dùng; lưu thì phải sửa mỗi khi đổi `CH-01` |
| `la_qua_han` của lịch hẹn | Δ — **không** lưu cờ | Suy từ `ngay_hen` và `trang_thai`; giá trị đổi theo thời gian mà không có sự kiện nào ghi lại |
| `da_dung` của `Quy_Luot` | Lưu, **phi chuẩn hóa** | Là tổng đếm; cần một dòng để khóa khi giữ lượt; đối soát bằng `R-01` |
| `ten_nhan_vien_duyet` | Lưu, **chụp** | Nguồn ở phân hệ ngoài, đổi sau không được làm lịch hẹn cũ đổi nghĩa |

Δ ở ERD liên hệ với **máy dẫn xuất Δ** ở lớp 4: ERD ghi giá trị dẫn xuất (công thức), SM mô tả trạng thái dẫn xuất (nguyên tắc `SM-02`). Một **trạng thái** suy từ dữ liệu thì không có cột `trang_thai`; ERD nhắc tên và dẫn SM. Nếu bản ghi cha có cột trạng thái lưu nhưng giá trị được tính từ con thì xem mục 5 dưới đây.

## 3. `R-xx`: ràng buộc liên bảng và đối soát

`R-xx` là **một phát biểu kiểm được bằng truy vấn** về dữ liệu của nhiều bảng hoặc nhiều dòng, luôn phải đúng. Một `R-xx` có: mã, phát biểu, **loại**, nguồn; và phải có **ai kiểm**, theo một trong hai cách dưới đây.

| Cách kiểm | Dùng cho loại | Ai kiểm | Khi lệch | Ghi ở cột Nguồn |
|---|---|---|---|---|
| **Chặn khi ghi** | Duy nhất, Loại trừ, Tách nhiệm; Khớp trạng thái khi bản ghi không được phép tồn tại sai | Thao tác ghi — bước quy trình hoặc UC tạo, sửa bản ghi — kiểm trong cùng giao dịch | Từ chối ghi | `GS-xx · chặn khi ghi ở LH-01 bước 4` |
| **Đối soát định kỳ** | Đối soát; Khớp trạng thái khi dữ liệu có thể lệch sau khi ghi | Tác vụ nền `N-xx` | **Cảnh báo, không tự sửa** | `GS-xx · kiểm bởi N-03` |

Loại Khớp trạng thái chọn **một** trong hai cách và ghi ở cột Nguồn. Phân biệt hai cách này là lựa chọn của skill: template chỉ có câu "tác vụ `N-xx` kiểm; lệch thì cảnh báo, không tự sửa", đúng với dòng Đối soát nhưng không đúng với ràng buộc đã chặn ở lúc ghi.

Năm loại, mỗi `R-xx` đúng một loại:

| Loại | Phát biểu dạng | Ví dụ minh họa |
|---|---|---|
| **Đối soát** | Giá trị bảng A **bằng** tổng, đếm hay kết quả tính từ bảng B | `R-01` `Quy_Luot.da_dung` = số `Lich_Hen` trong tuần ở `PENDING_APPROVAL`, `APPROVED`, `COMPLETED`, cộng số `Lich_Hen` ở `CANCELLED` có `huy_muon` = đúng, theo (`khach_hang_id`, tuần) — kiểm bởi `N-03` |
| **Duy nhất** | Không có hai bản ghi cùng giá trị trên một tập cột, **qua nhiều bảng** hoặc **có điều kiện lọc** (khác `UK` thường của một bảng) | `R-02` Mỗi bộ (`than_nhan_id`, `khach_hang_id`, `ngay_hen`) có tối đa một `Lich_Hen` đang `PENDING_APPROVAL` hoặc `APPROVED` |
| **Loại trừ** | Hai thứ **không đồng thời tồn tại** | `R-03` Khách có `Danh_Sach_Han_Che` còn hiệu lực thì không có `Lich_Hen` `APPROVED` có `ngay_hen` trong thời hạn đó *(giả định minh họa)* |
| **Tách nhiệm** | Hai vai khác nhau trên cùng bản ghi — **chỉ là phép kiểm dữ liệu**; nội dung tách nhiệm ở BR, nguyên tắc chung ở SM-07 | `R-04` `Lich_Hen.nguoi_duyet_id` ≠ `Lich_Hen.nguoi_lap_id` khi `trang_thai` = `APPROVED` *(mã minh họa riêng của skill)* |
| **Khớp trạng thái** | Trạng thái bản ghi này **buộc theo** trạng thái hoặc có mặt của bản ghi kia | `R-05` `Lich_Hen` ở `APPROVED` thì có `Quy_Luot` cùng (`khach_hang_id`, tuần) với `da_dung` ≥ 1 |

Quy tắc viết:

| Việc | Cách làm |
|---|---|
| Phát biểu | Dùng tên bảng, tên trường đúng chữ mục 4; có **phạm vi so** (theo người nào, tuần nào, trung tâm nào). Không dùng "hợp lệ", "đúng" |
| Phân biệt với `UK` | Duy nhất trong **một bảng** là `UK` ở cột Ràng buộc. Chỉ khi duy nhất đi qua nhiều bảng hoặc có điều kiện lọc mới thành `R-xx` |
| Phân biệt với BR | `R-xx` là **toàn vẹn dữ liệu** (kiểm bằng truy vấn, không cần biết ngữ cảnh). Có căn cứ pháp lý riêng và nghĩa vụ nghiệp vụ thì BR phát biểu nội dung và dẫn `R-xx` như cách kiểm; `R-xx` dẫn lại mã BR ở cột Nguồn sau lượt điền ngược — dẫn hai chiều (`ranh-gioi-cac-lop.md` dòng "Đẳng thức đối soát"). `R-xx` loại Tách nhiệm không phát biểu ai được làm gì, chỉ so hai cột (dòng "Tách nhiệm" cùng bảng) |
| Ai kiểm | Cột Nguồn ghi rõ: `kiểm bởi N-xx` (đối soát định kỳ) hoặc `chặn khi ghi ở <bước>` (xem hai cách ở đầu mục). Chưa có thì `chưa chốt (BA)` kèm `Q-E` — một `R-xx` không ai kiểm chưa phải ràng buộc |
| Nguồn | `GS-xx` (nguyên tắc bảo toàn, đồng thời), `D-xx`, điểm kiểm soát mục 9 của quy trình. Không dựa vào prototype |
| Đếm | Số `R-xx` ở khối giới thiệu khớp mục 5.1; mã bỏ không dùng lại |

**Thứ tự khóa.** Khi một thao tác ghi nhiều bảng trong cùng giao dịch (đặt lịch: giữ lượt ở `Quy_Luot` rồi tạo `Lich_Hen`), mọi thao tác phải **khóa theo cùng một thứ tự** để hai thao tác song song không chờ nhau thành vòng. Viết thành một đoạn: *"Khóa `Khach_Hang` → `Quy_Luot` → `Lich_Hen`; trong mỗi bảng khóa theo `id` tăng dần."* Thứ tự đi theo hướng từ bảng "gốc" (ít bị ghi) đến bảng "lá" (nhiều bị ghi). Nguồn thứ tự là `GS-xx` về đồng thời của quy trình; chưa có thì `Q-E`. Không có thao tác nào khóa nhiều bảng thì dòng `Thứ tự khóa` ghi *Không có thao tác khóa nhiều bảng*.

## 4. Khóa ngoại đa hình

Là một cặp cột (loại, id) trong đó **giá trị cột loại quyết định bảng nào mà cột id trỏ tới**. Nhật ký, tệp đính kèm, ghi chú hay dùng. Vì một cột id không thể là khóa ngoại cơ sở dữ liệu tới nhiều bảng, đây là tham chiếu logic.

| Yêu cầu | Cách làm |
|---|---|
| Cột loại | Một `enum` (hoặc `varchar` có danh sách), mọi giá trị nằm ở danh mục enum mục 4.n |
| Chỉ mục | (`loai`, `id`) — nói ở quy ước chung mục 1, không lặp lại ở từng bảng |
| Ánh xạ | **Mỗi** giá trị loại có một dòng ở mục 5.2: bảng chứng từ, và bảng dòng chứng từ khi có |
| Toàn vẹn | Vì không có khóa ngoại thật, ứng dụng kiểm khi ghi. Cần kiểm lại định kỳ thì thêm một `R-xx` loại Đối soát hoặc Duy nhất |
| Khi nên **không** dùng | Đích chỉ là **một** bảng — dùng khóa ngoại thường. Đích là vài bảng và mỗi quan hệ có thuộc tính riêng — dùng các bảng nối riêng |

Ví dụ (minh họa) cho `Nhat_Ky_Thay_Doi`:

| `loai_chung_tu` | `chung_tu_id` → | `chung_tu_chi_tiet_id` → |
|---|---|---|
| `LICH_HEN` | `Lich_Hen` | `Lich_Hen_Dich_Vu` |
| `DANH_SACH_HAN_CHE` | `Danh_Sach_Han_Che` | `n/a` |

## 5. Trạng thái suy từ bảng con

Dùng khi trạng thái bản ghi cha **được tính** từ trạng thái các dòng con — đợt hẹn tập thể gồm nhiều lịch hẹn, phiếu kiểm gồm nhiều dòng kiểm. Hai cách hiện diện:

| Cách | Ở ERD | Ở SM (mục 1.3 của template SM) |
|---|---|---|
| **Δ thuần** — không lưu cột | Không có cột; ghi ở dòng Δ: công thức hoặc dẫn mục 5.3 | Loại `Δ` |
| **Lưu, suy từ bảng con** — có cột `trang_thai` nhưng giá trị do hệ thống tính lại khi dòng con đổi | Có cột `enum`; mô tả kết thúc bằng *"suy từ bảng con — mục 5.3"* | Loại `Lưu, suy từ bảng con` |

Bảng ở mục 5.3 viết **theo thứ tự xét từ trên xuống, dòng đầu đúng thì dừng**; điều kiện **phủ đủ mọi trường hợp**, kể cả cha chưa có dòng con. Ví dụ (giả định minh họa) cho `Dot_Hen_Tap_The`, đợt hẹn tập thể gồm nhiều `Lich_Hen`:

| Trạng thái bảng cha | Điều kiện |
|---|---|
| `EMPTY` Chưa có lịch | Không có `Lich_Hen` nào thuộc đợt |
| `DONE` Hoàn tất | Mọi `Lich_Hen` ở `APPROVED`, `COMPLETED`, `REJECTED` hoặc `CANCELLED` |
| `IN_PROGRESS` Đang xử lý | Còn ít nhất một `Lich_Hen` ở `DRAFT` hoặc `PENDING_APPROVAL` |

Kiểm: ba điều kiện loại trừ nhau theo thứ tự xét và phủ hết; thay đổi trạng thái con phải kích hoạt tính lại (đó là tác vụ hoặc bước quy trình, dẫn mã). Điều kiện chồng nhau mà không nói thứ tự là lỗi.

## 6. Dữ liệu nhạy cảm

Mục Dữ liệu nhạy cảm (mục 9 của template) là nơi ERD **phân loại** dữ liệu; quy định bảo vệ do tổ chức và pháp luật đặt, ERD chỉ áp. Dữ liệu nhạy cảm của ERD giao cho BRD mục 9 ([`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) mục 3).

**Cách làm — theo thứ tự.**

| # | Việc | Ghi chú |
|---|---|---|
| 0 | **Xác nhận văn bản pháp luật còn hiệu lực** trước khi dẫn | Kiểm tại ngày viết. Luật Bảo vệ dữ liệu cá nhân 2025 (hiệu lực 01/01/2026) có hiệu lực pháp lý cao hơn NĐ 13/2023/NĐ-CP. Đầu vào có định nghĩa dữ liệu cá nhân nhạy cảm của Luật thì **ưu tiên định nghĩa của Luật**. **Không tự khẳng định** NĐ 13 đã bị thay thế hay còn hiệu lực từng điều — đầu vào chưa nói thì ghi ❓ `[CẦN BA CHỐT]` kèm `Q-E` |
| 1 | **Quét mọi cột** của mọi thực thể, không chỉ cột "có vẻ" nhạy cảm | Kể cả cột **chụp** (`so_cccd_chup` trong chứng từ), tệp đính kèm, văn bản tự do (`ghi_chu`) |
| 2 | Phân loại: `Cá nhân cơ bản` · `Cá nhân nhạy cảm` · `Tài chính` · `Nội bộ` | Một cột có hai loại thì ghi cả hai cách nhau `·`. Nền: định nghĩa **cá nhân nhạy cảm** theo văn bản đã qua bước 0 (template dẫn NĐ 13/2023/NĐ-CP Điều 2 khoản 4 và Luật Bảo vệ dữ liệu cá nhân 2025 — xem T19 ở `dien-tung-muc.md`); dữ liệu sức khỏe, thông tin cần hỗ trợ đặc biệt của khách trong ví dụ thuộc hướng này. Khi hai văn bản phân loại khác nhau và đầu vào không chọn, **không tự chọn** — ghi ❓ `[CẦN BA CHỐT]` kèm `Q-E`. Chỉ dùng điều khoản mà đầu vào `/ba-init` hoặc dự án đã xác nhận |
| 3 | Gán **mức** `Cao` · `TB` · `Thấp` | Theo thang phân loại thông tin của dự án (ISO/IEC 27001:2022 A 5.12). Dự án chưa có thang thì `chưa chốt (<ai>)`, không bịa |
| 4 | Ghi **ai được xem** | Đúng tên tác nhân ở quy trình mục 2; đối chiếu với chủ sở hữu dữ liệu ở mục 2 của ERD |
| 5 | Chọn **xử lý**: che khi hiển thị · mã hóa khi lưu · không lưu | Hỏi trước hết *"có phải lưu không?"*. Cần để kiểm tra một lần thì **không lưu**, hoặc lưu bản rút gọn (4 số cuối) |
| 6 | Ghi **thời hạn lưu trữ** | Theo văn bản lưu trữ của dự án hoặc điều khoản; không bịa số năm |

Dòng mẫu (minh họa — mức và loại là giả định của ví dụ, không phải hướng dẫn pháp lý):

| Dữ liệu | Bảng · trường | Loại | Mức | Ai được xem | Xử lý — che, mã hóa, không lưu |
|---|---|---|---|---|---|
| Số căn cước của khách | `Khach_Hang.so_cccd` · `Lich_Hen.so_cccd_chup` | Cá nhân cơ bản | TB | Nhân viên tiếp đón | Che 6 số giữa khi hiển thị; bản chụp ở `Lich_Hen` chỉ giữ 4 số cuối |
| Thông tin sức khỏe cần hỗ trợ khi đến hẹn | `Khach_Hang.ghi_chu_ho_tro` *(giả định minh họa)* | Cá nhân nhạy cảm | Cao | Giám đốc trung tâm; Nhân viên tiếp đón phụ trách | Mã hóa khi lưu; không chụp sang `Lich_Hen`; không hiện ở màn khách |
| Số lượt đã dùng | `Quy_Luot.da_dung` | Nội bộ | Thấp | Nhân viên tiếp đón | Không xử lý thêm |

Lỗi hay gặp: bỏ sót **nơi nhân bản** của cùng một dữ liệu (cột chụp, nhật ký lưu giá trị trước và sau — `Nhat_Ky_Thay_Doi` ghi giá trị cũ của `so_cccd` cũng là lưu so_cccd, xem đoạn dưới); phân loại cột nhưng không ghi xử lý; ghi "người có quyền" thay cho tên tác nhân; để thời hạn lưu trữ ở dạng `{{ }}`.

**Nhật ký lưu giá trị cũ.** Nhật ký chỉ thêm, không sửa — nên nếu nó ghi giá trị trước và sau của trường cá nhân thì đó là nơi nhân bản dữ liệu mà không ai sửa hay xóa được. Chọn **một** cách và ghi thành dòng riêng cho nhật ký ở mục Dữ liệu nhạy cảm: (a) nhật ký chỉ ghi *tên trường đã đổi*, không ghi giá trị; (b) ghi giá trị đã che (ví dụ 4 số cuối); (c) ghi nguyên giá trị nhưng nhật ký có **thời hạn lưu riêng** và được hủy khi hết hạn. Chưa chọn được thì ghi `Q-E`; không để câu "không sửa, không xóa" che mất vấn đề này. Cách chọn là lựa chọn của skill.
