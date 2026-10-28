# TEMPLATE — BUSINESS REQUIREMENTS DOCUMENT (BRD)

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao file này thành `BRD_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`, xóa mọi khối HƯỚNG DẪN trước khi phát hành.
- {{...}} là chỗ điền. Dòng ví dụ in nghiêng là minh họa — thay bằng nội dung dự án.
- Quy ước chung — đặt tên, hệ mã, ký hiệu, version control: ../00_quy_uoc_chung.md
- Chuẩn tham chiếu: ISO/IEC/IEEE 29148:2018 mục 9.3 Business Requirements Specification · IIBA BABOK v3 chương 6 Strategy Analysis và 7.1 Specify and Model Requirements · ISO/IEC 25010:2023 cho nhóm phi chức năng.
- BRD trả lời VÌ SAO và CÁI GÌ ở mức nghiệp vụ. Không mô tả màn hình, nút, API, bảng dữ liệu.
-->

# BRD — {{TÊN DỰ ÁN}} {{PHÂN HỆ}}

> **{{n}} mục tiêu nghiệp vụ, {{n}} yêu cầu nghiệp vụ, {{n}} bên liên quan** của {{phạm vi}}, dựng từ {{nguồn: văn bản pháp luật, khảo sát, feedback khách hàng}}.
> Mỗi yêu cầu nghiệp vụ `BRQ-xx` gắn **một mục tiêu** `OBJ-xx`, **một căn cứ** và **tiêu chí chấp nhận** kiểm chứng được.
> Chi tiết luồng ở [Quy trình nghiệp vụ](../2-business-process/), ràng buộc ở [Business rule](../6-business-rules/). BRD **không** đặc tả màn hình và dữ liệu.

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| Mã tài liệu | `BRD_{{MÃ}}_{{PHẠM VI}}` |
| Dự án · Phân hệ | {{}} · {{}} |
| Khách hàng · Đơn vị sử dụng | {{}} |
| Phiên bản hiện tại · Trạng thái | v{{NN}} · {{Nháp / Chờ review / Đã duyệt / Hết hiệu lực}} |
| Người soạn · Người review · Người duyệt | {{}} |
| Mức mật | {{Nội bộ}} |

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">YYYY-MM-DD</span>** | <span style="color:green">{{PIC}}</span> | <span style="color:green">- Khởi tạo tài liệu.</span> |

## Phê duyệt

| Vai trò | Họ tên | Ngày | Ý kiến |
|---|---|---|---|
| BA soạn | | | |
| Đại diện khách hàng — người tài trợ dự án | | | |
| Product owner | | | |
| Tech lead | | | |

---

## 1. Bối cảnh và vấn đề nghiệp vụ

<!-- BABOK 6.1 Analyze Current State · 29148 9.3.2 Business purpose. Nêu VẤN ĐỀ, không nêu giải pháp. -->

### 1.1. Bối cảnh

{{Đơn vị, nghiệp vụ hiện đang vận hành ra sao, quy mô — số đơn vị, số người dùng, số giao dịch.}}

### 1.2. Vấn đề và cơ hội

| # | Vấn đề hoặc cơ hội | Bằng chứng — số liệu, khảo sát, feedback | Hệ quả nếu không giải quyết |
|---|---|---|---|
| P-01 | {{*Khách phải gọi điện hoặc tới quầy để đặt lịch, chờ trung bình 20 phút*}} | {{*Khảo sát tại quầy, mục 2*}} | {{}} |

### 1.3. Căn cứ pháp lý và chính sách

| Văn bản | Số hiệu · ngày | Hiệu lực | Vai trò với dự án |
|---|---|---|---|
| {{*Quy chế đặt lịch*}} | {{*QC01 ngày 01/01/2026*}} | {{}} | {{**Nguồn chính** — Điều 5, 6, 7}} |

**Kết luận rà soát** — với văn bản đã rà nhưng không sinh yêu cầu, ghi rõ *đã rà toàn văn, không sinh yêu cầu* kèm lý do, để người sau không rà lại.

---

## 2. Mục tiêu nghiệp vụ

<!-- BABOK 6.2 Define Future State. Mục tiêu theo SMART: cụ thể, đo được, khả thi, liên quan, có thời hạn. -->

| Mã | Mục tiêu | Chỉ số đo — KPI | Hiện tại | Mục tiêu | Thời hạn | Vấn đề giải quyết |
|---|---|---|---|---|---|---|
| OBJ-01 | {{*Tăng tỷ lệ lịch hẹn đặt trực tuyến*}} | {{*% lịch hẹn đặt trực tuyến*}} | {{*0%*}} | {{*90%*}} | {{*Sau 3 tháng vận hành*}} | P-01 |

