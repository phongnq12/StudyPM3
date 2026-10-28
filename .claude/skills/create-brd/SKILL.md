---
name: create-brd
description: Hướng dẫn viết BRD (Business Requirements Document) — lớp 1 "Why" của business layer — theo template `2-ba-overview/templates/1-brd/brd.md`. Dùng khi cần lập mới, sửa hoặc rà soát BRD, bóc vấn đề nghiệp vụ, mục tiêu OBJ có KPI, yêu cầu nghiệp vụ BRQ, bên liên quan SH, NFR mức nghiệp vụ, ràng buộc/giả định/phụ thuộc CON/ASM/DEP từ bộ tài liệu đầu vào đã được presales xác nhận. Định nghĩa BRQ khác yêu cầu chức năng, UC, business rule ra sao; viết OBJ đo được; soát lại thế nào; bắt buộc gọi reviewer độc lập. Gọi khi người dùng nói "viết BRD", "lập BRD", "lớp 1 Why", "bóc mục tiêu và yêu cầu nghiệp vụ", "viết OBJ BRQ", "rà BRD này giúp tôi", hoặc khi mở một file theo template BRD.
---

# Viết BRD — lớp 1, Why

Template đi kèm: [`2-ba-overview/templates/1-brd/brd.md`](../../../2-ba-overview/templates/1-brd/brd.md)

Phiên bản theo bảng Version control của [`ba-overview`](../ba-overview/SKILL.md).

