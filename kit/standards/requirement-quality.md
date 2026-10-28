# Checklist chất lượng (dựa trên đặc tính yêu cầu tốt của ISO/IEC/IEEE 29148)

Áp dụng cho từng REQ, BR, UC mới hoặc bị sửa.

| # | Đặc tính | Câu hỏi kiểm tra | Mức khi vi phạm |
| --- | --- | --- | --- |
| 1 | Cần thiết | Bỏ đi thì có mất giá trị nghiệp vụ nào không? Có nguồn không? | Nên sửa |
| 2 | Không mơ hồ | Có từ như "nhanh", "thân thiện", "v.v.", "phù hợp", "linh hoạt" không? | Chặn merge |
| 3 | Đầy đủ | Có thiếu ai, khi nào, điều kiện, ngoại lệ không? | Nên sửa |
| 4 | Đơn nhất | Một câu chỉ chứa một ý? Có "và/hoặc" gộp hai yêu cầu không? | Nên sửa |
| 5 | Khả thi | Có mâu thuẫn ràng buộc đã biết (thời gian, công nghệ, pháp lý) không? | Nên sửa |
| 6 | Kiểm chứng được | Viết được kịch bản kiểm thử có kết quả đúng/sai rõ ràng không? | Chặn merge |
| 7 | Đúng | Khớp nguồn đã dẫn không? | Chặn merge |
| 8 | Tuân thủ quy ước | Đúng template, ID, thuật ngữ glossary? | Nên sửa |

## Nhất quán chéo (chỉ so với nội dung đã approved trên main)
- Entity xuất hiện trong process phải có trong ERD (hoặc lý do loại).
- Mỗi TR-xxx có ít nhất một UC chứa nó trong hậu điều kiện.
- Mỗi validation trên màn hình dẫn tới một BR.
- Mỗi field màn hình dẫn tới thuộc tính ENT.
- Mỗi REQ loại FR truy vết tới ít nhất một UC hoặc SCR.
- Không có trạng thái không tới được hoặc không thoát được (trừ trạng thái kết thúc).
- Overview và chi tiết khớp nhau: mỗi PROC, ENT, nhóm nghiệp vụ ở bản chi tiết có mặt ở overview và ngược lại;
  bản chi tiết không định nghĩa lại đối tượng của overview hay của nhóm khác.
- Chỗ chuyển giao giữa hai PROC và liên kết giữa hai vòng đời (TR kích hoạt TR) khớp ở cả hai đầu.
- Mỗi UC presales trong docs/0-dau-vao/uc-presales.md (thuộc phạm vi) có quyết định ở bảng chốt UC (uc-overview.md); mỗi phát hiện (1-ba-init/open-questions.md, du-an/open-questions.md mục 3) đã đóng hoặc còn Q.

## Ba mức lỗi
- **Chặn merge:** sai so với nguồn, mơ hồ, không kiểm chứng được, ID trùng, phá vỡ nhất quán chéo.
- **Nên sửa:** thiếu, gộp ý, lệch template.
- **Gợi ý:** cách viết, trình bày.
