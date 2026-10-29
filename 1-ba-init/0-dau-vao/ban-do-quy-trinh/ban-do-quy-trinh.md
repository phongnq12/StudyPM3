# Bản đồ quy trình dựng ngược — Quản lý kho căng tin
| Nguồn | Số quy trình | UC presales thuộc quy trình / tổng | Chỗ nối có khoảng trống | Cập nhật | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| [SRC: 1-ba-init/0-dau-vao/] | 6 | 21 / 31 | 8 | 2026-10-29 | đã chốt |

- Số quy trình: số dòng ở mục 1. UC presales thuộc quy trình / tổng: số UC presales có mặt ở ít nhất một QT, trên tổng
  số UC của uc-presales.md. Chỗ nối có khoảng trống: tổng cột "Chỗ nối khoảng trống" ở mục 2 (chưa tính một khoảng
  trống ở đầu luồng QT-05, ghi ở QT-05.md mục 3). Trạng thái: `draft` khi agent viết xong, `đã chốt` khi BA đã xác nhận
  danh sách QT ở vòng hỏi của bước 1.

**Bản đồ quy trình là gì.** Là danh sách **mọi quy trình nghiệp vụ của cả dự án**, mỗi quy trình là một chuỗi việc đi
trọn từ một sự kiện bắt đầu (trigger) tới một kết quả có giá trị. File này cho biết các quy trình đó nối với nhau và với
bên ngoài ra sao. Bản đồ ở **cấp tổng**: mỗi quy trình là một ô, bên trong chỉ có thứ tự các UC presales, chưa có từng
bước. Bản đồ được **dựng ngược**: presales không bàn giao quy trình (hoặc bàn giao không đủ), nên kit nối UC presales
lại theo trình tự mà luật quy định và theo luồng màn của prototype.

**Để làm gì.**
1. **Thấy nghiệp vụ chảy thế nào trước khi viết BRD.** 31 UC rời rạc không cho biết việc nào xảy ra trước, ai chuyển
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

| Khái niệm | Nghĩa | Ví dụ (dự án này) |
| --- | --- | --- |
| Quy trình (QT) | Chuỗi việc của một hoặc nhiều actor, bắt đầu từ một trigger, kết thúc ở một kết quả có giá trị cho đối tượng nghiệp vụ | QT-02 Nhập kho hàng hóa từ nhà cung cấp |
| Trigger | Sự kiện làm quy trình bắt đầu: một nhu cầu, một mốc thời gian, hoặc đầu ra của quy trình khác | "Hàng hóa từ nhà cung cấp cần nhập kho" |
| Kết quả | Trạng thái của đối tượng nghiệp vụ khi quy trình kết thúc; có thể có nhiều kết quả | "Phiếu nhập kho Đã duyệt, Đã hủy hoặc Đã hủy duyệt" |
| Đối tượng nghiệp vụ | Thứ mà quy trình tạo ra hoặc làm thay đổi: hồ sơ, phiếu, biên bản | Phiếu nhập kho |
| Actor chủ trì | Vai trò chịu trách nhiệm chính, làm phần lớn việc trong quy trình | Người phụ trách căng tin |
| Căn cứ | Lý do quy trình tồn tại: UC presales (khách đã đặt), điều khoản pháp luật (luật bắt buộc), hoặc cả hai | `PM3CSCN.WEB.10.01.02`; `TT79-2026/Đ41.K4` |
| Chỗ nối | Chỗ đầu ra của một UC phải trở thành đầu vào của UC kế tiếp trong cùng quy trình | `PM3CSCN.WEB.09.01.01` lập phiếu → `PM3CSCN.WEB.09.01.02` phê duyệt phiếu |
| Khoảng trống | Chỗ nối mà nguồn không trả lời được ai chuyển, chuyển bằng gì, UC nào nhận | Không UC nào cho kho nhận xác nhận số thực nhận sau khi phiếu điều chuyển được duyệt |
| Chuyển giao | Chỗ đầu ra của một quy trình là trigger của quy trình khác | Lô chờ giá từ QT-02 sang QT-03 Đề xuất và duyệt giá bán |

