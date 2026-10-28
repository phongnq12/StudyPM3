<!-- Bộ ví dụ chung CN-01 Nghỉ phép (hư cấu). Gốc: templates/1-brd/examples/brd-chuc-nang-example.md và
templates/2-business-process/examples/PROC-01-nghi-phep.md. Trạng thái sau bước 3 (trước bước 4: chưa có REQ-101+). -->
# Brief chức năng — CN-01 Nghỉ phép
| CN | Nhánh | Dải ID | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- |
| CN-01 | `chuc-nang/CN-01-nghi-phep` | 101–150 | 2026-10-26 | draft |

> Ví dụ hư cấu (nghiệp vụ nghỉ phép; `QĐ15-2026` là quy chế hư cấu). Dải ID minh họa, chưa theo quyết định dải chung
> (thiết kế việc mở 14).

Ngữ cảnh bắt buộc cho bước 4–12 và **mốc phạm vi** của chức năng. Brief chỉ lọc từ danh mục chức năng, overview và ba
danh mục đầu vào. Phương pháp: `.claude/skills/ba-chuc-nang/khoi-dong.md`.

## 1. Định danh
| Mục | Giá trị | Nguồn |
| --- | --- | --- |
| Mã, tên | CN-01 Nghỉ phép | `2-ba-overview/2-business-process/danh-muc-chuc-nang.md` |
| Slug, nhánh | `nghi-phep`, `chuc-nang/CN-01-nghi-phep` | như trên |
| Thứ tự làm | 2 | như trên |
| Phiên bản kit | `kit-v2.0.0` | CHANGELOG.md |

## 2. Mục tiêu phục vụ
| REQ | Mục tiêu (chép tên) | Vì sao thuộc CN này |
| --- | --- | --- |
| REQ-001 | Mọi Đơn nghỉ phép năm đi hết trình tự trên phần mềm | PROC-01 là trình tự gửi, duyệt đơn; phân hệ "Nghỉ phép" ở brd-overview.md mục 3.1 |
| REQ-002 | Rút ngắn thời gian có kết quả duyệt | PROC-01 tạo kết quả duyệt |
| REQ-003 | Số dư phép khớp đơn đã duyệt | PROC-01.07 trừ Số ngày phép còn lại; PROC-02 cấp Số ngày phép năm |

## 3. Phạm vi UC presales
| Mã gốc | Tên (nguyên văn) | Actor (nguyên văn) | Mô tả luồng (nguyên văn) | PROC chính | Nguồn |
| --- | --- | --- | --- | --- | --- |
| `UC_PS_02` | Lập đơn nghỉ phép | Nhân viên | Nhân viên chọn ngày nghỉ, nhập lý do, gửi đơn | PROC-01 | [SRC: 1-ba-init/0-dau-vao/uc-presales.md, `UC_PS_02`] |
| `UC_PS_03` | Duyệt đơn nghỉ phép | Trưởng phòng | Trưởng phòng xem đơn, duyệt hoặc từ chối | PROC-01 | [SRC: 1-ba-init/0-dau-vao/uc-presales.md, `UC_PS_03`] |
| `UC_PS_04` | Cấp phép năm | Nhân sự | Nhân sự nhập số ngày phép năm cho nhân viên | PROC-02 | [SRC: 1-ba-init/0-dau-vao/uc-presales.md, `UC_PS_04`] |

## 4. Quy trình
| PROC | Tên | Trigger | Kết quả | Actor chính | Căn cứ |
| --- | --- | --- | --- | --- | --- |
| PROC-01 | Gửi và duyệt đơn nghỉ phép | Nhân viên cần nghỉ phép năm | Đơn nghỉ phép Đã duyệt hoặc Bị từ chối | Nhân viên; Trưởng phòng | `PL:QĐ15-2026/Đ5`; `PS:UC_PS_02`; `PS:UC_PS_03` |
| PROC-02 | Cập nhật Số dư phép | Đơn nghỉ phép Đã duyệt; đầu năm | Số dư phép đã cập nhật | Phòng Nhân sự | `PL:QĐ15-2026/Đ6`; `PS:UC_PS_04` |

| Chiều | Từ PROC | Đối tượng | Đến PROC | CN đầu kia | CN đầu kia đã merge |
| --- | --- | --- | --- | --- | --- |
| trong CN | PROC-01 | Đơn nghỉ phép Đã duyệt | PROC-02 | n/a | n/a |
| ra | PROC-02 | Số ngày nghỉ đã duyệt | PROC-05 Tổng hợp chấm công | CN-04 | chưa |

## 5. Màn presales
| MP | Vị trí | Cách mở | Tiêu đề | UC presales | Ảnh |
| --- | --- | --- | --- | --- | --- |
| MP-001 | `/don-nghi-phep` | tải trang | Danh sách đơn nghỉ phép | `UC_PS_02`; `UC_PS_03` | [MP-001.png](../../1-ba-init/0-dau-vao/man-presales/MP-001.png) |
| MP-002 | `/don-nghi-phep` | popup: Từ chối | Từ chối đơn | `UC_PS_03` | [MP-002.png](../../1-ba-init/0-dau-vao/man-presales/MP-002.png) |
| MP-003 | `/don-nghi-phep/tao` | tải trang | Tạo đơn nghỉ phép | `UC_PS_02` | [MP-003.png](../../1-ba-init/0-dau-vao/man-presales/MP-003.png) |
| MP-004 | `/don-nghi-phep/tao` | tab: Tệp đính kèm | Tệp đính kèm | `UC_PS_02` | [MP-004.png](../../1-ba-init/0-dau-vao/man-presales/MP-004.png) |

