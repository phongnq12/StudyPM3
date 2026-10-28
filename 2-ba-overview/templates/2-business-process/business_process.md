# TEMPLATE — QUY TRÌNH NGHIỆP VỤ

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `QT_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`. Xóa mọi khối HƯỚNG DẪN trước khi phát hành.
- Quy ước chung: ../00_quy_uoc_chung.md
- Chuẩn tham chiếu:
  · BPMN 2.0.2 — ISO/IEC 19510:2013: sự kiện, hoạt động, cổng rẽ nhánh, làn tác nhân.
  · ISO 9001:2015 mục 4.4: mỗi quy trình có đầu vào, đầu ra, người chịu trách nhiệm, rủi ro, chỉ số theo dõi.
  · SIPOC: Nhà cung cấp → Đầu vào → Quy trình → Đầu ra → Khách hàng — tương ứng "Đầu vào từ", "Đầu ra kích hoạt".
  · COSO Internal Control 2013 — tách nhiệm, điểm kiểm soát.
  · BABOK 10.35 Process Modelling.
- Mã quy trình: QT-nn cho quy trình chung; {XX}-nn cho domain — ví dụ LH-01. Quy trình con thêm hậu tố chữ: LH-05B.
-->

# QUY TRÌNH {{TÊN DOMAIN}} — {{DỰ ÁN}}

> **{{n}} quy trình, {{n}} tác vụ nền và {{n}} tham số cấu hình** của {{domain}}, dựng từ {{nguồn}}.
> Mỗi quy trình gồm **bảng các bước** kèm căn cứ và chứng từ, **một sơ đồ Mermaid**, **bảng trường hợp biên** và **điểm kiểm soát**.
> Nút trong sơ đồ mang **đúng số bước của bảng** — `B1`, `B2`… — để đối chiếu hai chiều. Nút không mang số là điểm bắt đầu, kết thúc, nhánh chặn, hoặc kết quả con của bước đứng ngay trước.
> Cột **Căn cứ** dẫn ba loại nguồn: **văn bản pháp luật** khi bước là nghĩa vụ pháp lý · **`D-xx`** ở mục 4 khi là lựa chọn nghiệp vụ của dự án · **`CH-xx`** ở mục 6 khi dùng ngưỡng cấu hình.
> 🟡 **Ngoài phạm vi hệ thống** — bước tô vàng là nghĩa vụ có thật nhưng không xây chức năng; giữ lại để thấy đủ luồng.
> Giá trị liệt kê viết **tên tiếng Việt**. Mã kỹ thuật ở [ERD](../3-erd/{{file}}).
> Tài liệu **không** chứa {{màn hình, API, cấu trúc bảng, chuyển trạng thái chi tiết}} — xem {{ERD, máy trạng thái, SRS}}.

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| Mã tài liệu | `QT_{{MÃ}}_{{PHẠM VI}}` |
| Dự án · Phân hệ | {{}} · {{}} |
| Phiên bản · Trạng thái | v{{NN}} · {{}} |
| Người soạn · Người review · Người duyệt | {{}} |
| Mức mật | {{Nội bộ · Hạn chế · Mật}} |
| Tài liệu cấp trên | `../1-brd/{{BRD}}` |

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">YYYY-MM-DD</span>** | <span style="color:green">{{PIC}}</span> | <span style="color:green">- Khởi tạo tài liệu: {{n}} quy trình {{mã đầu}} đến {{mã cuối}}; {{n}} tác vụ nền; {{n}} tham số; quyết định D-xx; thuật ngữ.</span> |

## Phê duyệt

| Vai trò | Họ tên | Ngày | Ý kiến |
|---|---|---|---|
| BA soạn | | | |
| Product owner / Khách hàng | | | |
| Tech lead | | | |

---

## 1. Phạm vi và nguồn

**Trong phạm vi:** {{nghiệp vụ 1}} · {{nghiệp vụ 2}} · {{…}}.

