# Danh mục màn presales — <tên dự án>
| Nguồn | Số màn (MP) | Cập nhật | Trạng thái |
| --- | --- | --- | --- |
| [SRC: 0-inputs/presales/prototype/] | | YYYY-MM-DD | draft |

**File này dùng để làm gì.** Liệt kê mọi màn khách đã thấy trên prototype lúc chào giá, mỗi màn một mã `MP-xxx`, và
cho biết màn đó phục vụ UC presales nào. Đây là mốc phạm vi về giao diện: màn khách đã thấy thì sau này phải có màn
đặc tả (SCR) tương ứng hoặc có quyết định bỏ; màn không ứng UC presales nào là dấu hiệu lệch phạm vi giữa prototype và
báo giá, ghi phát hiện ở mục 1.

**Lấy dữ liệu từ:**
- `1-ba-init/0-dau-vao/man-presales.json`: kết quả máy quét prototype `0-inputs/presales/prototype/`, **không sửa tay**.
  Tên màn, nội dung trên màn, ảnh lấy từ đây; bảng dưới viết lại cho dễ đọc, bản nguyên văn vẫn ở JSON. Ảnh ở
  `1-ba-init/0-dau-vao/man-presales/MP-xxx.png`.
- `1-ba-init/0-dau-vao/uc-presales.md`: để điền cột "Thuộc UC".
- `1-ba-init/open-questions.md`: các mã `[ASM-xxx]` (giả định), `[PH-xxx]` (phát hiện), `[Q-xxx]` (câu hỏi) dẫn trong file.

**Được dùng ở:** bước 2 /ba-overview (cắt chức năng gắn MP, sitemap, menu theo chức năng); bước 6 ERD (đối chiếu trường
của màn với thuộc tính thực thể); `brief.md` của từng chức năng (danh sách MP của chức năng); bước 11 đặc tả màn hình
(mỗi SCR dẫn MP gốc). Tài liệu khác dẫn màn presales bằng mã `MP-xxx`.

**Căn cứ chuẩn:** BABOK v3 mục 10.24 "Interface Analysis", 10.36 "Prototyping" (giao diện hiện có là nguồn yêu cầu); ISO/IEC/IEEE 29148:2018 mục 5.2 (truy vết: mỗi SCR sau này dẫn MP gốc).

**Tóm tắt.** Vài dòng bằng lời thường, đếm từ bảng mục 2: tổng số màn (màn chính, tab, cửa sổ); số màn theo phía người
dùng hoặc nhóm menu; số màn theo vai khi quét (vai nào không có màn riêng và vì sao); số màn đã gắn UC, gắn theo giả
định, chưa có UC (mục 1); số màn trống; phần còn thiếu (mục 3).

## 1. Màn không thuộc UC presales
**PH là gì.** PH (phát hiện) là điều BA ghi lại khi đối chiếu các nguồn thấy chỗ thiếu hoặc chỗ lệch. Ở đây là:
prototype có màn nhưng danh mục UC presales (phạm vi đã báo giá) không có UC nào cho màn đó. Mỗi PH có một dòng trong
sổ phát hiện `1-ba-init/open-questions.md` mục 3. PH cần khách hoặc PM trả lời thì có câu hỏi `Q-xxx` đi kèm. Bước 2
/ba-overview quyết từng PH: thêm UC (đưa vào phạm vi) hoặc bỏ màn (ngoài phạm vi báo giá).

| PH | Phát hiện | Cần quyết | Các màn |
| --- | --- | --- | --- |
| [PH-xxx] | <điều thấy, bằng lời thường, theo cột "Phát hiện" của sổ phát hiện> | [Q-xxx] <câu hỏi> / Bước 2 quyết | MP-xxx đến MP-yyy |

Danh sách từng màn (cổng máy kiểm: mọi màn có cột "UC presales" là "—" phải có một dòng ở đây):

| Mã màn | Tiêu đề | PH |
| --- | --- | --- |

## 2. Danh mục
Cách đọc bảng:
- **Mã màn**: mã của màn, tài liệu khác dẫn màn bằng mã này. **Nhóm menu**: nhóm trên menu của prototype.
- **Tên màn**: tiêu đề trên màn. "Chi tiết: …" là trang xem một bản ghi, tên lấy theo bản ghi mẫu của prototype.
  "↳ Tab" là tab nằm trong màn ngay trên; số trong ngoặc là số bản ghi mẫu.
- **Mở bằng**: cách tìm tới màn trên prototype. **Trên màn có gì**: ô tìm, lọc; thẻ số liệu (số trong ngoặc là số mẫu);
  nút.
- **Thuộc UC**: UC presales màn phục vụ, dạng mã + tên trong `uc-presales.md`. "(giả định ASM-xxx)" là gắn chưa chắc,
  chờ xác nhận. "Như MP-xxx" là cùng UC với màn cha.
