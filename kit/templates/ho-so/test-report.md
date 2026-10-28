# Test Report — <du-an / CN-xx> <tên chức năng>

| Dự án | Phạm vi chạy | Nhánh | Commit cuối | Ngày chạy | Người lập | Model AI |
| --- | --- | --- | --- | --- | --- | --- |
| <mã dự án> | <bước 1 / 2 / 3; danh sách CN> | <du-an/khung / chuc-nang/CN-xx-slug> | <7 ký tự> | YYYY-MM-DD | <tên> | <tên model, mức effort> |

**File này dùng để làm gì:** đo một lượt chạy kit BA bằng AI theo 4 nhóm tiêu chí: (1) bước 3 phủ business layer của
bước 2 tới đâu, (2) bước 3 đáp ứng UC presales của bước 1 tới đâu, (3) tốn bao nhiêu thời gian, token, quota,
(4) có đúng template không.

**Lấy dữ liệu từ:** bước 1 `/ba-init` (`1-ba-init/`), bước 2 `/ba-overview` (`2-ba-overview/`), bước 3 `/ba-detail`
(`3-ba-detail/`, `chuc-nang/CN-xx/`), log phiên chạy AI, màn hình quota của tài khoản.

**Được dùng ở:** so sánh giữa các lượt chạy, các dự án, các phiên bản kit; quyết định cải tiến kit.

**Quy ước chung:**
- Bước 1 = `/ba-init`; bước 2 = `/ba-overview`; bước 3 = `/ba-detail`.
- Mỗi số liệu ghi nguồn đếm (file, lệnh, prompt). Số chưa đo được ghi `[CẦN XÁC NHẬN]`, không ước lượng.
- Kết quả từng tiêu chí: `ĐẠT` / `KHÔNG ĐẠT` / `CHƯA ĐO`.

## 0. Tóm tắt kết quả

| # | Nhóm tiêu chí | Chỉ số chính | Tiêu chí | Kết quả đo | Đánh giá |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Phủ business layer — BR | % BR của CN được phủ ở bước 3 | 100% | <x%> | ĐẠT / KHÔNG ĐẠT |
| 1.2 | Phủ business layer — máy trạng thái | % thực thể và % trạng thái khớp SM | 100% | <x% / y%> | ĐẠT / KHÔNG ĐẠT |
| 1.3 | Phủ business layer — ERD (logical) | — | Chưa định nghĩa | — | CHƯA ĐO |
| 2 | Đáp ứng UC presales | % UC presales được đáp ứng, theo 5 nhóm | <[CẦN XÁC NHẬN]> | <x%> | ĐẠT / KHÔNG ĐẠT |
| 3.1 | Timeline | Tổng thời gian AI chạy | Ghi nhận | <hh:mm> | — |
| 3.2 | Effort token | Tổng token | Ghi nhận | <n> | — |
| 3.3 | Effort quota | % quota tuần đã dùng | Ghi nhận | <x%> | — |
| 4 | Tuân thủ template | Theo định nghĩa của anh nnllhhnnllhh | <chờ định nghĩa> | — | CHƯA ĐO |

Nhận xét chung (3–5 dòng): <điểm mạnh, điểm yếu, việc cần sửa ở kit>.

## 1. Mức độ phủ business layer (bước 3 so với bước 2)

### 1.1. Độ phủ Business Rule theo chức năng

Câu hỏi: mỗi chức năng dùng những BR nào (theo bước 2), và bước 3 đã thể hiện đủ các BR đó chưa.

**Cách đếm:**
- *BR của CN*: các BR-xxx mà ma trận truy vết bước 2 (`2-ba-overview/6-business-rules/`, `trace.csv`) gán cho CN.
- *BR được phủ*: BR có xuất hiện ở ít nhất một tài liệu bước 3 của CN (UC, đặc tả màn) **và** nội dung khớp
  (điều kiện, kết quả, mức cưỡng chế), không chỉ nhắc mã.
- *% phủ* = BR được phủ / BR của CN × 100. Tiêu chí: **100%**.

**Cách đọc bảng tổng:** mỗi dòng là một CN. "Thiếu" là số BR chưa có ở bước 3; "Sai nội dung" là BR có nhắc mã nhưng
nội dung lệch bước 2.

| CN | Tên chức năng | Số BR của CN | Đã phủ | Thiếu | Sai nội dung | % phủ | Đánh giá |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CN-01 | <tên> | <n> | <n> | <n> | <n> | <x%> | ĐẠT / KHÔNG ĐẠT |
| **Tổng** | | <n> | <n> | <n> | <n> | <x%> | |

**Chi tiết BR thiếu hoặc sai** (chỉ liệt kê dòng không đạt):

