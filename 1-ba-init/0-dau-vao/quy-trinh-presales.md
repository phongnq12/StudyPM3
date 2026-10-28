# Danh mục quy trình presales — Quản lý kho căng tin
| Nguồn | Số quy trình (tổng / chi tiết) | Số bước | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- |
| [SRC: 0-inputs/presales/quy-trinh/] | 1 / 6 | 118 | 2026-10-28 | draft |

Quy trình nghiệp vụ presales đã chào giá: quy trình tổng và quy trình chi tiết (có gắn UC presales). Chép **nguyên
văn** tên bước, lane, nhãn rẽ nhánh và UC presales mà presales gắn; không sửa, không gộp, không đánh giá đúng sai.
Mã `QP-xx` (quy trình), `QP-xx.yy` (bước) do kit cấp vì sơ đồ không có mã sẵn; mã gốc của presales (nếu có) ghi ở cột
"Mã gốc". QP **không phải** PROC: PROC do kit dựng ở bước 2, 5 và dẫn QP làm nguồn (`[SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-xx.yy]`).

**Tóm tắt.** Thư mục quy trình presales có 7 sơ đồ draw.io, mỗi sơ đồ một trang: 1 quy trình tổng (`QTPR-process-overview`,
6 sub-process thu gọn) và 6 quy trình chi tiết (`QTPR-01` … `QTPR-06`, nhãn pool `PROC-01` … `PROC-06`). Tổng 118 dòng ở mục 2: 52 bước, 18 cổng có nhãn,
48 sự kiện có nhãn. Sơ đồ presales tự đặt mã `PROC-xx` (quy trình) và `PROC-xx.yy` (bước) ngay trong nhãn ô; các mã
này là **mã gốc của presales**, không phải ID PROC của kit. Không ô nào, không chú thích nào trên sơ đồ ghi mã UC
presales, nên cột "UC presales (theo nguồn)" ghi "—" ở mọi bước và cả 31 UC presales nằm ở mục 4 [PH-007] … [PH-014]
[Q-014]. Sơ đồ chuyển giao sang pool thu gọn "Hệ thống bán hàng căng tin" (giá bán theo lô; khóa, mở khóa bán tại kho)
[PH-015] [Q-015]. Kết thúc của quy trình tổng không liệt kê đủ các kết thúc của quy trình chi tiết [PH-016].

**Căn cứ chuẩn:** BABOK v3 mục 4.3 "Confirm Elicitation Results" và 10.18 "Document Analysis" (ghi nhận nguyên văn tài
liệu hiện có); ISO/IEC/IEEE 29148:2018 mục 5.2 (truy vết về nguồn).

## 0. Vị trí trong nguồn
| Tệp | Dạng | Trang, sheet, mục | Bản chữ |
| --- | --- | --- | --- |
| `0-inputs/presales/quy-trinh/QTPR-process-overview.drawio` | drawio | Bản đồ quy trình quản lý kho căng tin | `.ba-cache/ban-chu/0-inputs/presales/quy-trinh/QTPR-process-overview.drawio.txt` |
| `0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio` | drawio | QTPR-02 Quản lý nhà cung cấp giá nhập và kho | `.ba-cache/ban-chu/0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio.txt` |
| `0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio` | drawio | QTPR-03 Nhập kho hàng hóa từ nhà cung cấp | `.ba-cache/ban-chu/0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio.txt` |
| `0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio` | drawio | QTPR-01 Quản lý danh mục hàng hóa và giá bán | `.ba-cache/ban-chu/0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio.txt` |
| `0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio` | drawio | QTPR-04 Điều chuyển hàng hóa giữa các kho | `.ba-cache/ban-chu/0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio.txt` |
| `0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio` | drawio | QTPR-05 Kiểm kê tồn kho | `.ba-cache/ban-chu/0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio.txt` |
| `0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio` | drawio | QTPR-06 Cảnh báo tồn kho và hạn sử dụng | `.ba-cache/ban-chu/0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio.txt` |

- Dạng: `drawio` (cả `.drawio.xml`, `.drawio.svg`) / `bpmn` / `docx` / `xlsx` / `pdf` / `ảnh`. Bản chữ: drawio, bpmn
  sinh bằng `kit/tools/ba-verify/doc-quy-trinh.mjs`; docx, xlsx bằng `kit/tools/ba-verify/office.cjs`; pdf, ảnh agent đọc
  trực tiếp (chỉ khi presales không có tệp gốc và BA đồng ý; cột Bản chữ ghi "—").
- Mỗi tệp, mỗi trang (sheet, mục) có quy trình một dòng. `dau-vao-check.mjs` đối chiếu từng ô của sơ đồ drawio, bpmn
  với mục 2 và mục 3; docx, xlsx máy chỉ kiểm tệp có thật.
- Cùng thư mục, mỗi sơ đồ còn ba tệp đi kèm cùng tên: `.drawio.svg`, `.png` (bản xuất của cùng sơ đồ) và
  `.bpmn.json` (đặc tả sơ đồ dạng JSON). Nguồn chính là tệp `.drawio`; ba tệp kia chỉ để tham khảo, không có dòng
  riêng ở bảng trên. Đã đối chiếu `.bpmn.json`: không có trường nào ghi mã UC presales
  [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.bpmn.json] (tương tự sáu tệp `QTPR-0x-*.bpmn.json`).
- Tên tệp, tên trang và id ô dùng mã `QTPR-…` do BA đổi từ `PROC-…` để không trùng tiền tố ID PROC của kit; nhãn chữ
  trên ô giữ nguyên (vẫn ghi `PROC-xx`, `PROC-xx.yy`) [SRC: 0-inputs/answers-2026-10-29.md, RQ-45, RQ-46].
