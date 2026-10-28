# Cấu trúc man-presales.json

File do `kit/tools/ba-verify/quet-prototype.mjs` sinh, ở `1-ba-init/0-dau-vao/man-presales.json`. Không sửa tay: chạy lại
script khi prototype presales đổi. Agent đọc file này để viết `man-presales.md`; cổng máy đọc để kiểm độ phủ trường
ở bước 6 (ERD).

```json
{
  "tao_luc": "YYYY-MM-DDTHH:mm:ss",
  "nguon": "0-inputs/presales/prototype",
  "kieu": "dist",
  "duyet": "0-inputs/presales/prototype/dist",
  "link": "https://ten-app.web.app/",
  "so_vi_tri": 0,
  "doc_bang": "playwright (chromium)",
  "menu": ["MP-001", "MP-004"],
  "chuyen_huong": { "/": "/ho-so" },
  "route_ma_nguon": ["/ho-so", "/ho-so/:maHoSo"],
  "route_chua_mo": [],
  "lech_nguon": [{ "route": "/cai-dat", "chi_co_o": "dist" }],
  "man": [
    {
      "ma": "MP-001",
      "vi_tri": "/ho-so",
      "cach_mo": "tải trang",
      "tieu_de": "Danh sách hồ sơ",
      "truong": [
        { "nhan": "Ngày nộp", "loai": "date", "bat_buoc": false, "ten": "ngay_nop" }
      ],
      "nut": ["Thêm mới", "Xóa"],
      "di_toi": ["MP-002", "MP-003"],
      "anh": "1-ba-init/0-dau-vao/man-presales/MP-001.png",
      "doc_bang": "playwright",
      "loi": null
    }
  ]
}
```

| Khóa | Ý nghĩa |
| --- | --- |
| `kieu` | Dạng đã duyệt: `dist` (bản build, server cục bộ), `link` (bản đã deploy), `html` (tệp HTML tĩnh). Chọn theo dòng "Duyệt bằng" của `nguon.md` hoặc `--tu`; mặc định dist, rồi link, rồi html |
| `duyet` | Thư mục hoặc link đã duyệt |
| `link` | Dòng "Link" của `nguon.md`, `null` khi không có |
| `so_vi_tri` | Số route (app) hoặc số tệp HTML |
| `doc_bang` (cấp gốc) | `playwright (<trình duyệt>)`, hoặc `tinh (<lý do>)` khi HTML tĩnh không chạy được trình duyệt hay chạy `--tinh` |
| `menu` | App: màn chính của các route mở được từ khung điều hướng (nav, aside, header), kể cả mục trong menu thu gọn |
| `chuyen_huong` | App: route tự chuyển sang route khác khi mở (không thành màn riêng) |
| `route_ma_nguon` | Route khai báo trong `ma-nguon/` (react-router, Next.js); `[]` khi không có mã nguồn |
| `route_chua_mo` | Route trong mã nguồn không khớp màn nào đã duyệt (thường là route có tham số không có liên kết tới). Mỗi route một dòng ở mục 3 man-presales.md |
| `lech_nguon` | Có cả dist và link: route chỉ có ở một bên (`chi_co_o`). Chỉ so danh sách route. Mỗi route một dòng ở mục 3 |
| `vuot_gioi_han` | Có khi số route chạm `--toi-da`: còn route chưa duyệt |
| `nhanh` | Có khi chạy `--nhanh`: chỉ bấm mục menu và dòng đầu bảng, không bấm nút trong nội dung — không có màn popup |
| `vai` (cấp gốc) | Có khi chạy `--doi-vai`: danh sách vai đã duyệt, theo thứ tự trong menu đổi vai |
| `ma` | Mã màn. Lần đầu cấp tăng dần theo vị trí (bảng chữ cái), trong mỗi vị trí theo thứ tự màn chính, tab, popup. Chạy lại giữ mã theo (vi_tri, cach_mo) |
| `vi_tri` | Route của app (`/ho-so/:id`) hoặc đường dẫn tương đối trong `0-inputs/presales/prototype/` (HTML tĩnh) |
| `cach_mo` | `tải trang`, `tab: <nhãn>`, `popup: <nhãn nút mở>`; HTML tĩnh: `popup: <nhãn nút mở hoặc #id, ? khi không có>`, popup lồng `popup: <ngoài> > <trong>`. Trùng trong một vị trí → thêm ` (1)`, ` (2)` theo thứ tự |
| `tieu_de` | Tiêu đề trong màn (tiêu đề popup, h1, h2, nhãn tab; app: trong phần nội dung, bỏ khung điều hướng), không có thì `<title>` |
| `truong` | Ô nhập, chọn, đánh dấu đang hiện: `nhan` (nhãn), `loai` (kiểu HTML), `bat_buoc` (`required`, `aria-required` hoặc dấu `*` ở nhãn), `ten` (`name` hoặc `id`) |
| `nut` | Nhãn nút và liên kết dạng nút đang hiện |
| `di_toi` | Màn mở được từ màn này: tab, popup, màn chính của route khác (liên kết, nút, dòng bảng) |
| `anh` | Ảnh chụp màn, `null` khi không chụp được |
| `doc_bang` (mỗi màn) | `playwright` hoặc `tinh` |
| `loi` | Lỗi khi duyệt màn, `null` khi không lỗi |
| `vai` (mỗi màn) | Có khi chạy `--doi-vai`: vai đang chọn khi duyệt màn. Route đã duyệt ở vai trước không thành màn lần nữa, nên màn chung (trang chủ) chỉ ghi vai đầu tiên thấy nó |