---

## 3. Phạm vi

<!-- 29148 9.3.3 Business scope. Mỗi mục "ngoài phạm vi" ghi nơi xử lý thay thế. -->

**Trong phạm vi:** {{liệt kê bằng dấu · như tài liệu QT}}.

**Ngoài phạm vi:**

| Nội dung | Lý do | Xử lý ở đâu |
|---|---|---|
| {{*Thu phí dịch vụ*}} | {{}} | {{*Hệ thống kế toán, ngoài hệ thống*}} |

**Giai đoạn:** {{MVP P1 gồm …; P2 gồm …}}

### 3.1. Sơ đồ ngữ cảnh

<!-- Hệ thống ở giữa, tác nhân và hệ thống ngoài xung quanh, mũi tên là luồng thông tin nghiệp vụ. -->

```mermaid
flowchart LR
    U1[{{Tác nhân 1}}] -- {{luồng}} --> S(({{Hệ thống}}))
    S -- {{luồng}} --> U2[{{Tác nhân 2}}]
    EXT1[[{{Hệ thống ngoài — CRM}}]] -- {{sự kiện}} --> S
```

### 3.2. Hệ thống liên quan

| Hệ thống | Chủ sở hữu | Chiều | Dữ liệu trao đổi | Nguồn sự thật của |
|---|---|---|---|---|
| {{*Hệ thống CRM*}} | {{}} | {{Vào / Ra / Hai chiều}} | {{*Thông tin liên hệ của khách*}} | {{*Hồ sơ khách hàng*}} |

---

## 4. Bên liên quan

<!-- BABOK 3.2 Stakeholder Analysis. Tác nhân thao tác hệ thống chi tiết ở lớp 5; ở đây gồm cả bên không thao tác — người duyệt ngân sách, cơ quan quản lý. -->

| Mã | Bên liên quan | Thuộc | Quan tâm chính | Ảnh hưởng | Mức quan tâm | Vai trò trong dự án |
|---|---|---|---|---|---|---|
| SH-01 | {{*Giám đốc trung tâm*}} | {{}} | {{}} | Cao · Trung bình · Thấp | Cao · Trung bình · Thấp | {{Duyệt · Dùng · Tư vấn · Được thông báo}} |

### 4.1. Ma trận RACI cho sản phẩm tài liệu

| Hạng mục | {{SH-01}} | {{SH-02}} | BA | Dev lead |
|---|:-:|:-:|:-:|:-:|
| Chốt phạm vi | A | C | R | I |
| Chốt business rule | | | | |

R thực hiện · A chịu trách nhiệm cuối · C được hỏi ý kiến · I được thông báo.

---

## 5. Thuật ngữ

<!-- Chỉ thuật ngữ nghiệp vụ dùng trong BRD. Thuật ngữ chi tiết của domain đặt ở QT mục 1.1. -->

| Thuật ngữ | Định nghĩa | Căn cứ |
|---|---|---|
| **{{}}** | {{}} | {{}} |

---

## 6. Mô hình nghiệp vụ

### 6.1. Hiện trạng — As-Is

{{Tóm tắt cách làm hiện nay, điểm đau, chứng từ giấy đang dùng.}}

### 6.2. Mong muốn — To-Be

| Nhóm quy trình | Quy trình | Thay đổi so với hiện trạng | Tài liệu chi tiết |
|---|---|---|---|
| {{*Đặt lịch hẹn*}} | {{*LH-01, LH-02*}} | {{}} | `../2-business-process/{{file}}` |

---

## 7. Yêu cầu nghiệp vụ

<!--
29148 5.2.5 thuộc tính yêu cầu tốt — xem ../00_quy_uoc_chung.md mục 7.
Ưu tiên theo MoSCoW: M phải có · S nên có · C có thì tốt · W không làm giai đoạn này.
Tiêu chí chấp nhận viết dạng kiểm chứng được — Given / When / Then hoặc mệnh đề đo được.
-->

| Mã | Yêu cầu | Lý do | Mục tiêu | Căn cứ | Ưu tiên | Tiêu chí chấp nhận | Bên đề xuất |
|---|---|---|---|---|:-:|---|---|
| BRQ-01 | {{*Trung tâm phải xét duyệt hoặc từ chối mọi yêu cầu đặt lịch trước ngày hẹn*}} | {{}} | OBJ-01 | {{*QC01 Đ6.1*}} | M | {{*Mọi yêu cầu đặt lịch có quyết định duyệt hoặc từ chối trước ngày hẹn*}} | SH-01 |

