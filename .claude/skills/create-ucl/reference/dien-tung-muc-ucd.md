# Điền từng mục của `use_case_diagram.md`

Phần tra cứu của skill [`create-ucl`](../SKILL.md). Template: [`use_case_diagram.md`](../../../../2-ba-overview/templates/5-actor-usecase/use_case_diagram.md). Các mục theo **đúng thứ tự template**. Mã trong ví dụ là **mã minh họa**. Bóc tác nhân, phép thử, TAW: [`tac-nhan.md`](tac-nhan.md). Viết `UCD` mục 1 trước, rồi quay lại soát mục 1 (chính / phụ, mục 1.2) và viết mục 2 đến 4 sau khi `UCL` đã có dòng.

## Phần đầu file

**Định nghĩa:** tiêu đề, khối giới thiệu, bảng Thông tin tài liệu, Version control và Phê duyệt trả lời tài liệu này chứa gì, dựng từ đâu, đọc thế nào, không chứa gì, ai soạn và duyệt. Template đã có đủ các khối mà `00_quy_uoc_chung` mục 3 bắt buộc ([`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 3); điền theo template, không thêm khối.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `# TÁC NHÂN VÀ SƠ ĐỒ USE CASE — {{DỰ ÁN}} {{PHẠM VI}}` | Tên dự án và phạm vi | Khớp phần `{MÃ DỰ ÁN}_{PHẠM VI}` của tên file | "TEMPLATE —" còn sót |
| Khối giới thiệu, dòng 1 (số đếm) | Số tác nhân và số sơ đồ | "**4 tác nhân** — 2 người, 1 hệ thống ngoài, 1 tác nhân tác vụ nền — và **3 sơ đồ use case** theo module." Template chỉ nêu "người" và "hệ thống ngoài"; thêm loại Thời gian để tổng khớp danh mục | Số cũ không khớp mục 1 và 3 |
| Khối giới thiệu, dòng 2 (nguồn) | Hai link: quy trình mục 2 và `UCL` | Tên file thật của hai tài liệu dự án | Link tới template |
| Khối giới thiệu, dòng 3 (phạm vi vẽ) | Sơ đồ vẽ mức nào | Giữ câu của template: sơ đồ chỉ vẽ use case 🌊; 🐟 liệt kê ở danh sách. Thêm nửa câu: "trừ khi 🐟 là đầu mút của «include» hoặc «extend»" | Hứa vẽ mọi use case |
| Mã tài liệu | `UCD_{MÃ}_{PHẠM VI}` | Theo `00_quy_uoc_chung` mục 2 | Chép lại tên template |
| Dự án · Phân hệ | Tên dự án và phân hệ, hai ô cách nhau `·` | Khớp `{MÃ DỰ ÁN}` của tên file | Để `{{}}` |
| Phiên bản · Trạng thái | `vNN` và một trong `Nháp · Chờ review · Đã duyệt · Hết hiệu lực` | Mục 3.2 của `00_quy_uoc_chung` | "Hoàn thành" |
| Người soạn · Người review · Người duyệt | Ba tên, một ô, cách nhau `·` | Người review điền sau khi reviewer độc lập chạy xong. Người soạn là người, không phải "Claude" | Để AI tự điền tên người duyệt |
| Mức mật | Một trong `Nội bộ · Hạn chế · Mật` | Chọn theo nội dung nhạy cảm nhất của tài liệu | Giá trị ngoài ba giá trị này |
| Quy trình nguồn · Dự toán nguồn | Phiên bản quy trình đã đọc; tên file dự toán | `v01` · `DT_…_v13_….xlsx`. Dự án không có dự toán thì ghi `n/a` | Để trống |
| Khối giới thiệu, dòng 4 (không chứa gì) | Câu `> Tài liệu **không** chứa …` của template | Giữ: luồng chi tiết của từng use case (đặc tả UC ở `/ba-detail`) và ma trận quyền chi tiết (SRS). Danh sách use case nằm ở `UCL` nên thêm "— xem `UCL`" nếu muốn dẫn | Bỏ câu; chép lại mà không kiểm vế nào đúng với dự án |
| Version control | Một dòng mỗi lần phát hành | Mẫu ở `00_quy_uoc_chung` mục 3.3; dòng hiện tại tô xanh. Mỗi quyết định BA ghi **BA chốt dd/mm/yyyy**. Lượt điền ngược ghi riêng một dòng | Kể lại các lần sửa giữa chừng |
| Phê duyệt — cột Vai trò | Ba dòng của template: BA soạn · Product owner / Khách hàng · Tech lead | Giữ nguyên | Xóa dòng, đổi tên vai |
| Phê duyệt — cột Họ tên | Tên người giữ vai | Để trống tới khi có người duyệt | Điền tên người chưa duyệt |
| Phê duyệt — cột Ngày | Ngày ký | `DD/MM/YYYY`; để trống tới khi duyệt | Ngày dự kiến |
| Phê duyệt — cột Ý kiến | Ý kiến người duyệt | Để trống tới khi duyệt | AI tự ghi ý kiến |

Phần "Phiên bản theo bảng Version control của `ba-overview`" là về skill; trong **file dự án**, bảng Version control là của tài liệu và tuân `00_quy_uoc_chung`.

## Mục 1 — Danh mục tác nhân

**Định nghĩa:** ai tương tác với hệ thống, ở vai nào, qua nền tảng nào, thuộc loại nào theo QĐ 671 — nguồn gốc của mọi cột trong ma trận.

Bảng có tám cột, mỗi dòng một tác nhân. Cách bóc và phép thử: [`tac-nhan.md`](tac-nhan.md).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `ACT-nn` | Hai chữ số, tăng dần theo thứ tự đưa vào danh mục. Không đánh lại. Mã bỏ ghi ở đầu bảng: *Các mã ACT-05 đã bỏ, không dùng lại.* | `ACT-1`, mã trùng |
| Tác nhân | Tên **vai trò** | Vai người: đúng chữ ở BRD mục 4 cột Bên liên quan (quy trình mục 2 giữ nguyên chữ đó). Tác nhân hệ thống và tác nhân không có trong BRD: đúng tên quy trình mục 2 đặt. Tác nhân hệ thống tác vụ nền: **Hệ thống** — tác vụ nền. Nhóm hoặc tổ chức tương tác như một bên cũng là tác nhân (`tac-nhan.md` mục 1) | Chức danh, tên người, đơn vị chỉ để phân phạm vi; tên tự đặt mà BRD và quy trình chưa có |
| Loại | `Người` · `Hệ thống ngoài` · `Thời gian`, rồi dấu chấm giữa và `Chính` hoặc `Phụ` (tác nhân Thời gian không cần ghi, luôn chính) | `Người · Chính`, `Hệ thống ngoài · Phụ`, `Thời gian`. Chính = khởi động ít nhất một use case | Ghi chính / phụ mà không kiểm `UCL` cột `Actor` |
| Thuộc đơn vị | Đơn vị mà vai thường thuộc về | Một cụm ngắn: "Trung tâm", "Ngoài trung tâm", "Bên thứ ba". Tác nhân Thời gian: `—`. Đây **chỉ là thông tin**, không phải phạm vi dữ liệu (phạm vi nằm ở ma trận) | Danh sách phòng ban dài |
| Mô tả — mục tiêu khi dùng hệ thống | Vai này **muốn đạt gì** | Một câu bắt đầu bằng động từ, liệt kê cụm việc chính: "Đăng ký lịch hẹn, hủy khi không đi được, theo dõi trạng thái" | Mô tả chức danh ("là nhân viên tiếp đón của trung tâm") |
| Nền tảng | `WEB` · `APP` · `KIOSK` · `API`, cách nhau bằng `·` | Chữ hoa đúng mã nền tảng ở `UCL` mục 1 (`WEB · APP · KIOSK · API · JOB`), mọi nơi viết một kiểu (lựa chọn của skill). Tác nhân Thời gian: `—` | Tên thiết bị cụ thể; `Web`, `App` viết thường |
| Phân loại QĐ 671 | `Đơn giản` · `Trung bình` · `Phức tạp`, hoặc `—` | Theo Phụ lục IV: API → Đơn giản; giao thức hoặc dòng lệnh → Trung bình; giao diện đồ họa → Phức tạp. Tác nhân Thời gian: `—` | Tự đặt trọng số |
| Căn cứ vai trò | Nguồn chứng minh vai này có thật | `LH-01 bước 1` · điều khoản phân công · `D-xx`. Nhiều nguồn cách nhau bằng `·`. Chưa có nguồn: ❓ và `Q-A…` | Căn cứ chung chung "theo quy trình" |

Dưới bảng, **một dòng** (xử lý chỗ template thiếu): *Bên liên quan không thao tác hệ thống: SH-01 Giám đốc trung tâm.* Không có thì ghi *Mọi bên liên quan ở BRD mục 4 đều thao tác hệ thống.*

### 1.1. Tổng quát hóa tác nhân

**Định nghĩa:** quan hệ "là một" giữa tác nhân con và tác nhân cha: con kế thừa mọi use case của cha. Bỏ mục này nếu không có.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Sơ đồ `flowchart BT` | Mỗi cặp con → cha | `A2["ACT-nn Tên con"] -->|là một| A1["ACT-nn Tên cha"]`. Mũi tên **từ con tới cha**. Nút ghi `ACT-nn Tên`, đặt trong ngoặc kép | Mũi tên ngược; nối hai vai chỉ trùng một phần |
| Không có tổng quát hóa | Một dòng | *Không có tổng quát hóa tác nhân* thay cho cả mục | Xóa mục không ghi gì |

Điều kiện dùng: [`tac-nhan.md`](tac-nhan.md) mục 6.

### 1.2. Tách nhiệm giữa tác nhân

**Định nghĩa:** các cặp thao tác không được do cùng một người làm trên cùng một bản ghi. **Liệt kê mọi cặp** ở quy trình mục 2 "Tách nhiệm bắt buộc" và mục 9 loại Tách nhiệm, **bất kể hai thao tác thuộc cùng hay khác tác nhân** (lý do: [`tac-nhan.md`](tac-nhan.md) mục 7).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Cặp thao tác không cùng một người | Hai thao tác nối bằng `≠` | Tên use case hoặc thao tác: "Gửi yêu cầu đặt lịch ≠ Duyệt lịch hẹn". Thêm nửa câu "trên cùng một bản ghi" khi hai thao tác thuộc **cùng** tác nhân, hoặc khi hai vai có thể cùng một người | Bỏ cặp vì hai thao tác thuộc hai tác nhân khác nhau |
| Căn cứ | Quy trình và BR | `QT_DA1_LichHen mục 9 điểm 2` · `QT mục 2 "Tách nhiệm bắt buộc"` · `R-xx` · điều kiện "khác người lập" ở `SM mục n`; điều khoản gốc (`QC01 Đ6.3`). Sau lượt điền ngược thêm `BR-A04 Người đặt hộ không tự duyệt` **trước** điều khoản, giữ điều khoản | Để trống |

Không có tách nhiệm thì một dòng: *Không có cặp tách nhiệm — quy trình mục 2 và mục 9 không quy định.*

### 1.3. Tổng điểm tác nhân — TAW

**Định nghĩa:** tổng điểm của các tác nhân theo QĐ 671 Phụ lục I, IV, dùng để tính điểm use case của dự toán.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Loại | Ba dòng cố định `Đơn giản · Trung bình · Phức tạp`, và dòng `TAW` | Giữ nguyên | Thêm dòng cho tác nhân `—` |
| Trọng số | 1 · 2 · 3 | Giữ nguyên | Đổi số |
| Số tác nhân | Số dòng ở mục 1 có phân loại đó | Một tác nhân nhiều nền tảng đếm **một** lần | Đếm tác nhân `—` |
| Điểm | Trọng số × số tác nhân | Dòng `TAW`: tổng số tác nhân và tổng điểm | Tổng sai so với dòng trên |

## Mục 2 — Sơ đồ tổng quan

**Định nghĩa:** một sơ đồ cho cả hệ thống, trả lời ai tương tác với phần nào của hệ thống. Vẽ **module**, không vẽ từng use case.

Ký hiệu Mermaid (khớp chú thích của template):

| Phần tử | Cú pháp | Ghi chú |
|---|---|---|
| Tác nhân người | `A1["👤 Tên"]` | Tên đúng mục 1 |
| Tác nhân hệ thống ngoài | `E1[["⚙ Tên"]]` | Hộp đôi |
| Tác nhân Thời gian | `T1[["⏱ Hệ thống — tác vụ nền"]]` | Template chưa có ký hiệu riêng; dùng hộp đôi và biểu tượng giờ |
| Use case hoặc module | `U1(["Tên"])` | Hình bầu dục |
| Ranh giới hệ thống | `subgraph SYS["Tên hệ thống"] … end` | Mọi use case ở **trong**; mọi tác nhân ở **ngoài** |
| Liên kết tác nhân – use case | `A1 --- U1` | Không mũi tên |

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Khối `flowchart LR` | Tác nhân bên trái, hệ thống ở giữa, hệ thống ngoài bên phải | Mỗi module là một nút trong khung; nối tác nhân tới module mà họ có use case; nối module tới hệ thống ngoài nếu module gọi ra | Vẽ use case lẻ ở sơ đồ này; mũi tên chỉ trình tự giữa module |
| Tên khung | Tên hệ thống | Tên theo BRD | Để mặc định `{{Hệ thống}}` |

## Mục 3 — Sơ đồ theo module

**Định nghĩa:** với mỗi module, một sơ đồ use case mức 🌊 và một bảng đối chiếu. Lặp khối `3.n` cho mỗi module.

**Chọn use case để vẽ.** Vẽ mọi dòng `UCL` mức 🌊 của module. 🐟 (tìm kiếm, xem chi tiết, kết xuất, chọn dùng chung) chỉ liệt kê ở `UCL`, **trừ khi** nó là đầu mút của một «include» hoặc «extend» — khi đó vẽ thêm đúng nút đó. Module có hơn khoảng 15 use case thì tách theo chức năng (cấp 4), mỗi chức năng một sơ đồ.

**Hai quan hệ.**

| | «include» | «extend» |
|---|---|---|
| Nghĩa | Use case gốc **luôn** gọi use case kia ở một bước | Một use case **tùy chọn, có điều kiện** gắn vào use case gốc |
| Hướng mũi tên | **Từ use case gốc → use case được gọi** (`U1 -. "«include»" .-> U2`) | **Từ use case mở rộng → use case gốc** (`U3 -. "«extend»" .-> U1`) |
| Dùng khi | Một bước của use case gốc đã là một use case có quyền riêng, kết quả riêng, và ≥ 2 use case dùng chung. Khớp bước `→ gọi UC <mã> <tên>` trong file UC của `create-uc` | Use case phụ do tác nhân kích hoạt được tại một điểm của use case gốc, use case gốc vẫn hoàn chỉnh không có nó, và nó có quyền và kết quả riêng |
| Ví dụ minh họa | "Gửi yêu cầu đặt lịch" «include» "Chọn khách hàng" (`DA1.WEB.02.01.05` — mã minh họa riêng của skill, ngoài bảng mã chuẩn) — dùng chung với use case khác | "Xem lịch sử lịch hẹn của khách hàng" «extend» "Duyệt lịch hẹn" khi nhân viên tiếp đón muốn xem trước khi quyết định |
| **Không dùng khi** | Để vẽ **trình tự**: "làm A rồi làm B". "Gửi yêu cầu" → "Duyệt yêu cầu" có khoảng chờ giữa hai người, đó là quy trình `LH-01`. Cũng không dùng cho một bước chỉ dùng một chỗ, không có quyền riêng — nó là bước, không phải use case | Để vẽ **nhánh** alternative hoặc exception của một use case ("hết lượt", "chọn khung giờ khác") — nhánh nằm trong file UC của `create-uc`, không phải ở sơ đồ. Cũng không dùng khi bên kia không tự là một use case |
| Ghi ở bảng | Không ghi điều kiện, vì luôn xảy ra | **Bắt buộc** ghi điều kiện: «extend» `<Mã gốc>` khi `<điều kiện>` |

Sai hướng là lỗi hay gặp nhất. Nhớ: include chỉ về nơi **được dùng**; extend chỉ về nơi **được thêm vào**.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `### 3.n. {{Mã module}} — {{Tên module}}` | Mã WBS cấp module và tên | `3.1. DA1.WEB.03 — Lịch hẹn` | Mã tự đặt khác `UCL` |
| Dòng **Quy trình liên quan** | Mã quy trình có use case thuộc module | `LH-01` · `LH-02`, theo cột `Ghi chú` của `UCL` | Cả danh sách quy trình của dự án |
| Dòng **Máy trạng thái** | Mục SM mà use case của module tác động | `SM mục 2`. Module không đổi trạng thái thực thể nào: `n/a` | Mã trạng thái chép lại |
| Khối `flowchart LR` | Sơ đồ module | Khung `subgraph SYS["DA1.WEB.03 — Lịch hẹn"]`, mỗi nút `U1(["DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch"])` mã **kèm tên**, tác nhân ngoài khung nối bằng `---` tới use case họ khởi động | Mã trơ không tên; tác nhân trong khung; use case chưa có dòng `UCL` |
| Cột **Use case** (bảng) | Mã và tên của use case **được vẽ** | `DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch`, khớp `UCL` | Tên lệch chữ với `UCL` |
| Cột **Tác nhân chính** | Tác nhân khởi động use case | `ACT-01 Khách`; khớp cột `Actor` của `UCL` | Hai tác nhân khác nhau làm hai việc khác nhau |
| Cột **Tác nhân phụ** | Tác nhân tham gia hoặc nhận kết quả | `ACT-04 Cổng SMS`. Không có: `n/a` | Để trống |
| Cột **Mức** | `🌊` hoặc `🐟` | Khớp `UCL`. `🐟` chỉ có khi nó là đầu mút include hoặc extend | `☁` (đó là cấp chức năng, không phải use case) |
| Cột **Quan hệ** | Quan hệ mà use case **ở dòng này** là điểm đi của mũi tên | include: `«include» <Mã> <Tên>`. extend: `«extend» <Mã gốc> <Tên> khi <điều kiện>`. Nhiều quan hệ thì mỗi quan hệ một dòng. Không quan hệ: `—` | Ghi điều kiện cho include; thiếu điều kiện cho extend; mũi tên sai chiều |

Ví dụ dòng điền (minh họa):

| Use case | Tác nhân chính | Tác nhân phụ | Mức | Quan hệ |
|---|---|---|:-:|---|
| DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch | ACT-01 Khách | n/a | 🌊 | «include» DA1.WEB.02.01.05 Chọn khách hàng |
| DA1.WEB.03.01.04 Duyệt lịch hẹn | ACT-02 Nhân viên tiếp đón | ACT-01 Khách (nhận kết quả) | 🌊 | — |
| DA1.WEB.03.01.09 Xem lịch sử lịch hẹn (mã minh họa riêng của skill) | ACT-02 Nhân viên tiếp đón | n/a | 🐟 | «extend» DA1.WEB.03.01.04 Duyệt lịch hẹn khi nhân viên tiếp đón cần đối chiếu lịch sử trước khi quyết định |

Use case do tác nhân Thời gian khởi động (như "Nhắc lịch hẹn" `DA1.JOB.03.02.01`) vẽ ở **module JOB tương ứng** với tác nhân `⏱ Hệ thống — tác vụ nền` ngoài khung. Module `03` có mặt ở cả `WEB` và `JOB` vẫn là **một** module (đếm một lần ở khối giới thiệu), chỉ tách sơ đồ theo nền tảng; mã nền tảng và số chức năng theo G2 ([`boc-uc-va-wbs.md`](boc-uc-va-wbs.md) mục 5).

## Mục 4 — Ma trận tác nhân × use case

**Định nghĩa:** với mỗi cặp tác nhân và use case, tác nhân đó được làm gì, trong phạm vi dữ liệu nào. Đây là bản RBAC (ANSI INCITS 359-2004) của dự án và là đầu vào cho ma trận quyền ở SRS.

**Ký hiệu** (theo template): `C` tạo · `R` xem · `U` sửa · `D` xóa · `A` duyệt · `X` thao tác khác. Ngoài ra:

| Giá trị | Nghĩa |
|---|---|
| `—` | Hỏi rồi, **chắc chắn không được** làm. Khác ô trống |
| `❓ Q-A03` | Chưa có căn cứ, đã ghi câu hỏi. AI dùng dạng này, không tự điền ký hiệu |
| `chưa chốt (<ai>)` | Biết là cần quyết, đang chờ người đó |

**Mỗi ô phải có giá trị.** Ô trống không có nghĩa là không được — nó nghĩa là chưa ai hỏi (bài giới thiệu lớp Who). Template ví dụ để ô trống; file dự án không được.

**Ghi phạm vi trong ô.** Mọi ô có ký hiệu kèm phạm vi dữ liệu sau dấu chấm giữa: `R · trung tâm mình`, `A · trung tâm mình`, `R · toàn khu vực`, `C R · của mình`. Phạm vi lấy theo cấp quản lý ở BRD và văn bản thẩm quyền; dùng **cùng một bộ từ** ở cả ma trận và mục 2 `Phạm vi dữ liệu` của UC. Hệ thống không phân biệt phạm vi (một trung tâm, một cấp): ghi `toàn hệ thống`. Ô tác nhân Thời gian: `X · toàn hệ thống`.

**Ký hiệu cho thao tác duyệt.** Đúng theo template: `A` chỉ là **duyệt**; mọi thao tác khác của luồng — từ chối, trả về, gửi duyệt, hủy, kết xuất — là `X`.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Cột **Use case** | **Mọi** dòng use case của `UCL` (lá cấp 5, trừ ⊘), mã kèm tên | `DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch`. Thứ tự theo `UCL`. Ma trận liệt kê cả 🐟, khác sơ đồ vì mỗi use case là một permission key | Chỉ liệt kê use case 🌊 (như sơ đồ); dòng cấp chức năng |
| Cột **ACT-nn** (một cột mỗi tác nhân ở mục 1) | Giá trị theo bảng ký hiệu | `C · của mình`, `—`, `❓ Q-A03` | Ô trống; tên tác nhân thay cho mã ở tiêu đề cột |
| Tác nhân hệ thống ngoài **gọi vào** | Ký hiệu như tác nhân khác | Ghi ở ô: `X · toàn hệ thống` | Bỏ cột vì "không phải người" |

Ví dụ minh họa:

| Use case | ACT-01 Khách | ACT-02 Nhân viên tiếp đón | ACT-03 Hệ thống — tác vụ nền | ACT-04 Cổng SMS |
|---|:-:|:-:|:-:|:-:|
| DA1.WEB.03.01.01 Lưu nháp lịch hẹn | C · của mình | — | — | — |
| DA1.WEB.03.01.02 Sửa lịch hẹn nháp | U · của mình | — | — | — |
| DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch | X · của mình | — | — | — |
| DA1.WEB.03.01.04 Duyệt lịch hẹn | — | A · trung tâm mình | — | — |
| DA1.WEB.03.01.05 Từ chối lịch hẹn | — | X · trung tâm mình | — | — |
| DA1.WEB.03.01.06 Hủy lịch hẹn | X · của mình | ❓ Q-A02 | — | — |
| DA1.WEB.03.01.07 Xem danh sách lịch hẹn | R · của mình | R · trung tâm mình | — | — |
| DA1.JOB.03.02.01 Nhắc lịch hẹn | — | — | X · toàn hệ thống | — |
| DA1.JOB.03.02.02 Chốt lịch đã qua ngày hẹn | — | — | X · toàn hệ thống | — |

Khi đủ ô, **đọc ma trận theo hàng** (mỗi use case có tối thiểu một tác nhân khác `—` và khớp cột `Actor` của `UCL`) và **theo cột** (mỗi tác nhân có ít nhất một ô khác `—`; không thì nó không phải tác nhân). Hai chiều đều trượt thì `UCD` và `UCL` đang lệch nhau.

## Mục 5 — Câu hỏi cần chốt

**Định nghĩa:** những điểm của `UCD` chưa ai trả lời, mỗi điểm một dòng, kèm đề xuất mặc định để BA chỉ cần duyệt. Template đã có đủ sáu cột theo `00_quy_uoc_chung` mục 6 (Mã · Câu hỏi · Kịch bản · Đề xuất mặc định · Người chốt · Quyết định); số mục và vị trí các khối cuối: [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6. Quy trình: ❓ và `Q-…` ở [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 4. AI **không** tự tạo `GD-xxxx`.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `Q-A01`… | Tiền tố `Q-A` cho `UCD` (xem mục "Mã và tên" của phần lõi) | Mã trùng với `Q-U…` ở `UCL` |
| Câu hỏi | Câu hỏi một ý | "Nhân viên tiếp đón có được hủy lịch thay Khách không?" | "Chưa rõ quyền hủy" |
| Kịch bản | Tình huống cụ thể khiến câu hỏi nảy ra | "Khách gọi điện báo không đi được, lịch ở `APPROVED`, còn 30 giờ nữa là tới ngày hẹn (ô `Hủy lịch hẹn` × nhân viên tiếp đón)" | Bỏ trống, hoặc chép lại câu hỏi |
| Đề xuất mặc định | Câu trả lời mặc định | "Không. Chỉ Khách hủy; nhân viên tiếp đón dùng Từ chối." | Để trống — AI phải đề xuất |
| Người chốt | Người có thẩm quyền | Tên người | "BA" chung chung |
| Quyết định | Kết quả khi đã chốt | `✅ dd/mm/yyyy: …`; chưa chốt thì để trống | Xóa dòng đã chốt |

Không còn câu mở thì ghi một dòng *Không còn câu mở*.

## Mục 6 — Rủi ro còn lại

**Định nghĩa:** rủi ro **còn lại sau biện pháp** đã tính, làm yếu một căn cứ của `UCD` — ví dụ một ô ma trận dựa trên văn bản chưa chắc, một tên vai chờ lớp 2 sửa. Khối bắt buộc theo `00_quy_uoc_chung` mục 6; mã `RK-nn`. Không có thì ghi *Không có rủi ro còn lại*, không bỏ mục.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `RK-nn` | Hai chữ số, duy nhất trong tài liệu | Mã trùng |
| Rủi ro | Điều có thể xảy ra, nêu cả hậu quả | *Khách đổi quy định về hủy lịch, ma trận ô `Hủy lịch hẹn` sai* | Rủi ro không gắn căn cứ nào |
| Căn cứ bị ảnh hưởng | Mã bị yếu đi | `ACT-02 · Q-A02 · QT_DA1_LichHen mục 9 điểm 2` | Bỏ trống |
| Mức | `C · TB · T` (cao, trung bình, thấp) | Một giá trị; canh giữa | Mọi rủi ro cùng `TB` |
| Biện pháp | Việc đã làm hoặc sẽ làm để giảm | *Xin khách xác nhận bằng văn bản trước khi chốt lớp 6* | "Theo dõi" trơn |
| Cần khách xác nhận văn bản | `Có` hoặc `Không` | `Có` khi chỉ khách giải quyết được | Bỏ trống |

## Mục 7 — Điểm tạm hoãn

**Định nghĩa:** việc đã rõ, đã hiểu, nhưng cố ý chưa làm ở phiên bản này, kèm điều kiện mở lại — khác câu hỏi (chưa ai trả lời), giả định (tạm coi là đúng) và rủi ro (có thể xảy ra). Mã `TH-nn` do bộ skill đặt (`00_quy_uoc_chung.md` mục 6). Không có thì ghi *Không có điểm tạm hoãn*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `TH-nn` | Hai chữ số, duy nhất trong tài liệu | Mã trùng |
| Nội dung | Việc cố ý chưa làm | *Chưa dựng sơ đồ cho module báo cáo, chờ chốt phạm vi* | Câu hỏi còn mở (đó là `Q-A…`) |
| Ngày tạm hoãn | Ngày quyết định hoãn | `DD/MM/YYYY` | `YYYY-MM-DD` (dành cho Version control) |
| Điều kiện mở lại | Điều kiện kiểm chứng được | *Khi khách chốt phạm vi báo cáo* | "Khi có thời gian" |

## Mục 8 — Nguồn

**Định nghĩa:** những tài liệu `UCD` dựng từ và dùng cho phần nào. Văn bản pháp luật đã rà toàn văn mà không sinh nội dung cho `UCD` vẫn ghi kèm kết luận.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tài liệu | Đường dẫn tương đối | `../2-business-process/{file}` mục 2 · `../4-state-machine/{file}` · `../1-brd/{file}` mục 4 · `{file dự toán}` sheet `PL1&4.Actors` | Đường dẫn tới template |
| Dùng cho | Phần của `UCD` | "Tác nhân, tách nhiệm", "Chuyển 👤 → vai thao tác", "Phân loại tác nhân" | "Tham khảo" |

## Khối hướng dẫn trong template

Khi xong, **xóa toàn bộ** các khối `<!-- … -->` ở đầu file, đầu mục 1, mục 2, mục 3 và mục 4. Quy tắc phân loại QĐ 671, ký hiệu Mermaid, ký hiệu ma trận đã chuyển vào skill này.