| CN | BR | Nội dung BR (bước 2) | Trạng thái | Vị trí ở bước 3 (nếu có) | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| CN-01 | BR-xxx | <một câu> | Thiếu / Sai nội dung | <file:dòng> | <lệch ở đâu> |

### 1.2. Tỷ lệ khớp máy trạng thái (enum + text)

Câu hỏi: bước 3 dùng đúng các thực thể có vòng đời và đúng danh sách trạng thái đã định nghĩa trong máy trạng thái
bước 2 (`2-ba-overview/4-state-machine/`) không.

**Cách đếm:**
- *Khớp thực thể*: số thực thể có trạng thái ở bước 3 trùng với thực thể có máy trạng thái ở bước 2.
- *Khớp trạng thái*: với mỗi thực thể, trạng thái ở bước 3 khớp **cả mã enum và tên hiển thị (text)** với SM.
- Thừa = có ở bước 3 mà không có ở SM; Thiếu = có ở SM mà bước 3 không dùng.
- Tiêu chí: **100%** thực thể khớp và **100%** trạng thái khớp, không thừa.

**Cách đọc bảng:** mỗi dòng là một thực thể có vòng đời. "Lệch text" là trạng thái đúng mã enum nhưng tên hiển thị
khác SM (ví dụ SM ghi "Chờ duyệt", màn ghi "Đang chờ phê duyệt").

| Thực thể | SM (bước 2) | Có ở bước 3 | Số trạng thái SM | Khớp enum + text | Lệch text | Thiếu | Thừa | % khớp | Đánh giá |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <tên> | SM-xx | Có / Không | <n> | <n> | <n> | <n> | <n> | <x%> | ĐẠT / KHÔNG ĐẠT |
| **Tổng** | | <n>/<n> thực thể | <n> | <n> | <n> | <n> | <n> | <x%> | |

**Chi tiết trạng thái lệch:**

| Thực thể | Enum (SM) | Text (SM) | Enum (bước 3) | Text (bước 3) | Loại lệch | Vị trí |
| --- | --- | --- | --- | --- | --- | --- |
| <tên> | <MA_ENUM> | <tên> | <MA_ENUM> | <tên> | Lệch text / Thiếu / Thừa | <file:dòng> |

### 1.3. ERD (mức logical)

Chưa định nghĩa tiêu chí. Ghi `CHƯA ĐO`.

## 2. Mức độ đáp ứng UC presales (bước 3 so với bước 1)

Câu hỏi: các UC presales (`1-ba-init/0-dau-vao/uc-presales.md`) đã được chức năng nào ở bước 3 đáp ứng.

**Cách đếm:**
- *UC presales*: theo danh mục bước 1, chia 5 nhóm ở bảng dưới.
- *Bóc thêm*: UC không có trong presales nhưng được bóc ra từ quy trình hoặc văn bản pháp luật ở bước 1–2
  (đếm riêng, không tính vào mẫu số). ❓ `[CẦN BA CHỐT]` nghĩa của "bóc lấy $" — đề xuất mặc định: hiểu như trên.
- *Đáp ứng*: UC có ít nhất một UC chi tiết hoặc màn ở bước 3 truy vết về (`trace.csv`) và đủ luồng chính.
  *Một phần*: có truy vết nhưng thiếu luồng hoặc thiếu dữ liệu. *Chưa đáp ứng*: không có truy vết.
- *% đáp ứng* = (Đáp ứng + 0,5 × Một phần) / Tổng UC presales × 100. Hệ số 0,5: `[CẦN XÁC NHẬN]`.

**Cách đọc bảng:** mỗi dòng là một nhóm UC.

| Nhóm UC | Tổng UC presales | Bóc thêm | Đáp ứng | Một phần | Chưa đáp ứng | % đáp ứng | Đánh giá |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Nghiệp vụ theo quy trình | <n> | <n> | <n> | <n> | <n> | <x%> | |
| Nghiệp vụ không theo quy trình | <n> | <n> | <n> | <n> | <n> | <x%> | |
| Quản trị hệ thống | <n> | <n> | <n> | <n> | <n> | <x%> | |
| Báo cáo | <n> | <n> | <n> | <n> | <n> | <x%> | |
| Tích hợp | <n> | <n> | <n> | <n> | <n> | <x%> | |
| **Tổng** | <n> | <n> | <n> | <n> | <n> | <x%> | |

**Chi tiết UC chưa đáp ứng hoặc một phần:**

| Mã UC presales | Tên UC | Nhóm | Mức | CN / UC bước 3 | Thiếu gì |
| --- | --- | --- | --- | --- | --- |
| <mã> | <tên> | <nhóm> | Một phần / Chưa đáp ứng | <CN-xx / UC-xx> | <luồng, dữ liệu, màn> |

## 3. Effort (token, quota) và timeline

### 3.1. Timeline

