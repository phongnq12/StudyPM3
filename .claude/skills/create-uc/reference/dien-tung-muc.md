# Điền từng mục của TEMPLATE_UC

Phần tra cứu của skill [`create-uc`](../SKILL.md). Đọc phần lõi trước.

## Phần đầu file

Bốn dòng, chỉ chứa những gì **không** nằm trong thân file:

| Trường | Điền gì |
|---|---|
| `id` | `[tên PM].[mã L1].[mã L2]`. Chưa cấp thì `null` |
| `ten` | Bắt buộc. Động từ + đối tượng: "Đặt lịch hẹn", không phải "Màn đặt lịch" |
| `domain` | Tên domain bằng chữ; có mã rồi thì mã kèm tên |
| `trang_thai` | `nhap` · `cho-duyet` · `da-chot` · `da-thay-the`. Ràng buộc chuyển trạng thái: xem "Ba giá trị đặc biệt" ở phần lõi |

Bảng **Lịch sử phiên bản**: ngày ghi `DD/MM/YYYY`. Mỗi dòng ghi trạng thái cuối của phiên bản đó,
không kể lại các lần sửa giữa chừng.

Mọi thứ khác — thực thể, trạng thái, quy tắc, giả định, màn hình — đều nằm trong các bảng của thân
file. Không chép lại lên đầu. Khi dự án có script dựng bảng truy vết, script đọc thân file.

## Mục 1 — Overview

**Định nghĩa:** bản tóm tắt UC gói trong một màn hình — UC phục vụ việc gì, bắt đầu từ đâu, kết thúc
ra sao, mà không phải đọc hết luồng mới hiểu. Mỗi dòng một câu.

| Dòng | Điền gì | Viết thế nào |
|---|---|---|
| Điều kiện cần | Điều kiện hệ thống **bảo đảm ở điểm vào** | Những thứ quy tắc chung đã lo — ẩn nút khi sai trạng thái, chặn route khi thiếu quyền, chỉ liệt kê bản ghi hợp lệ. Ghi để người đọc biết tiền đề, **không viết lại thành bước trong luồng**. Nhưng **backend vẫn phải chặn** khi ai đó gọi thẳng API. Điều kiện nào UC xử lý **khác** quy tắc chung thì không ở đây — nó là một exception flow |
| Bắt đầu khi | **Vì sao** tác nhân làm việc này | Kiểu user story: *"Là khách, tôi muốn đặt lịch để không phải xếp hàng"* |
| Trigger tại đâu | **Ở đâu** UC được kích hoạt | Không nhất thiết là một nút — có thể là element bất kỳ, quy tắc tự chạy, sự kiện từ module khác, lịch tới hạn. Ghi `route · điều khiển`; lịch chạy ghi kèm múi giờ. **UC có nhiều điểm vào thì liệt kê đủ**: trigger chính ứng với main flow, mỗi trigger phụ trỏ tới mã nhánh `0.A[n]` của nó — *"Chính: `/lich-hen · nút "Đặt lịch"`. Phụ: `/khach-hang/:id · nút "Đặt lịch"` → `0.A1`"* |
| Kết quả chính | **Trạng thái cuối** được coi là thành công của thực thể chính | Một câu để đọc. Có đổi trạng thái thì ghi chuyển đổi, **liệt kê đủ trạng thái trước** vì đó là guard dev phải code: *"`Lich_Hen` chuyển từ `DRAFT` sang `PENDING_APPROVAL`"*. Thao tác theo lô: *"mỗi bản ghi kết thúc ở `SENT` hoặc `FAILED`"*. Phần kiểm được chi tiết nằm ở `END (Main)` |

## Mục 2 — Tác nhân và phạm vi quyền

**Định nghĩa:** ai được thực hiện UC này, và trong phạm vi bản ghi nào. Đây là chỗ sinh ra điều kiện
lọc dữ liệu cho Dev.

**Permission key không ghi trong file UC.** Nó nằm ở cột `Permission key` của **Use case list** (lớp
5), một dòng một UC — để nhìn một lần thấy key trùng, key thiếu. Viết UC mới mà Use case list chưa có
dòng thì thêm dòng; key chưa đặt thì `chưa chốt (<ai>)`. UC không cần quyền thì `n/a`.

