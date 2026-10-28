# Sổ giả định và điểm cần chốt — Business Layer {{DỰ ÁN}}

Sổ này ghi lại mọi chỗ mà đầu vào `/ba-init` (văn bản pháp luật, dự toán, tài liệu khách hàng) chưa nói
rõ, nói mâu thuẫn, hoặc cần người có thẩm quyền quyết. Mỗi dòng có một giả định tạm để công việc chạy tiếp
được, kèm danh sách các lớp sẽ phải sửa lại khi giả định được chốt.

## Cách dùng

- **Giả định** là một điều tài liệu coi là đúng để đi tiếp mà **không tìm được căn cứ** trong đầu vào
  `/ba-init` và các lớp đã có. **Chỉ người** tạo giả định; AI ghi ❓ `[CẦN BA CHỐT]` kèm một dòng câu hỏi
  có đề xuất mặc định trong tài liệu đang viết, BA quyết có đưa vào sổ hay không.
- Mỗi giả định là một dòng, mã `GD-xxxx` (bốn chữ số) tăng dần, kèm anchor `<a id="GD-xxxx"></a>`, không
  dùng lại mã đã xóa. Nhiều người ghi song song thì cấp mã tạm theo người (`GD-<tên>-1`), chủ sổ đánh lại.
- Cột **Lớp bị ảnh hưởng** là **loại** của giả định, ghi số lớp: `1` BRD · `2` Quy trình · `3` ERD ·
  `4` Máy trạng thái · `5` Tác nhân và Use case · `6` Business rule. Chạm nhiều lớp thì ghi đủ.
- Cột **Mã liên quan** ghi mã đối tượng trong các lớp (`BRQ-03`, `LH-01 bước 2`, `Lich_Hen`, `SM mục 2`,
  `BR-A01`, mã UC) và mã câu hỏi `Q-…` đã sinh ra giả định này. Lớp chưa có thì để trống, điền khi có.
- Mỗi lần dẫn `GD-xxxx` trong thân tài liệu thì bôi đỏ, đậm, gạch chân:
  `<span style="color:red">**<u>GD-0001</u>**</span>`. Dẫn một mã đứng trên giả định thì mang theo giả
  định đó (`00_quy_uoc_chung.md` mục 9).
- Hai cột đi cùng nhau: **Trạng thái** cho biết dòng đã đi tới đâu, **Mức xác nhận** cho biết ai chốt và
  dựa vào đâu.
- Cột **Trạng thái** nhận một trong năm giá trị:

| Trạng thái | Nghĩa |
|---|---|
| `Đang mở` | Chưa có câu trả lời, các lớp đang dùng giả định tạm |
| `Đang hỏi tiếp` | Đã có câu trả lời một phần, còn câu hỏi phụ (ghi "Còn hỏi" trong Kết quả chốt) |
| `Đã chốt` | Đã có kết quả, nhưng các lớp liên quan chưa sửa hết theo kết quả đó |
| `Đã cập nhật lớp` | Mọi lớp liên quan đã sửa theo kết quả; cột **Đã cập nhật ở** ghi rõ sửa ở đâu |
| `Hủy` | Hết ý nghĩa. Kết quả chốt ghi lý do hoặc mã thay thế. Không xóa dòng |

- Cột **Mức xác nhận** nhận một trong ba giá trị, để trống khi dòng còn `Đang mở` hoặc đã `Hủy`:

| Mức xác nhận | Nghĩa |
|---|---|
| `Giả định BA` | Một người trong team sản xuất chốt, chưa có xác nhận của khách hàng. Kết quả chốt ghi tên người chốt và ngày |
| `Theo VBPL` | Văn bản pháp luật đã nói rõ. Kết quả chốt ghi điều khoản đủ số hiệu, ví dụ `QC01 Đ5.1` |
| `Khách hàng xác nhận` | Có biên bản hoặc văn bản của khách hàng. Kết quả chốt ghi tên văn bản và ngày |

- Khi chốt xong: điền **Kết quả chốt** và **Mức xác nhận**, chuyển sang `Đã chốt`. Sửa xong các lớp liên
  quan thì ghi vào **Đã cập nhật ở** rồi chuyển sang `Đã cập nhật lớp`. Lớp nào chưa viết thì chưa thể
  coi là đã cập nhật; khi đó dòng vẫn để `Đã chốt`, cột Đã cập nhật ở chỉ ghi phần đã sửa (ví dụ
  `Lớp 2: LH-01 (bản v01)`).
- Tài liệu dẫn một giả định chưa ở `Đã chốt` hoặc `Đã cập nhật lớp` — trực tiếp hay kế thừa — thì **không
  được** chuyển `Đã duyệt` (`00_quy_uoc_chung.md` mục 12). Script
  `.claude/skills/ba-overview/scripts/kiem_business_layer.py` in bảng giả định mở theo từng tài liệu.

## Danh sách

| Mã | Ngày ghi | Vấn đề / điều chưa rõ | Nguồn (hint) | Giả định tạm đang dùng | Lớp bị ảnh hưởng | Mã liên quan | Cần ai chốt | Trạng thái | Mức xác nhận | Kết quả chốt | Đã cập nhật ở |
|---|---|---|---|---|---|---|---|---|---|---|---|
| <a id="GD-0001"></a>GD-0001 | {{DD/MM/YYYY}} | {{}} | {{}} | {{}} | {{}} | {{}} | {{}} | Đang mở | | | |
