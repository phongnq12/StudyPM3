---
name: ba-gate
description: "Chạy một gate của kit: G0 (tầng dự án, sau /ba-overview), G1 (UC chi tiết của CN), G2 (prototype và đặc tả màn của CN). Kiểm khóa, cổng máy (lớp A), reviewer độc lập theo đợt (4–6 chế độ: chất lượng, nhất quán, pháp lý, presales, qc, ngoại lệ), gộp lỗi lấy mức cao hơn, kết luận theo tiêu chí cứng, tối đa 2 vòng sửa bằng phiên mới, ghi hồ sơ gate, đặt trạng thái dat-Gx. /ba-overview gọi G0, /ba-detail gọi G1, G2; gọi tay /ba-gate G0 hoặc /ba-gate G1 CN-xx để chạy lại riêng một gate. G3, G4 (SRS) chưa dùng ở kit này."
argument-hint: "G0 | G1 CN-xx | G2 CN-xx [--ngu]"
user-invocable: true
metadata:
  version: 0.1.0
  owner: BA lead
  updated: 2026-10-27
---

Tham số: $ARGUMENTS
- `Gx`: `G0` (tầng dự án) hoặc `G1`, `G2` (tầng chức năng, kèm `CN-xx`).
- `--ngu`: BA vắng mặt (skill ba-questioning, sleep-mode.md): câu hỏi không chặn thì chọn tạm, ghi sổ; câu chặn gate
  thì dừng, hồ sơ KHÔNG ĐẠT.

Thiết kế: kit/thiet-ke/thiet-ke-kit.md mục 7. Quy trình chung: kit/standards/gate-procedure.md mục 3, 5.

## Version control

| Phiên bản | Ngày | Người thực hiện | Thay đổi |
|---|---|---|---|
| 0.1.0 | 27/10/2026 | Claude (soạn) | Port từ ba-kit `ba-gate` 1.2.0 sang PM9. Gate PM9: G0 = bước 1 + sáu lớp + điền ngược + danh mục chức năng; G1 = UC chi tiết của CN; G2 = prototype + đặc tả màn của CN. Bỏ khỏi luồng chính: nhóm C (kiểm chứng bằng sản xuất thử), G3, G4 — dành cho SRS, chưa dùng ở kit này (script vẫn giữ). Đường dẫn, người sửa theo thư mục PM9 |

## Mục đích
Kiểm soát chất lượng giữa các bước bằng agent review theo tiêu chí cứng, không bằng người đọc từng bước. Gate ĐẠT mới
mở khóa bước sau; sửa tài liệu đã qua gate làm gate đó và các gate sau mất hiệu lực.

## Gate của kit

| Gate | Sau | Gọi từ | Hồ sơ | Checklist |
| --- | --- | --- | --- | --- |
| G0 | Bước 1 `/ba-init`, bước 2 `/ba-overview` (đợt 1–7, 5b) | `/ba-overview` bước 8 | `du-an/G0.md` | `checklist-G0.md` |
| G1 | `/ba-detail CN-xx` đợt 1 (UC chi tiết) | `/ba-detail` bước 9 | `chuc-nang/CN-xx/G1.md` | `checklist-G1.md` |
| G2 | `/ba-detail CN-xx` đợt 2, 3 (prototype, đặc tả màn) | `/ba-detail` bước 9 | `chuc-nang/CN-xx/G2.md` | `checklist-G2.md` |
| G3, G4 | SRS | — | — | Chưa dùng ở kit này |

Hồ sơ theo `kit/templates/ho-so/gate.md` (mục 9 "Nhóm C" ghi `n/a`).

## Nguyên tắc chấm
- Mọi tiêu chí là **nhị phân**: đạt hoặc không đạt. Không có điểm tổng, không "tạm chấp nhận", không "đạt có điều kiện".
  Điểm tổng cho phép bù trừ: một lỗ hổng nghiêm trọng bị che bởi nhiều hạng mục tốt.
