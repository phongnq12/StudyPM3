# TEMPLATE — MA TRẬN TRUY VẾT YÊU CẦU

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `TRACE_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`. Xóa mọi khối HƯỚNG DẪN trước khi phát hành.
- Reverse từ TRACE_PM3_UseCase_VBPL_v00.md.
- Quy ước chung: ../00_quy_uoc_chung.md
- Chuẩn tham chiếu:
  · ISO/IEC/IEEE 29148:2018 mục 5.2.8 và 6.5 — truy vết hai chiều: xuôi từ nguồn tới yêu cầu và ngược lại.
  · IIBA BABOK v3 mục 5.1 Trace Requirements — quan hệ derive, depends, satisfy, validate.
  · ISO/IEC/IEEE 29119-3 — truy vết yêu cầu tới testcase, nếu nối sang QC.
-->

# MA TRẬN TRUY VẾT USE CASE ↔ {{NGUỒN}} — {{DỰ ÁN}}

> Phân loại **toàn bộ {{n}} use case** theo mức căn cứ, để truy vết hai chiều:
> **UC → căn cứ** khi cần chứng minh tuân thủ · **căn cứ → UC** khi cần kiểm tra đã phủ hết nghĩa vụ.
> Tham chiếu chéo: [Business rule](../6-business-rules/{{file}}) · [Quy trình](../2-business-process/{{file}}) · [Danh sách use case](use_case_list.md).

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| Mã tài liệu | `TRACE_{{MÃ}}_{{PHẠM VI}}` |
| Phiên bản · Trạng thái | v{{NN}} · {{}} |
| Phiên bản nguồn đối chiếu | QT v{{}} · BR v{{}} · UCL v{{}} · dự toán {{}} |

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">YYYY-MM-DD</span>** | <span style="color:green">{{PIC}}</span> | <span style="color:green">- Khởi tạo tài liệu.</span> |

---

## 1. Văn bản đối chiếu

| Văn bản | Số hiệu | Vai trò | Số UC dẫn chiếu |
|---|---|---|---:|
| {{}} | {{}} | {{}} | {{}} |

**Kết luận rà soát** văn bản không sinh UC: {{}}.

## 2. Quy ước ba tầng

| Tầng | Nghĩa | Ý nghĩa khi review |
|---|---|---|
| **🟢 T1 — Bám căn cứ trực tiếp** | Văn bản quy định thẳng nghiệp vụ. Bỏ đi là **thiếu tuân thủ** | Đặc tả **không được trái** điều khoản dẫn |
| **🟡 T2 — Hiện thực hóa nghĩa vụ** | Văn bản bắt phải làm, dự án chọn **cách làm** | Tự do thiết kế, **giữ nguyên kết quả** điều khoản đòi hỏi |
| **🔴 T3 — Không có căn cứ** | Quyết định sản phẩm | Cần khách chốt; đánh dấu nếu có **nguy cơ trái luật** |

## 3. Thống kê

| Tầng | Số nhóm chức năng | Số UC | Tỷ lệ | Trong P1 |
|---|---:|---:|---:|---:|
| 🟢 T1 | | | | |
| 🟡 T2 | | | | |
| 🔴 T3 | | | | |
| **Tổng** | | | 100% | |

**Độ phủ quy trình:** {{n}}/{{n}} UC nối được vào ít nhất một quy trình.

---

## 4. Truy vết xuôi — nhóm chức năng → căn cứ

<!-- Một dòng một nhóm chức năng. Cột BRQ nối về BRD khi đã có. -->

| Mã nhóm | Tên nhóm chức năng | Module | UC | P1 | Tầng | Căn cứ | Yêu cầu BRD | Quy trình | Business rule | Máy trạng thái |
|---|---|---|---:|---:|---|---|---|---|---|---|
| `{{}}` | {{}} | {{}} | | | 🟢 T1 | {{TT79 Đ41.4}} | {{BRQ-xx}} | {{QT-xx}} | {{BR-xx}} | {{SM mục}} |

## 5. Nhóm 🔴 T3 — phân loại theo khả năng triển khai

| Phân loại | Nhóm chức năng | Lý do | Đề xuất |
|---|---|---|---|
| Làm được khi đủ dữ liệu | | | |
| Kế thừa thiết kế từ nhóm khác | | | |
| Không có sở cứ | | | |

## 6. Truy vết ngược — nghĩa vụ chưa có use case

| # | Nghĩa vụ | Căn cứ | Quy trình | UC gần nhất và vì sao chưa phủ |
|---|---|---|---|---|

## 7. Sai lệch cần sửa

| Hạng mục | Hiện tại | Đúng theo căn cứ | Căn cứ |
|---|---|---|---|

## 8. Phụ lục — danh sách use case theo nhóm

<!-- ============ KHỐI LẶP CHO MỖI NHÓM ============ -->

#### `{{Mã nhóm}}` — {{Tên nhóm}}

**Module:** {{}} · **Tầng:** {{}}

**Căn cứ:** {{}} · **Quy trình:** {{}} · **Business rule:** {{}}

> {{Ghi chú vì sao xếp tầng này}}

| # | Tên use case | P | Nền tảng |
|---:|---|:-:|---|
| 1 | {{}} | {{1}} | {{}} |

<!-- ============ HẾT KHỐI LẶP ============ -->
