# Sở cứ, giả định, tên gọi và bản chép

Phần tra cứu của skill [`create-uc`](../SKILL.md). Bốn bước tìm sở cứ nằm ở phần lõi.

## Ghi một giả định mới vào sổ

Sổ giả định chung của business layer: `2-ba-overview/assumption_log.md`. Khi
viết UC chỉ cần điền:

| Cột | Điền gì |
|---|---|
| Mã | `GD-xxxx` tiếp theo số cao nhất đang có, không dùng lại mã đã xóa |
| Ngày ghi | Hôm nay, `DD/MM/YYYY` |
| Vấn đề / điều chưa rõ | Câu hỏi thật sự chưa ai trả lời |
| Nguồn (hint) | Đã tìm ở đâu mà không thấy |
| Giả định tạm đang dùng | Phát biểu đủ để dev code và QC test — có số thì ghi số kèm biên |
| Lớp bị ảnh hưởng | `5` (Use case), thêm lớp khác nếu biết |
| Mã liên quan | Mã UC; chưa có mã thì tên UC |
| Cần ai chốt | Tên người |
| Trạng thái | `Đang mở` |

1. **Tìm trước khi ghi.** Grep sổ theo từ khóa — có thể đã có người ghi.
2. **Chỉ người viết UC mới được tạo giả định.** AI ghi `[CẦN BA CHỐT] <phát biểu>` và dừng. Giả định
   do máy đúc ra trông như có căn cứ vì nó có mã và bôi đỏ, trong khi không ai chịu trách nhiệm.
3. **Nhiều người viết song song** thì cấp mã tạm theo người (`GD-<tên>-1`), chủ sổ đánh lại mã chính
   thức một lượt.

## Bôi đỏ giả định

Mỗi lần dẫn `GD-xxxx` trong thân UC phải bôi **đỏ, đậm, gạch chân**:

```markdown
<span style="color:red">**<u>GD-0047</u>**</span>
```

Giả định là chỗ tài liệu đang đứng trên cát; người đọc phải thấy ngay dòng nào sẽ phải sửa khi khách
chốt khác. Nội dung giả định nằm ở sổ, UC chỉ dẫn mã kèm tên ngắn. Một số công cụ web lọc bỏ thuộc
tính `style` — khi đó chỉ còn đậm và gạch chân, vẫn phân biệt được.

## Tên gọi

Thực thể, trạng thái, tác nhân, màn hình là **tên gọi**, viết ngay từ hôm nay. Khi business layer dựng
xong chỉ gắn thêm mã — tên không đổi. **Mã luôn đi kèm tên, không bao giờ viết trơ.**

| Mảnh ghép | Hôm nay viết gì | Sau này thành gì |
|---|---|---|
| Thực thể | Tên bảng **đúng như ERD** (lớp 3), trong backtick: `Lich_Hen`. ERD chưa có thì tên nghiệp vụ tiếng Việt | — (ERD không cấp mã riêng cho thực thể; tên bảng là định danh) |
| Trạng thái | Mã enum tiếng Anh **đúng như ERD**, kèm tên bảng: `Lich_Hen: PENDING_APPROVAL -> APPROVED`. Nhãn tiếng Việt chỉ ở cột Mô tả | `SM mục 2: PENDING_APPROVAL -> APPROVED` — dẫn máy bằng **số mục** của tài liệu máy trạng thái (lớp 4). `SM-01`…`SM-09` là nguyên tắc chung của máy trạng thái, **không** phải mã một máy |
| Tác nhân | Tên vai trò tiếng Việt, lấy đúng tên ở sơ đồ use case (lớp 5); tên vai gốc đặt ở BRD mục 4 | `ACT-07 Nhân viên tiếp đón` — mã và tên theo sơ đồ use case |
| Màn hình | `route · điều khiển`, route đúng chuỗi trong code prototype: `/lich-hen/:id · nút "Gửi duyệt"` | `SCR-003 Đặt lịch hẹn · nút "Gửi duyệt"` |
| Quy tắc | Mã kèm tên **phát biểu được nội dung**: `BR-012 Chỉ đặt lịch cho khách đã xác thực` | — |

## Bản chép và kiểm đồng bộ

Nguyên tắc 1 nói UC không định nghĩa gì. Nhưng có bốn chỗ UC **buộc phải chép** nội dung từ nguồn, vì
người đọc cần thấy ngay mà không mở file khác:

| Bản chép | Nằm ở | Nguồn gốc | Vì sao phải chép |
|---|---|---|---|
| Con số kèm biên của quy tắc | Ô `Sở cứ` | Lớp quy tắc, tài liệu khách hàng, sổ giả định | QC cần biên để viết ca `= N` và `= N+1` |
| Tên phát biểu nội dung, đi kèm mỗi mã | Mọi chỗ dẫn mã | Bản ghi gốc của mã đó | Người đọc không thuộc bảng mã |
| Chuỗi thông báo | Cột `Message` | Prototype | QC assert nguyên văn |
| Route và nhãn điều khiển | Cột `Màn hình` | Code prototype | QC dựng Steps từ đó |

**Khi lệch, nguồn thắng** — UC phải sửa theo nguồn, không phải ngược lại. Mỗi lần chuyển UC sang
`cho-duyet` phải đối chiếu lại bốn loại bản chép với nguồn. Đây là chỗ cần script kiểm tự động; chưa có
script thì kiểm tay.
