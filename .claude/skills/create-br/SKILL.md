---
name: create-br
description: Hướng dẫn viết bộ Business Rule (lớp 6, lớp cuối của business layer) theo template business_rules.md. Dùng khi cần viết mới, sửa hoặc rà soát bộ quy tắc nghiệp vụ có mã BR-{nhóm}{nn} — gom ứng viên quy tắc từ lớp 1–5, phân loại quy tắc định nghĩa (ĐN) và quy tắc hành vi (HV), chọn mức cưỡng chế 🔒 ⚙️ 🔑 ⚠️ ❓, viết câu theo mẫu RuleSpeak, dựng bảng quyết định DMN, chạy lượt điền ngược sang lớp 1, 2, 3, 4, 5. Gọi khi người dùng nói "viết business rule", "bóc quy tắc nghiệp vụ", "điền BR", "gom ứng viên BR", "lượt điền ngược", "bảng quyết định DMN", "rà bộ BR", hoặc khi mở file theo business_rules.md.
---

# Viết bộ Business Rule — lớp 6

Template đi kèm: [`2-ba-overview/templates/6-business-rules/business_rules.md`](../../../2-ba-overview/templates/6-business-rules/business_rules.md)

Phiên bản theo bảng Version control của [`ba-overview`](../ba-overview/SKILL.md).

## Đọc gì, khi nào

File này là **phần lõi** — đọc hết trước khi viết tài liệu. Phần tra cứu nằm trong `reference/` của skill này và trong `ba-overview`; mở đúng file khi đến đúng việc.

| Khi đang làm | Mở |
|---|---|
| Điền từng mục, từng cột của template | [`reference/dien-tung-muc.md`](reference/dien-tung-muc.md) |
| Phân loại ĐN hay HV, chọn mức cưỡng chế, viết câu theo RuleSpeak, tách quy tắc ghép, đánh dấu suy luận | [`reference/loai-va-cuong-che.md`](reference/loai-va-cuong-che.md) |
| Quy tắc có từ hai điều kiện trở lên, cần bảng quyết định, chọn chính sách trúng, kiểm đủ tổ hợp | [`reference/bang-quyet-dinh-dmn.md`](reference/bang-quyet-dinh-dmn.md) |
| Gom ứng viên từ lớp 1–5, loại ứng viên, chạy lượt điền ngược, ghi Version control | [`reference/gom-ung-vien-va-dien-nguoc.md`](reference/gom-ung-vien-va-dien-nguoc.md) |
| Quy ước nền: hệ mã, ký hiệu, khối đầu cuối, văn phong | [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) |
| Tìm căn cứ, ghi câu hỏi mở `Q-…`, giả định `GD-xxxx`, ba giá trị đặc biệt, bản chép và kiểm đồng bộ | [`ba-overview/reference/so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md) |
| Phân vân một nội dung thuộc BR hay lớp khác | [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md) |
| Cần ví dụ chạy suốt sáu lớp | [`ba-overview/reference/vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md) |
| Thứ tự chạy, cổng vào, cổng ra, lượt điền ngược nói chung | [`ba-overview/SKILL.md`](../ba-overview/SKILL.md) mục "Thứ tự chạy" và "Cổng vào, cổng ra" |
| Viết xong, gọi reviewer độc lập | [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md) |

Mọi mã trong skill này (`BR-A01`, `QT_DA1_LichHen`, `GD-…`, `QC01 Đ5.1`…) là **mã minh họa** lấy từ [`vi-du-xuyen-suot.md`](../ba-overview/reference/vi-du-xuyen-suot.md), không phải mã thật của dự án nào. Không chép sang tài liệu dự án.

Mã có trong **bảng mã chuẩn** của `vi-du-xuyen-suot.md` (mục 3) dùng đúng nghĩa và đúng tên ngắn ở bảng đó: `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần`, `BR-A02 Định nghĩa lượt đã dùng`, `BR-A03 Hủy sớm được trả lượt`, `BR-A04 Người đặt hộ không tự duyệt`. Mã ngoài bảng là **mã minh họa riêng của skill** và mỗi mã chỉ mang một nghĩa trong cả năm file của skill này:

