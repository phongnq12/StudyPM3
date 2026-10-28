# Tác nhân — bóc, phân loại, tổng quát hóa, tách nhiệm

Phần tra cứu của skill [`create-ucl`](../SKILL.md). Đọc phần lõi trước. File này phục vụ `UCD` mục 1 và mục 1.1 đến 1.3; cách điền từng cột nằm ở [`dien-tung-muc-ucd.md`](dien-tung-muc-ucd.md). Mọi mã và tên trong ví dụ là **mã minh họa** theo [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md).

## 1. Tác nhân là gì

**Tác nhân là một vai trò bên ngoài ranh giới hệ thống, tương tác trực tiếp với hệ thống để đạt một mục đích.** Vai trò được xác định bằng hai thứ: tập thao tác mà vai đó làm được, và phạm vi dữ liệu mà vai đó thấy được. Hai vai khác nhau ở một trong hai thứ thì là hai tác nhân; hai tên có cùng tập thao tác và cùng phạm vi thì là một.

Từ đó có bốn điều cần giữ chắc.

**Vai trò, không phải chức danh.** Chức danh là chỗ một người đứng trong sơ đồ tổ chức ("Giám đốc trung tâm"); vai trò là việc người đó làm *trên hệ thống* ("Nhân viên tiếp đón"). Một chức danh có thể giữ nhiều vai, và một vai có thể do nhiều chức danh đảm nhiệm. Tên tác nhân phải gọi đúng cái vai.

**Không phải cá nhân; đơn vị chỉ để phân phạm vi thì không phải tác nhân.** "Nguyễn Văn A" là dữ liệu. "Trung tâm A1" là đơn vị, cho ra **phạm vi dữ liệu** ("trung tâm mình") chứ không cho ra tác nhân. Ngược lại, một **nhóm hoặc tổ chức tương tác với hệ thống như một bên** — ra quyết định, nộp hồ sơ, nhận kết quả (ví dụ riêng của skill: "Hội đồng thẩm định") — **là** tác nhân, vì nó có tập thao tác riêng. Phân biệt: đơn vị chỉ trả lời "dữ liệu của ai"; nhóm hoặc tổ chức làm tác nhân trả lời "ai thao tác". Đây là lựa chọn của skill, để khớp bài giới thiệu lớp Who (tác nhân gồm người, nhóm, tổ chức, hệ thống ngoài) với phép thử vai trò. Nhóm thao tác qua giao diện thì loại `Người`; qua API thì `Hệ thống ngoài`.

**Một người có thể đóng nhiều vai.** Cùng một nhân viên tiếp đón vừa lập yêu cầu thay khách, vừa duyệt yêu cầu khác. Đó là hai tác nhân; ma trận ghi từng vai riêng, và mục 1.2 (tách nhiệm) quy định hai vai đó **không được rơi vào cùng một bản ghi**. Lớp 5 không mô tả một người cụ thể, nên không có cột "người".

**Phải ở ngoài hệ thống.** Một bộ phận bên trong hệ thống (module "Kiểm còn lượt") không phải tác nhân; nó là một bước bên trong use case. Riêng **tác vụ nền** của chính hệ thống được coi là tác nhân vì nó **khởi động** use case mà không ai bấm — xem mục 2.

## 2. Ba loại, chính và phụ

| Loại (cột `Loại`) | Là gì | Ví dụ minh họa | Nền tảng thường gặp | Phân loại QĐ 671 |
|---|---|---|---|---|
| **Người** | Một vai trò của con người thao tác qua giao diện | `ACT-01 Khách`, `ACT-02 Nhân viên tiếp đón` | WEB · APP · KIOSK | Phức tạp (giao diện đồ họa), trọng số 3 |
| **Hệ thống ngoài** | Một hệ thống khác gọi vào, hoặc được hệ thống này gọi ra | `ACT-04 Cổng SMS` (minh họa) nhận tin nhắc lịch | API; hoặc giao thức, dòng lệnh | Đơn giản (qua API), 1 · Trung bình (qua giao thức hoặc dòng lệnh), 2 |
| **Thời gian** (hệ thống tác vụ nền) | Chính hệ thống này tự chạy khi tới giờ hoặc khi có sự kiện, theo `N-xx` của quy trình mục 5 | `ACT-03 Hệ thống — tác vụ nền` | — | `—`, không vào TAW |