**Tóm tắt.** 6 quy trình, gom theo đối tượng nghiệp vụ (nhà cung cấp và giá nhập; phiếu nhập kho; đề xuất giá bán và
giá bán; phiếu điều chuyển; biên bản kiểm kê; hạn mức và cảnh báo) và theo 6 quy trình chi tiết presales QP-02 → QP-07;
`0-inputs/phap-ly/` không có điều khoản loại `thủ tục`, nên thủ tục pháp lý không là căn cứ gom. 21/31 UC presales thuộc
một QT; 10 UC còn lại ở mục 6.1 (9 `tra cứu, báo cáo`, 1 `danh mục`), không UC `chưa rõ`; không QT nào thiếu UC
presales. 8 chỗ nối `khoảng trống` (cộng một khoảng trống ở đầu luồng QT-05): phần lớn là việc có trong quy trình
presales và câu trả lời BA nhưng không UC presales nào làm (lập, sửa, trình đề xuất giá bán; kho nhận xác nhận thực
nhận; giao kiểm kê; quét và xem cảnh báo) — UC mới ngoài danh sách presales, PM đánh giá (Q-022 đã quyết B, RQ-51);
người in và nơi nhận bản in phiếu nhập kho (PH-020, PH-021; Q-021 chỉ quyết thời điểm in: khi phiếu đã tạo xong, RQ-57). Ba chỗ nối trước đây hở nay `khớp` theo câu trả lời BA: giá nhập
mới sang đề xuất giá bán qua hộp "Quyết định giá bán" thuộc UC `PM3CSCN.WEB.10.01.01` (PH-017, RQ-52); Hệ thống bán
hàng căng tin tự đọc dữ liệu kho (PH-015, RQ-54, hai chỗ nối ở QT-03, QT-05); PH-015, PH-017 trong sổ vẫn mở, bước 2
đóng. Chỉ có 2 QT có căn cứ điều khoản (QT-01, QT-03); 4 QT còn lại chờ Q-019. BA chốt danh sách QT, cách gom, chuyển
giao [SRC: 0-inputs/answers-2026-10-29.md, RQ-47]. Bổ sung (RQ-97): phần mềm kho thuộc hệ thống quản lý cơ sở cai
nghiện thông minh, phải kết nối, đồng bộ (`PL:TT79-2026/Đ5.K1.a`, RQ-91); việc đồng bộ dữ liệu kho với Phần mềm quản lý
cơ sở cai nghiện ghi ở mục 4 là luồng dữ liệu nền, không thành QT mới (lý do ở mục 4) <span style="color:red">**<u>GD-0007</u>**</span>; điều khoản `chưa có UC`
PH-032 không sinh QT nên mục 6.2 vẫn trống.

**Căn cứ chuẩn:** BABOK v3 mục 10.35 "Process Modelling"; OMG BPMN 2.0.2 (ISO/IEC 19510:2013) sơ đồ cộng tác cấp
tổng; ISO/IEC/IEEE 29148:2018 mục 5.2 (truy vết về nguồn).

## 0. Nguồn dựng
| Nguồn | Đường dẫn | Dùng để |
| --- | --- | --- |
| Danh mục UC presales | 1-ba-init/0-dau-vao/uc-presales.md | UC, phân hệ; cột actor, mô tả luồng trống nên actor lấy theo Q-001 (đã quyết) |
| Ma trận UC × điều khoản | 1-ba-init/0-dau-vao/uc-phap-ly.md | Căn cứ của QT-01, QT-03; 26/31 UC không có căn cứ (Q-019, Q-020); mục 3: `TT79-2026/Đ5.K1.a` `chưa có UC` (PH-032), `TT79-2026/Đ5.K2` áp dụng chung, `TT79-2026/Đ52.K4` ngoài phần mềm |
| Danh mục pháp lý | 1-ba-init/0-dau-vao/phap-ly.md | Không có điều khoản loại `thủ tục`, `thời hạn`; `TT79-2026/Đ41.K4` (điều kiện, thẩm quyền) cho trình tự đề xuất rồi duyệt giá bán; `TT79-2026/Đ5.K1.a` (kết nối, đồng bộ) cho hệ thống ngoài ở mục 4 |
| Danh mục màn presales | 1-ba-init/0-dau-vao/man-presales.md | Luồng màn giá nhập (MP-004 → MP-001) cho QT-01; các QT khác không có màn (man-presales.md mục 4) |
| Danh mục quy trình presales | 1-ba-init/0-dau-vao/quy-trinh-presales.md | QP-01 cho chuyển giao, hệ thống ngoài; QP-02 → QP-07 cho thứ tự UC, trigger, kết quả (không bước nào gắn UC; presales không có bảng mapping bước ↔ UC, Q-014 đã quyết B <span style="color:red">**<u>GD-0005</u>**</span> [SRC: 0-inputs/answers-2026-10-29.md, RQ-67]) |
| Câu trả lời BA | 0-inputs/answers-2026-10-28.md; 0-inputs/answers-2026-10-29.md | Trả lời bốn câu ở chỗ nối (RQ-01 → RQ-42), quyết định các câu hỏi của bản đồ (RQ-47 → RQ-67), kết nối, đồng bộ (RQ-91, RQ-96, RQ-97); loại nguồn "BA xác nhận" |

