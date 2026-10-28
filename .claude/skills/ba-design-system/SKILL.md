---
name: ba-design-system
description: "Design system của công ty cho prototype và đặc tả màn hình: màu, chữ, khoảng cách, component, quy tắc form, nguồn chữ trên giao diện. Dùng ở bước 10 (ba-prototype), bước 11 (ba-screens), SCR-000 và sitemap ở bước 2."
user-invocable: false
paths: "3-ba-detail/Prototype/**, 3-ba-detail/Screens/**"
metadata:
  version: 1.4.0
  owner: BA lead
  updated: 2026-10-26
---

# Design system (tham chiếu) — BA thay giá trị mẫu bằng design system thật của công ty

> **Bản mẫu.** Token, component dưới đây là giá trị mẫu của kit. **Kit dùng Design System PM2** ở
> `3-ba-detail/templates/design-system/` (đọc `design_system.md`; màu chủ đạo theo `du-an/cau-hinh.md`); khi khác,
> PM2 thắng. Cách dựng prototype: `.claude/skills/ba-detail/method-prototype.md`.

Căn cứ chuẩn: ISO 9241-110:2020 (nguyên tắc tương tác: phù hợp nhiệm vụ, tự mô tả, đúng kỳ vọng, chịu lỗi); WCAG 2.2
mức AA (tương phản, nhãn, thông báo lỗi bằng chữ) — skill ba-standards mục "Tiêu chuẩn quốc tế kit dựa vào".

Chi tiết token: [tokens.css](tokens.css). Danh mục component: [components.md](components.md).
[wireframe.css](wireframe.css): lớp `.wf-*` thang xám của kit v1, giữ để tham khảo; kit hiện tại không có bước
wireframe, prototype sửa thẳng từ presales.

## Nguyên tắc
- Prototype chỉ dùng token trong tokens.css, không tự đặt màu, cỡ chữ. Cách đưa token vào prototype React: viết ở
  bước 10 khi có design system thật.
- Chỉ dùng component có trong components.md. Cần component mới → ghi ASM và câu hỏi cho UI/UX.
- Đặc tả màn hình gọi đúng tên component (vd "Select có tìm kiếm", "Date range picker").
- Form: nhãn trên ô nhập (không dùng placeholder thay nhãn); field bắt buộc có dấu * và chữ chú thích "bắt buộc" cho
  trình đọc màn hình; lỗi hiện dưới ô bằng chữ, màu --color-danger (không chỉ báo bằng màu — WCAG 2.2 tiêu chí 1.4.1,
  3.3.1).
- Bảng dữ liệu: có phân trang, sắp xếp, trạng thái trống, trạng thái đang tải.

## Nội dung chữ trên giao diện — không tự viết
Áp cho prototype, đặc tả màn hình và SCR-000. Mọi khối chữ (banner, alert, callout, toast, tooltip, chú thích dưới ô,
mô tả trạng thái trống, tiêu đề phụ, câu hướng dẫn, nội dung modal xác nhận) phải lấy nguyên văn từ spec. Không có nguồn
thì dùng khối giữ chỗ, không tự viết.

### Nguồn được phép
| Loại chữ | Lấy từ |
| --- | --- |
| Thông báo lỗi, thành công, cảnh báo | SCR mục 6 "Kiểm tra dữ liệu và thông báo" (mã `TB-xxx-xx`, đúng nội dung); thông báo dùng chung: SCR-000 mục 5 |
| Lý do chặn, điều kiện | BR (phát biểu đã duyệt), viết lại cho người dùng chỉ khi SCR mục 6 đã có câu đó |
| Nhãn nút, tên bước | UC (bước), SCR mục 5 "Hành động" |
| Nhãn field, cột | ENT.thuộc tính, SCR mục 4 "Trường", glossary |
| Tên trạng thái | ST trong state machine, glossary |
| Câu hướng dẫn, chú thích | Chỉ khi UC, SCR hoặc biên bản ghi rõ cần câu đó |

### Bốn quy tắc
1. **Không tự viết khối chú thích, giải thích, hướng dẫn mà spec không yêu cầu.** Màn hình cần một khối thông báo nhưng
   chưa có nội dung → khối giữ chỗ `[Thông báo: chờ SCR-xxx mục 6]` và ghi ASM.
2. **Không tự viết nội dung do người dùng khác nhập** (lý do trả lại, ý kiến người duyệt, ghi chú, phản hồi). Hiển thị
   khối giữ chỗ ghi rõ nguồn dữ liệu: `[Lý do trả lại — do <vai trò> nhập ở SCR-yyy]`.
3. **Không đưa số liệu nghiệp vụ, mã số, tên đơn vị, kỳ báo cáo vào câu chữ.** Dữ liệu mẫu chỉ nằm trong ô dữ liệu, bảng,
   field, có nhãn "mẫu", và không trông như kết quả thật.
4. **Không suy ra quy trình trong câu chữ** (vd "sửa rồi trình lại để nộp lần hai", "số biên nhận không đổi khi nộp lại")
   khi UC, BR chưa ghi. Hành vi đó cần BR/UC trước; chưa có → Q, không viết lên giao diện.

### Ví dụ
- Đúng: khối cảnh báo trên màn hình báo cáo bị trả lại: tiêu đề "Báo cáo bị trả lại" (SCR-012 mục 6, mã TB-012-03);
  nội dung `[Lý do trả lại — do Người duyệt nhập ở SCR-020]`.
- Sai: "Phòng Tài chính đã trả lại bản này — sửa rồi trình lại để nộp lần hai. Tổng thu khai 3.560 triệu đồng, tổng chi
  3.210 triệu đồng, chênh 350 triệu; kỳ trước chênh 355 triệu … Số biên nhận BN-0001 không đổi khi nộp lại."
  (tự viết lý do của người duyệt, bịa số liệu và mã số, suy ra quy trình nộp lại chưa có trong BR)
- Đúng: trạng thái trống "Chưa có báo cáo nào" lấy từ SCR-010 mục 8 "Hiển thị theo trạng thái và quyền", dòng Trống (bốn trạng thái chung ở SCR-000 mục 6).
- Sai: trạng thái trống "Bắt đầu bằng cách tải tệp Excel theo biểu mẫu để hệ thống tự kiểm tra số liệu"
  khi SCR không có câu này.
- Đúng: tooltip `[Chú thích: chờ BA cung cấp]` kèm ASM-xxx trong prototype-notes.
- Sai: tự thêm tooltip giải thích công thức tính khi BR chưa có công thức.
