# Căn cứ, câu hỏi mở và giả định

Phần tra cứu của skill [`ba-overview`](../SKILL.md). Áp cho cả sáu lớp. Skill lớp chỉ nói thêm **nguồn
đặc thù** của lớp mình, không viết lại phần này.

## 1. Chỗ nào bắt buộc có căn cứ

Mỗi template có cột hoặc ô tên `Căn cứ`, `Nguồn`, `Căn cứ vai trò`, `Bằng chứng`. Bắt buộc điền khi nội
dung là một **khẳng định nghiệp vụ** — một mục tiêu, một yêu cầu, một bước có quyết định, một thực thể,
một chuyển trạng thái, một tác nhân, một quy tắc. Ô chỉ mang tính trình bày (số thứ tự, tên hiển thị
lặp lại) thì không cần.

Một ô có thể chứa nhiều nguồn, cách nhau bằng `·`.

## 2. Tìm căn cứ theo bốn bước

Dừng ở bước đầu tiên tìm thấy.

| Bước | Tìm ở đâu | Tìm thấy thì ghi |
|---|---|---|
| 1 | **Lớp đã có** của chính dự án — lớp đứng trước trong thứ tự 1 → 6 và mọi tài liệu đã `Đã duyệt` | Mã kèm tên ngắn: `D-01 Chỉ nhận đặt lịch trực tuyến`, `QK-01 bước 3`, `BRQ-05` |
| 2 | **Đầu ra `/ba-init`** — văn bản pháp luật, dự toán, khảo sát, biên bản, feedback khách hàng đã được presales xác nhận | Văn bản pháp luật: `TT01 Đ5.2.a` theo `00_quy_uoc_chung` mục 4, viết tắt khai ở mục Nguồn. Tài liệu khác: tên file kèm chỗ cụ thể (sheet, dòng, mục) **và trích nguyên văn** câu tìm thấy. Biên bản họp chỉ làm căn cứ khi có dòng chốt và người chốt |
| 3 | **Sổ giả định** `2-ba-overview/assumption_log.md` | `GD-xxxx`, bôi đỏ đậm gạch chân (mục 5) |
| 4 | Không có ở đâu | **Người** viết: ghi giả định mới vào sổ (mục 5) rồi dẫn mã. **AI**: ghi ❓ `[CẦN BA CHỐT] <phát biểu>` vào ô căn cứ, thêm một dòng vào bảng câu hỏi của tài liệu kèm **đề xuất mặc định**, và **không** tự cấp `GD-xxxx` |

Không tạo giả định cho nội dung đã có căn cứ ở bước 1 hoặc 2 — đó là bịa lại thứ đã có. Mã luôn đi kèm
tên ngắn khi người đọc không có tài liệu gốc trước mặt (`00_quy_uoc_chung` mục 4). Con số trong căn cứ
ghi **kèm biên**: "tối đa 3 người, tính cả người đại diện", không ghi "tối đa 3".

Văn bản pháp luật đã rà toàn văn mà không sinh nội dung cho lớp này thì vẫn ghi ở bảng văn bản với kết
luận *đã rà toàn văn, không sinh …* kèm lý do, để người sau không rà lại.

## 3. Ba giá trị đặc biệt — và `chờ lớp n`