- Hai lớp, theo thứ tự; lớp trước không đạt thì **dừng**, không chạy lớp sau:

  | Lớp | Ai chấm | Gate |
  | --- | --- | --- |
  | A — cấu trúc, độ đầy đủ (đếm, đối chiếu) | Script (`gate-check --may`, gồm `check-all`): kết quả ổn định giữa các lần chạy | G0, G1, G2 |
  | B — mâu thuẫn, đúng ý | Reviewer theo chế độ (bảng dưới), mỗi lỗi có vị trí và bằng chứng | G0, G1, G2 |

  Lớp C (kiểm chứng bằng sản xuất thử, `kiem-chung.mjs`) thuộc G4: chưa dùng ở kit này.

## Reviewer mỗi gate
| Gate | Chế độ `quality-reviewer` | Số phiên | Đợt (tối đa 5 agent cùng lúc) |
| --- | --- | --- | --- |
| G0 | `chat-luong`, `nhat-quan`, `phap-ly`, `presales` | 4 | 1 |
| G1 | + `qc`, `ngoai-le` | 6 | 2 (4 + 2) |
| G2 | `chat-luong`, `nhat-quan`, `phap-ly`, `presales` | 4 | 1 |

Cách làm từng chế độ: `.claude/agents/quality-reviewer.md` mục "Chế độ".

## Đọc trước
- `${CLAUDE_SKILL_DIR}/checklist-Gx.md` (gate đang chạy), `${CLAUDE_SKILL_DIR}/checklist-chung.md`, và checklist của
  các bước trong phạm vi gate (bảng dưới).

| Gate | Checklist bước chấm cùng (mã dòng trong hồ sơ) |
| --- | --- |
| G0 | `.claude/skills/ba-init/checklist.md` (`init-<số>`); mục "Soát trước khi đóng" của `create-brd`, `create-bp`, `create-erd`, `create-sm`, `create-ucl`, `create-br` (`brd-soat`, `bp-soat`, `erd-soat`, `sm-soat`, `ucl-soat`, `br-soat`); cổng ra từng lớp ở `ba-overview/SKILL.md` |
| G1 | `.claude/skills/ba-detail/checklist-uc.md` (`uc-<số>`); "Soát trước khi đóng một UC" của `create-uc` |
| G2 | `.claude/skills/ba-detail/checklist-prototype.md` (`proto-<số>`), `checklist-screens.md` (`scr-<số>`) |

Checklist-Gx là tiêu chí ra của gate; checklist bước là chi tiết agent đã tự kiểm. Reviewer chấm lại mọi dòng **Chặn**
của checklist bước mà máy chưa kiểm, theo chế độ hợp với dòng đó; dòng máy đã kiểm lấy kết quả cổng máy.
- `kit/templates/ho-so/gate.md` (hồ sơ), `kit/standards/gate-procedure.md`, `kit/standards/requirement-quality.md`.
- Sổ của tầng: `1-ba-init/open-questions.md` và `du-an/open-questions.md` (G0), `chuc-nang/CN-xx/open-questions.md`
  (G1, G2); sổ giả định `2-ba-overview/assumption_log.md`.

## Phạm vi và người sửa
| Gate | Phạm vi (gate chức năng chỉ lấy file của chức năng) |
| --- | --- |
| G0 | `1-ba-init/` (trừ `templates/`), `2-ba-overview/1-brd/` … `6-business-rules/`, `2-ba-overview/assumption_log.md`, `du-an/glossary.md` |
| G1 | `chuc-nang/CN-xx/` (trừ `open-questions.md`, `trace.csv`, hồ sơ gate), `3-ba-detail/use-case/CN-xx-<slug>/` |
| G2 | `3-ba-detail/Prototype/` (trang `app/src/pages/CN-xx/`, `CN-xx-<slug>/`, file app chung nhánh CN đã sửa), `3-ba-detail/Screens/CN-xx-<slug>/` |