- Thứ tự dòng theo thứ tự mã QP (quy trình tổng, rồi quy trình chi tiết theo thứ tự bước của quy trình tổng), không
  theo số trong tên tệp.

## 1. Quy trình
| Mã | Tên (nguyên văn) | Cấp | Mở rộng từ | Mã gốc | Lane (nguyên văn) | Nguồn |
| --- | --- | --- | --- | --- | --- | --- |
| QP-01 | Bản đồ quy trình quản lý kho căng tin | tổng | — | — | Cán bộ căng tin; Trưởng cơ sở; Hệ thống quản lý kho căng tin (pool "Quản lý kho căng tin cơ sở cai nghiện ma túy"); pool thu gọn: Hệ thống bán hàng căng tin (ngoài phạm vi) | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin] |
| QP-02 | `PROC-02` Quản lý nhà cung cấp, giá nhập và kho | chi tiết | QP-01.02 | `PROC-02` | Cán bộ căng tin; Hệ thống quản lý kho căng tin (pool "`PROC-02` Quản lý nhà cung cấp, giá nhập và kho") | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho] |
| QP-03 | `PROC-03` Nhập kho hàng hóa từ nhà cung cấp | chi tiết | QP-01.05 | `PROC-03` | Cán bộ căng tin; Trưởng cơ sở; Hệ thống quản lý kho căng tin (pool "`PROC-03` Nhập kho hàng hóa từ nhà cung cấp"); pool thu gọn: `PROC-01` Quản lý danh mục hàng hóa và giá bán | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp] |
| QP-04 | `PROC-01` Quản lý danh mục hàng hóa và giá bán | chi tiết | QP-01.08 | `PROC-01` | Cán bộ căng tin; Trưởng cơ sở; Hệ thống quản lý kho căng tin (pool "`PROC-01` Quản lý danh mục hàng hóa và giá bán"); pool thu gọn: `PROC-03` Nhập kho hàng hóa từ nhà cung cấp; Hệ thống bán hàng căng tin | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán] |
| QP-05 | `PROC-04` Điều chuyển hàng hóa giữa các kho | chi tiết | QP-01.12 | `PROC-04` | Cán bộ căng tin (kho xuất); Trưởng cơ sở; Cán bộ căng tin (kho nhận); Hệ thống quản lý kho căng tin (pool "`PROC-04` Điều chuyển hàng hóa giữa các kho") | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho] |
| QP-06 | `PROC-05` Kiểm kê tồn kho | chi tiết | QP-01.15 | `PROC-05` | Trưởng cơ sở; Tổ kiểm kê; Hệ thống quản lý kho căng tin (pool "`PROC-05` Kiểm kê tồn kho"); pool thu gọn: Hệ thống bán hàng căng tin | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho] |
| QP-07 | `PROC-06` Cảnh báo tồn kho và hạn sử dụng | chi tiết | QP-01.18 | `PROC-06` | Cán bộ căng tin; Hệ thống quản lý kho căng tin (pool "`PROC-06` Cảnh báo tồn kho và hạn sử dụng") | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng] |

- Cấp: `tổng` (bản đồ, mỗi bước là một quy trình) / `chi tiết` (các bước việc, có lane, có gắn UC).
- Mở rộng từ: quy trình chi tiết ghi bước của quy trình tổng mà nó chi tiết hóa (`QP-xx.yy`). Sơ đồ không cho biết
  (tên không khớp bước nào) → "—" kèm `[ASM-xxx]`.
- Tên: tên trang, tiêu đề pool hoặc tiêu đề trong sơ đồ, chép nguyên văn; không có → tên tệp, ghi chú ở cột Mã gốc.
- Ở dự án này: tên trang của cả 6 quy trình chi tiết trùng nguyên văn nhãn sub-process ở quy trình tổng, nên cột "Mở rộng
  từ" ghép theo tên, không cần giả định. Mã gốc là mã `PROC-xx` presales ghi đầu nhãn pool và đầu nhãn sub-process;
  thứ tự QP theo luồng của quy trình tổng nên khác số trong mã gốc (QP-04 là `PROC-01`). Cột "Tên" chép nhãn pool
  (giữ dấu phẩy); tên trang ở mục 0 là tên sau khi BA đổi (`QTPR-xx …`).
- Cột "Lane": lane của pool chính; pool khác trên cùng trang là pool thu gọn (tham chiếu quy trình khác hoặc hệ thống
  ngoài), chỉ nối bằng message flow, không có bước nào nằm trong đó.

