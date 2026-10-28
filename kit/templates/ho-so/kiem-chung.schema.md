# Cấu trúc kết quả nhóm C — kiểm chứng bằng sản xuất thử (G4)

**Căn cứ chuẩn:** ISO/IEC/IEEE 29148:2018 mục 5.2.5 (đặc tính *verifiable*, *unambiguous*) và 6.4 (validation); ISO/IEC
20246:2017 (review có tiêu chí kết luận định trước); BABOK v3 "Verify Requirements", "Validate Requirements".

Nhóm C thay câu hỏi "spec đã đủ rõ chưa" (gần như luôn được trả lời "đủ") bằng việc bắt agent làm việc thật trên spec
rồi đo kết quả. Agent `quality-reviewer` (chế độ ở cột 2) trả **một khối JSON**; phiên chính (skill ba-gate bước 3a) chép
nguyên văn ra `chuc-nang/CN-xx/kiem-chung/<tệp>`. Agent **không tự kết luận đạt**: `node kit/tools/ba-verify/kiem-chung.mjs
--chuc-nang CN-xx` tính từ con số. Mọi tiêu chí là nhị phân; không có điểm tổng.

| Tệp | Chế độ | Tiêu chí | Checklist |
| --- | --- | --- | --- |
| `C1-qc.json` | `kiem-chung-qc` | C1 — test sinh được | G4-17 |
| `C2-dev.json` | `kiem-chung-dev` | C2 — không phải đoán | G4-18 |
| `C3-dien-giai-1.json`, `C3-dien-giai-2.json` | `dien-giai` (hai phiên độc lập) | C3 — hai bên hiểu giống nhau | G4-19 |
| `C3-so-sanh.json` | `dien-giai-so` | C3 — so hai bản | G4-19 |
| `C4-dao-nguoc.json` | `dao-nguoc` | C4 — đảo ngược ma trận | G4-20 |

Quy tắc chung: mỗi tệp có khóa `tieu_chi`; khóa liệt kê đối tượng đã rà (`da_ra`, `hanh_vi`, `buoc_uc`) phải phủ **mọi**
đối tượng trong tài liệu — script so với tổng số, lệch nghĩa là "agent chưa rà hết" → không đạt. JSON sai cú pháp hoặc
thiếu khóa → không đạt; phiên chính gọi lại phiên mới, không tự sửa JSON.

## C1 — `C1-qc.json`
Agent QC độc lập, chỉ đọc SRS module và tài liệu SRS dẫn tới, sinh ca kiểm thử.

| Khóa | Kiểu | Nghĩa |
| --- | --- | --- |
| `tieu_chi` | `"C1"` | |
| `da_ra` | mảng mã | Mọi REQ loại S của CN (`REQ-xxx`) và mọi AC của mọi UC (`UC-xxx/ACn`) đã thử sinh ca |
| `khong_sinh_duoc` | mảng `{id, ly_do}` | Đối tượng không viết được điều kiện đạt / không đạt rõ ràng, kèm thiếu gì |
| `ca` | mảng `{id, so_ca}` | Số ca đã sinh cho từng đối tượng |

**Đạt:** `da_ra` phủ mọi REQ loại S của CN và mọi AC của mọi UC; `khong_sinh_duoc` rỗng.

```json
{"tieu_chi":"C1","da_ra":["REQ-101","REQ-102","UC-101/AC1","UC-101/AC2"],"khong_sinh_duoc":[],"ca":[{"id":"REQ-101","so_ca":2},{"id":"UC-101/AC1","so_ca":1}]}
```

## C2 — `C2-dev.json`
Agent Dev độc lập liệt kê giả định phải tự đưa ra nếu code theo spec.

| Khóa | Kiểu | Nghĩa |
| --- | --- | --- |
| `tieu_chi` | `"C2"` | |
| `da_ra` | mảng mã UC | Mọi UC của CN đã đi qua |
| `gia_dinh` | mảng `{id, noi_dung, anh_huong_nghiep_vu}` | Giả định; `anh_huong_nghiep_vu: true` khi ảnh hưởng dữ liệu, điều kiện, trạng thái, quyền, thông báo, tích hợp, tính toán |

