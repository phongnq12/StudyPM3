# spec(<du-an | CN-xx>): <tên tầng dự án hoặc chức năng>
| Tầng | Nhánh | Gate cuối | Commit gate cuối | Phiên bản kit | Người duyệt |
| --- | --- | --- | --- | --- | --- |
| du-an / CN-xx | `du-an/khung` / `chuc-nang/CN-xx-<slug>` | G0 / G4 ĐẠT | <mã commit> | `kit-vX.Y.Z` | BA lead (+ Dev lead, QC lead với chức năng) |

Mô tả PR do `/ba-pr` soạn từ hồ sơ gate, open-questions, trace.csv, SRS module. Người duyệt đọc một lần ở đây, không
đọc từng gate. Mỗi mục dẫn file, không chép nội dung tài liệu. Tầng dự án: mục 3, 6, 7 ghi "không áp dụng".
Mục 4 đọc **trước tiên**: đó là những gì BA, agent đã giả định hoặc tự quyết, cần BA lead chấp nhận.

**Căn cứ chuẩn:** ISO/IEC/IEEE 29148:2018 mục 6 (quản lý yêu cầu: phê duyệt, đặt mốc bộ yêu cầu); IEEE 828-2012 (mốc cấu hình: PR merge là mốc mới trên main).

## 1. Tóm tắt
- Phạm vi: <số> UC presales, <số> PROC, <số> MP, <số> điều khoản (brief mục 3–6; tầng dự án: số CN đã chia).
- ID mới (trong dải `<từ>–<đến>`): REQ <n>, ENT <n>, ST/TR <n>, UC <n>, BR <n>, SCR <n>, Q <n>, ASM <n>, PH <n>.
- Dòng thêm vào overview: <file, mục, số dòng> (chỉ thêm).
- Phụ thuộc: CN-yy đã merge / cờ "chờ CN-yy" (không merge trước CN-yy).

## 2. Kết quả gate
| Gate | Kết luận | Commit đã kiểm | Vòng sửa | Lỗi Nên sửa còn | Hồ sơ |
| --- | --- | --- | --- | --- | --- |
| G1 | ĐẠT | | | | `chuc-nang/CN-xx/G1.md` |

- Cổng máy toàn repo sau khi cập nhật từ main: ĐẠT (dòng cuối `check-all.mjs`).

## 3. Chênh lệch phạm vi
Lấy từ `uc-overview.md` mục 1, 2 (dòng của CN) và SRS module bảng chênh lệch phạm vi. Kit chỉ gắn cờ, không kết luận
"ngoài báo giá", không ước lượng công.

| UC presales / UC kit | Quyết định | Cờ phạm vi | Lý do | Nguồn |
| --- | --- | --- | --- | --- |

## 4. Giả định và quyết định của BA cần BA lead chấp nhận
| Mã | Nội dung | Ở đâu | Người quyết | Nguồn quyết định |
| --- | --- | --- | --- | --- |
| ASM-xxx / Q-xxx | | <file, mục> | BA / agent (`--ngu`) | `0-inputs/answers-<ngày>.md` |

- Gồm: ASM còn `mở`; Q `đã quyết` với người quyết là "BA" (chưa có xác nhận của khách); lựa chọn tạm của `--ngu`.

## 5. Tham số đã chốt
| Tham số | Giá trị | Đơn vị | BR / REQ dùng | Nguồn |
| --- | --- | --- | --- | --- |

- Không còn `[CẦN XÁC NHẬN]` (G4 đã kiểm). Tầng dự án: liệt kê `[CẦN XÁC NHẬN]` còn mở kèm Q (chặn G4 của CN dùng).

## 6. Câu hỏi của reviewer sẵn sàng bàn giao đã trả lời
Từ hồ sơ G4: câu hỏi Dev, QC đặt ra khi đọc như người nhận bàn giao, và nơi đã trả lời.

| Câu hỏi | Trả lời ở | Ghi chú |
| --- | --- | --- |

## 7. Tiêu chí nghiệm thu
Dẫn mục tiêu chí nghiệm thu của từng UC và SRS module; không chép.

| UC | Số tiêu chí | File |
| --- | --- | --- |

## 8. Chi phí
| Bước / gate | Token | Thời gian | Vòng sửa |
| --- | --- | --- | --- |

- Nguồn: `du-an/reports/dieu-phoi/<nhánh>.md` và bảng đầu hồ sơ gate.

## 9. Chỉ số
Chép bảng của `node kit/tools/ba-verify/chi-so.mjs [--chuc-nang CN-xx]`; không tự đếm. Tầng dự án: số liệu toàn dự án.

| Chỉ số | Giá trị | Đọc thế nào |
| --- | --- | --- |
| Q (tổng / đã quyết / mở: cao, trung bình, thấp) | | Q mở rủi ro `cao` khi merge phải có ở mục 4 |
| ASM (tổng / đã xác nhận / sai) | | |
| Tỷ lệ tồn đọng hóa ra sai = ASM sai / (ASM đã xác nhận + ASM sai) | <%> | Cao → BA tự quyết vượt mức nắm nghiệp vụ, kéo khách vào sớm hơn |
| Số lần gate mất hiệu lực | | Nhiều → layer sau sửa ngược layer trước |
| Số lần sửa spec vì prototype (commit `(từ prototype)`) | | Nhiều → spec thiếu góc nhìn luồng thao tác |
| Nhóm C (G4): C1 / C2 / C3 / C4 | ĐẠT / KHÔNG ĐẠT | Hồ sơ G4 mục 9 |

---
Sau khi merge: `/ba-next --sync` chuyển ID sang `approved`.
