# Thiết kế bộ kit BA

| Phiên bản | Ngày | Trạng thái | Người duyệt |
| --- | --- | --- | --- |
| 0.1 | 2026-10-25 | Bản nháp, chờ BA lead duyệt | BA lead |
| 0.2 | 2026-10-25 | Chuyển sang repo mới `ba-kit`; bước 1 đã làm, bước 2–13 có khung | BA lead |

Tài liệu gom toàn bộ quyết định thiết kế bộ kit. Bộ kit dựng mới trong repo `ba-kit`, lấy lại và viết lại phần dùng
được của kit cũ (ba-standard-kit, gọi là kit v1). Mục 11 là lộ trình, mục 12 là việc còn mở.

---

## 1. Bối cảnh: vì sao viết lại

Kit v1 được thiết kế để dựng spec **cả dự án**, tuần tự từng bước, mỗi bước một PR, bước trước phải `approved` trên main
mới làm bước sau. Dự án PM9 (dùng thử kit v1) cho thấy thực tế khác:

| Kit v1 thiết kế | Thực tế PM9 |
| --- | --- |
| Làm ngang: xong một bước cho cả dự án rồi mới sang bước sau | Làm dọc: demo 3 chức năng đi xuyên bước 03→09 |
| Bước trước phải approved trên main | Main mới đến BRD; 15 nhánh merge chồng thành một PR 83 commit, khó review |
| Thứ tự cố định Prototype → Screens → SRS | Đảo thứ tự, SRS lỗi vì thiếu SCR-000 |
| Không sửa bước khác | Phát hiện ở bước sau liên tục phải sửa bước trước, phải mở PR riêng |
| Cấp ID tuần tự | Chạy song song phải dùng mã giữ chỗ rồi đánh số lại; traceability, open-questions thành điểm nóng xung đột |
| Hỏi BA hai lần và review sau mỗi bước | BA vắng, chạy chế độ ngủ; review bị bỏ để kịp tiến độ |

Ngoài ra **phạm vi công việc thật** khác: BA nhận đầu vào là UC presales, prototype presales và văn bản pháp luật,
và cần **làm chi tiết từng chức năng**, không phải dựng dự án từ đầu.

## 2. Định hướng

| Mặt | Kit v2 |
| --- | --- |
| Mục tiêu | Làm chi tiết **từng chức năng** đến mức bàn giao Dev, QC |
| Đầu vào | **UC presales** (xlsx), **prototype presales** (app React: link, bản build, mã nguồn; hoặc HTML tĩnh), **văn bản pháp luật**; tài liệu khác tùy chọn |
| Hướng làm | **Dựng ngược** từ ba nguồn ra quy trình nghiệp vụ, rồi chi tiết hóa qua 9 business layer |
| Mapping | UC → quy trình ở **cấp toàn dự án** (ma trận UC × PROC) và **cấp từng nhóm UC** (ma trận bước × UC × màn × điều luật) |
| Kiểm soát | **Gate review chặt do agent thực hiện**, không đạt thì không đi tiếp |
| Git | Một nhánh mỗi chức năng, **chỉ merge một lần khi xong** |

**Ngoài phạm vi:** ước lượng công, chi phí; kết luận "ngoài báo giá" (kit chỉ gắn cờ, PM quyết); test case chi tiết
(QC viết từ tiêu chí nghiệm thu); thiết kế kỹ thuật (kiến trúc, API, CSDL vật lý); hướng dẫn sử dụng, đào tạo.

## 3. Nguyên tắc thiết kế

| # | Nguyên tắc | Ý nghĩa |
| --- | --- | --- |
| 1 | Dựng ngược, không bịa | Mọi nội dung dẫn về UC presales, màn presales hoặc điều luật `[SRC]`. Không nguồn → `[ASM]`; con số → `[CẦN XÁC NHẬN]` |
| 2 | 9 business layer, đúng thứ tự phụ thuộc | Layer sau chỉ dùng thứ layer trước đã qua gate |
| 3 | Overview trước, chi tiết sau | Tầng dự án giữ thứ dùng chung; chức năng chỉ dẫn ID, không định nghĩa lại |
| 4 | Mapping là xương sống | Mỗi UC presales, màn presales, điều luật trong phạm vi gắn vào bước quy trình, hoặc có lý do |
| 5 | Gate do agent quyết, theo tiêu chí cứng | Còn lỗi Chặn = Không đạt. Người viết, người review, người sửa là ba phiên khác nhau |
| 6 | Không nghi thức Git giữa chừng | Một nhánh mỗi chức năng, một PR khi xong |
| 7 | Một nguồn sự thật | Liên kết ghi một chỗ; ma trận, SRS lắp ráp do script sinh, không viết tay |
| 8 | Tiêu chí nghiệm thu nằm trong UC | Không có layer kiểm thử riêng |

## 4. Kiến trúc tổng

### 4.1 Hai tầng, 13 bước, 5 gate

```
TẦNG DỰ ÁN (một lần, nhánh du-an/khung)
  Bước 1  Khởi tạo, danh mục đầu vào      /ba-init
  Bước 2  Overview 8 phần                 /ba-overview
  ◆ G0    Gate tầng dự án                 (tự chạy cuối /ba-overview)
          PR merge tầng dự án             /ba-pr du-an

TẦNG CHỨC NĂNG (lặp, mỗi chức năng một nhánh chuc-nang/CN-xx-<slug>)   /ba-chuc-nang CN-xx
  Bước 3  Khởi động chức năng
  Bước 4  BRD chức năng                   → 1-brd
  Bước 5  Quy trình và mapping            → 2-business-process
  ◆ G1    Hiểu đúng nghiệp vụ
  Bước 6  ERD chức năng                   → 3-erd
  Bước 7  Vòng đời (có điều kiện)         → 4-state-machine
  Bước 8  Use case                        → 5-actor-usecase
  Bước 9  Business rule                   → 6-business-rules
  ◆ G2    Đặc tả nghiệp vụ đầy đủ, khớp nhau
  Bước 10 Prototype                       → Prototype
  Bước 11 Đặc tả màn hình                 → Screens
  ◆ G3    Giao diện khớp nghiệp vụ
  Bước 12 SRS module                      → SRS
  ◆ G4    Sẵn sàng bàn giao
  Bước 13 PR và merge                     /ba-pr CN-xx
```

### 4.2 Cách gọi

- **Business layer** gọi bằng **tên thư mục**: `1-brd`, `2-business-process`, `3-erd`, `4-state-machine`,
  `5-actor-usecase`, `6-business-rules`, `Prototype`, `Screens`, `SRS`. Không gọi "lớp 1, lớp 3".
- **Bước** là thứ tự công việc 1–13 của kit, khác layer.
- Thao tác bên trong một bước có mã riêng: D1–D6 (bước 5), E1–E7 (bước 6), S1–S6 (bước 7), U1–U7 (bước 8),
  R1–R6 (bước 9), P1–P7 (bước 10), M1–M6 (bước 11), T1–T6 (bước 12).
- Tham số chạy lại một layer dùng tên: `--lop brd|process|erd|state|usecase|rules|prototype|screens|srs`.

### 4.3 Phân loại 9 layer

| Layer | Trả lời câu hỏi | Phân loại |
| --- | --- | --- |
| `1-brd` | Làm để đạt gì, phạm vi đến đâu, nghĩa vụ pháp lý nào | Bắt buộc, **gọn** ở cấp chức năng |
| `2-business-process` | Công việc chạy thế nào, chuyển giao ra sao, bước nào ngoài hệ thống | **Lõi bắt buộc** |
| `3-erd` | Dữ liệu nào, nghĩa gì, chức năng nào sở hữu | **Lõi bắt buộc** (mức nghiệp vụ) |
| `4-state-machine` | Trạng thái nào, chuyển khi nào | **Có điều kiện**: chỉ ENT có vòng đời |
| `5-actor-usecase` | Ai làm gì; UC presales giữ, tách hay bỏ | **Lõi bắt buộc** |
| `6-business-rules` | Điều kiện, thời hạn, thẩm quyền, công thức | **Lõi bắt buộc** |
| `Prototype` | Khách thấy gì, luồng bấm đúng không | Đi cặp với `Screens`; sửa từ presales |
| `Screens` | Trường, kiểm tra, nút, thông báo từng màn | **Lõi bắt buộc** |
| `SRS` | Gói bàn giao, yêu cầu phi chức năng, giao diện ngoài | **Lõi bắt buộc**, là bản lắp ráp |

### 4.4 Cấu trúc thư mục repo dự án

```
0-inputs/                          tài liệu thô, KHÔNG sửa
  presales/uc/                   UC presales (xlsx)                 bắt buộc
  presales/prototype/            prototype: dist/, nguon.md (link) hoặc HTML; ma-nguon/   bắt buộc
  phap-ly/                       văn bản pháp luật                  bắt buộc
  khac/                          đề cương, biểu mẫu, quy chế         tùy chọn
  answers-<ngày>.md              câu trả lời của BA
1-ba-init/                       bước 1 — /ba-init: danh mục đầu vào
  templates/                     template danh mục (uc-presales, phap-ly, man-presales, uc-phap-ly, …)
  0-dau-vao/                     uc-presales.md, man-presales.md (+ .json, ảnh MP-xxx.png), phap-ly.md, uc-phap-ly.md
2-ba-overview/                   bước 2 — /ba-overview: business layer tầng dự án
  templates/                     template business layer (00_quy_uoc_chung.md, 1-brd … 6-business-rules)
  1-brd/  2-business-process/  3-erd/  4-state-machine/  5-actor-usecase/  6-business-rules/
3-ba-detail/                     bước 3 — /ba-detail: specification layer từng chức năng
  templates/                     template spec layer (use-case, prototype, screens, design-system)
  use-case/  Prototype/  Screens/  SRS/
du-an/                           hồ sơ tầng dự án
  glossary.md  trace.csv  open-questions.md  G0.md
chuc-nang/CN-xx/                 hồ sơ một chức năng
  brief.md  trace.csv  open-questions.md  G1.md  G2.md  G3.md  G4.md
traceability.csv, open-questions.md        bản tổng do script ghép, KHÔNG sửa tay
du-an/reports/dieu-phoi/, du-an/reports/sleep/        nhật ký điều phối agent, chế độ ngủ (tên file: nhánh, `/` thay bằng `-`)
.ba-cache/                                 bản chữ của docx, xlsx (không commit)
```

Thư mục `project/` của kit v1 bỏ. `charter.md`, `stakeholders.md`, `ba-plan.md` bỏ; `decisions.md` gộp vào
`open-questions.md`.

### 4.5 Lệnh

| Lệnh | Việc |
| --- | --- |
| `/ba-init [--ngu] [--bo-sung]` | Bước 1 |
| `/ba-overview [--lop x] [--ngu]` | Bước 2 và G0 |
| `/ba-chuc-nang CN-xx [--tiep] [--den Gx] [--lop x] [--ngu]` | Bước 3 → G4 |
| `/ba-pr du-an \| CN-xx` | Cập nhật từ main, cổng máy toàn repo, mở PR |
| `/ba-next [--sync]` | Tiến độ chức năng × gate; `--sync` chuyển `approved` sau merge |
| `/ba-diagram`, `/ba-export`, `/ba-cr` | Hỗ trợ (port từ v1; `ba-impact` gộp vào `/ba-cr --tra-nhanh`) |

`/ba-chuc-nang` tự dừng khi: gate Không đạt sau 2 vòng sửa; có câu hỏi chặn chưa trả lời; tới điểm `--den`; xong G4.

---

## 5. Tầng dự án

### Bước 1. Khởi tạo và lập danh mục đầu vào — `/ba-init`

**Mục đích:** biến bốn nguồn thô (UC presales, quy trình presales, prototype presales, văn bản pháp luật) thành bốn
danh mục có mã và một ma trận UC presales × điều khoản, để mọi bước sau dẫn nguồn chính xác và máy đo được độ phủ;
từ bước 1 đã biết mỗi UC dựa trên điều khoản nào và mỗi điều khoản sẽ thành loại rule nào.

**Điều kiện:** đủ bốn thư mục bắt buộc trong `0-inputs/` (`presales/uc/`, `presales/quy-trinh/`, `presales/prototype/`,
`phap-ly/`); Node, `kit/tools/ba-verify` đã cài; có trình duyệt (Chromium của Playwright, hoặc Chrome, Edge đã cài).

