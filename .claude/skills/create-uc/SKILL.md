---
name: create-uc
description: Hướng dẫn viết một file Use Case theo TEMPLATE_UC. Dùng khi cần viết mới, sửa hoặc rà soát một UC — kể cả khi các lớp nghiệp vụ phía dưới chưa có để tham chiếu. Định nghĩa UC, tìm sở cứ theo thứ tự nào, phân biệt alternative với exception ra sao, soát lại thế nào, và bắt buộc gọi một reviewer độc lập trước khi đóng. Gọi khi người dùng nói "viết UC", "bóc UC", "điền UC", "rà UC này giúp tôi", hoặc khi mở một file theo TEMPLATE_UC.
---

# Viết một file Use Case

Template đi kèm: [`3-ba-detail/templates/use-case/TEMPLATE_UC.md`](../../../3-ba-detail/templates/use-case/TEMPLATE_UC.md)

## Version control

Bảng này theo dõi phiên bản của **cả skill lẫn template** — hai thứ phát hành cùng nhau.

| Phiên bản | Ngày | Người thực hiện | Thay đổi |
|---|---|---|---|
| 1.0 | 25/10/2026 | Claude (soạn), NamLH (chốt) | Phát hành lần đầu, gồm skill `create-uc` và `TEMPLATE_UC.md`. Chốt: UC là một thao tác, một permission key; ba loại luồng main / alternative / exception với mã `[bước].A[n]` và `[bước].E[n]`; sở cứ tìm theo bốn bước, giả định ghi vào `assumption_log.md` dạng `GD-xxxx`; metadata rút còn bốn dòng; đã qua một vòng review ba góc Dev / QC / BA |
| 1.1 | 26/10/2026 | Claude (soạn), NamLH (chốt) | Mục 1 Overview rút còn bốn dòng: gộp `Trạng thái sau` vào `Kết quả chính`; bỏ `Ưu tiên`, `Tham chiếu đầu vào`, `Đơn vị xử lý`, `Kích hoạt thủ công khi test`. Hành vi chạy lô của UC tác nhân hệ thống chuyển vào main flow và exception flow. Permission key chuyển khỏi file UC sang cột `Permission key` của Use case list (lớp 5) |
| 1.2 | 26/10/2026 | Claude (soạn), NamLH (chốt) | Hai kiểu kết thúc `END (Main)` và `END (Exception)`. Nhánh bỏ dở `*.E[n]` rẽ từ bất kỳ bước nào trước bước ghi; mặc định trả lời bằng một dòng ở câu soát #6, chỉ viết bảng khi có ghi tạm hoặc lệch quy tắc chung; cấm `*.A`; hết phiên là quy tắc chung của dự án. Định nghĩa exception thêm "tác nhân rời khỏi UC trước bước ghi" |
| 1.3 | 26/10/2026 | Claude (soạn), NamLH (chốt), reviewer ngoài (góp ý) | Kết quả = trạng thái cuối của thực thể chính; "một giao dịch" thành "một bước ghi" kèm khái niệm ghi tạm. Sở cứ mỗi bước là 0–n, bắt buộc cho bước có kiểm tra, quyết định, ghi, gửi đi. Ràng buộc dữ liệu tách khỏi prototype. Ba giá trị đặc biệt (thêm `[CẦN BA CHỐT]`). Thêm mục bản chép và kiểm đồng bộ; dòng Đã soát phải có lý do riêng. Bước cuối bắt buộc: reviewer độc lập. Tách skill thành lõi + `reference/`. Thống nhất ví dụ `LICH_HEN: PENDING -> APPROVED`. Dọn chỗ sót của 1.0–1.2 . Một UC có nhiều điểm vào: nhánh `0.A[n]` khi đủ bốn điều kiện (cùng tác nhân, cùng quyền, cùng kết quả, nhập lại trước bước ghi); `Trigger tại đâu` liệt kê được trigger phụ |
| 1.4 | 27/10/2026 | Claude (soạn), NamLH (chốt) | Khớp với bộ skill business layer (`ba-overview`): mã UC lấy đúng cột `No` của `use_case_list` (`DA1.WEB.03.01.01`); trạng thái dẫn enum tiếng Anh đúng ERD và dẫn máy bằng `SM mục n` (`SM-nn` là nguyên tắc chung, không phải mã máy); thực thể dẫn tên bảng ERD (`Lich_Hen`); tác nhân theo sơ đồ use case; sổ giả định chung `2-ba-overview/assumption_log.md`, mã `GD-xxxx`. Giữ nguyên: AI ghi `[CẦN BA CHỐT]`, không tự tạo giả định |

