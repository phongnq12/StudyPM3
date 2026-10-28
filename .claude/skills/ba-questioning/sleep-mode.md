# Chế độ ngủ — chạy thông khi BA vắng

Bật bằng `--ngu` ở `/ba-init`, `/ba-overview`, `/ba-chuc-nang`, hoặc khi BA nói «chế độ ngủ», «chạy thông»,
«tôi đi vắng, cứ làm tiếp». Chế độ ngủ vẫn hỏi trong chat, chờ một lúc, không có trả lời thì **chọn tạm** một phương
án để chạy tiếp, rồi trình BA kiểm khi xong.

**Câu chặn gate** (kit/standards/gate-procedure.md mục 5) không được chọn tạm để qua gate: lệnh làm hết phần không phụ
thuộc rồi dừng tại gate, chờ BA.

Chế độ ngủ không nới luật nào của CLAUDE.md. "Chọn tạm" là chọn hướng để viết tiếp, không phải đóng câu hỏi:
mọi lựa chọn tạm vẫn là `[ASM-xxx]` có Q đi kèm ghi đủ các phương án (luật 1, 7).

## 1. Ngay lúc bật — chốt luật chọn tạm (bắt buộc, trước khi chạy)

Trình BA một lần, BA chọn, sắp lại hoặc thêm:

| # | Thứ tự ưu tiên chọn tạm (mặc định) |
| --- | --- |
| 1 | Văn bản pháp lý và mẫu biểu kèm theo nói gì thì theo đó |
| 2 | Tài liệu khách đã viết trong `0-inputs/`; câu hỏi `đã quyết` trong open-questions |
| 3 | Phần tương tự đã `approved` trong repo — làm giống |
| 4 | Phương án đơn giản nhất: ít màn, ít bước, ít trạng thái nhất |
| 5 | Phương án ít phá nhất: giữ cái đang có, không xóa, không đổi tên |

Cùng lúc chốt:
- **Không bao giờ chọn tạm** (luôn để mở, làm việc khác trong lúc chờ): con số nghiệp vụ (tiền, ngày, tỷ lệ, hạn mức —
  luôn `[CẦN XÁC NHẬN]`, luật 2); xóa hoặc đổi tên đối tượng đã `approved`; đổi luồng nghiệp vụ đã duyệt; mở rộng phạm vi
  ngoài brief; merge PR.
- Thời gian chờ mỗi câu (mặc định 5 phút).

Ghi luật đã chốt vào đầu `du-an/reports/sleep/<nhánh>.md` (tên nhánh, `/` thay bằng `-`). BA không trả lời bước này trong thời gian chờ → dùng bảng mặc
định, ghi «dùng mặc định».

## 2. Trong lúc chạy

1. Gặp câu hỏi: gửi trong chat theo chế độ xác nhận, kèm các phương án, hậu quả, và phương án sẽ chọn tạm nếu không có
   trả lời. Ghi vào `du-an/reports/sleep/<nhánh>.md`.
2. Hẹn giờ bằng lệnh chờ chạy nền (Bash `run_in_background`, `sleep 300`); được đánh thức khi hết giờ. Trong lúc chờ
   làm tiếp phần không phụ thuộc câu hỏi.
3. Có trả lời → làm theo, ghi «BA trả lời», lưu vào `answers-<ngày>.md` như vòng hỏi thường.
4. Hết giờ không có trả lời → chọn tạm theo thứ tự ưu tiên, ghi «CHỌN TẠM theo ưu tiên #n». Trong tài liệu: `[ASM-xxx]`
   ghi phương án đã chọn; Q trong open-questions.md ghi đủ mọi phương án và lý do chọn tạm.
5. Câu thuộc danh sách «không bao giờ chọn tạm» → để mở, làm phần khác, đưa vào báo cáo cuối.
6. Agent con không hỏi người được: câu hỏi của agent con trả về phiên chính, phiên chính áp đúng bước 1–5.
7. Giữ mọi luật khác: trần agent, cổng máy, review độc lập, không commit lên main.

## 3. Chạy xong — trình BA

Báo cáo cuối và mô tả PR có bảng **«Đã chọn tạm — cần BA kiểm»**:

| # | Câu hỏi | Đã chọn | Theo ưu tiên | ASM / Q | Nếu đổi thì sửa ở đâu, tốn gì |
| --- | --- | --- | --- | --- | --- |

kèm danh sách câu đang để mở. BA kiểm, yêu cầu sửa chỗ chưa hài lòng → sửa theo yêu cầu, cập nhật sổ, đóng Q tương ứng.
Trước G4, mọi `[CẦN XÁC NHẬN]` trong phạm vi chức năng phải được đóng: `node kit/tools/ba-verify/gate-check.mjs
--chuc-nang CN-xx --may G4` báo lỗi khi còn (G4 dòng 3).
