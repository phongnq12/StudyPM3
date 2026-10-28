---
name: ba-agent-protocol
description: "Cách làm việc chung của mọi agent BA: thứ tự đọc, thứ tự ưu tiên chỉ dẫn, tùy biến theo dự án, dựng ngược từ ba nguồn và sổ phát hiện, overview và chi tiết, xử lý thiếu và mâu thuẫn, cấp ID trong dải, tự kiểm tra, vòng sửa, báo cáo. Nạp sẵn cho mọi agent trong .claude/agents/."
user-invocable: false
metadata:
  version: 2.1.0
  owner: BA lead
  updated: 2026-10-26
---

# Giao thức làm việc chung của agent BA

File này là "luật lao động" chung cho mọi agent. File agent chỉ ghi phần riêng của vai trò.
Quy định nghiệp vụ nằm ở kit/standards/; file này không chép lại, chỉ trỏ tới.
File agent gọi các mục dưới đây bằng tên mục, không bằng số.

## Ba tầng kiến thức

| Tầng | Nội dung | Nơi đặt | Thay đổi theo dự án |
| --- | --- | --- | --- |
| 1. Nghề BA | Vai trò, quy trình, kỹ thuật, lỗi hay gặp | `.claude/agents/`, `.claude/skills/`, `kit/standards/`, `templates/` | Không |
| 2. Lĩnh vực | Kiến thức ngành (chính phủ, ngân hàng, y tế…) | Skill tri thức `domain-<ngành>` (nếu có) | Dùng lại cho dự án cùng ngành |
| 3. Dự án | Đầu vào, thuật ngữ, quyết định, phạm vi chức năng | `0-inputs/`, `1-ba-init/`, `2-ba-overview/`, `3-ba-detail/`, `du-an/`, `chuc-nang/`, `du-an/agent-notes/` | Có |

Agent không mang kiến thức tầng 3 trong đầu. Mọi điều về dự án đọc từ file tầng 3 lúc chạy.
Không suy kiến thức dự án từ kinh nghiệm dự án khác.

## Thứ tự đọc

1. Prompt giao việc của phiên chính: tầng (dự án hoặc CN-xx), đầu vào, TEMPLATE, PHƯƠNG PHÁP, CHECKLIST,
   KIỂM TRA RIÊNG, thư mục được ghi, dải ID (tầng chức năng).
2. `CLAUDE.md` và skill ba-standards (trỏ tới kit/standards/).
3. Hồ sơ dự án: `du-an/glossary.md`; `1-ba-init/open-questions.md` (bước 1) và `du-an/open-questions.md` (từ bước 2)
   (đặc biệt các dòng `đã quyết`: không hỏi lại).
   Tầng chức năng thêm `chuc-nang/CN-xx/brief.md` và `chuc-nang/CN-xx/open-questions.md`.
4. Tùy biến dự án (file nào có):
   - `du-an/agent-notes/_chung.md` — áp cho mọi agent; có thể khai báo skill lĩnh vực cần đọc.
   - `du-an/agent-notes/<tên-agent>.md` — riêng cho agent đang chạy.
5. PHƯƠNG PHÁP (method.md) và CHECKLIST (checklist.md) của lệnh đang chạy. Phiên chính không gửi đường dẫn thì tự tìm
   ở `.claude/skills/<lệnh>/`. Đọc checklist **trước khi viết**, vì reviewer chấm theo đúng file đó.
6. TEMPLATE và ví dụ trong thư mục `examples/` cạnh template (`templates/<thư mục>/examples/`, nếu có). Ví dụ cho biết
   độ chi tiết và giọng văn; không chép nội dung nghiệp vụ, con số của ví dụ.
7. Đầu vào của việc: danh mục ở `1-ba-init/0-dau-vao/`, file gốc trong `0-inputs/` khi cần đối chiếu, câu trả lời của BA
   `0-inputs/answers-*.md`, và các layer trước đã viết.
8. `du-an/trace.csv` (và `chuc-nang/CN-xx/trace.csv`): biết ID đã có, tránh tạo trùng.

Thiếu file ở mục 4, 6 là bình thường: ghi nhận, làm tiếp.
Dừng và báo phiên chính khi prompt giao việc **khai báo** một đầu vào hoặc TEMPLATE mà file đó không tồn tại.

## Thứ tự ưu tiên khi chỉ dẫn mâu thuẫn

1. `CLAUDE.md`, kit/standards/ (không bao giờ bị ghi đè).
2. Prompt giao việc của phiên chính và SKILL.md của lệnh.
3. method.md, checklist.md của lệnh.
4. Skill ba-agent-protocol (file này).
5. File agent.
6. `du-an/agent-notes/` và skill lĩnh vực.
7. Ví dụ mẫu.

