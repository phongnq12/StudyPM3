# Phương pháp lập danh mục đầu vào (bước 1)

Mục đích: biến bốn nguồn thô (UC presales, quy trình presales, prototype presales, văn bản pháp luật) thành bốn danh
mục có mã, cộng một ma trận UC presales × điều khoản, để mọi bước sau dẫn nguồn chính xác và máy đo được độ phủ.
Danh mục là **bản chép có cấu trúc**, không phải bản phân tích. Mọi đánh giá (UC thừa, thiếu, sai; màn thừa; quy trình
thiếu bước) để cho bước 2 trở đi. Hai ngoại lệ: ma trận UC × pháp lý (mục 6) là bảng **ghép** có căn cứ, không phải
đánh giá, để từ bước 1 đã biết mỗi UC dựa trên điều khoản nào; bản đồ quy trình (mục 7) là bản **dựng ngược** từ các
danh mục, để từ bước 1 đã biết UC presales nối thành quy trình nào và chỗ nối nào hở. Ví dụ dưới đây là nghiệp vụ nghỉ
phép hư cấu.

**Căn cứ chuẩn:** BABOK v3 chương 4 "Elicitation and Collaboration" (ghi nhận kết quả thu thập, không phân tích), mục 7.1 "Trace Requirements" (ma trận UC × pháp lý), mục 10.35 "Process Modelling" (bản đồ quy trình); ISO/IEC/IEEE 29148:2018 mục 5.2 (truy vết về nguồn).

## 1. Nguyên tắc chung
- **Chép nguyên văn.** Không sửa chính tả, không viết lại câu, không đổi viết tắt. Xuống dòng trong ô giữ bằng `<br>`.
- **Không đánh giá.** Không ghi "UC này trùng", "màn này thừa" vào cột nội dung. Điều bất thường → dòng phát hiện.
- **Mọi dòng có nguồn** đủ để mở lại đúng chỗ: tệp, sheet, dòng; tệp, trang, ô sơ đồ; tệp, điều, khoản; route hoặc
  tệp HTML, cách mở.
- **Không tự điền**: thiếu số hiệu, ngày hiệu lực, con số → `[CẦN XÁC NHẬN]` kèm câu hỏi.
- Đúng: "| `12` | Duyệt đơn nghỉ phép | Trưởng phòng | … | [SRC: 0-inputs/presales/uc/uc.xlsx, UC, dòng 14] |".
- Sai: "| `12` | Duyệt đơn nghỉ phép (trùng UC 15) | … |" — đánh giá lọt vào cột tên.

## 2. Danh mục UC presales (`uc-presales.md`) — việc A1 của business-analyst
1. **Tìm vị trí.** Đọc bản chữ `.ba-cache/ban-chu/<đường dẫn tệp gốc>.txt` (ví dụ `.ba-cache/ban-chu/0-inputs/presales/uc/uc.xlsx.txt`): mỗi dòng dạng `r<số dòng>: ô 1 | ô 2 | …`, ô chứa ký tự `|` ghi
   thành `\|`. Tìm sheet chứa danh sách UC, dòng tiêu đề cột, cột mã (thường "TT", "Mã", "STT"), cột tên, cột actor,
   cột mô tả. Ghi mục 0 "Vị trí trong nguồn": tệp, sheet, số dòng tiêu đề, số thứ tự cột mã và cột tên (đếm từ 1 theo
   ô trong dòng, ô trống ở giữa vẫn tính). Ô chứa `|` khi chép vào bảng markdown ghi thành `\|`.
2. **Phân biệt dòng UC và dòng nhóm.** Dòng UC có mã cùng dạng (cùng là số, hoặc cùng mẫu như `UC_PS_xx`) và có tên.
   Dòng nhóm (ví dụ "A | Phân hệ nghỉ phép", "I. Quản lý đơn") không phải UC: dùng làm giá trị cột "Phân hệ" cho các
   UC bên dưới cho tới dòng nhóm kế tiếp.
