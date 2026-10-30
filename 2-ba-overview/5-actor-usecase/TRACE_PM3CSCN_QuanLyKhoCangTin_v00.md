# MA TRẬN TRUY VẾT USE CASE ↔ QUY TRÌNH, ĐIỀU KHOẢN — Quản lý kho căng tin (PM3CSCN)

> Phân loại **toàn bộ 90 use case** theo mức căn cứ, để truy vết hai chiều:
> **UC → căn cứ** khi cần chứng minh tuân thủ · **căn cứ → UC** khi cần kiểm tra đã phủ hết nghĩa vụ (điều khoản, bước quy trình, chuyển 👤 của máy trạng thái).
> Tham chiếu chéo: Business rule (lớp 6, chưa có — cột Business rule ghi `chờ lớp 6`, điền ở lượt điền ngược) · [Quy trình](../2-business-process/QT_PM3CSCN_QuanLyKhoCangTin_v02.md) · [Danh sách use case](UCL_PM3CSCN_QuanLyKhoCangTin_v00.md) · [Sơ đồ use case](UCD_PM3CSCN_QuanLyKhoCangTin_v00.md).

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| Mã tài liệu | `TRACE_PM3CSCN_QuanLyKhoCangTin` |
| Phiên bản · Trạng thái | v00 · Chờ review |
| Phiên bản nguồn đối chiếu | QT v02 · BR chưa có (lớp 6 chạy sau) · UCL v00 · SM v01 · BRD v02 · dự toán: `0-inputs/presales/uc/StudyQuanLyKho.xlsx` (danh sách UC báo giá) |

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">2026-10-30</span>** | <span style="color:green">phongnq12</span> | <span style="color:green">- Khởi tạo tài liệu (/ba-overview đợt 5, lớp 5): tầng của 90 use case; truy vết xuôi nhóm chức năng → căn cứ, BRQ, quy trình, máy trạng thái; truy vết ngược điều khoản, bước quy trình người làm, chuyển 👤 → use case.<br>- Đặt ở `2-ba-overview/5-actor-usecase/` theo bảng đợt của `ba-overview` (đợt 5); `00_quy_uoc_chung.md` mục 11 ghi ma trận ở bước `/ba-init` tại thư mục gốc — chỗ lệch ghi ở mục 7.<br>- Sửa theo review độc lập vòng 1 và BA chốt 29/10/2026 (RQ-183 → RQ-201): theo UCL v00 sửa (lá ⊘ PM3CSCN.WEB.10.01.10, PM3CSCN.WEB.10.01.20; lá mới PM3CSCN.WEB.10.01.21, PM3CSCN.WEB.10.01.22); tầng T2 chỉ giữ lá có điều khoản; độ phủ đếm theo bảng bước; thêm khối cuối ở mục 7. Chuyển Chờ review.<br>- Sửa theo review độc lập vòng 2 và BA chốt 30/10/2026 (RQ-202 → RQ-204): mục 7 bỏ dòng QT mục 2 Tác nhân (đã hết sai lệch — QT v02 mục 2 có ACT-07); mã UC có dòng trong trace.csv (RQ-203); câu về vị trí ma trận chuyển ra ngoài bảng; dẫn GD-0005 ở mục 6; nhóm JOB.10.02 sửa căn cứ TT79 Đ41.4. Giữ Chờ review.</span> |

---

## 1. Văn bản đối chiếu

| Văn bản | Số hiệu | Vai trò | Số UC dẫn chiếu |
|---|---|---|---:|
| Thông tư 79/2026/TT-BCA (TT79), tệp chính | 79/2026/TT-BCA · 05/06/2026 | Nguồn chính — Đ41.4 duyệt giá bán, trần giá bán lẻ tại địa phương; Đ16.1–Đ16.8 chất cấm, đồ vật cấm; Đ41.7 hệ thống bán hàng căng tin; Đ5.1.a kết nối, đồng bộ (BRD mục 1.3) | 11 |
| Nghị định 163/2026/NĐ-CP (NĐ163), tệp chính | 163/2026/NĐ-CP · 15/05/2026 | Nguồn tham khảo — Đ120.3 cùng nghĩa TT79 Đ41.4, không phân loại nhóm hàng (RQ-49); không dẫn riêng ở UC | 0 |
| Luật 120/2025/QH15, NĐ 166/2026/NĐ-CP, các phụ lục, mẫu của TT79 và NĐ163 | Theo BRD mục 1.3 | Đã rà toàn văn, không sinh yêu cầu (RQ-48) | 0 |

**Kết luận rà soát** văn bản không sinh UC: NĐ163, Luật 120/2025/QH15, NĐ 166/2026/NĐ-CP và các phụ lục đã rà toàn văn ở bước 1 và BRD mục 1.3, không sinh use case (RQ-48, RQ-49). Trong TT79: Đ5.2, Đ6.2 áp dụng chung; Đ41.7, Đ52.4 ngoài phần mềm; Đ41.4 đoạn 2 (mua hộ) ngoài phạm vi lần này · <span style="color:red">**<u>GD-0004</u>**</span> — mục 6. Chứng từ kho, nhà cung cấp là nghiệp vụ nội bộ, không văn bản điều chỉnh (RQ-55, RQ-56, RQ-63).

## 2. Quy ước ba tầng

| Tầng | Nghĩa | Ý nghĩa khi review |
|---|---|---|
| **🟢 T1 — Bám căn cứ trực tiếp** | Văn bản quy định thẳng nghiệp vụ. Bỏ đi là **thiếu tuân thủ** | Đặc tả **không được trái** điều khoản dẫn |
| **🟡 T2 — Hiện thực hóa nghĩa vụ** | Văn bản bắt phải làm, dự án chọn **cách làm** | Tự do thiết kế, **giữ nguyên kết quả** điều khoản đòi hỏi |
| **🔴 T3 — Không có căn cứ** | Quyết định sản phẩm | Cần khách chốt; đánh dấu nếu có **nguy cơ trái luật** |

Ở dự án này 🔴 T3 nghĩa là không có căn cứ **pháp lý**; mọi UC T3 có căn cứ là báo giá presales hoặc câu trả lời của BA (nghiệp vụ nội bộ — RQ-55, RQ-56), phân loại ở mục 5.

## 3. Thống kê

| Tầng | Số nhóm chức năng | Số UC | Tỷ lệ | Trong P1 |
|---|---:|---:|---:|---:|
| 🟢 T1 | 1 | 2 | 2.2% | 2 |
| 🟡 T2 | 4 | 9 | 10.0% | 9 |
| 🔴 T3 | 11 | 79 | 87.8% | 79 |
| **Tổng** | **13** | **90** | 100% | **90** |

Số nhóm chức năng theo tầng đếm nhóm có ít nhất một UC ở tầng đó; một nhóm có UC ở nhiều tầng thì đếm ở mỗi tầng, nên cột không cộng thành 13.

**Độ phủ quy trình:** 50/90 UC nằm trong một bước người của bảng bước (mục 6) hoặc là UC tác vụ nền. 40 UC còn lại là tra cứu (tìm kiếm, xem chi tiết, kết xuất, lịch sử) và danh mục kho, hạn mức, công tắc, phân công kho — QT mục 1 ghi "không có quy trình", nối qua BRQ ở mục 4: PM3CSCN.WEB.09.01.06, PM3CSCN.WEB.09.01.08, PM3CSCN.WEB.09.01.09, PM3CSCN.WEB.09.02.05, PM3CSCN.WEB.09.02.06, PM3CSCN.WEB.09.02.07, PM3CSCN.WEB.09.03.05, PM3CSCN.WEB.09.03.06, PM3CSCN.WEB.09.03.07, PM3CSCN.WEB.09.04.01, PM3CSCN.WEB.09.04.02, PM3CSCN.WEB.09.04.03, PM3CSCN.WEB.09.04.04, PM3CSCN.WEB.09.04.05, PM3CSCN.WEB.09.04.06, PM3CSCN.WEB.09.04.07, PM3CSCN.WEB.09.04.08, PM3CSCN.WEB.09.04.09, PM3CSCN.WEB.09.05.01, PM3CSCN.WEB.09.05.02, PM3CSCN.WEB.10.01.05, PM3CSCN.WEB.10.01.06, PM3CSCN.WEB.10.01.07, PM3CSCN.WEB.10.01.08, PM3CSCN.WEB.10.01.09, PM3CSCN.WEB.10.01.11, PM3CSCN.WEB.10.01.12, PM3CSCN.WEB.10.01.13, PM3CSCN.WEB.10.01.14, PM3CSCN.WEB.10.01.15, PM3CSCN.WEB.10.01.21, PM3CSCN.WEB.10.01.22, PM3CSCN.WEB.15.01.02, PM3CSCN.WEB.15.01.06, PM3CSCN.WEB.15.01.07, PM3CSCN.WEB.15.02.02, PM3CSCN.WEB.15.02.04, PM3CSCN.WEB.15.03.02, PM3CSCN.WEB.15.03.05, PM3CSCN.WEB.15.03.06.

---