## 2. Bước
| Mã bước | Tên (nguyên văn) | Loại | Lane (nguyên văn) | Đi tới | UC presales (theo nguồn) | Nguồn |
| --- | --- | --- | --- | --- | --- | --- |
| QP-01.01 | Cần cập nhật NCC, giá nhập hoặc kho | sự kiện | Cán bộ căng tin | QP-01.02 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô SA] |
| QP-01.02 | `PROC-02` Quản lý nhà cung cấp, giá nhập và kho | bước | Cán bộ căng tin | QP-01.03; QP-01.05 (association qua đối tượng dữ liệu D1 "Danh mục NCC, giá nhập, kho", không phải sequence flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô QTPR-02] |
| QP-01.03 | Danh mục Đã cập nhật | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô EA] |
| QP-01.04 | Hàng hóa từ NCC cần nhập kho | sự kiện | Cán bộ căng tin | QP-01.05 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô SB] |
| QP-01.05 | `PROC-03` Nhập kho hàng hóa từ nhà cung cấp | bước | Cán bộ căng tin | QP-01.06; QP-01.18 (association qua đối tượng dữ liệu D2 "Tồn kho theo lô", không phải sequence flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô QTPR-03] |
| QP-01.06 | Lô cần giá bán mới? | cổng | Cán bộ căng tin | QP-01.07 [Không]; QP-01.08 [Có] (qua cổng gộp không nhãn GM) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô GB] |
| QP-01.07 | Phiếu nhập kho Đã duyệt hoặc Đã hủy | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô EB] |
| QP-01.08 | `PROC-01` Quản lý danh mục hàng hóa và giá bán | bước | Cán bộ căng tin | QP-01.09; pool thu gọn "Hệ thống bán hàng căng tin (ngoài phạm vi)" [Giá bán theo lô] (message flow); association tới đối tượng dữ liệu D3 "Giá bán theo lô" | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô QTPR-01] |
| QP-01.09 | Giá bán Có hiệu lực, Đã hủy hoặc Đã hủy duyệt | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô EC] |
| QP-01.10 | Cần bán mặt hàng mới hoặc giá bán lẻ ĐP thay đổi | sự kiện | Cán bộ căng tin | QP-01.08 (qua cổng gộp không nhãn GM) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô SC] |
| QP-01.11 | Kho cần điều chuyển hàng hóa | sự kiện | Cán bộ căng tin | QP-01.12 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô SD] |
| QP-01.12 | `PROC-04` Điều chuyển hàng hóa giữa các kho | bước | Cán bộ căng tin | QP-01.13; QP-01.18 (association qua đối tượng dữ liệu D2 "Tồn kho theo lô", không phải sequence flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô QTPR-04] |
| QP-01.13 | Phiếu điều chuyển Hoàn thành hoặc Đã hủy | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô ED] |
| QP-01.14 | Đến kỳ hoặc cần kiểm kê đột xuất | sự kiện | Trưởng cơ sở | QP-01.15 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô SE] |
| QP-01.15 | `PROC-05` Kiểm kê tồn kho | bước | Trưởng cơ sở | QP-01.16; QP-01.18 (association qua đối tượng dữ liệu D2 "Tồn kho theo lô", không phải sequence flow); pool thu gọn "Hệ thống bán hàng căng tin (ngoài phạm vi)" [Khóa, mở khóa bán tại kho] (message flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô QTPR-05] |
| QP-01.16 | Biên bản kiểm kê Đã duyệt hoặc Đã hủy duyệt | sự kiện | Trưởng cơ sở | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô EE] |
| QP-01.17 | Đến giờ quét hằng ngày hoặc tồn kho giảm | sự kiện | Hệ thống quản lý kho căng tin | QP-01.18 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô SF] |
| QP-01.18 | `PROC-06` Cảnh báo tồn kho và hạn sử dụng | bước | Hệ thống quản lý kho căng tin | QP-01.19 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô QTPR-06] |
| QP-01.19 | Cảnh báo Đã xem hoặc không có cảnh báo | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-process-overview.drawio, trang Bản đồ quy trình quản lý kho căng tin, ô EF] |
| QP-02.01 | Cần cập nhật nhà cung cấp, giá nhập hoặc kho | sự kiện | Cán bộ căng tin | QP-02.02 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô S1] |
| QP-02.02 | Cập nhật gì? | cổng | Cán bộ căng tin | QP-02.03 [Nhà cung cấp]; QP-02.04 [Hàng hóa NCC]; QP-02.05 [Giá nhập]; QP-02.06 [Kho] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô G1] |
| QP-02.03 | `PROC-02.01` Cập nhật hồ sơ nhà cung cấp<br>thêm, sửa, ngừng hợp tác | bước | Cán bộ căng tin | QP-02.07 (qua cổng gộp không nhãn G2) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô QTPR-02.01] |
| QP-02.04 | `PROC-02.02` Cập nhật hàng hóa theo nhà cung cấp | bước | Cán bộ căng tin | QP-02.07 (qua cổng gộp không nhãn G2) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô QTPR-02.02] |
| QP-02.05 | `PROC-02.03` Cập nhật giá nhập theo nhà cung cấp | bước | Cán bộ căng tin | QP-02.07 (qua cổng gộp không nhãn G2) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô QTPR-02.03] |
| QP-02.06 | `PROC-02.04` Cập nhật kho và hạn mức cảnh báo<br>tồn tối thiểu theo mặt hàng, số ngày N | bước | Cán bộ căng tin | QP-02.07 (qua cổng gộp không nhãn G2) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô QTPR-02.04] |
| QP-02.07 | `PROC-02.05` Lưu lịch sử thay đổi | bước | Hệ thống quản lý kho căng tin | QP-02.08 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô QTPR-02.05] |
| QP-02.08 | Danh mục Đã cập nhật | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio, trang QTPR-02 Quản lý nhà cung cấp giá nhập và kho, ô E1] |
| QP-03.01 | Hàng hóa từ nhà cung cấp cần nhập kho | sự kiện | Cán bộ căng tin | QP-03.02 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô S1] |
| QP-03.02 | `PROC-03.01` Lập hoặc sửa phiếu nhập kho<br>kho, NCC, mặt hàng của NCC, lô, HSD, giá nhập | bước | Cán bộ căng tin | QP-03.03 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.01] |
| QP-03.03 | Trình phiếu? | cổng | Cán bộ căng tin | QP-03.04 [Có]; QP-03.16 [Không, hủy phiếu] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô G0] |
| QP-03.04 | `PROC-03.02` Duyệt phiếu nhập kho | bước | Trưởng cơ sở | QP-03.05 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.02] |
| QP-03.05 | Đồng ý? | cổng | Trưởng cơ sở | QP-03.06 [Có]; QP-03.02 [Không, ghi lý do] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô G1] |
| QP-03.06 | `PROC-03.03` Tăng tồn kho theo lô | bước | Hệ thống quản lý kho căng tin | QP-03.07 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.03] |
| QP-03.07 | `PROC-03.04` So giá nhập với giá bán hiện hành | bước | Hệ thống quản lý kho căng tin | QP-03.08 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.04] |
| QP-03.08 | Giá bán hiện hành ≥ giá nhập? | cổng | Hệ thống quản lý kho căng tin | QP-03.09 [Có]; QP-03.14 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô G2] |
| QP-03.09 | `PROC-03.05` Áp giá bán hiện hành cho lô, mở bán | bước | Hệ thống quản lý kho căng tin | QP-03.10 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.05] |
| QP-03.10 | `PROC-03.06` Chọn có đề xuất giá bán mới cho lô | bước | Cán bộ căng tin | QP-03.11 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.06] |
| QP-03.11 | Đề xuất giá mới? | cổng | Cán bộ căng tin | QP-03.12 [Có]; QP-03.13 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô G3] |
| QP-03.12 | Phiếu nhập kho Đã duyệt, lô chờ duyệt giá mới | sự kiện | Cán bộ căng tin | pool thu gọn "`PROC-01` Quản lý danh mục hàng hóa và giá bán" (QP-04) [Lô cần đề xuất giá bán mới] (message flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô E4] |
| QP-03.13 | Phiếu nhập kho Đã duyệt, lô bán giá hiện hành | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô E1] |
| QP-03.14 | `PROC-03.07` Giữ lô chờ giá, cảnh báo cán bộ căng tin | bước | Hệ thống quản lý kho căng tin | QP-03.15 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.07] |
| QP-03.15 | Phiếu nhập kho Đã duyệt, lô chờ giá | sự kiện | Hệ thống quản lý kho căng tin | pool thu gọn "`PROC-01` Quản lý danh mục hàng hóa và giá bán" (QP-04) [Lô chờ giá bán mới] (message flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô E3] |
| QP-03.16 | Phiếu nhập kho Đã hủy | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô E2] |
| QP-03.17 | Phát hiện sai sót ở phiếu nhập kho đã duyệt | sự kiện | Trưởng cơ sở | QP-03.18 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô S2] |
| QP-03.18 | `PROC-03.08` Hủy phê duyệt phiếu nhập kho | bước | Trưởng cơ sở | QP-03.19 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.08] |
| QP-03.19 | `PROC-03.09` Kiểm tra tồn hiện tại đủ để đảo | bước | Hệ thống quản lý kho căng tin | QP-03.20 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.09] |
| QP-03.20 | Tồn mọi dòng ≥ số đã nhập? | cổng | Hệ thống quản lý kho căng tin | QP-03.21 [Có]; QP-03.23 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô G4] |
| QP-03.21 | `PROC-03.10` Giảm tồn kho theo các lô của phiếu | bước | Hệ thống quản lý kho căng tin | QP-03.22 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô QTPR-03.10] |
| QP-03.22 | Phiếu nhập kho Đã hủy duyệt | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô E5] |
| QP-03.23 | Hủy duyệt bị chặn, xử lý qua kiểm kê | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio, trang QTPR-03 Nhập kho hàng hóa từ nhà cung cấp, ô E6] |
| QP-04.01 | Cần bán mặt hàng mới | sự kiện | Cán bộ căng tin | QP-04.02 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô S1] |
| QP-04.02 | `PROC-01.01` Thêm mặt hàng vào danh mục<br>không cần duyệt | bước | Cán bộ căng tin | QP-04.03 (qua cổng gộp không nhãn G0) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô QTPR-01.01] |
| QP-04.03 | `PROC-01.02` Lập hoặc sửa đề xuất giá bán<br>lô áp dụng, ngày hiệu lực, giá nhập, chi phí, giá bán lẻ ĐP | bước | Cán bộ căng tin | QP-04.04 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô QTPR-01.02] |
| QP-04.04 | Trình đề xuất? | cổng | Cán bộ căng tin | QP-04.05 [Có]; QP-04.11 [Không, hủy] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô G1] |
| QP-04.05 | `PROC-01.03` Duyệt đề xuất giá bán<br>≤ giá bán lẻ ĐP; mặt hàng không thuộc TT79 Đ16 | bước | Trưởng cơ sở | QP-04.06 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô QTPR-01.03] |
| QP-04.06 | Đồng ý? | cổng | Trưởng cơ sở | QP-04.07 [Có]; QP-04.03 [Không, ghi lý do] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô G2] |
| QP-04.07 | `PROC-01.04` Ghi giá bán Đã duyệt theo lô | bước | Hệ thống quản lý kho căng tin | QP-04.08 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô QTPR-01.04] |
| QP-04.08 | Đến ngày hiệu lực | sự kiện | Hệ thống quản lý kho căng tin | QP-04.09 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô I1] |
| QP-04.09 | `PROC-01.05` Áp giá bán cho lô, mở bán lô chờ giá | bước | Hệ thống quản lý kho căng tin | QP-04.10; pool thu gọn "Hệ thống bán hàng căng tin" [Giá bán theo lô] (message flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô QTPR-01.05] |
| QP-04.10 | Giá bán Có hiệu lực | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô E1] |
| QP-04.11 | Đề xuất giá bán Đã hủy | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô E2] |
| QP-04.12 | Lô cần giá bán mới | sự kiện | Cán bộ căng tin | QP-04.03 (qua cổng gộp không nhãn G0) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô S2] |
| QP-04.13 | Giá bán lẻ địa phương thay đổi | sự kiện | Cán bộ căng tin | QP-04.03 (qua cổng gộp không nhãn G0) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô S3] |
| QP-04.14 | Cần hủy giá bán đã duyệt | sự kiện | Trưởng cơ sở | QP-04.15 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô S4] |
| QP-04.15 | `PROC-01.06` Hủy phê duyệt giá bán | bước | Trưởng cơ sở | QP-04.16 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô QTPR-01.06] |
| QP-04.16 | `PROC-01.07` Kiểm tra giá chưa tới ngày hiệu lực | bước | Hệ thống quản lý kho căng tin | QP-04.17 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô QTPR-01.07] |
| QP-04.17 | Chưa tới ngày hiệu lực? | cổng | Hệ thống quản lý kho căng tin | QP-04.18 [Có]; QP-04.19 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô G3] |
| QP-04.18 | Giá bán Đã hủy duyệt | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô E3] |
| QP-04.19 | Hủy duyệt bị chặn, lập đề xuất giá mới | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, ô E4] |
| QP-05.01 | Kho cần điều chuyển hàng hóa | sự kiện | Cán bộ căng tin (kho xuất) | QP-05.02 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô S1] |
| QP-05.02 | `PROC-04.01` Lập hoặc sửa phiếu điều chuyển<br>kho xuất, kho nhận, lô, số lượng | bước | Cán bộ căng tin (kho xuất) | QP-05.03 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.01] |
| QP-05.03 | Trình phiếu? | cổng | Cán bộ căng tin (kho xuất) | QP-05.04 [Có]; QP-05.14 [Không, hủy phiếu] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô G0] |
| QP-05.04 | `PROC-04.02` Duyệt phiếu điều chuyển | bước | Trưởng cơ sở | QP-05.05 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.02] |
| QP-05.05 | Đồng ý? | cổng | Trưởng cơ sở | QP-05.06 [Có]; QP-05.02 [Không, ghi lý do] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô G1] |
| QP-05.06 | `PROC-04.03` Trừ tồn kho xuất, ghi hàng đang chuyển | bước | Hệ thống quản lý kho căng tin | QP-05.07 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.03] |
| QP-05.07 | `PROC-04.04` Kiểm tra hàng, ghi số lượng thực nhận | bước | Cán bộ căng tin (kho nhận) | QP-05.08 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.04] |
| QP-05.08 | `PROC-04.05` Cộng tồn kho nhận theo số thực nhận | bước | Hệ thống quản lý kho căng tin | QP-05.09 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.05] |
| QP-05.09 | Thực nhận đủ? | cổng | Hệ thống quản lý kho căng tin | QP-05.10 [Có]; QP-05.11 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô G2] |
| QP-05.10 | Phiếu điều chuyển Hoàn thành | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô E1] |
| QP-05.11 | `PROC-04.06` Ghi nhận chênh lệch điều chuyển | bước | Cán bộ căng tin (kho xuất) | QP-05.12 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.06] |
| QP-05.12 | `PROC-04.07` Cộng trả chênh lệch về tồn kho xuất | bước | Hệ thống quản lý kho căng tin | QP-05.13 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.07] |
| QP-05.13 | Phiếu điều chuyển Hoàn thành có chênh lệch | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô E3] |
| QP-05.14 | Phiếu điều chuyển Đã hủy | sự kiện | Cán bộ căng tin (kho xuất) | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô E2] |
| QP-05.15 | Cần hủy phiếu điều chuyển đã duyệt | sự kiện | Trưởng cơ sở | QP-05.16 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô S2] |
| QP-05.16 | `PROC-04.08` Hủy phê duyệt phiếu điều chuyển | bước | Trưởng cơ sở | QP-05.17 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.08] |
| QP-05.17 | `PROC-04.09` Kiểm tra kho nhận chưa xác nhận | bước | Hệ thống quản lý kho căng tin | QP-05.18 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.09] |
| QP-05.18 | Kho nhận chưa xác nhận? | cổng | Hệ thống quản lý kho căng tin | QP-05.19 [Có]; QP-05.21 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô G3] |
| QP-05.19 | `PROC-04.10` Cộng trả tồn kho xuất, bỏ hàng đang chuyển | bước | Hệ thống quản lý kho căng tin | QP-05.20 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô QTPR-04.10] |
| QP-05.20 | Phiếu điều chuyển Đã hủy duyệt | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô E4] |
| QP-05.21 | Hủy duyệt bị chặn | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio, trang QTPR-04 Điều chuyển hàng hóa giữa các kho, ô E5] |
| QP-06.01 | Đến kỳ kiểm kê hoặc cần kiểm kê đột xuất | sự kiện | Trưởng cơ sở | QP-06.02 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô S1] |
| QP-06.02 | `PROC-05.01` Giao kiểm kê kho cho tổ kiểm kê<br>kho, thành viên tổ | bước | Trưởng cơ sở | QP-06.03 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.01] |
| QP-06.03 | `PROC-05.02` Kiểm tra phiếu chờ duyệt, hàng đang chuyển | bước | Hệ thống quản lý kho căng tin | QP-06.04 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.02] |
| QP-06.04 | Kho còn phiếu dở dang? | cổng | Hệ thống quản lý kho căng tin | QP-06.05 [Không]; QP-06.13 [Có] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô G1] |
| QP-06.05 | `PROC-05.03` Chốt số sách theo lô, khóa giao dịch kho | bước | Hệ thống quản lý kho căng tin | QP-06.06; pool thu gọn "Hệ thống bán hàng căng tin" [Khóa bán tại kho] (message flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.03] |
| QP-06.06 | `PROC-05.04` Kiểm đếm thực tế theo lô | bước | Tổ kiểm kê | QP-06.07 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.04] |
| QP-06.07 | `PROC-05.05` Lập biên bản kiểm kê<br>số thực tế, lý do chênh lệch | bước | Tổ kiểm kê | QP-06.08 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.05] |
| QP-06.08 | `PROC-05.06` Tính chênh lệch so với số sách | bước | Hệ thống quản lý kho căng tin | QP-06.09 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.06] |
| QP-06.09 | `PROC-05.07` Duyệt biên bản kiểm kê | bước | Trưởng cơ sở | QP-06.10 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.07] |
| QP-06.10 | Đồng ý? | cổng | Trưởng cơ sở | QP-06.11 [Có]; QP-06.06 [Không, kiểm đếm lại] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô G2] |
| QP-06.11 | `PROC-05.08` Điều chỉnh tồn kho theo số thực tế, mở khóa kho | bước | Hệ thống quản lý kho căng tin | QP-06.12; pool thu gọn "Hệ thống bán hàng căng tin" [Mở khóa bán tại kho] (message flow) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.08] |
| QP-06.12 | Biên bản kiểm kê Đã duyệt, tồn đã điều chỉnh | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô E1] |
| QP-06.13 | Chưa kiểm kê được, còn phiếu dở dang | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô E2] |
| QP-06.14 | Cần hủy biên bản kiểm kê đã duyệt | sự kiện | Trưởng cơ sở | QP-06.15 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô S2] |
| QP-06.15 | `PROC-05.09` Hủy phê duyệt biên bản kiểm kê | bước | Trưởng cơ sở | QP-06.16 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.09] |
| QP-06.16 | `PROC-05.10` Kiểm tra kho chưa có giao dịch mới | bước | Hệ thống quản lý kho căng tin | QP-06.17 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.10] |
| QP-06.17 | Chưa có giao dịch mới? | cổng | Hệ thống quản lý kho căng tin | QP-06.18 [Có]; QP-06.20 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô G3] |
| QP-06.18 | `PROC-05.11` Đảo điều chỉnh tồn kho | bước | Hệ thống quản lý kho căng tin | QP-06.19 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô QTPR-05.11] |
| QP-06.19 | Biên bản kiểm kê Đã hủy duyệt | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô E3] |
| QP-06.20 | Hủy duyệt bị chặn | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio, trang QTPR-05 Kiểm kê tồn kho, ô E4] |
| QP-07.01 | Đến giờ quét hằng ngày | sự kiện | Hệ thống quản lý kho căng tin | QP-07.02 (qua cổng gộp không nhãn G0) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô S1] |
| QP-07.02 | `PROC-06.01` Quét tồn dưới mức tối thiểu, lô sắp hết hạn, quá hạn, chờ giá<br>theo tồn tối thiểu, số ngày N của kho | bước | Hệ thống quản lý kho căng tin | QP-07.03 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô QTPR-06.01] |
| QP-07.03 | Có mục cần cảnh báo? | cổng | Hệ thống quản lý kho căng tin | QP-07.04 [Có]; QP-07.07 [Không] | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô G1] |
| QP-07.04 | `PROC-06.02` Gửi cảnh báo cho cán bộ căng tin | bước | Hệ thống quản lý kho căng tin | QP-07.05 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô QTPR-06.02] |
| QP-07.05 | `PROC-06.03` Xem cảnh báo, chọn hướng xử lý<br>nhập kho, điều chuyển, đề nghị kiểm kê | bước | Cán bộ căng tin | QP-07.06 | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô QTPR-06.03] |
| QP-07.06 | Cảnh báo Đã xem | sự kiện | Cán bộ căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô E1] |
| QP-07.07 | Không có cảnh báo | sự kiện | Hệ thống quản lý kho căng tin | — | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô E2] |
| QP-07.08 | Tồn kho giảm sau giao dịch | sự kiện | Hệ thống quản lý kho căng tin | QP-07.02 (qua cổng gộp không nhãn G0) | — | [SRC: 0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio, trang QTPR-06 Cảnh báo tồn kho và hạn sử dụng, ô S2] |

