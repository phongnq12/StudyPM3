---
name: create-erd
description: Hướng dẫn dựng mô hình dữ liệu nghiệp vụ (lớp 3 của business layer) theo template erd.md — bóc thực thể từ thuật ngữ và chứng từ của quy trình, vẽ ERD chân chim, viết từ điển dữ liệu, danh mục enum, ràng buộc liên bảng R-xx, dữ liệu nhạy cảm. Định nghĩa thực thể, grain, sáu loại thực thể, bản số, khi nào bảng nối N–N thành thực thể, cái gì là giá trị dẫn xuất Δ không được lưu, và bắt buộc gọi reviewer độc lập trước khi đóng. Gọi khi người dùng nói "viết ERD", "dựng ERD", "bóc thực thể", "mô hình dữ liệu nghiệp vụ", "từ điển dữ liệu", "điền erd.md", "rà ERD giúp tôi", hoặc khi mở một file ERD_*.md theo template lớp 3.
---

# Dựng mô hình dữ liệu nghiệp vụ — lớp 3 ERD

Template đi kèm: [`2-ba-overview/templates/3-erd/erd.md`](../../../2-ba-overview/templates/3-erd/erd.md)

Phiên bản theo bảng Version control của [`ba-overview`](../ba-overview/SKILL.md).

Skill này là một trong sáu skill lớp của bước `/ba-overview`. Nền chung — thứ tự lớp, đặt tên file, hệ mã, ký hiệu, quy tắc viết — nằm ở [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md); cách tìm căn cứ, câu hỏi mở và giả định nằm ở `ba-overview`. Skill này không chép lại những phần đó, chỉ nói điều riêng của ERD. Ví dụ trong skill là **mã minh họa** của [thế giới ví dụ xuyên suốt](../ba-overview/reference/vi-du-xuyen-suot.md), không phải mã của dự án nào.

## Đọc gì, khi nào

File này là **phần lõi** — đọc hết trước khi viết tài liệu. Phần tra cứu nằm ở `reference/` và ở `ba-overview`; mở đúng file khi đến đúng việc.

