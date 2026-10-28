# Quy tắc vẽ BPMN 2.0

Mỗi quy tắc có ví dụ đúng và sai. Ví dụ dùng nghiệp vụ nghỉ phép hư cấu (như templates/2-business-process/examples/).
Mã [Bxx] là mã kiểm tra tự động của `scripts/bpmn_lint.py`.

## 0. Cấp 0 — luồng chính
- Bắt buộc khi dự án có hơn khoảng 8 PROC. Một trang, đi theo vòng đời đối tượng lõi của phần mềm (đối tượng nghiệp vụ mà
  khách gọi là "việc chính": đơn nghỉ phép, hồ sơ, yêu cầu). Mỗi bước là một PROC thu gọn, ghi mã PROC.
- Điều kiện tiên quyết dùng chung (lịch nghỉ lễ, danh mục loại phép) vẽ bằng gateway "Đã có …?" ở đầu luồng, không vẽ
  chuỗi riêng.
- Việc chạy theo kỳ (chốt số dư cuối năm, báo cáo) nối vào luồng bằng sự kiện timer trung gian ("Đến kỳ cuối năm") trên nhánh song
  song, không chặn các nhánh khác.
- Không vẽ chuỗi phụ (tài khoản, đồng bộ, báo cáo thống kê); ghi trong chú giải là xem cấp 1.
- Đúng: "Nhân viên cần nghỉ → ◇ Đã có lịch nghỉ lễ năm? (Chưa → ⊞ PROC-03 Ban hành lịch nghỉ lễ) → ⊞ PROC-01 Gửi và
  duyệt đơn (nhấn mạnh) → ⊞ PROC-02 Cập nhật số dư phép → ✚ (⊞ PROC-05 Tổng hợp chấm công | ◎ Đến kỳ cuối năm →
  ⊞ PROC-04 Chốt số dư phép) → ✚ → Kết thúc."
- Lint cấp 0 như cấp 1: `bpmn_lint.py <file> --cap 0` (cùng luật cấp 1).
- Sai: "Bản đồ 25 ô xếp theo nhóm nghiệp vụ, không thấy đối tượng lõi đi qua những bước nào."

## 1. Cấp 1 — bản đồ quy trình tổng
- Một pool cho cả dự án, chia lane theo vai trò chủ trì (cấp đơn vị hoặc nhóm vai trò). Mỗi PROC là một sub-process
  thu gọn đặt ở lane của vai trò chủ trì; vai trò đầy đủ nằm ở bảng danh mục PROC.
- Sequence flow nghĩa là "PROC trước xong thì PROC sau chạy, cùng một đối tượng" (cùng một đơn nghỉ phép, cùng một hồ sơ).
  Chỉ dùng sequence flow giữa hai PROC khi PROC sau thật sự được kích hoạt bởi PROC trước, nhãn là đối tượng chuyển giao.
- PROC sau chỉ đọc dữ liệu PROC trước tạo ra (lịch nghỉ lễ đã ban hành, tài khoản, đơn đã duyệt dùng để tổng hợp kỳ)
  là quan hệ dữ liệu: vẽ kho dữ liệu (data store), PROC trước ghi vào (data association tới kho), PROC sau đọc ra.
  Mỗi chuỗi PROC có vòng đời riêng (lịch nghỉ lễ năm, đơn nghỉ phép, kỳ chấm công) có sự kiện bắt đầu và kết thúc riêng.
- Đúng: "S 'Cần lịch nghỉ lễ năm mới' → ⊞ PROC-03 Ban hành lịch nghỉ lễ → E 'Lịch nghỉ lễ đã ban hành'; PROC-03 ⋯▷ kho
  'Lịch nghỉ lễ' ⋯▷ ⊞ PROC-01 Gửi và duyệt đơn nghỉ phép."
- Sai: "⊞ PROC-03 ─▶ ⊞ PROC-01" (đọc theo BPMN: mỗi lần ban hành lịch nghỉ lễ thì chạy một lần gửi đơn; PROC có nhiều
  sequence flow vào từ các chuỗi khác nhau nghĩa là bị kích hoạt nhiều lần).
- Hệ thống, đơn vị ngoài là pool thu gọn, nối bằng message flow. PROC được khởi động bởi bên ngoài dùng sự kiện bắt đầu
  loại message; PROC khởi động theo kỳ dùng timer.
- Mỗi chuỗi có sự kiện bắt đầu và kết thúc [B01–B03]. PROC dùng chung cho mọi PROC khác (đăng nhập, danh mục) ghi vào
  kho dữ liệu kèm chú thích, không vẽ mũi tên tới từng PROC.
