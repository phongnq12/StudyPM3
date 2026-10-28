# Gx — <du-an / CN-xx> <tên chức năng>

| Gate | Tầng | Kết luận | Commit đã kiểm | Ngày | Vòng sửa | Lỗi Chặn còn |
| --- | --- | --- | --- | --- | --- | --- |
| Gx | du-an / CN-xx | ĐẠT / KHÔNG ĐẠT | <7 ký tự đầu mã commit> | YYYY-MM-DD | 0 / 1 / 2 | 0 |

Hồ sơ do skill ba-gate ghi, một file mỗi gate: `du-an/G0.md`, `chuc-nang/CN-xx/G1.md` … `G4.md`. Chạy lại gate thì
ghi đè (lần chạy trước còn trong lịch sử git). `kit/tools/ba-verify/gate-check.mjs` đọc bảng trên: **giữ đúng tên cột**.
- Kết luận: chỉ `ĐẠT` hoặc `KHÔNG ĐẠT`. Không có "đạt có điều kiện".
- Commit đã kiểm: commit mà cổng máy và reviewer của lần chạy cuối đã đọc. Sửa file trong phạm vi gate sau commit này
  → gate mất hiệu lực (`gate-check.mjs`).

**Căn cứ chuẩn:** ISO/IEC 20246:2017 (review sản phẩm công việc: lập kế hoạch, tiêu chí vào và ra, review riêng từng người, ghi nhận và phân loại vấn đề, sửa, báo cáo kết quả); IEEE 1028-2008. Kit cố ý không dùng kết luận trung gian "chấp nhận kèm sửa" mà IEEE 1028 cho phép: còn lỗi Chặn là KHÔNG ĐẠT.

## 1. Phạm vi và commit đã kiểm
| Mục | Giá trị |
| --- | --- |
| Bước trong phạm vi | <ví dụ: 3 (brief), 4 (BRD), 5 (quy trình, mapping)> |
| Nhánh | <du-an/khung / chuc-nang/CN-xx-slug> |
| Checklist | `.claude/skills/ba-gate/checklist-Gx.md`, `checklist-chung.md`, checklist bước của gate (skill ba-gate, "Đọc trước") |
| Tiêu chí vào | Gate trước còn hiệu lực: <có / G0 không cần>; cây làm việc sạch tại commit đã kiểm: <có>; cổng máy đã chạy: <mục 2> |
| Số file trong phạm vi | <n> (danh sách: `node kit/tools/ba-verify/gate-check.mjs --pham-vi Gx [--chuc-nang CN-xx]`) |

## 2. Kết quả cổng máy
| Lần | Commit | LỖI | CẢNH BÁO | Xử lý |
| --- | --- | --- | --- | --- |
| 1 | <commit> | <n> | <n> | <đạt / giao agent sửa, chạy lại> |

Lỗi máy còn lại (chép nguyên văn dòng LỖI của `gate-check.mjs --may`): <không có / danh sách>.

## 3. Báo cáo reviewer
| Chế độ | Vòng | Phiên (agent) | Chặn | Nên sửa | Gợi ý | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| chất lượng | 1 | quality-reviewer | | | | |
| nhất quán | 1 | quality-reviewer | | | | |
| pháp lý | 1 | quality-reviewer | | | | |
| presales | 1 | quality-reviewer | | | | |
| sẵn sàng bàn giao (chỉ G4) | 1 | quality-reviewer | | | | |

Số lỗi là số sau khi gộp (mục 4). Báo cáo đầy đủ của từng phiên không chép vào đây; lỗi đã gộp ở mục 4 là bản ghi.

## 4. Lỗi theo mức và xử lý
| # | Mức | Checklist | Vị trí | Lỗi | Reviewer | Xử lý |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Chặn / Nên sửa / Gợi ý | Gx-<số>, chung-<số> hoặc mã checklist bước (`uc-<số>`, `rules-<số>`…) | <file:dòng> | <một câu, có bằng chứng> | <chế độ; nhiều chế độ cách bằng `;`> | Đã sửa (vòng n) / Không sửa — <lý do>, reviewer vòng sau chấp nhận / Q-xxx / Còn |