`agent-notes` chỉ được **bổ sung hoặc thu hẹp** (thêm thuật ngữ, lưu ý, kiểm tra). Ghi chú trái với tầng trên
→ làm theo tầng trên, ghi mâu thuẫn vào báo cáo mục "Đề xuất".

## Dựng ngược từ ba nguồn và sổ phát hiện

- Ba nguồn: UC presales, prototype presales, văn bản pháp luật (cộng tài liệu khác trong `0-inputs/khac/`). Danh mục có
  mã ở `1-ba-init/0-dau-vao/`. Dẫn nguồn qua danh mục: mã gốc UC `PS:<mã>`, mã điều khoản `PL:<mã>`, mã màn `MP-xxx`
  (kit/standards/id-convention.md).
- **Không sửa `0-inputs/`.** Không sửa, không đổi mã, không viết lại nội dung UC presales trong danh mục.
- Mọi điểm thiếu, lệch, thừa so với presales → một dòng PH mới trong `1-ba-init/0-dau-vao/so-phat-hien.md` (trạng thái
  "mở", nguồn). Chỉ **thêm** dòng; không sửa, không xóa dòng cũ. Bước 8 (use case) đóng dòng của chức năng.
  Khi nhiều agent chạy song song, agent không ghi sổ trực tiếp mà đề xuất dòng PH trong báo cáo; phiên chính gộp.
  - Đúng: "PH-014 | MP-012 | 5 | Màn có nút 'Gửi ký' nhưng không UC presales nào nhắc tới bước gửi ký | thiếu luồng | [SRC: …] | mở".
  - Sai: sửa mô tả UC_PS_05 trong danh mục cho khớp màn.
- Kit chỉ gắn cờ phạm vi (trong báo giá / cần PM đánh giá / giảm phạm vi / phát sinh); không kết luận ngoài báo giá,
  không ước lượng công.

## Overview và chi tiết

- Bảng file overview và chi tiết ở kit/standards/id-convention.md mục "Overview và chi tiết".
- Bản chi tiết không định nghĩa lại đối tượng đã có ở overview hay ở chức năng khác; chỉ dẫn ID. Mỗi đối tượng đúng
  một file định nghĩa.
- Chức năng được **thêm dòng** vào overview ở đúng mục (ENT mới, chuyển giao, quyết định chốt UC, thuật ngữ); không sửa,
  không xóa dòng của chức năng khác. Cần sửa dòng của chức năng khác, hoặc đổi cấu trúc overview (chia lại CN, đổi
  PROC, đổi chủ ENT) → không tự sửa; ghi Q đề xuất trong open-questions của chức năng mình.
  - Đúng: brd-CN-05 dẫn "REQ-003 (brd-overview.md mục 3)".
  - Sai: brd-CN-05 chép lại bảng mục tiêu tổng, hoặc định nghĩa lại ENT-012 của CN-02.

## Phạm vi ghi

- Chỉ ghi vào thư mục, file mà prompt giao việc hoặc SKILL.md của lệnh quy định, cộng `trace.csv` và
  `open-questions.md` của tầng mình. Prompt giao việc cấm ghi các file dùng chung (khi nhiều agent chạy song song)
  → không ghi, không cấp số: đề xuất trong báo cáo, dùng mã giữ chỗ `[ASM-T<n>]`, `[Q-T<n>]`, `[PH-T<n>]`
  (kit/standards/id-convention.md); phiên chính gộp và cấp số.
- Tầng chức năng: chỉ tạo, sửa đối tượng thuộc chức năng đang làm; mọi ID mới nằm trong dải của chức năng.
- Thấy lỗi ở layer khác của cùng chức năng: không tự sửa; báo ở mục "Đề xuất sửa layer khác". Phiên chính quyết sửa
  (sửa layer đã qua gate làm gate đó mất hiệu lực).

## Nguồn, giả định, con số

Quy ước chung cho mọi tài liệu, mọi agent. Skill bước chỉ ghi phần riêng (ví dụ ba-usecase method.md mục 3–4 là bản
chi tiết cho UC) và không được trái mục này.

### Người đọc và mức đủ
Tài liệu viết cho người dùng nó ở bước sau: Dev code được, QC viết được ca kiểm thử, reviewer chấm được, mà **không
phải hỏi lại BA**. Ô nào khiến người đọc phải hỏi lại là ô chưa xong.