## Đọc gì, khi nào

File này là **phần lõi** — đọc hết trước khi viết UC đầu tiên. Phần tra cứu nằm trong `reference/`,
mở đúng file khi đến đúng việc:

| Khi đang làm | Mở |
|---|---|
| Điền từng mục của template, cần bảng cột và ví dụ | [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md) |
| Ghi giả định mới, đặt tên thực thể / trạng thái / màn hình, chép số hay chuỗi từ nguồn | [`reference/so-cu-va-ten-goi.md`](reference/so-cu-va-ten-goi.md) |
| Đi qua chín câu soát nhánh | [`reference/chin-cau-soat.md`](reference/chin-cau-soat.md) |
| UC có form, cần xử lý bỏ dở (Hủy, Quay lại, Back) | [`reference/bo-do.md`](reference/bo-do.md) |
| Tác nhân là hệ thống — chạy theo lịch, theo sự kiện, hệ thống ngoài gọi vào | [`reference/tac-nhan-he-thong.md`](reference/tac-nhan-he-thong.md) |
| Viết xong, gọi reviewer độc lập | [`reference/review-doc-lap.md`](reference/review-doc-lap.md) |

## Quy trình viết một UC

1. Xác định đây có đúng là **một** UC không — mục "UC là gì" và "Một UC to bằng nào".
2. Chép template, điền mục 1 và 2.
3. Viết main flow, rồi đi qua chín câu soát để tìm alternative và exception.
4. Tìm sở cứ cho từng bước theo bốn bước.
5. Tự soát theo checklist cuối file này.
6. **Gọi reviewer độc lập — bắt buộc**, xem mục "Review độc lập". Sửa theo phát hiện hoặc ghi lý do
   không sửa.
7. Xóa các khối hướng dẫn nền xám, chỉ giữ dòng link tới skill.

---

## UC là gì

**Use case là một thao tác mà một tác nhân — người, hoặc hệ thống — thực hiện lên hệ thống để đạt
được một mục đích xác định.** "Đặt lịch hẹn", "Xem danh sách lịch hẹn", "Gửi duyệt lịch hẹn", "Hệ
thống tự nhắc lịch lúc 7 giờ" — mỗi cái là một UC. "Nhập ngày sinh" không phải, vì đó là một trường.
"Quản lý lịch hẹn" cũng không phải, vì đó là bốn thao tác.

Định nghĩa này gần với **Elementary Business Process** của Craig Larman (*Applying UML and
Patterns*): một việc do một người làm, ở một nơi, trong một lần, đáp lại một sự kiện nghiệp vụ, tạo ra
giá trị đo được và để dữ liệu ở trạng thái nhất quán. Nó khác định nghĩa của Jacobson và Cockburn, vốn
coi UC là một **mục tiêu** của tác nhân — nên UC ở đây nhỏ hơn UC trong sách của họ.

**Kết quả** của UC là **trạng thái cuối của thực thể chính** mà UC tác động. Mọi chỗ trong skill nói
"kết quả" đều theo nghĩa này:

| Tình huống | Kết luận |
|---|---|
| Cùng trạng thái cuối, khác giá trị dữ liệu (chọn khung giờ khác, nhập số khác) | **Cùng một kết quả** — nhánh là alternative |
| Hệ thống tự quyết đường đi mà cùng trạng thái cuối (đã có hồ sơ thì liên kết, chưa có thì tạo rồi liên kết) | Alternative, **không** tách UC |
| Khác trạng thái cuối (Nháp và Chờ duyệt) | **Hai UC** |
| Thao tác theo lô | Kết quả tính trên **từng bản ghi** — "mỗi bản ghi kết thúc ở X hoặc Y", ghi rõ ở `Kết quả chính` |

Từ định nghĩa rút ra năm tính chất. Phân vân một thứ có phải UC không, hoặc một UC có đang viết đúng
không, quay về bảng này:

| Tính chất | Nghĩa là | Thể hiện ở |
|---|---|---|
| **Một thao tác** | Một động từ lên một thực thể, bóc theo thực thể và phân hệ sở hữu. Thêm, sửa, xóa, xem là bốn UC | Tên UC = động từ + đối tượng. Mỗi UC một file |
| **Một tác nhân chính** | Người hoặc hệ thống. Nhiều vai cùng làm được thì liệt kê, nhưng cùng làm *một* việc | Mục 2 `Tác nhân chính` |
| **Một kết quả mong đợi** | Một trạng thái cuối được coi là thành công. Khác trạng thái cuối là UC khác | Mục 1 `Kết quả chính`; dòng `END (Main)`; alternative phải tới được, exception thì không |
| **Một quyền** | Mỗi UC một permission key, trừ UC không cần quyền. UC là đơn vị nhỏ nhất phân quyền được | Không nằm trong file UC — ở cột `Permission key` của **Use case list** (lớp 5) |
| **Một bước ghi** | UC cam kết kết quả tại **đúng một** bước ghi. Mọi lần ghi trước đó là **ghi tạm** (giữ chỗ, tệp đã tải lên, OTP đã gửi, số thứ tự đã lấy) — phải khai ở câu soát #6 và phải có UC tác nhân hệ thống dọn khi quá hạn. Không có khoảng chờ việc khác xảy ra bên trong UC | Câu soát #6 mảnh `bước ghi` và `trước bước ghi`; exception thì không ghi kết quả, mọi ghi tạm phải hoàn tác |

**Vị trí trong framework.** UC thuộc Specification Layer và là **đơn vị đặc tả nhỏ nhất đứng được
một mình**: phân quyền riêng, test độc lập, sửa mà không đụng UC khác. UC có đúng một thao tác ghi
kết quả; số API đọc phục vụ UC thì không giới hạn. Lớn hơn UC là quy trình — nhiều người, nhiều lượt,
có chuyển giao hoặc khoảng chờ. Nhỏ hơn UC là bước — chỉ có nghĩa bên trong một UC. Một UC chính là
phần nằm bên trong một bước "người làm trên hệ thống" của quy trình.

**Một UC có ba loại luồng:** main flow đi thẳng tới kết quả mong đợi; alternative flow đi đường khác
nhưng vẫn tiến lên và vẫn tới đó; exception flow bị từ chối hoặc bị bỏ dở, lùi lại, không tới.

**Một UC có thể có nhiều điểm vào.** Điểm vào chính ứng với main flow. Mỗi điểm vào khác là một
alternative flow mã `0.A[n]`, **khi và chỉ khi đủ cả bốn điều kiện**: cùng tác nhân, cùng permission
key, cùng `Kết quả chính`, và nhập lại main flow **trước bước ghi**. Thiếu một điều kiện thì là UC
khác.

## Một UC to bằng nào

