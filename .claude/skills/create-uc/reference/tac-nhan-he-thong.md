# UC tác nhân hệ thống

Phần tra cứu của skill [`create-uc`](../SKILL.md).

Tác nhân của UC là **người**, hoặc **hệ thống**: chính hệ thống này tự chạy khi tới một thời điểm hay
nhận một sự kiện, hoặc một hệ thống ngoài gọi vào. Cùng template, cùng mã, cùng cột. Chỗ khác nhau:

| Mục | Tác nhân người | Tác nhân hệ thống |
|---|---|---|
| Tác nhân chính | Tên vai trò | `Hệ thống (theo lịch)`, `Hệ thống (theo sự kiện X)`, hoặc tên hệ thống ngoài |
| Bắt đầu khi | "Là khách, tôi muốn đặt lịch" | "Khi tới 7 giờ mỗi ngày, hệ thống cần nhắc những lịch hẹn của hôm sau" |
| Trigger tại đâu | `route · điều khiển` | Lịch chạy **kèm múi giờ** (`07:00 Asia/Ho_Chi_Minh` hằng ngày), tên sự kiện, hoặc route endpoint nhận |
| Xác thực | Theo permission key ở Use case list | Tự chạy: không cần. **Hệ thống ngoài gọi vào: ghi cơ chế xác thực máy–máy** (token, chữ ký, IP) ở dòng `Tác nhân chính` — không để trống, vì trống nghĩa là endpoint không xác thực |
| Kết quả chính | Trạng thái cuối của một bản ghi | Thường là theo lô: "mỗi bản ghi kết thúc ở X hoặc Y" |
| Main flow | Bắt đầu từ thao tác của người | **Bước đầu tiên là chọn bản ghi đầu vào**, ghi rõ tiêu chí chọn và chạy cả lô hay từng bản ghi |
| Exception flow | Theo chín câu soát | **Bắt buộc có nhánh "một bản ghi lỗi"** (dừng cả lô hay bỏ qua bản ghi đó) và nhánh "chạy lại" (có an toàn không, theo khóa gì) |
| Cột Màn hình | `route · điều khiển` | `n/a` ở mọi bước |
| Cột Message | Thông báo hiện cho người dùng | Thông báo **gửi đi**, ghi rõ gửi cho ai qua kênh nào |
| Exception kết thúc | Ba dạng | Chủ yếu `END (Exception)` dừng UC; có thử lại thì ghi số lần và khoảng cách trong `Mô tả` |

UC hệ thống còn là chỗ **dọn ghi tạm** của các UC khác — nhả chỗ giữ quá hạn, xóa tệp mồ côi. UC nào
có ghi tạm thì phải trỏ được tới UC dọn tương ứng.
