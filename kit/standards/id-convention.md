# Quy ước ID

| Tiền tố | Đối tượng | Nơi định nghĩa |
| --- | --- | --- |
| CN-xx | Chức năng: một nhóm UC presales gắn với 1–3 PROC nối nhau; đơn vị làm chi tiết, một nhánh, một PR | docs/2-business-process/danh-muc-chuc-nang.md |
| MP-xxx | Màn presales: một màn của prototype presales (app: mỗi route, tab, popup một màn; HTML tĩnh: một tệp có thể chứa nhiều màn)| docs/0-dau-vao/man-presales.md |
| QP-xx, QP-xx.yy | Quy trình presales, bước trong quy trình presales (chép từ sơ đồ presales, không phải PROC) | docs/0-dau-vao/quy-trinh-presales.md |
| PH-xxx | Phát hiện: khoảng trống, chỗ lệch so với presales, pháp luật | 1-ba-init/open-questions.md (bước 1), du-an/open-questions.md (từ bước 2), mục 3 |
| REQ-xxx | Yêu cầu, có cột Loại: B (business), S (stakeholder), NFR | docs/1-brd, docs/SRS |
| PROC-xx, PROC-xx.yy | Quy trình, bước trong quy trình | docs/2-business-process |
| ENT-xxx | Thực thể dữ liệu | docs/3-erd |
| ST-xxx, TR-xxx | Trạng thái, chuyển trạng thái | docs/4-state-machine |
| ACT-xx, UC-xxx | Actor, use case | docs/5-actor-usecase |
| BR-xxx | Business rule | docs/6-business-rules |
| SCR-xxx | Màn hình đã chốt (SCR-000 dành cho quy ước chung) | docs/Screens |
| CR-xxx | Change request | changes/ |
| Q-xxx, ASM-xxx | Câu hỏi mở (kể cả câu đã quyết), giả định | 1-ba-init/open-questions.md (bước 1), du-an/open-questions.md (từ bước 2), chuc-nang/CN-xx/open-questions.md; mã tầng dự án đánh số liên tục trên hai sổ |
| GD-xxxx | Giả định của business layer, 4 chữ số; chỉ người tạo, AI ghi ❓ `[CẦN BA CHỐT]` | 2-ba-overview/assumption_log.md |

**Business layer (bước 2)** dùng hệ mã ở `2-ba-overview/templates/00_quy_uoc_chung.md` mục 4. Mã use case là mã WBS ở cột `No`, không tiền tố `UC-`, ví dụ `<MA>.WEB.03.01.01` (mục 8.2). Hai chỗ này thắng các dòng REQ, PROC, ENT, ST, TR, UC, BR ở bảng trên khi khác nhau.


Không dùng nữa (kit v1): STK, NV, FEAT, US, KB, DEC. Quyết định của BA, PM, khách ghi thành dòng `đã quyết` của Q.

## Quy tắc
- Số thứ tự tăng dần, không tái sử dụng. ID đã cấp không đổi. Đối tượng bị bỏ → trạng thái `deprecated`, giữ dòng.
- **Tầng dự án** (bước 1, bước 2) cấp ID tuần tự, đọc số lớn nhất trong `du-an/trace.csv`.
- **Tầng chức năng** chỉ cấp ID **trong dải của chức năng**, ghi ở cột "Dải ID" của
  `docs/2-business-process/danh-muc-chuc-nang.md` (cấp ở bước 2, merge cùng G0). Dùng hết dải → xin thêm từ phần dự
  phòng của dự án. Không dùng mã giữ chỗ, không đánh số lại khi merge.
- Q, ASM của chức năng cũng lấy trong dải của chức năng.
- Ngoại lệ trong **một** bước có nhiều agent chạy song song: agent không cấp số mà ghi mã giữ chỗ `[ASM-T<n>]`,
  `[Q-T<n>]`, `[PH-T<n>]` (n đếm riêng trong báo cáo của agent); phiên chính thay bằng mã thật trước khi commit.
  Cổng máy chạy đủ báo lỗi khi còn mã giữ chỗ. Không mang mã giữ chỗ sang bước sau, không đánh số lại khi merge.
- Trong sơ đồ Mermaid, ID dùng dạng không gạch ngang: ST001, UC012.
- Số chữ số của ID: 3. Dải mỗi chức năng: 50 số cho mỗi loại ID (CN-01: 001–050, CN-02: 051–100…); phần cuối của dự án để dự phòng.

## Mã gốc từ bên ngoài
Không cấp ID kit cho mã gốc; không dùng mã gốc làm ID kit.

| Nguồn | Mã | Ghi ở cột `nguon` của trace.csv | Danh mục |
| --- | --- | --- | --- |
| UC presales | Nguyên văn mã trong file presales, vd `UC_PS_05` | `PS:UC_PS_05` | docs/0-dau-vao/uc-presales.md |
| Điều khoản pháp luật | Mã tự nhiên, định dạng cố định (dưới đây) | `PL:TT79-2026/Đ12.K2` | docs/0-dau-vao/phap-ly.md |