Danh sách chính xác: `node kit/tools/ba-verify/gate-check.mjs --pham-vi Gx [--chuc-nang CN-xx]` (định nghĩa ở
`PHAM_VI`, `LOAI_TRU` trong script).

| File có lỗi | Agent sửa (luôn là phiên mới) |
| --- | --- |
| `1-ba-init/0-dau-vao/` (UC presales, pháp lý, ma trận UC × điều khoản, bản đồ quy trình) | business-analyst (chạy `/ba-init --bo-sung`) |
| `1-ba-init/0-dau-vao/man-presales.*` | ux-spec-designer |
| `2-ba-overview/1-brd/`, `2-ba-overview/2-business-process/` | business-analyst |
| `2-ba-overview/3-erd/`, `2-ba-overview/4-state-machine/` | data-modeler |
| `2-ba-overview/5-actor-usecase/` (UCD, UCL, TRACE, `danh-muc-chuc-nang.md`), `2-ba-overview/6-business-rules/`; ô mã BR do lượt điền ngược ghi ở lớp 1–5 | usecase-analyst |
| `3-ba-detail/use-case/` | usecase-analyst |
| `3-ba-detail/Prototype/`, `3-ba-detail/Screens/` | ux-spec-designer |
| `du-an/glossary.md`, open-questions, `2-ba-overview/assumption_log.md` (ghi theo lời BA), trace.csv, hồ sơ gate | phiên chính |

Sửa lớp của `/ba-overview` theo đúng đợt, skill lớp và cổng ra ở `ba-overview/SKILL.md`; tài liệu bị sửa có nghĩa
tăng `vNN`, ghi Version control.

## Các bước (phiên chính điều phối; phiên chính không review, không sửa tài liệu của agent)

1. **Kiểm khóa và trạng thái.**
   - Gate trước phải còn hiệu lực: `node kit/tools/ba-verify/gate-check.mjs [--chuc-nang CN-xx] --can <gate trước>`
     (G0: bỏ qua; G1: `--can G0`; G2: `--can G1`). KHÓA → dừng, báo BA nguyên văn.
   - `git status --porcelain` phải sạch: mọi tài liệu trong phạm vi đã commit. Còn thay đổi → dừng, báo lệnh gọi
     commit trước. Ghi lại `C = git rev-parse --short HEAD`: commit được kiểm.
2. **Cổng máy:** `node kit/tools/ba-verify/gate-check.mjs [--chuc-nang CN-xx] --may Gx` (gồm check-all, gate trước,
   Q mở chặn Gx, không sửa `0-inputs/`, kiểm riêng của Gx: G0 trạng thái sáu lớp, `kiem_business_layer.py`, sơ đồ QT
   lớp 2, danh mục chức năng; G1 UC của module có file, PH của CN; G2 có trang, ghi chú, SCR của CN). G2 thêm:
   phiên chính chạy `npm run build` trong `3-ba-detail/Prototype/app/` (G2-4), ghi kết quả mục 2 của hồ sơ.
   - Còn LỖI do tài liệu → gửi nguyên văn cho agent sửa của file đó (bảng trên, phiên mới), commit
     `spec(<tầng>/<layer>): sửa theo cổng máy Gx`, chạy lại; tối đa 2 lần. Còn LỖI → KHÔNG ĐẠT, sang bước 7.
   - LỖI là Q `mở` chặn Gx → bước 6 (hỏi BA); chưa trả lời được → KHÔNG ĐẠT.
   - CẢNH BÁO "dòng Máy chưa có script" → ghi lại, giao cho chế độ review hợp với dòng đó ở bước 3.
   - Commit đổi sau khi sửa → cập nhật `C`.
