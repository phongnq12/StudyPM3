---
name: ba-init
description: "Bước 1 — Khởi tạo tầng dự án: lập bốn danh mục có mã từ UC presales (xlsx), quy trình presales (drawio, bpmn, docx, xlsx; tổng và chi tiết gắn UC), prototype presales (app React: bản build, link; hoặc HTML tĩnh) và văn bản pháp luật (bóc tới điều, khoản, điểm, kèm hướng business rule); ma trận UC presales × điều khoản; bản đồ quy trình QT-nn dựng ngược từ UC presales và điều khoản (BPMN cấp 0, 1; ghép luồng UC, đối chiếu hai chiều UC ↔ QT); khởi tạo glossary, open-questions (câu hỏi, giả định, phát hiện), trace. Danh mục chép nguyên văn, không đánh giá; không bảng bước, không chia chức năng. Dùng một lần khi bắt đầu dự án, hoặc với --bo-sung khi có đầu vào mới."
argument-hint: "[--ngu] [--bo-sung]"
disable-model-invocation: true
metadata:
  version: 5.1.0
  owner: BA lead
  updated: 2026-10-27
---

Tham số: $ARGUMENTS
- `--ngu`: BA vắng mặt; hỏi trong chat, không có trả lời thì chọn tạm và ghi sổ (skill ba-questioning, sleep-mode.md).
- `--bo-sung`: đã chạy rồi, có đầu vào mới (văn bản luật mới, bản UC cập nhật, quy trình mới, màn mới). Chỉ **thêm**
  dòng mới; không sửa, không xóa dòng cũ; mã đã cấp giữ nguyên. Có UC hoặc điều khoản mới → chạy lại đợt 3 (ma trận)
  và đợt 4 (bản đồ quy trình: thêm QT, thêm UC vào QT, mã QT cũ giữ nguyên). Chưa có `ban-do-quy-trinh/ban-do-quy-trinh.md` (dự án
  chạy /ba-init trước bản 5.1.0) → chỉ chạy đợt 4.

Thiết kế: kit/thiet-ke/thiet-ke-kit.md mục 5, bước 1. Quy trình chung: kit/standards/gate-procedure.md mục 2.

## Đọc trước
- `${CLAUDE_SKILL_DIR}/method.md` (gửi kèm cho agent), `${CLAUDE_SKILL_DIR}/checklist.md`.
- kit/standards/id-convention.md (mã gốc, mã điều khoản, MP, QP, QT, PH), kit/standards/gate-procedure.md, skill ba-questioning;
  skill ba-bpmn (sơ đồ đợt 4).
- 1-ba-init/templates/: uc-presales.md, quy-trinh-presales.md, man-presales.md, man-presales.schema.md,
  nguon-prototype.md, phap-ly.md, uc-phap-ly.md, ban-do-quy-trinh.md, ban-do-quy-trinh-qt.md; kit/templates/ho-so/: glossary.md, open-questions.md (mục 3 là phát hiện),
  trace.csv.

## Các bước (phiên chính điều phối)

1. **Nhánh trước, kiểm trạng thái sau.**
   - `git status` phải sạch; còn thay đổi chưa commit → dừng, báo BA commit hoặc cất (stash) trước.
   - Nhánh `du-an/khung` đã có (lần chạy trước chưa merge) → chuyển sang nhánh đó. Chưa có → `git switch main`,
     `git pull` nếu có remote, `git switch -c du-an/khung`.
   - Sau khi đã ở đúng nhánh: `1-ba-init/0-dau-vao/` đã có nội dung mà không có `--bo-sung` → hỏi BA: chạy `--bo-sung` /
     dừng. Không ghi đè.