## 1. Danh sách quy trình
| Mã | Tên | Trigger | Kết quả | Actor chính | Đối tượng nghiệp vụ | UC presales | Điều khoản | Phân hệ | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| QT-01 | Cập nhật nhà cung cấp và giá nhập | Cần cập nhật nhà cung cấp, hàng hóa theo nhà cung cấp hoặc giá nhập | Hồ sơ nhà cung cấp, danh mục hàng hóa theo nhà cung cấp, giá nhập Đã cập nhật (có lịch sử thay đổi); giá nhập mới chuyển sang QT-03 qua hộp "Quyết định giá bán" thuộc UC `PM3CSCN.WEB.10.01.01` [SRC: 0-inputs/answers-2026-10-29.md, RQ-52] | Người phụ trách căng tin | Nhà cung cấp; Đợt giá nhập; Dòng giá nhập | `PM3CSCN.WEB.15.01.01`; `PM3CSCN.WEB.15.02.01`; `PM3CSCN.WEB.15.03.01` | `TT79-2026/Đ41.K4` | `PM3CSCN.WEB.15` M17 – QUẢN LÝ NHÀ CUNG CẤP HÀNG HÓA CĂNG TIN | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-02]; [SRC: 1-ba-init/0-dau-vao/uc-phap-ly.md, TT79-2026/Đ41.K4]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-16, RQ-20] |
| QT-02 | Nhập kho hàng hóa từ nhà cung cấp | Hàng hóa từ nhà cung cấp cần nhập kho (kể cả khi người phụ trách căng tin chọn nhập kho sau cảnh báo của QT-06) | Phiếu nhập kho Đã duyệt (lô bán giá hiện hành, lô chờ giá hoặc lô chờ duyệt giá mới), Đã hủy hoặc Đã hủy duyệt; hủy duyệt bị chặn thì xử lý qua QT-05 | Người phụ trách căng tin; Trưởng cơ sở | Phiếu nhập kho; Lô | `PM3CSCN.WEB.09.01.01`; `PM3CSCN.WEB.09.01.05`; `PM3CSCN.WEB.09.01.02`; `PM3CSCN.WEB.09.01.03`; `PM3CSCN.WEB.09.01.04` | — | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.01` | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-03]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-05, RQ-09, RQ-34] |
| QT-03 | Đề xuất và duyệt giá bán | Cần bán mặt hàng mới; lô cần giá bán mới hoặc lô chờ giá (QT-02); lô chờ giá cần đề xuất giá bán sau cảnh báo (QT-06); giá nhập mới (QT-01, qua hộp "Quyết định giá bán" của UC `PM3CSCN.WEB.10.01.01`, RQ-52); hoặc giá bán lẻ tại địa phương thay đổi | Giá bán Có hiệu lực theo lô, Đề xuất giá bán Đã hủy hoặc Giá bán Đã hủy duyệt | Người phụ trách căng tin; Trưởng cơ sở | Đề xuất giá bán; Giá bán; Lô | `PM3CSCN.WEB.10.01.01`; `PM3CSCN.WEB.10.01.02`; `PM3CSCN.WEB.10.01.03`; `PM3CSCN.WEB.10.01.04` | `TT79-2026/Đ41.K4`; `TT79-2026/Đ16.K1`; `TT79-2026/Đ16.K2`; `TT79-2026/Đ16.K3`; `TT79-2026/Đ16.K4`; `TT79-2026/Đ16.K5`; `TT79-2026/Đ16.K6`; `TT79-2026/Đ16.K7`; `TT79-2026/Đ16.K8` | `PM3CSCN.WEB.10` M09 – CẤU HÌNH NGHIỆP VỤ HỆ THỐNG / `PM3CSCN.WEB.10.01` | [SRC: 1-ba-init/0-dau-vao/uc-phap-ly.md, TT79-2026/Đ41.K4, TT79-2026/Đ16.K1–K8]; [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-04]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-08, RQ-21, RQ-24] |
| QT-04 | Điều chuyển hàng hóa giữa các kho | Kho cần điều chuyển hàng hóa (kể cả khi người phụ trách căng tin chọn điều chuyển sau cảnh báo của QT-06) | Phiếu điều chuyển Hoàn thành, Hoàn thành có chênh lệch, Đã hủy hoặc Đã hủy duyệt | Người phụ trách căng tin (kho xuất); Trưởng cơ sở; Người phụ trách căng tin (kho nhận) | Phiếu điều chuyển; Hàng đang chuyển; Lô | `PM3CSCN.WEB.09.02.01`; `PM3CSCN.WEB.09.02.02`; `PM3CSCN.WEB.09.02.03`; `PM3CSCN.WEB.09.02.04` | — | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.02` | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-05]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-01, RQ-06, RQ-15] |
| QT-05 | Kiểm kê tồn kho | Đến kỳ kiểm kê (chu kỳ do cán bộ quyết định) hoặc cần kiểm kê đột xuất, kể cả khi hủy duyệt phiếu nhập kho bị chặn (QT-02) hoặc người phụ trách căng tin đề nghị sau cảnh báo (QT-06) | Biên bản kiểm kê Đã duyệt (tồn đã điều chỉnh, kho mở khóa), Biên bản kiểm kê Đã hủy duyệt, hoặc chưa kiểm kê được do còn phiếu dở dang | Trưởng cơ sở; Tổ kiểm kê | Biên bản kiểm kê; Tồn kho theo lô | `PM3CSCN.WEB.09.03.01`; `PM3CSCN.WEB.09.03.02`; `PM3CSCN.WEB.09.03.03`; `PM3CSCN.WEB.09.03.04` | — | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.03` | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-06]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-07, RQ-12, RQ-28, RQ-31] |
| QT-06 | Cảnh báo tồn kho và hạn sử dụng | Đến giờ quét hằng ngày (00:00 hằng ngày <span style="color:red">**<u>GD-0003</u>**</span>, RQ-61) hoặc tồn kho theo lô giảm sau giao dịch, theo hạn mức cảnh báo người phụ trách căng tin đã thiết lập | Cảnh báo Đã xem (người phụ trách căng tin chọn nhập kho, điều chuyển hoặc đề nghị kiểm kê) hoặc không có cảnh báo | Hệ thống quản lý kho căng tin; Người phụ trách căng tin | Hạn mức cảnh báo; Cảnh báo; Lô | `PM3CSCN.WEB.09.04.03` | — | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN / `PM3CSCN.WEB.09.04` (thuộc báo giá, RQ-50) | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-07, QP-02.06]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-28, RQ-33, RQ-42]; [SRC: 0-inputs/answers-2026-10-29.md, RQ-61] |

Mục này trả lời: dự án có những quy trình nào, mỗi quy trình bắt đầu và kết thúc ở đâu, dựa trên căn cứ nào.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Mã | Mã quy trình, dùng xuyên suốt các bước sau | `QT-nn`, cấp tuần tự từ QT-01; không đổi, không dùng lại khi bỏ | QT-01 |
| Tên | Tên việc mà quy trình làm xong | Động từ + đối tượng nghiệp vụ, thuật ngữ theo glossary; không đặt theo màn hình | Kiểm kê tồn kho |
| Trigger | Sự kiện làm quy trình bắt đầu | Một câu ngắn; trigger là đầu ra của QT khác thì ghi kèm mã QT đó | Lô cần giá bán mới hoặc lô chờ giá (QT-02) |
| Kết quả | Trạng thái của đối tượng khi quy trình kết thúc | Đối tượng + trạng thái; nhiều kết quả cách bằng "hoặc" | Phiếu điều chuyển Hoàn thành hoặc Đã hủy |
| Actor chính | Vai trò chủ trì và các vai trò tham gia chính | Tên vai trò theo luật hoặc UC presales, cách bằng `;` | Người phụ trách căng tin; Trưởng cơ sở |
| Đối tượng nghiệp vụ | Thứ quy trình tạo ra hoặc làm thay đổi | Danh từ theo glossary | Phiếu nhập kho |
| UC presales | Các UC presales thuộc quy trình | Mã gốc trong `` ` ``, cách bằng `;`, đúng thứ tự ở mục 2 của file QT; một UC có thể thuộc nhiều QT | `PM3CSCN.WEB.09.02.01`; `PM3CSCN.WEB.09.02.02` |
| Điều khoản | Điều khoản pháp luật làm căn cứ | Mã điều khoản loại `thủ tục` (kèm `thời hạn`, `thẩm quyền` của cùng thủ tục); dự án này không có điều khoản `thủ tục`, nên ghi điều khoản mà ma trận uc-phap-ly.md ghép với UC của QT; không có thì "—" | `TT79-2026/Đ41.K4` |
| Phân hệ | Phân hệ presales chứa phần lớn UC của quy trình | Chép từ uc-presales.md; chỉ để kiểm lại, không phải căn cứ gom | `PM3CSCN.WEB.09` QUẢN LÝ KHO CĂNG TIN |
| Nguồn | Chỗ mở lại để kiểm căn cứ gom | `[SRC: <file>, <vị trí>]`; gom không chắc thì thêm `[ASM-xxx]` | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-03] |

