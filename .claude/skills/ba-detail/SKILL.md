---
name: ba-detail
description: "Bước 3 — Chi tiết một chức năng CN-xx (một module WBS của use_case_list lớp 5): ba đợt UC chi tiết theo create-uc (rồi G1) → prototype bấm được trong app chung → đặc tả màn chỉ ghi phần khác SCR-000 (rồi G2); mỗi đợt review độc lập, gộp đề xuất trong dải ID của CN, hỏi BA khi cần, commit. Chạy sau G0; --lop chạy lại một đợt, --tiep chạy tiếp từ đợt chưa commit."
argument-hint: "CN-xx [--lop uc|prototype|screens] [--tiep] [--ngu]"
disable-model-invocation: true
metadata:
  version: 0.1.0
  owner: BA lead
  updated: 2026-10-27
---

Tham số: $ARGUMENTS
- `CN-xx`: bắt buộc, có dòng trong `2-ba-overview/5-actor-usecase/danh-muc-chuc-nang.md` (cột: CN | Tên | Module WBS |
  UC | QT liên quan | Thực thể chính | Phụ thuộc CN | Thứ tự làm | Dải ID | Nhánh). Một CN = một module WBS
  `<MA>.<NỀN TẢNG>.<MODULE>`.
- `--lop <đợt>`: chạy lại đúng một đợt. `uc` → G1, G2 mất hiệu lực; `prototype`, `screens` → G2 mất hiệu lực.
- `--tiep`: bỏ qua đợt đã có commit `spec(CN-xx/<đợt>)` và gate đã ĐẠT, chạy tiếp từ chỗ dừng.
- `--ngu`: BA vắng mặt (skill ba-questioning, sleep-mode.md). Câu chặn gate vẫn dừng.

Quy trình chung: kit/standards/gate-procedure.md mục 2, 3, 5. Cách điều phối giống `/ba-overview` (agent theo đợt,
review độc lập, gộp, cổng máy, hỏi BA, commit).

## Đọc trước
- CLAUDE.md; `du-an/glossary.md`; `du-an/agent-notes/_chung.md`; kit/standards/id-convention.md, git-flow.md,
  gate-procedure.md; skill ba-questioning.
- Dòng CN-xx của danh mục chức năng; `UCL_…`, `UCD_…` (lớp 5) để lấy danh sách UC, tác nhân, `Permission key`.
- Skill `create-uc` (đợt 1); `${CLAUDE_SKILL_DIR}/method-prototype.md` (đợt 2); `${CLAUDE_SKILL_DIR}/method-screens.md`
  (đợt 3); ba checklist `${CLAUDE_SKILL_DIR}/checklist-uc.md`, `checklist-prototype.md`, `checklist-screens.md`.

## Bảng đợt
`<slug>` lấy ở cột "Nhánh" của danh mục. Mỗi đợt một agent chính, phiên mới.

| Đợt | `--lop` | Agent | Phương pháp, checklist | File được ghi | Commit | Gate sau |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `uc` | usecase-analyst (nhiều UC: tối đa 5 song song, mỗi agent một nhóm file) | create-uc + reference; checklist-uc.md | `3-ba-detail/use-case/CN-xx-<slug>/<mã UC WBS>-<slug UC>.md`, mỗi UC một file | `spec(CN-xx/uc): use case chi tiết` | `ba-gate G1 CN-xx` |
| 2 | `prototype` | ux-spec-designer | method-prototype.md; checklist-prototype.md | `3-ba-detail/Prototype/app/` (lần đầu: dựng khung; sau đó chỉ `src/pages/CN-xx/`), `3-ba-detail/Prototype/CN-xx-<slug>/prototype-notes.md`, ảnh | `spec(CN-xx/prototype): prototype bấm được` | — |
| 3 | `screens` | ux-spec-designer (nhiều màn: tối đa 5 song song, mỗi agent một nhóm SCR) | method-screens.md; checklist-screens.md | `3-ba-detail/Screens/CN-xx-<slug>/SCR-xxx-<slug>.md`; lần đầu thêm `3-ba-detail/Screens/SCR-000-quy-uoc-chung.md` | `spec(CN-xx/screens): đặc tả màn` | `ba-gate G2 CN-xx` |

Template: `3-ba-detail/templates/use-case/TEMPLATE_UC.md`, `templates/prototype/prototype.md`,
`templates/screens/screen.md`, `templates/screens/scr-000.md`.

## Các bước (phiên chính điều phối)

