# Ghi chú cho mọi agent — dự án Quản lý kho căng tin

Ghi chú riêng của dự án, gửi kèm mọi agent (skill ba-agent-protocol mục 2). Chỉ **bổ sung hoặc thu hẹp** chuẩn của
kit: thuật ngữ, lưu ý về đầu vào, quyết định của BA ảnh hưởng nhiều bước. Mỗi ý kèm mã câu hỏi, câu trả lời làm nguồn.
Ghi chú riêng cho một agent đặt ở `du-an/agent-notes/<tên-agent>.md`.

## Đầu vào presales

- Tệp UC presales: `0-inputs/presales/uc/StudyQuanLyKho.xlsx` (BA đổi tên, RQ-43). Mã UC là mã WBS cột `No`, dạng
  `PM3CSCN.WEB.xx.yy.zz`; dẫn phân hệ theo mã WBS, không theo M09, M17 (Q-003, RQ-50). Cột Actor của presales trống;
  actor theo Q-001.
- Sơ đồ quy trình presales: `0-inputs/presales/quy-trinh/QTPR-*.drawio` (RQ-45, RQ-46). Nhãn ô còn chữ `PROC-xx`,
  `PROC-xx.yy` của presales: khi chép luôn đặt trong backtick để không lẫn với mã PROC của kit; dẫn bước presales bằng
  mã `QP-xx.yy` của `1-ba-init/0-dau-vao/quy-trinh-presales.md`. Presales không gắn UC cho bước nào và không có bảng
  mapping (Q-014, `GD-0005`).
- Prototype chỉ dựng chức năng giá nhập theo nhà cung cấp (MP-001…MP-004); 28/31 UC chưa có màn (PH-018).
- Bản đồ quy trình bước 1 (BA chốt, RQ-47): QT-01…QT-06 ở `1-ba-init/0-dau-vao/ban-do-quy-trinh/`.

## Design system

## Quyết định của BA áp cho mọi bước

Nguồn: `0-inputs/answers-2026-10-28.md` (RQ-01…RQ-43), `0-inputs/answers-2026-10-29.md` (RQ-44…RQ-71); sổ
`1-ba-init/open-questions.md`; sổ giả định `2-ba-overview/assumption_log.md`.

- Mã dự án `PM3CSCN`, nền tảng `WEB`, phạm vi tên file `QuanLyKhoCangTin`; khách hàng: cơ sở cai nghiện ma túy công
  lập (RQ-69, RQ-70, RQ-71).
- Văn bản áp dụng: tệp chính TT 79/2026/TT-BCA và NĐ 163/2026/NĐ-CP (163/2026/NĐ-CP, 2026-05-15); Luật 120/2025/QH15,
  NĐ 166/2026/NĐ-CP, các phụ lục, mẫu không áp dụng (RQ-48, RQ-62).
- Thuật ngữ vai trò: **người phụ trách căng tin** (không dùng "cán bộ căng tin", "thủ kho", "nhân viên căng tin");
  Trưởng cơ sở; tổ kiểm kê (Q-013, RQ-66; Q-001).
- Nhiều kho ngang hàng, không kho tổng; xuất kho chỉ có điều chuyển; hư hỏng, hết hạn xử lý qua kiểm kê (RQ-01, RQ-02).
- Bán hàng cho người cai nghiện ngoài phạm vi; Hệ thống bán hàng căng tin tự đọc dữ liệu kho, phần mềm kho không có
  UC tích hợp riêng (RQ-03, Q-015, RQ-54).
- Tồn theo lô, hạn sử dụng; giá bán theo lô (mặt hàng + lô), cùng lô cùng giá ở mọi kho; bán FEFO (RQ-14, RQ-19, RQ-21).
- Chi phí hợp lý tính bên ngoài hệ thống; người dùng nhập giá bán ≥ giá nhập (`GD-0001`, Q-005, Q-006).
- Không phân loại nhóm hàng theo TT79 Đ41.K4 / NĐ163 Đ120.K3; Trưởng cơ sở kiểm đồ vật cấm khi duyệt giá đầu (Q-007,
  RQ-24); bao bì đồ vật cấm tạm chưa xét (`GD-0002`, Đang mở).
- Chứng từ kho, nhà cung cấp là nghiệp vụ nội bộ, không có quy chế riêng (Q-019, Q-020, Q-010); mẫu chứng từ kho do dự
  án tự thiết kế (Q-009); in phiếu nhập kho ngay sau khi tạo xong phiếu (Q-021).
- 6 việc trong quy trình presales không UC presales nào làm là UC mới ngoài danh sách presales, PM đánh giá (Q-022,
  RQ-51). Hộp "Quyết định giá bán" thuộc UC `PM3CSCN.WEB.10.01.01` (Q-017).
- Quét cảnh báo hạn sử dụng lúc 00:00 hằng ngày (`GD-0003`); số ngày cảnh báo N theo kho: [CẦN XÁC NHẬN] (RQ-31).
- Phiếu đặt hàng hóa từ đơn hàng (mua hộ qua đơn vị cung ứng) ngoài phạm vi lần này (`GD-0004`).
