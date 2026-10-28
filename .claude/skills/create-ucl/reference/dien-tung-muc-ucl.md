# Điền từng mục của `use_case_list.md`

Phần tra cứu của skill [`create-ucl`](../SKILL.md). Template: [`use_case_list.md`](../../../../2-ba-overview/templates/5-actor-usecase/use_case_list.md). Các mục theo **đúng thứ tự template**. Mã trong ví dụ là **mã minh họa**. Cách bóc dòng và dựng cây: [`boc-uc-va-wbs.md`](boc-uc-va-wbs.md). Hạt của một dòng: [`create-uc`](../../create-uc/SKILL.md) mục "UC là gì", "Một UC to bằng nào".

## Phần đầu file

**Định nghĩa:** tiêu đề, khối giới thiệu và các khối hành chính cho biết danh sách này chứa gì, dựng từ đâu, không chứa gì, ai soạn. Template đã có đủ các khối mà `00_quy_uoc_chung` mục 3 bắt buộc ([`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 3); điền theo template, không thêm khối.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tiêu đề `# DANH SÁCH USE CASE — {{DỰ ÁN}} {{PHẠM VI}}` | Tên dự án và phạm vi | Khớp `{MÃ DỰ ÁN}_{PHẠM VI}` của tên file | "TEMPLATE —" còn sót |
| Khối giới thiệu, dòng 1 | Số đếm và mẫu mã | "**46 use case** trên **8 chức năng**, **3 module**, mã hóa theo cây WBS `{PHÂN HỆ}.{NỀN TẢNG}.{MODULE}.{CHỨC NĂNG}.{TÍNH NĂNG}`." Số lấy từ mục 2, **không đếm dòng ⊘** | Số lấy từ lần soạn trước |
| Khối giới thiệu, dòng 2 | Định nghĩa dòng | **Giữ câu của template** — đã viết theo G1 (giải thích ở [`SKILL.md`](../SKILL.md) mục "Lớp 5 là gì"): mỗi tính năng là một use case, một thao tác, một quyền, một kết quả, theo `create-uc` | Đổi lại thành "một mục tiêu trọn vẹn" (Cockburn) |
| Khối giới thiệu, dòng 3 | Hai link | Tới `UCD` dự án (tác nhân) và tới **BRD mục 12 Truy vết** thay cho ma trận truy vết (template dẫn `traceability_matrix.md` chưa có; xem `00_quy_uoc_chung.md` mục 11) | Link hỏng tới `traceability_matrix.md` |
| Khối giới thiệu, dòng 4 (không chứa gì) | Câu `> Tài liệu **không** chứa …` của template | Giữ: luồng chi tiết của từng use case (đặc tả UC ở `/ba-detail`, file UC của `create-uc`) và tiến độ thực hiện (Excel WBS) | Bỏ câu; chép lại mà không kiểm vế nào đúng với dự án |
| Mã tài liệu | `UCL_{MÃ}_{PHẠM VI}` | Theo `00_quy_uoc_chung` mục 2 | — |
| Dự án · Phân hệ | Tên dự án và phân hệ, hai ô cách nhau `·` | Khớp `{MÃ DỰ ÁN}` của tên file | Để `{{}}` |
| Phiên bản · Trạng thái | `vNN` và một trong `Nháp · Chờ review · Đã duyệt · Hết hiệu lực` | Mục 3.2 của `00_quy_uoc_chung` | "Hoàn thành" |
| Người soạn · Người review · Người duyệt | Ba tên, một ô, cách nhau `·` | Người review điền sau khi reviewer độc lập chạy xong | AI tự điền tên người duyệt |
| Mức mật | Một trong `Nội bộ · Hạn chế · Mật` | Chọn theo nội dung nhạy cảm nhất của tài liệu | Giá trị ngoài ba giá trị này |
| Dự toán gốc | Tên file dự toán, phiên bản, ngày | `DT_…_v13_20261016.xlsx` — phiên bản 13, ngày 16/10/2026. Dự án không có dự toán: `n/a`, và cột `Mã UC gốc` toàn `n/a` | Bỏ trống |
| Version control | Một dòng mỗi lần phát hành | Mẫu mục 3.3 của `00_quy_uoc_chung`. Lượt điền ngược ghi riêng một dòng | — |
| Phê duyệt — cột Vai trò | Ba dòng của template: BA soạn · Product owner / Khách hàng · Tech lead | Giữ nguyên | Xóa dòng, đổi tên vai |
| Phê duyệt — cột Họ tên | Tên người giữ vai | Để trống tới khi có người duyệt | Điền tên người chưa duyệt |
| Phê duyệt — cột Ngày | Ngày ký | `DD/MM/YYYY`; để trống tới khi duyệt | Ngày dự kiến |
| Phê duyệt — cột Ý kiến | Ý kiến người duyệt | Để trống tới khi duyệt | AI tự ghi ý kiến |

## Mục 1 — Quy ước mã

**Định nghĩa:** cách đọc một mã WBS, quy tắc không đánh lại, và nghĩa của các ký hiệu cột — để người đọc `UCL` hiểu mỗi dòng mà không phải hỏi.

| Ô | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Hình mã `{{DA1}} . {{WEB}} . {{01}} . {{04}} . {{01}}` | Mã ví dụ của chính dự án, năm khúc | Chọn một mã thật ở cấp 5, ví dụ `DA1.WEB.03.01.03`, và chú thích đúng năm cấp: Dự án + phân hệ · Nền tảng · Module · Chức năng · **Tính năng = Use case** (hai chữ số) | Chú thích còn câu "mục tiêu trọn vẹn" |
| Bảng "Cấp \| Ví dụ \| Ý nghĩa" (năm dòng) | Mỗi cấp một dòng với **tên thật** | `Phân hệ \| DA1 \| …`; `Nền tảng \| DA1.WEB \| WEB`; `Module \| DA1.WEB.03 \| Lịch hẹn`; `Chức năng \| DA1.WEB.03.01 \| Quản lý lịch hẹn`; `Tính năng — Use case \| DA1.WEB.03.01.03 \| Gửi yêu cầu đặt lịch` | Đổi tên cấp; thêm cấp thứ sáu |
| **Quy tắc** (mã không đánh lại · ⊘ · thứ tự) | Ba quy tắc, giữ nguyên chữ của template | *Mã đã phát hành không đánh lại. Tính năng bỏ đánh dấu ⊘ và giữ dòng. Thứ tự tính năng trong một chức năng: thêm → sửa → đổi trạng thái → xóa → tìm kiếm → xem chi tiết → kết xuất → nghiệp vụ riêng.* Thêm một dòng của G2: **mã UC là mã WBS này, không có tiền tố `UC-`**. Thêm tiếp: **module trải nhiều nền tảng giữ nguyên mã module; số chức năng duy nhất trong module, tính chung mọi nền tảng** (`DA1.WEB.03.01` rồi `DA1.JOB.03.02`; [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 8) | Giữ `UC-` ở trước mã |
| Ký hiệu cột — `Mức` | `☁ · 🌊 · 🐟` | Giữ nguyên. Chú thích thêm: chỉ để phân loại và chọn dòng vẽ lên sơ đồ; mọi lá là use case (G1) | Dùng `Mức` như thứ hạng ưu tiên |
| Ký hiệu cột — `BMT — QĐ 671` | `B · M · T` | **B** bắt buộc · **M** mong muốn · **T** tùy chọn | — |
| Ký hiệu cột — `Độ phức tạp — QĐ 671` | Ba ngưỡng | **Đơn giản** ≤ 3 giao dịch · **Trung bình** 4–7 · **Phức tạp** > 7 | Đổi ngưỡng |
| Ký hiệu cột — `Ưu tiên` | `P1 · P2 · P3` | **P1** MVP · **P2** · **P3**; lấy theo BRD mục 3 `Giai đoạn` (quy tắc ở mục 3 bên dưới, cột `Ưu tiên`) | — |
| Ký hiệu cột — `Tầng pháp lý` | `🟢 T1 · 🟡 T2 · 🔴 T3` | Giữ ký hiệu của template, chú thích "định nghĩa ở ma trận truy vết — chưa có; cột ghi `chưa chốt (BA)` cho đến khi có" (`00_quy_uoc_chung.md` mục 11). Lưu ý 🟡 ở đây **khác nghĩa** 🟡 ở quy trình (ngoài phạm vi hệ thống) | Dùng 🟡 để đánh dấu bước ngoài phạm vi ở `UCL` |
| Ký hiệu cột — `Permission key` (thêm) | Cột cuối của mục 3 | *Mã quyền của use case, duy nhất. `n/a` khi use case không cần quyền; `chưa chốt (<ai>)` khi chưa đặt.* | Bỏ dòng ký hiệu này vì template không có |

## Mục 2 — Tổng hợp

**Định nghĩa:** bảng đếm theo module — cho biết nhanh khối lượng, độ ưu tiên và độ phức tạp. Là số **suy từ mục 3**, không nhập tay độc lập.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Module | Tên module, mã kèm tên | `DA1.WEB.03 Lịch hẹn`. Module trải nhiều nền tảng (`DA1.WEB.03` và `DA1.JOB.03`) là **một** module, **một** dòng, đếm một lần | Gộp hai module một dòng; hai dòng cho cùng một mã module |
| Số chức năng | Số dòng cấp 4 của module trên **mọi nền tảng**, không ⊘ | Đếm ở mục 3 | Đếm lá |
| Số use case | Số lá cấp 5 của module trên mọi nền tảng, không ⊘ | Khớp tổng ở khối giới thiệu | Đếm dòng ☁ |
| P1 | Số use case ưu tiên P1 | Đếm cột `Ưu tiên` (quy tắc P ở mục 3) | — |
| B | Số use case loại bắt buộc | Đếm cột `BMT`. Dòng `chưa chốt (BA)` **không** đếm vào ba cột B, M, T; ghi số đó một dòng ngay dưới bảng: *Chưa phân loại BMT: 6 use case.* | Ép dòng chưa chốt vào B |
| M | Số use case loại mong muốn | Như trên | — |
| T | Số use case loại tùy chọn | Như trên | — |
| Đơn giản | Số use case ≤ 3 giao dịch | Đếm cột `Độ phức tạp`. Dòng `chưa chốt (BA)` đếm riêng dưới bảng | — |
| Trung bình | Số use case 4–7 giao dịch | Như trên | — |
| Phức tạp | Số use case > 7 giao dịch | Như trên | — |
| Dòng **Tổng** | Tổng từng cột | Khớp khối giới thiệu | Số làm tròn |

**Ba cột `Đơn giản · Trung bình · Phức tạp` của mục này đếm theo lá, nên chỉ để biết cơ cấu — không dùng làm số dự toán.** Một dòng dự toán thô đã tách thành nhiều lá, mỗi lá đếm giao dịch riêng (G1). Số đối chiếu dự toán tính theo **nhóm `Mã UC gốc`** (một dòng tổng ở mục 4, xem mục đó). Cột `Độ phức tạp` của lá là của lá. Lệch dự toán thì ghi `Q-U…`, không sửa dự toán. Cách tách này là lựa chọn của skill.

## Mục 3 — Danh sách

**Định nghĩa:** cây WBS, mỗi lá là một use case — nguồn duy nhất của mã UC, tên UC, tác nhân chính và permission key mà `create-uc` nhận.

**16 cột.** Chín cột đầu giữ **đúng thứ tự** của WBS Excel (`No · Group · Nền tảng · Module · Chức năng · Tính năng · Actor · Mã UC gốc · Ghi chú`), sáu cột bổ sung đặt sau (`Mức · BMT · Độ phức tạp · Ưu tiên · Tầng · Trạng thái đặc tả`), và **`Permission key` là cột cuối** (G1). Để dán qua lại Excel không lệch, không đổi thứ tự cột. Dòng cấp 1 đến 3 chỉ điền mã và cột tên của cấp đó. Dòng cấp 4 (chức năng) điền thêm `Mã UC gốc` ở dạng mã nhóm, `Ghi chú` và `Mức` ☁, đúng như dòng mẫu của template. Mọi cột còn lại của dòng cấp 1 đến 4 — kể cả `Trạng thái đặc tả` — để trống: đó là ngoại lệ duy nhất của quy tắc "không ô nào bỏ trắng", vì cột đó không có nghĩa ở nút cha (lựa chọn của skill; không dùng `n/a` thay cho ô trống).

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| `No` | **Mã WBS** của dòng — và với lá, **chính là mã UC** | `DA1.WEB.03.01.01`. Hai chữ số mỗi cấp sau nền tảng; không `UC-`. Không đánh lại | Số thứ tự 1, 2, 3; mã đã dùng |
| `Group` | Tên phân hệ | **Chỉ ở dòng cấp 1**: "DA1 — Trung tâm dịch vụ khách hàng" | Lặp ở mọi dòng |
| `Nền tảng` | `WEB` · `APP` · `KIOSK` · `API` · `JOB` — chữ hoa đúng mã WBS, mọi nơi một kiểu (lựa chọn của skill) | **Chỉ ở dòng cấp 2** | `Web`, `Job` viết thường |
| `Module` | Tên module | **Chỉ ở dòng cấp 3**: "Lịch hẹn". Template ghi cả mã dự toán: "M03 – …" nếu dự toán đặt | Tên lá |
| `Chức năng` | Tên chức năng | **Chỉ ở dòng cấp 4**: "Quản lý lịch hẹn" — chỗ duy nhất cho phép "Quản lý …" | Tên dùng ở lá |
| `Tính năng` | **Tên use case** | **Chỉ ở dòng lá.** Động từ + đối tượng: "Gửi yêu cầu đặt lịch". **Trùng chữ** với `ten` trong file UC của `create-uc`. Tính năng bỏ: `⊘ Gửi yêu cầu đặt lịch` | "Quản lý …", "Màn …", "Nhập ngày", nhiều động từ gộp ("Duyệt hoặc từ chối") |
| `Actor` | Tác nhân chính của use case | `ACT-01 Khách` — cả mã lẫn tên. Nhiều vai cùng làm **một** việc thì cách nhau `·` (đúng `create-uc` "Một UC to bằng nào"). Khớp `UCD` mục 1 | Tên chức danh; tên khác chữ với `UCD`; hai vai làm hai việc khác nhau (đó là hai dòng) |
| `Mã UC gốc` | **Mã dự toán** nguyên văn | Lá: `{mã nhóm}/UC{số dòng}` — `B-II.2 / UC031`. Cấp 4: chỉ mã nhóm `B-II.2`. Nhiều mã gộp: `B-II.2 / UC031 · B-II.2 / UC253`. Dòng sinh ra mà dự toán không có: `chưa chốt (BA)` (xem [`boc-uc-va-wbs.md`](boc-uc-va-wbs.md) mục 4). Dự án không có dự toán: `n/a` | Mã UC của lớp 5 (đó là cột `No`); mã sửa tay cho đẹp |
| `Ghi chú` | **Căn cứ tối thiểu** — nơi `create-uc` bắt đầu tìm sở cứ | Mã bước quy trình kèm tên, chuyển trạng thái nếu có, `D-xx` · `GS-xx`: `LH-01 bước 1 Gửi yêu cầu · SM mục 2: → PENDING_APPROVAL · D-05`. Sau lượt điền ngược thêm `BR-…` trước điều khoản. Dòng ngoài dự toán: bắt đầu bằng `ngoài dự toán — <nguồn sinh ra>` | Luồng, bước giữa của UC, nội dung điều khoản chép lại |
| `Mức` | `☁` ở cấp 4; `🌊` hoặc `🐟` ở lá | Phép thử ở `boc-uc-va-wbs.md` mục 5. Dòng cấp 3 trở lên để trống | `☁` cho lá |
| `BMT` | `B · M · T` | Lá: thừa hưởng dòng dự toán gốc. Dòng ngoài dự toán: `chưa chốt (BA)` | Tự phân loại không căn cứ |
| `Độ phức tạp` | `Đơn giản` · `Trung bình` · `Phức tạp` | **Suy từ số giao dịch của mục 4**: ≤ 3 · 4–7 · > 7. Dòng ngoài dự toán chưa có mục 4: `chưa chốt (BA)` | Đoán theo cảm giác |
| `Ưu tiên` | `P1 · P2 · P3` | Lấy từ BRD mục 3 `Giai đoạn` ("MVP P1 gồm …; P2 gồm …"): use case phục vụ nội dung nằm ở giai đoạn nào thì mang P đó (truy qua `BRQ` mà quy trình của dòng dẫn tới). Không truy được: `chưa chốt (BA)`. Chỉ khi `Giai đoạn` không phân P mà BRD mục 7 có MoSCoW thì quy đổi **M → P1, S → P2, C → P3, W → không xây** — quy tắc của skill (không phải của template), và ghi rõ ở `Ghi chú` hoặc `Q-U…` để BA xác nhận | Mặc định P1 cho mọi dòng; coi MoSCoW là P mà không nêu quy tắc |
| `Tầng` | `🟢 T1 · 🟡 T2 · 🔴 T3` | Hiện `chưa chốt (BA)` vì ma trận truy vết chưa có (`00_quy_uoc_chung.md` mục 11) | Tự đánh giá tầng |
| `Trạng thái đặc tả` | `Chưa · Nháp · Review · Chốt` | `Chưa`: chưa có file UC. `Nháp` ↔ `trang_thai: nhap`; `Review` ↔ `cho-duyet`; `Chốt` ↔ `da-chot` của `create-uc` ([`ban-giao-create-uc.md`](ban-giao-create-uc.md) mục 3). Dòng cấp 1–4: để trống | Giá trị khác |
| `Permission key` (cột cuối, thêm khi sao template) | Mã quyền của use case | Lá: `lich_hen.create`. **Duy nhất** toàn danh sách. `n/a` cho use case không cần quyền (gồm tác nhân hệ thống tự chạy); `chưa chốt (<ai>)` khi chưa đặt. Dòng cấp 1–4: để trống | Một key cho hai dòng; ô trống ở lá; key của hệ khác mà không có ánh xạ |

Ví dụ minh họa — một đoạn cây (rút gọn cột; mã minh họa, `GD-0047` nếu có phải bôi đỏ):

| No | Group | Nền tảng | Module | Chức năng | Tính năng | Actor | Mã UC gốc | Ghi chú | Mức | BMT | Độ phức tạp | Ưu tiên | Tầng | Trạng thái đặc tả | Permission key |
|---|---|---|---|---|---|---|---|---|:-:|:-:|:-:|:-:|:-:|---|---|
| DA1 | DA1 — Trung tâm dịch vụ khách hàng | | | | | | | | | | | | | | |
| DA1.WEB | | WEB | | | | | | | | | | | | | |
| DA1.WEB.03 | | | Lịch hẹn | | | | | | | | | | | | |
| DA1.WEB.03.01 | | | | Quản lý lịch hẹn | | | B-II.2 | LH-01 | ☁ | | | | | | |
| DA1.WEB.03.01.03 | | | | | Gửi yêu cầu đặt lịch | ACT-01 Khách | B-II.2 / UC031 | LH-01 bước 1–3 · SM mục 2: DRAFT → PENDING_APPROVAL | 🌊 | B | Đơn giản | P1 | chưa chốt (BA) | Nháp | lich_hen.submit |
| DA1.WEB.03.01.04 | | | | | Duyệt lịch hẹn | ACT-02 Nhân viên tiếp đón | B-II.2 / UC031 | LH-01 bước 4 · SM mục 2: PENDING_APPROVAL → APPROVED · QC01 Đ6.1 · QC01 Đ6.3 | 🌊 | B | Đơn giản | P1 | chưa chốt (BA) | Chưa | lich_hen.approve |
| DA1.JOB | | JOB | | | | | | | | | | | | | |
| DA1.JOB.03 | | | Lịch hẹn | | | | | | | | | | | | |
| DA1.JOB.03.02 | | | | Nhắc lịch và chốt lịch tự động | | | chưa chốt (BA) | N-01 · N-02 · LH-01 | ☁ | | | | | | |
| DA1.JOB.03.02.01 | | | | | Nhắc lịch hẹn | ACT-03 Hệ thống — tác vụ nền | chưa chốt (BA) | ngoài dự toán — N-01 Nhắc lịch lúc 07:00 | 🌊 | chưa chốt (BA) | chưa chốt (BA) | P1 | chưa chốt (BA) | Chưa | n/a |

## Mục 4 — Mô tả giao dịch (QĐ 671 Phụ lục III)

**Định nghĩa:** với mỗi use case đưa vào dự toán, liệt kê các **giao dịch** — mỗi giao dịch là một cặp tác nhân gửi → hệ thống phản hồi — để đếm ra độ phức tạp. Chỉ cần cho use case **có `Mã UC gốc`** (template: "chỉ cần cho use case đưa vào dự toán").

**Giao dịch của QĐ 671 không phải một use case của lớp này.** Một use case theo G1 gói gọn một thao tác nên thường có vài giao dịch; một dòng dự toán thô có thể gồm nhiều use case, mỗi cái đếm giao dịch riêng.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã UC | Mã WBS của lá | `DA1.WEB.03.01.03` | Mã dự toán |
| Tên use case | Đúng chữ cột `Tính năng` | "Gửi yêu cầu đặt lịch" | Tên khác |
| Tác nhân | Tác nhân gửi | `ACT-01 Khách` | — |
| Giao dịch | Danh sách đánh số, **mỗi dòng một cặp** (lựa chọn của skill, **khác ví dụ template**: template ghi ví dụ ba dòng với "3 giao dịch"; ở đây mỗi dòng là một cặp gửi → phản hồi, nên số dòng = số giao dịch) | `1. Khách chọn ngày hẹn, khung giờ, số người → Hệ thống kiểm còn lượt và hiện thông tin xác nhận`<br>`2. Khách xác nhận gửi → Hệ thống tạo yêu cầu ở trạng thái chờ duyệt và báo kết quả` | Luồng chi tiết từng bước màn hình; nhánh alternative và exception (đó là việc của `create-uc`); nhiều dòng đánh số mà chỉ là một giao dịch |
| Số giao dịch | Số dòng đánh số của cột trước | `2` | Số không khớp |
| BMT | Như mục 3 | `B` | — |
| Độ phức tạp | Theo ngưỡng mục 1, **từ `Số giao dịch` của chính dòng này** | `Đơn giản` (≤ 3) · `Trung bình` (4–7) · `Phức tạp` (> 7). Ví dụ trên: 2 giao dịch → `Đơn giản`; mục 3 phải ghi cùng giá trị | Giá trị mục 3 khác mục 4 |

**Số đối chiếu dự toán tính theo nhóm `Mã UC gốc`** (lựa chọn của skill). Dòng chia ra từ một dòng dự toán thô: cộng `Số giao dịch` của các dòng cùng `Mã UC gốc` rồi đối chiếu số giao dịch dự toán đã ký cho dòng gốc — ghi thành **một dòng tổng ở cuối mục 4** cho mỗi nhóm, dạng: *`B-II.2 / UC031`: 7 lá · 14 giao dịch · dự toán đã ký 12 giao dịch → lệch, `Q-U03`*. Cột `Độ phức tạp` của lá là của lá; **không** cộng từ mục 2 để đối chiếu dự toán. Lệch → ghi vào mục câu hỏi `Q-U…`; **không** sửa số của dự toán.

## Mục 5 — Từ điển WBS cho mỗi chức năng

**Định nghĩa:** (PMI Practice Standard for WBS) với mỗi chức năng cấp 4, một dòng nói rõ phạm vi, đầu ra, tiêu chí hoàn thành — để giao việc và nghiệm thu. Đồng thời là chỗ **kiểm quy tắc 100% giữa cha và con**.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Chức năng | Mã WBS cấp 4 kèm tên | `DA1.WEB.03.01 Quản lý lịch hẹn` | Lá |
| Mô tả phạm vi | Chức năng này gồm những thao tác nào, **liệt kê hết** | "Khách lưu nháp, sửa nháp, gửi yêu cầu và hủy lịch; nhân viên tiếp đón duyệt và từ chối; cả hai xem danh sách lịch thuộc phạm vi của mình." Mỗi thao tác phải có đúng một lá ở mục 3 | Mô tả mơ hồ ("quản lý lịch hẹn") |
| Đầu ra bàn giao | Thứ bàn giao khi chức năng xong | Mặc định của template: `Đặc tả UC · màn hình · API · testcase`; thêm bớt theo hợp đồng | "Phần mềm chạy được" |
| Tiêu chí hoàn thành | Điều kiện kiểm chứng được | "Cả bảy use case ở `Chốt`; testcase chuyển trạng thái `SM mục 2` đạt." Có số thì ghi kèm biên | "Khách hàng hài lòng" |
| Phụ thuộc | Chức năng hoặc hệ thống phải xong trước | Mã chức năng khác (`DA1.WEB.02.01 Quản lý khách hàng`), hoặc hệ thống ngoài. Không có: `n/a` | Để trống |

## Mục 6 — Kiểm tra quy tắc 100%

**Định nghĩa:** các phép kiểm mà `UCL` phải đạt trước khi qua cổng ra. Mỗi dòng một phép; cột `Kết quả` là `✅` hoặc `thiếu: <liệt kê>`. Cách thực hiện từng phép: [`boc-uc-va-wbs.md`](boc-uc-va-wbs.md) mục 6.

Bốn dòng đầu là của template, giữ nguyên chữ. Bốn dòng đánh dấu **Thêm** là phần template còn thiếu, đặt sau bốn dòng đầu. Khi kiểm xong, **điền quy trình mục 10** (bước chưa phủ, hoặc dòng *Không có*) và **BRD mục 12 cột `Use case`** trước cổng ra lớp 5 — xem [`SKILL.md`](../SKILL.md) mục "Điền sang tài liệu khác trước cổng ra lớp 5".

| Dòng kiểm | Nguồn | Cột `Kết quả` ghi |
|---|---|---|
| Mọi nhóm chức năng trong dự toán có ít nhất một tính năng | Template | `✅`, hoặc `thiếu: B-II.3 chưa có dòng` |
| Không tính năng nào trùng mục tiêu với tính năng khác | Template | `✅`, hoặc `trùng: …` |
| Mọi bước quy trình do người thực hiện có use case phủ | Template | `✅`, hoặc `Không phủ: liệt kê ở quy trình mục 10`. Loại các bước 🟡 |
| Mọi chuyển trạng thái 👤 ở máy trạng thái có use case phủ | Template | `✅`, hoặc `thiếu: SM mục 2 chuyển … ` |
| **Thêm:** Mọi tác vụ nền `N-xx` có use case tác nhân hệ thống | Lựa chọn của skill (cổng ra lớp 5 ở [`ba-overview`](../../ba-overview/SKILL.md) chỉ đòi quy tắc 100% và `Permission key`) | `✅`, hoặc `thiếu: N-02` |
| **Thêm:** Mọi sự kiện 🔗 có tác động Tự chuyển hoặc Chỉ chặn có use case | Lựa chọn của skill, theo chữ của SM mục "Sự kiện ngoài và tác vụ nền" | `✅`, hoặc `thiếu: …` |
| **Thêm:** Nút con phủ đúng nút cha, không trùng, không sót (từng chức năng, so với mục 5) | PMI quy tắc 100% | `✅`, hoặc `lệch: <mã chức năng>` |
| **Thêm:** Mọi lá có `Actor`, `Permission key` (không trống, không trùng), và `Ghi chú` hoặc "ngoài dự toán" | Cổng ra của lớp 5 (`Permission key`) · lựa chọn của skill (`Actor`, `Ghi chú`) | `✅`, hoặc `thiếu: …` |

## Mục 7 — Câu hỏi cần chốt

**Định nghĩa:** những điểm của `UCL` chưa ai trả lời, mỗi điểm một dòng, kèm đề xuất mặc định để BA chỉ cần duyệt. Template đã có đủ sáu cột theo `00_quy_uoc_chung` mục 6; số mục các khối cuối (7 Câu hỏi, 8 Rủi ro, 9 Điểm tạm hoãn, 10 Nguồn): [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6. Quy trình: ❓ và `Q-…` ở [`so-cu-va-gia-dinh.md`](../../ba-overview/reference/so-cu-va-gia-dinh.md) mục 4. AI **không** tự tạo `GD-xxxx`.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `Q-U01`… | Tiền tố `Q-U` cho `UCL` (xem mục "Mã và tên" của phần lõi) | Mã trùng với `Q-A…` ở `UCD` |
| Câu hỏi | Câu hỏi một ý | "Dòng dự toán `B-II.2 / UC031` gộp gửi và duyệt: tách thành hai use case hay giữ một?" | "Chưa rõ dự toán" |
| Kịch bản | Tình huống cụ thể khiến câu hỏi nảy ra | "Mô tả dòng dự toán nêu cả khách gửi lẫn nhân viên tiếp đón duyệt; hai việc do hai tác nhân làm" | Bỏ trống, hoặc chép lại câu hỏi |
| Đề xuất mặc định | Câu trả lời mặc định | "Tách hai use case, cả hai giữ `Mã UC gốc` `B-II.2 / UC031`" | Để trống — AI phải đề xuất |
| Người chốt | Người có thẩm quyền | Tên người | "BA" chung chung |
| Quyết định | Kết quả khi đã chốt | `✅ dd/mm/yyyy: …`; chưa chốt thì để trống | Xóa dòng đã chốt |

Không còn câu mở thì ghi một dòng *Không còn câu mở*.

## Mục 8 — Rủi ro còn lại

**Định nghĩa:** rủi ro **còn lại sau biện pháp** đã tính, làm yếu một căn cứ của `UCL` — ví dụ số giao dịch lệch dự toán đã ký, một dòng ngoài dự toán chưa được khách chấp nhận. Khối bắt buộc theo `00_quy_uoc_chung` mục 6; mã `RK-nn`. Không có thì ghi *Không có rủi ro còn lại*, không bỏ mục.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `RK-nn` | Hai chữ số, duy nhất trong tài liệu | Mã trùng |
| Rủi ro | Điều có thể xảy ra, nêu cả hậu quả | *Số giao dịch của nhóm `B-II.2 / UC031` lệch dự toán đã ký, khách có thể không nghiệm thu phần chênh* | Rủi ro không gắn căn cứ nào |
| Căn cứ bị ảnh hưởng | Mã bị yếu đi | `B-II.2 / UC031 · Q-U03` | Bỏ trống |
| Mức | `C · TB · T` (cao, trung bình, thấp) | Một giá trị; canh giữa | Mọi rủi ro cùng `TB` |
| Biện pháp | Việc đã làm hoặc sẽ làm để giảm | *Báo khách số lệch và xin xác nhận bằng văn bản* | "Theo dõi" trơn |
| Cần khách xác nhận văn bản | `Có` hoặc `Không` | `Có` khi chỉ khách giải quyết được | Bỏ trống |

## Mục 9 — Điểm tạm hoãn

**Định nghĩa:** việc đã rõ, đã hiểu, nhưng cố ý chưa làm ở phiên bản này, kèm điều kiện mở lại — khác câu hỏi (chưa ai trả lời), giả định (tạm coi là đúng) và rủi ro (có thể xảy ra). Mã `TH-nn` do bộ skill đặt (`00_quy_uoc_chung.md` mục 6). Không có thì ghi *Không có điểm tạm hoãn*.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Mã | `TH-nn` | Hai chữ số, duy nhất trong tài liệu | Mã trùng |
| Nội dung | Việc cố ý chưa làm | *Chưa đặt `Permission key` cho module báo cáo, chờ hệ phân quyền của khách* | Câu hỏi còn mở (đó là `Q-U…`) |
| Ngày tạm hoãn | Ngày quyết định hoãn | `DD/MM/YYYY` | `YYYY-MM-DD` (dành cho Version control) |
| Điều kiện mở lại | Điều kiện kiểm chứng được | *Khi khách cung cấp danh mục quyền* | "Khi có thời gian" |

## Mục 10 — Nguồn

**Định nghĩa:** tài liệu `UCL` dựng từ và dùng cho phần nào.

| Cột | Điền gì | Viết thế nào | Đừng viết |
|---|---|---|---|
| Tài liệu | Đường dẫn tương đối | `{file dự toán}` sheet `PL2.Functions`, `PL3.UseCase`; `{WBS.xlsx}`; `../2-business-process/{file}`; `../4-state-machine/{file}`; `../1-brd/{file}` mục 3, 7, 12 | Đường dẫn tới template |
| Dùng cho | Phần của `UCL` | "Mã gốc, giao dịch, phân loại"; "Cây mã, tiến độ"; "Bước người, `N-xx`"; "Chuyển 👤" | "Tham khảo" |

## Khối hướng dẫn trong template

Khi xong, **xóa toàn bộ** khối `<!-- HƯỚNG DẪN DÙNG TEMPLATE … -->` ở đầu file và các chú thích `<!-- … -->` ở mục 3, 4, 5. Bản Excel quản lý tiến độ `WBS_{MÃ}_{PHẠM VI}_vNN.xlsx` giữ cùng cột; khi lệch giữa Excel và `UCL`, **`UCL` thắng** và Excel sửa theo.