**Thao tác:**
1. Kiểm đầu vào; chuyển sang bản chữ vào `.ba-cache/ban-chu/`: docx, xlsx bằng `office.cjs`; drawio, bpmn bằng
   `doc-quy-trinh.mjs` (trang, lane, ô có id, mũi tên có nhãn). Không ghi vào `0-inputs/`; `[SRC]` vẫn trỏ tệp gốc.
2. Lập danh mục UC presales: chép nguyên văn, giữ mã gốc; không sửa, không gộp, không đánh giá.
3. Lập danh mục quy trình presales: quy trình tổng và chi tiết (`QP-xx`), từng bước (`QP-xx.yy`) với tên, lane, đi
   tới chép nguyên văn sơ đồ, và UC presales mà **presales gắn** (không tự gắn). UC không bước nào gắn → phát hiện.
4. Lập danh mục màn presales. Presales thường bàn giao **app React** (link đã deploy, bản build `dist/`, mã nguồn),
   ít khi là HTML tĩnh. `quet-prototype.mjs` duyệt `dist/` qua server cục bộ (ưu tiên, cố định) hoặc link; đọc route
   khai báo trong `ma-nguon/` (không chạy mã nguồn); đi từng route, mở rộng menu, bấm tab, bấm thử nút và dòng bảng
   để tìm popup và route mới (không bấm nút ghi dữ liệu); chụp ảnh, đọc nhãn ô nhập đang hiện; cấp mã `MP-xxx` theo
   (route, cách mở). Có cả dist và link → đối chiếu danh sách route. HTML tĩnh: mở từng tệp, lỗi thì đọc tĩnh.
   Chi tiết, giới hạn: 1-ba-init/templates/man-presales.schema.md; cách đặt đầu vào: 1-ba-init/templates/nguon-prototype.md.
5. Lập danh mục pháp lý: tách tới điều, khoản, điểm (mỗi mã một ý); chỉ lấy điều khoản chi phối nghiệp vụ; phân loại;
   bóc chủ thể, hành vi, đối tượng bằng từ của văn bản; ghi hướng BR (sáu loại của ba-rules) cho bước 9.
6. Lập ma trận UC presales × điều khoản: ghép theo chủ thể, hành vi, đối tượng; mỗi UC có căn cứ hoặc lý do (UC
   `chưa tìm thấy` căn cứ → Q chặn G1), mỗi điều khoản có UC hoặc lý do (`chưa có UC` → phát hiện).
7. Khởi tạo glossary; khởi tạo open-questions: câu hỏi (mâu thuẫn giữa các nguồn, ghi đủ phương án), giả định, phát
   hiện (mục 3, thay `so-phat-hien.md` cũ).
8. Hỏi BA xác nhận: văn bản áp dụng, hết hiệu lực; phân hệ trong phạm vi; ma trận UC × pháp lý; mâu thuẫn trả lời được ngay.
9. Cổng máy; commit `spec(du-an/0-dau-vao): …`.

**Đầu ra:**

| File | Cột chính | Sinh ra để |
| --- | --- | --- |
| `uc-presales.md` | Mã gốc, tên nguyên văn, actor, phân hệ, mô tả luồng, nguồn, chức năng (bước 2 điền) | Mốc phạm vi; máy kiểm UC presales đã xử lý hết |
| `quy-trinh-presales.md` | QP, tên, cấp, mở rộng từ; bước QP-xx.yy, tên, loại, lane, đi tới, UC presales theo nguồn, nguồn (ô sơ đồ) | Nguồn cho bản đồ PROC (bước 2) và PROC chi tiết (bước 5); mapping UC ↔ bước của presales |
| `man-presales.md` + `.json` + ảnh | Mã màn, vị trí (route hoặc tệp), cách mở, tiêu đề, trường, nút, đi tới, UC presales, ảnh | Mapping màn ↔ bước; trường cho ERD; gốc cho bước 10 |
| `phap-ly.md` | Văn bản (số điều khoản lấy); mã điều khoản, loại, chủ thể, hành vi, đối tượng, tóm tắt, hướng BR, hiệu lực, nguồn; biểu mẫu | Nguồn cho bước thủ tục, rule, trạng thái pháp lý; reviewer pháp lý kiểm theo |
| `uc-phap-ly.md` | Văn bản, mã điều khoản, UC presales, quan hệ, ghép vì, cách ghép; UC không căn cứ; điều khoản không UC | Mỗi UC tham chiếu được về pháp lý; REQ loại S (bước 4), BR (bước 9) dẫn theo |
| `du-an/glossary.md` | Thuật ngữ, định nghĩa, không dùng, từ tiếng Anh, nguồn | Một tên cho một thứ; `term-check` |
| `du-an/open-questions.md` | Mục 1 Q (phương án, chặn gate, quyết định…); mục 2 ASM; mục 3 PH (đối tượng, bước, loại, Q liên quan, trạng thái, đóng ở) | Một sổ cho câu hỏi, giả định, phát hiện; dòng `đã quyết` thay `decisions.md` |
| `du-an/trace.csv` | Mỗi QP, MP, PH, Q, ASM một dòng | Truy vết; bản tổng do script ghép |

**Quy ước mã:**
- Mã điều khoản tự nhiên, định dạng cố định `<Loại><Số>-<Năm>/Đ<điều>.K<khoản>.<điểm>`, ví dụ `TT79-2026/Đ12.K2`,
  `NĐ163-2026/Đ5.K1.a`. Script kiểm định dạng. Văn bản sửa đổi → thêm dòng mới, dòng cũ ghi Hiệu lực "hết".
- Quy trình presales cấp `QP-xx`, bước `QP-xx.yy` (sơ đồ không có mã sẵn); mã gốc của presales nếu có ghi cột riêng.
  QP không phải PROC: PROC do kit dựng ở bước 2, 5 và dẫn QP làm nguồn.
- Màn presales cấp `MP-xxx`: app mỗi route, tab, popup một màn; HTML tĩnh một tệp có thể nhiều màn. Đoạn đường dẫn là
  mã bản ghi thay bằng `:id`. SCR sau này ghi nguồn là MP nào.
- Văn bản không có số hiệu (đề cương, quy chế nội bộ): `VB-<tên-ngắn>/<mục>`.
- Loại điều khoản: thủ tục / thời hạn / thẩm quyền / biểu mẫu / điều kiện / đối tượng / chế tài.

**Không làm:** sửa `0-inputs/`; cấp UC kit; đánh giá UC presales; tự gắn bước quy trình presales với UC; bảng bước
quy trình (bản đồ QT chỉ có cấp tổng, quyết định 30); chia chức năng; cấp BR hay viết câu rule.

**Cổng máy** (`dau-vao-check.mjs`): mã và tên UC khớp nguyên văn tệp gốc theo số dòng, không sót dòng UC, mã trùng
có phát hiện; quy trình presales: mọi ô bước, cổng có nhãn của sơ đồ drawio, bpmn có ở danh mục (hoặc mục ô bỏ qua),
tên khớp nhãn, "đi tới" đủ mọi mũi tên, UC gắn có thật, UC không thuộc quy trình có phát hiện; MP trong JSON và md
khớp nhau (HTML tĩnh: mỗi tệp có ít nhất một MP), mỗi MP có ảnh hoặc ghi chú; "đi tới", menu trỏ MP có thật; route
trong mã nguồn chưa mở được, route lệch dist ↔ link có dòng ở mục 3; mã điều khoản đúng định dạng, trỏ văn bản có
thật, hướng BR hợp lệ (điều kiện, thời hạn, thẩm quyền bắt buộc có), số điều khoản lấy khớp; ma trận phủ hai chiều
(mọi UC, mọi điều khoản), lý do hợp lệ, `chưa tìm thấy` có Q, `chưa có UC` có PH. Danh mục chép nguyên văn nên
**không** bị kiểm từ cấm của glossary.

**Agent:** ba đợt. Đợt 1 `business-analyst` lập danh mục UC presales (A1). Đợt 2 song song: `business-analyst` lập
danh mục pháp lý (A2), `business-analyst` lập danh mục quy trình presales (A3), `ux-spec-designer` lập danh mục màn từ
kết quả của `quet-prototype.mjs`. Phiên chính gộp glossary, open-questions (Q, ASM, PH), trace. Đợt 3
`business-analyst` lập ma trận UC × điều khoản (A4); phiên chính gộp lần hai. Đợt 4 `business-analyst` dựng bản đồ
quy trình `QT-nn` (A5, quyết định 30); phiên chính gộp lần ba, BA chốt danh sách QT. Mã MP, QP, QT giữ nguyên khi chạy lại
(`--bo-sung`). Không có gate riêng; review ở G0.

### Bước 2. Overview — `/ba-overview`

**Mục đích:** dựng ngược bức tranh chung của cả dự án; chia chức năng; định nghĩa một lần những thứ dùng chung.

**Điều kiện:** đang ở nhánh `du-an/khung`; đủ ba danh mục; cổng máy bước 1 không còn lỗi.

**Tám phần và agent:**

| # | Phần | Ghi vào | Đầu ra | Agent |
| --- | --- | --- | --- | --- |
| 1 | BRD overview | `1-brd` | `brd-overview.md`: bối cảnh, mục tiêu (REQ loại B), phạm vi theo phân hệ, nhóm người dùng, nghĩa vụ pháp lý tổng, ràng buộc | Phân tích nghiệp vụ |
| 2 | Quy trình overview | `2-business-process` | `process-overview.md` + BPMN cấp 0, cấp 1 (danh mục PROC: trigger, kết quả, actor, căn cứ; chuyển giao; hệ thống ngoài); `ma-tran-uc-proc.md`; `danh-muc-chuc-nang.md` | Phân tích nghiệp vụ |
| 3 | ERD overview | `3-erd` | `erd-overview.md`: danh mục ENT, CN sở hữu, PROC tạo ra, có vòng đời không; sơ đồ khái niệm | `data-modeler` |
| 4 | Actor, khung UC | `5-actor-usecase` | `actors.md` (kèm tên actor gốc presales, thẩm quyền); `uc-overview.md` (bảng chốt để trống, ma trận actor × CN) | `usecase-analyst` |
| 5 | Rule chung | `6-business-rules` | `rules-overview.md`: rule áp mọi CN, khung phân quyền, con số cần xác nhận | `usecase-analyst` |
| 6 | Khung prototype | `Prototype` | `_khung/` lấy từ presales, `menu.json` có mục mọi CN, `index.html`, `sitemap.md`, `prototype-notes.md` | `ux-spec-designer` |
| 7 | Quy ước màn chung | `Screens` | `SCR-000` | `ux-spec-designer` |
| 8 | SRS chung | `SRS` | `srs.md` khung 29148: giới thiệu, bối cảnh, người dùng, ràng buộc, yêu cầu phi chức năng, giao diện ngoài, danh mục module | `srs-writer` |

**Cách dựng ngược phần 2:** gom UC presales theo đối tượng nghiệp vụ và thủ tục pháp lý; sắp thứ tự theo trình tự
thủ tục; đối chiếu luồng màn presales. Mỗi PROC có căn cứ là điều khoản hoặc UC presales.
Thứ tự trong phần 2: dựng bản đồ PROC (BPMN cấp 0, cấp 1) trước, rồi cắt thành CN theo chuỗi PROC, để cách chia CN
có căn cứ là quy trình và luật, không theo độ giống nhau của UC. Phương pháp cấp tổng viết ở `ba-process/method.md`
(mục 8.4), lấy từ kit v1: `ba-process` method mục 1, 1b, 10, 11 (bản đồ quy trình, chuyển giao hai đầu, khớp hai
cấp, ghép luồng UC với 4 câu hỏi ở mỗi chỗ nối) và `ba-refine` method mục 5.2, 5a (định nghĩa nhóm nghiệp vụ, đối
chiếu hai chiều mã gốc, cảnh báo thành dòng sổ phát hiện), đổi NV → CN, `baseline.md` → `so-phat-hien.md`. Không có
tầng FEAT: UC presales → CN → PROC; đội Dev cần Epic thì một CN một Epic. Không lấy luồng phiên của `ba-refine`
(phân tích biên bản họp, khử trùng REQ, MoSCoW, hàng đợi 30 câu): hỏi BA theo `ba-questioning` chế độ xác nhận.

