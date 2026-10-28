# Bóc dòng use case và dựng cây WBS

Phần tra cứu của skill [`create-ucl`](../SKILL.md). Phục vụ bước 3 của quy trình viết: từ quy trình, máy trạng thái, tác vụ nền và dự toán, sinh ra các dòng của `UCL` mục 3, rồi dựng cây và kiểm quy tắc 100%. Cách điền từng cột: [`dien-tung-muc-ucl.md`](dien-tung-muc-ucl.md). Mã trong ví dụ là **mã minh họa** theo [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md).

**Hạt của một dòng không được định nghĩa lại ở đây** — theo G1, giải thích ở [`SKILL.md`](../SKILL.md) mục "Lớp 5 là gì". Mỗi lần nghi ngờ một dòng có đúng hạt không, mở hai mục của [`create-uc`](../../create-uc/SKILL.md) mà đoạn đó dẫn.

## 1. Bóc từ bước quy trình

Quy trình là nguồn chính của dòng. Duyệt **từng bước** của từng quy trình theo cột `Tác nhân`:

| Bước của quy trình | Việc của lớp 5 | Ví dụ minh họa (`LH-01`) |
|---|---|---|
| Tác nhân là **người**, không có 🟡 | Ít nhất **một** dòng use case. Bước đó là phần "người làm trên hệ thống" mà use case nằm bên trong | Bước 1 Khách gửi yêu cầu (gồm hệ thống bước 2–3 cùng request) → `DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch`; việc soạn trước khi gửi → `…03.01.01 Lưu nháp lịch hẹn` và `…03.01.02 Sửa lịch hẹn nháp` |
| Một bước ghi hai kết quả (duyệt **hoặc** từ chối) | **Hai** dòng — mỗi trạng thái cuối một dòng, mỗi dòng một quyền | Bước 4 → `…03.01.04 Duyệt lịch hẹn` và `…03.01.05 Từ chối lịch hẹn` |
| Tác nhân là **Hệ thống**, ở giữa luồng | **Không** sinh dòng riêng. Nó là bước bên trong use case của bước người ngay trước | Bước 2 "Hệ thống kiểm còn lượt trong tuần" nằm trong `…03.01.01` |
| Tác nhân là Hệ thống, chạy theo lịch hoặc theo sự kiện | Xem mục 3 (tác vụ nền) | `N-01` Nhắc lịch lúc 07:00 |
| Bước có 🟡 (ngoài phạm vi hệ thống) | **Không** sinh dòng. Giữ trong quy trình để thấy đủ luồng; loại khỏi phép kiểm quy tắc 100% | Bước 6 nhân viên quầy đối chiếu giấy tờ |
| Hai bước người liền nhau nhưng **có khoảng chờ** hoặc **chuyển giao** | Hai dòng, hai use case khác nhau | Bước 3 và bước 4: giữa chúng khách chờ nhân viên tiếp đón |

Với mỗi bước người, còn ba việc **ngoài dòng chính** thường bị bỏ sót:

| Việc | Khi nào cần thêm dòng | Cách |
|---|---|---|
| Xem, tìm kiếm, kết xuất | Thực thể mà bước đó tạo hoặc sửa cần một nơi xem lại | Thêm dòng 🐟: `Xem danh sách lịch hẹn` (`DA1.WEB.03.01.07`), và `Xem chi tiết lịch hẹn` (mã minh họa riêng của skill, ngoài bảng mã chuẩn). Xem danh sách là **một use case riêng** với quyền riêng (quy ước dự án, `create-uc` mục "Một UC to bằng nào") |
| Thêm, sửa, xóa danh mục | Một danh mục (ERD loại Danh mục) được dùng nhưng chưa ai quản lý | Bốn dòng riêng cho thêm, sửa, đổi trạng thái hoặc xóa, xem. Không "Quản lý danh mục X" |
| Hủy, thu hồi, mở lại | Máy trạng thái có chuyển 👤 tương ứng | Dòng riêng, theo mục 2 |

## 2. Bóc từ chuyển 👤 của máy trạng thái

Máy trạng thái ([`state_machine.md`](../../../../2-ba-overview/templates/4-state-machine/state_machine.md)) có cột `Ai — sự kiện` với ba ký hiệu: 👤 người thao tác, 🔗 sự kiện từ hệ thống ngoài, ⚙️ tác vụ nền. Mỗi chuyển 👤 **phải có ít nhất một** use case phủ — đây là dòng kiểm ở `UCL` mục 6.

