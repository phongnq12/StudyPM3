# Quy trình chung: lệnh điều phối, bước, gate

Thiết kế đầy đủ: thiet-ke/thiet-ke-kit.md mục 4–7.

## 1. Hai tầng, bốn lệnh chính
| Lệnh | Tầng | Chạy | Nhánh |
| --- | --- | --- | --- |
| `/ba-init` | Dự án | Bước 1 | `du-an/khung` (lệnh tạo nhánh) |
| `/ba-overview` | Dự án | Bước 2, rồi G0 | `du-an/khung` |
| `/ba-chuc-nang CN-xx` | Chức năng | Bước 3 → G4 | `chuc-nang/CN-xx-<slug>` (lệnh tạo nhánh) |
| `/ba-pr du-an \| CN-xx` | Cả hai | Cập nhật từ main, cổng máy toàn repo, mở PR | nhánh hiện tại |

Phiên chính điều phối: kiểm điều kiện, giao agent, chạy cổng máy, hỏi BA, commit. Phiên chính không tự viết tài liệu,
trừ brief ở bước 3 và các file gộp đề xuất của nhiều agent (glossary, open-questions — gồm cả phát hiện).

## 2. Một bước
1. **Kiểm điều kiện** của bước (SKILL.md của lệnh). Thiếu → dừng, báo BA thiếu gì.
2. **Giao agent** (công cụ Agent). Prompt giao việc có: đầu vào, TEMPLATE, PHƯƠNG PHÁP (method.md), CHECKLIST, KIỂM TRA
   RIÊNG, thư mục được ghi, dải ID (tầng chức năng). Agent không commit.
3. **Cổng máy** `node tools/ba-verify/check-all.mjs` (kèm tham số của bước). Còn LỖI → gửi nguyên văn cho agent sửa,
   chạy lại, tối đa 2 lần.
4. **Hỏi BA** khi cần (skill ba-questioning, mức chặn ở mục 5). Câu trả lời ghi `inputs/answers-<YYYY-MM-DD>.md`;
   gửi lại agent áp vào tài liệu.
5. **Commit** `spec(<tầng>/<layer>): …` theo standards/git-flow.md. Không push, không mở PR.

Song song: hai agent không sửa cùng một file; tối đa 5 agent cùng lúc. Khi đó agent không ghi file dùng chung
(glossary, open-questions — gồm cả phát hiện, trace.csv) mà đề xuất trong báo cáo, dùng mã giữ chỗ; phiên chính gộp, cấp
số. Mỗi lần gọi agent ghi một dòng vào `reports/dieu-phoi/<nhánh>.md` (tên nhánh, `/` thay bằng `-`, ví dụ
`du-an-khung.md`): agent, việc, token, thời gian, số vòng sửa.

## 3. Gate
```
layer cuối của gate xong
  → cổng máy                                            còn LỖI → agent viết sửa, chạy lại
  → reviewer độc lập song song (quality-reviewer, mỗi phiên một chế độ)
      chất lượng · nhất quán · pháp lý · presales · (G4) sẵn sàng bàn giao
  → kết luận theo tiêu chí cứng: còn lỗi Chặn = KHÔNG ĐẠT
      Đạt        → commit hồ sơ gate, đặt trạng thái dat-Gx, mở khóa bước sau
      Không đạt  → agent sửa (phiên mới) → review lại, tối đa 2 vòng
                   hết 2 vòng → dừng, chuyển BA danh sách lỗi còn lại
```
| Gate | Sau bước | Hồ sơ | Checklist |
| --- | --- | --- | --- |
| G0 | 1, 2 | `du-an/G0.md` | `.claude/skills/ba-gate/checklist-G0.md` |
| G1 | 3, 4, 5 | `chuc-nang/CN-xx/G1.md` | `checklist-G1.md` |
| G2 | 6, 7, 8, 9 | `chuc-nang/CN-xx/G2.md` | `checklist-G2.md` |
| G3 | 10, 11 | `chuc-nang/CN-xx/G3.md` | `checklist-G3.md` |
| G4 | 12 | `chuc-nang/CN-xx/G4.md` | `checklist-G4.md` |

- Người viết, người review, người sửa là ba phiên khác nhau.
- Không có "đạt có điều kiện".
- **Khóa:** lệnh của bước sau đọc hồ sơ gate trước; chưa có hoặc không Đạt → dừng.
- **Mất hiệu lực:** có commit sửa layer đã qua gate → gate đó và các gate sau mất hiệu lực, phải chạy lại.
- Người (BA lead, Dev lead, QC lead) không đọc từng gate; đọc một lần ở PR.

[CHỜ CHỐT — thiết kế mục 12, việc 1–3: template hồ sơ gate chi tiết; cách `gate-check` phát hiện mất hiệu lực;
cách gộp kết quả reviewer.]

## 4. Hỏi BA: chỉ khi agent không được tự quyết
Không có vòng phản biện mặc định. Không hỏi lại điều đã có dòng `đã quyết` trong open-questions.

## 5. Mức chặn
| Loại vướng | Chặn ở |
| --- | --- |
| Mâu thuẫn nguồn | Gate của bước đó |
| Quyết định Bỏ UC presales | G2 |
| Con số thiếu nguồn (`[CẦN XÁC NHẬN]`, tham số) | Chỉ G4 |
| Câu hỏi phạm vi (phát sinh, mở rộng, bước thủ công có lên hệ thống không) | Không chặn; cờ đi tới PR, SRS |
| Hết vòng sửa ở gate | Dừng tại gate |
| UC presales chưa tìm thấy căn cứ pháp lý (uc-phap-ly.md mục 2) | G1 |

Mỗi Q ghi gate nó chặn ở cột "Chặn gate" của open-questions.md. `--ngu`: câu không chặn thì chọn tạm và ghi sổ
(ba-questioning, sleep-mode.md); câu chặn thì dừng.

## 6. Ca thử
Biến môi trường `BA_EVAL=1` (đang chạy ca thử skill): làm như thường, dừng trước commit.
