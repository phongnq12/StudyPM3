---
name: ba-bpmn
description: "Chuẩn BPMN 2.0 cho mọi sơ đồ quy trình nghiệp vụ, vẽ bằng draw.io: bản đồ quy trình tổng (cấp 1) và từng quy trình PROC-xx (cấp 2). Gồm bộ ký hiệu, quy tắc đặt tên và bố cục, checklist, công cụ sinh sơ đồ từ đặc tả JSON và công cụ kiểm lỗi BPMN. Dùng bất cứ khi nào vẽ, sửa hoặc review process, quy trình, PROC-xx — kể cả khi chỉ là bản nháp."
user-invocable: false
metadata:
  version: 0.2.1
  owner: BA lead
  updated: 2026-10-26
---

# BPMN 2.0 cho quy trình nghiệp vụ

Đã là quy trình thì vẽ BPMN 2.0 bằng draw.io, ở mọi cấp. Không vẽ quy trình bằng Mermaid hoặc "ô và mũi tên":
Mermaid không có ký hiệu BPMN, khách và dev đọc sai ngữ nghĩa (chờ, song song, ngoại lệ, gửi nhận).
Chuẩn tham chiếu: OMG BPMN 2.0.2 (ISO/IEC 19510:2013); phong cách theo "BPMN Method and Style" (Bruce Silver).
Tập ký hiệu theo lớp "Descriptive" và một phần "Analytic" của BPMN 2.0.2 (ky-hieu.md mục 1). Tên tiếng Anh của phần
tử: task, sub-process, call activity, event (start / intermediate / boundary / end), gateway (exclusive / parallel /
inclusive / event-based), pool, lane, sequence flow, message flow, data object, data store, annotation.

## Đọc trước
- `ky-hieu.md`: bộ ký hiệu dùng trong kit, nghĩa, khi nào dùng, khóa trong đặc tả JSON.
- `quy-tac.md`: quy tắc cấp 1, cấp 2, đặt tên, gateway, ngoại lệ, chuyển giao, bố cục — mỗi quy tắc có ví dụ đúng và sai.
- `checklist.md`: định nghĩa "sơ đồ đạt"; quality-reviewer dùng cùng bảng này.
- Ví dụ hư cấu đạt lint (templates/2-business-process/examples/): cấp 2 `PROC-01-nghi-phep.bpmn.json` / `.drawio.svg` (to-be, có
  sự kiện biên lỗi, nhánh quay lại, gateway "Đơn đã duyệt?" dẫn tới hai sự kiện kết thúc), `PROC-01-nghi-phep-asis.*`
  (as-is toàn manual task), cấp 1
  `process-overview.bpmn.json` / `.drawio.svg`. Tài liệu `.md` đi kèm ví dụ viết lại cùng bước 2 và bước 5.

## Các cấp
| Cấp | File | Nội dung |
| --- | --- | --- |
| 0 — luồng chính | `2-ba-overview/2-business-process/process-overview-cap-0.drawio.svg` (bắt buộc khi hơn khoảng 8 PROC) | Một trang: đối tượng lõi của phần mềm (vd một đơn nghỉ phép, một hồ sơ) đi từ đầu tới cuối; mỗi bước là một PROC (sub-process thu gọn), gateway cho nhánh chính, nhánh song song khi có; dùng trình bày với khách và làm trang đầu tài liệu |
| 1 — bản đồ tổng | `2-ba-overview/2-business-process/process-overview.drawio.svg` (một trang) hoặc `process-overview-<n>.drawio.svg` (nhiều trang, n từ 1) | Sơ đồ cộng tác: pool dự án chia lane theo vai trò chủ trì; mỗi PROC là sub-process thu gọn; hệ thống, đơn vị ngoài là pool thu gọn; message flow; link event khi tách trang |
| 2 — từng quy trình | `2-ba-overview/2-business-process/PROC-xx-<slug>.drawio.svg` | Pool là PROC-xx, lane là vai trò; mỗi bước của bảng bước là một task có ID PROC-xx.yy; gateway, sự kiện, ngoại lệ; PROC khác và hệ thống ngoài là pool thu gọn nối bằng message flow |
Cấp 3 (tùy chọn): bước quá phức tạp vẽ thành sub-process mở rộng, file `PROC-xx-yy-<slug>.drawio.svg`.

