# Danh mục quy trình presales — <tên dự án>
| Nguồn | Số quy trình (tổng / chi tiết) | Số bước | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- |
| [SRC: 0-inputs/presales/quy-trinh/] | / | | YYYY-MM-DD | draft |

Quy trình nghiệp vụ presales đã chào giá: quy trình tổng và quy trình chi tiết (có gắn UC presales). Chép **nguyên
văn** tên bước, lane, nhãn rẽ nhánh và UC presales mà presales gắn; không sửa, không gộp, không đánh giá đúng sai.
Mã `QP-xx` (quy trình), `QP-xx.yy` (bước) do kit cấp vì sơ đồ không có mã sẵn; mã gốc của presales (nếu có) ghi ở cột
"Mã gốc". QP **không phải** PROC: PROC do kit dựng ở bước 2, 5 và dẫn QP làm nguồn (`[SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-xx.yy]`).

**Căn cứ chuẩn:** BABOK v3 mục 4.3 "Confirm Elicitation Results" và 10.18 "Document Analysis" (ghi nhận nguyên văn tài
liệu hiện có); ISO/IEC/IEEE 29148:2018 mục 5.2 (truy vết về nguồn).

## 0. Vị trí trong nguồn
| Tệp | Dạng | Trang, sheet, mục | Bản chữ |
| --- | --- | --- | --- |
| 0-inputs/presales/quy-trinh/<tệp>.drawio | drawio | <tên trang> | .ba-cache/ban-chu/0-inputs/presales/quy-trinh/<tệp>.drawio.txt |

- Dạng: `drawio` (cả `.drawio.xml`, `.drawio.svg`) / `bpmn` / `docx` / `xlsx` / `pdf` / `ảnh`. Bản chữ: drawio, bpmn
  sinh bằng `kit/tools/ba-verify/doc-quy-trinh.mjs`; docx, xlsx bằng `kit/tools/ba-verify/office.cjs`; pdf, ảnh agent đọc
  trực tiếp (chỉ khi presales không có tệp gốc và BA đồng ý; cột Bản chữ ghi "—").
- Mỗi tệp, mỗi trang (sheet, mục) có quy trình một dòng. `dau-vao-check.mjs` đối chiếu từng ô của sơ đồ drawio, bpmn
  với mục 2 và mục 3; docx, xlsx máy chỉ kiểm tệp có thật.

## 1. Quy trình
| Mã | Tên (nguyên văn) | Cấp | Mở rộng từ | Mã gốc | Lane (nguyên văn) | Nguồn |
| --- | --- | --- | --- | --- | --- | --- |
| QP-01 | | tổng | — | — | | [SRC: 0-inputs/presales/quy-trinh/<tệp>.drawio, trang <tên trang>] |
| QP-02 | | chi tiết | QP-01.01 | — | Nhân viên; Trưởng phòng | [SRC: 0-inputs/presales/quy-trinh/<tệp>.drawio, trang <tên trang>] |

- Cấp: `tổng` (bản đồ, mỗi bước là một quy trình) / `chi tiết` (các bước việc, có lane, có gắn UC).
- Mở rộng từ: quy trình chi tiết ghi bước của quy trình tổng mà nó chi tiết hóa (`QP-xx.yy`). Sơ đồ không cho biết
  (tên không khớp bước nào) → "—" kèm `[ASM-xxx]`.
- Tên: tên trang, tiêu đề pool hoặc tiêu đề trong sơ đồ, chép nguyên văn; không có → tên tệp, ghi chú ở cột Mã gốc.

## 2. Bước
| Mã bước | Tên (nguyên văn) | Loại | Lane (nguyên văn) | Đi tới | UC presales (theo nguồn) | Nguồn |
| --- | --- | --- | --- | --- | --- | --- |
| QP-02.01 | | bước | | QP-02.02 | `<mã gốc>` | [SRC: 0-inputs/presales/quy-trinh/<tệp>.drawio, trang <tên trang>, ô <id>] |
| QP-02.02 | | cổng | | QP-02.03 [Có]; QP-02.04 [Không] | — | [SRC: …, ô <id>] |

- Thứ tự dòng: theo quy trình, rồi theo luồng từ sự kiện bắt đầu. Mã bước đánh số tuần tự trong quy trình.
- Loại: `bước` (việc làm, sub-process) / `cổng` (rẽ nhánh) / `sự kiện` (bắt đầu, kết thúc, trung gian; chỉ ghi khi có
  nhãn). Bắt buộc ghi mọi `bước` và `cổng` có nhãn của sơ đồ; ô không phải bước (tiêu đề, chú thích) ghi ở mục 3.
- Đi tới: bước kế tiếp theo mũi tên, nhãn mũi tên trong `[ ]`; mũi tên đi qua sự kiện không ghi thì nối thẳng tới bước
  sau sự kiện. Bước cuối: "—".
- UC presales (theo nguồn): chỉ ghi UC mà **presales gắn** (mã UC trong nhãn, cột mapping của bảng, chú thích trên
  sơ đồ), nhiều mã cách bằng `;`. Không tự ghép bước với UC ở bước 1 — việc đó của bước 2 (ma trận UC × PROC).
- Nguồn: drawio `[SRC: <tệp>, trang <tên trang>, ô <id>]`; bpmn `[SRC: <tệp>, ô <id>]`; xlsx `[SRC: <tệp>, <sheet>,
  dòng <n>]`; docx `[SRC: <tệp>, <mục hoặc bảng>]`. Id ô lấy từ bản chữ.

## 3. Ô sơ đồ không ghi vào danh mục
| Tệp | Trang | Ô | Nhãn (nguyên văn) | Lý do |
| --- | --- | --- | --- | --- |

- Chỉ dành cho ô có nhãn mà không phải bước, cổng: tiêu đề, chú giải, ghi chú, logo. Lý do: `tiêu đề` / `chú giải` /
  `ghi chú` / `khác: <mô tả>`. Ô ghi chú có nội dung nghiệp vụ (quy định, thời hạn) → vẫn ghi đây, kèm đề xuất câu hỏi
  hoặc phát hiện.

## 4. UC presales không có trong quy trình
| Mã gốc | Tên (nguyên văn) | PH |
| --- | --- | --- |

- Mọi UC presales không được bước nào ở mục 2 gắn: một dòng, kèm phát hiện loại `UC không thuộc quy trình`
  (1-ba-init/open-questions.md mục 3). Cổng máy tính lại danh sách này từ uc-presales.md và mục 2.
