# DANH MỤC CHỨC NĂNG — Quản lý kho căng tin (PM3CSCN) QuanLyKhoCangTin

> **3 chức năng** cắt từ **3 module WBS** của [danh sách use case](UCL_PM3CSCN_QuanLyKhoCangTin_v01.md), phủ **90 use case** và **6 quy trình** của bản đồ quy trình đã chốt.
> Mỗi chức năng là **đúng một module WBS** (`PM3CSCN.<NỀN TẢNG>.<MODULE>`); mỗi use case thuộc đúng một chức năng.
> Tài liệu **không** chứa nội dung use case, luồng, màn hình — việc của `/ba-detail CN-xx`.

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">2026-10-30</span>** | <span style="color:green">phongnq12</span> | <span style="color:green">- Khởi tạo tài liệu (/ba-overview đợt 5b, `--lop cat-cn`) từ UCL v00, QT v02, ERD v02, SM v01, BRD v02 và câu trả lời của BA (RQ-187).<br>- 3 chức năng theo 3 module WBS 10, 15, 09; 90 use case (không đếm 2 use case ⊘ `PM3CSCN.WEB.10.01.10`, `PM3CSCN.WEB.10.01.20`); thứ tự làm đề xuất CN-01 → CN-02 → CN-03.<br>- **BA chốt 30/10/2026** (RQ-205 → RQ-210): cách chia 3 CN, slug nhánh (RQ-205), thứ tự làm (RQ-206), ba khóa ngoại ngược là chuyển giao (RQ-207), thứ tự chức năng cấp 4 của CN-03 (RQ-208), dải ID (RQ-209), QT-01 chỉ CN-02 (RQ-210).</span> |

---

## 1. Danh sách chức năng

| CN | Tên | Module WBS | UC (mã WBS) | QT liên quan | Thực thể chính | Phụ thuộc CN | Thứ tự làm | Dải ID | Nhánh |
|---|---|---|---|---|---|---|:-:|---|---|
| CN-01 | Cấu hình danh mục hàng hóa và giá bán căng tin | `PM3CSCN.WEB.10; PM3CSCN.JOB.10` | 21 UC — `PM3CSCN.WEB.10.01`; `PM3CSCN.JOB.10.02` (không đếm 2 UC ⊘ `PM3CSCN.WEB.10.01.10`, `PM3CSCN.WEB.10.01.20` — RQ-190, RQ-193) | QT-02, QT-03 | `Mat_Hang`, `De_Xuat_Gia_Ban`, `De_Xuat_Gia_Ban_Dong`, `Gia_Ban_Lo`, `Tep_Dinh_Kem` (chứng từ giá bán lẻ của dòng đề xuất) | — (không phụ thuộc; đọc ngược `Lo` của module 09 và `Dong_Gia_Nhap` của module 15 là chuyển giao dẫn ERD tầng dự án, không tính phụ thuộc — RQ-207) | 1 | 101–150 | chuc-nang/CN-01-hang-hoa-gia-ban |
| CN-02 | Quản lý nhà cung cấp hàng hóa căng tin | `PM3CSCN.WEB.15` | 17 UC — `PM3CSCN.WEB.15.01`–`.03` | QT-01 | `Nha_Cung_Cap`, `Mat_Hang_Nha_Cung_Cap`, `Dot_Gia_Nhap`, `Dong_Gia_Nhap`, `Tep_Dinh_Kem` (tệp căn cứ đợt giá nhập); lập, xóa `De_Xuat_Gia_Ban` Nháp ở QT-01 bước 10–11 | CN-01 — danh mục cung ứng chỉ nhận mặt hàng có trong `Mat_Hang` (QT-01 bước 2, BRQ-08); khai, sửa giá nhập lập `De_Xuat_Gia_Ban` Nháp (QT-01 bước 10, RQ-190) | 2 | 151–200 | chuc-nang/CN-02-nha-cung-cap-gia-nhap |
| CN-03 | Quản lý kho căng tin | `PM3CSCN.WEB.09; PM3CSCN.JOB.09` | 52 UC — `PM3CSCN.WEB.09.01`–`.06`; `PM3CSCN.JOB.09.07`–`.08` | QT-02, QT-04, QT-05, QT-06 | `Kho`, `Phan_Cong_Kho`, `Mat_Hang_Kho`, `Phieu_Nhap_Kho`, `Lo`, `Ton_Kho_Lo`, `Bien_Dong_Ton`, `Phieu_Dieu_Chuyen`, `Phieu_Dieu_Chuyen_Dong`, `Bien_Ban_Kiem_Ke`, `Bien_Ban_Kiem_Ke_Dong`, `Thanh_Vien_Kiem_Ke`, `Canh_Bao`; ghi `Gia_Ban_Lo` khi duyệt phiếu nhập kho (QT-02 bước 11) | CN-01 — `Lo`, `Mat_Hang_Kho` trỏ `Mat_Hang`; duyệt phiếu nhập kho áp giá bán hiện hành qua `Gia_Ban_Lo` hoặc để lô chờ giá sang QT-03 (QT-02 bước 11–13) · CN-02 — phiếu nhập kho chọn `Nha_Cung_Cap` Đang hoạt động, lô lấy giá nhập mặc định từ `Dong_Gia_Nhap` (QT-01 mục Đầu ra kích hoạt, RQ-16) | 3 | 201–250 | chuc-nang/CN-03-kho-cang-tin |