- Tách nhiều trang khi quá khoảng 30 phần tử; chỗ cắt dùng cặp link event ném / bắt cùng chữ cái [B09].
- Đúng: "Pool 'Hệ thống nghỉ phép' → lane 'Nhân viên', 'Phòng Nhân sự'; ⊞ PROC-01 Xin nghỉ phép ─(Đơn nghỉ phép Đã
  duyệt)▶ ⊞ PROC-02 Cập nhật Số dư phép; ô xám 'Phần mềm chấm công' ◁- - PROC-02."
- Sai: "Ô chữ nhật PROC-01 → ô PROC-02, hệ thống ngoài cũng là ô chữ nhật, không có bắt đầu, kết thúc" (bản đồ ô và
  mũi tên, không phải BPMN).

## 2. Cấp 2 — một quy trình PROC-xx
- Pool là PROC-xx; lane là vai trò theo 2-ba-overview/5-actor-usecase/actors.md và glossary. Việc hệ thống tự làm đặt ở lane
  "Hệ thống <tên phần mềm>" với service task.
- Mỗi dòng bảng bước là đúng một task có ID PROC-xx.yy [B11]; tên task là bản rút gọn của cột Hành động, giữ động từ và
  danh từ glossary (lint chỉ so ID). Gateway, sự kiện không phải dòng bảng bước.
- Sự kiện bắt đầu là trigger của PROC (khớp danh mục ở process-overview.md); sự kiện kết thúc là kết quả của PROC.
- PROC khác và hệ thống ngoài là pool thu gọn. Mỗi dòng mục 6 "Chuyển giao" là một message flow giữa đúng bước và pool
  PROC kia.
- Đúng: "S1 'Nhân viên cần nghỉ' → PROC-01.01 (user) Lập Đơn nghỉ phép → … → E1 'Đơn nghỉ phép Đã duyệt'; PROC-01.05
  - -▷ ô xám 'PROC-02 Cập nhật Số dư phép' nhãn 'Đơn nghỉ phép Đã duyệt'."
- Sai: "Task 'Gửi sang quy trình cập nhật số dư' nối sequence flow tới task của PROC-02 vẽ trong cùng pool."

## 3. Chọn loại task
- Hỏi hai câu: ai làm (người hay hệ thống), làm ở đâu (trên hệ thống hay ngoài). Người + trên hệ thống → user; người +
  ngoài hệ thống → manual; hệ thống tự làm → service; gửi / nhận với pool khác → send / receive; áp bảng quy tắc nghiệp
  vụ để ra kết quả → businessRule.
- Đúng: "PROC-02.03 (manual) In và ký Quyết định nghỉ dài ngày; PROC-02.04 (user) Tải bản quét Quyết định lên hệ thống."
- Sai: "PROC-02.03 (user) In, ký và tải Quyết định" (gộp việc ngoài và trong hệ thống, sai loại task).