- Năm cột cuối dành cho người làm kỹ thuật và máy kiểm, người đọc nghiệp vụ có thể bỏ qua: **Vị trí** (đường dẫn trang
  trong prototype), **Cách mở** (thao tác máy quét đã làm), **UC presales** (mã UC dạng máy đọc), **Đi tới** (màn mở được
  từ màn này), **Vai khi quét**.

| Mã màn | Nhóm menu | Tên màn | Mở bằng | Trên màn có gì | Thuộc UC | Ảnh | Ghi chú | Vị trí | Cách mở | UC presales | Đi tới | Vai khi quét |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MP-001 | <nhóm menu> | <tiêu đề> / Chi tiết: … / ↳ Tab "…" (n) | Menu › <mục> / Bấm một dòng ở MP-xxx / Bấm tab trên MP-xxx / Bấm nút "…" trên MP-xxx | Ô tìm, lọc: …. Thẻ số liệu: … (n). Nút: … | `<mã gốc>` <tên UC> / Như MP-xxx / Chưa có UC presales ([PH-xxx]) | [ảnh](man-presales/MP-001.png) | | `/ho-so` hoặc <đường dẫn tệp> | tải trang / tab: … / popup: <nút mở> | `<mã gốc>` | MP-xxx | <vai> |

Hướng dẫn điền (người viết đọc, người đọc bỏ qua):
- Cột viết lại cho dễ đọc từ JSON: "Tên màn" từ `tieu_de` (tab lấy nhãn tab, tách số đếm ra ngoặc); "Mở bằng" từ
  `menu`, `di_toi` của màn cha và nhãn menu trên ảnh; "Trên màn có gì" từ `truong`, `nut` (bỏ ô phân trang "kích thước
  trang"; ô không nhãn như `rc_select_0` ghi "ô chọn chưa có nhãn (xem ảnh)"; nhãn nút dính số của thẻ số liệu tách
  thành "<nhãn> (<số>)"; tab không có nội dung riêng ghi "Xem ảnh"). Không thêm nội dung không có trong JSON hoặc ảnh.
- Cột kỹ thuật chép đúng JSON: "Vị trí" = `vi_tri` (cổng máy so khớp), "Cách mở" = `cach_mo`, "Đi tới" = `di_toi`,
  "Vai khi quét" = `vai` (`—` khi không chạy `--doi-vai`).
- UC presales (máy đọc): chỉ mã gốc, cách bằng `;`; không chắc thì mã kèm `[ASM-xxx]`; không thuộc UC nào thì "—" và ghi
  phát hiện (loại "màn không thuộc UC", 1-ba-init/open-questions.md mục 3). "Thuộc UC" ghi cùng các mã đó kèm tên UC;
  tab cùng UC với màn cha ghi "Như MP-xxx" (cột "UC presales" của tab vẫn ghi đủ mã).
- Ghi chú: chỉ điều người đọc cần biết (màn trống, không ứng UC, đọc tĩnh và lý do, không có ảnh và lý do).

## 3. Lỗi khi duyệt
| Vị trí | Lỗi | Xử lý |
| --- | --- | --- |
| `/ho-so/:maHoSo` | Trang có trong mã nguồn nhưng máy quét không mở được | PH-xxx / Q-xxx / đã kiểm bằng tay: … |

Bắt buộc một dòng cho mỗi route trong `route_chua_mo` và `lech_nguon` của JSON (cổng máy kiểm), cộng màn agent thấy bị
sót (ví dụ popup của nút không bấm thử, bước của wizard). Cột "Lỗi" viết bằng lời thường. Cột "Xử lý": mã phát hiện,
câu hỏi, hoặc đã xem tận mắt.

**Thông tin quét (cho người làm kỹ thuật).** Dạng prototype (bản build dist / link `<URL>` / HTML tĩnh), công cụ đọc
(Playwright / đọc tĩnh), tùy chọn quét đã dùng và ý nghĩa. Cấu trúc JSON: 1-ba-init/templates/man-presales.schema.md.
Cách đặt prototype vào `0-inputs/`: 1-ba-init/templates/nguon-prototype.md.

## 4. UC presales chưa có màn
UC presales không gắn với màn presales nào ở mục 2: khách chưa thấy màn cho việc này lúc chào giá, hoặc màn có mà lần
quét chưa thấy thao tác. Một dòng mỗi UC, kèm một phát hiện chung loại `thiếu màn`. Bước 2 quyết UC nào cần màn mới.

| Mã gốc | Tên (nguyên văn) | Actor (nguyên văn) | Phân hệ cấp 1 | Prototype ghi ở menu | Ghi chú |
| --- | --- | --- | --- | --- | --- |

- "Prototype ghi ở menu": mục menu mà mã nguồn prototype ghi mã UC này (nếu có); chỉ là manh mối.
- Gắn UC vào màn theo mã prototype ghi chỉ khi tên, actor UC cũng khớp chức năng màn; ghi giả định.