**Cảnh báo CN-03 quá lớn.** CN-03 có 52 UC, trên ngưỡng 30 UC của một chức năng `/ba-detail` (mục 3 quy tắc 3). BA chọn giữ module `09` theo cây presales, không tách module, không tách CN [SRC: 0-inputs/answers-2026-10-29.md, RQ-187]. `/ba-detail CN-03` chia việc theo chức năng WBS cấp 4 trong CN: `PM3CSCN.WEB.09.01` (11 UC), `PM3CSCN.WEB.09.02` (12), `PM3CSCN.WEB.09.03` (10), `PM3CSCN.WEB.09.04` (9), `PM3CSCN.WEB.09.05` (2), `PM3CSCN.WEB.09.06` (4), `PM3CSCN.JOB.09.07` (3), `PM3CSCN.JOB.09.08` (1). Thứ tự làm các phần theo phụ thuộc dữ liệu: `PM3CSCN.WEB.09.04` → `PM3CSCN.WEB.09.05` → `PM3CSCN.WEB.09.01` → `PM3CSCN.WEB.09.02` → `PM3CSCN.WEB.09.03` → `PM3CSCN.WEB.09.06` cùng `PM3CSCN.JOB.09.07` → `PM3CSCN.JOB.09.08` [SRC: 0-inputs/answers-2026-10-30.md, RQ-208]. Dải ID giữ `201–250`, hết dải thì xin thêm từ phần dự phòng [SRC: 0-inputs/answers-2026-10-30.md, RQ-209]. Rủi ro tiến độ dồn vào một nhánh: UCL mục 8 RK-03.

**Đếm UC.** Số UC đếm theo cột `No` của UCL mục 3, bỏ dòng ⊘: module 09 có 52, module 10 có 21, module 15 có 17, tổng 90 — khớp UCL mục 2 [SRC: 2-ba-overview/5-actor-usecase/UCL_PM3CSCN_QuanLyKhoCangTin_v01.md, mục 2, mục 3].

**Cách suy phụ thuộc.** CN phụ thuộc là CN tạo thực thể mà UC của CN sau phải đọc khi ghi (khóa ngoại bắt buộc ở ERD v02 mục 3.1, 4) hoặc CN tạo kết quả là trigger của bước trong CN sau. Ba khóa ngoại đi ngược thứ tự làm — `De_Xuat_Gia_Ban_Dong.lo_id` → `Lo`, `Gia_Ban_Lo.lo_id` → `Lo`, `De_Xuat_Gia_Ban_Dong.dong_gia_nhap_id` → `Dong_Gia_Nhap` [SRC: 2-ba-overview/3-erd/ERD_PM3CSCN_QuanLyKhoCangTin_v03.md, mục 4.4] — là chuyển giao: CN-01 dẫn ID thực thể ở ERD tầng dự án, không định nghĩa lại, không tính phụ thuộc CN [SRC: 0-inputs/answers-2026-10-30.md, RQ-207]; tính là phụ thuộc thì sẽ có vòng CN-01 → CN-03 → CN-01 và CN-01 → CN-02 → CN-01. Thứ tự làm CN-01 → CN-02 → CN-03 [SRC: 0-inputs/answers-2026-10-30.md, RQ-206].

