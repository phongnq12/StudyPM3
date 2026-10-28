# Bộ ký hiệu BPMN 2.0 dùng trong kit

Chỉ dùng tập ký hiệu dưới đây (tập "mô tả và phân tích" của BPMN 2.0). Ký hiệu ngoài bảng (compensation, cancel,
transaction, choreography, conversation) không dùng; cần thì hỏi BA lead.

## 1. Phần tử luồng
| Nhóm | Ký hiệu | Nghĩa | Dùng khi | Đặc tả JSON |
| --- | --- | --- | --- | --- |
| Task | Ô bo góc, biểu tượng người | User task: người dùng làm trên hệ thống | Chuyên viên nhập, lãnh đạo duyệt trên phần mềm | `"loai":"task","kieu":"user"` |
| Task | Biểu tượng bánh răng | Service task: hệ thống tự làm | Tính điểm, kiểm tra hợp lệ, đồng bộ, tạo cảnh báo | `"kieu":"service"` |
| Task | Biểu tượng bàn tay | Manual task: người làm ngoài hệ thống | In, ký giấy, họp, kiểm tra thực địa, quét tài liệu | `"kieu":"manual"` |
| Task | Phong bì đen | Send task: gửi thông điệp sang pool khác | Gửi văn bản, thông báo cho đơn vị, hệ thống ngoài | `"kieu":"send"` |
| Task | Phong bì trắng | Receive task: chờ nhận thông điệp | Chờ văn bản, kết quả từ bên ngoài giữa luồng | `"kieu":"receive"` |
| Task | Biểu tượng bảng | Business rule task: áp quy tắc nghiệp vụ | Tính số ngày phép được hưởng theo thâm niên, xác định mức theo bảng | `"kieu":"businessRule"` |
| Task | Ô trơn | Abstract task: chưa rõ ai làm | Chỉ dùng ở bản nháp; cấp 2 chính thức không dùng | `"kieu":"abstract"` |
| Sub-process | Ô có dấu ⊞ | Sub-process thu gọn: một quy trình con | Cấp 1: mỗi PROC; cấp 2: bước có quy trình con riêng | `"loai":"subprocess"` |
| Call activity | Ô viền đậm có ⊞ | Gọi một quy trình dùng chung | Gọi một PROC khác như một bước | `"loai":"call"` |
| Lặp | Ký hiệu ↻ / ‖‖ / ≡ ở đáy | Lặp; nhiều lần song song; nhiều lần tuần tự | Duyệt từng đơn trong danh sách, gửi thông báo cho từng nhân viên | `"lap":"chuan" / "song_song" / "tuan_tu"` |
| Bắt đầu | Vòng tròn mảnh | Bắt đầu không loại | Người tự khởi động quy trình | `"loai":"start"` |
| Bắt đầu | Vòng tròn + phong bì | Bắt đầu khi nhận thông điệp | Nhận từ PROC khác, hệ thống ngoài | `"loai":"start","su_kien":"message"` |
| Bắt đầu | Vòng tròn + đồng hồ | Bắt đầu theo thời gian | Đến kỳ, đến hạn | `"su_kien":"timer"` |
| Bắt đầu | Vòng tròn + tờ giấy kẻ | Bắt đầu theo điều kiện | Khi một điều kiện dữ liệu thành đúng | `"su_kien":"conditional"` |
| Trung gian | Vòng tròn đôi | Sự kiện giữa luồng: chờ (bắt) hoặc phát (ném) | Chờ đến hạn, chờ thông điệp; phát thông báo | `"loai":"intermediate","su_kien":"timer\|message\|signal","huong":"catch\|throw"` |
| Trung gian | Vòng tròn đôi + mũi tên | Link event: nối hai đoạn sơ đồ | Tách trang; cặp ném và bắt cùng chữ cái đầu nhãn ("A: …") | `"su_kien":"link","huong":"throw\|catch"` |
| Sự kiện biên | Vòng tròn đôi trên viền task | Ngoại lệ trong lúc task chạy; nét liền ngắt task, nét đứt không ngắt | Quá hạn (timer), lỗi hệ thống ngoài (error), nhận yêu cầu hủy (message) | `"loai":"boundary","gan":"<id task>","su_kien":"timer","ngat":true` |
| Kết thúc | Vòng tròn đậm | Kết thúc, tên là trạng thái đạt được | Mỗi kết quả khác nhau một sự kiện kết thúc | `"loai":"end"` |
| Kết thúc | Vòng tròn đậm tô đen | Terminate: dừng mọi nhánh còn chạy | Chỉ khi cần hủy nhánh song song | `"su_kien":"terminate"` |
| Kết thúc | Vòng tròn đậm + phong bì | Kết thúc và gửi thông điệp | Kết quả gửi sang PROC khác, hệ thống ngoài | `"su_kien":"message"` |
| Gateway | Hình thoi ✕ | Chọn một nhánh (exclusive, XOR) | Câu hỏi có / không, chọn một trong nhiều | `"loai":"gateway","kieu":"xor"` |
| Gateway | Hình thoi ✚ | Song song (parallel, AND): tách thì chạy mọi nhánh, gộp thì chờ đủ | Hai việc làm đồng thời | `"kieu":"and"` |
| Gateway | Hình thoi ◯ | Chọn nhiều (inclusive, OR) | Một hoặc nhiều nhánh tùy điều kiện; hạn chế dùng | `"kieu":"or"` |
| Gateway | Hình thoi ⬠ | Theo sự kiện (event-based): nhánh nào có sự kiện trước thì đi | Chờ Trưởng phòng duyệt hoặc quá hạn duyệt, cái nào đến trước | `"kieu":"su_kien"` |

