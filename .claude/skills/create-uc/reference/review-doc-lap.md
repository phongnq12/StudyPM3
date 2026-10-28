# Review độc lập một UC

Phần tra cứu của skill [`create-uc`](../SKILL.md). Bước này **bắt buộc** sau khi viết và tự soát xong.

## Nguyên tắc giao việc

- Reviewer là **một agent mới**, không phải chính phiên vừa viết UC.
- Chỉ đưa **đường dẫn**: file UC, nơi chứa business layer, thư mục tài liệu khách hàng, sổ giả định,
  prototype. **Không** đưa lập luận, ghi chú, lịch sử trao đổi của người viết — đọc lập luận thì
  reviewer sẽ đồng ý theo.
- Dùng model mạnh dành cho review theo chính sách chọn model của dự án.
- Reviewer **không sửa file**. Người viết quyết sửa hay không, và ghi lý do khi không sửa.

## Prompt mẫu

Thay các phần trong `<>`, giữ nguyên phần còn lại.

```text
Bạn là reviewer độc lập cho một file đặc tả Use Case. Bạn không biết gì về quá trình viết nó, và đó là
chủ ý. Không sửa file nào.

Đọc trước, toàn bộ:
- Skill viết UC: .claude/skills/create-uc/SKILL.md và các file trong .claude/skills/create-uc/reference/
- Template: 3-ba-detail/templates/use-case/TEMPLATE_UC.md
- File UC cần review: <đường dẫn UC>

Nguồn để đối chiếu:
- Business layer: <đường dẫn, hoặc "chưa có">
- Tài liệu khách hàng: <đường dẫn>
- Sổ giả định: <đường dẫn assumption_log.md>
- Prototype: <đường dẫn code prototype>

Làm ba việc:

1. Đúng format. Chạy từng dòng checklist "Soát trước khi đóng" ở cuối SKILL.md. Dòng nào không đạt
   thì ghi vào bảng phát hiện.

2. Sở cứ đúng. Với từng ô Sở cứ có nội dung, mở nguồn được dẫn và kiểm hai điều: nguồn có thật không
   (file, điều khoản, mã có tồn tại không), và nguồn có nói đúng điều UC gán cho nó không. Con số kèm
   biên chép trong ô có khớp nguồn không. Chuỗi thông báo và route có khớp prototype không.

3. Sở cứ đủ. Tìm cái thiếu, đặc biệt:
   - Quy tắc liên domain chạm vào thực thể mà UC tạo hoặc sửa, nhưng UC không dẫn.
   - Thực thể khác bị UC ảnh hưởng (tạo kèm, đổi theo, khóa theo) mà UC không nhắc.
   - Trạng thái của thực thể khác đổi theo khi UC chạy.
   - Giả định đã có trong sổ, liên quan tới UC, mà UC chưa dẫn.
   - Bước có kiểm tra, quyết định, ghi, hoặc gửi đi mà ô Sở cứ là n/a.
   - Ràng buộc dữ liệu (định dạng, độ dài, bắt buộc) đang dẫn tới prototype thay vì lớp dữ liệu hoặc
     giả định.
   - Ghi tạm trước bước ghi mà không khai ở câu soát #6, hoặc không có UC dọn.

Báo cáo bằng tiếng Việt có dấu, gồm một bảng:
| # | Mức (Chặn / Nặng / Nhẹ) | Việc (1/2/3) | Ở đâu trong UC (mục, mã bước) | Vấn đề | Bằng chứng (nguồn, dòng) | Đề xuất sửa |

"Chặn" = dev hoặc QC sẽ làm sai nếu giữ nguyên. "Nặng" = thiếu hoặc lệch nguồn, chưa gây sai ngay.
"Nhẹ" = định dạng. Không phát hiện gì ở một việc thì ghi rõ "Việc N: không có phát hiện" kèm những gì
đã kiểm. Cuối báo cáo, một câu kết luận: UC có thể chuyển cho-duyet chưa.
```