- Thứ tự dòng: theo quy trình, rồi theo luồng từ sự kiện bắt đầu. Mã bước đánh số tuần tự trong quy trình.
- Loại: `bước` (việc làm, sub-process) / `cổng` (rẽ nhánh) / `sự kiện` (bắt đầu, kết thúc, trung gian; chỉ ghi khi có
  nhãn). Bắt buộc ghi mọi `bước` và `cổng` có nhãn của sơ đồ; ô không phải bước (tiêu đề, chú thích) ghi ở mục 3.
- Đi tới: bước kế tiếp theo mũi tên, nhãn mũi tên trong `[ ]`; mũi tên đi qua sự kiện không ghi thì nối thẳng tới bước
  sau sự kiện. Bước cuối: "—".
- UC presales (theo nguồn): chỉ ghi UC mà **presales gắn** (mã UC trong nhãn, cột mapping của bảng, chú thích trên
  sơ đồ), nhiều mã cách bằng `;`. Không tự ghép bước với UC ở bước 1 — việc đó của bước 2 (ma trận UC × PROC).
- Nguồn: drawio `[SRC: <tệp>, trang <tên trang>, ô <id>]`; bpmn `[SRC: <tệp>, ô <id>]`; xlsx `[SRC: <tệp>, <sheet>,
  dòng <n>]`; docx `[SRC: <tệp>, <mục hoặc bảng>]`. Id ô lấy từ bản chữ.

