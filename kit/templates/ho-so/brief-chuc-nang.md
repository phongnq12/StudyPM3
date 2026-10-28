# Brief chức năng — CN-xx <tên>
| CN | Nhánh | Dải ID | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- |
| CN-xx | `chuc-nang/CN-xx-<slug>` | <từ>–<đến> | YYYY-MM-DD | draft |

Ngữ cảnh bắt buộc cho bước 4–12 và **mốc phạm vi** của chức năng: agent chỉ làm trong những gì brief liệt kê; phần
vượt ra → câu hỏi phạm vi. Brief chỉ **lọc** từ danh mục chức năng, overview và ba danh mục đầu vào; không viết nghiệp
vụ mới, không cấp ID, không sửa overview (thấy sai → câu hỏi). Phương pháp: `.claude/skills/ba-chuc-nang/khoi-dong.md`.
Mỗi dòng dẫn nguồn để mở lại đúng chỗ.

**Căn cứ chuẩn:** ISO/IEC/IEEE 29148:2018 mục 9.3 (phạm vi nghiệp vụ: những gì trong và ngoài); BABOK v3 mục 6.4 "Define Change Strategy" (khoanh phạm vi thay đổi trước khi phân tích chi tiết).

## 1. Định danh
| Mục | Giá trị | Nguồn |
| --- | --- | --- |
| Mã, tên | CN-xx <tên> | `2-ba-overview/2-business-process/danh-muc-chuc-nang.md` |
| Slug, nhánh | `<slug>`, `chuc-nang/CN-xx-<slug>` | như trên |
| Thứ tự làm | <n> | như trên |
| Phiên bản kit | `kit-vX.Y.Z` hoặc mã commit kit | CHANGELOG.md |

## 2. Mục tiêu phục vụ
REQ loại B của `2-ba-overview/1-brd/brd-overview.md` mục 2 mà chức năng phục vụ (qua phân hệ ở mục 3.1, PROC, UC presales).

| REQ | Mục tiêu (chép tên) | Vì sao thuộc CN này |
| --- | --- | --- |

## 3. Phạm vi UC presales
Mọi UC presales của dòng CN-xx trong danh mục chức năng, mã gốc và nội dung chép **nguyên văn** từ `uc-presales.md`.

| Mã gốc | Tên (nguyên văn) | Actor (nguyên văn) | Mô tả luồng (nguyên văn) | PROC chính | Nguồn |
| --- | --- | --- | --- | --- | --- |

## 4. Quy trình
PROC của chức năng (`process-overview.md` mục 2) và chuyển giao có một đầu thuộc chức năng (mục 3). Hai đầu cố định:
bước 5 không đổi trigger, kết quả, actor chính.

| PROC | Tên | Trigger | Kết quả | Actor chính | Căn cứ |
| --- | --- | --- | --- | --- | --- |

| Chiều | Từ PROC | Đối tượng | Đến PROC | CN đầu kia | CN đầu kia đã merge |
| --- | --- | --- | --- | --- | --- |
| vào / ra | | | | CN-yy | có / chưa |

## 5. Màn presales
MP của chức năng (cột MP của danh mục chức năng; mọi MP gắn UC presales ở mục 3).

| MP | Vị trí | Cách mở | Tiêu đề | UC presales | Ảnh |
| --- | --- | --- | --- | --- | --- |
| MP-xxx | | | | `<mã gốc>` | [MP-xxx.png](../../1-ba-init/0-dau-vao/man-presales/MP-xxx.png) |

## 6. Điều khoản pháp lý
Điều khoản của chức năng (cột Điều khoản của danh mục; căn cứ của PROC ở mục 4), cộng điều khoản loại `thẩm quyền`,
`thời hạn`, `biểu mẫu` chi phối các PROC đó. Tóm tắt chép từ `phap-ly.md`, giữ nguyên con số.

| Mã điều khoản | Loại | Tóm tắt (chép phap-ly.md) | PROC | Nguồn |
| --- | --- | --- | --- | --- |

## 7. Dữ liệu
| ENT | Tên | Quan hệ với CN (sở hữu / dẫn) | CN sở hữu | Có vòng đời | Nguồn |
| --- | --- | --- | --- | --- | --- |

- Sở hữu: cột "ENT sở hữu" của danh mục chức năng. Dẫn: ENT của CN khác mà PROC hoặc UC presales của CN đọc, dùng
  (`erd-overview.md` mục 3 quan hệ giữa các chức năng, danh mục dùng chung mục 2).

## 8. Actor và rule chung
| ACT | Tên | Thẩm quyền | Nguồn |
| --- | --- | --- | --- |

| BR chung | Phát biểu (chép tên ngắn) | Nguồn |
| --- | --- | --- |

- Actor: cột của CN ở `uc-overview.md` mục 4 (ma trận actor × CN). Rule chung: dòng của `rules-overview.md` mục 1 có
  CN này ở cột áp dụng; khung phân quyền mục 2 hàng của CN.

## 9. Phụ thuộc
| CN phụ thuộc | Lý do (chuyển giao / dữ liệu) | Đã merge | Xác nhận của BA khi chưa merge |
| --- | --- | --- | --- |
| CN-yy | | có / chưa | Q-xxx (đã quyết: chờ / chạy tiếp với cờ "chờ CN-yy") |

## 10. Dải ID
Dải `<từ>–<đến>` cho mọi loại ID mới của chức năng (REQ, ENT, ST, TR, UC, BR, SCR, Q, ASM, PH). Số đã dùng đọc ở
`chuc-nang/CN-xx/trace.csv`. Bước PROC-xx.yy đánh số trong PROC, không lấy từ dải.

## 11. Câu hỏi và phát hiện liên quan
Q, ASM của `1-ba-init/open-questions.md`, `du-an/open-questions.md` và dòng sổ phát hiện có đối tượng là UC presales, MP, điều khoản, PROC, ENT ở
mục 3–7. Ghi trạng thái hiện tại; dòng `đã quyết` là ràng buộc cho bước 4–12.

| Mã | Nội dung (tóm tắt) | Trạng thái | Chặn gate | Nguồn |
| --- | --- | --- | --- | --- |

## 12. Ngoài phạm vi
Những gì dễ bị kéo vào mà không thuộc chức năng: UC presales, MP, PROC của CN khác ở cạnh; mục ngoài phạm vi của
`brd-overview.md` mục 3.2 liên quan. Mỗi dòng ghi thuộc đâu.

| Đối tượng | Thuộc | Nguồn |
| --- | --- | --- |
| `<mã gốc>` / MP-xxx / PROC-xx | CN-yy / ngoài phạm vi dự án | |