| Cột trong bảng chuyển | Dùng thế nào |
|---|---|
| `Từ → Đến` | Quyết định kết quả của dòng: trạng thái cuối. Hai chuyển cùng xuất phát nhưng **đến khác nhau** → hai dòng. Nhiều trạng thái đến → một dòng nếu cùng một trạng thái cuối |
| `Ai — sự kiện` | Tác nhân chính của dòng (tên vai ở đây phải có trong `UCD` mục 1) và mã bước quy trình để ghi vào `Ghi chú` |
| `Điều kiện` | Chuyển vào `Ghi chú` dạng dẫn mã (`BR-…`, `GS-xx`, `D-xx`); không chép nội dung |
| `Hệ quả` | Cho biết dòng có thêm bước ghi hay ghi tạm không; nếu có, cân nhắc UC tác nhân hệ thống dọn (mục 3) |

Ví dụ minh họa với SM mục 2 (`Lich_Hen`), theo bảng mã chuẩn của [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md) mục 3 và 4:

| Chuyển (SM mục 2) | Dòng use case |
|---|---|
| `→ DRAFT` (👤 Khách) | `DA1.WEB.03.01.01 Lưu nháp lịch hẹn` |
| Sửa bản nháp (không đổi trạng thái, ở lại `DRAFT`) | `DA1.WEB.03.01.02 Sửa lịch hẹn nháp` — một thao tác sửa riêng, quyền riêng (`lich_hen.update`) |
| `DRAFT → PENDING_APPROVAL` (👤 Khách — `LH-01 bước 1–3`) | `DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch` |
| `PENDING_APPROVAL → APPROVED` (👤 Nhân viên tiếp đón — `LH-01 bước 4`) | `DA1.WEB.03.01.04 Duyệt lịch hẹn` |
| `PENDING_APPROVAL → REJECTED` (👤 Nhân viên tiếp đón — `LH-01 bước 4`) | `DA1.WEB.03.01.05 Từ chối lịch hẹn` |
| `PENDING_APPROVAL, APPROVED → CANCELLED` (👤 Khách — `LH-02`) | `DA1.WEB.03.01.06 Hủy lịch hẹn` |

SM có trạng thái nháp (`DRAFT`, chuyển `→ DRAFT` 👤) thì `UCL` có cả dòng lưu nháp lẫn dòng sửa nháp; thiếu một trong hai là lỗi phủ.

Một use case phủ **được** nhiều chuyển 👤 khi các chuyển đó chỉ khác nhau về trạng thái xuất phát nhưng cùng trạng thái cuối và cùng quyền (ví dụ hủy từ `PENDING_APPROVAL` và hủy từ `APPROVED` cùng về `CANCELLED`, đều là `…03.01.06`). Ghi cả hai chuyển ở `Ghi chú`. Hai chuyển khác trạng thái cuối thì hai dòng — dù do cùng tác nhân làm.

**Chuyển ⚙️ và 🔗.** Chuyển do `N-xx` được phủ bởi dòng tác nhân hệ thống của `N-xx` (mục 3). Chuyển do 🔗 sự kiện ngoài mà tác động là *Tự chuyển* hoặc *Chỉ chặn* (chữ của template SM) thì cần một use case cho sự kiện đó — tác nhân là hệ thống ngoài gọi vào, nền tảng `API`. Tác động *Chỉ liệt kê* thì không cần use case riêng nếu một use case xem có sẵn đã đủ; ghi lý do vào `Ghi chú`.

## 3. Bóc từ tác vụ nền `N-xx`

Quy trình mục 5 liệt kê tác vụ nền: `Mã · Tác vụ · Nguồn dữ liệu · Tham số · Lịch chạy · Người nhận · Khóa chống lặp · Kết quả`. Mỗi `N-xx` sinh **ít nhất một** dòng với tác nhân `ACT-nn Hệ thống — tác vụ nền`, nền tảng `JOB`, quyền `n/a` (tự chạy, không có ai để cấp quyền).

