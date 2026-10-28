# Review độc lập một tài liệu business layer

Phần tra cứu của skill [`ba-overview`](../SKILL.md). Bước này **bắt buộc** cho mọi lớp, sau khi viết và
tự soát xong, trước khi chuyển `Chờ review`.

## Nguyên tắc giao việc

| Điểm | Quy định |
|---|---|
| Reviewer | **Một agent mới**, không phải phiên vừa viết. Người viết — kể cả AI — đọc lại lập luận của mình thì luôn thấy đúng |
| Đầu vào | **Chỉ đường dẫn**: file cần review, skill của lớp, template, `00_quy_uoc_chung.md`, các lớp đã có, thư mục đầu vào `/ba-init`, sổ giả định. **Không** đưa lập luận, ghi chú, lịch sử trao đổi của người viết |
| Model | Model mạnh dành cho review theo chính sách chọn model của dự án — không dùng model rẻ nhất |
| Sửa file | Reviewer **không sửa file**. Người viết sửa, hoặc ghi lý do không sửa vào phần trả lời cho người dùng. Sửa nhiều thì gọi review lại |

## Prompt mẫu

Thay các phần trong `<>`. Phần `<VIỆC 3 RIÊNG CỦA LỚP>` lấy từ mục "Review độc lập" của skill lớp.

```text
Bạn là reviewer độc lập cho một tài liệu business layer, lớp <số> — <tên lớp>. Bạn không biết gì về quá
trình viết nó, và đó là chủ ý. Không sửa file nào.

Đọc trước, toàn bộ:
- Quy ước nền: 2-ba-overview/templates/00_quy_uoc_chung.md
- Skill điều phối và phần dùng chung: .claude/skills/ba-overview/SKILL.md và .claude/skills/ba-overview/reference/
- Skill của lớp: .claude/skills/<create-xxx>/SKILL.md và .claude/skills/<create-xxx>/reference/
- Template: <đường dẫn template>
- Tài liệu cần review: <đường dẫn>

Nguồn để đối chiếu:
- Các lớp đã có của dự án: <đường dẫn, hoặc "chưa có">
- Đầu vào /ba-init: <đường dẫn>
- Sổ giả định: 2-ba-overview/assumption_log.md

Trước khi đọc: chạy `python3 .claude/skills/ba-overview/scripts/kiem_business_layer.py 2-ba-overview` và
dán phần Chặn, Cảnh báo, bảng giả định mở của tài liệu này vào đầu báo cáo. Lỗi script không cần lặp lại
ở bảng phát hiện.

Làm ba việc:

1. Đúng chuẩn. Chạy từng dòng checklist "Soát trước khi đóng" cuối SKILL.md của lớp. Kiểm mọi mục của
   template có mặt trong tài liệu, hoặc có ghi rõ vì sao bỏ. Kiểm tài liệu không nói khác
   2-ba-overview/templates/00_quy_uoc_chung.md (kể cả mục 8–11: use case, dẫn chiếu, ô điền sau, tài liệu chưa có).

2. Căn cứ đúng. Với từng ô căn cứ có nội dung, mở nguồn được dẫn và kiểm: nguồn có thật không (file,
   điều khoản, mã có tồn tại không), và nguồn có nói đúng điều tài liệu gán cho nó không. Con số kèm biên
   có khớp nguồn không. Mã dẫn sang lớp khác có tồn tại và đúng tên không.

3. Đủ và đúng lớp. Tìm cái thiếu và cái lấn lớp:
   - Nội dung thuộc lớp khác đang được định nghĩa lại ở đây, thay vì dẫn mã — đối chiếu
     .claude/skills/ba-overview/reference/ranh-gioi-cac-lop.md.
   - Nội dung đầu vào /ba-init liên quan tới lớp này mà tài liệu chưa phủ.
   - Giả định đã có trong sổ, liên quan, mà tài liệu chưa dẫn.
   - Ô cần căn cứ mà trống, hoặc ghi "—" cho thứ chưa biết.
   <VIỆC 3 RIÊNG CỦA LỚP>

Báo cáo bằng tiếng Việt có dấu, gồm một bảng:
| # | Mức (Chặn / Nặng / Nhẹ) | Việc (1/2/3) | Ở đâu (mục, mã) | Vấn đề | Bằng chứng (nguồn, dòng) | Đề xuất sửa |

"Chặn" = lớp sau hoặc dev, QC sẽ làm sai nếu giữ nguyên. "Nặng" = thiếu hoặc lệch nguồn, chưa gây sai
ngay. "Nhẹ" = định dạng. Không có phát hiện ở một việc thì ghi rõ "Việc N: không có phát hiện" kèm những
gì đã kiểm. Cuối báo cáo, một câu kết luận: tài liệu có thể chuyển Chờ review chưa.
```