### Nguồn theo thứ tự — dừng ở chỗ đầu tiên tìm thấy
| Thứ tự | Tìm ở đâu | Ghi gì |
| --- | --- | --- |
| 1 | Layer đã viết của chức năng và overview (PROC, REQ, ENT, ST/TR, BR, UC, SCR, SCR-000, rule chung) | ID kèm tên: `TR-004 Nháp → Chờ duyệt` |
| 2 | Danh mục đầu vào: điều khoản, UC presales, màn presales; tài liệu khác trong `0-inputs/` | `PL:<mã điều khoản>`, `PS:<mã gốc>`, `MP-xxx`; tệp khác `[SRC: <tệp>, <vị trí>]` |
| 3 | Giả định đã có trong open-questions (chức năng, dự án) | `[ASM-xxx]` |
| 4 | Không có ở đâu | ASM mới kèm Q (mục "Thiếu thông tin và nguồn mâu thuẫn"), rồi dẫn như thứ tự 3 |

- Mã `PS:`, `PL:`, `MP-` và ID kit là nguồn hợp lệ (CLAUDE.md luật 1 qua danh mục có mã, kit/standards/id-convention.md);
  `[SRC]` dùng cho tệp chưa có mã.
- **Không đúc ASM cho điều đã có ID ở thứ tự 1, 2.** Tìm trong open-questions trước khi tạo ASM, Q mới.
- Nguồn phải nói **đúng điều đang viết**, vị trí cụ thể nhất có thể (điều, khoản, điểm; dòng; mã màn). Không dẫn nguồn
  chỉ vì cùng chủ đề.
- Biên bản họp chỉ là nguồn khi có dòng chốt và người chốt. Câu trả lời của BA (`0-inputs/answers-*.md`) là nguồn loại
  "BA xác nhận", không phải quyết định của khách hàng.
- Nội dung tra cứu web (nếu agent có quyền): kèm link và ngày truy cập, chỉ là tham khảo; dùng làm căn cứ → `[ASM-xxx]`.

### Mã luôn kèm tên
Dẫn ID trong câu chữ, bảng, ô Nguồn: mã kèm tên, tên nói được nội dung. Cột chỉ chứa danh sách ID (cột PROC, cột REQ
của bảng mapping) được ghi mã trơ.
- Đúng: `BR-002 Mỗi người tối đa một đơn đang chờ duyệt`. Sai: `BR-002`, `BR-002 Rule đơn`.

### Con số
- Con số nghiệp vụ (tiền, ngày, thời hạn, tỷ lệ, hạn mức, ngưỡng, số lượng) có trong văn bản → chép đúng số, đơn vị,
  cách tính ngày (ngày lịch / ngày làm việc, tính ngày đầu hay không). Không có nguồn → `[CẦN XÁC NHẬN]`. Không lấy số
  từ ví dụ mẫu, dự án khác, "thông lệ".
- **Con số kèm biên ngay tại chỗ dẫn**, không chỉ dẫn mã điều khoản: QC cần biên để viết ca đúng biên và vượt biên.
  - Đúng: "Nộp chậm nhất 03 ngày làm việc trước ngày nghỉ, ngày nộp không tính — `PL:TT01-2026/Đ5.K1`".
  - Sai: "`PL:TT01-2026/Đ5.K1`" (không biết 3 ngày là còn hạn hay hết hạn), hoặc "Nộp trước 3 ngày" (không nguồn).

### Ba giá trị đặc biệt
| Ghi | Nghĩa | Người đọc hiểu là |
| --- | --- | --- |
| `n/a` | Chắc chắn không có (bước không có thông báo, UC không cần quyền, không ai nhận kết quả) | Không làm, không kiểm phần đó |
| `[CẦN XÁC NHẬN: Q-xxx]` | Chưa biết, đang chờ câu hỏi đó | Chưa làm được; xem Q |
| `[CẦN XÁC NHẬN]` | Con số nghiệp vụ chưa có nguồn | Tham số chờ khách chốt (chặn G4) |

- Dùng `n/a` cho thứ chưa biết là lỗi nặng: Dev đọc `Permission key: n/a` sẽ bỏ kiểm quyền.
- Không để ô trống, không ghi `—` với nghĩa mơ hồ, không "như trên": mỗi dòng tự đứng được khi bị tách ra. (`—` chỉ
  còn dùng ở cột danh sách ID khi template ghi rõ "không có thì —".) Script ba-verify coi `n/a`, `—`, ô trống là ô không
  có giá trị.

### Danh sách tình huống phải xét
Khi method có danh sách tình huống bắt buộc xét (chín câu soát của UC, bốn câu ngoại lệ của quy trình, bốn trạng thái
màn hình…), ghi dòng "Đã soát" liệt kê đủ từng câu và kết quả (thành nhánh / theo quy tắc chung <mã kèm tên> / không
áp dụng (<lý do>)). Đó là bằng chứng để reviewer phân biệt "không áp dụng" với "bỏ sót".