| Mã | Nghĩa trong skill | Dùng ở |
|---|---|---|
| `BR-A05 Đã duyệt không sửa số người` | HV, ❓ (suy luận) | `dien-tung-muc.md`, `loai-va-cuong-che.md`, `gom-ung-vien-va-dien-nguoc.md` |
| `BR-A06 Lập đủ trường theo mẫu` | HV, 🔒 (gắn mẫu ở Phụ lục A) | `dien-tung-muc.md` |
| `BR-A07 Đối chiếu giấy tờ` | HV, 🔒 (nghĩa vụ ở Phụ lục B) | `dien-tung-muc.md` |
| `BR-A08 Giấy tờ phải xuất trình khi đến hẹn` | HV, 🔒, bảng quyết định chính sách F | `bang-quyet-dinh-dmn.md` |
| `BR-A09 Mức ưu tiên duyệt` | ĐN, bảng quyết định chính sách U, khoảng số | `bang-quyet-dinh-dmn.md` |
| `BR-B04`, `BR-B09` | Hai mã đã bỏ của nhóm B | ví dụ "Mã đã bỏ" |
| `CH-04`…`CH-08` | Tham số minh họa riêng (ngưỡng ngày, ngưỡng số lịch hẹn, ngưỡng cảnh báo) | `loai-va-cuong-che.md`, `bang-quyet-dinh-dmn.md` |
| `QC01 Đ7.3`, `Đ8.1`, `Đ8.2` | Điều khoản minh họa riêng | `bang-quyet-dinh-dmn.md` |
| `QT_DA1_LichHen mục 9 điểm 3` | Điểm kiểm soát minh họa riêng | `gom-ung-vien-va-dien-nguoc.md`, `dien-tung-muc.md` |
| `GS-06`, `D-09`, `SM-04`, `SM-07`, `SM-08`, `SM-09` | Quy tắc dùng chung, quyết định, nguyên tắc máy trạng thái minh họa riêng | rải rác |

## Quy trình viết

Lớp 6 **chạy sau cùng**, sau khi lớp 1–5 đã ở `Chờ review` trở lên (cổng vào ở `ba-overview`). Lý do: business rule không đứng riêng mà áp lên cả năm lớp trên, nên nó cần thấy hết chỗ các lớp kia đang dẫn luật trần.

Thứ tự **review độc lập → sửa → lượt điền ngược → cổng ra** theo `ba-overview` mục "Thứ tự chạy": điền ngược chạy sau cùng để mã BR không lan sang năm lớp rồi mới bị đổi hoặc bỏ. Hệ quả: nếu reviewer báo bỏ một BR thì lúc đó chưa có mã nào ở lớp 1, 2, 3, 4, 5 cần thu hồi.

1. Kiểm cổng vào, sao template thành `BR_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md` theo `00_quy_uoc_chung.md` mục 2. Không sửa file template.
2. Đọc **toàn văn** từng văn bản pháp luật, chính sách trong đầu vào `/ba-init`, ghi bảng 1.2, rồi tìm mọi câu có động từ nghĩa vụ hoặc cấm (mục "Tìm căn cứ").
3. Gom **ứng viên** từ lớp 1–5 và xử lý từng ứng viên thành một trong ba kết cục: thành BR, gộp vào một BR, hoặc loại kèm lý do. Xem [`reference/gom-ung-vien-va-dien-nguoc.md`](reference/gom-ung-vien-va-dien-nguoc.md).
4. Chia nhóm, cấp mã, viết từng quy tắc theo mẫu RuleSpeak, gắn loại ĐN/HV và mức cưỡng chế. Quy tắc nhiều điều kiện thì viết bảng quyết định.
5. Điền `Áp tại` và `Liên quan`, dựng Thống kê, rồi điền các khối có sẵn của template — Danh sách điểm cần chốt, Rủi ro còn lại, Điểm tạm hoãn — cùng bảng Ứng viên đã loại, hai phụ lục, rồi đối chiếu số đếm ở khối giới thiệu. Tự soát theo nhóm checklist "Trước review" ở cuối file này.
6. **Gọi reviewer độc lập — bắt buộc**, xem mục "Review độc lập". Sửa theo phát hiện hoặc ghi lý do không sửa. Sửa làm đổi số đếm hay đổi mã thì đối chiếu lại các bản chép.
7. **Chạy lượt điền ngược** sang lớp 1, 2, 3, 4, 5 (lớp 3 là ERD: cột Nguồn của từ điển dữ liệu và của `R-xx`) và ghi Version control của từng tài liệu bị sửa ([`reference/gom-ung-vien-va-dien-nguoc.md`](reference/gom-ung-vien-va-dien-nguoc.md) mục 6).
8. Kiểm cổng ra (nhóm checklist "Sau review"), xóa **mọi** chú thích `<!-- … -->` của template trong file dự án, chuyển trạng thái `Chờ review`.

---

## Business rule là gì

**Business rule là một phát biểu về điều gì bắt buộc, bị cấm, chỉ được làm khi nào, tính bằng cách nào, hoặc là gì — viết bằng ngôn ngữ nghiệp vụ, đứng độc lập với quy trình và màn hình, có nguồn, và kiểm chứng được.** "Mỗi khách chỉ được đặt tối đa `CH-01` lịch hẹn mỗi tuần" là một business rule. "Sau khi nhân viên tiếp đón duyệt, hệ thống gửi thông báo" thì không: câu đó chỉ có nghĩa khi đứng trong trình tự, nên nó là bước quy trình.

Lớp Rules khác năm lớp còn lại ở một điểm: nó **không đứng riêng**. BRD nói vì sao, quy trình nói ai làm gì, ERD nói có những thứ gì, máy trạng thái nói thứ đó đổi ra sao, lớp 5 nói ai làm được gì trên hệ thống; business rule là các **ràng buộc lên dữ liệu và trạng thái, công thức, và điều kiện suy ra kết quả** mà cả năm lớp kia cùng phải tuân theo.