**`danh-muc-chuc-nang.md`:** CN, tên, PROC, UC presales, MP, điều khoản, ENT sở hữu, phụ thuộc CN, thứ tự,
**dải ID**. Quy tắc chia: mỗi CN gồm 1–3 PROC nối nhau trong một chuỗi nghiệp vụ (vượt cỡ → cảnh báo). Dải ID cấp
ngay ở đây để merge cùng G0; dùng hết thì xin thêm từ phần dự phòng.

**Thứ tự chạy:** 1 → 2 → (BA xác nhận cách chia CN, thứ tự) → 3 và 4 song song → 5 và 6 song song → 7 → 8 → G0.
Mỗi phần một commit. Hai agent không sửa cùng một file; tối đa 5 agent cùng lúc.

**Hỏi BA:** sau phần 2 xác nhận cách chia chức năng và thứ tự; nguồn mâu thuẫn; cuối bước xác nhận giả định.

**Sửa overview sau G0:** chức năng chỉ **thêm dòng** vào overview trên nhánh của mình; đổi cấu trúc (chia lại CN,
đổi PROC, đổi chủ ENT) thì chạy `/ba-overview --lop x` trên nhánh dự án mới, qua G0 lại.

### G0. Gate tầng dự án

Phạm vi: đầu ra bước 1 và bước 2. Cơ chế chung ở mục 7.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | 100% UC presales gắn PROC hoặc có lý do (ngoài phạm vi / trùng) | Máy | Chặn |
| 2 | 100% UC presales thuộc đúng một CN; mỗi PROC thuộc đúng một CN | Máy | Chặn |
| 3 | Mỗi điều khoản loại thủ tục gắn ít nhất một PROC hoặc có lý do | Máy | Chặn |
| 4 | Mỗi MP gắn UC presales hoặc có dòng sổ phát hiện | Máy | Chặn |
| 5 | BPMN cấp 0, cấp 1 hợp lệ | Máy | Chặn |
| 6 | Chuyển giao giữa các PROC khớp hai đầu | Máy, agent nhất quán | Chặn |
| 7 | Mỗi PROC có trigger, kết quả, actor, căn cứ | Agent chất lượng | Chặn |
| 8 | Phụ thuộc CN không vòng; thứ tự khớp phụ thuộc; có dải ID | Máy | Chặn |
| 9 | CN vượt cỡ | Máy | Cảnh báo |
| 10 | Mỗi ENT có đúng một CN sở hữu; không hai ENT cùng nghĩa | Máy, agent nhất quán | Chặn |
| 11 | Mọi actor gốc presales gắn được ACT; thẩm quyền dẫn luật | Agent pháp lý | Chặn |
| 12 | Rule chung không thuộc riêng một CN; mỗi rule có nguồn | Agent chất lượng | Nên sửa |
| 13 | Mỗi điều khoản được dẫn đúng nội dung | Agent pháp lý | Chặn |
| 14 | Phát hiện so với presales ghi đủ | Agent presales | Chặn |
| 15 | Mục tiêu, REQ loại B đạt 29148 | Agent chất lượng | Chặn |
| 16 | Sitemap đủ mọi MP và mọi CN; menu đủ mọi CN (bản tối thiểu, khung chạy được dựng ở bước 10) | Agent nhất quán | Chặn |
| 17 | SRS chung đủ heading, không tự điền con số | Máy, agent chất lượng | Chặn |
| 18 | Không còn Q `mở` chặn G0 | Máy | Chặn |
| 19 | Thuật ngữ đúng glossary | Máy | Nên sửa |

Đầu ra: `du-an/G0.md`. Đạt → `/ba-pr du-an`, BA lead merge. Chỉ sau khi merge mới chạy được `/ba-chuc-nang`.

---

## 6. Tầng chức năng — `/ba-chuc-nang CN-xx`

### Bước 3. Khởi động chức năng

**Mục đích:** khoanh đúng phạm vi để agent chỉ đọc phần cần, reviewer có mốc bắt phình phạm vi, chức năng có chỗ làm
việc riêng.

**Điều kiện:** main có `du-an/G0.md` Đạt; CN-xx có trong danh mục; chưa có nhánh khác làm CN-xx; CN phụ thuộc đã
merge (chưa merge → hỏi BA: chờ, hay chạy tiếp với cờ "chờ CN-yy" và PR cuối không merge được trước CN-yy).

**Thao tác:** kiểm điều kiện → tạo nhánh `chuc-nang/CN-xx-<slug>` → tạo `chuc-nang/CN-xx/` (trace, open-questions
rỗng) → lập brief bằng cách **lọc**, không viết nghiệp vụ mới → BA xác nhận phạm vi → cổng máy → commit → sang bước 4.
Phiên chính làm, không cần subagent.

**`brief.md` (12 mục):** định danh; mục tiêu phục vụ; phạm vi UC presales (kèm mô tả luồng); quy trình (PROC,
chuyển giao vào, ra); màn presales (kèm ảnh); điều khoản; dữ liệu (ENT sở hữu, ENT dẫn); actor và rule chung; phụ
thuộc; dải ID; câu hỏi và phát hiện liên quan; ngoài phạm vi.

**Quy tắc:** brief chỉ lọc; không sửa overview (thấy sai → ghi câu hỏi); không cấp ID.

**Cổng máy:** brief đủ mọi UC, PROC, MP, điều khoản, ENT của dòng CN-xx; mỗi dòng trỏ mã có thật; có dải ID; phụ
thuộc chưa merge có xác nhận BA; đủ heading. Review ở G1.

### Bước 4. BRD chức năng → `1-brd`

**Mục đích:** điểm gốc của truy vết (REQ → bước → UC → màn → SRS); thước đo phạm vi; chuyển UC presales và điều
luật về một dạng nhu cầu nghiệp vụ.

**Đầu vào:** brief (mục tiêu, UC presales, điều khoản, chuyển giao, ngoài phạm vi, câu hỏi đã quyết),
`brd-overview.md`.

**Cách dựng ngược:**

| Nguồn | Câu hỏi | REQ |
| --- | --- | --- |
| UC presales | Người dùng cần kết quả nghiệp vụ gì? | Nhu cầu nghiệp vụ |
| Điều khoản thủ tục | Luật bắt buộc làm gì, trình tự nào? | Nghĩa vụ trình tự |
| Điều khoản thời hạn | Việc gì phải xong trong bao lâu? | Thời hạn, con số chép đúng văn bản |
| Điều khoản thẩm quyền | Ai được phép làm? | Thẩm quyền |

Gom nhiều UC cùng nhu cầu thành một REQ; tách UC hai nhu cầu thành hai REQ; không viết giải pháp giao diện.

**Căn cứ REQ (thay MoSCoW):** `pháp lý` (không được bỏ; bước 8 không được Bỏ UC phục vụ) / `presales` (trong báo
giá) / `phát sinh` (tự tạo câu hỏi phạm vi, không chặn gate; bước 8 gắn cờ).

**Đầu ra `brd-CN-xx-<slug>.md` (8 mục):** thông tin chung; bối cảnh (dẫn overview); mục tiêu (dẫn REQ loại B);
phạm vi trong, ngoài; bảng REQ (ID, nội dung, loại S, căn cứ, nguồn, mục tiêu phục vụ, trạng thái); ràng buộc; giả
định và câu hỏi; ma trận nguồn → REQ (script sinh).

**Hỏi BA:** UC presales mâu thuẫn luật (chặn G1); REQ phát sinh (không chặn); giả định mới (không chặn trừ khi
đụng con số, thẩm quyền).

**Cổng máy:** mỗi UC presales trong brief có REQ hoặc phát hiện; mỗi điều khoản thủ tục, thời hạn, thẩm quyền, điều
kiện có REQ hoặc lý do; mỗi REQ có nguồn, căn cứ, mục tiêu; ID trong dải; đủ heading; không từ mơ hồ. REQ nhắc màn,
nút → cảnh báo. Review ở G1.

### Bước 5. Quy trình và mapping → `2-business-process`

**Mục đích:** bước lõi. Dựng ngược quy trình chi tiết; chứng minh bằng mapping mọi UC presales, màn presales, điều
khoản, REQ đều có bước, mỗi bước có căn cứ. Quy trình là nguồn chính cho mọi layer sau.

**Đầu vào:** PROC trong overview (hai đầu cố định), điều khoản, UC presales, MP và ảnh, BRD chức năng, actors,
erd-overview, rules-overview, skill `ba-bpmn`.

**Cách dựng ngược D1–D6:**

| | Thao tác | Kết quả |
| --- | --- | --- |
| D1 | Khung từ overview | Trigger, kết quả, chuyển giao vào, ra |
| D2 | Xương sống pháp lý | Trình tự bước bắt buộc, kể cả bước ngoài hệ thống |
| D3 | Bước hệ thống từ UC presales | Đặt UC vào xương sống |
| D4 | Kiểm theo luồng màn | Lệch → phát hiện, không sửa cho khớp |
| D5 | Rẽ nhánh | Gateway từ điều kiện luật, luồng thay thế, nút trên màn |
| D6 | Ngoại lệ | 4 câu hỏi mỗi bước: vắng, dữ liệu sai, hệ thống ngoài không phản hồi, quá hạn |

Mỗi bước có loại `hệ thống` / `thủ công` / `hệ thống ngoài`. As-is chỉ vẽ khi có nguồn hiện trạng.

**Mapping:** bảng bước là nơi duy nhất ghi liên kết; script sinh `mapping-CN-xx.md` (độ phủ; UC → bước; MP → bước;
điều khoản → bước; REQ → bước; bước → nguồn; khoảng trống: bước hệ thống không UC, bước hệ thống không màn, MP không
bước, bước không căn cứ). Agent chỉ viết tay mục "Không gắn bước" kèm lý do.

**Đầu ra:** `PROC-xx-<slug>.md` mỗi PROC (template v1, sửa: cột NV → CN; bảng bước thêm 5 cột Loại, REQ, UC
presales, MP, Điều khoản; mục 7 thành "Thời hạn và chỉ số"); `.bpmn.json` và `.drawio.svg` theo `ba-bpmn`;
`mapping-CN-xx.md`; số bước cụ thể ở dòng chuyển giao của CN trong overview; dòng sổ phát hiện.

**Hỏi BA:** trình tự luật khác presales (chặn G1); bước thủ công luật bắt buộc có lên hệ thống không (không chặn);
khoảng trống (không chặn); điều kiện gateway không nguồn (chặn nếu đụng thẩm quyền, thời hạn).

**Phạm vi so với overview:** overview (phần 2 bước 2) cố định hai đầu mỗi PROC ở cấp 0, cấp 1 (sub-process thu gọn,
không bảng bước). Bước 5 mở sub-process thành cấp 2 (bảng bước, D1–D6) và, khi một bước quá phức tạp, cấp 3
`PROC-xx-yy` theo `ba-bpmn`. Thấy overview sai → ghi đề xuất, không tự sửa.

**Nguồn phương pháp:** port từ kit v1 (`spec v1 25.10/.claude/skills/ba-process/`, v2.1.0, đã chạy thật trên PM9):
method mục 2–9, 12 và `checklist.md` làm nền cấp chi tiết; mục 11 (chế độ presales) tách đôi: ghép luồng UC và bốn câu
hỏi ở chỗ nối về cấp tổng, câu "chi tiết phát hiện khoảng trống thì ghi sổ" vào D3; mục 10 sửa luật (chi tiết không đổi
overview, chỉ thêm); viết mới D2, D4, 5 cột mới của bảng bước và script mapping. Bảng phân loại từng mục: phụ lục
"Phân loại port `ba-process`". Ca thử: 7 PROC PM9 đã qua review (PROC-02, 03, 04, 10, 11, 12, 19) —
chạy lại theo kit mới, so với bản cũ.

**Quy tắc:** không đổi hai đầu của overview; bước theo công việc, một actor, một hành động; không sửa thứ tự cho
khớp màn; không viết tay ma trận; không sửa dòng CN khác; không tự điền thời hạn.

**Cổng máy:** `bpmn_lint` đạt, ID bước khớp; độ phủ 100% (gắn hoặc có lý do); mỗi bước hệ thống có căn cứ; gateway
đủ lối ra; chuyển giao khớp; trigger, kết quả khớp overview; mỗi bước một actor có thật; glossary. Bước không ngoại lệ
→ cảnh báo.

### G1. Hiểu đúng nghiệp vụ