2. **Kiểm đầu vào.** Bốn thư mục bắt buộc phải có ít nhất một tệp: `0-inputs/presales/uc/`, `0-inputs/presales/quy-trinh/`,
   `0-inputs/presales/prototype/`, `0-inputs/phap-ly/`. Thiếu → dừng, báo BA thiếu gì và đặt vào đâu (thiết kế mục 5,
   bước 1). `0-inputs/khac/` tùy chọn.
   Quy trình presales: sơ đồ `.drawio` (cả `.drawio.xml`, `.drawio.svg`), `.bpmn`; mô tả, bảng mapping `.docx`,
   `.xlsx`. Ảnh, pdf
   xuất từ sơ đồ chỉ để tham khảo khi đã có tệp gốc; chỉ có ảnh, pdf → báo BA xin tệp gốc (máy không đối chiếu được
   ảnh), BA vẫn muốn làm thì agent đọc ảnh (mục 0 ghi dạng `ảnh` / `pdf`) và cổng máy chỉ kiểm phần bảng.
   Prototype phải ở một trong ba dạng (1-ba-init/templates/nguon-prototype.md): `dist/` (bản build), `nguon.md` có dòng "Link"
   (link đã deploy), hoặc tệp HTML tĩnh; `ma-nguon/` tùy chọn. Chỉ có mã nguồn, không có dist, không có link → dừng,
   báo BA xin presales bản build hoặc link (kit không tự build mã nguồn của bên khác).
   Công cụ: thiếu `kit/tools/ba-verify/node_modules` → chạy `cd kit/tools/ba-verify && npm install`.
   Chuyển sang bản chữ, ghi vào `.ba-cache/ban-chu/<đường dẫn tệp gốc>.txt` (ví dụ
   `.ba-cache/ban-chu/0-inputs/presales/uc/uc.xlsx.txt`), tạo thư mục theo đường dẫn tệp, **không ghi vào `0-inputs/`**:
   - docx, xlsx: `node kit/tools/ba-verify/office.cjs <tệp>`.
   - drawio, bpmn: `node kit/tools/ba-verify/doc-quy-trinh.mjs <tệp>` (trang, lane, ô có id, mũi tên có nhãn).
   - pdf: agent đọc trực tiếp.

3. **Khởi tạo khung** (lần đầu): `node kit/tools/ba-verify/khoi-tao.mjs --ten "<tên dự án>"` tạo `du-an/glossary.md`,
   `1-ba-init/open-questions.md` (sổ của bước 1), `du-an/open-questions.md` (sổ từ bước 2) (đủ ba mục: câu hỏi, giả
   định, phát hiện), `du-an/trace.csv` từ templates — chỉ heading và
   dòng tiêu đề bảng, không dòng mẫu (dòng mẫu Q-001, PH-001 của template làm trace-check báo lỗi). File đã có thì giữ.

4. **Duyệt prototype bằng script:** `node kit/tools/ba-verify/quet-prototype.mjs` (app: vài phút, tùy số route).
   - Script dùng Chromium của Playwright, không mở được thì Chrome, Edge đã cài trên máy.
   - App (dist, link) không mở được trình duyệt → script dừng báo lỗi: báo BA cài Google Chrome hoặc
     `cd kit/tools/ba-verify && npx playwright install chromium`, rồi chạy lại. HTML tĩnh → script tự đọc tĩnh, không có
     ảnh; báo BA một dòng: cài trình duyệt rồi chạy lại, hay chấp nhận đọc tĩnh.
   - Xem nhanh kết quả trước khi giao agent: màn chính đều trống hoặc chỉ có màn đăng nhập (app không tải được dữ
     liệu, bắt đăng nhập) → dừng, báo BA (duyệt bằng link thay dist: dòng "Duyệt bằng" của `nguon.md`).
     `vuot_gioi_han` → hỏi BA tăng `--toi-da` hay chấp nhận.
   - `--bo-sung`: chạy lại script; mã MP cũ giữ nguyên, màn mới cấp mã tiếp, màn đã bỏ giữ mã kèm lỗi.