Nguồn chuẩn và nơi từng artifact nằm trong template:

| Artifact (bảng ở bài giới thiệu sáu lớp) | Chuẩn | Nằm ở đâu trong `business_rules.md` |
|---|---|---|
| Business Rules Catalog — mã, phát biểu, loại, thực thể neo, nguồn | Business Rules Manifesto (2003) · BABOK v3 mục 10.9 | Bảng quy tắc ở mỗi mục nhóm. Cột `Thực thể neo` của catalog không có cột riêng: **thực thể neo thể hiện qua chủ thể của câu** ở cột `Nội dung`, và khi cần chỉ đúng bảng thì ghi tên bảng ERD ngay trong ô `Nội dung` (lựa chọn của skill). Cột `Áp tại` là **nơi kiểm** (bước, chuyển trạng thái, trường), không phải thực thể neo |
| Decision Table — điều kiện đầu vào → kết quả, đủ mọi tổ hợp | OMG DMN 1.5 | Khối "Bảng quyết định" ngay dưới bảng quy tắc của nhóm |
| Structured Rule Statements — câu theo cú pháp chuẩn gắn với từ vựng | OMG SBVR 1.5 · RuleSpeak (Ross) | Cột `Nội dung` viết theo mẫu câu; cột `Loại` và `Cưỡng chế`; mục 1.3 (ký hiệu, loại, lưu ý thuật ngữ) |

Bài giới thiệu nhấn mạnh một điều mà skill này giữ nguyên: **ngưỡng là cấu hình được, nên nằm ở bảng quyết định, không viết cứng trong mô tả màn hình.** Ở đây thêm một lớp nữa theo `00_quy_uoc_chung.md` mục 7: trong câu và trong ô của bảng quyết định, ngưỡng viết bằng mã `CH-xx`; con số thật nằm ở Quy trình mục 6.

Năm tính chất nhận diện. Phân vân một câu có phải business rule không, hoặc một dòng đang viết có đúng không, quay về bảng này:

| Tính chất | Nghĩa là | Thể hiện ở |
|---|---|---|
| **Độc lập với trình tự và giao diện** | Bỏ trình tự đi mà câu vẫn đúng; không nhắc màn hình, nút, route, API, bước số mấy | Cột `Nội dung`. Bước quy trình chỉ được xuất hiện ở cột `Áp tại` |
| **Một mã, một quy tắc** | Một nghĩa vụ hoặc một định nghĩa; không có câu nào mà một vế bỏ đi thì vế kia vẫn đứng độc lập | Cột `Mã`; ranh giới tách ở [`reference/loai-va-cuong-che.md`](reference/loai-va-cuong-che.md) |
| **Có nguồn** | Dẫn đúng điều, khoản, điểm; không có thì đánh dấu **suy luận** hoặc **chờ chốt**, không trộn lẫn với quy tắc có căn cứ | Cột `Căn cứ`, và mức ❓ ở cột `Cưỡng chế` |
| **Có loại và có mức** | ĐN (đúng theo định nghĩa) hay HV (có thể bị vi phạm); hệ thống phản ứng ở mức nào khi gặp vi phạm | Cột `Loại`, cột `Cưỡng chế` |
| **Kiểm chứng được** | Viết được testcase đạt và không đạt; số liệu cấu hình dẫn `CH-xx` | Cột `Nội dung`; HV có testcase âm theo mức cưỡng chế, ĐN có testcase là ca tính đúng ([`reference/loai-va-cuong-che.md`](reference/loai-va-cuong-che.md) mục 2) |

Hai loại, nói gọn (phép thử và bảng chọn ở [`reference/loai-va-cuong-che.md`](reference/loai-va-cuong-che.md) mục 1):

| Loại | Phép thử một dòng | Mức được dùng |
|---|---|---|
| **ĐN — Định nghĩa** (structural) | Không thể "làm trái": trái là tính sai, phân loại sai | 🔒 · ⚙️ · ❓ |
| **HV — Hành vi** (operative) | Hình dung được người hoặc hệ thống làm trái; hệ thống phải có phản ứng | 🔒 · ⚙️ · 🔑 · ⚠️ · ❓ |

Năm mức cưỡng chế 🔒 ⚙️ 🔑 ⚠️ ❓: **một nơi định nghĩa duy nhất** là [`reference/loai-va-cuong-che.md`](reference/loai-va-cuong-che.md) mục 2 (nghĩa, cách chọn, hệ quả cho dev và QC, nghĩa riêng của ĐN). Template mục 1.3 chỉ chép ký hiệu; đừng viết lại định nghĩa ở chỗ khác.

## Có phải business rule không

Cột giữa là kết luận, cột cuối là phép thử. Mọi ví dụ dưới đây là mã minh họa.