| Việc | Có phải UC không |
|---|---|
| Đặt lịch hẹn | Có |
| Xem danh sách lịch hẹn | Có — một thao tác riêng, một quyền riêng |
| Lưu nháp lịch hẹn, và Gửi duyệt lịch hẹn | **Hai UC** — hai trạng thái cuối khác nhau. Nhập form thuộc UC lưu nháp; gửi duyệt là thao tác trên bản ghi đã có |
| Quản lý danh mục phòng họp | **Không** — gộp 4 thao tác. Tách thành thêm, sửa, xóa, xem |
| Nhập ngày sinh | **Không** — một trường, không phải một thao tác |
| Hệ thống tự gửi nhắc lịch lúc 7h | **Có** — UC tác nhân hệ thống |
| Hệ thống kiểm còn chỗ hay không | **Không** — một bước bên trong UC |

Một chức năng mở được từ nhiều chỗ thì phân biệt như sau:

| Tình huống | Kết luận |
|---|---|
| Khác ngữ cảnh mở hoặc dữ liệu điền sẵn; cùng tác nhân, quyền, kết quả | **Alternative từ điểm bắt đầu** `0.A[n]` |
| Khác tác nhân | UC khác — hoặc liệt kê thêm tác nhân ở mục 2 nếu làm đúng cùng một việc |
| Khác kênh, mà các bước hoặc người thực hiện khác nhau (tự làm trên ứng dụng / nhờ cán bộ làm tại quầy) | UC khác |
| Bắt đầu trên bản ghi đã có (mở lại bản nháp để sửa) | UC khác |
| Được một UC khác gọi tới | Không phải nhánh — UC gọi ghi `→ gọi UC <mã> <tên>` |

Việc tách CRUD thành bốn UC, và coi "Xem danh sách" là một UC, là **quy ước của dự án**, xuất phát từ
hai lý do: mỗi thao tác là một permission key, và mỗi thao tác cần ánh xạ được về hạng mục dự toán của
khách hàng. Cockburn khuyên ngược lại — bắt đầu bằng một UC "Quản lý X", chỉ tách khi phức tạp. Ghi rõ
ở đây để đừng tranh luận dựa trên sách: dự án đã chọn và có lý do.

## Nguyên tắc

**1. UC chỉ lắp các mảnh ghép lại, không tự định nghĩa mảnh nào.** Quy tắc nghiệp vụ nằm ở lớp quy
tắc hoặc bộ chuẩn chung, trạng thái ở lớp máy trạng thái, thực thể và ràng buộc thuộc tính ở ERD, bước
quy trình ở lớp quy trình, bố cục ở prototype. UC chỉ có mục tiêu, trình tự, nhánh rẽ, và sở cứ trỏ
sang những nơi kia. Bốn chỗ UC buộc phải chép nội dung từ nguồn được khai riêng ở
[`reference/so-cu-va-ten-goi.md`](reference/so-cu-va-ten-goi.md) — khi lệch, **nguồn thắng**.

**2. Mỗi bước có 0 đến n sở cứ.** Sở cứ **bắt buộc** cho bước có **kiểm tra, quyết định, ghi, hoặc
gửi đi** — một bước như vậy mà ô `Sở cứ` trống là bước chưa phân tích xong. Bước **chỉ nhập liệu hoặc
điều hướng** ghi `n/a`: gắn đại một nguồn cho đủ ô còn tệ hơn để `n/a` có chủ đích, vì nó làm loãng
giá trị của sở cứ thật. Một bước dựa vào nhiều nguồn thì ghi đủ, cách nhau bằng `·`.

**3. Chưa có lớp nào để trỏ thì vẫn có sở cứ, chỉ là tìm ở chỗ khác.** Thứ tự tìm ở mục "Tìm sở cứ
theo bốn bước". Không bao giờ có chuyện "chưa có business layer nên để trống".

**4. UC và prototype là một cặp, nhưng ràng buộc dữ liệu không nằm ở prototype.** Prototype là giải
pháp, UC là đặc tả của giải pháp đó; khi xong thì cả hai đều phải có, và UC luôn trỏ được tới màn
prototype tương ứng. Nhưng ràng buộc đặt ở prototype thì mọi cửa ghi khác — import tệp, gọi thẳng API,
chuyển đổi dữ liệu — lách qua được. Nên chia ba chỗ:

| Loại | Đặt ở đâu |
|---|---|
| Ràng buộc nội tại của thuộc tính: định dạng, độ dài, miền giá trị, bắt buộc **tuyệt đối** | Lớp dữ liệu (ERD, từ điển dữ liệu) |
| Bắt buộc **theo ngữ cảnh**: theo kênh, tác nhân, trạng thái | Lớp quy tắc, hoặc điều kiện chuyển trạng thái |
| Bố cục, loại control, nhãn, thứ tự trường, định dạng hiển thị, chuỗi thông báo | Prototype |

UC trỏ tới cả ba qua cột `Sở cứ`. Lớp dữ liệu chưa có thì ràng buộc dẫn bằng `GD-xxxx` hoặc
`[CẦN BA CHỐT]`, **không** dẫn tới prototype. Backend luôn phải kiểm ràng buộc, prototype chỉ thể
hiện cách báo lỗi.

## Mã UC

Mã UC lấy **đúng cột `No`** của danh sách use case (lớp 5, `use_case_list`) — cây WBS `[phân hệ].[nền tảng].[module].[chức năng].[tính năng]`, ví dụ `DA1.WEB.03.01.01`, không tiền tố `UC-`. Duy nhất trên
toàn hệ thống; mã đã xóa không dùng lại. Chưa cấp mã thì `id: null` và tiêu đề ghi "chưa cấp mã" —
nhưng **tên bắt buộc** ngay từ đầu. Khi chưa có mã, tham chiếu chéo giữa các UC ghi bằng tên và link
tương đối tới file.

## Tìm sở cứ theo bốn bước

Áp cho mọi bước cần sở cứ (nguyên tắc 2). Dừng ở bước đầu tiên tìm thấy:

| Bước | Tìm ở đâu | Tìm thấy thì ghi gì |
|---|---|---|
| 1 | **Business layer** — lớp quy tắc, máy trạng thái, quy trình, ERD — **và bộ chuẩn, đặc tả hiện hành đã chốt**: sổ quy tắc chung, danh mục chung, SRS hoặc UC đã duyệt của chức năng liên quan | Mã kèm tên tóm tắt: `BR-012 Chỉ đặt lịch cho khách đã xác thực` |
| 2 | **Tài liệu khách hàng** — thư mục tài liệu đầu vào của dự án, bất kể dạng gì | Văn bản quy định: số hiệu + điều/khoản. Tài liệu khác: tên file kèm chỗ cụ thể **và trích nguyên văn câu tìm thấy**. Biên bản họp chỉ làm sở cứ khi có dòng chốt và người chốt |
| 3 | **Sổ giả định** `assumption_log.md` | Mã giả định, bôi đỏ đậm gạch chân: `<span style="color:red">**<u>GD-0047</u>**</span>` |
| 4 | Không có ở đâu cả | Người viết UC **ghi một giả định mới vào sổ** rồi dẫn mã đó. AI thì ghi `[CẦN BA CHỐT] <phát biểu>` và dừng, không tự cấp mã |

**Không tạo giả định cho nội dung đã có mã ở bước 1** — đó là bịa lại thứ đã chốt. **Mã luôn đi kèm
tên, không bao giờ viết trơ.** **Sở cứ là quy tắc có con số thì ghi số kèm biên ngay trong ô.** Cách
ghi giả định vào sổ, cách đặt tên và quy tắc bôi đỏ: [`reference/so-cu-va-ten-goi.md`](reference/so-cu-va-ten-goi.md).

## Ba giá trị đặc biệt

