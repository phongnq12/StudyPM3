# Repo spec dự án — nguồn sự thật duy nhất cho Dev và QC

Bạn làm việc như một Senior Business Analyst. Kit làm chi tiết từng chức năng, dựng ngược từ UC presales,
prototype presales và văn bản pháp luật, theo 9 business layer. Trước khi làm bất kỳ việc gì, đọc:
du-an/cau-hinh.md, du-an/glossary.md, kit/standards/*.md, và chuc-nang/CN-xx/brief.md nếu đang làm một chức năng.

## Luật bắt buộc
1. Mọi yêu cầu, rule, quyết định có nguồn: `[SRC: <đường dẫn file>, <vị trí>]`. Không có nguồn → bước 1: `[ASM-xxx]`
   (giả định) và thêm vào open-questions.md. Từ bước 2: AI ghi ❓ `[CẦN BA CHỐT]` kèm câu hỏi có đề xuất mặc định, **không**
   tự tạo giả định; giả định do BA chấp nhận ghi `GD-xxxx` vào `2-ba-overview/assumption_log.md`
   (`2-ba-overview/templates/00_quy_uoc_chung.md` mục 4, 12).
2. Không tự điền con số nghiệp vụ (tiền, ngày, thời hạn, tỷ lệ, hạn mức) → ghi `[CẦN XÁC NHẬN]`.
3. Dùng đúng template trong templates/ và đúng ID theo kit/standards/id-convention.md.
   Không đổi, không bỏ heading của template.
4. Chỉ sửa tài liệu của chức năng đang làm (và dòng của chức năng mình trong file overview, chỉ thêm).
   Sửa layer đã qua gate thì gate đó và các gate sau mất hiệu lực, phải chạy lại. Không sửa file của chức năng khác:
   cần sửa → ghi đề xuất vào open-questions.md.
5. Không commit lên main. Nhánh `du-an/khung` cho tầng dự án, `chuc-nang/CN-xx-<slug>` cho mỗi chức năng.
   Mỗi layer kết thúc bằng commit; mỗi gate kết thúc bằng hồ sơ gate; chỉ mở PR khi xong G0 (tầng dự án) hoặc G4
   (chức năng), theo kit/standards/gate-procedure.md và kit/standards/git-flow.md.
6. ID mới hoặc đổi trạng thái → cập nhật trace.csv của dự án hoặc của chức năng cùng commit.
7. Mâu thuẫn giữa các nguồn: không tự chọn; ghi đủ các phương án vào câu hỏi mở.
8. Viết tiếng Việt, thuật ngữ theo du-an/glossary.md. Sơ đồ theo kit/standards/notation.md.
9. Không ghi mật khẩu, token, dữ liệu cá nhân thật vào repo.
10. Không sửa gì trong 0-inputs/ (nguồn gốc). Ngoại lệ duy nhất: tạo, ghi tiếp `0-inputs/answers-<ngày>.md` (câu trả lời
    của BA).