## Các bước vẽ
1. Lập danh sách phần tử từ tài liệu (cấp 2: bảng bước, nhánh ngoại lệ, chuyển giao mục 6; cấp 1: danh mục PROC,
   chỗ chuyển giao, hệ thống ngoài). Mỗi phần tử chọn đúng loại theo `ky-hieu.md` (ai làm, làm ở đâu).
2. Viết đặc tả `<tên-sơ-đồ>.bpmn.json` cạnh file `.md` (cấu trúc: `ky-hieu.md` mục 3). Xếp theo lưới cột, hàng
   trong lane: luồng chính một hàng thẳng trái sang phải, ngoại lệ ở hàng dưới.
3. Sinh sơ đồ và xuất:
   `python3 .claude/skills/ba-bpmn/scripts/bpmn_drawio.py <x>.bpmn.json <x>.drawio --xuat`
   → `<x>.drawio.svg` (nhúng XML, mở sửa được bằng draw.io) và `<x>.png` (để tự xem). Không commit `.drawio`, `.png`.
4. Kiểm lỗi:
   `python3 .claude/skills/ba-bpmn/scripts/bpmn_lint.py <x>.drawio.svg [--bang-buoc PROC-xx-<slug>.md] [--cap 0|1]`
   Cấp 1 kiểm mọi trang cùng lúc để ghép cặp link event. Còn lỗi "Chặn merge" thì sửa đặc tả, sinh lại.
5. Đọc ảnh PNG bằng công cụ Read. Chữ đè nhau, đường cắt qua ô, nhánh ngoại lệ chen luồng chính → chỉnh `cot`,
   `hang`, `ra`, `vao`, `qua` trong đặc tả, sinh lại. Lặp tới khi đọc được.
6. Trong file `.md`: mục sơ đồ ghi `Nguồn: <x>.drawio.svg` và nhúng ảnh `![<tên>](<x>.drawio.svg)`. Bảng bước,
   bảng ngoại lệ, bảng chuyển giao là phần mô tả bằng chữ của sơ đồ — giữ khớp ID.
7. Đối chiếu `checklist.md`. Cổng máy `node kit/tools/ba-verify/check-all.mjs` chạy lại lint cho mọi sơ đồ trong
   `2-ba-overview/2-business-process/`.

## Khi BA sửa tay trong draw.io
File `.drawio.svg` sửa tay là nguồn mới. Xóa `<x>.bpmn.json` (hoặc cập nhật lại cho khớp) để không có hai nguồn;
vẫn chạy lint trên `.drawio.svg`.

## Không được làm
- Không vẽ quy trình bằng Mermaid flowchart, PlantUML activity hay ô chữ nhật nối mũi tên.
- Không cho sequence flow đi qua ranh giới pool; giữa hai pool chỉ dùng message flow.
- Không dùng task "abstract" ở cấp 2 khi đã biết ai làm và làm ở đâu.
- Không tự thêm bước, nhánh không có nguồn trong bảng bước, BRD hoặc ASM.
- Không để gateway tách mà nhánh ra không có nhãn điều kiện.

## Báo lại
Kèm theo báo cáo của bước: danh sách file sơ đồ, kết quả `bpmn_lint` (Chặn merge / Nên sửa / Gợi ý), các chỗ phải
nhân nhượng bố cục (đường cắt không tránh được), và nhắc BA cài tiện ích VS Code "Draw.io Integration"
(`hediet.vscode-drawio`) nếu muốn xem, sửa ngay trong VS Code.