Phạm vi: bước 3, 4, 5.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Cổng máy bước 4, 5 đạt | Máy | Chặn |
| 2 | Độ phủ mapping 100% | Máy | Chặn |
| 3 | Lý do "không gắn bước" hợp lệ | Agent nhất quán | Chặn |
| 4 | REQ đúng ý nguồn | Agent presales, pháp lý | Chặn |
| 5 | REQ không mơ hồ, kiểm chứng được, một ý | Agent chất lượng | Chặn |
| 6 | Không sót nghĩa vụ pháp lý | Agent pháp lý | Chặn |
| 7 | Trình tự bước đúng thủ tục | Agent pháp lý | Chặn |
| 8 | Thời hạn, thẩm quyền dẫn đúng; không tự điền số | Agent pháp lý | Chặn |
| 9 | Bước gắn UC, MP đúng ý | Agent presales | Chặn |
| 10 | Khoảng trống đều có phát hiện | Máy, agent presales | Chặn |
| 11 | Không vượt phạm vi brief; phần vượt có câu hỏi | Agent nhất quán | Chặn |
| 12 | Chuyển giao khớp overview, CN kề bên | Máy, agent nhất quán | Chặn |
| 13 | Gateway rõ, đủ lối ra, điều kiện có nguồn hoặc ASM | Agent chất lượng | Chặn |
| 14 | Ngoại lệ xét đủ 4 câu hỏi; quá hạn khớp điều khoản | Agent chất lượng | Nên sửa |
| 15 | As-is chỉ có khi có nguồn | Agent chất lượng | Chặn |
| 16 | Không còn Q `mở` chặn G1 | Máy | Chặn |
| 17 | BPMN đạt checklist `ba-bpmn` | Máy, agent chất lượng | Nên sửa |
| 18 | Thuật ngữ đúng glossary | Máy | Nên sửa |

### Bước 6. ERD chức năng → `3-erd`

**Mục đích:** định nghĩa dữ liệu chức năng tạo ra, ở mức nghiệp vụ; mỗi trường màn có chỗ dẫn về; dữ liệu giữa các
chức năng khớp nhau.

**Điều kiện:** G1 Đạt, còn hiệu lực.

**Cách dựng ngược E1–E7:** E1 danh sách ENT từ cột dữ liệu chạm tới (sở hữu / dẫn / mới → thêm dòng overview);
E2 thuộc tính pháp lý từ biểu mẫu; E3 thuộc tính presales từ trường MP; E4 thuộc tính từ quy trình; E5 hợp nhất,
đối chiếu (biểu mẫu có màn không → phát hiện; màn có không ai cần → phát hiện; mâu thuẫn → câu hỏi); E6 quan hệ, bội
số (không nguồn → ASM); E7 đánh dấu thuộc tính trạng thái cho ENT có vòng đời.

Thuộc tính ghi: tên, mô tả, kiểu nghiệp vụ, bắt buộc, miền giá trị, phân loại dữ liệu (công khai / nội bộ / mật /
cá nhân), căn cứ, nguồn. Không ghi kiểu CSDL, độ dài, khóa vật lý.

**Đầu ra `erd-CN-xx-<slug>.md` (8 mục):** thông tin chung; sơ đồ Mermaid; danh sách thực thể; data dictionary;
danh mục giá trị; quan hệ; ma trận bước × thực thể (tạo, đọc, sửa, xóa); câu hỏi. Kèm dòng mới ở erd-overview,
glossary, sổ phát hiện.

**Hỏi BA:** biểu mẫu luật mâu thuẫn màn (chặn G2); bội số không nguồn (chặn nếu ảnh hưởng quy trình); trường thừa
(không chặn); phân loại không nguồn (không chặn); cần thêm thuộc tính cho ENT CN khác (ghi đề xuất).

**Quy tắc:** không định nghĩa lại ENT CN khác; ENT mới thêm dòng overview; mỗi thuộc tính có nguồn, căn cứ; không
chi tiết vật lý; tên theo glossary.

**Cổng máy:** đối tượng dữ liệu trong PROC đều là ENT; ENT sở hữu có data dictionary; trường trong
`man-presales.json` và biểu mẫu thành thuộc tính hoặc có lý do; thuộc tính có nguồn, căn cứ; ENT có vòng đời có
thuộc tính trạng thái; ma trận khớp bảng bước; `mmcheck`; ID trong dải. ENT không bước tạo → cảnh báo.

### Bước 7. Vòng đời → `4-state-machine` (có điều kiện)

**Khi nào chạy:** CN sở hữu ENT có vòng đời (đánh dấu ở erd-overview). Tiêu chí: có ít nhất một lần chuyển trạng
thái do người, thời hạn hoặc hệ thống kích hoạt, ngoài tạo và xóa. Không có → ghi "Không áp dụng" kèm lý do, G2 kiểm.

**Cách làm S1–S6:** S1 liệt kê trạng thái từ đầu ra PROC, luật, màn; S2 chuyển trạng thái với sự kiện kích hoạt cụ
thể (bước PROC, thời hạn kèm điều khoản, hệ thống); S3 trạng thái đầu, kết thúc, tới được, thoát được; S4 chuyển
trạng thái bị cấm; S5 thao tác theo trạng thái; S6 liên kết vòng đời với ENT khác.

**Đầu ra `ENT-xxx-<slug>.md` (8 mục):** thông tin chung; sơ đồ Mermaid; trạng thái; chuyển trạng thái; chuyển bị
cấm; thao tác theo trạng thái; liên kết vòng đời; câu hỏi. Điền miền giá trị thuộc tính trạng thái trong ERD.

Cần thêm bước vào PROC → sửa `2-business-process`, G1 mất hiệu lực, chạy lại G1.

**Hỏi BA:** luật khác presales về trạng thái (chặn G2); chuyển ngược không nguồn (chặn G2); trạng thái màn không bước
tạo (không chặn); thao tác theo trạng thái không nguồn (không chặn).

**Cổng máy:** trạng thái trong đầu ra PROC có trong vòng đời; TR trỏ bước PROC hoặc điều khoản thời hạn; tới được,
thoát được; miền giá trị khớp ERD; trạng thái trên MP có ST hoặc phát hiện; liên kết vòng đời bên kia có thật (thiếu
chiều ngược → cảnh báo); ma trận thao tác phủ mọi ST; "Không áp dụng" sai → lỗi.

### Bước 8. Use case → `5-actor-usecase`

**Mục đích:** chốt UC presales (quyết định, cờ phạm vi); viết UC chi tiết có tiêu chí nghiệm thu; đóng sổ phát hiện
của CN.

**Cách làm U1–U7:** U1 ranh giới UC (gom bước hệ thống liền nhau, cùng actor, cùng mục tiêu, một lượt làm việc; mỗi
bước hệ thống thuộc đúng một UC); U2 đối chiếu, quyết định; U3 viết UC (trigger, tiền điều kiện, luồng chính khớp
bước PROC, luồng thay thế, ngoại lệ, hậu điều kiện); U4 tiêu chí nghiệm thu; U5 gắn MP; U6 đóng sổ phát hiện;
U7 cập nhật `uc-overview.md`.

| Quyết định | Khi nào | Cờ phạm vi |
| --- | --- | --- |
| Giữ | 1 ↔ 1, khớp | trong báo giá |
| Làm rõ | 1 ↔ 1, bổ sung luồng, ngoại lệ, điều kiện | trong báo giá |
| Tách | 1 → nhiều | trong báo giá |
| Gộp | nhiều → 1 | trong báo giá |
| Mở rộng | Làm nhiều hơn mô tả presales | cần PM đánh giá |
| Bỏ | Không bước nào cần / trùng / ngoài phạm vi; không được Bỏ UC phục vụ REQ pháp lý | giảm phạm vi |
| Thêm mới | Bước hệ thống không có UC presales | phát sinh |

**Tiêu chí nghiệm thu:** dạng "Cho … — Khi … — Thì …"; bắt buộc phủ luồng chính, mỗi luồng thay thế, mỗi ngoại lệ,
mỗi chuyển trạng thái bị cấm liên quan, phân quyền. Kết quả đúng sai rõ ràng.

**UC trước rule:** UC ghi điều kiện dạng mô tả kèm nguồn, đánh dấu `{BR?}`; bước 9 điền mã BR. Còn `{BR?}` ở G2 → lỗi.

**Đầu ra:** `UC-xxx-<slug>.md` (thông tin chung kèm mã presales và quyết định; mô tả; trigger; tiền điều kiện; luồng
chính; luồng thay thế; ngoại lệ; hậu điều kiện; rule áp dụng; **tiêu chí nghiệm thu**; câu hỏi); dòng bảng chốt và
ma trận actor × UC trong `uc-overview.md` (nơi duy nhất ghi quyết định); dòng sổ phát hiện đóng.

**Hỏi BA:** quyết định Bỏ (chặn G2); Mở rộng, Thêm mới (không chặn, cờ đi tới PR, SRS); ranh giới UC không rõ (không
chặn).

**Cổng máy:** mỗi bước hệ thống thuộc đúng một UC; mỗi UC presales có quyết định; UC phục vụ REQ pháp lý không bị Bỏ;
UC có REQ, actor có thật; luồng chính trỏ bước có thật đúng thứ tự; mỗi TR trong hậu điều kiện của ít nhất một UC;
tiêu chí nghiệm thu đủ loại; dòng sổ phát hiện của CN đóng hoặc có Q; không từ mơ hồ.

### Bước 9. Business rule → `6-business-rules`

**Loại rule:** điều kiện; thời hạn (con số là tham số tách riêng); thẩm quyền; tính toán; suy diễn, phân loại (bảng
quyết định); kiểm dữ liệu liên trường. Ràng buộc một trường nằm ở ERD, không tạo BR.

**Cách làm R1–R6:** R1 thu thập ứng viên (`{BR?}`, gateway, điều kiện TR, điều khoản, công thức); R2 chung hay riêng
(đã có ở overview → dẫn; nên là chung → câu hỏi đề xuất, không tự thêm); R3 viết BR một ý, tham số tách riêng; R4
bảng quyết định; R5 điền mã BR vào UC, **không sửa PROC** (BR ghi "Áp dụng tại", script sinh chiều ngược, G1 không
mất hiệu lực); R6 ma trận phân quyền của CN.

**Đầu ra `rules-CN-xx-<slug>.md` (8 mục):** thông tin chung; rule chung áp dụng (dẫn); danh sách BR (BR, loại, phát
biểu, tham số, áp dụng tại, căn cứ, nguồn); bảng quyết định; công thức; ma trận phân quyền; tham số cần xác nhận;
câu hỏi.

**Hỏi BA:** luật khác presales về điều kiện, thẩm quyền (chặn G2); công thức không đủ nguồn (chặn G2); tham số con
số (chặn G4); rule nên chung (không chặn).

**Cổng máy:** không còn `{BR?}`; mỗi gateway có BR hoặc rule chung; điều kiện TR có BR; điều khoản thời hạn, điều
kiện, thẩm quyền có BR hoặc lý do; BR có nguồn, căn cứ, áp dụng tại trỏ ID có thật; bảng quyết định đủ tổ hợp; ma
trận phân quyền phủ mọi UC; không từ mơ hồ.

### G2. Đặc tả nghiệp vụ đầy đủ, khớp nhau

