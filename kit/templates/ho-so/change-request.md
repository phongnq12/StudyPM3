# CR-xxx — <tiêu đề>
| Nguồn | Người yêu cầu | Kênh | Ngày nhận | Làn | Chức năng bị ảnh hưởng | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| Nội bộ / Khách hàng | <vai trò> | email / họp / văn bản | YYYY-MM-DD | Làm rõ / Lỗi spec / Thay đổi phạm vi / Khẩn cấp | CN-xx; … / tầng dự án | mới |

Change request sau khi tầng dự án hoặc chức năng đã merge (kit/standards/git-flow.md, nhánh `cr/CR-xxx-<slug>`). File:
`changes/CR-xxx-<slug>.md`. Phương pháp: `.claude/skills/ba-cr/method.md`. Trạng thái: `mới` → `đã phân tích` →
`đã quyết` (làm / không làm) → `đang áp dụng` → `xong`. Kit chỉ gắn cờ phạm vi; không ước lượng công, chi phí, ngày.

**Căn cứ chuẩn:** BABOK v3 mục 5.4 "Assess Requirements Changes" (lý do, ảnh hưởng, phương án, quyết định); IEEE 828-2012 (kiểm soát thay đổi so với mốc cấu hình: nhận diện, đánh giá, phê duyệt, áp dụng, xác minh).

## 1. Hiện trạng và mong muốn
- Mốc so sánh: <commit hoặc tag trên main mà CR đối chiếu> (mốc cấu hình theo IEEE 828)
- Hiện trạng: <spec trên main đang nói gì, dẫn ID và file>
- Mong muốn: <người yêu cầu muốn gì> [SRC: 0-inputs/…]

## 2. Lý do, giá trị nghiệp vụ
<dẫn REQ loại B, điều khoản mới, sự cố; không có nguồn → ASM>

## 3. Ưu tiên, hạn mong muốn
<theo người yêu cầu, có nguồn; không tự đặt ngày>

## 4. Đối chiếu mốc phạm vi
Mốc: `1-ba-init/0-dau-vao/uc-presales.md` (UC presales, mã gốc nguyên văn), bảng chốt `2-ba-overview/5-actor-usecase/uc-overview.md`
mục 1, ngoài phạm vi ở `2-ba-overview/1-brd/brd-overview.md` mục 3.2.

| Thay đổi | Mã gốc / ID liên quan | So với mốc | Cờ phạm vi | Nguồn |
| --- | --- | --- | --- | --- |
| | `PS:<mã gốc>` / REQ-xxx | | trong báo giá / cần PM đánh giá / giảm phạm vi / phát sinh | [SRC: …] |

Nguồn gợi ý CR (nếu có): dòng PH-xxx của sổ phát hiện, Q-xxx.

## 5. Ảnh hưởng
### 5.1 Bốn vòng
| Vòng | ID | Tên | File | Vì sao bị ảnh hưởng |
| --- | --- | --- | --- | --- |
| 1 Trực tiếp | | | | |
| 2 Ngược lên | | | | |
| 3 Xuôi xuống | | | | |
| 4 Ngang | | | | |

Vòng không có ID: ghi "không có" kèm cách đã kiểm.

### 5.2 Ma trận theo chức năng
| Chức năng | Layer phải sửa | ID bị ảnh hưởng | Loại tác động | Gate phải chạy lại | Dev | QC |
| --- | --- | --- | --- | --- | --- | --- |
| CN-xx | 2-business-process; 5-actor-usecase | PROC-xx.yy; UC-xxx | thêm / sửa / bỏ / kiểm lại | G1–G4 | Có / Không / Chưa rõ | Có / Không / Chưa rõ |
| tầng dự án | 3-erd (overview) | ENT-xxx | sửa | G0 | | |

### 5.3 Vùng mù
<ID cùng chủ đề không có liên kết; layer chưa có trên main; "chưa có mốc" …>

## 6. Đánh giá
| Chiều | Đánh giá | Người đánh giá |
| --- | --- | --- |
| Phạm vi | | BA |
| Rủi ro | | BA |
| Chi phí, effort | (tech lead, PM điền) | |
| Tiến độ | (PM điền) | |
| Kiến trúc, phụ thuộc | (tech lead điền) | |

## 7. Phương án (kể cả "không làm")
| Phương án | Điều được | Điều mất | ID, gate bị ảnh hưởng | Rủi ro |
| --- | --- | --- | --- | --- |
| A — | | | | |
| Không làm | | | — | |

Khuyến nghị (nếu có, ghi rõ là đề xuất): <lý do nghiệp vụ>

## 8. Quyết định
Q-xxx (đã quyết) ở `du-an/open-questions.md`: phương án, người quyết, ngày, số change order (nếu có). Agent không ghi
quyết định.

## 9. Áp dụng
| Chức năng / tầng | Layer | Commit | Gate chạy lại | Kết quả |
| --- | --- | --- | --- | --- |

## 10. Kết quả
<PR, ngày merge; dòng sổ phát hiện đã đóng ở CR-xxx>