| Ghi | Nghĩa | Ai được ghi | Dev và QC hiểu là |
|---|---|---|---|
| `n/a` | **Chắc chắn không có.** Bước không có thông báo, bước chỉ nhập liệu không cần sở cứ, không bên nào nhận kết quả | Người viết | Không code, không test phần đó |
| `chưa chốt (<ai>)` | **Chưa biết, đang chờ người đó.** Bên nhận chưa rõ, màn chưa dựng | Người viết | Chưa code được phần đó; hỏi người được ghi tên |
| `[CẦN BA CHỐT] <phát biểu>` | Ô `Sở cứ` chưa tìm được nguồn, đang chờ BA quyết có tạo giả định hay không | **Chỉ AI** | Chưa code, chưa test phần đó |

Dùng `n/a` cho thứ chưa biết là lỗi nặng nhất: dev đọc `Bên nhận kết quả: n/a` sẽ không phát sự kiện.

Ràng buộc với trạng thái tài liệu: còn `[CẦN BA CHỐT]` thì UC **không được** chuyển sang `cho-duyet`;
còn `chưa chốt (<ai>)` thì **không được** chuyển sang `da-chot`.

## Ba loại luồng, câu quyết, hai kiểu kết thúc

| Loại | Định nghĩa | Kết quả của nhánh |
|---|---|---|
| **Main flow** | Đường đi thẳng, không có gì bất thường | **Đạt** |
| **Alternative flow** | Hệ thống **thực hiện bước gốc theo cách khác**, hoặc **UC được mở từ một điểm vào khác** rồi nhập lại main flow; luồng tiến lên và tới cùng trạng thái cuối | **Vẫn đạt** |
| **Exception flow** | Hệ thống **từ chối thực hiện bước gốc**, **hoặc tác nhân rời khỏi UC trước bước ghi**. Không ghi kết quả mới; mọi ghi tạm phải được hoàn tác | **Không đạt** |

"Không đạt" là của **nhánh đó**, không phải của cả UC. Exception kết thúc bằng `(quay về bước X)` thì
UC vẫn chạy tiếp và có thể đạt. QC assert theo dòng cuối của nhánh, không assert cả UC thất bại.

**Câu quyết** — sau nhánh này, luồng **đi tiếp về phía trước** (nhập lại bước ≥ X, hoặc tới
`END (Main)`) hay **lùi lại** (quay về bước ≤ X, hoặc kết thúc ở `END (Exception)`)? Tiến là
alternative, lùi là exception. Kiểm chéo:

| | Alternative | Exception |
|---|---|---|
| Ghi kết quả trong nhánh | Có thể, và vẫn tới cùng trạng thái cuối | **Không**. Ghi tạm đã có phải hoàn tác |
| Trạng thái cuối khác `Kết quả chính` | **Không** — khác là UC riêng | Không tới kết quả |
| Có khoảng chờ việc khác xảy ra | **Không** — có chờ là ranh giới sang UC khác | Không |

Ca hay nhầm: *"hết chỗ, chọn khung giờ khác còn chỗ rồi đi tiếp"* là alternative — cùng trạng thái cuối,
chỉ khác giá trị khung giờ. *"Hết chỗ, báo lỗi, người dùng chọn lại"* là exception. *"Hết chỗ, vào hàng
chờ, khi có chỗ thì tự giữ"* **không phải nhánh** — trạng thái cuối khác và có khoảng chờ: đó là một UC
riêng cộng một UC tác nhân hệ thống.

| Kết thúc | Nghĩa | Ai tới được |
|---|---|---|
| `END (Main)` | Đạt kết quả mong đợi | Main flow, alternative flow |
| `END (Exception)` | UC kết thúc mà mục tiêu không đạt — dừng hẳn, chuyển UC khác, hoặc bỏ dở | Chỉ exception flow |

Exception "quay về bước X" **không phải END** — UC vẫn đang chạy.

## Mã nhánh