3. **Review song song (lớp B).** Theo bảng "Reviewer mỗi gate": mỗi đợt một tin nhắn, tối đa 5 lời gọi công cụ Agent
   (`quality-reviewer`), mỗi lời gọi một chế độ; đợt sau chạy khi đợt trước xong. Prompt mỗi phiên gồm đủ bảng
   "Phiên chính gửi" của agent: CHẾ ĐỘ, GATE, TẦNG, COMMIT `C`, PHẠM VI (kết quả `--pham-vi`), CHECKLIST (checklist-Gx,
   checklist-chung, checklist bước ở "Đọc trước"), MÁY (kết quả bước 2, dòng "Máy" giao cho chế độ này), VÒNG 1.
   Phiên review không phải phiên đã viết tài liệu.
4. **Gộp kết quả** vào hồ sơ mục 4:
   - Cùng vị trí và cùng lỗi (hai reviewer nói một việc) → một dòng, **lấy mức cao hơn**, cột Reviewer ghi đủ các chế
     độ.
   - Lỗi mức Chặn thiếu vị trí hoặc bằng chứng → hạ "Nên sửa", ghi "thiếu bằng chứng" (checklist-chung 14).
   - Lỗi là việc đã có Q `mở` hoặc dòng `đã quyết` → bỏ, ghi lý do ở mục 4.
   - "Cần BA xem" của reviewer → bước 6.
   - Mỗi dòng checklist-Gx, checklist-chung lấy kết quả từ reviewer phụ trách, hoặc từ máy; hai reviewer khác kết quả
     → lấy kết quả xấu hơn.
5. **Kết luận và vòng sửa.**
   - Không còn lỗi Chặn, không còn Q `mở` chặn Gx → **ĐẠT**, sang bước 7 (bước 6 khi có câu cần BA xem).
   - Còn → vòng sửa (tối đa 2):
     1. Gom lỗi Chặn và Nên sửa theo file → agent sửa (bảng trên), **phiên mới**, prompt: danh sách lỗi (mức, checklist,
        vị trí, lỗi, bằng chứng, đề xuất), quy định "Vòng sửa sau review" của ba-agent-protocol, skill lớp của file.
        Agent trả lời từng lỗi: `Đã sửa` / `Không sửa — lý do` / `Cần BA quyết — Q-xxx`.
     2. Agent khác nhau sửa file khác nhau thì chạy song song; hai agent không sửa cùng một file.
     3. Phiên chính gộp đề xuất Q, ASM, PH, glossary (mã giữ chỗ → mã thật; tầng chức năng trong dải của CN), commit
        `spec(<tầng>/Gx): sửa vòng <n>`, cập nhật `C`, chạy lại bước 2.
     4. Review lại (VÒNG n+1): phiên `quality-reviewer` **mới** cho mỗi chế độ còn lỗi Chặn, Nên sửa chưa đóng, cộng
        chế độ `nhat-quan` (bắt lỗi do sửa gây ra). Gửi kèm bảng lỗi vòng trước, trả lời của agent sửa, commit trước và
        sau khi sửa. Gộp như bước 4.
   - Hết 2 vòng sửa vẫn còn lỗi Chặn → **KHÔNG ĐẠT**, sang bước 7.
6. **Hỏi BA** (skill ba-questioning, chế độ xác nhận), chỉ những gì agent không được tự quyết: Q `mở` chặn Gx, "Cần BA
   quyết" của agent sửa, "Cần BA xem" của reviewer có ảnh hưởng tới kết luận. Q mới ghi vào sổ của tầng (cột "Chặn gate"
   theo kit/standards/gate-procedure.md mục 5). Giả định BA chấp nhận tạm: G0 ghi `GD-xxxx` vào
   `2-ba-overview/assumption_log.md`; G1, G2 ghi ASM trong dải của CN. Câu trả lời ghi `0-inputs/answers-<YYYY-MM-DD>.md`,
   gửi agent sửa áp vào (vòng sửa kế tiếp, không tính thêm vòng nếu chỉ áp câu trả lời). `--ngu`: Q chặn Gx → dừng,
   KHÔNG ĐẠT.