| Dòng | Điền gì | Lưu ý |
|---|---|---|
| Tác nhân chính | Tên vai trò, hoặc hệ thống | Nhiều vai thì liệt kê đủ. Hệ thống ngoài gọi vào thì ghi kèm cơ chế xác thực máy–máy |
| Bên nhận kết quả | Người hoặc hệ thống khác nhận thông tin từ UC này | Ghi kèm `đồng bộ` hay `bất đồng bộ`. Không có thì `n/a` |
| Phạm vi dữ liệu | Tác nhân thấy và sửa được bản ghi nào | Dạng điều kiện lọc: *"bản ghi có `don_vi_id` = đơn vị của tác nhân"*. Đọc khác sửa thì ghi hai dòng; nhiều vai khác phạm vi thì ghi theo từng vai. Áp cho cả truy cập theo id |

## Mục 3 — Cột của ba bảng luồng

| Cột | Điền gì |
|---|---|
| Bước | Main flow: `START`, `1`, `2`, `3`, `END (Main)`. Nhánh: `2.A1.1`, `2.E1.1`, `*.E1.1`; dòng kết thúc exception: `END (Exception)` |
| Tác nhân | Ai làm bước này. Hệ thống tự làm thì ghi tên hệ thống. Bước hệ thống giữa luồng mặc định **cùng request** với bước trước; chạy nền thì thêm `[chạy nền]` cuối Mô tả |
| Mô tả | Việc gì xảy ra, ở mức ý định. Một bước = một động từ + một đối tượng, và có ít nhất một thứ quan sát được |
| Màn hình | `route · điều khiển`. Hệ thống tự làm thì `n/a` |
| Message thông báo (nếu có) | Nội dung thông báo, **chép đúng chuỗi trong prototype**. Dự án có danh mục message thì ghi mã kèm nội dung. Không có thì `n/a` |
| Sở cứ | 0–n nguồn, cách nhau bằng `·`. Bắt buộc cho bước có kiểm tra, quyết định, ghi, gửi đi; bước chỉ nhập liệu hoặc điều hướng thì `n/a` |

Quy ước mọi ô:

- **Điền tường minh, kể cả khi trùng với ô ngay trên.** Không viết "như trên".
- Không có gì thì `n/a`; chưa biết thì `chưa chốt (<ai>)`. Đừng để trống.
- Bước **gọi sang UC khác**: `Mô tả` chỉ ghi `→ gọi UC <mã> <tên> (màn | API | màn + API)`. Không
  chép nội dung UC đó. Quyền của UC được gọi kiểm độc lập — thiếu quyền thì là exception của UC này.

| Viết thế này | Đừng viết thế này |
|---|---|
| Chọn ngày, khung giờ và người đi cùng | Click dropdown, chọn item, bấm nút Lưu |
| Kiểm còn lượt trong tuần và khung giờ còn chỗ | Validate dữ liệu |
| Tạo lịch hẹn ở trạng thái chờ duyệt, giữ lượt | Insert vào bảng `lich_hen` |
| → gọi UC DA1.WEB.02.01.05 Chọn khách hàng (màn) | Mở popup, gõ tìm, chọn dòng, bấm Chọn |

## Main flow

| Dòng | Quy tắc |
|---|---|
| **Dòng đầu** | Cột `Bước` ghi `START`. Cột `Mô tả` gộp `Bắt đầu khi` và **trigger chính** thành một câu. Cột `Màn hình` là màn chứa trigger chính |
| **Dòng cuối** | Cột `Bước` ghi `END (Main)`. Cột `Mô tả` ghi **dữ liệu nào được tạo hay sửa, và còn thấy ở đâu sau khi tải lại trang**. Cột `Màn hình` là màn đứng lại. Khớp `Kết quả chính` |

Main flow **không chứa nhánh rẽ** — viết "nếu… thì…" trong `Mô tả` là dấu hiệu phải tách nhánh.

## Alternative flows

Mỗi nhánh một bảng, tiêu đề là mã nhánh kèm tên.

| Dòng | Quy tắc |
|---|---|
| **Dòng đầu** | Bước gốc **chép y nguyên** từ main flow. Chỉ khác cột `Sở cứ`: ghi `<điều kiện rẽ> — <nguồn>`. **Ngoại lệ:** nhánh `0.A` — xem mục dưới |
| Các dòng giữa | `2.A1.1`, `2.A1.2`… |
| **Dòng cuối** | Nói rõ nhập lại bước mấy, hoặc tới `END (Main)` |