- Mỗi QT có ít nhất một UC presales **hoặc** một điều khoản. Quy trình quá lớn (trên 20 UC, ngưỡng của kit v1
  `ba-process`, hoặc nhiều thủ tục pháp lý nối nhau) → tách quy trình con, mỗi quy trình một dòng.
- Cách gom ở dự án này: không có điều khoản `thủ tục` (bước 1 của cách gom bỏ qua); gom theo đối tượng nghiệp vụ mà
  UC tạo hoặc chuyển trạng thái, kiểm lại bằng QP-02 → QP-07. Một chỗ khác QP: QP-02 gom nhà cung cấp, giá nhập và kho
  thành một quy trình, bản đồ tách kho ra khỏi QT-01 vì kho là đối tượng khác, không chung luồng với nhà cung cấp; UC
  `PM3CSCN.WEB.09.04.02` Thêm/Sửa/Xóa kho ở mục 6.1 (`danh mục`), UC `PM3CSCN.WEB.09.04.03` hạn mức cảnh báo vào QT-06
  vì QP-07 quét theo hạn mức đó.
- Actor lấy theo Q-001 (đã quyết): cột "Actor" của uc-presales.md trống ở cả 31 UC. Tên vai trò "người phụ trách
  căng tin" theo TT79 Điều 41 khoản 2, 3 [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, dòng 438–439], thay "cán bộ căng tin" ở Q-001, RQ-32 (Q-013 đã quyết A)
  [SRC: 0-inputs/answers-2026-10-29.md, RQ-66].

