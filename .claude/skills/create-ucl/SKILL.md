---
name: create-ucl
description: Lập danh sách use case, cây WBS chức năng, danh mục tác nhân, sơ đồ use case và ma trận tác nhân × use case cho lớp 5 (Who) của business layer, theo hai template use_case_diagram.md và use_case_list.md. Định nghĩa tác nhân là vai trò, một dòng tính năng là một use case theo hạt của create-uc, mã WBS làm mã use case, permission key, quy tắc 100%, include/extend, phân loại tác nhân theo QĐ 671. Bắt buộc gọi reviewer độc lập trước khi đóng. Gọi khi người dùng nói "lập danh sách use case", "dựng cây WBS chức năng", "lập danh mục tác nhân", "vẽ sơ đồ use case", "ma trận tác nhân × use case", "lớp 5", hoặc khi mở một file UCD_ / UCL_.
---

# Lập danh sách use case và sơ đồ tác nhân — lớp 5

Template đi kèm, hai file, viết theo thứ tự này:

1. [`2-ba-overview/templates/5-actor-usecase/use_case_diagram.md`](../../../2-ba-overview/templates/5-actor-usecase/use_case_diagram.md) — tác nhân, sơ đồ, ma trận tác nhân × use case. Sao thành `UCD_{MÃ DỰ ÁN}_{PHẠM VI}_vNN.md`.
2. [`2-ba-overview/templates/5-actor-usecase/use_case_list.md`](../../../2-ba-overview/templates/5-actor-usecase/use_case_list.md) — cây WBS chức năng và danh sách use case. Sao thành `UCL_{MÃ DỰ ÁN}_{PHẠM VI}_vNN.md`.

Phiên bản theo bảng Version control của [`ba-overview`](../ba-overview/SKILL.md).

## Đọc gì, khi nào

File này là **phần lõi** — đọc hết trước khi viết tài liệu. Phần tra cứu nằm trong `reference/` của skill này và trong skill [`ba-overview`](../ba-overview/SKILL.md); mở đúng file khi đến đúng việc.

| Khi đang làm | Mở |
|---|---|
| Bóc tác nhân từ quy trình và BRD, phép thử vai trò / chức danh, phân loại QĐ 671, tính TAW, tổng quát hóa, tách nhiệm | [`reference/tac-nhan.md`](reference/tac-nhan.md) |
| Điền từng mục của `use_case_diagram.md`, vẽ sơ đồ, «include» / «extend», ma trận | [`reference/dien-tung-muc-ucd.md`](reference/dien-tung-muc-ucd.md) |
| Bóc dòng use case từ bước quy trình, chuyển 👤, `N-xx`, dự toán; dựng cây; quy tắc 100% | [`reference/boc-uc-va-wbs.md`](reference/boc-uc-va-wbs.md) |
| Điền từng mục và từng cột của `use_case_list.md` | [`reference/dien-tung-muc-ucl.md`](reference/dien-tung-muc-ucl.md) |
| Giao dòng cho `create-uc`, đồng bộ tên và trạng thái | [`reference/ban-giao-create-uc.md`](reference/ban-giao-create-uc.md) |
| Căn cứ, câu hỏi mở `Q-…`, giả định `GD-xxxx`, ❓, ba giá trị đặc biệt | [`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) |
| Quy ước chung: hạt và mã use case G1, G2 (mục 8), cách dẫn chiếu (mục 9), tài liệu được dẫn mà chưa có (mục 11) | [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Phân vân một nội dung thuộc lớp nào | [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md) |
| Cần ví dụ minh họa | [`ba-overview/reference/vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md) |
| Viết xong, gọi reviewer độc lập | [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md) |
| Hiểu một use case là gì, to bằng nào | [`create-uc`](../create-uc/SKILL.md) mục "UC là gì" và "Một UC to bằng nào" |

Thứ bậc khi hai nguồn nói khác nhau: `00_quy_uoc_chung.md` → template → skill; G1, G2 nằm ở `00_quy_uoc_chung.md` mục 8. Mọi mã trong skill này — `ACT-01`, `DA1.WEB.03.01.01`, `lich_hen.approve`, `Q-A01`, `GD-0047` — là **mã minh họa**, không phải mã của dự án nào.

## Quy trình viết

