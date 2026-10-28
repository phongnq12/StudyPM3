---
name: ba-questioning
description: "Cách hỏi BA trong phiên. Kit v2 dùng chế độ xác nhận (trắc nghiệm, BA xác nhận điều Claude trích được, giả định, mâu thuẫn nguồn, con số) và chỉ hỏi khi agent không được tự quyết; có mức chặn gate và chế độ ngủ. Ba chế độ refinement, brainstorm, phản biện giữ lại để dùng khi BA yêu cầu."
user-invocable: false
metadata:
  version: 2.0.1
  owner: BA lead
  updated: 2026-10-26
---

# Quy trình hỏi đáp với BA

Vòng hỏi đáp luôn chạy ở **phiên chính**. Subagent không hỏi được người dùng, nên agent chỉ chuẩn bị
câu hỏi trong báo cáo; phiên chính là bên hỏi.

**Kit v2:** chỉ hỏi khi agent không được tự quyết (mâu thuẫn nguồn, con số, quyết định phạm vi, quyết định Bỏ UC
presales, hết vòng sửa ở gate), theo kit/standards/gate-procedure.md mục 4–5. Chế độ mặc định là **xác nhận**. Không có
vòng phản biện mặc định; refinement, brainstorm, phản biện chỉ chạy khi BA yêu cầu. Không hỏi lại điều đã có dòng
`đã quyết` trong open-questions.

## 0. Bốn chế độ
| | Refinement | Brainstorm | Xác nhận (mặc định) | Phản biện |
| --- | --- | --- | --- | --- |
| Mục đích | Thu hẹp: chốt, tách, ưu tiên | Mở rộng: tìm nhu cầu, ngoại lệ, rủi ro chưa ai nói | BA xác nhận điều Claude trích từ tài liệu, hoặc giả định, con số, mâu thuẫn, ưu tiên agent để lại | Thử thách hiểu biết nghiệp vụ: tình huống biên, phạm vi mơ hồ, người bị bỏ sót, rủi ro |
| Dạng câu | Trắc nghiệm có đáp án đề xuất, tối đa 4 câu cùng chủ đề mỗi lượt | Câu mở, một câu mỗi lượt, không gợi ý đáp án | Trắc nghiệm, tối đa 4 câu cùng chủ đề mỗi lượt | Trắc nghiệm theo tình huống, tối đa 4 câu mỗi lượt |
| Đào sâu | Không | Tối đa 2 câu đào sâu cho mỗi câu chính | Không | Tối đa 1 câu đào sâu khi BA chọn phương án mới |
| Giới hạn mỗi phiên | 30 câu | 10 câu chính | Không giới hạn cứng | 12 câu, đạt thì dừng |
| Hỏi ý BA có tiếp không | Sau mỗi 10 câu | Sau mỗi 5 câu chính | Sau mỗi 12 câu | Không (dừng ở 12) |
Xác nhận và phản biện chạy liền nhau trong một lần hỏi thì đếm riêng từng chế độ.
Giới hạn đổi được bằng tham số `--max N` của lệnh gọi. Đạt giới hạn → dừng, lưu tiến độ, đề nghị phiên sau dùng `--resume`.

**Chế độ ngủ** (`--ngu`, hoặc BA nói «chế độ ngủ», «chạy thông»): hỏi như chế độ xác nhận, chờ, không có trả lời thì
chọn tạm theo bảng ưu tiên BA chốt lúc bật và ghi sổ. Làm đúng theo `${CLAUDE_SKILL_DIR}/sleep-mode.md`.

## 1. Trước khi hỏi
- Lấy câu hỏi từ báo cáo của agent (mục Giả định mới, Cần xác nhận, Câu hỏi mở mới, Mâu thuẫn nguồn) và từ
  open-questions còn `mở`; đọc `0-inputs/answers-*.md` các ngày trước.
- Bỏ những câu đã có câu trả lời trong tài liệu hoặc trong log. Không hỏi lại điều đã biết.

## 2. Thứ tự ưu tiên
1. Câu chặn gate đang chạy (cột "Chặn gate" của open-questions): mâu thuẫn nguồn, quyết định Bỏ UC presales.
2. Chặn phạm vi: thứ gì trong, thứ gì ngoài phạm vi.
3. Thuật ngữ mơ hồ, một từ hai nghĩa.
4. Yêu cầu gộp nhiều ý: xác nhận cách tách.
5. Trường hợp ngoại lệ, luồng lỗi chưa ai nói tới.
6. Con số, ngưỡng, hạn mức (chỉ chặn ở G4; gom hỏi một lần khi có thể).
Câu trả lời làm phát sinh câu hỏi mới → thêm vào hàng đợi đúng mức ưu tiên, không hỏi lan man ngay.