| Câu | Kết luận | Vì sao |
|---|---|---|
| Mỗi khách chỉ được đặt tối đa `CH-01` lịch hẹn mỗi tuần | **Là BR** — HV, ⚙️ | Đúng ở mọi bước, có căn cứ `QC01 Đ5.1`, kiểm chứng được, số liệu dẫn `CH-01` |
| Lượt hẹn đã dùng là lịch hẹn ở trạng thái Chờ duyệt, Đã duyệt, Đã đến hẹn, hoặc Đã hủy muộn | **Là BR** — ĐN, 🔒 (`BR-A02`) | Định nghĩa mà hệ thống dùng để đếm lượt đã dùng. Nếu chỉ để người đọc hiểu từ "lượt" thì là thuật ngữ ở Quy trình mục 1.1, không cần mã |
| Sau khi nhân viên tiếp đón duyệt, hệ thống gửi thông báo cho khách | **Không** — bước | Chỉ có nghĩa trong trình tự; thuộc `LH-01 bước 4` |
| Lịch hẹn chuyển từ Chờ duyệt sang Đã duyệt khi nhân viên tiếp đón duyệt. Còn câu "người đặt hộ không được tự duyệt" | Câu đầu **không** (máy trạng thái); câu sau **là BR** (`BR-A04`) | Chuyển trạng thái thuộc SM mục 2; điều kiện chặn chuyển là quy tắc, SM chỉ dẫn mã |
| Số người đi cùng là số nguyên từ 1 đến 3 | **Không** — ràng buộc nội tại | Nhìn một thuộc tính là đủ; thuộc ERD cột Ràng buộc. Còn "số người đi cùng không được vượt mức của diện hạn chế" thì **là BR**, vì cần ngữ cảnh |
| Nút "Gửi yêu cầu" bị ẩn khi hết lượt | **Không** — giải pháp màn hình | Quy tắc gốc là `BR-A01`; việc ẩn nút là cách `/ba-detail` hiện thực |
| Hệ thống báo "Bạn đã hết lượt hẹn trong tuần" | **Không** — câu thông báo | Thuộc prototype hoặc danh mục message |
| 90% lịch hẹn được đặt trực tuyến sau 3 tháng | **Không** — mục tiêu | `OBJ-01` của BRD |
| Nhân viên tiếp đón được phép duyệt lịch (key `lich_hen.approve`) | **Không** — phân quyền | Ma trận tác nhân × UC ở lớp 5. Còn "lịch phải được nhân viên tiếp đón duyệt trước ngày hẹn" thì **là BR** |
| Bấm duyệt hai lần chỉ ghi một lần | **Không** — cơ chế kỹ thuật | `SM-04`, `GS-xx` về giao dịch; không có chủ thể nghiệp vụ, không có căn cứ nghiệp vụ |

## Ranh giới với lớp kề

Bảng đầy đủ và các cặp hay nhầm ở [`ba-overview/reference/ranh-gioi-cac-lop.md`](../ba-overview/reference/ranh-gioi-cac-lop.md). Dưới đây chỉ nêu **phía của lớp 6** và dòng cần mở.

| Cặp (dòng trong `ranh-gioi-cac-lop.md` mục 2) | Phía của lớp 6 |
|---|---|
| **BRD mục 8 ↔ BR** | BR phát biểu từng quy tắc; BRD mục 8 chỉ đếm nhóm và trỏ file này. Số đếm ở BRD là bản chép, **nguồn là Thống kê của BR** |
| **Quy trình ↔ BR** | BR giữ câu đúng bất kể đang ở bước nào. `GS-xx` và điểm kiểm soát ở Quy trình mục 9 là **ứng viên**; câu chỉ có nghĩa trong trình tự thì ở lại lớp 2 |
| **ERD ↔ BR** | ERD thể hiện ràng buộc ở dạng dữ liệu (bản số, `UK`, `*`, `◐`, `R-xx`), BR phát biểu nội dung. Ràng buộc dữ liệu nào đến từ quy tắc nghiệp vụ thì BR có mã, và ERD dẫn mã đó ở cột Nguồn sau lượt điền ngược — một trường, một quan hệ, một `R-xx` có thể dẫn nhiều BR. BR không chép lại dạng dữ liệu, mà dẫn tên bảng, trường hoặc `R-xx` |
| **Tách nhiệm** (hàng riêng ở mục 1) | **Nội dung** cặp thao tác không được cùng một người nằm ở BR, nguồn là Quy trình mục 2 "Tách nhiệm bắt buộc" và điểm kiểm soát mục 9 loại Tách nhiệm. ERD `R-xx` loại Tách nhiệm chỉ là phép kiểm dữ liệu dẫn BR; SM ở cột Điều kiện và UCD mục 1.2 dẫn BR sau lượt điền ngược |
| **Máy trạng thái ↔ BR** | BR là **nội dung** của điều kiện; ô Điều kiện ở SM chỉ dẫn mã kèm tên ngắn. Chuyển trạng thái là việc của SM, BR không mô tả chuyển |
| **Quy trình ↔ Use case** và hàng "Màn hình, route, nhãn, câu thông báo, API" ở mục 1 | BR không nêu màn hình, nút, API, câu thông báo — `00_quy_uoc_chung` mục 7 |
| Hàng `CH-xx` ở mục 1 | BR ⚙️ dẫn `CH-xx`, không ghi con số trần; BR không định nghĩa tham số |