**Ngoài phạm vi:**
- {{Nội dung}} — đặc tả tại **{{QT-xx / tài liệu khác}}**; tài liệu này chỉ nối vào.

| Nguồn | Đường dẫn | Vai trò |
|---|---|---|
| {{BRD}} | `../1-brd/{{file}}` | Mục tiêu, phạm vi |
| {{Business rule}} | `../6-business-rules/{{file}}` — nhóm {{}} | {{Ràng buộc pháp lý}} |
| {{Văn bản pháp luật}} | {{số hiệu}} — Điều {{}} · `{{đường dẫn}}` | {{}} |

### 1.1. Thuật ngữ

<!-- Mọi thuật ngữ dùng trong tài liệu phải có ở đây. Gom nhóm a, b, c… theo khái niệm. Cột Thực thể ERD để trống khi là khái niệm tính toán. -->

Các loại khóa định nghĩa ở mục 3, quy tắc `GS-xx` ở mục 3.1, tham số `CH-xx` ở mục 6.

#### a. {{Nhóm khái niệm 1}}

| Thuật ngữ | Định nghĩa | Thực thể ERD |
|---|---|---|
| **{{Thuật ngữ}}** | {{Định nghĩa — có ví dụ cụ thể khi dễ nhầm; dẫn D-xx, GS-xx nếu có}} | `{{Bang}}` hoặc — |

#### {{x}}. Phê duyệt và chứng từ

| Thuật ngữ | Định nghĩa |
|---|---|
| **Gửi duyệt** | {{}} |
| **Duyệt** · **Từ chối** · **Trả về** | {{}} |

---

## 2. Tác nhân

<!-- Ghi cả tác nhân người, hệ thống ngoài và "Hệ thống". Căn cứ ghi điều khoản phân công hoặc D-xx. -->

| Tác nhân | Vai trò trong {{domain}} | Căn cứ |
|---|---|---|
| **{{Tác nhân}}** | {{Thao tác 1}} · {{thao tác 2}} | {{}} |
| **Hệ thống** | {{Việc hệ thống tự làm}} | — |

**Tách nhiệm bắt buộc — COSO:** {{người lập chứng từ không tự duyệt · …}}. Mỗi thao tác workflow — {{gửi duyệt, duyệt, trả về, hủy…}} — là **một quyền riêng**. Ma trận quyền chi tiết đặc tả ở SRS.

---

## 3. Bản đồ quy trình và dữ liệu trục

```mermaid
flowchart TD
    A[{{XX-01 Tên}}] -- {{điều kiện}} --> B[{{XX-02 Tên}}]
    B --> C[{{XX-03 Tên}}]
    C --> Z[{{QT-xx quy trình ngoài}}]
```

<!-- Các khối dưới đây DÙNG KHI domain có dữ liệu sổ cái, tồn, ví — xóa nếu không cần. -->

**Bảng dữ liệu trục:**

| Bảng | Trả lời | Ai ghi |
|---|---|---|
| `{{Bang}}` | {{Câu hỏi nghiệp vụ bảng này trả lời}} | {{XX-01 tạo · XX-03 sửa}} |

**Loại biến động** — {{định nghĩa ở 1.1}}:

| Loại | Dấu | Quy trình |
|---|:-:|---|
| **{{}}** | + · − | {{}} |

**Nguyên tắc bảo toàn:** {{đẳng thức luôn đúng}}

**Các loại khóa** do hệ thống tự áp, **suy ra từ dữ liệu**, không lưu cờ riêng:

| Khóa | Bật khi | Chặn | Gỡ khi | Căn cứ |
|---|---|---|---|---|
| **{{}}** | {{}} | {{}} | {{}} | {{D-xx}} |

### 3.1. Quy tắc dùng chung

<!-- Quy tắc tính toán, đồng thời, giao dịch, làm tròn, múi giờ — áp cho nhiều quy trình. -->

| Mã | Quy tắc |
|---|---|
| **GS-01 {{Tên}}** | {{}} |

---

## 4. Quyết định thiết kế