| Việc | Cách xử lý |
|---|---|
| Đặt tên | Động từ + đối tượng theo `Tác vụ` của quy trình: `Nhắc lịch hẹn` cho `N-01` |
| Mã | `DA1.JOB.03.02.01` — nền tảng `JOB`, **cùng mã module** với use case mà nó phục vụ (`03`), còn số chức năng là số **tiếp theo chưa dùng trong module, tính chung mọi nền tảng** (`.02`, vì `DA1.WEB.03.01` đã có); xem mục 5 và G2 |
| `Ghi chú` | `N-01 · LH-01 · CH-xx`. `Lịch chạy` không nhét vào dòng; để thân UC của `create-uc` ghi trigger kèm múi giờ |
| Một `N-xx` làm hai việc khác kết quả (nhắc và tự đóng cảnh báo) | Hai dòng, như mọi use case khác |
| UC dọn ghi tạm | Khi một use case người có **ghi tạm** (giữ chỗ, tệp tải lên, OTP, số thứ tự đã lấy), phải có một use case tác nhân hệ thống dọn khi quá hạn. Lớp 5 chưa biết hết ghi tạm vì thân UC viết sau; khi `create-uc` phát hiện thì **thêm dòng vào `UCL`** với `Ghi chú` "dọn ghi tạm của <mã UC>" (xem [`ban-giao-create-uc.md`](ban-giao-create-uc.md)) |

## 4. Bóc từ dự toán và mapping dòng thô sang nhiều dòng use case

Dự toán (sheet `PL2.Functions`, `PL3.UseCase`; file WBS cũ) liệt kê "use case" thường theo kiểu Cockburn: một dòng là một mục tiêu — "Quản lý lịch hẹn". Đó là hạt **to hơn** dòng của lớp này (G1). Quy tắc: **dòng dự toán là nguồn của phạm vi đã ký; dòng use case là hạt viết đặc tả**. Một dòng dự toán thành **một hoặc nhiều** dòng use case, và mọi dòng con **mang nguyên mã dự toán** ở cột `Mã UC gốc`.

Cách tách một dòng dự toán thô:

| Bước | Làm gì |
|---|---|
| 1 | Xác định **thực thể chính** của dòng dự toán theo ERD và quy trình nó thuộc (`LH-01`) |
| 2 | Liệt kê thao tác theo thứ tự cố định của template: **thêm → sửa → đổi trạng thái → xóa → tìm kiếm → xem chi tiết → kết xuất → nghiệp vụ riêng** |
| 3 | Với mỗi thao tác, hỏi: có bước quy trình hoặc chuyển 👤 nào phát sinh nó không? Có → giữ. Không có nhưng mô tả của dòng dự toán nêu → giữ, ghi `Ghi chú` "theo dự toán, quy trình chưa nêu" kèm `Q-U…` |
| 4 | Áp quy tắc tách: khác trạng thái cuối → hai dòng; khác tác nhân → hai dòng (trừ khi liệt kê thêm vai ở cột `Actor`, đúng `create-uc` "Một UC to bằng nào"); khác kênh mà các bước hoặc người thực hiện khác → hai dòng |
| 5 | Thao tác chỉ có mặt trong dự toán dưới dạng danh từ ("tra cứu", "báo cáo") → mỗi cái một dòng, 🐟 nếu chỉ hỗ trợ, 🌊 nếu là mục tiêu riêng (báo cáo tổng hợp) |
| 6 | Ghi `Mã UC gốc` đúng dạng dự toán lên mọi dòng con |

Ví dụ minh họa: dòng dự toán thô **`B-II.2 / UC031` Quản lý lịch hẹn** (mã minh họa) thành bảy dòng web của bảng mã chuẩn:

| No | Tính năng | Actor | Mã UC gốc |
|---|---|---|---|
| DA1.WEB.03.01.01 | Lưu nháp lịch hẹn | ACT-01 Khách | B-II.2 / UC031 |
| DA1.WEB.03.01.02 | Sửa lịch hẹn nháp | ACT-01 Khách | B-II.2 / UC031 |
| DA1.WEB.03.01.03 | Gửi yêu cầu đặt lịch | ACT-01 Khách | B-II.2 / UC031 |
| DA1.WEB.03.01.04 | Duyệt lịch hẹn | ACT-02 Nhân viên tiếp đón | B-II.2 / UC031 |
| DA1.WEB.03.01.05 | Từ chối lịch hẹn | ACT-02 Nhân viên tiếp đón | B-II.2 / UC031 |
| DA1.WEB.03.01.06 | Hủy lịch hẹn | ACT-01 Khách | B-II.2 / UC031 |
| DA1.WEB.03.01.07 | Xem danh sách lịch hẹn | ACT-01 Khách · ACT-02 Nhân viên tiếp đón | B-II.2 / UC031 |

Ghi ở `Mã UC gốc`: bảy dòng cùng một giá trị. Khi cộng lại thành báo cáo, nhóm theo cột này để đối chiếu với dự toán: một dòng dự toán → bảy dòng lớp 5. Dòng cấp chức năng `DA1.WEB.03.01` mang `Mã UC gốc` là mã **nhóm** `B-II.2` (không có `/ UC…`), đúng cách template ghi.