1. **Kiểm cổng vào, sao template.** Quy trình, ERD và máy trạng thái phải ở `Chờ review` trở lên ([`ba-overview`](../ba-overview/SKILL.md) mục "Cổng vào, cổng ra"). Sao hai template thành hai file dự án theo `00_quy_uoc_chung.md` mục 2. Không sửa file template.
2. **Viết `UCD` mục 1 — danh mục tác nhân (bản đầu)** theo [`reference/tac-nhan.md`](reference/tac-nhan.md): bóc từ quy trình mục 2, đối chiếu BRD bên liên quan, chuyển 👤 của máy trạng thái, dự toán. Cấp `ACT-nn`, phân loại, tổng quát hóa, TAW, và mục 1.2 tách nhiệm. Lúc này `Chính` / `Phụ` mới là dự đoán.
3. **Viết `UCL` — dựng cây và các dòng** theo [`reference/boc-uc-va-wbs.md`](reference/boc-uc-va-wbs.md) và [`reference/dien-tung-muc-ucl.md`](reference/dien-tung-muc-ucl.md): mã WBS, tên, tác nhân, `Permission key`, `Mã UC gốc`, căn cứ tối thiểu ở `Ghi chú`. Viết **`UCL` mục 5** (từ điển WBS, `Mô tả phạm vi`) **trước hoặc song song** với các dòng, vì phép kiểm cha – con của quy tắc 100% dựa vào nó.
4. **Quay lại soát `UCD` mục 1** khi `UCL` đã có dòng: chốt `Chính` / `Phụ` theo cột `Actor`, thêm tác nhân phát hiện thêm, đối chiếu mục 1.2. Rồi viết `UCD` mục 2–4 (sơ đồ tổng quan, sơ đồ theo module, ma trận) — các mục này dựng **từ** danh sách đã có. Rồi hoàn `UCL` mục 2 và 4. Mô tả giao dịch (mục 4) quyết định cột `Độ phức tạp`.
5. **Kiểm quy tắc 100% (`UCL` mục 6)**, điền các khối cuối có sẵn của hai template (Câu hỏi cần chốt, Rủi ro còn lại, Điểm tạm hoãn; không có nội dung thì ghi *Không có …*, không để `{{…}}`) và tự soát theo checklist cuối file này. Chỗ nào chưa có căn cứ thì ghi ❓ và câu hỏi `Q-…`, không đoán; AI không tự tạo `GD-xxxx`.
6. **Điền sang tài liệu khác, trước cổng ra** (mục "Điền sang tài liệu khác trước cổng ra lớp 5"): quy trình mục 10 và BRD mục 12 cột `Use case`, ghi Version control của hai tài liệu đó.
7. **Gọi reviewer độc lập — bắt buộc**, xem mục "Review độc lập". Sửa theo phát hiện hoặc ghi lý do không sửa. Sửa nhiều thì gọi lại.
8. **Xóa mọi khối `<!-- HƯỚNG DẪN … -->`** trong hai file dự án, chuyển trạng thái `Chờ review`, kiểm cổng ra. Sau lớp 6 chạy **lượt điền ngược** (mục "Việc của lớp 5 sau lớp 6").

---

## Lớp 5 là gì

**Lớp 5 (Who) trả lời: ai tham gia, mỗi người làm những việc nào trên hệ thống, và quyền tới đâu.** Nó gồm hai tài liệu: `UCD` giữ **tác nhân** và cách họ nối với use case; `UCL` giữ **danh sách use case** xếp thành cây WBS. Tác nhân là **vai trò**; use case là **một thao tác** theo đúng nghĩa của `create-uc`.