Phạm vi: bước 6–9 cùng dòng thêm vào overview, sổ phát hiện. Gom bốn layer vì chúng dẫn chéo nhau.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Cổng máy bước 6–9 đạt | Máy | Chặn |
| 2 | G1 còn hiệu lực | Máy | Chặn |
| 3 | Đối tượng dữ liệu trong PROC là ENT; ENT sở hữu có bước tạo | Máy | Chặn |
| 4 | Ma trận bước × thực thể khớp luồng UC | Agent nhất quán | Chặn |
| 5 | Mỗi bước hệ thống thuộc đúng một UC; luồng chính khớp thứ tự | Máy | Chặn |
| 6 | Mỗi TR có UC chứa trong hậu điều kiện; tiền điều kiện khớp trạng thái | Máy, agent nhất quán | Chặn |
| 7 | Gateway, điều kiện TR, `{BR?}` đều có BR | Máy | Chặn |
| 8 | Nội dung BR khớp điều kiện ở UC, PROC, TR | Agent nhất quán | Chặn |
| 9 | Mọi UC presales có quyết định; Bỏ đã được BA xác nhận; không Bỏ UC phục vụ REQ pháp lý | Máy | Chặn |
| 10 | Tách, Gộp, Mở rộng, Thêm mới có lý do đúng, cờ đúng | Agent presales | Chặn |
| 11 | Trường biểu mẫu luật đủ trong ERD; trạng thái pháp lý đủ | Agent pháp lý | Chặn |
| 12 | BR dẫn đúng điều khoản; thẩm quyền đúng luật | Agent pháp lý | Chặn |
| 13 | Tiêu chí nghiệm thu phủ đủ, kiểm chứng được | Máy, agent chất lượng | Chặn |
| 14 | UC, BR không mơ hồ, một ý | Agent chất lượng | Chặn |
| 15 | Không định nghĩa lại thứ của overview, CN khác | Máy, agent nhất quán | Chặn |
| 16 | Liên kết vòng đời khớp hai đầu | Máy | Chặn |
| 17 | Sổ phát hiện của CN đóng hoặc có Q | Máy | Chặn |
| 18 | Không còn Q mâu thuẫn nguồn `mở` chặn G2 | Máy | Chặn |
| 19 | Vòng đời "Không áp dụng" hợp lý | Agent nhất quán | Chặn |
| 20 | Phân loại dữ liệu có nguồn | Agent pháp lý | Nên sửa |
| 21 | Tham số `[CẦN XÁC NHẬN]` có trong mục 7 file rule | Máy | Nên sửa |
| 22 | Thuật ngữ đúng glossary | Máy | Nên sửa |

Đầu ra kèm danh sách tham số còn `[CẦN XÁC NHẬN]` để BA gửi khách chốt trong lúc làm tiếp.

### Bước 10. Prototype → `Prototype`

> **Đổi hướng (2026-10-25, chưa viết lại phần dưới):** presales bàn giao app React, không phải HTML tĩnh. Đầu ra bước
> 10 là **prototype React** dựng từ: design system của công ty (BA lead gửi, thay `ba-design-system` mẫu), nghiệp vụ
> đã qua G2, mã nguồn presales (`0-inputs/presales/prototype/ma-nguon/`). Cách làm P1–P7, đánh dấu `data-*` (gắn trong
> JSX, đọc từ DOM khi chạy) viết lại ở đợt 5. Xem mục 12, việc 13.

**Mục đích:** sửa prototype presales cho khớp nghiệp vụ đã qua G2; ghi rõ khác presales chỗ nào, vì sao; làm nền
cho `Screens`. Không dựng mới khi presales đã có màn.

**Cách làm P1–P7:** P1 sao chép trang presales của MP trong brief vào `3-ba-detail/Prototype/CN-xx-<slug>/`; P2 quyết định
MP → SCR (Giữ / Sửa / Tách / Gộp / Bỏ / Thêm mới, lý do dẫn ID), cấp mã SCR; P3 sửa theo nghiệp vụ (trường theo ERD,
nút theo trạng thái, điều hướng theo UC, thông báo theo BR, ẩn hiện theo quyền, công cụ chuyển vai trò); P4 thêm màn
mới; P5 áp khung chung, `menu.json`, `proto-menu`; P6 đánh dấu `data-*`; P7 bấm thử theo luồng bằng Playwright, ảnh
trước và sau.

**Đánh dấu trên trang:** góc trang SCR, UC; ô nhập `data-ent="ENT-xxx.thuoc_tinh"`; nút trạng thái
`data-tr="TR-xxx"`; thông báo `data-br="BR-xxx"`; phần theo quyền `data-act="ACT-xx"`.

**Đầu ra:** trang HTML, `menu.json`, `assets/`; `prototype-notes.md` (thông tin chung; bảng MP → SCR; thay đổi so
với presales kèm ảnh; màn mới; kết quả bấm thử; câu hỏi); sitemap, menu do script ghép.

**Hỏi BA:** thay đổi bố cục lớn (không chặn); bỏ màn mà UC vẫn giữ (không chặn); cần trường, nút ngoài nghiệp vụ →
không tự thêm, quay về layer nghiệp vụ hoặc hỏi (chặn G3). Khách góp ý: sau G3, đặt vào
`0-inputs/phan-hoi-prototype/`, chạy `--lop prototype`.

**Cổng máy:** `proto-check` đạt; MP có quyết định; UC có SCR, SCR có UC; `data-ent`, `data-tr`, `data-br` trỏ ID có
thật, nút chỉ hiện ở trạng thái được phép; luồng chính bấm thử đạt; `term-check` trên màn. Luồng thay thế gãy, thiếu
ảnh → cảnh báo.

### Bước 11. Đặc tả màn hình → `Screens`

**Cách làm M1–M6:** M1 script sinh khung từ `data-*`; M2 trường; M3 hành động; M4 kiểm tra dữ liệu, thông báo chính
xác; M5 danh sách, tra cứu; M6 điều hướng, màn rỗng, lỗi tải. Chỉ ghi phần khác SCR-000. Cần đổi màn → sửa prototype
trước, sinh lại khung.

**Đầu ra `SCR-xxx-<slug>.md` (10 mục):** thông tin chung (MP nguồn, quyết định, link, ảnh); mục đích; vào và ra;
trường; hành động; kiểm tra dữ liệu và thông báo; danh sách; hiển thị theo trạng thái và quyền; khác SCR-000; câu hỏi.

**Cổng máy:** SCR trên prototype ↔ file đặc tả; `data-ent` ↔ mục trường; `data-tr` ↔ mục hành động, khớp vòng
đời; `data-br` ↔ mục kiểm tra; BR kiểm dữ liệu của UC xuất hiện ở ít nhất một SCR; ma trận hiển thị khớp phân quyền.

### G3. Giao diện khớp nghiệp vụ

Phạm vi: bước 10, 11. Bỏ ngưỡng quét màn 95% của v1: nhờ `data-*`, đối chiếu màn ↔ nghiệp vụ máy kiểm 100%; agent
chỉ review phần máy không kiểm được.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Cổng máy bước 10, 11 đạt | Máy | Chặn |
| 2 | G1, G2 còn hiệu lực | Máy | Chặn |
| 3 | UC có SCR, SCR có UC, MP có quyết định | Máy | Chặn |
| 4 | Ô nhập, nút trạng thái, thông báo dẫn đúng ERD, TR, BR | Máy | Chặn |
| 5 | Bấm thử mọi luồng chính, luồng thay thế đạt | Máy | Chặn |
| 6 | Luồng bấm đúng thứ tự UC; ngoại lệ có xử lý | Agent nhất quán | Chặn |
| 7 | Ẩn hiện theo quyền khớp phân quyền | Máy, agent nhất quán | Chặn |
| 8 | Trường bắt buộc theo biểu mẫu luật có trên màn | Agent pháp lý | Chặn |
| 9 | Dữ liệu mật, cá nhân chỉ hiện cho actor được phép | Agent pháp lý | Chặn |
| 10 | Quyết định MP → SCR có lý do; thay đổi có ghi chép, ảnh | Agent presales | Chặn |
| 11 | Không trường, nút, thông báo ngoài nghiệp vụ đã qua G2 | Máy, agent nhất quán | Chặn |
| 12 | Đặc tả rõ, kiểm chứng được | Agent chất lượng | Chặn |
| 13 | Hành vi không nguồn có ASM | Agent chất lượng | Nên sửa |
| 14 | Tuân thủ SCR-000, design system | Máy, agent chất lượng | Nên sửa |
| 15 | Thuật ngữ đúng glossary | Máy | Nên sửa |

### Bước 12. SRS module → `SRS`

**Mục đích:** một tài liệu bàn giao duy nhất cho Dev, QC, khách ký; PM thấy chênh lệch phạm vi. Bản lắp ráp, dẫn
chiếu, không viết lại.

**Cách làm T1–T6:** T1 script sinh khung (chức năng theo UC, truy vết); T2 agent viết phần riêng (giới thiệu, yêu
cầu phi chức năng riêng, giao diện ngoài riêng, ràng buộc); T3 bảng chênh lệch phạm vi; T4 tiêu chí nghiệm thu tổng;
T5 tồn đọng; T6 xuất Word, PDF bằng `/ba-export --dong-goi` (không commit file xuất).

**Đầu ra `SRS/modules/CN-xx-<slug>.md` (13 mục):** giới thiệu; tổng quan chức năng; yêu cầu chức năng theo UC
(script); yêu cầu dữ liệu (script); quy tắc nghiệp vụ (script); giao diện người dùng (script); giao diện ngoài riêng;
yêu cầu phi chức năng riêng; ràng buộc; chênh lệch phạm vi so với presales; tiêu chí nghiệm thu; bảng truy vết
(script); giả định và tồn đọng. Thêm dòng module vào `srs.md` chung.

**Hỏi BA:** còn `[CẦN XÁC NHẬN]` (chặn G4); còn Q mở (chặn G4, hoặc tách phần đó ra khỏi CN); ASM còn lại (không
chặn, BA lead chấp nhận ở PR).

**Cổng máy:** mỗi UC có mục; mỗi REQ có trong truy vết; phần script sinh không bị sửa tay; mỗi hệ thống ngoài có mục
giao diện; bảng chênh lệch khớp uc-overview, prototype-notes; đủ heading. Chép nguyên văn dài → cảnh báo.

### G4. Sẵn sàng bàn giao

Phạm vi: toàn chức năng, đọc theo chiều dọc. Thêm reviewer thứ năm **"sẵn sàng bàn giao"**: đóng vai Dev, QC, liệt
kê mọi câu hỏi họ sẽ phải hỏi lại; câu hỏi chưa có trả lời trong spec là lỗi.

| # | Kiểm | Ai kiểm | Mức |
| --- | --- | --- | --- |
| 1 | Cổng máy bước 12 đạt | Máy | Chặn |
| 2 | G1, G2, G3 còn hiệu lực | Máy | Chặn |
| 3 | Không còn `[CẦN XÁC NHẬN]` trong phạm vi CN | Máy | Chặn |
| 4 | Không còn Q `mở` thuộc CN | Máy | Chặn |
| 5 | Truy vết hai chiều đủ, không ID mồ côi | Máy | Chặn |
| 6 | Mọi nghĩa vụ pháp lý đi trọn chuỗi tới UC và BR hoặc màn | Máy, agent pháp lý | Chặn |
| 7 | SRS không mâu thuẫn layer nguồn | Agent nhất quán | Chặn |
| 8 | Giao diện ngoài đủ: dữ liệu, chiều, thời điểm, xử lý lỗi | Agent chất lượng | Chặn |
| 9 | Yêu cầu phi chức năng riêng kiểm chứng được, có nguồn | Agent chất lượng | Chặn |
| 10 | Bảng chênh lệch phạm vi đầy đủ, đúng | Máy, agent presales | Chặn |
| 11 | Reviewer sẵn sàng bàn giao không còn câu hỏi chưa có trả lời | Agent sẵn sàng bàn giao | Chặn |
| 12 | ASM còn lại liệt kê đủ | Máy | Chặn |
| 13 | CN phụ thuộc đã merge | Máy | Chặn `/ba-pr`, không chặn G4 |
| 14 | Xuất Word, PDF thành công | Máy | Nên sửa |

### Bước 13. PR và merge — `/ba-pr CN-xx`

**Điều kiện:** G4 Đạt, còn hiệu lực; CN phụ thuộc đã merge.

**Thao tác:** cập nhật nhánh từ main; script gộp xung đột ở file chỉ thêm dòng (overview, glossary, sổ phát hiện,
danh mục module); chạy lại cổng máy toàn repo, ghép bản tổng traceability và open-questions; lỗi do thay đổi từ main →
dừng, báo layer và gate cần chạy lại; soạn mô tả PR; push, mở PR, gắn BA lead, Dev lead, QC lead.

**Mô tả PR (8 mục):** tóm tắt chức năng; kết quả 4 gate; chênh lệch phạm vi; giả định còn lại cần BA lead chấp nhận;
tham số đã chốt; câu hỏi của reviewer sẵn sàng bàn giao đã trả lời; tiêu chí nghiệm thu; chi phí (token, thời gian).

**Sau khi mở PR:** cả ba duyệt → BA lead merge → `/ba-next --sync` chuyển ID sang `approved`. Có yêu cầu sửa → sửa
trên nhánh, gate liên quan mất hiệu lực, `/ba-chuc-nang CN-xx --tiep`, PR tự cập nhật. Thay đổi sau merge → `/ba-cr`.

