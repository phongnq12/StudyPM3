# Chín câu soát nhánh

Phần tra cứu của skill [`create-uc`](../SKILL.md). Đi qua đủ chín câu sau khi viết main flow. Mỗi câu
có một trong ba đáp án:

| Đáp án | Khi nào | Ghi ở đâu |
|---|---|---|
| Thành một nhánh | UC này xử lý tình huống đó theo cách riêng | Một bảng ở Alternative hoặc Exception flows |
| `theo quy tắc chung <mã kèm tên>` | Dự án đã có cách xử lý chung và UC này không khác | Dòng "Đã soát" |
| `không áp dụng (lý do)` | Tình huống không xảy ra được với UC này | Dòng "Đã soát" |

| # | Tình huống |
|---|---|
| 1 | Dữ liệu không hợp lệ, hoặc vi phạm quy tắc |
| 2 | Bản ghi đang ở trạng thái không cho làm thao tác này |
| 3 | Hai người cùng sửa một bản ghi |
| 4 | Không đủ quyền, hoặc bản ghi nằm ngoài phạm vi dữ liệu |
| 5 | Hệ thống ngoài không trả lời |
| 6 | Bỏ dở — hủy, quay lại, chuyển menu, đóng tab. Trả lời bằng một dòng ba mảnh, xem [`bo-do.md`](bo-do.md) |
| 7 | Thời hạn, thời điểm — quá hạn, chưa tới ngày được phép, ngoài giờ làm việc |
| 8 | Danh sách rỗng, tìm không ra kết quả, danh mục tham chiếu chưa có dữ liệu |
| 9 | Thao tác lặp — bấm đúp, gửi trùng, chạy lại job đã chạy |

"Theo quy tắc chung" là đáp án **mặc định** cho câu 3, 4, 5, 6, 9 ở dự án đã có sổ quy tắc chung. Chỉ
viết nhánh khi UC làm khác quy tắc chung — nếu không, ba trăm UC có ba trăm bảng "không đủ quyền" giống
hệt nhau.

## Dòng "Đã soát" không được thành câu mẫu

Dòng "Đã soát" phải viết, không bỏ trống — nó là bằng chứng đã xét chứ không phải quên. Nhưng nó chỉ có
giá trị khi viết **cho riêng UC này**:

- Đáp án `không áp dụng` phải có **lý do riêng của UC này**: *"không áp dụng (lịch hẹn chỉ khách tạo
  ra nó được sửa)"*, không phải *"không áp dụng (không liên quan)"*.
- AI **không được chép** dòng "Đã soát" từ UC khác sang. Phải đi qua chín câu cho từng UC.
- Hai UC có dòng "Đã soát" trùng nguyên văn — trừ phần dẫn quy tắc chung — là dấu hiệu đã chép.

Ví dụ (mã `QTC-xx` là **mã minh họa**, thay bằng mã thật của sổ quy tắc chung dự án mình):
*"Đã soát: #3 theo quy tắc chung QTC-05 Khóa lạc quan · #4 theo quy tắc chung QTC-02 Chặn quyền ·
#5 không áp dụng (đặt lịch không gọi sang hệ thống nào) · #6 theo quy tắc chung QTC-11 Rời form chưa
lưu · bước ghi: 4 · trước bước ghi: không ghi gì · về màn: /lich-hen · #7 không áp dụng (lịch hẹn
không có hạn chót đặt) · #9 theo quy tắc chung QTC-13 Chống bấm đúp."*
