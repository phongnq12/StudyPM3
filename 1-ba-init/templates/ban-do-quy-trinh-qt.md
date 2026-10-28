# QT-nn <tên quy trình> — luồng UC
| Bản đồ | Số UC | Chỗ nối khoảng trống | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- |
| [../../ban-do-quy-trinh.md](../../ban-do-quy-trinh.md) | | | YYYY-MM-DD | draft |

File của **một** quy trình trong bản đồ quy trình dựng ngược. Đặt trong thư mục `cap-2/QT-nn-<slug>/` của
`1-ba-init/0-dau-vao/ban-do-quy-trinh/` (cấp 2 của bản đồ), cùng đặc tả và sơ đồ BPMN của quy trình đó. File tổng
`ban-do-quy-trinh.md` giữ danh sách QT (mục 1), chuyển giao, hệ thống ngoài, đối chiếu và sơ đồ tổng; file này giữ phần
**bên trong** quy trình: các UC presales xảy ra theo thứ tự nào, nối với nhau ra sao, chỗ nào hở. Khái niệm (quy trình,
trigger, kết quả, chỗ nối, khoảng trống…) định nghĩa ở file tổng.

Để làm gì: đọc một quy trình mà không phải lật cả bản đồ; BA duyệt từng quy trình; `/ba-overview` đợt 3 lấy luồng UC
này làm khung để viết bảng bước của QT-nn.

## 1. Thông tin quy trình
| Mã | Tên | Trigger | Kết quả | Actor chính | Đối tượng nghiệp vụ | Điều khoản |
| --- | --- | --- | --- | --- | --- | --- |
| QT-nn | | | | | | `<mã điều khoản>` |

- Chép **nguyên** từ dòng QT-nn ở mục 1 của file tổng; hai nơi phải khớp. Sửa thì sửa file tổng trước. Nghĩa từng
  trường: file tổng mục 1.

## 2. Ghép luồng UC
| QT | Thứ tự | UC presales | Actor | Đầu vào | Đầu ra | Nối tới | Chỗ nối | PH | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QT-nn | 1 | `<mã gốc>` | | | | `<mã gốc>` | khớp | — | [SRC: 1-ba-init/0-dau-vao/uc-presales.md, `<mã gốc>`] |

Mục này trả lời: trong quy trình, các UC presales xảy ra theo thứ tự nào, và UC trước có thực sự nối được sang UC sau
không. Đây là chỗ tìm ra khoảng trống.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| QT | Quy trình chứa UC | Mã QT của file này | QT-01 |
| Thứ tự | Vị trí của UC trong luồng | Số từ 1; theo trình tự luật, rồi luồng màn, rồi mô tả UC. UC chạy song song ghi cùng số | 2 |
| UC presales | UC đang xét | Một mã gốc mỗi dòng; mỗi UC ở cột "UC presales" của dòng QT trong file tổng đúng một dòng | `2` |
| Actor | Ai làm UC | Chép actor từ uc-presales.md | Trưởng phòng |
| Đầu vào | Thứ UC cần nhận để bắt đầu | Đối tượng + trạng thái, lấy từ mô tả luồng UC, trường trên màn | Đơn nghỉ phép Chờ duyệt |
| Đầu ra | Thứ UC tạo ra khi xong | Đối tượng + trạng thái, lấy từ mô tả luồng UC, nút trên màn | Đơn nghỉ phép Đã duyệt |
| Nối tới | UC kế tiếp | Mã gốc; rẽ nhánh thì nhiều mã cách bằng `;`; UC cuối ghi "—" | `4` |
| Chỗ nối | Đầu ra UC này có thành đầu vào UC kế tiếp không | `khớp`: trả lời được cả bốn câu (method.md mục 7) bằng nguồn. `khoảng trống`: còn câu không trả lời được | khoảng trống |
| PH | Phát hiện ghi cho khoảng trống | Mã PH; `khớp` ghi "—" | PH-012 |
| Nguồn | Chỗ lấy thứ tự, đầu vào, đầu ra | `[SRC: …]` tới UC, điều khoản thủ tục hoặc màn | [SRC: 1-ba-init/0-dau-vao/uc-presales.md, `2`] |

## 3. Khoảng trống ở chỗ nối
| PH | Giữa | Câu hỏi | Mô tả | Nguồn |
| --- | --- | --- | --- | --- |

Mục này trả lời: chỗ nào trong luồng chưa nối được, thiếu gì, cần hỏi khách điều gì. Mỗi dòng `khoảng trống` ở mục 2
có đúng một dòng ở đây.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| PH | Mã phát hiện | Mã PH có ở open-questions mục 3 (loại `thiếu luồng` hoặc `thiếu actor`) | PH-012 |
| Giữa | Hai UC ở hai đầu chỗ nối | `<UC trước> → <UC sau>` | `2` → `4` |
| Câu hỏi | Câu nào trong bốn câu chưa trả lời được | `ai chuyển cho ai` / `trong hay ngoài hệ thống` / `actor không có UC` / `đầu ra không UC nào nhận` | ai chuyển cho ai |
| Mô tả | Thiếu cụ thể điều gì | Một hai câu: UC trước kết thúc ở đâu, UC sau bắt đầu ở đâu, khoảng giữa thiếu gì | UC `2` kết thúc ở "Trưởng phòng duyệt"; UC `4` bắt đầu ở "Nhân sự cập nhật số dư"; không UC nào chuyển đơn sang Nhân sự |
| Nguồn | Chỗ thấy khoảng trống | `[SRC: …]` tới hai UC, điều khoản | [SRC: 1-ba-init/0-dau-vao/uc-presales.md, `2`, `4`] |

## 4. Sơ đồ
Sơ đồ BPMN luồng UC của quy trình, theo skill ba-bpmn: pool là QT-nn, lane là actor; mỗi UC presales ở mục 2 là một
task mang nhãn `<mã gốc> <tên UC>`; mũi tên theo cột "Nối tới"; rẽ nhánh dùng gateway; chỗ nối `khoảng trống` gắn
annotation ghi mã PH. Không vẽ bước bên trong UC (việc của `/ba-overview` đợt 3). Tệp: `QT-nn.bpmn.json` (đặc tả),
`QT-nn.drawio.svg` (sơ đồ, nhúng dưới đây), `QT-nn.png` (ảnh xem nhanh, không commit).

Nguồn: QT-nn.drawio.svg

![QT-nn](QT-nn.drawio.svg)
