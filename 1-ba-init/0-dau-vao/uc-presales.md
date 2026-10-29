# Danh mục UC presales — Quản lý kho căng tin
| Nguồn | Mức presales | Số UC | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- |
| [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2)] | 1 (chỉ danh sách) | 31 | 2026-10-28 | draft |

**File này dùng để làm gì.** Chép lại danh sách UC (use case, trường hợp sử dụng) trong hồ sơ chào giá: mỗi UC
là một việc phần mềm đã hứa làm cho một người dùng, ví dụ "Lập kế hoạch kiểm tra" cho Chuyên viên
nghiệp vụ. Đây là **mốc phạm vi** của dự án: những gì đã chào giá. Mọi chức năng, yêu cầu sau này phải dẫn được về một UC ở
đây (`PS:<mã gốc>`), hoặc được ghi rõ là thêm mới ngoài báo giá.
- Chép **nguyên văn** từ file presales: không sửa, không gộp, không tách, không đánh giá đúng sai.
- Mã gốc là số thứ tự trong file presales, không phải mã của kit; nơi khác dẫn bằng `PS:<mã gốc>`.
- Quyết định với từng UC (Giữ / Làm rõ / Tách / Gộp / Mở rộng / Bỏ / Thêm mới) **không ghi ở đây**, chỉ ghi ở
  `2-ba-overview/5-actor-usecase/uc-overview.md` (bước 2).

**Lấy dữ liệu từ:**
- `0-inputs/presales/uc/StudyQuanLyKho.xlsx`: danh sách UC (vị trí cột, dòng: mục 0); tệp không có sheet danh sách tác nhân.
- `1-ba-init/open-questions.md`: các mã `[Q-xxx]` (câu hỏi), `[ASM-xxx]` (giả định), `[PH-xxx]` (phát hiện) dẫn trong file.

**Được dùng ở:**
- Bước 1: `uc-phap-ly.md` (ghép UC với điều khoản luật), `man-presales.md` (gắn màn prototype với UC).
- Bước 2 /ba-overview: quyết định giữ, bỏ, tách, gộp từng UC (`uc-overview.md`); điền cột "Chức năng" (UC thuộc chức
  năng CN-xx nào); ma trận UC × quy trình.
- `brief.md` của từng chức năng: danh sách UC presales của chức năng.
- Yêu cầu, use case chi tiết ở các bước sau dẫn về UC gốc bằng `PS:<mã gốc>`.