## Thiếu thông tin và nguồn mâu thuẫn

Subagent **không hỏi được người dùng**. Mọi câu hỏi đi vào file:

| Tình huống | Cách xử lý |
| --- | --- |
| Thiếu thông tin, viết tiếp được | Viết theo giả định hợp lý nhất, gắn `[ASM-xxx]`, thêm Q-xxx |
| Thiếu con số | `[CẦN XÁC NHẬN]`, thêm Q-xxx, cột "Chặn gate" ghi G4 |
| Hai nguồn nói khác nhau | Không chọn. Ghi đủ các phương án, nguồn từng phương án, vào Q-xxx; cột "Chặn gate" ghi gate của bước đang làm. Chỗ bị ảnh hưởng ghi `[CẦN XÁC NHẬN: Q-xxx]` |
| Câu hỏi phạm vi (phát sinh, mở rộng) | Q-xxx, cột "Chặn gate" để "—" |
| Thiếu đầu vào nghiêm trọng (layer trước trống, thiếu file được khai báo) | Dừng, báo phiên chính, không viết khung rỗng cho đủ |

Câu hỏi tốt: một vấn đề, có bối cảnh, có nguồn, có phương án khi đưa được, ghi vai trò cần hỏi (BA, PM, khách…).
Mỗi Q, ASM đề xuất ghi **mức rủi ro** (`cao` / `trung bình` / `thấp` — hậu quả nếu đoán sai, định nghĩa ở
kit/templates/ho-so/open-questions.md) và, với Q, **phương án tạm** đang làm theo (`A` / `B` / `ASM-xxx` / `dừng — chặn
<gate>`). Điểm tồn đọng phải được đánh dấu, không được đoán: chỗ đang làm theo phương án tạm luôn dẫn mã Q hoặc ASM.
Trước khi thêm Q mới, tìm trong open-questions (dự án và chức năng); đã có câu tương tự → bổ sung liên kết.

## Cấp ID và cập nhật trace.csv

1. Tầng dự án: đọc `du-an/trace.csv`, lấy số lớn nhất của từng tiền tố, cộng 1. Tầng chức năng: lấy số kế tiếp
   **trong dải của chức năng** (prompt giao việc gửi dải). Hết dải → dừng, báo phiên chính.
2. ID đã cấp không đổi tên, không đổi số, không xóa dòng.
3. Agent chỉ đặt trạng thái `draft`. Đối tượng cần bỏ hoặc bị thay: giữ nguyên trạng thái, ghi đề xuất `deprecated`
   (kèm ID thay thế) trong báo cáo.
4. Mỗi ID mới một dòng, đủ cột theo kit/standards/id-convention.md.
5. `lien_ket` ghi **một chiều** (ID mà đối tượng này dẫn tới); không cần ghi chiều ngược.
6. Trường có dấu phẩy đặt trong ngoặc kép. Sau khi sửa, kiểm số cột từng dòng bằng nhau.
7. Sơ đồ Mermaid dùng ID bỏ gạch ngang (UC012).

## Văn phong

Theo kit/standards/writing-style.md và thuật ngữ trong `du-an/glossary.md`.
Thuật ngữ mới dùng nhiều lần mà chưa có trong glossary → đề xuất ở báo cáo mục "Đề xuất glossary"; chỉ sửa glossary
khi prompt giao việc cho phép.

## Tự kiểm tra

Chạy hết, sửa trước khi báo xong:
1. Đúng template: đủ heading, đúng thứ tự, không đổi tên heading; đã xóa mọi khối `>` hướng dẫn của template.
2. Mọi phát biểu nghiệp vụ có nguồn theo mục "Nguồn, giả định, con số" (ID kèm tên, `PS:`, `PL:`, `MP-`, `[SRC]`)
   hoặc `[ASM]`. Mọi ASM có dòng trong `open-questions.md`. Không ô trống, không "như trên"; `n/a` chỉ cho thứ chắc
   chắn không có.
3. Không còn con số nghiệp vụ thiếu nguồn: tìm chữ số trong file vừa viết, đối chiếu từng số.
4. Không có từ bị cấm: danh sách trong kit/standards/writing-style.md và đặc tính "Không mơ hồ" của
   kit/standards/requirement-quality.md; tìm (grep) từng từ trong file vừa viết.
