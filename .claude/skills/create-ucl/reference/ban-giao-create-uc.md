# Bàn giao sang `create-uc`

Phần tra cứu của skill [`create-ucl`](../SKILL.md). Hợp đồng giữa hai skill: lớp 5 cấp **dòng**, [`create-uc`](../../create-uc/SKILL.md) viết **thân**. Dòng tương ứng trong [`ranh-gioi-cac-lop.md`](../../ba-overview/reference/ranh-gioi-cac-lop.md) mục 2 là "Lớp 5 ↔ create-uc". Mã trong ví dụ là **mã minh họa**.

## 1. Ai giao gì

| Bên | Việc | Không làm |
|---|---|---|
| Lớp 5 (`UCL`, `UCD`) | Cấp mỗi use case **một dòng**: mã, tên, tác nhân chính, permission key, mã dự toán, căn cứ tối thiểu ở `Ghi chú`. Giữ cây và ma trận | Viết luồng, nhánh, sở cứ từng bước, màn hình, thông báo |
| `create-uc` | Viết **thân** file UC cho từng dòng: Overview, tác nhân và phạm vi quyền, ba loại luồng, sở cứ từng bước | Đặt lại mã, đổi tên, đổi tác nhân chính, đổi permission key, bỏ hoặc tách dòng đã có. **Một ngoại lệ:** khi `UCL` **chưa có** dòng cho UC đang viết (hoặc cần dòng dọn ghi tạm), `create-uc` được **thêm dòng nháp**; mã do lớp 5 duyệt (xem mục 4) |

Khi hai bên cần đổi một thứ của bên kia, **quay về bên sở hữu** (mục 4). Dòng của `UCL` là nguồn; file UC sửa theo.

## 2. Dòng của `UCL` đi vào file UC ở đâu

| Cột của `UCL` | Vào file UC của `create-uc` | Quy tắc |
|---|---|---|
| `No` (mã WBS ở lá) | `id` ở phần đầu file | **Cùng một chuỗi**, không tiền tố `UC-` (G2), **năm khúc**: `[tên PM].[nền tảng].[module].[chức năng].[tính năng]`. `create-uc` mục "Mã UC" nói "hầu hết dừng ở L3" — **điểm lệch, chờ người dùng quyết sửa `create-uc`** (mục 6). Khi đã có dòng `UCL`, `id: null` không còn dùng; dòng nháp chờ lớp 5 duyệt mã thì file UC tạm `id: null` ("chưa cấp mã") |
| Module (dòng cấp 3 chứa lá) | `domain` | Mã kèm tên: `DA1.WEB.03 Lịch hẹn` (`create-uc` cho "có mã rồi thì mã kèm tên"). Module trải nhiều nền tảng lấy đúng module của dòng chứa lá |
| `Tính năng` | `ten` | **Trùng chữ từng ký tự.** Động từ + đối tượng. Khi hai bên lệch thì `UCL` thắng và file UC sửa |
| `Actor` | Mục 2 `Tác nhân chính` | Chép **cả mã lẫn tên** `ACT-nn Tên` (lựa chọn của skill — `create-uc` ghi "tên vai trò", xem mục 6). Nhiều vai cách nhau `·` thì liệt kê đủ ở mục 2. Tác nhân hệ thống tác vụ nền: theo bảng ánh xạ dưới đây. Tác nhân hệ thống ngoài gọi vào: `create-uc` thêm cơ chế xác thực máy–máy vào ô này |
| `Permission key` | Không đi vào file UC | Key nằm **chỉ ở `UCL`**; file UC dẫn tới `UCL` (`create-uc` mục 2). Viết UC mà `UCL` chưa có dòng thì `create-uc` thêm **dòng nháp** (mục 4), key `chưa chốt (create-uc)` |
| `Mã UC gốc` | Không đi vào file UC | Dùng để truy ngược dự toán; `create-uc` không cần |
| `Ghi chú` | Điểm xuất phát của **sở cứ** | `create-uc` tìm sở cứ theo bốn bước; bước 1 bắt đầu từ chính các mã ở `Ghi chú` (bước quy trình, chuyển SM, `D-xx`, `BR-…`). Đọc từng mã, đối chiếu nguồn, rồi mở rộng — `Ghi chú` là căn cứ **tối thiểu**, không phải căn cứ đủ |
| `Mức`, `BMT`, `Độ phức tạp`, `Ưu tiên`, `Tầng` | Không đi vào file UC | Dành cho quản lý và dự toán |
| `Trạng thái đặc tả` | Đối chiếu với `trang_thai` (mục 3) | Hai nơi phải khớp |

**Tác nhân hệ thống tác vụ nền — ánh xạ chuỗi** (lựa chọn của skill; hai skill viết khác chữ):

