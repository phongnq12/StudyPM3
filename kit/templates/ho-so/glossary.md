# Glossary — <tên dự án>
| Thuật ngữ | Định nghĩa | Từ tiếng Anh | Không dùng (từ đồng nghĩa dễ nhầm) | Nguồn |
| --- | --- | --- | --- | --- |
| | | | | [SRC: …] |

**Căn cứ chuẩn:** ISO 704:2022 (nguyên tắc định nghĩa thuật ngữ), ISO 1087:2019 (một khái niệm một thuật ngữ ưu tiên; thuật ngữ không dùng); BABOK v3 mục 10.23 "Glossary".

- Định nghĩa theo ISO 704: một câu, nêu **loại lớn hơn + đặc điểm phân biệt**, thay được thuật ngữ trong câu mà không
  đổi nghĩa; không vòng (không dùng chính thuật ngữ), không liệt kê ví dụ thay định nghĩa.
  - Đúng: "Đơn nghỉ phép: văn bản nhân viên gửi để xin nghỉ một khoảng ngày liên tục, cần người có thẩm quyền duyệt."
  - Sai: "Đơn nghỉ phép: đơn để nghỉ phép" (vòng); "Đơn nghỉ phép: ví dụ đơn nghỉ ốm, nghỉ năm" (ví dụ thay định nghĩa).
- Một khái niệm một thuật ngữ. Nguồn gọi khác nhau (luật gọi A, presales gọi B): chọn thuật ngữ theo văn bản pháp luật,
  từ còn lại đưa vào cột "Không dùng"; chưa chắc thì tạo Q.
- `kit/tools/ba-verify/term-check.mjs` báo lỗi khi từ ở cột "Không dùng" xuất hiện trong tài liệu của `1-ba-init/`, `2-ba-overview/`, `3-ba-detail/` hoặc trên màn prototype.
- Văn bản nguyên văn (danh mục UC presales, tóm tắt điều khoản) được giữ nguyên chữ, không bị kiểm cột "Không dùng".
- Tầng dự án tạo; chức năng thêm dòng, không sửa dòng của chức năng khác.
