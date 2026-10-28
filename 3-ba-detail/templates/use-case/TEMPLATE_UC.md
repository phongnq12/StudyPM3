---
id: null            # mã ở cột No của use_case_list (lớp 5), VD DA1.WEB.03.01.01. Chưa có dòng thì để null
ten: ""             # BẮT BUỘC, kể cả khi chưa có mã
domain: ""          # tên domain bằng chữ; có mã rồi thì ghi mã kèm tên
trang_thai: nhap    # nhap | cho-duyet | da-chot | da-thay-the
---

# <Mã UC hoặc "chưa cấp mã"> — <Tên use case>

<div style="background:#f2f2f2;padding:10px;border-radius:4px">

**Hướng dẫn:** cách viết từng mục nằm ở [`.claude/skills/create-uc/SKILL.md`](../../../.claude/skills/create-uc/SKILL.md). **Viết xong UC thì
xóa toàn bộ các khối nền xám như khối này**, chỉ giữ lại dòng link tới skill.

**Mã UC:** lấy đúng cột `No` của danh sách use case (lớp 5), ví dụ `DA1.WEB.03.01.01`. Chưa
cấp mã thì ghi "chưa cấp mã", nhưng tên thì bắt buộc phải có.

**Sở cứ:** mỗi bước có 0 đến n sở cứ. **Bắt buộc** cho bước có kiểm tra, quyết định, ghi, hoặc gửi
đi; bước chỉ nhập liệu hoặc điều hướng ghi `n/a`. Ràng buộc dữ liệu không dẫn tới prototype. Tìm theo
đúng thứ tự: (1) business layer
**và bộ chuẩn, đặc tả hiện hành của dự án** — ghi mã kèm tên tóm tắt; (2) tài liệu khách hàng — ghi
tên file kèm chỗ cụ thể; (3) sổ giả định `assumption_log.md` — ghi `GD-xxxx`; (4) không có ở đâu cả
thì **ghi một giả định mới vào sổ** rồi dẫn mã đó — AI thì ghi `[CẦN BA CHỐT] <phát biểu>` và dừng. Sở cứ là quy tắc có con số thì ghi **con số kèm
biên** ngay trong ô. Tham chiếu giả định thì bôi đỏ, đậm, gạch chân:
`<span style="color:red">**<u>GD-0047</u>**</span>`

**Ba giá trị đặc biệt:** `n/a` nghĩa là *chắc chắn không có*. `chưa chốt (<ai>)` nghĩa là *chưa
biết, đang chờ người đó*. `[CẦN BA CHỐT] <phát biểu>` là AI chưa tìm được nguồn. Không dùng `n/a` cho
thứ chưa biết. Còn `[CẦN BA CHỐT]` thì chưa chuyển `cho-duyet`; còn `chưa chốt` thì chưa chuyển `da-chot`.

**Viết xong:** tự soát theo checklist cuối skill, rồi **bắt buộc gọi reviewer độc lập** trước khi
chuyển `cho-duyet`.

</div>

## Lịch sử phiên bản

| Phiên bản | Ngày | Người thực hiện | Thay đổi |
|---|---|---|---|
| 0.1 | DD/MM/YYYY | | Tạo mới |

## 1. Overview

<div style="background:#f2f2f2;padding:10px;border-radius:4px">

**Định nghĩa:** bản tóm tắt UC gói trong một màn hình — UC phục vụ việc gì, bắt đầu từ đâu, kết thúc
ra sao, mà không phải đọc hết luồng mới hiểu.

**Hướng dẫn:** mỗi dòng một câu ngắn. `Kết quả chính` là **một và chỉ một** kết quả được coi là thành
công; kết quả thành công khác nhau về dữ liệu (lưu nháp và gửi duyệt) là **hai UC khác nhau**.

</div>

