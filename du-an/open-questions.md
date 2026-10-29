# Câu hỏi mở và quyết định — dự án

## 1. Câu hỏi
| Q | Câu hỏi | Phương án | Liên quan (ID) | Hỏi ai | Chặn gate | Ngày mở | Trạng thái | Quyết định | Người quyết, ngày | Nguồn quyết định | Mức rủi ro | Phương án tạm |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## 2. Giả định
| ASM | Nội dung | Ở đâu | Q liên quan | Ngày | Trạng thái | Nguồn xác nhận | Mức rủi ro |
| --- | --- | --- | --- | --- | --- | --- | --- |

## 3. Phát hiện
| PH | Đối tượng | Bước | Chức năng | Phát hiện | Loại | Nguồn | Đề xuất | Q liên quan | Trạng thái | Đóng ở |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PH-028 | `1-ba-init/0-dau-vao/uc-presales.md` mục 0 | 2 | | Tên sheet "WBS (Tổng hợp P1 + P2)" cho thấy hai giai đoạn, nhưng không dòng UC nào ghi giai đoạn; bước 1 chưa ghi nhận | thiếu dữ liệu | [SRC: 0-inputs/presales/uc/StudyQuanLyKho.xlsx, WBS (Tổng hợp P1 + P2), tên sheet] | BA trả lời BRD Q-B06: tất cả thuộc một giai đoạn [SRC: 0-inputs/answers-2026-10-29.md, RQ-77] | — | mở | |
| PH-029 | Vai kế toán | 2 | | README prototype có tài khoản "Kế toán" (xem, xuất Excel giá nhập), nhưng Q-001 không có kế toán; PH-021 còn mở | thiếu actor | [SRC: 0-inputs/presales/prototype/README.md, mục "Tài khoản demo"] | BRD Q-B08: kế toán là người dùng nhưng phạm vi hiện tại chưa sử dụng [SRC: 0-inputs/answers-2026-10-29.md, RQ-79]; lớp 5 ghi tác nhân ngoài phạm vi | — | mở | |
| PH-030 | Hệ thống bán hàng căng tin | 2 | | Không nguồn bước 1 nào ghi chủ sở hữu, đầu mối dù RQ-54 dựa vào việc hệ thống này tự đọc dữ liệu kho | thiếu dữ liệu | [SRC: 1-ba-init/0-dau-vao/ban-do-quy-trinh/ban-do-quy-trinh.md, mục 4] | BRD Q-B09: cơ sở sở hữu, vận hành; người phụ trách căng tin là đầu mối [SRC: 0-inputs/answers-2026-10-29.md, RQ-80] | — | mở | |
| PH-031 | Xem tồn kho hiện tại theo kho, mặt hàng, lô | 2 | | Không UC presales nào làm (`PM3CSCN.WEB.09.04.04` chỉ là lịch sử nhập, điều chuyển), nhưng menu prototype có mục "Tồn kho" | thiếu luồng | [SRC: 0-inputs/presales/prototype/src/layout/menuConfig.js]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-14] | BRD Q-B17: UC mới ngoài danh sách presales, PM đánh giá [SRC: 0-inputs/answers-2026-10-29.md, RQ-88]; lớp 5 thêm UC | — | mở | |