## Nguyên tắc

**1. BR là nơi *nội dung* quy tắc được phát biểu, một lần duy nhất.** Mọi lớp khác chỉ dẫn `BR-{nhóm}{nn}` kèm tên ngắn. Thấy mình đang viết lại một ràng buộc mà ERD đã có, hoặc một quy trình mà Quy trình đã có, thì thay bằng một dòng dẫn hoặc bỏ ứng viên đó đi (kèm lý do ở bảng ứng viên đã loại).

**2. Bóc từ nguồn, không sáng tác.** Quy tắc có điều khoản nêu thẳng thì ghi điều, khoản, điểm. Quy tắc là kết luận của người viết từ điều khoản thì ghi **suy luận** và mức ❓. Quy tắc không có nguồn nào thì ghi `[CẦN BA CHỐT]`. Ba loại này **không trộn lẫn** trong một ô: người đọc phải nhìn là biết đâu là luật, đâu là điều người viết đoán. Cách phân biệt ở [`reference/loai-va-cuong-che.md`](reference/loai-va-cuong-che.md) mục 4.

**3. Một mã, một quy tắc; một quy tắc, một mức.** Câu nối hai nghĩa vụ bằng "và" thì tách hai mã. Một quy tắc cần hai mức cưỡng chế khác nhau cũng là dấu hiệu quy tắc ghép — tách, hoặc chuyển thành bảng quyết định.

**4. Số liệu cấu hình không viết trần.** Quy tắc ⚙️ dẫn `CH-xx`. Con số cố định (🔒) — do luật hoặc do `D-xx` đã BA chốt — thì ghi số kèm biên và căn cứ ngay trong câu. Khi cần `CH-xx` mà Quy trình mục 6 chưa có, ghi ❓ và một dòng vào Điểm cần chốt đề nghị bổ sung ở lớp 2 — lớp 6 không tự cấp `CH-xx`.

**5. Chưa điền ngược thì chưa xong.** Bộ BR chưa điền ngược thì lớp 1, 2, 3, 4, 5 còn dẫn luật trần, không truy vết được sang đây. Lượt này chạy **sau** reviewer độc lập. Thủ tục ở [`reference/gom-ung-vien-va-dien-nguoc.md`](reference/gom-ung-vien-va-dien-nguoc.md).

## Mã và tên