Cách phân loại QĐ 671 Phụ lục IV theo ghi chú của template: Đơn giản là hệ thống khác giao tiếp qua API; Trung bình là qua giao thức hoặc dòng lệnh; Phức tạp là người dùng qua giao diện đồ họa. Tác nhân Thời gian không phải bên ngoài giao tiếp qua giao thức nào nên template ghi `—`; nếu dự toán gốc (sheet `PL1&4.Actors`) có tính nó vào điểm thì ghi sự khác biệt vào cột `Căn cứ vai trò` và một câu hỏi `Q-A…`, không tự sửa số của dự toán.

Một hệ thống ngoài **gọi vào** và một hệ thống ngoài **được gọi ra** khác nhau ở chỗ ai khởi động; cả hai đều là một tác nhân, một dòng. Cách `create-uc` mô tả use case của chúng (xác thực máy–máy, chạy lô) nằm ở [`create-uc/reference/tac-nhan-he-thong.md`](../../create-uc/reference/tac-nhan-he-thong.md); lớp 5 chỉ cấp tên, loại, phân loại.

**Chính và phụ** (cột `Loại`, phần sau dấu chấm giữa). Một tác nhân là **chính** nếu nó khởi động ít nhất một use case — nó là "tác nhân chính" ở cột `Actor` của một dòng `UCL`. Là **phụ** nếu nó không bao giờ khởi động use case nào, chỉ tham gia hoặc nhận kết quả từ use case do tác nhân khác khởi động (cổng SMS nhận lệnh gửi, một bên nhận thông báo). Tác nhân phụ tương ứng với dòng `Bên nhận kết quả` ở mục 2 của UC do `create-uc` viết. Tính chất chính hay phụ thuộc vào **tác nhân**, nhưng ở bảng của từng module (`UCD` mục 3) nó được ghi **theo từng use case**: cùng một người có thể là tác nhân chính của use case này và phụ của use case kia.

## 3. Bóc tác nhân — nguồn và thứ tự