## 2. Ghép luồng UC trong quy trình
| QT | Thư mục | Số UC | Chỗ nối khoảng trống | Sơ đồ |
| --- | --- | --- | --- | --- |
| QT-01 | [cap-2/QT-01-ncc-gia-nhap/](cap-2/QT-01-ncc-gia-nhap/QT-01.md) | 3 | 0 | [QT-01.drawio.svg](cap-2/QT-01-ncc-gia-nhap/QT-01.drawio.svg) |
| QT-02 | [cap-2/QT-02-nhap-kho/](cap-2/QT-02-nhap-kho/QT-02.md) | 5 | 2 | [QT-02.drawio.svg](cap-2/QT-02-nhap-kho/QT-02.drawio.svg) |
| QT-03 | [cap-2/QT-03-gia-ban/](cap-2/QT-03-gia-ban/QT-03.md) | 4 | 3 | [QT-03.drawio.svg](cap-2/QT-03-gia-ban/QT-03.drawio.svg) |
| QT-04 | [cap-2/QT-04-dieu-chuyen-kho/](cap-2/QT-04-dieu-chuyen-kho/QT-04.md) | 4 | 2 | [QT-04.drawio.svg](cap-2/QT-04-dieu-chuyen-kho/QT-04.drawio.svg) |
| QT-05 | [cap-2/QT-05-kiem-ke/](cap-2/QT-05-kiem-ke/QT-05.md) | 4 | 0 | [QT-05.drawio.svg](cap-2/QT-05-kiem-ke/QT-05.drawio.svg) |
| QT-06 | [cap-2/QT-06-canh-bao-ton-kho/](cap-2/QT-06-canh-bao-ton-kho/QT-06.md) | 1 | 1 | [QT-06.drawio.svg](cap-2/QT-06-canh-bao-ton-kho/QT-06.drawio.svg) |

Mục này là **chỉ mục**: luồng UC của từng quy trình (cấp 2) nằm trong thư mục `cap-2/QT-nn-<slug>/` (file `QT-nn.md`
theo template `ban-do-quy-trinh-qt.md`, kèm đặc tả `.bpmn.json`, sơ đồ `.drawio.svg`). Mỗi QT ở mục 1 có đúng một
dòng và một thư mục; QT không có UC presales (mục 6.2) vẫn có thư mục, mục 2 của file QT để trống.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| QT | Quy trình | Mã QT có ở mục 1 | QT-01 |
| Thư mục | Thư mục con của quy trình trong `cap-2/` | `cap-2/QT-nn-<slug>/`, slug là tên QT không dấu, nối gạch ngang, ngắn; link tới `QT-nn.md` | cap-2/QT-02-nhap-kho/ |
| Số UC | Số dòng ở mục 2 của file QT | Số | 5 |
| Chỗ nối khoảng trống | Số dòng `khoảng trống` ở mục 2 của file QT | Số | 2 |
| Sơ đồ | Sơ đồ BPMN luồng UC | Link tới `QT-nn.drawio.svg` | QT-02.drawio.svg |

## 3. Chuyển giao giữa quy trình
| Từ QT | Đối tượng chuyển giao | Đến QT | Qua hệ thống / thủ công | Nguồn |
| --- | --- | --- | --- | --- |
| QT-01 | Giá nhập mới (dòng giá nhập không vượt giá bán hiện hành) cần đề xuất giá bán | QT-03 | hệ thống: hộp "Quyết định giá bán" tự sinh hoặc cho chọn tạo đề xuất giá bán khi lưu giá nhập; hộp thuộc UC `PM3CSCN.WEB.10.01.01` Quản lý danh mục hàng hóa căng tin | [SRC: 1-ba-init/0-dau-vao/man-presales.md, MP-003, MP-004]; [SRC: 0-inputs/answers-2026-10-29.md, RQ-52] |
| QT-02 | Lô chờ giá (giá bán hiện hành nhỏ hơn giá nhập, lô bị giữ, không bán) | QT-03 | hệ thống (QP-03.14 hệ thống giữ lô chờ giá, cảnh báo người phụ trách căng tin) | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-03.08, QP-03.14, QP-03.15]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-11, RQ-13] |
| QT-02 | Lô cần giá bán mới (người phụ trách căng tin chọn đề xuất giá mới; lô bán ngay giá hiện hành) | QT-03 | hệ thống (QP-03.10 người phụ trách căng tin chọn trên hệ thống); việc chọn không có UC presales [PH-022] | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-03.10, QP-03.11, QP-03.12]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-22, RQ-25] |
| QT-02 | Phiếu nhập kho hủy duyệt bị chặn (tồn hiện tại của một dòng nhỏ hơn số đã nhập), xử lý qua kiểm kê | QT-05 | thủ công: Trưởng cơ sở giao kiểm kê đột xuất [ASM-007] | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-03.23]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-09, RQ-28] |
| QT-06 | Cảnh báo tồn dưới mức tối thiểu đã xem, người phụ trách căng tin chọn nhập kho | QT-02 | thủ công: người phụ trách căng tin tự lập phiếu nhập kho [ASM-008] | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-07.05] |
| QT-06 | Cảnh báo đã xem, người phụ trách căng tin chọn điều chuyển | QT-04 | thủ công: người phụ trách căng tin tự lập phiếu điều chuyển [ASM-008] | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-07.05] |
| QT-06 | Cảnh báo đã xem (lô sắp hết hạn, quá hạn, chờ giá), người phụ trách căng tin đề nghị kiểm kê | QT-05 | thủ công: đề nghị gửi Trưởng cơ sở ngoài hệ thống, Trưởng cơ sở giao kiểm kê [ASM-008] | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-07.05]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-30] |
| QT-06 | Lô chờ giá cần đề xuất giá bán (cảnh báo lô chờ giá đã xem) | QT-03 | thủ công: người phụ trách căng tin tự lập đề xuất giá bán sau khi xem cảnh báo [ASM-008], BA xác nhận [SRC: 0-inputs/answers-2026-10-29.md, RQ-116] | [SRC: 2-ba-overview/1-brd/BRD_PM3CSCN_QuanLyKhoCangTin_v01.md, BRQ-31]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-41]; [SRC: 0-inputs/answers-2026-10-29.md, RQ-119]; [SRC: du-an/open-questions.md, PH-033] |