## 3. Đặt câu hỏi
- Mỗi câu gồm: một dòng bối cảnh, trích nguồn ngắn (file, người nói), câu hỏi, các lựa chọn.
- Có thể đưa lựa chọn → dùng công cụ hỏi trắc nghiệm, mỗi lượt tối đa 4 câu cùng chủ đề.
  Lựa chọn đề xuất đặt đầu tiên, ghi "(đề xuất)" và lý do một dòng.
- Công cụ hỏi cho tối đa 4 lựa chọn mỗi câu và tự thêm ô "Khác" để BA gõ chữ. Không tạo lựa chọn kiểu "Sửa — gõ vào ô Khác";
  BA muốn sửa hoặc nhập giá trị thì dùng ô Khác.
- Refinement, brainstorm: trong 4 lựa chọn luôn có "Chưa biết — cần hỏi stakeholder". Muốn bỏ qua, BA gõ "bỏ qua" ở ô Khác.
  Xác nhận, phản biện: dùng đúng bảng lựa chọn ở mục riêng bên dưới.
- Câu mở (không đưa lựa chọn được) → hỏi bằng chữ, một câu mỗi lượt.
- Không hỏi dạng "có muốn tiếp không" sau từng câu; chỉ hỏi theo nhịp ở bảng mục 0.

### Riêng chế độ brainstorm
- Câu mở, không kèm đáp án, không gợi ý câu trả lời mong muốn.
- Kỹ thuật đào sâu: "Vì sao?" (tối đa 2 lần), "Kể lại lần gần nhất chuyện đó xảy ra", "Còn ai khác bị ảnh hưởng?",
  "Điều gì xảy ra nếu…?", "Làm sao để việc này thất bại?" (brainstorm đảo ngược).
- Không phán xét, không sửa ý của BA trong lúc hỏi; mọi ý được ghi nhận trước, sàng lọc sau.
- Câu trả lời lộ ra ý mới thuộc góc khác → ghi lại, đưa vào hàng đợi, không rẽ ngay.

### Riêng chế độ xác nhận
Nguồn câu hỏi, theo lúc chạy:
- **Trước khi soạn** (ví dụ /ba-init, hoặc lệnh bước đọc input): điều Claude trích được từ tài liệu, mỗi điều kèm nguồn.
- **Sau khi agent soạn:** báo cáo của agent, các mục "Giả định mới", "Cần xác nhận (con số)", "Câu hỏi mở mới", "Mâu thuẫn nguồn" (khung báo cáo của
  ba-agent-protocol).

Lựa chọn theo loại câu (tối đa 4; sửa, nhập số, ghi điều kiện đều qua ô "Khác" của công cụ):
| Loại | Lựa chọn | Ô Khác dùng để |
| --- | --- | --- |
| Thông tin trích từ tài liệu | Đúng (đề xuất) / Chưa chắc — hỏi stakeholder / Bỏ qua | Sửa nội dung |
| Giả định `[ASM-xxx]` | Đúng như giả định (đề xuất) / Chưa biết — hỏi stakeholder / Bỏ giả định / Bỏ qua | Sửa thành nội dung khác |
| Con số `[CẦN XÁC NHẬN]` | Chưa biết — hỏi stakeholder / Giữ [CẦN XÁC NHẬN] / Bỏ qua | Nhập số kèm nguồn |
| Mâu thuẫn nguồn | Phương án A (nguồn) / Phương án B (nguồn) / Chưa biết — hỏi stakeholder / Bỏ qua | Ghi "tùy điều kiện…" |
| Quyết định Bỏ UC presales | Đồng ý bỏ / Không bỏ, giữ UC / Chưa biết — hỏi PM | Ghi điều kiện |

Quy tắc:
- Con số: Claude **không đưa số vào lựa chọn** nếu số đó không có nguồn. Chỉ BA được nhập số.
- Mâu thuẫn nguồn: không đánh dấu phương án nào là "đề xuất" (CLAUDE.md luật 7). BA chọn một phương án → Q chuyển
  `đã quyết`, cột "Người quyết" ghi "BA", cột "Phương án" vẫn giữ đủ các phương án. Quyết định của BA không phải quyết
  định của khách: SRS và mô tả PR liệt kê lại để BA lead chấp nhận. Khi khách xác nhận, cập nhật "Người quyết" và
  "Nguồn quyết định".
- Gom câu cùng tài liệu hoặc cùng chủ đề vào một lượt. Câu có ảnh hưởng lớn nhất hỏi trước (thứ tự ở mục 2); trong
  cùng thứ tự, câu `Mức rủi ro` cao hỏi trước.
- Khi ghi Q vào open-questions: điền `Mức rủi ro` và `Phương án tạm` (kit/templates/ho-so/open-questions.md). BA chọn
  "Chưa biết — hỏi stakeholder" → Q giữ `mở`, phương án tạm là giả định đang dùng (`ASM-xxx`) hoặc `dừng — chặn <gate>`.