Mô tả dòng đầu giữ nguyên vì bước 2 của main flow và bước 2 ở đầu nhánh **là cùng một bước**; điều
kiện làm luồng rẽ là sở cứ, nên nằm ở cột `Sở cứ`.

```markdown
#### 2.A1 — Khung giờ đã chọn hết chỗ, chọn khung giờ kế tiếp còn chỗ

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| 2 | Hệ thống | Kiểm quyền và chỗ trống của khung giờ | n/a | n/a | Khung giờ đã đủ 10 chỗ, không nhận thêm — QuyDinh_12-2026.docx Điều 5 khoản 1 |
| 2.A1.1 | Hệ thống | Gợi ý tối đa 3 khung giờ gần nhất trong cùng ngày còn chỗ | /lich-hen/dat-lich · khối "Khung giờ gợi ý" | Khung giờ này đã đủ chỗ, bạn có thể chọn một khung giờ khác bên dưới | Gợi ý tối đa 3 khung, cùng ngày — <span style="color:red">**<u>GD-0231</u>**</span> |
| 2.A1.2 | Khách | Chọn một khung giờ trong danh sách gợi ý, nhập lại bước 3 | /lich-hen/dat-lich · khối "Khung giờ gợi ý" | n/a | n/a |
```

Bước `2.A1.2` chỉ là nhập liệu nên `Sở cứ` là `n/a` — điều khoản về giới hạn chỗ đã nằm ở dòng đầu,
gắn lại nó vào bước "chọn" là gắn sai nghĩa.

### Nhánh từ điểm vào khác — `0.A[n]`

Một UC mở được từ nhiều chỗ: đặt lịch từ danh sách lịch hẹn, hoặc từ trang chi tiết một khách hàng.
Điểm vào khác là alternative `0.A[n]` khi **đủ cả bốn điều kiện** — cùng tác nhân, cùng permission
key, cùng `Kết quả chính`, nhập lại main flow trước bước ghi. Thiếu một điều kiện thì là UC khác; bảng
phân biệt nằm ở phần lõi, mục "Một UC to bằng nào".

Nhánh `0.A` là **ngoại lệ duy nhất** của quy tắc "dòng đầu chép y nguyên bước gốc", vì nó không rẽ
từ một bước có sẵn mà bắt đầu ở chỗ khác:

| Dòng | Quy tắc |
|---|---|
| **Dòng đầu** | Cột `Bước` ghi `START`. `Mô tả` là bước mở đầu riêng của điểm vào này; `Màn hình` là trigger phụ; `Sở cứ` ghi **điều kiện vào**: `<ngữ cảnh mở> — <nguồn>` |
| Các dòng giữa | `0.A1.1`, `0.A1.2`… — những gì điểm vào này làm khác: dữ liệu điền sẵn, bước được bỏ qua |
| **Dòng cuối** | Nói rõ **nhập lại bước mấy** của main flow. Bước đó phải đứng trước bước ghi |

Trigger phụ phải được liệt kê ở dòng `Trigger tại đâu` của mục 1 và trỏ đúng mã nhánh.

Ví dụ — main flow của UC "Đặt lịch hẹn" (tác nhân: Nhân viên tiếp đón, bước ghi là bước 4):

| Bước | Tác nhân | Mô tả | Màn hình |
|---|---|---|---|
| START | n/a | Nhân viên muốn đặt lịch cho một khách, bấm «Đặt lịch» ở danh sách lịch hẹn | /lich-hen · nút "Đặt lịch" |
| 1 | Nhân viên tiếp đón | → gọi UC DA1.WEB.02.01.05 Chọn khách hàng (màn) | /lich-hen/dat-lich · ô "Khách hàng" |
| 2 | Nhân viên tiếp đón | Chọn ngày và khung giờ | /lich-hen/dat-lich |
| 3 | Hệ thống | Kiểm quyền và chỗ trống của khung giờ | n/a |
| 4 | Hệ thống | Tạo lịch hẹn ở trạng thái chờ duyệt | n/a |
| END (Main) | n/a | `Lich_Hen` trạng thái `PENDING_APPROVAL` thấy ở /lich-hen sau tải lại | /lich-hen |

