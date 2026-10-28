# Quy ước ký hiệu và sơ đồ

## Chọn công cụ
| Bước | Sơ đồ | Công cụ mặc định |
| --- | --- | --- |
| 02 Business process (overview) | Bản đồ quy trình: mỗi ô một PROC, mũi tên là chỗ chuyển giao | draw.io; bản nháp Mermaid `flowchart LR` |
| 02 Business process (chi tiết) | BPMN | draw.io (thư viện BPMN). Bản nháp: Mermaid flowchart, mỗi lane là một subgraph |
| 03 ERD | Entity relationship | Mermaid erDiagram; overview chỉ entity và quan hệ, nhóm theo NV |
| 04 State machine | UML state | Mermaid stateDiagram-v2 |
| 05 Use case | UML use case | draw.io (thư viện UML) |
| 05 Use case | Sơ đồ tuần tự của một UC | Mermaid sequenceDiagram (/ba-diagram --new sequence) |
| 05 Use case | Activity của một UC phức tạp | Mermaid flowchart (/ba-diagram --new activity) |
| 07 Prototype | Sitemap, điều hướng màn hình | Mermaid flowchart trong sitemap.md |
| 08 Screens | Điều hướng màn hình | Mermaid flowchart |
| 09 SRS | Sequence, context | Mermaid sequenceDiagram; draw.io cho context diagram |

Chuyển Mermaid sang draw.io khi: cần ký hiệu BPMN/UML chuẩn; quá ~20 node; cần bản gửi khách.

## Quy ước Mermaid
- Quy trình vẽ `flowchart LR`; cây, phân cấp vẽ `flowchart TD`.
- ID node = ID nghiệp vụ bỏ gạch ngang (UC012). Nhãn tiếng Việt đặt trong ngoặc kép.
- Màu bằng classDef: `actor`, `system`, `exception`, `decision`. Không tô màu tùy hứng.
- Tối đa khoảng 20 node; nhiều hơn thì tách.
- Kiểm tra cú pháp: `mmdc -i <file>.mmd -o <file>.svg` trước khi mở PR.

## Quy ước draw.io
- Lưu `.drawio.svg` (xuất có `-e` để nhúng XML): `drawio -x -f svg -e -b 10 -o x.drawio.svg x.drawio`.
- Từ Mermaid: chuyển `.mmd` → `.drawio` trước (`drawio -x -f xml -o x.drawio x.mmd`), rồi mới xuất ảnh.
- Mỗi sơ đồ draw.io có bảng mô tả bằng chữ (node, luồng, ID) trong file .md đi kèm.
- Một sơ đồ chỉ một nguồn. Đã chuyển sang draw.io thì xóa khối Mermaid cũ, ghi `Nguồn: <file>.drawio.svg`.

## Ký hiệu ERD
Crow's foot (Mermaid erDiagram mặc định). Bảng data dictionary bắt buộc đi kèm sơ đồ.
