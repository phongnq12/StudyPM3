# Điền từng mục của template ERD

Phần tra cứu của skill [`create-erd`](../SKILL.md). Đọc phần lõi trước. Thứ tự dưới đây là **thứ tự của template** [`erd.md`](../../../../2-ba-overview/templates/3-erd/erd.md); mỗi mục có một câu **Định nghĩa** rồi bảng mỗi dòng một cột hoặc một ô. Mã trong ví dụ là **mã minh họa** của [thế giới xuyên suốt](../../ba-overview/reference/vi-du-xuyen-suot.md); mã không có trong bảng mã chuẩn ở đó là **mã minh họa riêng của skill**.

Ba quy ước đọc bảng: `{{…}}` là chỗ phải điền; chưa có thông tin thì dùng ba giá trị đặc biệt ở [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 3, không để trống; thứ bậc khi hai nguồn lệch là `00_quy_uoc_chung.md` → template → skill.

**Quy ước trống** (thống nhất toàn skill): mục hoặc bảng **cấp mục** không có nội dung thì **giữ** và ghi *Không có …* để người đọc biết đã xét; riêng dòng **Giá trị dẫn xuất Δ** là phần của khối thực thể, không có Δ thì **bỏ dòng**.

## Phần đầu file

**Định nghĩa:** tiêu đề, khối giới thiệu và hai bảng đầu trang — cho người đọc biết tài liệu nào, phiên bản nào, dựng từ gì, trong ba mươi giây, theo `00_quy_uoc_chung` mục 3.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `# ERD — {{TÊN DOMAIN}} {{DỰ ÁN}}` | Tên domain, tên dự án | Tên domain đúng chữ ở quy trình nguồn | Mã phân hệ thay cho tên |
| Câu 1 khối giới thiệu — `Mô hình dữ liệu cho phần {{phạm vi}}, dựng từ [{{QT}}]…` | Phạm vi và tài liệu quy trình nguồn | Link tương đối tới file quy trình; kể các mục quy trình đã dùng (1.1, 3, 3.1, và 6, 8 nếu dùng) | Dẫn quy trình mà không nói mục nào |
| Câu 2 — `Tên bảng và tên trường giữ đúng bản vẽ…` | Link tới bản vẽ gốc | Có bản vẽ: giữ câu, thay link. **Không có bản vẽ gốc: xóa dòng này** và dẫn [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 11 | Giữ câu "giữ đúng bản vẽ" khi không có bản vẽ |
| Câu 3 — `Gồm {{n}} thực thể…, {{n}} thực thể tham chiếu ngoài, {{n}} ràng buộc R-xx, {{n}} điểm E-xx` | Bốn số đếm | **Đếm sau cùng** từ thân tài liệu; đối chiếu lại trước khi chuyển `Chờ review` (bản chép, `so-cu-va-gia-dinh.md` mục 6). Thực thể ngoài không tính vào số thực thể thuộc phạm vi | Số ước chừng; đếm cả dòng đã bỏ ⊘ |
| Câu cuối — **không chứa gì, nằm ở đâu** (template đã có sẵn, `00_quy_uoc_chung` mục 3.1) | Thứ tài liệu **không** chứa và nơi nó nằm | Giữ câu của template (index, partition ở thiết kế kỹ thuật; chuyển trạng thái ở máy trạng thái; nội dung business rule; nhãn và validate theo màn ở SRS); sửa nếu dự án có chỗ khác | Xóa câu; "không chứa nội dung khác" — không nói nằm ở đâu |

**Thông tin tài liệu** — bảng hai cột `Mục | Nội dung`:

| Dòng | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã tài liệu | `ERD_{MÃ}_{PHẠM VI}` | Theo `00_quy_uoc_chung` mục 2; `PHẠM VI` PascalCase không dấu: `ERD_DA1_LichHen` (minh họa) | Gắn `_v00` vào mã — phiên bản ở dòng sau |
| Dự án · Phân hệ | Tên dự án và tên phân hệ | `{tên dự án} · {tên phân hệ}`, đúng chữ ở quy trình nguồn | Mã thay cho tên |
| Phiên bản · Trạng thái | `v{{NN}}` và một trong `Nháp · Chờ review · Đã duyệt · Hết hiệu lực` | `v00 · Nháp` | Trạng thái ngoài bốn giá trị |
| Người soạn · Người review · Người duyệt | Ba tên người, cách `·` | Tên người do BA cung cấp; chưa có ai thì `chưa chốt (<ai>)` | AI điền tên mình hay đoán tên; để `{{ }}` |
| Mức mật | Một trong `Nội bộ · Hạn chế · Mật` | Theo phân loại thông tin của dự án; chưa có thì `chưa chốt (<ai>)` | Tự chọn mức khi dự án chưa phân loại |
| Mức mô hình | `Logical` | Giữ nguyên. Mức vật lý — partition, chỉ mục tối ưu truy vấn — không thuộc tài liệu này; chỉ mục (loại, id) của khóa ngoại đa hình là quy ước chung ở mục 1, không tính là mức vật lý | Đổi thành "Physical" vì có kiểu dữ liệu |
| Quy trình nguồn | Đường dẫn tương đối tới file quy trình và phiên bản | `../2-business-process/QT_….md v01` | Quy trình chưa `Chờ review` — lớp 3 chưa đủ cổng vào |
| Bản vẽ nguồn | Tên file bản vẽ, tên khung, ngày | `*.drawio — khung "LichHen", 2026-10-20`. Không có bản vẽ: `n/a — không có bản vẽ gốc` | Để `{{ }}` |

**Version control** — bảng bốn cột theo `00_quy_uoc_chung` mục 3.3. Phiên bản theo bảng Version control của [`ba-overview`](../../ba-overview/SKILL.md).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tên version | `v00`, `v01`… | Dòng hiện tại tô xanh, in đậm, kèm `<br>(hiện tại)`; các dòng cũ không tô | Tăng version khi chỉ sửa chính tả (`00_quy_uoc_chung` mục 2) |
| Ngày cập nhật | `YYYY-MM-DD` | Ngày phát hành bản đó | `dd/mm/yyyy` ở cột này (dạng đó chỉ dùng trong "BA chốt") |
| PIC | Tên người chịu trách nhiệm bản đó | Tên người; AI không điền tên mình thay người | Tên vai trò chung |
| Mô tả | Thay đổi của bản đó, mỗi ý một dòng bắt đầu `- ` | Bản đầu: *"Dựng từ quy trình … v01: 9 thực thể, 2 thực thể ngoài, 4 R-xx, 3 E-xx."* Bản sau: nêu thực thể thêm, bỏ, đổi, và **mọi quyết định BA** dạng *BA chốt dd/mm/yyyy: …* | Kể lại các lần sửa giữa chừng của một bản |

**Phê duyệt** — bảng `Vai trò | Họ tên | Ngày | Ý kiến`, ba dòng có sẵn: BA soạn, Product owner / Khách hàng, Tech lead. Giữ nguyên ba dòng; `Họ tên`, `Ngày`, `Ý kiến` do người ký điền, AI để trống và **không** điền tên, ngày hay ý kiến thay người. Ngày viết `DD/MM/YYYY` (`00_quy_uoc_chung.md` mục 5).

---

## Mục 1 — Quy ước

**Định nghĩa:** bảng ký hiệu dùng trong toàn tài liệu và danh sách quy tắc áp cho **mọi bảng**, để mục 4 không phải lặp lại. Mục này là chỗ duy nhất định nghĩa ký hiệu; các mục sau chỉ dùng.

Bảng ký hiệu giữ nguyên nội dung template; dưới đây là nghĩa và cách dùng từng ký hiệu để AI áp đúng:

| Ký hiệu | Dùng khi | Viết thế nào | Đừng viết |
|---|---|---|---|
| **PK** · **FK** · **UK** | PK: khóa chính. FK: cột trỏ tới khóa chính bảng khác. UK: giá trị không trùng trong một **phạm vi** | Ở mục 3 là khóa trong sơ đồ; ở mục 4 là `FK → \`Bang\`` ở cột Kiểu và `UK trong {{phạm vi}}` ở cột Ràng buộc. UK **nghiệp vụ** (mã người dùng thấy) luôn kèm phạm vi, thường là `{{trung_tam_id}}` | `UK` trơn khi mã chỉ duy nhất theo trung tâm — dev sẽ cài duy nhất toàn hệ thống |
| `*` | Bắt buộc **tuyệt đối** — mọi dòng, mọi trạng thái, mọi tác nhân đều phải có giá trị | Ở cột Ràng buộc | `*` cho cột chỉ bắt buộc từ một trạng thái trở đi — đó là `◐` |
| `◐` | Bắt buộc **có điều kiện** nội tại, đọc được từ chính dòng dữ liệu: *"`◐` khi `trang_thai` = `REJECTED`"* | Điều kiện ghi ngay ở cột Ràng buộc, chỉ dùng cột của chính bảng này | `◐` khi điều kiện cần tác nhân, kênh hay dữ liệu bảng khác — đó là BR ([`rang-buoc-va-dan-xuat.md`](rang-buoc-va-dan-xuat.md)) |
| **Giữ** · **✳** · **✎** · **⊘** | So với bản vẽ gốc: không đổi · mới · sửa · bỏ | Giữ, ✳, ✎ ở cột `Thay đổi` (mục 2) và `Đổi` (mục 4); ⊘ ở mục 6 (thực thể bỏ) và ở cột `Đổi` của bảng trường (trường bản vẽ gốc bị bỏ — T18). Không có bản vẽ: mọi thứ ✳ | ✎ không có chỗ nói sửa gì — ghi vào cột Mô tả hoặc `E-xx` |
| **🧪** | Thực thể hoặc trường do ERD tự đề xuất, quy trình chưa nêu | Đặt cạnh ✳ (`✳ 🧪`) và có một `E-xx` ở mục 7 | 🧪 mà không có `E-xx` |
| **Δ** | Giá trị dẫn xuất — không có cột, tính khi truy vấn | Chỉ xuất hiện ở dòng **Giá trị dẫn xuất Δ** sau bảng thực thể | Δ như một kiểu dữ liệu của cột |
| *Ngoài* | Thực thể của phân hệ khác, chỉ vẽ để thấy liên kết | Dùng ở sơ đồ mục 3 và bảng "Thực thể tham chiếu ngoài" mục 2 | Mô tả từ điển cột cho thực thể *Ngoài* |

**Quy ước chung cho mọi bảng** — mỗi dòng của danh sách là một quyết định của dự án. Template ghi mặc định rút từ một dự án mẫu; **điền theo dự án**, không bê nguyên.

| Dòng | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Khóa chính | Tên và kiểu của `id` | `id uuid` (hoặc kiểu dự án chọn). Chọn một kiểu cho mọi bảng | Mỗi bảng một kiểu khóa |
| Trường chung | Danh sách trường có ở mọi bảng, và tên cột phạm vi (tenant) | Điền tên thật của dự án thay `{{trung_tam_id}}` (trung tâm, đơn vị, chi nhánh…). Câu "UK nghiệp vụ tính trong phạm vi …" giữ nguyên | Nhắc lại các trường chung ở bảng mục 4 |
| Khóa lạc quan | Chứng từ có `row_version int`; nguồn là `GS-xx` của quy trình về đồng thời | Dẫn `GS-xx` kèm tên ngắn. Quy trình không có `GS-xx` về đồng thời thì `chưa chốt (BA)` hoặc `[CẦN BA CHỐT]` | Ghi `row_version` cho bảng Danh mục vì "cho giống" |
| Tiền · số lượng · ngày giờ | Kiểu và đơn vị tiền; kiểu số lượng; quy tắc lưu và so sánh thời gian | `decimal(18,0)` đồng (hoặc kiểu dự án); `int`; lưu kèm múi giờ, so theo ngày dùng giờ Việt Nam. Con số lấy từ `GS-xx` làm tròn, múi giờ | Đổi kiểu tiền giữa các bảng |
| Xóa mềm | Ba trường `da_xoa`, `nguoi_xoa_id`, `thoi_diem_xoa` và **nhóm bảng áp dụng** | Áp cho Danh mục. Chứng từ, Sổ ghi thêm, Nhật ký không xóa mềm: chúng hủy bằng trạng thái hoặc không bao giờ xóa | `da_xoa` ở Chứng từ — trùng với trạng thái |
| Tham chiếu ngoài phân hệ | Quy tắc cố định: tham chiếu logic, không FK cơ sở dữ liệu, dữ liệu quyết định được **chụp** | Giữ nguyên câu của template | Đặt FK thật sang bảng của phân hệ khác |
| Khóa ngoại đa hình | Quy tắc cố định: đi cùng cột loại, có chỉ mục (loại, id), ánh xạ ở mục 5.2 | Giữ nguyên | Dùng khóa đa hình mà không khai ở 5.2 |
| Không lưu cờ | Danh sách khóa, trạng thái dẫn xuất **của dự án** | Điền các khóa ở quy trình mục 3 ("Các loại khóa … không lưu cờ riêng"): *"không lưu cờ khóa lượt đặt lịch và cờ quá hạn — suy ra khi truy vấn"* (minh họa) | Để nguyên `{{ }}` |
| Đặt tên | Ba kiểu tên | Giữ nguyên: bảng `Pascal_Snake` tiếng Việt không dấu · trường `snake_case` · enum `UPPER_SNAKE` tiếng Anh | Đổi sang tên tiếng Anh cho bảng vì "chuẩn quốc tế" |

---

## Mục 2 — Danh sách thực thể

**Định nghĩa:** bản kê mọi thực thể thuộc phạm vi, mỗi thực thể một dòng; trả lời *những thứ nào được lưu, thuộc loại nào, quy trình nào ghi, ai chịu trách nhiệm*. Đây cũng là **ma trận CRUD** của lớp (phía ghi) — đối chiếu cột `Quy trình ghi` với cột `Ai ghi` của bảng dữ liệu trục ở quy trình mục 3.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `#` | Số thứ tự 1, 2, 3 | Liên tục qua các nhóm; thực thể bỏ không dùng lại số | Số theo nhóm |
| Thực thể | Tên bảng | Trong backtick, đúng chữ ở mục 4 và bản vẽ: `` `Lich_Hen` `` | Tên nghiệp vụ tiếng Việt có dấu |
| Nhóm | Nhóm vẽ sơ đồ — mỗi nhóm một sơ đồ ở mục 3.2 và một khối 4.x | `A. Lịch hẹn` (minh họa). Nhóm theo cụm nghiệp vụ chặt (cùng quy trình, cùng chứng từ), mỗi nhóm đủ nhỏ để sơ đồ đọc được | Nhóm theo loại thực thể; nhóm một thực thể; hơn khoảng 10 thực thể một nhóm |
| Thay đổi | `✳` · `✎` · `Giữ` so với bản vẽ gốc, thêm `🧪` nếu ERD đề xuất | Không có bản vẽ: ✳ cả cột. ⊘ không ở đây — bỏ thì sang mục 6 | ✎ mà không có chỗ nào chỉ ra đã sửa gì (ghi ở mục 4 hoặc `E-xx`) |
| Loại | **Một** trong sáu: Danh mục · Chứng từ · Dòng chứng từ · Sổ ghi thêm · Cấu hình · Nhật ký | Cách nhận biết từng loại ở [`thuc-the-va-quan-he.md`](thuc-the-va-quan-he.md). Một thực thể một loại | Hai loại; loại ngoài sáu |
| Quy trình ghi | Mã quy trình và bước **tạo, sửa, xóa** thực thể này | `LH-01 tạo · LH-03 sửa` (minh họa), cùng kiểu với cột `Ai ghi` của quy trình. Tác vụ nền ghi `N-xx`. Mọi thực thể phải có ít nhất một dòng. **Danh mục ghi ở màn quản trị** thì dẫn quy trình quản trị tương ứng; chưa có quy trình nào thì ghi `chưa chốt (BA)` kèm `Q-E` | Ô trống; tên màn hình; `—` cho thực thể chưa ai ghi (thực thể không ai ghi là thực thể chưa cần) |
| Chủ sở hữu dữ liệu | **Tác nhân** chịu trách nhiệm về chất lượng và quyền xem, sửa dữ liệu này (DAMA-DMBOK) — không phải người bấm nút | Đúng tên ở quy trình mục 2 (chưa có `ACT-nn` thì dùng tên ở đó): `Nhân viên tiếp đón`. **Nhật ký**: chủ sở hữu của thực thể được ghi vết (nhật ký đổi trạng thái `Lich_Hen` → chủ của `Lich_Hen`); nếu nhật ký phục vụ kiểm toán chung thì vai kiểm soát ghi ở quy trình mục 9. **Cấu hình**: tác nhân ở cột `Người cấu hình` của quy trình mục 6 (lựa chọn của skill) | Tên người thật; "Phòng IT"; "Hệ thống" cho dữ liệu nghiệp vụ |
| Nghĩa ngắn | Một cụm từ hoặc một câu ngắn: thực thể là gì | *"Yêu cầu đặt lịch của khách"* — cùng nghĩa với thuật ngữ quy trình, không định nghĩa lại | Chép định nghĩa dài từ quy trình; công thức |

Dòng mẫu (minh họa):

| # | Thực thể | Nhóm | Thay đổi | Loại | Quy trình ghi | Chủ sở hữu dữ liệu | Nghĩa ngắn |
|---|---|---|---|---|---|---|---|
| 1 | `Lich_Hen` | A. Lịch hẹn | ✳ | Chứng từ | LH-01 bước 1–3 tạo và gửi · LH-01 bước 4 duyệt | Nhân viên tiếp đón | Yêu cầu đặt lịch của khách |

Tác vụ chỉ **đọc** `Lich_Hen` (ví dụ `N-01 Nhắc lịch`) **không** nằm ở `Quy trình ghi`; cột này chỉ liệt kê quy trình tạo, sửa, xóa.

**Thực thể tham chiếu ngoài** — thực thể của phân hệ khác mà phạm vi này cần nhưng không sở hữu:

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Thực thể | Tên bảng bên phân hệ kia | Đúng chữ ở ERD của phân hệ đó, trong backtick. Chưa có ERD đó: tên nghiệp vụ kèm ❓ (`00_quy_uoc_chung.md` mục 9) | Tên tự đặt cho bảng người khác |
| Phân hệ | Mã phân hệ sở hữu | `CRM` (minh họa) | Tên module |
| Dùng để | Vì sao phạm vi này cần nó | Một câu: *"xác định nhân viên duyệt lịch"* | Mô tả toàn bộ thực thể đó |
| Cách liên kết | Luôn `Tham chiếu logic` + các trường **chụp** vào chứng từ | `Tham chiếu logic · chụp ho_ten, ma_nhan_vien`. Không dùng cho quyết định thì `Tham chiếu logic · không chụp` kèm lý do | Ghi "khóa ngoại"; chụp mà không nói chụp trường nào |

**Không lưu** — thứ quy trình nhắc tới nhưng ERD **không** lập thực thể. Đây là bảng **bổ sung của skill** (T16), đặt ở cuối mục 2: chỗ cố định để ghi lý do, vì cổng ra của lớp 3 đòi mọi chứng từ, danh mục, sổ nhắc trong quy trình có thực thể *hoặc có lý do không lưu*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Thứ được nhắc | Tên nghiệp vụ đúng chữ ở quy trình | `Báo cáo thống kê lịch hẹn theo tuần` | Tên bảng tự đặt |
| Nơi nhắc | Mục quy trình nhắc tới | `mục 8.1` · `mục 1.1` | Để trống |
| Lý do không lưu | Một câu, nêu rõ loại: Δ · truy vấn hoặc báo cáo · mẫu in chỉ hiển thị · thuộc phân hệ khác · ngoài phạm vi | *"Truy vấn trên `Lich_Hen` theo `ngay_hen`; không giữ bản chụp"* | "Không cần" |
| Căn cứ | `D-xx` hoặc `GS-xx`; chưa có thì ❓ kèm `Q-E` | `D-xx` kèm tên ngắn | Để trống |

Không có thứ nào bị bỏ qua thì ghi *Không có thứ nào được nhắc mà không lưu*. Mục 6 chỉ dành cho thực thể của **bản vẽ gốc**, không dùng cho việc này.

---

## Mục 3 — Sơ đồ quan hệ

**Định nghĩa:** hình vẽ cho thấy thực thể nào liên hệ với thực thể nào, theo bản số nào. Trả lời *thứ này nối với thứ kia thế nào*, không trả lời *cột nào*. Cú pháp Mermaid `erDiagram`, ký hiệu chân chim; cách chọn bản số và ví dụ hoàn chỉnh ở [`thuc-the-va-quan-he.md`](thuc-the-va-quan-he.md).

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Câu mở đầu | Giữ nguyên | Mỗi sơ đồ một nhóm; thực thể nhóm khác chỉ hiện khóa chính | — |
| 3.1 Tổng quan giữa các nhóm | Một sơ đồ chỉ hiện **thực thể trung tâm** của mỗi nhóm và đường nối **giữa** các nhóm | Không khối thuộc tính. Mỗi đường có bản số hai đầu và nhãn. Chỉ có một nhóm thì ghi *Chỉ một nhóm — xem 3.2*, và xóa khối mermaid trống | Vẽ mọi thực thể ở đây; đường nối nội bộ nhóm |
| 3.2 … 3.n Nhóm X | Một sơ đồ cho mỗi nhóm ở mục 2, tiêu đề `### 3.k. Nhóm X — Tên nhóm` | **Dòng quan hệ**: `Bang_A \|\|--o{ Bang_B : "động từ"` — bản số **cả hai đầu**, nhãn là **động từ tiếng Việt**, đọc từ trái sang phải. Đường nối luôn là `--`; liên kết logic (ngoài phân hệ, khóa ngoại đa hình) thì nhãn bắt đầu bằng `(logic)`. Không dùng `..`: trong Mermaid đó là quan hệ *non-identifying*, không phải "logic" — lựa chọn của skill **Khối thuộc tính** chỉ có khóa và cột trạng thái: `uuid id PK` · `varchar ma UK` · `uuid x_id FK` · `enum trang_thai`. Thực thể nhóm khác chỉ hiện `id PK`. Thực thể 🧪 hoặc ✳ nhận biết ở mục 2, không vẽ khác | Liệt kê hết cột (có ở mục 4 rồi); nhãn danh từ ("thông tin"); đường nối không nhãn; tên bảng hoặc tên khóa **khác** mục 4 — lệch thì mục 4 thắng và sơ đồ phải sửa |
| Chỗ `{{Bang_A}}` ở khối mermaid mẫu | Tên bảng thật | Chỉ dùng ký tự mà Mermaid chấp nhận: chữ, số, gạch dưới | Dấu cách, dấu tiếng Việt |

---

## Mục 4 — Từ điển dữ liệu

**Định nghĩa:** danh bạ từng thực thể và từng trường theo ISO/IEC 11179-3 — mỗi phần tử dữ liệu có **tên, định nghĩa, kiểu, miền giá trị, ràng buộc, nguồn**. Đây là nguồn duy nhất về tên bảng, tên trường, mã enum. Trường chung ở mục 1 **không** lặp lại.

Ánh xạ 11179: tên → cột `Trường`; định nghĩa → cột `Mô tả`; kiểu → cột `Kiểu`; miền giá trị → cột `Kiểu` (độ dài) và `Mô tả` (khoảng, tập giá trị, enum); ràng buộc → cột `Ràng buộc`; nguồn → cột `Nguồn`.

Tiêu đề `### 4.k. Nhóm X — Tên nhóm` nhắc lại nhóm ở mục 2, theo cùng thứ tự.

### Khối của một thực thể

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `#### \`Ten_Bang\` — tên nghiệp vụ · ✳ / ✎ / Giữ` | Tên bảng, tên nghiệp vụ, ký hiệu đổi | `` `Lich_Hen` — Lịch hẹn · ✳ `` — ký hiệu **khớp** cột `Thay đổi` ở mục 2 | Ký hiệu khác mục 2 |
| Đoạn mô tả (1–3 câu) | Bảng lưu gì; **grain** — một dòng là gì; ai tạo, khi nào; dẫn `D-xx` | *"Mỗi dòng là một yêu cầu đặt lịch của một khách vào một ngày. Khách tạo ở `LH-01`; nhân viên đổi trạng thái ở bước 4 — D-xx …"* (minh họa). Bảng không theo quy ước chung (khóa tổ hợp, không có `id`, không có `thoi_diem_cap_nhat`) thì **nói ở đây** | Chép lại quy trình; nhiều hơn ba câu; bỏ grain |

### Bảng trường

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Trường | Tên cột `snake_case` tiếng Việt không dấu, trong backtick | Khóa ngoại tận cùng `_id`. Tên đúng chữ bản vẽ; tên mới theo quy tắc của bản vẽ. Thứ tự: mã nghiệp vụ → khóa ngoại → trường nghiệp vụ → `trang_thai` → trường lý do/ghi chú cuối. Không có dòng cho `id` và trường chung (mục 1). Trường của bản vẽ gốc bị bỏ: dòng cuối bảng, `Đổi` = ⊘ | Liệt kê lại `nguoi_tao`, `thoi_diem_tao`…; tên có dấu; viết tắt khó hiểu |
| Kiểu | Kiểu logical | Danh sách dùng: `uuid` · `varchar(n)` · `text` · `int` · `decimal(p,s)` · `date` · `timestamp` · `boolean`† · `enum` · `FK → \`Bang\``. Có độ dài thì ghi `varchar(20)`; chưa biết độ dài thì `varchar` kèm `Q-E`. †`boolean` chỉ cho **sự kiện đã xảy ra** ghi nhận được (ví dụ `da_xoa`), không cho thứ suy ra được | Kiểu riêng một hệ quản trị (`nvarchar(max)`, `serial`); `boolean` cho trạng thái; `varchar` cho tiền |
| Ràng buộc | Ràng buộc **nội tại** của cột: `*` · `◐ khi …` · `UK trong {{phạm vi}}` · miền (≥ 0, 1–3, độ dài) | Nhiều ràng buộc cách nhau `·`: `` `*` · 1–3 ``. Bắt buộc **tuyệt đối** → `*`. Chỉ bắt buộc trong một điều kiện nội tại → `◐ khi trang_thai = REJECTED`. UK tổ hợp: ghi ở **mọi** cột trong tổ hợp `UK(khach_hang_id, tuan) trong trung_tam_id`. Giới hạn có tham số: `≤ CH-01` | Điều kiện ngữ cảnh ("chỉ nhân viên mới được sửa", "khi duyệt rồi thì khóa"); con số trần của tham số cấu hình; cách báo lỗi |
| Đổi | `Giữ` · `✳` · `✎` · `⊘` (thêm `🧪` nếu ERD đề xuất) so với bản vẽ gốc | Không có bản vẽ: ✳ cả cột. ✎ thì cột Mô tả nói sửa gì: *"✎ độ dài 20 → 30"*. ⊘ là trường của bản vẽ gốc **bị bỏ**: thêm một dòng cuối bảng, Trường là tên cột gốc, Kiểu và Ràng buộc chép như bản vẽ, Mô tả nói vì sao bỏ, Nguồn là `D-xx` hoặc điều khoản — lựa chọn của skill (T18) | Để trống; ✎ không giải thích; bỏ trường mà không có dòng ⊘ |
| Mô tả | Nghĩa của trường: **trả lời câu hỏi nghiệp vụ nào, đơn vị, miền, ý nghĩa giá trị đặc biệt**. Enum: liệt kê mọi mã | Cột thường: một câu — *"Ngày khách muốn đến, tính theo giờ Việt Nam"*. Enum: `` `DRAFT` Nháp · `PENDING_APPROVAL` Chờ duyệt · … — máy trạng thái SM mục 2 `` (cú pháp của template: `\`MÃ\` tên Việt · … — máy trạng thái SM mục n`). Lúc viết lớp 3 máy trạng thái chưa có: ghi `— máy trạng thái chờ lớp 4`, create-sm thay bằng `SM mục n`. Trường **chụp**: *"chụp từ `Nhan_Vien.ho_ten` lúc duyệt"* | Nhắc lại tên cột; ghi logic xử lý; nhãn trên màn hình |
| Nguồn | Căn cứ cho **sự tồn tại** của trường: `D-xx` · `GS-xx` · bước quy trình · điều khoản · `GD-xxxx` · mã BR | `LH-01 bước 1` · `QC01 Đ5.1`. Ràng buộc dạng dữ liệu đến từ business rule — kể cả dòng khóa ngoại mang bản số của quan hệ, `UK` trên khóa ngoại — dẫn **một hoặc nhiều** mã BR, cách `·`: `BR-B03 Một sổ mỗi hồ sơ · LH-01 bước 1`. Lớp 3 chạy trước lớp 6 nên lúc đầu dẫn điều khoản, `GS-xx`, `D-xx`; lượt điền ngược của `ba-overview` thêm mã BR, không xóa căn cứ cũ. Trường chỉ mang tính kỹ thuật (khóa ngoại hiển nhiên) vẫn dẫn bước ghi nó. Không tìm được: ❓ `[CẦN BA CHỐT]` + `Q-E` (`so-cu-va-gia-dinh.md` mục 2) | Ô trống; `—` cho thứ chưa biết; tên người |

Hai quy tắc đọc cột `Trường` ↔ `Kiểu` ↔ `Mô tả` ↔ `Ràng buộc` cho trường `trang_thai`: kiểu luôn `enum`; ràng buộc luôn `*` (trừ khi nghiệp vụ cho phép chưa có trạng thái — hiếm); mô tả luôn có **đủ mã**, tên Việt, và trỏ `SM mục n` (lớp 3: `chờ lớp 4`). Thiếu một trong ba thì máy trạng thái lớp 4 không dẫn được.

Dòng mẫu (minh họa), trích từ `Lich_Hen`:

| Trường | Kiểu | Ràng buộc | Đổi | Mô tả | Nguồn |
|---|---|---|---|---|---|
| `ma` | varchar(20) | `*` UK trong trung_tam_id | ✳ | Mã lịch hẹn người dùng thấy | LH-01 bước 1 |
| `khach_hang_id` | FK → `Khach_Hang` | `*` | ✳ | Khách có lịch hẹn | LH-01 bước 1 |
| `nguoi_lap_id` | uuid | `*` | ✳ | Người lập lịch — khách, hoặc nhân viên đặt hộ; tham chiếu logic tới người dùng của phân hệ ngoài | LH-01 bước 1 · `QC01 Đ6.3` Người đặt hộ không tự duyệt |
| `ngay_hen` | date | `*` | ✳ | Ngày khách muốn gặp, theo giờ Việt Nam | LH-01 bước 1 |
| `so_nguoi` | int | `*` · 1–3 | ✳ | Số người đến hẹn, tính cả khách | LH-01 bước 1 · `QC01 Đ5.2` Tối đa 3 người mỗi lịch |
| `trang_thai` | enum | `*` | ✳ | `DRAFT` Nháp · `PENDING_APPROVAL` Chờ duyệt · `APPROVED` Đã duyệt · `COMPLETED` Đã đến hẹn · `REJECTED` Từ chối · `CANCELLED` Đã hủy — máy trạng thái chờ lớp 4 (sau lớp 4: SM mục 2) | LH-01 |
| `ly_do_tu_choi` | text | `◐` khi `trang_thai` = `REJECTED` | ✳ | Lý do nhân viên từ chối | LH-01 bước 4 |
| `huy_muon` | boolean | `◐` khi `trang_thai` = `CANCELLED` | ✳ | Đúng nếu khách hủy muộn hơn `CH-02` giờ trước giờ hẹn, lượt không được trả; ghi lúc hủy | LH-02 · `QC01 Đ7.2` Hủy sớm được trả lượt |
| `ten_nhan_vien_duyet` | varchar(100) | `◐` khi `trang_thai` ∈ {`APPROVED`, `REJECTED`} | ✳ | **Chụp** `ho_ten` của nhân viên duyệt từ phân hệ ngoài lúc duyệt | LH-01 bước 4 |

**Giá trị dẫn xuất Δ** — một dòng sau bảng, cho mỗi giá trị suy ra được từ thực thể này:

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tên | Tên giá trị, `snake_case`, **không** nằm trong bảng trường | `so_luot_con` | Thêm một cột vào bảng trường cho Δ |
| Công thức truy vấn | Cách tính từ các cột và bảng đã có | `= CH-01 − Quy_Luot.da_dung` theo (`khach_hang_id`, `tuan`). Viết đủ: Σ, đếm, điều kiện lọc, múi giờ | Công thức mơ hồ "tính theo quy định" |
| `GS-xx` | Quy tắc dùng chung làm căn cứ tính | `GS-xx` kèm tên ngắn | Để trống |

Thực thể không có giá trị dẫn xuất thì **bỏ dòng** (dòng Δ là phần của khối thực thể; quy ước trống ở đầu file).

### Mục 4.n — Danh mục mã enum

**Định nghĩa:** một bảng gom mọi enum của tài liệu, để seed dữ liệu và dịch giao diện. Mỗi mã xuất hiện **một lần** ở đây và **một lần** ở cột Mô tả của trường dùng nó; hai nơi phải khớp.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Enum | Tên kiểu liệt kê | `snake_case`, thường trùng tên trường: `trang_thai_lich_hen` (khi hai bảng đều có `trang_thai`, thêm hậu tố bảng) | Cùng tên cho hai enum khác nhau |
| Mã | Giá trị lưu | `` `PENDING_APPROVAL` `` — `UPPER_SNAKE`, **tiếng Anh**, mô tả được ý nghĩa nghiệp vụ, không đổi nghĩa sau phát hành | Tên Việt không dấu; mã số (`1`, `2`); mã `OTHER` khi quy trình chưa có khái niệm |
| Tên hiển thị | Tên Việt cho giao diện | Đúng chữ ở quy trình mục 1.1 hoặc ở máy trạng thái (**nghiệp vụ theo quy trình**, mã theo ERD): `Chờ duyệt` | Câu dài; chữ khác quy trình |
| Dùng ở | Bảng và trường dùng enum này | `` `Lich_Hen.trang_thai` ``; nhiều nơi thì liệt kê hết cách nhau `·` | Bỏ sót nơi dùng |

Số thứ tự của mục này là **mục kế tiếp sau nhóm cuối** (template viết `4.x`): có ba nhóm thì là `4.4`.

---

## Mục 5 — Ràng buộc liên bảng và đối soát

**Định nghĩa:** những điều **luôn phải đúng giữa nhiều bảng** mà không một cột đơn lẻ nào diễn đạt được, cùng cách dữ liệu trỏ đa hình và trạng thái cha suy từ con. Cách chọn loại và viết `R-xx`: [`rang-buoc-va-dan-xuat.md`](rang-buoc-va-dan-xuat.md).

### 5.1 — Đẳng thức và ràng buộc toàn vẹn

| Ô / cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Câu mở đầu — `{{Tác vụ N-xx}} kiểm…` | Tác vụ nền chạy **đối soát định kỳ** | `N-03 Đối soát quỹ lượt` (thế giới xuyên suốt). Giữ cụm *lệch thì cảnh báo, **không tự sửa*** cho các dòng loại Đối soát; thêm ngay sau một câu: các dòng chặn khi ghi ghi bước kiểm ở cột Nguồn (T17) | Ghi "hệ thống tự sửa lệch"; để `{{ }}` khi chưa có tác vụ — khi đó ghi `chưa chốt (BA)` kèm `Q-E`, vì một `R-xx` không ai kiểm là lời hứa suông |
| Mã | `R-01`, `R-02`… | Liên tục; mã bỏ không dùng lại | Một mã cho hai ràng buộc |
| Đẳng thức hoặc ràng buộc | **Một** phát biểu kiểm được, viết bằng tên bảng, tên trường | `` `Quy_Luot.da_dung` = số `Lich_Hen` trong tuần ở `PENDING_APPROVAL`, `APPROVED`, `COMPLETED`, cộng số `Lich_Hen` ở `CANCELLED` có `huy_muon` = đúng, theo (`khach_hang_id`, tuần) ``. Có phạm vi lọc, có đơn vị so (theo trung tâm nào, tuần nào) | Phát biểu nghiệp vụ thuần ("mỗi khách chỉ đặt một lịch hẹn mỗi tuần" — thuộc BR); cụm "đúng", "hợp lệ" không đo được |
| Loại | **Một** trong năm: Đối soát · Duy nhất · Loại trừ · Tách nhiệm · Khớp trạng thái | Đối soát: tổng/đếm bảng A bằng bảng B. Duy nhất: duy nhất **qua nhiều bảng** hoặc có điều kiện lọc. Loại trừ: hai thứ không cùng tồn tại. Tách nhiệm: **phép kiểm dữ liệu** — hai cột vai phải khác nhau trên cùng bản ghi (`nguoi_duyet_id` ≠ `nguoi_lap_id`), không phát biểu ai được làm gì; nội dung ở BR. Khớp trạng thái: trạng thái bảng này buộc theo bảng kia | Loại thứ sáu; "Toàn vẹn chung" |
| Nguồn | Căn cứ **và ai kiểm**: `GS-xx`, `D-xx`, điểm kiểm soát, điều khoản, `GD-xxxx`; sau lượt điền ngược thêm mã BR (một hoặc nhiều, cách `·`) | Đối soát định kỳ: `GS-xx` kèm tên ngắn · kiểm bởi `N-03`. Ràng buộc chặn khi ghi (Duy nhất, Loại trừ, Tách nhiệm): `GS-xx` kèm tên ngắn · chặn khi ghi ở `LH-01 bước 4`. Phân biệt hai cách: [`rang-buoc-va-dan-xuat.md`](rang-buoc-va-dan-xuat.md) mục 3 | Trống; thiếu ai kiểm; nguồn là prototype |

**Thứ tự khóa** — một đoạn văn: khi một thao tác ghi nhiều bảng, khóa chúng theo thứ tự cố định để hai thao tác song song không khóa chéo. Ví dụ: *"Khóa `Khach_Hang` → `Quy_Luot` → `Lich_Hen`, trong mỗi bảng theo `id` tăng dần."* Dòng này luôn giữ: có nội dung khi có thao tác khóa nhiều bảng, không thì ghi *Không có thao tác khóa nhiều bảng*.

### 5.2 — Khóa ngoại đa hình

**Định nghĩa:** bảng ánh xạ cho mỗi cột (loại, id) trỏ được tới nhiều bảng khác nhau. Trả lời *khi cột loại bằng X thì cột id trỏ vào bảng nào*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `loai_chung_tu` | Mỗi giá trị enum của cột loại, mỗi giá trị một dòng | `` `LICH_HEN` `` — mã trùng dòng ở danh mục enum (4.n) | Giá trị không có trong danh mục enum |
| `chung_tu_id →` | Bảng mà `chung_tu_id` trỏ tới khi loại này | `` `Lich_Hen` `` | Tên bảng chưa có ở mục 2 |
| `chung_tu_chi_tiet_id →` | Bảng **dòng** của chứng từ đó, hoặc `n/a` khi không có dòng | `` `Lich_Hen_Dich_Vu` `` hoặc `n/a` | `—` cho "chưa biết" |

Tên ba cột trong template là **mẫu**. Khi dự án có khóa đa hình khác (ví dụ `loai_doi_tuong` / `doi_tuong_id` của nhật ký), **đổi tên cột tiêu đề** cho đúng bảng thật và lặp bảng cho mỗi cặp. Không có khóa đa hình nào thì ghi *Không có khóa ngoại đa hình* và xóa bảng mẫu.

### 5.3 — Trạng thái suy từ bảng con

**Định nghĩa:** dùng khi trạng thái của một bản ghi cha **được tính** từ trạng thái các dòng con. Mỗi dòng của bảng là một trạng thái, cột Điều kiện nói khi nào bản ghi cha ở trạng thái đó; **xét từ trên xuống, dòng đầu tiên đúng thì dừng**.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Trạng thái bảng cha | Mã enum của cha, kèm tên Việt | `` `PARTIAL` Một phần `` | Mã không có trong danh mục enum |
| Điều kiện | Điều kiện trên dòng con, **chứa đủ mọi trường hợp** và không chồng nhau theo thứ tự xét | *"Có ít nhất một dòng con ở `APPROVED` và có ít nhất một dòng con **không** ở `APPROVED`"* — nói rõ thứ tự xét ở dòng đầu bảng nếu điều kiện chưa loại trừ nhau | Điều kiện chồng nhau mà không nói thứ tự; bỏ sót trường hợp rỗng (cha chưa có dòng con) |

Không có trạng thái nào suy từ con thì ghi *Không có trạng thái suy từ bảng con* và xóa bảng.

---

## Mục 6 — Thực thể bỏ, đổi tên

**Định nghĩa:** nhật ký xử lý với thực thể của bản vẽ gốc mà **không** còn nguyên trong ERD này. Trả lời *bảng nào của bản vẽ đã biến mất hay đổi tên, vì sao*. Không có bản vẽ gốc thì mục này ghi *Không có bản vẽ gốc* (`00_quy_uoc_chung.md` mục 11). Lý do không lưu của thứ quy trình nhắc tới ghi ở bảng *Không lưu* cuối mục 2, không ghi ở đây.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Thực thể | Tên bảng **của bản vẽ gốc** | Trong backtick, đúng chữ bản vẽ | Tên mới ở cột này |
| Xử lý | Đúng **một** trong `Bỏ` · `Đổi tên thành \`X\`` · `Gộp vào \`Y\`` | In đậm chữ hành động. Đổi tên và gộp luôn kèm tên bảng đích có ở mục 2. Bỏ thì ghi ⊘ ở đầu dòng | Xử lý nửa vời ("xem lại"); gộp vào bảng không có ở mục 2 |
| Nguồn | Vì sao: `D-xx` · điều khoản · `GD-xxxx` | `D-xx` kèm tên ngắn; ngoài phạm vi quy trình thì nói rõ | Lý do chung chung ("không cần") |

Thực thể đã bỏ ở bản ERD trước rồi nay bỏ tiếp: không xóa dòng — thêm dòng mới (mã đã bỏ không dùng lại; `00_quy_uoc_chung.md` mục 9).

---

## Mục 7 — Điểm ERD khác hoặc bổ sung so với bản vẽ và quy trình

**Định nghĩa:** danh sách mọi chỗ ERD **khác bản vẽ** hoặc **thêm điều quy trình chưa nêu**, cần BA xác nhận. Điểm chạm nghiệp vụ thì sửa thân quy trình, không sửa ở đây. Không có bản vẽ: dòng đầu *Không có bản vẽ gốc*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `E-01`, `E-02`… | Theo thứ tự phát hiện; mã đã bỏ không dùng lại | Mã trùng lại sau khi bỏ |
| Điểm | **Một** khác biệt cụ thể: bảng nào, trường nào, đổi gì | *"`Lich_Hen` thêm `so_nguoi` (bản vẽ chưa có) — quy trình D-xx nêu giới hạn người đi cùng"* | Hai điểm một dòng; "cải tiến chung" |
| Đề xuất mặc định | Ứng xử ERD **đang áp dụng** nếu BA không phản hồi | Câu khẳng định. Khi BA chốt, thêm *BA chốt dd/mm/yyyy: …* vào cùng ô | Câu hỏi bỏ ngỏ (câu hỏi sang mục 8) |
| Ảnh hưởng quy trình | `Có — {{GS-xx}}` hoặc `Không` | Có thì nêu mã `GS-xx` hoặc `D-xx` ở quy trình **phải sửa**, và báo người viết lớp 2 | `Có` mà không nói mã; `Không` cho điểm đổi tên trường nghiệp vụ |

---

## Mục 8 — Câu hỏi cần BA chốt

**Định nghĩa:** những điểm **chưa ai trả lời** mà ERD không đi tiếp được hoặc đang dựa vào đề xuất. Khác `GD-xxxx` (câu trả lời tạm đã được chấp nhận) — phân biệt ở [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 4.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `Q-E1`, `Q-E2`… | Tiền tố `Q-E` giữ đúng template | `Q-1` |
| Câu hỏi | Một câu hỏi có thể trả lời bằng chọn A hoặc B | *"Lịch hẹn bị hủy trước 24 giờ có xóa dòng `Quy_Luot` đã trừ không, hay ghi thêm dòng hoàn?"* | Hai câu một ô; câu "OK không?" |
| Kịch bản | Ví dụ **số** và **thời điểm** làm lộ vấn đề | *"Lịch ngày 03/11 chưa có giờ hẹn, khách hủy lúc 16:00 ngày 02/11: hạn 24 giờ tính từ 00:00 hay từ giờ hẹn?"* (số minh họa) | Trừu tượng |
| Đề xuất mặc định | Phương án ERD đang dùng khi chưa có trả lời | *"Xóa dòng `Quy_Luot` và ghi lại khi hủy sớm"* — đủ cụ thể để dev làm theo | "Chờ BA"; để trống |
| Người chốt | Người có thẩm quyền trả lời câu hỏi này | Tên vai hoặc người; không biết thì `chưa chốt (<ai>)` | AI tự điền tên người |
| Quyết định | `✅ BA chốt DD/MM/YYYY: …` khi đã chốt; chưa chốt thì bỏ trống có chủ đích hoặc ghi *Đang mở* | Khi chốt, sửa thân tài liệu rồi mới ghi ✅ | Ghi ✅ khi thân tài liệu chưa sửa |

Bảng đủ sáu cột theo `00_quy_uoc_chung` mục 6 ([`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6). Không còn câu hỏi nào thì ghi *Không còn câu mở*.

---

## Mục 9 — Dữ liệu nhạy cảm

**Định nghĩa:** danh sách trường mà lộ hoặc sửa trái phép gây hại, kèm cách bảo vệ. Theo phân loại thông tin ISO/IEC 27001:2022 A 5.12, quản trị dữ liệu DAMA-DMBOK 2, và dữ liệu cá nhân theo Luật Bảo vệ dữ liệu cá nhân 2025 và NĐ 13/2023/NĐ-CP mà template dẫn (cá nhân nhạy cảm: NĐ 13 Điều 2 khoản 4 — T19). **Trước khi dẫn** xác nhận văn bản còn hiệu lực; Luật có hiệu lực cao hơn NĐ, đầu vào có định nghĩa của Luật thì ưu tiên; không tự khẳng định NĐ 13 đã bị thay ([`rang-buoc-va-dan-xuat.md`](rang-buoc-va-dan-xuat.md) mục 6, bước 0). Chi tiết cách phân loại: [`rang-buoc-va-dan-xuat.md`](rang-buoc-va-dan-xuat.md).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Dữ liệu | Tên loại dữ liệu bằng ngôn ngữ nghiệp vụ | `Số căn cước của khách` | Tên cột kỹ thuật |
| Bảng · trường | Nơi lưu | `` `Khach_Hang.so_cccd` `` — **mọi** nơi lưu, kể cả bản chụp: `` `Lich_Hen.so_cccd_chup` `` | Chỉ nơi gốc |
| Loại | `Cá nhân cơ bản` · `Cá nhân nhạy cảm` · `Tài chính` · `Nội bộ` | Một trường vừa cá nhân vừa tài chính thì ghi cả hai cách nhau `·`. Phân loại theo văn bản dự án đã xác nhận; **không tự suy** loại nhạy cảm — ghi ❓ kèm `Q-E` nếu chưa chắc | Loại ngoài bốn giá trị |
| Mức | `Cao` · `TB` · `Thấp` | Theo thang phân loại của **dự án** (A 5.12). Cá nhân nhạy cảm không thấp hơn `Cao` trừ khi có `GD-xxxx` | Mức bịa khi dự án chưa có thang — ghi `chưa chốt (<ai>)` |
| Ai được xem | Danh sách vai | Đúng tên tác nhân ở quy trình mục 2: *"Nhân viên tiếp đón; Giám đốc trung tâm"* | "Người có quyền" |
| Xử lý — che, mã hóa, không lưu | Biện pháp cụ thể | `Che 6 số giữa khi hiển thị` · `Mã hóa khi lưu` · `Không lưu — chỉ chụp 4 số cuối`. Dữ liệu chỉ cần để kiểm tra lúc đó thì ưu tiên **không lưu** | Biện pháp chung chung ("bảo mật cao") |

Dòng **Thời hạn lưu trữ**: ghi quy định lưu trữ của dự án hoặc điều khoản (`{Văn bản} Đ{điều}.{khoản}`). Chưa có thì `chưa chốt (<ai>)` — **không** để nguyên `{{ }}` và không bịa số năm. Mỗi thực thể chứa dữ liệu cá nhân nên có thời hạn riêng hoặc được dòng này bao phủ rõ. `Nhat_Ky_Thay_Doi` có dòng riêng nếu ghi giá trị cũ của dữ liệu cá nhân: che giá trị, chỉ ghi tên trường, hoặc thời hạn lưu riêng — hoặc `Q-E` ([`rang-buoc-va-dan-xuat.md`](rang-buoc-va-dan-xuat.md) mục 6).

---

## Mục 10 — Rủi ro còn lại

**Định nghĩa:** những rủi ro đã biết mà ERD chưa loại bỏ được, kèm biện pháp — theo `00_quy_uoc_chung` mục 6; vị trí mục ở [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6. Khác `Q-E` (chưa ai trả lời) và `GD-xxxx` (tạm coi là đúng).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `RK-01`, `RK-02`… | Liên tục (`00_quy_uoc_chung` mục 4) | Mã trùng |
| Rủi ro | Một rủi ro, một câu | *"Hạn mức tuần đổi thì dòng `Quy_Luot` cũ lệch"* | Rủi ro chung chung ("dữ liệu có thể sai") |
| Căn cứ bị ảnh hưởng | `E-xx`, `Q-E`, `R-xx`, bảng, `GD-xxxx` mà rủi ro chạm tới | `` `Quy_Luot` · R-01 · Q-E2 `` | Để trống |
| Mức | `C` · `TB` · `T` | Một trong ba | `Cao`, `Thấp` viết đủ chữ |
| Biện pháp | Việc đã hoặc sẽ làm để giảm rủi ro | *"Đối soát định kỳ `N-03`"* | "Theo dõi" không nói ai, khi nào |
| Cần khách xác nhận văn bản | `Có` · `Không` | `Có` khi muốn dùng văn bản của khách làm căn cứ | Để trống |

Không có rủi ro nào thì giữ mục và ghi *Không có*.

---

## Mục 11 — Điểm tạm hoãn

**Định nghĩa:** việc đã rõ, đã hiểu, nhưng cố ý chưa làm ở phiên bản này, kèm điều kiện mở lại (`00_quy_uoc_chung.md` mục 6). Khác câu hỏi, giả định, rủi ro.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `TH-01`, `TH-02`… | Liên tục | Mã trùng |
| Nội dung | Việc hoãn | *"Chưa lập thực thể lịch sử hạn mức tuần"* | Việc chưa hiểu — đó là `Q-E` |
| Ngày tạm hoãn | `DD/MM/YYYY` | Ngày BA đồng ý hoãn; không biết thì `chưa chốt (<ai>)` | AI tự điền ngày |
| Điều kiện mở lại | Sự kiện hoặc mốc cụ thể | *"Khi khách ban hành quy định hạn mức theo bậc"* | "Khi cần" |

Không có thì giữ mục và ghi *Không có*.

---

## Mục 12 — Nguồn

**Định nghĩa:** các tài liệu ERD dựng từ đâu, dùng cho phần nào — theo `00_quy_uoc_chung` mục 6. Mục này là mục cuối của template, số 12.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tài liệu | Link tương đối | Quy trình nguồn; bản vẽ nguồn (nếu có); văn bản pháp luật **lần đầu dẫn** — khai viết tắt ở đây (`QC01 = Quy chế …`, minh họa) | Tài liệu chưa dẫn lần nào trong thân |
| Dùng cho | Phần của ERD dùng nguồn đó | *"Thuật ngữ, dữ liệu trục, GS-xx, D-xx"* (quy trình) · *"Tên bảng, tên trường gốc"* (bản vẽ) | Để trống |

Văn bản đã rà toàn văn mà không sinh thực thể nào: vẫn ghi một dòng *đã rà toàn văn, không sinh thực thể* kèm lý do (`so-cu-va-gia-dinh.md` mục 2).

---

## Chỗ template lệch hoặc tự mâu thuẫn

Thứ bậc: `00_quy_uoc_chung` → template → skill. Dưới đây là chỗ template **không nói rõ** hoặc lệch; skill chọn cách xử lý để người viết khỏi tự đoán. Không điểm nào nói khác `00_quy_uoc_chung.md`.

Template đã có sẵn dòng Thông tin tài liệu, bảng Phê duyệt, câu "không chứa gì", bảng câu hỏi sáu cột, mục 10 Rủi ro còn lại, mục 11 Điểm tạm hoãn — các khối này không còn là chỗ thiếu (T1–T4 cũ đã bỏ). Số T giữ nguyên để khỏi đánh lại: T5 trở đi là chỗ riêng của ERD.

| # | Chỗ | Vấn đề | Cách xử lý của skill |
|---|---|---|---|
| T5 | `🧪` | Mục 1 nói "xem mục 7" nhưng không nói đặt ở cột nào | Đặt cạnh ✳ ở cột `Thay đổi` / `Đổi`, và có `E-xx` |
| T6 | Cột `Nhóm` ở mục 2 | Template không định nghĩa nhóm | Nhóm = một sơ đồ ở mục 3.2 và một khối 4.k; theo cụm nghiệp vụ |
| T7 | Mục 5.2 | Ba tên cột `loai_chung_tu`, `chung_tu_id`, `chung_tu_chi_tiet_id` cứng | Đổi tên tiêu đề cột theo khóa thật; lặp bảng cho mỗi cặp |
| T8 | UK tổ hợp, khóa không phải `id` | Cột `Ràng buộc` không có chỗ cho "duyệt tổ hợp" | Ghi `UK(a, b) trong {{phạm vi}}` ở mọi cột thuộc tổ hợp; bảng không theo quy ước chung thì nói ở đoạn mô tả |
| T9 | Mục Dữ liệu nhạy cảm, cột `Loại` | Một giá trị trong khi trường có thể thuộc hai loại | Cho phép hai giá trị cách nhau `·` |
| T10 | Mục 3 và mục 4 | Cùng nhắc trường, dễ lệch | Mục 4 thắng; mục 3 chỉ giữ khóa và cột trạng thái |
| T11 | Ma trận CRUD | Bài giới thiệu có CRUD đầy đủ; template chỉ có phía ghi | Chấp nhận: phía đọc thuộc quy trình và use case. Ghi rõ ở cột `Quy trình ghi` đây là **ghi**, không phải đọc |
| T12 | Tên mục `4.x` | Placeholder | Dùng số kế tiếp sau nhóm cuối |
| T13 | Bản vẽ gốc | Template giả định có | Không có thì theo `00_quy_uoc_chung.md` mục 11, và xóa câu 2 của khối giới thiệu |
| T14 | Đặt tên | Template: bảng, trường tiếng Việt không dấu; enum tiếng Anh. Có người đọc "tiếng Anh" áp cho cả ba | Theo template: **chỉ enum** tiếng Anh |
| T15 | Mức mô hình | Template ghi "ANSI/SPARC ba mức — tài liệu này là mức LOGICAL". ANSI/SPARC chia external–conceptual–internal, không phải conceptual–logical–physical | Viết "mức logical (theo phân mức mô hình dữ liệu conceptual–logical–physical)"; ô `Mức mô hình` vẫn ghi `Logical` |
| T16 | Thứ quy trình nhắc mà ERD không lưu | Template chỉ có mục 6 cho thực thể của bản vẽ gốc; lý do "không lưu" của chứng từ, sổ, Δ không có chỗ ghi | **Thêm** bảng *Không lưu* ở cuối mục 2 (bổ sung của skill, template chưa có) |
| T17 | Mục 5.1 | Câu mở đầu "tác vụ `N-xx` kiểm; lệch thì cảnh báo, không tự sửa" áp cho cả bảng, không đúng với ràng buộc chặn khi ghi; không có chỗ ghi ai kiểm | Giữ câu cho dòng Đối soát; thêm câu cho dòng chặn khi ghi; ghi ai kiểm ở cột Nguồn (`kiểm bởi N-03` · `chặn khi ghi ở LH-01 bước 4`) |
| T18 | Trường bản vẽ gốc bị bỏ | Template chỉ có ⊘ cho thực thể ở mục 6, không có chỗ cho trường | Dòng ⊘ ở cuối bảng trường, kèm nguồn (xem cột `Đổi`) |
| T19 | Chỗ template dẫn văn bản pháp luật | Comment của mục nhạy cảm dẫn NĐ 13/2023 Điều 2 khoản 4; phần chuẩn tham chiếu dẫn thêm Luật Bảo vệ dữ liệu cá nhân 2025 | Giữ cả hai như template dẫn; xác nhận hiệu lực trước khi dẫn, ưu tiên định nghĩa của Luật khi đầu vào có |