Chỉ tính thời gian AI chạy (từ lúc gọi lệnh tới lúc AI trả kết quả), **không** tính thời gian người review, trả lời câu
hỏi, chờ duyệt. Lấy từ log phiên hoặc thời điểm commit.

**Business layer (bước 2):**

| Lớp | Tài liệu | Bắt đầu | Kết thúc | Thời gian AI chạy | Số vòng sửa | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BRD | <hh:mm> | <hh:mm> | <mm phút> | <n> | |
| 2 | Quy trình nghiệp vụ | | | | | |
| 3 | ERD | | | | | |
| 4 | Máy trạng thái | | | | | |
| 5 | Tác nhân, use case | | | | | |
| 6 | Business rule | | | | | |
| 7 | Điền ngược | | | | | |
| G0 | Gate | | | | | |
| **Tổng** | | | | <hh:mm> | | |

**UC (bước 3):** mỗi UC chi tiết một dòng ở phụ lục A; bảng dưới là thống kê.

| Chỉ số | Thời gian | Tên UC (mã) | Ghi chú |
| --- | --- | --- | --- |
| Min | <mm phút> | <UC-xx tên> | |
| Max | <mm phút> | <UC-xx tên> | <vì sao lâu> |
| Trung bình | <mm phút> | — (trên <n> UC) | |

**Prototype:** không so sánh thời gian.

### 3.2. Effort (token)

Số token lấy bằng prompt ở phụ lục B, chạy cuối mỗi phiên. Ghi cả token vào (input, gồm cache) và ra (output).

| Hạng mục | Số phiên | Token vào | Token ra | Tổng token | Trung bình / đơn vị | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| Business layer (bước 2) | <n> | <n> | <n> | <n> | <n> / lớp | |
| UC (bước 3) | <n> | <n> | <n> | <n> | <n> / UC | |
| Prototype (bước 3) | <n> | <n> | <n> | <n> | <n> / màn | |
| **Tổng** | | | | <n> | | |

### 3.3. Effort (quota)

Ghi % quota tuần ngay trước khi bắt đầu và ngay sau khi chạy xong mỗi hạng mục. Không chạy việc khác trên cùng tài khoản
trong khoảng đo; nếu có thì ghi ở "Ghi chú".

| Hạng mục | Tài khoản | Quota tuần đầu (%) | Quota tuần cuối (%) | Đã dùng (%) | Thời điểm đo | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| Business layer (bước 2) | <tài khoản> | <x%> | <y%> | <y − x> | <đầu / cuối> | |
| Specification layer (bước 3) | <tài khoản> | <x%> | <y%> | <y − x> | <đầu / cuối> | |
| **Tổng** | | | | <%> | | |

Nếu khoảng đo vắt qua lần reset quota tuần: tách thành hai dòng, cộng phần đã dùng.

## 4. Tuân thủ template

Tiêu chí do anh nnllhhnnllhh định nghĩa. Chờ định nghĩa: `CHƯA ĐO`.

| Tài liệu | Template | Tiêu chí | Kết quả | Vị trí lỗi | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| <file> | <đường dẫn template> | <chờ định nghĩa> | | | |

## 5. Vấn đề phát hiện và đề xuất cải tiến kit

| # | Nhóm tiêu chí | Vấn đề | Nguyên nhân (đoán) | Đề xuất | Ưu tiên |
| --- | --- | --- | --- | --- | --- |
| 1 | 1.1 / 1.2 / 2 / 3 / 4 | <một câu, có vị trí> | <prompt, template, skill, đầu vào> | <sửa gì ở kit> | Cao / Trung bình / Thấp |

## Phụ lục A. Thời gian và token từng UC

| UC | Tên UC | CN | Bắt đầu | Kết thúc | Thời gian AI chạy | Token vào | Token ra | Số vòng sửa |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UC-xx | <tên> | CN-xx | <hh:mm> | <hh:mm> | <mm phút> | <n> | <n> | <n> |

## Phụ lục B. Prompt tính token

Dán vào cuối mỗi phiên (một phiên = một lớp business layer, một UC hoặc một nhóm prototype):

```text
Thống kê effort của phiên này để ghi Test Report. Trả về đúng một bảng markdown, không giải thích thêm:
| Hạng mục | Mã (lớp / UC / màn) | Token vào (gồm cache) | Token ra | Tổng token | Số lượt gọi tool | Số subagent | Thời gian AI chạy (phút) |
- Hạng mục: Business layer / UC / Prototype.
- Nếu có subagent: mỗi subagent một dòng, thêm dòng Tổng.
- Không đọc được số chính xác thì ghi [CẦN XÁC NHẬN], không ước lượng.
```

Nếu công cụ có lệnh xem chi phí phiên (ví dụ `/cost`, `/usage` trong Claude Code), lấy số từ lệnh đó trước và chỉ dùng
prompt để bổ sung phần chia theo hạng mục.