---

## 2. Quy trình và chức năng chạm tới

| QT | Tên | CN chạm tới | Ghi chú |
|---|---|---|---|
| QT-01 | Cập nhật nhà cung cấp và giá nhập | CN-02 | Bước người 1–5, 9 do UC `PM3CSCN.WEB.15.01`–`.03` phủ; bước hệ thống 10–11 lập, xóa `De_Xuat_Gia_Ban` Nháp (thực thể của CN-01) chạy trong UC `PM3CSCN.WEB.15.03.01` Khai đợt giá nhập, `PM3CSCN.WEB.15.03.03` Sửa dòng giá nhập — chuyển giao sang QT-03 (RQ-190; TRACE mục 6). QT-01 chỉ chạm CN-02; lập phiếu đề xuất giá bán là chuyển giao sang CN-01 [SRC: 0-inputs/answers-2026-10-30.md, RQ-210] |
| QT-02 | Nhập kho hàng hóa từ nhà cung cấp | CN-03, CN-01 | Bước 1, 3, 5, 7, 16 do UC `PM3CSCN.WEB.09.01` phủ (CN-03); bước 12 do `PM3CSCN.WEB.10.01.16` Lập phiếu đề xuất giá bán phủ (CN-01, điểm vào khác — RQ-193) [SRC: 2-ba-overview/5-actor-usecase/TRACE_PM3CSCN_QuanLyKhoCangTin_v01.md, mục 6] |
| QT-03 | Đề xuất và duyệt giá bán | CN-01 | Bước 1, 2, 3, 5, 10 do UC `PM3CSCN.WEB.10.01` phủ; bước 8 áp giá tới ngày hiệu lực do `PM3CSCN.JOB.10.02.01` (N-03) [SRC: 2-ba-overview/5-actor-usecase/TRACE_PM3CSCN_QuanLyKhoCangTin_v01.md, mục 6] |
| QT-04 | Điều chuyển hàng hóa giữa các kho | CN-03 | Bước 1, 3, 5, 9, 12, 14 do UC `PM3CSCN.WEB.09.02` phủ [SRC: 2-ba-overview/5-actor-usecase/TRACE_PM3CSCN_QuanLyKhoCangTin_v01.md, mục 6] |
| QT-05 | Kiểm kê tồn kho | CN-03 | Bước 1, 5, 6, 8, 10, 13 do UC `PM3CSCN.WEB.09.03` phủ [SRC: 2-ba-overview/5-actor-usecase/TRACE_PM3CSCN_QuanLyKhoCangTin_v01.md, mục 6] |
| QT-06 | Cảnh báo tồn kho và hạn sử dụng | CN-03 | Bước 4, 5, 9 do UC `PM3CSCN.WEB.09.06` phủ; quét cảnh báo do `PM3CSCN.JOB.09.07` (N-01, GD-0003); hạn mức cảnh báo đặt ở `PM3CSCN.WEB.09.04.03` (bản đồ quy trình bước 1, mục 1 dòng QT-06), `PM3CSCN.WEB.09.04.07` (UCL mục 3) |

