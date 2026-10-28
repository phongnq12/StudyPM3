# GPDV_SDLCv3 — Bộ kit BA chuẩn

Khung repo spec cho một dự án: dựng ngược từ UC presales, prototype presales và văn bản pháp luật, qua business layer
(6 lớp) tới UC chi tiết, prototype và đặc tả màn của từng chức năng. Repo này **chưa có nội dung dự án**; mỗi dự án
mới tạo một repo từ đây. Cách làm việc: [CLAUDE.md](CLAUDE.md); thiết kế kit: [kit/thiet-ke/thiet-ke-kit.md](kit/thiet-ke/thiet-ke-kit.md).

## Pipeline 3 bước

| Bước | Lệnh | Thư mục | Đầu ra | Gate |
| --- | --- | --- | --- | --- |
| 1. Khởi tạo | `/ba-init` | [1-ba-init/](1-ba-init/) | `0-dau-vao/`: danh mục UC presales, pháp lý, quy trình presales, màn presales, ma trận UC × điều khoản, bản đồ quy trình dựng ngược | — |
| 2. Business layer (tầng dự án) | `/ba-overview` | [2-ba-overview/](2-ba-overview/) | `1-brd/` → `6-business-rules/`: BRD, quy trình, ERD, máy trạng thái, tác nhân và use case, business rule; danh mục chức năng | G0 |
| 3. Specification layer (từng chức năng) | `/ba-detail CN-xx` | [3-ba-detail/](3-ba-detail/), `chuc-nang/CN-xx/` | Đợt 1 UC chi tiết → G1; đợt 2 prototype, đợt 3 đặc tả màn → G2 | G1, G2 |

Chạy lại riêng một gate: `/ba-gate G0`, `/ba-gate G1 CN-xx`, `/ba-gate G2 CN-xx`. G3, G4 (SRS) chưa dùng.

```
0-inputs/            nguồn thô — KHÔNG sửa, trừ answers-<ngày>.md
  presales/uc/         (bắt buộc) danh sách UC chào giá: xlsx, docx
  presales/quy-trinh/  (bắt buộc) quy trình presales: drawio, bpmn, pdf
  presales/prototype/  (bắt buộc) dist/, hoặc nguon.md có dòng "Link", hoặc HTML tĩnh
  phap-ly/             (bắt buộc) văn bản pháp luật
  khac/                (tùy chọn) tài liệu khách khác
1-ba-init/           bước 1: templates/, 0-dau-vao/
2-ba-overview/       bước 2: templates/, 1-brd/ … 6-business-rules/
3-ba-detail/         bước 3: templates/ (use-case, prototype, screens, design-system), use-case/, Prototype/, Screens/, SRS/
chuc-nang/           hồ sơ từng chức năng (brief, sổ, trace, hồ sơ G1, G2), sinh ở bước 3
du-an/               cau-hinh.md, glossary.md, open-questions.md, trace.csv, G0.md; agent-notes/, reports/
kit/                 standards/ (quy chuẩn, chặn ghi), templates/ho-so/, tools/ba-verify/ (cổng máy), thiet-ke/
.claude/             agent và skill
```

## Bắt đầu một dự án mới

1. Trên GitHub bấm **Use this template** (hoặc chép repo này), đặt tên repo theo dự án.
2. Điền [du-an/cau-hinh.md](du-an/cau-hinh.md): mã dự án `<MA>`, tên, nền tảng, màu chủ đạo. Ghi chú riêng cho agent
   (nếu có): [du-an/agent-notes/_chung.md](du-an/agent-notes/_chung.md).
3. Đặt tài liệu đầu vào vào `0-inputs/` theo cây trên (xóa `.gitkeep` không bắt buộc).
4. Cài công cụ: `cd kit/tools/ba-verify && npm install` (trình duyệt quét prototype: `npx playwright install chromium`
   nếu máy chưa có Chrome, Edge).
5. Tạo nhánh `du-an/khung`, chạy `/ba-init`, rồi `/ba-overview` (tới G0, mở PR). Sau đó mỗi chức năng một nhánh
   `chuc-nang/CN-xx-<slug>`, chạy `/ba-detail CN-xx` (kit/standards/git-flow.md).

## Cập nhật kit

Sửa kit (`.claude/`, `kit/`, `*/templates/`) ở repo này trước, rồi kéo sang dự án đang chạy. Lỗi kit phát hiện trong
dự án: ghi đề xuất, sửa ở đây, không sửa riêng một dự án rồi để lệch.
