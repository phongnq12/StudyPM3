# Ma trận trạng thái × thao tác và sinh testcase

Phần tra cứu của skill [`create-sm`](../SKILL.md). Dùng khi viết mục "Ma trận trạng thái × thao tác" và khi
cần chứng minh tài liệu đủ để QC sinh testcase. Mọi ví dụ là **mã minh họa**, dùng máy Lịch hẹn của
[`chuyen-trang-thai.md`](chuyen-trang-thai.md) mục 8, khớp bảng chuyển chuẩn ở
[`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md) mục 4. Mã `N-04` và `S-02` là **mã minh
họa riêng của skill**, không thuộc bảng mã chuẩn.

## 1. Ma trận là gì, để làm gì

Ma trận là bảng **trạng thái × thao tác**: mỗi ô nói thao tác đó có được phép lên đối tượng ở trạng thái đó
không. Đây là bảng **rút gọn từ** bảng "trạng thái × sự kiện" của ISO/IEC/IEEE 29119-4 mục 5.2.8 (State
Transition Testing): chỉ giữ sự kiện là **thao tác của người** (👤) cộng thao tác không đổi trạng thái; sự kiện
⚙️ và 🔗 không có cột riêng, testcase của chúng sinh từ bảng chuyển (mục 5). Bảng chuyển chỉ cho thấy những
chuyển **có**; ma trận bắt buộc BA nhìn cả những ô **không có** — và theo 29119-4, chuyển không hợp lệ cũng
phải được test. Ô `—` là testcase âm chưa viết.

Lớp 4 **không viết testcase**; nó cung cấp nguồn để QC sinh testcase mà không phải đoán. Mã testcase
cấp ở specification layer, nên mọi mã trong tài liệu này (`H1`, `A1`…) chỉ là nhãn minh họa.

Template yêu cầu tối thiểu **một** ma trận, cho đối tượng phức tạp nhất. Dự án muốn thêm cho máy khác thì
nhân bản đúng mẫu mục, không đổi cột. Máy chỉ hai trạng thái thì ma trận không thêm gì so với bảng chuyển.

## 2. Dựng ma trận

| Bước | Làm gì | Lưu ý |
|---|---|---|
| 1 | **Cột** = mọi trạng thái của máy, đúng thứ tự ở bảng trạng thái, tên theo cột `Hiển thị`. Ghi `mục n` của máy ở dòng "Cột là **trạng thái** của …" | Đủ mọi trạng thái, kể cả ■ — ■ là nơi nhiều ô `—` nhất, và là nơi bug hay ở |
| 2 | **Hàng** = mỗi **thao tác** 👤 của máy một hàng, theo dạng `Thao tác — vai trò, XX-nn bước n` | Quyền tính theo **thao tác**, không theo dòng nguồn (lựa chọn của skill, xem `SM-07` ở [`dien-tung-muc.md`](dien-tung-muc.md)): hủy từ chờ duyệt và hủy từ đã duyệt là cùng một thao tác, một quyền, nên là **một hàng** với hai ô ✅. Hai chuyển khác vai hoặc khác quyền thì tách hàng |
| 3 | Thêm hàng cho **thao tác không đổi trạng thái** mà nghiệp vụ có: xem, sửa, xóa, in | Hàng **Sửa** sinh ra cột `Sửa được` của bảng trạng thái; hai bên phải khớp |
| 4 | Điền ✅ ở mỗi ô (thao tác, trạng thái nguồn) có dòng chuyển tương ứng; thao tác không đổi trạng thái thì ✅ ở những trạng thái mà nghiệp vụ cho phép | Điều kiện thêm của chuyển ghi kèm sau ✅, dẫn như cột `Điều kiện`: `✅ còn lượt: QC01 Đ5.1` |
| 5 | Mọi ô còn lại là `—` | Không để trống |
| 6 | Kiểm khớp với bảng chuyển, bảng trạng thái và dòng **Cấm** (mục 3) | |

Không đưa vào ma trận: chuyển tạo mới `→ DRAFT` (không có trạng thái nguồn — testcase hợp lệ của nó nằm
ở bảng chuyển), chuyển ⚙️ và 🔗 (không phải thao tác của người; testcase của chúng, kể cả testcase âm khi sự
kiện tới lúc đối tượng ở trạng thái sai, sinh từ bảng chuyển và mục sự kiện ngoài — mục 5).

## 3. Quy tắc khớp

| Quy tắc | Phát hiện lỗi gì |
|---|---|
| Mỗi cặp (chuyển 👤, trạng thái nguồn) có đúng **một** ô ✅ ở hàng của thao tác và cột trạng thái nguồn (dòng chuyển gộp nhiều nguồn cho nhiều ô) | Ma trận thiếu chuyển hoặc bảng chuyển thiếu dòng |
| Mỗi ô ✅ ở hàng của một thao tác 👤 có dòng chuyển tương ứng | Ma trận thừa quyền |
| Hàng **Sửa**: ✅ ở trạng thái nào thì cột `Sửa được` của trạng thái đó là ✅ | Hai bảng nói khác nhau về sửa |
| Cột của trạng thái ■: toàn `—`, trừ ô của ngoại lệ `SM-05` đã ghi trong bảng chuyển (nếu máy có) | `SM-05` bị vi phạm lặng lẽ |
| Mọi thao tác ở dòng **Cấm** là ô `—`; ô `—` không cần lặp lại ở dòng Cấm | Dòng Cấm nói cấm mà ma trận cho phép |
| Hai chuyển cùng hàng nhưng khác quyền (`SM-07`) thì tách hàng; cùng thao tác, cùng quyền, khác trạng thái nguồn thì giữ một hàng | Một quyền che hai chuyển, hoặc một thao tác bị tách thành nhiều quyền |

Dòng cuối của mục: *Ô — hiện nút vô hiệu kèm lý do, hoặc ẩn — quyết định ở SRS*. Lớp 4 **không** chọn cách
hiện; chỉ nói ô đó bị cấm.

## 4. Ví dụ ma trận (minh họa)

Cột là **trạng thái** của lịch hẹn — mục 2.

| Thao tác — ai | Nháp | Chờ duyệt | Đã duyệt | Đã đến hẹn | Từ chối | Đã hủy |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| Xem — Khách, Nhân viên tiếp đón | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sửa — Khách, LH-01 bước 1 | ✅ | — | — | — | — | — |
| Gửi duyệt — Khách, LH-01 bước 1–3 | ✅ còn lượt trong tuần của ngày hẹn: `QC01 Đ5.1` | — | — | — | — | — |
| Duyệt — Nhân viên tiếp đón, LH-01 bước 4 | — | ✅ trước ngày hẹn: `QC01 Đ6.1`; khác người lập: `QC01 Đ6.3` | — | — | — | — |
| Từ chối — Nhân viên tiếp đón, LH-01 bước 4 | — | ✅ bắt buộc lý do: `SM-06` | — | — | — | — |
| Hủy — Khách, LH-02 | — | ✅ | ✅ | — | — | — |

Ô **—** hiện nút vô hiệu kèm lý do, hoặc ẩn — quyết định ở SRS.

Kiểm khớp theo mục 3: bốn dòng chuyển 👤 của bảng chuyển (gửi duyệt, duyệt, từ chối, hủy — hủy gộp hai trạng thái
nguồn) ứng với đúng sáu cặp (chuyển, nguồn), tức sáu ô ✅; hàng Sửa ✅ chỉ ở Nháp khớp cột `Sửa được` của máy;
cột `Đã đến hẹn`, `Từ chối`, `Đã hủy` (■) toàn `—`, và `Đã duyệt` (không phải ■) có ✅ ở ô Hủy. Điều kiện của
chuyển hủy chỉ là trạng thái nguồn nên ô không ghi điều kiện thêm; trả lượt hay ghi `huy_muon` là hệ quả, không
nằm ở ma trận. Chuyển hủy ở ví dụ này không đòi lý do — ngoại lệ của `SM-06` theo bảng chuyển chuẩn.

## 5. Sinh testcase theo 29119-4

Ba nguồn, mỗi nguồn một quy tắc:

| Nguồn | Quy tắc | Số testcase tối thiểu |
|---|---|---|
| Mỗi **dòng** bảng chuyển | ≥ 1 testcase **hợp lệ**: đưa đối tượng tới trạng thái nguồn, thực hiện sự kiện với điều kiện đúng, kiểm trạng thái đích **và từng mục ở cột `Hệ quả`** | 1 mỗi dòng, và 1 mỗi trạng thái nguồn khi dòng gộp nhiều nguồn. Hệ quả rẽ nhánh (trả lượt hay ghi `huy_muon`) thì 1 mỗi nhánh |
| Mỗi **điều kiện** ở cột `Điều kiện` | ≥ 1 testcase **âm**: làm điều kiện sai, thực hiện sự kiện, kiểm **bị từ chối, trạng thái giữ nguyên, hệ quả không xảy ra** | 1 mỗi điều kiện. Điều kiện có biên thì thêm testcase ở biên |
| Mỗi chuyển ⚙️ hoặc 🔗 | ≥ 1 testcase âm: sự kiện tới lúc đối tượng **không** ở trạng thái nguồn (mỗi trạng thái khác, hoặc đại diện nhóm), kiểm không chuyển, không hệ quả | 1 mỗi chuyển ⚙️ hoặc 🔗 |
| Mỗi ô **—** của ma trận | ≥ 1 testcase âm: đưa đối tượng tới trạng thái đó, thử thao tác, kiểm bị từ chối hoặc không thể thực hiện (nút vô hiệu hay ẩn theo SRS) | 1 mỗi ô; được gom thành một testcase tham số hóa theo hàng, nhưng **mỗi ô vẫn chạy một lần** |

Thêm các testcase đến từ nguyên tắc chung:

| Nguyên tắc | Testcase |
|---|---|
| `SM-04` | Hai người cùng duyệt một lịch (hoặc bấm hai lần): lần hai báo *bản ghi đã được xử lý*, chỉ ghi một lần |
| `SM-06` | Từ chối, hủy, trả về, mở lại thiếu lý do: bị từ chối |
| `SM-07` | Người lập tự duyệt: bị từ chối |
| `SM-08` | Chuyển kéo theo ghi sổ mà một vế lỗi: cả giao dịch hoàn tác, trạng thái giữ nguyên |
| Chuyển hết thời gian | Đúng hạn: chưa chuyển. Vừa quá hạn: chuyển. Chạy lại `N-xx`: không chuyển lần hai |
| ■ | Thử mọi thao tác lên ■: mọi ô `—` bị từ chối; ngoại lệ ghi trong bảng chuyển vẫn được |

### Ví dụ — testcase sinh ra từ máy Lịch hẹn (minh họa)

| Nhãn | Loại | Từ | Sự kiện | Điều kiện đặt ra | Mong đợi |
|---|---|---|---|---|---|
| H1 | Hợp lệ | (tạo mới) | Khách lập lịch | n/a | `DRAFT`; không giữ lượt |
| H2 | Hợp lệ | `DRAFT` | Khách gửi duyệt | Còn lượt trong tuần của ngày hẹn | `PENDING_APPROVAL`; `Quy_Luot` giữ một lượt cùng giao dịch |
| H3 | Hợp lệ | `PENDING_APPROVAL` | Nhân viên duyệt | Trước ngày hẹn, khác người lập; kể cả khi lịch này đang chiếm lượt cuối của tuần | `APPROVED`; khách được báo; không kiểm lại lượt, quỹ lượt không đổi |
| H4 | Hợp lệ | `PENDING_APPROVAL` | Nhân viên từ chối | Có lý do | `REJECTED`; trả lượt cùng giao dịch; khách được báo |
| H5 | Hợp lệ | `PENDING_APPROVAL` | `N-04` chạy 🧪 | Quá ngày hẹn mà chưa duyệt | `REJECTED` lý do *quá hạn*; trả lượt; khách được báo |
| H6 | Hợp lệ | `PENDING_APPROVAL` | Khách hủy | Hủy trước giờ hẹn ít nhất `CH-02` giờ | `CANCELLED`; trả lượt (`BR-A03`) |
| H7 | Hợp lệ | `PENDING_APPROVAL` | Khách hủy | Hủy trong khoảng ngắn hơn `CH-02` giờ | `CANCELLED`; ghi `huy_muon` = đúng, **không** trả lượt (`BR-A03`) |
| H8 | Hợp lệ | `APPROVED` | Khách hủy | Hủy trước giờ hẹn ít nhất `CH-02` giờ | `CANCELLED`; trả lượt. Nhánh hủy muộn từ `APPROVED` tương tự H7 |
| H9 | Hợp lệ | `APPROVED` | `N-02` chạy | Đã qua ngày hẹn | `COMPLETED`; không ghi sổ |
| A1 | Âm — điều kiện | `DRAFT` | Khách gửi duyệt | Đã hết lượt trong tuần | Bị từ chối; vẫn `DRAFT`; không giữ lượt |
| A2 | Âm — điều kiện | `PENDING_APPROVAL` | Nhân viên duyệt | Đã tới hoặc qua ngày hẹn | Bị từ chối; vẫn `PENDING_APPROVAL`; lượt vẫn giữ |
| A3 | Âm — `SM-07` | `PENDING_APPROVAL` | Duyệt | Người duyệt là người lập | Bị từ chối |
| A4 | Âm — `SM-06` | `PENDING_APPROVAL` | Từ chối | Không có lý do | Bị từ chối |
| A5 | Âm — hết thời gian | `PENDING_APPROVAL` | `N-04` chạy | Chưa tới ngày hẹn | Không chuyển |
| A6 | Âm — `SM-04` | `PENDING_APPROVAL` | Nhân viên duyệt lần hai | Bản ghi đã `APPROVED` | Báo *bản ghi đã được xử lý*; không ghi lần nữa |
| A7 | Âm — ⚙️ sai trạng thái | mỗi trạng thái khác `APPROVED`, và `APPROVED` chưa qua ngày hẹn | `N-02` chạy | n/a | Không chuyển; không có `COMPLETED` nào được đặt |
| A8…A31 | Âm — ô `—` | mỗi ô `—` của ma trận | thao tác của hàng | n/a | Bị từ chối; trạng thái giữ nguyên. 24 ô: Sửa 5, Gửi duyệt 5, Duyệt 5, Từ chối 5, Hủy 4 |

Cộng lại: chín testcase hợp lệ, bảy testcase âm theo điều kiện, nguyên tắc chung và sự kiện ⚙️, hai mươi bốn
testcase âm theo ô `—`. Con số này là **sàn**: reviewer của lớp 4 kiểm được tài liệu đủ sinh chừng đó, không
kiểm từng testcase.

## 6. Việc của người viết SM

| Việc | Cách kiểm |
|---|---|
| Mỗi dòng chuyển có cột `Hệ quả` đủ để viết "kiểm hệ quả" của testcase hợp lệ | Hệ quả "cập nhật dữ liệu" chung chung thì không viết được mong đợi — sửa lại |
| Mỗi điều kiện có thể làm sai được | Điều kiện kiểu "hợp lệ" không làm sai được — viết lại thành cái cụ thể hoặc dẫn BR cụ thể |
| Mỗi ô `—` đúng là cấm, không phải "chưa nghĩ" | Ô `—` còn tranh cãi thì ghi `S-xx`, không để cấm giả |
| Số cặp (chuyển 👤, trạng thái nguồn) ở bảng chuyển = số ô ✅ có hàng chuyển của ma trận | Đếm hai bên; dòng gộp nhiều nguồn đếm mỗi nguồn một lần |