5. **Giao agent** (công cụ Agent, bốn đợt; kit/standards/gate-procedure.md mục 2):
   - Đợt 1: `business-analyst`, việc A1 — danh mục UC presales (method.md mục 2) → `1-ba-init/0-dau-vao/uc-presales.md`.
   - Đợt 2, chạy song song (ghi ba file khác nhau; cả ba cần mã gốc UC của đợt 1):
     - `business-analyst` (phiên mới), việc A2 — danh mục pháp lý (method.md mục 3) → `1-ba-init/0-dau-vao/phap-ly.md`.
     - `business-analyst` (phiên mới), việc A3 — danh mục quy trình presales (method.md mục 4) →
       `1-ba-init/0-dau-vao/quy-trinh-presales.md`.
     - `ux-spec-designer` — danh mục màn presales (method.md mục 5) → `1-ba-init/0-dau-vao/man-presales.md`.
   - Đợt 3: `business-analyst` (phiên mới), việc A4 — ma trận UC presales × điều khoản (method.md mục 6) →
     `1-ba-init/0-dau-vao/uc-phap-ly.md`. Đọc uc-presales.md, phap-ly.md, quy-trinh-presales.md của đợt 1, 2.
   - Đợt 4: `business-analyst` (phiên mới), việc A5 — bản đồ quy trình dựng ngược (method.md mục 7, skill ba-bpmn) →
     thư mục `1-ba-init/0-dau-vao/ban-do-quy-trinh/`: file tổng `ban-do-quy-trinh.md`; sơ đồ mỗi cấp một thư mục
     `cap-0/`, `cap-1/`; mỗi QT một thư mục `cap-2/QT-nn-<slug>/` (`QT-nn.md`, `.bpmn.json`, `.drawio.svg` luồng UC). Không commit `.drawio`, `.png`
     trung gian. Đọc mọi danh mục của đợt 1–3. Nhiều QT thì giao thêm agent ghép luồng song song, mỗi agent một nhóm
     thư mục QT riêng, mã giữ chỗ đánh theo dải riêng (vd `[PH-T101]`, `[PH-T201]`) để không trùng.
   - Prompt giao việc gồm: việc, method.md và mục cần đọc, checklist.md, template, đường dẫn bản chữ trong
     `.ba-cache/ban-chu/`, file được ghi (chỉ một file), yêu cầu **đề xuất** (không ghi) thuật ngữ, câu hỏi, giả định,
     phát hiện, dòng trace trong báo cáo (trong file dùng mã giữ chỗ `[ASM-T<n>]`, `[Q-T<n>]`, `[PH-T<n>]`), và chạy
     `node kit/tools/ba-verify/dau-vao-check.mjs --chi uc|phap-ly|quy-trinh|man|uc-phap-ly|ban-do` (đúng file của mình) trước
     khi báo xong.
   - Phiên chính gộp đề xuất của đợt 2 (bước 6 dưới) **trước** đợt 3, của đợt 3 **trước** đợt 4, để agent sau dẫn được
     mã Q, PH thật.
   - Ghi mỗi lần gọi agent vào `du-an/reports/dieu-phoi/du-an-khung.md` (tên nhánh, `/` thay bằng `-`).

6. **Gộp đề xuất của các agent** (method.md mục 8, 9), phiên chính ghi (sau đợt 2, sau đợt 3, rồi sau đợt 4):
   - `du-an/glossary.md`: thuật ngữ, gộp trùng; nguồn gọi khác nhau → cột "Không dùng" theo method.md mục 8.
   - `1-ba-init/open-questions.md` mục 1, 2: Q, ASM, cấp số tuần tự; cột "Chặn gate" theo method.md mục 9.
   - `1-ba-init/open-questions.md` mục 3: PH cấp số tuần tự, bước `1`; PH cần người quyết thì mở thêm Q, ghi cột
     "Q liên quan".
   - `du-an/trace.csv`: mỗi QP, QT, MP, PH, Q, ASM một dòng (kit/standards/id-convention.md mục "trace.csv"). Bước `QP-xx.yy`
     không có dòng riêng. Dòng QP: cột `nguon` ghi tệp sơ đồ và `PS:<mã gốc>` của UC presales mà quy trình gắn;
     `lien_ket` ghi bước QP của quy trình tổng mà nó mở rộng. Dòng QT: `nguon` ghi `PS:<mã gốc>` của UC presales và
     `PL:<mã điều khoản>` căn cứ; `lien_ket` ghi QT nhận chuyển giao (mục 3 của bản đồ).
   - Thay mã giữ chỗ `[ASM-T<n>]`, `[Q-T<n>]`, `[PH-T<n>]` trong file của agent bằng mã thật (kit/standards/id-convention.md).
     Cổng máy chạy đủ báo lỗi khi còn mã giữ chỗ.