| `UCL` / `UCD` (lớp 5) | File UC của `create-uc` (mục 2 `Tác nhân chính`) | Khi nào |
|---|---|---|
| `ACT-03 Hệ thống — tác vụ nền` | `Hệ thống (theo lịch)` | Use case chạy theo lịch (`N-xx` có `Lịch chạy`) |
| `ACT-03 Hệ thống — tác vụ nền` | `Hệ thống (theo sự kiện X)` | Use case chạy khi có sự kiện `X` trong hệ thống |
| `ACT-nn <Tên hệ thống ngoài>` | Tên hệ thống ngoài, kèm cơ chế xác thực máy–máy | Hệ thống ngoài gọi vào |

Kiểm đồng bộ ở mục 5 áp bảng này: `Hệ thống (theo lịch)` khớp `ACT-03`, không tính là lệch. Lớp 5 là nguồn của tên tác nhân; chuỗi `create-uc` là cách diễn đạt, không đổi `Actor`.

**Dòng của `UCL` chỉ cấp tối thiểu.** Căn cứ ở `Ghi chú` nêu đủ để người viết UC biết đọc từ đâu; **không** nêu hết ràng buộc dữ liệu hay quy tắc liên domain. Tìm phần còn lại là việc của `create-uc` theo bốn bước của skill đó.

## 3. Trạng thái đặc tả và `trang_thai`

Cột `Trạng thái đặc tả` của `UCL` là bản tóm tắt của `trang_thai` trong file UC:

| `UCL` — Trạng thái đặc tả | `create-uc` — `trang_thai` | Nghĩa |
|---|---|---|
| `Chưa` | (chưa có file) | Dòng đã cấp, chưa ai viết thân |
| `Nháp` | `nhap` | Đang viết hoặc chưa qua reviewer độc lập |
| `Review` | `cho-duyet` | Đã tự soát và qua reviewer độc lập; chờ duyệt. Không còn `[CẦN BA CHỐT]` |
| `Chốt` | `da-chot` | Đã duyệt. Không còn `chưa chốt (<ai>)` trong file UC |
| (dòng có ⊘) | `da-thay-the` | Use case bị thay bằng use case khác hoặc bỏ; `UCL` giữ dòng, thêm ⊘ ở đầu cột `Tính năng`, ghi lý do và mã thay thế ở `Ghi chú`. Cột `Trạng thái đặc tả` giữ giá trị cuối cùng trước khi bỏ |

**Ai cập nhật.** Người (hoặc AI) đổi `trang_thai` trong file UC **đổi luôn** cột `Trạng thái đặc tả` của dòng đó ở `UCL`, cùng một lượt. Khi dự án có script dựng bảng, script đọc `trang_thai` rồi ghi vào `UCL`; chưa có script thì cập nhật tay và kiểm khi lớp 5 chuyển `Chờ review`.

`create-uc` chỉ có bốn giá trị `trang_thai`; nó **chưa có chỗ** cho use case bị bỏ mà không có use case thay. Dự án tạm dùng `da-thay-the` kèm ghi chú lý do ở Lịch sử phiên bản của file UC. Đây là điểm cần chốt với chủ skill `create-uc`.

## 4. Khi bên này phải sửa dòng của bên kia

| Phát hiện | Của ai | Làm gì |
|---|---|---|
| Dòng `UCL` gộp nhiều thao tác khi viết thân (một UC có hai trạng thái cuối, hai quyền) | Lớp 5 | `create-uc` **không tự tách**; ghi lý do và gửi lại lớp 5 tách dòng, cấp mã mới theo quy tắc không đánh lại |
| Tên trong dòng khác chữ với `ten` của file UC | Lớp 5 là nguồn | Sửa file UC cho khớp dòng. Muốn đổi tên thật sự thì sửa dòng trước, ghi Version control của `UCL`, rồi sửa file UC |
| Tác nhân chính trong dòng không làm được bước nào của UC | Lớp 5 | Sửa `Actor` ở `UCL` và ma trận `UCD` mục 4; nếu tác nhân đổi, kiểm `UCD` mục 1 |
| `Permission key` trùng hoặc không hợp lý | Lớp 5 | Sửa key ở `UCL`; UC dẫn lại |
| UC có **ghi tạm** (giữ chỗ, tệp tải lên, OTP, số thứ tự) mà `UCL` chưa có UC tác nhân hệ thống dọn | `create-uc` phát hiện và thêm dòng nháp, lớp 5 duyệt mã | Thêm dòng nháp ở `UCL`: tên "Dọn <thứ> quá hạn", tác nhân Hệ thống — tác vụ nền, nền tảng `JOB`, key `n/a`, `Mã UC gốc` `chưa chốt (BA)`, `Ghi chú` bắt đầu `ngoài dự toán — dọn ghi tạm của <mã UC>`. Lớp 5 duyệt mã (giữ hoặc đổi theo quy tắc không đánh lại, số tiếp theo trong chức năng) rồi bỏ nhãn nháp; thêm dòng vào ma trận `UCD` mục 4 |
| Viết UC mà `UCL` **chưa có dòng** (UC phát hiện thêm, không do ghi tạm) | `create-uc` thêm dòng nháp, lớp 5 duyệt mã | Thêm dòng nháp ở `UCL` với `Tính năng`, `Actor`, `Permission key` `chưa chốt (create-uc)`, `Mã UC gốc` `chưa chốt (BA)`, `Ghi chú` bắt đầu `dòng nháp do create-uc thêm — chờ lớp 5 duyệt mã`, và mã đề xuất theo số tiếp theo. Lớp 5 duyệt mã, soát `UCD` (tác nhân, ma trận), kiểm lại `UCL` mục 6, ghi Version control. Trong lúc chờ, file UC để `id: null` |
| UC phát hiện thêm một tác nhân hoặc hệ thống ngoài mà `UCD` chưa có | Lớp 5 | Thêm vào `UCD` mục 1 và ma trận trước khi UC dẫn |
| UC phát hiện bước quy trình hoặc chuyển 👤 mà `UCL` chưa phủ | Lớp 5 | Thêm dòng hoặc ghi vào quy trình mục 10; kiểm lại `UCL` mục 6 |