Hệ mã chung, quy tắc "duy nhất, không dùng lại", cách ghi mã đã bỏ, cách dẫn **mã kèm tên ngắn**: theo [`00_quy_uoc_chung.md`](../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 4. Phần riêng của lớp 6:

| Việc | Quy ước |
|---|---|
| Mã quy tắc | `BR-{chữ nhóm}{2 số}`, ví dụ `BR-A01` (mã minh họa). Chữ nhóm là **một chữ cái in hoa**, mỗi nhóm một chữ, đặt theo khối nghiệp vụ. BRD mục 8 ở lượt đầu là `chờ lớp 6`; chữ nhóm do lớp 6 đặt và lớp 6 điền vào BRD mục 8 ở lượt điền ngược, nên không có chuyện "khớp với BRD" |
| Số thứ tự | Tăng dần trong nhóm, bắt đầu `01`, không nhảy cách để dành. Quá `99` quy tắc trong một nhóm thì tách nhóm, không dùng ba chữ số |
| Không đánh lại mã | Mã đã phát hành (đã `Đã duyệt` hoặc đã được lớp khác dẫn) **giữ nguyên** dù chèn thêm quy tắc cùng chủ đề — quy tắc mới lấy số kế tiếp ở cuối nhóm, đặt cạnh quy tắc liên quan trong bảng cũng được |
| Sửa quy tắc | Đổi chữ mà không đổi nghĩa thì giữ mã. **Đổi nghĩa** (đổi chủ thể, đổi mức, đổi điều kiện, đổi loại) thì bỏ mã cũ, cấp mã mới — **chỉ áp cho mã đã phát hành** (đã `Đã duyệt` hoặc đã được lớp khác dẫn). Mã chưa phát hành thì sửa tại chỗ. Ngoại lệ không phải đổi nghĩa: BA chốt một quy tắc ❓ thì **giữ mã** và điền mức thật (và loại, nếu đang phân vân ĐN hay HV), vì ❓ là "chưa chốt mức" chứ không phải một mức khác, và BR ❓ chưa điền ngược nên chưa nơi nào dẫn mã |
| Mã đã bỏ | Ghi ở đầu bảng nhóm: *Các mã BR-B04, BR-B09 đã bỏ, không dùng lại.* Bảng đã phát hành thì không xóa dòng, đánh ⊘ ở ô Nội dung |
| Tên nhóm | Danh từ nghiệp vụ, đúng thuật ngữ ở BRD mục 5 hoặc Quy trình mục 1.1: *A — Lịch hẹn*, không phải *A — Các quy tắc liên quan đến lịch hẹn* |
| Tên ngắn của một quy tắc | Dùng khi dẫn ở lớp khác: `BR-A01 Tối đa CH-01 lịch hẹn mỗi tuần` (chép đúng bảng mã chuẩn của `vi-du-xuyen-suot.md`). Viết **trong ô Mã, dòng thứ hai**, chữ nghiêng, để mọi nơi dẫn đều chép đúng một chuỗi. Dài không quá khoảng tám chữ; không có mã đứng trơ trong tài liệu khác |
| Bảng quyết định | **Không có mã riêng.** Bảng gắn vào một mã BR và mang tên `Bảng quyết định BR-A0x — …` |
| Câu hỏi mở | `Q-BR01`, `Q-BR02`… theo `00_quy_uoc_chung` mục 4 (`Q-{lớp}nn`). Tiền tố `BR` để không lẫn với `R-xx` của ERD và với chữ nhóm |
| Rủi ro | `RK-nn` theo `00_quy_uoc_chung` mục 4 |

## Tìm căn cứ

Bốn bước tìm, các giá trị `n/a`, `chưa chốt (<ai>)`, `[CẦN BA CHỐT]`, câu hỏi mở và giả định: theo [`so-cu-va-gia-dinh.md`](../ba-overview/reference/so-cu-va-gia-dinh.md). Lớp 6 khác các lớp kia ở chỗ **nguồn chính là văn bản gốc**, nên có thêm ba điều riêng.

| Nguồn đặc thù | Cách dùng |
|---|---|
| **Văn bản pháp luật, chính sách đầu vào `/ba-init`, đọc toàn văn** | Nguồn chính của cột `Căn cứ`. Dẫn đúng `{Văn bản viết tắt} Đ{điều}.{khoản}.{điểm}`. Câu có **phải · không được · chỉ được · cấm · tối đa · tối thiểu · trong thời hạn · được tính bằng · là** là câu nghi là quy tắc. Văn bản đã rà mà không sinh BR thì ghi kết luận ở 1.2 |
| **Ứng viên từ lớp 1–5** | Căn cứ bước 1 của bốn bước. BR sinh từ ứng viên dẫn **chính ứng viên** (`GS-06`, `D-09`, `QT_DA1_LichHen mục 9 điểm 3`) và, nếu ứng viên đó có văn bản gốc, dẫn luôn văn bản ấy. Cách gom ở [`reference/gom-ung-vien-va-dien-nguoc.md`](reference/gom-ung-vien-va-dien-nguoc.md) |
| **Quy tắc suy luận** | Không có điều khoản nêu thẳng nhưng người viết suy ra từ điều khoản khác: căn cứ ghi `Suy luận từ <điều khoản>` kèm một cụm nói bước suy, mức ghi ❓, và có một dòng `Q-BR…` với đề xuất mặc định. Không dùng 🔒 cho quy tắc suy luận |

Biên bản họp, chỉ đạo miệng, thông lệ của trung tâm không phải căn cứ pháp lý; nếu đó là nguồn duy nhất thì quy tắc ở mức ❓ cho tới khi có dòng chốt và người chốt.

## Review độc lập — bắt buộc

Viết xong, tự soát xong, **luôn** gọi reviewer độc lập trước khi chạy lượt điền ngược và trước khi chuyển `Chờ review`. Nguyên tắc giao việc và **prompt chung** nằm ở [`ba-overview/reference/review-doc-lap.md`](../ba-overview/reference/review-doc-lap.md); skill này chỉ cung cấp khối `<VIỆC 3 RIÊNG CỦA LỚP>` để dán vào chỗ tương ứng. Với lớp 6, thay `<đường dẫn template>` bằng `2-ba-overview/templates/6-business-rules/business_rules.md`, `<create-xxx>` bằng `create-br`, và ở nguồn đối chiếu liệt kê **đủ năm lớp trước** cùng thư mục văn bản gốc, vì việc kiểm ứng viên và chuẩn bị điền ngược cần mở các file đó. Dòng checklist "Soát trước khi đóng" mà prompt chung bảo chạy là **nhóm "Trước review"**.

```text
   Việc 3 riêng của lớp 6 — Business rule:
   - Quy tắc ghép: đọc từng dòng cột Nội dung, tìm câu nối hai nghĩa vụ hoặc hai mức bằng "và",
     "đồng thời", "trừ khi" mà đáng ra là hai mã. Tìm phát biểu nhắc màn hình, nút, route, thông báo,
     hoặc viết theo trình tự ("sau khi", "tiếp theo", "bước").
   - Ràng buộc nội tại bị lặp: đối chiếu từng quy tắc với cột Ràng buộc và mục 5 của ERD; quy tắc
     nào chỉ nhìn một thuộc tính là đủ thì báo. Quy tắc ⚙️ ghi con số trần thay vì CH-xx; CH-xx
     dẫn tới có tồn tại ở Quy trình mục 6 không; mã trạng thái, tên tác nhân có khớp nguồn không.
   - Bảng quyết định: liệt kê miền giá trị từng cột điều kiện, nhân ra số tổ hợp, kiểm từng tổ hợp
     có đúng một dòng khớp (chính sách U) hoặc dòng đầu khớp là dòng mong đợi (chính sách F);
     khoảng số liền kề, không hở, không chồng. Chính sách trúng có được khai và có hợp với bảng không.
   - Ứng viên lớp 2–5: tự gom lại ứng viên từ GS-xx, cột Căn cứ của bảng bước, bảng Trường hợp biên
     (xử lý Chặn, Cảnh báo), dòng "Điểm kiểm soát bắt buộc" cuối mỗi quy trình và mục 9, D-xx,
     CH-xx, cột Điều kiện và dòng "Cấm:" của SM, R-xx có căn cứ pháp lý riêng, ràng buộc dạng dữ liệu
     của ERD mục 4 (bản số quan hệ, UK) có nguồn nghiệp vụ, cột Ghi chú của
     use_case_list, cột Căn cứ vai trò và bảng tách nhiệm của UCD, mục 10 của Quy trình; mỗi ứng
     viên phải thành BR hoặc nằm ở bảng ứng viên đã loại kèm lý do. Báo ứng viên nào mất dấu.
   - Chuẩn bị lượt điền ngược (lượt này chạy SAU review nên lớp 1, 2, 3, 4, 5 chưa có mã BR; đừng báo
     "chưa điền ngược"): mở cột Căn cứ của Quy trình, cột Nguồn của từ điển dữ liệu (kể cả dòng khóa
     ngoại mang bản số, UK) và của R-xx ở ERD, cột Điều kiện của SM, UCL cột Ghi chú, UCD cột Căn cứ
     vai trò và bảng tách nhiệm; chỗ nào đang dẫn điều khoản trần mà bộ BR có BR tương
     ứng nhưng cột Áp tại của BR đó chưa liệt kê chỗ ấy thì báo (lượt điền ngược sẽ sót). Tên ngắn
     ở ô Mã mỗi BR có duy nhất, ngắn gọn không; BR ❓ có ghi chỗ điền ngược ở Điểm cần chốt không.
   - Quy tắc suy luận: tìm quy tắc không có điều khoản nêu thẳng và không có `D-xx` đã BA chốt mà
     vẫn ghi 🔒 hoặc ⚙️, hoặc căn cứ ghi như thể là luật. Kiểm mức: 🔒 chỉ khi hệ thống chặn,
     không ai bỏ qua; ⚠️ chỉ cho văn bản hoặc quyết định chỉ khuyến nghị.
   - Số đếm ở khối giới thiệu và Thống kê có khớp nhau không (BRD mục 8 chưa điền ở thời điểm này).
   - Nhóm checklist "Sau review" không thuộc phạm vi review.
```

---

# Soát trước khi đóng bộ Business Rule

Hai nhóm: **Trước review** (tự soát, rồi reviewer chạy lại) và **Sau review** (kiểm ở cổng ra, sau lượt điền ngược).

## Trước review

Cấu trúc và template:

- [ ] Mọi mục của template có mặt hoặc có ghi vì sao bỏ, và các khối của `00_quy_uoc_chung` mục 3 và 6 đã điền theo template (`00_quy_uoc_chung.md` mục 6): câu "không chứa gì", ba dòng Dự án · Phân hệ / Người soạn · Người review · Người duyệt / Mức mật, bảng Phê duyệt, Danh sách điểm cần chốt (cột `Mã`, `Người chốt`), Rủi ro còn lại `RK-nn`, Điểm tạm hoãn `TH-nn` — không để `{{…}}`, không bỏ khối (không có nội dung thì ghi *Không có*).
- [ ] Tên file đúng `BR_{MÃ DỰ ÁN}_{PHẠM VI}_vNN.md`; mã tài liệu ở bảng thông tin khớp tên file.
- [ ] Số đếm ở khối giới thiệu khớp Thống kê (bản chép — nguồn là Thống kê).

Phát biểu:

- [ ] Mỗi mã một quy tắc; không câu nào nối hai nghĩa vụ độc lập bằng "và".
- [ ] Câu theo mẫu RuleSpeak: có chủ thể là khái niệm nghiệp vụ, có **phải · không được · chỉ được · là · được tính bằng**; không "nên", "có thể", "cần", "thường", "kịp thời".
- [ ] Không câu nào nhắc màn hình, nút, route, API, câu thông báo, hay viết theo trình tự (`sau khi`, `bước`).
- [ ] Giá trị liệt kê viết **tên tiếng Việt**; tên thực thể, tên tác nhân đúng chữ ở ERD, Quy trình.
- [ ] Không quy tắc nào chỉ lặp ràng buộc nội tại một thuộc tính của ERD.

Loại và mức:

- [ ] Mỗi quy tắc có đúng một loại (ĐN hoặc HV) qua phép thử "làm trái được không", và đúng một mức. ĐN không mang 🔑 hay ⚠️.
- [ ] 🔒 chỉ cho quy tắc mà hệ thống chặn, không ai bỏ qua, có căn cứ là luật hoặc `D-xx` đã BA chốt; ⚠️ chỉ cho văn bản hoặc quyết định chỉ khuyến nghị.
- [ ] Quy tắc ⚙️ dẫn `CH-xx` có thật ở Quy trình mục 6; không con số trần. Quy tắc 🔒 có số thì số kèm biên và căn cứ.
- [ ] Quy tắc 🔑 nêu **ai** được mở ngoại lệ; quy tắc ⚠️ nêu cảnh báo cái gì.
- [ ] Quy tắc **suy luận** ghi `Suy luận từ …`, mức ❓, có `Q-BR…`; không ô nào ghi suy luận như thể là luật.
- [ ] Thống kê: mỗi quy tắc đếm đúng một cột loại và một cột mức (lựa chọn của skill).

Bảng quyết định:

- [ ] Mỗi bảng gắn một mã BR, có tên và chính sách trúng; một bảng một loại kết quả.
- [ ] Đã liệt kê miền từng cột điều kiện và kiểm đủ tổ hợp; chính sách U không chồng lấn; F có dòng bắt mọi trường hợp còn lại hoặc đã chứng minh không cần.
- [ ] Ngưỡng trong bảng là `CH-xx`; khoảng số liền kề, không hở, không chồng.

Căn cứ và ứng viên:

- [ ] Mọi quy tắc có căn cứ; không có thì ❓ kèm `Q-BR…`. Mã luôn đi kèm tên ngắn khi dẫn; điểm kiểm soát dẫn dạng `<mã tài liệu QT> mục 9 điểm n`.
- [ ] Mỗi `GD-xxxx` bôi đỏ đậm gạch chân, có dòng trong `assumption_log.md`; không giả định nào cho nội dung đã có nguồn.
- [ ] Mỗi ứng viên từ lớp 1–5 (kể cả cột Căn cứ bảng bước, bảng Trường hợp biên, dòng "Điểm kiểm soát bắt buộc", dòng "Cấm:" của SM, cột Căn cứ vai trò của UCD, `R-xx` và ràng buộc dạng dữ liệu có nguồn nghiệp vụ của ERD) đã thành BR hoặc nằm ở bảng ứng viên đã loại với lý do riêng; mỗi `CH-xx` có ít nhất một BR ⚙️ dẫn tới hoặc có lý do.
- [ ] Mỗi văn bản ở 1.2 có vai trò; văn bản không sinh quy tắc có kết luận rà soát kèm lý do.

Áp tại và phụ lục:

- [ ] Cột `Áp tại` không trống: có bước quy trình, chuyển trạng thái hoặc trường ERD; không áp được vào đâu thì ghi lý do hoặc `chưa chốt (<ai>)`. Cột liệt kê **mọi** chỗ lớp 1, 2, 3, 4, 5 đang dẫn trần (để lượt điền ngược không sót).
- [ ] Phụ lục A, B có nội dung hoặc ghi *Không có*; mỗi nghĩa vụ ở Phụ lục B lấy từ Quy trình mục 10 (đã điền ở lớp 5), có BR và quy trình.
- [ ] Còn `[CẦN BA CHỐT]` thì không chuyển `Chờ review`; còn ❓, `chưa chốt (`, hoặc giả định chưa chốt (trực tiếp hay kế thừa) thì không chuyển `Đã duyệt` — `00_quy_uoc_chung.md` mục 12; chạy script kiểm trước mỗi lần chuyển trạng thái.

## Sau review — kiểm ở cổng ra

- [ ] **Đã gọi reviewer độc lập** và xử lý hết phát hiện, **trước** lượt điền ngược.
- [ ] Đã điền ngược lớp 1 (mục 8, mục 12 cột Business rule), lớp 2 (mọi cột và dòng Căn cứ, bảng bước, Trường hợp biên, mục 9, dòng BR ở bảng Nguồn mục 1), lớp 3 (cột Nguồn của từ điển dữ liệu mục 4, kể cả dòng khóa ngoại mang bản số, và cột Nguồn của `R-xx` mục 5), lớp 4 (cột Điều kiện), lớp 5 (UCL cột Ghi chú, UCD cột Căn cứ vai trò và bảng tách nhiệm 1.2); BR còn ❓ chưa điền ngược.
- [ ] Chỗ điền ngược ở ERD: một ô nhiều mã BR cách `·`; dòng khóa ngoại mang bản số và `UK` có mã BR khi nguồn là quy tắc nghiệp vụ.
- [ ] Mỗi chỗ điền ngược **thêm** mã BR kèm tên ngắn, **giữ** điều khoản; mỗi tài liệu bị sửa có dòng trong Version control theo `00_quy_uoc_chung.md` mục 10.
- [ ] Số đếm ở BRD mục 8 khớp Thống kê; đã đối chiếu mọi bản chép với nguồn.
- [ ] Đã xóa **mọi** chú thích `<!-- … -->` của template trong file dự án (không chỉ khối HƯỚNG DẪN), không còn `{{…}}`.