## Cách script duyệt app (dist, link)
1. Mở route gốc; mở rộng mục menu đang thu gọn (`aria-expanded="false"` trong khung điều hướng).
2. Hàng chờ route: route gốc, route tĩnh trong `ma-nguon/`, rồi mọi route tìm thấy. Đoạn đường dẫn là số, uuid, chuỗi
   hex dài, mã sinh tự động (Firebase) được coi là tham số `:id`, nên `/ho-so/1` và `/ho-so/2` là một màn.
3. Mỗi route: chụp màn chính; bấm từng tab trừ tab đầu; bấm thử từng nút, mục menu, dòng đầu bảng có con trỏ bàn tay
   (tối đa 40 mỗi màn, trùng nhãn bấm một lần, mục menu chung bấm một lần cho cả app). Bấm xong: đổi route → thêm vào
   hàng chờ; hiện popup mới → màn popup; rồi tải lại route để về trạng thái đầu.
4. Hộp thoại của trình duyệt (alert, confirm) tự đóng bằng "Hủy"; cửa sổ mới tự đóng.
5. `--doi-vai "<nhãn nút>"`: app có nút đổi vai mà vai mất khi tải lại trang. Với mỗi vai trong menu của nút: mỗi lần
   mở route thì tải trang gốc, chọn vai, rồi chuyển route trong app (pushState). Không có tùy chọn này, script chỉ
   duyệt vai mặc định của prototype.

## Giới hạn của script
- **Không bấm** nút có thể ghi dữ liệu hoặc gây tác dụng ngoài trang: nhãn bắt đầu bằng Lưu, Gửi, Nộp, Ký, Xóa, Đăng
  xuất, Thoát, In, Tải xuống, Tải lên, Xuất, Nhập file (và chữ tiếng Anh tương ứng). Popup của chúng (ví dụ hộp xác nhận
  xóa) không được ghi nhận. `--bam-ca-nut-ghi` bấm cả các nút này: chỉ dùng với bản `dist` không nối dữ liệu thật.
- Không bấm nút bên trong popup (popup lồng, bước tiếp của wizard trong popup), không điền form để đi tiếp.
- Nội dung đổi tại chỗ mà không đổi route, không mở popup (wizard nhiều bước trên cùng route, khung mở rộng) không
  thành màn riêng.
- Màn chỉ mở được với dữ liệu có sẵn (route có tham số không có liên kết tới, danh sách trống) → `route_chua_mo` khi có
  mã nguồn; không có mã nguồn thì không biết là sót.
- Không đăng nhập. App bắt đăng nhập → script chỉ thấy màn đăng nhập; báo phiên chính.
- Mã nguồn: chỉ đọc route khai báo đường dẫn tuyệt đối (react-router `path: '/x'`, `<Route path="/x">`; Next.js
  `app/**/page`, `pages/**`). Route con khai báo tương đối không ghép được với route cha.
- HTML tĩnh: nhận màn qua cấu trúc HTML (tab: role="tab", data-bs-toggle; popup: dialog, role="dialog", .modal), không
  bấm thử. Đường đi giữa màn: `<a href>` (kể cả đường dẫn đã mã hóa) và `onclick` có `location.href = '…'`,
  `location.assign('…')`.

Màn bị sót vì các giới hạn trên → agent ghi mục 3 "Lỗi khi duyệt" của man-presales.md; phiên chính quyết thêm mẫu nhận
dạng vào script.