Màn presales thì khác: prototype không có mã màn sẵn (một route có nhiều tab, popup; một tệp HTML có nhiều màn), nên cấp mã kit MP-xxx; route hoặc đường dẫn tệp ghi ở cột "Vị trí".

### Mã điều khoản pháp luật
Định dạng: `<Loại><Số>-<Năm>/Đ<điều>[.K<khoản>][.<điểm>]`

| Loại | Văn bản |
| --- | --- |
| L | Luật, bộ luật |
| NQ | Nghị quyết |
| NĐ | Nghị định |
| QĐ | Quyết định |
| TT | Thông tư, thông tư liên tịch |
| CT | Chỉ thị |

- Đúng: `TT79-2026/Đ12.K2`, `NĐ163-2026/Đ5.K1.a`, `L120-2025/Đ30`, `QĐ08-2026/Đ3`.
- Sai: `TT 79/2026 Điều 12`, `TT79/Đ12K2`, `Thông tư 79 điều 12 khoản 2`.
- Văn bản không có số hiệu (đề cương, hướng dẫn nội bộ, biểu mẫu rời): `VB-<tên-ngắn>/<mục>`, ví dụ
  `VB-de-cuong-kiem-tra/III.2`. `<tên-ngắn>` chữ thường không dấu, nối bằng gạch ngang.
- Văn bản bị sửa đổi, thay thế: thêm dòng mới; dòng cũ giữ mã, cột Hiệu lực ghi "hết".

## Overview và chi tiết
Tầng dự án viết overview; tầng chức năng viết chi tiết. Bản chi tiết không định nghĩa lại đối tượng đã có ở overview
hay ở chức năng khác, chỉ dẫn ID. Mỗi đối tượng có đúng một file định nghĩa.

| Layer | Overview (tầng dự án) | Chi tiết (tầng chức năng) |
| --- | --- | --- |
| 1-brd | docs/1-brd/brd-overview.md | docs/1-brd/brd-CN-xx-<slug>.md |
| 2-business-process | docs/2-business-process/process-overview.md, ma-tran-uc-proc.md, danh-muc-chuc-nang.md | docs/2-business-process/PROC-xx-<slug>.md, mapping-CN-xx.md |
| 3-erd | docs/3-erd/erd-overview.md | docs/3-erd/erd-CN-xx-<slug>.md |
| 4-state-machine | — | docs/4-state-machine/ENT-xxx-<slug>.md |
| 5-actor-usecase | docs/5-actor-usecase/actors.md, uc-overview.md | docs/5-actor-usecase/UC-xxx-<slug>.md |
| 6-business-rules | docs/6-business-rules/rules-overview.md | docs/6-business-rules/rules-CN-xx-<slug>.md |
| Prototype | docs/Prototype/_khung/, index.html, sitemap.md | docs/Prototype/CN-xx-<slug>/ |
| Screens | docs/Screens/SCR-000-quy-uoc-chung.md | docs/Screens/SCR-xxx-<slug>.md |
| SRS | docs/SRS/srs.md | docs/SRS/modules/CN-xx-<slug>.md |

Chức năng được **thêm dòng** vào file overview ở đúng mục khớp hai đầu (ENT mới, chuyển giao PROC, quyết định chốt
UC, thuật ngữ), cùng lần sửa; không sửa, không xóa dòng của chức năng khác.

## Trạng thái
`draft` → `dat-G1` → `dat-G2` → `dat-G3` → `dat-G4` → `approved` → (`changed` → …) → `deprecated`.
- Đối tượng tầng dự án: `draft` → `dat-G0` → `approved`.
- Agent chỉ đặt `draft`. Lệnh gate đặt `dat-Gx` khi gate Đạt. Gate mất hiệu lực → trạng thái lùi về gate còn hiệu lực.
- Chỉ merge PR mới làm đối tượng thành `approved` (`/ba-next --sync` sau khi merge).

## trace.csv
Mỗi tầng một file: `du-an/trace.csv` và `chuc-nang/CN-xx/trace.csv`. `traceability.csv` ở gốc repo là **bản tổng
do script ghép**, không sửa tay.

Cột: `id,loai,ten,file,nguon,lien_ket,chuc_nang,trang_thai,cap_nhat`
- `nguon`: tệp nguồn, mã gốc `PS:<mã>`, mã điều khoản `PL:<mã>`, cách nhau bằng `;`
- `lien_ket`: ID mà đối tượng này **dẫn tới**, cách nhau bằng `;`. Ghi **một chiều**; script tính chiều ngược.
- `chuc_nang`: CN-xx chứa đối tượng; đối tượng tầng dự án để trống
- `cap_nhat`: ngày YYYY-MM-DD
- Trường có dấu phẩy đặt trong ngoặc kép.
- Bước `PROC-xx.yy`, `QP-xx.yy` không có dòng riêng; tính theo dòng của quy trình cha (`PROC-xx`, `QP-xx`).