**Đạt:** `da_ra` phủ mọi UC; số giả định `anh_huong_nghiep_vu: true` = 0.

```json
{"tieu_chi":"C2","da_ra":["UC-101","UC-102"],"gia_dinh":[{"id":"UC-102","noi_dung":"Đặt tên bảng lưu lịch sử duyệt","anh_huong_nghiep_vu":false}]}
```

## C3 — `C3-dien-giai-1.json`, `C3-dien-giai-2.json`, `C3-so-sanh.json`
Hai phiên độc lập diễn giải hành vi; phiên thứ ba so hai bản.

| Tệp | Khóa | Nghĩa |
| --- | --- | --- |
| `C3-dien-giai-n.json` | `tieu_chi` = `"C3"`; `hanh_vi`: mảng `{id, nhanh, khi, thi}` | Mỗi UC, mỗi nhánh (`chinh` hoặc mã `2.A1`, `2.E1`) một phần tử: khi nào, hệ thống làm gì và kết thúc ra sao |
| `C3-so-sanh.json` | `tieu_chi` = `"C3"`; `khac`: mảng `{id, nhanh, ban_1, ban_2}` | Khác biệt **về hành vi** giữa hai bản (không tính khác câu chữ) |

**Đạt:** tập (id, nhanh) của hai bản bằng nhau và bằng tập nhánh của UC (luồng chính và mọi nhánh mục 6, 7); `khac` rỗng.

```json
{"tieu_chi":"C3","hanh_vi":[{"id":"UC-102","nhanh":"chinh","khi":"Nhân viên gửi đơn Nháp còn hạn nộp","thi":"Đơn sang Chờ duyệt, Trưởng phòng nhận thông báo"},{"id":"UC-102","nhanh":"2.E1","khi":"Gửi muộn hơn hạn nộp","thi":"Báo hạn nộp, đơn vẫn Nháp"}]}
```
```json
{"tieu_chi":"C3","khac":[]}
```

## C4 — `C4-dao-nguoc.json`
Agent đọc SRS module và UC mục 2–10, **không** đọc ERD mục 9, rules mục 6, mapping, dòng "Bước quy trình" ở UC mục 1;
dựng lại ma trận từ mô tả hành vi. Script dựng ma trận BA từ tài liệu (UC mục 1 "Bước quy trình", rules mục 6, UC mục 8
cột TR) và so.

| Khóa | Kiểu | Nghĩa |
| --- | --- | --- |
| `tieu_chi` | `"C4"` | |
| `buoc_uc` | đối tượng `{PROC-xx.yy: UC-xxx}` | Bước hệ thống thuộc UC nào |
| `quyen` | mảng `{uc, hanh_dong, act, o}` | Ai được làm hành động gì ở UC nào; `o` là `✔` / `—` |
| `tr_uc` | đối tượng `{TR-xxx: UC-xxx}` | TR nằm trong hậu điều kiện của UC nào |

**Đạt:** không ô nào khác giữa ma trận dựng lại và ma trận BA (thiếu, thừa hoặc khác giá trị đều là khác).

```json
{"tieu_chi":"C4","buoc_uc":{"PROC-01.01":"UC-101","PROC-01.02":"UC-102"},"quyen":[{"uc":"UC-101","hanh_dong":"Lập","act":"ACT-01","o":"✔"}],"tr_uc":{"TR-101":"UC-102"}}
```

## Kiểm tính ổn định
`evals/kiem-chung/<ca>/` chứa tài liệu một CN đã biết kết quả và `ket-qua.json` mong đợi (dạng kết quả của
`kiem-chung.mjs`). Định kỳ chạy lại nhóm C trên ca đó, rồi `kiem-chung.mjs --so-voi evals/kiem-chung/<ca>/ket-qua.json`
báo lệch (skill ba-gate mục "Kiểm tính ổn định").