```markdown
#### 0.A1 — Đặt lịch từ trang chi tiết khách hàng

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| START | n/a | Nhân viên đang xem hồ sơ một khách, bấm «Đặt lịch» ngay trên hồ sơ | /khach-hang/:id · nút "Đặt lịch" | n/a | Mở từ hồ sơ một khách đang hoạt động — <span style="color:red">**<u>GD-0234</u>**</span> |
| 0.A1.1 | Hệ thống | Mở biểu mẫu đặt lịch với khách hàng đã điền sẵn từ hồ sơ, không cho đổi khách | /lich-hen/dat-lich · ô "Khách hàng" (chỉ đọc) | n/a | <span style="color:red">**<u>GD-0234</u>**</span> |
| 0.A1.2 | Nhân viên tiếp đón | Nhập lại bước 2 của main flow | /lich-hen/dat-lich | n/a | n/a |
```

Mục 1 của UC này ghi: *"Trigger tại đâu — Chính: `/lich-hen · nút "Đặt lịch"`. Phụ:
`/khach-hang/:id · nút "Đặt lịch"` → `0.A1`."* `GD-0234` là mã minh họa.

Nếu khách trên hồ sơ đã bị khóa thì không cần `0.E`: nút bị ẩn (thuộc `Điều kiện cần`), hoặc bị chặn ở
bước kiểm của main flow (thành `3.E[n]`).

## Exception flows

Mỗi nhánh một bảng, mã `[bước gốc].E[STT]`.

| Dòng | Quy tắc |
|---|---|
| **Dòng đầu** | Bước gốc chép y nguyên. Cột `Sở cứ` ghi `<điều kiện rơi vào nhánh> — <nguồn>` |
| Các dòng giữa | `2.E1.1`, `2.E1.2`… |
| **Dòng cuối** | Một trong ba dạng dưới, luôn kèm `dữ liệu đã nhập` và `bản ghi` |

| Dòng cuối | Khi nào | Cột Bước | Cột Mô tả |
|---|---|---|---|
| Quay về | Người dùng sửa được và làm lại — **UC còn chạy** | bỏ trống | `(quay về bước X) · dữ liệu đã nhập: … · bản ghi: …` |
| Dừng | Không còn đường nào trong UC này | `END (Exception)` | `dừng UC · dữ liệu đã nhập: … · bản ghi: …` |
| Chuyển | Việc tiếp theo thuộc UC khác | `END (Exception)` | `chuyển sang UC <mã> <tên> · dữ liệu đã nhập: … · bản ghi: …` |

| Phần | Giá trị | Nghĩa |
|---|---|---|
| dữ liệu đã nhập | `giữ` / `xóa` | Form còn nguyên, hay về trạng thái ban đầu |
| bản ghi | `không tạo` | UC chưa ghi kết quả, không có ghi tạm |
| | `không đổi` | Bản ghi đã có giữ nguyên |
| | `hoàn tác (<cái gì>)` | Có ghi tạm trước đó, hệ thống phải nhả hoặc xóa — nói rõ cái gì |

Exception **không ghi kết quả mới**; ghi tạm đã có thì phải hoàn tác. Hết phiên đăng nhập không viết
trong từng UC — là quy tắc chung của dự án.

```markdown
#### 2.E1 — Hết lượt đặt lịch trong tuần

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| 2 | Hệ thống | Kiểm quyền và chỗ trống của khung giờ | n/a | n/a | Đã dùng đủ 2 lượt trong tuần, tuần tính từ thứ Hai — QuyDinh_12-2026.docx Điều 5 khoản 1 |
| 2.E1.1 | Hệ thống | Báo không đặt được, nêu lý do ở mức chung | /lich-hen/dat-lich · hộp thông báo | Bạn đã dùng hết lượt đặt lịch trong tuần này | QuyDinh_12-2026.docx Điều 9 khoản 2 |
| | | *(quay về bước 1) · dữ liệu đã nhập: giữ · bản ghi: không tạo* | | | |
```

## Khối hướng dẫn nền xám

Viết xong UC thì **xóa toàn bộ** khối nền xám, chỉ giữ dòng link tới skill. Giữ lại thì mỗi UC cõng bảy
khối hướng dẫn, và chúng lệch khỏi skill ngay sau lần sửa skill đầu tiên.

## Ranh giới với quy trình

Quy trình là nhiều người, nhiều lượt, có chuyển giao hoặc khoảng chờ. UC là phần nằm **bên trong một
bước "người làm trên hệ thống"** của quy trình. Thấy mình chép lại bảng bước của quy trình thì thay
bằng mã bước quy trình kèm tên. Thấy một bước phải **chờ** việc khác xảy ra thì bước đó không thuộc UC
này — nó là ranh giới sang UC khác.