## 4. Truy vết xuôi — nhóm chức năng → căn cứ

| Mã nhóm | Tên nhóm chức năng | Module | UC | P1 | Tầng | Căn cứ | Yêu cầu BRD | Quy trình | Business rule | Máy trạng thái |
|---|---|---|---:|---:|---|---|---|---|---|---|
| `PM3CSCN.WEB.09.01` | Quản lý phiếu nhập hàng kho căng tin | PM3CSCN.WEB.09 | 11 | 11 | 🔴 T3 (11) | Nội bộ — RQ-05, RQ-55 (không văn bản điều chỉnh chứng từ kho) | BRQ-05 · BRQ-06 · BRQ-10 · BRQ-12 · BRQ-13 · BRQ-14 · BRQ-17 · BRQ-25 · BRQ-26 · BRQ-29 | QT-02 Nhập kho hàng hóa từ nhà cung cấp | chờ lớp 6 | SM mục 5 — Phiếu nhập kho; SM mục 9 — Cảnh báo |
| `PM3CSCN.WEB.09.02` | Quản lý phiếu điều chuyển kho căng tin | PM3CSCN.WEB.09 | 12 | 12 | 🔴 T3 (12) | Nội bộ — RQ-06, RQ-15, RQ-55 | BRQ-05 · BRQ-06 · BRQ-13 · BRQ-15 · BRQ-16 · BRQ-17 · BRQ-25 · BRQ-26 · BRQ-27 · BRQ-29 | QT-04 Điều chuyển hàng hóa giữa các kho | chờ lớp 6 | SM mục 7 — Phiếu điều chuyển; SM mục 9 — Cảnh báo |
| `PM3CSCN.WEB.09.03` | Quản lý kiểm kê tồn kho căng tin định kỳ | PM3CSCN.WEB.09 | 10 | 10 | 🔴 T3 (10) | Nội bộ — RQ-07, RQ-55, RQ-145 | BRQ-05 · BRQ-06 · BRQ-13 · BRQ-18 · BRQ-19 · BRQ-20 · BRQ-25 · BRQ-26 · BRQ-28 · BRQ-29 | QT-05 Kiểm kê tồn kho | chờ lớp 6 | SM mục 8 — Biên bản kiểm kê; SM mục 9 — Cảnh báo |
| `PM3CSCN.WEB.09.04` | Quản lý kho | PM3CSCN.WEB.09 | 9 | 9 | 🔴 T3 (9) | Quản trị hệ thống, tiện ích — `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2 · RQ-01 · RQ-33 · RQ-88 · RQ-170 | BRQ-12 · BRQ-21 · BRQ-22 · BRQ-23 · BRQ-24 · BRQ-25 | Không có quy trình riêng (QT mục 1 Ngoài phạm vi); đầu vào của QT-02, QT-04, QT-05, QT-06 | chờ lớp 6 | n/a — `Kho`, `Mat_Hang_Kho` không có máy trạng thái |
| `PM3CSCN.WEB.09.05` | Quản lý phân công kho | PM3CSCN.WEB.09 | 2 | 2 | 🔴 T3 (2) | Nội bộ — RQ-148, RQ-95 | BRQ-21 | Không có quy trình riêng (QT mục 1: phân công là danh mục) | chờ lớp 6 | n/a — `Phan_Cong_Kho` không có máy trạng thái |
| `PM3CSCN.WEB.09.06` | Quản lý cảnh báo | PM3CSCN.WEB.09 | 4 | 4 | 🔴 T3 (4) | Nội bộ — RQ-146, RQ-169 | BRQ-13 · BRQ-22 · BRQ-23 · BRQ-31 | QT-06 Cảnh báo tồn kho và hạn sử dụng | chờ lớp 6 | SM mục 9 — Cảnh báo |
| `PM3CSCN.JOB.09.07` | Cảnh báo và đối soát tự động | PM3CSCN.JOB.09 | 3 | 3 | 🔴 T3 (3) | Nội bộ — RQ-42, RQ-135, RQ-154 · <span style="color:red">**<u>GD-0003</u>**</span> | BRQ-13 · BRQ-22 · BRQ-23 · BRQ-31 | QT-06 Cảnh báo tồn kho và hạn sử dụng · N-01 · <span style="color:red">**<u>GD-0003</u>**</span> · N-04 | chờ lớp 6 | SM mục 9 — Cảnh báo; SM mục 10 |
| `PM3CSCN.JOB.09.08` | Đồng bộ dữ liệu kho | PM3CSCN.JOB.09 | 1 | 1 | 🟡 T2 (1) | TT79 Đ5.1.a · CON-05 · <span style="color:red">**<u>GD-0007</u>**</span> | n/a — CON-05 | N-02 · <span style="color:red">**<u>GD-0007</u>**</span> · D-01 | chờ lớp 6 | n/a — không đổi trạng thái (SM mục 10) |
| `PM3CSCN.WEB.10.01` | Cấu hình danh mục hàng hóa và giá bán căng tin | PM3CSCN.WEB.10 | 20 | 20 | 🟢 T1 (2) · 🟡 T2 (5) · 🔴 T3 (13) | TT79 Đ41.4 · TT79 Đ16.1–Đ16.8 · <span style="color:red">**<u>GD-0001</u>**</span> · <span style="color:red">**<u>GD-0002</u>**</span> · <span style="color:red">**<u>GD-0008</u>**</span> · ASM-004 · ASM-006 | BRQ-02 · BRQ-03 · BRQ-05 · BRQ-06 · BRQ-07 · BRQ-08 · BRQ-17 · BRQ-25 · BRQ-26 · <span style="color:red">**<u>GD-0008</u>**</span> | QT-03 Đề xuất và duyệt giá bán · QT-01 bước 8–11 · QT-02 bước 12–13 | chờ lớp 6 | SM mục 3 — Mặt hàng; SM mục 6 — Đề xuất giá bán |
| `PM3CSCN.JOB.10.02` | Áp giá bán tự động | PM3CSCN.JOB.10 | 1 | 1 | 🟡 T2 (1) | TT79 Đ41.4 (giá có hiệu lực chỉ sau duyệt) · RQ-25 | BRQ-01 · BRQ-24 | QT-03 bước 8 · N-03 | chờ lớp 6 | SM mục 6 — Đề xuất giá bán |
| `PM3CSCN.WEB.15.01` | Quản lý nhà cung cấp hàng hóa căng tin | PM3CSCN.WEB.15 | 7 | 7 | 🔴 T3 (7) | Nội bộ — RQ-20, RQ-56 | BRQ-09 · BRQ-25 | QT-01 Cập nhật nhà cung cấp và giá nhập (bước 1) | chờ lớp 6 | SM mục 2 — Nhà cung cấp |
| `PM3CSCN.WEB.15.02` | Quản lý danh mục hàng hóa theo nhà cung cấp | PM3CSCN.WEB.15 | 4 | 4 | 🔴 T3 (4) | Nội bộ — RQ-16, RQ-56 | BRQ-08 · BRQ-09 · BRQ-25 | QT-01 Cập nhật nhà cung cấp và giá nhập (bước 2) | chờ lớp 6 | n/a — không có máy trạng thái |
| `PM3CSCN.WEB.15.03` | Quản lý giá nhập theo nhà cung cấp | PM3CSCN.WEB.15 | 6 | 6 | 🟡 T2 (2) · 🔴 T3 (4) | TT79 Đ41.4 (dữ liệu đối chiếu khi duyệt giá) · <span style="color:red">**<u>GD-0001</u>**</span> | BRQ-11 · BRQ-25 | QT-01 Cập nhật nhà cung cấp và giá nhập (bước 3–12) | chờ lớp 6 | SM mục 4 — Hiệu lực dòng giá nhập (Δ); SM mục 6 — Đề xuất giá bán (→ `DRAFT` từ QT-01 bước 3–10) |

## 5. Nhóm 🔴 T3 — phân loại theo khả năng triển khai

| Phân loại | Nhóm chức năng | Lý do | Đề xuất |
|---|---|---|---|
| Làm được khi đủ dữ liệu | `PM3CSCN.WEB.09.01`, `PM3CSCN.WEB.09.02`, `PM3CSCN.WEB.09.03`, `PM3CSCN.WEB.09.04`, `PM3CSCN.WEB.09.05`, `PM3CSCN.WEB.09.06`, `PM3CSCN.JOB.09.07`, `PM3CSCN.WEB.15.01`, `PM3CSCN.WEB.15.02` (các UC lập, sửa, trình, hủy, duyệt, cấu hình, tác vụ nền) | Nghiệp vụ nội bộ của cơ sở, không văn bản điều chỉnh; quy tắc đã có ở QT v01 (bảng bước BA chốt) và câu trả lời của BA (RQ-55, RQ-56, RQ-63) | Giữ; đặc tả theo quy trình và BR lớp 6 |
| Kế thừa thiết kế từ nhóm khác | Các UC tra cứu (tìm kiếm, xem chi tiết, kết xuất) của `PM3CSCN.WEB.09.01` → `09.04`, `PM3CSCN.WEB.10.01`, `PM3CSCN.WEB.15.01` → `15.03` | Chỉ đọc dữ liệu do UC lập, duyệt của cùng nhóm tạo ra; phạm vi xem theo ma trận `UCD` mục 4 | Đặc tả dùng chung mẫu tra cứu; phạm vi theo Q-A01, Q-A03 ở `UCD` |
| Không có sở cứ | Không có | Mọi UC T3 có căn cứ báo giá presales (`Mã UC gốc`) hoặc câu trả lời của BA (UC ngoài presales — RQ-51, RQ-88, RQ-148, RQ-170) | n/a |

## 6. Truy vết ngược — nghĩa vụ chưa có use case

| # | Nghĩa vụ | Căn cứ | Quy trình | UC gần nhất và vì sao chưa phủ |
|---|---|---|---|---|
| 1 | Triển khai hệ thống quản lý cơ sở cai nghiện thông minh bảo đảm công khai, minh bạch, thống nhất | TT79 Đ5.2 (`PL:TT79-2026/Đ5.K2`) | n/a | Áp dụng chung cho cả hệ thống, không gắn UC riêng (`1-ba-init/0-dau-vao/uc-phap-ly.md` mục 3) |
| 2 | Vị trí việc làm "căng tin" | TT79 Đ6.2 (`PL:TT79-2026/Đ6.K2`) | n/a | Áp dụng chung — dùng cho thuật ngữ vai ACT-01 (RQ-66) |
| 3 | Sử dụng tiền trong căng tin qua hệ thống bán hàng căng tin | TT79 Đ41.7 (`PL:TT79-2026/Đ41.K7`) | QT mục 5.1 | Ngoài phần mềm kho (RQ-03); kho chỉ cung cấp dữ liệu, gần nhất PM3CSCN.WEB.09.04.09 Đặt công tắc Cho phép bán của mặt hàng tại kho, PM3CSCN.JOB.09.07.02 Kiểm tồn tối thiểu sau trừ tồn do bán |
| 4 | Cơ sở bảo đảm cơ sở vật chất, trang thiết bị trước khi ứng dụng công nghệ | TT79 Đ52.4 (`PL:TT79-2026/Đ52.K4`) | n/a | Ngoài phần mềm — việc của cơ sở |
| 5 | Mua hộ hàng hóa qua đơn vị cung ứng khi cơ sở không có căng tin | TT79 Đ41.4 đoạn 2 · <span style="color:red">**<u>GD-0004</u>**</span> | n/a | Ngoài phạm vi lần này (RQ-64; BRD mục 15); `UCL` mục 9 TH-01 |
| 6 | Chuyển bản in phiếu nhập kho cho kế toán; kho nhận kiểm hàng; tổ kiểm kê đếm; đề nghị kiểm kê | `PS:PM3CSCN.WEB.09.01.05` · RQ-26 · RQ-07 · ASM-008 · RQ-129 | QT-02 bước 4 🟡 · QT-04 bước 8 🟡 · QT-05 bước 4 🟡 · QT-06 bước 6 🟡 | Làm ngoài hệ thống; hệ thống ghi kết quả ở bước kế tiếp (PM3CSCN.WEB.09.01.05, PM3CSCN.WEB.09.02.11, PM3CSCN.WEB.09.03.01, PM3CSCN.WEB.09.03.08) |

Điều khoản đã có use case: TT79 Đ41.4 → PM3CSCN.WEB.10.01.02, PM3CSCN.WEB.10.01.03 (🟢 T1) và nhóm `PM3CSCN.WEB.10.01`, `PM3CSCN.WEB.15.03`, PM3CSCN.JOB.10.02.01 (🟡 T2) · TT79 Đ16.1–Đ16.8 → PM3CSCN.WEB.10.01.02 (giá đầu), PM3CSCN.WEB.10.01.01 (đối tượng) · TT79 Đ5.1.a → PM3CSCN.JOB.09.08.01 (đóng chiều "chưa có UC" của PH-032 ở lớp 5).

**Bước quy trình người làm → use case** (32 bước người; bước 🟡 ở bảng trên; presales không gắn UC cho bước nào nên bảng dựng từ đầu — <span style="color:red">**<u>GD-0005</u>**</span>):

| Quy trình · bước | Việc | Use case |
|---|---|---|
| QT-01 bước 1 | Cập nhật hồ sơ nhà cung cấp | PM3CSCN.WEB.15.01.01 Thêm nhà cung cấp · PM3CSCN.WEB.15.01.03 Sửa hồ sơ nhà cung cấp · PM3CSCN.WEB.15.01.04 Ngừng hợp tác nhà cung cấp · PM3CSCN.WEB.15.01.05 Cho nhà cung cấp hợp tác lại |
| QT-01 bước 2 | Cập nhật danh mục hàng hóa cung ứng | PM3CSCN.WEB.15.02.01 Thêm mặt hàng vào danh mục cung ứng của nhà cung cấp · PM3CSCN.WEB.15.02.03 Bỏ mặt hàng khỏi danh mục cung ứng của nhà cung cấp |
| QT-01 bước 3 | Khai đợt giá nhập | PM3CSCN.WEB.15.03.01 Khai đợt giá nhập |
| QT-01 bước 4 | Sửa dòng giá nhập | PM3CSCN.WEB.15.03.03 Sửa dòng giá nhập |
| QT-01 bước 5 | Xóa dòng giá nhập | PM3CSCN.WEB.15.03.04 Xóa dòng giá nhập |
| QT-01 bước 9 | Quyết định có lập đề xuất giá bán (bước của UC khai, sửa giá nhập — RQ-190) | PM3CSCN.WEB.15.03.01 Khai đợt giá nhập · PM3CSCN.WEB.15.03.03 Sửa dòng giá nhập |
| QT-02 bước 1 | Lập hoặc sửa phiếu nhập kho | PM3CSCN.WEB.09.01.01 Lập phiếu nhập kho · PM3CSCN.WEB.09.01.07 Sửa phiếu nhập kho |
| QT-02 bước 3 | In phiếu nhập kho | PM3CSCN.WEB.09.01.05 In phiếu nhập kho |
| QT-02 bước 5 | Trình hoặc hủy phiếu nhập kho | PM3CSCN.WEB.09.01.10 Trình phiếu nhập kho · PM3CSCN.WEB.09.01.11 Hủy phiếu nhập kho |
| QT-02 bước 7 | Duyệt hoặc từ chối phiếu nhập kho | PM3CSCN.WEB.09.01.02 Phê duyệt phiếu nhập kho · PM3CSCN.WEB.09.01.03 Từ chối phiếu nhập kho |
| QT-02 bước 12 | Chọn có đề xuất giá bán mới cho lô (điểm vào khác — RQ-193) | PM3CSCN.WEB.10.01.16 Lập phiếu đề xuất giá bán |
| QT-02 bước 16 | Hủy phê duyệt phiếu nhập kho | PM3CSCN.WEB.09.01.04 Hủy phê duyệt phiếu nhập kho |
| QT-03 bước 1 | Thêm mặt hàng | PM3CSCN.WEB.10.01.01 Thêm mặt hàng |
| QT-03 bước 2 | Lập hoặc sửa phiếu đề xuất giá bán (thêm, sửa, bỏ dòng) | PM3CSCN.WEB.10.01.16 Lập phiếu đề xuất giá bán · PM3CSCN.WEB.10.01.17 Sửa phiếu đề xuất giá bán |
| QT-03 bước 3 | Trình hoặc hủy phiếu đề xuất giá bán | PM3CSCN.WEB.10.01.18 Trình phiếu đề xuất giá bán · PM3CSCN.WEB.10.01.19 Hủy phiếu đề xuất giá bán |
| QT-03 bước 5 | Duyệt hoặc từ chối cả phiếu đề xuất giá bán | PM3CSCN.WEB.10.01.02 Phê duyệt phiếu đề xuất giá bán · PM3CSCN.WEB.10.01.03 Từ chối phiếu đề xuất giá bán |
| QT-03 bước 10 | Hủy phê duyệt cả phiếu đề xuất giá bán | PM3CSCN.WEB.10.01.04 Hủy phê duyệt phiếu đề xuất giá bán |
| QT-04 bước 1 | Lập hoặc sửa phiếu điều chuyển | PM3CSCN.WEB.09.02.01 Lập phiếu điều chuyển · PM3CSCN.WEB.09.02.08 Sửa phiếu điều chuyển |
| QT-04 bước 3 | Trình hoặc hủy phiếu điều chuyển | PM3CSCN.WEB.09.02.09 Trình phiếu điều chuyển · PM3CSCN.WEB.09.02.10 Hủy phiếu điều chuyển |
| QT-04 bước 5 | Duyệt hoặc từ chối phiếu điều chuyển | PM3CSCN.WEB.09.02.02 Phê duyệt phiếu điều chuyển · PM3CSCN.WEB.09.02.03 Từ chối phiếu điều chuyển |
| QT-04 bước 9 | Xác nhận thực nhận | PM3CSCN.WEB.09.02.11 Xác nhận thực nhận phiếu điều chuyển |
| QT-04 bước 12 | Ghi nhận chênh lệch điều chuyển | PM3CSCN.WEB.09.02.12 Ghi nhận chênh lệch điều chuyển |
| QT-04 bước 14 | Hủy phê duyệt phiếu điều chuyển | PM3CSCN.WEB.09.02.04 Hủy phê duyệt phiếu điều chuyển |
| QT-05 bước 1 | Giao kiểm kê | PM3CSCN.WEB.09.03.08 Giao kiểm kê |
| QT-05 bước 5 | Điền số thực tế | PM3CSCN.WEB.09.03.01 Ghi số thực tế vào biên bản kiểm kê |
| QT-05 bước 6 | Trình biên bản kiểm kê | PM3CSCN.WEB.09.03.09 Trình biên bản kiểm kê |
| QT-05 bước 8 | Duyệt hoặc từ chối biên bản kiểm kê | PM3CSCN.WEB.09.03.02 Phê duyệt biên bản kiểm kê · PM3CSCN.WEB.09.03.03 Từ chối biên bản kiểm kê |
| QT-05 bước 10 | Hủy phê duyệt biên bản kiểm kê | PM3CSCN.WEB.09.03.04 Hủy phê duyệt biên bản kiểm kê |
| QT-05 bước 13 | Hủy biên bản kiểm kê bỏ dở | PM3CSCN.WEB.09.03.10 Hủy biên bản kiểm kê |
| QT-06 bước 4 | Xem cảnh báo, chọn hướng xử lý | PM3CSCN.WEB.09.06.01 Tìm kiếm cảnh báo · PM3CSCN.WEB.09.06.02 Xem cảnh báo |
| QT-06 bước 5 | Xác nhận cảnh báo | PM3CSCN.WEB.09.06.03 Xác nhận cảnh báo |
| QT-06 bước 9 | Xác nhận cảnh báo tồn lệch sổ biến động | PM3CSCN.WEB.09.06.04 Xác nhận cảnh báo tồn lệch sổ biến động |

Bước hệ thống chạy cùng request với bước người nằm trong use case của bước người (QT-01 bước 6–8, 10–12; QT-02 bước 2, 6, 8–11, 13–15, 17–18; QT-03 bước 4, 6–7, 11–12; QT-04 bước 2, 4, 6–7, 10–11, 13, 15–16; QT-05 bước 2–3, 7, 9, 11–12, 14–15; QT-06 bước 2–3 khi giảm tồn do chứng từ). Bước hệ thống chạy theo lịch, sự kiện: QT-03 bước 8–9 → PM3CSCN.JOB.10.02.01; QT-06 bước 1, 3 → PM3CSCN.JOB.09.07.01; QT-06 bước 2–3 khi bán → PM3CSCN.JOB.09.07.02; QT-06 bước 7–8 → PM3CSCN.JOB.09.07.03; N-02 → PM3CSCN.JOB.09.08.01.

Đếm bước người: QT-01 bước 1, 2, 3, 4, 5, 9 (6) · QT-02 bước 1, 3, 5, 7, 12, 16 (6) · QT-03 bước 1, 2, 3, 5, 10 (5) · QT-04 bước 1, 3, 5, 9, 12, 14 (6) · QT-05 bước 1, 5, 6, 8, 10, 13 (6) · QT-06 bước 4, 5, 9 (3) = 32 bước, mỗi bước một dòng ở bảng trên; bước gộp "A hoặc B" (lập hoặc sửa, trình hoặc hủy, duyệt hoặc từ chối) có một use case cho mỗi việc.

**Chuyển 👤 của máy trạng thái → use case:**

| Máy · chuyển | Ai | Use case |
|---|---|---|
| SM mục 2: → `ACTIVE` | ACT-01 | PM3CSCN.WEB.15.01.01 Thêm nhà cung cấp |
| SM mục 2: `ACTIVE` → `TERMINATED` | ACT-01 | PM3CSCN.WEB.15.01.04 Ngừng hợp tác nhà cung cấp |
| SM mục 2: `TERMINATED` → `ACTIVE` | ACT-01 | PM3CSCN.WEB.15.01.05 Cho nhà cung cấp hợp tác lại |
| SM mục 3: → `ACTIVE` | ACT-01 | PM3CSCN.WEB.10.01.01 Thêm mặt hàng |
| SM mục 3: `ACTIVE` → `INACTIVE` | ACT-01 | PM3CSCN.WEB.10.01.07 Ngừng hoạt động mặt hàng |
| SM mục 3: `INACTIVE` → `ACTIVE` | ACT-01 | PM3CSCN.WEB.10.01.08 Kích hoạt lại mặt hàng |
| SM mục 5: → `DRAFT` | ACT-01 | PM3CSCN.WEB.09.01.01 Lập phiếu nhập kho |
| SM mục 5: `DRAFT`, `REJECTED` → `PENDING_APPROVAL` | ACT-01 | PM3CSCN.WEB.09.01.10 Trình phiếu nhập kho |
| SM mục 5: `DRAFT`, `REJECTED` → `CANCELLED` | ACT-01 | PM3CSCN.WEB.09.01.11 Hủy phiếu nhập kho |
| SM mục 5: `PENDING_APPROVAL` → `APPROVED` | ACT-02 | PM3CSCN.WEB.09.01.02 Phê duyệt phiếu nhập kho |
| SM mục 5: `PENDING_APPROVAL` → `REJECTED` | ACT-02 | PM3CSCN.WEB.09.01.03 Từ chối phiếu nhập kho |
| SM mục 5: `APPROVED` → `REVOKED` | ACT-02 | PM3CSCN.WEB.09.01.04 Hủy phê duyệt phiếu nhập kho |
| SM mục 6: → `DRAFT` (QT-01 bước 3–10) | ACT-01 | PM3CSCN.WEB.15.03.01 Khai đợt giá nhập · PM3CSCN.WEB.15.03.03 Sửa dòng giá nhập |
| SM mục 6: → `DRAFT` (QT-02 bước 12–13) | ACT-01 | PM3CSCN.WEB.10.01.16 Lập phiếu đề xuất giá bán |
| SM mục 6: → `DRAFT` (QT-03 bước 2) | ACT-01 | PM3CSCN.WEB.10.01.16 Lập phiếu đề xuất giá bán |
| SM mục 6: `DRAFT`, `REJECTED` → `PENDING_APPROVAL` | ACT-01 | PM3CSCN.WEB.10.01.18 Trình phiếu đề xuất giá bán |
| SM mục 6: `DRAFT`, `REJECTED` → `CANCELLED` | ACT-01 | PM3CSCN.WEB.10.01.19 Hủy phiếu đề xuất giá bán |
| SM mục 6: `PENDING_APPROVAL` → `APPROVED` | ACT-02 | PM3CSCN.WEB.10.01.02 Phê duyệt phiếu đề xuất giá bán |
| SM mục 6: `PENDING_APPROVAL` → `EFFECTIVE` | ACT-02 | PM3CSCN.WEB.10.01.02 Phê duyệt phiếu đề xuất giá bán |
| SM mục 6: `PENDING_APPROVAL` → `REJECTED` | ACT-02 | PM3CSCN.WEB.10.01.03 Từ chối phiếu đề xuất giá bán |
| SM mục 6: `APPROVED` → `REVOKED` | ACT-02 | PM3CSCN.WEB.10.01.04 Hủy phê duyệt phiếu đề xuất giá bán |
| SM mục 7: → `DRAFT` | ACT-01 | PM3CSCN.WEB.09.02.01 Lập phiếu điều chuyển |
| SM mục 7: `DRAFT`, `REJECTED` → `PENDING_APPROVAL` | ACT-01 | PM3CSCN.WEB.09.02.09 Trình phiếu điều chuyển |
| SM mục 7: `DRAFT`, `REJECTED` → `CANCELLED` | ACT-01 | PM3CSCN.WEB.09.02.10 Hủy phiếu điều chuyển |
| SM mục 7: `PENDING_APPROVAL` → `APPROVED` | ACT-02 | PM3CSCN.WEB.09.02.02 Phê duyệt phiếu điều chuyển |
| SM mục 7: `PENDING_APPROVAL` → `REJECTED` | ACT-02 | PM3CSCN.WEB.09.02.03 Từ chối phiếu điều chuyển |
| SM mục 7: `APPROVED` → `COMPLETED` | ACT-01 | PM3CSCN.WEB.09.02.11 Xác nhận thực nhận phiếu điều chuyển |
| SM mục 7: `APPROVED` → `RECEIVED` | ACT-01 | PM3CSCN.WEB.09.02.11 Xác nhận thực nhận phiếu điều chuyển |
| SM mục 7: `RECEIVED` → `COMPLETED_WITH_VARIANCE` | ACT-01 | PM3CSCN.WEB.09.02.12 Ghi nhận chênh lệch điều chuyển |
| SM mục 7: `APPROVED` → `REVOKED` | ACT-02 | PM3CSCN.WEB.09.02.04 Hủy phê duyệt phiếu điều chuyển |
| SM mục 8: → `IN_PROGRESS` | ACT-02 | PM3CSCN.WEB.09.03.08 Giao kiểm kê |
| SM mục 8: `IN_PROGRESS` → `PENDING_APPROVAL` | ACT-03 | PM3CSCN.WEB.09.03.09 Trình biên bản kiểm kê |
| SM mục 8: `PENDING_APPROVAL` → `APPROVED` | ACT-02 | PM3CSCN.WEB.09.03.02 Phê duyệt biên bản kiểm kê |
| SM mục 8: `PENDING_APPROVAL` → `IN_PROGRESS` | ACT-02 | PM3CSCN.WEB.09.03.03 Từ chối biên bản kiểm kê |
| SM mục 8: `IN_PROGRESS` → `CANCELLED` | ACT-02 | PM3CSCN.WEB.09.03.10 Hủy biên bản kiểm kê |
| SM mục 8: `APPROVED` → `REVOKED` | ACT-02 | PM3CSCN.WEB.09.03.04 Hủy phê duyệt biên bản kiểm kê |
| SM mục 9: → `NEW` (duyệt phiếu nhập kho có lô chờ giá) | ACT-02 | PM3CSCN.WEB.09.01.02 Phê duyệt phiếu nhập kho |
| SM mục 9: → `NEW` (`LOW_STOCK` cùng giao dịch giảm tồn) | ACT-02 | PM3CSCN.WEB.09.01.04 Hủy phê duyệt phiếu nhập kho · PM3CSCN.WEB.09.02.02 Phê duyệt phiếu điều chuyển · PM3CSCN.WEB.09.03.02 Phê duyệt biên bản kiểm kê · PM3CSCN.WEB.09.03.04 Hủy phê duyệt biên bản kiểm kê |
| SM mục 9: `NEW` → `VIEWED` | ACT-01 · ACT-02 | PM3CSCN.WEB.09.06.02 Xem cảnh báo |
| SM mục 9: `VIEWED` → `CLOSED` | ACT-01 | PM3CSCN.WEB.09.06.03 Xác nhận cảnh báo |
| SM mục 9: `NEW`, `VIEWED` → `CLOSED` | ACT-02 | PM3CSCN.WEB.09.06.04 Xác nhận cảnh báo tồn lệch sổ biến động |

Đếm: 41 dòng chuyển 👤 của SM mục 2, 3, 5, 6, 7, 8, 9 (SM mục 4 là máy Δ, không có 👤). Sửa bản nháp không đổi trạng thái: PM3CSCN.WEB.09.01.07, PM3CSCN.WEB.09.02.08, PM3CSCN.WEB.10.01.17; ghi số thực tế ở `IN_PROGRESS`: PM3CSCN.WEB.09.03.01. Chuyển ⚙️, 🔗 (SM mục 10): `N-01` · <span style="color:red">**<u>GD-0003</u>**</span> → PM3CSCN.JOB.09.07.01 · `N-03` → PM3CSCN.JOB.10.02.01 · `N-04` → PM3CSCN.JOB.09.07.03 · 🔗 trừ tồn do bán → PM3CSCN.JOB.09.07.02.

## 7. Sai lệch cần sửa

| Hạng mục | Hiện tại | Đúng theo căn cứ | Căn cứ |
|---|---|---|---|
| Hạt của 15 UC presales | Một dòng presales gộp nhiều thao tác: "Tạo / Cập nhật", "Thêm/Sửa/Xóa", "Quản lý …", "tìm kiếm, xem chi tiết và kết xuất" | Mỗi lá một thao tác, một quyền; mã presales ở lại thao tác đầu, thao tác còn lại lấy mã mới, `Mã UC gốc` là mã presales (`UCL` mục 4) | `00_quy_uoc_chung.md` mục 8.1 (G1) · `create-uc` mục "Một UC to bằng nào" |
| Tên UC presales `PM3CSCN.WEB.09.02.01` | `sang quầy bán căng tin`; nhóm `PM3CSCN.WEB.09.02` ghi `phiếu xuất kho` | Kho ngang hàng, không có kho cấp trên; thuật ngữ "phiếu điều chuyển" (glossary) — `UCL` dùng "Lập phiếu điều chuyển", tên presales giữ nguyên văn ở danh mục bước 1 | RQ-01 · RQ-02 · `du-an/glossary.md` |
| Tên UC presales nhóm giá bán | `đơn giá bán` | "giá bán", "phiếu đề xuất giá bán" (glossary, RQ-199) — `UCL` dùng tên theo glossary | `du-an/glossary.md` |
| Mã UC trong `du-an/trace.csv` | Vòng 1 chưa ghi 90 mã UC WBS | Mã UC có dòng trong `du-an/trace.csv` (RQ-203); phiên chính ghi | RQ-203 · CLAUDE.md luật 6 |
| Khối cuối bắt buộc | Template `traceability_matrix.md` không có heading câu hỏi, rủi ro, tạm hoãn, nguồn | Ghi ngay dưới bảng này (`00_quy_uoc_chung.md` mục 6), không thêm heading | `00_quy_uoc_chung.md` mục 6 |

**Câu hỏi cần chốt:** Không còn câu mở — câu hỏi của lớp 5 ở `UCD` mục 5, `UCL` mục 7 đã chốt (RQ-183 → RQ-187, RQ-202).

**Rủi ro còn lại:**

| Mã | Rủi ro | Căn cứ bị ảnh hưởng | Mức | Biện pháp | Cần khách xác nhận văn bản |
|---|---|---|:-:|---|:-:|
| RK-01 | Lớp 6 cấp BR mà tầng của một lá phải đổi (ví dụ BR có căn cứ pháp lý cho lá đang 🔴 T3) | Mục 3, mục 4 cột Tầng | T | Soát lại tầng ở lượt điền ngược | Không |

**Điểm tạm hoãn:** Không có điểm tạm hoãn riêng; cột Business rule `chờ lớp 6` là ô điền sau (`00_quy_uoc_chung.md` mục 10).

**Nguồn:**

| Tài liệu | Dùng cho |
|---|---|
| `UCL_PM3CSCN_QuanLyKhoCangTin_v00.md`, `UCD_PM3CSCN_QuanLyKhoCangTin_v00.md` | Danh sách UC, tác nhân, tầng |
| `../2-business-process/QT_PM3CSCN_QuanLyKhoCangTin_v02.md` bảng bước, mục 5, 9 | Truy vết bước → UC |
| `../4-state-machine/SM_PM3CSCN_QuanLyKhoCangTin_v01.md` mục 2 → 10 | Truy vết chuyển 👤 → UC |
| `../1-brd/BRD_PM3CSCN_QuanLyKhoCangTin_v02.md` mục 1.3, 3, 12 | Văn bản, BRQ, việc ngoài presales |
| `../../1-ba-init/0-dau-vao/uc-phap-ly.md`, `phap-ly.md` | Quan hệ điều khoản ↔ UC presales |

Vị trí ma trận truy vết: `00_quy_uoc_chung.md` mục 11 ghi lập ở `/ba-init` tại thư mục gốc; bảng đợt của `ba-overview` (đợt 5) giao `TRACE_…` ở `2-ba-overview/5-actor-usecase/` — tài liệu này theo bảng đợt.

## 8. Phụ lục — danh sách use case theo nhóm

#### `PM3CSCN.WEB.09.01` — Quản lý phiếu nhập hàng kho căng tin

**Module:** PM3CSCN.WEB.09 · **Tầng:** 🔴 T3 (11)

**Căn cứ:** Nội bộ — RQ-05, RQ-55 (không văn bản điều chỉnh chứng từ kho) · **Quy trình:** QT-02 Nhập kho hàng hóa từ nhà cung cấp · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Lập phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.01 | QT-02 bước 1–2 | SM mục 5: → `DRAFT` | 🔴 T3 | PM3CSCN.WEB.09.01.01 |
| 2 | Phê duyệt phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.02 | QT-02 bước 7–11, 14, 15 | SM mục 5: `PENDING_APPROVAL` → `APPROVED`; SM mục 9: → `NEW` (`PENDING_PRICE_LOT`) | 🔴 T3 | PM3CSCN.WEB.09.01.02 |
| 3 | Từ chối phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.03 | QT-02 bước 7 (từ chối) | SM mục 5: `PENDING_APPROVAL` → `REJECTED` | 🔴 T3 | PM3CSCN.WEB.09.01.03 |
| 4 | Hủy phê duyệt phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.04 | QT-02 bước 16–18 | SM mục 5: `APPROVED` → `REVOKED`; SM mục 9: → `NEW` (`LOW_STOCK`) | 🔴 T3 | PM3CSCN.WEB.09.01.04 |
| 5 | In phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.05 | QT-02 bước 3 (bước 4 🟡 chuyển bản in cho kế toán ngoài hệ thống) | n/a — không đổi trạng thái | 🔴 T3 | PM3CSCN.WEB.09.01.05 |
| 6 | Tìm kiếm phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.06 | Tra cứu, không có bước (QT mục 1 Ngoài phạm vi); ACT-02 tìm phiếu Chờ duyệt để xét ở QT-02 bước 7 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.01.06 |
| 7 | Sửa phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.07 | QT-02 bước 1–2 (sửa) | SM mục 5: ở lại `DRAFT`, `REJECTED` | 🔴 T3 | PM3CSCN.WEB.09.01.01 |
| 8 | Xem chi tiết phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.08 | Tra cứu, không có bước; ACT-02 xem phiếu trước khi xét ở QT-02 bước 7 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.01.06 |
| 9 | Kết xuất danh sách phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.09 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.01.06 |
| 10 | Trình phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.10 | QT-02 bước 5–6 (trình) | SM mục 5: `DRAFT`, `REJECTED` → `PENDING_APPROVAL` | 🔴 T3 | chưa chốt (PM) |
| 11 | Hủy phiếu nhập kho | 1 | WEB | PM3CSCN.WEB.09.01.11 | QT-02 bước 5 (hủy) | SM mục 5: `DRAFT`, `REJECTED` → `CANCELLED` | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.WEB.09.02` — Quản lý phiếu điều chuyển kho căng tin