1. **Điều kiện.** Thiếu một điều → dừng, báo BA thiếu gì.
   - `node kit/tools/ba-verify/gate-check.mjs --can G0` thoát 0 (G0 ĐẠT, còn hiệu lực).
   - CN-xx có trong danh mục; cột "Phụ thuộc CN" đã merge hoặc BA đồng ý chạy với cờ "chờ CN-yy" (ghi Q `đã quyết`).
   - `git status` sạch; không có nhánh khác đang làm CN-xx (`git branch -a --list '*CN-xx-*'`).
   - **Nhánh** `chuc-nang/CN-xx-<slug>`: đã có → chuyển sang (cần `--tiep` hoặc `--lop`, không thì hỏi BA). Chưa có →
     nếu `git show main:du-an/G0.md` có Kết luận ĐẠT thì tạo từ `main`; nếu chưa (tầng dự án chưa merge, chưa có
     `/ba-pr`) thì tạo từ `du-an/khung` và ghi vào nhật ký điều phối "nhánh tạo từ du-an/khung, PR của CN chỉ mở
     sau khi tầng dự án đã merge".
   - Có nhánh: `gate-check.mjs --chuc-nang CN-xx`; gate MẤT HIỆU LỰC → `--lui`, commit, chạy lại từ gate đó.

2. **Khởi tạo** (lần đầu, phiên chính): `chuc-nang/CN-xx/open-questions.md` và `trace.csv` là bản rỗng của
   `kit/templates/ho-so/open-questions.md`, `trace.csv` (giữ heading, dòng tiêu đề bảng, bỏ dòng mẫu, như
   `khoi-tao.mjs`); thay `<tầng: dự án / CN-xx>` bằng CN-xx. Dải ID lấy ở cột "Dải ID" (mặc định CN-01 101–150,
   CN-02 151–200…, áp cho Q, ASM, PH, SCR). Commit `spec(CN-xx/khoi-tao): sổ chức năng`.

3. **Giao agent cho đợt** (công cụ Agent). Prompt gồm: đợt, file được ghi (chỉ theo bảng đợt), template, phương pháp,
   checklist, dải ID của CN, danh sách UC của module (đợt 1) hoặc UC đã qua G1 (đợt 2, 3); đầu vào: lớp 1–6
   `2-ba-overview/*/`, `2-ba-overview/assumption_log.md`, `1-ba-init/0-dau-vao/*.md`, `du-an/open-questions.md`,
   `chuc-nang/CN-xx/open-questions.md`, glossary, agent-notes. Yêu cầu chung:
   - Không tạo nghiệp vụ mới ngoài business layer đã qua G0. Thiếu → ❓ `[CẦN BA CHỐT]` (UC) hoặc `[ASM-T<n>]`,
     `[Q-T<n>]`, `[PH-T<n>]` (mã giữ chỗ) đề xuất trong báo cáo. Không tự điền con số: `[CẦN XÁC NHẬN]`.
   - Không ghi glossary, open-questions, trace.csv, file tầng dự án; đề xuất trong báo cáo kèm dòng trace.
   - Đợt 1, nhiều UC: chia theo chức năng WBS (`<MA>.WEB.03.01`, `.02`…), mỗi nhóm ≤ 8 UC, tối đa 5 agent cùng lúc.
     Mỗi agent tự soát, rồi **review độc lập theo create-uc** (`reference/review-doc-lap.md`, agent mới, chỉ đưa
     đường dẫn, mỗi UC một reviewer hoặc một reviewer một nhóm); sửa theo phát hiện hoặc ghi lý do. Cột `Màn hình`,
     `Message thông báo` của bước có màn, thông báo ghi `chưa chốt (prototype)` (create-uc: màn chưa dựng).
   - Đợt 2: dựng, cập nhật app chung; bấm thử mọi luồng UC (main, alternative, exception); `npm run build` phải
     đạt. Xong thì điền ngược cột `Màn hình`, `Message thông báo` của UC đang ghi `chưa chốt (prototype)` (bước 6).
   - Đợt 3: một file một SCR, chỉ ghi phần khác SCR-000; review độc lập một lượt cho cả đợt (agent mới, chỉ đường dẫn).
   - Ghi mỗi lần gọi agent vào `du-an/reports/dieu-phoi/chuc-nang-CN-xx-<slug>.md` (agent, việc, file, kết quả,
     số vòng sửa).

