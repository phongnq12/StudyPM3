---
name: create-sm
description: Hướng dẫn viết tài liệu Máy trạng thái (lớp 4 của business layer, câu hỏi When) theo template state_machine.md. Dùng khi cần viết máy trạng thái, bóc trạng thái và chuyển trạng thái từ quy trình và ERD, vẽ stateDiagram, dựng ma trận trạng thái × thao tác, sinh testcase chuyển hợp lệ và chuyển không hợp lệ, hoặc rà một file SM_*. Định nghĩa trạng thái và thực thể nào cần máy, cách viết một dòng chuyển sự kiện [điều kiện] / hệ quả, máy dẫn xuất Δ, trạng thái kết thúc ■, chuyển do hết thời gian và sự kiện ngoài, và bắt buộc gọi reviewer độc lập trước khi đóng. Gọi khi người dùng nói "viết máy trạng thái", "bóc trạng thái", "vòng đời chứng từ", "vẽ state diagram", "ma trận trạng thái", "dựng SM", hoặc khi mở file theo template state_machine.md.
---

# Viết tài liệu Máy trạng thái (lớp 4)

Template đi kèm: [`2-ba-overview/templates/4-state-machine/state_machine.md`](../../../2-ba-overview/templates/4-state-machine/state_machine.md)

Phiên bản theo bảng Version control của [`ba-overview`](../ba-overview/SKILL.md).

## Đọc gì, khi nào

File này là **phần lõi** — đọc hết trước khi viết. Phần tra cứu nằm trong `reference/` của skill này và
trong `reference/` của `ba-overview`; mở đúng file khi đến đúng việc.