---

## 7. Cơ chế gate (chung cho G0–G4)

```
layer cuối của gate xong
  → cổng máy (ba-verify + map-check + gate-check)        còn LỖI → agent viết sửa, chạy lại
  → 4 agent review độc lập, song song (G4: 5)
      chất lượng · nhất quán · pháp lý · presales · (G4) sẵn sàng bàn giao
  → kết luận theo tiêu chí cứng: còn lỗi Chặn = KHÔNG ĐẠT
      Đạt        → commit hồ sơ gate, mở khóa bước sau
      Không đạt  → agent sửa (phiên mới) → review lại, tối đa 2 vòng
                   hết 2 vòng → dừng, chuyển BA danh sách lỗi còn lại
```

| Mặt | Quy định |
| --- | --- |
| Người quyết | Agent, theo checklist gate và checklist 29148. Không có "đạt có điều kiện" |
| Phiên | Người viết, người review, người sửa là ba phiên khác nhau |
| Vòng sửa | Tối đa 2 |
| Hồ sơ | `du-an/G0.md`, `chuc-nang/CN-xx/Gx.md`: commit đã kiểm, kết quả máy, báo cáo từng reviewer, lỗi theo mức, số vòng sửa, câu hỏi cho BA, kết luận, token và thời gian |
| Khóa | Lệnh của bước sau đọc hồ sơ gate trước; chưa có hoặc không Đạt → dừng |
| Mất hiệu lực | Commit sửa layer đã qua gate → gate đó và các gate sau mất hiệu lực (`gate-check` so commit trong hồ sơ) |
| Người | Không đọc từng gate. BA lead, Dev lead, QC lead đọc một lần ở PR cuối |

**Hỏi BA — mức chặn thống nhất:**

| Loại vướng | Chặn ở |
| --- | --- |
| Mâu thuẫn nguồn | Gate của bước đó |
| Quyết định Bỏ UC presales | G2 |
| Con số thiếu nguồn (`[CẦN XÁC NHẬN]`, tham số) | Chỉ G4 |
| Câu hỏi phạm vi (phát sinh, mở rộng, bước thủ công lên hệ thống) | Không chặn; cờ đi tới PR, SRS |
| Hết vòng sửa | Dừng tại gate |

`--ngu`: câu hỏi không chặn thì chọn tạm và ghi sổ; câu hỏi chặn thì dừng.

**Cách làm (đợt 2, 2026-10-26):** skill `ba-gate` điều phối; `kit/tools/ba-verify/gate-check.mjs` làm phần máy; hồ sơ theo
`kit/templates/ho-so/gate.md`; checklist `checklist-G0…G4.md` cộng `checklist-chung.md` (luật CLAUDE.md, quy trình gate).
- Phạm vi gate chức năng chỉ gồm **file của chức năng** (cột `file` trong trace.csv của chức năng, file có mã CN trong
  đường dẫn, file nhánh đã đổi so với main), để chức năng khác merge vào main không làm mất hiệu lực gate của mình.
- Trên nhánh chức năng, G0 chỉ kiểm hồ sơ ĐẠT; mất hiệu lực của G0 kiểm ở nhánh dự án.
- Gộp kết quả reviewer: cùng lỗi khác mức → mức cao hơn; lỗi Chặn không có vị trí, bằng chứng → hạ "Nên sửa".
- Vòng review sau: phiên mới cho chế độ còn lỗi, cộng chế độ nhất quán; reviewer kết luận từng lỗi vòng trước.
- Dòng "Máy" của checklist chưa có script (map-check, proto-check… viết cùng các bước) do reviewer chấm thay;
  `gate-check --may` liệt kê.

---

## 8. Vận hành

### 8.1 Nhánh, commit, trạng thái

| Mặt | Quy định |
| --- | --- |
| Nhánh | `du-an/khung` (tầng dự án), `chuc-nang/CN-xx-<slug>` (mỗi chức năng) |
| Commit | Mỗi layer một hoặc vài commit: `spec(CN-xx/<layer>): …`, `spec(du-an/<phần>): …` |
| PR | Một cho tầng dự án (sau G0), một cho mỗi chức năng (sau G4) |
| Trạng thái ID | `draft` → `dat-G1` … `dat-G4` trên nhánh → `approved` khi merge |
| Sửa layer trước | Được, trên cùng nhánh; gate liên quan mất hiệu lực và chạy lại. Không còn PR "sửa bước trước" |
| Song song | Nhiều chức năng trên nhánh riêng; phụ thuộc chưa merge thì dẫn ID kèm cờ "chờ CN-yy" |

### 8.2 ID

| Thay đổi | Chi tiết |
| --- | --- |
| Giữ | REQ, PROC, PROC-xx.yy, ENT, ST, TR, ACT, UC, BR, SCR, Q, ASM, CR |
| Thêm | `CN-xx` (chức năng), `MP-xxx` (màn presales), `PH-xxx` (phát hiện), mã điều khoản tự nhiên |
| Bỏ | NV, FEAT, US, KB, DEC, STK |
| Cấp số | Dải ID cấp sẵn cho mỗi CN ở G0, ghi trong `danh-muc-chuc-nang.md`; không mã giữ chỗ, không đánh số lại |
| Mã gốc presales | Giữ nguyên văn; không dùng làm ID kit; ghi `PS:<mã>` ở cột nguồn; mã điều khoản ghi `PL:<mã>` |
| Liên kết | Cột `lien_ket` ghi một chiều; script tính chiều ngược |

### 8.3 Sổ dùng chung

| Sổ | Cách giữ |
| --- | --- |
| traceability, open-questions | Tách theo chức năng (`chuc-nang/CN-xx/`) và dự án (`du-an/`); script ghép bản tổng |
| Overview, glossary, phát hiện (open-questions mục 3), danh mục module SRS | Chức năng chỉ **thêm dòng**; `/ba-pr` gộp xung đột bằng script |
| Quyết định chốt UC | Chỉ ở `uc-overview.md` |
| Quyết định của BA, PM, khách | Dòng `đã quyết` trong open-questions |

### 8.4 Skill và agent

- **Skill lệnh** (BA gõ hoặc lệnh điều phối gọi; chạy ở phiên chính): `SKILL.md` điều phối, `method.md` cách làm,
  `checklist.md` tự kiểm.
- **Skill tri thức** (nạp sẵn vào agent, khai báo `skills:` trong file agent): `ba-agent-protocol`, `ba-standards`,
  `ba-notation`, `ba-bpmn`, `ba-design-system`, `ba-questioning`; thêm `ba-gate` cho `quality-reviewer`.
- Phiên chính điều phối, không tự viết tài liệu (trừ brief ở bước 3).
- Phương pháp quy trình ở một chỗ: `ba-process/method.md` có hai phần "Cấp tổng" (dùng cho phần 2 `/ba-overview`,
  gồm cả gom CN) và "Cấp chi tiết" (D1–D6, bước 5). `ba-overview` trỏ sang phần cấp tổng, không chép lại; lệnh vẫn
  tách (phần 2 do `/ba-overview` gọi, bước 5 do `/ba-chuc-nang` gọi). Lý do: quy tắc chuyển giao, đặt tên PROC, khớp
  hai cấp phải giống hệt ở hai tầng.

| Agent | Skill tri thức | Làm cho |
| --- | --- | --- |
| `business-analyst` (từ `process-modeler` của kit v1) | protocol, standards, notation, bpmn | `ba-brd`, `ba-process`; phần 1–2 overview |
| `data-modeler` | protocol, standards, notation | `ba-erd`, `ba-state`; phần 3 overview |
| `usecase-analyst` | protocol, standards, notation | `ba-usecase`, `ba-rules`; phần 4–5 overview |
| `ux-spec-designer` | protocol, standards, notation, design-system | `ba-prototype`, `ba-screens`; phần 6–7 overview; Playwright ở bước 1 |
| `srs-writer` | protocol, standards, notation | `ba-srs`; phần 8 overview |
| `quality-reviewer` | protocol, standards, notation, gate | `ba-gate`: chế độ chất lượng, nhất quán, pháp lý, presales, sẵn sàng bàn giao |

Tầng chức năng chạy nối tiếp; reviewer ở mỗi gate chạy song song. Hai agent không sửa cùng file; tối đa 5 agent cùng
lúc.

---

## 9. So với kit v1

| Mặt | Kit v1 | Kit v2 |
| --- | --- | --- |
| Mục tiêu | Spec cả dự án | Chi tiết từng chức năng |
| Đầu vào | Biên bản, RFP, hợp đồng; UC presales là mốc | UC presales, prototype presales, văn bản pháp luật |
| Chế độ đầu vào | `chua-co-gi` / `presales` | Một chế độ |
| Đơn vị | Bước × NV, làm ngang | CN, làm dọc qua 9 layer |
| Lệnh | ~30, BA gõ từng lệnh | 4 lệnh chính, điều phối tự động |
| PR | Mỗi bước một PR | Một PR mỗi chức năng |
| Cổng | Bước trước approved (mềm) | Gate cứng do agent, có khóa và mất hiệu lực |
| Review | 1 reviewer mỗi bước, người approve | 4–5 reviewer mỗi gate, người đọc một lần |
| Quét màn | ≥95%, đọc bằng mắt | 100% bằng máy nhờ `data-*` |
| Hỏi BA | Hai lần mỗi bước, phản biện 12 câu | Chỉ khi agent không được tự quyết, có mức chặn |
| Hồ sơ dự án | charter, stakeholders, ba-plan, decisions, glossary | glossary; decisions gộp open-questions |
| Danh mục đầu vào | baseline (UC presales + sổ phát hiện) | 3 danh mục có mã + sổ phát hiện |
| ID song song | Mã giữ chỗ, đánh số lại | Dải ID cấp sẵn |
| Sổ dùng chung | Một file, xung đột liên tục | Tách theo chức năng, script ghép |
| Kiểm thử | Layer 12-test (KB, UAT, e2e) | Tiêu chí nghiệm thu trong UC |

**Giữ nguyên:** luật nguồn, `[ASM]`, `[CẦN XÁC NHẬN]`, không chọn hộ; overview trước, chi tiết sau; mã gốc presales
nguyên văn, bảng quyết định chốt UC, cờ phạm vi; `ba-bpmn`, `ba-verify`; checklist 29148, 3 mức lỗi; ba phiên viết,
review, sửa; tối đa 2 vòng sửa; một prototype chung, menu ghép bằng script.

## 10. Thành phần cần xây

| Loại | Giữ nguyên | Sửa | Mới | Chuyển vào lưu trữ |
| --- | --- | --- | --- | --- |
| Skill | `ba-bpmn`, `ba-notation`, `ba-questioning`, `ba-export`, `ba-design-system`, `ba-diagram` | `ba-init`, `ba-brd`, `ba-process`, `ba-erd`, `ba-state`, `ba-usecase`, `ba-rules`, `ba-prototype`, `ba-screens`, `ba-srs`, `ba-next`, `ba-agent-protocol`, `ba-standards` | `ba-overview`, `ba-chuc-nang`, `ba-gate` (5 checklist), `ba-pr` | `ba-elicit`, `ba-brainstorm`, `ba-refine`, `ba-wireframe`, `ba-story`, `ba-guide`, `ba-training`, `ba-handover`, `ba-uat`, `ba-e2e` |
| Agent | `data-modeler`, `usecase-analyst`, `ux-spec-designer`, `srs-writer` | `quality-reviewer` (5 chế độ), `process-modeler` → phân tích nghiệp vụ | — | `elicitation-analyst`, `guide-producer`, `handover-writer`, `qa-designer` |
| Template | ~16 | ~6 | `man-presales`, `phap-ly`, `ma-tran-uc-proc`, `danh-muc-chuc-nang`, `brief-chuc-nang`, `mapping`, `so-phat-hien`, `gate` | `charter`, `stakeholders`, `ba-plan`, `decisions`, `feature-map`, `refined-requirements`, `meeting-notes`, `user-story`, `kich-ban`, `uat`, `user-guide`, `training`, `handover`, `wireframe-notes` |
| Script | `office.cjs`, `mmcheck`, `term-check`, `proto-menu`, `bpmn_lint`, `ba-export` | `trace-check`, `proto-check` (`data-*`) | `map-check`, `gate-check`, sinh khung SCR, sinh SRS, gộp xung đột, ghép bản tổng, bấm thử theo luồng | `scan-ratio` |
| Standards | `requirement-quality`, `notation`, `writing-style` | `id-convention`, `git-flow`, CLAUDE.md (luật 4, 5; bỏ dòng đọc charter) | `gate-procedure` (thay `step-procedure`) | — |