**Dòng dự toán hạt đã đúng** (mô tả ra một thao tác) thì một dòng, giữ nguyên mã. **Hai dòng dự toán trùng thao tác** thì không gộp tay: ghi cả hai mã vào cột, cách nhau `·`, và thêm `Q-U…`.

**Dòng sinh ra mà dự toán không có** (use case tác nhân hệ thống từ `N-xx`, dọn ghi tạm, hủy mà dự toán quên, tách nhỏ vì quy trình): `Mã UC gốc` ghi `chưa chốt (BA)` — chưa biết nó nằm trong phạm vi đã ký hay là phát sinh — và `Ghi chú` bắt đầu bằng **"ngoài dự toán —"** kèm nguồn sinh ra nó (`N-01`, `SM mục 2`). BA sẽ quyết: gộp vào hạng mục đã ký, hay đề xuất phát sinh. `n/a` chỉ dùng khi **chắc chắn** use case không có mã dự toán và BA đã xác nhận.

**Dự toán vs phân loại.** `BMT` (B·M·T) của dòng con thừa hưởng từ dòng dự toán gốc; dòng ngoài dự toán ghi `chưa chốt (BA)`. `Độ phức tạp` tính theo giao dịch **của chính dòng** ở `UCL` mục 4 (QĐ 671 Phụ lục III) — cột đó là **của lá**, nên các số đếm theo cột ở `UCL` mục 2 chỉ cho biết cơ cấu, không dùng làm số dự toán. **Số đối chiếu dự toán tính theo nhóm `Mã UC gốc`** (lựa chọn của skill): cộng `Số giao dịch` các dòng con cùng `Mã UC gốc` rồi đối chiếu với số giao dịch của dòng dự toán gốc, ghi thành một dòng tổng ở `UCL` mục 4. Lệch thì **ghi vào `Q-U…`**, không sửa số của dự toán.

## 5. Dựng cây

Cây có **năm cấp**; mỗi cấp một cột mã tách bằng dấu chấm. Lá (cấp 5) là use case.