| Ghi | Nghĩa | Ai được ghi | Người đọc hiểu là |
|---|---|---|---|
| `chờ lớp n` | **Sẽ có, lớp n điền.** Chỉ dùng cho các ô liệt kê ở [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10 | Người viết, AI | Chưa dẫn được vì lớp sau chưa viết; không chặn trạng thái tài liệu |
| `—` hoặc `n/a` | **Chắc chắn không có.** Bước không sinh chứng từ, thực thể không có máy trạng thái | Người viết, AI | Không làm phần đó |
| `chưa chốt (<ai>)` | **Chưa biết, đang chờ người đó** | Người viết, AI | Chưa làm được; hỏi người được ghi tên |
| ❓ `[CẦN BA CHỐT] <phát biểu>` | Chưa tìm được căn cứ, chờ BA quyết có tạo giả định hay không | **Chỉ AI** | Chưa làm, chưa test phần đó |

Dùng `—` cho thứ chưa biết là lỗi nặng nhất: người đọc sẽ coi đó là "không có" và không làm.

Ràng buộc với trạng thái tài liệu — đầy đủ ở `00_quy_uoc_chung.md` mục 12: còn `[CẦN BA CHỐT]` thì
**không được** chuyển `Chờ review` — BA phải xử lý từng chỗ thành một trong ba: căn cứ thật, `GD-xxxx`, hoặc
giữ ❓ kèm mã câu hỏi `Q-…`. Còn ❓, `chưa chốt (<ai>)`, hoặc **bất kỳ giả định nào chưa ở `Đã chốt` /
`Đã cập nhật lớp`** — kể cả giả định kế thừa qua mã đứng trên giả định — thì **không được** chuyển
`Đã duyệt`. Đây là chỗ ép giả định phải được chốt: tài liệu không thể duyệt khi còn đứng trên cát.

## 4. Câu hỏi mở và giả định — hai thứ khác nhau

Mỗi tài liệu **giữ bảng câu hỏi riêng** theo template (`Q-B01`, `Q-E1`, `S-01`, mục 11.3 của quy trình…).
Sổ `assumption_log.md` là **sổ chung** của cả business layer. Ranh giới:

| | Câu hỏi `Q-…` trong tài liệu | Giả định `GD-xxxx` trong sổ |
|---|---|---|
| Là gì | Một điểm **chưa ai trả lời**, chưa có gì dựa vào | Một **câu trả lời tạm** mà các lớp **đang dựa vào để đi tiếp** |
| Ai tạo | Người viết hoặc AI | **Chỉ người** — BA chấp nhận đề xuất mặc định của một câu hỏi để chạy tiếp. AI không tự tạo |
| Thân tài liệu dẫn | ❓ kèm mã `Q-…` | `GD-xxxx` bôi đỏ |
| Khi chốt | Cột Quyết định ghi `✅ dd/mm/yyyy: …` | Sổ chuyển `Đã chốt`, sửa xong các lớp thì `Đã cập nhật lớp` |

Vòng đời: AI ghi ❓ `[CẦN BA CHỐT]` và một dòng `Q-…` có **đề xuất mặc định** → BA xem: chốt luôn (✅,
sửa thân tài liệu), hoặc chấp nhận tạm (BA tạo `GD-xxxx` trong sổ, dòng `Q-…` ghi *→ GD-xxxx*, thân tài
liệu đổi ❓ thành `GD-xxxx`), hoặc để mở.

Trước khi ghi câu hỏi mới, **grep sổ giả định** theo từ khóa — có thể đã có người hỏi.

## 5. Ghi một giả định vào sổ

**Chỉ người** làm việc này — AI không tự tạo giả định. **Giả định** là một điều tài liệu coi là đúng để đi tiếp mà **không
tìm được căn cứ trong đầu vào `/ba-init`** (và các lớp đã có). Mỗi giả định thuộc một trong **6 loại**,
tương ứng 6 lớp nơi nó phát sinh: `1` BRD · `2` Quy trình · `3` ERD · `4` Máy trạng thái · `5` Tác nhân
và Use case · `6` Business rule. **Loại ghi ở cột `Lớp bị ảnh hưởng`** sẵn có của sổ (một giả định có thể chạm
nhiều lớp thì ghi đủ). Sổ dùng **đúng 12 cột** đang có; phần "Cách dùng" ở đầu sổ là nguồn chuẩn về
trạng thái và mức xác nhận. Khi tạo dòng mới:

| Cột | Điền |
|---|---|
| Mã | `GD-xxxx` tiếp theo số cao nhất đang có, kèm anchor `<a id="GD-xxxx"></a>`. Không dùng lại mã đã xóa |
| Ngày ghi | `DD/MM/YYYY` — theo định dạng của sổ |
| Vấn đề / điều chưa rõ | Câu hỏi thật sự chưa ai trả lời |
| Nguồn (hint) | Đã tìm ở đâu mà không thấy |
| Giả định tạm đang dùng | Phát biểu đủ để lớp sau dựa vào — có số thì ghi số kèm biên |
| Lớp bị ảnh hưởng | Số lớp: `1` BRD · `2` Quy trình · `3` ERD · `4` Máy trạng thái · `5` Use case · `6` Business rule |
| Mã liên quan | Mã đối tượng trong các lớp; mã câu hỏi `Q-…` đã sinh ra giả định này |
| Cần ai chốt | Tên người |
| Trạng thái | `Đang mở` |
| Mức xác nhận, Kết quả chốt, Đã cập nhật ở | Để trống |

Nhiều người ghi song song thì cấp mã tạm theo người (`GD-<tên>-1`), chủ sổ đánh lại một lượt.

Mỗi lần dẫn `GD-xxxx` trong thân tài liệu thì bôi **đỏ, đậm, gạch chân**. Dẫn một mã mà dòng định nghĩa
của nó đứng trên giả định thì **mang theo** giả định đó trên cùng dòng (`00_quy_uoc_chung.md` mục 9), để lớp sau
không mất dấu:

```markdown
<span style="color:red">**<u>GD-0047</u>**</span>
```

`GD-0047` là mã minh họa. Giả định là chỗ tài liệu đang đứng trên cát; người đọc phải thấy ngay dòng nào
sẽ phải sửa khi khách chốt khác.

## 6. Bản chép và kiểm đồng bộ

Nguyên tắc "một loại thông tin, một lớp sở hữu" có ngoại lệ: vài chỗ buộc phải chép để người đọc khỏi mở
file khác. Chép thì **nguồn thắng** khi lệch.

| Bản chép | Nằm ở | Nguồn gốc |
|---|---|---|
| Tên ngắn đi kèm mỗi mã | Mọi chỗ dẫn mã | Dòng định nghĩa mã đó |
| Con số kèm biên | Ô căn cứ, ô điều kiện | BR, tham số `CH-xx`, văn bản pháp luật |
| Mã enum, tên bảng, tên trường | Máy trạng thái, quy trình mục 3 | ERD |
| Tên tác nhân | ERD cột Chủ sở hữu, máy trạng thái cột Ai | Quy trình mục 2, sau đó lớp 5 |
| Số đếm ở khối giới thiệu | Đầu mỗi tài liệu | Thân chính tài liệu đó |

Trước khi chuyển một tài liệu sang `Chờ review`, đối chiếu lại mọi bản chép với nguồn.
