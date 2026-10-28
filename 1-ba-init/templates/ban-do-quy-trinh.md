# Bản đồ quy trình dựng ngược — <tên dự án>
| Nguồn | Số quy trình | UC presales thuộc quy trình / tổng | Chỗ nối có khoảng trống | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| [SRC: 1-ba-init/0-dau-vao/] | | / | | YYYY-MM-DD | draft |

- Số quy trình: số dòng ở mục 1. UC presales thuộc quy trình / tổng: số UC presales có mặt ở ít nhất một QT, trên tổng
  số UC của uc-presales.md. Chỗ nối có khoảng trống: tổng cột "Chỗ nối khoảng trống" ở mục 2. Trạng thái: `draft` khi agent
  viết xong, `đã chốt` khi BA đã xác nhận danh sách QT ở vòng hỏi của bước 1.

**Bản đồ quy trình là gì.** Là danh sách **mọi quy trình nghiệp vụ của cả dự án**, mỗi quy trình là một chuỗi việc đi
trọn từ một sự kiện bắt đầu (trigger) tới một kết quả có giá trị. File này cho biết các quy trình đó nối với nhau và với
bên ngoài ra sao. Bản đồ ở **cấp tổng**: mỗi quy trình là một ô, bên trong chỉ có thứ tự các UC presales, chưa có từng
bước. Bản đồ được **dựng ngược**: presales không bàn giao quy trình (hoặc bàn giao không đủ), nên kit nối UC presales
lại theo trình tự mà luật quy định và theo luồng màn của prototype.

**Để làm gì.**
1. **Thấy nghiệp vụ chảy thế nào trước khi viết BRD.** 560 UC rời rạc không cho biết việc nào xảy ra trước, ai chuyển
   cho ai. Bản đồ xếp chúng thành luồng.
2. **Tìm khoảng trống sớm.** Chỗ hai UC không nối được với nhau (không ai chuyển, không UC nào nhận) là chỗ presales
   chào giá thiếu. Biết ở bước 1 thì hỏi khách sớm, không đợi tới lúc viết chi tiết.
3. **Kiểm phạm vi hai chiều.** UC presales nào không thuộc quy trình nào (thừa, hoặc chỉ là tra cứu) và quy trình nào
   luật bắt buộc mà presales không có UC (thiếu).
4. **Làm khung cho các bước sau.** `/ba-overview` đợt 3 lấy đúng danh sách QT này để viết bảng bước, giữ nguyên mã;
   chức năng (CN) được cắt theo chuỗi QT; ERD, máy trạng thái tìm đối tượng và trạng thái theo QT.
5. **Truy vết.** Mỗi QT dẫn về UC presales (mã gốc) và điều khoản pháp luật, nên mọi bước sau dẫn ngược được về nguồn.

**Không phải là gì.** Không có bảng bước, gateway, ngoại lệ (việc của `/ba-overview` đợt 3). Không phải danh sách màn
hình hay chức năng phần mềm. Không sửa, gộp, bỏ UC presales. Không chép quy trình presales (`QP-xx` ở
quy-trinh-presales.md); QP chỉ là một nguồn để dựng QT.

**Khái niệm dùng trong file.**

| Khái niệm | Nghĩa | Ví dụ (nghỉ phép, hư cấu) |
| --- | --- | --- |
| Quy trình (QT) | Chuỗi việc của một hoặc nhiều actor, bắt đầu từ một trigger, kết thúc ở một kết quả có giá trị cho đối tượng nghiệp vụ | QT-01 Xin nghỉ phép |
| Trigger | Sự kiện làm quy trình bắt đầu: một nhu cầu, một mốc thời gian, hoặc đầu ra của quy trình khác | "Nhân viên cần nghỉ" |
| Kết quả | Trạng thái của đối tượng nghiệp vụ khi quy trình kết thúc; có thể có nhiều kết quả | "Đơn nghỉ phép Đã duyệt hoặc Bị từ chối" |
| Đối tượng nghiệp vụ | Thứ mà quy trình tạo ra hoặc làm thay đổi: hồ sơ, đơn, biên bản, quyết định | Đơn nghỉ phép |
| Actor chủ trì | Vai trò chịu trách nhiệm chính, làm phần lớn việc trong quy trình | Trưởng phòng |
| Căn cứ | Lý do quy trình tồn tại: UC presales (khách đã đặt), điều khoản pháp luật (luật bắt buộc), hoặc cả hai | UC `1`, `2`; `QC-NP/Đ5.K1` |
| Chỗ nối | Chỗ đầu ra của một UC phải trở thành đầu vào của UC kế tiếp trong cùng quy trình | UC `2` Duyệt đơn → UC `4` Cập nhật số dư |
| Khoảng trống | Chỗ nối mà nguồn không trả lời được ai chuyển, chuyển bằng gì, UC nào nhận | Không UC nào chuyển đơn đã duyệt sang Nhân sự |
| Chuyển giao | Chỗ đầu ra của một quy trình là trigger của quy trình khác | Đơn Đã duyệt từ QT-01 sang QT-02 Cập nhật số dư phép |