**Tóm tắt.** File chào giá có 31 UC, mức presales 1: chỉ có danh sách (mã WBS và tên ở cột "Tính năng"), không có cột
mô tả luồng. Không có mã trùng, không có dòng thiếu mã. Theo phân hệ cấp 1: `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN có
20 UC, `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG có 5 UC, `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA
CĂNG TIN có 6 UC. Phân loại có sẵn trong file chào giá: chỉ có phân cấp theo mã WBS (cột "Group", "Nền tảng" trống ở
mọi dòng). Tác nhân: cột "Actor" trống ở mọi dòng và tệp không có danh sách tác nhân [PH-001]. Q-001 đã quyết ở
`1-ba-init/open-questions.md`: tác nhân theo vai trò người phụ trách căng tin (thuật ngữ theo [SRC: 0-inputs/answers-2026-10-29.md, RQ-66]), Trưởng cơ sở, tổ kiểm kê
[SRC: 0-inputs/answers-2026-10-28.md, RQ-05, RQ-07, RQ-08, RQ-15, RQ-32, RQ-33, RQ-40]. Cột "Actor" ở mục 1 vẫn chép
đúng nguồn (ô trống). Dòng nhóm `PM3CSCN.WEB.09.04` Quản lý kho có chữ "Bổ sung thêm" ở cột "Tính năng" [PH-002];
Q-002 đã quyết: nhóm này và 4 UC thuộc báo giá [SRC: 0-inputs/answers-2026-10-29.md, RQ-50]. Tên dòng nhóm cấp 1
`PM3CSCN.WEB.10` ghi "M09", `PM3CSCN.WEB.15` ghi "M17", khác số trong mã WBS [PH-003]; Q-003 đã quyết: dẫn phân hệ
theo mã WBS (WEB.09, WEB.10, WEB.15) [SRC: 0-inputs/answers-2026-10-29.md, RQ-50].
Câu hỏi còn chờ: không có.

**Căn cứ chuẩn:** BABOK v3 mục 4.3 "Confirm Elicitation Results" (ghi nhận nguyên văn kết quả thu thập); ISO/IEC/IEEE 29148:2018 mục 5.2 (thuộc tính yêu cầu, gồm truy vết về nguồn: mỗi yêu cầu sau này dẫn `PS:<mã gốc>`).

## 0. Vị trí trong nguồn
Mục này cho biết danh sách UC nằm ở đâu trong file chào giá (tệp, sheet, dòng tiêu đề, cột mã, cột tên), để máy
kiểm đối chiếu từng dòng với file gốc. Người đọc nghiệp vụ có thể bỏ qua.

| Tệp | Sheet | Dòng tiêu đề | Cột mã | Cột tên |
| --- | --- | --- | --- | --- |
| 0-inputs/presales/uc/StudyQuanLyKho.xlsx | WBS (Tổng hợp P1 + P2) | 4 | 2 | 7 |

Dòng tiêu đề: số dòng trong Excel của dòng tên cột; máy tìm dòng UC bị sót từ dòng kế tiếp. Cột đánh số từ 1 theo thứ
tự ô trong dòng (ô trống ở giữa vẫn tính). `kit/tools/ba-verify/dau-vao-check.mjs` dùng bảng này để đối chiếu từng dòng
danh mục với dòng trong file gốc (mã và tên phải khớp nguyên văn) và tìm dòng UC bị sót. Nhiều tệp hoặc nhiều sheet:
mỗi tệp, sheet một dòng.

Cách đọc sheet (ghi nhận khi chép, không phải đánh giá) [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 1–46]:
- Dòng 1 và dòng 4 cùng là dòng tên cột, nội dung giống nhau: (cột 1 trống) | No | Group | Nền tảng | Module | Chức
  năng | Tính năng | Actor. Dòng 2, 3 không có dữ liệu. Bảng lấy dòng 4 làm dòng tiêu đề.
- Cột 2 "No" là mã WBS dạng `PM3CSCN.WEB.<nhóm>.<nhóm con>.<số>`. Dòng mã ba đoạn sau `PM3CSCN` (ví dụ
  `PM3CSCN.WEB.09`) là dòng nhóm cấp 1, tên ở cột 5 "Module". Dòng mã bốn đoạn (ví dụ `PM3CSCN.WEB.09.01`) là dòng
  nhóm cấp 2, tên ở cột 6 "Chức năng". Dòng mã năm đoạn (ví dụ `PM3CSCN.WEB.09.01.01`) là UC, tên ở cột 7 "Tính
  năng" [ASM-001].
- Cột "Phân hệ" ở mục 1 ghi đủ hai cấp nhóm, dạng "`<mã cấp 1>` <tên cấp 1> / `<mã cấp 2>` <tên cấp 2>", lấy từ dòng
  nhóm gần nhất phía trên. Mã nhóm giữ để dẫn nguồn; tên nhóm chép nguyên văn.
- Cột 3 "Group", cột 4 "Nền tảng", cột 8 "Actor" trống ở mọi dòng từ dòng 5 tới dòng 46.

## 1. Danh mục
Cách đọc bảng: mỗi dòng một UC, chép nguyên văn file chào giá.
- **Mã gốc**: số thứ tự UC trong file chào giá. Tài liệu khác dẫn bằng `PS:<mã gốc>`.
- **Tên**: tên UC, thường là "động từ + đối tượng".
- **Actor**: người dùng hoặc hệ thống thực hiện UC, viết như file chào giá (bảng tác nhân dưới).
- **Phân hệ**: nhóm chức năng trong file chào giá, ghi đủ các cấp.
- **Mô tả luồng**: các bước người dùng làm và phần mềm phản hồi; `<br>` là xuống dòng trong ô gốc.
- **Nguồn**: vị trí trong file chào giá. **Chức năng**: UC thuộc chức năng CN-xx nào; bước 1 để trống, bước 2 điền.

Ở dự án này, mã gốc là mã WBS ở cột "No" (không phải số thứ tự). Cột "Mô tả luồng" ghi `n/a` vì sheet không có cột mô
tả luồng. Cột "Actor" ghi "(ô trống trong tệp gốc)" vì ô Actor của mọi dòng UC đều trống [PH-001].

Tác nhân (cột "Actor"):

| Viết tắt | Là ai (theo file chào giá) | Số UC |
| --- | --- | --- |
| (không có) | Tệp chào giá không có sheet hay bảng danh sách tác nhân; cột "Actor" trống ở cả 31 dòng UC [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), cột 8, dòng 5–46] [PH-001] [Q-001] | 0 |

| Mã gốc | Tên (nguyên văn) | Actor (nguyên văn) | Phân hệ | Mô tả luồng (nguyên văn, nếu có) | Nguồn | Chức năng |
| --- | --- | --- | --- | --- | --- | --- |
| `PM3CSCN.WEB.09.01.01` | Tạo / Cập nhật phiếu nhập kho hàng hóa căng tin mới nhập từ nhà cung cấp | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.01` Quản lý phiếu nhập hàng kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 7] | |
| `PM3CSCN.WEB.09.01.02` | Phê duyệt phiếu nhập kho hàng hóa căng tin và tăng tồn kho | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.01` Quản lý phiếu nhập hàng kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 8] | |
| `PM3CSCN.WEB.09.01.03` | Từ chối phiếu nhập kho hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.01` Quản lý phiếu nhập hàng kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 9] | |
| `PM3CSCN.WEB.09.01.04` | Hủy phê duyệt phiếu nhập kho hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.01` Quản lý phiếu nhập hàng kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 10] | |
| `PM3CSCN.WEB.09.01.05` | In phiếu nhập kho hàng hóa căng tin phục vụ lưu trữ kế toán | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.01` Quản lý phiếu nhập hàng kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 11] | |
| `PM3CSCN.WEB.09.01.06` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu nhập kho căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.01` Quản lý phiếu nhập hàng kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 12] | |
| `PM3CSCN.WEB.09.02.01` | Tạo phiếu xuất kho, điều chuyển nhu yếu phẩm sang quầy bán căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.02` Quản lý phiếu xuất kho / điều chuyển kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 14] | |
| `PM3CSCN.WEB.09.02.02` | Phê duyệt phiếu xuất kho / điều chuyển hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.02` Quản lý phiếu xuất kho / điều chuyển kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 15] | |
| `PM3CSCN.WEB.09.02.03` | Từ chối phiếu xuất kho / điều chuyển hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.02` Quản lý phiếu xuất kho / điều chuyển kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 16] | |
| `PM3CSCN.WEB.09.02.04` | Hủy phê duyệt phiếu xuất kho / điều chuyển | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.02` Quản lý phiếu xuất kho / điều chuyển kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 17] | |
| `PM3CSCN.WEB.09.02.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu xuất kho, điều chuyển | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.02` Quản lý phiếu xuất kho / điều chuyển kho căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 18] | |
| `PM3CSCN.WEB.09.03.01` | Lập biên bản kiểm kê số lượng tồn kho thực tế tại quầy căng tin và ghi nhận chênh lệch | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.03` Quản lý kiểm kê tồn kho căng tin định kỳ | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 20] | |
| `PM3CSCN.WEB.09.03.02` | Phê duyệt kết quả kiểm kê và thực hiện điều chỉnh số dư kho tự động | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.03` Quản lý kiểm kê tồn kho căng tin định kỳ | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 21] | |
| `PM3CSCN.WEB.09.03.03` | Từ chối kết quả kiểm kê khi phát hiện sai sót | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.03` Quản lý kiểm kê tồn kho căng tin định kỳ | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 22] | |
| `PM3CSCN.WEB.09.03.04` | Hủy phê duyệt biên bản kiểm kê tồn kho | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.03` Quản lý kiểm kê tồn kho căng tin định kỳ | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 23] | |
| `PM3CSCN.WEB.09.03.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất biên bản kiểm kê kho căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.03` Quản lý kiểm kê tồn kho căng tin định kỳ | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 24] | |
| `PM3CSCN.WEB.09.04.01` | Xem/Tìm kiếm danh sách kho | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.04` Quản lý kho (cột "Tính năng" của dòng nhóm ghi: "Bổ sung thêm") [PH-002] | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 26] | |
| `PM3CSCN.WEB.09.04.02` | Thêm/Sửa/Xóa kho | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.04` Quản lý kho (cột "Tính năng" của dòng nhóm ghi: "Bổ sung thêm") [PH-002] | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 27] | |
| `PM3CSCN.WEB.09.04.03` | Cấu hình hạn mức cảnh báo | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.04` Quản lý kho (cột "Tính năng" của dòng nhóm ghi: "Bổ sung thêm") [PH-002] | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 28] | |
| `PM3CSCN.WEB.09.04.04` | Theo dõi lịch sử Nhập/Điều chuyển kho | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.04` Quản lý kho (cột "Tính năng" của dòng nhóm ghi: "Bổ sung thêm") [PH-002] | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 29] | |
| `PM3CSCN.WEB.10.01.01` | Quản lý danh mục hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG / `PM3CSCN.WEB.10.01` Cấu hình danh mục hàng hóa và giá bán căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 32] | |
| `PM3CSCN.WEB.10.01.02` | Phê duyệt đơn giá bán hàng hóa căng tin trước khi công bố | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG / `PM3CSCN.WEB.10.01` Cấu hình danh mục hàng hóa và giá bán căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 33] | |
| `PM3CSCN.WEB.10.01.03` | Từ chối đơn giá bán hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG / `PM3CSCN.WEB.10.01` Cấu hình danh mục hàng hóa và giá bán căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 34] | |
| `PM3CSCN.WEB.10.01.04` | Hủy phê duyệt đơn giá bán hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG / `PM3CSCN.WEB.10.01` Cấu hình danh mục hàng hóa và giá bán căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 35] | |
| `PM3CSCN.WEB.10.01.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh mục hàng hóa và lịch sử thay đổi giá | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG / `PM3CSCN.WEB.10.01` Cấu hình danh mục hàng hóa và giá bán căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 36] | |
| `PM3CSCN.WEB.15.01.01` | Quản lý hồ sơ nhà cung cấp hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN / `PM3CSCN.WEB.15.01` Quản lý nhà cung cấp hàng hóa căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 39] | |
| `PM3CSCN.WEB.15.01.02` | Tra cứu và kết xuất danh sách nhà cung cấp hàng hóa căng tin | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN / `PM3CSCN.WEB.15.01` Quản lý nhà cung cấp hàng hóa căng tin | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 40] | |
| `PM3CSCN.WEB.15.02.01` | Quản lý danh mục hàng hóa cung ứng theo từng nhà cung cấp | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN / `PM3CSCN.WEB.15.02` Quản lý danh mục hàng hóa theo nhà cung cấp | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 42] | |
| `PM3CSCN.WEB.15.02.02` | Tra cứu và kết xuất danh mục hàng hóa theo nhà cung cấp | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN / `PM3CSCN.WEB.15.02` Quản lý danh mục hàng hóa theo nhà cung cấp | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 43] | |
| `PM3CSCN.WEB.15.03.01` | Quản lý giá nhập hàng hóa theo từng nhà cung cấp và từng đợt nhập | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN / `PM3CSCN.WEB.15.03` Quản lý giá nhập theo nhà cung cấp | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 45] | |
| `PM3CSCN.WEB.15.03.02` | Tra cứu và kết xuất lịch sử giá nhập theo nhà cung cấp | (ô trống trong tệp gốc) [PH-001] | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN / `PM3CSCN.WEB.15.03` Quản lý giá nhập theo nhà cung cấp | n/a | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), dòng 46] | |