| Cấp | Cột điền | Mã | Cách xác định |
|---|---|---|---|
| 1 Phân hệ | `Group` | `DA1` | Một dự án, một phân hệ |
| 2 Nền tảng | `Nền tảng` | `DA1.WEB` | Một trong `WEB · APP · KIOSK · API · JOB`. `JOB` cho tác nhân tác vụ nền; `API` cho hệ thống ngoài gọi vào |
| 3 Module | `Module` | `DA1.WEB.03` | Nhóm các chức năng cùng quy trình hoặc cùng miền nghiệp vụ; thường một quy trình `XX-nn` hoặc một nhóm `XX`. **Module trải nhiều nền tảng** (lựa chọn của bộ skill, theo G2 ở [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 8): giữ **nguyên mã module** ở mọi nền tảng (`DA1.WEB.03` và `DA1.JOB.03` là cùng module 03), và **số chức năng duy nhất trong module, tính chung mọi nền tảng** — đã có `DA1.WEB.03.01` thì chức năng chạy nền là `DA1.JOB.03.02`, không phải `DA1.JOB.03.01`. Đếm module **một lần** theo mã module khi ghi mục 2 và khối giới thiệu |
| 4 Chức năng | `Chức năng` | `DA1.WEB.03.01` | Nhóm các tính năng cùng một **thực thể chính** (theo ERD) và cùng nền tảng; số chức năng không lặp trong module dù khác nền tảng. Đây là mức ☁ — nơi chấp nhận tên "Quản lý …" |
| 5 Tính năng = Use case | `Tính năng` | `DA1.WEB.03.01.03` | Một thao tác; động từ + đối tượng |

**Quy tắc mã.** Hai chữ số mỗi cấp sau nền tảng. Mã đã phát hành **không đánh lại**: thêm tính năng thì lấy số tiếp theo, kể cả khi thứ tự đáng lẽ chen ở giữa. Tính năng bỏ đánh ⊘ ở đầu cột `Tính năng` và giữ dòng; mã đó không dùng lại.

**Thứ tự tính năng trong một chức năng** (khi cấp lần đầu): thêm → sửa → đổi trạng thái → xóa → tìm kiếm → xem chi tiết → kết xuất → nghiệp vụ riêng. Trong cùng nhóm đổi trạng thái thì theo thứ tự trạng thái trong máy. Tính năng thêm sau, dù thuộc nhóm nào, lấy số tiếp theo; không đánh lại để giữ thứ tự.

**Mức ☁ 🌊 🐟** — chỉ để phân loại và chọn dòng vẽ lên sơ đồ; mọi lá vẫn là use case theo G1:

| Mức | Dòng nào | Phép thử |
|---|---|---|
| ☁ Tóm lược | Chức năng (cấp 4), đôi khi module (cấp 3). Không phải lá | Có tên dạng "Quản lý …", gom nhiều thao tác |
| 🌊 Mục tiêu người dùng | Lá mà tác nhân có **mục tiêu nghiệp vụ riêng**: tạo, sửa, xóa, đổi trạng thái, nghiệp vụ riêng, báo cáo tổng hợp, UC tác nhân hệ thống tạo kết quả | Tác nhân làm xong việc này và có thể rời đi vì mục tiêu của họ đã đạt |
| 🐟 Chức năng con | Lá chỉ **hỗ trợ** use case khác: tìm kiếm, xem chi tiết, kết xuất, chọn dùng chung | Việc này tự nó không đáng để ai đến hệ thống chỉ để làm |

Mức không phải **thứ hạng quan trọng**: 🐟 vẫn có permission key, vẫn cần đặc tả và test.

**Dòng cấp 1–4** chỉ điền đến cột tên của cấp đó (template). Dòng cấp 4 thêm `Mã UC gốc` ở dạng mã nhóm (chưa có mã dự toán: `chưa chốt (BA)`, không để trống), `Ghi chú` dẫn quy trình phụ trách hoặc `N-xx`, và mức ☁.

**Nguồn dựng module và chức năng.** Module theo phạm vi ở BRD mục 3 và nhóm quy trình ở quy trình mục 3 (bản đồ quy trình). Chức năng theo thực thể chính của ERD. Dự toán đã có cây nhóm (`B-II.2`) thì **giữ cùng cấu trúc** ở cấp 3–4 để mã dự toán và mã WBS cùng thấy được.

## 6. Quy tắc 100%

Quy tắc của PMI Practice Standard for WBS: **tổng các nút con bằng đúng nút cha — không trùng, không sót.** Với `UCL`, kiểm ở bốn tầng:

| Tầng | Câu hỏi kiểm | Cách kiểm |
|---|---|---|
| Cha — con | Mỗi chức năng: các tính năng của nó phủ **đúng** phạm vi chức năng, không hơn không kém | Viết `Mô tả phạm vi` ở `UCL` mục 5 **trước hoặc song song**; liệt kê từng thao tác của mô tả; mỗi thao tác phải rơi vào đúng một tính năng. Thao tác không rơi vào đâu → sót; rơi vào hai → trùng |
| Con — con | Hai tính năng cùng chức năng có **trùng mục tiêu** không | Trùng nếu cùng động từ, cùng đối tượng, cùng tác nhân chính, cùng kết quả. Khác chỉ ở kênh hoặc tác nhân thì không trùng (xem `create-uc` "Một UC to bằng nào") |
| Nguồn — dòng | Mọi nhóm dự toán có ít nhất một tính năng; mọi bước quy trình do người (trừ 🟡) có use case; mọi chuyển 👤 có use case; mọi `N-xx` có use case tác nhân hệ thống; mọi 🔗 *Tự chuyển* hoặc *Chỉ chặn* có use case | Duyệt từ nguồn xuống dòng (mục 1–3). Thiếu thì ghi ở cột `Kết quả` của `UCL` mục 6 dạng "Không phủ: …" và **đưa danh sách bước chưa có use case vào quy trình mục 10** ngay sau phép kiểm này, trước cổng ra lớp 5 (không chờ lớp 6); cùng lúc điền BRD mục 12 cột `Use case` |
| Dòng — nguồn | Mọi dòng có căn cứ tối thiểu hoặc được đánh dấu "ngoài dự toán" | Duyệt từ dòng lên nguồn |

**Ranh giới giữa "chưa phủ" và "không phủ".** Một bước người mà **cố ý** không có use case (khách hàng làm bằng tay, ngoài phạm vi sản phẩm) nên đã có 🟡 từ quy trình. Chưa có 🟡 mà không có use case là lỗi của một trong hai lớp: hoặc quy trình quên 🟡, hoặc lớp 5 quên dòng. Ghi `Q-U…`, không tự quyết.

**Số đếm phải cộng đúng.** `UCL` mục 2 (số use case mỗi module) bằng số lá không ⊘ trong mục 3 của module đó; tổng cột bằng số ở khối giới thiệu. Tính lại sau mỗi lần thêm hoặc bỏ dòng.