4. **Gộp đề xuất** (phiên chính ghi): cấp số thật trong dải và thay mã giữ chỗ.
   - `chuc-nang/CN-xx/open-questions.md`: Q (kèm "Chặn gate", "Mức rủi ro", "Phương án tạm"), ASM, PH.
   - `chuc-nang/CN-xx/trace.csv`: mỗi UC, SCR một dòng (`lien_ket` tới bảng ERD, `SM mục n`, BR, UC); Q, ASM, PH mới.
   - `du-an/glossary.md`, file overview: **chỉ thêm dòng** (id-convention mục "Overview và chi tiết"). Cần sửa lớp
     1–6 hay file của CN khác → Q đề xuất, không sửa.

5. **Cổng máy** `node kit/tools/ba-verify/check-all.mjs --chuc-nang CN-xx`; đợt 2 thêm `npm run build` trong
   `3-ba-detail/Prototype/app/`. Còn LỖI → gửi nguyên văn cho agent của file đó, chạy lại, tối đa 2 lần; hết 2 lần →
   dừng, báo BA.

6. **Prototype làm lộ chỗ hổng của UC** (đợt 2, 3): luồng không bấm được, thiếu bước, thông báo không có chỗ hiện →
   sửa UC trước (usecase-analyst, phiên mới), commit `spec(CN-xx/uc): <việc sửa> (từ prototype)`, G1 mất hiệu lực, rồi mới sửa
   prototype. Điền ngược `chưa chốt (prototype)` → route, chuỗi thông báo cũng là sửa UC: commit
   `spec(CN-xx/uc): điền màn và thông báo từ prototype`, chạy lại `ba-gate G1 CN-xx` trước G2. Hổng ở lớp 1–6 → Q
   chặn G1/G2, không sửa lớp.

7. **Hỏi BA** (ba-questioning, chế độ xác nhận; chỉ điều agent không tự quyết): `[CẦN BA CHỐT]` của UC (BA chốt /
   chấp nhận tạm → ASM trong dải, dẫn trong UC bôi đỏ như `GD-xxxx` / để mở); MP presales bỏ (chặn G2); mâu thuẫn
   nguồn (chặn gate của đợt). Trả lời ghi `0-inputs/answers-<YYYY-MM-DD>.md`; gửi lại agent áp vào; chạy lại cổng máy.

8. **Commit** mỗi đợt theo bảng, gồm file của đợt và các file gộp. `--ngu` thêm bảng "Đã chọn tạm" vào báo cáo.

9. **Gate:** sau đợt 1 `ba-gate G1 CN-xx`; sau đợt 3 `ba-gate G2 CN-xx` (thêm `--ngu` nếu có). Đợt 2 chỉ chạy khi G1
   ĐẠT. KHÔNG ĐẠT sau 2 vòng sửa → dừng, chuyển BA danh sách lỗi. Chưa có skill ba-gate → dừng sau đợt, báo BA.

`--lop <đợt>`: làm bước 1, giao lại đúng đợt đó (bước 3–9); gate chứa đợt và gate sau chạy lại theo thứ tự.

## Kiểm tra
- Checklist của đợt không còn dòng mức Chặn chưa đạt; `check-all --chuc-nang CN-xx` không LỖI; đợt 2 build đạt.
- Mọi ID mới trong dải của CN, đã có dòng trace.csv; không còn mã giữ chỗ.

## Không được làm
- Không tạo nghiệp vụ mới (trường, kiểm tra, trạng thái, quyền, UC) ngoài business layer đã qua G0; không thêm UC
  ngoài module.
- Không sửa lớp 1–6, `0-inputs/` (trừ `answers-*.md`), file của CN khác, file tầng dự án ngoài thêm dòng.
- Không tự điền con số; không chọn hộ khi nguồn mâu thuẫn; agent không tự tạo `GD-xxxx`, ASM.
- Không giao hai agent cùng sửa một file; không chạy đợt sau khi đợt trước chưa commit hoặc gate trước chưa ĐẠT.
- Không commit lên main, không push, không mở PR (`/ba-pr CN-xx` sau G4). Không commit `node_modules/`, `dist/`.
- Không sửa prototype, đặc tả màn để né lỗi của UC; không chạy mã nguồn presales.

## Báo lại BA
Sau mỗi đợt một dòng: đợt, số file (UC / trang, SCR), số luồng đã bấm thử và kết quả, build, số ❓ và Q/ASM/PH mới
(theo "Chặn gate"), review độc lập, cổng máy, commit, gate. Cuối lệnh: nhánh và commit, MP giữ / sửa / bỏ / mới, câu
hỏi còn chờ, `[CẦN XÁC NHẬN]` còn lại, điểm dừng và lý do. Gợi ý: `--tiep` sau khi BA trả lời; xong G2 thì sang bước
sau của CN.