<!-- Nhật ký quyết định nghiệp vụ — tương tự Architecture Decision Record. Mỗi quyết định: chọn gì, vì sao, phương án bị loại nếu có. -->

Các mã {{D-xx}} đã bỏ, không dùng lại.

| Mã | Nhóm | Quyết định | Ngày chốt · người chốt |
|---|---|---|---|
| **D-01** | {{Nhóm}} | {{Nội dung quyết định — ghi rõ phạm vi áp và ngoại lệ}} | {{BA chốt dd/mm/yyyy}} |

---

# PHẦN A — {{NHÓM QUY TRÌNH}}

<!-- ============ KHỐI LẶP CHO MỖI QUY TRÌNH ============ -->

## {{XX-01}}. {{Tên quy trình — động từ + đối tượng}}

| Mục | Nội dung |
|---|---|
| **Mục đích** | {{Kết quả nghiệp vụ quy trình tạo ra}} |
| **Chủ quy trình** | {{Tác nhân chịu trách nhiệm cuối — ISO 9001 4.4}} |
| **Kích hoạt** | {{Sự kiện bắt đầu}} |
| **Đầu vào từ** | {{Quy trình, tác nhân, chứng từ cung cấp đầu vào}} |
| **Đầu ra kích hoạt** | {{XX-02 khi … · QT-xx khi …}} |
| **Tần suất** | {{Hằng ngày · theo sự kiện · {{n}}/tháng}} |
| **Chỉ số theo dõi** | {{*Thời gian từ gửi duyệt tới duyệt ≤ CH-03*}} — không bắt buộc |
| **Căn cứ** | {{VBPL}} · {{BR-xx}} · {{D-xx}} · {{GS-xx}} · {{CH-xx}} |

| Bước | Tác nhân | Hành động | Căn cứ | Chứng từ |
|---|---|---|---|---|
| 1 | {{Tác nhân}} | {{Động từ + đối tượng; **in đậm** chỗ quyết định}} | {{}} | {{Tên chứng từ — có mẫu: ghi **Mẫu số**; không có: ghi *không có mẫu*; không sinh: —}} |
| 2 | Hệ thống | {{Kiểm tra · tính · ghi sổ}} | {{}} | — |
| 🟡 3 | <span style="color:#B8860B">{{Tác nhân}}</span> | <span style="color:#B8860B">{{Bước ngoài phạm vi}}</span> | <span style="color:#B8860B">{{}}</span> | <span style="color:#B8860B">{{}}</span> |

<!--
Ký hiệu BPMN trong Mermaid:
  ([...])  sự kiện bắt đầu / kết thúc       [...]   hoạt động — Task
  {...}    cổng rẽ nhánh — Gateway           [[...]] gọi quy trình khác — Call Activity
  Nhãn cạnh "-- điều kiện -->" là điều kiện của cổng.
  Cần làn tác nhân thì dùng subgraph theo tác nhân.
-->

```mermaid
flowchart TD
    S0([{{Sự kiện kích hoạt}}]) --> B1[B1. {{Hành động}}]
    B1 --> B2{B2. {{Điều kiện}}}
    B2 -- {{Đạt}} --> B3[B3. {{Hành động}}]
    B2 -- {{Không đạt}} --> X1([Chặn — {{lý do}}])
    B3 --> E1[[Sang {{XX-02}}]]
```

**Trường hợp biên**

<!-- Mỗi dòng là một tình huống kiểm thử được. Xử lý ghi: Chặn · Cho phép kèm điều kiện · Cảnh báo · Chuyển quy trình. -->

| Tình huống | Xử lý |
|---|---|
| {{Tình huống}} | {{Chặn / Cho phép …}} — {{căn cứ, BA chốt dd/mm/yyyy}} |

**Điểm kiểm soát bắt buộc:** {{điều hệ thống phải cưỡng chế}} · {{…}}.

---

<!-- ============ HẾT KHỐI LẶP ============ -->

## 5. Tác vụ nền của hệ thống