Cách chép ở dự án này:
- Tên: nhãn ô nguyên văn, kể cả mã gốc `PROC-xx.yy` đầu nhãn; dòng thứ hai của nhãn (chữ nhỏ trong ô) nối bằng `<br>`.
- Sự kiện: ghi mọi sự kiện có nhãn (bắt đầu, trung gian hẹn giờ "Đến ngày hiệu lực", kết thúc) vì nhãn đều nêu điều kiện
  khởi phát hoặc trạng thái kết thúc của chứng từ.
- Cổng không nhãn (cổng gộp): `GM` ở QP-01, `G0` ở QP-04, `G2` ở QP-02, `G0` ở QP-07 không có dòng; "Đi tới" nối thẳng
  qua cổng đó và ghi "(qua cổng gộp không nhãn <id>)".
- Mũi tên association tới đối tượng dữ liệu ở QP-01 (`D1`, `D2`, `D3`) không phải sequence flow; vẫn ghi ở "Đi tới"
  kèm chú thích để giữ đủ mũi tên của sơ đồ.
- Message flow tới pool thu gọn ghi ở "Đi tới" dạng `pool thu gọn "<tên>" [<nhãn>] (message flow)`. Message flow đi
  vào: QP-04.12 "Lô cần giá bán mới" nhận từ pool thu gọn "`PROC-03` Nhập kho hàng hóa từ nhà cung cấp" nhãn "Lô chờ giá
  / lô cần giá mới" [SRC: 0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio, trang QTPR-01 Quản lý danh mục hàng hóa và giá bán, mũi
  tên P03 → S2].