Quy trình mục 2 là nguồn **đầu tiên và chính** ([`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) mục 2, cặp "Quy trình mục 2 ↔ Lớp 5 tác nhân"): tác nhân lần đầu xuất hiện ở đó, kèm vai trò và căn cứ phân công. **Tên vai người đặt ở BRD mục 4** (viết trước, quy trình giữ nguyên chữ); quy trình đặt tên cho tác nhân hệ thống. Lớp 5 cấp mã, phân loại, vẽ tổng quát hóa; tên giữ nguyên chữ.

| Bước | Làm gì | Nguồn | Kết quả |
|---|---|---|---|
| 1 | Gom mọi dòng của bảng "Tác nhân" ở quy trình mục 2 của mọi quy trình trong dự án; gộp những dòng cùng tên | Quy trình mục 2, cột `Tác nhân`, `Vai trò trong domain`, `Căn cứ` | Danh sách tên thô, kèm thao tác đã ghi |
| 2 | Đối chiếu bên liên quan: mỗi `SH-nn` hoặc là tác nhân (có thao tác trên hệ thống), hoặc không (người duyệt ngân sách, cơ quan quản lý) | BRD mục 4, và BRD mục 4 cột Bên liên quan (cột này cũng là nguồn tên vai người) | Tác nhân bổ sung, hoặc danh sách `SH` không thao tác — ghi dưới bảng mục 1 |
| 3 | Quét cột `Ai — sự kiện` của máy trạng thái: mọi vai 👤 phải có mặt trong danh mục | Máy trạng thái, bảng chuyển | Phát hiện vai mà quy trình chưa gọi tên |
| 4 | Hệ thống ngoài: sự kiện nhận về, hệ thống được gọi ra | Quy trình mục 5.1 · máy trạng thái mục "Sự kiện ngoài và tác vụ nền tác động" (🔗) · BRD sơ đồ ngữ cảnh mục 3.1 | Tác nhân Hệ thống ngoài |
| 5 | Tác vụ nền: mỗi `N-xx` cần một tác nhân khởi động | Quy trình mục 5 | Một tác nhân Thời gian — thường **một** cho mọi `N-xx`, nếu không có lý do tách |
| 6 | Đối chiếu dự toán và WBS cũ: tên tác nhân ở sheet `PL1&4.Actors` hoặc cột Actor | Dự toán, WBS xlsx | Ghi chênh lệch (dự toán gộp hai vai, tách một vai) ở `Căn cứ vai trò`; phân loại QĐ 671 lấy từ đây nếu có |
| 7 | Đặt mã `ACT-nn`, phân loại, đặt chính hay phụ (lúc đầu chỉ là dự đoán; chốt lại sau khi `UCL` có dòng) | — | Bảng mục 1 |

Hai điều cần nhớ khi bóc.

**Không tự đặt thêm tác nhân vì "cho đủ".** Mọi tác nhân phải có ít nhất một thao tác trong quy trình hoặc một chuyển 👤 / 🔗. Tên không có thao tác nào là dấu hiệu nó là bên liên quan, chức danh, hoặc người thừa.

**Không tự đổi tên của quy trình.** Thấy tên ở quy trình mục 2 không qua được phép thử ở mục 4 (thật ra là chức danh gộp hai vai, hoặc hai tên là một vai), **tạm dùng tên đó**, ghi ❓ ở cột `Căn cứ vai trò` và thêm một câu hỏi `Q-A…` để lớp 2 sửa. Đề xuất mặc định trong câu hỏi nêu rõ tên mới. Lớp 5 không sở hữu tên.

Ví dụ minh họa một đoạn bảng mục 1 (rút gọn):

| Mã | Tác nhân | Loại | Thuộc đơn vị | Mô tả — mục tiêu khi dùng hệ thống | Nền tảng | Phân loại QĐ 671 | Căn cứ vai trò |
|---|---|---|---|---|---|---|---|
| ACT-01 | Khách | Người · Chính | Ngoài trung tâm | Đăng ký lịch hẹn, hủy khi không đi được, theo dõi trạng thái | WEB · APP | Phức tạp | `LH-01 bước 1` · `QC01 Đ5.1` |
| ACT-02 | Nhân viên tiếp đón | Người · Chính | Trung tâm | Duyệt hoặc từ chối lịch hẹn trước ngày hẹn | WEB | Phức tạp | `LH-01 bước 4` · SM mục 2: `PENDING_APPROVAL → APPROVED` |
| ACT-03 | **Hệ thống** — tác vụ nền | Thời gian | — | Chạy `N-01` nhắc lịch lúc 07:00 hôm trước | — | — | Quy trình mục 5 `N-01` |
| ACT-04 | Cổng SMS (minh họa) | Hệ thống ngoài · Phụ | Bên thứ ba | Nhận lệnh gửi tin nhắc lịch | API | Đơn giản | Quy trình mục 5.1 (giả sử) |

## 4. Phép thử: vai trò, chức danh, cá nhân, đơn vị

Một tên đứng ở cột `Tác nhân` phải qua đủ năm câu hỏi dưới đây. Bất kỳ câu nào trả lời "không" thì tên đó chưa phải tác nhân.

| Câu hỏi | Trả lời "không" thì là | Ví dụ minh họa | Xử lý |
|---|---|---|---|
| Tên này gọi **một** nhóm người có thể thay nhau mà không đổi việc làm trên hệ thống? | Cá nhân | "Nguyễn Văn A" | Thay bằng vai mà người đó đóng |
| Tên này nói về việc làm **trên hệ thống**, hay về chỗ đứng trong tổ chức? | Chức danh hoặc đơn vị chỉ để phân phạm vi | "Giám đốc trung tâm" nếu chỉ ký quyết định ngoài đời (`SH-01`); "Trung tâm A1". Nhóm hoặc tổ chức **có** thao tác (ra quyết định, nộp, nhận) thì qua câu này | Chức danh không thao tác → bên liên quan `SH-nn`. Đơn vị chỉ phân phạm vi → cột `Thuộc đơn vị` hoặc phạm vi dữ liệu |
| Có ít nhất **một thao tác** trong quy trình hoặc một chuyển 👤 gắn với tên này? | Bên liên quan không thao tác | Cơ quan quản lý nhận báo cáo ngoài hệ thống | Giữ ở BRD; ghi mã `SH` dưới bảng mục 1 |
| Có **tập thao tác hoặc phạm vi dữ liệu khác** mọi tác nhân khác? | Bí danh của tác nhân đã có | "nhân viên tiếp đón trung tâm" và "Nhân viên tiếp đón" làm đúng cùng việc, cùng phạm vi | Gộp về một tên (tên của quy trình), ghi bí danh vào `Mô tả` |
| Có gộp **hai vai tách nhiệm** vào một tên? | Chức danh gộp vai | "nhân viên tiếp đón" vừa nhập hộ yêu cầu vừa duyệt chính yêu cầu đó | Tách hai tác nhân, nối bằng mục 1.2; hỏi lớp 2 qua `Q-A…` |

Ngoài năm câu, **phép thử đổi người**: thử thay người đóng vai bằng một người khác có cùng chức năng và cùng phạm vi. Hệ thống có phải đổi gì (menu, quyền, dữ liệu thấy) không? Không đổi gì thì đó là vai.

## 5. Phân loại QĐ 671 và điểm TAW

Mỗi tác nhân trong `UCD` mục 1 có một giá trị cột `Phân loại QĐ 671`, theo bảng ở mục 2. **Trọng số** là 1 · 2 · 3 cho Đơn giản · Trung bình · Phức tạp. Mục 1.3 (TAW) đếm số tác nhân từng loại rồi nhân trọng số:

| Loại | Trọng số | Số tác nhân | Điểm |
|---|---:|---:|---:|
| Đơn giản | 1 | 1 | 1 |
| Trung bình | 2 | 0 | 0 |
| Phức tạp | 3 | 2 | 6 |
| **TAW** | | **3** | **7** |

Ví dụ trên dùng bốn tác nhân ở mục 3: Khách và Nhân viên tiếp đón là Phức tạp (2 × 3 = 6), Cổng SMS là Đơn giản (1), tác nhân tác vụ nền `—` nên không vào bảng. Tổng 3 tác nhân, 7 điểm. **Cộng luôn hai chiều**: tổng cột `Số tác nhân` bằng số tác nhân có phân loại ở mục 1, tổng cột `Điểm` bằng tổng của từng dòng.

Tác nhân Người ở nhiều nền tảng (WEB và APP) vẫn là **một** tác nhân Phức tạp, không đếm hai lần.

## 6. Tổng quát hóa tác nhân

**Tổng quát hóa** (UML 2.5.1 mục 18): tác nhân con **là một** tác nhân cha, nên con kế thừa **mọi use case** của cha và có thể làm thêm. Mũi tên đi **từ con tới cha**, như sơ đồ mục 1.1 (`flowchart BT`, `A2 -->|là một| A1`).

| Dùng khi | Không dùng khi |
|---|---|
| Con làm được **mọi** thao tác của cha, cộng thêm thao tác riêng. Ví dụ giả sử "Nhân viên tiếp đón cấp khu vực" là một "Nhân viên tiếp đón" làm thêm duyệt cấp khu vực | Hai vai chỉ **trùng một phần** thao tác — đó là hai tác nhân độc lập; dùng ma trận để ghi phần trùng |
| Cùng một vai, nhưng **phạm vi dữ liệu theo cấp quản lý khác nhau** và ma trận cần ghi phạm vi riêng ("trung tâm mình" so với "toàn khu vực") | Mục đích chỉ là gọn ma trận. Tổng quát hóa là quan hệ có nghĩa nghiệp vụ, không phải kỹ thuật nén bảng |
| | Hai vai có tách nhiệm với nhau — con của cha không được kế thừa thao tác trái tách nhiệm |

Khi dùng, **ma trận vẫn có một cột cho mỗi tác nhân**, và ô của con ghi rõ cả phần kế thừa (không bỏ trống chờ người đọc tự suy). Phần kế thừa ghi trùng giá trị với cột cha, phạm vi có thể khác. Nếu quy trình mục 2 chỉ có một tên cho cả hai cấp mà ma trận cần tách theo cấp, đặt tên con là "tên của quy trình (cấp …)" và ghi `Q-A…` để lớp 2 xác nhận. Đây là cách xử lý của skill, cần BA chốt ở lần dùng đầu.

Tổng quát hóa giữa **use case** không dùng ở lớp này; tái sử dụng giữa use case thể hiện bằng «include» (xem [`dien-tung-muc-ucd.md`](dien-tung-muc-ucd.md) mục 2).

## 7. Tách nhiệm

**Tách nhiệm** (separation of duties) là quy tắc: hai thao tác không được do cùng một người làm trên cùng một bản ghi — người lập chứng từ không tự duyệt chứng từ đó. Nguồn: quy trình mục 2 "Tách nhiệm bắt buộc" và các điểm kiểm soát loại Tách nhiệm ở mục 9; nội dung có mã nằm ở lớp 6 (BR); ERD `R-xx` chỉ là phép kiểm dữ liệu dẫn BR; máy trạng thái dẫn BR ở cột Điều kiện (bảng "Tách nhiệm" ở [`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) mục 1).