Mục này trả lời: các quy trình nối với nhau thế nào, quy trình nào kích hoạt quy trình nào.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Từ QT | Quy trình gửi | Mã QT có ở mục 1 | QT-02 |
| Đối tượng chuyển giao | Thứ đi từ quy trình gửi sang quy trình nhận; là kết quả của QT gửi, trigger của QT nhận | Đối tượng + trạng thái, theo glossary | Lô chờ giá |
| Đến QT | Quy trình nhận | Mã QT có ở mục 1 | QT-03 |
| Qua hệ thống / thủ công | Cách chuyển | `hệ thống` / `thủ công`; nguồn không nói thì ghi `[ASM-xxx]` | hệ thống |
| Nguồn | Căn cứ của chuyển giao | `[SRC: …]` tới điều khoản, UC hoặc màn | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-03.15] |

- Quan hệ dữ liệu, không phải chuyển giao (quy-tac.md mục 1 của skill ba-bpmn): QT-02 đọc nhà cung cấp đang hoạt động,
  mặt hàng của nhà cung cấp, giá nhập mặc định do QT-01 ghi (RQ-16); QT-06 đọc tồn kho theo lô do QT-02, QT-04, QT-05 và
  Hệ thống bán hàng căng tin làm thay đổi (RQ-42, QP-07.08). Sơ đồ cấp 1 vẽ tồn kho giảm là sự kiện bắt đầu có điều kiện
  của QT-06.

## 4. Hệ thống và đơn vị bên ngoài
| Tên | Loại | QT liên quan | Trao đổi gì | Nguồn |
| --- | --- | --- | --- | --- |
| Hệ thống bán hàng căng tin | phần mềm | QT-03; QT-05; QT-06 | Gửi giá bán theo lô (QT-03); gửi khóa, mở khóa bán tại kho (QT-05); nhận về: trừ tồn kho theo lô FEFO khi bán, bỏ qua lô chờ giá, lô quá hạn, làm tồn kho giảm và kích hoạt kiểm tồn tối thiểu (QT-06). Hệ thống bán hàng căng tin tự đọc dữ liệu kho (giá bán theo lô, trạng thái khóa kho, tồn theo lô); phần mềm kho không có UC tích hợp riêng (Q-015 đã quyết B); PH-015 trong sổ vẫn mở, bước 2 đóng | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-01.08, QP-01.15, QP-04.09, QP-06.05, QP-06.11]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-03, RQ-19, RQ-30, RQ-42]; [SRC: 0-inputs/answers-2026-10-29.md, RQ-54]; [SRC: 0-inputs/phap-ly/TT79/1. Thông tư số 79.docx, Điều 41 khoản 7, dòng 444] |
| Nhà cung cấp | đơn vị | QT-02 | Nhận: hàng hóa giao để nhập kho (số lô, hạn sử dụng ghi trên phiếu nhập kho) | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-01.04, QP-03.01, QP-03.02]; [SRC: 0-inputs/answers-2026-10-28.md, RQ-14] |
| Bộ phận kế toán | đơn vị | QT-02 | Gửi: bản in phiếu nhập kho phục vụ lưu trữ kế toán, in khi phiếu đã tạo xong (RQ-57); không UC presales nào có kế toán, người nhận và cách giao chưa rõ [PH-021] | [SRC: 1-ba-init/0-dau-vao/uc-presales.md, `PM3CSCN.WEB.09.01.05`]; [SRC: 0-inputs/answers-2026-10-29.md, RQ-57] |
| Phần mềm quản lý cơ sở cai nghiện | phần mềm | QT-01; QT-02; QT-03; QT-04; QT-05 | Gửi (đồng bộ): danh mục kho, hàng hóa, nhà cung cấp (QT-01, QT-03 và danh mục kho `PM3CSCN.WEB.09.04.02`), tồn kho theo lô (QT-02, QT-04, QT-05), giá bán (QT-03); không gửi dữ liệu cá nhân người cai nghiện <span style="color:red">**<u>GD-0007</u>**</span>. Phần mềm này là đầu mối kết nối cơ sở dữ liệu quốc gia. Không UC presales nào làm việc kết nối, đồng bộ (PH-032). Không thành QT riêng: không có trigger nghiệp vụ, không đổi trạng thái đối tượng nghiệp vụ nào, chỉ sao dữ liệu do QT-01 → QT-05 tạo; cách kết nối, tần suất chưa có nguồn <span style="color:red">**<u>GD-0007</u>**</span> | [SRC: 1-ba-init/0-dau-vao/phap-ly.md, TT79-2026/Đ5.K1.a]; [SRC: 1-ba-init/0-dau-vao/uc-phap-ly.md, mục 3, TT79-2026/Đ5.K1.a]; [SRC: 0-inputs/answers-2026-10-29.md, RQ-91, RQ-96]; [SRC: 1-ba-init/open-questions.md, PH-032] |
| Cơ sở dữ liệu quốc gia về dân cư; cơ sở dữ liệu người nghiện ma túy và người bị quản lý sau cai nghiện ma túy | phần mềm | n/a (phần mềm kho không trao đổi trực tiếp; Phần mềm quản lý cơ sở cai nghiện là đầu mối) | Không trao đổi trực tiếp với phần mềm kho; nhận dữ liệu qua Phần mềm quản lý cơ sở cai nghiện <span style="color:red">**<u>GD-0007</u>**</span> | [SRC: 1-ba-init/0-dau-vao/phap-ly.md, TT79-2026/Đ5.K1.a]; [SRC: 0-inputs/answers-2026-10-29.md, RQ-96] |