- Nhánh rẽ: đánh số hết đoạn của nhánh đầu (theo thứ tự mũi tên trong tệp) rồi tới nhánh sau; các nhánh gộp lại ở cổng
  gộp (QP-02) thì đánh số các nhánh trước, đoạn sau cổng gộp sau.

## 3. Ô sơ đồ không ghi vào danh mục
| Tệp | Trang | Ô | Nhãn (nguyên văn) | Lý do |
| --- | --- | --- | --- | --- |
| `0-inputs/presales/quy-trinh/QTPR-process-overview.drawio` | Bản đồ quy trình quản lý kho căng tin | chu_giai | Ký hiệu BPMN 2.0<br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association | chú giải |
| `0-inputs/presales/quy-trinh/QTPR-02-ncc-kho.drawio` | QTPR-02 Quản lý nhà cung cấp giá nhập và kho | chu_giai | Ký hiệu BPMN 2.0<br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association | chú giải |
| `0-inputs/presales/quy-trinh/QTPR-03-nhap-kho.drawio` | QTPR-03 Nhập kho hàng hóa từ nhà cung cấp | chu_giai | Ký hiệu BPMN 2.0<br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association | chú giải |
| `0-inputs/presales/quy-trinh/QTPR-01-hang-hoa-gia-ban.drawio` | QTPR-01 Quản lý danh mục hàng hóa và giá bán | chu_giai | Ký hiệu BPMN 2.0<br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association | chú giải |
| `0-inputs/presales/quy-trinh/QTPR-04-dieu-chuyen-kho.drawio` | QTPR-04 Điều chuyển hàng hóa giữa các kho | chu_giai | Ký hiệu BPMN 2.0<br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association | chú giải |
| `0-inputs/presales/quy-trinh/QTPR-05-kiem-ke.drawio` | QTPR-05 Kiểm kê tồn kho | chu_giai | Ký hiệu BPMN 2.0<br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association | chú giải |
| `0-inputs/presales/quy-trinh/QTPR-06-canh-bao-ton-kho.drawio` | QTPR-06 Cảnh báo tồn kho và hạn sử dụng | chu_giai | Ký hiệu BPMN 2.0<br>○ bắt đầu · ◎ sự kiện trung gian · ● kết thúc · ◇ gateway (✕ chọn một, ✚ song song, ◯ chọn nhiều)<br>▭ task (biểu tượng góc: người dùng, hệ thống, làm tay, gửi, nhận, quy tắc) · ⊞ sub-process<br>── ▶ sequence flow · - - ▷ message flow (giữa các pool) · ⋯ association | chú giải |
| `0-inputs/presales/quy-trinh/QTPR-process-overview.drawio` | Bản đồ quy trình quản lý kho căng tin | D1 | Danh mục NCC, giá nhập, kho | khác: đối tượng dữ liệu (data store), QP-01.02 ghi vào, QP-01.05 đọc |
| `0-inputs/presales/quy-trinh/QTPR-process-overview.drawio` | Bản đồ quy trình quản lý kho căng tin | D2 | Tồn kho theo lô | khác: đối tượng dữ liệu (data store), QP-01.05, QP-01.12, QP-01.15 ghi vào, QP-01.18 đọc |
| `0-inputs/presales/quy-trinh/QTPR-process-overview.drawio` | Bản đồ quy trình quản lý kho căng tin | D3 | Giá bán theo lô | khác: đối tượng dữ liệu (data store), QP-01.08 ghi vào |

