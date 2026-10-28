/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* TỆP SINH TỰ ĐỘNG — KHÔNG SỬA TAY (Sổ BA PM2).
 * Nguồn: PM2_MessageList.md v2.20 · 189 mã.
 *.
 * status: active = Dùng được · draft = Nháp · retired = Ngừng dùng. Biến {n} bọc ** là key in đậm (quy tắc 12 mục 1.3). */
export const MESSAGE_LIST_VERSION = "v2.20";
export const MESSAGES = {
 "E001-01": {
  "status": "active",
  "channel": "Inline",
  "text": "Vui lòng nhập {0}"
 },
 "E001-02": {
  "status": "active",
  "channel": "Inline",
  "text": "Vui lòng chọn {0}"
 },
 "E001-03": {
  "status": "active",
  "channel": "Inline",
  "text": "Vui lòng chọn ít nhất một {0}"
 },
 "E001-04": {
  "status": "active",
  "channel": "Inline",
  "text": "Vui lòng nhập lý do {0}"
 },
 "E001-05": {
  "status": "active",
  "channel": "Inline",
  "text": "{0} tối đa {1} ký tự"
 },
 "E001-06": {
  "status": "active",
  "channel": "Inline",
  "text": "{0} phải có ít nhất {1} ký tự"
 },
 "E001-07": {
  "status": "active",
  "channel": "Inline",
  "text": "{0} đã tồn tại {1}"
 },
 "E001-08": {
  "status": "active",
  "channel": "Inline",
  "text": "Mã chỉ gồm chữ hoa, số, dấu gạch ngang và gạch dưới, tối đa 10 ký tự"
 },
 "E001-09": {
  "status": "active",
  "channel": "Inline",
  "text": "Ngày kết thúc phải sau ngày bắt đầu"
 },
 "E001-10": {
  "status": "active",
  "channel": "Toast",
  "text": "Chưa {0} {1}"
 },
 "E001-11": {
  "status": "active",
  "channel": "Toast",
  "text": "Không tìm thấy {0}"
 },
 "E001-12": {
  "status": "active",
  "channel": "Toast",
  "text": "Không thể {0} khi {1} đang ở trạng thái **{2}**"
 },
 "E001-13": {
  "status": "active",
  "channel": "Toast",
  "text": "Bạn không có quyền {0} {1}"
 },
 "E001-14": {
  "status": "active",
  "channel": "Toast",
  "text": "Tệp vượt quá {0}"
 },
 "E001-15": {
  "status": "active",
  "channel": "Toast",
  "text": "{0} không còn tồn tại. Vui lòng tải lại danh sách"
 },
 "E001-16": {
  "status": "active",
  "channel": "Inline",
  "text": "{0} không đúng định dạng. {1}"
 },
 "E001-17": {
  "status": "active",
  "channel": "Inline",
  "text": "{0} phải {1} {2}"
 },
 "E001-18": {
  "status": "active",
  "channel": "Inline",
  "text": "Vui lòng nhập {0} khi {1}"
 },
 "E001-19": {
  "status": "active",
  "channel": "Toast",
  "text": "Không thể xóa {0}. {1}"
 },
 "E001-20": {
  "status": "active",
  "channel": "Toast",
  "text": "Chỉ chấp nhận tệp {0}"
 },
 "E001-21": {
  "status": "active",
  "channel": "Toast",
  "text": "Không thể dời lịch hẹn. {0}"
 },
 "E001-22": {
  "status": "active",
  "channel": "Toast",
  "text": "Không thể đổi thời lượng lịch hẹn. {0}"
 },
 "E001-23": {
  "status": "active",
  "channel": "Inline",
  "text": "Đang chọn **{0}** trạng thái khác nhau ({1}). Thao tác hàng loạt chỉ áp dụng cho các lịch hẹn cùng trạng thái, vui lòng lọc theo tab trạng thái rồi chọn lại"
 },
 "E001-24": {
  "status": "active",
  "channel": "Toast",
  "text": "Buồng **{0}** lúc {1} đã có lịch hẹn **{2}**, vui lòng chọn lại buồng hoặc khung giờ"
 },
 "E001-25": {
  "status": "active",
  "channel": "Inline",
  "text": "Người cai nghiện đang không thuộc danh sách quầy phục vụ. Vui lòng bổ sung **{0}** vào **{1}** để tiến hành đặt lịch cho người cai nghiện"
 },
 "E001-26": {
  "status": "active",
  "channel": "Inline",
  "text": "Liên kết thân nhân với người cai nghiện này chưa được duyệt"
 },
 "E001-27": {
  "status": "active",
  "channel": "Inline",
  "text": "Quyền thăm gặp của thân nhân với người cai nghiện này đang tạm dừng"
 },
 "E001-28": {
  "status": "active",
  "channel": "Inline",
  "text": "Người cai nghiện đang ở trạng thái **{0}**, hiện không tiếp nhận thăm gặp"
 },
 "E001-29": {
  "status": "active",
  "channel": "Inline",
  "text": "Chưa đủ **{0}** ngày kể từ ngày tiếp nhận {1}, được thăm gặp từ {2}"
 },
 "E001-30": {
  "status": "active",
  "channel": "Inline",
  "text": "Tạm dừng thăm gặp theo chỉ định của Tổ Y tế ({0}) đến {1}"
 },
 "E001-31": {
  "status": "active",
  "channel": "Inline",
  "text": "Đang trong thời gian xem xét kỷ luật, chưa được thăm gặp"
 },
 "E001-32": {
  "status": "active",
  "channel": "Inline",
  "text": "Đang thi hành kỷ luật {0} theo quyết định **{1}** ngày {2}, tuần {3}/{4} không được thăm gặp"
 },
 "E001-33": {
  "status": "active",
  "channel": "Inline",
  "text": "{0} có văn bản **{1}** đề nghị không cho gặp thân nhân"
 },
 "E001-34": {
  "status": "active",
  "channel": "Inline",
  "text": "Đã hết lượt thăm gặp trong tuần"
 },
 "E001-35": {
  "status": "active",
  "channel": "Inline",
  "text": "Không tìm thấy thân nhân nào khớp «{0}», vui lòng kiểm tra lại số căn cước công dân hoặc số điện thoại"
 },
 "E001-36": {
  "status": "active",
  "channel": "Inline",
  "text": "Chỗ đang chọn không đủ **{0}** phút, vui lòng chọn lại trên lịch"
 },
 "E001-37": {
  "status": "active",
  "channel": "Inline",
  "text": "Giờ nghỉ trưa hoặc ngoài giờ thăm gặp, vui lòng bấm vào chỗ trống"
 },
 "E001-38": {
  "status": "draft",
  "channel": "Inline",
  "text": "{0}, vui lòng chọn chỗ khác"
 },
 "E001-39": {
  "status": "active",
  "channel": "Inline",
  "text": "Không áp dụng được khi đang ở khu cách ly"
 },
 "E001-40": {
  "status": "draft",
  "channel": "Inline",
  "text": "Khung giờ **{0}** nằm ngoài khung giờ thăm gặp"
 },
 "E001-41": {
  "status": "draft",
  "channel": "Inline",
  "text": "Buồng **{0}** bị trùng khung giờ **{1}** với suất riêng khung giờ **{2}**, vui lòng rà soát lại"
 },
 "E001-42": {
  "status": "draft",
  "channel": "Inline",
  "text": "Chưa có quầy tiếp đón để gắn buồng. Vui lòng tạo quầy trước"
 },
 "E001-43": {
  "status": "draft",
  "channel": "Inline",
  "text": "Số chỗ ngồi cho thân nhân phải từ 1 đến 10"
 },
 "E001-44": {
  "status": "draft",
  "channel": "Inline",
  "text": "Biến **{0}** không hợp lệ với sự kiện này. Các biến dùng được: {1}"
 },
 "I001-01": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã tạo {0}"
 },
 "I001-02": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã lưu nháp {0}"
 },
 "I001-03": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã cập nhật {0}"
 },
 "I001-04": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã xóa {0}"
 },
 "I001-05": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã gửi duyệt {0}"
 },
 "I001-06": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã gửi duyệt lại {0}"
 },
 "I001-07": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã duyệt {0}"
 },
 "I001-08": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã từ chối duyệt {0}"
 },
 "I001-09": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã hủy {0}"
 },
 "I001-10": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã hoàn thành {0}"
 },
 "I001-11": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã kết xuất **{0}** {1} theo bộ lọc hiện hành"
 },
 "I001-12": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã xuất {0}"
 },
 "I001-13": {
  "status": "draft",
  "channel": "Toast",
  "text": "Mở hộp thoại in của trình duyệt"
 },
 "I001-14": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã tạo **{0}** {1} (trạng thái **{2}**)"
 },
 "I001-15": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã ghi nhận {0} {1}"
 },
 "I001-16": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã thêm {0}"
 },
 "I001-17": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã khóa"
 },
 "I001-18": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã kích hoạt lại {0}"
 },
 "I001-19": {
  "status": "active",
  "channel": "Nhãn",
  "text": "Quay lại"
 },
 "I001-20": {
  "status": "active",
  "channel": "Nhãn",
  "text": "Xem chi tiết"
 },
 "I001-21": {
  "status": "active",
  "channel": "Nhãn",
  "text": "Tìm kiếm"
 },
 "I001-22": {
  "status": "active",
  "channel": "Nhãn",
  "text": "Hủy"
 },
 "I001-23": {
  "status": "active",
  "channel": "Nhãn",
  "text": "Xác nhận"
 },
 "I001-24": {
  "status": "active",
  "channel": "Nhãn",
  "text": "Bắt buộc"
 },
 "I001-25": {
  "status": "active",
  "channel": "Toast",
  "text": "Vui lòng điền đủ thông tin bắt buộc của {0}"
 },
 "I001-26": {
  "status": "active",
  "channel": "Popup",
  "text": "Đã hiểu"
 },
 "I001-27": {
  "status": "active",
  "channel": "Empty",
  "text": "Chưa có {0} nào"
 },
 "I001-28": {
  "status": "active",
  "channel": "Empty",
  "text": "Không có dữ liệu phù hợp với điều kiện tìm kiếm"
 },
 "I001-29": {
  "status": "retired",
  "channel": "Empty",
  "text": "Không tìm thấy {0} phù hợp"
 },
 "I001-30": {
  "status": "active",
  "channel": "Empty",
  "text": "Vui lòng chọn {0} để xem danh sách {1}"
 },
 "I001-31": {
  "status": "active",
  "channel": "Empty",
  "text": "Không có giá trị"
 },
 "I001-32": {
  "status": "active",
  "channel": "Empty",
  "text": "Chưa có dữ liệu {0} được đồng bộ từ PM5"
 },
 "I001-33": {
  "status": "active",
  "channel": "Banner",
  "text": "Chỉ hiển thị {0} ở trạng thái **{1}**"
 },
 "I001-34": {
  "status": "active",
  "channel": "Banner",
  "text": "Dữ liệu đồng bộ từ PM5, tại đây chỉ tra cứu"
 },
 "I001-35": {
  "status": "active",
  "channel": "Placeholder",
  "text": "Nhập {0}"
 },
 "I001-36": {
  "status": "active",
  "channel": "Placeholder",
  "text": "Ví dụ: {0}"
 },
 "I001-37": {
  "status": "active",
  "channel": "Placeholder",
  "text": "Chọn {0}"
 },
 "I001-38": {
  "status": "active",
  "channel": "Placeholder",
  "text": "Chọn {0}"
 },
 "I001-39": {
  "status": "active",
  "channel": "Placeholder",
  "text": "Tìm theo {0}, {1} hoặc {2}"
 },
 "I001-40": {
  "status": "active",
  "channel": "Placeholder",
  "text": "DD/MM/YYYY"
 },
 "I001-41": {
  "status": "active",
  "channel": "Tooltip",
  "text": "aria-label"
 },
 "I001-43": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã trả lại {0}"
 },
 "I001-44": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã hủy duyệt {0}"
 },
 "I001-45": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã nhập **{0}** bản ghi"
 },
 "I001-46": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã ký {0}"
 },
 "I001-47": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã gửi thông báo tới **{0}** cán bộ"
 },
 "I001-48": {
  "status": "active",
  "channel": "Empty",
  "text": "Chưa có {0} nào — bấm «{1}» để bắt đầu"
 },
 "I001-49": {
  "status": "active",
  "channel": "Placeholder",
  "text": "Chọn một hoặc nhiều {0}"
 },
 "I001-50": {
  "status": "active",
  "channel": "Placeholder",
  "text": "Từ ngày"
 },
 "I001-52": {
  "status": "active",
  "channel": "Banner",
  "text": "Chỉ hiển thị {0} thuộc cơ sở bạn quản lý"
 },
 "I001-53": {
  "status": "active",
  "channel": "Banner",
  "text": "Vai trò truy cập: {0}"
 },
 "I001-54": {
  "status": "active",
  "channel": "Chuông",
  "text": "{0} của **{1}** (**{2}**) vừa được cập nhật. Vui lòng vào kiểm tra"
 },
 "I001-55": {
  "status": "active",
  "channel": "Chuông",
  "text": "{0} **{1}** vừa được cập nhật. Vui lòng vào kiểm tra"
 },
 "I001-56": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã kích hoạt {0} **{1}**"
 },
 "I001-57": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã tạo và duyệt lịch hẹn **{0}**. Lịch được duyệt ngay vì thân nhân đã có sổ hoặc tài khoản thăm gặp"
 },
 "I001-58": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã tạo và gửi duyệt lịch hẹn **{0}**"
 },
 "I001-59": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã cập nhật và duyệt lịch hẹn **{0}**. Lịch được duyệt ngay vì thân nhân đã có sổ hoặc tài khoản thăm gặp"
 },
 "I001-60": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã cập nhật và gửi duyệt lịch hẹn **{0}**"
 },
 "I001-61": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã áp dụng **{0}** cho tuần {1}: +1 lượt khả dụng"
 },
 "I001-62": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã xác nhận vắng mặt lịch hẹn **{0}**"
 },
 "I001-63": {
  "status": "draft",
  "channel": "Toast",
  "text": "Đã đăng ký lịch hẹn **{0}** tại quầy"
 },
 "I001-64": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã đăng ký đơn ngoại lệ **{0}** tại quầy, chờ Trưởng cơ sở duyệt"
 },
 "I001-65": {
  "status": "active",
  "channel": "Toast",
  "text": "{0} và gửi Trưởng cơ sở duyệt lại đơn ngoại lệ **{1}**"
 },
 "I001-66": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã hủy {0}, đã gửi thông báo cho thân nhân"
 },
 "I001-67": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã duyệt {0}. Lịch đã chuyển sang màn Thăm gặp trực tiếp"
 },
 "I001-68": {
  "status": "draft",
  "channel": "Toast",
  "text": "Đã vô hiệu hóa {0} **{1}**"
 },
 "I001-69": {
  "status": "draft",
  "channel": "Toast",
  "text": "Đã vô hiệu hóa {0} **{1}** và hủy **{2}** lịch hẹn"
 },
 "I001-70": {
  "status": "draft",
  "channel": "Toast",
  "text": "Đã cập nhật {0} và chuyển **{1}** lịch hẹn sang buồng khác"
 },
 "I001-71": {
  "status": "draft",
  "channel": "Toast",
  "text": "Đã cập nhật {0} và hủy **{1}** lịch hẹn"
 },
 "I001-72": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã hủy kéo, lịch được giữ ở vị trí cũ"
 },
 "I001-73": {
  "status": "draft",
  "channel": "Toast",
  "text": "Đã đánh dấu tất cả là đã đọc"
 },
 "I001-74": {
  "status": "active",
  "channel": "Empty",
  "text": "Chọn ngày thăm gặp để xem buồng và giờ còn trống"
 },
 "I001-75": {
  "status": "active",
  "channel": "Empty",
  "text": "Ngoài giờ thăm gặp"
 },
 "I001-76": {
  "status": "draft",
  "channel": "Empty",
  "text": "Không có hồ sơ nào khớp «{0}»"
 },
 "I001-77": {
  "status": "draft",
  "channel": "Empty",
  "text": "Không có kỷ luật đang thi hành"
 },
 "I001-78": {
  "status": "draft",
  "channel": "Empty",
  "text": "Chưa chọn {0} nào"
 },
 "I001-79": {
  "status": "draft",
  "channel": "Empty",
  "text": "Quầy chưa có buồng thăm gặp. Vui lòng khai buồng cho quầy trước rồi chỉ định suất riêng"
 },
 "I001-80": {
  "status": "draft",
  "channel": "Inline",
  "text": "Đã quá hạn hủy nên không chọn được: {0}"
 },
 "I001-81": {
  "status": "active",
  "channel": "Banner",
  "text": "Đã đủ điều kiện đi tiếp"
 },
 "I001-82": {
  "status": "active",
  "channel": "Banner",
  "text": "Đang chọn **{0}** lịch hẹn ở trạng thái **{1}**."
 },
 "I001-83": {
  "status": "draft",
  "channel": "Popup",
  "text": "Không còn buồng trống cùng giờ, cần đổi giờ khác"
 },
 "I001-84": {
  "status": "active",
  "channel": "Banner",
  "text": "Lịch hẹn được duyệt ngay khi lưu"
 },
 "I001-85": {
  "status": "active",
  "channel": "Banner",
  "text": "Thân nhân **{0}** đã có sổ hoặc tài khoản thăm gặp nên không cần duyệt. Trạng thái sau khi lưu: **Đã duyệt**."
 },
 "I001-86": {
  "status": "active",
  "channel": "Banner",
  "text": "Đơn xin Trưởng cơ sở duyệt"
 },
 "I001-87": {
  "status": "active",
  "channel": "Banner",
  "text": "Thân nhân **{0}** chưa có sổ hoặc tài khoản thăm gặp nên lịch hẹn cần Trưởng cơ sở duyệt. Lý do xin duyệt: {1}. Trạng thái sau khi lưu: **Chờ Trưởng cơ sở duyệt**."
 },
 "I001-88": {
  "status": "active",
  "channel": "Banner",
  "text": "Lịch hẹn sẽ chờ Cán bộ Tổ thăm gặp duyệt lại"
 },
 "I001-89": {
  "status": "active",
  "channel": "Banner",
  "text": "Lịch hẹn này đã bị từ chối nên khi gửi lại sẽ chuyển Cán bộ Tổ thăm gặp duyệt. Trạng thái sau khi gửi: **Chờ duyệt**."
 },
 "I001-90": {
  "status": "active",
  "channel": "Banner",
  "text": "Đơn ngoại lệ sẽ chờ Trưởng cơ sở duyệt lại"
 },
 "I001-91": {
  "status": "active",
  "channel": "Banner",
  "text": "Đơn ngoại lệ này đã bị từ chối nên khi gửi lại sẽ chuyển Trưởng cơ sở duyệt. Trạng thái sau khi gửi: **Chờ Trưởng cơ sở duyệt**."
 },
 "I001-92": {
  "status": "draft",
  "channel": "Banner",
  "text": "Giấy tờ khớp đủ **{0}** thân nhân"
 },
 "I001-93": {
  "status": "draft",
  "channel": "Popup",
  "text": "**{0}** lịch sẽ chuyển sang buồng mới · **{1}** lịch cần đổi giờ khác."
 },
 "I001-94": {
  "status": "active",
  "channel": "Empty",
  "text": "Chưa có {0} nào. Vui lòng cài đặt tại {1}"
 },
 "W001-01": {
  "status": "active",
  "channel": "Toast · Tooltip",
  "text": "Không có dữ liệu để xuất"
 },
 "W001-02": {
  "status": "active",
  "channel": "Tooltip",
  "text": "Không {0} được khi {1} đang ở trạng thái **{2}**"
 },
 "W001-03": {
  "status": "active",
  "channel": "Tooltip",
  "text": "Không xóa được vì {0}"
 },
 "W001-04": {
  "status": "active",
  "channel": "Inline",
  "text": "Phòng đã đủ sức chứa (**{0}**/**{1}**)"
 },
 "W001-05": {
  "status": "active",
  "channel": "Banner",
  "text": "**{0}** {1} quá hạn chưa {2}"
 },
 "W001-06": {
  "status": "active",
  "channel": "Banner",
  "text": "Người cai nghiện đã bỏ **{0}** buổi {1} trong đợt cai này"
 },
 "W001-07": {
  "status": "active",
  "channel": "Inline",
  "text": "{0} không còn đăng ký được lịch"
 },
 "W001-08": {
  "status": "draft",
  "channel": "Toast",
  "text": "Chưa có lịch hẹn nào qua quầy **{0}**"
 },
 "W001-09": {
  "status": "draft",
  "channel": "Toast",
  "text": "Chức năng đang phát triển"
 },
 "W001-10": {
  "status": "draft",
  "channel": "Inline",
  "text": "Dãy nhà **{0}** còn **{1}** lịch hẹn chưa diễn ra"
 },
 "W001-11": {
  "status": "draft",
  "channel": "Banner",
  "text": "Khung giờ này đã hết chỗ dành cho người đăng ký tại quầy"
 },
 "W001-12": {
  "status": "active",
  "channel": "Banner",
  "text": "Cần chọn đủ thông tin để tiếp tục: **{0}**"
 },
 "W001-13": {
  "status": "draft",
  "channel": "Banner",
  "text": "Giấy tờ chưa đạt **{0}**/**{1}** thân nhân"
 },
 "W001-14": {
  "status": "draft",
  "channel": "Banner",
  "text": "Cần đối chiếu giấy tờ cho **{0}**/**{1}** thân nhân"
 },
 "W001-15": {
  "status": "draft",
  "channel": "Popup",
  "text": "{0} còn **{1}** lịch hẹn chưa diễn ra. Nếu vẫn vô hiệu hóa, toàn bộ lịch hẹn này sẽ bị hủy với lý do Buồng / Quầy ngừng hoạt động."
 },
 "W001-16": {
  "status": "draft",
  "channel": "Popup",
  "text": "Sau khi vô hiệu hóa quầy này, dãy nhà **{0}** không còn quầy tiếp đón nào phục vụ và sẽ không đặt lịch thăm gặp trực tiếp được."
 },
 "W001-17": {
  "status": "draft",
  "channel": "Popup",
  "text": "Quầy sau khi vô hiệu hóa vẫn giữ các dãy nhà đang phục vụ. Muốn chuyển dãy nhà sang quầy khác, vui lòng vào Chỉnh sửa quầy này để gỡ dãy nhà đó, rồi thêm vào quầy mới."
 },
 "W001-18": {
  "status": "active",
  "channel": "Inline",
  "text": "Người cai nghiện chưa có quầy tiếp đón mặc định vì {0}. Quầy chọn tay sẽ được ghi vào Lịch sử thao tác"
 },
 "W001-19": {
  "status": "active",
  "channel": "Inline",
  "text": "Quầy đã chọn khác quầy phục vụ dãy nhà của người cai nghiện ({0}). Lựa chọn này sẽ được ghi vào Lịch sử thao tác"
 },
 "W001-20": {
  "status": "active",
  "channel": "Inline",
  "text": "Sau khi lưu, các thông báo gửi tiếp theo của lịch hẹn thuộc quầy này sẽ chuyển sang cán bộ phụ trách mới. Thông báo đã gửi trước đó không thay đổi"
 },
 "W001-21": {
  "status": "draft",
  "channel": "Inline",
  "text": "Thông báo đi cặp **{0}** (dùng khi {1}) vẫn đang **{2}** và không đổi theo dòng này"
 },
 "W001-22": {
  "status": "active",
  "channel": "Toast",
  "text": "Đã đổi quầy tiếp đón từ **{0}** sang **{1}** theo buồng thăm gặp vừa chọn"
 },
 "W001-23": {
  "status": "draft",
  "channel": "Inline",
  "text": "Lịch bị từ chối vẫn giữ buồng và lượt trong **{0}** giờ để chỉnh sửa và gửi duyệt lại. Quá hạn, hệ thống tự hủy lịch và nhả buồng"
 },
 "W001-24": {
  "status": "draft",
  "channel": "Inline",
  "text": "Lịch sẽ tự hủy lúc **{0}** nếu chưa được gửi duyệt lại"
 },
 "C001-01": {
  "status": "active",
  "channel": "destructive",
  "title": "Xác nhận xóa {0}",
  "body": "Bạn có chắc chắn muốn xóa {0} **{1}**? Hành động này không thể hoàn tác.",
  "ok": "Xóa {0}",
  "cancel": "Hủy"
 },
 "C001-02": {
  "status": "active",
  "channel": "destructive",
  "title": "",
  "body": "",
  "ok": "",
  "cancel": ""
 },
 "C001-03": {
  "status": "active",
  "channel": "destructive",
  "title": "Thay đổi chưa lưu",
  "body": "Bạn có thay đổi chưa lưu trên trang này. Nếu rời đi, các thay đổi sẽ bị mất.",
  "ok": "Rời khỏi và bỏ thay đổi",
  "cancel": "Ở lại trang"
 },
 "C001-04": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận gửi duyệt {0}",
  "body": "",
  "ok": "Gửi duyệt",
  "cancel": "Hủy"
 },
 "C001-05": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận duyệt {0}",
  "body": "{0} sẽ chuyển sang trạng thái **Đã duyệt**.",
  "ok": "Duyệt",
  "cancel": "Hủy"
 },
 "C001-06": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận từ chối {0}",
  "body": "",
  "ok": "Từ chối",
  "cancel": "Hủy"
 },
 "C001-07": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận gửi duyệt lại {0}",
  "body": "",
  "ok": "Gửi duyệt lại",
  "cancel": "Hủy"
 },
 "C001-08": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận hoàn thành {0}",
  "body": "",
  "ok": "Hoàn thành",
  "cancel": "Hủy"
 },
 "C001-09": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận vô hiệu hóa {0}",
  "body": "Bạn có chắc chắn muốn vô hiệu hóa {0} **{1}**? Bản ghi sẽ không còn xuất hiện trong danh sách chọn khi tạo mới.",
  "ok": "Vô hiệu hóa",
  "cancel": "Hủy"
 },
 "C001-10": {
  "status": "active",
  "channel": "neutral",
  "title": "",
  "body": "",
  "ok": "",
  "cancel": ""
 },
 "C001-11": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận kích hoạt {0}",
  "body": "{0} **{1}** sẽ chuyển sang trạng thái **Hoạt động** và được dùng để {2}.",
  "ok": "Kích hoạt",
  "cancel": "Hủy"
 },
 "C001-12": {
  "status": "draft",
  "channel": "workflow",
  "title": "Xác nhận điều chỉnh lịch hẹn",
  "body": "",
  "ok": "Xác nhận",
  "cancel": "Hủy"
 },
 "C001-13": {
  "status": "active",
  "channel": "workflow",
  "title": "Xác nhận vắng mặt lịch hẹn",
  "body": "Lịch hẹn **{0}** đã quá giờ hẹn mà thân nhân chưa đến. Lịch hẹn sẽ chuyển sang **Vắng mặt** và nhả buồng thăm gặp để xếp cho lượt khác.",
  "ok": "Xác nhận vắng mặt",
  "cancel": "Hủy"
 },
 "C001-14": {
  "status": "active",
  "channel": "destructive",
  "title": "Xác nhận hủy lịch hẹn",
  "body": "",
  "ok": "Xác nhận hủy lịch hẹn",
  "cancel": "Hủy"
 },
 "C001-15": {
  "status": "active",
  "channel": "workflow",
  "title": "",
  "body": "Bạn sắp phê duyệt **{0}** lịch hẹn đang ở trạng thái **{1}**:",
  "ok": "Xác nhận phê duyệt **{0}** lịch hẹn",
  "cancel": "Hủy"
 },
 "C001-16": {
  "status": "active",
  "channel": "workflow",
  "title": "",
  "body": "Bạn sắp từ chối duyệt **{0}** lịch hẹn đang ở trạng thái **{1}**:",
  "ok": "Xác nhận từ chối **{0}** lịch hẹn",
  "cancel": "Hủy"
 },
 "C001-17": {
  "status": "draft",
  "channel": "workflow",
  "title": "Xác nhận check-in khác ngày hẹn",
  "body": "Lịch hẹn đặt ngày {0}, khác ngày hôm nay. Thân nhân đến không đúng thời gian quy định thì Trưởng cơ sở xem xét, quyết định (khoản 1 Điều 34 Thông tư 79/2026/TT-BCA). Vẫn check-in cho thân nhân?",
  "ok": "Vẫn check-in",
  "cancel": "Hủy"
 },
 "C001-18": {
  "status": "draft",
  "channel": "workflow",
  "title": "Xác nhận đổi quầy buồng thăm gặp",
  "body": "Buồng **{0}** đang có **{1}** lịch hẹn chưa diễn ra. Chuyển sang **{2}** thì các lịch này phải nhả buồng **{0}** và đổi sang buồng khác.",
  "ok": "",
  "cancel": ""
 },
 "C001-19": {
  "status": "draft",
  "channel": "workflow",
  "title": "Xác nhận thay đổi khung giờ thăm gặp",
  "body": "Có **{0}** lịch hẹn chưa thực hiện nằm ngoài khung giờ mới. Nếu lưu, các lịch hẹn này sẽ bị hủy với lý do Thay đổi khung giờ thăm gặp, hệ thống thông báo cho người liên quan và đề nghị thân nhân đặt lại lịch",
  "ok": "",
  "cancel": ""
 },
 "C001-20": {
  "status": "draft",
  "channel": "workflow",
  "title": "Xác nhận {0} thông báo",
  "body": "Thông báo **{1}** sẽ chuyển sang trạng thái **{2}** sau khi xác nhận.",
  "ok": "Xác nhận",
  "cancel": "Hủy"
 },
 "SE001-01": {
  "status": "active",
  "channel": "Toast",
  "text": "{0} thất bại. Vui lòng thử lại"
 },
 "SE001-02": {
  "status": "active",
  "channel": "Popup",
  "text": "Hệ thống phát sinh lỗi. Vui lòng thử lại"
 },
 "SE001-03": {
  "status": "active",
  "channel": "Popup",
  "text": "Không có kết nối Internet. Vui lòng kiểm tra kết nối mạng rồi thử lại"
 },
 "SE001-04": {
  "status": "active",
  "channel": "Popup",
  "text": "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại"
 },
 "SE001-05": {
  "status": "draft",
  "channel": "Popup",
  "text": "Xác thực không thành công"
 },
 "SE001-06": {
  "status": "active",
  "channel": "Popup",
  "text": "Trang không tồn tại. Vui lòng kiểm tra lại đường dẫn"
 },
 "SE001-07": {
  "status": "active",
  "channel": "Popup",
  "text": "Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên để được hỗ trợ"
 },
 "SE001-08": {
  "status": "active",
  "channel": "Popup",
  "text": "Dữ liệu đã được thay đổi ở phiên khác. Vui lòng tải lại trang để cập nhật"
 },
 "SE001-09": {
  "status": "active",
  "channel": "Toast",
  "text": "Trình duyệt đã chặn cửa sổ in. Vui lòng cho phép cửa sổ bật lên rồi thử lại"
 }
};