Mỗi bước có đủ bộ bốn: skill (`SKILL.md`, `method.md`) + checklist bước + template + ví dụ. Mỗi gate có checklist gate;
hồ sơ gate dùng chung `kit/templates/ho-so/gate.md`. Ví dụ lấy từ chức năng PM9 chạy thử, ẩn bớt dữ liệu.

## 11. Lộ trình xây và làm thử

| Đợt | Việc | Kết quả |
| --- | --- | --- |
| 1 | Duyệt tài liệu này; chốt việc còn mở nhóm B | Bản thiết kế chốt |
| 2 | Cơ chế gate (`ba-gate`, `gate-check`, template gate, checklist chung, reviewer 5 chế độ). `map-check` dời sang đợt 3 (cần đầu ra bước 2) | Chạy được cơ chế gate — **xong 2026-10-26** |
| 3 | `/ba-init`, `/ba-overview`, G0 (phần 2: `ba-process/method.md` cấp tổng, port kit v1) → chạy trên một phân hệ PM9 → sửa | Tầng dự án chạy được — **đã viết 2026-10-26** (SKILL, method, checklist, 11 template, `map-check`); chờ chạy thử PM9 |
| 4 | `/ba-chuc-nang` bước 3–5 (bước 5: `ba-process` cấp chi tiết, port kit v1 + D2, D4, D6, script mapping), G1 → chạy một chức năng PM9 (gợi ý: lập, ký, phát hành biên bản, PROC-11), so với PROC PM9 đã review | G1 chạy được — **đã viết 2026-10-26** (`ba-chuc-nang`, `ba-brd`, `ba-process` bước 5, `mapping.mjs`); chưa chạy thử |
| 5 | Bước 6–12, G2–G4, `/ba-pr` → chạy hết chức năng thử | Cả chuỗi chạy được — **đã viết 2026-10-26** trừ bước 10 `ba-prototype` (chờ design system, việc mở 13) và `ba-usecase` (phiên khác); thêm `ba-export`, `ba-cr`, `ba-diagram`, `ba-next`; chưa chạy thử |
| 6 | Đo token, thời gian, vòng sửa, lỗi gate bỏ sót; viết lại ca thử `evals/`; xử lý nhóm C | Gắn tag `kit-v2.0.0` |

Không viết hết rồi mới chạy: mỗi đợt chạy thử ngay, sửa rồi mới sang đợt sau.

## 12. Việc còn mở

**Nhóm B — cơ chế chung (chốt trước đợt 2):**
1. Template hồ sơ gate chi tiết; cách `gate-check` phát hiện mất hiệu lực. *Chốt 2026-10-26:* hồ sơ gate ghi mã
   commit đã kiểm; `gate-check` so các thay đổi từ commit đó trong thư mục layer thuộc phạm vi gate. Template viết ở
   đợt 2.
2. Cách 4–5 reviewer chạy song song và gộp kết quả. *Chốt 2026-10-26:* hai reviewer xếp cùng một lỗi khác mức → lấy
   mức cao hơn.
3. Hàng chờ câu hỏi BA. *Chốt 2026-10-26:* dùng chính `open-questions.md` (tầng dự án, chức năng); `--tiep` đọc dòng
   `đã quyết`; câu chặn chưa trả lời → dừng ở gate của nó, câu không chặn → chạy tiếp.
4. Định dạng ID và dải. *Chốt 2026-10-26:* 3 chữ số; mỗi CN một dải 50 số cho mỗi loại ID (CN-01: 001–050, CN-02:
   051–100…); phần cuối dải của dự án để dự phòng.
5. `id-convention`, `traceability` (cột MP, điều khoản, gate), CLAUDE.md, `git-flow`, `/ba-next` bản v2.

**Nhóm C — tình huống vận hành:**
6. Presales hoặc luật đổi sau khi đã làm vài chức năng: tìm chức năng bị ảnh hưởng, mở lại gate. *(cần trước khi áp
   cho cả công ty)*
7. Nhiều BA làm song song: xung đột ở overview, glossary, sổ phát hiện. *(cần trước khi áp cho cả công ty)*
8. Change request sau merge: đưa `ba-cr`, `ba-impact` vào v2. *Xong 2026-10-26:* `ba-cr` 1.0.0 (gộp `ba-impact`); còn: `/ba-pr` nhận loại PR cho CR.
9. Chi phí: đo token, thời gian theo bước, gate.
10. Chuyển PM9 sang v2: dữ liệu hiện có dùng làm thử thế nào.
11. Ca thử `evals/` cho skill mới.
12. Design system thật của công ty thay bản mẫu.
13. Bước 10, 11 theo prototype React: dựng app từ design system + nghiệp vụ + mã nguồn presales; cách build, chạy,
    bấm thử; `data-*` trong JSX; `proto-check` đọc DOM khi chạy. *(cần trước đợt 5; chờ BA lead gửi design system)*
14. Dải ID của CN chồng số tầng dự án: tầng dự án cấp tuần tự từ 001 (PH, Q, ASM, ENT, ACT, BR chung, REQ loại B),
    kit/standards/id-convention.md lại ghi CN-01 dùng 001–050. Phương án: A — tầng dự án dùng một dải riêng (vd 001–100),
    CN bắt đầu sau; B — dải CN cấp sau khi xong bước 2, bắt đầu sau số lớn nhất tầng dự án đã dùng. `map-check` tạm
    cảnh báo khi chồng. *(cần trước khi chạy thử đợt 3; BA lead sửa standards)*
15. Điểm nhỏ của đợt 3 cần BA lead xác nhận: khung phân quyền ở bước 2 có ô `?` (chưa có nguồn, kèm Q); ENT hai CN
    cùng tạo → CN có PROC tạo đầu tiên trong chuỗi; UC presales ngoài phạm vi, trùng chốt ở đâu (BA ở G0 hay bước 8);
    nghĩa vụ pháp lý ở BRD overview chưa có ID riêng.
16. Tiền tố ID mới phát sinh khi port đợt 4–5, chưa có trong kit/standards/id-convention.md: `TB-<số SCR>-<số>` (thông
    báo, SCR-000 dùng `TB-000-xx`), `NT-xx` (tiêu chí nghiệm thu đầu–cuối trong SRS module). *(BA lead sửa standards)*
17. Điểm nhỏ đợt 4–5 cần BA lead xác nhận: BRD chức năng thêm mục 4.3 "Nguồn không thành REQ"; điều khoản loại biểu
    mẫu, chế tài, đối tượng không bắt buộc có REQ; tên 6 loại rule giữ theo v1 (ràng buộc, phân quyền…) thêm "kiểm liên
    trường"; vòng đời: chức năng không có ENT vòng đời ghi "không áp dụng" ở ERD mục 1; `/ba-chuc-nang` dừng trước
    bước 10 tới khi `ba-prototype` xong; `/ba-pr` cập nhật bằng `git merge main` (không rebase, giữ commit trong hồ sơ
    gate).
18. Script còn thiếu. *Xong 2026-10-26:* cổng máy bước 3 (`brief-check`), 4 (`brd-check`), 6 (`erd-check`), 7
    (`state-check`), 9 (`rules-check`), 12 (`srs-lap-rap`); ghép bản tổng (`ghep-tong`); gộp xung đột file chỉ thêm
    dòng (`gop-xung-dot`). Còn: sinh khung SCR từ `data-*` (sau bước 10); kiểm bảng quyết định đủ tổ hợp; ca thử
    `evals/` cho mọi skill mới.
19. Rà soát chuẩn 2026-10-26 — cần BA lead quyết hoặc tự sửa (thư mục khóa ghi):
    - `kit/standards/notation.md` còn theo kit v1 (bước 02–09, nhóm NV, Mermaid cho quy trình, `mmdc`): thay bằng bảng công
      cụ theo layer của `ba-notation`; thêm quy ước vòng đời `--> [*]`, nhãn `[điều kiện]`.
    - `kit/standards/requirement-quality.md`: thêm đặc tính "appropriate" và 5 đặc tính của bộ yêu cầu (29148 5.2.6).
    - Ba giá trị đặc biệt vào `kit/standards/writing-style.md`; CLAUDE.md luật 1 ghi ID kit, `PS:`, `PL:`, `MP-` cũng là
      nguồn hợp lệ.
    - `kit/standards/id-convention.md`: tiền tố `TB-`, `NT-` (việc 16); REQ loại `T` (chuyển đổi) hay không cấp ID;
      dải ID theo phương án A (tầng dự án số nhỏ, CN-01 dải 101–150 — bộ ví dụ đã dùng) (việc 14).
    - `kit/standards/gate-procedure.md`: thêm "gate chấm cùng checklist bước"; thống nhất mức "Chặn" / "Chặn merge".
    - Quyết định nghiệp vụ: `chung-18` (dùng sai `n/a`) mức Chặn cho mọi tài liệu; mức WCAG mục tiêu (A / AA); dòng
      "Tần suất, khối lượng" bắt buộc ở UC có danh sách; mức thực thi mặc định `chặn` khi luật dùng "phải / không
      được"; phân loại dữ liệu cá nhân cần văn bản bảo vệ dữ liệu cá nhân trong `0-inputs/phap-ly/`; thay MoSCoW bằng cột
      Căn cứ (ba-brd method mục 9).

20. Chuẩn hóa bước 1 (2026-10-26, nhánh `kit/ba-init-chuan`, ba-init 5.0.0). BA lead chốt: thêm quy trình presales
    vào đầu vào và đầu ra; ma trận UC presales × điều khoản ở file riêng; gộp sổ phát hiện vào open-questions dạng mục
    riêng (giữ mã PH); **chỉ sửa trọn bước 1** để mang sang kit khác — các bước sau của kit này chưa theo kịp.
    - Quy chuẩn (thư mục khóa ghi, BA lead tự sửa) — *xong 2026-10-26, commit fa178b7*:
      - `kit/standards/id-convention.md` bảng đầu: thêm dòng `| QP-xx, QP-xx.yy | Quy trình presales, bước trong quy trình
        presales (chép từ sơ đồ presales, không phải PROC) | 1-ba-init/0-dau-vao/quy-trinh-presales.md |`; dòng PH-xxx đổi nơi
        định nghĩa thành `du-an/open-questions.md mục 3` và nội dung "khoảng trống, chỗ lệch so với presales, pháp luật".
        Mục "trace.csv": thêm "bước PROC-xx.yy, QP-xx.yy không có dòng riêng, tính theo dòng quy trình cha".
      - `kit/standards/gate-procedure.md` dòng 14, 27: "glossary, open-questions, sổ phát hiện" → "glossary, open-questions
        (cả phát hiện)". Mục 5 (chặn gate): thêm "UC presales chưa tìm thấy căn cứ pháp lý → G1".
      - `kit/standards/requirement-quality.md` dòng 26: "mỗi dòng sổ phát hiện" → "mỗi phát hiện (open-questions mục 3)".
    - Các bước sau còn trỏ `1-ba-init/0-dau-vao/so-phat-hien.md` (sửa khi làm lại từng bước hoặc ở kit đích):
      - Script: `gate-check.mjs` dòng 209 (PH của CN còn mở phải có Q), `erd-check.mjs` dòng 153, `gop-xung-dot.mjs`
        dòng 24 (danh sách file chỉ thêm dòng: thay bằng `du-an/open-questions.md`).
      - Skill, agent: ba-agent-protocol, ba-overview (SKILL, method, checklist), ba-chuc-nang (SKILL, khoi-dong), ba-brd,
        ba-process, ba-erd, ba-state, ba-usecase, ba-rules, ba-screens, ba-srs, ba-cr, ba-gate (SKILL, checklist-G0,
        G2), ba-next, ba-pr; agent quality-reviewer, usecase-analyst.
      - Template: 2-business-process (business-process, mapping, process-overview), 3-erd/erd-chuc-nang,
        6-business-rules/rules-chuc-nang, ho-so (brief-chuc-nang, change-request, examples/G0-vi-du-nghi-phep).
    - Bước 2 nên dùng đầu ra mới: bản đồ PROC dựng từ `quy-trinh-presales.md` (QP tổng ↔ PROC, QP chi tiết ↔ bước),
      ma trận UC × PROC đối chiếu mapping UC của QP; BRD chức năng (bước 4) và business rule (bước 9) dẫn
      `uc-phap-ly.md` và cột "Hướng BR" thay vì tự dò lại điều khoản.