3. **Chép từng UC** đúng thứ tự trong tệp: mã gốc (đặt trong dấu `` ` ``), tên, actor, phân hệ, mô tả luồng (nếu có),
   nguồn dạng `[SRC: <tệp>, <sheet>, dòng <n>]`. Cột "Chức năng" để trống.
4. **Mức presales:** 1 nếu chỉ có danh sách, 2 nếu có mô tả luồng. Ghi ở bảng đầu file.
5. **Dòng lạ** → đề xuất phát hiện, vẫn chép:
   - Mã trùng: chép cả hai dòng; phát hiện loại `trùng lặp`.
   - Dòng có tên mà không có mã: chép với mã "—"; phát hiện.
   - Mô tả nhắc tới văn bản, biểu mẫu không có trong `0-inputs/` → câu hỏi.
6. Chạy `node kit/tools/ba-verify/dau-vao-check.mjs --chi uc`: mã và tên phải khớp nguyên văn tệp gốc theo số dòng; không
   còn dòng UC bị sót.

## 3. Danh mục pháp lý (`phap-ly.md`) — việc A2 của business-analyst
1. **Văn bản (mục 1).** Mỗi tệp trong `0-inputs/phap-ly/` (và văn bản trong `0-inputs/khac/` có tính quy định) một dòng:
   tên, số hiệu, cơ quan, ngày ban hành, ngày hiệu lực — **lấy từ chính tệp**. Không có trong tệp → `[CẦN XÁC NHẬN]`.
   Văn bản này bãi bỏ, sửa đổi văn bản khác (điều khoản thi hành ghi rõ) → cột "Hiệu lực" của văn bản bị bãi bỏ ghi
   "hết" kèm nguồn; câu hỏi nếu ngày hiệu lực chưa rõ. Cột "Áp dụng cho dự án" để BA xác nhận ở vòng hỏi.
2. **Chọn điều khoản (mục 2).** Chỉ lấy điều khoản chi phối nghiệp vụ mà phần mềm hỗ trợ: có chủ thể (ai), hành vi
   (làm gì), đối tượng (hồ sơ, biên bản…), thời hạn, thẩm quyền, điều kiện, biểu mẫu. Bỏ: phạm vi điều chỉnh chung,
   giải thích từ ngữ (trừ khi định nghĩa thuật ngữ dùng trong UC — khi đó đề xuất vào glossary), điều khoản thi hành,
   trách nhiệm tổ chức không liên quan đối tượng phần mềm quản lý.
3. **Tách theo đơn vị nhỏ nhất có một ý:** điều → khoản → điểm. Mã theo kit/standards/id-convention.md mục "Mã điều khoản
   pháp luật" (`TT79-2026/Đ12.K2`; văn bản không số hiệu `VB-<tên-ngắn>/<mục>`).
4. **Phân loại** (một loại chính):

   | Loại | Dấu hiệu | Ví dụ |
   | --- | --- | --- |
   | thủ tục | trình tự các bước, ai làm trước, ai làm sau | "Trưởng phòng xem xét đơn, sau đó chuyển phòng nhân sự" |
   | thời hạn | "trong thời hạn", "chậm nhất", "trước … ngày" | "duyệt trong thời hạn 03 ngày làm việc" |
   | thẩm quyền | "có thẩm quyền", "do … quyết định", "giao …" | "Giám đốc duyệt nghỉ trên 05 ngày" |
   | biểu mẫu | "theo mẫu số", phụ lục mẫu | "Đơn theo Mẫu số 01" |
   | điều kiện | "khi", "nếu", "được … khi" | "chỉ được nghỉ phép năm khi đã làm đủ 12 tháng" |
   | đối tượng | ai, cái gì thuộc phạm vi áp dụng | "áp dụng với người lao động có hợp đồng từ 12 tháng" |
   | chế tài | hậu quả khi vi phạm | "nghỉ quá hạn bị coi là nghỉ không lương" |

   Con số trong ví dụ trên là chữ trong văn bản hư cấu, chỉ để minh họa cách nhận dạng.
5. **Bóc chủ thể, hành vi, đối tượng** bằng **từ ngữ của văn bản**, để mục 6 (ma trận) và bước 5, 9 dẫn được mà
   không phải đọc lại điều khoản. Chủ thể: ai phải làm, được làm. Hành vi: động từ chính. Đối tượng: cái bị tác động.
   Điều khoản có hai chủ thể hoặc hai hành vi là dấu hiệu chưa tách đủ (bước 3).
   - Đúng: "Trưởng phòng | duyệt | đơn nghỉ phép" cho "Trưởng phòng duyệt đơn nghỉ phép trong thời hạn 03 ngày làm việc".
   - Sai: "Quản lý | phê duyệt | yêu cầu nghỉ" (đổi sang từ của presales: mất khả năng đối chiếu với văn bản).
6. **Tóm tắt** một câu, giữ nguyên con số, đơn vị, chủ thể như văn bản. Không tính toán, không đổi đơn vị.
   - Đúng: "Trưởng phòng duyệt đơn trong thời hạn 03 ngày làm việc kể từ ngày nhận đơn."
   - Sai: "Trưởng phòng duyệt trong khoảng nửa tuần." (đổi đơn vị, mất mốc tính).
7. **Hướng BR:** điều khoản sẽ thành loại business rule nào ở bước 9 (sáu loại của `ba-rules` method.md mục 1).
   Chỉ ghi hướng, không viết câu rule, không cấp BR.

   | Loại điều khoản | Hướng BR thường gặp | Ví dụ |
   | --- | --- | --- |
   | điều kiện | ràng buộc (cấm, cho phép); suy diễn (phân loại) | "chỉ được nghỉ phép năm khi đã làm đủ 12 tháng" → ràng buộc |
   | thời hạn | thời hạn | "duyệt trong thời hạn 03 ngày làm việc" → thời hạn |
   | thẩm quyền | phân quyền | "Giám đốc duyệt nghỉ trên 05 ngày" → phân quyền |
   | đối tượng | ràng buộc, suy diễn; hoặc "—" khi chỉ nêu phạm vi chung | "áp dụng với người có hợp đồng từ 12 tháng" → ràng buộc |
   | thủ tục | "—" (thành bước quy trình); ràng buộc khi có trình tự bắt buộc | "phải có ý kiến Trưởng phòng trước khi trình Giám đốc" → ràng buộc |
   | biểu mẫu | "—" (thành dữ liệu); kiểm liên trường khi mẫu có quan hệ giữa các ô | "Đến ngày không trước Từ ngày" → kiểm liên trường |
   | chế tài | suy diễn (hậu quả), tính toán (mức trừ) | "nghỉ quá hạn bị coi là nghỉ không lương" → suy diễn |

   Loại `điều kiện`, `thời hạn`, `thẩm quyền` luôn có hướng BR (cổng máy kiểm). Mọi điều khoản có hướng BR là đầu vào
   bắt buộc của bước 9: không BR nào dẫn tới thì bước 9 phải ghi lý do.
8. **Số điều khoản lấy** (mục 1): đếm dòng mục 2 của từng văn bản. Văn bản áp dụng mà lấy 0 điều khoản → ghi lý do.
9. **Biểu mẫu (mục 3):** mỗi biểu mẫu kèm theo văn bản một dòng, liệt kê các trường đúng như trên mẫu. Bước 6 (ERD)
   dùng để đối chiếu thuộc tính bắt buộc.
10. **Mâu thuẫn giữa các văn bản** (hai văn bản cùng hiệu lực quy định khác nhau một việc) → câu hỏi ghi đủ hai phương án;
   không chọn.

## 4. Danh mục quy trình presales (`quy-trinh-presales.md`) — việc A3 của business-analyst
1. **Vị trí (mục 0).** Mỗi tệp, mỗi trang (drawio), mỗi process (bpmn), mỗi sheet hoặc mục (xlsx, docx) có quy trình một
   dòng, kèm đường dẫn bản chữ. Bản chữ drawio, bpmn (`doc-quy-trinh.mjs`) liệt kê từng trang: lane, ô
   (`id | loại | lane | nhãn`), mũi tên (`từ → tới [nhãn]`). Dạng pdf, ảnh (BA đã đồng ý): đọc trực tiếp, nguồn ghi
   `[SRC: <tệp>, trang <n>]`; máy không kiểm sót bước, nên tự soát lại từng ô trên ảnh trước khi báo xong.
2. **Quy trình (mục 1).** Mỗi trang sơ đồ là một quy trình, trừ khi một trang vẽ nhiều pool tách rời (mỗi pool một quy
   trình). Cấp `tổng` khi các bước là tên quy trình con, không có lane; `chi tiết` khi có lane và bước việc.
   Quy trình chi tiết ghi "Mở rộng từ" là bước của quy trình tổng có **cùng tên** (hoặc tên trang trùng tên bước); không
   khớp tên → "—" kèm `[ASM-T<n>]`. Mã `QP-01`, `QP-02`… theo thứ tự: quy trình tổng trước, rồi chi tiết theo thứ tự bước
   của quy trình tổng.
3. **Bước (mục 2).** Chép mọi ô loại `bước`, `cổng` có nhãn; `sự kiện` có nhãn ghi khi nhãn mang nghĩa nghiệp vụ
   ("Nhận hồ sơ", "Quá hạn 03 ngày"). Tên chép nguyên văn nhãn (cổng máy so với bản chữ). Mã bước `QP-xx.yy` theo luồng
   từ sự kiện bắt đầu; nhánh rẽ đánh số hết nhánh đầu rồi mới tới nhánh sau.
4. **Đi tới:** theo mũi tên; nhãn mũi tên trong `[ ]` (`QP-02.04 [Có]`). Mũi tên đi qua sự kiện không ghi thì nối thẳng
   tới bước sau sự kiện. Cổng máy kiểm mọi mũi tên giữa hai ô đã ghi có ở cột này.
5. **UC presales (theo nguồn):** chỉ chép mapping presales đã có — mã UC trong nhãn bước ("UC1 - Lập đơn"), cột mapping
   của bảng xlsx, docx, chú thích trên sơ đồ. Mã trong nguồn khác dạng mã gốc ở uc-presales.md ("UC1" so với "1") → ghi
   mã gốc của uc-presales.md, đề xuất giả định nêu cách quy đổi. Bước không có UC trong nguồn → "—"; **không tự gắn**.
   Mã UC trong nguồn không có ở uc-presales.md → đề xuất câu hỏi (UC presales thiếu hay sơ đồ cũ).
6. **Ô không phải bước (mục 3):** tiêu đề, chú giải, ghi chú có nhãn mà cổng máy coi là bước (hình chữ nhật có chữ) →
   một dòng kèm lý do. Ghi chú mang nội dung quy định (thời hạn, điều kiện) → đề xuất câu hỏi hoặc phát hiện.
7. **UC không có trong quy trình (mục 4):** mọi UC presales không bước nào gắn, kèm đề xuất phát hiện loại
   `UC không thuộc quy trình`. Đây là ghi nhận, không phải đánh giá: bước 2 quyết UC đó thuộc PROC nào.
8. Docx, xlsx: không có id ô; nguồn ghi theo sheet, dòng hoặc mục, bảng. Cổng máy chỉ kiểm tệp có thật, mã, mapping UC.
9. Chạy `node kit/tools/ba-verify/dau-vao-check.mjs --chi quy-trinh`.

## 5. Danh mục màn presales (`man-presales.md`) — việc của ux-spec-designer
1. Đọc `1-ba-init/0-dau-vao/man-presales.json` (do `quet-prototype.mjs` sinh; cấu trúc và giới hạn ở
   1-ba-init/templates/man-presales.schema.md). Không sửa tay JSON. Màn bị sót (popup của nút script không bấm, bước wizard, màn
   cần dữ liệu có sẵn) → ghi mục 3 "Lỗi khi duyệt", báo phiên chính; không tự thêm MP.
2. Mỗi MP một dòng ở mục 2 "Danh mục", lấy từ JSON. Màn không thuộc UC: mục 1, kèm bảng giải thích từng PH. File viết cho cả người đọc nghiệp vụ: các cột đầu viết lại cho dễ đọc, cột
   kỹ thuật (Vị trí, Cách mở, UC presales, Đi tới, Vai khi quét) chép đúng JSON và đặt cuối bảng; cách viết từng cột theo
   "Hướng dẫn điền" của template. Trường: liệt kê nhãn, thêm "(bắt buộc)" khi JSON ghi `bat_buoc`. Viết "Tóm tắt" đầu
   file sau khi xong bảng.
3. Mục 3: mỗi route trong `route_chua_mo` và `lech_nguon` một dòng (cổng máy kiểm). Cột "Xử lý":
   - Route chưa mở (thường cần mã bản ghi): mở tay bằng Playwright MCP với một mã thấy trên màn danh sách, hoặc đọc
     thành phần của route trong `ma-nguon/`; ghi "đã xem tay: <màn gì>, UC `<mã gốc>`". Không xác định được → đề xuất
     câu hỏi. Không tự thêm MP.
   - Lệch dist ↔ link: đề xuất câu hỏi "bản nào là bản đã chào giá", chặn G0; không tự chọn.
4. **Gắn UC presales** bằng cách so tiêu đề, trường, nút, ảnh với tên và mô tả luồng của UC:
   - Khớp rõ (tên màn và tên UC cùng hành vi, cùng đối tượng) → ghi mã gốc.
   - Một màn phục vụ nhiều UC (ví dụ màn danh sách có nút Duyệt, Từ chối) → ghi nhiều mã, cách bằng `;`.
   - Không chắc → mã kèm mã giữ chỗ `[ASM-T<n>]`, đề xuất giả định trong báo cáo; phiên chính cấp số thật.
   - Không thuộc UC nào (trang chủ, đăng nhập, trang trống) → "—", đề xuất phát hiện loại `màn không thuộc UC`.
5. Màn đọc tĩnh hoặc lỗi → cột "Ghi chú" ghi lý do; không có ảnh → ghi lý do. Nhãn nút là chữ tiếng Anh mặc định của
   thư viện (OK, Cancel, Close) → chép nguyên văn, không dịch.

## 6. Ma trận UC presales × điều khoản (`uc-phap-ly.md`) — việc A4 của business-analyst
Chạy sau khi đã có uc-presales.md, phap-ly.md, quy-trinh-presales.md và phiên chính đã cấp mã Q, PH của đợt 2.
1. **Ghép theo chủ thể, hành vi, đối tượng.** Với mỗi điều khoản (phap-ly.md mục 2), tìm UC presales có actor khớp chủ
   thể, tên hoặc mô tả luồng khớp hành vi, đối tượng. Đọc thêm bước quy trình presales gắn UC (cùng lane, cùng tên
   việc) để thấy UC nằm ở khâu nào của thủ tục.
   - Đúng: Đ5 "Trưởng phòng | duyệt | đơn nghỉ phép" ↔ UC `2` "Duyệt đơn nghỉ phép", actor Trưởng phòng — quan hệ
     `thực hiện`.
   - Sai: Đ5 ↔ UC `3` "Tra cứu đơn nghỉ phép" chỉ vì cùng có chữ "đơn nghỉ phép" — không cùng hành vi.
2. **Quan hệ:** `thực hiện` (UC làm việc điều khoản quy định), `ràng buộc` (điều khoản đặt điều kiện, thời hạn, thẩm
   quyền lên UC), `dữ liệu` (biểu mẫu, thông tin UC phải ghi), `đối tượng` (phạm vi người, hồ sơ của UC). Điều khoản
   thời hạn của việc duyệt gắn UC duyệt là `ràng buộc`, không phải `thực hiện`.
3. **Cách ghép:** `presales` khi UC presales hoặc quy trình presales nhắc thẳng văn bản, điều khoản; `đối chiếu` khi
   agent tự so nội dung. Không chắc → ô "Ghép vì" thêm `[ASM-T<n>]`, đề xuất giả định.
4. **Mục 1 sắp theo văn bản** (thứ tự phap-ly.md mục 1), rồi mã điều khoản, rồi mã gốc UC: đọc dọc một văn bản là
   thấy văn bản đó tách thành điều khoản nào, mỗi điều khoản rơi vào UC nào.
5. **UC không có căn cứ (mục 2):** mỗi UC presales phải có ít nhất một dòng ở mục 1, hoặc một dòng ở mục 2 với lý do
   `nội bộ` / `tiện ích` / `quản trị hệ thống` / `chưa tìm thấy`. `chưa tìm thấy` (nghiệp vụ có vẻ thuộc diện luật
   điều chỉnh mà 0-inputs/ không có điều khoản) → đề xuất câu hỏi "thiếu văn bản hay nghiệp vụ nội bộ", chặn G1.
   Không dùng `tiện ích`, `nội bộ` để né: UC ghi nhận, xử lý hồ sơ, biên bản, quyết định thường có căn cứ.
6. **Điều khoản không có UC (mục 3):** `áp dụng chung` (đối tượng, chế tài chung), `ngoài phần mềm` (việc trên giấy),
   `chưa có UC` (presales thiếu UC) → đề xuất phát hiện loại `điều khoản chưa có UC`.
7. Điền bảng đầu (số UC có căn cứ, số điều khoản có UC). Chạy `node kit/tools/ba-verify/dau-vao-check.mjs --chi uc-phap-ly`.

## 7. Bản đồ quy trình dựng ngược (`ban-do-quy-trinh.md`) — việc A5 của business-analyst
Chạy sau ma trận (mục 6) và sau khi phiên chính đã cấp mã Q, PH của đợt 3. Template: 1-ba-init/templates/ban-do-quy-trinh.md.
Mọi đầu ra ghi trong thư mục `1-ba-init/0-dau-vao/ban-do-quy-trinh/`:
- `ban-do-quy-trinh.md` (file tổng: danh sách QT, chỉ mục luồng, chuyển giao, hệ thống ngoài, đối chiếu).
- Mỗi cấp sơ đồ một thư mục con: `cap-0/` (`cap-0.bpmn.json`, `cap-0.drawio.svg`), `cap-1/` (`cap-1.bpmn.json`,
  `cap-1.drawio.svg`), `cap-2/` (luồng UC từng QT).
- Mỗi QT một thư mục `cap-2/QT-nn-<slug>/`: `QT-nn.md` (template 1-ba-init/templates/ban-do-quy-trinh-qt.md: thông tin QT,
  ghép luồng UC, khoảng trống), `QT-nn.bpmn.json`, `QT-nn.drawio.svg`. `.drawio`, `.png` là tệp trung gian, không commit.
Port từ kit v1: `ba-process` method mục 1, 1b, 11 (bản đồ quy trình, chuyển giao, ghép luồng UC presales) và
`ba-refine` method mục 5a (đối chiếu hai chiều mã gốc). Không có bảng bước: bảng bước, gateway, ngoại lệ là việc của
`/ba-overview` đợt 3. Mã `QT-nn` (kit/standards/id-convention.md) cấp tuần tự, giữ nguyên ở các bước sau.
1. **Gom UC thành quy trình.** Mỗi quy trình có một trigger và một kết quả có giá trị cho đối tượng nghiệp vụ. Gom theo
   thứ tự ưu tiên:
   1. Điều khoản `thủ tục` ở uc-phap-ly.md mục 1: các UC cùng thực hiện một thủ tục thuộc một quy trình.
   2. Đối tượng nghiệp vụ (hồ sơ, biên bản, quyết định) mà UC tạo, chuyển trạng thái.
   3. Quy trình presales (`QP`) nếu presales có: một QP tổng thường là một hoặc vài QT.
   4. Phân hệ của UC presales chỉ để kiểm lại, không phải căn cứ gom: một phân hệ có thể chứa nhiều quy trình.
   - Đúng: "QT-01 Xin nghỉ phép: trigger 'Nhân viên cần nghỉ', kết quả 'Đơn nghỉ phép Đã duyệt hoặc Bị từ chối';
     UC `1`, `2`, `4`; căn cứ `QC-NP/Đ5.K1` (thủ tục)."
   - Sai: "QT-01 Màn hình nghỉ phép" (đặt theo màn); hoặc "QT-03 Danh mục" gom mọi UC quản lý danh mục, không chung
     luồng nghiệp vụ nào.
2. **Sắp thứ tự UC trong quy trình (mục 2 của `QT-nn.md`; file tổng mục 2 là chỉ mục).** Theo trình tự thủ tục trong điều khoản (ai làm trước, ai làm sau, thời
   hạn tính từ đâu), rồi theo luồng màn presales (man-presales.md cột "Đi tới"), rồi theo mô tả luồng UC.
   Trình tự luật khác luồng màn → theo luật, đề xuất phát hiện loại `trình tự khác luồng màn`.
3. **Ghép luồng, hỏi bốn câu ở mỗi chỗ nối.** Nối đầu ra UC trước với đầu vào UC sau. Ở mỗi chỗ nối hỏi:
   - `ai chuyển cho ai`: đối tượng đi từ actor UC trước sang actor UC sau bằng cách nào?
   - `trong hay ngoài hệ thống`: việc giữa hai UC làm trong phần mềm hay trên giấy?
   - `actor không có UC`: chủ thể luật quy định làm việc ở đây mà không UC presales nào có actor đó?
   - `đầu ra không UC nào nhận`: đầu ra UC trước có UC nào nhận không?
   Trả lời được bằng nguồn → `khớp`. Không trả lời được → `khoảng trống`: một dòng mục 3 của `QT-nn.md`, đề xuất phát hiện (loại
   `thiếu luồng`, `thiếu actor` theo câu hỏi). Không tự vẽ thêm bước để lấp.
   - Đúng: "PH | UC `3` → UC `4` | ai chuyển cho ai | UC `3` kết thúc ở 'Trưởng phòng duyệt'; UC `4` bắt đầu ở
     'Nhân sự cập nhật số dư'. Không UC nào mô tả việc chuyển đơn đã duyệt sang Nhân sự."
   - Sai: ghi chỗ nối `khớp` vì hai UC cùng phân hệ; hoặc thêm UC "Chuyển Nhân sự" vào danh sách.
4. **Chuyển giao giữa quy trình (mục 3).** Đầu ra của QT trước là trigger của QT sau: ghi một dòng, đối tượng chuyển
   giao dùng thuật ngữ glossary. Không rõ qua hệ thống hay thủ công → `[ASM-T<n>]`.
5. **Hệ thống, đơn vị ngoài (mục 4).** Chủ thể trong điều khoản không phải người dùng phần mềm (cơ quan cấp trên, đơn vị
   phối hợp), phần mềm khác mà UC presales nhắc tới.
6. **Đối chiếu hai chiều (mục 6).**
   - Chiều xuôi: mỗi UC presales thuộc ít nhất một QT, hoặc có dòng mục 6.1 với lý do. UC ghi nhận, xử lý hồ sơ,
     biên bản, quyết định thường thuộc quy trình; không dùng `tra cứu, báo cáo`, `danh mục` để né. Không rõ → `chưa rõ`
     kèm đề xuất câu hỏi phạm vi (chặn G0).
   - Chiều ngược: QT không có UC presales nào (chỉ căn cứ điều khoản, thường từ điều khoản `chưa có UC` ở uc-phap-ly.md
     mục 3) → dòng mục 6.2 kèm đề xuất câu hỏi trong hay ngoài phạm vi. Không kết luận "ngoài báo giá", không ước lượng.
   - Không sửa, không gộp, không bỏ UC presales; không quyết Giữ / Bỏ / Thêm mới.
7. **Sơ đồ (mục 7).** BPMN 2.0 cấp 1 theo skill ba-bpmn (quy-tac.md mục 1): pool dự án chia lane theo actor chủ trì,
   mỗi QT một sub-process thu gọn, chuyển giao ở mục 3 là sequence flow, hệ thống ngoài ở mục 4 là pool thu gọn nối bằng
   message flow. Hơn khoảng 8 QT → thêm cấp 0 (luồng chính của đối tượng lõi). Đặc tả `cap-1/cap-1.bpmn.json`,
   sinh `cap-1/cap-1.drawio.svg`, kiểm `bpmn_lint.py --cap 1` (cấp 0 ở `cap-0/`: `--cap 0`), đọc ảnh PNG.
   Sơ đồ luồng UC từng QT (`QT-nn.md` mục 4): pool QT-nn, lane theo actor, mỗi UC một task nhãn `<mã gốc> <tên>`,
   mũi tên theo cột "Nối tới", gateway khi rẽ nhánh, annotation mã PH ở chỗ nối khoảng trống; kiểm `bpmn_lint.py`
   (không `--cap`).
8. Điền bảng đầu của file tổng và từng `QT-nn.md`, bảng chỉ mục mục 2. Chạy
   `node kit/tools/ba-verify/dau-vao-check.mjs --chi ban-do`.

## 8. Glossary khởi tạo — phiên chính gộp
- Ứng viên: danh từ nghiệp vụ lặp lại trong UC presales, định nghĩa trong văn bản pháp luật ("Trong Thông tư này,
  các từ ngữ dưới đây được hiểu như sau"), nhãn trên màn, tên lane và tên bước của quy trình presales.
- Cùng một khái niệm mà các nguồn gọi khác nhau: thuật ngữ chuẩn theo **văn bản pháp luật**; từ còn lại vào cột
  "Không dùng". Không có trong luật → theo UC presales, từ trên màn vào "Không dùng"; chưa chắc → câu hỏi.
- Định nghĩa chép hoặc tóm tắt từ nguồn, có `[SRC]`.

## 9. Câu hỏi và phát hiện khởi tạo — phiên chính gộp
Sổ của bước 1 `1-ba-init/open-questions.md` (từ bước 2 ghi ở `du-an/open-questions.md`): câu hỏi ở mục 1, giả định mục 2, phát hiện mục 3. Bước 1 chỉ ghi điều **thấy ngay
khi chép, khi ghép, khi nối UC thành quy trình**, không đi tìm khoảng trống bên trong UC (việc của bước 2, 5):
- Văn bản thiếu số hiệu, ngày hiệu lực → Q, chặn G4.
- UC presales dẫn văn bản không có trong `0-inputs/`; hai văn bản cùng hiệu lực mâu thuẫn; actor trong UC presales khác
  chủ thể có thẩm quyền trong luật cho cùng việc; lane quy trình presales khác actor UC presales cho cùng việc; dist
  và link prototype lệch nhau → Q ghi đủ phương án, chặn G0.
- UC `chưa tìm thấy` căn cứ pháp lý → Q, chặn G1 (chức năng chứa UC chưa qua được "hiểu đúng nghiệp vụ").
- Mã trùng, dòng không mã, màn không thuộc UC, UC không thuộc quy trình, điều khoản chưa có UC → PH, bước `1`.
  PH cần người quyết (ví dụ điều khoản chưa có UC: thêm UC hay ngoài phạm vi) → mở thêm Q, ghi cột "Q liên quan".
- Bản đồ quy trình: chỗ nối `khoảng trống`, trình tự luật khác luồng màn → PH, bước `1`. UC `chưa rõ` thuộc quy trình
  nào, QT không có UC presales → Q phạm vi, chặn G0.

## 10. Lỗi hay gặp
- Bỏ dòng nhóm khỏi danh mục mà không dùng làm cột "Phân hệ" → mất thông tin phân hệ.
- Đếm cột sai ở mục 0 (ô trống ở giữa dòng vẫn là một cột) → `dau-vao-check` báo mã khác tệp gốc ở mọi dòng.
- Gộp hai khoản có hai nghĩa vụ khác nhau vào một mã điều khoản → bước 5, 9 không dẫn chính xác được.
- Gắn màn cho UC chỉ vì trùng một từ trong tiêu đề, không xét trường và nút.
- Coi `/ho-so/:id` là màn "của bản ghi 123": `:id` là mọi bản ghi; một route một màn chính.
- Ghi glossary, open-questions trực tiếp khi đang chạy song song → hai agent ghi đè nhau.
- Tự gắn UC cho bước quy trình presales khi nguồn không gắn → lẫn mapping của presales với suy luận của agent; bước 2
  không còn biết presales đã chào giá gì.
- Bỏ ô "Theo dõi", "Lưu hồ sơ" khỏi danh mục quy trình vì "không có UC" → mất bước; bước không UC vẫn phải chép.
- Bóc chủ thể, hành vi bằng từ của presales thay vì từ của văn bản → ma trận ghép theo chữ trùng, không theo nghĩa.
- Ghép điều khoản với UC chỉ vì trùng danh từ (đơn, hồ sơ) mà khác hành vi; ghép một điều khoản với mọi UC của phân hệ.
- Gắn lý do `tiện ích` cho UC xử lý hồ sơ để mục 2 không phải mở Q.
- Gom UC thành quy trình theo phân hệ hoặc theo màn, không theo thủ tục và đối tượng → một QT chứa nhiều luồng rời nhau.
- Ghi chỗ nối `khớp` khi không trả lời được bốn câu; hoặc tự thêm bước, thêm UC để lấp khoảng trống mà không ghi PH.
- Gắn lý do `tra cứu, báo cáo`, `danh mục` cho UC xử lý hồ sơ để mục 6.1 không phải mở Q.
- Viết bảng bước, gateway vào bản đồ → trùng việc `/ba-overview` đợt 3; bản đồ chỉ có QT, thứ tự UC, chỗ nối.