UC không gắn QT (danh mục, tra cứu, tác vụ nền ngoài bản đồ): `PM3CSCN.WEB.09.04` Quản lý kho, `PM3CSCN.WEB.09.05` Quản lý phân công kho, `PM3CSCN.JOB.09.08` Đồng bộ dữ liệu kho (N-02, GD-0007) thuộc CN-03; tìm kiếm, xem, kết xuất mặt hàng của `PM3CSCN.WEB.10.01` thuộc CN-01 — quy trình mục 1 Ngoài phạm vi [SRC: 2-ba-overview/5-actor-usecase/UCL_PM3CSCN_QuanLyKhoCangTin_v01.md, mục 3 cột Ghi chú].

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
| Q-C01 | Chốt cách chia 3 CN theo 3 module WBS (CN-01 module 10, CN-02 module 15, CN-03 module 09)? | A: 3 CN đúng 3 module của UCL, CN-03 giữ 52 UC kèm cảnh báo (RQ-187). B: tách module 09 ở UCL rồi chạy lại đợt 5 — trái RQ-187 | A — theo RQ-187 và quy tắc 1, 3 ở mục 3 | BA (phongnq12) | ✅ 30/10/2026: RQ-205 — A: 3 CN theo 3 module |
| Q-C02 | Thứ tự làm CN-01 → CN-02 → CN-03 có đúng không? | A: tuần tự theo phụ thuộc dữ liệu — mặt hàng, giá bán (CN-01) là gốc; nhà cung cấp, giá nhập (CN-02) cần `Mat_Hang`; kho (CN-03) cần mặt hàng, nhà cung cấp, giá nhập, giá bán. B: sau CN-01, làm CN-02 và CN-03 song song, CN-03 dẫn ID `Nha_Cung_Cap`, `Dong_Gia_Nhap` từ ERD overview khi CN-02 chưa qua G1 | A — thứ tự đúng chiều dữ liệu, ít sửa ngược | BA (phongnq12) | ✅ 30/10/2026: RQ-206 — A: tuần tự CN-01 → CN-02 → CN-03 |
| Q-C03 | Ba khóa ngoại đi ngược thứ tự làm (`De_Xuat_Gia_Ban_Dong.lo_id`, `Gia_Ban_Lo.lo_id` → `Lo` của CN-03; `De_Xuat_Gia_Ban_Dong.dong_gia_nhap_id` → `Dong_Gia_Nhap` của CN-02) ghi là chuyển giao hay phụ thuộc? | A: chuyển giao — CN-01 dẫn ID thực thể ở ERD overview, không định nghĩa lại; luồng UC `PM3CSCN.WEB.10.01.16` từ QT-02 bước 12 đặc tả ở CN-01 theo ERD overview. B: chia việc trong CN-01: phần mặt hàng làm trước, phần đề xuất giá bán theo lô làm sau khi CN-03 qua G1 (không đổi số CN, không ghi phụ thuộc vì sẽ thành vòng) | A — tránh phụ thuộc vòng (mục 3 quy tắc 4); ERD overview đã định nghĩa đủ `Lo`, `Dong_Gia_Nhap` | BA (phongnq12) | ✅ 30/10/2026: RQ-207 — A: chuyển giao, CN-01 dẫn thực thể từ ERD tầng dự án; không tính phụ thuộc CN |
| Q-C04 | Thứ tự chia việc theo chức năng cấp 4 trong CN-03 (RQ-187)? | A: `PM3CSCN.WEB.09.04` kho → `PM3CSCN.WEB.09.05` phân công kho → `PM3CSCN.WEB.09.01` nhập kho → `PM3CSCN.WEB.09.02` điều chuyển → `PM3CSCN.WEB.09.03` kiểm kê → `PM3CSCN.WEB.09.06`, `PM3CSCN.JOB.09.07` cảnh báo → `PM3CSCN.JOB.09.08` đồng bộ (chiều dữ liệu: kho, phân công trước chứng từ; lô tạo ở nhập kho trước điều chuyển, kiểm kê; cảnh báo đọc tồn của cả ba). B: theo số WBS 09.01 → 09.08 | A — theo chiều dữ liệu (ERD v02 mục 3.1) | BA (phongnq12) | ✅ 30/10/2026: RQ-208 — A: 09.04 → 09.05 → 09.01 → 09.02 → 09.03 → 09.06 cùng JOB.09.07 → JOB.09.08 |
| Q-C05 | Dải ID của CN-03 (52 UC) 50 số cho mỗi loại ID có đủ không, nhất là SCR? | A: giữ `201–250` theo mặc định của skill `ba-overview`; hết dải thì xin thêm từ phần dự phòng (kit/standards/id-convention.md mục dải ID). B: cấp ngay `201–300` cho CN-03 (CN cuối, không chồng dải khác) | A — đúng mặc định; CN-03 chia việc theo cấp 4 nên dễ theo dõi mức dùng dải | BA (phongnq12) | ✅ 30/10/2026: RQ-209 — A: giữ 201–250; hết dải xin thêm từ phần dự phòng |
| Q-C06 | Chốt slug nhánh và thư mục `3-ba-detail`: `CN-01-hang-hoa-gia-ban`, `CN-02-nha-cung-cap-gia-nhap`, `CN-03-kho-cang-tin`? | A: ba slug đề xuất (ngắn, không dấu, theo tên module). B: BA ghi slug khác ở ô "Khác" | A | BA (phongnq12) | ✅ 30/10/2026: RQ-205 — A: ba slug đề xuất |
| Q-C07 | QT-01 chỉ ghi CN-02, hay ghi thêm CN-01? UCL mục 3 dòng chức năng `PM3CSCN.WEB.10.01` còn ghi "QT-01 bước 8–11", trong khi TRACE mục 6 cho bước người của QT-01 chỉ do UC module 15 phủ (bước 10–11 là bước hệ thống trong `PM3CSCN.WEB.15.03.01`, `PM3CSCN.WEB.15.03.03` — RQ-190) | A: QT-01 chỉ CN-02; ghi chuyển giao `De_Xuat_Gia_Ban` Nháp sang CN-01 ở Ghi chú mục 2; sửa ô Ghi chú dòng `PM3CSCN.WEB.10.01` của UCL. B: thêm CN-01 vào QT-01 (CN-01 ghi QT-01 ở cột QT liên quan) vì CN-01 sở hữu thực thể được ghi ở bước 10–11 | A — mục 2 tính CN theo UC phủ bước (template mục 2) | BA (phongnq12) | ✅ 30/10/2026: RQ-210 — A: QT-01 chỉ CN-02; Ghi chú UCL dòng `PM3CSCN.WEB.10.01` sửa theo |