7. **Ghi hồ sơ** theo `kit/templates/ho-so/gate.md` (cả khi KHÔNG ĐẠT), ghi đè hồ sơ cũ:
   - Bảng đầu: Gate, Tầng, Kết luận, Commit đã kiểm = `C` (lần review cuối), Ngày, Vòng sửa, Lỗi Chặn còn.
   - Mục 7: mọi dòng của checklist-Gx có kết quả; dòng Chặn chưa đạt của checklist-chung và checklist bước ghi thêm.
   - Mục 8: số phiên, token và thời gian lấy từ kết quả công cụ Agent khi có; không có thì ghi "—".
   - Mục 9 (Nhóm C): `n/a`.
8. **Đóng gate.**
   - ĐẠT: `node kit/tools/ba-verify/gate-check.mjs [--chuc-nang CN-xx] --dat Gx` (kiểm hồ sơ, `C` = HEAD, đặt dat-Gx
     trong trace.csv). Lỗi → sửa hồ sơ, không commit khi chưa đặt được. Commit `spec(<tầng>/Gx): hồ sơ gate — ĐẠT`.
   - KHÔNG ĐẠT: commit `spec(<tầng>/Gx): hồ sơ gate — KHÔNG ĐẠT`. Không đặt trạng thái.
   - `<tầng>` là `du-an` hoặc `CN-xx` (kit/standards/git-flow.md). Không push, không mở PR.
   - Mỗi lời gọi agent một dòng ở `du-an/reports/dieu-phoi/<nhánh>.md` (`/` thay bằng `-`): agent, chế độ hoặc việc,
     vòng, token, thời gian.
   - `BA_EVAL=1`: làm như thường, dừng trước commit.

## Gate mất hiệu lực
Lệnh của mọi bước chạy `gate-check.mjs [--chuc-nang CN-xx]` trước khi làm. Gate báo MẤT HIỆU LỰC (có file trong phạm
vi đổi sau commit đã kiểm, hoặc gate trước không còn ĐẠT):
- `node kit/tools/ba-verify/gate-check.mjs [--chuc-nang CN-xx] --lui` (trạng thái lùi về gate cao nhất còn ĐẠT), commit
  `spec(<tầng>/Gx): gate mất hiệu lực, lùi trạng thái`.
- Chạy lại gate đó và các gate sau theo thứ tự khi tới lượt (`/ba-overview --tiep` cho G0, `/ba-detail CN-xx --tiep`
  cho G1, G2).
- Hay gặp: prototype làm lộ hổng của UC → sửa UC → G1 mất hiệu lực, chạy lại G1 trước G2.

## Không được làm
- Không kết luận "đạt có điều kiện"; không bỏ qua lỗi Chặn vì "sửa sau".
- Phiên chính không tự review, không tự sửa tài liệu của agent (trừ file ở dòng "phiên chính" của bảng người sửa).
- Không dùng lại phiên reviewer hay phiên viết để sửa; không để reviewer sửa.
- Không quá 2 vòng sửa. Không ghi Commit đã kiểm khác commit reviewer đã đọc.
- Không chạy lớp B khi lớp A chưa đạt.
- Không đặt `dat-Gx` bằng tay trong trace.csv.
- Không chạy G3, G4, nhóm C khi BA lead chưa mở lại.

## Báo lại lệnh gọi (và BA)
Một đoạn: gate, tầng, kết luận, commit đã kiểm, số vòng sửa, số lỗi theo mức (Chặn / Nên sửa / Gợi ý) và đã sửa bao
nhiêu, Q chờ BA, đường dẫn hồ sơ. KHÔNG ĐẠT: danh sách lỗi Chặn còn lại (vị trí, lỗi) và việc BA cần làm.