- Nguồn ghi đúng dạng `[SRC: <tệp>, <sheet>, dòng <n>]` (n là số dòng trong Excel) để máy đối chiếu được.

- Cột "Chức năng" (CN-xx) để trống ở bước 1; bước 2 (`/ba-overview`) điền.
- Mã gốc trùng nhau trong file presales: không có ở tệp này.
- Dòng không có mã gốc: không có ở tệp này.

## 2. Thống kê
Cách đọc bảng: số UC theo từng nhóm chức năng của file chào giá; dòng in đậm là cộng của nhóm cấp 1. "Có mô tả
luồng" là số UC có cột "Mô tả luồng".

| Phân hệ | Số UC | Có mô tả luồng |
| --- | --- | --- |
| **`PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN** | **20** | **0** |
| `PM3CSCN.WEB.09.01` Quản lý phiếu nhập hàng kho căng tin | 6 | 0 |
| `PM3CSCN.WEB.09.02` Quản lý phiếu xuất kho / điều chuyển kho căng tin | 5 | 0 |
| `PM3CSCN.WEB.09.03` Quản lý kiểm kê tồn kho căng tin định kỳ | 5 | 0 |
| `PM3CSCN.WEB.09.04` Quản lý kho [PH-002] | 4 | 0 |
| **`PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG** [PH-003] | **5** | **0** |
| `PM3CSCN.WEB.10.01` Cấu hình danh mục hàng hóa và giá bán căng tin | 5 | 0 |
| **`PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN** [PH-003] | **6** | **0** |
| `PM3CSCN.WEB.15.01` Quản lý nhà cung cấp hàng hóa căng tin | 2 | 0 |
| `PM3CSCN.WEB.15.02` Quản lý danh mục hàng hóa theo nhà cung cấp | 2 | 0 |
| `PM3CSCN.WEB.15.03` Quản lý giá nhập theo nhà cung cấp | 2 | 0 |
| **Tổng** | **31** | **0** |