## 6. Điều khoản pháp lý
| Mã điều khoản | Loại | Tóm tắt (chép phap-ly.md) | PROC | Nguồn |
| --- | --- | --- | --- | --- |
| QĐ15-2026/Đ3 | điều kiện | Ngày làm việc là thứ Hai đến thứ Sáu, trừ ngày lễ | PROC-01 | [SRC: 1-ba-init/0-dau-vao/phap-ly.md] |
| QĐ15-2026/Đ4 | điều kiện | Không nghỉ vượt số ngày phép còn lại; số ngày đã duyệt trừ vào số ngày phép | PROC-01 | [SRC: 1-ba-init/0-dau-vao/phap-ly.md] |
| QĐ15-2026/Đ5.K1 | thủ tục (thời hạn) | Gửi đơn theo Mẫu 01 trong thời hạn do Phòng Nhân sự thông báo | PROC-01 | [SRC: 1-ba-init/0-dau-vao/phap-ly.md] |
| QĐ15-2026/Đ5.K2 | thẩm quyền (thời hạn) | Trưởng phòng duyệt đơn của nhân viên thuộc bộ phận mình trong thời hạn quy định | PROC-01 | [SRC: 1-ba-init/0-dau-vao/phap-ly.md] |
| QĐ15-2026/Đ5.K3 | thủ tục | Từ chối đơn phải ghi lý do | PROC-01 | [SRC: 1-ba-init/0-dau-vao/phap-ly.md] |
| QĐ15-2026/Đ6 | thủ tục | Phòng Nhân sự cấp số ngày phép năm đầu năm | PROC-02 | [SRC: 1-ba-init/0-dau-vao/phap-ly.md] |

## 7. Dữ liệu
| ENT | Tên | Quan hệ với CN (sở hữu / dẫn) | CN sở hữu | Có vòng đời | Nguồn |
| --- | --- | --- | --- | --- | --- |
| ENT-001 | Đơn nghỉ phép | sở hữu | CN-01 | Có | erd-overview.md mục 1 |
| ENT-003 | Số dư phép | sở hữu | CN-01 | Không | erd-overview.md mục 1 |
| ENT-002 | Nhân viên | dẫn | CN-03 | Không | erd-overview.md mục 1 |
| ENT-004 | Bộ phận | dẫn | CN-03 | Không | erd-overview.md mục 2 |
| ENT-005 | Lịch nghỉ lễ | dẫn | CN-03 | Không | erd-overview.md mục 2 |

## 8. Actor và rule chung
| ACT | Tên | Thẩm quyền | Nguồn |
| --- | --- | --- | --- |
| ACT-01 | Nhân viên | Tạo, gửi đơn của mình | actors.md mục 1 |
| ACT-02 | Trưởng phòng | Duyệt, từ chối đơn của nhân viên thuộc bộ phận mình — `PL:QĐ15-2026/Đ5.K2` | actors.md mục 1 |
| ACT-03 | Phòng Nhân sự | Cấp số ngày phép năm — `PL:QĐ15-2026/Đ6` | actors.md mục 1 |
| ACT-04 | Giám đốc | Nhận đơn quá hạn duyệt [ASM-103] | actors.md mục 1 |

| BR chung | Phát biểu (chép tên ngắn) | Nguồn |
| --- | --- | --- |
| BR-001 | Ngày làm việc là thứ Hai đến thứ Sáu, trừ ngày lễ | rules-overview.md mục 1 |
| BR-002 | Chặn quyền theo key và phạm vi dữ liệu | rules-overview.md mục 1 |
| BR-003 | Chỉ hiện thao tác hợp lệ theo trạng thái | rules-overview.md mục 1 |
| BR-004 | Khóa lạc quan khi hai người cùng sửa | rules-overview.md mục 1 |
| BR-005 | Chống gửi trùng | rules-overview.md mục 1 |

## 9. Phụ thuộc
| CN phụ thuộc | Lý do (chuyển giao / dữ liệu) | Đã merge | Xác nhận của BA khi chưa merge |
| --- | --- | --- | --- |
| CN-03 | Đọc Nhân viên, Bộ phận, Lịch nghỉ lễ do CN-03 quản lý | có | n/a |

## 10. Dải ID
Dải `101–150` cho mọi loại ID mới của chức năng. Số đã dùng đọc ở `chuc-nang/CN-01/trace.csv`.

## 11. Câu hỏi và phát hiện liên quan
| Mã | Nội dung (tóm tắt) | Trạng thái | Chặn gate | Nguồn |
| --- | --- | --- | --- | --- |
| Q-021 | Rút, hủy đơn sau khi gửi trong đợt đầu | đã quyết (không làm) | n/a | du-an/open-questions.md |

Phát hiện của tầng dự án thuộc CN-01: không có. Phát hiện mới từ bước 4 trở đi cấp trong dải 101–150 (vd PH-104 ở bước
5, PH-105 ở bước 6).

## 12. Ngoài phạm vi
| Đối tượng | Thuộc | Nguồn |
| --- | --- | --- |
| `UC_PS_05` Rút, hủy đơn | ngoài phạm vi đợt đầu (Q-021) | brd-overview.md mục 3.2 |
| `UC_PS_07` Ban hành lịch nghỉ lễ | CN-03 | danh-muc-chuc-nang.md |
| MP-007 Thống kê ngày nghỉ | CN-04 | danh-muc-chuc-nang.md |
| Tính lương theo ngày nghỉ | ngoài phạm vi dự án | brd-overview.md mục 3.2 |