Mục này trả lời: quy trình của dự án phải gửi, nhận gì với ai nằm ngoài phần mềm.

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Tên | Cơ quan, đơn vị hoặc phần mềm bên ngoài | Tên theo văn bản pháp luật hoặc UC presales | Hệ thống bán hàng căng tin |
| Loại | Bản chất của bên ngoài | `cơ quan` / `đơn vị` / `phần mềm` | phần mềm |
| QT liên quan | Quy trình có trao đổi | Mã QT, cách bằng `;` | QT-03 |
| Trao đổi gì | Thứ gửi đi hoặc nhận về | Đối tượng + chiều (gửi / nhận) | Gửi giá bán theo lô |
| Nguồn | Căn cứ | `[SRC: …]` | [SRC: 1-ba-init/0-dau-vao/quy-trinh-presales.md, QP-04.09] |

## 5. Khoảng trống ở chỗ nối
Khoảng trống ghi ở mục 3 của file từng QT (`cap-2/QT-nn-<slug>/QT-nn.md`); tổng số theo QT ở cột "Chỗ nối khoảng trống" của
mục 2. Khoảng trống là chỗ đầu ra của UC trước không nối được sang UC sau bằng nguồn — chỗ presales chào giá thiếu.

## 6. Đối chiếu hai chiều UC presales ↔ QT
Mục này trả lời: phạm vi presales và phạm vi quy trình có khớp nhau không. Chiều xuôi: mọi UC khách đã đặt đều nằm trong
một luồng nghiệp vụ, hoặc có lý do. Chiều ngược: mọi quy trình đều có UC khách đã đặt, hoặc có câu hỏi phạm vi.

### 6.1 UC presales không thuộc quy trình nào
| Mã gốc | Tên (nguyên văn) | Lý do | Q / PH |
| --- | --- | --- | --- |
| `PM3CSCN.WEB.09.01.06` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu nhập kho căng tin | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.09.02.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh sách phiếu xuất kho, điều chuyển | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.09.03.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất biên bản kiểm kê kho căng tin | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.09.04.01` | Xem/Tìm kiếm danh sách kho | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.09.04.02` | Thêm/Sửa/Xóa kho | danh mục | — |
| `PM3CSCN.WEB.09.04.04` | Theo dõi lịch sử Nhập/Điều chuyển kho | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.10.01.05` | Quản lý tìm kiếm, xem chi tiết và kết xuất danh mục hàng hóa và lịch sử thay đổi giá | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.15.01.02` | Tra cứu và kết xuất danh sách nhà cung cấp hàng hóa căng tin | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.15.02.02` | Tra cứu và kết xuất danh mục hàng hóa theo nhà cung cấp | tra cứu, báo cáo | — |
| `PM3CSCN.WEB.15.03.02` | Tra cứu và kết xuất lịch sử giá nhập theo nhà cung cấp | tra cứu, báo cáo | — |

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| Mã gốc | UC presales không có ở mục 1 | Mã gốc trong `` ` `` | `PM3CSCN.WEB.09.04.01` |
| Tên (nguyên văn) | Tên UC | Chép từ uc-presales.md | Xem/Tìm kiếm danh sách kho |
| Lý do | Vì sao UC không nằm trong luồng nào | `tra cứu, báo cáo`: chỉ đọc dữ liệu. `danh mục`: khai báo dữ liệu dùng chung. `quản trị hệ thống`: người dùng, phân quyền, cấu hình. `chưa rõ`: không xếp được | tra cứu, báo cáo |
| Q / PH | Câu hỏi khi lý do là `chưa rõ` | Mã Q (câu hỏi phạm vi, chặn G0); lý do khác ghi "—" | — |

- 9 UC `tra cứu, báo cáo` chỉ tìm kiếm, xem, kết xuất dữ liệu do QT-01 → QT-05 tạo; không tạo, không đổi trạng thái đối
  tượng nào. `PM3CSCN.WEB.09.04.02` khai báo kho, dữ liệu dùng chung cho QT-02, QT-04, QT-05, QT-06. Phạm vi nhóm
  `PM3CSCN.WEB.09.04` (gồm `09.04.01`, `09.04.02`, `09.04.04` ở đây và `09.04.03` ở QT-06) thuộc báo giá (Q-002 đã quyết)
  [SRC: 0-inputs/answers-2026-10-29.md, RQ-50].

### 6.2 Quy trình không có UC presales
| QT | Căn cứ | Q |
| --- | --- | --- |