**`UCD` mục 1.2 liệt kê mọi cặp** ở quy trình mục 2 "Tách nhiệm bắt buộc" và mục 9 loại Tách nhiệm — **bất kể hai thao tác thuộc cùng hay khác tác nhân** — mỗi cặp dẫn quy trình và BR. Lý do: tách nhiệm giữa hai vai khác nhau vẫn là quy tắc phải thi hành (RBAC: ràng buộc tách nhiệm tĩnh và động, ANSI INCITS 359) — một người có thể được cấp cả hai vai, hoặc đóng cả hai vai trên cùng một bản ghi; chỉ ma trận thì không thấy ràng buộc này.

Hai trường hợp khác nhau ở ma trận, nhưng **cả hai đều ghi ở mục 1.2**:

| Trường hợp | Biểu hiện ở ma trận | Dòng ở mục 1.2 |
|---|---|---|
| Hai thao tác thuộc **hai tác nhân khác nhau** (Khách gửi, nhân viên tiếp đón duyệt) | Mỗi tác nhân chỉ có một ký hiệu; không ô nào tự cho thấy ràng buộc | "Gửi yêu cầu đặt lịch ≠ Duyệt lịch hẹn" kèm căn cứ; nếu hai vai có thể cùng một người thì ghi thêm "trên cùng một bản ghi" |
| Hai thao tác thuộc **cùng một tác nhân** (giả sử nhân viên tiếp đón được nhập hộ yêu cầu và cũng duyệt) | Một cột có cả `C` lẫn `A` trên cùng thực thể | "Gửi yêu cầu đặt lịch (nhập hộ) ≠ Duyệt lịch hẹn — trên cùng một bản ghi" kèm căn cứ |