---

## 5. Nguồn

| Tài liệu | Dùng cho |
|---|---|
| `2-ba-overview/5-actor-usecase/UCL_PM3CSCN_QuanLyKhoCangTin_v01.md` mục 3 | Module, UC; mục 2 số UC theo module; mục 7 Q-U02, mục 8 RK-03 |
| `1-ba-init/0-dau-vao/ban-do-quy-trinh/ban-do-quy-trinh.md` mục 1 | Danh sách QT đã chốt (QT-01 → QT-06) |
| `2-ba-overview/2-business-process/QT_PM3CSCN_QuanLyKhoCangTin_v03.md` | Bước, chuyển giao giữa QT (QT-01 mục Đầu ra kích hoạt, bước 2, 10–11; QT-02 bước 11–13) |
| `2-ba-overview/3-erd/ERD_PM3CSCN_QuanLyKhoCangTin_v03.md` | Thực thể chính (mục 2), khóa ngoại giữa nhóm (mục 3.1, 4.4) |
| `2-ba-overview/5-actor-usecase/TRACE_PM3CSCN_QuanLyKhoCangTin_v01.md` mục 6 | Bước quy trình → UC, dùng cho mục 2 |
| `2-ba-overview/4-state-machine/SM_PM3CSCN_QuanLyKhoCangTin_v02.md` | Máy trạng thái theo thực thể (đối chiếu thực thể CN đổi trạng thái) |
| `0-inputs/answers-2026-10-29.md` RQ-187 · `0-inputs/answers-2026-10-30.md` RQ-205 → RQ-210 | Giữ module 09, chia việc theo chức năng cấp 4; BA chốt danh mục (BA xác nhận) |