**Căn cứ chuẩn:** BABOK v3 mục 10.35 "Process Modelling"; OMG BPMN 2.0.2 (ISO/IEC 19510:2013) sơ đồ cộng tác cấp
tổng; ISO/IEC/IEEE 29148:2018 mục 5.2 (truy vết về nguồn).

## 0. Nguồn dựng
| Nguồn | Đường dẫn | Dùng để |
| --- | --- | --- |
| Danh mục UC presales | 1-ba-init/0-dau-vao/uc-presales.md | UC, actor, phân hệ, mô tả luồng |
| Ma trận UC × điều khoản | 1-ba-init/0-dau-vao/uc-phap-ly.md | Gom UC theo điều khoản, căn cứ của quy trình |
| Danh mục pháp lý | 1-ba-init/0-dau-vao/phap-ly.md | Điều khoản loại `thủ tục`, `thời hạn`, `thẩm quyền`: trình tự, chủ thể |
| Danh mục màn presales | 1-ba-init/0-dau-vao/man-presales.md | Luồng màn (cột "Đi tới") để đối chiếu thứ tự UC |
| Danh mục quy trình presales | 1-ba-init/0-dau-vao/quy-trinh-presales.md | Quy trình presales đã chào giá (bỏ qua nếu presales không có) |

- Mục này cho biết bản đồ dựng từ đâu. Ghi đủ các danh mục đã đọc; nguồn bị bỏ qua (vd presales không có quy trình)
  thì cột "Dùng để" ghi "bỏ qua theo `<Q-xxx>`".

## 1. Danh sách quy trình
| Mã | Tên | Trigger | Kết quả | Actor chính | Đối tượng nghiệp vụ | UC presales | Điều khoản | Phân hệ | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QT-01 | | | | | | `<mã gốc>`; `<mã gốc>` | `<mã điều khoản>` | | [SRC: 1-ba-init/0-dau-vao/uc-phap-ly.md, <mã điều khoản>] |