Cột `Căn cứ` ghi quy trình (`QT_DA1_LichHen mục 9 điểm 2`) và BR; trước khi lớp 6 có mã thì ghi điều khoản (`QC01 Đ6.3`) — lượt điền ngược thêm `BR-A04 Người đặt hộ không tự duyệt` trước điều khoản. Lớp 5 **chỉ ghi cặp và căn cứ**; nội dung kiểm là điều kiện chuyển ở máy trạng thái hoặc một BR ở lớp 6, thân UC do `create-uc` viết sẽ dẫn nguồn đó.

## 8. Câu hỏi cần chốt phổ biến của tác nhân

Mỗi trường hợp dưới đây thường sinh một dòng `Q-A…` ở `UCD` mục 5 (Câu hỏi cần chốt); đề xuất mặc định nên ghi sẵn để BA chỉ cần duyệt.

| Tình huống | Câu hỏi mặc định |
|---|---|
| Quy trình dùng chức danh gộp hai vai | "Tách thành hai tác nhân A và B?" Đề xuất: tách, theo phép thử ở mục 4 |
| Bên liên quan có thao tác nhưng quy trình chưa gọi tên | "SH-xx có làm bước nào trên hệ thống không?" Đề xuất: không, giữ ở BRD |
| Máy trạng thái có chuyển 👤 do vai chưa có trong quy trình | "Vai này là tác nhân mới hay tên khác của ACT-nn?" |
| Phạm vi dữ liệu theo cấp chưa rõ cho một ô ma trận | "nhân viên tiếp đón cấp khu vực xem dữ liệu của trung tâm nào?" Đề xuất: toàn khu vực |
| Dự toán gộp hai tác nhân hoặc tính tác nhân tác vụ nền vào điểm | "Giữ số liệu dự toán hay theo phân loại của UCD?" Đề xuất: giữ dự toán ở file dự toán, UCD ghi chênh lệch |
