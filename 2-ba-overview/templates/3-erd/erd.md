# TEMPLATE — MÔ HÌNH DỮ LIỆU NGHIỆP VỤ (ERD)

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `ERD_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`. Xóa mọi khối HƯỚNG DẪN trước khi phát hành.
- Quy ước chung: ../00_quy_uoc_chung.md
- Chuẩn tham chiếu:
  · Ký hiệu quan hệ: Information Engineering — "chân chim" Crow's Foot, đúng cú pháp Mermaid erDiagram.
  · Mức mô hình: ANSI/SPARC ba mức — tài liệu này là mức LOGICAL; mức vật lý — index, partition — để thiết kế kỹ thuật.
  · Từ điển dữ liệu: ISO/IEC 11179-3 — mỗi phần tử dữ liệu có tên, định nghĩa, kiểu, miền giá trị, ràng buộc, nguồn.
  · Chuẩn hóa tối thiểu dạng chuẩn 3 — 3NF; phi chuẩn hóa có chủ đích phải ghi lý do.
  · Quản trị dữ liệu: DAMA-DMBOK 2 — phân loại nhạy cảm, chủ sở hữu dữ liệu.
  · Phân loại thông tin: ISO/IEC 27001:2022 Annex A 5.12; dữ liệu cá nhân tại Việt Nam: Luật Bảo vệ dữ liệu cá nhân 2025 và Nghị định 13/2023/NĐ-CP.
- Tài liệu này là NGUỒN DUY NHẤT về tên bảng, tên trường, mã enum. Nghiệp vụ lấy từ lớp 2.
-->

# ERD — {{TÊN DOMAIN}} {{DỰ ÁN}}

> Mô hình dữ liệu cho phần **{{phạm vi}}**, dựng từ [{{QT}}](../2-business-process/{{file}}) — chủ yếu mục 1.1 Thuật ngữ, 3 Dữ liệu trục, 3.1 Quy tắc dùng chung. **Tài liệu này là nguồn duy nhất** về mô hình dữ liệu và mã kỹ thuật.
> Tên bảng và tên trường **giữ đúng bản vẽ hiện có** [{{file.drawio}}]({{file.drawio}}) để lập trình viên đối chiếu. Giá trị liệt kê dùng **mã tiếng Anh**, tên tiếng Việt ghi cạnh.
> Gồm **{{n}} thực thể** thuộc phạm vi, {{n}} thực thể tham chiếu ngoài, {{n}} ràng buộc liên bảng `R-xx`, {{n}} điểm khác bản vẽ `E-xx`.
> Tài liệu **không** chứa index, partition (thiết kế kỹ thuật), chuyển trạng thái (máy trạng thái), nội dung quy tắc nghiệp vụ (business rule), nhãn và validate theo màn (SRS).

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| Mã tài liệu | `ERD_{{MÃ}}_{{PHẠM VI}}` |
| Dự án · Phân hệ | {{}} · {{}} |
| Phiên bản · Trạng thái | v{{NN}} · {{}} |
| Người soạn · Người review · Người duyệt | {{}} |
| Mức mật | {{Nội bộ · Hạn chế · Mật}} |
| Mức mô hình | Logical |
| Quy trình nguồn | `../2-business-process/{{file}}` v{{NN}} |
| Bản vẽ nguồn | `{{file.drawio}}` — khung {{tên khung, ngày}} |

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">YYYY-MM-DD</span>** | <span style="color:green">{{PIC}}</span> | <span style="color:green">- Dựng từ quy trình {{}} v{{NN}}: {{n}} thực thể, …</span> |

## Phê duyệt

| Vai trò | Họ tên | Ngày | Ý kiến |
|---|---|---|---|
| BA soạn | | | |
| Product owner / Khách hàng | | | |
| Tech lead | | | |

---

## 1. Quy ước

| Ký hiệu | Nghĩa |
|---|---|
| **PK** · **FK** · **UK** | Khóa chính · khóa ngoại · ràng buộc duy nhất |
| `*` | Bắt buộc |
| `◐` | Bắt buộc **có điều kiện** — điều kiện ghi ở cột Ràng buộc |
| **Giữ** · **✳** · **✎** · **⊘** | Không đổi · mới · sửa · bỏ — so với bản vẽ gốc |
| **🧪** | ERD **tự đề xuất** để hiện thực quy trình; quy trình chưa nêu — xem mục 7 |
| **Δ** | Giá trị dẫn xuất — không lưu, tính khi truy vấn |
| *Ngoài* | Thực thể của phân hệ khác; chỉ vẽ để thấy liên kết |

