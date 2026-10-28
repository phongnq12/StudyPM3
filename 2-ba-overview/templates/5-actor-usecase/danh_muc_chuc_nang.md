# TEMPLATE — DANH MỤC CHỨC NĂNG

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `2-ba-overview/5-actor-usecase/danh-muc-chuc-nang.md` (một file cho cả dự án, không theo mẫu tên
  {LOẠI}_{MÃ}_{PHẠM VI}). Viết ở đợt 5b của /ba-overview (`--lop cat-cn`), sau UCL lớp 5, trước lớp 6.
- Quy ước chung: ../00_quy_uoc_chung.md (mục 8.2 mã UC, module trải nhiều nền tảng).
- Chức năng CN-xx là đơn vị làm chi tiết ở /ba-detail: một nhánh `chuc-nang/CN-xx-<slug>`, một bộ UC chi tiết, prototype,
  đặc tả màn, hai gate G1, G2.
- Cột của mục 1, mục 2 giữ đúng tên: `kit/tools/ba-verify/gate-check.mjs --may G0` đọc hai bảng này.
- Xóa khối hướng dẫn này và thay dòng ví dụ `{{…}}` bằng nội dung dự án.
-->

# DANH MỤC CHỨC NĂNG — {{DỰ ÁN}}

> **{{n}} chức năng** cắt từ **{{n}} module WBS** của [danh sách use case](UCL_{{MÃ}}_{{PHẠM VI}}_v{{NN}}.md), phủ **{{n}} use case** và **{{n}} quy trình** của bản đồ quy trình đã chốt.
> Mỗi chức năng là **đúng một module WBS** (`{{MÃ}}.<NỀN TẢNG>.<MODULE>`); mỗi use case thuộc đúng một chức năng.
> Tài liệu **không** chứa nội dung use case, luồng, màn hình — việc của `/ba-detail CN-xx`.

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">YYYY-MM-DD</span>** | <span style="color:green">{{PIC}}</span> | <span style="color:green">- Khởi tạo tài liệu.</span> |

---

## 1. Danh sách chức năng

<!--
- CN: CN-01, CN-02… theo thứ tự làm. Không đánh số lại sau G0.
- Module WBS: đúng một module. Module trải nhiều nền tảng ghi đủ các mã cùng số module, cách nhau `;`
  (`<MA>.WEB.03; <MA>.JOB.03` là một module).
- UC (mã WBS): số UC kèm mã các chức năng WBS cấp 4 trong module, ví dụ `24 UC — <MA>.WEB.03.01–.05`. Danh sách UC
  chính xác lấy từ UCL theo tiền tố module; không chép từng mã.
- QT liên quan: mã QT-nn có bước do UC của chức năng phủ. Khớp hai đầu với mục 2.
- Thực thể chính: tên bảng ERD (backtick) mà UC của chức năng tạo hoặc đổi trạng thái.
- Phụ thuộc CN: CN phải làm trước (dùng thực thể, trạng thái, kết quả do CN đó tạo). `—` khi không phụ thuộc.
- Thứ tự làm: số nguyên; CN phụ thuộc có thứ tự nhỏ hơn.
- Dải ID: dải số cho Q, ASM, PH, SCR của chức năng. Mặc định CN-01 `101–150`, CN-02 `151–200`, …; tầng dự án dùng số
  dưới 101. Không chồng nhau.
- Nhánh: `chuc-nang/CN-xx-<slug>`; `<slug>` là tên ngắn không dấu, dùng lại cho thư mục `CN-xx-<slug>` ở 3-ba-detail.
-->

| CN | Tên | Module WBS | UC (mã WBS) | QT liên quan | Thực thể chính | Phụ thuộc CN | Thứ tự làm | Dải ID | Nhánh |
|---|---|---|---|---|---|---|:-:|---|---|
| {{CN-01}} | {{Quản lý bộ tiêu chí}} | {{<MA>.WEB.01}} | {{12 UC — <MA>.WEB.01.01–.03}} | {{QT-01}} | {{`Bo_Tieu_Chi`}} | {{—}} | {{1}} | {{101–150}} | {{chuc-nang/CN-01-bo-tieu-chi}} |

---

## 2. Quy trình và chức năng chạm tới

<!--
- Mỗi QT-nn của bản đồ quy trình đã chốt (1-ba-init/0-dau-vao/ban-do-quy-trinh/ban-do-quy-trinh.md mục 1) một dòng.
- CN chạm tới: mọi CN có UC phủ bước của QT. Khớp hai đầu với cột "QT liên quan" của mục 1.
- QT không chạm CN nào (toàn bước thủ công, ngoài phạm vi): `—`, cột Ghi chú ghi lý do kèm nguồn.
-->

| QT | Tên | CN chạm tới | Ghi chú |
|---|---|---|---|
| {{QT-01}} | {{Ban hành bộ tiêu chí kiểm tra}} | {{CN-01}} | {{}} |

---

## 3. Quy tắc chia

| # | Quy tắc | Kiểm bằng |
|---|---|---|
| 1 | Một CN = một module WBS của UCL. Không gộp hai module, không tách một module ra hai CN | `gate-check --may G0` |
| 2 | Mỗi UC của UCL thuộc đúng một CN (qua module); không UC nào ngoài danh mục | `gate-check --may G0` |
| 3 | CN quá lớn (trên 30 UC) → cảnh báo; đề xuất tách module ở lớp 5 (sửa UCL, chạy lại đợt 5) — không tách CN trong cùng module | `gate-check --may G0` (cảnh báo) |
| 4 | Phụ thuộc CN không vòng; thứ tự làm sau mọi CN mình phụ thuộc | `gate-check --may G0` |
| 5 | Mỗi QT ghi các CN chạm tới; hai đầu mục 1 ↔ mục 2 khớp | `gate-check --may G0` |
| 6 | Dải ID có, từ 101, không chồng nhau | `gate-check --may G0` |
| 7 | Cách chia, thứ tự làm do BA chốt (ghi **BA chốt dd/mm/yyyy** ở Version control) | Reviewer G0 |

---

## 4. Câu hỏi cần chốt

| Mã | Câu hỏi | Kịch bản | Đề xuất mặc định | Người chốt | Quyết định |
|---|---|---|---|---|---|
| {{Q-C01}} | {{}} | {{}} | {{}} | {{}} | {{}} |

---

## 5. Nguồn

| Tài liệu | Dùng cho |
|---|---|
| `2-ba-overview/5-actor-usecase/UCL_{{MÃ}}_{{PHẠM VI}}_v{{NN}}.md` mục 3 | Module, UC |
| `1-ba-init/0-dau-vao/ban-do-quy-trinh/ban-do-quy-trinh.md` mục 1 | Danh sách QT đã chốt |
| `2-ba-overview/2-business-process/QT_{{MÃ}}_{{PHẠM VI}}_v{{NN}}.md` | Bước, chuyển giao giữa QT |
| `2-ba-overview/3-erd/ERD_{{MÃ}}_{{PHẠM VI}}_v{{NN}}.md` | Thực thể chính |
