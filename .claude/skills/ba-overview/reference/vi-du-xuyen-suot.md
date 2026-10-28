# Ví dụ xuyên suốt sáu lớp

Phần tra cứu của skill [`ba-overview`](../SKILL.md). **Toàn bộ là minh họa** — dự án, mã, tên, con số,
điều khoản đều bịa để giải thích, không phải của dự án thật nào. Sáu skill lớp dùng chung ví dụ này để bảng
"có phải X không" của các lớp nói về cùng một thế giới, và lớp 5 nối thẳng sang ví dụ "Đặt lịch hẹn" của
[`create-uc`](../../create-uc/SKILL.md).

**Bảng mã chuẩn ở mục 3 là nguồn duy nhất** cho mọi mã minh họa. Skill lớp cần một mã chưa có trong bảng
thì thêm mã mới với số tiếp theo, ghi "mã minh họa riêng của skill", và **không** dùng lại một mã của
bảng với nghĩa khác. Tên ngắn đi kèm mã chép **đúng chuỗi** ở bảng.

## 1. Bối cảnh

Dự án minh họa `DA1`: một trung tâm dịch vụ khách hàng cho khách đặt lịch hẹn trực tuyến theo khung giờ.
"Quy chế đặt lịch" giả định `QC01` quy định: mỗi khách được đặt tối đa 2 lịch hẹn mỗi tuần (Đ5.1), mỗi
lịch hẹn tối đa 3 người kể cả khách (Đ5.2); lịch phải được nhân viên duyệt trước ngày hẹn (Đ6.1); nhân
viên không được duyệt lịch do chính mình đặt hộ khách (Đ6.3); khách hủy lịch trước giờ hẹn ít nhất 24
giờ thì lượt được trả lại, trung tâm được quy định thời hạn dài hơn (Đ7.2).

**Hai nghĩa của chữ "khách".** Trong ví dụ, `Khách` (`ACT-01`) là **tác nhân** — người đặt lịch hẹn. Ở
phần còn lại của bộ skill, "khách" hay "khách hàng" nghĩa là **khách hàng của dự án** — bên đặt làm phần
mềm, người chốt yêu cầu và giả định. Đọc theo ngữ cảnh; khi cần rõ thì viết `ACT-01 Khách`.

## 2. Một mạch qua sáu lớp

| Lớp | Mảnh của ví dụ |
|---|---|
| 1 BRD | `P-01` Khách phải gọi điện hoặc tới quầy để đặt lịch, chờ trung bình 20 phút · `OBJ-01` Tỷ lệ lịch hẹn đặt trực tuyến tăng từ 0% lên 90% sau 3 tháng vận hành · `BRQ-01` Trung tâm phải xét duyệt hoặc từ chối mọi yêu cầu đặt lịch trước ngày hẹn — `QC01 Đ6.1` · `SH-01` Giám đốc trung tâm (duyệt ngân sách, không thao tác hệ thống) · `SH-02` Nhân viên tiếp đón · `SH-03` Khách |
| 2 Quy trình | `LH-01 Đặt và duyệt lịch hẹn` — bước 1 Khách gửi yêu cầu đặt lịch · bước 2 Hệ thống kiểm còn lượt trong tuần của ngày hẹn · bước 3 Hệ thống giữ một lượt, chuyển yêu cầu sang chờ duyệt · bước 4 **Nhân viên tiếp đón duyệt hoặc từ chối** · bước 5 Hệ thống báo khách · 🟡 bước 6 Nhân viên quầy đối chiếu giấy tờ khi khách tới. Bước 2–3 chạy cùng request với bước 1; khoảng chờ nằm giữa bước 3 và bước 4. `LH-02 Hủy lịch hẹn` — khách hủy lịch chờ duyệt hoặc đã duyệt; hệ thống trả lượt nếu hủy đủ sớm. Tác nhân mục 2 giữ đúng tên vai ở BRD mục 4 |
| 3 ERD | `Lich_Hen` (Chứng từ) — `ma` UK, `khach_hang_id` FK, `ngay_hen` `*`, `so_nguoi` `*` 1–3 (`QC01 Đ5.2`), `nguoi_lap_id` `*`, `huy_muon` `◐` khi `trang_thai` = `CANCELLED`, `trang_thai` enum → SM mục 2 · `Quy_Luot` (Sổ ghi thêm) — một dòng là lượt **đã dùng** của một khách trong một tuần; số lượt còn lại là Δ = `CH-01` − `da_dung` · `R-01` `Quy_Luot.da_dung` = số `Lich_Hen` trong tuần ở `PENDING_APPROVAL`, `APPROVED`, `COMPLETED`, cộng số `Lich_Hen` ở `CANCELLED` có `huy_muon` = đúng — Đối soát, kiểm bởi `N-03` |
| 4 Máy trạng thái | SM mục 2 — Lịch hẹn `Lich_Hen`: `DRAFT` Nháp → `PENDING_APPROVAL` Chờ duyệt → `APPROVED` Đã duyệt → `COMPLETED` Đã đến hẹn ■; từ Chờ duyệt → `REJECTED` Từ chối ■; từ Chờ duyệt hoặc Đã duyệt → `CANCELLED` Đã hủy ■. Bảng chuyển ở mục 4 dưới đây |
| 5 Tác nhân, UC | `ACT-01 Khách` (Người · Chính, Phức tạp) · `ACT-02 Nhân viên tiếp đón` (Người · Chính, Phức tạp) · `ACT-03 Hệ thống — tác vụ nền` (Thời gian). Bảy UC web và hai UC chạy nền ở mục 3 |
| 6 Business rule | `BR-A01` Mỗi khách **chỉ được** đặt tối đa `CH-01` lịch hẹn mỗi tuần, tuần tính từ thứ Hai — HV · ⚙️ · áp tại `LH-01 bước 2` · `BR-A02` Lượt đã dùng **là** lịch hẹn ở Chờ duyệt, Đã duyệt, Đã đến hẹn, hoặc Đã hủy muộn — ĐN · 🔒 · `BR-A03` Khách hủy lịch trước giờ hẹn ít nhất `CH-02` giờ **thì** lượt được trả lại — ĐN (quy tắc suy ra: hệ thống tính, không ai "vi phạm" được) · ⚙️ · áp tại `LH-02` · `BR-A04` Nhân viên **không được** duyệt lịch hẹn do chính mình đặt hộ khách — HV · 🔒 · áp tại `LH-01 bước 4` |