Format `[bước gốc].[A hoặc E][STT nhánh]`, bước bên trong thêm `.[STT bước]`. `bước gốc` nhận ba
loại giá trị. A và E đếm riêng.

| `bước gốc` | Nghĩa | Đi với |
|---|---|---|
| `1`, `2`, `3`… | Bước trên main flow mà nhánh rẽ ra | A và E |
| `0` | **Điểm bắt đầu** — tức dòng `START`. Nhánh là một điểm vào khác của UC | **Chỉ A** |
| `*` | Bất kỳ bước nào trước bước ghi — bỏ dở | **Chỉ E** |

Không có `0.E`. Một điểm vào phụ gặp trục trặc thì rơi vào một trong hai chỗ đã có: nút bị ẩn hoặc
route bị chặn (thuộc `Điều kiện cần`, kể cả thiếu quyền — câu soát #4), hoặc dữ liệu điền sẵn bị kiểm
ở bước nhập lại rồi rơi vào exception của bước đó (ví dụ `2.E1`).

| Tình huống | Mã nhánh | Bước bên trong |
|---|---|---|
| Alternative thứ nhất rẽ từ bước 2 | `2.A1` | `2.A1.1`, `2.A1.2` |
| Alternative thứ hai rẽ từ bước 2 | `2.A2` | `2.A2.1` |
| Exception thứ nhất rẽ từ bước 2 | `2.E1` | `2.E1.1` |
| Điểm vào khác thứ nhất | `0.A1` | `0.A1.1` |
| Bỏ dở, rẽ từ bất kỳ bước nào trước bước ghi | `*.E1` | `*.E1.1` |

Trong văn xuôi luôn bọc `` `*.E1` `` bằng backtick. Nơi mã phải nằm trong tên tệp hay ID testcase thì
viết `ANY` thay cho `*`.

## Review độc lập — bắt buộc

Viết xong, tự soát xong, **luôn** gọi một agent độc lập review UC trước khi chuyển `cho-duyet`. Người
viết — kể cả AI vừa viết — không tự review thay được, vì đọc lại lập luận của chính mình thì luôn thấy
đúng.

| Điểm | Quy định |
|---|---|
| Đầu vào | **Chỉ** đường dẫn file UC và vị trí các nguồn: business layer, thư mục tài liệu khách hàng, sổ giả định, prototype. **Không** đưa lập luận, ghi chú hay lịch sử của người viết |
| Model | Model mạnh dành cho review theo chính sách chọn model của dự án — không dùng model rẻ nhất |
| Việc 1 — đúng format | Chạy từng dòng checklist "Soát trước khi đóng" ở cuối file này |
| Việc 2 — sở cứ đúng | Mở từng nguồn được dẫn: có thật không, và **nói đúng điều UC gán cho nó** không |
| Việc 3 — sở cứ đủ | Tìm cái **thiếu**: quy tắc liên domain chạm vào thực thể của UC; thực thể khác bị ảnh hưởng; trạng thái của thực thể khác đổi theo; giả định đã có trong sổ mà UC chưa dẫn; ràng buộc dữ liệu đang dẫn tới prototype |
| Đầu ra | Bảng phát hiện, xếp theo mức nặng. **Không sửa file** |
| Sau review | Người viết sửa, hoặc ghi lý do không sửa vào phần trả lời cho người dùng. Sửa nhiều thì gọi review lại |

Prompt mẫu để giao cho reviewer: [`reference/review-doc-lap.md`](reference/review-doc-lap.md).

---

# Soát trước khi đóng một UC

Định dạng và cấu trúc:

- [ ] Có tên. Mã có thể `null` nhưng tên thì không.
- [ ] Main flow có đủ dòng `START` và `END (Main)`, và không chứa nhánh rẽ nào.
- [ ] Mỗi nhánh là một bảng riêng; dòng đầu chép y nguyên bước gốc, chỉ khác cột `Sở cứ` dạng `<điều kiện> — <nguồn>`. **Ngoại lệ `0.A`:** dòng đầu là một dòng `START` riêng với trigger và màn hình riêng.
- [ ] Mỗi trigger phụ ở mục 1 có đúng một nhánh `0.A[n]`, và ngược lại. Mỗi `0.A` đủ bốn điều kiện và nhập lại main flow trước bước ghi.
- [ ] Mã nhánh đúng dạng `[bước gốc].A[STT]` hoặc `[bước gốc].E[STT]`, `bước gốc` là số bước, `0` (chỉ với A) hoặc `*` (chỉ với E); chữ A/E khớp với phần nhánh đang nằm; A và E đếm riêng. Không có `*.A`.
- [ ] Alternative nói rõ nhập lại bước mấy hoặc tới `END (Main)`; dòng cuối exception là `(quay về bước X)` hoặc `END (Exception)`, luôn kèm `dữ liệu đã nhập` và `bản ghi`.
- [ ] Không ô nào trong các bảng luồng bị bỏ trắng — trùng thì chép lại, không có thì `n/a`, chưa biết thì `chưa chốt (<ai>)`.
- [ ] Bước `→ gọi UC` có ghi `(màn | API | màn + API)`.
- [ ] Cột `Màn hình` ghi `route · điều khiển`, route lấy đúng chuỗi trong prototype.
- [ ] Đã xóa hết khối hướng dẫn nền xám, chỉ còn dòng link tới skill.

Kết quả và ghi:

- [ ] `Kết quả chính` nói rõ trạng thái cuối của thực thể chính; có đổi trạng thái thì liệt kê đủ trạng thái trước. Thao tác theo lô thì ghi kết quả trên từng bản ghi.
- [ ] `END (Main)` ghi dữ liệu còn thấy ở đâu sau tải lại và màn đứng lại.
- [ ] Mỗi nhánh đã qua câu quyết tiến/lùi; không alternative nào có trạng thái cuối khác `Kết quả chính` hay có khoảng chờ.
- [ ] Khác trạng thái cuối đã tách thành UC riêng.
- [ ] Câu soát #6 có đủ ba mảnh `bước ghi · trước bước ghi · về màn`, hoặc trỏ tới bảng `*.E[n]`. Mọi ghi tạm đã khai, và có UC hệ thống dọn khi quá hạn.

Sở cứ:

- [ ] Mọi bước có kiểm tra, quyết định, ghi, hoặc gửi đi đều có sở cứ; bước chỉ nhập liệu hoặc điều hướng ghi `n/a`, không gắn nguồn cho đủ ô.
- [ ] Mỗi sở cứ đi đúng bốn bước; không có giả định nào cho nội dung đã có mã ở bước 1; quy tắc có con số thì ghi số kèm biên.
- [ ] Không ràng buộc dữ liệu nào dẫn tới prototype.
- [ ] Mọi `GD-xxxx` trong thân file đều bôi đỏ đậm gạch chân và có dòng trong sổ giả định. Mã nào cũng đi kèm tên.
- [ ] Đã đối chiếu bốn loại bản chép với nguồn tại thời điểm chuyển sang `cho-duyet`.

Soát nhánh và trạng thái tài liệu:

- [ ] Đã đi qua đủ chín câu soát cho **riêng UC này**; câu không thành nhánh ghi vào dòng "Đã soát" với lý do riêng của UC, không chép từ UC khác.
- [ ] Không còn `[CẦN BA CHỐT]` khi chuyển `cho-duyet`; không còn `chưa chốt` khi chuyển `da-chot`.
- [ ] UC đã có dòng trên Use case list, cột `Permission key` đã điền hoặc ghi `chưa chốt (<ai>)`.
- [ ] Tác nhân hệ thống ngoài có ghi cơ chế xác thực máy–máy.
- [ ] **Đã gọi reviewer độc lập** và xử lý hết phát hiện.