## 2. Pool, lane, luồng, dữ liệu
| Ký hiệu | Nghĩa | Dùng khi | Đặc tả JSON |
| --- | --- | --- | --- |
| Pool có lane | Một quy trình (người tham gia) đang mô tả | Cấp 1: dự án; cấp 2: PROC-xx | `"pools":[{"id","ten","lanes":[{"id","ten"}]}]` |
| Pool thu gọn (ô xám) | Bên tham gia không mô tả bên trong | Hệ thống ngoài, đơn vị ngoài, PROC khác (ở cấp 2) | `{"id","ten","thu_gon":true,"vi_tri":"tren\|duoi","cot":n,"so_cot":m}`; bên phải: `"vi_tri":"phai","lane":"<id>","hang":h` |
| Lane | Vai trò thực hiện | Vai trò theo actors.md, glossary; "Hệ thống <tên>" cho service task | phần tử có `"lane":"<id>"` |
| Sequence flow ─▶ | Thứ tự trong cùng pool | Mọi bước nối bước | `{"tu","den","nhan"}` |
| Default flow ─/▶ | Nhánh mặc định của gateway | Nhánh "còn lại" | `"mac_dinh":true` |
| Message flow - -▷ | Thông điệp giữa hai pool | Gửi nhận văn bản, dữ liệu với bên ngoài | `"loai":"message"` |
| Data object | Tài liệu, dữ liệu nghiệp vụ | Tài liệu chính tạo ra hoặc dùng (đơn nghỉ phép, quyết định) | `"loai":"data"` + luồng `"loai":"data"` |
| Data store | Kho lưu giữ lâu dài | Kho hồ sơ dùng chung giữa nhiều bước | `"loai":"store"` |
| Text annotation | Chú thích | Ghi chú nguồn, quy tắc ngắn | `"loai":"note"` + luồng `"loai":"assoc"` |

## 3. Cấu trúc đặc tả JSON
```json
{
  "ten": "PROC-xx <tên>",          // tên trang sơ đồ
  "cap": 2,                         // 0 luồng chính, 1 bản đồ tổng, 2 quy trình chi tiết
  "rong_toi_thieu": 0,              // bề rộng tối thiểu của trang (px), tùy chọn
  "chu_giai": true,                 // hộp chú giải ký hiệu (mặc định có)
  "chu_giai_them": "nền xanh: ...", // dòng thêm vào chú giải (tùy chọn)
  "pools": [ ... ],                 // mục 2
  "nodes": [
    {"id": "PROC-xx.yy", "loai": "task", "kieu": "user", "ten": "<động từ + danh từ>", "lane": "<id lane>",
     "cot": 3, "hang": 0,           // vị trí lưới: cột (cho phép số lẻ .5), hàng trong lane
     "ghi_chu": "dòng nhỏ dưới tên", "nhan_manh": false, "dx": 0, "dy": 0,
     "ma": "PROC-xx.yy"}            // mã hiện đậm (mặc định = id khi id là PROC-xx hoặc PROC-xx.yy)
  ],
  "flows": [
    {"tu": "<id>", "den": "<id>", "nhan": "<điều kiện / thông điệp>", "loai": "seq|message|data|assoc",
     "ra": "phai|trai|tren|duoi", "vao": "phai|trai|tren|duoi",   // hoặc [x, y] 0–1: điểm bất kỳ trên viền, vd [0.25, 1]
     "qua": [{"lane": "<id lane>", "cot": 3.5, "hang": 0.5}]}   // điểm gấp theo lưới; .5 là khe giữa hai cột / hàng;
                                                                   // hoặc tọa độ tuyệt đối {"x": 820, "y": 300}
  ]
}
```
- ID task cấp 2 là ID bước `PROC-xx.yy` (hiện đậm trên sơ đồ, công cụ lint so với bảng bước). Cấp 1: ID là `PROC-xx`.
- ID khác (sự kiện, gateway) đặt ngắn: `S1`, `E1`, `G1`, `B1`, `LA` (link A).
- Kích thước lưới: một cột 210 px, một hàng 140 px; lane tự cao theo số hàng, hoặc đặt `"cao"` (px) trong lane.
- Khóa tùy chọn khác: sự kiện biên `"vi_tri_bien"` (0–1, vị trí dọc cạnh dưới task, mặc định 0.75) và `"ngat": false`
  (biên không ngắt); sự kiện `"su_kien"` (loại: message, timer, error, link…), `"huong": "throw"` (ném); chú thích
  `"cao"` (px); data object `"kieu": "input" | "output"`; pool thu gọn `"thu_gon": true`, `"vi_tri": "tren" | "duoi"`.
