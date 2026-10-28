# TEMPLATE — BUSINESS RULE

<!--
HƯỚNG DẪN DÙNG TEMPLATE
- Sao thành `BR_{MÃ DỰ ÁN}_{PHẠM VI}_v00.md`. Xóa mọi khối HƯỚNG DẪN trước khi phát hành.
- Quy ước chung: ../00_quy_uoc_chung.md
- Chuẩn tham chiếu:
  · OMG SBVR 1.5 — Semantics of Business Vocabulary and Business Rules: tách quy tắc ĐỊNH NGHĨA — structural, luôn đúng theo định nghĩa — và quy tắc HÀNH VI — operative, có thể bị vi phạm nên cần mức cưỡng chế.
  · Business Rules Manifesto — Business Rules Group: quy tắc là tài sản độc lập, viết bằng ngôn ngữ nghiệp vụ, có nguồn, không gắn quy trình hay màn hình.
  · RuleSpeak — Ronald G. Ross: mẫu câu "{Chủ thể} phải / không được / chỉ được … khi …".
  · OMG DMN 1.5 — Decision Model and Notation: quy tắc nhiều điều kiện viết bằng bảng quyết định.
  · BABOK v3 mục 10.9 Business Rules Analysis.
- Mã quy tắc: BR-{chữ nhóm}{2 số}, ví dụ BR-C01. Không đánh lại mã đã phát hành.
-->

# BUSINESS RULE — {{DỰ ÁN}} {{PHẠM VI}}

> Bộ quy tắc nghiệp vụ trích xuất **trực tiếp từ {{văn bản pháp luật, chính sách}}**, dùng làm nguồn ràng buộc cho quy trình, SRS, prototype và testcase.
> Mỗi quy tắc dẫn **đúng điều, khoản, điểm**. Quy tắc không có căn cứ được đánh dấu rõ là **suy luận** hoặc **chờ chốt** — không trộn lẫn.
> **{{n}} quy tắc** trong **{{n}} nhóm**: {{n}} 🔒 · {{n}} ⚙️ · {{n}} 🔑 · {{n}} ⚠️ · {{n}} ❓.
> Tài liệu **không** chứa trình tự bước (quy trình nghiệp vụ), chuyển trạng thái (máy trạng thái), kiểu và độ dài trường (ERD), màn hình và câu thông báo (SRS).

## Thông tin tài liệu

| Mục | Nội dung |
|---|---|
| Mã tài liệu | `BR_{{MÃ}}_{{PHẠM VI}}` |
| Dự án · Phân hệ | {{}} · {{}} |
| Phiên bản · Trạng thái | v{{NN}} · {{}} |
| Người soạn · Người review · Người duyệt | {{}} |
| Mức mật | {{Nội bộ · Hạn chế · Mật}} |

## Version control

| Tên version | Ngày cập nhật | PIC | Mô tả |
| :--- | :--- | :--- | :--- |
| **<span style="color:green">v00<br>(hiện tại)</span>** | **<span style="color:green">YYYY-MM-DD</span>** | <span style="color:green">{{PIC}}</span> | <span style="color:green">- Khởi tạo tài liệu: trích {{n}} quy tắc từ {{văn bản}}.</span> |

## Phê duyệt

| Vai trò | Họ tên | Ngày | Ý kiến |
|---|---|---|---|
| BA soạn | | | |
| Product owner / Khách hàng | | | |
| Tech lead | | | |

---

## 1. Phạm vi và nguồn

### 1.1. Phạm vi

Tài liệu phủ {{n}} khối nghiệp vụ:

- **{{Khối 1}}** — {{mô tả}}.

Kèm khối phụ thuộc trực tiếp: {{}}.

### 1.2. Văn bản đối chiếu

| Văn bản | Số hiệu · ngày | Hiệu lực | Vai trò |
|---|---|---|---|
| {{}} | {{}} | {{}} | {{**Nguồn chính** …}} |

**Kết luận rà soát** văn bản không sinh quy tắc: {{}}.

### 1.3. Quy ước ký hiệu

<!-- Ánh xạ sang mức cưỡng chế của SBVR để dev và QC hiểu cùng một nghĩa. -->

| Ký hiệu | Nghĩa | Mức cưỡng chế SBVR | Hệ thống làm gì |
|---|---|---|---|
| 🔒 | **Luật định cứng** | Strictly enforced | Chặn, không cấu hình vượt, không ai bỏ qua |
| ⚙️ | **Cấu hình được trong khung luật** | Strictly enforced theo tham số | Tham số hóa, chặn giá trị vượt trần luật |
| 🔑 | **Cho phép ngoại lệ có phê duyệt** | Override by pre-authorized actor | Chặn mặc định; người có quyền mở, bắt buộc lý do, ghi nhật ký |
| ⚠️ | **Cảnh báo** | Guideline | Cảnh báo, cho đi tiếp, ghi nhật ký |
| ❓ | **Cần BA hoặc khách chốt** | — | Chưa hiện thực cho tới khi chốt |