## 3. Bảng mã chuẩn

| Loại | Mã | Tên ngắn — chép đúng chuỗi này | Ghi chú |
|---|---|---|---|
| Dự án minh họa | `DA1` | Trung tâm dịch vụ khách hàng | Dùng trong mã UC và tên file: `QT_DA1_LichHen_v00.md` |
| Điều khoản | `QC01 Đ5.1` | Tối đa 2 lịch hẹn mỗi tuần | |
| | `QC01 Đ5.2` | Tối đa 3 người mỗi lịch | Ràng buộc nội tại → ERD `so_nguoi` |
| | `QC01 Đ6.1` | Duyệt trước ngày hẹn | |
| | `QC01 Đ6.3` | Người đặt hộ không tự duyệt | Tách nhiệm |
| | `QC01 Đ7.2` | Hủy sớm được trả lượt | Sàn 24 giờ |
| Quy trình | `LH-01` | Đặt và duyệt lịch hẹn | Mã domain `LH` |
| | `LH-02` | Hủy lịch hẹn | |
| Quyết định | `D-01` | Chỉ nhận đặt lịch trực tuyến | Ví dụ một quyết định nghiệp vụ |
| Quy tắc dùng chung | `GS-01` | Tuần tính từ thứ Hai, giờ Việt Nam | |
| Tham số | `CH-01` | Số lịch hẹn mỗi tuần | Mặc định 2, không vượt `QC01 Đ5.1` |
| | `CH-02` | Thời hạn hủy được trả lượt | Mặc định 24 giờ, không ngắn hơn 24 giờ |
| | `CH-03` | Giờ chạy nhắc lịch | Mặc định 07:00 |
| Tác vụ nền | `N-01` | Nhắc lịch hôm trước | Theo `CH-03` |
| | `N-02` | Chốt lịch đã qua ngày hẹn | ⚙️ `APPROVED → COMPLETED` |
| | `N-03` | Đối soát quỹ lượt | Kiểm `R-01`, lệch thì cảnh báo |
| Điểm kiểm soát | `QT_DA1_LichHen mục 9 điểm 1` | Kiểm còn lượt trước khi giữ | Dạng dẫn theo `00_quy_uoc_chung.md` mục 9 |
| | `QT_DA1_LichHen mục 9 điểm 2` | Người đặt hộ không tự duyệt | |
| Ràng buộc liên bảng | `R-01` | Quỹ lượt khớp lịch hẹn | Đối soát |
| Máy trạng thái | `SM mục 2 — Lịch hẹn` | | |
| Tác nhân | `ACT-01` · `ACT-02` · `ACT-03` | Khách · Nhân viên tiếp đón · Hệ thống — tác vụ nền | |
| Use case | `DA1.WEB.03.01.01` | Lưu nháp lịch hẹn | Khách · `lich_hen.create` · `→ DRAFT` |
| | `DA1.WEB.03.01.02` | Sửa lịch hẹn nháp | Khách · `lich_hen.update` |
| | `DA1.WEB.03.01.03` | Gửi yêu cầu đặt lịch | Khách · `lich_hen.submit` · `LH-01 bước 1–3` |
| | `DA1.WEB.03.01.04` | Duyệt lịch hẹn | Nhân viên tiếp đón · `lich_hen.approve` · `LH-01 bước 4` |
| | `DA1.WEB.03.01.05` | Từ chối lịch hẹn | Nhân viên tiếp đón · `lich_hen.reject` · `LH-01 bước 4` |
| | `DA1.WEB.03.01.06` | Hủy lịch hẹn | Khách · `lich_hen.cancel` · `LH-02` |
| | `DA1.WEB.03.01.07` | Xem danh sách lịch hẹn | Nhân viên tiếp đón · `lich_hen.view` · 🐟 |
| | `DA1.JOB.03.02.01` | Nhắc lịch hẹn | Hệ thống · `n/a` · `N-01` |
| | `DA1.JOB.03.02.02` | Chốt lịch đã qua ngày hẹn | Hệ thống · `n/a` · `N-02` |
| Business rule | `BR-A01` | Tối đa CH-01 lịch hẹn mỗi tuần | |
| | `BR-A02` | Định nghĩa lượt đã dùng | |
| | `BR-A03` | Hủy sớm được trả lượt | |
| | `BR-A04` | Người đặt hộ không tự duyệt | |
| Câu hỏi | `Q-B01` · `Q-P01` · `Q-E1` · `S-01` · `Q-A01` · `Q-U01` · `Q-BR01` | | Tiền tố theo `00_quy_uoc_chung.md` mục 4 |
| Giả định | `GD-0047` | | |