| Mục | Nội dung |
|---|---|
| Điều kiện cần | <điều kiện hệ thống bảo đảm ở điểm vào — ẩn nút, chặn route, lọc danh sách — theo quy tắc chung của dự án. Backend vẫn phải chặn khi vi phạm. Không viết lại thành bước trong luồng> |
| Bắt đầu khi | <vì sao tác nhân làm việc này, viết kiểu "Là <tác nhân>, tôi muốn <mục đích>"> |
| Trigger tại đâu | <chỗ kích hoạt UC: một nút, một element, một quy tắc, một sự kiện, một lịch chạy. Ghi kèm màn hình hoặc đường dẫn prototype. Lịch chạy thì ghi cả múi giờ. Nhiều điểm vào thì liệt kê: "Chính: <trigger> · Phụ: <trigger> → 0.A1"> |
| Kết quả chính | <trạng thái cuối của thực thể chính được coi là thành công. Có đổi trạng thái thì liệt kê đủ trạng thái trước, ví dụ: `Lich_Hen` chuyển từ `DRAFT` sang `PENDING_APPROVAL`. Thao tác theo lô: "mỗi bản ghi kết thúc ở X hoặc Y"> |

## 2. Tác nhân và phạm vi quyền

<div style="background:#f2f2f2;padding:10px;border-radius:4px">

**Định nghĩa:** ai được thực hiện UC này, và trong phạm vi bản ghi nào. Đây là chỗ sinh ra điều
kiện lọc dữ liệu cho Dev. Permission key của UC không ghi ở đây mà ở cột `Permission key` của
**Use case list** (lớp 5).

**Hướng dẫn:** tác nhân có thể là **người** hoặc **hệ thống** — hệ thống tự chạy theo lịch, theo sự
kiện, hoặc một hệ thống ngoài gọi vào. Hệ thống ngoài gọi vào thì ghi thêm **cơ chế xác thực máy–máy**
ở dòng `Tác nhân chính`.

</div>

| Mục | Nội dung |
|---|---|
| Tác nhân chính | <tên vai trò; nhiều vai thì liệt kê đủ. Hệ thống thì ghi "Hệ thống (theo lịch)" hoặc "Hệ thống (theo sự kiện X)" hoặc tên hệ thống ngoài kèm cơ chế xác thực: token, chữ ký, IP…> |
| Bên nhận kết quả | <ai hoặc hệ thống nào nhận thông tin từ UC này, kèm `đồng bộ` hay `bất đồng bộ`; hoặc n/a> |
| Phạm vi dữ liệu | <thấy và sửa được bản ghi nào; phạm vi đọc khác phạm vi sửa thì ghi riêng; nhiều vai khác phạm vi thì ghi theo từng vai> |

## 3. Luồng chạy Use case

<div style="background:#f2f2f2;padding:10px;border-radius:4px">

**Định nghĩa:** ba loại luồng, phân biệt theo chỗ chúng dẫn tới.

| Loại | Định nghĩa | Kết quả |
|---|---|---|
| Main flow | Đường đi thẳng, không có gì bất thường | **Đạt** |
| Alternative flow | Hệ thống **thực hiện bước gốc theo cách khác**, luồng tiến lên và tới cùng trạng thái cuối | **Vẫn đạt** |
| Exception flow | Hệ thống **từ chối thực hiện bước gốc**, hoặc **tác nhân rời khỏi UC trước bước ghi**. Không ghi kết quả mới; ghi tạm phải hoàn tác | **Không đạt** (của nhánh đó — quay về bước X thì UC vẫn chạy tiếp) |

Câu quyết: *sau nhánh này luồng đi tiếp về phía trước (nhập lại bước ≥ X hoặc tới `END (Main)`) hay
lùi lại (quay về bước ≤ X, hoặc kết thúc ở `END (Exception)`)?* Tiến là alternative, lùi là exception.

**Hai kiểu kết thúc UC:** `END (Main)` — đạt kết quả mong đợi, chỉ main flow và alternative flow tới
được. `END (Exception)` — UC kết thúc mà mục tiêu không đạt: dừng hẳn, chuyển sang UC khác, hoặc bỏ dở.