**Module:** PM3CSCN.WEB.09 · **Tầng:** 🔴 T3 (12)

**Căn cứ:** Nội bộ — RQ-06, RQ-15, RQ-55 · **Quy trình:** QT-04 Điều chuyển hàng hóa giữa các kho · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Lập phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.01 | QT-04 bước 1–2 | SM mục 7: → `DRAFT` | 🔴 T3 | PM3CSCN.WEB.09.02.01 |
| 2 | Phê duyệt phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.02 | QT-04 bước 5–7 | SM mục 7: `PENDING_APPROVAL` → `APPROVED`; SM mục 9: → `NEW` (`LOW_STOCK`) | 🔴 T3 | PM3CSCN.WEB.09.02.02 |
| 3 | Từ chối phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.03 | QT-04 bước 5 (từ chối) | SM mục 7: `PENDING_APPROVAL` → `REJECTED` | 🔴 T3 | PM3CSCN.WEB.09.02.03 |
| 4 | Hủy phê duyệt phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.04 | QT-04 bước 14–16 | SM mục 7: `APPROVED` → `REVOKED` | 🔴 T3 | PM3CSCN.WEB.09.02.04 |
| 5 | Tìm kiếm phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.05 | Tra cứu, không có bước; ACT-02 tìm phiếu Chờ duyệt để xét ở QT-04 bước 5 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.02.05 |
| 6 | Xem chi tiết phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.06 | Tra cứu, không có bước; ACT-01 kho nhận xem phiếu trước khi xác nhận ở QT-04 bước 9 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.02.05 |
| 7 | Kết xuất danh sách phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.07 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.02.05 |
| 8 | Sửa phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.08 | QT-04 bước 1–2 (sửa) | SM mục 7: ở lại `DRAFT`, `REJECTED` | 🔴 T3 | chưa chốt (PM) |
| 9 | Trình phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.09 | QT-04 bước 3–4 (trình) | SM mục 7: `DRAFT`, `REJECTED` → `PENDING_APPROVAL` | 🔴 T3 | chưa chốt (PM) |
| 10 | Hủy phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.10 | QT-04 bước 3 (hủy) | SM mục 7: `DRAFT`, `REJECTED` → `CANCELLED` | 🔴 T3 | chưa chốt (PM) |
| 11 | Xác nhận thực nhận phiếu điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.11 | QT-04 bước 9–11 (bước 8 🟡 kiểm hàng ngoài hệ thống) | SM mục 7: `APPROVED` → `COMPLETED` (nhận đủ) hoặc `RECEIVED` (nhận thiếu) | 🔴 T3 | chưa chốt (PM) |
| 12 | Ghi nhận chênh lệch điều chuyển | 1 | WEB | PM3CSCN.WEB.09.02.12 | QT-04 bước 12–13 | SM mục 7: `RECEIVED` → `COMPLETED_WITH_VARIANCE` | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.WEB.09.03` — Quản lý kiểm kê tồn kho căng tin định kỳ

**Module:** PM3CSCN.WEB.09 · **Tầng:** 🔴 T3 (10)

**Căn cứ:** Nội bộ — RQ-07, RQ-55, RQ-145 · **Quy trình:** QT-05 Kiểm kê tồn kho · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Ghi số thực tế vào biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.01 | QT-05 bước 5 (bước 4 🟡 đếm ngoài hệ thống) | SM mục 8: ở lại `IN_PROGRESS` | 🔴 T3 | PM3CSCN.WEB.09.03.01 |
| 2 | Phê duyệt biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.02 | QT-05 bước 8–9 | SM mục 8: `PENDING_APPROVAL` → `APPROVED`; SM mục 9: → `NEW` (`LOW_STOCK`) | 🔴 T3 | PM3CSCN.WEB.09.03.02 |
| 3 | Từ chối biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.03 | QT-05 bước 8 (từ chối) | SM mục 8: `PENDING_APPROVAL` → `IN_PROGRESS` | 🔴 T3 | PM3CSCN.WEB.09.03.03 |
| 4 | Hủy phê duyệt biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.04 | QT-05 bước 10–12 | SM mục 8: `APPROVED` → `REVOKED`; SM mục 9: → `NEW` (`LOW_STOCK`) | 🔴 T3 | PM3CSCN.WEB.09.03.04 |
| 5 | Tìm kiếm biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.05 | Tra cứu, không có bước; ACT-03 mở biên bản để điền, trình ở QT-05 bước 5–6; ACT-02 tìm biên bản Chờ duyệt ở QT-05 bước 8 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.03.05 |
| 6 | Xem chi tiết biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.06 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.03.05 |
| 7 | Kết xuất biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.07 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.03.05 |
| 8 | Giao kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.08 | QT-05 bước 1–3 | SM mục 8: → `IN_PROGRESS` | 🔴 T3 | PM3CSCN.WEB.09.03.01 |
| 9 | Trình biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.09 | QT-05 bước 6–7 | SM mục 8: `IN_PROGRESS` → `PENDING_APPROVAL` | 🔴 T3 | chưa chốt (PM) |
| 10 | Hủy biên bản kiểm kê | 1 | WEB | PM3CSCN.WEB.09.03.10 | QT-05 bước 13–15 | SM mục 8: `IN_PROGRESS` → `CANCELLED` | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.WEB.09.04` — Quản lý kho