Giờ chạy theo {{múi giờ}}. Mỗi cảnh báo có **khóa chống lặp**; cảnh báo **tự đóng** khi điều kiện bật không còn.

| Mã | Tác vụ | Nguồn dữ liệu | Tham số | Lịch chạy | Người nhận | Khóa chống lặp | Kết quả |
|---|---|---|---|---|---|---|---|
| **N-01** | {{}} | {{}} | {{CH-xx}} | {{}} | {{}} | {{}} | {{Cảnh báo, không tự sửa}} |

### 5.1. Sự kiện nhận từ hệ thống ngoài

| Sự kiện từ {{hệ thống}} | Quy trình chung | Nhãn | Tác động |
|---|---|---|---|
| {{}} | {{}} | {{}} | {{}} |

---

## 6. Tham số cấu hình

Quy trình dẫn mã `CH-xx` thay vì ghi con số. Tham số **lưu lịch sử thay đổi** và **chụp vào chứng từ lúc tạo**. Giá trị mặc định là **đề xuất**, BA chốt trước triển khai.

| Mã | Tham số | Đơn vị | Mặc định đề xuất | Phạm vi áp | Nơi lưu | Người cấu hình | Quy trình dẫn |
|---|---|---|---|---|---|---|---|
| **CH-01** | {{}} | {{}} | {{}} | {{Đơn vị · Chi nhánh · …}} | {{}} | {{}} | {{}} |

**Ràng buộc giá trị:** {{CH-01 số nguyên ≥ 0 · …}}

---

## 7. Truy vết một ví dụ

<!-- Một kịch bản số cụ thể đi qua nhiều quy trình, chứng minh các quy tắc bảo toàn khớp. Dùng làm testcase end-to-end. -->

{{Bối cảnh ví dụ}}

| Thời điểm | Việc | {{Sổ 1}} | {{Sổ 2}} |
|---|---|---|---|
| {{}} | {{}} | {{}} | {{}} |

→ *{{Kiểm tra đẳng thức}}*

---

## 8. Bảng tổng hợp chứng từ

### 8.1. Chứng từ có mẫu ban hành — bắt buộc dùng đúng mẫu

| Chứng từ | Mẫu số | Phụ lục | Văn bản ban hành | Điều khoản yêu cầu lập | Quy trình |
|---|---|---|---|---|---|

### 8.2. Chứng từ không có mẫu — tự thiết kế

| Chứng từ | Điều khoản yêu cầu lập | Nội dung bắt buộc phải có | Quy trình |
|---|---|---|---|

### 8.3. Chứng từ nội bộ của hệ thống

{{Phiếu A · phiếu B · …}}

---

## 9. Điểm kiểm soát bắt buộc — tổng hợp

Điểm có chữ **phải**, **trước khi**, **không được** trong căn cứ. Hệ thống cưỡng chế, người dùng không bỏ qua được.

| # | Điểm kiểm soát | Loại kiểm soát | Quy trình | Căn cứ |
|---|---|---|---|---|
| 1 | {{}} | {{Ngăn chặn · Phát hiện · Tách nhiệm · Phê duyệt}} | {{}} | {{}} |

---

## 10. Quy trình chưa có Use case

| Quy trình | Nghĩa vụ | Căn cứ |
|---|---|---|

---

## 11. Rủi ro còn lại, điểm tạm hoãn, câu hỏi

### 11.1. Rủi ro còn lại

| Mã | Rủi ro | Căn cứ bị ảnh hưởng | Mức | Biện pháp | Cần khách xác nhận văn bản |
|---|---|---|:-:|---|:-:|

### 11.2. Điểm tạm hoãn

| Mã | Nội dung | Ngày tạm hoãn | Điều kiện mở lại |
|---|---|---|---|

### 11.3. Câu hỏi cần chốt

| Mã | Câu hỏi | Kịch bản | Đề xuất mặc định | Người chốt | Quyết định |
|---|---|---|---|---|---|

---

## 12. Nguồn

| Nội dung | Đường dẫn |
|---|---|