7. **Cổng máy:** `node kit/tools/ba-verify/check-all.mjs`. Còn LỖI → gửi nguyên văn cho agent của file đó sửa, chạy lại,
   tối đa 2 lần. LỖI ở file phiên chính ghi → phiên chính sửa.

8. **Hỏi BA** (ba-questioning, chế độ xác nhận; chỉ những gì agent không tự quyết được):
   - Văn bản nào áp dụng cho dự án, văn bản nào hết hiệu lực (cột "Áp dụng cho dự án", "Hiệu lực" của phap-ly.md).
   - Phân hệ presales nào thuộc phạm vi dự án (khi file presales có nhiều phân hệ hoặc nhiều dự án).
   - Ma trận UC × pháp lý: dòng ghép kèm giả định; UC `chưa tìm thấy` căn cứ (thiếu văn bản hay nghiệp vụ nội bộ);
     điều khoản `chưa có UC`.
   - Mâu thuẫn nguồn đã ghi Q (chặn G0); giả định agent đặt; màn gắn UC kèm giả định; bước quy trình gắn UC lệch tên.
   - Bản đồ quy trình (**chặn**, `--ngu` cũng dừng): danh sách QT, cách gom UC, thứ tự, chuyển giao; UC `chưa rõ`
     thuộc quy trình nào; QT không có UC presales. BA đổi → gửi lại agent đợt 4, chạy lại cổng máy, hỏi lại. Chưa chốt
     thì không commit.
   Ghi câu trả lời vào `0-inputs/answers-<YYYY-MM-DD>.md`; gửi lại agent liên quan áp vào (SendMessage nếu phiên còn,
   không thì phiên mới); cập nhật open-questions. Chạy lại cổng máy.

9. **Commit** `spec(du-an/0-dau-vao): danh mục đầu vào` (`--bo-sung`: `spec(du-an/0-dau-vao): bổ sung …`).
   Không push, không mở PR: tầng dự án merge một lần sau G0 (`/ba-pr du-an`).

## Không được làm
- Không sửa gì trong `0-inputs/` (trừ `0-inputs/answers-*.md`).
- Không sửa, không gộp, không tách, không đánh giá UC presales; không cấp UC-xxx.
- Không tự gắn bước quy trình presales với UC (chỉ chép mapping presales đã có); không cấp BR-xxx, không viết câu rule.
- Không tự tra số hiệu, ngày hiệu lực văn bản rồi điền; không tự điền con số.
- Bản đồ quy trình chỉ có QT, thứ tự UC, chỗ nối, chuyển giao: không bảng bước, không gateway, không chia chức năng
  (bước 2, `/ba-overview`). Không tự thêm bước, thêm UC để lấp khoảng trống. Danh mục QP chỉ chép quy trình presales.
- Không sửa tay `1-ba-init/0-dau-vao/man-presales.json`.

## Báo lại BA
Một đoạn ngắn: nhánh, commit; số UC presales (theo phân hệ); số quy trình presales (tổng / chi tiết), số bước, số UC
presales không thuộc quy trình; prototype duyệt từ đâu (dist / link / HTML), số route hoặc tệp, số màn (tải trang /
tab / popup; đọc tĩnh bao nhiêu, có ảnh bao nhiêu), route chưa mở được, lệch dist ↔ link; số văn bản, điều khoản theo
loại và theo hướng BR; ma trận: số UC có căn cứ pháp lý / tổng, số điều khoản có UC / tổng, UC `chưa tìm thấy`; bản
đồ: số QT, số UC presales thuộc QT / tổng, số chỗ nối khoảng trống, số QT không UC, lint sơ đồ; số
phát hiện; số Q mở theo cột "Chặn gate"; kết quả cổng máy; câu hỏi còn chờ BA. Gợi ý bước tiếp: `/ba-overview`.