---

## 8. Chính sách và quy tắc nghiệp vụ

<!-- 29148 9.3.5 Business operational policies and rules. Chỉ tóm tắt nhóm, chi tiết ở lớp 6. -->

| Nhóm quy tắc | Số quy tắc | Căn cứ chính | Tài liệu chi tiết |
|---|---:|---|---|
| {{*A — Hạn mức đặt lịch*}} | {{4}} | {{*QC01 Đ5.1*}} | `../6-business-rules/{{file}}` mục {{}} |

---

## 9. Yêu cầu phi chức năng mức nghiệp vụ

<!-- Theo nhóm chất lượng ISO/IEC 25010:2023. Chỉ ghi ở mức nghiệp vụ đòi hỏi — con số kỹ thuật chi tiết để SRS. -->

| Mã | Nhóm ISO 25010 | Yêu cầu | Căn cứ | Ưu tiên |
|---|---|---|---|:-:|
| NFR-01 | Bảo mật — Security | {{*Thông tin cá nhân của khách chỉ nhân viên được phân công xem*}} | {{}} | M |
| NFR-02 | Tin cậy — Reliability | {{}} | | |
| NFR-03 | Hiệu năng — Performance efficiency | {{}} | | |
| NFR-04 | Dễ dùng — Interaction capability | {{}} | | |
| NFR-05 | Tương thích — Compatibility | {{*Đồng bộ thông tin khách với hệ thống CRM*}} | | |
| NFR-06 | Lưu trữ, kiểm toán | {{*Mọi thay đổi chứng từ có nhật ký người, thời điểm, lý do*}} | | |

---

## 10. Ràng buộc, giả định, phụ thuộc

| Loại | Mã | Nội dung | Ảnh hưởng nếu sai |
|---|---|---|---|
| Ràng buộc | CON-01 | {{*Thời hạn bàn giao MVP*}} | |
| Giả định | ASM-01 | {{*Hệ thống CRM cung cấp API tra cứu khách hàng*}} | |
| Phụ thuộc | DEP-01 | {{}} | |

---

## 11. Tiêu chí thành công và chuyển đổi

<!-- BABOK 7.5 Transition requirements: dữ liệu cũ, đào tạo, chạy song song. -->

| Hạng mục | Nội dung | Người chịu trách nhiệm |
|---|---|---|
| Tiêu chí nghiệm thu nghiệp vụ | {{Đo theo OBJ-xx}} | |
| Chuyển đổi dữ liệu | {{*Danh sách khách hàng từ sổ đặt lịch cũ*}} | |
| Đào tạo | {{}} | |
| Vận hành song song | {{}} | |

---

## 12. Truy vết

<!-- Cập nhật sau khi có lớp 2, 5, 6. Mỗi BRQ phải xuống được ít nhất một QT, BR hoặc UC. -->

| Mục tiêu | Yêu cầu nghiệp vụ | Quy trình | Business rule | Use case |
|---|---|---|---|---|
| OBJ-01 | BRQ-01 | {{QT-02}} | {{BR-B01}} | {{C-II.1}} |

---

## 13. Rủi ro còn lại

| Mã | Rủi ro | Căn cứ bị ảnh hưởng | Khả năng | Tác động | Biện pháp | Cần khách xác nhận văn bản |
|---|---|---|:-:|:-:|---|:-:|
| RK-01 | {{}} | {{}} | C · TB · T | C · TB · T | {{}} | Có · Không |

## 14. Câu hỏi cần chốt

| Mã | Câu hỏi | Kịch bản | Đề xuất mặc định | Người chốt | Quyết định |
|---|---|---|---|---|---|
| Q-B01 | {{}} | {{}} | {{}} | {{BA + khách}} | {{✅ dd/mm/yyyy: …}} |

## 15. Điểm tạm hoãn

<!-- Việc đã rõ nhưng cố ý chưa làm ở phiên bản này. Không có thì ghi *Không có*. -->

| Mã | Nội dung | Ngày tạm hoãn | Điều kiện mở lại |
|---|---|---|---|
| TH-01 | {{}} | {{DD/MM/YYYY}} | {{}} |

## 16. Nguồn

| Tài liệu | Đường dẫn | Dùng cho |
|---|---|---|
| {{}} | {{}} | {{}} |