**Module:** PM3CSCN.WEB.09 · **Tầng:** 🔴 T3 (9)

**Căn cứ:** Quản trị hệ thống, tiện ích — `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2 · RQ-01 · RQ-33 · RQ-88 · RQ-170 · **Quy trình:** Không có quy trình riêng (QT mục 1 Ngoài phạm vi); đầu vào của QT-02, QT-04, QT-05, QT-06 · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Tìm kiếm danh sách kho | 1 | WEB | PM3CSCN.WEB.09.04.01 | Danh mục, không có bước (QT mục 1 Ngoài phạm vi); ACT-01 chọn kho nhận ở QT-04 bước 1; ACT-02 chọn kho ở QT-05 bước 1 và khi phân công kho | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.04.01 |
| 2 | Thêm kho | 1 | WEB | PM3CSCN.WEB.09.04.02 | Danh mục, không có bước (QT mục 1 Ngoài phạm vi) | n/a — `Kho` không có máy trạng thái | 🔴 T3 | PM3CSCN.WEB.09.04.02 |
| 3 | Đặt tồn tối thiểu của mặt hàng tại kho | 1 | WEB | PM3CSCN.WEB.09.04.03 | Đầu vào của QT-06, không có bước (QT mục 1 Ngoài phạm vi) | n/a — cờ cấu hình, không phải trạng thái | 🔴 T3 | PM3CSCN.WEB.09.04.03 |
| 4 | Xem lịch sử nhập, điều chuyển của kho | 1 | WEB | PM3CSCN.WEB.09.04.04 | Tra cứu, không có bước; đọc biến động tồn của QT-02, QT-04 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.09.04.04 |
| 5 | Sửa kho | 1 | WEB | PM3CSCN.WEB.09.04.05 | Danh mục, không có bước | n/a — `Kho` không có máy trạng thái | 🔴 T3 | PM3CSCN.WEB.09.04.02 |
| 6 | Xóa kho | 1 | WEB | PM3CSCN.WEB.09.04.06 | Danh mục, không có bước | n/a — `Kho` không có máy trạng thái | 🔴 T3 | PM3CSCN.WEB.09.04.02 |
| 7 | Đặt số ngày cảnh báo sắp hết hạn của kho | 1 | WEB | PM3CSCN.WEB.09.04.07 | Đầu vào của QT-06, không có bước | n/a — tham số, không phải trạng thái | 🔴 T3 | PM3CSCN.WEB.09.04.03 |
| 8 | Xem tồn kho hiện tại | 1 | WEB | PM3CSCN.WEB.09.04.08 | Tra cứu, không có bước (QT mục 1 Ngoài phạm vi) | n/a — chỉ đọc | 🔴 T3 | chưa chốt (PM) |
| 9 | Đặt công tắc Cho phép bán của mặt hàng tại kho | 1 | WEB | PM3CSCN.WEB.09.04.09 | Cấu hình danh mục, không có bước (QT mục 1 Ngoài phạm vi) | n/a — cờ cấu hình, không phải trạng thái (SM mục 1.3) | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.WEB.09.05` — Quản lý phân công kho