**Mã nhánh:** `[bước gốc].A[STT]` cho alternative, `[bước gốc].E[STT]` cho exception; bước bên trong
thêm `.[STT bước]`. Rẽ từ bước 2: alternative thứ nhất là `2.A1` với các bước `2.A1.1`, `2.A1.2`;
exception thứ nhất là `2.E1` với các bước `2.E1.1`. Hai loại **đếm riêng** — bước 2 có thể vừa có
`2.A1` vừa có `2.E1`. Đọc mã là biết rẽ từ đâu và thuộc loại nào. Hai giá trị đặc biệt của bước gốc:
`0` = một **điểm vào khác** của UC (chỉ đi với A: `0.A1`), `*` = bỏ dở từ bất kỳ bước nào (chỉ đi với E).

**Mọi ô:** điền tường minh, kể cả khi trùng với ô ngay trên. Không có gì thì ghi `n/a`, chưa biết thì
ghi `chưa chốt (<ai>)`. Cột `Màn hình` ghi `route · điều khiển` (ví dụ `/lich-hen/dat-lich · nút
"Lưu"`). Bước gọi sang một UC khác thì `Mô tả` chỉ ghi `→ gọi UC <mã> <tên> (màn | API | màn + API)`,
không chép nội dung UC đó; quyền của UC được gọi kiểm độc lập.

</div>

### Main flow

<div style="background:#f2f2f2;padding:10px;border-radius:4px">

**Hướng dẫn:** chỉ một bảng, **không chứa nhánh rẽ nào**. Dòng đầu luôn là `START`, dòng cuối luôn
là `END (Main)`, hai dòng này thay cho mã bước. `START` gộp `Bắt đầu khi` và **trigger chính** thành
một câu mô tả bước mở đầu. `END (Main)` ghi **dữ liệu nào được tạo hay sửa và còn thấy ở đâu sau khi
tải lại trang**; cột `Màn hình` của nó là màn người dùng đứng lại. Viết "nếu… thì…" trong ô `Mô tả` là dấu hiệu
chỗ đó phải tách thành alternative hoặc exception flow.

</div>

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| START | n/a | *tác nhân muốn gì và kích hoạt ở đâu — gộp hai dòng của mục 1* | *route · điều khiển trigger* | n/a | n/a |
| 1 | *ai làm bước này* | *việc gì xảy ra, viết ở mức ý định* | *route · điều khiển* | *nội dung thông báo, đúng chuỗi trong prototype* | *0–n nguồn cách nhau bằng ·; n/a nếu bước chỉ nhập liệu · mã kèm tên · tài liệu kèm chỗ · GD-xxxx; có số thì ghi số kèm biên* |
| 2 | | | | | |
| 3 | | | | | |
| END (Main) | n/a | *dữ liệu tạo/sửa, còn thấy ở đâu sau tải lại; khớp `Kết quả chính`* | *màn đứng lại* | *thông báo kết thúc, nếu có* | n/a |

### Alternative flows

<div style="background:#f2f2f2;padding:10px;border-radius:4px">

**Hướng dẫn:** mỗi nhánh một bảng riêng, tiêu đề là mã nhánh kèm tên. Dòng đầu là **bước gốc rẽ
nhánh, chép y nguyên từ main flow** — chỉ khác ở cột `Sở cứ`: ghi **điều kiện rẽ** theo ngữ pháp
`<điều kiện> — <nguồn>`. Dòng cuối phải nói rõ nhập lại bước mấy, hoặc đi thẳng tới `END (Main)`.