- Câu trả lời bác một giả định → ASM chuyển `sai` (không phải `bỏ`), chỗ dẫn ASM sửa theo quyết định; đó là số liệu cho
  chỉ số "tồn đọng hóa ra sai" (`kit/tools/ba-verify/chi-so.mjs`).

### Riêng chế độ phản biện
Mục đích là giúp BA nhìn ra chỗ hở trước khi chốt, không phải chấm điểm BA.
- Mỗi câu là một tình huống cụ thể: "Nếu <tình huống>, nghiệp vụ xử lý thế nào?", kèm một dòng vì sao hỏi.
- Lựa chọn: tối đa 2 cách xử lý hợp lý (không đánh dấu đề xuất) / "Chưa nghĩ tới — ghi thành câu hỏi cho khách" /
  "Có thể ngoài phạm vi — tạo câu hỏi cho người quyết phạm vi". Cách xử lý khác: BA gõ ở ô Khác.
- Câu trả lời phản biện là "BA xác nhận", không phải quyết định phạm vi. Ngoài BRD (bước 2 phần 1, bước 4), điều liên
  quan phạm vi thành câu hỏi phạm vi (cột "Chặn gate" để "—"), không sửa mục phạm vi của BRD.
- Lấy góc từ 11 góc nhìn: (1) mục tiêu và giá trị, (2) người dùng và vai trò, (3) luồng hiện tại và điểm đau, (4) ngoại lệ
  và tình huống biên, (5) dữ liệu và báo cáo, (6) tích hợp và hệ thống liên quan, (7) phân quyền và bảo mật, (8) pháp lý
  và tuân thủ, (9) phi chức năng, (10) chuyển đổi và vận hành, (11) rủi ro và giả định. Ưu tiên: mục tiêu đo được, ranh giới phạm vi,
  người bị ảnh hưởng chưa được nhắc, ngoại lệ và tình huống biên, giả định ngầm, rủi ro.
- Mỗi chủ đề tối đa 2 câu. Không hỏi điều tài liệu đã trả lời rõ.
- Không phán xét câu trả lời. "Chưa nghĩ tới" là kết quả tốt: nó thành Q-xxx đúng người cần hỏi.

## 4. Ghi nhận ngay sau mỗi câu trả lời
File ghi:
- Mọi lệnh (/ba-init, /ba-overview, /ba-chuc-nang, /ba-pr): `0-inputs/answers-<YYYY-MM-DD>.md`. Chạy lại cùng
  ngày thì ghi tiếp vào file đó, không tạo file mới. Đây là file duy nhất trong `0-inputs/` được ghi.

| RQ | Vòng (trước / sau khi soạn) | Chế độ | Câu hỏi | Trả lời | Loại nguồn | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |

`RQ-xx` đánh số tăng liên tục trong một file, không đánh lại từ đầu mỗi vòng.

Loại nguồn:
- **BA xác nhận:** BA trả lời từ hiểu biết của mình → nguồn `[SRC: <đường dẫn file ghi>, RQ-xx]`.
- **BA dẫn tài liệu:** BA nói đã có trong biên bản, email → hỏi đường dẫn hoặc yêu cầu BA thả file vào 0-inputs/, dẫn file đó.
- **Cần hỏi stakeholder:** tạo Q-xxx trong open-questions.md, ghi vai trò cần hỏi và cột "Chặn gate".
Câu trả lời của BA không tự động là quyết định của khách hàng (cột "Người quyết" phân biệt BA và khách).

## 5. Lưu tiến độ
- Commit `0-inputs/answers-<ngày>.md` lên nhánh làm việc sau mỗi 5 câu, để phiên bị ngắt vẫn chạy tiếp được
  (`/ba-chuc-nang --tiep`, hoặc chạy lại lệnh). Commit này độc lập với commit cuối của bước.

## 6. Khi nào dừng
- Đạt giới hạn mỗi phiên (mục 0); hoặc
- Refinement: hết câu ưu tiên 1–2 (chặn phạm vi, mâu thuẫn); brainstorm: đã phủ các góc được chọn;
  xác nhận: hết mục cần xác nhận; phản biện: đạt 12 câu hoặc hết chủ đề; hoặc
- BA gõ "dừng"; hoặc
- BA chọn dừng ở lượt hỏi "có tiếp không" (nhịp theo bảng mục 0).
Khi dừng, báo: đã hỏi bao nhiêu, đã chốt bao nhiêu, chuyển stakeholder bao nhiêu, còn bao nhiêu trong hàng đợi.

## 7. Khi không có người (chạy bằng `claude -p`)
Không hỏi. Giữ nguyên ASM, `[CẦN XÁC NHẬN]` và Q đã có. Câu chặn gate đang chạy → dừng tại gate, báo danh sách câu
còn chặn. Câu không chặn → làm tiếp. BA vắng nhưng vẫn theo dõi chat được thì dùng chế độ ngủ (`--ngu`).