| Khi đang làm | Mở |
|---|---|
| Điền từng mục, từng cột của template, cần bảng cột và dòng mẫu | [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md) |
| Bóc trạng thái và chuyển từ quy trình + ERD; viết một dòng chuyển; máy dẫn xuất Δ; vẽ sơ đồ Mermaid | [`reference/chuyen-trang-thai.md`](reference/chuyen-trang-thai.md) |
| Dựng ma trận trạng thái × thao tác, sinh testcase hợp lệ và testcase âm | [`reference/ma-tran-va-testcase.md`](reference/ma-tran-va-testcase.md) |
| Quy ước nền: tên file, khối đầu và cuối tài liệu, hệ mã, ký hiệu, quy tắc viết | [`2-ba-overview/templates/00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Cách dẫn một máy, một thực thể, một tác nhân (mục 9); ký hiệu 🧪 (mục 5); khối cuối của template và số mục (mục 6.1); chỗ ERD mục 4 do lớp 4 điền (mục 10); hạt và mã use case G1, G2 (mục 8) | [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Tìm căn cứ, câu hỏi mở `S-xx`, giả định `GD-xxxx`, ba giá trị đặc biệt, bản chép | [`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) |
| Phân vân một nội dung thuộc lớp nào | [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md) |
| Cần ví dụ cho một khái niệm | [`ba-overview/reference/vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md) |
| Viết xong, gọi reviewer độc lập | [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md) |

Thứ bậc khi hai nguồn nói khác nhau: `00_quy_uoc_chung.md` → template → skill. Mọi ví dụ trong skill này
dùng thế giới của `vi-du-xuyen-suot.md` và là **mã minh họa**; không chép sang tài liệu dự án. Máy Lịch hẹn ở các
file `reference/` khớp **bảng mã chuẩn mục 3 và bảng chuyển chuẩn mục 4** của file đó (`DRAFT → PENDING_APPROVAL →
APPROVED → COMPLETED ■`, `REJECTED ■`, `CANCELLED ■`); mã ngoài bảng (`N-04`, `S-02`, `D-05`, `AVAILABLE`,
`EXHAUSTED`, `Thong_Bao_Nhac`…) là **mã minh họa riêng của skill**, không trùng nghĩa với mã của bảng. Quy tắc nào
ghi *lựa chọn của skill* là quy tắc skill tự đặt, template và `00_quy_uoc_chung` chưa nói.

## Quy trình viết

1. **Kiểm cổng vào.** ERD phải ở `Chờ review` trở lên (cổng của `ba-overview`). Đọc quy trình nguồn và ERD nguồn, ghi phiên bản của cả hai vào mục "Thông tin tài liệu". Sao template thành `SM_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`, không sửa file template. **Ngay lúc sao**, điền các khối có sẵn của template — Thông tin tài liệu, bảng Phê duyệt (để người ký), câu "không chứa gì" của khối giới thiệu, ba khối cuối Rủi ro còn lại, Điểm tạm hoãn, Nguồn (số mục theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6; chi tiết ở `reference/dien-tung-muc.md`) — để khỏi dồn về cuối.
2. **Lập danh sách máy.** Quét ERD tìm mọi trường `trang_thai`, mọi giá trị dẫn xuất Δ (ERD mục 4) và mọi bảng ở ERD mục 5.3. Mỗi thực thể **có `trang_thai`** rơi vào đúng một trong hai chỗ: một dòng ở mục 1.3 (có máy) hoặc dòng "Không có máy trạng thái" kèm lý do. Xem mục "Thực thể nào cần máy".
3. **Viết bảng trạng thái cho từng máy.** Mã chép đúng enum ERD, tên Việt và nghĩa lấy từ quy trình, đánh ■ cho trạng thái kết thúc (không có chuyển ra), điền cột `Sửa được` (máy Δ bỏ cột này).
4. **Bóc chuyển và viết bảng chuyển.** Mỗi bước quy trình làm đổi trạng thái một chứng từ là một dòng; điều kiện dẫn BR, GS hoặc văn bản; hệ quả ghi đủ phần kéo theo. Cách bóc: [`reference/chuyen-trang-thai.md`](reference/chuyen-trang-thai.md). Sơ đồ Mermaid vẽ **sau** bảng chuyển và sinh từ bảng, không ngược lại, dù trong tài liệu sơ đồ đứng trước.
5. **Viết phần ngoài vòng đời của từng máy.** Sự kiện từ hệ thống ngoài, tác vụ nền `N-xx`, chuyển do hết thời gian, ma trận trạng thái × thao tác cho đối tượng phức tạp nhất. Cách dựng ma trận: [`reference/ma-tran-va-testcase.md`](reference/ma-tran-va-testcase.md).
6. **Điền ERD mục 4.** Với mỗi trường `trang_thai` của máy loại Lưu hoặc Lưu suy từ bảng con, mở ERD nguồn và thay chỗ đang ghi `chờ lớp 4` bằng `SM mục n` (số `n` đúng cột `#` ở mục 1.3). Ghi vào **Version control của ERD** theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10 — sửa không đổi nghĩa — ở mọi trạng thái thêm một gạch đầu dòng vào dòng phiên bản hiện tại, không tăng `vNN`, không đổi trạng thái (`00_quy_uoc_chung.md` mục 3.3). Làm **trước khi** qua cổng ra của lớp 4. Xem mục "Điền ERD mục 4".
7. **Tìm căn cứ, ghi câu hỏi.** Điều gì không có nguồn thì ghi theo [`so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) và thêm dòng `S-xx` (đủ cột `Đề xuất mặc định` và `Người chốt` của bảng câu hỏi) ở mục câu hỏi. Rủi ro và điểm tạm hoãn ghi `RK-nn`, `TH-nn` vào khối có sẵn; khối nào không có nội dung thì ghi *Không có* kèm lý do.
8. **Tự soát** theo checklist cuối file này. **Gọi reviewer độc lập — bắt buộc**, xem mục "Review độc lập". Sửa theo phát hiện hoặc ghi lý do không sửa.
9. **Xóa mọi khối `<!-- … -->`** của template trong file dự án — không chỉ khối `HƯỚNG DẪN` mà cả `KHỐI LẶP CHO MỖI MÁY`, `UML trong Mermaid`, chú thích cột và các chú thích khác (lựa chọn của skill; xem `reference/dien-tung-muc.md`). Đối chiếu lại các bản chép với nguồn (ERD, quy trình), rồi mới chuyển `Chờ review`. Sau khi lớp 6 xong, chạy phần của lớp này trong **lượt điền ngược** (mục "Lượt điền ngược").

---

## Máy trạng thái là gì

**Máy trạng thái mô tả vòng đời của một đối tượng nghiệp vụ: nó có thể ở những trạng thái nào, chuyển từ
trạng thái này sang trạng thái kia bởi sự kiện nào, do ai kích hoạt, với điều kiện gì và kéo theo gì.**
Một **trạng thái** là một điều kiện ổn định mà đối tượng ở trong đó, và điều kiện ấy quyết định thao tác
nào được phép lên đối tượng. Máy trạng thái trả lời câu hỏi *When* của bài giới thiệu sáu lớp: việc gì
xảy ra khi nào, và đối tượng đổi trạng thái ra sao.

Nguồn chuẩn gồm ba chuẩn ghi trong template và ba artifact của lớp When trong bài giới thiệu:

| Chuẩn hoặc artifact | Cho ta cái gì | Nằm ở đâu trong template |
|---|---|---|
| **OMG UML 2.5.1 mục 14** — State Machine Diagram | Trạng thái, trạng thái đầu và cuối, chuyển dạng `sự kiện [điều kiện] / hành động` | Bảng trạng thái, sơ đồ `stateDiagram-v2`, bảng chuyển: `Ai — sự kiện` = sự kiện, `Điều kiện` = điều kiện canh (guard), `Hệ quả` = hành động (effect) |
| **Harel Statecharts** (1987) | Trạng thái lồng: một trạng thái cha chứa các trạng thái con | Khối `state CODE { … }` trong sơ đồ khi cần; xem `reference/chuyen-trang-thai.md` |
| **Event List** (McMenamin & Palmer, 1984) — sự kiện nghiệp vụ, thời điểm, phản ứng cần có | Danh sách mọi thứ khiến trạng thái đổi | Không có bảng riêng: sự kiện do người ở cột `Ai — sự kiện` của từng máy; sự kiện do hệ thống ngoài và tác vụ nền ở mục "Sự kiện ngoài và tác vụ nền tác động trạng thái"; chuyển do hết thời gian ở dòng **Chuyển do hết thời gian**; phản ứng cần có là cột `Hệ quả` |
| **Lịch chu kỳ nghiệp vụ** (Zachman, ô Master Schedule, cột When) — việc lặp theo tuần, tháng, quý | Chu kỳ khiến một sự kiện tới | Không có bảng riêng. Lịch nằm ở quy trình mục 5 (cột `Lịch chạy` của `N-xx`) và dòng `Tần suất` của từng quy trình; máy trạng thái chỉ dẫn `N-xx`, **không chép lại giờ chạy** |
| **ISO/IEC/IEEE 29119-4:2021 mục 5.2.8** — State Transition Testing | Bảng chuyển và bảng trạng thái × sự kiện dùng để sinh testcase, kể cả chuyển không hợp lệ | Bảng chuyển (mỗi dòng ≥ 1 testcase hợp lệ, mỗi điều kiện ≥ 1 testcase âm) và mục ma trận trạng thái × thao tác — ma trận là bản **rút gọn từ** bảng 29119-4 (chỉ thao tác của người) |

Bài giới thiệu nhấn mạnh một điểm: *không có mũi tên nào đi ra khỏi trạng thái kết thúc nghĩa là không
có đường sửa lại*. Một bản ghi đã ở ■ thì sai sót không sửa tại chỗ được; làm lại là tạo bản ghi mới
(nguyên tắc `SM-05` của template). **■ là trạng thái không có chuyển ra** — đúng với UML: FinalState không có
chuyển ra, và `X --> [*]` là chuyển hoàn tất về điểm cuối. `SM-05` cho phép ngoại lệ, nhưng trạng thái có ngoại
lệ thì **không được vẽ `--> [*]`** (xem `reference/chuyen-trang-thai.md` mục 5); thường nên bỏ ■ cho trạng thái
còn đường ra. Máy trạng thái là nơi buộc BA trả lời câu "lỡ sai thì sao" cho từng trạng thái cuối.

### Sáu tính chất nhận diện

Phân vân một thứ có phải trạng thái hoặc một máy có đang viết đúng không, quay về bảng này:

| Tính chất | Nghĩa là | Thể hiện ở |
|---|---|---|
| **Ổn định** | Đối tượng có thể đứng yên ở đó, chờ một sự kiện, mà vẫn có nghĩa — không phải một khoảnh khắc đang xử lý | Cột `Nghĩa` của bảng trạng thái; thử bằng câu "đứng đó ba tháng thì bản ghi còn nghĩa không" |
| **Của một đối tượng** | Một máy = một trường enum (hoặc một giá trị dẫn xuất Δ) của một thực thể ERD. Trạng thái không thuộc về một chuỗi việc hay một màn hình | Tiêu đề máy `{{n}}. {{Tên máy}} — {{Ten_Bang}}`; cột `Thực thể ERD` ở mục 1.3 |
| **Loại trừ nhau — trong một trục** | Trong **một trục**, tại một thời điểm đối tượng ở đúng một trạng thái (máy phẳng); trạng thái lồng là cách có cấu trúc để nhóm, không phải để ở hai nơi. **Hai trục độc lập** (ví dụ trạng thái duyệt và trạng thái thanh toán của cùng một chứng từ) = **hai trường enum ở ERD = hai máy** (hoặc hai vùng song song trong một máy — UML Region, orthogonality của Harel). Không nhét hai trục vào một enum tích | Bảng trạng thái và sơ đồ; mỗi giá trị enum ERD xuất hiện đúng một lần ở máy của nó; hai máy cùng bảng ở mục 1.3 |
| **Quyết định thao tác được phép** | Biết trạng thái là biết được thao tác nào cho phép, thao tác nào cấm | Cột `Sửa được`; mục ma trận trạng thái × thao tác; dòng **Cấm** |
| **Đổi bằng sự kiện** | Mỗi lần đổi do một sự kiện xác định — người, hệ thống, hệ thống ngoài, hoặc thời gian — qua một chuyển có điều kiện và hệ quả | Bảng chuyển, cột `Ai — sự kiện` · `Điều kiện` · `Hệ quả` |
| **Có đầu, có cuối, có lối ra** | Có **một** trạng thái đầu (UML cho tối đa một chuyển ra từ trạng thái đầu của mỗi vùng; nhiều hơn thì ghi lệch chuẩn có chủ ý); mọi trạng thái không phải ■ có ít nhất một mũi tên đi ra; trạng thái ■ không có mũi tên đi ra, hoặc ngoại lệ ghi rõ và không vẽ `--> [*]` | `[*] →` ở sơ đồ; ký hiệu ■ ở bảng trạng thái; `SM-05` |

### Thực thể nào cần máy

Một thực thể cần máy khi thỏa **cả ba** điều kiện:

| Điều kiện | Kiểm bằng |
|---|---|
| Có cột `trang_thai` ở ERD, hoặc có trạng thái dẫn xuất Δ (ERD mục 4 "Giá trị dẫn xuất Δ", mục 5.3 "Trạng thái suy từ bảng con") | Quét ERD |
| Có **từ hai trạng thái** trở lên | Danh sách enum ở ERD |
| Có **ít nhất một chuyển do sự kiện** — không chỉ gán giá trị lúc tạo rồi không bao giờ đổi | Quy trình: có bước hoặc tác vụ nền làm đổi |

Dòng **Không có máy trạng thái** chỉ dành cho **thực thể có `trang_thai`** (hoặc giá trị Δ, bảng ở ERD mục 5.3) —
lựa chọn của skill. Thực thể có `trang_thai` mà không thỏa điều kiện nào đó thì **không bỏ lặng lẽ**: ghi vào dòng
này ở mục 1.3 kèm lý do một cụm từ (*chỉ ghi thêm*, *lập một lần không sửa*,
*chỉ một giá trị*, *giá trị gán lúc tạo không đổi*). Cổng ra của lớp 4 kiểm đúng điều này: mọi `trang_thai`
của ERD có máy hoặc nằm trong dòng đó.

Ba loại máy, ghi ở cột `Loại` của mục 1.3:

| Loại | Nghĩa | Bảng chuyển viết thế nào |
|---|---|---|
| **Lưu** | Trường `trang_thai` lưu ở bảng; mỗi chuyển là một lần ghi trường đó (`SM-04`) | Bảng chuyển bình thường: 👤, ⚙️, 🔗 |
| **Δ** | Không có trường nào lưu; trạng thái **tính khi truy vấn** từ dữ liệu khác (`SM-02`) | Giữ bảng trạng thái nhưng **bỏ cột `Sửa được`**; thay bảng chuyển bằng bảng `Trạng thái · Công thức suy ra · Đổi khi`; vẫn vẽ sơ đồ. Công thức theo `R-xx` của ERD |
| **Lưu, suy từ bảng con** | Có trường `trang_thai` ở bảng cha, nhưng **giá trị do hệ thống tính lại từ các bảng con** theo ERD mục 5.3, không ai đặt tay | Bảng chuyển bình thường, mọi chuyển là ⚙️ với sự kiện "bảng con đổi"; cột `Điều kiện` chép điều kiện của ERD mục 5.3 bằng dẫn mã |

### Ba loại tác nhân chuyển

| Ký hiệu | Ai kích hoạt | Điều phải ghi ở `Ai — sự kiện` |
|---|---|---|
| 👤 | Người thao tác | **Vai trò đúng tên ở quy trình mục 2** và bước quy trình: `👤 Nhân viên tiếp đón — LH-01 bước 4`. Bước hệ thống chạy cùng request với bước người ngay trước (`LH-01 bước 2–3` sau bước 1) thì chuyển cũng là 👤 của bước người, dẫn dải bước `LH-01 bước 1–3`. Mỗi thao tác 👤 là một quyền riêng (`SM-07`, tính theo thao tác) và phải có ít nhất một UC phủ ở lớp 5 |
| ⚙️ | Hệ thống tự chạy theo lịch hoặc sự kiện, không người nào đang thao tác | Mã `N-xx` hoặc tên sự kiện nội bộ. Hết thời gian cũng là ⚙️ |
| 🔗 | Sự kiện từ hệ thống ngoài | Tên hệ thống ngoài và sự kiện, đúng như quy trình mục 5.1 |

Quy tắc chọn 👤, ⚙️ hay 🔗 cho một chuyển nằm ở [`ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md)
mục 2, dòng "👤 hay ⚙️ cho một chuyển" — không viết lại ở đây.

---

## Có phải trạng thái, có phải máy không

Dùng ví dụ xuyên suốt (mã minh họa). Cột "Kết luận" là kết luận với **máy của `Lich_Hen`**:

| Thứ đang xét | Kết luận | Vì sao |
|---|---|---|
| `PENDING_APPROVAL` Chờ duyệt của `Lich_Hen` | **Là trạng thái** | Đứng đó nhiều ngày chờ nhân viên; quyết định chỉ nhân viên duyệt được, khách chưa sửa được |
| "Đang kiểm còn lượt" — `LH-01` bước 2 | **Không** — bước quy trình | Xong trong cùng request, không đứng yên được. Kết quả của bước là *điều kiện* của một chuyển, không phải trạng thái |
| `da_xoa` trên một danh mục | **Không** — cờ boolean đơn | Xóa mềm là quy ước lưu trữ của ERD, không có chuyển nghiệp vụ, không có người và quyền riêng. Nếu nghiệp vụ gọi là "Ngừng sử dụng" có lý do và có quyền riêng thì ERD phải có enum `trang_thai`, rồi mới là máy |
| "Đang xem chi tiết lịch hẹn", "Đang mở form sửa" | **Không** — trạng thái màn hình | Thuộc phiên làm việc, không thuộc bản ghi; reload là mất. Business layer không mô tả màn hình |
| "Khách đã gửi, nhân viên chưa duyệt, hệ thống chưa nhắc" | **Không** — tiến độ chuỗi việc | Là vị trí trong quy trình `LH-01` của nhiều người. Trạng thái nằm ở `Lich_Hen`, quy trình là nơi mô tả tiến độ (ranh giới Máy trạng thái ↔ Quy trình) |
| `APPROVED` Đã duyệt | **Là trạng thái, không phải ■** | Sửa, duyệt lại, từ chối đều bị chặn, nhưng còn hai đường ra: `COMPLETED` do ⚙️ `N-02` khi qua ngày hẹn, và `CANCELLED` do khách hủy. Có chuyển ra thì không phải ■ (ví dụ không dùng ngoại lệ `SM-05`). `COMPLETED`, `REJECTED`, `CANCELLED` mới là ■ |
| Tình trạng lượt của `Quy_Luot` — Còn lượt / Hết lượt | **Có máy Δ** | Không lưu cờ; suy từ `CH-01` và `Quy_Luot.da_dung` theo `R-01` (số `Lich_Hen` ở `PENDING_APPROVAL`, `APPROVED`, `COMPLETED`, cộng `CANCELLED` có `huy_muon` = đúng). Đổi khi `da_dung` đổi — không phải mọi chuyển của `Lich_Hen` |
| `so_nguoi` 1–3 của `Lich_Hen` | **Không** | Thuộc tính, ràng buộc nội tại ở ERD. Trạng thái là thứ quyết định thao tác được phép, `so_nguoi` thì không |
| Loại lịch hẹn (một enum phân loại, không phải `trang_thai`, không bao giờ đổi sau khi tạo) | **Không có máy**, không ghi vào dòng "Không có máy trạng thái" | Dòng đó chỉ dành cho thực thể có `trang_thai`; enum phân loại do ERD ghi, SM không cần nhắc |
| `Thong_Bao_Nhac` (minh họa riêng của skill) có `trang_thai` nhưng chỉ nhận một giá trị gán lúc tạo | **Không có máy** — ghi vào dòng "Không có máy trạng thái" | Có `trang_thai` nhưng không có chuyển do sự kiện: lý do *giá trị gán lúc tạo không đổi* |
| `Nhat_Ky_Thay_Doi` (nhật ký của `SM-03`, chỉ ghi thêm) | **Không có máy**, và **không** cần ghi vào dòng "Không có máy trạng thái" | Không có `trang_thai`: ngoài phạm vi dòng đó. Một dòng lập một lần, không bao giờ sửa |

---

## Ranh giới với lớp kề

Một bảng duy nhất ở [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md) —
không viết lại ở đây. Phía của lớp 4 nằm ở các dòng sau của `ranh-gioi-cac-lop.md`:

| Chỗ trong `ranh-gioi-cac-lop.md` | Phía của máy trạng thái |
|---|---|
| Mục 1, dòng "Trạng thái, chuyển hợp lệ, chuyển bị cấm" | Lớp 4 **sở hữu**. Quy trình và UC chỉ dẫn `SM mục n` |
| Mục 2, **ERD ↔ Máy trạng thái** | ERD liệt kê mã enum và trỏ `SM mục n`. SM mô tả chuyển, điều kiện, hệ quả. **Mã trạng thái chép đúng ERD**; lệch thì ERD thắng về mã, quy trình thắng về nghiệp vụ |
| Mục 2, **Máy trạng thái ↔ BR** | SM là **nơi áp**: ô `Điều kiện` chỉ dẫn mã kèm tên ngắn, không phát biểu quy tắc. Guard chưa có BR thì dẫn văn bản hoặc `GS-xx`; lượt điền ngược thêm BR |
| Mục 1, dòng **Tách nhiệm** | SM ghi tách nhiệm (người duyệt khác người lập) ở cột `Điều kiện` của chuyển duyệt, dẫn BR; không ghi ở `Ai — sự kiện` |
| Mục 2, **👤 hay ⚙️ cho một chuyển** | Bước hệ thống cùng request với bước người ngay trước → chuyển là 👤, dẫn dải bước; tự chạy theo lịch hoặc sự kiện → ⚙️; hệ thống ngoài → 🔗 |
| Mục 2, **Máy trạng thái ↔ Lớp 5** | Mỗi chuyển 👤 là một thao tác và phải có **ít nhất một UC** phủ, kiểm ở `use_case_list` mục 6 |
| Mục 2, **Máy trạng thái ↔ Quy trình** | SM theo dõi vòng đời **một thực thể**. Bước quy trình là *sự kiện* gây chuyển — dẫn `QK-01 bước 3` ở cột `Ai — sự kiện` |
| Mục 3, dòng lớp 4 | Nhận ERD enum, quy trình bước và `N-xx`; giao chuyển 👤 cho lớp 5, điều kiện cho lớp 6, ma trận cho testcase |

## Nguyên tắc

**1. Máy trạng thái chỉ lắp, không tự định nghĩa.** Mã trạng thái, tên bảng, tên trường lấy đúng ERD;
bước, tác nhân, thứ tự lấy đúng quy trình; quy tắc dẫn mã. Hai nơi khác nhau thì **quy trình chuẩn về
nghiệp vụ, ERD chuẩn về mã** — gặp lệch, sửa ở lớp sai hoặc ghi câu hỏi `S-xx`, không âm thầm chọn một bên.

**2. Ô `Điều kiện` dẫn, không phát biểu.** Viết `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1` chứ không
viết lại "mỗi khách chỉ được đặt một lịch hẹn mỗi tuần". Quy tắc đổi thì sửa ở lớp 6, máy trạng thái không
phải sửa theo. Con số cấu hình dẫn `CH-xx`, không ghi số trần.

**3. Một dòng chuyển là một sự kiện.** "Gửi duyệt rồi được duyệt" là hai chuyển. Hai sự kiện cho cùng
một cặp trạng thái (khách hủy, nhân viên hủy) là hai dòng, vì khác người, khác quyền, khác testcase. Ngược lại,
**một** sự kiện từ nhiều trạng thái nguồn với cùng điều kiện và hệ quả (khách hủy từ chờ duyệt hoặc đã duyệt)
gộp được thành một dòng; testcase vẫn tính mỗi nguồn một lần.

**4. Mỗi trạng thái đều có đường ra hoặc là ■, và ■ không có đường ra.** Quét từng trạng thái một lần:
không phải ■ mà không có mũi tên ra là bản ghi kẹt vĩnh viễn; là ■ mà có mũi tên ra là vi phạm `SM-05`
trừ khi ngoại lệ được ghi trong bảng — và trạng thái có ngoại lệ không vẽ `--> [*]`. Trạng thái còn đường ra
thường xuyên (như `APPROVED`, còn hoàn thành và hủy) thì không phải ■.

**5. Cấm cũng là đặc tả.** Dòng **Cấm** và ô `—` của ma trận mỗi cái là một testcase âm. Chuyển nào người
đọc dễ tưởng hợp lệ — mở lại ■, người lập tự duyệt, nhảy cóc qua trạng thái — phải được liệt kê.

## Mã và tên

Chỉ phần riêng của lớp 4; còn lại theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4 và
mục 2 (tên file).

| Đối tượng | Quy ước |
|---|---|
| **`SM-01` … `SM-09` là nguyên tắc chung**, không phải mã một máy | Chín nguyên tắc ở SM mục 1.1 rút từ một dự án mẫu. **Giữ, sửa hoặc bỏ theo dự án.** Bỏ thì ghi vào đầu bảng *Các mã SM-xx đã bỏ, không dùng lại*, không đánh lại số các nguyên tắc còn lại. Nguyên tắc mới lấy số kế tiếp |
| **Dẫn một máy** | `SM mục n — <Tên máy>`, ví dụ *SM mục 2 — Lịch hẹn*; dẫn một chuyển: `SM mục 2: DRAFT → PENDING_APPROVAL` (theo `00_quy_uoc_chung.md` mục 9). Số `n` là số mục của máy trong tài liệu |
| Cảnh báo về `create-uc` | `create-uc/reference/so-cu-va-ten-goi.md` ghi dạng `SM-02 LICH_HEN: PENDING -> APPROVED` như thể `SM-02` là mã một máy. **Không theo.** `SM-02` là nguyên tắc "trạng thái dẫn xuất không lưu cờ"; máy dẫn bằng `SM mục n`. Mã trạng thái chuẩn là **`PENDING_APPROVAL`** theo ERD (ví dụ xuyên suốt cũng dùng mã này), không phải `PENDING`; `LICH_HEN` cũng không phải tên bảng — dẫn đúng `Lich_Hen` |
| Mã trạng thái | **Enum tiếng Anh `UPPER_SNAKE` đúng như ERD**, trong backtick: `PENDING_APPROVAL`. Tên Việt chỉ ở cột `Hiển thị` và ở cột `Tên trạng thái` của bảng chuyển (`00_quy_uoc_chung` mục 7) |
| Mã trong sơ đồ | Mermaid dùng mã enum làm id, khai tên Việt bằng `state "Tên Việt" as CODE` |
| Số mục của máy | Mục 1 là Quy ước nên máy đầu tiên là **mục 2**. Lớp 5 và lớp 6 dẫn `SM mục n`, nên đánh lại số mục là đổi mã dẫn: ghi vào Version control và báo các lớp đã dẫn |
| Câu hỏi mở | `S-01`, `S-02` … theo tiền tố của template (`00_quy_uoc_chung.md` mục 4) |
| Tên máy | Danh từ nghiệp vụ tiếng Việt kèm tên bảng: `Lịch hẹn — Lich_Hen`. Máy Δ thêm `· Δ` |

## Tìm căn cứ

Cách tìm theo bốn bước, ba giá trị đặc biệt, câu hỏi `S-xx` và giả định `GD-xxxx`:
[`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md). Chỉ nói thêm
**nguồn đặc thù** của lớp 4 và thứ tự dùng:

| Cần căn cứ cho | Tìm ở | Ghi gì |
|---|---|---|
| Tập trạng thái, mã | **ERD** — enum của `trang_thai`, danh mục enum mục 4.x | Chép mã; tên Việt lấy từ quy trình hoặc ERD |
| Một chuyển do người | **Quy trình** — bước làm đổi trạng thái chứng từ; mục 2 cho vai trò | `LH-01 bước 4`; vai trò đúng tên |
| Một chuyển do hệ thống | Quy trình mục 5 (`N-xx`, lịch chạy, tham số) | `N-01`, kèm `CH-xx` |
| Một chuyển do hệ thống ngoài | Quy trình mục 5.1 | Tên hệ thống và sự kiện |
| Chuyển do hết thời gian | Tham số `CH-xx` có đơn vị thời gian (hạn duyệt, giờ chốt) và văn bản quy định thời hạn | Dẫn `CH-xx`; chưa có thì ❓ `S-xx` |
| Điều kiện của chuyển, kể cả tách nhiệm và bắt buộc lý do | Quy trình: điều kiện bước, `D-xx`, `GS-xx`, quy trình mục 2 "Tách nhiệm bắt buộc"; lớp 6 `BR-…`; văn bản pháp luật | Dẫn mã, **không** phát biểu lại; mọi điều kiện cùng cột `Điều kiện` |
| Hệ quả ghi sổ | Quy trình mục 3.1 `GS-xx`; ERD mục 5.1 `R-xx` | Mã kèm tên ngắn |
| Chuyển, trạng thái mà quy trình chưa nêu | Không có ở đâu cả | Ký hiệu 🧪 kèm câu hỏi `S-xx` (nghĩa 🧪 theo `00_quy_uoc_chung.md` mục 4; cách dùng riêng ở SM xem `reference/dien-tung-muc.md` mục 1.2); AI không tự cấp `GD-xxxx` |

Lớp 4 thường đứng trước lớp 6, nên khi viết cột `Điều kiện` chưa có mã `BR-…`: dẫn thẳng văn bản, `D-xx`,
`GS-xx`, hoặc `GD-xxxx`, **không bịa mã `BR-`** (xem mục "Lượt điền ngược").

## Điền ERD mục 4

Trong lúc viết lớp 4 (bước 6 của "Quy trình viết"), lớp 4 là skill điền chỗ mô tả `trang_thai` ở **ERD mục 4** — ô
đang ghi `chờ lớp 4` — thành `SM mục n`, theo bảng "Chỗ phải điền sau khi lớp khác xong" ở
[`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10 (cột "Skill điền" = `create-sm`). Số
`n` lấy từ cột `#` ở mục 1.3. Chỉ sửa ô đó; không đổi enum, tên trường, cột nào khác của ERD. Trường `trang_thai` nào
rơi vào dòng "Không có máy trạng thái" thì ghi lý do thay vì `SM mục n`. Ghi vào Version control của ERD theo cách
phân biệt `Nháp` / `Chờ review` / `Đã duyệt` ở mục 4 của file đó; AI không ghi "BA chốt". ERD khác với SM (thiếu enum,
thừa enum) thì ghi `S-xx`, không sửa ERD ở đây.

## Lượt điền ngược

Phần của lớp 4 trong lượt điền ngược sau khi lớp 6 cấp mã ([`ba-overview/SKILL.md`](../ba-overview/SKILL.md) mục
"Thứ tự chạy", bước 3): ở cột `Điều kiện`, chỗ nào đang dẫn thẳng điều khoản mà nay đã có BR tương ứng thì **thêm** mã BR kèm
tên ngắn **đứng trước** điều khoản và **giữ** điều khoản, như `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần · QC01 Đ5.1`
hoặc `BR-A04 Người đặt hộ không tự duyệt · QC01 Đ6.3`. Chỉ thêm mã; không đổi nghĩa ô, không đổi cột nào khác.
Ghi lượt này vào Version control của tài liệu. Cũng trong lượt này, đối chiếu một lần nữa: chuyển nào ở bảng
chuyển có điều kiện mà lớp 6 chưa nhận làm ứng viên BR thì báo lớp 6.

## Review độc lập — bắt buộc

Viết xong, tự soát xong, **luôn** gọi một agent độc lập review trước khi chuyển `Chờ review`. Dùng prompt
mẫu và nguyên tắc giao việc ở
[`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md): chỉ đưa đường dẫn,
model mạnh, reviewer không sửa file. Khối `<VIỆC 3 RIÊNG CỦA LỚP>` điền cho lớp 4 như sau (lớp số 4 —
Máy trạng thái; skill `create-sm`; template `2-ba-overview/templates/4-state-machine/state_machine.md`):

```text
   Riêng lớp 4 — Máy trạng thái:
   - Mã trạng thái lệch enum ERD: đối chiếu từng mã ở bảng trạng thái, sơ đồ, bảng chuyển, ma trận với
     ERD mục 4 và mục 4.x (id nhóm vẽ của trạng thái lồng được miễn). Mọi trường trang_thai (và giá trị
     Δ, mục 5.3) của ERD phải có máy hoặc nằm trong dòng "Không có máy trạng thái" kèm lý do. Mọi bước quy
     trình làm đổi trạng thái chứng từ phải có một dòng chuyển.
   - ■ có mũi tên đi ra mà không ghi ngoại lệ (SM-05), hoặc có ngoại lệ mà vẫn vẽ --> [*]; trạng thái
     không phải ■ mà không có đường ra; nhiều hơn một mũi tên [*] mà không ghi lệch chuẩn; bảng chuyển,
     sơ đồ Mermaid và ma trận lệch nhau (thiếu mũi tên, thừa mũi tên, khác tên). Hai trục độc lập bị
     nhét vào một máy hoặc một enum.
   - Chuyển 👤 không có vai trò, vai trò sai tên so với quy trình mục 2, hoặc bước hệ thống cùng request
     với bước người bị ghi là ⚙️ thay vì 👤 dải bước. Tách nhiệm (người lập tự duyệt, SM-07) và "bắt buộc
     lý do" (SM-06) không nằm ở cột Điều kiện. Chuyển 👤 chưa có UC phủ nếu lớp 5 đã có.
   - Ô Điều kiện phát biểu lại quy tắc thay vì dẫn mã; chứa nhánh hệ quả (trả lượt, ghi sổ) thay vì chỉ điều
     kiện quyết chuyển có xảy ra; điều kiện "kiểm lại" không bao giờ đúng (điều kiện đã được giữ chỗ ở chuyển
     trước); con số cấu hình ghi trần thay vì CH-xx; mã BR, GS, D dẫn sai hoặc không có trong lớp nguồn.
   - Thiếu chuyển do hết thời gian hoặc sự kiện ngoài: đối chiếu quy trình mục 5, 5.1, các CH-xx có đơn vị
     thời gian và văn bản đầu vào; mỗi N-xx và mỗi sự kiện 🔗 có dòng ở mục "Sự kiện ngoài và tác vụ nền".
   - Hệ quả thiếu: chuyển kéo theo ghi sổ khác (GS-xx, R-xx) mà cột Hệ quả không ghi "trong một giao dịch"
     và không liệt kê phần kéo theo (nhật ký SM-03 không tính); ô — của ma trận không khớp dòng Cấm và cột
     Sửa được; máy Δ có công thức hoặc cột "Đổi khi" lệch R-xx của ERD.
   - ERD mục 4: chỗ trang_thai của mỗi máy đã trỏ SM mục n đúng số ở mục 1.3 chưa (không còn "chờ lớp 4"), và
     Version control của ERD đã ghi việc điền chưa. Bảng câu hỏi có đủ cột Đề xuất mặc định và Người chốt.
```

## Soát trước khi đóng

Khối và định dạng:

- [ ] Tên file `SM_{MÃ DỰ ÁN}_{PHẠM VI}_v{NN}.md`; có khối giới thiệu với số đếm (số máy, số nhóm, số máy Δ) khớp mục 1.3, và câu "không chứa gì, nằm ở đâu" của template ở cuối khối đã đúng với tài liệu.
- [ ] Mục "Thông tin tài liệu" đủ các dòng của `00_quy_uoc_chung` mục 3.2 (dòng `Phiên bản · Trạng thái` gộp như template) cộng dòng "Quy trình nguồn · ERD nguồn" với phiên bản cụ thể; đã điền; Phê duyệt giữ ba dòng, AI không điền thay người ký; cuối tài liệu đã điền Câu hỏi, Rủi ro còn lại (`RK-nn`, có mức C · TB · T), Điểm tạm hoãn (`TH-nn`), Nguồn — đánh số `{{n}}` theo "Đánh số mục cuối" ở `reference/dien-tung-muc.md` (hoặc ghi *Không có*).
- [ ] Bảng câu hỏi có đủ cột `Mã · Máy · Câu hỏi · Kịch bản · Đề xuất mặc định · Người chốt · Quyết định`; không dòng nào trống `Người chốt`.
- [ ] Mục 1.1: mỗi `SM-nn` còn dùng có căn cứ; nguyên tắc bỏ ghi *đã bỏ, không dùng lại*; không có `SM-nn` nào bị dùng như mã một máy ở bất kỳ chỗ nào.
- [ ] Đã xóa **hết** khối `<!-- … -->` của template (không chỉ khối `HƯỚNG DẪN`).

Danh sách máy và trạng thái:

- [ ] Mọi `trang_thai`, giá trị Δ và bảng ở ERD mục 5.3 có một dòng ở mục 1.3 **hoặc** nằm trong dòng "Không có máy trạng thái" kèm lý do; dòng đó chỉ chứa thực thể có `trang_thai`.
- [ ] Mỗi máy có từ hai trạng thái, có ít nhất một chuyển do sự kiện, có đúng một trạng thái đầu `[*]` (nhiều hơn thì có ghi lệch chuẩn); hai trục độc lập là hai máy, không gộp một enum.
- [ ] Mã trạng thái chép đúng enum ERD, ở mọi nơi (bảng, sơ đồ, bảng chuyển, ma trận); tên Việt ở cột `Hiển thị` khớp quy trình. Ngoại lệ duy nhất: id nhóm vẽ của trạng thái lồng (như `ACTIVE_GROUP`) — không phải enum, ghi là *nhóm* ở bảng trạng thái, không tính vào "mỗi enum đúng một lần".
- [ ] Mỗi trạng thái không phải ■ có ít nhất một mũi tên ra; mỗi ■ không có mũi tên ra (chỉ `--> [*]`), hoặc có ngoại lệ ghi trong bảng và **không** vẽ `--> [*]`.
- [ ] Không "trạng thái" nào thực ra là bước quy trình, cờ boolean, trạng thái màn hình hay tiến độ chuỗi việc.

Chuyển trạng thái:

- [ ] Mỗi dòng chuyển có đủ `Từ → Đến`, `Tên trạng thái`, `Ai — sự kiện`, `Điều kiện`, `Hệ quả`; không ô nào trống — không có thì `n/a` hoặc `Không ghi sổ`.
- [ ] Chuyển 👤 ghi vai trò đúng tên ở quy trình mục 2 và bước quy trình (dải bước khi bước hệ thống cùng request với bước người); chuyển ⚙️ ghi `N-xx` hoặc sự kiện; chuyển 🔗 ghi hệ thống ngoài.
- [ ] Ô `Điều kiện` chỉ dẫn mã kèm tên ngắn; con số cấu hình dẫn `CH-xx`; không phát biểu lại quy tắc; điều kiện chỉ quyết chuyển có xảy ra hay không — nhánh trả lượt, ghi sổ nằm ở `Hệ quả`.
- [ ] Tách nhiệm (người lập không tự duyệt, `SM-07`) và "bắt buộc lý do" (`SM-06`: hủy, từ chối, trả về, mở lại, trừ ngoại lệ ghi ở `SM-06`) cùng nằm ở cột `Điều kiện`, không ở `Ai — sự kiện`.
- [ ] Không điều kiện "kiểm lại" nào mà điều kiện đã được giữ chỗ ở chuyển trước (ví dụ: lượt đã giữ lúc gửi thì duyệt không kiểm lại lượt).
- [ ] Chuyển kéo theo ghi sổ khác (không kể nhật ký `SM-03`) ghi "Trong một giao dịch" và liệt kê đủ phần kéo theo, gồm `R-xx` bị đổi vế.
- [ ] Máy Δ có bảng trạng thái (không cột `Sửa được`), bảng `Trạng thái · Công thức suy ra · Đổi khi` và sơ đồ; công thức khớp `R-xx`; `Đổi khi` chỉ gồm sự kiện làm giá trị đổi; không máy Δ nào có cột lưu.
- [ ] Dòng **Cấm** liệt kê chuyển dễ tưởng hợp lệ (ít nhất mở lại ■ và người lập tự duyệt nếu máy có duyệt).
- [ ] Bảng chuyển và sơ đồ khớp nhau từng mũi tên (dòng gộp nhiều nguồn ứng với một mũi tên mỗi nguồn).

Sự kiện ngoài, thời gian, ma trận:

- [ ] Mỗi `N-xx` ở quy trình mục 5 và mỗi dòng ở mục 5.1 có dòng ở mục "Sự kiện ngoài và tác vụ nền" với `Tác động` thuộc bốn giá trị đã định nghĩa.
- [ ] Dòng **Chuyển do hết thời gian** có liệt kê hoặc ghi *không có* kèm lý do; mỗi `CH-xx` có đơn vị thời gian đã được xét.
- [ ] Ma trận có cho ít nhất đối tượng phức tạp nhất; cột là trạng thái của mục đó; mỗi cặp (chuyển 👤, trạng thái nguồn) có một ô ✅; ô `—` nhất quán với dòng **Cấm** và cột `Sửa được`.

Căn cứ và câu hỏi:

- [ ] Mỗi khẳng định nghiệp vụ có căn cứ theo bốn bước; không giả định nào cho nội dung đã có mã ở lớp trước; mọi `GD-xxxx` bôi đỏ đậm gạch chân.
- [ ] Mọi 🧪 và ❓ có dòng `S-xx` ở mục cuối; không còn `[CẦN BA CHỐT]` khi chuyển `Chờ review`.
- [ ] Không chuyển `Đã duyệt` khi còn ❓, `chưa chốt (`, hoặc giả định chưa chốt — trực tiếp hay kế thừa qua mã đứng trên giả định (`00_quy_uoc_chung.md` mục 12). Đã chạy script kiểm, không còn lỗi Chặn.
- [ ] Đã đối chiếu các bản chép (mã enum, tên bảng, tên tác nhân, số đếm) với nguồn.

Điền ERD:

- [ ] ERD mục 4: mọi chỗ mô tả `trang_thai` đã thay `chờ lớp 4` bằng `SM mục n` (hoặc lý do không có máy), số `n` khớp cột `#` ở mục 1.3; đã ghi vào Version control của ERD.

Đóng:

- [ ] Đã chạy **reviewer độc lập** và xử lý hết phát hiện hoặc ghi lý do không sửa.
- [ ] Sau lớp 6: đã thêm `BR-…` vào cột `Điều kiện` (giữ điều khoản) và ghi vào Version control.