**Quy ước chung cho mọi bảng** — không lặp lại trong từ điển:

<!-- Điền theo dự án. Các dòng dưới là mặc định đề xuất cho hệ thống có chứng từ — giữ, sửa hoặc bỏ. -->

- Khóa chính: `id {{uuid}}`.
- Trường chung: `{{don_vi_id}}`, `nguoi_tao`, `thoi_diem_tao`, `nguoi_cap_nhat`, `thoi_diem_cap_nhat`. **UK nghiệp vụ** tính trong phạm vi `{{don_vi_id}}`.
- Chứng từ có `row_version int` cho **khóa lạc quan** — {{GS-xx}}.
- Tiền: `decimal({{18,0}})`, đơn vị {{đồng}}. Số lượng: `int`. Ngày giờ lưu kèm múi giờ; so theo ngày dùng {{giờ Việt Nam}}.
- **Xóa mềm**: `da_xoa`, `nguoi_xoa_id`, `thoi_diem_xoa` — áp cho {{danh mục}}.
- **Tham chiếu ngoài phân hệ** là tham chiếu logic, **không** đặt khóa ngoại cơ sở dữ liệu; dữ liệu cần để quyết định được **chụp** vào chứng từ.
- **Khóa ngoại đa hình** luôn đi cùng cột loại, có chỉ mục (loại, id) — bảng ánh xạ ở mục 5.2.
- **Không lưu cờ** cho {{các khóa, trạng thái dẫn xuất}} — suy ra khi truy vấn.
- Đặt tên: bảng `Pascal_Snake` tiếng Việt không dấu · trường `snake_case` · enum `UPPER_SNAKE` tiếng Anh.

---

## 2. Danh sách thực thể

| # | Thực thể | Nhóm | Thay đổi | Loại | Quy trình ghi | Chủ sở hữu dữ liệu | Nghĩa ngắn |
|---|---|---|---|---|---|---|---|
| 1 | `{{Bang}}` | {{A. Nhóm}} | ✳ · ✎ · Giữ | {{Danh mục · Chứng từ · Dòng chứng từ · Sổ ghi thêm · Cấu hình · Nhật ký}} | {{XX-01}} | {{Tác nhân}} | {{}} |

**Thực thể tham chiếu ngoài:**

| Thực thể | Phân hệ | Dùng để | Cách liên kết |
|---|---|---|---|
| `{{}}` | {{Hệ thống CRM}} | {{}} | Tham chiếu logic · chụp {{trường}} |

---

## 3. Sơ đồ quan hệ

Mỗi sơ đồ vẽ một nhóm; thực thể nhóm khác chỉ hiện khóa chính. Thuộc tính đầy đủ ở mục 4.

