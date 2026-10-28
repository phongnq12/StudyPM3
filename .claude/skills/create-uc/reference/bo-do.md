# Bỏ dở — nhánh `*.E` rẽ từ bất kỳ bước nào

Phần tra cứu của skill [`create-uc`](../SKILL.md).

Tác nhân có thể rời UC ở bất kỳ bước nào: bấm Hủy, bấm Quay lại, đóng popup, chuyển menu, bấm Back
trình duyệt. Mục tiêu không đạt nên đây là **exception** — nhưng rẽ từ mọi bước, nên dùng một mã
`*.E[n]` thay vì `1.E1`, `2.E1`, `3.E1` giống hệt nhau. Dấu `*` theo Cockburn nghĩa là "bất kỳ bước nào".

**Bước ghi** là bước UC cam kết kết quả. Bỏ dở chỉ có nghĩa **trước** bước ghi. Mọi lần ghi trước bước
ghi là **ghi tạm** (xem phần lõi, tính chất "Một bước ghi").

**Không có `*.A`.** Một nhánh "từ bất kỳ bước nào mà vẫn thành công" gần như luôn là một UC bị giấu
(tự lưu nháp) — tách ra.

**Phân biệt với `N.E`:** `*.E` là **ra khỏi UC**. Đóng một popup con rồi quay lại một bước trong cùng
UC vẫn là `N.E` bình thường, kết thúc `quay về bước X`.

## Mặc định: không viết bảng, chỉ một dòng

Câu soát #6 trả lời bằng **một dòng** ở "Đã soát", đủ ba mảnh mà quy tắc chung không biết thay UC:

```
#6 theo quy tắc chung <mã kèm tên> · bước ghi: 4 · trước bước ghi: không ghi gì · về màn: /lich-hen
```

| Mảnh | Vì sao UC phải tự nói |
|---|---|
| `bước ghi` | Chỉ UC biết bước nào cam kết kết quả |
| `trước bước ghi` | Có ghi tạm gì không. Có thì liệt kê, và dẫn UC hệ thống dọn khi quá hạn |
| `về màn` | Bỏ xong thì người dùng đứng ở màn nào |

Có hộp xác nhận hay không, dữ liệu nhập mất hay giữ — việc của quy tắc chung. Dự án chưa có quy tắc
chung về rời form thì dẫn một `GD-xxxx`. UC không có dữ liệu nhập thì ghi `#6 không áp dụng (không có
dữ liệu nhập)`.

## Khi nào phải viết bảng `*.E[n]`

| Điều kiện | Vì sao |
|---|---|
| Có **ghi tạm** trước bước ghi | Phải nói hoàn tác cái gì, bằng cách nào |
| Cố ý làm khác quy tắc chung | Lệch chuẩn phải nêu lý do |
| Màn quay về phụ thuộc ngữ cảnh | Một dòng không chứa nổi |

| Dòng | Quy tắc |
|---|---|
| Tiêu đề | `#### *.E1 — <tên> (bước a–b)`, b = bước ghi − 1. Phạm vi gồm cả các bước của nhánh rẽ từ những bước đó |
| **Dòng đầu** | Cột `Bước` ghi `*`; `Mô tả` ghi phạm vi bằng lời; `Màn hình` là route của form; `Sở cứ` ghi `<điều kiện> — <nguồn>` |
| Các dòng giữa | `*.E1.1`… — điều khiển rời đi, hộp xác nhận nếu có, bước hoàn tác ghi tạm, bước về màn nào |
| **Dòng cuối** | `END (Exception)`, `Mô tả`: `dừng UC · dữ liệu đã nhập: xóa · bản ghi: <không tạo / không đổi / hoàn tác (<cái gì>)>` |

"Ở lại trang" không mở nhánh con — ghi ngay trong `Mô tả` của bước hiện hộp.

```markdown
#### *.E1 — Rời khỏi UC khi đã giữ chỗ tạm (bước 2–3)

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| * | Khách | Bất kỳ bước nào từ 2 đến 3, kể cả bước trong nhánh rẽ từ đó — khách chưa bấm «Đặt lịch» | /lich-hen/dat-lich | n/a | Form đã nhập, khách rời đi trước bước ghi — <span style="color:red">**<u>GD-0232</u>**</span> |
| *.E1.1 | Khách | Rời biểu mẫu | /lich-hen/dat-lich · nút "Hủy" · nút "Quay lại" · menu trái · Back trình duyệt | n/a | n/a |
| *.E1.2 | Hệ thống | Hỏi xác nhận rời trang; chọn [Ở lại trang] thì đóng hộp, tiếp tục bước đang dở | /lich-hen/dat-lich · hộp xác nhận | Bạn có thay đổi chưa lưu. Nếu rời đi, các thay đổi sẽ bị mất. | <span style="color:red">**<u>GD-0232</u>**</span> |
| *.E1.3 | Hệ thống | Nhả chỗ giữ tạm của bước 2, đóng biểu mẫu, về danh sách | /lich-hen | n/a | Chỗ giữ tạm nhả ngay khi rời, không đợi hết hạn — <span style="color:red">**<u>GD-0233</u>**</span> |
| END (Exception) | | *dừng UC · dữ liệu đã nhập: xóa · bản ghi: hoàn tác (chỗ giữ tạm ở bước 2 được nhả; không có `Lich_Hen`)* | | | |
```

`GD-0232`, `GD-0233` là mã minh họa.

## Các biến thể

| Biến thể | Xử lý |
|---|---|
| Bấm Hủy, Quay lại, đóng popup chứa form | Gộp vào `*.E[n]` hoặc dòng #6 |
| Chuyển menu, breadcrumb, Back trình duyệt | Gộp chung — chỉ khác điều khiển, liệt kê ở cột Màn hình |
| Đóng tab, tải lại trang, mất mạng | Luôn theo quy tắc chung, không bao giờ thành bảng — hệ thống không chạy được bước hoàn tác. Có ghi tạm thì **phải có UC tác nhân hệ thống dọn** khi quá hạn, và dòng #6 dẫn tới UC đó |
| Hết phiên đăng nhập | **Quy tắc chung của dự án**, không viết trong từng UC |

Script tìm mã nhánh dùng mẫu `(\d+|\*)\.[AE]\d+`.