- Chỉ dành cho ô có nhãn mà không phải bước, cổng: tiêu đề, chú giải, ghi chú, logo. Lý do: `tiêu đề` / `chú giải` /
  `ghi chú` / `khác: <mô tả>`. Ô ghi chú có nội dung nghiệp vụ (quy định, thời hạn) → vẫn ghi đây, kèm đề xuất câu hỏi
  hoặc phát hiện.
- Không có ô ghi chú mang nội dung quy định riêng; nội dung quy định nằm ngay trong nhãn bước (ví dụ QP-04.05 "≤ giá bán
  lẻ ĐP; mặt hàng không thuộc TT79 Đ16") và đã chép ở mục 2.

## 4. UC presales không có trong quy trình
| Mã gốc | Tên (nguyên văn) | PH |
| --- | --- | --- |
| `PM3CSCN.WEB.09.01.01` | Tạo / Cập nhật phiếu nhập kho hàng hóa căng tin mới nhập từ nhà cung cấp | [PH-007] |
| `PM3CSCN.WEB.09.01.02` | Phê duyệt phiếu nhập kho hàng hóa căng tin và tăng tồn kho | [PH-007] |
| `PM3CSCN.WEB.09.01.03` | Từ chối phiếu nhập kho hàng hóa căng tin | [PH-007] |
| `PM3CSCN.WEB.09.01.04` | Hủy phê duyệt phiếu nhập kho hàng hóa căng tin | [PH-007] |
| `PM3CSCN.WEB.09.01.05` | In phiếu nhập kho hàng hóa căng tin phục vụ lưu trữ kế toán | [PH-007] |
| `PM3CSCN.WEB.09.01.06` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu nhập kho căng tin | [PH-007] |
| `PM3CSCN.WEB.09.02.01` | Tạo phiếu xuất kho, điều chuyển nhu yếu phẩm sang quầy bán căng tin | [PH-008] |
| `PM3CSCN.WEB.09.02.02` | Phê duyệt phiếu xuất kho / điều chuyển hàng hóa căng tin | [PH-008] |
| `PM3CSCN.WEB.09.02.03` | Từ chối phiếu xuất kho / điều chuyển hàng hóa căng tin | [PH-008] |
| `PM3CSCN.WEB.09.02.04` | Hủy phê duyệt phiếu xuất kho / điều chuyển | [PH-008] |
| `PM3CSCN.WEB.09.02.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu xuất kho, điều chuyển | [PH-008] |
| `PM3CSCN.WEB.09.03.01` | Lập biên bản kiểm kê số lượng tồn kho thực tế tại quầy căng tin và ghi nhận chênh lệch | [PH-009] |
| `PM3CSCN.WEB.09.03.02` | Phê duyệt kết quả kiểm kê và thực hiện điều chỉnh số dư kho tự động | [PH-009] |
| `PM3CSCN.WEB.09.03.03` | Từ chối kết quả kiểm kê khi phát hiện sai sót | [PH-009] |
| `PM3CSCN.WEB.09.03.04` | Hủy phê duyệt biên bản kiểm kê tồn kho | [PH-009] |
| `PM3CSCN.WEB.09.03.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất biên bản kiểm kê kho căng tin | [PH-009] |
| `PM3CSCN.WEB.09.04.01` | Xem/Tìm kiếm danh sách kho | [PH-010] |
| `PM3CSCN.WEB.09.04.02` | Thêm/Sửa/Xóa kho | [PH-010] |
| `PM3CSCN.WEB.09.04.03` | Cấu hình hạn mức cảnh báo | [PH-010] |
| `PM3CSCN.WEB.09.04.04` | Theo dõi lịch sử Nhập/Điều chuyển kho | [PH-010] |
| `PM3CSCN.WEB.10.01.01` | Quản lý danh mục hàng hóa căng tin | [PH-011] |
| `PM3CSCN.WEB.10.01.02` | Phê duyệt đơn giá bán hàng hóa căng tin trước khi công bố | [PH-011] |
| `PM3CSCN.WEB.10.01.03` | Từ chối đơn giá bán hàng hóa căng tin | [PH-011] |
| `PM3CSCN.WEB.10.01.04` | Hủy phê duyệt đơn giá bán hàng hóa căng tin | [PH-011] |
| `PM3CSCN.WEB.10.01.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh mục hàng hóa và lịch sử thay đổi giá | [PH-011] |
| `PM3CSCN.WEB.15.01.01` | Quản lý hồ sơ nhà cung cấp hàng hóa căng tin | [PH-012] |
| `PM3CSCN.WEB.15.01.02` | Tra cứu và kết xuất danh sách nhà cung cấp hàng hóa căng tin | [PH-012] |
| `PM3CSCN.WEB.15.02.01` | Quản lý danh mục hàng hóa cung ứng theo từng nhà cung cấp | [PH-013] |
| `PM3CSCN.WEB.15.02.02` | Tra cứu và kết xuất danh mục hàng hóa theo nhà cung cấp | [PH-013] |
| `PM3CSCN.WEB.15.03.01` | Quản lý giá nhập hàng hóa theo từng nhà cung cấp và từng đợt nhập | [PH-014] |
| `PM3CSCN.WEB.15.03.02` | Tra cứu và kết xuất lịch sử giá nhập theo nhà cung cấp | [PH-014] |

- Mọi UC presales không được bước nào ở mục 2 gắn: một dòng, kèm phát hiện loại `UC không thuộc quy trình`
  (1-ba-init/open-questions.md mục 3). Cổng máy tính lại danh sách này từ uc-presales.md và mục 2.
- Ở dự án này cả 31 UC presales ở đây vì sơ đồ presales không gắn mã UC cho bước nào [Q-014]; đây là ghi nhận, không
  phải đánh giá. Mỗi nhóm cấp 2 của file chào giá một phát hiện (PH-007 … PH-014) để bước 2 đóng theo chức năng.
  Tên UC chép từ 1-ba-init/0-dau-vao/uc-presales.md mục 1.