**Hạt của use case (G1, `00_quy_uoc_chung.md` mục 8.1) — giải thích ở đúng chỗ này, các file khác của skill chỉ dẫn về đây.** Use case ở lớp này **không** được định nghĩa lại. Mỗi dòng tính năng của `UCL` là một use case theo **năm tính chất** của [`create-uc`](../create-uc/SKILL.md) mục "UC là gì" — một thao tác, một tác nhân chính, một kết quả, một quyền, một bước ghi — và to bằng mức mục "Một UC to bằng nào". Template trước đây nói "một mục tiêu trọn vẹn" theo Cockburn; từ 27/10/2026 template đã sửa theo G1. Lý do: `create-uc` viết thân UC theo hạt này, lớp 5 cấp dòng cho `create-uc` thì phải cùng hạt. Bảng gốc: [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 8.

**Nguồn chuẩn và vị trí trong template:**

| Artifact (theo bài giới thiệu lớp Who và template) | Chuẩn | Nằm ở |
|---|---|---|
| Use Case Diagram — tác nhân và việc mỗi tác nhân làm | OMG UML 2.5.1 mục 18; Jacobson 1992, Use-Case 2.0 | `UCD` mục 1, 2, 3 |
| Ma trận phân quyền RBAC — vai trò × công việc: được hay không, trong phạm vi nào | ANSI INCITS 359-2004 | `UCD` mục 4 (ma trận tác nhân × use case) |
| Phân loại tác nhân, điểm tác nhân TAW | QĐ 671/QĐ-BTTTT 2024 Phụ lục I, IV | `UCD` mục 1, 1.3 |
| Mức mục tiêu ☁ 🌊 🐟 | Cockburn, *Writing Effective Use Cases* | `UCL` cột `Mức`; chọn dòng vẽ lên sơ đồ |
| Cây WBS, quy tắc 100%, từ điển WBS | PMI Practice Standard for WBS; ISO 21511:2018 | `UCL` mục 1, 3, 5, 6 |
| Danh sách chức năng, độ phức tạp theo giao dịch, B·M·T | QĐ 671 Phụ lục II, III, V | `UCL` mục 2, 3, 4 |

Từ đó rút ra sáu tính chất. Phân vân một thứ có đúng là thứ của lớp 5 không, quay về bảng này:

| Tính chất | Nghĩa là | Thể hiện ở |
|---|---|---|
| **Tác nhân là vai trò** | Một tập thao tác và một phạm vi dữ liệu, không phải chức danh, cá nhân, hay đơn vị chỉ dùng để phân phạm vi dữ liệu. Một nhóm hoặc tổ chức tương tác với hệ thống như một bên thì là tác nhân. Một người có thể đóng nhiều vai | `UCD` mục 1; tên giữ đúng chữ của quy trình mục 2 |
| **Dòng tính năng là một use case** | Cây WBS dừng ở cấp 5, và mỗi lá là một use case theo hạt G1 (đoạn trên). Thêm, sửa, xóa, xem là bốn dòng | `UCL` mục 3, cột `Tính năng` |
| **Mã use case là mã WBS** | Cột `No` của lá chính là mã UC, không có tiền tố `UC-` (G2, `00_quy_uoc_chung.md` mục 8.2). Mã đã phát hành không đánh lại | `UCL` cột `No`; `id` trong file UC của `create-uc` |
| **Mỗi use case có một quyền** | Một `Permission key` duy nhất, hoặc `n/a`, hoặc `chưa chốt (<ai>)`. Use case là đơn vị nhỏ nhất phân quyền được | `UCL` cột `Permission key` (cột cuối) |
| **Ma trận không có ô trống** | Mỗi cặp tác nhân × use case có một giá trị: ký hiệu kèm phạm vi, `—` nếu chắc chắn không được, hoặc ❓. Ô trống nghĩa là chưa ai hỏi | `UCD` mục 4 |
| **Cây phủ kín, không trùng** | Mọi bước người làm, mọi chuyển 👤, mọi tác vụ nền `N-xx`, mọi nhóm dự toán đều có use case phủ; nút con cộng lại bằng đúng nút cha | `UCL` mục 6 |

**Tác nhân** gồm ba loại: **Người**, **Hệ thống ngoài**, và **Thời gian / Hệ thống tác vụ nền** — chính hệ thống này tự chạy theo lịch hoặc sự kiện. **Nhóm hoặc tổ chức** (ví dụ một hội đồng ra quyết định) là tác nhân khi nó tương tác với hệ thống như một bên — ra quyết định, nộp, nhận kết quả; loại là `Người` khi qua giao diện, `Hệ thống ngoài` khi qua API. **Đơn vị** chỉ dùng để phân phạm vi dữ liệu thì không phải tác nhân. Đây là lựa chọn của skill để dung hòa bài giới thiệu lớp Who (tác nhân gồm người, nhóm, tổ chức, hệ thống ngoài) với phép thử vai trò. Mỗi tác nhân là **chính** (khởi động ít nhất một use case) hoặc **phụ** (chỉ tham gia hay nhận kết quả). Định nghĩa đầy đủ, phép thử, phân loại QĐ 671, tổng quát hóa, tách nhiệm: [`reference/tac-nhan.md`](reference/tac-nhan.md).

**Quan hệ giữa các use case trên sơ đồ.** «include»: use case gốc **luôn** gọi use case kia ở một bước của nó; mũi tên đi **từ use case gốc tới use case được gọi**. «extend»: một use case **tùy chọn, có điều kiện** gắn thêm vào use case gốc; mũi tên đi **từ use case mở rộng về use case gốc**. Cả hai chỉ vẽ khi bên kia **tự nó là một use case** — có quyền riêng, kết quả riêng. Không vẽ trình tự bằng «include» ("làm A rồi làm B" là việc của quy trình). Chi tiết và ví dụ ở [`reference/dien-tung-muc-ucd.md`](reference/dien-tung-muc-ucd.md) mục 2 và 3.

**Hai quy ước bắt buộc khi sao `UCL`** (từ `ba-overview`, G1, G2 ở `00_quy_uoc_chung.md` mục 8): cột `Mã UC gốc` **chỉ** dùng cho mã **dự toán** (`B-II.2 / UC031`), mã UC là cột `No`; và **thêm cột `Permission key` làm cột cuối**.

## Có phải thứ của lớp 5 không

Mọi ví dụ dưới đây là **mã minh họa** theo [`vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md).

| Thứ đang xét | Kết luận | Vì sao |
|---|---|---|
| "Khách" | **Là tác nhân** — Người, chính | Vai trò gồm tập thao tác riêng: gửi, hủy, xem lịch hẹn của mình |
| "Nguyễn Văn A, khách mã 123" | **Không** | Một cá nhân là dữ liệu, không phải vai. A đóng vai Khách |
| "Trung tâm A1" | **Không** là tác nhân | Là đơn vị chỉ để phân phạm vi dữ liệu. Nó xuất hiện ở cột `Thuộc đơn vị` hoặc làm phạm vi "trung tâm mình" trong ma trận |
| "Hội đồng thẩm định" nhận hồ sơ và ra quyết định trên hệ thống (ví dụ riêng của skill, ngoài bảng mã chuẩn) | **Là tác nhân** — Người, chính | Một nhóm tương tác với hệ thống như một bên: ra quyết định, nhận kết quả. Khác "Trung tâm A1" ở chỗ có tập thao tác riêng |
| "Hệ thống — tác vụ nền" chạy `N-01` nhắc lịch lúc 07:00 | **Là tác nhân** — loại Thời gian, chính | Khởi động use case "Nhắc lịch hẹn" mà không ai bấm |
| "Gửi yêu cầu đặt lịch" (`LH-01 bước 1–3`, `DA1.WEB.03.01.03`) | **Là một dòng use case** | Một thao tác, một tác nhân, một kết quả `PENDING_APPROVAL`, một quyền |
| "Quản lý lịch hẹn" ở cột `Tính năng` | **Không** | Gộp gửi, duyệt, từ chối, hủy, xem. Chỉ hợp lệ ở cấp **chức năng** (cấp 4, mức ☁), không phải lá |
| "Duyệt hoặc từ chối lịch hẹn" trên một dòng | **Không** — hai dòng | Hai trạng thái cuối khác nhau (`APPROVED`, `REJECTED`); mỗi dòng một quyền |
| "Kiểm còn lượt trong tuần" (`LH-01 bước 2`, Hệ thống) | **Không** là dòng | Một bước hệ thống nằm bên trong "Gửi yêu cầu đặt lịch" |
| «include» từ "Gửi yêu cầu đặt lịch" tới "Duyệt lịch hẹn" | **Sai** | Là trình tự có khoảng chờ giữa hai người — thuộc quy trình `LH-01`, không vẽ bằng include |
| Ô `Nhân viên tiếp đón × Gửi yêu cầu đặt lịch` để trống | **Sai** | Phải là `—` (chắc chắn không), một ký hiệu kèm phạm vi, hoặc ❓ kèm `Q-A…` |

## Ranh giới với lớp kề

Bảng đầy đủ nằm ở [`ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md); đây chỉ là **phía lớp 5** của từng cặp.

| Cặp (dòng trong `ranh-gioi-cac-lop.md`) | Việc của lớp 5 |
|---|---|
| Mục 2, "BRD mục 4 ↔ Quy trình mục 2 ↔ Lớp 5 tác nhân" | Cấp `ACT-nn`, phân loại QĐ 671, vẽ tổng quát hóa. Giữ nguyên chữ tên vai (BRD mục 4, quy trình mục 2) và tên tác nhân hệ thống (quy trình mục 2); không đổi tên |
| Mục 2, "Quy trình ↔ Use case" | Mỗi use case là phần nằm bên trong **một bước "người làm trên hệ thống"**. Lớp 5 không chép bảng bước của quy trình; ghi mã bước kèm tên ở cột `Ghi chú` |
| Mục 2, "Máy trạng thái ↔ Lớp 5" | Mỗi chuyển 👤 phải có **ít nhất một** use case phủ — kiểm ở `UCL` mục 6 |
| Mục 2, "Lớp 5 ↔ create-uc" | Lớp 5 cấp **dòng**: mã, tên, tác nhân, permission key, mã dự toán, căn cứ tối thiểu ở `Ghi chú`. Không viết luồng, nhánh, sở cứ từng bước |
| Mục 1, "Tác nhân có mã, phân loại, tách nhiệm" và "Danh sách UC, mã UC, permission key, cây WBS" | Lớp 5 là nơi **sở hữu** các thứ này; lớp khác dẫn `ACT-nn` và mã UC |
| Mục 3, lớp 5 giao đi | Dòng UC và permission key → `create-uc`; ma trận tác nhân × UC → ma trận quyền của SRS |

Phạm vi dữ liệu theo cấp quản lý ("trung tâm mình", "toàn khu vực") nằm ở **ma trận của lớp này** (xem đoạn về lớp Where dưới bảng "Sáu lớp" của [`ba-overview`](../ba-overview/SKILL.md)) và ở mục 2 của từng UC do `create-uc` viết; lớp 5 không dựng sơ đồ đơn vị.

## Nguyên tắc

**1. Tác nhân là vai trò, và tên không do lớp 5 đặt.** Tên vai người do BRD mục 4 (cột Bên liên quan) đặt, quy trình mục 2 giữ nguyên chữ; tên tác nhân hệ thống do quy trình mục 2 đặt. Lớp 5 không đặt lại tên đã có. Thấy một tên trong quy trình thật ra là chức danh gộp hai vai, hoặc hai tên cùng một vai, thì ghi câu hỏi `Q-A…` cho lớp 2, tạm dùng tên cũ. Phép thử ở [`reference/tac-nhan.md`](reference/tac-nhan.md).

**2. Cây dừng ở cấp 5 và lá là một use case theo hạt của `create-uc`.** Không có dòng "Quản lý X" ở cấp tính năng; dòng dự toán thô được tách thành nhiều dòng use case mà vẫn giữ `Mã UC gốc`. Lớp 5 **không** đoán lại hạt: gặp dòng khó thì quay về `create-uc` mục "Một UC to bằng nào".

**3. Mọi ô có giá trị.** Ma trận không ô trống; `UCL` không ô nào bỏ trắng. Trống nghĩa là chưa ai hỏi. Dùng ba giá trị đặc biệt của [`so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) mục 3, và dùng đúng nghĩa: `n/a` chỉ cho "chắc chắn không có".

**4. Phủ hai chiều.** Từ nguồn xuống: mọi bước người làm, chuyển 👤, `N-xx`, nhóm dự toán đều rơi vào ít nhất một dòng. Từ dòng lên: mỗi dòng use case có căn cứ tối thiểu ở `Ghi chú`, hoặc được đánh dấu là dòng **ngoài dự toán** để BA thấy ngay phạm vi đang phình.

**5. Sơ đồ là bản đồ, không phải luồng.** Sơ đồ use case cho thấy ai làm việc gì và quan hệ giữa các việc; không cho thấy thứ tự. Thứ tự là việc của quy trình. Không có luồng nào trong `UCD`, và cũng không có luồng trong `UCL`.

## Mã và tên

Quy ước chung — `OBJ-`, `BRQ-`, `SH-`, `QT-`, `D-`, `GS-`, `CH-`, `N-`, `BR-`, `Q-{lớp}nn`, cách dẫn mã kèm tên ngắn, căn cứ pháp lý — theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4. Phần riêng lớp 5:

| Thứ | Quy ước |
|---|---|
| Mã tác nhân | `ACT-nn`, hai chữ số, cấp một lần, duy nhất trong `UCD`, không dùng lại sau khi bỏ. Lớp khác dẫn `ACT-nn <Tên>` (`00_quy_uoc_chung.md` mục 9). Khi lớp 5 chưa cấp mã, các lớp trước dùng đúng tên ở quy trình mục 2 |
| Mã use case | **Chính là mã WBS ở cột `No`**: `[tên PM].[nền tảng].[module].[chức năng].[tính năng]`, ví dụ `DA1.WEB.03.01.01`. Không tiền tố `UC-`. Nền tảng một trong `WEB · APP · KIOSK · API · JOB`; mỗi cấp sau hai chữ số. Mã đã phát hành không đánh lại; tính năng bỏ đánh ⊘ và giữ dòng |
| Tên use case | Động từ + đối tượng: "Gửi yêu cầu đặt lịch". Không "Màn …", không "Quản lý …". Đối tượng lấy đúng thuật ngữ ở quy trình mục 1.1. **Trùng chữ với `ten` trong file UC** của `create-uc` |
| Tên chức năng, module | Cụm danh từ, được phép "Quản lý …" — chỉ ở cấp 3 và 4, không ở lá |
| `Permission key` | Dạng `{thực_thể}.{thao_tác}`, snake_case. Tên thực thể lấy đúng ERD rồi **hạ chữ thường** (`Lich_Hen` → `lich_hen`; đây là lựa chọn của skill): `lich_hen.approve`. Hệ phân quyền của khách hàng đã có quy ước thì **theo quy ước đó**. **Duy nhất toàn danh sách**; hai dòng trùng key là dấu hiệu hai dòng trùng mục tiêu hoặc key đặt sai. Giá trị khác: `n/a` (use case không cần quyền, gồm use case tác nhân hệ thống tự chạy), `chưa chốt (<ai>)` |
| Mã câu hỏi | `Q-A01` cho câu hỏi ở `UCD`, `Q-U01` cho câu hỏi ở `UCL` — tiền tố đã chốt ở [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4 (`Q-A`, `Q-U`); điểm tạm hoãn `TH-nn` cũng ở đó |
| Mã module trong `UCD` mục 3 | Chính mã WBS cấp module: `3.1. DA1.WEB.03 — Lịch hẹn` |

## Chỗ template còn lệch hoặc thiếu, và cách xử lý

Template là nguồn, nhưng có chỗ nó mâu thuẫn với chính nó, với `00_quy_uoc_chung.md`, hoặc chưa nói. Cách xử lý dưới đây áp dụng cho file dự án; **không sửa template**. Các khối `00_quy_uoc_chung` mục 3 và 6 (câu "không chứa gì", dòng Dự án · Phân hệ / Người review / Mức mật, Phê duyệt, bảng câu hỏi đủ sáu cột, Câu hỏi cần chốt của `UCL`, Rủi ro còn lại, Điểm tạm hoãn) **đã có trong cả hai template** từ 27/10/2026 — điền theo khối có sẵn, số mục ở [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6: `UCD` 5 Câu hỏi · 6 Rủi ro · 7 Điểm tạm hoãn · 8 Nguồn; `UCL` 7 Câu hỏi · 8 Rủi ro · 9 Điểm tạm hoãn · 10 Nguồn.

| # | Chỗ lệch hoặc thiếu | Xử lý |
|---|---|---|
| 1 | `UCL` nói "mỗi tính năng là một mục tiêu trọn vẹn" (Cockburn) | **Đã sửa ở template ngày 27/10/2026** theo G1: "một thao tác của một tác nhân, một quyền, một kết quả, theo `create-uc`". Không còn lệch |
| 3 | `UCL` không có cột `Permission key` | Thêm làm cột cuối (hệ quả của G1 ở `00_quy_uoc_chung.md` mục 8; template cho phép cột bổ sung đặt sau cột 9) |
| 4 | `UCL` cột `Tầng` và dòng giới thiệu trỏ tới `traceability_matrix.md` chưa có | Cột `Tầng` ghi `chưa chốt (BA)`; dòng giới thiệu trỏ tới BRD mục 12 thay cho ma trận truy vết (`00_quy_uoc_chung.md` mục 11) |
| 5 | `UCL` mục 6 chỉ có bốn dòng kiểm, thiếu `N-xx`, sự kiện 🔗 và quy tắc "nút con = nút cha" | Thêm các dòng đó (danh sách ở [`dien-tung-muc-ucl.md`](reference/dien-tung-muc-ucl.md) mục 6) |
| 6 | `UCD` mục 4 trong ví dụ để ô trống; bài giới thiệu lớp Who nói ô trống là chưa ai hỏi | Không ô nào trống: `—`, ký hiệu kèm phạm vi, hoặc ❓ kèm `Q-A…` |
| 7 | `UCD` mục 4 không có chỗ cho phạm vi dữ liệu | Ghi **trong ô**: `R · trung tâm mình` |
| 8 | `UCD` nói "sơ đồ chỉ vẽ 🌊", trong khi theo G1 mọi dòng đều là use case | Cột `Mức` chỉ để phân loại và chọn dòng vẽ; **ma trận liệt kê mọi dòng**, sơ đồ chỉ vẽ 🌊 (cộng 🐟 khi nó là đầu mút của include/extend) |
| 9 | `UCL` mục 4 ví dụ liệt kê ba dòng đánh số rồi ghi "3 giao dịch", trong khi định nghĩa là mỗi giao dịch một cặp gửi → phản hồi | Mỗi dòng đánh số là **một cặp** viết trên một dòng: `1. Khách gửi … → Hệ thống phản hồi …`; `Số giao dịch` = số dòng đánh số. Đây là lựa chọn của skill, **khác ví dụ của template** |
| 10 | `UCD` không có chỗ ghi bên liên quan không thao tác hệ thống | Một dòng ngay dưới bảng mục 1: "Bên liên quan không thao tác hệ thống: SH-xx, SH-yy" |
| 11 | Mục 10 của quy trình có cột `Quy trình · Nghĩa vụ · Căn cứ`, không có cột bước | Ghi bước vào cột `Quy trình`: `LH-01 bước 4`. Việc này làm ở bước 6 của quy trình viết, trước cổng ra lớp 5 |
| 12 | `UCL` mục 3 ghi dòng cấp 1–4 "chỉ điền đến cột tên của cấp đó", nhưng dòng mẫu cấp 4 của chính template điền cả `Mã UC gốc`, `Ghi chú`, `Mức` | Theo dòng mẫu: cấp 4 điền thêm ba cột đó; cấp 1–3 chỉ mã và tên. Cột `Trạng thái đặc tả` của cấp 1–4 để trống (lựa chọn của skill) |
| 13 | `UCL` mục 4 chỉ nêu "UC đưa vào dự toán", trong khi mọi dòng đều có cột `Độ phức tạp` | Dòng ngoài dự toán ghi `chưa chốt (BA)` ở `BMT`, `Độ phức tạp`, `Mã UC gốc` cho đến khi BA quyết |
| 14 | `UCD` cột `Quan hệ` trong ví dụ ghi «include» kèm "khi …", nhưng include là **luôn** | include không ghi điều kiện; extend **bắt buộc** ghi điều kiện |
| 15 | Template không nói một module trải nhiều nền tảng đánh mã ra sao | Theo G2 ở `00_quy_uoc_chung.md` mục 8: giữ mã module, số chức năng duy nhất trong module tính chung mọi nền tảng, đếm module một lần |

## Tìm căn cứ

Bốn bước tìm, cách ghi `GD-xxxx`, ❓ `[CẦN BA CHỐT]`, ba giá trị đặc biệt, câu hỏi mở `Q-…`: theo [`so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md). Chỉ nói thêm **nguồn đặc thù** của lớp 5; tra theo thứ tự này trước khi xuống bước 2 của bốn bước:

| Cần căn cứ cho | Tìm ở |
|---|---|
| Một tác nhân có tồn tại không, tên gì, làm thao tác nào | Quy trình mục 2 (cột `Căn cứ` là điều khoản phân công hoặc `D-xx`) · bước quy trình có cột `Tác nhân` · BRD mục 4 bên liên quan `SH-nn` |
| Tác nhân làm chuyển trạng thái nào | Máy trạng thái, cột `Ai — sự kiện`, ký hiệu 👤 / 🔗 / ⚙️ |
| Hệ thống ngoài, tác nhân tác vụ nền | Quy trình mục 5 (`N-xx`), mục 5.1 (sự kiện từ hệ thống ngoài) · BRD sơ đồ ngữ cảnh mục 3.1 |
| Phân loại tác nhân, hạng mục chức năng, mã gốc | Dự toán: sheet `PL1&4.Actors`, `PL2.Functions`, `PL3.UseCase` · file WBS hiện có, cột Actor |
| Tách nhiệm | Quy trình mục 2 "Tách nhiệm bắt buộc" · quy trình mục 9 điểm kiểm soát loại Tách nhiệm · ERD mục 5 `R-xx` · điều kiện "khác người lập" ở máy trạng thái · văn bản pháp luật |
| Một ô ma trận | Chính chuyển 👤 hoặc bước quy trình làm phát sinh ô đó; phạm vi dữ liệu theo cấp quản lý từ BRD mục 3 (phạm vi đơn vị) hoặc văn bản về thẩm quyền theo cấp |
| Phân loại B·M·T, ưu tiên P1·P2·P3 | Dự toán (B·M·T); P1·P2·P3 lấy từ BRD mục 3 `Giai đoạn` (quy tắc ở [`dien-tung-muc-ucl.md`](reference/dien-tung-muc-ucl.md) mục 3, cột `Ưu tiên`) |
| Tên quyền (`Permission key`) | Hệ phân quyền hiện hành của khách hàng hoặc của sản phẩm cũ; chưa có thì lớp 5 đề xuất |

Ma trận **không tự sinh thông tin**: mỗi ký hiệu truy được về một chuyển 👤, một bước quy trình, hoặc một dòng dự toán. Ô nào chỉ là suy đoán thì AI ghi `❓ [CẦN BA CHỐT]` kèm mã `Q-A…` và dòng trong bảng câu hỏi, không tự điền ký hiệu.

## Điền sang tài liệu khác trước cổng ra lớp 5

Theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10, `create-ucl` điền hai ô sau **khi chạy lớp 5, trước cổng ra** — không dồn về sau lớp 6:

| Ô | Cách điền |
|---|---|
| Quy trình mục 10 "Quy trình chưa có Use case" | Làm cùng lúc kiểm quy tắc 100% (`UCL` mục 6). Mỗi bước người làm chưa có use case một dòng: `Quy trình` = `LH-01 bước n` kèm tên, `Nghĩa vụ` = việc phải có use case mà chưa có, `Căn cứ` = dòng kiểm ở `UCL` mục 6. Đã phủ hết thì ghi một dòng *Không có — mọi bước người làm đã có use case* (không để trống) |
| BRD mục 12, cột `Use case` | Mỗi hàng truy vết (`OBJ` · `BRQ`) ghi mã use case phủ các bước của quy trình mà `BRQ` đó dẫn tới. Lựa chọn của skill: ghi mã **lá** khi `BRQ` chỉ phủ một vài lá; phủ cả chức năng thì ghi mã chức năng cấp 4 kèm tên (`DA1.WEB.03.01 Quản lý lịch hẹn`). `BRQ` chắc chắn không có use case (làm ngoài hệ thống) thì `n/a`; chưa rõ thì ❓ kèm `Q-U…` |

Ghi vào **Version control của chính hai tài liệu được điền** — sửa không đổi nghĩa — ở mọi trạng thái thêm một gạch đầu dòng vào dòng phiên bản hiện tại, không tăng `vNN`, không đổi trạng thái (`00_quy_uoc_chung.md` mục 3.3) —, và ghi `UCD` / `UCL` đã điền gì. AI không ghi "BA chốt".

## Việc của lớp 5 sau lớp 6

Lớp 6 chạy sau lớp 5, nên lúc viết lớp 5 chưa có mã `BR-`. Ở **lượt điền ngược** (bước 3 của mục "Thứ tự chạy" trong [`ba-overview`](../ba-overview/SKILL.md)), lớp 5 điền ba chỗ — mỗi chỗ đang dẫn thẳng điều khoản mà nay đã có BR thì **thêm** mã kèm tên ngắn **trước** điều khoản, **giữ** điều khoản:

| Việc | Cách làm |
|---|---|
| Cột `Ghi chú` của `UCL` | `LH-01 bước 2 · BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1` |
| Cột `Căn cứ vai trò` của `UCD` mục 1 | Cùng cách thêm mã BR trước điều khoản |
| Bảng tách nhiệm `UCD` mục 1.2, cột `Căn cứ` | `QT_DA1_LichHen mục 9 điểm 2 · BR-A04 Người đặt hộ không tự duyệt · QC01 Đ6.3` |

Mỗi tài liệu bị sửa ghi một dòng vào Version control của chính nó; bỏ lượt này thì lớp 5 dẫn luật trần mãi mãi và không truy vết được sang lớp 6.

## Review độc lập — bắt buộc

Viết xong, tự soát xong, **luôn** gọi một agent độc lập review trước khi chuyển `Chờ review`. Prompt chung và nguyên tắc giao việc nằm ở [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md); không chép lại ở đây. Khi điền prompt: lớp là `5 — Tác nhân và use case`; **hai** template (`use_case_diagram.md`, `use_case_list.md`) và **hai** file dự án (`UCD_…`, `UCL_…`) cùng đưa vào; các lớp đã có gồm quy trình, ERD, máy trạng thái, BRD.

Khối `<VIỆC 3 RIÊNG CỦA LỚP>` dán vào chỗ trống của prompt chung:

```text
   Riêng lớp 5, kiểm thêm:
   - Dòng tính năng nào gộp nhiều thao tác (kiểu "Quản lý X", "Duyệt hoặc từ chối") hoặc chỉ là một
     bước / một trường; đối chiếu năm tính chất ở .claude/skills/create-uc/SKILL.md mục "UC là gì".
   - Tác nhân nào là chức danh, cá nhân, hoặc đơn vị chỉ để phân phạm vi dữ liệu thay vì vai trò; nhóm
     hay tổ chức tương tác với hệ thống như một bên mà bị loại; tên lệch chữ với quy trình mục 2; bên
     liên quan trong BRD mục 4 không thao tác mà bị đưa vào danh mục, hoặc có thao tác mà bị bỏ sót.
   - UCD mục 1.2: mọi cặp ở quy trình mục 2 "Tách nhiệm bắt buộc" và mục 9 loại Tách nhiệm có mặt, kể cả
     cặp giữa hai tác nhân khác nhau; có dẫn quy trình và BR (hoặc điều khoản khi chưa có BR).
   - Quy trình mục 10 và BRD mục 12 cột Use case đã điền; Version control của hai tài liệu đó có ghi.
   - Ô trống trong ma trận tác nhân × use case ở UCD mục 4; ô có ký hiệu mà thiếu phạm vi dữ liệu;
     ô không truy được về chuyển 👤 hay bước quy trình nào.
   - Bước quy trình do người làm (trừ dòng 🟡), chuyển 👤 của máy trạng thái, tác vụ nền N-xx, sự kiện
     🔗 có tác động Tự chuyển hoặc Chỉ chặn: có use case phủ chưa. Dòng ngoài dự toán đã đánh dấu chưa.
   - Cột Permission key: thiếu cột, ô trống, key trùng giữa hai dòng, key không theo quy ước; mã UC còn
     tiền tố UC-; Mã UC gốc chứa thứ không phải mã dự toán.
   - «include» / «extend» vẽ sai hướng, include dùng để vẽ trình tự hay nối hai người, extend không có
     điều kiện; tổng nút con không bằng nút cha ở quy tắc 100%; tổng điểm TAW tính sai.
```

## Soát trước khi đóng

Tác nhân (`UCD` mục 1):

- [ ] Mọi tác nhân là vai trò, qua đủ phép thử ở [`tac-nhan.md`](reference/tac-nhan.md); không chức danh, cá nhân, đơn vị chỉ để phân phạm vi. Nhóm hay tổ chức tương tác với hệ thống như một bên thì có mặt. Tên đúng chữ với quy trình mục 2 (tên vai người đúng chữ BRD mục 4), hoặc có `Q-A…` giải thích.
- [ ] Mỗi tác nhân có `Loại`, chính hay phụ, nền tảng, phân loại QĐ 671 (hoặc `—` với tác nhân tác vụ nền), và căn cứ vai trò không trống.
- [ ] Mọi bên liên quan trong BRD mục 4 hoặc là tác nhân, hoặc nằm trong dòng "không thao tác hệ thống". Mọi tác nhân trong quy trình mục 2 và mọi vai ở cột `Ai` của máy trạng thái đều có mặt.
- [ ] Bảng TAW (mục 1.3) cộng đúng: trọng số × số tác nhân, tổng khớp danh mục.
- [ ] Mục 1.2 liệt kê **mọi** cặp ở quy trình mục 2 "Tách nhiệm bắt buộc" và mục 9 loại Tách nhiệm, bất kể cùng hay khác tác nhân; mỗi cặp dẫn quy trình và BR (chưa có BR thì điều khoản); mọi tác nhân giữ cả quyền lập lẫn quyền duyệt trên cùng thực thể đều có dòng.
- [ ] Đã quay lại soát mục 1 sau khi `UCL` có dòng: `Chính` / `Phụ` khớp cột `Actor`; không tác nhân thừa, không tác nhân thiếu.

Cây và dòng (`UCL`):

- [ ] Mã WBS đủ năm cấp, không tiền tố `UC-`, hai chữ số mỗi cấp sau nền tảng; không mã nào đánh lại; dòng bỏ có ⊘.
- [ ] Mọi lá là một thao tác (qua năm tính chất của `create-uc`); không "Quản lý …" ở cột `Tính năng`; tên là động từ + đối tượng.
- [ ] Cột `Actor` đúng tên ở `UCD`, ghi cả mã lẫn tên (`ACT-01 Khách`). Một dòng một việc: nhiều vai cách `·` chỉ khi cùng làm **một** việc (đúng `create-uc`); hai vai làm hai việc khác nhau là hai dòng. Cột `Permission key` là cột cuối, không ô trống, không hai dòng trùng key.
- [ ] `Mã UC gốc` chỉ chứa mã dự toán nguyên văn; dòng không có trong dự toán đã đánh dấu "ngoài dự toán" ở `Ghi chú`.
- [ ] Mỗi dòng có căn cứ tối thiểu ở `Ghi chú`: mã bước quy trình kèm tên, chuyển trạng thái nếu có, `D-xx`.
- [ ] Mục 4 có đủ dòng cho mọi use case trong dự toán; `Số giao dịch` khớp số dòng; `Độ phức tạp` ở mục 3 khớp ngưỡng (≤ 3 · 4–7 · > 7) **của chính dòng đó**. Số đối chiếu dự toán tính theo nhóm `Mã UC gốc`, không cộng từ cột `Độ phức tạp` của mục 2.
- [ ] Mục 2 cộng đúng từ mục 3 (không đếm dòng ⊘; module trải nhiều nền tảng tính một lần); mục 5 có một dòng cho mỗi chức năng cấp 4. Số chức năng trong module không trùng giữa các nền tảng.

Sơ đồ và ma trận (`UCD`):

- [ ] Mọi sơ đồ có khung ranh giới hệ thống; tác nhân ngoài khung; mỗi use case vẽ có mã và tên khớp `UCL`.
- [ ] «include» đúng hướng (gốc → được gọi) và khớp một bước `→ gọi UC` khả dĩ; «extend» đúng hướng (mở rộng → gốc), có điều kiện; không quan hệ nào vẽ trình tự.
- [ ] Ma trận liệt kê **mọi** use case của `UCL` (trừ ⊘), không ô trống; ô có ký hiệu thì có phạm vi dữ liệu.
- [ ] Mỗi ký hiệu truy được về chuyển 👤, bước quy trình hoặc dòng dự toán; ô suy đoán là ❓ với `Q-A…`.

Phủ và quy tắc 100% (`UCL` mục 6):

- [ ] Mọi bước quy trình do người làm (trừ 🟡) có use case phủ, hoặc đã vào mục 10 của quy trình.
- [ ] Mọi chuyển 👤 của máy trạng thái có use case phủ.
- [ ] Mọi `N-xx` có use case tác nhân hệ thống; mọi sự kiện 🔗 có tác động Tự chuyển hoặc Chỉ chặn có use case.
- [ ] Máy trạng thái có trạng thái nháp (ví dụ `DRAFT`, chuyển `→ DRAFT` 👤) thì `UCL` có cả dòng lưu nháp lẫn dòng sửa bản nháp — như `DA1.WEB.03.01.01` và `.02` ở bảng mã chuẩn của ví dụ xuyên suốt.
- [ ] Mọi nhóm dự toán có ít nhất một tính năng; nút con phủ đúng nút cha, không trùng, không sót.
- [ ] **Quy trình mục 10 đã điền** (liệt kê bước chưa phủ, hoặc dòng *Không có*) và **BRD mục 12 cột `Use case` đã điền**, trước cổng ra; Version control của hai tài liệu đó có ghi.

Căn cứ và trạng thái:

- [ ] Mọi ô cần căn cứ có mã lớp đã chốt, điều khoản, `GD-xxxx` bôi đỏ, hoặc ❓ kèm `Q-…`. Không giả định nào cho nội dung đã có mã.
- [ ] Còn `[CẦN BA CHỐT]` thì chưa chuyển `Chờ review`; còn ❓, `chưa chốt (`, hoặc giả định chưa chốt (trực tiếp hay kế thừa) thì không chuyển `Đã duyệt` — `00_quy_uoc_chung.md` mục 12; chạy script kiểm trước mỗi lần chuyển trạng thái.
- [ ] Đã điền các khối có sẵn của template ở cả hai file: câu "không chứa gì", dòng Dự án · Phân hệ / Người soạn · Người review · Người duyệt / Mức mật, bảng Phê duyệt; `UCD` mục 5 Câu hỏi · 6 Rủi ro · 7 Điểm tạm hoãn · 8 Nguồn; `UCL` mục 7 Câu hỏi · 8 Rủi ro · 9 Điểm tạm hoãn · 10 Nguồn. Không khối nào còn `{{…}}`; khối không có nội dung ghi *Không có …*.
- [ ] Đã xóa mọi khối `<!-- HƯỚNG DẪN … -->`; số đếm ở khối giới thiệu khớp thân tài liệu.
- [ ] **Đã gọi reviewer độc lập** và xử lý hết phát hiện. Cổng ra của lớp 5 đạt.