| Khi đang làm | Mở |
|---|---|
| Điền từng mục, từng cột của template; chỗ template lệch hoặc tự mâu thuẫn | [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md) |
| Bóc thực thể từ quy trình; phân biệt thực thể, thuộc tính, quan hệ; chọn bản số; vẽ Mermaid; 3NF và phi chuẩn hóa | [`reference/thuc-the-va-quan-he.md`](reference/thuc-the-va-quan-he.md) |
| Phân vân một ràng buộc ở ERD hay BR; giá trị dẫn xuất Δ; `R-xx`; khóa ngoại đa hình; trạng thái suy từ bảng con; dữ liệu nhạy cảm | [`reference/rang-buoc-va-dan-xuat.md`](reference/rang-buoc-va-dan-xuat.md) |
| Quy ước chung: hạt và mã use case G1, G2 (mục 8); khối cuối của template và số mục (mục 6.1); cách dẫn chiếu, kể cả dẫn BR ở cột Nguồn (mục 9); ô lớp này phải điền cho lớp khác và ô ghi `chờ lớp n` (mục 10); không có bản vẽ gốc (mục 11) | [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Tìm căn cứ, ghi câu hỏi `Q-E`, ghi giả định `GD-xxxx`, ba giá trị đặc biệt, bản chép | [`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) |
| Một nội dung thuộc ERD hay lớp kề | [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md) |
| Cần ví dụ | [`ba-overview/reference/vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md) |
| Viết xong, gọi reviewer độc lập | [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md) |

## Quy trình viết

1. Kiểm cổng vào của lớp 3 ở `ba-overview` (quy trình ở `Chờ review` trở lên). Sao template thành `ERD_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`, **không sửa file template**. Có bản vẽ gốc thì đọc nó; không có thì theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 11.
2. Lập **danh sách ứng viên thực thể** từ quy trình: thuật ngữ mục 1.1 (cột `Thuật ngữ` và `Định nghĩa` — cột `Thực thể ERD` lớp 2 để `chờ lớp 3`, lớp này điền ở bước 7), bảng dữ liệu trục mục 3, bảng chứng từ mục 8, tham số mục 6. Với từng ứng viên chạy phép thử thực thể — mục "Có phải thực thể không" dưới đây và [`reference/thuc-the-va-quan-he.md`](reference/thuc-the-va-quan-he.md).
3. Điền mục 1 (quy ước chung theo dự án) và mục 2 (danh sách thực thể, loại, quy trình ghi, chủ sở hữu). Chốt **grain** của từng thực thể trước khi viết cột nào.
4. Vẽ mục 3 (mỗi nhóm một sơ đồ), rồi viết mục 4: từ điển từng thực thể, danh mục enum. Giá trị dẫn xuất Δ viết ngay dưới bảng của thực thể có liên quan.
5. Viết mục 5 (`R-xx`, khóa ngoại đa hình, trạng thái suy từ bảng con), mục 6 và 7 (khác bản vẽ), mục 8 (câu hỏi `Q-E`), mục 9 Dữ liệu nhạy cảm, mục 10 Rủi ro còn lại, mục 11 Điểm tạm hoãn, mục 12 Nguồn — các mục này đã có sẵn trong template, số mục theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 6; điền phần đầu file (Thông tin tài liệu, Phê duyệt) cùng lúc. Mỗi chỗ cần căn cứ thì tìm theo bốn bước của `ba-overview`.
6. Đối chiếu ngược với quy trình: mọi chứng từ, danh mục, sổ, tham số nhắc trong quy trình có thực thể, hoặc có một dòng ở bảng **Không lưu** cuối mục 2; mọi bản chép (tên bảng, enum, số đếm ở khối giới thiệu) khớp thân tài liệu. Tự soát theo checklist cuối file này.
7. **Điền ô của lớp khác** — việc của lớp này theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 10, làm **trước cổng ra**: (a) Quy trình mục 1.1 cột `Thực thể ERD` — thay mọi ô `chờ lớp 3` bằng tên bảng thật; ô để trống là khái niệm tính toán theo comment template, giữ trống — và thay đường dẫn ERD đang `chờ lớp 3` ở khối giới thiệu, bảng Nguồn của quy trình; rồi ghi Version control của quy trình; (b) BRD mục 9 dòng về dữ liệu nhạy cảm — đối chiếu với mục Dữ liệu nhạy cảm của ERD, thêm hoặc sửa NFR bảo mật nếu thiếu — rồi ghi Version control của BRD; (c) ERD mục 4, chỗ mô tả `trang_thai` trỏ `SM mục n`: ghi `chờ lớp 4`, create-sm điền sau. Việc điền là sửa không đổi nghĩa — ở mọi trạng thái thêm một gạch đầu dòng vào dòng phiên bản hiện tại, không tăng `vNN`, không đổi trạng thái (`00_quy_uoc_chung.md` mục 3.3).
8. **Gọi reviewer độc lập — bắt buộc**, xem mục "Review độc lập". Sửa theo phát hiện hoặc ghi lý do không sửa.
9. Xóa mọi khối `<!-- HƯỚNG DẪN … -->` và các comment gợi ý trong file dự án, rồi chuyển trạng thái `Chờ review`.

---

## ERD là gì

**ERD của business layer là bản kê những "thứ" mà tổ chức phải nhớ lại sau khi một việc xong — mỗi thứ có định danh, có vòng đời, có thuộc tính của riêng nó — và cách chúng liên hệ với nhau.** Nó trả lời câu hỏi **What** của sáu lớp: tổ chức quản lý những gì, chúng nối với nhau ra sao. Nó ở mức **logical** (theo phân mức mô hình dữ liệu conceptual–logical–physical): đủ tên bảng, tên trường, kiểu, khóa, miền giá trị để dev dựng cơ sở dữ liệu, nhưng chưa có thiết kế vật lý — partition, chỉ mục tối ưu truy vấn, kiểu riêng của một hệ quản trị; việc đó thuộc thiết kế kỹ thuật. Một ngoại lệ đã nằm trong quy ước chung của template: chỉ mục (loại, id) của khóa ngoại đa hình. Template ghi "ANSI/SPARC ba mức"; ANSI/SPARC chia external–conceptual–internal chứ không phải conceptual–logical–physical, nên skill dùng cách gọi trên (T15).

Nguồn chuẩn: Peter Chen (1976) cho mô hình thực thể–quan hệ; Eric Evans (*Domain-Driven Design*, 2003) cho Domain Model — ranh giới "thứ gì tồn tại độc lập, thứ gì phụ thuộc vào thứ khác"; ký hiệu chân chim Crow's Foot của Information Engineering, viết theo cú pháp Mermaid `erDiagram`; Data Dictionary của BABOK v3 và ISO/IEC 11179-3 cho từ điển dữ liệu; chuẩn hóa tối thiểu 3NF; DAMA-DMBOK 2, ISO/IEC 27001:2022 Annex A 5.12 và quy định bảo vệ dữ liệu cá nhân (Luật Bảo vệ dữ liệu cá nhân 2025, NĐ 13/2023/NĐ-CP) cho phân loại nhạy cảm — dẫn văn bản nào thì xác nhận hiệu lực trước, theo [`reference/rang-buoc-va-dan-xuat.md`](reference/rang-buoc-va-dan-xuat.md) mục 6.

Bài giới thiệu sáu lớp nêu ba artifact của lớp này. Chúng nằm ở template như sau, **không thêm bảng mới** ngoài bảng *Không lưu* ở cuối mục 2 — bổ sung của skill, template chưa có (T16):

| Artifact | Nằm ở | Ghi chú |
|---|---|---|
| Domain Model / ERD khái niệm | Mục 2 (danh sách thực thể), mục 3 (sơ đồ quan hệ) | Chen vẽ hình thoi cho quan hệ; template dùng chân chim Mermaid, quan hệ là nhãn trên đường nối |
| Data Dictionary | Mục 4 (từ điển từng thực thể, danh mục enum), một phần mục Dữ liệu nhạy cảm (phân loại) | Mỗi trường một dòng: tên, kiểu, ràng buộc, mô tả, nguồn |
| Ma trận CRUD (module nào tạo, sửa, xóa thực thể nào) | Cột `Quy trình ghi` ở mục 2, đối chiếu với cột `Ai ghi` của bảng dữ liệu trục ở mục 3 của quy trình | Chỉ có phía **ghi** (tạo · sửa · xóa). Phía **đọc** không có chỗ trong ERD — việc đọc thuộc quy trình và use case |

Tính chất nhận diện — một thứ chỉ được vào mục 2 khi đủ các tính chất dưới. Phân vân thì quay về bảng này:

| Tính chất | Nghĩa là | Thể hiện ở |
|---|---|---|
| **Có định danh** | Mỗi dòng phân biệt được với dòng khác bằng khóa chính, và (với dòng nghiệp vụ nhìn thấy) bằng một mã nghiệp vụ | `id` theo mục 1; một dòng `UK` trong từ điển, kèm phạm vi |
| **Có vòng đời** | Có một sự kiện sinh ra nó, có thể có sự kiện sửa hoặc kết thúc; mỗi sự kiện do một quy trình hoặc tác vụ nền thực hiện | Mục 2 cột `Quy trình ghi`; trường `trang_thai` trỏ SM khi có vòng đời nhiều bước (lớp 3 ghi `chờ lớp 4`) |
| **Nghiệp vụ cần nhớ** | Thông tin phải còn lại, tra lại được sau khi quy trình kết thúc — hoặc luật yêu cầu lưu. Tính ra được từ thứ khác thì không phải | Mục 2 cột `Nghĩa ngắn`; nguồn là thuật ngữ, dữ liệu trục, chứng từ của quy trình |
| **Một grain** | Nói được trong **một câu** "một dòng là gì". Không nói được một câu nghĩa là đang gộp hai thực thể | Câu đầu của mỗi thực thể ở mục 4 |
| **Thuộc tính của riêng nó** | Mỗi cột mô tả chính thực thể này, không mô tả thực thể khác (3NF) | Bảng ở mục 4; cột mô tả thứ khác được tách hoặc ghi lý do phi chuẩn hóa |
| **Một loại trong sáu** | Danh mục · Chứng từ · Dòng chứng từ · Sổ ghi thêm · Cấu hình · Nhật ký — không thuộc loại nào thường là chưa đủ rõ để thành thực thể | Mục 2 cột `Loại` |

**Grain** (hạt) là nghĩa của **một dòng**. "Một dòng `Lich_Hen` là một yêu cầu đặt lịch của một khách vào một ngày" là một grain. "Một dòng là một khách cùng các lịch hẹn của người đó" thì không — hai grain bị gộp, hệ quả là cột lặp hoặc cột để trống. Chốt grain trước khi liệt kê cột. Sáu loại thực thể và cách nhận biết từng loại ở [`reference/thuc-the-va-quan-he.md`](reference/thuc-the-va-quan-he.md).

## Có phải thực thể không

Mã và tên dưới đây là **mã minh họa** của thế giới ví dụ xuyên suốt.

| Thứ được nhắc | Kết luận | Vì sao |
|---|---|---|
| Lịch hẹn | **Có** — `Lich_Hen`, Chứng từ | Có mã, có vòng đời `DRAFT → … → APPROVED`, quy trình ghi nó, nghiệp vụ cần tra lại |
| Khách hàng | **Có** — `Khach_Hang`, Danh mục | Tồn tại độc lập, nhiều lịch hẹn trỏ tới, có định danh riêng |
| Số lượt đặt lịch đã dùng của một khách trong một tuần | **Có** — `Quy_Luot`, Sổ ghi thêm | Grain rõ: một dòng là lượt **đã dùng** của một khách trong một tuần. Lưu vì cần một dòng để khóa khi giữ lượt — ngoại lệ có chủ đích của phép thử Δ (nguyên tắc 2), phải có `R-01` đối soát với `Lich_Hen` |
| Số lượt còn lại trong tuần | **Không** — Δ | Bằng `CH-01` trừ `Quy_Luot.da_dung`. Tính khi truy vấn, không lưu; quy trình nhắc tới nó thì ghi một dòng ở bảng Không lưu |
| Cờ `la_qua_han` của lịch hẹn | **Không** — cờ suy ra được | Suy từ `ngay_hen` và `trang_thai`. Lưu cờ sẽ lệch ngay khi qua nửa đêm mà không ai cập nhật |
| `ngay_hen` | **Không** — thuộc tính đơn | Không có định danh, không có vòng đời; là cột của `Lich_Hen` |
| Người đi cùng một lịch hẹn, kèm "đã đến chưa" và "vai trò" (đại diện, đi cùng) | **Có** — `Nguoi_Di_Cung`, Dòng chứng từ *(giả định minh họa)* | Bảng nối N–N giữa khách và lịch hẹn, có thuộc tính của chính quan hệ (`da_den`, `vai_tro`): nối **thành thực thể**. Không tồn tại khi `Lich_Hen` không tồn tại nên xếp Dòng chứng từ, không xếp Danh mục |
| Màn hình "Đặt lịch" | **Không** | Là giải pháp, thuộc `/ba-detail`; ERD chỉ chứa dữ liệu mà màn hình đọc ghi |
| Báo cáo "Thống kê lịch hẹn theo tuần" | **Không** | Là một truy vấn trên `Lich_Hen`. Báo cáo cần lưu bản chụp thì bản chụp là một Chứng từ riêng, phải có `Quy trình ghi`. Không lưu bản chụp thì ghi một dòng ở bảng Không lưu |
| Nhật ký đổi trạng thái của lịch hẹn | **Có** — `Nhat_Ky_Thay_Doi`, Nhật ký | Căn cứ ở lớp đã có: điểm kiểm soát loại Phát hiện ở quy trình mục 9, hoặc NFR lưu vết ở BRD. Không dẫn nguyên tắc của máy trạng thái (lớp 4, viết sau). Cả hai đều không có thì 🧪 và `E-xx`. Chỉ thêm, không sửa; xử lý giá trị cũ của dữ liệu cá nhân theo [`reference/rang-buoc-va-dan-xuat.md`](reference/rang-buoc-va-dan-xuat.md) mục 6 |

## Ranh giới với lớp kề

Mọi ranh giới dẫn về [`ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md); dưới đây chỉ nêu **phía của ERD**, dòng nào của bảng ở đó áp dụng.

| Cặp ở `ranh-gioi-cac-lop.md` mục 2 | Phía của ERD |
|---|---|
| **ERD ↔ BR** | ERD giữ ràng buộc **nội tại một thuộc tính** (kiểu, độ dài, miền, bắt buộc tuyệt đối, duy nhất). Điều kiện cần trạng thái, tác nhân, kênh hoặc nhiều thuộc tính thì để BR |
| **ERD ↔ từ điển dữ liệu SRS** | ERD giữ tên, kiểu, bắt buộc tuyệt đối, miền giá trị, nguồn. Nhãn hiển thị, định dạng nhập, thứ tự trường để `/ba-detail` |
| **ERD ↔ Máy trạng thái** | ERD liệt kê mã enum của `trang_thai` và trỏ `SM mục n`. Chuyển, điều kiện, hệ quả thuộc SM. Mã trạng thái lấy đúng ERD |

Các dòng của mục 1 (bảng "Nội dung nào thuộc lớp nào") liên quan trực tiếp: thuật ngữ chi tiết của domain ở quy trình mục 1.1 — ERD ghi tên bảng tương ứng, không định nghĩa lại thuật ngữ; `GS-xx`, `CH-xx` ở quy trình — ERD dẫn, không chép công thức hay con số trần; `R-xx` và ràng buộc dạng dữ liệu của ERD — **dẫn hai chiều**: ERD dẫn mã BR ở cột Nguồn (sau lượt điền ngược), BR dẫn bảng, trường, `R-xx`; ràng buộc ngữ cảnh không viết được thành dữ liệu thì ERD chỉ nhắc ở Mô tả *xem business rule — <tên nghiệp vụ>*. Dòng **Tách nhiệm**: `R-xx` loại Tách nhiệm ở ERD chỉ là phép kiểm dữ liệu (`nguoi_duyet_id ≠ nguoi_lap_id`); nội dung quy tắc ở BR, nguyên tắc chung ở SM-07. Dữ liệu nhạy cảm (mục riêng của ERD) giao cho BRD mục 9 (mục 3 của `ranh-gioi-cac-lop.md`).

## Nguyên tắc

**1. Dữ liệu nằm ở ERD, nghiệp vụ nằm ở quy trình.** Tài liệu này là nguồn duy nhất về tên bảng, tên trường, mã enum; nghiệp vụ lấy từ quy trình. Thực thể nào ERD đề xuất mà quy trình chưa nêu thì đánh 🧪 và ghi `E-xx` ở mục 7 — không tự thêm im lặng.

**2. Thứ suy ra được thì không lưu.** Giá trị dẫn xuất ghi ở dòng **Giá trị dẫn xuất Δ** với công thức; trạng thái hay khóa suy ra từ dữ liệu thì không có cột cờ. **Một ngoại lệ:** khi nghiệp vụ cần một bản ghi tổng hợp để *khóa* hoặc *giữ chỗ* — ví dụ giữ một lượt khi nhiều yêu cầu đến cùng lúc, cần một dòng để khóa — thì được lưu tổng hợp đó như phi chuẩn hóa có chủ đích: ghi lý do ở đoạn mô tả bảng, có `R-xx` loại Đối soát, nêu ai cập nhật (chi tiết ở [`reference/rang-buoc-va-dan-xuat.md`](reference/rang-buoc-va-dan-xuat.md) mục 2). Ngoài trường hợp đó, phi chuẩn hóa chỉ vào ba kiểu ở `thuc-the-va-quan-he.md` mục 8.

**3. Mỗi ràng buộc ở đúng một chỗ.** Nội tại của một thuộc tính ở cột `Ràng buộc`; liên bảng ở mục 5 `R-xx`; theo ngữ cảnh ở lớp 6 BR. Ghi ngữ cảnh vào cột `Ràng buộc` là lấn lớp — dev sẽ cài thành ràng buộc cứng và nghiệp vụ không đổi được khi luật đổi.

**4. Bản vẽ gốc là đối chiếu, không phải chân lý.** Tên giữ đúng bản vẽ để dev đối chiếu; khác bản vẽ thì có ký hiệu ✎ ở cột `Đổi` **và** một dòng `E-xx` nếu là điểm cần BA xác nhận. Tên lệch mà không dấu là lỗi, vì dev đối chiếu bản vẽ sẽ tưởng bảng không tồn tại.

**5. Chụp, không với tay.** Dữ liệu của phân hệ khác chỉ được dẫn bằng tham chiếu logic; thứ cần để quyết định thì chụp vào chứng từ lúc ghi, để chứng từ không đổi nghĩa khi phân hệ kia sửa dữ liệu.

## Mã và tên

Hệ mã dùng chung ở [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4: `R-nn`, `E-nn`, `Q-{lớp}nn` (ERD dùng `Q-E1`), `D-nn`, `GS-nn`, `CH-nn`, `N-nn`. Mã duy nhất trong tài liệu, mã bỏ không dùng lại. Riêng ERD:

| Mã hoặc tên | Quy định riêng của lớp |
|---|---|
| `R-nn` | Đánh số liên tục, **một mã một ràng buộc**. Loại thuộc đúng năm giá trị: Đối soát · Duy nhất · Loại trừ · Tách nhiệm · Khớp trạng thái. Loại Tách nhiệm chỉ phát biểu **phép kiểm dữ liệu** (`nguoi_duyet_id ≠ nguoi_lap_id`), nội dung tách nhiệm ở BR. Cột Nguồn ghi căn cứ **và ai kiểm**: `GS-xx · kiểm bởi N-03` (đối soát định kỳ) hoặc `GS-xx · chặn khi ghi ở LH-01 bước 4` (xem `dien-tung-muc.md` mục 5.1) |
| `E-nn` | Đánh số theo thứ tự phát hiện, không theo nhóm. Điểm đã BA chốt thì giữ dòng, thêm *BA chốt dd/mm/yyyy: …* vào cột `Đề xuất mặc định` — không xóa |
| Tên bảng | `Pascal_Snake` tiếng Việt không dấu: `Lich_Hen`, `Quy_Luot`. Dẫn bảng luôn trong backtick, theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 9 |
| Tên trường | `snake_case` tiếng Việt không dấu; khóa ngoại tận cùng `_id`; cờ boolean hiếm khi cần — xem nguyên tắc 2 |
| Mã enum | `UPPER_SNAKE` **tiếng Anh**, kèm tên Việt ở cột mô tả hoặc `Tên hiển thị`. Mã không đổi nghĩa sau khi phát hành |
| Tên thực thể ở mục 4 | `` `Ten_Bang` `` — tên nghiệp vụ · ✳ / ✎ / Giữ. Tên nghiệp vụ đúng chữ ở thuật ngữ quy trình mục 1.1 |

## Tìm căn cứ

Bốn bước, ba giá trị đặc biệt, phân biệt `Q-E` với `GD-xxxx`: theo [`so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md). Nguồn **đặc thù của ERD**, tìm theo thứ tự:

| Căn cứ cho | Tìm ở đâu trước |
|---|---|
| Một thực thể tồn tại | Quy trình: thuật ngữ mục 1.1 (cột `Thuật ngữ`, `Định nghĩa`; cột `Thực thể ERD` do lớp 3 điền), bảng dữ liệu trục mục 3, bảng chứng từ mục 8. Sau đó bản vẽ gốc. Sau đó văn bản pháp luật yêu cầu lập hoặc lưu chứng từ |
| Thực thể Nhật ký | Quy trình mục 9, điểm kiểm soát loại Phát hiện; NFR lưu vết ở BRD. Không có cả hai thì 🧪 và `E-xx` |
| Một cột bắt buộc, nội dung bắt buộc của chứng từ | Quy trình mục 8.2 "Nội dung bắt buộc phải có", mục 8.1 mẫu ban hành; điều khoản yêu cầu lập |
| Kiểu, độ dài, miền giá trị | Bản vẽ gốc; văn bản ban hành mẫu (định dạng mã, độ dài số hiệu); `GS-xx` cho tiền, làm tròn, múi giờ; `CH-xx` cho tham số. Không có thì `Q-E` kèm đề xuất mặc định, **không** tự bịa độ dài |
| Danh sách enum | Quy trình (tên trạng thái, loại biến động); bản vẽ gốc; văn bản. Mã tiếng Anh do ERD đặt |
| `R-xx` | Nguyên tắc bảo toàn và `GS-xx` ở quy trình mục 3, 3.1; điểm kiểm soát mục 9 của quy trình; tác vụ nền `N-xx` thực thi việc kiểm |
| Dữ liệu nhạy cảm, thời hạn lưu | Văn bản về bảo vệ dữ liệu cá nhân và lưu trữ hồ sơ mà dự án đã xác nhận; chính sách phân loại thông tin của khách hàng. **Không** tự tra điều khoản ngoài những gì đầu vào đã có. Xác nhận văn bản còn hiệu lực trước khi dẫn ([`reference/rang-buoc-va-dan-xuat.md`](reference/rang-buoc-va-dan-xuat.md) mục 6) |

Không có bản vẽ gốc thì cột `Đổi` ghi ✳ cho mọi trường và mục 7 ghi *Không có bản vẽ gốc* (`00_quy_uoc_chung.md` mục 11). Khi tên bảng, tên trường **do ERD tự đặt**, đó là quyền của lớp này và không cần căn cứ; khi **tồn tại** của bảng hay trường là một khẳng định nghiệp vụ thì cần.

## Review độc lập

Bắt buộc, theo [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md): reviewer là một agent mới, chỉ nhận đường dẫn, không sửa file. Prompt mẫu ở file đó; điền `lớp 3 — ERD`, skill `create-erd`, template `2-ba-overview/templates/3-erd/erd.md`, và dán khối sau vào chỗ `<VIỆC 3 RIÊNG CỦA LỚP>`:

```text
   - Chứng từ, danh mục, sổ, tham số cấu hình được nhắc trong quy trình (mục 1.1 cột Thuật ngữ,
     mục 3 dữ liệu trục, mục 6, mục 8) mà ERD chưa có thực thể, và cũng không có dòng ở bảng Không lưu
     cuối mục 2.
   - Trường trang_thai thiếu danh sách enum đầy đủ, hoặc không trỏ SM mục n và cũng không ghi `chờ lớp 4`.
     Cột lưu cờ hoặc giá trị suy ra được (đáng lẽ là Δ). Phi chuẩn hóa không có lý do hoặc không có R-xx
     đối soát.
   - Ràng buộc theo ngữ cảnh (theo trạng thái, tác nhân, kênh, nhiều thuộc tính) bị ghi vào cột Ràng buộc
     thay vì nằm ở BR; `*` và `◐` dùng sai (◐ không ghi điều kiện, hoặc ◐ cho điều kiện thực ra tuyệt đối).
   - Quan hệ thiếu bản số hoặc thiếu nhãn động từ; bản số không khớp `*`/`◐` của khóa ngoại ở từ điển
     (khóa ngoại `*` mà đầu cha không phải `||`, hoặc khóa ngoại không `*` mà đầu cha là `||`); bảng nối
     N–N có thuộc tính của chính quan hệ mà không thành thực thể; khóa ngoại đa hình thiếu cột loại hoặc
     không có dòng ở mục 5.2.
   - R-xx không ghi ai kiểm hoặc không phân biệt chặn khi ghi với đối soát định kỳ; R-xx loại Tách nhiệm
     chứa nội dung nghiệp vụ thay vì chỉ là phép kiểm dữ liệu; cột Nguồn dẫn mã BR không có thật hoặc lệch nghĩa (sau lớp 6).
   - Dữ liệu cá nhân (cơ bản, nhạy cảm) chưa phân loại ở mục Dữ liệu nhạy cảm, hoặc phân loại mà không có
     mức, người được xem, cách xử lý; thiếu thời hạn lưu trữ; nhật ký lưu giá trị cũ của dữ liệu cá nhân
     mà không có cách xử lý; dẫn văn bản pháp luật chưa xác nhận còn hiệu lực.
   - Tên bảng, tên trường, mã enum lệch bản vẽ gốc mà không có dấu ✎ ở cột Đổi và không có E-xx; trường bị
     bỏ so với bản vẽ mà không có dòng ⊘; số đếm ở khối giới thiệu không khớp thân tài liệu; thực thể 🧪
     không có E-xx.
   - Ô của lớp khác chưa điền: Quy trình mục 1.1 cột Thực thể ERD, đường dẫn ERD ở khối giới thiệu và bảng Nguồn của quy trình, BRD mục 9 dòng dữ liệu nhạy cảm;
     Version control của hai tài liệu đó chưa ghi.
```

## Soát trước khi đóng

Cấu trúc và chuẩn:

- [ ] Có đủ mọi mục của template theo đúng thứ tự và số mục (8 Câu hỏi, 9 Dữ liệu nhạy cảm, 10 Rủi ro còn lại, 11 Điểm tạm hoãn, 12 Nguồn), kèm bảng Phê duyệt; đã điền, không để `{{ }}`.
- [ ] Mục hoặc bảng cấp mục không có nội dung thì giữ và ghi *Không có …*; riêng dòng **Giá trị dẫn xuất Δ** trong khối thực thể thì bỏ dòng khi không có Δ.
- [ ] Khối giới thiệu có đủ số đếm (thực thể, thực thể ngoài, `R-xx`, `E-xx`) và đúng với thân tài liệu.
- [ ] Khối giới thiệu giữ câu "không chứa gì, nằm ở đâu" của template, đã sửa cho đúng tài liệu.
- [ ] Bảng Thông tin tài liệu đủ các dòng (Dự án · Phân hệ, Người soạn · Người review · Người duyệt, Mức mật) và đã điền; bảng Phê duyệt giữ ba dòng, AI không điền tên, ngày, ý kiến thay người.
- [ ] Mức mô hình ghi Logical; không có partition, kiểu riêng của một hệ quản trị, chỉ mục nào ngoài chỉ mục (loại, id) của khóa ngoại đa hình.
- [ ] Mục 1 đã điền theo dự án, không còn `{{ }}`.
- [ ] Mọi `GS-xx` dẫn có thật ở quy trình.
- [ ] Đã xóa mọi khối `<!-- HƯỚNG DẪN … -->` và comment gợi ý.

Thực thể và quan hệ:

- [ ] Mọi chứng từ, danh mục, sổ, tham số trong quy trình có thực thể, hoặc có dòng ở bảng Không lưu (kèm lý do và `D-xx`/`GS-xx`).
- [ ] Mỗi thực thể có loại trong sáu loại.
- [ ] Mỗi thực thể có grain một câu.
- [ ] Mỗi thực thể có ít nhất một `Quy trình ghi` và chủ sở hữu dữ liệu.
- [ ] Không thực thể nào là giá trị dẫn xuất, cờ suy ra được, thuộc tính đơn, màn hình hay báo cáo; bản ghi tổng hợp được lưu thuộc đúng ngoại lệ ở nguyên tắc 2.
- [ ] Mọi đường nối ở mục 3 có bản số hai đầu và nhãn động từ.
- [ ] Sơ đồ khớp từ điển về tên bảng, tên trường, khóa.
- [ ] Bản số khớp `*`/`◐` của khóa ngoại: `*` thì đầu cha `||`; không `*` hoặc `◐` thì `|o`.
- [ ] Bảng nối N–N có thuộc tính của chính quan hệ hoặc có vòng đời thì đã thành thực thể.
- [ ] Mọi khóa ngoại sang phân hệ khác là tham chiếu logic và có trường **chụp** nếu dùng để quyết định.

Từ điển và ràng buộc:

- [ ] Mỗi trường có kiểu, `Ràng buộc`, `Đổi`, mô tả, nguồn.
- [ ] Trường bắt buộc có `*`; bắt buộc có điều kiện có `◐` kèm điều kiện.
- [ ] UK nghiệp vụ ghi phạm vi (`UK trong {{trung_tam_id}}`); UK tổ hợp ghi ở mọi cột của tổ hợp.
- [ ] Mọi trường `trang_thai` có đủ mã enum và tên Việt, và trỏ `SM mục n` hoặc ghi `chờ lớp 4`.
- [ ] Mọi enum có dòng ở danh mục enum, và ngược lại.
- [ ] Mọi Δ có công thức; không có cột cờ cho thứ suy ra được.
- [ ] Mọi phi chuẩn hóa có lý do và `R-xx` đối soát.
- [ ] Cột `Ràng buộc` chỉ chứa ràng buộc ở dạng dữ liệu; ràng buộc ngữ cảnh đã ghi *xem business rule* kèm tên nghiệp vụ hoặc ❓.
- [ ] Ràng buộc dạng dữ liệu đến từ một quy tắc nghiệp vụ — kể cả bản số của quan hệ, `UK` trên khóa ngoại — có căn cứ ở cột Nguồn của dòng trường đó; sau lớp 6, cột Nguồn có mã BR (một hoặc nhiều, cách `·`).
- [ ] Mỗi `R-xx` có loại thuộc năm giá trị và nguồn.
- [ ] Mỗi `R-xx` ghi ai kiểm ở cột Nguồn; ràng buộc chặn khi ghi và đối soát định kỳ phân biệt đúng.
- [ ] `R-xx` loại Tách nhiệm chỉ phát biểu phép kiểm dữ liệu.
- [ ] Dòng `Thứ tự khóa` có: nội dung khi có thao tác khóa nhiều bảng, *Không có thao tác khóa nhiều bảng* khi không.
- [ ] Khóa ngoại đa hình có cột loại và có dòng ở mục 5.2 cho từng giá trị loại.
- [ ] Trạng thái suy từ bảng con có điều kiện xét theo thứ tự, phủ đủ trường hợp.

Khác bản vẽ, câu hỏi, nhạy cảm:

- [ ] Mọi tên lệch bản vẽ có ✎; thực thể hoặc trường mới có ✳.
- [ ] Thực thể bỏ hoặc đổi tên có dòng ở mục 6 kèm nguồn; trường bị bỏ có dòng ⊘ ở bảng trường kèm nguồn.
- [ ] Điểm cần BA xác nhận có `E-xx`; mọi 🧪 có `E-xx`.
- [ ] Mọi `Q-E` có kịch bản bằng ví dụ số hoặc thời điểm cụ thể.
- [ ] Mọi `Q-E` có đề xuất mặc định (cột `Đề xuất mặc định`); cột `Người chốt` ghi người hoặc `chưa chốt (<ai>)`.
- [ ] Mục 10 Rủi ro còn lại và mục 11 Điểm tạm hoãn đã điền hoặc ghi *Không có*; mỗi `RK-nn` có mức C · TB · T.
- [ ] Không còn `[CẦN BA CHỐT]` khi chuyển `Chờ review`.
- [ ] Không chuyển `Đã duyệt` khi còn ❓, `chưa chốt (`, hoặc giả định chưa chốt — trực tiếp hay kế thừa qua mã đứng trên giả định (`00_quy_uoc_chung.md` mục 12). Đã chạy script kiểm, không còn lỗi Chặn.
- [ ] Mọi `GD-xxxx` trong thân bôi đỏ đậm gạch chân, có dòng trong sổ, kèm tên ngắn.
- [ ] Mục Dữ liệu nhạy cảm: mọi trường dữ liệu cá nhân, tài chính, nội bộ nhạy đã có dòng với loại, mức, ai được xem, cách xử lý.
- [ ] Có thời hạn lưu trữ; nhật ký lưu giá trị cũ của dữ liệu cá nhân có cách xử lý hoặc `Q-E`.
- [ ] Văn bản pháp luật dẫn ở mục nhạy cảm đã xác nhận còn hiệu lực.

Điền cho lớp khác:

- [ ] Quy trình mục 1.1 cột `Thực thể ERD` đã điền (tên bảng, hoặc `—` cho khái niệm tính toán) và Version control quy trình đã ghi.
- [ ] BRD mục 9 dòng dữ liệu nhạy cảm đã đối chiếu với ERD, NFR bảo mật thêm hoặc sửa nếu thiếu, Version control BRD đã ghi.
- [ ] Chỗ `trang_thai` trỏ SM đã ghi `chờ lớp 4`.
- [ ] **Đã gọi reviewer độc lập** và xử lý hết phát hiện.