**Điểm vào khác** (UC mở được từ chỗ khác, cùng tác nhân, cùng quyền, cùng kết quả) là nhánh `0.A[n]`.
Đây là **ngoại lệ**: dòng đầu là một dòng `START` riêng với trigger và màn hình riêng, cột `Sở cứ` ghi
điều kiện vào; dòng cuối nhập lại một bước của main flow **trước bước ghi**. Mỗi trigger phụ ở mục 1
có đúng một nhánh `0.A`.

</div>

#### 2.A1 — <tên nhánh>

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| 2 | *y nguyên main flow* | *y nguyên main flow* | *y nguyên main flow* | *y nguyên main flow* | *<điều kiện rẽ> — <nguồn>* |
| 2.A1.1 | *ai làm* | *việc gì xảy ra* | *route · điều khiển* | *nội dung thông báo* | *mã kèm tên · tài liệu kèm chỗ · GD-xxxx* |
| 2.A1.2 | | *bước cuối: nhập lại bước mấy, hay đi thẳng tới END (Main)* | | | |

### Exception flows

<div style="background:#f2f2f2;padding:10px;border-radius:4px">

**Hướng dẫn:** mỗi nhánh một bảng riêng, dòng đầu như alternative flow. Dòng cuối là một trong hai:

- **UC còn chạy, người dùng làm lại:** bỏ trống mọi ô, cột `Mô tả` ghi `(quay về bước X) · dữ liệu đã
  nhập: <giữ / xóa> · bản ghi: <không tạo / không đổi / hoàn tác>`.
- **UC kết thúc:** cột `Bước` ghi `END (Exception)`, cột `Mô tả` ghi `<dừng UC / chuyển sang UC <mã>
  <tên>> · dữ liệu đã nhập: … · bản ghi: …`.

**Bỏ dở** (Hủy, Quay lại, chuyển menu, Back trình duyệt) rẽ từ bất kỳ bước nào trước bước ghi, mã
`*.E[n]`. **Mặc định không viết bảng** — trả lời câu soát #6 ở dòng "Đã soát" theo ngữ pháp bên dưới.
Chỉ viết bảng `*.E[n]` khi UC có ghi gì đó trước bước ghi, hoặc làm khác quy tắc chung. Chi tiết ở skill.

</div>

#### 2.E1 — <tên nhánh>

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| 2 | *y nguyên main flow* | *y nguyên main flow* | *y nguyên main flow* | *y nguyên main flow* | *<điều kiện rơi vào nhánh> — <nguồn>* |
| 2.E1.1 | *ai làm* | *hệ thống xử lý gì, báo gì* | *route · điều khiển* | *nội dung thông báo* | *mã kèm tên · tài liệu kèm chỗ · GD-xxxx* |
| | | *(quay về bước 1) · dữ liệu đã nhập: giữ · bản ghi: không tạo* | | | |

#### 2.E2 — <tên nhánh>

| Bước | Tác nhân | Mô tả | Màn hình | Message thông báo (nếu có) | Sở cứ |
|---|---|---|---|---|---|
| 2 | *y nguyên main flow* | *y nguyên main flow* | *y nguyên main flow* | *y nguyên main flow* | *<điều kiện rơi vào nhánh> — <nguồn>* |
| 2.E2.1 | *ai làm* | *hệ thống xử lý gì, báo gì* | *route · điều khiển* | *nội dung thông báo* | *mã kèm tên · tài liệu kèm chỗ · GD-xxxx* |
| END (Exception) | | *dừng UC · dữ liệu đã nhập: xóa · bản ghi: không đổi* | | | |

> **Đã soát, không áp dụng:** <mỗi câu soát không thành nhánh ghi một trong hai: `không áp dụng (lý do riêng của UC này)` hoặc `theo quy tắc chung <mã kèm tên>`. Đi qua chín câu cho riêng UC này, không chép từ UC khác>
>
> Câu #6 (bỏ dở) ghi đủ ba mảnh: `#6 theo quy tắc chung <mã kèm tên> · bước ghi: <n> · trước bước ghi: <không ghi gì / ghi gì → *.E[n]> · về màn: <route>`