## 4. Đặt tên
- Task: động từ đứng đầu + danh từ nghiệp vụ theo glossary. Không đặt theo màn hình, nút bấm.
- Sự kiện: trạng thái hoặc sự việc đã xảy ra ("Đơn nghỉ phép Đã duyệt", "Đến kỳ báo cáo").
- Gateway XOR / OR tách nhánh: câu hỏi kết thúc bằng "?"; mỗi nhánh ra có nhãn là câu trả lời [B06].
- Mỗi kết quả khác nhau một sự kiện kết thúc, tên khác nhau. Cùng một kết quả thì gộp về một sự kiện kết thúc.
- Cấp 1, cấp 0: mỗi chuỗi một sự kiện kết thúc, tên ghi đủ các kết quả của PROC cuối ("Đơn nghỉ phép Đã duyệt hoặc
  Bị từ chối", đúng cột Kết quả ở danh mục PROC); cấp 2 tách thành từng sự kiện kết thúc theo kết quả.
- Đúng: "G2 'Trưởng phòng đồng ý?' → 'Có' / 'Không'; E1 'Đơn nghỉ phép Đã duyệt', E2 'Đơn nghỉ phép Bị từ chối'."
- Sai: "Gateway 'Kiểm tra' với hai nhánh không nhãn; kết thúc 'Kết thúc', 'Kết thúc 2'."

## 5. Gateway
- Quyết định là việc của một task (duyệt, kiểm tra); gateway chỉ hỏi kết quả của task đó.
- Không để task có nhiều nhánh ra có điều kiện; rẽ nhánh phải qua gateway [B12].
- AND tách thì có AND gộp trước bước cần chờ đủ. Không để một gateway vừa gộp vừa tách [B07]. Gateway một vào một ra là
  thừa.
- Chờ một trong nhiều sự kiện (Trưởng phòng duyệt hoặc quá hạn duyệt) dùng gateway theo sự kiện, sau nó là các sự kiện bắt.
- Không nối message flow vào gateway [B13].
- Đúng: "PROC-01.03 (user) Duyệt Đơn nghỉ phép → G2 'Đồng ý?'."
- Sai: "G2 'Trưởng phòng duyệt đơn' (gateway làm việc của task) hoặc PROC-01.03 có hai mũi tên ra 'Đồng ý', 'Từ chối'."

## 6. Ngoại lệ
- Ngoại lệ xảy ra trong lúc một task đang chạy (quá hạn, hệ thống ngoài không phản hồi, nhận yêu cầu hủy) vẽ bằng sự
  kiện biên gắn vào task: ngắt (nét liền) khi bỏ việc đang làm; không ngắt (nét đứt) khi chỉ nhắc, báo.
- Ngoại lệ là kết quả kiểm tra (dữ liệu sai) vẽ bằng nhánh gateway sau task kiểm tra.
- Mỗi dòng bảng "Nhánh ngoại lệ" có trên sơ đồ, quay về đúng bước hoặc kết thúc riêng.
- Đúng: "Sự kiện biên timer không ngắt 'Quá hạn duyệt' trên PROC-01.03 → PROC-01.04 (send) Nhắc Trưởng phòng."
- Sai: "Bảng ngoại lệ có 'quá hạn duyệt' nhưng sơ đồ chỉ có đường thành công."

## 7. Luồng giữa pool
- Sequence flow chỉ nằm trong một pool [B04]; giữa hai pool chỉ dùng message flow [B05].
- Message flow nối vào đúng task gửi / nhận hoặc sự kiện message, nhãn là tên thông điệp, tài liệu.
- Đúng: "PROC-01.05 - -▷ ô xám 'Phần mềm chấm công' nhãn 'ngày nghỉ đã duyệt'."
- Sai: "Mũi tên liền từ PROC-01.05 sang ô 'Phần mềm chấm công'."

## 8. Bố cục
- Trái sang phải. Luồng chính trên một hàng thẳng; nhánh ngoại lệ, nhánh từ chối ở hàng dưới.
- Lane xếp theo thứ tự người bắt đầu quy trình ở trên; lane hệ thống ở dưới cùng.
- Tránh đường cắt qua ô; không tránh được thì ghi trong báo cáo. Hai luồng cắt nhau (không qua ô) chấp nhận được khi
  giữ nhánh từ chối ở hàng dưới bắt buộc phải cắt.
- Luồng ra của gateway không đi từ cạnh trên (nhãn câu hỏi nằm ở đó); luồng ra của sự kiện biên không đi thẳng xuống
  (nhãn nằm ngay dưới). Hai luồng vào cùng một cạnh thì tách điểm vào (`"vao": [0.25, 1]`, `[0.75, 1]`).
- Mỗi pool không quá khoảng 30 phần tử luồng [B15]; quá thì gom thành sub-process và vẽ cấp 3.
- Tự xem ảnh PNG trước khi giao; chữ đè nhau là chưa xong.

## 9. Khớp với tài liệu
- Cấp 2 ↔ bảng bước: cùng tập ID [B11]. Cấp 2 ↔ mục 6 chuyển giao: mỗi dòng một message flow. Cấp 2 ↔ cấp 1: tên
  PROC, trigger (sự kiện bắt đầu), kết quả (sự kiện kết thúc) giống dòng danh mục ở process-overview.md.
- Danh từ trên sơ đồ đúng glossary; cùng một thứ cùng một tên ở mọi sơ đồ.
- Mọi bước, nhánh có nguồn trong bảng bước, BRD hoặc ASM; sơ đồ không thêm điều tài liệu không có.

## Lịch sử quy tắc
- 2026-10-26: tên file cấp 0 thống nhất `process-overview-cap-0.drawio.svg` (trước ghi `process-overview-0`, trùng
  cách đánh số trang cấp 1); thêm tên tiếng Anh của gateway theo BPMN 2.0.2. Bằng chứng: rà soát kit đối chiếu chuẩn.
- 2026-10-21: thêm mục 0 cấp 0 luồng chính (BA lead cần một trang luồng chính của đối tượng lõi để trình bày với khách;
  làm thử ở một dự án). Ví dụ viết lại bằng nghiệp vụ nghỉ phép hư cấu; B11 ghi rõ lint chỉ so ID.
- 2026-10-20: bản đầu (0.1.0). Lý do: BA lead yêu cầu mọi quy trình vẽ BPMN 2.0 chuẩn, kể cả bản đồ tổng, thay cho
  bản đồ "ô và mũi tên" Mermaid; bằng chứng ở dự án làm thử (bản Mermaid bị BA từ chối; bản vẽ tay đầu tiên bị lint
  bắt 20 lỗi Chặn merge: PROC không có bắt đầu / kết thúc, ô không nằm trong pool).