<!--
Bản số Crow's Foot trong Mermaid:
  ||--||  một — một            ||--o{  một — không hoặc nhiều
  ||--|{  một — một hoặc nhiều |o--o|  không hoặc một — không hoặc một
Nhãn quan hệ viết động từ tiếng Việt, đọc từ trái sang phải.
-->

### 3.1. Tổng quan giữa các nhóm

```mermaid
erDiagram
    {{Bang_A}} ||--o{ {{Bang_B}} : "{{động từ}}"
```

### 3.2. Nhóm A — {{Tên nhóm}}

```mermaid
erDiagram
    {{Bang_A}} ||--o{ {{Bang_B}} : "{{động từ}}"
    {{Bang_A}} {
        uuid id PK
        varchar ma UK
        enum trang_thai
    }
```

---

## 4. Từ điển dữ liệu

### 4.1. Nhóm A — {{Tên nhóm}}

<!-- ============ KHỐI LẶP CHO MỖI THỰC THỂ ============ -->

#### `{{Ten_Bang}}` — {{tên nghiệp vụ}} · {{✳ / ✎ / Giữ}}

{{Một đến ba câu: bảng lưu gì, một dòng là gì — grain, ai tạo, khi nào. Dẫn D-xx.}}

| Trường | Kiểu | Ràng buộc | Đổi | Mô tả | Nguồn |
|---|---|---|---|---|---|
| `{{ma}}` | varchar | `*` UK trong {{phạm vi}} | Giữ | {{}} | {{D-xx}} |
| `{{fk_id}}` | FK → `{{Bang}}` | `*` | ✳ | {{}} | {{}} |
| `trang_thai` | enum | `*` | ✎ | `{{CODE_1}}` {{tên Việt}} · `{{CODE_2}}` {{tên Việt}} — máy trạng thái SM mục {{n}} | {{XX-01}} |
| `{{truong_dieu_kien}}` | text | `◐` khi {{điều kiện}} | ✳ | {{}} | {{}} |

**Giá trị dẫn xuất Δ:** {{tên}} = {{công thức truy vấn}} — {{GS-xx}}.

<!-- ============ HẾT KHỐI LẶP ============ -->

### 4.x. Danh mục mã enum

<!-- Gom mọi enum về một bảng để seed dữ liệu và dịch giao diện. -->

| Enum | Mã | Tên hiển thị | Dùng ở |
|---|---|---|---|
| `{{ten_enum}}` | `{{CODE}}` | {{Tên Việt}} | `{{Bang.truong}}` |

---

## 5. Ràng buộc liên bảng và đối soát

### 5.1. Đẳng thức và ràng buộc toàn vẹn

{{Tác vụ N-xx}} kiểm các đẳng thức dưới; lệch thì cảnh báo, **không tự sửa**.

| Mã | Đẳng thức hoặc ràng buộc | Loại | Nguồn |
|---|---|---|---|
| R-01 | {{`Bang_A.x` = Σ `Bang_B.y` theo (`k1`, `k2`)}} | {{Đối soát · Duy nhất · Loại trừ · Tách nhiệm · Khớp trạng thái}} | {{GS-xx}} |

**Thứ tự khóa:** {{để tránh khóa chéo}}.

### 5.2. Khóa ngoại đa hình

| `loai_chung_tu` | `chung_tu_id` → | `chung_tu_chi_tiet_id` → |
|---|---|---|
| `{{CODE}}` | `{{Bang}}` | `{{Bang_CT}}` |

### 5.3. Trạng thái suy từ bảng con

<!-- Dùng khi trạng thái bảng cha tính từ bảng con. Xét theo thứ tự từ trên xuống. -->

| Trạng thái bảng cha | Điều kiện |
|---|---|

---

## 6. Thực thể bỏ, đổi tên

| Thực thể | Xử lý | Nguồn |
|---|---|---|
| `{{}}` | **Bỏ** · **Đổi tên** thành `{{}}` · **Gộp** vào `{{}}` | {{D-xx}} |

---

## 7. Điểm ERD khác hoặc bổ sung so với bản vẽ và quy trình

Cần BA xác nhận. Điểm chạm nghiệp vụ thì sửa thân quy trình.

| Mã | Điểm | Đề xuất mặc định | Ảnh hưởng quy trình |
|---|---|---|---|
| E-01 | {{}} | {{}} | Có — {{GS-xx}} · Không |

---

## 8. Câu hỏi cần BA chốt

| Mã | Câu hỏi | Kịch bản | Đề xuất mặc định | Người chốt | Quyết định |
|---|---|---|---|---|---|
| Q-E1 | {{}} | {{ví dụ số, thời điểm cụ thể}} | {{✅ BA chốt dd/mm/yyyy: …}} |

---

## 9. Dữ liệu nhạy cảm

<!-- Mức theo phân loại thông tin của dự án — ISO/IEC 27001 A 5.12. Dữ liệu cá nhân nhạy cảm theo NĐ 13/2023/NĐ-CP Điều 2 khoản 4. -->

| Dữ liệu | Bảng · trường | Loại | Mức | Ai được xem | Xử lý — che, mã hóa, không lưu |
|---|---|---|---|---|---|
| {{}} | `{{}}` | {{Cá nhân cơ bản · Cá nhân nhạy cảm · Tài chính · Nội bộ}} | Cao · TB · Thấp | {{}} | {{}} |

**Thời hạn lưu trữ:** {{theo quy định lưu trữ của dự án / văn bản}}.

---

## 10. Rủi ro còn lại

| Mã | Rủi ro | Căn cứ bị ảnh hưởng | Mức | Biện pháp | Cần khách xác nhận văn bản |
|---|---|---|:-:|---|:-:|
| RK-01 | {{}} | {{}} | C · TB · T | {{}} | Có · Không |

---

## 11. Điểm tạm hoãn

<!-- Việc đã rõ nhưng cố ý chưa làm ở phiên bản này. Không có thì ghi *Không có*. -->

| Mã | Nội dung | Ngày tạm hoãn | Điều kiện mở lại |
|---|---|---|---|
| TH-01 | {{}} | {{DD/MM/YYYY}} | {{}} |

---

## 12. Nguồn

| Tài liệu | Dùng cho |
|---|---|
| [{{QT}}](../2-business-process/{{file}}) | Thuật ngữ, dữ liệu trục, GS-xx, D-xx |
| [{{drawio}}]({{file}}) | Tên bảng, tên trường gốc |