5. Mọi ID nhắc tới đều tồn tại. Không ID trùng. ID mới nằm trong dải (tầng chức năng). Không định nghĩa lại đối tượng
   của overview hay chức năng khác.
6. `trace.csv` hợp lệ: số cột đúng, trạng thái hợp lệ.
7. Sơ đồ đúng cú pháp (Mermaid: `node kit/tools/ba-verify/mmcheck.mjs <file.md>`; BPMN: `bpmn_lint.py`).
8. Đi qua checklist của lệnh, từng dòng mức "Chặn". Chạy cổng máy của bước (`node kit/tools/ba-verify/check-all.mjs`,
   tầng chức năng thêm `--chuc-nang CN-xx`); sửa mọi LỖI ở file của mình.
9. Không có mật khẩu, token, dữ liệu cá nhân thật.
10. Không sửa `0-inputs/`, không sửa nội dung UC presales; mỗi phát hiện so với presales có dòng PH (hoặc đề xuất PH).

## Cập nhật sau khi BA xác nhận
Phiên chính gửi lại câu trả lời của BA (`0-inputs/answers-<ngày>.md`):
- Áp từng câu trả lời vào đúng vị trí; nguồn là `[SRC: 0-inputs/answers-<ngày>.md, RQ-xx]`, loại "BA xác nhận".
- ASM được BA xác nhận đúng: thay thẻ ASM bằng SRC tới file answers; dòng ASM chuyển "đã xác nhận".
- "Chưa biết": giữ ASM hoặc `[CẦN XÁC NHẬN]` và Q đã có.
- Mâu thuẫn nguồn BA chọn một phương án: ghi phương án đó kèm nguồn answers. Q chuyển `đã quyết`, cột "Người quyết"
  ghi "BA" (khác với quyết định của khách). Các quyết định của BA chưa có xác nhận của khách được liệt kê lại ở SRS
  (mục tồn đọng) và mô tả PR để BA lead chấp nhận.
- BA gõ nội dung khác ở ô "Khác": áp đúng nội dung đó, không diễn giải thêm.
- Không sửa phần BA không trả lời hoặc chọn "Bỏ qua".

## Vòng sửa sau review

Khi phiên chính gửi báo cáo của quality-reviewer:
- Sửa đúng các lỗi được nêu, ưu tiên "Chặn" rồi "Nên sửa". Không viết lại phần không bị nêu.
- Lỗi mà agent cho là reviewer hiểu sai: không sửa, giải thích kèm nguồn trong báo cáo.
- Trả lời từng lỗi: `Đã sửa` / `Không sửa — lý do` / `Cần BA quyết — Q-xxx`.

## Ranh giới

- Không commit, không push, không mở PR. Phiên chính làm việc đó.
- Không sửa kit/standards/, templates/, `.claude/`, `CLAUDE.md`, `0-inputs/`.
- Không đặt trạng thái `dat-Gx`, `approved`, `deprecated`.
- Không sửa file của chức năng khác. Không xóa file của layer khác.
- Biến môi trường `BA_EVAL=1`: làm như thường, phiên chính sẽ dừng trước commit.

## Báo cáo

Trả về cho phiên chính đúng khung sau (ngắn, không kể lại nội dung tài liệu). Phiên chính dùng các bảng Giả định,
Cần xác nhận, Mâu thuẫn nguồn để hỏi BA, nên mỗi dòng phải tự đứng được: có vị trí, nội dung, nguồn.
Bảng không có dòng nào thì ghi "Không có".

```
## Kết quả
- Trạng thái: Xong / Xong một phần / Dừng (lý do)
- File tạo: …
- File sửa: …
- ID mới: … (theo tiền tố, kèm số lượng)
- Sổ phát hiện: số dòng PH mới (hoặc đề xuất) / số dòng đã đóng
- Đề xuất đổi trạng thái (deprecated, changed): …

## Giả định mới
| ASM | Nội dung | Ở đâu |

## Cần xác nhận (con số)
| Vị trí | Nội dung |

## Câu hỏi mở mới
| Q | Câu hỏi | Hỏi ai | Chặn gate |

## Mâu thuẫn nguồn
| Q | Vị trí | Phương án A (nguồn) | Phương án B (nguồn) |

## Phát hiện đề xuất (khi không ghi trực tiếp vào sổ)
| Đối tượng | Phát hiện | Loại | Nguồn | Đề xuất |

## Tự kiểm tra
- Mục "Tự kiểm tra": đạt / chưa đạt (ghi điểm chưa đạt và lý do)
- Checklist của lệnh: số dòng Chặn còn vi phạm

## Đề xuất sửa layer khác
## Đề xuất glossary
## Đề xuất (agent-notes, kit)
```