---

## Phụ lục. Nhật ký quyết định (2026-10-25)

| # | Quyết định |
| --- | --- |
| 1 | Viết lại kit (không chỉ sửa dự án PM9); phạm vi: làm chi tiết từng chức năng |
| 2 | Đầu vào: UC presales, prototype presales, văn bản pháp luật; hướng dựng ngược. Prototype thường là app React (link, bản build, mã nguồn), HTML tĩnh vẫn nhận |
| 3 | Giữ đúng 9 business layer; phân loại lõi / gọn / có điều kiện / cặp như mục 4.3 |
| 4 | Không merge, PR sau mỗi bước hay gate; một nhánh mỗi chức năng; một PR khi xong |
| 5 | Gate do agent review quyết; người chỉ đọc ở PR cuối (BA lead, Dev lead, QC lead) |
| 6 | Chức năng = 1 nhóm UC ↔ 1–3 PROC |
| 7 | Không có layer kiểm thử; tiêu chí nghiệm thu nằm trong UC, SRS |
| 8 | Bỏ charter, stakeholders, ba-plan; giữ glossary; decisions gộp vào open-questions |
| 9 | Mã điều khoản tự nhiên định dạng cố định; màn presales cấp `MP-xxx`; duyệt prototype bằng Playwright, chụp ảnh |
| 10 | Một lệnh điều phối cho mỗi tầng: `/ba-overview`, `/ba-chuc-nang` |
| 11 | Tối đa 2 vòng sửa mỗi gate; mã `CN-xx`; traceability, open-questions tách theo chức năng |
| 12 | Gọi business layer bằng tên thư mục, không gọi "lớp 1, lớp 3" |
| 13 | Dải ID cấp ở G0; thư mục hồ sơ `du-an/`, `chuc-nang/CN-xx/` |
| 14 | REQ phân theo căn cứ (pháp lý / presales / phát sinh) thay MoSCoW |
| 15 | Mapping do script sinh từ bảng bước; chỉ viết tay mục "Không gắn bước" |
| 16 | `man-presales.json` lưu trường có cấu trúc; quyết định chốt UC chỉ ở `uc-overview.md` |
| 17 | UC dùng `{BR?}`, bước 9 điền mã BR; BR không sửa PROC |
| 18 | Mâu thuẫn nguồn chặn gate của bước; con số thiếu nguồn chỉ chặn G4 |
| 19 | Prototype đánh dấu `data-*`; bỏ ngưỡng quét màn 95% |
| 20 | G4 thêm reviewer "sẵn sàng bàn giao" |
| 21 | Không chèn bước refine, brainstorm giữa `/ba-init` và `/ba-overview`; gom UC presales thành nhóm là phần 2 của `/ba-overview` |
| 22 | Prototype presales dạng app: duyệt `dist/` (ưu tiên) hoặc link, đọc route trong mã nguồn, không chạy mã nguồn; MP theo (route, cách mở). Bước 10 ra prototype React từ design system công ty + nghiệp vụ + mã nguồn presales |
| 23 | Hai reviewer khác mức → lấy mức cao hơn; ID 3 chữ số, dải 50 mỗi CN; hàng chờ câu hỏi là `open-questions.md`; mất hiệu lực gate so theo mã commit trong hồ sơ |
| 24 | (2026-10-26) Quy trình và gom CN port từ kit v1 (`ba-process` method, checklist; `ba-refine` mục 5.2, 5a), không viết lại; bỏ tầng FEAT và luồng phiên của `ba-refine`; phần 2 overview dựng bản đồ PROC trước rồi cắt CN; 7 PROC PM9 làm ca thử |
| 25 | (2026-10-26) Overview = quy trình tổng cấp 0, 1; bước 5 = chi tiết cấp 2, 3. Phương pháp quy trình một chỗ (`ba-process/method.md`, phần cấp tổng và cấp chi tiết); lệnh vẫn tách |
| 26 | (2026-10-26) Port `ba-process` theo bảng phân loại (phụ lục dưới): chi tiết không đổi trigger, kết quả, actor, cách chia CN của overview, chỉ thêm; chuyển giao với CN chưa làm chỉ điền dòng overview, với CN đã có file thì ghi câu hỏi; căn cứ của bước là REQ, UC presales hoặc điều khoản (không bắt buộc REQ) |
| 27 | (2026-10-26) Đợt 3: phần 6 của `/ba-overview` làm bản tối thiểu (sitemap, menu theo CN); `_khung/`, `index.html`, `prototype-notes` dời bước 10 khi có design system; G0 dòng 16 sửa theo. SCR-000 có template riêng `Screens/scr-000.md`. `uc-overview.md` thêm mục 4 ma trận actor × CN (bước 2) |
| 28 | (2026-10-26) Đợt 4–5 port từ kit v1 theo cùng cách với `ba-process` (giữ cách viết, sửa luật overview↔chức năng, viết mới phần dựng ngược), không chạy thử trước khi viết xong cả chuỗi (BA lead) |
| 29 | (2026-10-26) Bổ sung theo quy trình DoR của BA lead: G4 thêm nhóm C (C1–C4, agent trả JSON, script tính đạt); góc review qc, dữ liệu, ngoại lệ; ma trận CRUD × vai trò, kiểm dữ liệu nhập (ERD mục 9, 10), lời gọi hệ thống ngoài (PROC mục 9) trước bước 10; rủi ro trong câu hỏi, giả định, BRD; chỉ số theo dõi. Giữ khác biệt có chủ đích: 5 gate rải dọc (không một cổng DoR cuối), prototype trước SRS, nhóm A bằng script |
| 30 | (2026-10-27, BA dự án PM9) Dựng ngược UC presales → quy trình là đầu ra của `/ba-init` (ba-init 5.1.0, đợt 4, việc A5, method.md mục 7): thư mục `1-ba-init/0-dau-vao/ban-do-quy-trinh/` (md + BPMN cấp 0, 1); gom UC theo thủ tục, đối tượng; ghép luồng với 4 câu ở mỗi chỗ nối; đối chiếu hai chiều UC ↔ QT (port `ba-process` v1 mục 1, 1b, 11 và `ba-refine` 5a). BA chốt danh sách QT ở bước 1 (chặn). `/ba-overview` đợt 3 chỉ chi tiết hóa, giữ mã; đổi danh sách QT qua `/ba-init --bo-sung`. Thay một phần quyết định 21, 24 (bản đồ PROC không còn ở phần 2 overview); cắt CN (`ba-refine` 5.2) vẫn ở `/ba-overview`, chưa có bước. Lý do: PM9 presales không có quy trình (Q-022), cần bản đồ sớm. Mã `QT-nn` (theo template `QT_` của overview), không `PROC-xx`. **Chờ BA lead** (kit/standards khóa sửa): thêm dòng `QT-nn` vào id-convention.md bảng tiền tố và mục "trace.csv"; quyết định giữ hay bỏ `PROC-xx`. Công cụ đã nhận QT (lib.mjs `TIEN_TO`, trace-check, dau-vao-check `--chi ban-do`, check-all lint bản đồ) |
| 31 | (2026-10-27, BA dự án PM9) Nối overview → detail cho PM9: (a) **CN = một module WBS** của use_case_list lớp 5; danh mục `2-ba-overview/5-actor-usecase/danh-muc-chuc-nang.md` lập ở `/ba-overview` đợt 5b `cat-cn` (BA chốt, chặn); dải ID CN-01 101–150, CN-02 151–200… (Q, ASM, PH, SCR). (b) **Gate PM9:** G0 tầng dự án (bước 1, sáu lớp, điền ngược, danh mục CN); G1 UC chi tiết của CN; G2 prototype + đặc tả màn; G3, G4 để dành SRS. Skill `ba-gate` 0.1.0 và agent `quality-reviewer` 0.1.0 port từ ba-kit 1.2.0 (bỏ nhóm C, ban-giao); `gate-check.mjs` PHAM_VI theo PM9, phạm vi gate CN bỏ sổ, trace, hồ sơ của CN. (c) **Lệnh mới `/ba-detail CN-xx`** 0.1.0: UC (create-uc) → G1 → prototype (app chung nhân bản Design System PM2, màu #12A594, trang `src/pages/CN-xx/`) → đặc tả màn → G2. Thay `/ba-chuc-nang` của ba-kit cho PM9. **Chờ BA lead:** sửa `kit/standards/id-convention.md` (dải CN, CN = module, đường dẫn danh mục), `gate-procedure.md` (bảng lệnh, gate PM9); chưa có `/ba-pr` (PR mở tay); giả định tầng CN dùng ASM trong dải thay GD-xxxx; CN không có `brief.md` (dòng danh mục thay brief); script cũ `map-check`, `uc-check`, kiểm theo CN trong `check-all` còn dò đường dẫn ba-kit |

## Phụ lục. Phân loại port `ba-process` từ kit v1 (2026-10-26)

Nguồn: `spec v1 25.10/.claude/skills/ba-process/` 2.1.0 và `ba-refine/method.md` mục 5.2, 5a. Kết quả:
`.claude/skills/ba-process/method.md` (mục ở cột cuối), `checklist.md`.

| Mục v1 | Phân loại | Cấp | Việc | Mục mới |
| --- | --- | --- | --- | --- |
| 0. Nguồn đầu vào | Sửa | Cả hai | Nguồn as-is → PROC overview, điều khoản, UC presales, MP, BRD; as-is khi có | A1, B0 |
| 1. Bản đồ quy trình | Sửa | Tổng | Bỏ feature-map, biên bản; PROC có căn cứ điều khoản, UC presales | A2 |
| 1b. Chuyển giao | Giữ + sửa luật | Cả hai | CN đầu kia chưa làm → chỉ dòng overview; đã có file → câu hỏi | 1.4 |
| 2. As-is | Giữ | Chi tiết | — | B8 |
| 3. To-be | Sửa | Chi tiết | Căn cứ là REQ, UC presales hoặc điều khoản | B8 |
| 4. Bảng bước | Giữ + sửa | Chi tiết | Thêm cột Loại, REQ, UC presales, MP, Điều khoản; luật căn cứ | B1 |
| 5. Gateway | Giữ + bổ sung | Chi tiết | Nguồn điều kiện: luật, luồng thay thế, nút trên màn | B6 (D5) |
| 6. Ngoại lệ | Giữ | Chi tiết | Quá hạn khớp điều khoản | B7 (D6) |
| 7. Thuật ngữ | Giữ | Cả hai | — | 1.2 |
| 8. Sơ đồ | Giữ | Cả hai | Thêm cấp 0, cấp 3 | 1.3 |
| 9. Chỉ số đo | Sửa | Chi tiết | Thành "Thời hạn và chỉ số", thời hạn từ điều khoản | B8 |
| 10. Khớp hai cấp | Sửa luật | Cả hai | Bỏ "đổi ở chi tiết thì sửa overview"; chỉ thêm | 1.5 |
| 11. Chế độ presales | Tách | Tổng + chi tiết | Ghép luồng, bốn câu hỏi → tổng; khoảng trống chi tiết → D3 | A3, B4 |
| 12. Lỗi hay gặp | Giữ + bổ sung | Cả hai | Thêm lỗi của làm dọc | 2 |
| `ba-refine` 5a | Sửa | Tổng | Đối chiếu hai chiều UC presales ↔ PROC (thay FEAT) | A4 |
| `ba-refine` 5.2 | Sửa | Tổng | NV → CN = 1–3 PROC nối nhau; phụ thuộc, thứ tự, dải ID | A5 |
| — | Mới | Chi tiết | Phạm vi brief; D2 xương sống pháp lý; D4 kiểm theo luồng màn; mapping | B0, B3, B5, B9 |

Checklist v1 20 dòng: dòng 1–3, 6–11, 13 giữ; 4, 5, 12, 19 sửa; 14, 17, 18, 20 về cấp tổng; 15, 16 dùng cả hai cấp.
Thêm mới: phạm vi brief, Loại và căn cứ, trình tự luật, không sửa theo màn, mapping script sinh, độ phủ 100%, dải ID,
ma trận hai chiều, cắt CN, BA xác nhận cách chia.