Mục này trả lời: dự án có những quy trình nào, mỗi quy trình bắt đầu và kết thúc ở đâu, dựa trên căn cứ nào.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Mã | Mã quy trình, dùng xuyên suốt các bước sau | `QT-nn`, cấp tuần tự từ QT-01; không đổi, không dùng lại khi bỏ | QT-01 |
| Tên | Tên việc mà quy trình làm xong | Động từ + đối tượng nghiệp vụ, thuật ngữ theo glossary; không đặt theo màn hình | Xin nghỉ phép |
| Trigger | Sự kiện làm quy trình bắt đầu | Một câu ngắn; trigger là đầu ra của QT khác thì ghi kèm mã QT đó | Nhân viên cần nghỉ |
| Kết quả | Trạng thái của đối tượng khi quy trình kết thúc | Đối tượng + trạng thái; nhiều kết quả cách bằng "hoặc" | Đơn nghỉ phép Đã duyệt hoặc Bị từ chối |
| Actor chính | Vai trò chủ trì và các vai trò tham gia chính | Tên vai trò theo luật hoặc UC presales, cách bằng `;` | Nhân viên; Trưởng phòng |
| Đối tượng nghiệp vụ | Thứ quy trình tạo ra hoặc làm thay đổi | Danh từ theo glossary | Đơn nghỉ phép |
| UC presales | Các UC presales thuộc quy trình | Mã gốc trong `` ` ``, cách bằng `;`, đúng thứ tự ở mục 2 của file QT; một UC có thể thuộc nhiều QT | `1`; `2`; `4` |
| Điều khoản | Điều khoản pháp luật làm căn cứ | Mã điều khoản loại `thủ tục` (kèm `thời hạn`, `thẩm quyền` của cùng thủ tục), cách bằng `;` | `QC-NP/Đ5.K1` |
| Phân hệ | Phân hệ presales chứa phần lớn UC của quy trình | Chép từ uc-presales.md; chỉ để kiểm lại, không phải căn cứ gom | A. Nghỉ phép |
| Nguồn | Chỗ mở lại để kiểm căn cứ gom | `[SRC: <file>, <vị trí>]`; gom không chắc thì thêm `[ASM-xxx]` | [SRC: 1-ba-init/0-dau-vao/uc-phap-ly.md, QC-NP/Đ5.K1] |

- Mỗi QT có ít nhất một UC presales **hoặc** một điều khoản. Quy trình quá lớn (trên 20 UC, ngưỡng của kit v1
  `ba-process`, hoặc nhiều thủ tục pháp lý nối nhau) → tách quy trình con, mỗi quy trình một dòng.

## 2. Ghép luồng UC trong quy trình
| QT | Thư mục | Số UC | Chỗ nối khoảng trống | Sơ đồ |
| --- | --- | --- | --- | --- |
| QT-01 | [cap-2/QT-01-<slug>/](cap-2/QT-01-<slug>/QT-01.md) | | | [QT-01.drawio.svg](cap-2/QT-01-<slug>/QT-01.drawio.svg) |

Mục này là **chỉ mục**: luồng UC của từng quy trình (cấp 2) nằm trong thư mục `cap-2/QT-nn-<slug>/` (file `QT-nn.md`
theo template `ban-do-quy-trinh-qt.md`, kèm đặc tả `.bpmn.json`, sơ đồ `.drawio.svg`, ảnh `.png`). Mỗi QT ở mục 1 có đúng một
dòng và một thư mục; QT không có UC presales (mục 6.2) vẫn có thư mục, mục 2 của file QT để trống.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| QT | Quy trình | Mã QT có ở mục 1 | QT-01 |
| Thư mục | Thư mục con của quy trình trong `cap-2/` | `cap-2/QT-nn-<slug>/`, slug là tên QT không dấu, nối gạch ngang, ngắn; link tới `QT-nn.md` | cap-2/QT-01-xin-nghi-phep/ |
| Số UC | Số dòng ở mục 2 của file QT | Số | 3 |
| Chỗ nối khoảng trống | Số dòng `khoảng trống` ở mục 2 của file QT | Số | 1 |
| Sơ đồ | Sơ đồ BPMN luồng UC | Link tới `QT-nn.drawio.svg` | QT-01.drawio.svg |

## 3. Chuyển giao giữa quy trình
| Từ QT | Đối tượng chuyển giao | Đến QT | Qua hệ thống / thủ công | Nguồn |
| --- | --- | --- | --- | --- |

Mục này trả lời: các quy trình nối với nhau thế nào, quy trình nào kích hoạt quy trình nào.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Từ QT | Quy trình gửi | Mã QT có ở mục 1 | QT-01 |
| Đối tượng chuyển giao | Thứ đi từ quy trình gửi sang quy trình nhận; là kết quả của QT gửi, trigger của QT nhận | Đối tượng + trạng thái, theo glossary | Đơn nghỉ phép Đã duyệt |
| Đến QT | Quy trình nhận | Mã QT có ở mục 1 | QT-02 |
| Qua hệ thống / thủ công | Cách chuyển | `hệ thống` / `thủ công`; nguồn không nói thì ghi `[ASM-xxx]` | hệ thống |
| Nguồn | Căn cứ của chuyển giao | `[SRC: …]` tới điều khoản, UC hoặc màn | [SRC: 1-ba-init/0-dau-vao/phap-ly.md, QC-NP/Đ7.K2] |

## 4. Hệ thống và đơn vị bên ngoài
| Tên | Loại | QT liên quan | Trao đổi gì | Nguồn |
| --- | --- | --- | --- | --- |

Mục này trả lời: quy trình của dự án phải gửi, nhận gì với ai nằm ngoài phần mềm.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Tên | Cơ quan, đơn vị hoặc phần mềm bên ngoài | Tên theo văn bản pháp luật hoặc UC presales | Bảo hiểm xã hội |
| Loại | Bản chất của bên ngoài | `cơ quan` / `đơn vị` / `phần mềm` | cơ quan |
| QT liên quan | Quy trình có trao đổi | Mã QT, cách bằng `;` | QT-02 |
| Trao đổi gì | Thứ gửi đi hoặc nhận về | Đối tượng + chiều (gửi / nhận) | Gửi danh sách nghỉ ốm hưởng chế độ |
| Nguồn | Căn cứ | `[SRC: …]` | [SRC: …] |

## 5. Khoảng trống ở chỗ nối
Khoảng trống ghi ở mục 3 của file từng QT (`cap-2/QT-nn-<slug>/QT-nn.md`); tổng số theo QT ở cột "Chỗ nối khoảng trống" của
mục 2. Khoảng trống là chỗ đầu ra của UC trước không nối được sang UC sau bằng nguồn — chỗ presales chào giá thiếu.

## 6. Đối chiếu hai chiều UC presales ↔ QT
Mục này trả lời: phạm vi presales và phạm vi quy trình có khớp nhau không. Chiều xuôi: mọi UC khách đã đặt đều nằm trong
một luồng nghiệp vụ, hoặc có lý do. Chiều ngược: mọi quy trình đều có UC khách đã đặt, hoặc có câu hỏi phạm vi.

### 6.1 UC presales không thuộc quy trình nào
| Mã gốc | Tên (nguyên văn) | Lý do | Q / PH |
| --- | --- | --- | --- |

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Mã gốc | UC presales không có ở mục 1 | Mã gốc trong `` ` `` | `3` |
| Tên (nguyên văn) | Tên UC | Chép từ uc-presales.md | Tra cứu đơn nghỉ phép |
| Lý do | Vì sao UC không nằm trong luồng nào | `tra cứu, báo cáo`: chỉ đọc dữ liệu. `danh mục`: khai báo dữ liệu dùng chung. `quản trị hệ thống`: người dùng, phân quyền, cấu hình. `chưa rõ`: không xếp được | tra cứu, báo cáo |
| Q / PH | Câu hỏi khi lý do là `chưa rõ` | Mã Q (câu hỏi phạm vi, chặn G0); lý do khác ghi "—" | — |

