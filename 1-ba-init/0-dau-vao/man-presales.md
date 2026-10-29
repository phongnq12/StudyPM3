# Danh mục màn presales — Quản lý kho căng tin
| Nguồn | Số màn (MP) | Cập nhật | Trạng thái |
| --- | --- | --- | --- |
| [SRC: 0-inputs/presales/prototype/] | 4 | 2026-10-28 | draft |

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

**Tóm tắt.** Prototype presales chỉ dựng một chức năng là "Giá nhập theo nhà cung cấp" (nhóm menu "Hàng hóa và giá"),
gồm 4 màn, cả 4 là màn chính mở bằng tải trang; không có màn tab, không có màn cửa sổ (popup) nào trong JSON
[SRC: 0-inputs/presales/prototype/README.md, mục "Màn hình Prototype"]. Theo vai khi quét: máy quét không đổi vai, cả
4 màn duyệt ở vai mặc định của prototype (ảnh MP-001, MP-004 ghi người dùng "Nguyễn Văn Hùng · Người phụ trách căng
tin"); vai "Kế toán" có trong prototype nhưng không có màn riêng, chỉ bị ẩn nút Thêm, Sửa, Xóa
[SRC: 0-inputs/presales/prototype/README.md, mục "Tài khoản demo"]. Gắn UC: cả 4 màn gắn UC `PM3CSCN.WEB.15.03.01`; MP-003, MP-004 gắn thêm `PM3CSCN.WEB.10.01.01` vì hộp "Quyết định giá bán" mở từ nút "Lưu" [SRC: 0-inputs/answers-2026-10-29.md, RQ-52];
MP-001, MP-002 gắn thêm `PM3CSCN.WEB.15.03.02` theo giả định [ASM-003]; không màn nào thiếu UC. Màn trống: không có;
MP-002, MP-003 máy quét lỗi, không có ảnh, đã xem tay và ghi nội dung ở mục 3. Phần còn thiếu (mục 3): hai hộp
"Xóa dòng giá nhập" và "Quyết định giá bán" chưa thành MP vì máy quét không bấm nút ghi dữ liệu; màn "Đăng nhập"
không có trong JSON vì máy quét bỏ qua cổng đăng nhập. 28/31 UC presales chưa có màn (mục 4) [PH-018].

## 1. Màn không thuộc UC presales
**PH là gì.** PH (phát hiện) là điều BA ghi lại khi đối chiếu các nguồn thấy chỗ thiếu hoặc chỗ lệch. Ở đây là:
prototype có màn nhưng danh mục UC presales (phạm vi đã báo giá) không có UC nào cho màn đó. Mỗi PH có một dòng trong
sổ phát hiện `1-ba-init/open-questions.md` mục 3. PH cần khách hoặc PM trả lời thì có câu hỏi `Q-xxx` đi kèm. Bước 2
/ba-overview quyết từng PH: thêm UC (đưa vào phạm vi) hoặc bỏ màn (ngoài phạm vi báo giá).

Không MP nào nằm ngoài UC presales. Bảng dưới ghi phần nằm trong màn (hộp thoại, màn chưa thành MP) mà không UC presales
nào nhắc tới.

| PH | Phát hiện | Cần quyết | Các màn |
| --- | --- | --- | --- |
| [PH-017] | Lưu đợt giá nhập (MP-004) hoặc lưu dòng giá nhập đã sửa (MP-003) mở hộp "Quyết định giá bán": với mặt hàng có giá nhập mới không vượt giá bán hiện hành, người dùng chọn "Không tạo đề xuất" hoặc "Tạo đề xuất" giá bán kèm lý do; dòng có giá nhập vượt giá bán thì tự sinh phiếu đề xuất giá bán. Danh mục UC presales có Phê duyệt, Từ chối, Hủy phê duyệt đơn giá bán (`PM3CSCN.WEB.10.01.02`–`PM3CSCN.WEB.10.01.04`) nhưng không có UC lập đề xuất giá bán từ giá nhập [SRC: 0-inputs/presales/prototype/src/pages/PurchasePriceShared/DecisionDialog.jsx, dòng 1–2, 37–80] [SRC: 0-inputs/presales/prototype/src/pages/PurchasePriceShared/BatchForm.jsx, dòng 3] | [Q-017] đã quyết (BA xác nhận, phương án B): hộp "Quyết định giá bán" (tự sinh hoặc chọn tạo đề xuất giá bán khi lưu giá nhập) thuộc UC `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin [SRC: 0-inputs/answers-2026-10-29.md, RQ-52] | MP-003, MP-004 |
| [PH-019] | Prototype có màn "Đăng nhập" (`/dang-nhap`, kèm nút "Đăng nhập SSO"); danh mục UC presales không có UC đăng nhập. Màn không có MP vì máy quét bỏ qua cổng đăng nhập [SRC: 0-inputs/presales/prototype/README.md, mục "Màn hình Prototype"] | [Q-018] đã quyết (BA xác nhận, phương án B): màn Đăng nhập nằm ngoài danh mục màn presales, không cấp MP, giữ ghi nhận ở mục 3 [SRC: 0-inputs/answers-2026-10-29.md, RQ-68] | `/dang-nhap` (chưa có MP) |

Danh sách từng màn (cổng máy kiểm: mọi màn có cột "UC presales" là "—" phải có một dòng ở đây):

| Mã màn | Tiêu đề | PH |
| --- | --- | --- |
| Không có | Không MP nào có cột "UC presales" là "—" | n/a |

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
| MP-001 | Hàng hóa và giá | Giá nhập theo nhà cung cấp | Menu › Hàng hóa và giá › Giá nhập | Ô tìm, lọc: Tìm theo mã hàng, tên hàng, nhà cung cấp, mã đợt hoặc số phiếu nhập; Nhà cung cấp; Hiệu lực; Quyết định giá bán. Bảng: STT, Mặt hàng, Nhà cung cấp, Mã đợt, Giá nhập, Hiệu lực từ, Hiệu lực đến, Hiệu lực, Quyết định giá bán, Phiếu đề xuất, Thao tác (xem tay). Phân trang: Chọn trang, Số bản ghi trên 1 trang. Nút: Xuất Excel, Thêm đợt giá nhập, Tìm kiếm, Xóa bộ lọc, Xem chi tiết, Chỉnh sửa, Xóa dòng giá nhập, Trang trước, Trang sau | `PM3CSCN.WEB.15.03.01` Quản lý giá nhập hàng hóa theo từng nhà cung cấp và từng đợt nhập; `PM3CSCN.WEB.15.03.02` Tra cứu và kết xuất lịch sử giá nhập theo nhà cung cấp (giả định ASM-003) | [ảnh](man-presales/MP-001.png) | Ảnh bị hộp "Thông báo" (chuông) che một phần nút "Xuất Excel" và cột "Hiệu lực". Nút "Xóa dòng giá nhập" mở hộp "Xóa dòng giá nhập" chưa thành MP (mục 3) | `/hang-hoa/gia-nhap` | tải trang | `PM3CSCN.WEB.15.03.01`; `PM3CSCN.WEB.15.03.02` [ASM-003] | MP-004, MP-002, MP-003 | — |
| MP-002 | Hàng hóa và giá | Chi tiết: dòng giá nhập GN-0003 (tiêu đề trên màn "Chi tiết dòng giá nhập") | Bấm "Xem chi tiết" một dòng ở MP-001 | Xem tay (JSON không có): khối "Thông tin dòng giá nhập" (Mặt hàng, Nhà cung cấp, Giá nhập, Hiệu lực từ, Hiệu lực đến, Hiệu lực, Thay thế, Quyết định giá bán, Lý do quyết định, Người tạo, Thời điểm tạo); khối "Đợt giá nhập" (Mã đợt, Số hiệu căn cứ, Tệp căn cứ, Hiệu lực khai chung, Số mặt hàng trong đợt); khối "Giá bán đang áp cho dòng"; bảng "Phiếu đề xuất giá bán gắn dòng" (Phiên bản, Loại, Trạng thái, Giá bán đề xuất, Ngày đề xuất); bảng "Phát sinh từ dòng" (Số phiếu, Ngày nhập, Kho, Trạng thái, Số lượng, Giá bán của lô; Số dòng đặt hàng); bảng "Lịch sử thay đổi" (Thời điểm, Người thực hiện, Thao tác, Nội dung). Nút: Quay lại, Chỉnh sửa, Xóa | `PM3CSCN.WEB.15.03.01` Quản lý giá nhập hàng hóa theo từng nhà cung cấp và từng đợt nhập; `PM3CSCN.WEB.15.03.02` Tra cứu và kết xuất lịch sử giá nhập theo nhà cung cấp (giả định ASM-003) | Không có ảnh | Không có ảnh: máy quét lỗi `ERR_ABORTED` khi mở route (app tự chuyển trang một lần lúc nạp). Đã xem tay, nội dung ghi ở cột "Trên màn có gì" và mục 3. Nút "Xóa" mở hộp "Xóa dòng giá nhập" (mục 3) | `/hang-hoa/gia-nhap/GN-0003` | tải trang | `PM3CSCN.WEB.15.03.01`; `PM3CSCN.WEB.15.03.02` [ASM-003] | — | — |
| MP-003 | Hàng hóa và giá | Cập nhật dòng giá nhập (dòng mẫu GN-0003) | Bấm "Chỉnh sửa" một dòng ở MP-001 hoặc trên MP-002 | Xem tay (JSON không có): ghi chú đầu màn "Dòng sửa được vì phiếu đề xuất giá bán gắn dòng đang ở trạng thái Nháp…"; khối "Thông tin dòng giá nhập": Nhà cung cấp, Mặt hàng, Mã đợt, Số hiệu căn cứ, Tệp căn cứ (chỉ xem); Giá nhập (bắt buộc), Hiệu lực từ ngày (bắt buộc, kèm "Chọn ngày hôm nay"), Hiệu lực đến ngày (bắt buộc). Nút: Quay lại, Hủy, Lưu | `PM3CSCN.WEB.15.03.01` Quản lý giá nhập hàng hóa theo từng nhà cung cấp và từng đợt nhập; `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin (hộp "Quyết định giá bán", [SRC: 0-inputs/answers-2026-10-29.md, RQ-52]) | Không có ảnh | Không có ảnh: máy quét lỗi `ERR_ABORTED` khi mở route (app tự chuyển trang một lần lúc nạp). Đã xem tay, nội dung ghi ở cột "Trên màn có gì" và mục 3. Nút "Lưu" mở hộp "Quyết định giá bán" khi giá nhập mới không vượt giá bán hiện hành (đọc mã nguồn, mục 3); hộp thuộc UC `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin [SRC: 0-inputs/answers-2026-10-29.md, RQ-52] [PH-017] | `/hang-hoa/gia-nhap/GN-0003/chinh-sua` | tải trang | `PM3CSCN.WEB.15.03.01`; `PM3CSCN.WEB.10.01.01` | — | — |
| MP-004 | Hàng hóa và giá | Thêm đợt giá nhập | Bấm nút "Thêm đợt giá nhập" trên MP-001 | Khối "Thông tin đợt giá nhập": Nhà cung cấp (bắt buộc), Số hiệu căn cứ; theo ảnh thêm Hiệu lực từ ngày (bắt buộc, kèm "Chọn ngày hôm nay"), Hiệu lực đến ngày (bắt buộc), Tệp căn cứ (bắt buộc). Khối "Mặt hàng và giá nhập" (theo ảnh): bảng STT, Mặt hàng (bắt buộc), Giá nhập (bắt buộc), Giá bán hiện hành, Giá nhập hiện hành, Ghi chú. Nút: Quay lại, Chọn ngày, Chọn tệp, Thêm mặt hàng, Thêm tất cả mặt hàng, Hủy, Lưu | `PM3CSCN.WEB.15.03.01` Quản lý giá nhập hàng hóa theo từng nhà cung cấp và từng đợt nhập; `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin (hộp "Quyết định giá bán", [SRC: 0-inputs/answers-2026-10-29.md, RQ-52]) | [ảnh](man-presales/MP-004.png) | Máy quét dừng giữa chừng khi bấm thử nút (lỗi `ERR_ABORTED`); màn chính và ảnh đã có. Ảnh bị hộp "Thông báo" (chuông) che một phần đầu màn. Nút "Lưu" mở hộp "Quyết định giá bán" chưa thành MP (mục 3); hộp thuộc UC `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin [SRC: 0-inputs/answers-2026-10-29.md, RQ-52] [PH-017] | `/hang-hoa/gia-nhap/tao-moi` | tải trang | `PM3CSCN.WEB.15.03.01`; `PM3CSCN.WEB.10.01.01` | MP-001 | — |

## 3. Lỗi khi duyệt
| Vị trí | Lỗi | Xử lý |
| --- | --- | --- |
| `/hang-hoa/gia-nhap/GN-0003` | Máy quét không mở được màn chi tiết (`ERR_ABORTED`): app tự chuyển trang một lần lúc nạp làm lệnh mở trang của máy quét bị hủy. Không có ảnh, không có trường, nút trong JSON | Đã xem tay: màn "Chi tiết dòng giá nhập" của dòng GN-0003 (các khối, bảng, nút ghi ở MP-002 mục 2), UC `PM3CSCN.WEB.15.03.01` (và `PM3CSCN.WEB.15.03.02` theo [ASM-003]) |
| `/hang-hoa/gia-nhap/GN-0003/chinh-sua` | Máy quét không mở được màn cập nhật (`ERR_ABORTED`), cùng nguyên nhân với dòng trên. Không có ảnh, không có trường, nút trong JSON | Đã xem tay: màn "Cập nhật dòng giá nhập" (trường, nút ghi ở MP-003 mục 2), UC `PM3CSCN.WEB.15.03.01` |
| `/hang-hoa/gia-nhap/tao-moi` | Máy quét mở được màn và chụp ảnh, nhưng dừng giữa chừng khi bấm thử các nút (`ERR_ABORTED` khi tải lại route) | Đã xem tay qua ảnh: màn "Thêm đợt giá nhập", UC `PM3CSCN.WEB.15.03.01`. Popup sau nút "Lưu" ghi ở dòng "Quyết định giá bán" dưới |
| `/hang-hoa/gia-nhap` và `/hang-hoa/gia-nhap/:id` › hộp "Xóa dòng giá nhập" | Popup bị sót: máy quét không bấm nút bắt đầu bằng "Xóa" nên hộp xác nhận xóa không thành MP | Đã xem tay (mở từ nút "Xóa" trên MP-002, đóng bằng "Đóng", không xác nhận): hộp "Xóa dòng giá nhập" có câu báo dòng sẽ bị xóa không khôi phục được và phiếu đề xuất giá bán Nháp gắn dòng cũng bị xóa; ô "Lý do xóa" (bắt buộc); nút Đóng, Hủy, Xóa. UC `PM3CSCN.WEB.15.03.01`. Đề xuất phiên chính quét lại với `--bam-ca-nut-ghi` (bản dist không nối dữ liệu thật) để cấp MP |
| `/hang-hoa/gia-nhap/tao-moi` và `/hang-hoa/gia-nhap/:id/chinh-sua` › hộp "Quyết định giá bán" | Popup bị sót: hộp chỉ mở sau khi bấm "Lưu" với dữ liệu đã điền và giá nhập mới không vượt giá bán hiện hành; máy quét không bấm "Lưu", không điền form | Đọc mã nguồn, không mở trên trình duyệt để tránh ghi dữ liệu: hộp "Quyết định giá bán" có bảng Mặt hàng, Giá nhập mới, Giá bán hiện hành, Cách xử lý (Không tạo đề xuất / Tạo đề xuất), Lý do (bắt buộc); nút Hủy, Xác nhận [SRC: 0-inputs/presales/prototype/src/pages/PurchasePriceShared/DecisionDialog.jsx, dòng 37–80]. Hộp thuộc UC `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin theo [Q-017] đã quyết [SRC: 0-inputs/answers-2026-10-29.md, RQ-52] [PH-017]. Đề xuất phiên chính quyết cách cấp MP (quét lại không tự mở được hộp này) |
| `/dang-nhap` | Màn đăng nhập không có trong JSON: máy quét bỏ qua cổng đăng nhập | Đã xem tay: màn "Đăng nhập" có ô Tên đăng nhập (bắt buộc), Mật khẩu (bắt buộc), ô đánh dấu "Ghi nhớ đăng nhập"; nút Hiện mật khẩu, Đăng nhập, Đăng nhập SSO. Không UC presales nào ứng. Ngoài danh mục màn presales, không cấp MP theo [Q-018] đã quyết [SRC: 0-inputs/answers-2026-10-29.md, RQ-68] [PH-019] |
| Menu "Hàng hóa và giá", "Kho căng tin" › các mục Mặt hàng, Nhà cung cấp, Giá bán, Phiếu nhập kho, Đơn đặt hàng, Tồn kho | Mục menu có nhãn nhưng chưa có màn: bấm thì prototype báo đang phát triển, không đổi route | Không phải lỗi máy quét, không có màn để cấp MP [SRC: 0-inputs/presales/prototype/src/layout/menuConfig.js, dòng 3, 9–20]. Ghi làm manh mối ở mục 4 [PH-018] |

`route_chua_mo` và `lech_nguon` của JSON trống (prototype có `dist/`, không có link, máy quét không đọc mã nguồn trong
`src/` vì không có thư mục `ma-nguon/`).

**Thông tin quét (cho người làm kỹ thuật).** Dạng prototype: bản build `dist` (`0-inputs/presales/prototype/dist`, không có
link deploy). Công cụ đọc: Playwright (chromium), quét ngày 2026-10-28; không dùng `--doi-vai`, `--nhanh`,
`--bam-ca-nut-ghi`. Xem tay bằng Playwright MCP trên server tĩnh cục bộ trả `index.html` cho mọi route, đăng nhập bằng
tài khoản dùng thử ghi ở README, chỉ mở hộp xóa rồi đóng, không bấm Lưu, Xóa xác nhận. Cấu trúc JSON:
1-ba-init/templates/man-presales.schema.md. Cách đặt prototype vào `0-inputs/`: 1-ba-init/templates/nguon-prototype.md.

## 4. UC presales chưa có màn
UC presales không gắn với màn presales nào ở mục 2: khách chưa thấy màn cho việc này lúc chào giá, hoặc màn có mà lần
quét chưa thấy thao tác. Một dòng mỗi UC, kèm một phát hiện chung loại `thiếu màn`. Bước 2 quyết UC nào cần màn mới.

Phát hiện chung: [PH-018] 28/31 UC presales chưa có màn presales; prototype chỉ dựng chức năng giá nhập theo nhà cung cấp.

| Mã gốc | Tên (nguyên văn) | Actor (nguyên văn) | Phân hệ cấp 1 | Prototype ghi ở menu | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| `PM3CSCN.WEB.09.01.01` | Tạo / Cập nhật phiếu nhập kho hàng hóa căng tin mới nhập từ nhà cung cấp | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Phiếu nhập kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.01.02` | Phê duyệt phiếu nhập kho hàng hóa căng tin và tăng tồn kho | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Phiếu nhập kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.01.03` | Từ chối phiếu nhập kho hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Phiếu nhập kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.01.04` | Hủy phê duyệt phiếu nhập kho hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Phiếu nhập kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.01.05` | In phiếu nhập kho hàng hóa căng tin phục vụ lưu trữ kế toán | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Phiếu nhập kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.01.06` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu nhập kho căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Phiếu nhập kho" chưa có màn; MP-002 có bảng "Phát sinh từ dòng" liệt kê phiếu nhập dùng dòng giá [PH-018] |
| `PM3CSCN.WEB.09.02.01` | Tạo phiếu xuất kho, điều chuyển nhu yếu phẩm sang quầy bán căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục xuất kho, điều chuyển [PH-018] |
| `PM3CSCN.WEB.09.02.02` | Phê duyệt phiếu xuất kho / điều chuyển hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục xuất kho, điều chuyển [PH-018] |
| `PM3CSCN.WEB.09.02.03` | Từ chối phiếu xuất kho / điều chuyển hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục xuất kho, điều chuyển [PH-018] |
| `PM3CSCN.WEB.09.02.04` | Hủy phê duyệt phiếu xuất kho / điều chuyển | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục xuất kho, điều chuyển [PH-018] |
| `PM3CSCN.WEB.09.02.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu xuất kho, điều chuyển | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục xuất kho, điều chuyển [PH-018] |
| `PM3CSCN.WEB.09.03.01` | Lập biên bản kiểm kê số lượng tồn kho thực tế tại quầy căng tin và ghi nhận chênh lệch | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Tồn kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.03.02` | Phê duyệt kết quả kiểm kê và thực hiện điều chỉnh số dư kho tự động | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Tồn kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.03.03` | Từ chối kết quả kiểm kê khi phát hiện sai sót | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Tồn kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.03.04` | Hủy phê duyệt biên bản kiểm kê tồn kho | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Tồn kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.03.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất biên bản kiểm kê kho căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Tồn kho" chưa có màn [PH-018] |
| `PM3CSCN.WEB.09.04.01` | Xem/Tìm kiếm danh sách kho | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục danh sách kho; MP-002 có cột "Kho" ở bảng "Phát sinh từ dòng" [PH-018] |
| `PM3CSCN.WEB.09.04.02` | Thêm/Sửa/Xóa kho | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục danh sách kho [PH-018] |
| `PM3CSCN.WEB.09.04.03` | Cấu hình hạn mức cảnh báo | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục cấu hình hạn mức [PH-018] |
| `PM3CSCN.WEB.09.04.04` | Theo dõi lịch sử Nhập/Điều chuyển kho | (ô trống trong tệp gốc) | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu không có mục lịch sử nhập, điều chuyển [PH-018] |
| `PM3CSCN.WEB.10.01.02` | Phê duyệt đơn giá bán hàng hóa căng tin trước khi công bố | (ô trống trong tệp gốc) | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Giá bán" chưa có màn; hộp "Quyết định giá bán" ghi đề xuất giá bán chờ Trưởng cơ sở duyệt hoặc từ chối [SRC: 0-inputs/presales/prototype/src/pages/PurchasePriceShared/config.jsx, dòng 13] [PH-017] [PH-018] |
| `PM3CSCN.WEB.10.01.03` | Từ chối đơn giá bán hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Giá bán" chưa có màn [PH-018] |
| `PM3CSCN.WEB.10.01.04` | Hủy phê duyệt đơn giá bán hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Giá bán" chưa có màn [PH-018] |
| `PM3CSCN.WEB.10.01.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh mục hàng hóa và lịch sử thay đổi giá | (ô trống trong tệp gốc) | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Mặt hàng", "Giá bán" chưa có màn [PH-018] |
| `PM3CSCN.WEB.15.01.01` | Quản lý hồ sơ nhà cung cấp hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Nhà cung cấp" chưa có màn [PH-018] |
| `PM3CSCN.WEB.15.01.02` | Tra cứu và kết xuất danh sách nhà cung cấp hàng hóa căng tin | (ô trống trong tệp gốc) | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Menu có mục "Nhà cung cấp" chưa có màn [PH-018] |
| `PM3CSCN.WEB.15.02.01` | Quản lý danh mục hàng hóa cung ứng theo từng nhà cung cấp | (ô trống trong tệp gốc) | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Không có màn riêng; nút "Thêm tất cả mặt hàng" trên MP-004 dùng danh sách mặt hàng của nhà cung cấp [PH-018] |
| `PM3CSCN.WEB.15.02.02` | Tra cứu và kết xuất danh mục hàng hóa theo nhà cung cấp | (ô trống trong tệp gốc) | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN | Không có (mã nguồn prototype không ghi mã UC) | Không có màn riêng [PH-018] |

- "Prototype ghi ở menu": mục menu mà mã nguồn prototype ghi mã UC này (nếu có); chỉ là manh mối.
- Gắn UC vào màn theo mã prototype ghi chỉ khi tên, actor UC cũng khớp chức năng màn; ghi giả định.