**Loại quy tắc — SBVR:**

| Loại | Nghĩa | Ví dụ |
|---|---|---|
| **ĐN — Định nghĩa** | Đúng theo định nghĩa khái niệm, không thể vi phạm — phân loại, tính toán, suy ra | {{*Tiền tính bằng đồng, không số lẻ*}} |
| **HV — Hành vi** | Quy định ai được, phải, không được làm gì; có thể bị vi phạm | {{*Lịch hẹn phải được nhân viên tiếp đón duyệt trước ngày hẹn*}} |

**Lưu ý thuật ngữ:** {{thuật ngữ chuẩn dùng trong tài liệu}}. Trích nguyên văn văn bản thì giữ chữ gốc.

---

## 2. Nhóm A — {{Tên nhóm}}

<!--
============ KHỐI LẶP CHO MỖI NHÓM ============
Mẫu câu RuleSpeak:
  {Chủ thể} phải {hành động} [khi {điều kiện}].
  {Chủ thể} không được {hành động} [khi {điều kiện}].
  {Chủ thể} chỉ được {hành động} khi {điều kiện}.
  {Khái niệm} là {định nghĩa}.               — quy tắc ĐN
  {Giá trị} được tính bằng {công thức}.     — quy tắc ĐN
Một mã = một quy tắc. Câu có "và" nối hai nghĩa vụ độc lập thì tách hai mã.
-->

| Mã | Nội dung | Căn cứ | Loại | Cưỡng chế | Áp tại | Liên quan |
|---|---|---|:-:|:-:|---|---|
| **BR-A01** | {{Chủ thể}} **phải** {{hành động}} khi {{điều kiện}} | {{QC01 Đ6.1}} | HV | 🔒 | {{QT-xx bước n}} | {{Mã nhóm UC}} |
| **BR-A02** | {{Khái niệm}} **là** {{định nghĩa}} | {{}} | ĐN | 🔒 | {{}} | {{}} |

<!-- Quy tắc nhiều điều kiện: viết bảng quyết định DMN ngay dưới, chính sách trúng: U — duy nhất, F — dòng đầu tiên khớp. -->

**Bảng quyết định BR-A0x — {{tên}}** · chính sách trúng: {{U}}

| # | {{Điều kiện 1}} | {{Điều kiện 2}} | → {{Kết quả}} | Ghi chú |
|---|---|---|---|---|
| 1 | {{> giá bán}} | {{—}} | {{Tự tạo đề xuất bắt buộc}} | {{}} |
| 2 | {{≤ giá bán}} | {{—}} | {{Người dùng chọn, bắt buộc lý do}} | {{}} |

<!-- ============ HẾT KHỐI LẶP ============ -->

---

## {{n}}. Thống kê

| Nhóm | Số BR | ĐN | HV | 🔒 | ⚙️ | 🔑 | ⚠️ | ❓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| A — {{}} | | | | | | | | |
| **Tổng** | | | | | | | | |

*{{Ghi chú nếu một quy tắc đếm ở hai cột.}}*

---

## {{n}}. Danh sách điểm cần chốt

| Mã | Vấn đề | Kịch bản | BR liên quan | Đề xuất mặc định | Người chốt | Quyết định |
|---|---|---|---|---|---|---|
| Q-BR01 | {{}} | {{}} | {{}} | {{}} | {{BA + khách}} | {{}} |

---

## {{n}}. Rủi ro còn lại

| Mã | Rủi ro | Căn cứ bị ảnh hưởng | Mức | Biện pháp | Cần khách xác nhận văn bản |
|---|---|---|:-:|---|:-:|
| RK-01 | {{}} | {{}} | C · TB · T | {{}} | Có · Không |

---

## {{n}}. Điểm tạm hoãn

<!-- Việc đã rõ nhưng cố ý chưa làm ở phiên bản này. Không có thì ghi *Không có*. -->

| Mã | Nội dung | Ngày tạm hoãn | Điều kiện mở lại |
|---|---|---|---|
| TH-01 | {{}} | {{DD/MM/YYYY}} | {{}} |

---

## {{n}}. Phụ lục A — Biểu mẫu pháp lý liên quan

| Mẫu | Tên | Ban hành kèm | Trường dữ liệu chính | BR liên quan |
|---|---|---|---|---|

## {{n}}. Phụ lục B — Nghĩa vụ chưa có use case

| # | Nghĩa vụ | Căn cứ | BR | Quy trình |
|---|---|---|---|---|

## {{n}}. Nguồn tra cứu

| Nội dung | Đường dẫn |
|---|---|