### 6.2 Quy trình không có UC presales
| QT | Căn cứ | Q |
| --- | --- | --- |

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| QT | Quy trình chỉ có căn cứ điều khoản, ô "UC presales" ở mục 1 để trống | Mã QT có ở mục 1 | QT-05 |
| Căn cứ | Điều khoản buộc có quy trình này | Mã điều khoản, thường là điều khoản `chưa có UC` ở uc-phap-ly.md mục 3 | `QC-NP/Đ9.K1` |
| Q | Câu hỏi trong hay ngoài phạm vi | Mã Q; không kết luận "phát sinh", không ước lượng | Q-031 |

## 7. Sơ đồ
Mỗi cấp một thư mục con của `ban-do-quy-trinh/`:
- Cấp 1 (bắt buộc): `cap-1/cap-1.drawio.svg` (một trang) hoặc `cap-1/cap-1-<n>.drawio.svg`; đặc tả `cap-1/cap-1.bpmn.json`.
- Cấp 0 (khi hơn 8 QT, ngưỡng của skill ba-bpmn): `cap-0/cap-0.drawio.svg`; đặc tả `cap-0/cap-0.bpmn.json`.
- Cấp 2 (luồng UC từng QT): `cap-2/QT-nn-<slug>/QT-nn.drawio.svg`, chỉ mục ở mục 2.

Mục này là hình của mục 1, 3, 4 (sơ đồ luồng UC từng QT nằm trong thư mục con). **Cấp 1** (sơ đồ cộng tác BPMN): pool dự án chia lane theo actor chủ trì; mỗi QT là một
sub-process thu gọn mang mã QT; chuyển giao ở mục 3 là mũi tên giữa các QT; hệ thống, đơn vị ngoài ở mục 4 là pool thu
gọn nối bằng message flow. **Cấp 0**: một trang cho người đọc nhanh (khách, quản lý), chỉ vẽ luồng chính của đối tượng
lõi đi qua các QT từ đầu tới cuối. Ký hiệu, cách vẽ theo skill ba-bpmn.

Nguồn: cap-1/cap-1.drawio.svg

![Bản đồ quy trình](cap-1/cap-1.drawio.svg)

Nguồn: cap-0/cap-0.drawio.svg

![Bản đồ quy trình cấp 0](cap-0/cap-0.drawio.svg)
