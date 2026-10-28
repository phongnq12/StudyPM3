---
name: ba-notation
description: "Quy ước vẽ sơ đồ UML, ERD, điều hướng bằng Mermaid và draw.io; quy trình nghiệp vụ trỏ sang skill ba-bpmn. Nạp sẵn cho agent vẽ sơ đồ."
user-invocable: false
metadata:
  version: 1.2.0
  owner: BA lead
  updated: 2026-10-26
---

# Quy ước sơ đồ (tham chiếu)

Đọc kit/standards/notation.md trước khi vẽ (ID node, màu classDef, xuất draw.io). Căn cứ chuẩn: UML 2.5.1 (OMG) cho use
case, state, sequence, activity; ký hiệu Information Engineering (crow's foot) cho ERD; BPMN 2.0.2 cho quy trình (skill
ba-standards mục "Tiêu chuẩn quốc tế kit dựa vào").

## Chọn công cụ theo layer
kit/standards/notation.md còn ghi theo kit v1 ở ba chỗ (đánh số bước 02–09, ERD "nhóm theo NV", bản nháp quy trình bằng
Mermaid). Bảng dưới là quy ước hiện hành; chỗ lệch đã đề xuất BA lead sửa standards.

| Layer | Sơ đồ | Công cụ |
| --- | --- | --- |
| `2-business-process` | Quy trình mọi cấp (chuỗi giá trị cấp 0, bản đồ cấp 1, PROC cấp 2, cấp 3) | BPMN 2.0 bằng draw.io theo skill ba-bpmn. **Không dùng Mermaid, kể cả bản nháp** |
| `3-erd` | ERD overview (thực thể, quan hệ, nhóm theo CN sở hữu), ERD chức năng | Mermaid `erDiagram`; kèm data dictionary |
| `4-state-machine` | Vòng đời một thực thể | Mermaid `stateDiagram-v2` |
| `5-actor-usecase` | Use case (actor × UC) | draw.io thư viện UML; không có thì bảng actor × UC |
| `5-actor-usecase` | Tuần tự, activity của một UC | Mermaid `sequenceDiagram`, `flowchart` (/ba-diagram) |
| `Prototype`, `Screens` | Sitemap, điều hướng màn hình | Mermaid `flowchart` |
| `SRS` | Context | draw.io; bản nháp Mermaid `flowchart` |

## Quy tắc
- ID node = ID nghiệp vụ bỏ gạch ngang (UC012). Nhãn tiếng Việt trong ngoặc kép, theo glossary.
- draw.io khi: cần ký hiệu UML chuẩn, quá khoảng 20 node, hoặc cần bản gửi khách. Lưu `.drawio.svg` có nhúng XML.
  Một sơ đồ chỉ một nguồn.
- Kiểm cú pháp Mermaid: `node kit/tools/ba-verify/mmcheck.mjs <file.md>` (cổng máy `check-all` cũng chạy). Cần ảnh để
  xem bố cục: `mmdc -i x.mmd -o x.png` nếu có, rồi dùng Read để tự xem, sửa khi chữ đè nhau.
- Mỗi sơ đồ draw.io có bảng mô tả bằng chữ (phần tử, nguồn) trong file .md đi kèm.
