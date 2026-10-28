# Checklist đợt 1 — use case chi tiết

**Bổ sung** cho checklist "Soát trước khi đóng" của skill `create-uc` (đọc cùng nhau; create-uc thắng khi khác). Agent
tự kiểm trước khi báo xong; reviewer chấm ở G1 (`ba-gate G1 CN-xx`). Cột "Máy": `Có` = kiểm được bằng script (gate-check,
check-all; chưa có script thì reviewer chấm thay), `Không` = phải đọc. Mức: `Chặn` = còn thì G1 KHÔNG ĐẠT.

| # | Kiểm | Máy | Mức |
| --- | --- | --- | --- |
| uc-1 | Mỗi dòng tính năng của module trong `UCL_…` (mã `<MA>.<NỀN TẢNG>.<MODULE>.cc.tt`, không ⊘) có đúng một file UC; không có file UC ngoài module | Có | Chặn |
| uc-2 | `id` trong phần đầu file = cột `No` của UCL; `ten` = cột Tính năng; tên file `<mã UC>-<slug>.md` trong `3-ba-detail/use-case/CN-xx-<slug>/` | Có | Chặn |
| uc-3 | Agent đã tự soát hết checklist "Soát trước khi đóng" của create-uc, kể cả chín câu soát riêng cho từng UC | Không | Chặn |
| uc-4 | Review độc lập theo create-uc (`reference/review-doc-lap.md`) đã chạy cho mọi UC, agent mới, chỉ nhận đường dẫn; phát hiện Chặn, Nặng đã sửa hoặc có lý do không sửa; ghi ở nhật ký điều phối | Không | Chặn |
| uc-5 | Tác nhân chính khớp cột Actor của UCL và ma trận tác nhân × use case (`UCD_…` mục 4); tên vai đúng `ACT-nn` ở `UCD_…` mục 1 | Có | Chặn |
| uc-6 | UC có `Permission key` ở UCL (key thật hoặc `n/a` có lý do), không còn `chưa chốt`; mục 2 "Phạm vi dữ liệu" không rộng hơn quyền | Có | Chặn |
| uc-7 | `Kết quả chính` dùng enum đúng ERD; chuyển trạng thái có trong `SM_…` (`SM mục n`); trạng thái trước liệt kê đủ theo bảng chuyển | Có | Chặn |
| uc-8 | Thực thể, trường dẫn đúng tên bảng, tên trường ERD (`` `Bang.truong` ``) | Có | Chặn |
| uc-9 | Các bước khớp bước quy trình mà UCL cột Ghi chú dẫn (`QT-nn bước n`); UC không thêm bước nghiệp vụ mà quy trình không có | Không | Chặn |
| uc-10 | Mọi BR có cột "Áp tại" trỏ tới UC (hoặc bước QT của UC) xuất hiện ở cột Sở cứ; mọi mã BR, `D-xx`, `CH-xx`, điều khoản được dẫn có thật | Có | Chặn |
| uc-11 | Không nghiệp vụ mới: mọi bước kiểm tra, quyết định, ghi, gửi đi có sở cứ trong lớp 1–6, `GD-xxxx`, `ASM-xxx` hoặc `[CẦN BA CHỐT]` | Không | Chặn |
| uc-12 | Không con số tự điền: con số dẫn BR, `CH-xx` đã chốt, hoặc `[CẦN XÁC NHẬN]` | Không | Chặn |
| uc-13 | Giả định: `GD-xxxx` có dòng trong `2-ba-overview/assumption_log.md`; `ASM-xxx` trong dải CN, có dòng ở `chuc-nang/CN-xx/open-questions.md` mục 2; cả hai bôi đỏ đậm gạch chân | Có | Chặn |
| uc-14 | Mỗi `[CẦN BA CHỐT]` có Q trong `chuc-nang/CN-xx/open-questions.md`; còn thì `trang_thai` vẫn `nhap` | Có | Chặn |
| uc-15 | Cột `Màn hình`, `Message thông báo` của bước có màn hoặc thông báo ghi `chưa chốt (prototype)` (trước đợt 2); không route, chuỗi tự đặt | Có | Nên sửa |
| uc-16 | Sau đợt 2 (trước G2): không còn `chưa chốt (prototype)`; route có trong `dang-ky.js`, chuỗi có trong `thong-bao.js` của CN | Có | Chặn |
| uc-17 | Bước `→ gọi UC` trỏ mã có trong UCL; UC thuộc CN khác dẫn bằng mã, không chép nội dung | Có | Nên sửa |
| uc-18 | Ghi tạm khai ở câu soát #6 có UC tác nhân hệ thống dọn khi quá hạn trong UCL, hoặc Q | Không | Chặn |
| uc-19 | UC presales chưa có căn cứ pháp lý (`1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) mà UC này phủ có Q chặn G1 | Không | Chặn |
| uc-20 | `chuc-nang/CN-xx/trace.csv` có dòng mỗi UC (`lien_ket` tới bảng ERD, `SM mục n`, BR, QT); mọi ID mới trong dải; không còn mã giữ chỗ `[Q-T<n>]`, `[ASM-T<n>]`, `[PH-T<n>]` | Có | Chặn |
| uc-21 | Đủ heading của TEMPLATE_UC; đã xóa khối nền xám, giữ dòng link skill | Có | Nên sửa |
| uc-22 | Thuật ngữ đúng `du-an/glossary.md` — máy: `term-check` | Có | Nên sửa |
