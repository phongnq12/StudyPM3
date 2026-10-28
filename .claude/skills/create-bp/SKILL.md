---
name: create-bp
description: Hướng dẫn viết tài liệu Quy trình nghiệp vụ (lớp 2 "How" của business layer) theo template business_process.md. Dùng khi cần lập mới, sửa hoặc rà soát bộ quy trình của một domain — bóc bước từ văn bản pháp luật và khảo sát hiện trạng, lập bảng các bước một tác nhân một việc, vẽ sơ đồ BPMN bằng Mermaid với nút mang đúng số bước, ghi trường hợp biên và điểm kiểm soát (phân loại của template, dựa trên COSO), ghi tác vụ nền N-xx, tham số CH-xx, quyết định D-xx, quy tắc dùng chung GS-xx, bảng chứng từ. Định nghĩa quy trình khác bước, UC, tác vụ nền, quy tắc ra sao; khi nào tách quy trình con; bắt buộc gọi reviewer độc lập trước khi đóng. Gọi khi người dùng nói "viết quy trình nghiệp vụ", "bóc quy trình", "dựng lớp 2", "lập bảng các bước", "vẽ BPMN", "sơ đồ quy trình Mermaid", "điền business_process.md", "rà QT này giúp tôi", hoặc khi mở file QT_*.md theo template quy trình.
---

# Viết tài liệu Quy trình nghiệp vụ

Template đi kèm: [`2-ba-overview/templates/2-business-process/business_process.md`](../../../2-ba-overview/templates/2-business-process/business_process.md)

Phiên bản theo bảng Version control của [`ba-overview`](../ba-overview/SKILL.md).

> **Quy ước riêng của kit — sơ đồ quy trình.** Sơ đồ từng quy trình và bản đồ quy trình vẽ **BPMN 2.0 bằng draw.io**
> theo skill [`ba-bpmn`](../ba-bpmn/SKILL.md) (CLAUDE.md luật 8, `kit/standards/notation.md`); cổng máy báo LỖI khi
> `2-ba-overview/2-business-process/` có Mermaid flowchart. Chỗ template và skill này nói "sơ đồ Mermaid" thì nhúng
> ảnh `QT_<MA>_<PV>_<mã QT>.drawio.svg`, giữ nguyên heading. Mọi quy tắc **nội dung** sơ đồ của skill này vẫn áp
> dụng: nút mang đúng số bước `B1`, `B2`…, một làn một tác nhân, bước 🟡 tô vàng, không nút cụt. Bảng ký hiệu
> Mermaid ở `reference/buoc-va-so-do.md` mục 5 chỉ dùng để hiểu ý đồ; ký hiệu vẽ thật theo `ba-bpmn`.

## Đọc gì, khi nào

File này là **phần lõi** — đọc hết trước khi viết tài liệu đầu tiên. Phần dùng chung cho cả sáu lớp nằm ở `ba-overview`; phần riêng của lớp 2 nằm trong `reference/`. Mở đúng file khi đến đúng việc:

| Khi đang làm | Mở |
|---|---|
| Điền từng mục, từng cột của template; cần bảng cột và ví dụ | [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md) |
| Bóc bước từ văn bản pháp luật hay khảo sát; đánh số bảng và sơ đồ; vẽ Mermaid; tách quy trình con | [`reference/buoc-va-so-do.md`](reference/buoc-va-so-do.md) |
| Ghi thuật ngữ, dữ liệu trục, chứng từ, `N-xx`, `GS-xx`, điểm kiểm soát để lớp 3–6 nhận được; việc của lớp 2 trong lượt điền ngược | [`reference/ung-vien-cho-lop-sau.md`](reference/ung-vien-cho-lop-sau.md) |
| Quy ước chung — hệ mã, ký hiệu, cách dẫn chiếu (mục 9), ô điền sau (mục 10) | [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Tìm căn cứ, ghi câu hỏi mở `Q-…`, giả định `GD-xxxx`, ❓ `[CẦN BA CHỐT]`, ba giá trị đặc biệt | [`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) |
| Phân vân một nội dung thuộc lớp nào | [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md) |
| Cần ví dụ minh họa | [`ba-overview/reference/vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md) |
| Viết xong, gọi reviewer độc lập | [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md) |

Thứ bậc khi hai nguồn nói khác nhau: [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) → template → skill. Template đã có đủ các khối `00_quy_uoc_chung` bắt buộc ([`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6). Chỗ template còn tự mâu thuẫn, và skill xử lý ra sao, nằm ở cuối [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md).

## Quy trình viết

1. **Kiểm cổng vào** theo `ba-overview` (BRD ở `Chờ review` trở lên). Sao template thành `QT_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`; không sửa template. Đọc nguồn theo mục "Tìm căn cứ" dưới đây và lập danh sách thô các nghĩa vụ và việc đang làm.
2. **Chốt tập quy trình.** Mỗi `BRQ` cần ít nhất một quy trình phủ. Chạy từng ứng viên qua bảng "Có phải quy trình không", đặt mã `{XX}-nn`, đặt chủ quy trình, gom thành Phần A, B…; vẽ bản đồ mục 3; điền mục 1 và mục 2.
3. **Với từng quy trình**: điền bảng thông tin, bóc bảng các bước, vẽ sơ đồ — theo [`reference/buoc-va-so-do.md`](reference/buoc-va-so-do.md). Bảng và sơ đồ sửa cùng một lần.
4. **Mỗi quy trình viết nốt trường hợp biên và điểm kiểm soát**, sau đó mới sang quy trình kế tiếp. Mọi cổng phải có nhánh không đạt; mọi ngoại lệ thủ công hiện có đã vào bảng biên hoặc thành bước 🟡.
5. **Rút các mục dùng chung từ những gì đã viết**: thuật ngữ 1.1, `GS-xx` 3.1, `D-xx` mục 4, `N-xx` mục 5, `CH-xx` mục 6, truy vết mục 7, chứng từ mục 8, điểm kiểm soát mục 9; mục 10 ghi `chờ lớp 5`; mục 11, 12. Kiểm hai chiều: mỗi mã được dẫn có dòng định nghĩa, mỗi dòng định nghĩa được dẫn.
6. **Điền vào BRD** — việc lớp 2 phải làm trước cổng ra, theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10: BRD mục 6.2 cột `Quy trình` và `Tài liệu chi tiết`, BRD mục 12 cột `Quy trình`; ghi Version control của BRD. Cách ghi: [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md), mục "Điền vào BRD".
7. **Tự soát** theo checklist cuối file này.
8. **Gọi reviewer độc lập — bắt buộc**, xem mục "Review độc lập". Sửa theo phát hiện hoặc ghi lý do không sửa.
9. Xóa mọi khối `<!-- HƯỚNG DẪN -->` của template trong file dự án (và các chú thích `<!-- -->` ở đầu từng khối), chuyển trạng thái `Chờ review`. Ghi vào Version control những chỗ **chờ lớp sau điền**: đường dẫn ERD ở khối giới thiệu và cột Thực thể ERD (`chờ lớp 3`), mục 10 (`chờ lớp 5`), mã BR ở cột Căn cứ (lớp 6).

---

## Quy trình nghiệp vụ là gì

**Quy trình nghiệp vụ là chuỗi các bước, do một hay nhiều tác nhân làm, bắt đầu từ một sự kiện kích hoạt và kết thúc ở một kết quả nghiệp vụ nhận ra được.** Sự kiện kích hoạt có thể là một yêu cầu đến, một thời điểm tới (hẹn giờ) hoặc một điều kiện dữ liệu thành đúng. Giữa các bước thường có bàn giao giữa các bên hoặc khoảng chờ, nhưng đó là dấu hiệu chứ không phải điều kiện bắt buộc. "Đặt và duyệt lịch hẹn" là một quy trình: khách gửi yêu cầu, hệ thống kiểm lượt và chuyển chờ duyệt, nhân viên tiếp đón duyệt, hệ thống báo kết quả — ba tác nhân, một lần bàn giao, một khoảng chờ. "Gửi yêu cầu đặt lịch" không phải: đó là một bước.

**Quy trình ngắn (lựa chọn của skill).** Một nghiệp vụ nằm trong phạm vi BRD, có sự kiện kích hoạt riêng và kết quả riêng thì vẫn là quy trình kể cả khi chỉ có một bước người cộng một bước hệ thống cùng request (ví dụ `LH-02 Hủy lịch hẹn`): nhờ đó `BRQ` có quy trình phủ và lớp 4, 5 dẫn được một mã. Nghiệp vụ không có kích hoạt hay kết quả riêng thì là **nhánh** của quy trình khác — một nhánh ở sơ đồ và một dòng ở bảng trường hợp biên. Gặp ca như vậy thì chọn một trong hai và ghi lý do.

Quy trình là câu trả lời cho **How** — việc được làm theo bước nào, ai làm bước nào, bàn giao ở đâu. Bài giới thiệu 6 lớp nhấn mạnh ba điều: trình tự các bước **không chỉ luồng thuận**; điểm **bàn giao** giữa các bên; **ngoại lệ và đường vòng thủ công hiện có**. Tài liệu lớp 2 phải có cả ba, nếu thiếu thì chưa xong.

**Nguồn chuẩn và nơi artifact nằm trong template:**

| Chuẩn | Artifact | Nằm ở đâu |
|---|---|---|
| BPMN 2.0.2 — ISO/IEC 19510:2013 | Sơ đồ có sự kiện, hoạt động, cổng rẽ nhánh, làn tác nhân | Sơ đồ Mermaid của từng quy trình; bản đồ ở mục 3 |
| UML Activity Diagram (OMG UML 2.5) | Luồng hoạt động, rẽ nhánh, song song | Cùng sơ đồ trên; Mermaid `flowchart` là dạng vẽ của cả hai chuẩn |
| ISO 9001:2015 mục 4.4 | Mỗi quy trình có đầu vào, đầu ra, người chịu trách nhiệm, rủi ro, chỉ số theo dõi | Bảng thông tin đầu mỗi quy trình: Mục đích, Chủ quy trình, `Đầu vào từ`, `Đầu ra kích hoạt`, Chỉ số theo dõi. Rủi ro của quy trình thể hiện bằng điểm kiểm soát và bảng trường hợp biên; mục 11.1 là rủi ro còn lại **của tài liệu**, không phải ô rủi ro của bảng thông tin |
| SIPOC | Nhà cung cấp → Đầu vào → Quy trình → Đầu ra → Khách hàng | Dòng `Đầu vào từ` và `Đầu ra kích hoạt` của bảng thông tin; bảng các bước là "Quy trình" |
| COSO Internal Control 2013 | Tách nhiệm, điểm kiểm soát. Bốn loại kiểm soát là phân loại của template, dựa trên COSO | Dòng "Tách nhiệm bắt buộc" ở mục 2; điểm kiểm soát ở từng quy trình; mục 9 |
| BABOK v3 mục 10.35 Process Modelling | Mô hình hóa quy trình | Toàn tài liệu |

**Năm cái dễ lẫn với quy trình**, phép thử của từng cái:

| Thứ | Là | Nằm ở | Phép thử |
|---|---|---|---|
| **Quy trình** | Chuỗi bước từ sự kiện kích hoạt tới kết quả; thường có bàn giao hoặc chờ | Lớp 2, mỗi quy trình một khối | Có sự kiện kích hoạt và kết quả riêng, từ hai bước trở lên? Bàn giao hoặc chờ không bắt buộc |
| **Bước** | Một tác nhân, một động từ, một đối tượng, có kết quả quan sát được | Một dòng của bảng các bước, một nút `B{n}` | Gộp hai tác nhân hoặc hai động từ thì phải tách |
| **Use case** | Phần nằm **bên trong một bước "người làm trên hệ thống"**: một người, một lần ngồi, một bước ghi | Lớp 5, create-uc | Có phải chờ việc khác xảy ra, hoặc chuyển giao cho người khác? Có thì không còn ở trong UC |
| **Tác vụ nền** | Việc hệ thống tự chạy theo lịch hoặc theo ngưỡng thời gian và **tự làm trọn**, không bàn giao cho người nào làm tiếp | Mục 5 `N-xx` | Sau việc này còn bước người nào phải làm không? Không còn thì là `N-xx`. Còn thì phần có người là một quy trình bắt đầu bằng hẹn giờ, dòng `Kích hoạt` ghi `N-xx` |
| **Quy tắc** | Câu đúng bất kể đang ở bước nào | `GS-xx` hoặc điểm kiểm soát ở lớp 2; BR ở lớp 6 | Bỏ trình tự đi, câu còn đúng không? Còn thì là quy tắc |

### Tính chất nhận diện

| Tính chất | Nghĩa là | Thể hiện ở |
|---|---|---|
| **Có sự kiện kích hoạt nghiệp vụ** | Quy trình bắt đầu vì một việc xảy ra (yêu cầu đến, thời điểm tới, điều kiện dữ liệu đúng), không vì ai bấm nút | Dòng `Kích hoạt`; nút bắt đầu `S0` |
| **Một chuỗi bước, mỗi bước một tác nhân một việc** | Có thứ tự, mỗi bước nói được ai làm gì với cái gì | Bảng các bước; nút `B1`, `B2`… |
| **Có kết quả nghiệp vụ nhận ra được** | Khi xong thì một điều gì đó đã đổi trong nghiệp vụ, và có người hoặc quy trình nhận | Dòng `Mục đích`, `Đầu ra kích hoạt`; nút kết thúc |
| **Thường có bàn giao hoặc khoảng chờ** | Việc chuyển từ bên này sang bên khác mà bên nhận làm sau, không cùng lần ngồi; hoặc phải chờ ngày, chờ duyệt, chờ bên ngoài. Hệ thống tự kiểm trong cùng một request **không** là bàn giao. Không bắt buộc — xem "Quy trình ngắn" ở trên | Cạnh qua làn có nhãn; `Đầu vào từ` |
| **Có đường không đạt, không chỉ luồng thuận** | Mọi cổng có cạnh ra cho trường hợp không đạt; ngoại lệ và đường vòng thủ công hiện có đã được ghi | Cổng và nhánh Chặn ở sơ đồ; bảng Trường hợp biên |
| **Có chủ và điểm kiểm soát** | Một vai trò chịu trách nhiệm cuối; điều hệ thống phải cưỡng chế được nêu | Dòng `Chủ quy trình`; điểm kiểm soát bắt buộc; mục 9 |

## Có phải quy trình không

Dùng ví dụ xuyên suốt của [`vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md); mã trong bảng là **mã minh họa**.

| Thứ cần xét | Có phải quy trình không |
|---|---|
| Khách gửi yêu cầu, hệ thống kiểm còn lượt và chuyển chờ duyệt, nhân viên tiếp đón duyệt hoặc từ chối, hệ thống báo khách | **Có** — `LH-01 Đặt và duyệt lịch hẹn`: ba tác nhân, bàn giao từ khách sang nhân viên tiếp đón, khoảng chờ giữa bước 3 và bước 4 |
| "Khách gửi yêu cầu đặt lịch" | **Không** — một bước (`LH-01` bước 1; bước hệ thống 2–3 chạy cùng request). UC `DA1.WEB.03.01.03 Gửi yêu cầu đặt lịch` nằm **bên trong** bước này và phủ `LH-01 bước 1–3` |
| "Nhân viên tiếp đón duyệt yêu cầu đặt lịch" | **Không** — một bước (`LH-01` bước 4). Ở lớp 5 là hai UC: `DA1.WEB.03.01.04 Duyệt yêu cầu đặt lịch` và `DA1.WEB.03.01.05 Từ chối yêu cầu đặt lịch` |
| Khách hủy lịch chờ duyệt hoặc đã duyệt; hệ thống trả lượt nếu hủy trước `CH-02` giờ | **Có** — `LH-02 Hủy lịch hẹn`, dù chỉ một bước người và một bước hệ thống cùng request: là nghiệp vụ riêng trong phạm vi BRD, có sự kiện kích hoạt riêng (khách muốn hủy) và kết quả riêng (lịch đã hủy, lượt được trả hoặc không). BRD không tách nghiệp vụ này ra thì nó là một nhánh của `LH-01` — xem "Quy trình ngắn" ở trên |
| Hệ thống nhắc lịch vào giờ `CH-03` hôm trước | **Không** — tác vụ nền `N-01 Nhắc lịch hôm trước`, mục 5: hệ thống tự làm trọn, không bàn giao cho người nào làm tiếp. Nếu nhắc xong còn bước người phải xử lý thì phần đó là quy trình bắt đầu bằng hẹn giờ |
| "Mỗi khách được đặt tối đa `CH-01` lịch hẹn mỗi tuần" | **Không** — quy tắc. Ở lớp 2 là cổng kiểm ở `LH-01` bước 2 cùng điểm kiểm soát Ngăn chặn; lớp 6 cấp `BR-A01` |
| Nhân viên quầy đối chiếu giấy tờ khi khách tới | **Không phải quy trình riêng** — là bước 🟡 6 của `LH-01` nếu không xây chức năng, vì không có bàn giao hay kết quả riêng |
| "Quản lý lịch hẹn" | **Không** — tên nhóm, không có sự kiện kích hoạt, không có kết quả. Muốn gom thì là Phần A |
| Lịch hẹn đi từ Nháp tới Chờ duyệt tới Đã duyệt | **Không** — vòng đời một thực thể, thuộc lớp 4. Quy trình chỉ nêu bước gây chuyển |
| Khách chọn ngày giờ, điền biểu mẫu trên màn hình | **Không** — mô tả giải pháp; thuộc `/ba-detail` và nằm bên trong bước 1 |

## Ranh giới với lớp kề

Mọi ranh giới ở [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md); không viết lại ở đây. Phía lớp 2 của từng dòng:

| Dòng trong `ranh-gioi-cac-lop.md` | Lớp 2 phải làm |
|---|---|
| Mục 2 · **BRD ↔ Quy trình** | Nói ai làm bước nào, theo thứ tự nào. Mục tiêu, vì sao, tiêu chí thành công ở BRD; lớp 2 chỉ dẫn `OBJ-xx`, `BRQ-xx` ở dòng Căn cứ |
| Mục 2 · **Quy trình ↔ Use case** | Chỉ nêu bước và ai làm; **không chép nội dung UC**, không mô tả màn hình, nút. Phép thử: có khoảng chờ, có chuyển giao giữa người thì ở lớp 2 |
| Mục 2 · **Quy trình ↔ BR** | Không phát biểu quy tắc bằng một câu đứng riêng. Câu đúng bất kể bước nào ghi thành `GS-xx` hoặc điểm kiểm soát; lớp 6 cấp mã BR |
| Mục 2 · **BRD mục 4 ↔ Quy trình mục 2 ↔ Lớp 5 tác nhân** | Mục 2 là **nguồn** thao tác và căn cứ phân công. Tên vai người lấy **đúng chữ** BRD mục 4; tên khác trong văn bản pháp luật ghi ở cột Căn cứ, lệch nghĩa thì `Q-P…`. Tác nhân hệ thống, hệ thống ngoài, tác vụ nền do mục 2 đặt tên. Không cấp `ACT-nn`, không phân loại QĐ 671 |
| Mục 2 · **Máy trạng thái ↔ Quy trình** | Không liệt kê vòng đời một thực thể; ghi bước gây chuyển và trạng thái đích bằng tên tiếng Việt |
| Mục 1 · Thuật ngữ chi tiết của domain; `D-xx`; `GS-xx`; `CH-xx`; `N-xx`; điểm kiểm soát | Lớp 2 **sở hữu** các thứ này — định nghĩa ở đây, lớp khác dẫn mã |
| Mục 1 · **Tách nhiệm** | Nguồn là dòng "Tách nhiệm bắt buộc" ở mục 2 và điểm kiểm soát loại Tách nhiệm ở mục 9; nội dung có mã do lớp 6 cấp |
| Mục 2 · **👤 hay ⚙️ cho một chuyển** | Chú rõ bước hệ thống nào chạy cùng request với bước người ngay trước. Lớp 4, 5 gắn bước đó vào bước người và dẫn dải `LH-01 bước 1–3`; bảng bước vẫn ghi tác nhân "Hệ thống" |
| Mục 1 · Tên bảng, tên trường, mã enum | Thuộc ERD. Lớp 2 không đặt tên bảng; cột Thực thể ERD chờ lớp 3 |
| Mục 1 · Màn hình, route, nhãn, câu thông báo, API | Ngoài business layer. Không ghi |

## Nguyên tắc

**1. Quy trình mô tả việc, không mô tả giải pháp.** Không màn hình, nút, route, API, tên bảng, mã trạng thái, câu thông báo — đúng `00_quy_uoc_chung.md` mục 7. Một bước viết "bấm nút Duyệt" là dấu hiệu đang chép UC; thay bằng "nhân viên tiếp đón duyệt yêu cầu".

**2. Không chỉ luồng thuận.** Mỗi cổng có cạnh không đạt; mỗi ngoại lệ thủ công hiện có thành dòng ở bảng biên hoặc bước 🟡. Cách bóc: [`reference/buoc-va-so-do.md`](reference/buoc-va-so-do.md) mục 2. Chưa biết thì `Q-P…`, không bỏ.

**3. Bảng các bước và sơ đồ là một.** Quy tắc đánh số và sửa cùng một lần: [`reference/buoc-va-so-do.md`](reference/buoc-va-so-do.md) mục 4.

**4. Quy tắc không viết thành câu đứng riêng, con số không ghi trần.** Câu đúng bất kể bước → `GS-xx` hoặc điểm kiểm soát; con số cấu hình → `CH-xx`; con số luật định → số kèm biên và điều khoản. Mã `BR-…` do lớp 6 cấp — lớp 2 không bịa.

**5. Ghi để lớp sau nhận được mà không phải đọc lại đầu vào.** Thuật ngữ đủ, chứng từ đủ, tác nhân giữ nguyên chữ, bước đổi trạng thái nêu trạng thái đích bằng tên tiếng Việt. Cách ghi: [`reference/ung-vien-cho-lop-sau.md`](reference/ung-vien-cho-lop-sau.md).

## Mã và tên

Hệ mã chung nằm ở [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4: mỗi mã duy nhất trong tài liệu, không dùng lại sau khi bỏ, mã bỏ ghi ở đầu bảng, mã luôn kèm tên khi người đọc không có tài liệu gốc. Phần riêng lớp 2:

| Mã | Quy ước riêng của lớp 2 |
|---|---|
| `QT-nn` và `{XX}-nn` | `QT-nn` là quy trình **chung**: dùng từ hai domain trở lên, không dính dữ liệu riêng một domain (phê duyệt, gửi thông báo); đặc tả trong **tài liệu quy trình chung**, cùng template. `{XX}-nn` là quy trình **của một domain**: `XX` là chữ viết tắt hai chữ in hoa của domain (`LH` cho lịch hẹn — mã minh họa), `nn` tăng dần. Tài liệu domain chỉ nối vào `QT-nn` bằng nút `[[ ]]`, không chép lại |
| Hậu tố chữ `LH-01B` | Quy trình con. Gốc không hậu tố, con bắt đầu từ `B`. Khi nào tách con, khi nào cấp mã mới: [`reference/buoc-va-so-do.md`](reference/buoc-va-so-do.md) mục 7 |
| Tên quy trình | **Động từ + đối tượng**: *Đặt và duyệt lịch hẹn*; không *Quản lý lịch hẹn* |
| Dẫn một bước, một điểm kiểm soát | Bước: `LH-01 bước 3` (đúng dạng `00_quy_uoc_chung` mục 4), dải bước `LH-01 bước 1–3`; trong sơ đồ là nút `B3`. Điểm kiểm soát: `<mã tài liệu QT> mục 9 điểm n`, ví dụ `QT_DA1_LichHen mục 9 điểm 2` — mục 9 thuộc **tài liệu**, số `#` **không đổi** sau khi phát hành |
| `D-nn`, `GS-nn`, `CH-nn`, `N-nn` | Một dãy riêng mỗi loại, mỗi tài liệu quy trình. Tài liệu quy trình chung và tài liệu domain có hai dãy riêng, nên mã dẫn sang tài liệu kia kèm tên tài liệu |
| `RK-nn` | `00_quy_uoc_chung` mục 4 |
| `TH-nn` (điểm tạm hoãn), `Q-Pnn` (câu hỏi mở) | Theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4 và 3 |
| Phần `A, B, C…` | Chữ cái liên tiếp theo chặng nghiệp vụ |

Tên tác nhân dùng **đúng chữ** ở mục 2 (vai người: đúng chữ BRD mục 4); lớp 5 lấy nguyên. Giá trị liệt kê (trạng thái, loại) viết **tên tiếng Việt**.

## Tìm căn cứ

Thứ tự bốn bước, nơi ghi giả định `GD-xxxx`, câu hỏi `Q-…`, ❓ `[CẦN BA CHỐT]`, ba giá trị đặc biệt và bản chép: [`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md). Không nhắc lại. Riêng lớp 2, **nguồn đặc thù** là:

| Nguồn | Dùng cho | Lưu ý |
|---|---|---|
| **Văn bản pháp luật, quy chế** — điều khoản nghĩa vụ ("phải lập", "trước khi", "trong thời hạn") | Bước, thứ tự, điểm kiểm soát, chứng từ, người làm | Ghi `QC01 Đ5.1` theo `00_quy_uoc_chung` mục 4; viết tắt khai ở mục 1. Cách đọc tín hiệu: `buoc-va-so-do.md` mục 1 |
| **BRD** — `BRQ`, phạm vi trong và ngoài | Quy trình nào phải có; bước nào 🟡 | Cổng ra: mọi `BRQ` có quy trình phủ. Bước 🟡 phải dẫn được nơi BRD loại ra khỏi phạm vi |
| **Khảo sát hiện trạng** — biên bản phỏng vấn, sơ đồ, sổ giấy, bảng tính đang dùng | Bàn giao, khoảng chờ, ngoại lệ thủ công, đường vòng, tần suất | Ghi tên tệp, chỗ cụ thể, **trích nguyên văn**; biên bản họp chỉ làm căn cứ khi có dòng chốt và người chốt. Hiện trạng và văn bản mâu thuẫn: văn bản thắng về nghĩa vụ, ghi `Q-P…` |
| **Mẫu biểu kèm văn bản** — mẫu số, phụ lục | Mục 8.1 | Chứng từ có mẫu dùng đúng mẫu |
| **Dự toán** (danh mục chức năng) | Gợi ý bước "người làm trên hệ thống" | Chỉ gợi ý; không phải căn cứ nghiệp vụ |
| **Số liệu thực** (hồ sơ mẫu, một kỳ chạy thật) | Truy vết ví dụ mục 7, tần suất | Con số kèm nguồn |
| **Tài liệu quy trình chung `QT-nn`** đã có | Chỗ gọi quy trình chung | Dẫn mã kèm tên; không chép lại |

Nghĩa vụ **không** có điều khoản mà dự án vẫn chọn một cách làm thì ghi `D-xx`. AI được tạo dòng `D-xx` ở trạng thái **đề xuất**, kèm ❓ và `Q-P…`; chỉ khi BA ký (**BA chốt dd/mm/yyyy**) thì mới là quyết định đã chốt.

## Review độc lập — bắt buộc

Viết xong, tự soát xong, **luôn** gọi một agent độc lập review tài liệu trước khi chuyển `Chờ review`. Nguyên tắc giao việc và **prompt chung** nằm ở [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md); không chép lại ở đây. Với lớp 2, thay `<số>` bằng 2, `<tên lớp>` bằng Quy trình nghiệp vụ, `<create-xxx>` bằng `create-bp`, `<đường dẫn template>` bằng `2-ba-overview/templates/2-business-process/business_process.md`, và ở nguồn đối chiếu liệt kê BRD, thư mục đầu vào `/ba-init` (văn bản pháp luật, khảo sát hiện trạng), sổ giả định.

Khối `<VIỆC 3 RIÊNG CỦA LỚP>` để dán vào prompt chung, dưới các gạch đầu dòng của việc 3:

```text
   - Bảng bước và sơ đồ: với mỗi quy trình, mọi số bước ở bảng có đúng một nút B{n} ở sơ đồ và ngược
     lại; chỉ năm loại nút không số (bắt đầu, kết thúc, nhánh chặn, kết quả con, giao sang quy trình
     khác); nhãn nút khớp cột Hành động; làn khớp cột Tác nhân.
   - Hạt của bước: bước gộp nhiều tác nhân hoặc nhiều động từ; bước chỉ là thao tác trên màn hình, nút,
     chọn dòng (thuộc UC); bước không có kết quả quan sát được.
   - Luồng không thuận: cổng chỉ có cạnh đạt; điều khoản nghĩa vụ hoặc khảo sát hiện trạng nêu ngoại lệ,
     bàn giao, khoảng chờ, đường vòng thủ công mà quy trình chưa có nhánh, dòng biên hoặc bước 🟡; nút
     Chặn không có dòng ở bảng trường hợp biên.
   - Quy tắc và con số: câu phát biểu quy tắc đứng riêng thay vì GS-xx hoặc điểm kiểm soát; con số cấu
     hình ghi trần thay vì CH-xx; mã BR-… bịa trước khi lớp 6 cấp; GS-xx hoặc điểm kiểm soát chỉ có
     nghĩa trong trình tự.
   - Giải pháp lọt vào: mô tả màn hình, nút, route, API, tên bảng, mã trạng thái, câu thông báo.
   - Tách nhiệm: bước duyệt, phê duyệt mà thiếu điểm kiểm soát Tách nhiệm người lập khác người duyệt;
     cặp việc ở mục 2 không có điểm kiểm soát tương ứng ở Phần A và mục 9.
```

Reviewer không sửa file. Người viết sửa, hoặc ghi lý do không sửa vào phần trả lời cho người dùng; sửa nhiều thì gọi review lại.

---

# Soát trước khi đóng tài liệu quy trình

Cấu trúc và tài liệu:

- [ ] Mọi mục của template có mặt, hoặc có ghi rõ vì sao bỏ (khối dữ liệu trục khi domain không có sổ; nhóm "Phê duyệt và chứng từ" khi không có phê duyệt; mục 5, 5.1 ghi *Không có …* thay vì xóa tiêu đề).
- [ ] Khối giới thiệu có số đếm khớp thân tài liệu (số quy trình, `N-xx`, `CH-xx`); đủ bốn câu hỏi của `00_quy_uoc_chung` mục 3.1, kể cả câu "không chứa gì, nằm ở đâu"; hai dòng giới thiệu mâu thuẫn skill (loại nút không số, loại nguồn của Căn cứ) đã sửa, các dòng còn lại giữ nguyên; đường dẫn ERD ghi `chờ lớp 3`.
- [ ] Đã điền các khối có sẵn của template mà `00_quy_uoc_chung` bắt buộc: câu "không chứa gì" của khối giới thiệu, các dòng của Thông tin tài liệu (`Dự án · Phân hệ`, `Người soạn · Người review · Người duyệt`, `Mức mật`), bảng Phê duyệt (để trống cho người ký), cột Mức ở 11.1, mục 11.2 Điểm tạm hoãn.
- [ ] Mã tài liệu, tên file đúng mục 2 của `00_quy_uoc_chung`; trạng thái không vượt quá `Chờ review`.
- [ ] Đã xóa mọi khối `<!-- HƯỚNG DẪN -->` và chú thích `<!-- -->`.

Từng quy trình:

- [ ] Mỗi thứ trong tài liệu qua bảng "Có phải quy trình không": có sự kiện kích hoạt và kết quả riêng; nghiệp vụ chỉ một bước người cộng một bước hệ thống đã chọn quy trình hay nhánh và ghi lý do. Tên là động từ + đối tượng.
- [ ] Bảng thông tin đủ tám dòng; `Chủ quy trình` là **một** vai trò có ở mục 2 và không phải "Hệ thống"; `Chỉ số theo dõi` có hoặc ghi `—`; dòng Căn cứ khớp với căn cứ trong bảng bước.
- [ ] Mỗi bước một tác nhân, một động từ, một đối tượng; chỗ quyết định in đậm; bước đổi trạng thái nêu trạng thái đích bằng tên tiếng Việt; không từ ngữ giải pháp.
- [ ] Cột Chứng từ ghi **Mẫu số**, *không có mẫu*, hoặc `—`; mọi chứng từ có mặt ở mục 8.
- [ ] Bước 🟡 tô vàng, có căn cứ nghĩa vụ và nơi BRD loại ra phạm vi (hoặc ❓ và `Q-P…`).
- [ ] Sơ đồ khớp bảng: mỗi số bước đúng một nút `B{n}`; năm loại nút không số; nút kết quả con không dùng hình sự kiện (có cạnh ra); mỗi cổng có đủ cạnh; mỗi đường đi tới một nút kết thúc; làn đúng tên tác nhân; `classDef` cho bước 🟡; nhãn ký tự đặc biệt đã đặt trong ngoặc kép.
- [ ] Trường hợp biên: mỗi dòng một tình huống kiểm thử được, một trong bốn kiểu xử lý (kiểu Cho phép có hai dạng); mọi nút Chặn có dòng; mọi cổng có điều kiện số có một dòng đúng biên; ngoại lệ thủ công hiện có đã vào bảng hoặc thành 🟡.
- [ ] Điểm kiểm soát: có chủ ngữ, **phải / không được / chỉ khi**, nơi áp; bước duyệt có điểm Tách nhiệm người lập khác người duyệt.

Mục dùng chung:

- [ ] Thuật ngữ 1.1 đủ cho mọi danh từ nghiệp vụ trong tài liệu; cột Thực thể ERD: `chờ lớp 3` cho thuật ngữ sẽ có bảng, để trống cho khái niệm tính toán; đã ghi vào Version control.
- [ ] Mục 2: tên tác nhân đúng chữ văn bản; có dòng Tách nhiệm; không dùng tên trong bảng bước mà mục 2 không có.
- [ ] Mục 3: bản đồ có đủ mọi quy trình; khối dữ liệu trục chỉ có khi domain có sổ, và nguyên tắc bảo toàn là đẳng thức có tham số.
- [ ] `GS-xx` có công thức hoặc ví dụ số; `D-xx` có chọn gì, vì sao, loại phương án nào; mã đã bỏ ghi ở đầu bảng, không dùng lại; không `D-xx` nào cho điều đã có điều khoản.
- [ ] `N-xx`: đủ tám cột, có khóa chống lặp và điều kiện tự đóng. `CH-xx`: đủ tám cột, mặc định ghi là đề xuất có nguồn; cột Quy trình dẫn khớp chỗ dùng thật; không con số cấu hình ghi trần ở bất kỳ đâu.
- [ ] Mục 7: kịch bản có số cụ thể, phép kiểm đẳng thức cuối khớp nguyên tắc bảo toàn hoặc `GS-xx`.
- [ ] Mục 8: mỗi chứng từ ở bảng bước có đúng một dòng ở 8.1, 8.2 hoặc 8.3; 8.1 có mẫu số; 8.2 có nội dung bắt buộc.
- [ ] Mục 9: là tổng hợp, không có điểm nào chỉ xuất hiện ở đây; mỗi điểm có loại trong bốn loại của template.
- [ ] Mục 10 ghi `chờ lớp 5` ở cả ba ô của dòng duy nhất; không để trống, không ghi `—`.
- [ ] 11.1 có cột Mức đã điền; 11.2 đã điền hoặc ghi *Không có*; 11.3 mỗi dòng có đề xuất mặc định; hết câu mở thì ghi *Không còn câu mở*.

Căn cứ và mã:

- [ ] Mọi bước có kiểm tra, quyết định, ghi sổ hoặc nghĩa vụ đều có căn cứ; không bước nào ghi "theo quy định".
- [ ] Căn cứ đi đúng bốn bước ở `so-cu-va-gia-dinh.md`; con số kèm biên; tài liệu không phải văn bản pháp luật có trích nguyên văn.
- [ ] Mọi `GD-xxxx` trong thân file bôi đỏ đậm gạch chân, có dòng trong sổ, kèm tên. Mọi ❓ có `Q-P…` ở mục 11.3. Không còn `[CẦN BA CHỐT]` khi chuyển `Chờ review`.
- [ ] Không chuyển `Đã duyệt` khi còn ❓, `chưa chốt (`, hoặc giả định chưa chốt — trực tiếp hay kế thừa qua mã đứng trên giả định (`00_quy_uoc_chung.md` mục 12). Đã chạy script kiểm, không còn lỗi Chặn.
- [ ] Không mã `BR-…` bịa; mọi mã dẫn sang tài liệu khác kèm tên ngắn và có thật.
- [ ] Số đếm, tên tác nhân, mã dẫn đã đối chiếu với nguồn (các bản chép ở `so-cu-va-gia-dinh.md` mục 6).

Bàn giao và đóng:

- [ ] Version control ghi những chỗ **chờ lớp sau**: đường dẫn ERD và cột Thực thể ERD (lớp 3), mục 10 (lớp 5), mã BR ở cột Căn cứ (lớp 6).
- [ ] **Đã điền BRD** mục 6.2 (cột `Quy trình`, `Tài liệu chi tiết`) và mục 12 (cột `Quy trình`), và ghi Version control của BRD.
- [ ] **Đã gọi reviewer độc lập** theo `ba-overview/reference/review-doc-lap.md` với khối `<VIỆC 3 RIÊNG CỦA LỚP>` ở trên, và xử lý hết phát hiện hoặc ghi lý do không sửa.
- [ ] Cổng ra của lớp 2 (ở `ba-overview`) đạt: mọi `BRQ` có quy trình phủ hoặc ghi rõ vì sao không; bảng và sơ đồ khớp số bước; thuật ngữ đủ.