**Module:** PM3CSCN.WEB.09 · **Tầng:** 🔴 T3 (2)

**Căn cứ:** Nội bộ — RQ-148, RQ-95 · **Quy trình:** Không có quy trình riêng (QT mục 1: phân công là danh mục) · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Phân công kho cho người phụ trách căng tin | 1 | WEB | PM3CSCN.WEB.09.05.01 | Danh mục, không có bước (QT mục 1 Trong phạm vi: phân công là danh mục) | n/a — `Phan_Cong_Kho` không có máy trạng thái | 🔴 T3 | chưa chốt (PM) |
| 2 | Bỏ phân công kho | 1 | WEB | PM3CSCN.WEB.09.05.02 | Danh mục, không có bước | n/a — `Phan_Cong_Kho` không có máy trạng thái | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.WEB.09.06` — Quản lý cảnh báo

**Module:** PM3CSCN.WEB.09 · **Tầng:** 🔴 T3 (4)

**Căn cứ:** Nội bộ — RQ-146, RQ-169 · **Quy trình:** QT-06 Cảnh báo tồn kho và hạn sử dụng · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Tìm kiếm cảnh báo | 1 | WEB | PM3CSCN.WEB.09.06.01 | QT-06 bước 4 (tìm cảnh báo cần xem) | n/a — chỉ đọc | 🔴 T3 | chưa chốt (PM) |
| 2 | Xem cảnh báo | 1 | WEB | PM3CSCN.WEB.09.06.02 | QT-06 bước 4 (xem, chọn hướng xử lý) | SM mục 9: `NEW` → `VIEWED` | 🔴 T3 | chưa chốt (PM) |
| 3 | Xác nhận cảnh báo | 1 | WEB | PM3CSCN.WEB.09.06.03 | QT-06 bước 5 | SM mục 9: `VIEWED` → `CLOSED` (trừ `STOCK_MISMATCH`) | 🔴 T3 | chưa chốt (PM) |
| 4 | Xác nhận cảnh báo tồn lệch sổ biến động | 1 | WEB | PM3CSCN.WEB.09.06.04 | QT-06 bước 9 | SM mục 9: `NEW`, `VIEWED` → `CLOSED` (`STOCK_MISMATCH`) | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.JOB.09.07` — Cảnh báo và đối soát tự động