## 4. Bảng chuyển của SM mục 2 — Lịch hẹn

| Từ → Đến | Ai — sự kiện | Điều kiện | Hệ quả |
|---|---|---|---|
| → `DRAFT` | 👤 Khách — UC `.01` | — | Không giữ lượt |
| `DRAFT` → `PENDING_APPROVAL` | 👤 Khách — `LH-01 bước 1–3` (bước hệ thống 2–3 cùng request nên chuyển là 👤) | Còn lượt trong tuần của ngày hẹn — `QC01 Đ5.1`, sau điền ngược `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1` | Trong một giao dịch: giữ một lượt |
| `PENDING_APPROVAL` → `APPROVED` | 👤 Nhân viên tiếp đón — `LH-01 bước 4` | Trước ngày hẹn — `QC01 Đ6.1` · người duyệt khác người lập — `QC01 Đ6.3`. **Không** kiểm lại lượt: lượt đã giữ từ lúc gửi | Báo khách |
| `PENDING_APPROVAL` → `REJECTED` | 👤 Nhân viên tiếp đón — `LH-01 bước 4` | Bắt buộc lý do — `SM-06` | Trả lượt; báo khách |
| `PENDING_APPROVAL`, `APPROVED` → `CANCELLED` | 👤 Khách — `LH-02` | Lịch đang ở một trong hai trạng thái nguồn | Trả lượt nếu hủy trước `CH-02` giờ, ngược lại ghi `huy_muon` = đúng — **hệ quả**, không phải điều kiện, theo `BR-A03` |
| `APPROVED` → `COMPLETED` | ⚙️ `N-02` | Đã qua ngày hẹn | — |

Một dòng cho mỗi trạng thái nguồn khi hệ quả khác nhau; chuyển `→ CANCELLED` gộp được vì hai nguồn cùng
hệ quả.

## 5. Những chỗ ví dụ cố ý minh họa

| Điểm | Ở đâu trong ví dụ |
|---|---|
| Một bước quy trình có người làm trên hệ thống chứa **ít nhất** một UC | `LH-01 bước 1` ↔ UC `.03`; `bước 4` ↔ hai UC `.04` và `.05` (hai trạng thái cuối khác nhau) |
| Khoảng chờ là ranh giới giữa hai UC | Giữa bước 3 và bước 4 |
| Bước hệ thống cùng request với bước người | Bước 2–3 thuộc UC `.03`; chuyển trạng thái của chúng là 👤 |
| Bước ngoài phạm vi hệ thống | 🟡 bước 6 — có thật, không xây chức năng |
| Tham số thay con số trần | `CH-01` thay cho "2 lịch hẹn"; `CH-02` có sàn 24 giờ nên `BR-A03` là ⚙️ chứ không phải 🔒 |
| Trạng thái kết thúc ■ không có mũi tên đi ra | `APPROVED` không phải ■ vì còn hủy được; `COMPLETED`, `REJECTED`, `CANCELLED` là ■ |
| Điều kiện chặn vs nhánh hệ quả | Hủy luôn được (điều kiện chỉ là trạng thái nguồn); trả lượt hay không là hệ quả |
| Dữ liệu được lưu vs Δ | `Quy_Luot.da_dung` lưu vì cần một dòng để khóa khi giữ lượt; số lượt còn lại là Δ. Ở quy trình mục 1.1, "Lượt đã dùng" trỏ `Quy_Luot`; "Lượt còn lại" để trống cột Thực thể ERD vì là khái niệm tính toán (theo comment template) |
| Ràng buộc nội tại ở ERD, ràng buộc ngữ cảnh ở BR | `so_nguoi` 1–3 ở ERD; "người đặt hộ không tự duyệt" ở BR |
| Tách nhiệm | Nguồn `QT_DA1_LichHen mục 9 điểm 2` → nội dung `BR-A04` → SM dẫn ở điều kiện, UCD mục 1.2 dẫn |
| Tác vụ nền thành UC tác nhân hệ thống | `N-01` → `DA1.JOB.03.02.01`; `N-02` → `DA1.JOB.03.02.02` |
| Lượt điền ngược | Điều kiện của `DRAFT → PENDING_APPROVAL` ban đầu dẫn `QC01 Đ5.1`, sau lớp 6 thành `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1` — thêm mã, giữ điều khoản |