| Trường | Nghĩa | Cách ghi | Ví dụ |
| --- | --- | --- | --- |
| QT | Quy trình chỉ có căn cứ điều khoản, ô "UC presales" ở mục 1 để trống | Mã QT có ở mục 1 | n/a (dự án này không có) |
| Căn cứ | Điều khoản buộc có quy trình này | Mã điều khoản, thường là điều khoản `chưa có UC` ở uc-phap-ly.md mục 3 | n/a (điều khoản `chưa có UC` duy nhất `TT79-2026/Đ5.K1.a` không sinh QT, xem mục 4) |
| Q | Câu hỏi trong hay ngoài phạm vi | Mã Q; không kết luận "phát sinh", không ước lượng | n/a |

- Không có QT nào ở mục này: cả 6 QT có UC presales. uc-phap-ly.md mục 3 có một điều khoản `chưa có UC`,
  `TT79-2026/Đ5.K1.a` (PH-032): việc kết nối, đồng bộ là luồng dữ liệu nền với Phần mềm quản lý cơ sở cai nghiện, không
  có trigger, kết quả nghiệp vụ theo method mục 7.1, nên ghi ở mục 4, không thành QT <span style="color:red">**<u>GD-0007</u>**</span>. Các điều khoản còn lại ở mục
  3: `TT79-2026/Đ6.K2`, `TT79-2026/Đ5.K2` áp dụng chung; `TT79-2026/Đ41.K7` ngoài phần mềm (Hệ thống bán hàng căng tin
  ở mục 4); `TT79-2026/Đ52.K4` ngoài phần mềm (cơ sở bảo đảm cơ sở vật chất, trang thiết bị).

## 7. Sơ đồ
Mỗi cấp một thư mục con của `ban-do-quy-trinh/`:
- Cấp 1 (bắt buộc): `cap-1/cap-1.drawio.svg` (một trang); đặc tả `cap-1/cap-1.bpmn.json`.
- Cấp 0: không vẽ — dự án có 6 QT, dưới ngưỡng khoảng 8 QT của skill ba-bpmn.
- Cấp 2 (luồng UC từng QT): `cap-2/QT-nn-<slug>/QT-nn.drawio.svg`, chỉ mục ở mục 2.

Mục này là hình của mục 1, 3, 4 (sơ đồ luồng UC từng QT nằm trong thư mục con). **Cấp 1** (sơ đồ cộng tác BPMN): pool dự án chia lane theo actor chủ trì; mỗi QT là một
sub-process thu gọn mang mã QT; chuyển giao ở mục 3 là mũi tên giữa các QT; hệ thống, đơn vị ngoài ở mục 4 là pool thu
gọn nối bằng message flow. **Cấp 0**: một trang cho người đọc nhanh (khách, quản lý), chỉ vẽ luồng chính của đối tượng
lõi đi qua các QT từ đầu tới cuối. Ký hiệu, cách vẽ theo skill ba-bpmn.

Mô tả sơ đồ cấp 1 bằng chữ:

| Phần tử | Lane / vị trí | Nghĩa | Nguồn |
| --- | --- | --- | --- |
| ⊞ QT-01, QT-02, QT-03, QT-04 | Người phụ trách căng tin | Bốn quy trình do người phụ trách căng tin khởi động | mục 1; QP-01 |
| ⊞ QT-05 | Trưởng cơ sở | Kiểm kê do Trưởng cơ sở giao | mục 1; QP-01.14 |
| ⊞ QT-06 | Hệ thống quản lý kho căng tin | Quét cảnh báo; khởi động bằng timer "Đến giờ quét hằng ngày" và sự kiện có điều kiện "Tồn kho theo lô giảm sau giao dịch" | mục 1; QP-07.01, QP-07.08 |
| Gateway "Giá nhập mới cần đề xuất giá bán?" | sau QT-01 | Chuyển giao QT-01 → QT-03 | mục 3 dòng 1 |
| Gateway "Lô cần giá bán mới?", "Hủy duyệt bị chặn?" | sau QT-02 | Chuyển giao QT-02 → QT-03, QT-02 → QT-05 | mục 3 dòng 2 → 4 |
| Gateway "Hướng xử lý cảnh báo?" và link event A, B, C, D | sau QT-06 | Chuyển giao QT-06 → QT-02 (A: Nhập kho), QT-04 (B: Điều chuyển), QT-05 (C: Cần kiểm kê), QT-03 (D: Đề xuất giá bán, nhập vào QT-03 qua cổng gộp cùng sự kiện "Cần bán mặt hàng mới hoặc giá bán lẻ tại địa phương thay đổi") | mục 3 dòng 5 → 8 |
| Pool thu gọn Nhà cung cấp, Bộ phận kế toán, Hệ thống bán hàng căng tin | trên, bên phải | Message flow "Hàng hóa giao", "Bản in phiếu nhập kho", "Giá bán theo lô", "Khóa, mở khóa bán tại kho" | mục 4 |
| Pool thu gọn Phần mềm quản lý cơ sở cai nghiện | dưới | Message flow từ cả pool dự án (luồng dữ liệu nền, không gắn một QT) "Đồng bộ danh mục kho, hàng hóa, nhà cung cấp, tồn kho theo lô, giá bán"; cơ sở dữ liệu quốc gia không vẽ vì không trao đổi trực tiếp | mục 4; `TT79-2026/Đ5.K1.a`; GD-0007 |

Nguồn: cap-1/cap-1.drawio.svg

![Bản đồ quy trình](cap-1/cap-1.drawio.svg)