**Module:** PM3CSCN.JOB.09 · **Tầng:** 🔴 T3 (3)

**Căn cứ:** Nội bộ — RQ-42, RQ-135, RQ-154 · <span style="color:red">**<u>GD-0003</u>**</span> · **Quy trình:** QT-06 Cảnh báo tồn kho và hạn sử dụng · N-01 · <span style="color:red">**<u>GD-0003</u>**</span> · N-04 · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Quét cảnh báo hạn sử dụng, lô chờ giá và tồn tối thiểu | 1 | JOB | PM3CSCN.JOB.09.07.01 | QT-06 bước 1, 3 · N-01 · <span style="color:red">**<u>GD-0003</u>**</span> | SM mục 9: → `NEW` (⚙️) | 🔴 T3 | chưa chốt (PM) |
| 2 | Kiểm tồn tối thiểu sau trừ tồn do bán | 1 | JOB | PM3CSCN.JOB.09.07.02 | QT-06 bước 2–3 khi Hệ thống bán hàng căng tin ghi trừ tồn (QT mục 5.1) | SM mục 9: → `NEW` (`LOW_STOCK`, 🔗 Tự chuyển — SM mục 10) | 🔴 T3 | chưa chốt (PM) |
| 3 | Đối soát tồn kho theo lô với sổ biến động | 1 | JOB | PM3CSCN.JOB.09.07.03 | QT-06 bước 7–8 · N-04 | SM mục 9: → `NEW` (`STOCK_MISMATCH`, ⚙️) | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.JOB.09.08` — Đồng bộ dữ liệu kho

**Module:** PM3CSCN.JOB.09 · **Tầng:** 🟡 T2 (1)

**Căn cứ:** TT79 Đ5.1.a · CON-05 · <span style="color:red">**<u>GD-0007</u>**</span> · **Quy trình:** N-02 · <span style="color:red">**<u>GD-0007</u>**</span> · D-01 · **Business rule:** chờ lớp 6

> TT79 Đ5.1.a buộc phần mềm quản lý cơ sở cai nghiện kết nối, đồng bộ; cách đồng bộ do dự án chọn (D-01, `CH-04` chưa chốt) nên 🟡 T2.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Đồng bộ dữ liệu kho với phần mềm quản lý cơ sở cai nghiện | 1 | JOB | PM3CSCN.JOB.09.08.01 | N-02 · <span style="color:red">**<u>GD-0007</u>**</span> (không là quy trình — D-01) | n/a — không đổi trạng thái (SM mục 10, Chỉ liệt kê) | 🟡 T2 | chưa chốt (PM) |

#### `PM3CSCN.WEB.10.01` — Cấu hình danh mục hàng hóa và giá bán căng tin

**Module:** PM3CSCN.WEB.10 · **Tầng:** 🟢 T1 (2) · 🟡 T2 (5) · 🔴 T3 (13)

**Căn cứ:** TT79 Đ41.4 · TT79 Đ16.1–Đ16.8 · <span style="color:red">**<u>GD-0001</u>**</span> · <span style="color:red">**<u>GD-0002</u>**</span> · <span style="color:red">**<u>GD-0008</u>**</span> · ASM-004 · ASM-006 · **Quy trình:** QT-03 Đề xuất và duyệt giá bán · QT-01 bước 8–11 · QT-02 bước 12–13 · **Business rule:** chờ lớp 6

> Duyệt và từ chối phiếu đề xuất giá bán là việc TT79 Đ41.4 quy định thẳng (🟢 T1); thêm mặt hàng (đối tượng TT79 Đ41.4, Đ16), lập, sửa, trình phiếu đề xuất và hủy phê duyệt hiện thực hóa nghĩa vụ duyệt giá (🟡 T2); sửa, ngừng, kích hoạt, xóa mặt hàng, hủy phiếu, tra cứu không có điều khoản riêng (🔴 T3). Lá ⊘ PM3CSCN.WEB.10.01.10 (RQ-190), PM3CSCN.WEB.10.01.20 (RQ-193) không liệt kê.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Thêm mặt hàng | 1 | WEB | PM3CSCN.WEB.10.01.01 | QT-03 bước 1 | SM mục 3: → `ACTIVE` | 🟡 T2 | PM3CSCN.WEB.10.01.01 |
| 2 | Phê duyệt phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.02 | QT-03 bước 5–7 | SM mục 6: `PENDING_APPROVAL` → `APPROVED` (còn dòng chưa tới ngày bắt đầu áp) hoặc `EFFECTIVE` (mọi dòng đã tới) | 🟢 T1 | PM3CSCN.WEB.10.01.02 |
| 3 | Từ chối phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.03 | QT-03 bước 5 (từ chối cả phiếu, kể cả khi một dòng ngoài khoảng giá ở bước 6) | SM mục 6: `PENDING_APPROVAL` → `REJECTED` | 🟢 T1 | PM3CSCN.WEB.10.01.03 |
| 4 | Hủy phê duyệt phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.04 | QT-03 bước 10–12 | SM mục 6: `APPROVED` → `REVOKED` | 🟡 T2 | PM3CSCN.WEB.10.01.04 |
| 5 | Tìm kiếm danh mục hàng hóa | 1 | WEB | PM3CSCN.WEB.10.01.05 | Tra cứu, không có bước; ACT-02 xem mặt hàng khi xét giá đầu ở QT-03 bước 5 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.10.01.05 |
| 6 | Sửa mặt hàng | 1 | WEB | PM3CSCN.WEB.10.01.06 | Danh mục, không có bước (QT mục 1 Ngoài phạm vi) | SM mục 3: không đổi trạng thái | 🔴 T3 | PM3CSCN.WEB.10.01.01 |
| 7 | Ngừng hoạt động mặt hàng | 1 | WEB | PM3CSCN.WEB.10.01.07 | Danh mục, không có bước | SM mục 3: `ACTIVE` → `INACTIVE` | 🔴 T3 | PM3CSCN.WEB.10.01.01 |
| 8 | Kích hoạt lại mặt hàng | 1 | WEB | PM3CSCN.WEB.10.01.08 | Danh mục, không có bước | SM mục 3: `INACTIVE` → `ACTIVE` | 🔴 T3 | PM3CSCN.WEB.10.01.01 |
| 9 | Xóa mặt hàng | 1 | WEB | PM3CSCN.WEB.10.01.09 | Danh mục, không có bước | n/a — xóa mềm `Mat_Hang.da_xoa`, không là chuyển trạng thái (SM mục 3) | 🔴 T3 | PM3CSCN.WEB.10.01.01 |
| 10 | Xem chi tiết mặt hàng | 1 | WEB | PM3CSCN.WEB.10.01.11 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.10.01.05 |
| 11 | Kết xuất danh mục hàng hóa | 1 | WEB | PM3CSCN.WEB.10.01.12 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.10.01.05 |
| 12 | Tìm kiếm phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.13 | Tra cứu, không có bước; ACT-02 tìm đề xuất Chờ duyệt ở QT-03 bước 5 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.10.01.05 |
| 13 | Xem chi tiết phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.14 | Tra cứu, không có bước; ACT-02 xem đề xuất trước khi xét ở QT-03 bước 5 | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.10.01.05 |
| 14 | Kết xuất danh sách phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.15 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.10.01.05 |
| 15 | Lập phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.16 | QT-03 bước 2 (lập); điểm vào khác: QT-02 bước 12–13 (lô sau khi phiếu nhập kho được duyệt) | SM mục 6: → `DRAFT` (QT-03 bước 2; QT-02 bước 12–13) | 🟡 T2 | chưa chốt (PM) |
| 16 | Sửa phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.17 | QT-03 bước 2 (sửa: thêm, sửa, bỏ dòng) | SM mục 6: ở lại `DRAFT`, `REJECTED` | 🟡 T2 | chưa chốt (PM) |
| 17 | Trình phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.18 | QT-03 bước 3–4 (trình) | SM mục 6: `DRAFT`, `REJECTED` → `PENDING_APPROVAL` | 🟡 T2 | chưa chốt (PM) |
| 18 | Hủy phiếu đề xuất giá bán | 1 | WEB | PM3CSCN.WEB.10.01.19 | QT-03 bước 3 (hủy) | SM mục 6: `DRAFT`, `REJECTED` → `CANCELLED` | 🔴 T3 | chưa chốt (PM) |
| 19 | Xem lịch sử giá bán theo lô | 1 | WEB | PM3CSCN.WEB.10.01.21 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | chưa chốt (PM) |
| 20 | Kết xuất lịch sử giá bán theo lô | 1 | WEB | PM3CSCN.WEB.10.01.22 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | chưa chốt (PM) |

#### `PM3CSCN.JOB.10.02` — Áp giá bán tự động

**Module:** PM3CSCN.JOB.10 · **Tầng:** 🟡 T2 (1)

**Căn cứ:** TT79 Đ41.4 (giá có hiệu lực chỉ sau duyệt) · RQ-25 · **Quy trình:** QT-03 bước 8 · N-03 · **Business rule:** chờ lớp 6

> TT79 Đ41.4 (giá có hiệu lực chỉ sau duyệt) · RQ-25, RQ-166 (từ ngày bắt đầu áp); tác vụ áp giá là cách hiện thực nên 🟡 T2.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Áp giá bán tới ngày hiệu lực | 1 | JOB | PM3CSCN.JOB.10.02.01 | QT-03 bước 8–9 · N-03 | SM mục 6: `APPROVED` → `EFFECTIVE` khi mọi dòng của phiếu đã áp (⚙️) | 🟡 T2 | chưa chốt (PM) |

#### `PM3CSCN.WEB.15.01` — Quản lý nhà cung cấp hàng hóa căng tin

**Module:** PM3CSCN.WEB.15 · **Tầng:** 🔴 T3 (7)

**Căn cứ:** Nội bộ — RQ-20, RQ-56 · **Quy trình:** QT-01 Cập nhật nhà cung cấp và giá nhập (bước 1) · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Thêm nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.01.01 | QT-01 bước 1 (thêm), 7 | SM mục 2: → `ACTIVE` | 🔴 T3 | PM3CSCN.WEB.15.01.01 |
| 2 | Tìm kiếm danh sách nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.01.02 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.01.02 |
| 3 | Sửa hồ sơ nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.01.03 | QT-01 bước 1 (sửa), 7 | SM mục 2: không đổi trạng thái | 🔴 T3 | PM3CSCN.WEB.15.01.01 |
| 4 | Ngừng hợp tác nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.01.04 | QT-01 bước 1 (ngừng hợp tác), 7 | SM mục 2: `ACTIVE` → `TERMINATED` | 🔴 T3 | PM3CSCN.WEB.15.01.01 |
| 5 | Cho nhà cung cấp hợp tác lại | 1 | WEB | PM3CSCN.WEB.15.01.05 | QT-01 bước 1 (kích hoạt lại), 7 | SM mục 2: `TERMINATED` → `ACTIVE` | 🔴 T3 | PM3CSCN.WEB.15.01.01 |
| 6 | Xem chi tiết nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.01.06 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.01.02 |
| 7 | Kết xuất danh sách nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.01.07 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.01.02 |

#### `PM3CSCN.WEB.15.02` — Quản lý danh mục hàng hóa theo nhà cung cấp

**Module:** PM3CSCN.WEB.15 · **Tầng:** 🔴 T3 (4)

**Căn cứ:** Nội bộ — RQ-16, RQ-56 · **Quy trình:** QT-01 Cập nhật nhà cung cấp và giá nhập (bước 2) · **Business rule:** chờ lớp 6

> Nghiệp vụ nội bộ hoặc tiện ích, không văn bản pháp luật điều chỉnh (RQ-55, RQ-56; `1-ba-init/0-dau-vao/uc-phap-ly.md` mục 2) — 🔴 T3, căn cứ là báo giá presales hoặc câu trả lời của BA.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Thêm mặt hàng vào danh mục cung ứng của nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.02.01 | QT-01 bước 2 (thêm), 7 | n/a — `Mat_Hang_Nha_Cung_Cap` không có máy trạng thái (Δ `ngung_hoat_dong`) | 🔴 T3 | PM3CSCN.WEB.15.02.01 |
| 2 | Tìm kiếm danh mục hàng hóa theo nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.02.02 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.02.02 |
| 3 | Bỏ mặt hàng khỏi danh mục cung ứng của nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.02.03 | QT-01 bước 2 (bỏ), 7 | n/a — không có máy trạng thái | 🔴 T3 | PM3CSCN.WEB.15.02.01 |
| 4 | Kết xuất danh mục hàng hóa theo nhà cung cấp | 1 | WEB | PM3CSCN.WEB.15.02.04 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.02.02 |

#### `PM3CSCN.WEB.15.03` — Quản lý giá nhập theo nhà cung cấp

**Module:** PM3CSCN.WEB.15 · **Tầng:** 🟡 T2 (2) · 🔴 T3 (4)

**Căn cứ:** TT79 Đ41.4 (dữ liệu đối chiếu khi duyệt giá) · <span style="color:red">**<u>GD-0001</u>**</span> · **Quy trình:** QT-01 Cập nhật nhà cung cấp và giá nhập (bước 3–12) · **Business rule:** chờ lớp 6

> Giá nhập là số đối chiếu khi duyệt giá "sau khi trừ chi phí hợp lý" (TT79 Đ41.4, `1-ba-init/0-dau-vao/uc-phap-ly.md` quan hệ dữ liệu) nên khai đợt và sửa dòng giá nhập là 🟡 T2; xóa dòng giá nhập và tra cứu là 🔴 T3.

| # | Tên use case | P | Nền tảng | Mã UC | Bước quy trình | Chuyển trạng thái | Tầng | Mã UC gốc |
|---:|---|:-:|---|---|---|---|---|---|
| 1 | Khai đợt giá nhập | 1 | WEB | PM3CSCN.WEB.15.03.01 | QT-01 bước 3, 6–11 (bước 8–11 quyết định đề xuất giá bán — RQ-190) | SM mục 6: → `DRAFT` (QT-01 bước 3–10, lập hoặc thêm dòng phiếu Nháp) | 🟡 T2 | PM3CSCN.WEB.15.03.01 |
| 2 | Tìm kiếm lịch sử giá nhập | 1 | WEB | PM3CSCN.WEB.15.03.02 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.03.02 |
| 3 | Sửa dòng giá nhập | 1 | WEB | PM3CSCN.WEB.15.03.03 | QT-01 bước 4, 6–11 (bước 8–11 quyết định đề xuất giá bán — RQ-190) | SM mục 6: → `DRAFT` (QT-01 bước 3–10) | 🟡 T2 | PM3CSCN.WEB.15.03.01 |
| 4 | Xóa dòng giá nhập | 1 | WEB | PM3CSCN.WEB.15.03.04 | QT-01 bước 5, 6, 7, 11, 12 | n/a — máy Δ SM mục 4 | 🔴 T3 | PM3CSCN.WEB.15.03.01 |
| 5 | Xem chi tiết dòng giá nhập | 1 | WEB | PM3CSCN.WEB.15.03.05 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.03.02 |
| 6 | Kết xuất lịch sử giá nhập | 1 | WEB | PM3CSCN.WEB.15.03.06 | Tra cứu, không có bước | n/a — chỉ đọc | 🔴 T3 | PM3CSCN.WEB.15.03.02 |