**Mọi thay đổi ở `UCL` ghi một dòng vào Version control của `UCL`**, và sửa `UCD` nếu ảnh hưởng ma trận hoặc sơ đồ.

## 6. Điểm lệch với `create-uc` — chờ người dùng quyết sửa `create-uc`

Đợt này `create-uc` **giữ nguyên**; các chỗ dưới đây skill `create-ucl` không tự ghi đè, chỉ ghi lại để người dùng quyết.

| # | Chỗ lệch | `create-uc` nói | `create-ucl` (theo G2 và `ba-overview`) |
|---|---|---|---|
| 1 | Số khúc của `id` | `create-uc` mục "Mã UC": `[tên PM].[mã L1]…[mã Ln]`, "hầu hết dừng ở **L3**", ví dụ `DA1.03.01` | G2: **năm khúc** `[tên PM].[nền tảng].[module].[chức năng].[tính năng]`, ví dụ `DA1.WEB.03.01.03` |
| 2 | Chuỗi tác nhân hệ thống | `Hệ thống (theo lịch)` · `Hệ thống (theo sự kiện X)` (`reference/tac-nhan-he-thong.md`) | `ACT-03 Hệ thống — tác vụ nền`; đang dùng bảng ánh xạ ở mục 2 |
| 3 | Dạng ô tác nhân chính | "Tên vai trò, hoặc hệ thống" (`reference/dien-tung-muc.md`) | Cả mã lẫn tên `ACT-nn Tên` |
| 4 | Thêm dòng vào `UCL` | `reference/dien-tung-muc.md`: "Use case list chưa có dòng thì thêm dòng"; `id: null` khi chưa cấp mã — không nói ai duyệt mã | `create-uc` thêm **dòng nháp**, lớp 5 **duyệt mã** (mục 4); `id: null` chỉ tạm trong lúc chờ. Cần ghi bước "chờ lớp 5 duyệt mã" vào `create-uc` nếu người dùng đồng ý |
| 5 | Use case bỏ không có use case thay | Bốn giá trị `trang_thai`, chưa có chỗ cho trường hợp này | Tạm `da-thay-the` kèm lý do (mục 3) |

## 5. Kiểm đồng bộ trước khi chuyển `Review`

Trước khi một UC chuyển `cho-duyet` và dòng chuyển `Review`, đối chiếu cặp (dòng `UCL`, file UC):

- [ ] `id` = `No`; `ten` = `Tính năng` (từng ký tự).
- [ ] Mục 2 `Tác nhân chính` khớp `Actor` (mã lẫn tên; tác nhân hệ thống theo bảng ánh xạ mục 2); tác nhân là một vai có trong `UCD` mục 1.
- [ ] `domain` = mã kèm tên module cấp 3 của dòng.
- [ ] Dòng của UC có `Permission key` (hoặc `n/a`, `chưa chốt (<ai>)`) và không trùng dòng khác.
- [ ] Mọi mã trong `Ghi chú` được UC dẫn ở ô `Sở cứ` của bước tương ứng, hoặc có lý do vì sao không cần.
- [ ] Ma trận `UCD` mục 4 có ô khác `—` cho tác nhân chính của UC.
- [ ] `Trạng thái đặc tả` ↔ `trang_thai`.