- Gộp: cùng vị trí, cùng lỗi → một dòng, lấy **mức cao hơn**, ghi đủ các chế độ đã nêu.
- Lỗi không có vị trí hoặc bằng chứng không được tính "Chặn" (ghi "Nên sửa", kèm "thiếu bằng chứng").
- "Còn" ở mức Chặn → gate KHÔNG ĐẠT.

## 5. Vòng sửa
| Vòng | Agent sửa (phiên mới) | Số lỗi giao | Đã sửa | Không sửa | Cần BA | Commit sau sửa |
| --- | --- | --- | --- | --- | --- | --- |

Tối đa 2 vòng. Hết 2 vòng còn lỗi Chặn → KHÔNG ĐẠT, dừng, chuyển BA (mục 6).

## 6. Câu hỏi cho BA
| Q | Câu hỏi | Chặn gate | Vì sao agent không tự quyết |
| --- | --- | --- | --- |

Q ghi vào open-questions của tầng (`du-an/` hoặc `chuc-nang/CN-xx/`). Q còn `mở` chặn gate này → KHÔNG ĐẠT; trả lời
xong chạy lại gate (`/ba-overview --tiep`, `/ba-chuc-nang CN-xx --tiep`).

## 7. Kết luận
**<ĐẠT / KHÔNG ĐẠT>** — <một câu: còn bao nhiêu lỗi Chặn, Q chặn nào, hoặc "không còn lỗi Chặn, không còn Q chặn">.

| # | Kiểm (checklist-Gx) | Mức | Kết quả | Bằng chứng, lỗi liên quan |
| --- | --- | --- | --- | --- |
| 1 | <chép từ checklist> | Chặn | Đạt / Không đạt / Không áp dụng — <lý do> | <máy: mục 2 / lỗi #n> |

Mọi dòng của checklist-Gx có một dòng ở bảng này; dòng Chặn chưa đạt của checklist-chung, checklist bước thêm dòng
với mã của nó. "Không áp dụng" phải có lý do (ví dụ: chức năng không có thực thể có
vòng đời).

## 8. Chi phí
| Phiên | Số phiên | Token (nếu biết) | Thời gian |
| --- | --- | --- | --- |
| Reviewer | | | |
| Sửa | | | |
| Tổng | | | |

## 9. Nhóm C — kiểm chứng bằng sản xuất thử (chỉ G4)
Kết quả `node kit/tools/ba-verify/kiem-chung.mjs --chuc-nang CN-xx` trên JSON ở `chuc-nang/CN-xx/kiem-chung/`
(kit/templates/ho-so/kiem-chung.schema.md). Agent không tự kết luận; cột Kết quả chép từ script. G0–G3: ghi `n/a`.

| Tiêu chí | Tệp | Số liệu | Kết quả | Vi phạm (mã, chuyển thành lỗi ở mục 4) |
| --- | --- | --- | --- | --- |
| C1 Test sinh được | `C1-qc.json` | đã rà <n>/<m> (REQ + AC); không sinh được <k> | ĐẠT / KHÔNG ĐẠT | |
| C2 Không phải đoán | `C2-dev.json` | đã rà <n>/<m> UC; giả định nghiệp vụ <k> | ĐẠT / KHÔNG ĐẠT | |
| C3 Hai bên hiểu giống nhau | `C3-dien-giai-1.json`, `-2.json`, `C3-so-sanh.json` | nhánh <n>/<m> mỗi bản; khác biệt <k> | ĐẠT / KHÔNG ĐẠT | |
| C4 Đảo ngược | `C4-dao-nguoc.json` | ô lệch: bước ↔ UC <a>, quyền <b>, TR ↔ UC <c> | ĐẠT / KHÔNG ĐẠT | |

Lần chạy: commit `<mã>`, số phiên nhóm C, chạy lại sau sửa (có / không).