Mọi mã, tên văn bản và con số trong ví dụ của skill này — `OBJ-01`, `BRQ-01`, `SH-01`, `QC01 Đ5.1`, `DA1` — là **mã minh họa** lấy từ [`vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md), không phải của dự án nào. Không chép sang BRD thật. Mã và tên ngắn chép đúng chuỗi ở bảng mã chuẩn (mục 3 của file đó). Mã ngoài bảng — như `SYS-01` (Hệ thống CRM, lấy từ ví dụ của template) và tên nhóm quy tắc `A — Hạn mức lịch hẹn` — là **mã minh họa riêng của skill**, không trùng nghĩa với mã nào trong bảng.

## Đọc gì, khi nào

File này là **phần lõi** — đọc hết trước khi viết BRD. Phần tra cứu nằm trong `reference/` của skill này và trong `ba-overview`, mở đúng file khi đến đúng việc:

| Khi đang làm | Mở |
|---|---|
| Điền từng mục, từng cột của template, cần bảng "điền gì / viết thế nào / đừng viết" | [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md) |
| Viết hoặc kiểm `OBJ` (SMART, KPI), `BRQ` (một nhu cầu, tiêu chí chấp nhận), `NFR` mức nghiệp vụ | [`reference/muc-tieu-va-yeu-cau.md`](reference/muc-tieu-va-yeu-cau.md) |
| Đặt tên file, khối đầu/cuối, hệ mã, ký hiệu, quy tắc viết theo 29148 | [`2-ba-overview/templates/00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Quy ước chung, cách dẫn mã lớp khác (mục 9), ô điền sau (mục 10) | [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Tìm căn cứ, ghi `Q-B`, ghi `GD-xxxx`, ba giá trị đặc biệt, bản chép và kiểm đồng bộ | [`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) |
| Phân vân một nội dung thuộc BRD hay lớp khác | [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md) |
| Cần ví dụ xuyên suốt | [`ba-overview/reference/vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md) |
| Viết xong, gọi reviewer độc lập | [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md) |

**Thứ bậc khi hai nguồn nói khác nhau:** `00_quy_uoc_chung.md` → template → skill. Trong hai quy ước use case G1, G2 của [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 8, skill này **chỉ áp G2** (mã use case, ở mục 12); G1 là hạt use case của lớp 5. Template đã có đủ các khối `00_quy_uoc_chung` bắt buộc ([`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6); chỗ còn lệch được ghi ở mục "Chỗ template còn lệch" cuối phần lõi.

## Quy trình viết một BRD

1. **Kiểm cổng vào.** BRD là lớp đầu tiên nên cổng vào chỉ có một: bộ đầu ra `/ba-init` đã được presales xác nhận. Chưa có thì dừng, báo người dùng thiếu gì. Không viết BRD từ trí nhớ về "dự án tương tự".
2. **Chép template, rồi đọc hết đầu vào.** Sao thành `BRD_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md` theo `00_quy_uoc_chung` mục 2; không sửa file template. Sau đó mở từng file đầu vào và đọc **toàn văn**; mỗi văn bản pháp luật ghi ngay một dòng vào mục 1.3 với kết luận: sinh yêu cầu (nguồn chính, ghi điều nào), hay *đã rà toàn văn, không sinh yêu cầu* kèm lý do. Làm trước vì mọi `BRQ` có căn cứ pháp lý đều bắt đầu từ đây.
3. **Điền theo thứ tự: 1.1 → 1.2 → 2 → 3 → 4 → 5 → 6 → 7 → 9 → 10 → 11 → 13 → 14 → 15 → 16, rồi khối giới thiệu.** Mục 1.3 đã xong ở bước 2. Điền mục 7 sau khi mục 1, 2, 4 đã đủ, vì mỗi `BRQ` phải trỏ về một `P-xx`/`OBJ-xx` và một `SH-xx` có thật. Mục 6.2, 8, 12 xem "Các chỗ chờ lớp sau" bên dưới. Phê duyệt do người điền, AI không điền. **Khối giới thiệu điền cuối cùng**, vì số đếm `OBJ`, `BRQ`, `SH` chỉ đúng khi thân tài liệu đã đủ.
4. **Tìm căn cứ cho mọi khẳng định nghiệp vụ** — mục tiêu, yêu cầu, phạm vi, bên liên quan, ràng buộc — theo bốn bước của `so-cu-va-gia-dinh.md` mục 2 và nguồn đặc thù ở mục "Tìm căn cứ" dưới đây. Con số `Hiện tại` và `Mục tiêu` của `OBJ` **không bao giờ do AI tự nghĩ ra**.
5. **Tự soát** theo checklist cuối file này.
6. **Gọi reviewer độc lập — bắt buộc**, xem mục "Review độc lập". Sửa theo phát hiện hoặc ghi lý do không sửa; sửa nhiều thì gọi review lại.
7. **Hoàn tất và chuyển `Chờ review`.** Sau khi sửa theo reviewer, đếm lại khối giới thiệu và đối chiếu các bản chép (số đếm, tên ngắn đi kèm mã) với thân tài liệu. **Xóa mọi khối `<!-- HƯỚNG DẪN … -->`** trong file dự án, kể cả các chú thích nhỏ ngay dưới tiêu đề từng mục; chuyển trạng thái `Chờ review`.
8. **Kiểm cổng ra** của `ba-overview` (mọi `OBJ` đo được; mọi `BRQ` có `OBJ` và căn cứ; phạm vi trong/ngoài đã liệt kê; trạng thái ≥ `Chờ review`). Cổng ra chạy **sau** bước 7 vì nó đòi trạng thái `Chờ review`. Chưa đạt thì sửa tiếp, chưa sang lớp 2.

### Các chỗ chờ lớp sau

BRD được viết **trước** quy trình, use case và business rule, nên vài ô lượt đầu chưa điền được. Danh sách ô, lớp và skill chịu trách nhiệm điền nằm ở [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10; cách ghi Version control khi điền ở cuối mục đó. Ô chờ ghi **`chờ lớp n`** (kèm tên nghiệp vụ nếu đã biết), theo [`so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) mục 3 — không dùng ❓, không sinh `Q-B`, không chặn chuyển `Chờ review`. Phía BRD:

| Chỗ | Lượt đầu | Skill điền |
|---|---|---|
| Mục 6.2 cột `Quy trình`, `Tài liệu chi tiết` | `Quy trình`: tên nghiệp vụ dự kiến kèm `chờ lớp 2`, ví dụ `Đặt và duyệt lịch hẹn — chờ lớp 2`. `Tài liệu chi tiết`: `chờ lớp 2` | `create-bp` — thay bằng mã `QT-nn` hoặc `{XX}-nn` (ví dụ `LH-01`) và đường dẫn thật |
| Mục 8 | `Nhóm quy tắc`, `Số quy tắc`, `Tài liệu chi tiết`: `chờ lớp 6`. `Căn cứ chính`: điền ngay, liệt kê các văn bản đã chọn ở mục 1.3 là nguồn quy tắc | `create-br` — nhóm thật, số đếm đúng, đường dẫn file BR |
| Mục 12 | Hai cột đầu `Mục tiêu`, `Yêu cầu nghiệp vụ`: điền ngay từ mục 2 và 7. Ba cột còn lại: `chờ lớp 2`, `chờ lớp 5`, `chờ lớp 6` theo thứ tự `Quy trình`, `Use case`, `Business rule` | Cột `Quy trình`: `create-bp`. Cột `Use case`: `create-ucl`. Cột `Business rule`: `create-br`. Sau khi đủ, mỗi `BRQ` phải xuống được ít nhất một quy trình, business rule hoặc use case |
| Mục 9, dòng về dữ liệu nhạy cảm | Ô có nội dung ngay: viết NFR bảo mật theo đầu vào, **không** ghi `chờ lớp 3` | `create-erd` — đối chiếu ERD mục 9, thêm hoặc sửa NFR bảo mật nếu thiếu |

---

## BRD là gì

**BRD là tài liệu trả lời hai câu hỏi trước mọi câu hỏi khác: tổ chức cần giải pháp này để làm gì, và nhu cầu nghiệp vụ nào buộc giải pháp phải đáp ứng.** Nó nằm ở đầu chuỗi: mọi quy trình, thực thể, trạng thái, use case, business rule phía sau phải trả lời được "phục vụ mục tiêu nào" bằng một mã `OBJ-xx` hoặc `BRQ-xx` của BRD. BRD cố ý **không** nói hệ thống làm thế nào: không màn hình, nút, API, bảng dữ liệu (`00_quy_uoc_chung` mục 7).

Nguồn chuẩn và chỗ của chúng trong template:

| Chuẩn | Nội dung chuẩn đóng góp | Nằm ở mục nào của template |
|---|---|---|
| Vision & Scope Document (Wiegers) | Bối cảnh, mục tiêu đo được, phạm vi trong và ngoài, ràng buộc | Mục 1, 2, 3, 10 |
| Business Motivation Model (OMG BMM) | Tầm nhìn, mục tiêu, phương tiện; yếu tố tác động (Influencers) như luật; và **Directives** — business policy, business rule. Cách ánh xạ là **lựa chọn của skill**, template không nói: "yếu tố tác động" thành mục 1.3, "mục tiêu" thành mục 2, Directives thành mục 8 (BRD chỉ đếm nhóm quy tắc, nội dung ở lớp 6) | Mục 1.3, 2, 8 |
| Business Requirements (BABOK v3) | Nhu cầu cấp tổ chức, vì sao cần giải pháp | Mục 1, 2, 7 |
| ISO/IEC/IEEE 29148 mục 9.3 | Business Requirements Specification: mục đích (9.3.2), phạm vi (9.3.3). Số mục của phần chính sách và quy tắc vận hành chưa đối chiếu được — xem "Chỗ template còn lệch", dòng 6 | Mục 1, 3, 8 |
| BABOK 6.1 · 6.2 | Phân tích hiện trạng · xác định trạng thái tương lai | Mục 1 (và 6.1) · mục 2 (và 6.2) |
| BABOK 3.2 Plan Stakeholder Engagement · kỹ thuật 10.43 Stakeholder List, Map, or Personas | Lập kế hoạch làm việc với bên liên quan · danh sách và bản đồ bên liên quan | Mục 4 |
| BABOK 2.3 (phân loại yêu cầu) | Transition requirements là một loại yêu cầu: dữ liệu cũ, đào tạo, chạy song song | Mục 11 |
| ISO/IEC 25010:2023 | Nhóm đặc tính chất lượng cho yêu cầu phi chức năng | Mục 9 |

Các chuẩn dùng thuật ngữ không khớp nhau: "business requirement" của Wiegers và BABOK là phần **mục tiêu** (`OBJ` ở đây), còn `BRQ` của template là một nhu cầu nghiệp vụ cụ thể hơn, đứng giữa mục tiêu và quy trình. Đây là cách gọi của dự án; đừng tranh luận dựa trên sách.

Từ định nghĩa rút ra năm tính chất. Phân vân một đoạn có đúng là BRD không, hoặc một BRD đang viết có đúng không, quay về bảng này:

| Tính chất | Nghĩa là | Thể hiện ở |
|---|---|---|
| **Nói vì sao, không nói thế nào** | Mọi câu giải thích tổ chức cần đạt gì hoặc phải đáp ứng điều gì. Câu nào nêu màn hình, nút, API, bảng dữ liệu là lấn sang giải pháp | Cả tài liệu; kiểm bằng phép thử "bỏ phần mềm đi, câu còn nghĩa không" |
| **Đo được** | Mục tiêu có số hiện tại, số đích, hạn; yêu cầu có tiêu chí chấp nhận viết được testcase đạt/không đạt | Mục 2 cột `Hiện tại`, `Mục tiêu`, `Thời hạn`; mục 7 cột `Tiêu chí chấp nhận` |
| **Có chuỗi lý do liền mạch** | Vấn đề `P-xx` → mục tiêu `OBJ-xx` → yêu cầu `BRQ-xx` → (sau này) quy trình, quy tắc, use case. Đứt một mắt là có thứ thừa hoặc thiếu | Mục 2 cột `Vấn đề giải quyết`; mục 7 cột `Mục tiêu`; mục 12 |
| **Có căn cứ** | Mỗi khẳng định nghiệp vụ dẫn được tới văn bản, tài liệu khách hàng, `GD-xxxx`, hoặc ❓ kèm `Q-B` | Cột `Căn cứ` và các ô `— <nguồn>` |
| **Bao cả bên không thao tác** | Người duyệt ngân sách, cơ quan quản lý, bên bị ảnh hưởng đều có mặt, dù không bấm gì trên hệ thống | Mục 4 |

## Có phải BRD không

Ví dụ lấy từ thế giới `QC01` của `vi-du-xuyen-suot.md` (mã minh họa). Cột phải là nơi đúng của câu đó.

| Câu trong tài liệu | Có phải nội dung BRD không | Vì sao, nằm ở đâu |
|---|---|---|
| "Khách phải tới trung tâm xếp hàng để đăng ký, trung bình mất nửa ngày" | **Có** — mục 1.2 | Là vấn đề, có hệ quả đo được, không nêu cách giải |
| "Chưa có phần mềm đặt lịch" | **Không** | Là giải pháp viết ngược thành vấn đề. Hỏi tiếp: thiếu phần mềm thì *hậu quả nghiệp vụ* gì |
| "Tỷ lệ lịch hẹn đặt trực tuyến tăng từ 0% lên 90% sau 3 tháng vận hành" | **Có** — `OBJ-01`, mục 2 | Có giá trị hiện tại, số đích và hạn. Chữ "trực tuyến" là kênh nghiệp vụ, chưa phải màn hình |
| "Nâng cao trải nghiệm của khách" | **Không** | Không có số hiện tại, số đích, hạn; không ai kiểm được |
| "Trung tâm phải xét duyệt hoặc từ chối mọi yêu cầu đặt lịch trước ngày hẹn — `QC01 Đ6.1`" | **Có** — `BRQ-01`, mục 7 | Một nhu cầu, chủ ngữ là trung tâm, bỏ phần mềm đi vẫn đúng |
| "Màn hình đặt lịch có nút Gửi yêu cầu" | **Không** | Là giải pháp. Thuộc prototype ở `/ba-detail` |
| "Mỗi khách chỉ đặt tối đa 2 lịch hẹn mỗi tuần" | **Không** — thuộc lớp 6 | Phát biểu một quy tắc. BRD chỉ có `BRQ` về nghĩa vụ tuân thủ, trỏ `QC01 Đ5.1`, và **đếm** nhóm ở mục 8 |
| "Nhân viên tiếp đón lập phiếu hẹn, Giám đốc trung tâm ký" | **Không** — thuộc lớp 2 | Nói ai làm bước nào. BRD mục 6.2 chỉ nêu *quy trình nào thay đổi* và trỏ sang |
| "Giám đốc trung tâm là người duyệt ngân sách dự án, không dùng hệ thống" | **Có** — mục 4 | Bên liên quan không thao tác, vẫn là một dòng `SH` |
| "Hệ thống kiểm còn lượt trong tuần" | **Không** | Là bước của quy trình hoặc chức năng, không phải nhu cầu tổ chức |
| "Dữ liệu khách chỉ nhân viên tiếp đón được phân công xem" | **Có** — `NFR` mục 9 | Phi chức năng mức nghiệp vụ, chưa có con số kỹ thuật |

## Vấn đề và giải pháp

Mục 1 nêu **vấn đề**, mục 7 nêu **nhu cầu**, và không mục nào nêu **giải pháp**. Một vấn đề là một thực tế đang gây hại, quan sát được, tồn tại dù có hay không có phần mềm. Giải pháp là một cách xử lý được chọn. Ba phép thử, dùng cho mọi `P-xx` và `BRQ-xx`:

| Phép thử | Đạt khi | Dấu hiệu viết nhầm giải pháp thành vấn đề |
|---|---|---|
| **Bỏ phần mềm đi** | Câu vẫn có nghĩa với một trung tâm chỉ dùng sổ giấy | "Chưa có hệ thống…", "cần một cổng thông tin…", "thiếu chức năng…" |
| **Có hậu quả đo được** | Điền được cột `Hệ quả nếu không giải quyết` bằng thời gian, chi phí, sai sót, vi phạm | Hệ quả là "không hiện đại", "kém hiệu quả" |
| **Có bằng chứng** | Cột `Bằng chứng` chỉ tới số liệu, khảo sát, feedback có thật | Bằng chứng là chính câu phát biểu, hoặc "theo kinh nghiệm" |

## Yêu cầu nghiệp vụ (BRQ) là gì

**Yêu cầu nghiệp vụ là một nhu cầu cụ thể của tổ chức mà giải pháp bắt buộc phải đáp ứng để đạt một mục tiêu, phát biểu bằng ngôn ngữ nghiệp vụ và kiểm chứng được ở kết quả nghiệp vụ.** Nó là cầu nối: phía trên là `OBJ` (đạt cái gì), phía dưới là quy trình, quy tắc và use case (làm thế nào). Phát biểu cách `00_quy_uoc_chung` mục 7: chủ ngữ là tổ chức hoặc tác nhân nghiệp vụ, dùng **phải · không được · chỉ khi**.

Bảng phân biệt `BRQ` với bốn thứ hay bị lẫn. Cột cuối là phép thử nhanh nhất:

| Thứ | Câu mẫu (mã minh họa) | Nằm ở | Phép thử |
|---|---|---|---|
| Mục tiêu `OBJ` | "Tỷ lệ lịch hẹn đặt trực tuyến tăng từ 0% lên 90% sau 3 tháng vận hành" — `OBJ-01` | BRD mục 2 | Có giá trị hiện tại, số đích và hạn, đo bằng KPI |
| **Yêu cầu nghiệp vụ `BRQ`** | "Trung tâm phải xét duyệt hoặc từ chối mọi yêu cầu đặt lịch trước ngày hẹn" — `BRQ-01`, `QC01 Đ6.1` | BRD mục 7 | **Bỏ phần mềm đi vẫn đúng.** Chủ ngữ là trung tâm; một nhu cầu (hai kết quả của cùng một việc xét duyệt) |
| Yêu cầu chức năng | "Hệ thống cho phép nhân viên tiếp đón duyệt hoặc từ chối yêu cầu kèm lý do" | SRS, `/ba-detail` | Chủ ngữ là hệ thống; mô tả hành vi phần mềm |
| Use case | "Duyệt yêu cầu đặt lịch" | Lớp 5 | Một thao tác, một tác nhân, một quyền |
| Business rule | "Mỗi khách chỉ được đặt tối đa `CH-01` lịch hẹn mỗi tuần" — `BR-A01` | Lớp 6 | Đúng ở mọi bước, phát biểu một ràng buộc, có điều khoản; BRQ không lặp lại nội dung |

Hệ quả khi viết: một `BRQ` thường sinh **vài** quy trình, quy tắc, use case, nhưng không bao giờ được viết như một trong số đó. `BRQ` về nghĩa vụ tuân thủ (ví dụ "Trung tâm không được cho đặt lịch vượt hạn mức quy chế") nêu **nghĩa vụ** và dẫn điều khoản; con số hạn mức thuộc business rule. Cách viết từng cột, bảng "viết thế này / đừng viết thế này": [`reference/muc-tieu-va-yeu-cau.md`](reference/muc-tieu-va-yeu-cau.md).

## Bên liên quan và tác nhân

**Bên liên quan (`SH`) là mọi người hoặc tổ chức có lợi ích trong dự án hoặc bị nó ảnh hưởng. Tác nhân người là phần của họ trực tiếp thao tác trên hệ thống.** Với tác nhân **người**, hai tập lồng nhau: bên liên quan ⊇ tác nhân người. Tác nhân hệ thống (tác vụ nền) và hệ thống ngoài thì không nằm trong `SH`: hệ thống ngoài ghi ở mục 3.2, tác nhân hệ thống do Quy trình mục 2 đặt tên. BRD đặt **tên vai** của tác nhân người ở mục 4 trước; Quy trình mục 2 giữ đúng chữ, lớp 5 giữ đúng chữ khi cấp `ACT-nn` (`00_quy_uoc_chung.md` mục 9). Giám đốc trung tâm (`SH-01`) duyệt ngân sách dự án, không thao tác hệ thống, và cơ quan quản lý cấp trên nhận báo cáo định kỳ là bên liên quan nhưng không phải tác nhân. Nhân viên tiếp đón (`SH-02`) và Khách (`SH-03`) là cả hai. Hệ quả thực tế:

| Việc | Cách làm |
|---|---|
| Liệt kê | BRD liệt kê **cả hai nhóm**. Dòng nào có vai trò `Dùng` là ứng viên tác nhân người; lớp 5 lấy các dòng đó, cấp `ACT-nn` và phân loại. Dòng chỉ có `Duyệt`, `Tư vấn`, `Được thông báo` không thành tác nhân. Việc coi `Dùng` là dấu hiệu ứng viên là **lựa chọn của skill** |
| Bỏ sót | Bên không thao tác là bên hay bị quên nhất, vì họ không xuất hiện trong quy trình. Soi lại ba nơi: người ký hợp đồng và duyệt ngân sách, cơ quan ban hành văn bản ở mục 1.3, bên nhận báo cáo hoặc dữ liệu từ hệ thống |
| Phân tích **ảnh hưởng × mức quan tâm** | Mỗi `SH` chấm hai cột; tổ hợp quyết định cách làm việc với họ (bảng dưới). Chấm dựa trên bằng chứng, không dựa trên chức danh |
| RACI | Mục 4.1 là RACI cho **sản phẩm tài liệu** (ai chốt phạm vi, ai chốt quy tắc), không phải RACI vận hành của hệ thống |

| Ảnh hưởng | Mức quan tâm | Cách làm việc |
|---|---|---|
| Cao | Cao | Làm việc chặt: mời chốt từng quyết định lớn, thường là người ở cột `A` của RACI |
| Cao | Thấp | Giữ hài lòng: báo kết quả chính, hỏi trước khi chốt điều chạm tới họ; hay là người duyệt ngân sách, cơ quan quản lý |
| Thấp | Cao | Cung cấp thông tin đều, lấy góp ý; thường là người dùng cuối |
| Thấp | Thấp | Theo dõi, không tốn công |

Lưới trên là lưới quyền lực × lợi ích của Mendelow (1991) — `Ảnh hưởng` ứng với quyền lực, `Mức quan tâm` ứng với lợi ích — chỉ có hai mức mỗi trục. Template cho chấm ba mức `Cao · Trung bình · Thấp`, nên cách xử lý `Trung bình` là **lựa chọn của skill**: quy về `Cao` khi chọn cách làm việc, để không bỏ sót; dòng nào muốn làm nhẹ hơn thì ghi lý do ở cột `Quan tâm chính`. Nhiều dòng `Trung bình` là dấu hiệu chấm chưa dựa trên bằng chứng.

## Ranh giới với lớp kề

Mọi ranh giới ghi ở [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md); không viết lại phiên bản khác ở đây. Phía của BRD, ở các dòng sau:

| Dòng trong `ranh-gioi-cac-lop.md` | BRD làm gì |
|---|---|
| Mục 1: "Vấn đề, mục tiêu đo được, phạm vi trong/ngoài, bên liên quan" | BRD **sở hữu**; lớp khác dẫn `OBJ-xx`, `BRQ-xx`, `SH-xx` |
| Mục 1: "Yêu cầu phi chức năng mức nghiệp vụ" · "Thuật ngữ cấp tổ chức" | BRD **sở hữu** ở mục 9 và mục 5. Con số kỹ thuật của NFR do SRS chi tiết hóa |
| Mục 2: cặp **BRD ↔ Quy trình** | BRD nêu tổ chức cần đạt gì, vì sao. Không nêu ai làm bước nào, thứ tự nào; mục 6.2 chỉ nêu quy trình nào thay đổi và trỏ sang |
| Mục 2: cặp **BRD mục 8 ↔ BR** | Mục 8 chỉ **đếm** nhóm quy tắc và trỏ file; không phát biểu nội dung quy tắc |
| Mục 3: dòng "1 BRD" | Nhận đầu ra `/ba-init`. Giao `OBJ`, `BRQ` cho lớp 2 · `SH` cho lớp 5 · NFR cho SRS · nhóm quy tắc cho lớp 6 |
| Mục 1: dòng "**Tên vai** của tác nhân người" | BRD **sở hữu** ở mục 4 cột `Bên liên quan`, đặt trước; Quy trình mục 2 và lớp 5 giữ đúng chữ, lệch thì hỏi chứ không tự đổi (`ranh-gioi-cac-lop.md` mục 2, cặp BRD mục 4 ↔ Quy trình mục 2 ↔ Lớp 5) |
| Mục 1: dòng "**Tách nhiệm**" | BRD không liệt kê cặp thao tác không được cùng một người; nguồn là Quy trình mục 2 và 9, nội dung có mã là BR. Điều khoản đòi tách nhiệm (ví dụ `QC01 Đ6.3 Người đặt hộ không tự duyệt`) thì BRD chỉ có `BRQ` nêu nghĩa vụ và dẫn điều — **lựa chọn của skill**, cùng cách với `BRQ` về hạn mức. Cặp 👤/⚙️ của chuyển trạng thái không thuộc BRD |

## Nguyên tắc

**1. Mỗi dòng trong chuỗi P → OBJ → BRQ phải nối được hai đầu.** `P-xx` không có `OBJ` nào giải quyết thì vấn đề bị bỏ quên hoặc không đáng giải. `OBJ-xx` không có `P-xx` thì mục tiêu treo. `BRQ-xx` không gắn `OBJ-xx` thì là yêu cầu thừa hoặc thiếu mục tiêu. Mỗi mối nối là một ô trong template; đừng để trống.

**2. Mọi con số do khách hoặc tài liệu cho, AI không bịa.** `Hiện tại` và `Mục tiêu` của `OBJ`, quy mô ở mục 1.1, thời hạn của `CON` đều lấy từ đầu vào, kèm nguồn. Không có thì `chưa chốt (<ai>)` và một `Q-B` có đề xuất mặc định. Con số do AI đề xuất không nguồn ghi `[CẦN BA CHỐT] đề xuất 90%`, tuyệt đối không viết như sự thật.

**3. Đã rà văn bản nào, ghi văn bản đó.** Văn bản pháp luật không sinh yêu cầu vẫn có dòng ở mục 1.3 với kết luận và lý do. Đây là ghi chép chống rà lại, đồng thời là bằng chứng bước 2 của quy trình đã làm.

**4. Không giải pháp, kể cả khi khách đưa sẵn.** Đầu vào thường chứa câu kiểu "hệ thống phải có màn hình X". Tách ra: nhu cầu nghiệp vụ nằm sau câu đó (trung tâm cần làm gì) vào `BRQ`; phần màn hình giữ lại làm ghi chú trao cho `/ba-detail`, không vào BRD. Nếu khách bắt buộc một giải pháp (hạ tầng, nền tảng cố định) thì nó là `CON`, không phải `BRQ`.

**5. Một chuỗi mã, một chủ sở hữu.** BRD sở hữu `OBJ`, `BRQ`, `SH`, `NFR`, `RK`, `Q-B`. Quy trình, quy tắc, use case chỉ dẫn các mã này kèm tên ngắn, không chép lại nội dung. Khi lệch, BRD thắng về mục tiêu, phạm vi, tiêu chí thành công (`00_quy_uoc_chung` mục 1).

## Mã và tên

Quy tắc chung — mã duy nhất trong tài liệu, không dùng lại, mã bỏ ghi ở đầu bảng và đánh ⊘, mã luôn đi kèm tên ngắn, ghi căn cứ pháp lý dạng `TT01 Đ5.2.a` — theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4 và [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 9. Chỉ phần riêng của BRD:

| Mã | Đối tượng | Quy ước riêng |
|---|---|---|
| `P-nn` | Vấn đề hoặc cơ hội, mục 1.2 | Có trong template, không có trong bảng mã của `00_quy_uoc_chung`. Duy nhất trong BRD. Lớp khác dẫn thì ghi `BRD P-01` — **lựa chọn của skill**, vì `00_quy_uoc_chung.md` chưa có dạng dẫn cho `P-nn` |
| `OBJ-nn` | Mục tiêu nghiệp vụ | Một `OBJ` một KPI — **lựa chọn của skill** (template chỉ có một cột KPI). Tên ngắn khi dẫn: phần đầu của câu mục tiêu, bỏ định lượng — **lựa chọn của skill** |
| `BRQ-nn` | Yêu cầu nghiệp vụ | Tên ngắn khi dẫn sang lớp khác là **rút gọn của chính câu yêu cầu** ở mục 7, cùng cách rút ở mọi lớp; lệch thì câu ở mục 7 thắng — **lựa chọn của skill** |
| `SH-nn` | Bên liên quan | Gắn với tên bên liên quan ở mục 4. Lớp 5 sẽ cấp `ACT-nn` riêng cho tác nhân, không đổi `SH-nn`. Tác nhân hệ thống và hệ thống ngoài không có `SH-nn` |
| `NFR-nn` | Yêu cầu phi chức năng mức nghiệp vụ | Một mã một yêu cầu, kể cả khi cùng nhóm ISO 25010 |
| `CON-nn` · `ASM-nn` · `DEP-nn` | Ràng buộc · giả định · phụ thuộc, mục 10 | Đánh số riêng từng loại. **`ASM-nn` không phải `GD-xxxx`**: xem mục "Tìm căn cứ" |
| `RK-nn` | Rủi ro còn lại | Mục 13 |
| `Q-Bnn` | Câu hỏi cần chốt | Tiền tố cố định `Q-B`, lấy từ template (`Q-B01`) — theo `00_quy_uoc_chung.md` mục 4 |
| `TH-nn` | Điểm tạm hoãn, mục 15 | Mã bộ skill đã chốt (`00_quy_uoc_chung.md` mục 6). Mục 15 có sẵn trong template |
| `QT-nn` hoặc `{XX}-nn` | Mã quy trình, **do lớp 2 cấp** | BRD chỉ dẫn, không cấp mã. Mã theo domain dạng `{XX}-nn`, ví dụ `LH-01` (`00_quy_uoc_chung` mục 4). Chưa có thì `chờ lớp 2`, không bịa mã |

Tên file: `BRD_{MÃ DỰ ÁN}_{PHẠM VI}_v{NN}.md`, ví dụ `BRD_DA1_LichHen_v00.md` (mã minh họa). Trạng thái dùng bốn giá trị của `00_quy_uoc_chung` mục 3.2: `Nháp · Chờ review · Đã duyệt · Hết hiệu lực`.

## Tìm căn cứ

Cách tìm bốn bước, ba giá trị đặc biệt, câu hỏi `Q-B` và giả định `GD-xxxx`, bản chép và kiểm đồng bộ: [`so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md). BRD là lớp đầu nên bước 1 của bốn bước (lớp đã có) hầu như bỏ trống — nguồn thật nằm ở bước 2. Nguồn đặc thù của BRD, theo từng việc:

| Cần căn cứ cho | Tìm ở đầu vào nào | Lưu ý |
|---|---|---|
| Mục 1.3, và mọi `BRQ` về tuân thủ | Văn bản pháp luật, quy chế, quy định nội bộ của khách | Rà **toàn văn** từng văn bản, không rà theo từ khóa. Ghi `{viết tắt} Đ{điều}.{khoản}.{điểm}`, viết tắt khai ở mục 16. Văn bản đã bị thay thế hoặc sửa đổi: ghi ở cột `Hiệu lực` |
| Mục 1.1, 1.2 và `Hiện tại` của `OBJ` | Khảo sát, số liệu vận hành, feedback khách hàng, báo cáo hiện trạng | Trích **nguyên văn** câu hay số tìm được, kèm tên file và chỗ cụ thể (sheet, dòng, mục). Số có nhiều phiên bản thì dùng bản mới nhất và nêu ngày đo |
| `Mục tiêu` và `Thời hạn` của `OBJ`, `CON` về thời hạn, ngân sách | Hợp đồng, dự toán, biên bản họp **có dòng chốt và người chốt** | Biên bản không có dòng chốt không làm căn cứ. Không có ở đâu: `Q-B` với đề xuất mặc định |
| Mục 3 phạm vi trong/ngoài, `Giai đoạn` | Dự toán, hợp đồng, phụ lục phạm vi | Mục "ngoài phạm vi" phải ghi được nơi xử lý thay thế; không biết thì `chưa chốt (<ai>)` |
| Mục 4 bên liên quan | Hợp đồng (bên ký), văn bản mục 1.3 (cơ quan quản lý), biên bản khảo sát (người dùng) | Nguồn ghi ở cột `Quan tâm chính` hoặc cuối ô, vì template không có cột căn cứ riêng |
| Mục 6.1 hiện trạng | Mô tả hiện trạng, mẫu chứng từ giấy, biên bản khảo sát | Mô tả tóm tắt; bước chi tiết của cách làm cũ thuộc lớp 2 |
| Mục 3.2 hệ thống liên quan | Tài liệu tích hợp, thỏa thuận chia sẻ dữ liệu, phụ lục hợp đồng | Cột `Nguồn sự thật của` phải có nguồn; không đoán |

**`ASM-nn` của BRD và `GD-xxxx` của sổ.** Hai thứ hay bị coi là một. Theo `so-cu-va-gia-dinh.md` mục 4, `GD-xxxx` là **câu trả lời tạm** mà các lớp đang dựa vào để đi tiếp, chỉ người được tạo. `ASM-nn` là một **mục của BRD**, ghi một điều kiện bên ngoài mà dự án coi là đúng. Quy tắc: Cách chia bốn tình huống dưới đây là **lựa chọn của skill**; template và `00_quy_uoc_chung` không nói về `ASM-nn`.

| Tình huống | Ghi thế nào |
|---|---|
| Điều coi là đúng **đã có nguồn** (văn bản, biên bản có dòng chốt, tài liệu tích hợp) | Chỉ là `ASM-nn`; ghi nguồn cuối ô `Nội dung` dạng `— <nguồn>`. **Không** tạo `GD-xxxx` |
| Điều coi là đúng **chưa có nguồn**, và BRD hoặc lớp sau đang dựa vào | Bản thân nó là một giả định tạm: người viết ghi một dòng vào sổ `GD-xxxx`, `ASM-nn` dẫn `GD-xxxx` bôi đỏ đậm gạch chân. AI thì ghi `[CẦN BA CHỐT] <phát biểu>` vào ô và một dòng `Q-B`, **không** tự cấp `GD-xxxx` |
| Một điều chưa ai trả lời và chưa có gì dựa vào | Là câu hỏi `Q-B`, **không** phải `ASM-nn` |
| Có người chịu trách nhiệm và có hạn (bên khác phải giao một thứ vào một ngày) | Là `DEP-nn`, không phải `ASM-nn` |

Không để một điều mang hai mã mà không dẫn nhau; cũng không để `ASM-nn` trần mà không có nguồn lẫn `GD-xxxx`.

## Review độc lập

Dùng prompt chung ở [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md): thay `<số>` bằng `1`, `<tên lớp>` bằng `BRD`, `<create-xxx>` bằng `create-brd`, đường dẫn template là `2-ba-overview/templates/1-brd/brd.md`. Chỉ đưa đường dẫn, không đưa lập luận của người viết; reviewer không sửa file.

Khối `<VIỆC 3 RIÊNG CỦA LỚP>` của BRD — dán nguyên vào cuối việc 3:

```text
   Riêng lớp 1 BRD, tìm thêm:
   - BRQ nào đang mô tả giải pháp (màn hình, nút, API, bảng dữ liệu, "hệ thống cho phép…") thay vì nhu
     cầu nghiệp vụ; dùng phép thử "bỏ phần mềm đi, câu còn nghĩa không".
   - OBJ nào không đo được: thiếu KPI, thiếu số hiện tại, số đích hoặc hạn; hoặc số hiện tại được ghi
     không có nguồn đo; OBJ không đạt SMART.
   - BRQ không gắn OBJ, không có căn cứ, hoặc có tiêu chí chấp nhận không viết được testcase đạt/không
     đạt; BRQ gộp hai nhu cầu có tiêu chí khác nhau.
   - Văn bản pháp luật, quy chế trong đầu vào /ba-init chưa được rà: mở từng văn bản, kiểm mục 1.3 có
     dòng cho nó với kết luận sinh yêu cầu hoặc "đã rà toàn văn, không sinh yêu cầu" kèm lý do; kiểm điều
     khoản có nghĩa vụ mà không có BRQ nào phủ.
   - Bên liên quan không thao tác hệ thống bị bỏ sót: người duyệt ngân sách, cơ quan ban hành văn bản,
     bên nhận báo cáo hoặc dữ liệu, bên ký hợp đồng, bên sở hữu hệ thống liên quan ở mục 3.2.
   - ASM trần không nguồn không có GD hoặc [CẦN BA CHỐT]; ASM trùng với một GD mà không dẫn nhau.
```

## Soát trước khi đóng một BRD

Cấu trúc và định dạng:

- [ ] Mọi mục của template có mặt, hoặc ghi rõ vì sao bỏ; không còn `{{...}}`; dòng ví dụ in nghiêng của template đã thay bằng nội dung dự án.
- [ ] Khối giới thiệu trả lời đủ bốn câu của `00_quy_uoc_chung` mục 3.1 (chứa gì có số đếm, dựng từ đâu, đọc thế nào, không chứa gì); số đếm `OBJ`, `BRQ`, `SH` khớp thân tài liệu.
- [ ] Đã điền các dòng Thông tin tài liệu của template (kể cả `Dự án · Phân hệ`, `Người soạn · Người review · Người duyệt`, `Mức mật`); Version control (YYYY-MM-DD, dòng hiện tại tô xanh); bảng Phê duyệt giữ đủ dòng của template, ô họ tên/ngày/ý kiến để trống cho người ký.
- [ ] Mã không trùng, không dùng lại; mã bỏ đánh ⊘ và ghi ở đầu bảng. Mọi chỗ dẫn mã sang lớp khác kèm tên ngắn.
- [ ] Đã xóa hết khối `<!-- HƯỚNG DẪN -->`.

Mục tiêu và yêu cầu:

- [ ] Mọi `OBJ` có KPI (cách đo), `Hiện tại`, `Mục tiêu`, `Thời hạn` — không ô nào trống; ô chưa biết ghi `chưa chốt (<ai>)` kèm `Q-B`, không ghi `n/a`; nhưng còn ô như vậy thì `OBJ` chưa đo được và chưa qua cổng ra (xem `muc-tieu-va-yeu-cau.md`).
- [ ] Mọi `OBJ` có ít nhất một `P-xx`; mọi `P-xx` có `OBJ` giải quyết hoặc lý do không giải quyết.
- [ ] Mọi `BRQ` có đủ lý do, đúng một `OBJ` (nếu phục vụ hai mục tiêu thì tách hoặc chọn mục tiêu chính), căn cứ, ưu tiên MoSCoW, tiêu chí chấp nhận kiểm chứng được, bên đề xuất là một `SH` có thật.
- [ ] Không `BRQ` nào mô tả màn hình, nút, API, bảng dữ liệu; mỗi `BRQ` qua phép thử "bỏ phần mềm đi".
- [ ] Mọi `BRQ` ưu tiên `W` khớp một dòng "ngoài phạm vi" hoặc giai đoạn sau ở mục 3.
- [ ] `NFR` ở mức nghiệp vụ, không có con số kỹ thuật (thời gian phản hồi, thuật toán, dung lượng); nhóm ISO 25010 đúng; nhóm nào không có yêu cầu thì `Yêu cầu` ghi `n/a` kèm lý do, `Ưu tiên` ghi `n/a` (xem `muc-tieu-va-yeu-cau.md`).

Phạm vi, bên liên quan, hệ thống:

- [ ] Mọi văn bản pháp luật trong đầu vào đều có dòng ở mục 1.3 với kết luận rà soát.
- [ ] Mỗi dòng "ngoài phạm vi" có lý do và nơi xử lý thay thế.
- [ ] Sơ đồ ngữ cảnh chứa mọi tác nhân thao tác và mọi hệ thống ở mục 3.2; nhãn mũi tên là luồng thông tin nghiệp vụ (mũi tên từ hệ thống ngoài có thể là tên sự kiện nghiệp vụ), không phải tên API.
- [ ] Mục 4 có cả bên không thao tác (người duyệt ngân sách, cơ quan quản lý); mỗi dòng có đủ ảnh hưởng, mức quan tâm, vai trò. Dòng `Đại diện khách hàng — người tài trợ dự án` và `Product owner` ở Phê duyệt là một `SH` có vai trò `Duyệt` — các dòng `BA soạn` và `Tech lead` là đội dự án, không phải `SH`.
- [ ] RACI: mỗi hàng đúng một `A` và ít nhất một `R`; `A` là người có thẩm quyền chốt, không phải AI.
- [ ] Mục 3.2 có `Nguồn sự thật của` cho mọi hệ thống ngoài, và không hai hệ thống cùng là nguồn sự thật của một dữ liệu.

Căn cứ và trạng thái:

- [ ] Mọi khẳng định nghiệp vụ có căn cứ thật, `GD-xxxx`, hoặc ❓ kèm `Q-B`; `GD-xxxx` trong thân bôi đỏ đậm gạch chân và có dòng trong sổ.
- [ ] Mỗi `ASM-nn` có nguồn hoặc `GD-xxxx`; không `ASM-nn` nào là câu hỏi chưa ai trả lời.
- [ ] Mọi con số có nguồn, ghi kèm biên; không có con số nào do AI tự nghĩ ra.
- [ ] Ô chờ lớp sau ở mục 6.2, 8, 12 ghi `chờ lớp n`, không ❓, không sinh `Q-B`; ô đã được lớp sau điền thì Version control đã ghi (`00_quy_uoc_chung.md` mục 10).
- [ ] Đã điền mục 13, 14, 15 (Điểm tạm hoãn): khối trống ghi *Không có* hoặc *Không còn câu mở*; viết tắt văn bản khai ở mục 16 (Nguồn).
- [ ] Không còn `[CẦN BA CHỐT]` khi chuyển `Chờ review`; còn ❓, `chưa chốt (`, hoặc giả định chưa chốt (trực tiếp hay kế thừa) thì không chuyển `Đã duyệt` — `00_quy_uoc_chung.md` mục 12; chạy script kiểm trước mỗi lần chuyển trạng thái.
- [ ] **Đã gọi reviewer độc lập** và xử lý hết phát hiện.

## Chỗ template còn lệch

Template ở trạng thái ngày 27/10/2026, đã có đủ khối bắt buộc của `00_quy_uoc_chung`; skill xử lý các chỗ còn lệch như sau cho đến khi template được sửa. Thứ bậc `00_quy_uoc_chung` → template → skill vẫn giữ.

| # | Chỗ | Vấn đề | Cách xử lý |
|---|---|---|---|
| 1 | Căn cứ cho `OBJ`, phạm vi, `SH`, `CON/ASM/DEP` | Template chỉ có cột căn cứ ở `BRQ`, `NFR`, mục 1.3, 6.1; các bảng kia không có, trong khi `so-cu-va-gia-dinh.md` mục 1 đòi căn cứ cho mọi khẳng định nghiệp vụ | Ghi căn cứ cuối ô chính dạng `— <nguồn>`: số đích trong `Mục tiêu` của `OBJ`, `Nội dung` của `CON/ASM/DEP`, `Quan tâm chính` của `SH`. Dạng `— <nguồn>` là **lựa chọn của skill** |
| 2 | Mục 12 cột `Use case` | Ví dụ `B-II.2` là mã dự toán (mã minh họa); theo G2 mã UC là mã WBS ở cột `No`, viết không tiền tố `UC-` | Ghi mã UC theo G2. Mã dự toán chỉ ghi khi cột `Mã UC gốc` của lớp 5 cần |
| 3 | Mục 7 và mục 2 | Hai cột cùng tên `Mục tiêu`: ở mục 7 là mã `OBJ`, ở mục 2 là **giá trị đích** | Giữ nguyên tên; skill luôn gọi "cột `Mục tiêu` của mục 2 (giá trị đích)" và "cột `Mục tiêu` của mục 7 (mã OBJ)" |
| 4 | Mục 9 | Dòng `Lưu trữ, kiểm toán` không phải nhóm ISO 25010; template dựng sẵn 6 dòng, thiếu bốn nhóm còn lại | Giữ dòng; ghi chú nó thuộc Security (accountability) khi cần đối chiếu. Thêm dòng cho nhóm khác khi có yêu cầu. NFR không có cột tiêu chí chấp nhận: viết mệnh đề đo được ngay trong `Yêu cầu` |
| 5 | Số mục BABOK | Template ghi "BABOK 3.2 Stakeholder Analysis" (mục 4) và "BABOK 7.5 Transition requirements" (mục 11). Theo BABOK v3, 3.2 là Plan Stakeholder Engagement — danh sách và bản đồ bên liên quan là kỹ thuật 10.43 Stakeholder List, Map, or Personas; 7.5 là Define Design Options — transition requirements là một loại yêu cầu, nằm ở 2.3 | Skill ghi đúng số ở phần định nghĩa. **Template ghi "3.2 Stakeholder Analysis" và "7.5 Transition requirements", chưa sửa template** |
| 6 | Mục 8 | Template ghi "29148 9.3.5 Business operational policies and rules"; số mục này chưa đối chiếu được với bản tiêu chuẩn | Skill không viện số mục này làm định nghĩa; mục 8 dẫn BMM Directives (xem bảng "Nguồn chuẩn"). **Template ghi "29148 9.3.5", chưa đối chiếu, chưa sửa template** |
| 7 | RACI và Phê duyệt | RACI của template có cột `Dev lead`; Phê duyệt theo `00_quy_uoc_chung` mục 3.4 có dòng `Tech lead` | Hai nhãn là **một vai** — người chịu trách nhiệm kỹ thuật của đội dự án. Giữ `Dev lead` ở RACI theo template, `Tech lead` ở Phê duyệt theo `00_quy_uoc_chung`. Chưa sửa template |
| 8 | Mục 3.1 | Template ghi nhãn mũi tên từ hệ thống ngoài là `{{sự kiện}}`, các mũi tên khác là `{{luồng}}` | Cả hai là luồng thông tin nghiệp vụ. Nhãn mũi tên từ hệ thống ngoài có thể là tên sự kiện nghiệp vụ (ví dụ `Trạng thái khách thay đổi`), không phải tên API |
