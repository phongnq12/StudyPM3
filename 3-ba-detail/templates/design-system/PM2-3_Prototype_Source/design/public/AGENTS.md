# Design System PM2 — tài liệu cho agent dựng màn

<!-- Sinh tự động bởi _tools/TrangNT5_GenDesignAgents.cjs từ catalog.jsx, guides.json, styling.json, rules.json. Không sửa tay: sửa nguồn rồi chạy lại. -->

© 2026 TrangNT5. Design System PM2 is designed and maintained by TrangNT5. All rights reserved.

Mỗi ý hướng dẫn mang nhãn nguồn: Verified (luật hoặc quyết định đã chốt) · Based on Docs (suy từ nguồn ghi rõ) · AI Inferred (AI suy, chờ duyệt — dùng thận trọng).

## Cách dùng tài liệu này khi dựng màn

1. Tìm control theo nhóm bên dưới, gọi đúng component dùng chung ghi ở mục đó, không tự dựng lại (UX-L1).
2. Theo đúng Cách dùng, Quy tắc và lớp CSS của mục.
3. Câu thông báo gọi theo mã trong Message List, không gõ cứng chữ.

## Nguyên tắc

- **UX-L1**: Mỗi loại control có ĐÚNG `1` cách dựng dùng chung — màn mới không tự dựng control, không chép code control sang màn
- **UX-L2**: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn
- **UX-A6**: CĂN GIỮA DÒNG là luật cứng — nhãn, giá trị, tag, nút, icon cạnh chữ cùng `1` đường giữa
- **UX-C1**: Nút
- **UX-A3**: Tag và thẻ trạng thái
- **UX-A4**: Màu tag và tông số đếm
- **UX-A7**: Màu chủ đạo PM2
- **UX-A16**: Số đếm khác tag — chấm hoặc SỐ gắn vào phần tử khác *(chuông, tab, nút lọc)* dùng khuôn số đếm `UX-L26` · nhãn CHỮ đứng riêng *(trạng thái, vai người)* dùng tag `UX-A3`. Chỉ áp PM2
- **UX-A8**: Chữ hiển thị không chứa mã nội bộ *(`BR-` · `MSG-` · `TAM-` · `UC` · `GL-` · `WEB-`…)*
- **UX-A12**: Chữ hướng dẫn viết cho NGƯỜI DÙNG — không đưa căn cứ pháp lý, mã quy tắc, câu diễn giải quy tắc lên giao diện; những thứ đó chỉ ghi trong SRS
- **UX-A15**: Cùng `1` khái niệm ⇒ cùng `1` chữ ở MỌI màn — nhãn trường, tên khối, giá trị kết quả, tên vai người. Trước khi đặt chữ cho màn mới, tra chữ màn đã có đang dùng cho khái niệm đó rồi dùng lại; `2` màn đang lệch nhau ⇒ báo lệch, không tự chọn bên. Nguyên văn: *"Dùng chung là Khớp giống màn hình tạo nhé ==> Sử dụng các khái niệm cùng 1 cái ở mọi nơi phải y hệt nhau nhé"* · *"Q15 phải đồng bộ chứ"* · *"Q16 Đồng bộ thi: Nó là Đối chiếu CCCD/Giấy tờ tùy thân của thân nhân"*. Ví dụ đã áp: kết quả đối chiếu giấy tờ «Khớp» *(bỏ «Đạt»)* · khối «Đối chiếu CCCD/Giấy tờ tùy thân của thân nhân» · «thân nhân đi cùng» · nhãn giờ hẹn «Khung giờ»
- **UX-E1**: Mọi thông báo đi qua `1` toast chung
- **UX-M1**: Prototype gọi message THEO MÃ của `PM2_MessageList.md` qua `1` hàm `msg(mã, …)` *(catalog `src/data/messageCatalog.js` sinh tự động, không sửa tay)* — áp toast, chữ đỏ, tiêu đề và thân popup, cảnh báo, trạng thái rỗng, lỗi hệ thống · trường hợp tương tự BẮT BUỘC dùng chung `1` mã, không câu riêng từng màn. Nguyên văn: *"tớ muốn Prototype gọi chuẩn mã dùng nhé message nhé. Còn hiển thị lên toast mgs thì lấy theo nội dung"* · *"sau này nếu đổi mã thì rà đc 1 loạt chỗ cần đổi chuẩn hơn + các trg hợp tương tự bắt buộc phải dùng chung mã"* *(ghi vào Rules 09/10/2026, trước đó cổng đã có phép mà Rules chưa có dòng)*
- **Giao diện**: chỉ có giao diện sáng (QD-406).

## Tư duy dựng màn

### Lưới 12 cột và căn chỉnh ô (`grid`)


```jsx
<div className="form-grid">
  <div className="field span-3">…Mã</div><div className="field span-9">…Tên</div>   // mã ngắn đi cặp tên dài
</div>  // hàng 3 ô: 4-4-4 · 2 ô: 6-6 · 4 ô: 3-3-3-3
```

Quy tắc:
- UX-B1: Lưới `12` cột. Lưới lọc danh sách: mỗi ô `span {n}` với `n` là bội số của `3`. *(14/10/2026, QD-377 · QD-382)* Dòng điều kiện CỐ ĐỊNH dựng flex tỷ lệ `4 · 3 · 3` nên chỉ kiểm kín mép phải, luật bội `3` áp cho dòng mở rộng. Form Tạo/Sửa theo `UX-B6` *(điểm tách ô `2` hàng liền nhau lồng nhau)*, không ràng buộc bội số `3` — `8 4` · `4 2 2 4` · `4 4 4` đều hợp lệ *(ví dụ của TrangNT5, PM2 `QD-310`)*
- UX-B6: Form chia lưới `12` cột, ĐIỂM TÁCH ô của `2` hàng liền nhau phải LỒNG NHAU — mỗi hàng tổng span = `12` · điểm tách là vị trí cột cộng dồn giữa các ô *(`9 3` ⇒ `{9}` · `3 3 3 3` ⇒ `{3,6,9}`)* · tập điểm tách của hàng ít ô hơn nằm trọn trong tập của hàng nhiều ô hơn · hàng trọn `12` *(ô chọn nhiều, Ghi chú, bảng)* thì bỏ qua · chọn tỷ lệ theo độ dài nội dung từng ô *(mã ngắn, tên dài)*. Nguyên văn: *"mình chia bố cục thành 12 ô cho mỗi phần cần chia - Làm sao chia đều các tỷ lệ cho đẹp cân đối để các hàng thẳng hàng nhau đều nhất có thể. Ví dụ hàng 1 là 9 và 3, hàng 2 sẽ là 3 3 3 3. Hàng 1 là 8 4, Hàng 2 có thể là 4 2 2 4 hoặc 4 4 4. Tức là để nếu hàng thì các chỗ mà tách ô thẳng hàng nhau, nhìn k lôm côm ấy"* *(PM2 `QD-310`)*. Ví dụ ĐÚNG: form Quầy `Mã 3 · Tên 9` rồi `SĐT 3 · Vị trí 9` ⇒ `{3}` và `{3}` · form Bàn `Quầy 9 · Mã 3` rồi `Tên 6 · Số chỗ 3 · Vách ngăn 3` ⇒ `{9}` nằm trong `{6,9}`. Ví dụ SAI: `Mã 3 · Tên 9` rồi `Vị trí 6 · SĐT 3` ⇒ `{3}` và `{6}` không lồng nhau

When to Use (Khi dùng):
- [Verified · UX-B6] Dùng lưới 12 cột `.form-grid` cho mọi form Tạo, Sửa, mỗi ô là `.field span-N`.
- [Verified · UX-B1] Dùng lưới 12 cột cho bộ lọc danh sách, mỗi ô có span là bội số của 3.

When Not to Use (Khi không dùng):
- [Verified · UX-B1] Form Tạo, Sửa không bị ràng buộc bội số 3, các tỷ lệ `8 4`, `4 2 2 4`, `4 4 4` đều hợp lệ.
- [Verified · UX-B6] Hàng trọn 12 cột (ô chọn nhiều, Ghi chú, bảng) không cần xét điểm tách ô.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Khung `.form-grid` chia 12 cột, mỗi ô `.field span-N` gồm nhãn `.field-label` rồi tới control.
- [Verified · UX-B6] Mỗi hàng có tổng span bằng 12.
- [Verified · Playbook_List §1 khối 7] Bộ lọc danh sách: dòng 1 là từ khoá span 9 cộng khoảng ngày span 3, dòng 2 là 4 dropdown `3+3+3+3`.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Các mẫu hàng chuẩn: 2 ô `3-9` (mã ngắn đi cặp tên dài), 3 ô `4-4-4`, 2 ô `6-6`, 4 ô `3-3-3-3`, 1 ô `12`.

Do (Nên):
- [Verified · UX-B6] Chọn tỷ lệ theo độ dài nội dung từng ô, mã ngắn span nhỏ, tên dài span lớn.
- [Verified · UX-B6] Giữ điểm tách của hàng ít ô nằm trọn trong điểm tách của hàng nhiều ô, ví dụ `Quầy 9 · Mã 3` rồi `Tên 6 · Số chỗ 3 · Vách ngăn 3`.
- [Verified · UX-B1] Mép phải các hàng trùng nhau và kín mép phải lưới ở 5 bề rộng 1920, 1600, 1440, 1366, 1280.
- [Verified · UX-B9] Đặt trường có liên kết cạnh nhau, trường chọn trước đứng trước.

Don't (Không nên):
- [Verified · UX-B6] Không xếp `Mã 3 · Tên 9` rồi `Vị trí 6 · SĐT 3` vì điểm tách {3} và {6} không lồng nhau.
- [Verified · UX-B1] Không dùng span khác bội số 3 trong bộ lọc danh sách.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · UX-B9] Thứ tự đọc của lưới (trên xuống, trái sang) phải trùng thứ tự nhập, trường phụ thuộc nằm sau trường nó phụ thuộc.

UX Writing (Cách viết chữ):
- [Verified · Message List quy tắc Placeholder] Mỗi ô trong lưới có nhãn trường riêng, placeholder không thay cho nhãn.

Lớp CSS:
- `.form-grid` · biến thể: — · trạng thái: `.row-error`
- `.field` · biến thể: — · trạng thái: —
- `.span-9` · biến thể: — · trạng thái: —

### Chia khối fields theo nhóm thông tin (`blocks`)


```jsx
<div className="card"><h2 className="card-title">Thông tin chung</h2><div className="form-grid">…</div></div>
<div className="card"><h2 className="card-title">Phạm vi phục vụ</h2>…</div>
<PageFooter actions={actions} />
```

Quy tắc:
- UX-B8: Dữ liệu khác loại ⇒ tách thành KHỐI riêng, mỗi khối `1` thẻ `.card` có tiêu đề `.card-title` — không trộn thông tin của `2` đối tượng *(vd người nghiện và thân nhân, quầy và bàn)* hoặc `2` nhóm nghiệp vụ *(thông tin chung và lịch sử)* trong `1` khối. Nguyên văn: *"Các khối data khác nhau khi hiển thị cần tách khối, tránh để lẫn lộn khó hiểu"*. Khối bọc viền, tên trên viền theo `UX-B11` *(ĐỔI 19/10/2026, QD-431 ⑤ thay trải phẳng)*. Ngoại lệ *(19/10/2026, QD-420 ⑩)*: khối là nội dung DUY NHẤT của `1` tab mà tiêu đề khối trùng tên tab *(tab Lịch sử thao tác ở Chi tiết lịch hẹn, Chi tiết quầy)* ⇒ bỏ tiêu đề khối, tên tab đóng vai tiêu đề. Nguyên văn: *"Màn hình Lịch sử hoạt động bỏ tên màn hình vì trùng lặp"*
- UX-B9: Trường có LIÊN KẾT đặt CẠNH nhau, trường chọn TRƯỚC đứng TRƯỚC — trường B lọc theo, tính từ hoặc chỉ mở khi đã có trường A ⇒ A đứng ngay trước B, cùng hàng hoặc hàng liền kề, cùng khối *(vd Quầy rồi Bàn · Ngày rồi Khung giờ · tra Thân nhân rồi chọn Người cai nghiện theo luồng `QD-297` · Người cai nghiện rồi Thân nhân đi cùng)*. Nguyên văn: *"Các dữ liệu có sự liên kết thì cần đặt cạnh nhau + theo thứ tự cái nào chọn trước thì để trước"*. Bổ sung cho `UX-B7` *(thứ tự Chi tiết theo Tạo)*

When to Use (Khi dùng):
- [Verified · UX-B8] Dữ liệu khác loại thì tách thành khối riêng, mỗi khối là 1 thẻ `.card` có tiêu đề `.card-title`.
- [Verified · Playbook_CreateEdit §1 khối 4] Dùng cho form Tạo, Sửa có nhiều nhóm thông tin, mỗi khối chứa 1 lưới 12 cột.

When Not to Use (Khi không dùng):
- [Verified · UX-B8] Không trộn thông tin của 2 đối tượng (người nghiện và thân nhân, quầy và buồng) trong 1 khối.
- [Verified · UX-B8] Không trộn 2 nhóm nghiệp vụ (thông tin chung và lịch sử) trong 1 khối.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Thẻ `.card`, trong đó là tiêu đề `h2.card-title` rồi lưới `.form-grid` chứa các ô.
- [Verified · catalog.jsx] Sau khối cuối là thanh chân trang `PageFooter`.

Variants & States (Biến thể và trạng thái):
- [Verified · UX-B7] Ở màn Sửa, trường không được sửa trong khối hiện theo khuôn Xem (nhãn, giá trị), chỉ trường được sửa mới là ô nhập.

Do (Nên):
- [Verified · UX-B8] Mỗi khối có đúng 1 tiêu đề không rỗng.
- [Verified · UX-B7] Giữ y nguyên thứ tự khối và trường giữa màn Tạo, Sửa, Xem của cùng 1 đối tượng.
- [Verified · UX-B9] Trường có liên kết đặt cùng khối, trường chọn trước đứng trước.

Don't (Không nên):
- [Verified · UX-B8] Không đặt 2 khối liền nhau trùng tiêu đề.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · catalog.jsx] Tiêu đề khối dùng thẻ `h2`, dưới `h1` của tiêu đề màn.

UX Writing (Cách viết chữ):
- [Verified · UX-A15] Cùng 1 khái niệm thì cùng 1 tên khối ở mọi màn, tra chữ màn đã có trước khi đặt.
- [Verified · catalog.jsx] Tên khối gọi đúng nhóm thông tin, ví dụ «Thông tin chung», «Phạm vi phục vụ».

Lớp CSS:
- `.card` · biến thể: — · trạng thái: —
- `.card-title` · biến thể: — · trạng thái: —
- `.form-grid` · biến thể: — · trạng thái: `.row-error`

### Trạng thái ô nhập: thường · bắt buộc · lỗi · khoá · gợi ý (`field-states`)


```jsx
<label className="field-label">Mã quầy<span className="required-mark">*</span></label>
<input className="text-input input-border-error" /> <div className="field-error on">{msg('E001-01', 'mã quầy')}</div>
```

Quy tắc:
- UX-L11: Dấu `*` trường bắt buộc luôn màu ĐỎ báo lỗi `var(--color-err)` `#DC2626` — không lấy màu thương hiệu *(màu thương hiệu đổi thì dấu `*` đổi theo, sai nghĩa)*. `1` lớp chung `.required-mark` cho form, popup và bộ lọc. Nguyên văn: *"Ô vãi dấu * bắt buộc cần màu đỏ nhá"*. Đo `09/10/2026` trước khi sửa: `45` dấu `*` trên `8` màn đang xanh `#076DB6`

When to Use (Khi dùng):
- [Verified · UX-L11] Dùng 1 lớp chung `.required-mark` cho dấu `*` ở form, popup và bộ lọc.

When Not to Use (Khi không dùng):
- [Verified · UX-B7] Ở màn Sửa, trường không được sửa hiện theo khuôn Xem (nhãn, giá trị), không dùng ô nhập xám.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Nhãn `.field-label` kèm `.required-mark` nếu bắt buộc, rồi control, rồi chữ đỏ `.field-error` hoặc gợi ý `.field-hint`.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Thường: ô `.text-input` có placeholder.
- [Verified · UX-L11] Bắt buộc: dấu `*` luôn màu đỏ báo lỗi `#DC2626`.
- [Verified · catalog.jsx] Lỗi: ô thêm lớp `input-border-error` và chữ đỏ `.field-error on` ngay dưới ô.
- [Verified · UX-A14] Khoá: ô `disabled readOnly`, chữ giá trị vẫn đủ tương phản.
- [Verified · catalog.jsx] Gợi ý: dòng `.field-hint` dưới ô.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Trạng thái của ô nhập] Nghỉ: viền --border-strong.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Trạng thái của ô nhập] Rê chuột: viền --brand-hover.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Trạng thái của ô nhập] Đang nhập: viền --brand kèm vòng 2px, phải thấy rõ khi đi bằng phím Tab.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Trạng thái của ô nhập] Chỉ đọc: hiển thị như khoá nhưng vẫn copy được, dùng cho trường hệ thống sinh như mã, ngày tạo.

Do (Nên):
- [Verified · UX-D2] Bấm nút khi còn thiếu thì hiện chữ đỏ dưới mọi ô bắt buộc còn trống.
- [Verified · UX-D3] Chữ đỏ nằm ngay dưới khung ô nhìn thấy được, sát mép trái, cách mép dưới đúng 4px.
- [Verified · UX-D2] Sửa xong ô nào thì chữ đỏ ô đó tắt.

Don't (Không nên):
- [Verified · UX-L11] Không lấy màu thương hiệu cho dấu `*`.
- [Verified · UX-D2] Không chỉ báo lỗi ở ô đầu tiên.

Accessibility (Truy cập và bàn phím):
- [Verified · UX-A14] Chữ ở ô khoá, ô chỉ đọc có tương phản với nền từ 4.5:1 trở lên (WCAG 2.1 AA 1.4.3).
- [Based on Docs · UX-D9] Chữ đỏ phải nói đúng thứ đang thiếu, không chỉ dựa vào viền đỏ.
- [Verified · catalog.jsx] Ô khoá trong mẫu gắn `aria-label` trùng nhãn hiển thị.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Trạng thái của ô nhập] Ô khoá kèm chú thích lý do bị khoá.

UX Writing (Cách viết chữ):
- [Verified · PM2_MessageList E001-01] Ô nhập bỏ trống dùng `E001-01` «Vui lòng nhập {0}», ô chọn bỏ trống dùng `E001-02` «Vui lòng chọn {0}».
- [Verified · UX-E3] Chữ đỏ không có dấu chấm cuối câu.
- [Verified · catalog.jsx] Gợi ý nói ngắn quy cách, ví dụ «Số nội bộ của quầy, 10 chữ số».
- [Based on Docs · PM1 DS › Biểu mẫu & input › Trạng thái của ô nhập] Thông báo lỗi phải nói cách sửa, không chỉ nói sai.

Lớp CSS:
- `.field-label` · biến thể: — · trạng thái: —
- `.required-mark` · biến thể: — · trạng thái: —
- `.text-input` · biến thể: — · trạng thái: `:disabled` `:focus`

### Đầu màn Danh sách (`list-head`)


```jsx
<div className="shell-head"><div className="shell-title"><Svg …/><div className="shell-text"><h1>…</h1></div></div>  // QD-376: không dòng phụ dưới tiêu đề · ô icon 28px bằng dòng tiêu đề<div className="head-actions">Xuất Excel · Tạo mới</div></div>
```

Quy tắc:
- UX-A3: Tag và thẻ trạng thái
- UX-G7: Mọi màn Danh sách có bảng dữ liệu BẮT BUỘC có nút `Xuất Excel` ở thanh nút đầu trang, theo khuôn Playbook List khối `10`. Nguyên văn: *"Button Xuất Excel tất cả các màn hình danh sách List bắt buộc cần có"*. Ngoại lệ đã chốt (D2A): màn Thông báo `/quan-tri/thong-bao` là hộp thư cá nhân, không có bảng ⇒ không áp · màn Cài đặt thông báo `/quan-tri/cai-dat-thong-bao` là màn cấu hình dữ liệu seed sẵn, không thêm, không xoá *(PM2 `QD-366` ④)* ⇒ không áp, không thêm nút Xuất Excel *(phiên chính chốt 09/10/2026, khai trong cổng `G7_NGOAI_LE`)*

When to Use (Khi dùng):
- [Verified · Playbook_List §1 khối 2] Đầu mọi màn Danh sách: icon, tiêu đề, cụm nút góc phải.
- [Based on Docs · PM1 DS › Nút › Năm quy tắc sinh từ bug] Thứ tự từ phải sang: Tạo mới ngoài cùng phải, rồi Xuất Excel, không đảo theo màn.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nút và tên tệp] Nút Xuất Excel là nút phụ, icon Download.

When Not to Use (Khi không dùng):
- [Based on Docs · catalog.jsx] Màn Tạo, Sửa, Chi tiết dùng đầu màn có nút quay lại.
- [Verified · UX-G7] Màn Thông báo và màn Cài đặt thông báo không có nút `Xuất Excel`.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nút và tên tệp] Màn không có chức năng xuất thì ẩn hẳn nút, không để nút chết.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] `.shell-head` gồm `.shell-title` (icon và `h1` tiêu đề) rồi `.head-actions` (cụm nút).
- [Verified · QD-376] Ô icon 28px cao bằng dòng tiêu đề 18/28, icon 16px, bo 6px.
- [Verified · Playbook_List §1 khối 3] Thứ tự nút: `Xuất Excel`, `Hàng loạt (n)`, nút tạo là nút chính.

Variants & States (Biến thể và trạng thái):
- [Verified · Playbook_List §1 khối 3] Nút `Hàng loạt (n)` ẩn tới khi chọn dòng, cụm nút chỉ hiện ở tab Danh sách.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nội dung tệp xuất] Danh sách rỗng vẫn xuất tệp .xlsx chỉ có dòng tiêu đề, không chặn, không báo lỗi.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nội dung tệp xuất] Đang lọc thì tệp chứa toàn bộ tập khớp bộ lọc, không giới hạn theo trang đang xem.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nội dung tệp xuất] Vượt 1.000 dòng thì tách nhiều sheet trong cùng 1 tệp, mỗi sheet tối đa 1.000 dòng và lặp dòng tiêu đề.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Viết thông báo lỗi] Lỗi kết xuất phải có thông báo, không được im lặng.

Do (Nên):
- [Verified · UX-G7] Mọi màn Danh sách có bảng dữ liệu phải có nút `Xuất Excel` ở thanh nút đầu trang.
- [Verified · UX-C7] Nút tạo bản ghi ghi `Tạo mới`.

Don't (Không nên):
- [Verified · QD-376] Không đặt dòng phụ, câu diễn giải dưới tiêu đề.
- [Verified · Playbook_List §1 khối 2] Không dùng dải thông báo mô tả màn.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · catalog.jsx] Tiêu đề màn dùng thẻ `h1`.

UX Writing (Cách viết chữ):
- [Verified · catalog.jsx] Tiêu đề là tên màn, ví dụ «Cài đặt quầy tiếp đón».
- [Verified · UX-C7] Dùng `Tạo` khi sinh 1 chủ thể mới, `Thêm` khi gắn thứ đã có vào danh sách.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nút và tên tệp] Tên tệp theo khuôn <TênMànHìnhKhôngDấuViếtLiền>_YYYYMMDD_HHmmss, mốc giờ là lúc bấm xuất.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nút và tên tệp] Không dùng biến thể «Kết xuất», «Xuất file Excel», «Export», kể cả khi đặc tả ghi «Kết xuất».
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nội dung tệp xuất] Tệp có dòng «Bộ lọc áp dụng» thì ghi đúng giá trị lọc và từ khoá đang dùng.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Nội dung tệp xuất] Bộ cột tệp xuất đúng bộ cột khai trong đặc tả, không thừa, không thiếu, đúng thứ tự.

Lớp CSS:
- `.shell-head` · biến thể: — · trạng thái: —
- `.shell-title` · biến thể: — · trạng thái: —
- `.shell-text` · biến thể: — · trạng thái: —
- `.head-actions` · biến thể: — · trạng thái: —

### Câu thông báo gọi theo mã (`messages`)


```jsx
import { msg, msgParts } from '@/lib/msg'  // ⛔ gõ cứng câu hiển thị (UX-M1) — mã lấy ở PM2_MessageList.md
```

Quy tắc:
- UX-E1: Mọi thông báo đi qua `1` toast chung

When to Use (Khi dùng):
- [Verified · UX-M1] Mọi chuỗi hiển thị (toast, chữ đỏ, tiêu đề và thân popup, cảnh báo, trạng thái rỗng, lỗi hệ thống) gọi theo mã qua `msg(mã, …)`.
- [Verified · msg.js] Hộp xác nhận lấy tiêu đề, thân, nút qua `msgParts('C001-…')`.

When Not to Use (Khi không dùng):
- [Verified · UX-M1] Không gõ cứng câu hiển thị trong màn.
- [Verified · UX-M1] Không sửa tay `src/data/messageCatalog.js`, file sinh tự động từ `PM2_MessageList.md`.

Anatomy (Cấu tạo):
- [Verified · PM2_MessageList §1.1] Mã theo khuôn `{Loại}001-{Số thứ tự}`, ví dụ `E001-01`, `I001-14`, `W001-03`, `C001-09`, `SE001-01`.
- [Verified · PM2_MessageList §1.2] 5 loại: `E001` lỗi nghiệp vụ, `I001` thông báo, `W001` cảnh báo, `C001` xác nhận, `SE001` hệ thống.
- [Verified · msg.js] Biến `{0}` `{1}` lắp theo thứ tự tham số, biến bọc `` hiện in đậm.

Variants & States (Biến thể và trạng thái):
- [Verified · msg.js] Mã không có trong Message List thì `msg` trả về chính mã và ghi lỗi console, mã đã Ngừng dùng cũng ghi lỗi.
- [Verified · msg.js] Biến đứng đầu câu tự viết hoa chữ đầu, biến rỗng tự bỏ khoảng trắng và ngoặc thừa.

Do (Nên):
- [Verified · UX-E3] Tra Message List trước khi soạn câu.
- [Verified · UX-M1] Tình huống tương tự dùng chung 1 mã.
- [Verified · UX-E3] Câu tự soạn chưa có mã thì ghi Knowhow để bổ sung Message List.

Don't (Không nên):
- [Verified · UX-E3] Không đưa chữ kỹ thuật ra người dùng (`e.message`, tên hàm, mã lỗi trình duyệt).
- [Verified · UX-E1] Không dùng `alert()`.

Accessibility (Truy cập và bàn phím):
- [Verified · AppLayout.jsx] Vùng toast chung `#vungToast` có `aria-live="polite"` để trình đọc màn hình đọc câu thông báo.
- [Based on Docs · WCAG 2.1 SC 1.4.1 · UX-D2] Lỗi nhận ra bằng cả chữ và viền đỏ, không chỉ bằng màu.

UX Writing (Cách viết chữ):
- [Verified · UX-E3] Toast và thông báo không có dấu chấm cuối câu, thân popup diễn giải chấm cuối mọi câu, tiêu đề và nhãn nút không chấm.
- [Verified · PM2_MessageList E001-01] `msg('E001-01', 'mã quầy')` cho ra «Vui lòng nhập mã quầy».

## Khối màn thật

### Khuôn màn Danh sách đầy đủ: chế độ · tab đếm · bộ lọc · bảng · hàng loạt (`list-screen`)


```jsx
// nguồn src/pages/AppointmentList/AppointmentList.jsx — gọi thẳng TABS · BULK_DISABLED_TABS · STATUS_CLASS · rowActions · ROW_ACTIONS · ACTION_COLOR · LIST_ICONS · maxActionCount (listLogic)
.head-actions > .nhom-nut-bang · .mode > .mode-b(.on) · .tabs > .tab-btn(.on .is-empty) > .tab-label(.tab-dot) + .tab-number
.filter-head > .filter-arrow + .filter-title > .filter-count(.is-inline) · .shell-body.tbl > AppTable(rowSelection)
5 ô lọc .filter-status · .filter-table · .filter-counter · .filter-source · .filter-route (.filter-body.has-route) · khoảng ngày mặc định hôm nay ⇒ +7 ngày
tab Tất cả: bảng .is-hidden-selection (không ô tích) · tab Chờ duyệt, Đã duyệt mới có ô tích và nút Hàng loạt
15 cột: STT · Mã lịch hẹn(+nguồn) · Ngày giờ hẹn · Người cai nghiện(+CCCD, Ngày sinh) · Dãy nhà · Phòng · Thân nhân · Quan hệ · Loại hình · Buồng · Quầy · Số người · Thời lượng · Trạng thái · Thao tác · .table-hint > NoteBox line
.btn.btn-hl ⇒ AppModal: .bulk-row · .bulk-actions · .bulk-warning(.is-visible .is-soft)
```

Quy tắc:
- UX-G2: Mọi bảng có khung viền bọc bo góc, GÓC liền màu tiêu đề — áp cho bảng danh sách, bảng trong form, Chi tiết và popup. Có thanh cuộn dọc thì vùng phía trên thanh cuộn tô liền màu dòng tiêu đề cột, thanh cuộn mảnh và chạy từ dưới dòng tiêu đề *(khuôn gốc `.shell-body.tbl` ở `styles/base.css`)*. Nguyên văn: *"Bo góc bảng"* và *"Góc bảng màn danh sách liền màu tiêu đề ==> Add vào nhé"* *(sửa `09/10/2026`, bản cũ chỉ ghi bo `8px`, kiểm bằng mắt)*. *(20/10/2026, `Verified (TrangNT5 20/10/2026 · PM2 QD-444)`)* Gạch ngăn dòng dữ liệu dùng CHUNG 1 mã `--color-row-line` `#E5E7EB` *(khai ở `pm1-look.css`)* cho ô bảng, khối nhãn và giá trị ở màn Chi tiết, dòng danh sách thông báo — không khai thẳng màu xám khác cho gạch ngăn dòng. Viền khung, thẻ, ô nhập vẫn `--color-line`. Nguyên văn: *"gạch xám này toàn hệ thống có dùng chung 1 mã không"* · *"D2 A dùng theo màn chi tiết ấy"*
- UX-G9: Số bản ghi mặc định mỗi trang là `10` ở mọi bảng có phân trang *(danh sách; riêng Lịch sử thao tác từ 19/10/2026 không phân trang mà hiện `10` mốc rồi tải thêm `10`, PM2 `QD-421` ①, Playbook ViewDetail khối `7`)*, lựa chọn `10/20/50/100`. Nguyên văn: *"Số bản ghi default 1 trang để là 10 nhé ==> Đang để là 20"*. Đè lên mức `20` của `BRD-STD-01` mục `1.9` *(Prototype là bản chốt)* · Nút `Trang trước`/`Trang sau` theo PM1 *(đo PM1 STG `14/10/2026`, PM2 `QD-373` D6 D12)*: nền trắng · viền `#BFDBFE` · bo `6px` · cao `36px` *(đổi `14/10/2026` theo PM2 `QD-387` D30 A: mọi nút có chữ `36px` bằng ô nhập)* · chữ và mũi tên `#2563EB` `14/500` · nút tắt ở trang đầu/cuối giữ màu, mờ `0.8` · rê chuột mờ `0.9` · không title, không tooltip
- UX-L16: Thanh tab dùng `AppTabs` — kiểu chuẩn ĐI KÈM component *(`components/app/AppTabs.css`, lớp `.app-tabs`)*, không tự viết CSS tab riêng cho màn. Màn dùng `AppTabs` với lớp mặc định `.tabs` / `.tab-n` là đúng ngay. *(19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-421 ③)`)* hàng tab đứng ngay dưới đầu màn *(`.shell-head + .tabs`)* cách đầu màn `8px` *(`padding-top`)*, nguyên văn: *"Chỗ Tab hơi sát, cho xuống 1 xíu cho cân đối"* · *(19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-423)`)* hàng tab đệm ngang đúng `--shell-gutter` ⇒ mép tab đầu, kể cả gạch chân, thẳng mép khu lọc và bảng bên dưới · `.tab-n` mọi màn đệm `12px 14px` *(cùng `.tab-btn`)*. Nguyên văn: *"Ê tab phải cho dịch vào căn chỉnh thẳng với phía dưới chứ"*. Nguồn: tab màn Sửa quầy hiện thành nút trần vì `AppTabs` trước đây không tự mang kiểu, TrangNT5: *"Vãi tab kinh thế này … Khi làm Prototype k đọc các mẫu control có sẵn ah"*
- UX-B1: Lưới `12` cột. Lưới lọc danh sách: mỗi ô `span {n}` với `n` là bội số của `3`. *(14/10/2026, QD-377 · QD-382)* Dòng điều kiện CỐ ĐỊNH dựng flex tỷ lệ `4 · 3 · 3` nên chỉ kiểm kín mép phải, luật bội `3` áp cho dòng mở rộng. Form Tạo/Sửa theo `UX-B6` *(điểm tách ô `2` hàng liền nhau lồng nhau)*, không ràng buộc bội số `3` — `8 4` · `4 2 2 4` · `4 4 4` đều hợp lệ *(ví dụ của TrangNT5, PM2 `QD-310`)*

When to Use (Khi dùng):
- [Based on Docs · Playbook_List §1] Dùng cho màn Danh sách có nhiều trạng thái cần theo dõi, cần đủ đầu trang, tab trạng thái, bộ lọc, bảng và phân trang.
- [Verified · Playbook_List §1] Màn có từ 2 chế độ xem trở lên thì thêm dải tab chế độ kiểu Chrome, đúng số chế độ cần.
- [Verified · Playbook_List §2] Chỉ dùng thao tác hàng loạt cho các dòng cùng trạng thái, ở tab trạng thái cụ thể.
- [Based on Docs · PM1 DS › Khuôn màn hình › Màn có HAI bảng] Màn vừa có việc cần làm vừa có lịch sử thì dựng 2 khung danh sách xếp dọc, trang cuộn tự nhiên.
- [Based on Docs · PM1 DS › Khuôn màn hình › Màn có HAI bảng] Mỗi khung có tiêu đề và thanh phân trang riêng.

When Not to Use (Khi không dùng):
- [Verified · UX-L18] Đối tượng con chỉ sống trong 1 đối tượng cha thì không dựng màn danh sách riêng, quản lý ở tab của màn cha.
- [Verified · Playbook_List §4] Không tạo tab cho trạng thái đã khép như Đã hủy, Bị từ chối, chỉ tạo tab cho trạng thái người dùng cần xử lý hoặc theo dõi.
- [Verified · UX-L9] Màn Danh sách không dựng cặp thanh nút đầu trang và chân trang.
- [Based on Docs · PM1 DS › Khuôn màn hình › Màn có HAI bảng] Không nhồi 2 bảng vào 1 khung vì người dùng không biết bộ lọc và phân trang đang tác động bảng nào.
- [Based on Docs · PM1 DS › Khuôn màn hình › Khuôn màn Danh sách] Nhóm bản ghi dùng bộ cột khác nhau thì tách màn, không dùng tab.

Anatomy (Cấu tạo):
- [Verified · Playbook_List §1] Đầu trang: icon, tiêu đề, cụm nút góc phải theo thứ tự Xuất Excel, Hàng loạt (n), nút tạo mới màu chính, không câu diễn giải bên dưới.
- [Verified · Playbook_List §1] Dải tab chế độ (Danh sách, Lịch theo buồng), tiếp theo là dải tab trạng thái, mỗi tab có chấm màu và số đếm sau bộ lọc.
- [Verified · QD-377] Bộ lọc 1 dòng cố định gồm ô từ khoá, khoảng ngày, Trạng thái và nút «Tìm kiếm mở rộng» mở thêm dòng điều kiện còn lại.
- [Verified · UX-G11] Bảng bọc khung bo góc, tiêu đề cột ghim, cột Thao tác ghim phải và rộng theo số nút tối đa của vai đang đăng nhập.
- [Verified · UX-G12] Dưới bảng là câu hướng dẫn NoteBox trong .table-hint khi bảng lọc theo điều kiện nghiệp vụ, sau đó là thanh phân trang.

Variants & States (Biến thể và trạng thái):
- [Verified · Playbook_List §4] Tab Tất cả: bảng không có ô tích và không có thao tác hàng loạt.
- [Verified · catalog.jsx] Tab Chờ duyệt, Đã duyệt: có ô tích, tích ít nhất 1 dòng thì hiện nút Hàng loạt kèm số dòng đã chọn.
- [Verified · QD-377] Ô lọc Trạng thái chỉ hiện ở tab Tất cả, ở tab khác ô từ khoá giãn ra. Mở màn thì phần mở rộng gập sẵn.
- [Verified · UX-G6] Tab đếm 0 vẫn hiển thị bình thường và bấm được.
- [Verified · UX-G8] Bảng rỗng dùng EmptyRow: chưa có bản ghi nào thì I001-27, có bản ghi mà lọc không ra thì I001-28.
- [Based on Docs · PM1 DS › Khuôn màn hình › Màn có HAI bảng] Bảng việc cần làm không phân trang, dài tới mức cần phân trang là tín hiệu nghiệp vụ.
- [Verified · QD-425 · QD-426] Đơn ngoại lệ có biểu tượng lá cờ cam sau mã, tooltip nói rõ đã hay chưa được Trưởng cơ sở phê duyệt

Do (Nên):
- [Verified · Playbook_List §1] Mở màn với khoảng ngày để trống để tìm toàn bộ dữ liệu (QD-432).
- [Verified · Playbook_List §2] Lấy nút thao tác mỗi dòng từ ma trận nút theo trạng thái, nút không đủ điều kiện thì ẩn hẳn.
- [Verified · UX-D9] Đổi từ khoá, bộ lọc, tab hoặc trang thì bỏ các dòng đang tích, thao tác hàng loạt chỉ tính dòng đang hiện.
- [Verified · Playbook_List §4] Gom các thao tác hàng loạt vào 1 nút Hàng loạt (n) mở popup chứa các thao tác.
- [Verified · UX-G9] Mặc định 10 bản ghi mỗi trang, lựa chọn 10/20/50/100.

Don't (Không nên):
- [Verified · Playbook_List §1] Không gom icon thao tác vào nút ba chấm.
- [Verified · UX-L16] Không tự viết CSS tab riêng cho màn, dùng kiểu đi kèm AppTabs.
- [Verified · QD-377] Không hiện số đếm điều kiện đang áp trên nút «Tìm kiếm mở rộng».
- [Verified · UX-G10] Không gộp cột để né thanh cuộn ngang khi bảng nhiều cột.
- [Verified · Playbook_List §2] Không cho bấm tiêu đề cột để sắp xếp, sắp mặc định theo ngày tạo mới nhất ở dòng 1.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Dải chế độ có role tablist và aria-label «Màn con», mỗi nút có role tab và aria-selected.
- [Verified · blocks.jsx] Nút «Tìm kiếm mở rộng» báo trạng thái mở hoặc gập qua aria-expanded.
- [Verified · blocks.jsx] Mỗi ô lọc dropdown có ariaLabel theo tên trường, ví dụ Trạng thái, Quầy tiếp đón.
- [Verified · AppButton.jsx] Nút icon trong cột Thao tác không có chữ nên lấy tên đọc từ title khi chưa có aria-label.

UX Writing (Cách viết chữ):
- [Verified · Playbook_List §4] Ô lọc không có nhãn ngoài, placeholder dạng «Tất cả …», ví dụ «Tất cả trạng thái».
- [Verified · Playbook_List §4] Placeholder ô tìm ngắn, danh sách đủ các trường được tìm để trong tooltip.
- [Verified · UX-G12] Câu dưới bảng theo khuôn «{Danh sách X} sẽ có giá trị nếu {điều kiện}», điều kiện lấy từ code lọc hoặc QD.
- [Verified · Playbook_List §2] Thông tin phụ của mã (nguồn, loại) viết thành dòng phụ trong ô, không thêm cột.

Lớp CSS:
- `.head-actions` · biến thể: — · trạng thái: —
- `.nhom-nut-bang` · biến thể: — · trạng thái: —
- `.mode` · biến thể: — · trạng thái: —
- `.mode-b` · biến thể: — · trạng thái: `:hover` `.on`
- `.tabs` · biến thể: — · trạng thái: —
- `.tab-btn` · biến thể: — · trạng thái: `:hover` `.is-empty` `.on`
- `.tab-label` · biến thể: — · trạng thái: —
- `.tab-dot` · biến thể: — · trạng thái: —

### Tra cứu thân nhân và quẹt thẻ (`lookup`)


```jsx
// nguồn AppointmentForm.jsx · FormDialogs.jsx · formActions.js (câu lỗi E001-01 «…của thân nhân», E001-35)
.lookup > .lookup-field(.is-error) > input.text-input + AppButtonWithIcon.lookup-scan · .input-error(.is-visible) · .form-btn.form-btn-primary
kết quả: .lookup-not-found (E001-11 + I001-76) | .relative-card > .relative-avatar + .relative-name(.relative-name-link + tag) + .status-note
hộp Quẹt thẻ: .scan-area > .scan-icon · .scan-title · .scan-desc · .scan-spinner · chân hộp: Hủy
```

Quy tắc:
- UX-L11: Dấu `*` trường bắt buộc luôn màu ĐỎ báo lỗi `var(--color-err)` `#DC2626` — không lấy màu thương hiệu *(màu thương hiệu đổi thì dấu `*` đổi theo, sai nghĩa)*. `1` lớp chung `.required-mark` cho form, popup và bộ lọc. Nguyên văn: *"Ô vãi dấu * bắt buộc cần màu đỏ nhá"*. Đo `09/10/2026` trước khi sửa: `45` dấu `*` trên `8` màn đang xanh `#076DB6`
- UX-E1: Mọi thông báo đi qua `1` toast chung

When to Use (Khi dùng):
- [Based on Docs · blocks.jsx LookupDemo] Dùng khi phải tìm hồ sơ có sẵn theo số căn cước công dân hoặc số điện thoại trước khi đi tiếp form.
- [Verified · Playbook_CreateEdit §4] Dùng kèm công cụ nhập nhanh quẹt thẻ: icon mở popup, Prototype có nút giả lập.

When Not to Use (Khi không dùng):
- [Based on Docs · Playbook_CreateEdit §2] Chọn 1 bản ghi trong danh sách đã biết thì dùng thẻ bấm chọn, không dùng ô tra cứu.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Khung .lookup-field gồm ô nhập và nút icon quẹt thẻ nằm trong ô.
- [Verified · catalog.jsx] Chữ lỗi .input-error ngay dưới ô.
- [Verified · blocks.jsx] Nút chính «Tra cứu» có icon kính lúp.
- [Verified · catalog.jsx] Vùng kết quả: thẻ thân nhân (avatar chữ tắt, tên dạng link, tag trạng thái, dòng CCCD, số điện thoại, quan hệ) hoặc khung không tìm thấy.
- [Verified · catalog.jsx] Popup Quẹt thẻ: biểu tượng thẻ, tiêu đề, mô tả, vòng quay chờ, chân popup có nút Hủy và nút chính.

Variants & States (Biến thể và trạng thái):
- [Verified · blocks.jsx] Mặc định: ô trống, chưa có vùng kết quả.
- [Verified · catalog.jsx] Bấm Tra cứu khi ô trống: ô viền đỏ và lỗi E001-01 dưới ô.
- [Verified · catalog.jsx] Không khớp hồ sơ: lỗi E001-35 dưới ô và khung không tìm thấy dùng E001-11 kèm mô tả I001-76.
- [Verified · blocks.jsx] Tìm thấy: hiện thẻ thân nhân.
- [Verified · UX-D9] Sửa sang số khác thì giữ kết quả cũ tới khi bấm Tra cứu lại. Xoá trắng ô thì bỏ thẻ thân nhân và mọi dữ liệu con.

Do (Nên):
- [Verified · blocks.jsx] Cho phép nhấn Enter trong ô để tra cứu.
- [Verified · blocks.jsx] Bỏ dấu cách trong chuỗi đã nhập trước khi tra.
- [Verified · QD-260] Popup Quẹt thẻ căn cước rộng 520px ở mọi màn dùng.
- [Verified · UX-D9] Bấm Tiếp tục khi số trong ô khác số đã tra thì ô tự trả về số đã tra.

Don't (Không nên):
- [Verified · UX-E3] Không gõ cứng câu lỗi, gọi msg theo mã trong Message List.
- [Verified · UX-D9] Không thay kết quả cũ khi người dùng mới sửa số mà chưa bấm Tra cứu.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Nút quẹt thẻ chỉ có icon nên có aria-label «Quẹt thẻ».
- [Verified · UX-D3] Chữ lỗi nằm sát mép trái, cách mép dưới ô 4px.
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Nên nối chữ lỗi với ô bằng aria-describedby để trình đọc màn hình đọc được lỗi.

UX Writing (Cách viết chữ):
- [Verified · PM2_MessageList E001-01] E001-01 dùng khuôn «Vui lòng nhập {0}» với {0} là «số căn cước công dân hoặc số điện thoại của thân nhân».
- [Verified · PM2_MessageList E001-35] E001-35 nêu lại chuỗi đã nhập trong «{0}» rồi nhắc kiểm tra lại số căn cước công dân hoặc số điện thoại.
- [Verified · Playbook_CreateEdit §4] Placeholder ô bắt buộc chính có cụm «(Đây là mục bắt buộc)».
- [Verified · UX-E3] Câu lỗi và câu rỗng không có dấu chấm cuối.

Lớp CSS:
- `.lookup` · biến thể: — · trạng thái: —
- `.lookup-field` · biến thể: — · trạng thái: `.is-error`
- `.text-input` · biến thể: — · trạng thái: `:disabled` `:focus`
- `.form-btn` · biến thể: `.form-btn-add` `.form-btn-danger` `.form-btn-primary` `.form-btn-remove` `.form-btn-success` `.form-btn-warning` · trạng thái: `:active` `:hover` `.is-outline`
- `.lookup-not-found` · biến thể: — · trạng thái: —
- `.relative-card` · biến thể: — · trạng thái: —
- `.relative-avatar` · biến thể: — · trạng thái: —
- `.relative-name` · biến thể: — · trạng thái: —

### Chọn người cai nghiện dạng thẻ có quỹ thăm (`student-list`)

- Component: `Pm1SyncBar` (src/components/app/Pm1SyncBar.jsx)

```jsx
// nguồn AppointmentForm.jsx (#khoiNCN)
.card-title-row > h2.card-title + .card-title-tools > <Pm1SyncBar /> + <VisitConditionsLink />  // mở ra chưa chọn thẻ nào
.student-list > AppButton.student-card(.is-selected .is-locked) > .student-avatar · .student-body(.student-name .status-note .visit-block-reason) · .student-side > .quota-box(.is-exhausted)
```

Quy tắc:
- UX-B9: Trường có LIÊN KẾT đặt CẠNH nhau, trường chọn TRƯỚC đứng TRƯỚC — trường B lọc theo, tính từ hoặc chỉ mở khi đã có trường A ⇒ A đứng ngay trước B, cùng hàng hoặc hàng liền kề, cùng khối *(vd Quầy rồi Bàn · Ngày rồi Khung giờ · tra Thân nhân rồi chọn Người cai nghiện theo luồng `QD-297` · Người cai nghiện rồi Thân nhân đi cùng)*. Nguyên văn: *"Các dữ liệu có sự liên kết thì cần đặt cạnh nhau + theo thứ tự cái nào chọn trước thì để trước"*. Bổ sung cho `UX-B7` *(thứ tự Chi tiết theo Tạo)*

When to Use (Khi dùng):
- [Verified · Playbook_CreateEdit §2] Chọn bản ghi liên quan dùng thẻ bấm chọn, thẻ không đủ điều kiện thì khoá kèm lý do.
- [Based on Docs · blocks.jsx StudentListDemo] Hợp khi mỗi bản ghi cần hiện định danh, điều kiện và quỹ còn lại để người dùng chọn đúng.

When Not to Use (Khi không dùng):
- [Verified · Playbook_CreateEdit §4] Không dùng radio cho việc chọn bản ghi liên quan.
- [Based on Docs · catalog.jsx] Chọn 1 luồng xử lý thay vì 1 bản ghi thì dùng thẻ radio route-options.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Dòng tiêu đề khối: tiêu đề và cụm công cụ gồm Pm1SyncBar và VisitConditionsLink.
- [Verified · catalog.jsx] Mỗi thẻ: avatar chữ tắt, phần thân (tên, dòng CCCD và ngày sinh, cán bộ quản lý, lý do khoá) và ô quỹ bên phải.
- [Verified · blocks.jsx] Ô quỹ gồm số lớn và nhãn «quỹ thăm còn lại».
- [Verified · blocks.jsx] Thẻ đủ điều kiện có tag «Đủ điều kiện thăm gặp» cạnh tên.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Mở màn: chưa chọn thẻ nào.
- [Verified · catalog.jsx] Đang chọn: thẻ có lớp .is-selected.
- [Verified · blocks.jsx] Không đủ điều kiện: thẻ .is-locked và disabled, hiện lý do kèm icon, ô quỹ .is-exhausted.
- [Verified · UX-D9] Chọn lại đúng thẻ đang chọn thì giữ dữ liệu con. Đổi người thì quầy, giờ, buồng ở bước sau dựng lại.

Do (Nên):
- [Verified · UX-B9] Đặt khối này ngay sau khối tra cứu thân nhân vì danh sách chọn theo kết quả tra.
- [Verified · Playbook_CreateEdit §2] Nêu lý do khoá ngay trong thẻ.
- [Verified · UX-D9] Đổi trạng thái tại Chi tiết thì tính lại số liệu suy ra từ trạng thái như quỹ lượt tuần.

Don't (Không nên):
- [Based on Docs · Playbook_CreateEdit §2] Không ẩn thẻ không đủ điều kiện, khoá thẻ và nêu lý do để người dùng biết vì sao.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Mỗi thẻ là 1 AppButton nên bấm được bằng bàn phím, thẻ khoá dùng disabled.

UX Writing (Cách viết chữ):
- [Verified · blocks.jsx] Dòng định danh viết dạng «CCCD: … — Ngày sinh: …».
- [Based on Docs · blocks.jsx StudentListDemo] Lý do khoá viết thẳng nguyên nhân, ví dụ «Đã hết lượt thăm gặp trong tuần».

Lớp CSS:
- `.card-title-row` · biến thể: — · trạng thái: —
- `.card-title-tools` · biến thể: — · trạng thái: —
- `.student-list` · biến thể: — · trạng thái: —
- `.student-avatar` · biến thể: — · trạng thái: —
- `.student-body` · biến thể: — · trạng thái: —
- `.student-name` · biến thể: — · trạng thái: —
- `.status-note` · biến thể: — · trạng thái: —
- `.visit-block-reason` · biến thể: — · trạng thái: —

Thuộc tính `Pm1SyncBar`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `onSync` | function | — | Gọi khi bấm nút Đồng bộ lại, sau khi cập nhật giờ đồng bộ, không nhận đối số. |

### Ô chỉ đọc · ô ngày có lối tắt · tiêu đề con · nhắc chưa đủ · giá trị khoá (`schedule-fields`)


```jsx
// nguồn AppointmentForm.jsx (bước 2, Nguồn đặt lịch) — 2 khung đầu = trạng thái màn mở ra (chưa chọn ngày: hours-empty I001-74)
Loại hình thăm gặp* = AppSearchSelect uncontrolled · nút ngày «Chọn ngày hẹn» · .locked-value title «Nguồn đặt lịch của màn này là cố định, không đổi được»
.select-field.is-readonly > input.text-input[readOnly] · .date-row > AppButtonWithIcon.text-input.date-input(icon calendar, .date-icon) + a.quick-link
.form-grid-title · .hours-empty > SetupHint inline · .option-group > .locked-value
```

Quy tắc:
- UX-L8: Ô ngày, ô giờ bấm vào ⇒ PHẢI mở bảng chọn — ô khoảng ngày *(`.date-range` mở `.calendar`)* · ô khoảng giờ *(`components/app/TimeRangeInput.jsx` mở `.time-panel`)* · ô antd *(`.ant-picker-dropdown`)*
- UX-L14: Màn CHƯA CÓ DỮ LIỆU CẦN CÀI ĐẶT TRƯỚC ⇒ để trống vùng dữ liệu, hiện câu hướng dẫn kèm LINK mở thẳng màn cài đặt. `1` component chung `components/app/SetupHint.jsx`, message `I001-94` *«Chưa có {0} nào. Vui lòng cài đặt tại {1}»*, `{1}` là tên màn cài đặt hiển thị thành link. không vẽ khung lưới hoặc bảng rỗng không lời giải thích. Nguyên văn: *"Tớ muốn có quy tắc là nếu những màn hình nào mà chưa có dữ liệu cần cài đặt thì có mgs hướng dẫn và link đến trực tiếp màn hình đó"*. Áp đầu tiên: tab Lịch theo buồng chưa có buồng ⇒ link màn Buồng thăm gặp
- UX-B9: Trường có LIÊN KẾT đặt CẠNH nhau, trường chọn TRƯỚC đứng TRƯỚC — trường B lọc theo, tính từ hoặc chỉ mở khi đã có trường A ⇒ A đứng ngay trước B, cùng hàng hoặc hàng liền kề, cùng khối *(vd Quầy rồi Bàn · Ngày rồi Khung giờ · tra Thân nhân rồi chọn Người cai nghiện theo luồng `QD-297` · Người cai nghiện rồi Thân nhân đi cùng)*. Nguyên văn: *"Các dữ liệu có sự liên kết thì cần đặt cạnh nhau + theo thứ tự cái nào chọn trước thì để trước"*. Bổ sung cho `UX-B7` *(thứ tự Chi tiết theo Tạo)*

When to Use (Khi dùng):
- [Verified · Playbook_CreateEdit §2] Trường có giá trị cố định thì hiện khối chỉ đọc khoá cứng 1 giá trị, tooltip nói vì sao khoá.
- [Verified · Playbook_CreateEdit §4] Dùng ô chỉ đọc để hiện lại kết quả đã chọn ở nơi khác, ví dụ Khung giờ và Buồng thăm gặp chọn từ lưới.
- [Verified · UX-L14] Chưa có dữ liệu cần cài đặt trước thì dùng SetupHint kèm link mở thẳng màn cài đặt.

When Not to Use (Khi không dùng):
- [Verified · Playbook_CreateEdit §4] Không dùng radio cho trường có giá trị cố định.
- [Verified · UX-L14] Không vẽ khung lưới hoặc bảng rỗng không lời giải thích khi thiếu dữ liệu cài đặt.
- [Verified · UX-B7] Ở màn Sửa, trường không sửa được hiện dạng Xem (nhãn và giá trị), không dùng ô nhập xám.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Khối Nguồn đặt lịch: .option-group bọc .locked-value có icon dấu tích và giá trị.
- [Verified · blocks.jsx] Lưới form gồm Loại hình thăm gặp, Dãy nhà (chỉ đọc), Quầy tiếp đón, Ngày thăm gặp.
- [Verified · catalog.jsx] Ô ngày là nút .date-input có icon lịch, cạnh bên là link «Chọn ngày hôm nay».
- [Verified · blocks.jsx] Tiêu đề con .form-grid-title «Lịch theo buồng trong ngày» đứng trên lưới buồng.
- [Verified · catalog.jsx] Vùng .hours-empty chứa câu I001-74 hoặc SetupHint inline.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Mở màn: chưa chọn ngày, nút ngày hiện «Chọn ngày hẹn», vùng giờ hiện I001-74.
- [Verified · blocks.jsx] Chưa chọn người cai nghiện: ô Quầy tiếp đón khoá với chữ «Chọn người cai nghiện trước».
- [Verified · blocks.jsx] Đã chọn ngày: hiện lưới lịch theo buồng, câu hướng dẫn và 2 ô chỉ đọc Khung giờ, Buồng thăm gặp.
- [Verified · blocks.jsx] Quầy chưa có buồng: thay lưới bằng SetupHint có link mở màn cài đặt.
- [Verified · UX-L8] Bấm ô ngày phải mở bảng chọn trong 800ms, bảng chọn hiện trọn không bị khung cha cắt.

Do (Nên):
- [Verified · UX-B9] Đặt trường phụ thuộc ngay sau trường nó phụ thuộc, ví dụ Ngày rồi Khung giờ, Quầy rồi Buồng.
- [Verified · Playbook_CreateEdit §2] Ô phụ thuộc khoá kèm placeholder «Chọn {ô trước} trước».
- [Verified · UX-L14] Câu chờ cài đặt có đúng 1 link, trỏ tới route có thật.

Don't (Không nên):
- [Verified · UX-L14] Không vẽ khung nét đứt cho câu chờ cài đặt.
- [Verified · Playbook_CreateEdit §2] Không cho đổi giá trị ở khối khoá cứng.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Ô chỉ đọc dùng input readOnly kèm aria-label theo tên trường.
- [Verified · UX-D3] Lỗi của ô ngày nằm dưới ô, trên link «Chọn ngày hôm nay».
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Link «Chọn ngày hôm nay» đang là thẻ a không có href, cần bảo đảm bấm được bằng bàn phím.

UX Writing (Cách viết chữ):
- [Verified · catalog.jsx] Tooltip khối khoá nói lý do: «Nguồn đặt lịch của màn này là cố định, không đổi được».
- [Verified · blocks.jsx] Placeholder ô chỉ đọc chỉ cách chọn: «Chọn chỗ trống trên lịch».
- [Verified · UX-L14] I001-94 theo khuôn «Chưa có {0} nào. Vui lòng cài đặt tại {1}», {1} là link tới màn cài đặt.
- [Verified · Playbook_CreateEdit §4] Ngày hiển thị theo khuôn Thứ, dd/mm/yyyy.

Lớp CSS:
- `.locked-value` · biến thể: — · trạng thái: —
- `.select-field` · biến thể: — · trạng thái: `.is-readonly`
- `.text-input` · biến thể: — · trạng thái: `:disabled` `:focus`
- `.date-row` · biến thể: — · trạng thái: —
- `.date-icon` · biến thể: — · trạng thái: —
- `.quick-link` · biến thể: — · trạng thái: `:hover`
- `.form-grid-title` · biến thể: — · trạng thái: —
- `.hours-empty` · biến thể: — · trạng thái: —

### Bảng nhập nhiều dòng, nút thêm và xoá dòng (`companions`)


```jsx
// nguồn AppointmentForm.jsx (khối Thân nhân đi cùng)
AppTable tableClassName="people-table" · cột Thân nhân đi cùng là AppSearchSelect (chọn từ thân nhân đã liên kết, KHÔNG gõ tay, mỗi dòng bỏ người đã chọn ở dòng khác) · Quan hệ và CCCD là input disabled tự điền theo người được chọn · cột cuối AppButtonWithIcon.form-btn-remove · dưới bảng AppButtonWithIcon.form-btn-add (disabled + title khi đủ MAX_COMPANIONS)
```

Quy tắc:
- UX-L22: Ô nhập nằm TRONG BẢNG nhập liệu đệm trái `8px` cho gọn nhiều cột *(vd bảng Buồng thăm gặp ở màn Sửa quầy)*; ô nhập trong form giữ `12px`. Nút chính mọi nơi đệm `16px`, không quy tắc riêng theo ngữ cảnh (QD-372 ①)
- UX-L5: Nút icon cùng chức năng (cùng tooltip) ⇒ cùng kích thước trên MỌI màn

When to Use (Khi dùng):
- [Verified · Playbook_CreateEdit §2] Dùng cho người hoặc mục đi kèm cần nhiều dòng, mỗi dòng chọn từ danh sách và tự điền trường kèm theo.

When Not to Use (Khi không dùng):
- [Verified · Playbook_CreateEdit §4] Không cho nhập tay họ tên người đi kèm, dùng ô chọn thân nhân đã liên kết.
- [Based on Docs · catalog.jsx counter-tables] Đối tượng con cần thao tác riêng như vô hiệu hoá, kích hoạt thì dùng khuôn bảng buồng trong form Quầy.

Anatomy (Cấu tạo):
- [Verified · blocks.jsx] Thẻ khối có tiêu đề «Thân nhân đi cùng».
- [Verified · blocks.jsx] Bảng .people-table 5 cột: STT, Thân nhân đi cùng (ô chọn), Quan hệ, CCCD, nút xoá dòng.
- [Verified · catalog.jsx] Dưới bảng là nút .form-btn-add «Thêm thân nhân đi cùng».

Variants & States (Biến thể và trạng thái):
- [Verified · blocks.jsx] Mở màn: 1 dòng trống.
- [Verified · catalog.jsx] Chọn người: Quan hệ và CCCD tự điền, 2 ô này disabled.
- [Verified · UX-D9] Người đã chọn ở dòng này biến khỏi lựa chọn của dòng khác, đổi dòng thì trả lại.
- [Verified · UX-C3] Đủ MAX_COMPANIONS dòng: nút thêm khoá, rê chuột hiện lý do.
- [Verified · blocks.jsx] Xoá khi chỉ còn 1 dòng thì làm trống dòng đó thay vì bỏ dòng.

Do (Nên):
- [Verified · Playbook_CreateEdit §4] Báo giới hạn số lượng ở tooltip của nút đang khoá.
- [Verified · UX-L22] Ô nhập trong bảng đệm trái 8px.
- [Verified · UX-L5] Nút xoá dòng cùng kích thước với nút cùng tooltip ở mọi màn.
- [Verified · Playbook_CreateEdit §4] Chọn lại chủ thể thì đặt lại toàn bộ danh sách đi kèm.

Don't (Không nên):
- [Verified · UX-D9] Không để cùng 1 người xuất hiện ở 2 dòng.
- [Verified · UX-D8] Không dồn chữ đỏ của hàng sang cột khác, chữ đỏ nằm dưới đúng ô lỗi.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Ô Quan hệ và CCCD có aria-label theo tên cột.
- [Verified · AppButton.jsx] Nút xoá dòng chỉ có icon, tên đọc lấy từ title «Xóa dòng».

UX Writing (Cách viết chữ):
- [Verified · formActions.js] Tooltip khi đủ giới hạn: «Tối đa 03 thân nhân mỗi lượt thăm gặp (Điều 34 Thông tư 79)».
- [Verified · blocks.jsx] Dòng đầu của ô chọn là «Chọn thân nhân đi cùng».

### Chọn luồng dạng thẻ radio (`route-options`)


```jsx
// nguồn CounterRegistration/blocks.jsx · dữ liệu ROUTE_OPTIONS (@/data/approvalRoute)
.route-options[role=radiogroup] > button.route-option(.is-selected) > .route-radio + .route-text(.route-title .route-hint)
```

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Based on Docs · QD-297] Dùng khi người tạo phải chọn 1 trong vài luồng xử lý ngay từ đầu và mỗi luồng cần câu giải thích hệ quả.

When Not to Use (Khi không dùng):
- [Verified · Playbook_CreateEdit §4] Trường chỉ có 1 giá trị cố định thì dùng khối khoá giá trị, không dùng radio.
- [Verified · Playbook_CreateEdit §4] Chọn bản ghi liên quan thì dùng thẻ bấm chọn, không dùng radio.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] .route-options có role radiogroup, mỗi lựa chọn là button.route-option.
- [Verified · catalog.jsx] Mỗi thẻ gồm chấm radio .route-radio, tên luồng .route-title và câu gợi ý .route-hint.

Variants & States (Biến thể và trạng thái):
- [Verified · blocks.jsx] Mặc định chọn lựa chọn đầu tiên của ROUTE_OPTIONS.
- [Verified · blocks.jsx] Đang chọn: lớp .is-selected và aria-checked true.

Do (Nên):
- [Verified · catalog.jsx] Lấy lựa chọn từ ROUTE_OPTIONS, không chép tay chữ.
- [Verified · UX-L2] Giữ cùng hình dạng thẻ radio ở mọi màn có control này.

Don't (Không nên):
- [Based on Docs · Nielsen Norman Group · Checkboxes vs. Radio Buttons · GOV.UK Design System · Radios] Không dùng thẻ radio đứng 1 mình.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Mỗi thẻ có role radio và aria-checked, chấm radio có aria-hidden.
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Nhóm radiogroup chưa có aria-label và chưa hỗ trợ phím mũi tên, nên bổ sung.

UX Writing (Cách viết chữ):
- [Verified · approvalRoute.js] Tên luồng ngắn, nêu tình trạng của thân nhân, ví dụ «Thân nhân cần xin duyệt».
- [Verified · approvalRoute.js] Câu gợi ý nói hệ quả của luồng, ví dụ lịch vào Đã duyệt hay phải chờ Trưởng cơ sở duyệt.

Lớp CSS:
- `.route-options` · biến thể: — · trạng thái: —
- `.route-option` · biến thể: — · trạng thái: `:disabled` `:hover` `.is-selected`
- `.route-radio` · biến thể: — · trạng thái: —
- `.route-text` · biến thể: — · trạng thái: —
- `.route-title` · biến thể: — · trạng thái: —
- `.route-hint` · biến thể: — · trạng thái: —

### Bảng cấu hình theo ngày có công tắc (`config-days`)

- Component: `TimeRangeInput` (src/components/app/TimeRangeInput.jsx)

```jsx
// nguồn VisitConfig.jsx — gọi thẳng WEEKDAYS · defaultDirectConfig (mặc định thăm T4–T6)
AppTable tableClassName="vc-days" · .vc-switch > antd Switch · Ca sáng/Ca chiều = <TimeRangeInput /> · cột «Giờ nghỉ giữa các ca (phút)» input number · .vc-off «Không thăm gặp»
pageActions chế độ Sửa: { label: 'Lưu', className: 'form-btn form-btn-primary', iconRaw: '<polyline points="20 6 9 17 4 12"/>' }
```

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Based on Docs · VisitConfig.jsx] Dùng khi cấu hình theo từng ngày trong tuần, mỗi ngày bật tắt và có khung giờ riêng.
- [Verified · VisitConfig.jsx] Nút «Lưu» ở chế độ Sửa là nút chính .form-btn-primary, có icon dấu tích và chữ.

Anatomy (Cấu tạo):
- [Verified · blocks.jsx] Bảng .vc-days 5 cột: Thứ, Thăm gặp (công tắc), Ca sáng, Ca chiều, Giờ nghỉ giữa các ca (phút).
- [Verified · catalog.jsx] Ca sáng và Ca chiều dùng TimeRangeInput.
- [Verified · blocks.jsx] Mỗi ô nhập có chỗ chữ lỗi .field-error ngay dưới.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Mặc định theo cấu hình store: thăm gặp từ thứ 4 tới thứ 6.
- [Verified · blocks.jsx] Tắt công tắc: các ô của ngày đó thay bằng chữ «Không thăm gặp».
- [Verified · VisitConfig.jsx] Lưu làm lịch đã đặt nằm ngoài khung mới: mở popup C001-19 có nút «Lưu và hủy lịch» màu đỏ.
- [Verified · UX-L8] Ở chế độ Xem ô giờ không mở bảng chọn, phải bấm Chỉnh sửa trước.

Do (Nên):
- [Verified · UX-F7] Nút OK của popup là tên hành động thật, nút kia đúng chữ «Hủy».
- [Verified · UX-L2] Công tắc cùng trạng thái giữ 1 kiểu ở mọi màn.
- [Verified · UX-L8] Bấm ô giờ phải mở bảng chọn và bảng chọn hiện trọn.
- [Verified · blocks.jsx] Giờ nghỉ dùng ô số từ 0 tới 60, bước 5.

Don't (Không nên):
- [Verified · UX-F7] Không đặt nhãn nút OK là OK, Đồng ý hay Thực hiện.
- [Verified · UX-F7] Không để dấu ? trong tiêu đề popup.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Công tắc có aria-label «Thăm gặp {thứ}».
- [Verified · blocks.jsx] Ô giờ có nhãn đọc riêng cho giờ bắt đầu và giờ kết thúc của từng ca, từng ngày.
- [Verified · blocks.jsx] Ô giờ nghỉ có aria-label gồm tên cột và thứ.

UX Writing (Cách viết chữ):
- [Verified · PM2_MessageList C001-19] Tiêu đề popup xác nhận bắt đầu bằng «Xác nhận», ví dụ C001-19 «Xác nhận thay đổi khung giờ thăm gặp».
- [Verified · PM2_MessageList C001-19] Nội dung popup nêu hậu quả, số lịch bị ảnh hưởng in đậm.

Lớp CSS:
- `.vc-switch` · biến thể: — · trạng thái: —
- `.vc-off` · biến thể: — · trạng thái: —
- `.range-input` · biến thể: `.time-range-input` · trạng thái: `:focus` `.is-active` `.is-current`
- `.time-range-wrap` · biến thể: — · trạng thái: —
- `.date-range` · biến thể: `.time-range` · trạng thái: `:focus-within` `:hover` `.has-text` `.input-border-error` `.is-disabled`
- `.range-arrow` · biến thể: — · trạng thái: —
- `.time-panel` · biến thể: `.time-panel-cell` `.time-panel-head` · trạng thái: —
- `.time-panel-col` · biến thể: — · trạng thái: —

Thuộc tính `TimeRangeInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `from` | string | — | Giờ bắt đầu dạng `HH:mm` hiện ở nửa trái, sai dạng thì bảng chọn không đánh dấu ô nào. |
| `to` | string | — | Giờ kết thúc dạng `HH:mm` hiện ở nửa phải, sai dạng thì bảng chọn không đánh dấu ô nào. |
| `onChange` | function | — | Gọi khi gõ hoặc chọn giờ, nhận nửa đang sửa (`from` hoặc `to`) và chuỗi giá trị mới chưa chuẩn hoá. |
| `disabled` | boolean | — | Khoá cả 2 ô nhập, thêm lớp `is-disabled` và đóng bảng chọn giờ đang mở. |
| `invalid` | boolean | — | Bật viền lỗi bằng lớp `input-border-error` cho khung khoảng giờ. |
| `idPrefix` | string | — | Tiền tố id, sinh id `{tiền tố}-from`, `{tiền tố}-to` và `{tiền tố}-panel`, bỏ trống thì không gán id. |
| `labelFrom` | string | — | Nhãn đọc và title của ô giờ bắt đầu, cũng là nhãn bảng chọn khi đang chọn giờ bắt đầu. |
| `labelTo` | string | — | Nhãn đọc và title của ô giờ kết thúc, cũng là nhãn bảng chọn khi đang chọn giờ kết thúc. |

### Bảng lịch sử thao tác (`history`)

- Component: `HistoryTable`, `AppTag` (src/components/app/AppTag.jsx)

```jsx
import HistoryTable from '@/pages/ReceptionDeskShared/HistoryTable'
<HistoryTable history={rows} renderStatus={(s) => <AppTag …/>} />  // row: { action, statusBefore, statusAfter, reason, changes, note } · 10 mốc, Xem thêm tải tiếp
```

Quy tắc:
- UX-G2: Mọi bảng có khung viền bọc bo góc, GÓC liền màu tiêu đề — áp cho bảng danh sách, bảng trong form, Chi tiết và popup. Có thanh cuộn dọc thì vùng phía trên thanh cuộn tô liền màu dòng tiêu đề cột, thanh cuộn mảnh và chạy từ dưới dòng tiêu đề *(khuôn gốc `.shell-body.tbl` ở `styles/base.css`)*. Nguyên văn: *"Bo góc bảng"* và *"Góc bảng màn danh sách liền màu tiêu đề ==> Add vào nhé"* *(sửa `09/10/2026`, bản cũ chỉ ghi bo `8px`, kiểm bằng mắt)*. *(20/10/2026, `Verified (TrangNT5 20/10/2026 · PM2 QD-444)`)* Gạch ngăn dòng dữ liệu dùng CHUNG 1 mã `--color-row-line` `#E5E7EB` *(khai ở `pm1-look.css`)* cho ô bảng, khối nhãn và giá trị ở màn Chi tiết, dòng danh sách thông báo — không khai thẳng màu xám khác cho gạch ngăn dòng. Viền khung, thẻ, ô nhập vẫn `--color-line`. Nguyên văn: *"gạch xám này toàn hệ thống có dùng chung 1 mã không"* · *"D2 A dùng theo màn chi tiết ấy"*

When to Use (Khi dùng):
- [Verified · Playbook_ViewDetail §1] Dùng ở mọi màn Chi tiết, mỗi thao tác đã lưu sinh 1 dòng.
- [Verified · Playbook_ViewDetail §1] Thông tin giải trình như bỏ qua điều kiện ghi thành 1 dòng ở Lịch sử thao tác, không thêm tab riêng.
- [Based on Docs · PM1 DS › Khuôn màn hình › Khuôn màn Xem chi tiết] Bắt buộc với màn có chuyển trạng thái, gồm Trạng thái, Người thực hiện, Thời gian, Nội dung action.

When Not to Use (Khi không dùng):
- [Verified · UX-B8] Không trộn lịch sử với thông tin chung trong 1 khối.
- [Verified · QD-438] Không ghi ghi chú hệ thống vào Lý do, ý kiến; mục đó chỉ chứa lời người dùng nhập.

Anatomy (Cấu tạo):
- [Verified · QD-421 · HistoryTable.jsx] Dòng hoạt động (timeline) kiểu GitHub, Jira, Linear, mới nhất trên cùng; không dùng bảng nhiều cột.
- [Verified · HistoryTable.jsx] Mỗi mốc: chấm màu theo loại thao tác · tên thao tác + trạng thái trước → sau · người thực hiện và vai trò · thời điểm bên phải.
- [Verified · QD-438] Thẻ dưới mốc có tối đa 3 mục theo thứ tự: Lý do, ý kiến (lời người dùng nhập) · Nội dung thay đổi (mỗi trường 1 dòng Trường | Trước → Sau) · Ghi chú hệ thống (ghi chú tự sinh, chữ xám).
- [Verified · QD-433] Thang chữ: tên thao tác 14px/600 · người và thời điểm 12px · tiêu đề mục 11px/600 in hoa · nội dung 13px/400 · giá trị mới 13px/500.

Variants & States (Biến thể và trạng thái):
- [Verified · QD-421] Hiện 10 mốc, nút Xem thêm tải thêm 10, cuộn tới cuối thì tự tải; không phân trang.
- [Verified · QD-421] Nội dung thay đổi quá 2 trường thì gập, kèm nút Xem thêm n thay đổi.
- [Verified · QD-432] Trường có giá trị cũ trùng giá trị mới thì không hiện; trạng thái trước trùng sau thì chỉ hiện 1 tag.
- [Verified · QD-434] Giá trị cũ trống hiện chữ «Trống» nghiêng màu nhạt → giá trị mới.
- [Verified · HistoryTable.jsx] Chưa có mốc nào: EmptyRow với I001-27.
- [Verified · HistoryTable.jsx] Thao tác phá huỷ chấm đỏ, tạo mới chấm xanh lá, còn lại chấm xanh dương.

Do (Nên):
- [Verified · QD-438] Thay đổi dữ liệu (kể cả quầy tiếp đón) ghi ở Nội dung thay đổi; quầy khác quầy mặc định thì thêm «(chọn tay)», chỉ ghi khi quầy thật sự đổi.
- [Verified · QD-438] Thông báo đã gửi, chưa gửi được, đề xuất lịch thay thế, nhắc lịch ghi ở Ghi chú hệ thống.
- [Verified · HistoryTable.jsx] Truyền renderStatus để vẽ tag trạng thái đúng loại bản ghi.
- [Verified · HistoryTable.jsx] Thời điểm theo định dạng DD/MM/YYYY HH:mm:ss.
- [Verified · QD-434] Tab chỉ có khối lịch sử thì không bọc viền.

Don't (Không nên):
- [Verified · Playbook_ViewDetail §3] Không ghi mã nội bộ trong mô tả lịch sử.
- [Verified · QD-438] Không tự thêm mục ngoài 3 mục Lý do, ý kiến · Nội dung thay đổi · Ghi chú hệ thống.

Accessibility (Truy cập và bàn phím):
- [Verified · HistoryTable.jsx] Danh sách là thẻ ol có aria-label «Lịch sử thao tác»; mũi tên đổi giá trị là role img kèm aria-label «đổi thành».

UX Writing (Cách viết chữ):
- [Based on Docs · blocks.jsx HistoryDemo] Tên thao tác dùng động từ nghiệp vụ, ví dụ Tạo mới, Chỉnh sửa, Kích hoạt.
- [Based on Docs · Playbook_ViewDetail §3] Vai trò người thực hiện theo thuật ngữ nghiệp vụ đã chốt của chức năng.
- [Based on Docs · PM1 DS › Thẻ trạng thái › Nhật ký — chỉ hành động PHÁ HUỶ mang màu] Hành động phá huỷ chỉ gồm Xóa, Huỷ, Trả lại, Thu hồi, không mở rộng thêm.

Thuộc tính `AppTag`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `className` | string | `''` | Lớp màu của tag, ghép sau lớp `app-reset` trên Tag của antd. |
| `children` | ReactNode | — | Nội dung hiển thị bên trong tag. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Bảng cài đặt có công tắc khoá và cụm nút thao tác (`settings-rows`)


```jsx
// nguồn NotificationSettings.jsx — gọi thẳng readNotificationSettings · GROUPS · SEND_TYPE_LABELS · timeConditionText
.card > h2.card-title (tên nhóm) + .ns-table-wrap > AppTable.ns-table · cột Mã 300px · Gửi khi nào 220px
.ns-switch(.is-locked + data-tip) > antd Switch disabled · cột Thao tác .col-act > .acts > AppButtonWithIcon.ib
```

Quy tắc:
- UX-L5: Nút icon cùng chức năng (cùng tooltip) ⇒ cùng kích thước trên MỌI màn
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Based on Docs · NotificationSettings.jsx] Dùng cho bảng cài đặt chia theo nhóm, mỗi dòng có công tắc bật tắt và nút xem, sửa.
- [Verified · QD-366] Bảng chỉ giữ cột ngắn: Mã thông báo, Tên thông báo, Gửi khi nào, Bật/Tắt.

When Not to Use (Khi không dùng):
- [Verified · QD-366] Không đưa thông tin dài như nội dung mẫu, danh sách người nhận vào bảng, để ở màn hoặc popup Chi tiết.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Mỗi nhóm là 1 .card có tiêu đề là tên nhóm.
- [Verified · blocks.jsx] Bảng .ns-table: STT, Mã thông báo 300px, Tên thông báo, Gửi khi nào 220px, Bật/Tắt, Thao tác.
- [Verified · blocks.jsx] Cột Thao tác là cụm .acts gồm nút Xem chi tiết và Chỉnh sửa.

Variants & States (Biến thể và trạng thái):
- [Verified · blocks.jsx] Công tắc bật hoặc tắt theo dữ liệu của dòng.
- [Verified · catalog.jsx] Thông báo bắt buộc: công tắc disabled trong .ns-switch.is-locked, rê chuột hiện lý do.

Do (Nên):
- [Verified · UX-L5] Nút icon cùng chức năng giữ cùng kích thước ở mọi màn.
- [Verified · Playbook_List §3] Màu icon theo ý nghĩa (Xem xanh, Sửa cam), lấy từ lớp .ib-* chung ở base.css.
- [Verified · UX-L2] Công tắc cùng trạng thái giữ 1 kiểu giữa mọi màn.

Don't (Không nên):
- [Verified · Playbook_List §3] Không khai lại hoặc ghi đè màu icon thao tác trong CSS riêng của màn.
- [Verified · UX-L5] Không ép nút trong cột Thao tác co nhỏ lại.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Công tắc có aria-label «Bật hoặc tắt thông báo {mã}».
- [Verified · blocks.jsx] Nút icon có aria-label kèm mã dòng, ví dụ «Xem chi tiết thông báo {mã}».

UX Writing (Cách viết chữ):
- [Verified · NotificationSettings.jsx] Lý do khoá: «Thông báo bắt buộc, không tắt được».

Lớp CSS:
- `.card` · biến thể: — · trạng thái: —
- `.ns-table-wrap` · biến thể: — · trạng thái: —
- `.ns-switch` · biến thể: — · trạng thái: `.is-locked`
- `.col-act` · biến thể: — · trạng thái: —
- `.acts` · biến thể: — · trạng thái: —

### Thông tin chi tiết dạng nhãn–giá trị, nút nguy hiểm viền (`detail-info`)


```jsx
// nguồn AppointmentDetail.jsx (pageActions · InfoGrid «Thông tin lịch hẹn»)
<PageHeadActions actions={[Phê duyệt · Từ chối duyệt · Chỉnh sửa · Xóa · Hủy lịch hẹn]} />  // đúng thứ tự, mỗi nút có icon; màn chỉ hiện nút theo quyền và trạng thái
Xóa · Hủy: className="form-btn form-btn-danger is-outline" · Phê duyệt: form-btn-primary dt-approve
.adjust > .adjust-label + .adjust-value (InfoTag .adjust-tag + lớp màu danh mục · trống ⇒ «—» màu --color-ink-4)
```

Quy tắc:
- UX-B8: Dữ liệu khác loại ⇒ tách thành KHỐI riêng, mỗi khối `1` thẻ `.card` có tiêu đề `.card-title` — không trộn thông tin của `2` đối tượng *(vd người nghiện và thân nhân, quầy và bàn)* hoặc `2` nhóm nghiệp vụ *(thông tin chung và lịch sử)* trong `1` khối. Nguyên văn: *"Các khối data khác nhau khi hiển thị cần tách khối, tránh để lẫn lộn khó hiểu"*. Khối bọc viền, tên trên viền theo `UX-B11` *(ĐỔI 19/10/2026, QD-431 ⑤ thay trải phẳng)*. Ngoại lệ *(19/10/2026, QD-420 ⑩)*: khối là nội dung DUY NHẤT của `1` tab mà tiêu đề khối trùng tên tab *(tab Lịch sử thao tác ở Chi tiết lịch hẹn, Chi tiết quầy)* ⇒ bỏ tiêu đề khối, tên tab đóng vai tiêu đề. Nguyên văn: *"Màn hình Lịch sử hoạt động bỏ tên màn hình vì trùng lặp"*
- UX-F7: Popup `2` nút theo khuôn chung `MSG-CF` — nút hủy đúng chữ `Hủy` *(riêng rời trang `MSG-CF-03`: `Ở lại trang`)* · nút OK là tên hành động thật, không `OK` `Đồng ý` `Thực hiện` · tiêu đề không dấu `?` · popup xác nhận *(có icon cạnh tiêu đề `UX-F4`, hoặc `Modal.confirm`)* tiêu đề bắt đầu `Xác nhận`, trừ danh sách ngoại lệ khai trong cổng *(`Thay đổi chưa lưu` của `MSG-CF-03`)* · hộp Xóa và Vô hiệu hóa: nội dung là CÂU HỎI `Bạn có chắc chắn muốn …?` kèm cảnh báo hậu quả *(SỬA 09/10/2026 theo PM2 `QD-350` `QD-352` — luật cũ cấm `Bạn có chắc` NGƯỢC quyết định TrangNT5, hết hiệu lực)* · nút có chữ `Xóa` phải đỏ *(danger)*

When to Use (Khi dùng):
- [Verified · Playbook_ViewDetail §5] Dùng ở màn Chi tiết và bước xác nhận của màn Tạo để hiện dữ liệu dạng nhãn và giá trị.
- [Verified · catalog.jsx] Nút Xóa và Hủy ở thanh nút đầu trang Chi tiết dùng kiểu nguy hiểm viền form-btn-danger is-outline.
- [Based on Docs · PM1 DS › Khuôn màn hình › Khuôn màn Xem chi tiết] Đặt 4 trường audit chỉ đọc ở cuối khối thông tin chung: Người tạo, Thời gian tạo, Người cập nhật, Thời gian cập nhật.
- [Based on Docs · PM1 DS › Thẻ & vùng chứa › Bảng thuộc tính] Bảng thuộc tính có nhãn rộng cố định 200px nền xám nhạt.

When Not to Use (Khi không dùng):
- [Verified · UX-B8] Không trộn thông tin của 2 đối tượng hoặc 2 nhóm nghiệp vụ trong 1 khối.
- [Verified · Playbook_ViewDetail §1] Không lặp dòng Trạng thái trong khối, trạng thái chỉ ở tag cạnh tiêu đề.
- [Based on Docs · PM1 DS › Khuôn màn hình › Khuôn màn Xem chi tiết] Màn tổng hợp hoặc tính toán không áp 4 trường audit.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] Thanh nút đầu trang PageHeadActions theo thứ tự Phê duyệt, Từ chối duyệt, Chỉnh sửa, Xóa, Hủy lịch hẹn, mỗi nút có icon.
- [Verified · catalog.jsx] Khối .card có tiêu đề, ví dụ «Thông tin lịch hẹn».
- [Verified · catalog.jsx] Lưới .adjust gồm từng cặp .adjust-label và .adjust-value.
- [Verified · Playbook_ViewDetail §1] Giá trị chọn từ danh mục hiện tag .adjust-tag với lớp màu danh mục, ngày và khung giờ là chữ thường.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Giá trị trống hiện «—» màu --color-ink-4.
- [Verified · catalog.jsx] Màn thật chỉ hiện nút theo quyền và trạng thái của bản ghi.
- [Based on Docs · PM1 DS › Thẻ & vùng chứa › Bảng thuộc tính] Dưới 900px nhãn xuống dòng nằm trên giá trị.
- [Based on Docs · PM1 DS › Kiểu chữ › Ba quy tắc chữ sinh từ bug] Giá trị nhiều dòng dùng white-space pre-wrap để giữ đúng xuống dòng và thụt đầu dòng người dùng đã nhập.
- [Based on Docs · PM1 DS › Khuôn màn hình › Khuôn màn Xem chi tiết] Khối 4 trường audit canh thẳng lưới với các trường phía trên.
- [Verified · QD-434] Nhãn và giá trị (kể cả tag) căn giữa theo chiều dọc, khối kết thúc bằng lưới nhãn – giá trị đệm đáy 4px

Do (Nên):
- [Verified · UX-B7] Giữ thứ tự khối và trường giống hệt màn Tạo.
- [Verified · UX-L9] Thanh nút đầu trang và chân trang là 1 cặp dựng từ PageActions.
- [Verified · Playbook_ViewDetail §2] Nhãn chữ thường, giá trị đậm, chỉ có vạch ngang.
- [Verified · Playbook_ViewDetail §1] Bỏ thông tin đã có ở tiêu đề, ví dụ mã bản ghi.

Don't (Không nên):
- [Verified · Playbook_ViewDetail §4] Không hiện nút thao tác không hợp lệ ở trạng thái hiện tại.
- [Verified · Playbook_ViewDetail §2] Không dùng vạch dọc giữa nhãn và giá trị.

Accessibility (Truy cập và bàn phím):
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Nút Xóa và Hủy có chữ và icon nên không chỉ dựa vào màu đỏ để báo mức nguy hiểm.

UX Writing (Cách viết chữ):
- [Verified · UX-F7] Nút có chữ Xóa phải màu đỏ.
- [Verified · UX-F7] Hộp Xóa hỏi «Bạn có chắc chắn muốn …?» kèm cảnh báo hậu quả.
- [Based on Docs · blocks.jsx DetailInfoDemo] Ngày hiển thị dạng «Thứ Tư, 14/10/2026», khung giờ dạng «09:15 ~ 10:00».

Lớp CSS:
- `.form-btn` · biến thể: `.form-btn-add` `.form-btn-danger` `.form-btn-primary` `.form-btn-remove` `.form-btn-success` `.form-btn-warning` · trạng thái: `:active` `:hover` `.is-outline`
- `.adjust` · biến thể: `.adjust-frame` `.exempt-info` · trạng thái: —
- `.adjust-label` · biến thể: — · trạng thái: —
- `.adjust-value` · biến thể: — · trạng thái: —
- `.adjust-tag` · biến thể: `.tag-category` `.tag-penalty` `.tag-table` `.tag-type` `.tag-visit-other` `.tag-visit-standard` `.tag-wrap` · trạng thái: —

### Nhắc thiếu thông tin trước khi lưu (`missing-hint`)


```jsx
// nguồn AppointmentForm.jsx (#nhacThieu)
<div className={'missing-hint' + (đủ ? ' is-enough' : '')}> icon + msg('W001-12', các ô thiếu) | msg('I001-81') </div>
```

Quy tắc:
- UX-E1: Mọi thông báo đi qua `1` toast chung

When to Use (Khi dùng):
- [Verified · Playbook_CreateEdit §1] Dùng ở chân mỗi bước form, ngay trên thanh nút, để nói còn thiếu trường nào.

When Not to Use (Khi không dùng):
- [Verified · Playbook_CreateEdit §4] Bước xác nhận thì ẩn dải nhắc.
- [Verified · Playbook_CreateEdit §3] Không dùng dải nhắc thay cho chữ đỏ dưới ô, khi bấm nút lúc thiếu thì cả 2 cùng hiện.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] .missing-hint gồm icon và câu, đủ thì thêm lớp .is-enough.

Variants & States (Biến thể và trạng thái):
- [Verified · Playbook_CreateEdit §3] Còn thiếu: dải vàng với W001-12 liệt kê các trường thiếu.
- [Verified · Playbook_CreateEdit §3] Đã đủ: dải xanh với I001-81 và icon dấu tích.
- [Verified · Playbook_CreateEdit §4] Dải luôn hiện, đổi màu vàng sang xanh chứ không ẩn.

Do (Nên):
- [Verified · Playbook_CreateEdit §3] Nút Tiếp tục luôn bấm được, bấm khi thiếu thì chữ đỏ dưới mọi ô thiếu và cuộn tới lỗi đầu.
- [Verified · UX-D9] Câu nhắc nói đúng thứ đang thiếu, sửa xong ô nào thì ô đó rời khỏi câu.

Don't (Không nên):
- [Verified · Playbook_CreateEdit §4] Không khoá nút để báo thiếu.
- [Verified · Playbook_CreateEdit §5] Không để dấu chấm cuối câu «Đã đủ điều kiện đi tiếp».
- [Verified · UX-L12] Không để dấu lọt ra màn hình khi in đậm tên trường.

Accessibility (Truy cập và bàn phím):
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Dải đổi nội dung theo thao tác nhập nên đặt aria-live polite để trình đọc màn hình báo.

UX Writing (Cách viết chữ):
- [Verified · PM2_MessageList W001-12] W001-12: «Cần chọn đủ thông tin để tiếp tục: {0}», {0} là danh sách trường thiếu, in đậm.
- [Verified · Playbook_CreateEdit §3] Trường đầu tiên sau dấu : viết hoa, các trường sau viết thường.
- [Verified · PM2_MessageList I001-81] I001-81: «Đã đủ điều kiện đi tiếp».

Lớp CSS:
- `.missing-hint` · biến thể: — · trạng thái: `.is-enough` `.is-hidden-block`

### Bảng buồng nhập thẳng trong form Quầy (`counter-tables`)


```jsx
// nguồn ReceptionDeskForm.jsx (tablesCard · #banVung) — CSS riêng ReceptionDeskForm.css
.capacity-head > h2.card-title + .capacity-spacer + .form-btn «Thêm buồng»
AppTable tableClassName="capacity-table reserved-table qb-table" · 6 cột: Mã buồng* (AppCounterInput CODE_MAX, khoá sau khi tạo) · Tên hiển thị* (AppCounterInput 100) · Số chỗ ngồi* (1 đến 10) · Có vách ngăn (.chk-dong.qb-ctl) · Trạng thái (CatalogStatusTag) · thao tác (buồng mới ⇒ Xóa buồng · đã dùng ⇒ Vô hiệu hóa ⇄ Kích hoạt)
ô nhập trong bảng đệm 8px (UX-L22)
```

Quy tắc:
- UX-L22: Ô nhập nằm TRONG BẢNG nhập liệu đệm trái `8px` cho gọn nhiều cột *(vd bảng Buồng thăm gặp ở màn Sửa quầy)*; ô nhập trong form giữ `12px`. Nút chính mọi nơi đệm `16px`, không quy tắc riêng theo ngữ cảnh (QD-372 ①)
- UX-L11: Dấu `*` trường bắt buộc luôn màu ĐỎ báo lỗi `var(--color-err)` `#DC2626` — không lấy màu thương hiệu *(màu thương hiệu đổi thì dấu `*` đổi theo, sai nghĩa)*. `1` lớp chung `.required-mark` cho form, popup và bộ lọc. Nguyên văn: *"Ô vãi dấu * bắt buộc cần màu đỏ nhá"*. Đo `09/10/2026` trước khi sửa: `45` dấu `*` trên `8` màn đang xanh `#076DB6`

When to Use (Khi dùng):
- [Verified · UX-L18] Dùng khi đối tượng con (buồng) được quản lý ngay trong màn của đối tượng cha (quầy).

When Not to Use (Khi không dùng):
- [Verified · UX-L18] Không dựng màn danh sách hay màn Sửa riêng cho đối tượng con.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] .capacity-head gồm tiêu đề «Buồng thăm gặp» bên trái và nút «Thêm buồng» bên phải.
- [Verified · catalog.jsx] Bảng 6 cột: Mã buồng*, Tên hiển thị*, Số chỗ ngồi*, Có vách ngăn, Trạng thái, thao tác.
- [Verified · codeFormat.js] Mã buồng và Tên hiển thị dùng AppCounterInput, tối đa 10 và 100 ký tự.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Buồng mới: mã sửa được, cột thao tác có nút Xóa buồng.
- [Verified · blocks.jsx] Buồng đã dùng: mã khoá với tooltip «Không thể sửa mã sau khi tạo», nút Vô hiệu hóa hoặc Kích hoạt theo trạng thái.
- [Verified · UX-G8] Quầy chưa có buồng: bảng trống với EmptyRow «Chưa có buồng thăm gặp nào».
- [Verified · catalog.jsx] Số chỗ ngồi nhận từ 1 đến 10.

Do (Nên):
- [Verified · UX-L22] Ô nhập trong bảng đệm trái 8px.
- [Verified · UX-L11] Dấu * bắt buộc màu đỏ #DC2626 qua lớp .required-mark.
- [Verified · blocks.jsx] Mã buồng tự đổi sang chữ in hoa khi gõ.
- [Based on Docs · QD-355] Dòng trùng thì chữ đỏ ở cả 2 dòng, câu nêu đích danh giá trị trùng.

Don't (Không nên):
- [Verified · UX-D8] Không dồn chữ đỏ sang cột khác, chữ đỏ nằm dưới đúng ô lỗi.
- [Verified · catalog.jsx] Không cho xoá buồng đã dùng, chỉ cho Vô hiệu hóa.

Accessibility (Truy cập và bàn phím):
- [Verified · blocks.jsx] Nút thao tác chỉ có icon có aria-label trùng tên thao tác.

UX Writing (Cách viết chữ):
- [Verified · codeFormat.js] Tooltip ô mã mới nói định dạng: «Chữ cái in HOA, số, dấu gạch ngang và gạch dưới».
- [Verified · blocks.jsx] Placeholder gợi ví dụ hoặc khoảng giá trị: «Ví dụ: Buồng số 01», «1 đến 10».

Lớp CSS:
- `.capacity-head` · biến thể: — · trạng thái: —
- `.capacity-spacer` · biến thể: — · trạng thái: —
- `.form-btn` · biến thể: `.form-btn-danger` `.form-btn-primary` `.form-btn-success` `.form-btn-warning` · trạng thái: `:active` `:hover` `.is-outline`
- `.chk-dong` · biến thể: — · trạng thái: —

## Nhập liệu

### Ô nhập chữ (`text-input`)


```jsx
<input className="text-input" placeholder="Nhập …" />  // ô có giới hạn ký tự ⇒ AppCounterInput · ô trong bảng nhập liệu đệm 8px (UX-L22)
```

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn
- UX-L22: Ô nhập nằm TRONG BẢNG nhập liệu đệm trái `8px` cho gọn nhiều cột *(vd bảng Buồng thăm gặp ở màn Sửa quầy)*; ô nhập trong form giữ `12px`. Nút chính mọi nơi đệm `16px`, không quy tắc riêng theo ngữ cảnh (QD-372 ①)

When to Use (Khi dùng):
- [Verified · UX-L1] Ô nhập chữ 1 dòng trong form Tạo/Sửa dựng bằng lớp text-input dùng chung.
- [Verified · UX-L22] Ô nhập nằm trong bảng nhập liệu (vd bảng Buồng thăm gặp ở màn Sửa quầy) cũng dùng text-input, đệm trái 8px.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Giá trị mặc định khi đặc tả không nói gì] Mã nhập tay tối đa 10 ký tự, chỉ nhận A–Z, 0–9, gạch ngang, gạch dưới, tự viết HOA.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Giá trị mặc định khi đặc tả không nói gì] Mã không trùng và không sửa được sau khi tạo, ở màn Cập nhật luôn chỉ đọc.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Giá trị mặc định khi đặc tả không nói gì] Kiểm trùng trim 2 đầu, không phân biệt hoa thường, chỉ xét bản ghi chưa xóa mềm.

When Not to Use (Khi không dùng):
- [Verified · UX-L7] Ô có giới hạn ký tự trong form Tạo/Sửa thì dùng AppCounterInput để có bộ đếm n / max.
- [Verified · UX-L6] Ô tìm từ khoá ở danh sách dùng AppSearchInput, không dùng ô nhập trần.
- [Verified · Playbook_CreateEdit §2] Trường có giá trị cố định không dùng ô nhập mà hiện khối chỉ đọc khoá cứng 1 giá trị.
- [Verified · Playbook_CreateEdit §5] Người hoặc mục đi kèm thì dùng ô chọn, không cho nhập tay.
- [Based on Docs · PM1 DS › Quy tắc & cấm kỵ] Không để trường text thiếu maxlength vì QC không viết được ca kiểm độ dài.
- [Based on Docs · PM1 DS › Khuôn màn hình › Khuôn màn Tạo mới / Cập nhật] Enum hữu hạn phải là ô chọn hoặc radio, không được là ô nhập tự do.

Anatomy (Cấu tạo):
- [Verified · UX-L11] Nhãn trường .field-label, trường bắt buộc có dấu * màu đỏ #DC2626 qua lớp .required-mark.
- [Verified · UX-L1 · UX-D1] Khung ô cao 36, bo 8, viền 1px #E5E7EB, chữ 14/400.
- [Verified · UX-D3] Chữ đỏ báo lỗi nằm ngay dưới khung ô, sát mép trái 0px, cách mép dưới ô đúng 4px.

Variants & States (Biến thể và trạng thái):
- [Verified · UX-L1 · UX-L22] Mặc định: viền 1px #E5E7EB, đệm trái 12px khi ô nằm ngoài bảng.
- [Verified · UX-D2] Lỗi: viền đỏ và chữ đỏ dưới ô, nhập lại thì chữ đỏ của ô đó tắt.
- [Verified · UX-A14 · ngoại lệ D31] Khoá: ô Mã ở màn Sửa giữ màu khoá xám, là ngoại lệ đã chốt của luật tương phản 4.5:1.
- [Verified · UX-L22] Trong bảng nhập liệu: đệm trái 8px để gọn nhiều cột.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Giá trị mặc định khi đặc tả không nói gì] Đặc tả không nói gì thì ô chữ 1 dòng tối đa 100 ký tự, chặn nhập khi chạm giới hạn, dán quá thì tự cắt.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Giá trị mặc định khi đặc tả không nói gì] Đặc tả không nói gì thì ô nhiều dòng tối đa 1.000 ký tự, bộ đếm ở góc phải nhãn.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Giá trị mặc định khi đặc tả không nói gì] Ô bắt buộc nhập toàn dấu cách vẫn báo lỗi bắt buộc, trim trước khi kiểm.

Do (Nên):
- [Verified · UX-L1 · UX-L2] Dùng đúng lớp text-input dùng chung, mọi màn cùng 1 hình dạng.
- [Verified · UX-B2] Cho ô giãn hết cột của lưới 12 cột, muốn hẹp thì đổi số cột.
- [Verified · UX-D2] Bấm lưu khi còn thiếu thì hiện chữ đỏ dưới MỌI ô bắt buộc còn trống, không chỉ ô đầu.

Don't (Không nên):
- [Verified · UX-B2] Không gán max-width cho ô.
- [Verified · UX-L3] Không ép kích thước control bằng !important.
- [Verified · UX-L23] Không đặt kiểu ô dùng chung trong CSS riêng của 1 màn.

Accessibility (Truy cập và bàn phím):
- [Verified · UX-A14] Chữ giá trị ở ô khoá, ô chỉ đọc nên đạt tương phản từ 4.5:1 trở lên với nền thật.
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Nhãn .field-label nên gắn với ô (label for hoặc bọc) để trình đọc màn hình đọc được tên trường.
- [Based on Docs · WAI-ARIA APG › Keyboard Interface] Tab vào ô, gõ chữ; Shift+Tab lùi về ô trước.

UX Writing (Cách viết chữ):
- [Verified · I001-35] Placeholder theo khuôn I001-35 «Nhập {0}», {0} là tên trường.
- [Verified · I001-36] Ô cần ví dụ minh hoạ dùng khuôn I001-36 «Ví dụ: {0}».
- [Verified · E001-01 · UX-A9] Bỏ trống ô bắt buộc báo E001-01 «Vui lòng nhập {0}», tên trường giữa câu viết thường chữ đầu.

Lớp CSS:
- `.text-input` · biến thể: — · trạng thái: `:disabled` `:focus`

### Ô nhập nhiều dòng (`multi-line-text`)

- Component: `AppCounterInput` (src/components/app/AppCounterInput.jsx)

```jsx
<AppCounterInput multiline maxLength={1000} value={v} onChange={(e) => setV(e.target.value)} placeholder="Nhập ghi chú" />   // bộ đếm ở hàng chân dưới ô, lỗi đặt bên trái bộ đếm qua error
```

Quy tắc:
- UX-L7: Ô nhập chữ có giới hạn ký tự trong form Tạo/Sửa ⇒ PHẢI có bộ đếm `n / max` — dựng bằng `components/app/AppCounterInput.jsx` *(ô `1` dòng: bộ đếm trong ô sát phải · textarea: dưới ô canh phải)*, không màn tự dựng bộ đếm

When to Use (Khi dùng):
- [Verified · UX-D5] Ô ghi chú, lý do dài dùng dạng nhiều dòng, tối đa 1000 ký tự.
- [Verified · UX-L7 · UX-D5] Bộ đếm «n / max» nằm ở hàng chân dưới ô, canh phải, dựng bằng AppCounterInput multiline.

When Not to Use (Khi không dùng):
- [Verified · UX-L7] Nội dung ngắn 1 dòng (tên, mã) dùng ô 1 dòng; ô có giới hạn ký tự thì bộ đếm nằm trong ô sát phải.
- [Verified · UX-D5] Không ràng buộc số ký tự tối thiểu.

Lớp CSS:
- `.app-counter` · biến thể: — · trạng thái: —
- `.app-counter-wrap` · biến thể: — · trạng thái: `.is-multiline`
- `.text-input` · biến thể: — · trạng thái: `:disabled` `:focus`
- `.app-counter-foot` · biến thể: — · trạng thái: —

Thuộc tính `AppCounterInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `multiline` | boolean | `false` | Dùng textarea với bộ đếm ở hàng chân dưới ô thay cho ô 1 dòng có bộ đếm nằm trong ô. |
| `maxLength` | number | — | Số ký tự tối đa được nhập, đồng thời là mẫu số của bộ đếm `n / max`. |
| `value` | string | `''` | Nội dung ô nhập, độ dài của nó là tử số của bộ đếm. |
| `counterId` | string | — | Id gán cho phần tử bộ đếm. |
| `className` | string | `''` | Lớp bổ sung, ghép sau lớp `text-input` của ô nhập. |
| `style` | object | — | Style của ô nhập, ô 1 dòng luôn bị ghi đè `paddingRight` để chừa chỗ cho bộ đếm. |
| `error` | ReactNode | `null` | Chữ đỏ đặt bên trái bộ đếm ở hàng chân, chỉ dùng khi `multiline` bật, ô 1 dòng bỏ qua. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Ô nhập có bộ đếm ký tự (`counter-input`)

- Component: `AppCounterInput` (src/components/app/AppCounterInput.jsx)

```jsx
<AppCounterInput maxLength={100} value={v} onChange={(e) => setV(e.target.value)} />
<AppCounterInput multiline maxLength={1000} … />
```

Quy tắc:
- UX-L7: Ô nhập chữ có giới hạn ký tự trong form Tạo/Sửa ⇒ PHẢI có bộ đếm `n / max` — dựng bằng `components/app/AppCounterInput.jsx` *(ô `1` dòng: bộ đếm trong ô sát phải · textarea: dưới ô canh phải)*, không màn tự dựng bộ đếm

When to Use (Khi dùng):
- [Verified · UX-L7] Ô nhập chữ có giới hạn ký tự trong form Tạo/Sửa.
- [Verified · UX-D5] Ô ghi chú, lý do dài dùng dạng nhiều dòng (multiline), tối đa 1000 ký tự.

When Not to Use (Khi không dùng):
- [Based on Docs · UX-L7] Ô tìm, ô giờ, ô ngày không gắn bộ đếm, cổng UX-L7 bỏ qua các ô này.

Anatomy (Cấu tạo):
- [Verified · QD-310 · AppCounterInput.jsx] Ô 1 dòng: bộ đếm n / max nằm trong ô, sát mép phải.
- [Verified · AppCounterInput.jsx] Ô nhiều dòng: dưới ô là 1 hàng chân gồm chữ đỏ canh trái và bộ đếm canh phải.
- [Verified · UX-D5] Bộ đếm có khoảng trắng 2 bên dấu /, ví dụ 0 / 1000.
- [Verified · AppCounterInput.jsx] Ô 1 dòng tự chừa đệm phải theo số chữ số của max để chữ gõ không đè bộ đếm.

Variants & States (Biến thể và trạng thái):
- [Verified · AppCounterInput.jsx] Rỗng: bộ đếm hiện 0 / max.
- [Verified · AppCounterInput.jsx] Đạt tối đa: thuộc tính maxLength chặn gõ thêm.
- [Verified · AppCounterInput.jsx] Lỗi ở ô nhiều dòng: chữ đỏ sát ô 4px, dài thì xuống dòng bên trái, không đè bộ đếm.
- [Verified · AppCounterInput.jsx] Lỗi ở ô 1 dòng: chữ đỏ đặt dưới ô như ô nhập thường.

Do (Nên):
- [Verified · UX-L7] Dựng bằng components/app/AppCounterInput.jsx.
- [Verified · UX-D5] Ô ghi chú, lý do đặt maxLength 1000.

Don't (Không nên):
- [Verified · UX-L7] Không tự dựng bộ đếm ở màn.
- [Verified · UX-D5] Không ràng buộc số ký tự tối thiểu cho ô ghi chú, lý do.
- [Verified · UX-D5] Không dùng khuôn cũ «n/1000 ký tự».

Accessibility (Truy cập và bàn phím):
- [Verified · AppCounterInput.jsx] Bộ đếm mang aria-hidden nên trình đọc màn hình không đọc số đếm.
- [Based on Docs · WAI-ARIA APG › Keyboard Interface] Tab vào ô, gõ chữ; bộ đếm cập nhật theo từng ký tự, không cần rời ô.

UX Writing (Cách viết chữ):
- [Verified · I001-35 · catalog.jsx] Placeholder theo I001-35 «Nhập {0}», ví dụ «Nhập tên quầy», «Nhập ghi chú».
- [Verified · ExemptionFields.jsx] Ô lý do có thể dùng placeholder ví dụ (I001-36) kèm dòng gợi ý dưới ô nói ai đọc lý do.

Lớp CSS:
- `.app-counter` · biến thể: — · trạng thái: —
- `.app-counter-wrap` · biến thể: — · trạng thái: `.is-multiline`
- `.text-input` · biến thể: — · trạng thái: `:disabled` `:focus`
- `.app-counter-foot` · biến thể: — · trạng thái: —

Thuộc tính `AppCounterInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `multiline` | boolean | `false` | Dùng textarea với bộ đếm ở hàng chân dưới ô thay cho ô 1 dòng có bộ đếm nằm trong ô. |
| `maxLength` | number | — | Số ký tự tối đa được nhập, đồng thời là mẫu số của bộ đếm `n / max`. |
| `value` | string | `''` | Nội dung ô nhập, độ dài của nó là tử số của bộ đếm. |
| `counterId` | string | — | Id gán cho phần tử bộ đếm. |
| `className` | string | `''` | Lớp bổ sung, ghép sau lớp `text-input` của ô nhập. |
| `style` | object | — | Style của ô nhập, ô 1 dòng luôn bị ghi đè `paddingRight` để chừa chỗ cho bộ đếm. |
| `error` | ReactNode | `null` | Chữ đỏ đặt bên trái bộ đếm ở hàng chân, chỉ dùng khi `multiline` bật, ô 1 dòng bỏ qua. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Ô tìm kiếm (`search-input`)

- Component: `AppSearchInput` (src/components/app/AppSearchInput.jsx)

```jsx
<AppSearchInput className="filter-cell filter-wide" value={q} onChange={setQ} placeholder="Tìm theo …" />  // bắt buộc lớp filter-cell
```

Quy tắc:
- UX-L6: Ô tìm kiếm gõ chữ xong ⇒ PHẢI hiện nút X xóa nội dung, bấm X thì xóa chữ và focus lại ô — mọi ô tìm dựng bằng `components/app/AppSearchInput.jsx`, không màn tự dựng ô tìm. Nguyên văn: "Ô nhập xong k có dấu x ==> K đồng bộ control ah"
- UX-H1: Tìm không phân biệt dấu, không phân biệt hoa thường, `đ` khớp `d`

When to Use (Khi dùng):
- [Verified · UX-L6 · AppSearchInput.jsx] Ô tìm từ khoá dùng chung ở mọi danh sách.
- [Verified · Playbook_List §7] Trong lưới lọc danh sách, ô từ khoá chiếm span 9 ở dòng 1, cạnh ô khoảng ngày span 3.

When Not to Use (Khi không dùng):
- [Based on Docs · UX-L1] Tìm trong danh mục để chọn 1 giá trị thì dùng ô chọn có tìm AppSearchSelect.
- [Based on Docs · UX-L1 · Playbook_List §7] Lọc theo giá trị rời rạc như trạng thái thì dùng ô lọc AppFilterDropdown.

Anatomy (Cấu tạo):
- [Verified · AppSearchInput.jsx] Khung .filter-search có icon kính lúp ở đầu.
- [Verified · AppSearchInput.jsx] Ô nhập chữ ở giữa.
- [Verified · UX-L6 · AppSearchInput.jsx] Nút X «Xóa nội dung tìm kiếm» ở cuối, chỉ hiện khi có chữ.

Variants & States (Biến thể và trạng thái):
- [Verified · AppSearchInput.jsx] Rỗng: ẩn nút X.
- [Verified · AppSearchInput.jsx] Có chữ: khung thêm lớp has-text, nút X hiện.
- [Verified · UX-L6] Bấm X: xoá chữ rồi focus lại ô.

Do (Nên):
- [Verified · UX-H1] Tìm không phân biệt dấu, không phân biệt hoa thường, đ khớp d.
- [Verified · UX-H2] Dùng chung hàm boDau() cho cả chuỗi gõ và chuỗi đem so.
- [Verified · Playbook_List §14] Tooltip liệt kê đủ trường được tìm, sinh từ chính danh sách trường tìm.

Don't (Không nên):
- [Verified · UX-L6] Không tự dựng ô tìm ở màn.
- [Verified · Playbook_List (bóc tách 30/09)] Không gõ cứng tooltip lệch với số trường tìm thật.

Accessibility (Truy cập và bàn phím):
- [Verified · AppSearchInput.jsx] Nút X có title «Xóa nội dung tìm kiếm» làm tên đọc.
- [Verified · UX-L6] Xoá xong focus trả về ô để gõ tiếp bằng bàn phím.
- [Based on Docs · AppSearchInput.jsx · Playbook_List §14] Component chưa nhận prop aria-label, tên đọc dựa vào placeholder và title nên truyền title nêu đủ trường tìm.

UX Writing (Cách viết chữ):
- [Verified · UX-L6 · catalog.jsx] Placeholder bắt đầu bằng «Tìm theo …», ví dụ «Tìm theo mã quầy, tên quầy».
- [Verified · Playbook_List §14] Placeholder ngắn, danh sách trường đầy đủ đặt trong tooltip.

Lớp CSS:
- `.filter-cell` · biến thể: `.filter-wide` · trạng thái: —
- `.filter-clear` · biến thể: — · trạng thái: `:hover`

Thuộc tính `AppSearchInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `className` | string | `''` | Lớp bố cục của màn, ghép trước lớp `filter-search` của khung ô tìm. |
| `value` | string | — | Chữ trong ô tìm, có chữ thì thêm lớp `has-text` để hiện nút X. |
| `onChange` | function | — | Gọi khi gõ chữ hoặc bấm nút X, nhận chuỗi mới (chuỗi rỗng khi bấm X). |
| `id` | string | — | Id của ô nhập tìm kiếm. |
| `placeholder` | string | — | Chữ gợi ý hiện khi ô tìm trống. |
| `title` | string | — | Chữ chú thích hiện khi di chuột lên ô nhập. |

### Ô chọn không tìm (`select`)

- Component: `AppSelect` (src/components/app/AppSelect.jsx)

```jsx
<AppSelect width={61} value={v} options={PAGE_SIZE_OPTIONS} showSearch={false} allowClear={false} onChange={setV} />
```

Quy tắc:
- UX-L1: Mỗi loại control có ĐÚNG `1` cách dựng dùng chung — màn mới không tự dựng control, không chép code control sang màn
- UX-L3: `1` nguồn chuẩn kích thước: `DesignStandards/tokens/pm2-antd-theme.js` nạp ở `main.jsx`. CSS chỉ ghi đè bố cục; không vá từng lớp bằng `!important` để ép kích thước control

When to Use (Khi dùng):
- [Verified · UX-L1] Ô chọn KHÔNG cần tìm, ví dụ ô Chọn số bản ghi.
- [Verified · AppSelect.jsx · UX-G9] Ô số bản ghi có 4 lựa chọn 10, 20, 50, 100, mặc định 10.

When Not to Use (Khi không dùng):
- [Verified · UX-L1] Danh mục có Mã — Tên hoặc nhiều mục thì dùng ô chọn có tìm AppSearchSelect.
- [Verified · UX-L1] Ô lọc ở danh sách dùng AppFilterDropdown.
- [Verified · UX-L1] Không dùng thẻ select trần của HTML.

Anatomy (Cấu tạo):
- [Verified · AppSelect.jsx] antd Select nguyên bản bọc trong AppSelect, lớp app-select.
- [Verified · AppSelect.jsx] Bề rộng truyền qua prop width để giữ bố cục quanh ô.

Variants & States (Biến thể và trạng thái):
- [Verified · AppSelect.jsx] Giao diện, trạng thái mở, rê chuột, khoá theo antd nguyên bản, không reset kiểu, giống PM1.
- [Verified · UX-L1] Hình dạng như ô nhập, cao 36.

Do (Nên):
- [Verified · UX-L3] Kích thước lấy từ token pm2-antd-theme.js nạp ở main.jsx.
- [Verified · catalog.jsx] Ô số bản ghi đặt giữa chữ «Chọn số bản ghi» và «trên 1 trang».

Don't (Không nên):
- [Verified · UX-L3] Không vá kích thước lớp .ant- bằng !important.
- [Verified · UX-L10] Không ép khuôn Mã — Tên cho ô mà đối tượng không có Mã (số bản ghi, trạng thái, Có/Không).

Accessibility (Truy cập và bàn phím):
- [Verified · AppSelect.jsx] Tên đọc lấy theo thứ tự aria-label truyền vào, rồi placeholder, rồi «Số bản ghi trên 1 trang» cho ô số bản ghi.
- [Based on Docs · WAI-ARIA APG › Select-Only Combobox] Enter hoặc Space mở danh sách; mũi tên lên xuống chọn; Enter chốt; Esc đóng.

UX Writing (Cách viết chữ):
- [Verified · I001-37] Placeholder ô chọn một theo I001-37 «Chọn {0}».

Thuộc tính `AppSelect`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `className` | string | `''` | Lớp bổ sung, ghép sau lớp `app-select` của Select antd. |
| `width` | number \| string | — | Bề rộng ô chọn, đặt vào `style.width` và bị ghi đè nếu `style` có `width`. |
| `style` | object | — | Style bổ sung của ô chọn, trộn sau `width`. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Ô chọn có tìm (danh mục Mã — Tên) (`search-select`)

- Component: `AppSearchSelect` (src/components/app/AppSearchSelect.jsx)

```jsx
<AppSearchSelect id="oDayNha" value={v} onChange={setV} options={[{ value: 'A', label: 'A — Dãy nhà A' }]} />  // nhãn luôn «Mã — Tên» (UX-L10)
```

Quy tắc:
- UX-L1: Mỗi loại control có ĐÚNG `1` cách dựng dùng chung — màn mới không tự dựng control, không chép code control sang màn
- UX-L10: Mở rộng QD-367: MỌI chỗ hiển thị 1 đối tượng khác (bàn, quầy…) luôn có «Mã — Tên» hoặc 2 cột Mã · Tên, không chỉ hiện mã trơn — hàm chung `tableLabel` · `counterLabelOf` (`lib/tableTimeline.js`). Nguyên văn: *"k ở đâu chỉ hiển thị mỗi mã ấy, k ai hiểu đâu"*. · Ô chọn thông thường hiển thị `Mã — Tên` — gạch dài `—` *(U+2014)*, `1` khoảng trắng mỗi bên, áp cả chữ trong ô đã chọn lẫn từng dòng trong danh sách thả xuống. Nguyên văn: *"Tất cả các combobox thông thường nếu không có gì đặc biệt luôn hiển thị Mã - Tên (gạch là gạch dài dài nhé)"*. Không áp cho ô chọn mà đối tượng không có Mã *(trạng thái, Có/Không, số bản ghi, ngày trong tuần)* và ô hiển thị đặc biệt đã chốt riêng *(vd ô người có ảnh, CCCD)*

When to Use (Khi dùng):
- [Verified · UX-L1 · catalog.jsx] Ô chọn CÓ tìm cho danh mục trong form, ví dụ Dãy nhà phục vụ, Quan hệ với người cai nghiện.
- [Verified · UX-L1 · QD-373] Ô Chọn trang của thanh phân trang là PageSelect bọc chính control này.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Kích thước — chốt số cụ thể] Bật ô tìm kiếm khi danh sách từ 10 mục trở lên, dưới 10 mục thì cuộn mắt nhanh hơn gõ.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Kích thước — chốt số cụ thể] Từ 100 mục trở lên thì tải dần khi cuộn tới đáy và phải thật sự tải trang tiếp.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Bốn quy tắc dữ liệu] Chỉ hiện bản ghi Hoạt động, không hiện bản ghi Nháp hoặc Vô hiệu hoá.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Bốn quy tắc dữ liệu] Màn Cập nhật: giá trị cũ đã vô hiệu biến mất khỏi danh sách, ô để trống và bắt buộc chọn lại mới cho Lưu.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Bốn quy tắc dữ liệu] Màn Xem chi tiết vẫn hiển thị đủ giá trị đã lưu dù giá trị đó đã bị vô hiệu.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Bốn quy tắc dữ liệu] Đặc tả màn ghi rõ nguồn dữ liệu của từng dropdown: mã danh mục PM5 hay enum cứng.

When Not to Use (Khi không dùng):
- [Verified · UX-L1] Ô lọc trên danh sách dùng AppFilterDropdown.
- [Verified · UX-L1] Lựa chọn ngắn không cần tìm như số bản ghi dùng AppSelect.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Kích thước — chốt số cụ thể] Không để dropdown giãn ngang theo nhãn dài nhất, nhãn dài cắt «…» 1 dòng và hover hiện tooltip.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Bốn quy tắc dữ liệu] Không đặt 2 dropdown cùng nghĩa trên 1 màn.

Anatomy (Cấu tạo):
- [Verified · AppSearchSelect.jsx] Thẻ select thật giữ giá trị, ô gõ tìm .lookup-input đặt lên trên.
- [Verified · UX-B4] Mũi tên và nút xoá trong ô, đệm trái 10px, đệm phải 46px.
- [Verified · searchSelect.js · catalog.jsx] Mục đầu của options làm placeholder, ví dụ «Chọn dãy nhà».
- [Verified · searchSelect.js] Danh sách xổ xuống, không có mục khớp thì hiện I001-28 «Không có dữ liệu phù hợp với điều kiện tìm kiếm» (QD-315).

Variants & States (Biến thể và trạng thái):
- [Verified · UX-L10] Có giá trị: chữ trong ô hiện Mã — Tên.
- [Verified · AppSearchSelect.jsx] Lỗi: prop hasErrorBorder thêm viền đỏ cho khung .lookup-input.
- [Verified · AppSearchSelect.jsx] Khoá: disabled đồng bộ sang ô gõ tìm.
- [Verified · AppSearchSelect.jsx] Đã chọn: bấm lần 2 mở lại danh sách.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Kích thước — chốt số cụ thể] Dòng option cao 36px, danh sách cao tối đa 260px, hiện trọn 7 dòng và lộ nửa dòng thứ 8.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Kích thước — chốt số cụ thể] Danh sách rộng tối đa 480px và không hẹp hơn ô đang mở nó.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Đang tải: 1 dòng «Đang tải…» kèm icon xoay, không hiện danh sách rỗng lúc chờ.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Rỗng vì chưa chọn trường cha thì nói rõ, ví dụ «Chọn Đơn vị trước».
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Tìm không ra hiện «Không tìm thấy "<từ khoá>"», khác hẳn câu rỗng «Không có dữ liệu».
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Mục bị khoá chữ --text-4, không bấm được và ghi lý do bên cạnh.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Đang mở: mũi tên xoay 180°, danh sách trượt lên 4px trong 250ms.

Do (Nên):
- [Verified · UX-L10 · QD-324] Nhãn mỗi mục dạng «Mã — Tên», gạch dài U+2014, 1 khoảng trắng mỗi bên.
- [Verified · UX-D9] Trường cha đổi thì ô con đổi theo, xoá cha thì bỏ con, chọn lại đúng giá trị cũ thì giữ.
- [Verified · Playbook_CreateEdit §3] Ô phụ thuộc chưa có cha thì khoá, placeholder «Chọn {ô trước} trước».

Don't (Không nên):
- [Verified · UX-L10] Không dùng gạch ngắn - hay – thay gạch dài.
- [Verified · UX-L10] Không hiện mã trơn.
- [Verified · UX-B3] Không vẽ thêm lớp viền thứ 2 khi focus.

Accessibility (Truy cập và bàn phím):
- [Verified · searchSelect.js] Tên đọc lấy từ aria-label, nhãn label gắn với select, hoặc chữ mục đầu, gán cho cả ô gõ tìm.
- [Verified · searchSelect.js] Bàn phím: mũi tên lên xuống đi qua mục, Enter chọn, Escape đóng danh sách.

UX Writing (Cách viết chữ):
- [Verified · I001-37] Placeholder theo I001-37 «Chọn {0}».
- [Verified · E001-02] Bỏ trống ô bắt buộc báo E001-02 «Vui lòng chọn {0}».

Lớp CSS:
- `.select-field` · biến thể: — · trạng thái: `.is-readonly`

Thuộc tính `AppSearchSelect`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Id của thẻ `select` gốc. |
| `options` | array | — | Danh sách lựa chọn `{ value, label }`, có thể kèm `relationship`, `citizenId`, `birthDate` ghi ra thuộc tính data của option. |
| `value` | string | — | Giá trị đang chọn, dùng làm giá trị ban đầu khi bật `uncontrolled`. |
| `disabled` | boolean | — | Khoá ô chọn, ô gõ tìm tự đồng bộ theo trạng thái này. |
| `onChange` | function | — | Gọi khi người dùng đổi lựa chọn, nhận chuỗi giá trị mới. |
| `hasErrorBorder` | boolean | — | Bật viền lỗi bằng lớp `input-border-error` trên ô gõ tìm. |
| `className` | string | `'text-input'` | Lớp của thẻ `select` gốc, mặc định `text-input`. |
| `wrapperId` | string | — | Id của khối bọc `select-field`. |
| `uncontrolled` | boolean | — | Để DOM giữ giá trị qua `defaultValue` thay vì `value`, dùng cho ô trong bảng. |
| `noClear` | boolean | — | Ẩn nút xóa của ô gõ tìm bằng thuộc tính `data-no-clear`. |

### Ô chọn của bộ lọc (`filter-dropdown`)

- Component: `AppFilterDropdown` (src/components/app/AppFilterDropdown.jsx)

```jsx
<AppFilterDropdown id="TrangThai" placeholder="Tất cả trạng thái" items={[…]} value={v} open={open} onOpen={…} onPick={…} onClear={…} />
```

Quy tắc:
- UX-B1: Lưới `12` cột. Lưới lọc danh sách: mỗi ô `span {n}` với `n` là bội số của `3`. *(14/10/2026, QD-377 · QD-382)* Dòng điều kiện CỐ ĐỊNH dựng flex tỷ lệ `4 · 3 · 3` nên chỉ kiểm kín mép phải, luật bội `3` áp cho dòng mở rộng. Form Tạo/Sửa theo `UX-B6` *(điểm tách ô `2` hàng liền nhau lồng nhau)*, không ràng buộc bội số `3` — `8 4` · `4 2 2 4` · `4 4 4` đều hợp lệ *(ví dụ của TrangNT5, PM2 `QD-310`)*

When to Use (Khi dùng):
- [Verified · UX-L1] Ô lọc ở màn Danh sách.
- [Verified · Playbook_List §7 · UX-B1] Dòng 2 của lưới lọc gồm 4 dropdown span 3+3+3+3, mỗi ô span bội số của 3.
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Đổi lọc cha thì lọc con reset về rỗng.
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Lọc trạng thái phủ từng giá trị trạng thái, cộng lựa chọn «Tất cả» làm mặc định.

When Not to Use (Khi không dùng):
- [Based on Docs · UX-L1] Chọn giá trị trong form Tạo/Sửa thì dùng AppSearchSelect.
- [Verified · Playbook_List §35] Tiêu chí lọc chỉ có 1 giá trị thì bỏ ô lọc đó.

Anatomy (Cấu tạo):
- [Verified · AppFilterDropdown.jsx] Hộp .filter-select-box hiện giá trị đã chọn hoặc placeholder.
- [Verified · AppFilterDropdown.jsx] Ô gõ lọc nằm trong hộp, chỉ gõ được khi danh sách đang mở.
- [Verified · AppFilterDropdown.jsx] Nút X «Xóa lựa chọn» và mũi tên thả xuống ở cuối hộp.
- [Verified · AppFilterDropdown.jsx] Bảng thả xuống gồm danh sách mục, gõ không khớp thì hiện I001-28 «Không có dữ liệu phù hợp với điều kiện tìm kiếm» (QD-315).

Variants & States (Biến thể và trạng thái):
- [Verified · AppFilterDropdown.jsx] Đóng, chưa chọn: hiện placeholder.
- [Verified · AppFilterDropdown.jsx] Mở: lớp is-open, tự focus vào ô gõ lọc, đóng thì xoá chữ đang gõ.
- [Verified · AppFilterDropdown.jsx] Có giá trị: lớp has-value, mục đang chọn mang lớp is-selected.
- [Verified · AppFilterDropdown.jsx] Gõ không khớp mục nào: lớp is-empty.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Đang tải: 1 dòng «Đang tải…» kèm icon xoay, không hiện danh sách rỗng lúc chờ.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Rỗng hiện «Không có dữ liệu», tìm không ra hiện «Không tìm thấy "<từ khoá>"», 2 câu khác nhau.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Đủ mười trạng thái] Mục đã chọn: nền --brand-weak, chữ đậm 600, có dấu tích.

Do (Nên):
- [Verified · UX-H1 · AppFilterDropdown.jsx] Lọc mục không phân biệt dấu, không phân biệt hoa thường.
- [Verified · UX-L10] Danh mục có Mã thì mỗi mục hiện «Mã — Tên».
- [Verified · Playbook_List §8] Các mục sinh từ dữ liệu, không gõ tay.

Don't (Không nên):
- [Verified · Playbook_List §7 · §11] Không đặt nhãn ngoài ô, chữ «Tất cả …» là placeholder.
- [Verified · UX-B1] Không dùng span lẻ khác bội số của 3 trong lưới lọc.

Accessibility (Truy cập và bàn phím):
- [Verified · AppFilterDropdown.jsx] Prop ariaLabel gán aria-label cho ô gõ lọc.
- [Based on Docs · AppFilterDropdown.jsx · searchSelect.js] Mục trong danh sách là div bấm chuột, chưa có điều hướng phím mũi tên và Enter như ô chọn có tìm.

UX Writing (Cách viết chữ):
- [Verified · I001-38 · catalog.jsx] Placeholder theo I001-38, mặc định «Tất cả {0}», ví dụ «Tất cả trạng thái».

Lớp CSS:
- `.filter-select-box` · biến thể: — · trạng thái: `:hover`
- `.filter-select-text` · biến thể: — · trạng thái: —
- `.filter-select-input` · biến thể: — · trạng thái: `:focus`
- `.filter-select-caret` · biến thể: — · trạng thái: —
- `.filter-select-panel` · biến thể: — · trạng thái: `.is-empty`
- `.filter-select-list` · biến thể: — · trạng thái: —
- `.filter-select-item` · biến thể: — · trạng thái: `:hover` `.is-selected`
- `.filter-select-empty` · biến thể: — · trạng thái: —

Thuộc tính `AppFilterDropdown`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Hậu tố id, sinh id `dd{id}` cho khối, `chu{id}` cho chữ hiển thị và `o{id}` cho ô gõ lọc. |
| `ariaLabel` | string | — | Nhãn đọc của ô gõ lọc. |
| `placeholder` | string | — | Chữ hiện ở ô khi chưa chọn giá trị nào. |
| `items` | array | — | Danh sách chuỗi lựa chọn, lọc theo từ khoá gõ vào không phân biệt dấu. |
| `value` | string | — | Mục đang chọn, được hiện trong ô và đánh dấu `is-selected` trong danh sách. |
| `open` | boolean | — | Mở bảng lựa chọn và cho gõ lọc, đóng thì xóa từ khoá đã gõ. |
| `onOpen` | function | — | Gọi khi bấm vào ô, nhận sự kiện click. |
| `onPick` | function | — | Gọi khi bấm 1 mục trong danh sách, nhận chuỗi của mục đó. |
| `onClear` | function | — | Gọi khi bấm nút Xóa lựa chọn, không nhận đối số. |

### Ô khoảng ngày (`date`)


```jsx
import { DateRange } from '@/pages/AppointmentList/widgets'
<DateRange dateFrom={from} dateTo={to} onChange={(f, t) => …} onClear={…} />
```

Quy tắc:
- UX-L8: Ô ngày, ô giờ bấm vào ⇒ PHẢI mở bảng chọn — ô khoảng ngày *(`.date-range` mở `.calendar`)* · ô khoảng giờ *(`components/app/TimeRangeInput.jsx` mở `.time-panel`)* · ô antd *(`.ant-picker-dropdown`)*

When to Use (Khi dùng):
- [Verified · Playbook_List §7] Lọc theo khoảng ngày ở danh sách, là 1 ô span 3 cạnh ô từ khoá.
- [Verified · Playbook_List §12] Mặc định để trống để tìm toàn bộ dữ liệu (QD-432).
- [Based on Docs · PM1 DS › Chọn ngày & giờ] Hiển thị theo giờ Việt Nam UTC+7, khi nhập hoặc nhập khẩu từ Excel phải xử lý an toàn múi giờ để không lệch 1 ngày.
- [Based on Docs · PM1 DS › Chọn ngày & giờ] Toàn hệ thống dùng dayjs, không dùng Date gốc, moment hay luxon.

When Not to Use (Khi không dùng):
- [Verified · UX-L8] Chọn khoảng giờ dùng ô khoảng giờ TimeRangeInput.
- [Based on Docs · UX-L8 · widgets.jsx] Chọn 1 ngày đơn dùng nút ngày đơn .date-input mở lịch 1 tháng.

Anatomy (Cấu tạo):
- [Verified · Playbook_List · QD-346] Ô chia 2 nửa: «Từ ngày» căn giữa nửa trái, «Đến ngày» căn giữa nửa phải, mũi tên ở giữa.
- [Verified · Playbook_List · widgets.jsx] Biểu tượng lịch sát mép phải, nút X «Xóa khoảng ngày».
- [Verified · Playbook_List §7] Bảng lịch 2 tháng kiểu PM1.

Variants & States (Biến thể và trạng thái):
- [Verified · UX-L8] Bấm ô thì bảng lịch mở trong 800ms trở xuống.
- [Verified · Playbook_List · QD-346] Nửa đang chọn có gạch chân chỉ dài đúng phần chữ ngày.
- [Verified · widgets.jsx] Chọn xong Từ ngày thì tự chuyển sang Đến ngày, chọn ngày trước Từ ngày thì bắt đầu lại.
- [Verified · widgets.jsx] Có giá trị: lớp has-text.
- [Verified · UX-L8 · QD-355] Bảng lịch hiện trọn, không bị khung cha có overflow cắt.
- [Based on Docs · PM1 DS › Chọn ngày & giờ] Ngày không hợp lệ theo nghiệp vụ làm mờ trong lịch, không để chọn rồi mới báo lỗi.
- [Based on Docs · PM1 DS › Chọn ngày & giờ] Trường ngày bị khoá ở chế độ Sửa phải khoá cả ô lẫn nút mở lịch.
- [Based on Docs · PM1 DS › Chọn ngày & giờ] Ô trống không tự điền ngày hôm nay làm mặc định, trừ khi đặc tả yêu cầu.

Do (Nên):
- [Verified · UX-L1] Dựng theo khuôn date-range dùng chung.
- [Verified · Playbook_List §6] Khoảng ngày mặc định vẫn tính vào huy hiệu đếm số điều kiện đang áp.

Don't (Không nên):
- [Verified · Playbook_List §12] Không tách khoảng ngày thành 2 ô riêng.

Accessibility (Truy cập và bàn phím):
- [Verified · widgets.jsx] Mỗi nửa có aria-label riêng, ví dụ «Ngày hẹn từ ngày», «Ngày hẹn đến ngày».
- [Verified · widgets.jsx] Escape hoặc bấm ra ngoài thì đóng lịch.
- [Verified · widgets.jsx] 2 nửa là readOnly, chỉ chọn ngày qua bảng lịch.

UX Writing (Cách viết chữ):
- [Verified · widgets.jsx] Placeholder 2 nửa là «Từ ngày» và «Đến ngày».
- [Verified · E001-02] Bỏ trống ô chọn ngày bắt buộc báo E001-02 «Vui lòng chọn {0}».
- [Based on Docs · PM1 DS › Chọn ngày & giờ] Ví dụ chặn nghiệp vụ: thời điểm tử vong không ở tương lai, ngày kết thúc không trước ngày bắt đầu.

### Ô khoảng giờ (`time-range`)

- Component: `TimeRangeInput` (src/components/app/TimeRangeInput.jsx)

```jsx
<TimeRangeInput from={f} to={t} idPrefix="ca1" onChange={(edge, value) => …} />
```

Quy tắc:
- UX-L8: Ô ngày, ô giờ bấm vào ⇒ PHẢI mở bảng chọn — ô khoảng ngày *(`.date-range` mở `.calendar`)* · ô khoảng giờ *(`components/app/TimeRangeInput.jsx` mở `.time-panel`)* · ô antd *(`.ant-picker-dropdown`)*

When to Use (Khi dùng):
- [Verified · QD-306] Mỗi ca 1 ô khoảng giờ từ → đến, như Khung giờ ở màn Cấu hình thời gian.

When Not to Use (Khi không dùng):
- [Verified · UX-L8] Chọn khoảng ngày dùng khuôn date-range.

Anatomy (Cấu tạo):
- [Verified · TimeRangeInput.jsx] 2 ô HH:mm, mũi tên ở giữa, cùng khuôn ô khoảng ngày.
- [Verified · TimeRangeInput.jsx] Bảng chọn ngay dưới ô gồm cột Giờ 00 tới 23 và cột Phút bước 5.

Variants & States (Biến thể và trạng thái):
- [Verified · UX-L8 · TimeRangeInput.jsx] Bấm hoặc focus 1 nửa thì mở bảng chọn .time-panel.
- [Verified · TimeRangeInput.jsx] Chọn phút của giờ bắt đầu thì tự chuyển sang giờ kết thúc.
- [Verified · TimeRangeInput.jsx] Mở bảng thì giờ, phút đang chọn cuộn vào giữa cột.
- [Verified · TimeRangeInput.jsx] Khoá: lớp is-disabled và bảng chọn đóng.
- [Verified · TimeRangeInput.jsx] Lỗi: prop invalid thêm viền đỏ input-border-error.

Do (Nên):
- [Verified · QD-306 · TimeRangeInput.jsx] Vẫn cho gõ tay, màn chuẩn hoá giá trị rồi truyền qua onChange(edge, value).
- [Verified · UX-L2] Ô .time-range theo đúng chuẩn hình dạng ô nhập.
- [Verified · QD-304] Ở Cấu hình thời gian, mặc định ca sáng 07:30 ~ 11:00, ca chiều 13:30 ~ 17:00.

Don't (Không nên):
- [Verified · UX-L8] Không để bảng chọn giờ bị khung cha cắt.

Accessibility (Truy cập và bàn phím):
- [Verified · TimeRangeInput.jsx · catalog.jsx] Mỗi nửa có aria-label từ labelFrom và labelTo, ví dụ «Giờ bắt đầu», «Giờ kết thúc».
- [Verified · TimeRangeInput.jsx] Bảng chọn mang role listbox, Escape hoặc bấm ra ngoài thì đóng.
- [Verified · TimeRangeInput.jsx] Ô dùng inputMode numeric để bàn phím điện thoại hiện số.

UX Writing (Cách viết chữ):
- [Verified · TimeRangeInput.jsx] Placeholder mỗi nửa là «HH:mm».
- [Verified · QD-306] Thứ không thăm gặp thì ô ca ghi «Không thăm gặp».
- [Verified · VisitConfig.jsx · E001-17] Giờ kết thúc trước giờ bắt đầu thì báo E001-17 «Giờ kết thúc phải sau giờ bắt đầu» dưới ô.

Lớp CSS:
- `.range-input` · biến thể: `.time-range-input` · trạng thái: `:focus` `.is-active` `.is-current`
- `.time-range-wrap` · biến thể: — · trạng thái: —
- `.date-range` · biến thể: `.time-range` · trạng thái: `:focus-within` `:hover` `.has-text` `.input-border-error` `.is-disabled`
- `.range-arrow` · biến thể: — · trạng thái: —
- `.time-panel` · biến thể: `.time-panel-cell` `.time-panel-head` · trạng thái: —
- `.time-panel-col` · biến thể: — · trạng thái: —

Thuộc tính `TimeRangeInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `from` | string | — | Giờ bắt đầu dạng `HH:mm` hiện ở nửa trái, sai dạng thì bảng chọn không đánh dấu ô nào. |
| `to` | string | — | Giờ kết thúc dạng `HH:mm` hiện ở nửa phải, sai dạng thì bảng chọn không đánh dấu ô nào. |
| `onChange` | function | — | Gọi khi gõ hoặc chọn giờ, nhận nửa đang sửa (`from` hoặc `to`) và chuỗi giá trị mới chưa chuẩn hoá. |
| `disabled` | boolean | — | Khoá cả 2 ô nhập, thêm lớp `is-disabled` và đóng bảng chọn giờ đang mở. |
| `invalid` | boolean | — | Bật viền lỗi bằng lớp `input-border-error` cho khung khoảng giờ. |
| `idPrefix` | string | — | Tiền tố id, sinh id `{tiền tố}-from`, `{tiền tố}-to` và `{tiền tố}-panel`, bỏ trống thì không gán id. |
| `labelFrom` | string | — | Nhãn đọc và title của ô giờ bắt đầu, cũng là nhãn bảng chọn khi đang chọn giờ bắt đầu. |
| `labelTo` | string | — | Nhãn đọc và title của ô giờ kết thúc, cũng là nhãn bảng chọn khi đang chọn giờ kết thúc. |

### Ô chọn ngày giờ (`date-time`)

- Component: `DateTimeInput` (src/components/app/DateTimeInput.jsx)

```jsx
import DateTimeInput from '@/components/app/DateTimeInput'
<DateTimeInput id="thoiDiem" label="Thời điểm hẹn" value={v} onChange={setV} />   // giá trị dd/MM/yyyy HH:mm · minuteStep mặc định 5
```

Quy tắc:
- UX-L8: Ô ngày, ô giờ bấm vào ⇒ PHẢI mở bảng chọn — ô khoảng ngày *(`.date-range` mở `.calendar`)* · ô khoảng giờ *(`components/app/TimeRangeInput.jsx` mở `.time-panel`)* · ô antd *(`.ant-picker-dropdown`)*

When to Use (Khi dùng):
- [Verified · QD-409] Chọn 1 thời điểm có cả ngày và giờ trong cùng 1 ô, giá trị dạng dd/MM/yyyy HH:mm.
- [Verified · QD-409 · UX-L8] Bấm ô thì mở bảng chọn gồm lịch 1 tháng, cột Giờ, cột Phút bước 5 và nút «Bây giờ»; gõ tay cũng được.

When Not to Use (Khi không dùng):
- [Verified · UX-L8] Chọn khoảng ngày dùng Ô khoảng ngày.
- [Verified · UX-L8] Chọn khoảng giờ trong ngày dùng Ô khoảng giờ TimeRangeInput.
- [Verified · QD-409] Không tách thành 2 ô ngày và giờ riêng, vì PM2 đã quen cột giờ phút của Ô khoảng giờ.

Lớp CSS:
- `.datetime-wrap` · biến thể: — · trạng thái: —
- `.text-input` · biến thể: — · trạng thái: `:disabled` `:focus`
- `.date-icon` · biến thể: — · trạng thái: —
- `.datetime-panel` · biến thể: — · trạng thái: —
- `.datetime-body` · biến thể: — · trạng thái: —
- `.date-picker` · biến thể: — · trạng thái: `.is-open`
- `.date-picker-head` · biến thể: — · trạng thái: —
- `.date-picker-nav` · biến thể: — · trạng thái: `:hover`

Thuộc tính `DateTimeInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `value` | string | — | Ngày giờ dạng `dd/MM/yyyy HH:mm` hiện trong ô, sai dạng thì bảng chọn không đánh dấu ngày và giờ nào. |
| `onChange` | function | — | Gọi khi gõ, chọn ngày, chọn giờ phút hoặc bấm «Bây giờ», nhận chuỗi giá trị mới chưa chuẩn hoá. |
| `disabled` | boolean | — | Khoá ô nhập, thêm lớp `is-disabled` và đóng bảng chọn đang mở. |
| `invalid` | boolean | — | Bật viền lỗi bằng lớp `input-border-error` cho ô. |
| `id` | string | — | Id của ô nhập, bảng chọn nhận id `{id}-panel`, bỏ trống thì không gán id. |
| `label` | string | — | Nhãn đọc và title của ô, cũng là nhãn của bảng chọn. |
| `minuteStep` | number | `5` | Bước của cột Phút, mặc định 5 như ô khoảng giờ. |
| `placeholder` | string | `'dd/MM/yyyy HH:mm'` | Chữ gợi ý khi ô trống, mặc định `dd/MM/yyyy HH:mm`. |

### Ô tích (`checkbox`)


```jsx
<label className="chk"><input type="checkbox" /> Nhãn</label>
```

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn
- UX-L19: Bảng nhập nhiều dòng trong form: dòng THÊM MỚI chèn LÊN ĐẦU *(cùng thứ tự mới lên trên của danh sách)*; ô tích mặc định theo giá trị phổ biến của nghiệp vụ *(Có vách ngăn = tích sẵn)*. Nguồn: TrangNT5 *"add thêm thì cho lên trên cùng nhé, vì thứ tự của mình là mới lên trên mà"* và *"Có vách ngăn mặc định có nên là defalut dòng mới là tick hộ"*

When to Use (Khi dùng):
- [Verified · UX-L19 · catalog.jsx] Chọn có hoặc không cho 1 thuộc tính đi kèm nhãn, ví dụ «Có vách ngăn».
- [Verified · QD-359] Ô tích mở thêm khối nhập, ví dụ «Có thân nhân đi cùng» thêm dòng nhập thân nhân.
- [Verified · QD-370] Trước mỗi nhóm người nhận thông báo có 1 ô tích, mặc định tích.

When Not to Use (Khi không dùng):
- [Based on Docs · QD-306] Bật hoặc tắt 1 thuộc tính dạng trạng thái (ví dụ Cho phép thăm gặp theo ngày) thì dùng công tắc.
- [Verified · Playbook_List §24] Ở tab Tất cả của danh sách thì ẩn checkbox và cấm thao tác hàng loạt.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] label.chk bọc input type checkbox và chữ nhãn.
- [Verified · UX-L1] Ô cỡ 16×16, màu chủ đạo, bảng dùng ô tích antd.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Chưa tích, đã tích, khoá.
- [Verified · QD-370 · NotifyRecipientsField.jsx] Nhóm bắt buộc: ô khoá ở trạng thái tích, không bỏ được.

Do (Nên):
- [Verified · UX-L19] Mặc định theo giá trị phổ biến của nghiệp vụ, ví dụ dòng mới «Có vách ngăn» tích sẵn.
- [Verified · ExemptionFields.jsx · UX-D9] Bỏ tích ô mở khối thì bỏ luôn dữ liệu trong khối đó.

Don't (Không nên):
- [Verified · UX-L2] Không để ô tích khác hình dạng giữa các màn.

Accessibility (Truy cập và bàn phím):
- [Verified · NotifyRecipientsField.jsx] Ô khoá có title nêu lý do, ví dụ «Nhóm bắt buộc nhận thông báo, không bỏ tick được».
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Bọc ô trong label để bấm vào chữ cũng tích được và trình đọc màn hình đọc nhãn.
- [Based on Docs · WAI-ARIA APG › Checkbox] Space bật hoặc tắt ô tích.

UX Writing (Cách viết chữ):
- [Based on Docs · catalog.jsx] Nhãn là cụm ngắn mô tả trạng thái khi tích, ví dụ «Có vách ngăn», «Gửi thông báo cho thân nhân».

Lớp CSS:
- `.chk` · biến thể: — · trạng thái: —

### Công tắc Bật/Tắt (`switch`)


```jsx
import { Switch } from 'antd'
<Switch checked={on} onChange={setOn} aria-label="…" />
```

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Verified · QD-306] Bật hoặc tắt 1 thuộc tính, ví dụ ô Cho phép thăm gặp theo ngày ở Cấu hình thời gian.
- [Verified · QD-366] Cột Bật/Tắt ở màn Cài đặt thông báo.
- [Verified · Playbook_List §12] Công tắc là loại cột ngắn được phép đặt trong bảng danh sách.

When Not to Use (Khi không dùng):
- [Verified · UX-L19 · catalog.jsx] Thuộc tính có hoặc không trong bảng nhập nhiều dòng, ví dụ «Có vách ngăn», dùng ô tích.
- [Verified · QD-359] Lựa chọn mở thêm khối nhập, ví dụ «Có thân nhân đi cùng», dùng ô tích.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] antd Switch, màn có thể đặt chữ Bật hoặc Tắt cạnh bên.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Bật, Tắt, khoá.
- [Verified · UX-L2] Cùng trạng thái thì cùng 1 kiểu trên mọi màn.
- [Verified · VisitConfig.jsx · UX-L8] Chế độ Xem của Cấu hình thời gian khoá công tắc, bấm Chỉnh sửa mới đổi được.
- [Verified · NotificationSettings.jsx] Thông báo bị khoá ở Cài đặt thông báo luôn Bật và khoá công tắc.

Do (Nên):
- [Verified · QD-306] Tắt 1 ngày thì ô ca của ngày đó ghi «Không thăm gặp».
- [Verified · QD-370] Công tắc thông báo chỉ quyết định có gửi thông báo, luật tự hủy lịch Từ chối duyệt vẫn chạy.

Don't (Không nên):
- [Verified · UX-L3] Không ép kích thước công tắc antd bằng !important.

Accessibility (Truy cập và bàn phím):
- [Verified · VisitConfig.jsx · NotificationSettings.jsx] Luôn truyền aria-label nêu đối tượng bị bật tắt, ví dụ «Thăm gặp {thứ}», «Trạng thái thông báo».
- [Based on Docs · WAI-ARIA APG › Switch] Space hoặc Enter đổi Bật/Tắt.

UX Writing (Cách viết chữ):
- [Based on Docs · VisitConfig.jsx] Tiêu đề cột chứa công tắc là tên thuộc tính ngắn, ví dụ «Thăm gặp».

### Tài liệu đính kèm (`attachment`)

- Component: `AttachmentField` (src/components/app/AttachmentField.jsx)

```jsx
<AttachmentField id="oTaiLieu" value={files} onChange={setFiles} />  // mỗi tệp ≤ 10MB
```

Quy tắc:
- TA-02

When to Use (Khi dùng):
- [Verified · QD-358] Ô «Tài liệu đính kèm» không bắt buộc ở đơn xin Trưởng cơ sở duyệt, để gửi tài liệu cho Trưởng cơ sở xem khi duyệt.

When Not to Use (Khi không dùng):
- [Verified · QD-342 · QD-358] Màn Tạo mới lịch hẹn do cán bộ đặt hộ không có khối đơn xin Trưởng cơ sở duyệt nên không có ô này.

Anatomy (Cấu tạo):
- [Verified · AttachmentField.jsx] Nút «Chọn tệp» có icon kẹp giấy, mở hộp chọn tệp của trình duyệt.
- [Verified · AttachmentField.jsx] Danh sách tệp, mỗi dòng gồm tên, dung lượng và nút bỏ tệp.
- [Verified · AttachmentField.jsx] Chữ đỏ dưới ô khi có tệp vượt dung lượng.

Variants & States (Biến thể và trạng thái):
- [Verified · AttachmentField.jsx] Rỗng: chỉ có nút Chọn tệp.
- [Verified · AttachmentField.jsx] Có tệp: hiện danh sách attach-list, chọn thêm thì nối vào cuối.
- [Verified · DATA-02 · QD-358] Tệp vượt 10MB: chặn, không nhận tệp đó, báo E001-14.
- [Verified · ExemptionInfo.jsx · QD-417] Chế độ Xem: tên tệp là liên kết kèm icon tải về, kèm dung lượng; không có tệp thì hiện dấu —.
- [Verified · AttachmentField.jsx] Nút bỏ tệp chỉ có trên từng dòng tệp đã chọn, chưa có tệp thì không có nút.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Tải tệp lên] PM1 có, PM2 chưa làm: tệp đã tải hiện người tải và thời gian; thanh tiến độ theo phần trăm khi đang tải, có nút huỷ; dòng ghi giới hạn dung lượng ngay dưới ô.

Do (Nên):
- [Verified · QD-358 · DATA-02] Cho chọn nhiều tệp, mỗi tệp tối đa 10MB.
- [Verified · AttachmentField.jsx] Dung lượng hiện theo KB hoặc MB.

Don't (Không nên):
- [Verified · QD-358] Chưa tự chặn định dạng hay số tệp, Common Rules chưa quy định và đang chờ TrangNT5 chốt.
- [Verified · QD-358] Không đặt dấu * bắt buộc cho ô này.

Accessibility (Truy cập và bàn phím):
- [Verified · AttachmentField.jsx] Nút bỏ tệp có aria-label «Bỏ tệp {tên tệp}».
- [Based on Docs · WAI-ARIA APG › Keyboard Interface] Tab tới nút chọn tệp; Enter mở hộp chọn tệp; mỗi tệp đã chọn có nút xoá riêng.

UX Writing (Cách viết chữ):
- [Verified · E001-14] Báo vượt dung lượng theo E001-14 «Tệp vượt quá {0}», {0} là 10MB.
- [Verified · E001-20] Khi có luật định dạng thì báo theo E001-20 «Chỉ chấp nhận tệp {0}».

Lớp CSS:
- `.attach-field` · biến thể: — · trạng thái: —
- `.attach-list` · biến thể: — · trạng thái: —
- `.attach-name` · biến thể: — · trạng thái: —
- `.attach-size` · biến thể: — · trạng thái: —
- `.btn` · biến thể: `.btn-danger` `.btn-danger-ghost` `.btn-outline` `.btn-primary` · trạng thái: `:active` `:hover` `.is-primary`
- `.attach-remove` · biến thể: — · trạng thái: `:hover`

Thuộc tính `AttachmentField`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Id của khối, cũng là tiền tố id ô chọn tệp `{id}Input` và chữ lỗi `{id}Loi`. |
| `value` | array | `[]` | Danh sách tệp đã chọn dạng `{ name, size }`, hiện tên và dung lượng kèm nút Bỏ tệp. |
| `onChange` | function | — | Gọi khi thêm tệp không vượt 10MB hoặc bỏ 1 tệp, nhận danh sách tệp mới. |

### Người nhận thông báo (`notify-recipients`)

- Component: `NotifyRecipientsField` (src/components/app/NotifyRecipientsField.jsx)

```jsx
<NotifyRecipientsField id="…" code="APPOINTMENT_CANCELLED" records={[record]} value={v} onChange={setV} />
```

Quy tắc:
- QD-370

When to Use (Khi dùng):
- [Verified · QD-370 · NotifyRecipientsField.jsx] Trường «Gửi thông báo cho» ở mục Gửi thông báo của lịch hẹn và ở mỗi popup thao tác (Phê duyệt, Từ chối duyệt, Hủy, Điều chỉnh, Vắng mặt).

When Not to Use (Khi không dùng):
- [Verified · QD-370] Thông báo tự động ngầm (nhắc lịch, tự hủy) không có trường này, người nhận khai đích danh theo dữ liệu.
- [Verified · NotifyRecipientsField.jsx] Thông báo đang Tắt ở màn Cài đặt thông báo thì ẩn cả trường.

Anatomy (Cấu tạo):
- [Verified · NotifyRecipientsField.jsx · QD-370] Nhãn trường, rồi 2 khối «Gửi theo mặc định» và «Gửi thêm».
- [Verified · QD-370] Mỗi nhóm người nhận 1 dòng: ô tích và 1 ô chọn nhiều.
- [Verified · NotifyRecipientsField.jsx] Dòng gợi ý dưới trường giải thích luật gửi.

Variants & States (Biến thể và trạng thái):
- [Verified · QD-370] Nhóm mặc định tích, bỏ tích thì ô chọn khoá và không gửi cho nhóm đó.
- [Verified · QD-370] Nhóm bắt buộc: ô tích khoá ở trạng thái tích.
- [Verified · QD-370] Người bắt buộc nhận: tag khoá trong ô, không bỏ được.
- [Verified · NotifyRecipientsField.jsx] Nhóm bắt buộc đang tích mà ô rỗng: viền đỏ và chữ đỏ E001-02.

Do (Nên):
- [Verified · QD-370] Tự nạp người nhận chuẩn theo luồng nghiệp vụ làm giá trị mặc định.
- [Verified · QD-370] Bộ nhóm người nhận của từng thao tác theo ma trận thao tác × nhóm người nhận.
- [Verified · QD-370] Ô Cán bộ tổ thăm gặp và ô Thân nhân bắt buộc có ít nhất 1 người khi đang tích.

Don't (Không nên):
- [Verified · NotifyRecipientsField.jsx] Không gửi cho nhóm đã bỏ tích dù trong ô vẫn có tên.

Accessibility (Truy cập và bàn phím):
- [Verified · NotifyRecipientsField.jsx] Ô tích khoá có title nêu lý do không bỏ được.
- [Based on Docs · AppSelect.jsx] Ô chọn nhiều là AppSelect nên lấy placeholder làm tên đọc khi không truyền aria-label.

UX Writing (Cách viết chữ):
- [Verified · NotifyRecipientsField.jsx] Placeholder theo nhóm, ví dụ «Chọn cán bộ tổ thăm gặp», «Chọn Trưởng cơ sở», «Chọn cán bộ nhận thêm».
- [Verified · NotifyRecipientsField.jsx · UX-A9] Chữ đỏ E001-02 với {0} là tên nhóm viết thường kèm «nhận thông báo».

Lớp CSS:
- `.fld` · biến thể: — · trạng thái: —
- `.notify-groups` · biến thể: — · trạng thái: —
- `.notify-block` · biến thể: — · trạng thái: —
- `.notify-block-title` · biến thể: — · trạng thái: —
- `.notify-group` · biến thể: — · trạng thái: `.is-off`
- `.chk` · biến thể: — · trạng thái: —
- `.required-mark` · biến thể: — · trạng thái: —
- `.notify-group-body` · biến thể: — · trạng thái: —

Thuộc tính `NotifyRecipientsField`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Id của khối trường, cũng là tiền tố id ô chọn mỗi nhóm `{id}-{nhóm}`. |
| `code` | string | — | Mã thông báo của thao tác, đang tắt ở Cài đặt thông báo thì ẩn cả trường và dùng để suy nhóm, người bắt buộc. |
| `groups` | array | — | Danh sách mã nhóm người nhận cần hiện, bỏ trống thì lấy theo `code` và `records`. |
| `records` | array | — | Bản ghi đang thao tác, dùng để suy nhóm, danh sách người gợi ý và người bắt buộc nhận. |
| `value` | object | — | Người nhận theo từng nhóm dạng `{ [nhóm]: [id], off: [nhóm bỏ tick] }`. |
| `onChange` | function | — | Gọi khi tick hoặc bỏ tick nhóm, hay đổi người trong ô chọn, nhận object giá trị mới đã trộn thay đổi. |
| `label` | string | `'Gửi thông báo cho'` | Nhãn của trường. |
| `hint` | string | — | Chữ hướng dẫn dưới trường, bỏ trống thì dùng câu mặc định về nhóm và người bắt buộc. |

### Khối đơn xin Trưởng cơ sở duyệt (`exemption`)

- Component: `ExemptionFields` (src/components/app/ExemptionFields.jsx), `ExemptionInfo` (src/components/app/ExemptionInfo.jsx)

```jsx
<ExemptionFields e={draft} set={setDraft} err={errors} />   // nhập (Đăng ký tại quầy)
<ExemptionInfoGrid rows={exemptionRows(info)} /> · <DocumentCheckTable checks={…} />   // xem (Chi tiết)
```

Quy tắc:
- QD-342
- QD-358

When to Use (Khi dùng):
- [Verified · QD-297] Thân nhân lần đầu đến, thiếu giấy tờ xác nhận, chưa có tài khoản hoặc sổ thăm gặp thì tạo 1 đơn xin Trưởng cơ sở duyệt.
- [Verified · QD-342] Đơn tạo ở Đăng ký tại quầy nhánh «Thân nhân cần xin duyệt», người duyệt là Trưởng cơ sở, trạng thái «Chờ Trưởng cơ sở duyệt».
- [Verified · ExemptionFields.jsx] Cùng 1 khối ô nhập cho màn Tạo (Đăng ký tại quầy) và màn Sửa đơn ngoại lệ, cùng thứ tự, cùng id.

When Not to Use (Khi không dùng):
- [Verified · QD-342] Màn Tạo mới lịch hẹn (cán bộ đặt hộ) chỉ tạo cho thân nhân đã có sổ hoặc tài khoản thăm gặp, không có khối này.

Anatomy (Cấu tạo):
- [Verified · ExemptionFields.jsx] Họ tên thân nhân*, Số căn cước công dân*, Số điện thoại.
- [Verified · ExemptionFields.jsx · UX-B9] Người cai nghiện được thăm* (gõ tìm rồi bấm thẻ), Quan hệ với người cai nghiện* đứng ngay sau.
- [Verified · QD-359] Ô tích «Có thân nhân đi cùng», tích thì thêm dòng Họ tên, Số căn cước, Quan hệ.
- [Verified · ExemptionFields.jsx · QD-358] Lý do xin duyệt* (ô nhiều dòng tối đa 1000), Tài liệu đính kèm.
- [Verified · ExemptionInfo.jsx · catalog.jsx] Chế độ Xem: lưới nhãn và giá trị cùng thứ tự màn Tạo, kèm bảng đối chiếu giấy tờ.

Variants & States (Biến thể và trạng thái):
- [Verified · ExemptionFields.jsx · UX-C3] Thân nhân đi cùng tối đa 2 người, đạt tối đa thì nút Thêm khoá và rê chuột hiện lý do.
- [Verified · ExemptionFields.jsx · Playbook_CreateEdit §4] Thẻ người cai nghiện không đủ điều kiện bị khoá kèm lý do.
- [Verified · ExemptionFields.jsx · I001-76] Tra không ra người cai nghiện thì hiện I001-76.
- [Verified · ExemptionFields.jsx] Bỏ tích «Có thân nhân đi cùng» hoặc xoá hết dòng thì bỏ toàn bộ thân nhân đi cùng.

Do (Nên):
- [Verified · UX-B7] Màn Tạo, Sửa, Xem của đơn giữ y nguyên thứ tự khối và trường.
- [Verified · QD-359 · UX-A15] Dùng đúng chữ «thân nhân đi cùng» ở mọi màn.
- [Verified · ExemptionFields.jsx] Ô Số căn cước công dân chỉ nhận chữ số, tối đa 12 ký tự.

Don't (Không nên):
- [Verified · QD-358] Không bắt buộc Tài liệu đính kèm.

Accessibility (Truy cập và bàn phím):
- [Verified · ExemptionFields.jsx] Nút bỏ dòng có aria-label «Bỏ thân nhân đi cùng {n}».
- [Verified · ExemptionFields.jsx] Ô số căn cước, số điện thoại dùng inputMode numeric.

UX Writing (Cách viết chữ):
- [Verified · ExemptionFields.jsx] Placeholder: «Nhập họ tên thân nhân», «Nhập 12 chữ số», «Nhập số điện thoại».
- [Verified · ExemptionFields.jsx] Dưới Lý do xin duyệt có gợi ý «Trưởng cơ sở đọc lý do này để quyết định cho phép thăm gặp».
- [Verified · UX-A12] Chữ hướng dẫn viết cho người dùng, không đưa căn cứ pháp lý lên giao diện.

Lớp CSS:
- `.student-avatar` · biến thể: — · trạng thái: —
- `.student-body` · biến thể: — · trạng thái: —
- `.student-name` · biến thể: — · trạng thái: —
- `.visit-ok-tag` · biến thể: — · trạng thái: —
- `.status-note` · biến thể: — · trạng thái: —
- `.visit-block-reason` · biến thể: — · trạng thái: —
- `.student-side` · biến thể: — · trạng thái: —
- `.quota-box` · biến thể: — · trạng thái: `.is-exhausted`

Thuộc tính `ExemptionFields`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `e` | object | — | Dữ liệu đơn gồm thông tin thân nhân, người cai nghiện, quan hệ, lý do, thân nhân đi cùng và tệp đính kèm. |
| `set` | function | — | Gọi khi đổi 1 ô, nhận tên trường và giá trị mới. |
| `err` | function | `none` | Nhận id chữ lỗi và trả phần tử chữ đỏ đặt dưới ô, mặc định trả `null`. |
| `excludeCode` | string | — | Mã lịch bỏ qua khi xét điều kiện thăm gặp và quỹ lượt, dùng ở màn Sửa để không tính chính lịch đó. |

### Nhóm radio (chọn 1 trong vài giá trị) (`radio-group`)

- Component: `AppRadioGroup` (src/components/app/AppRadioGroup.jsx)

```jsx
<AppRadioGroup name="hinhThuc" label="Hình thức" value={v} onChange={setV} options={[{ value, label }]} />  // 2–5 lựa chọn; nhiều hơn thì dùng Ô chọn
```

Quy tắc:
- UX-L1: Mỗi loại control có ĐÚNG `1` cách dựng dùng chung — màn mới không tự dựng control, không chép code control sang màn
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Based on Docs · HeroUI RadioGroup] Chọn đúng 1 giá trị và người dùng cần thấy hết lựa chọn cùng lúc.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Hợp với 2–5 lựa chọn ngắn như Hình thức thăm gặp.

When Not to Use (Khi không dùng):
- [Based on Docs · Nielsen Norman Group · Toggle-Switch Guidelines · Material Design 3 · Switch] Bật/tắt 1 thuộc tính có hiệu lực ngay thì dùng Công tắc, trong biểu mẫu phải bấm Lưu thì dùng Ô tích.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · UX-L1] Ô chọn 16x16 như Ô tích, màu chủ đạo.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · IBM Carbon Design System · Radio button · Material Design 3 · Radio button] Đang chọn · chưa chọn · rê chuột · focus bàn phím · lỗi · khoá từng lựa chọn hoặc cả nhóm.

Do (Nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Chỉ đặt sẵn lựa chọn khi SRS đã ghi giá trị mặc định. Trường ảnh hưởng hồ sơ phạm nhân thì để trống, bắt người dùng tự chọn.

Don't (Không nên):
- [Based on Docs · Nielsen Norman Group · Checkboxes vs. Radio Buttons · GOV.UK Design System · Radios] Không dùng radio đứng 1 mình.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · HeroUI RadioGroup] Nhóm có role radiogroup và nhãn nhóm; mũi tên bàn phím đổi lựa chọn.

UX Writing (Cách viết chữ):
- [Based on Docs · IBM Carbon Design System · Radio button · Material Design 3 · Radio button] Nhãn ngắn, cùng loại từ, viết hoa chữ đầu.

Lớp CSS:
- `.app-choice-group` · biến thể: — · trạng thái: `.is-vertical`
- `.app-choice` · biến thể: — · trạng thái: `.is-disabled`

Thuộc tính `AppRadioGroup`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `name` | string | — | Thuộc tính `name` chung của các ô radio trong nhóm. |
| `label` | string | — | Nhãn đọc của nhóm, gán vào `aria-label`, không hiện chữ trên màn. |
| `options` | array | `[]` | Danh sách lựa chọn `{ value, label, disabled }`, mỗi mục là 1 ô radio. |
| `value` | string \| number | — | Giá trị đang chọn, ô radio có `value` bằng giá trị này được tick. |
| `onChange` | function | — | Gọi khi người dùng chọn 1 ô radio, nhận `value` của lựa chọn đó. |
| `disabled` | boolean | `false` | Khoá mọi ô radio trong nhóm và thêm lớp `is-disabled`. |
| `vertical` | boolean | `false` | Xếp các lựa chọn theo cột bằng lớp `is-vertical` thay vì hàng ngang. |
| `className` | string | `''` | Lớp bổ sung, ghép sau lớp `app-choice-group`. |

### Nhóm ô tích (chọn nhiều) (`checkbox-group`)

- Component: `AppCheckboxGroup` (src/components/app/AppCheckboxGroup.jsx)

```jsx
<AppCheckboxGroup label="Ngày thăm" value={arr} onChange={setArr} options={[{ value, label }]} />
```

Quy tắc:
- UX-L1: Mỗi loại control có ĐÚNG `1` cách dựng dùng chung — màn mới không tự dựng control, không chép code control sang màn
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Based on Docs · HeroUI CheckboxGroup] Chọn nhiều giá trị trong danh sách ngắn, thấy hết lựa chọn.
- [Based on Docs · NotifyRecipientsField · VisitConfig.jsx:204 · UX-L21 (QD-407 D9)] Ví dụ chọn nhiều nhóm người nhận thông báo cùng lúc. Bật hoặc tắt từng ngày trong tuần thì dùng Công tắc như màn Cấu hình thời gian.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · UX-L1] Mỗi ô tích 16x16 như Ô tích đơn.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · IBM Carbon Design System · Checkbox · Material Design 3 · Checkbox] Đã tích · chưa tích · chọn một phần · focus bàn phím · lỗi · khoá.

Do (Nên):
- [Based on Docs · GOV.UK Design System · Checkboxes · Nielsen Norman Group · Checkboxes vs. Radio Buttons] Xếp lựa chọn theo thứ tự tự nhiên (thứ trong tuần, mức độ).

Don't (Không nên):
- [Based on Docs · Nielsen Norman Group · Checkboxes vs. Radio Buttons] Không dùng nhóm ô tích khi chỉ được chọn 1.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · HeroUI CheckboxGroup] Nhóm có role group và nhãn nhóm.
- [Based on Docs · WAI-ARIA APG › Checkbox] Tab đi giữa từng ô; Space bật hoặc tắt ô đang chọn.

UX Writing (Cách viết chữ):
- [Based on Docs · IBM Carbon Design System · Checkbox · GOV.UK Design System · Checkboxes] Nhãn ngắn, không lặp chữ của nhãn nhóm.

Lớp CSS:
- `.app-choice-group` · biến thể: — · trạng thái: `.is-vertical`
- `.app-choice` · biến thể: — · trạng thái: `.is-disabled`

Thuộc tính `AppCheckboxGroup`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `label` | string | — | Tên đọc màn hình của nhóm, gắn vào `aria-label` của khối `role=group`, không hiện thành chữ. |
| `options` | array | `[]` | Danh sách lựa chọn dạng `{ value, label, disabled }`, lựa chọn có `disabled` thì khoá riêng ô đó. |
| `value` | array | `[]` | Mảng giá trị đang được tích, ô có `value` nằm trong mảng thì hiện đã tích. |
| `onChange` | function | — | Gọi khi người dùng tích hoặc bỏ tích 1 ô, nhận mảng giá trị mới sau khi thêm hoặc bớt giá trị đó. |
| `disabled` | boolean | `false` | Khoá toàn bộ ô tích trong nhóm và gắn lớp `is-disabled` cho từng lựa chọn. |
| `vertical` | boolean | `false` | Xếp các lựa chọn theo cột bằng lớp `is-vertical`, mặc định xếp theo hàng. |
| `className` | string | `''` | Lớp CSS thêm vào khối bọc `app-choice-group`. |

### Ô số có nút tăng giảm (`number-input`)

- Component: `AppNumberInput` (src/components/app/AppNumberInput.jsx)

```jsx
<AppNumberInput label="Số người đi cùng" value={n} onChange={setN} min={0} max={5} />  // rời ô thì kẹp về min..max
```

Quy tắc:
- UX-L1: Mỗi loại control có ĐÚNG `1` cách dựng dùng chung — màn mới không tự dựng control, không chép code control sang màn
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Based on Docs · HeroUI NumberField] Nhập số nguyên trong khoảng biết trước, có nút tăng giảm.
- [Based on Docs · IBM Carbon Design System · Number input] Ví dụ số người đi cùng, số lượt tối đa.

When Not to Use (Khi không dùng):
- [Based on Docs · GOV.UK Design System · Text input (Numbers)] Số dài không cần tăng giảm (số CCCD, số điện thoại) thì dùng Ô nhập chữ.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · UX-L1] Cao 36, bo 8, viền như ô nhập chữ.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Nút giảm bên trái, nút tăng bên phải, số canh giữa chữ số đều bề ngang.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WAI-ARIA APG · Spinbutton · Apple Human Interface Guidelines · Steppers] Chạm min thì nút giảm khoá, chạm max thì nút tăng khoá · khoá cả ô.

Do (Nên):
- [Verified · AppNumberInput.jsx:2-3 (QD-407 D9)] Gõ vượt mức tối đa thì chặn ngay khi gõ, ô giữ nguyên mức tối đa. Gõ dưới mức tối thiểu thì rời ô mới kẹp về mức tối thiểu.

Don't (Không nên):
- [Based on Docs · WAI-ARIA APG · Spinbutton · IBM Carbon Design System · Number input] Không cho gõ chữ cái.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG · Spinbutton · IBM Carbon Design System · Number input] 2 nút có nhãn «Giảm …», «Tăng …» theo tên ô, phím mũi tên lên xuống cũng tăng giảm giá trị.
- [Based on Docs · WAI-ARIA APG › Spinbutton] Gõ số trực tiếp; Tab tới nút Giảm, Tăng rồi Enter hoặc Space.

UX Writing (Cách viết chữ):
- [Based on Docs · GOV.UK Design System · Text input (Prefixes and suffixes)] Nhãn ô nêu đơn vị nếu có (người, lượt).

Lớp CSS:
- `.app-number` · biến thể: — · trạng thái: `:focus-within` `.is-disabled`
- `.app-number-step` · biến thể: — · trạng thái: `:disabled` `:hover`
- `.app-number-input` · biến thể: — · trạng thái: —

Thuộc tính `AppNumberInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Mã định danh gắn lên ô nhập số bên trong. |
| `label` | string | — | Tên đọc màn hình của ô nhập, cũng ghép sau chữ «Giảm» và «Tăng» làm tên của 2 nút bước. |
| `value` | number | `0` | Giá trị số đang hiển thị, đổi từ ngoài thì ô cập nhật lại chữ theo giá trị mới. |
| `onChange` | function | — | Gọi khi rời ô hoặc bấm nút giảm, tăng, nhận số đã kẹp trong khoảng `min` tới `max`. |
| `min` | number | `0` | Giá trị nhỏ nhất, rời ô khi đang dưới mức này thì kẹp về `min`, chạm mức thì khoá nút giảm. |
| `max` | number | `999` | Giá trị lớn nhất được nhập, gõ vượt thì ô giữ ở giá trị này, chạm mức thì khoá nút tăng. |
| `step` | number | `1` | Bước cộng hoặc trừ mỗi lần bấm nút tăng, giảm. |
| `disabled` | boolean | `false` | Khoá ô nhập và cả 2 nút bước, gắn lớp `is-disabled` cho khối bọc. |

### Ô chọn theo cây (`tree-select`)

- Component: `AppTreeSelect` (src/components/app/AppTreeSelect.jsx)

```jsx
<AppTreeSelect treeData={[{ value, title: 'Mã — Tên', children }]} value={v} onChange={setV} placeholder="Chọn …" />  // multiple: chọn nhiều nhánh
```

Quy tắc:
- QD-401
- UX-L10: Mở rộng QD-367: MỌI chỗ hiển thị 1 đối tượng khác (bàn, quầy…) luôn có «Mã — Tên» hoặc 2 cột Mã · Tên, không chỉ hiện mã trơn — hàm chung `tableLabel` · `counterLabelOf` (`lib/tableTimeline.js`). Nguyên văn: *"k ở đâu chỉ hiển thị mỗi mã ấy, k ai hiểu đâu"*. · Ô chọn thông thường hiển thị `Mã — Tên` — gạch dài `—` *(U+2014)*, `1` khoảng trắng mỗi bên, áp cả chữ trong ô đã chọn lẫn từng dòng trong danh sách thả xuống. Nguyên văn: *"Tất cả các combobox thông thường nếu không có gì đặc biệt luôn hiển thị Mã - Tên (gạch là gạch dài dài nhé)"*. Không áp cho ô chọn mà đối tượng không có Mã *(trạng thái, Có/Không, số bản ghi, ngày trong tuần)* và ô hiển thị đặc biệt đã chốt riêng *(vd ô người có ảnh, CCCD)*

When to Use (Khi dùng):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Danh mục có cấp cha con như đơn vị, phòng ban, địa giới hành chính.

When Not to Use (Khi không dùng):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Không phân trang danh sách cây.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Không dùng lẫn với ô chọn một hay ô chọn nhiều.

Anatomy (Cấu tạo):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Ô điều khiển, danh sách dạng cây, nút mở và đóng nhánh.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Có nút mở và đóng nhánh.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Chọn cha có chọn hết con hay không là tuỳ nghiệp vụ, phải khai rõ trong đặc tả màn.

Do (Nên):
- [Verified · UX-L1] Gọi thẳng `AppTreeSelect`, màn mới không tự dựng hay chép code control cây.
- [Verified · catalog.jsx · UX-L10] Nhãn mỗi nút trong `treeData` dạng «Mã — Tên».
- [Verified · AppTreeSelect.jsx] Cần chọn nhiều nhánh thì bật `multiple`, mỗi nút có ô tích và chỉ hiện nút cha khi đã chọn đủ nhánh con.

Don't (Không nên):
- [Verified · UX-L10] Không hiện mã trơn.
- [Verified · UX-B3] Không vẽ thêm lớp viền thứ 2 khi focus.
- [Verified · UX-L3] Không vá kích thước lớp `.ant-` bằng `!important`.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG › Tree View] Mũi tên lên xuống đi giữa nút; mũi tên phải mở nhánh, trái đóng nhánh; Enter chọn.

UX Writing (Cách viết chữ):
- [Verified · Message List I001-37] Placeholder chọn 1 nút theo I001-37 «Chọn {0}».
- [Verified · Message List I001-49] Placeholder khi bật `multiple` theo I001-49 «Chọn một hoặc nhiều {0}».
- [Verified · Message List E001-02] Bỏ trống ô bắt buộc báo E001-02 «Vui lòng chọn {0}».

Lớp CSS:
- `.app-tree-select` · biến thể: `.ant-select` · trạng thái: —

Thuộc tính `AppTreeSelect`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `treeData` | array | `[]` | Cây lựa chọn dạng `{ value, title, children }`, ô tìm lọc theo `title`. |
| `value` | string \| array | — | Giá trị đang chọn, là 1 giá trị khi chọn đơn hoặc mảng giá trị khi bật `multiple`. |
| `onChange` | function | — | Gọi khi người dùng chọn, bỏ chọn hoặc xoá, chuyển thẳng tới `onChange` của antd TreeSelect. |
| `placeholder` | string | — | Chữ gợi ý khi chưa chọn, đồng thời làm `aria-label` mặc định của ô. |
| `multiple` | boolean | `false` | Cho chọn nhiều nhánh bằng ô tích, chỉ hiện nút cha khi chọn đủ nhánh con và gom thẻ thừa thành số. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Ô chọn nhiều (`multi-select`)

- Component: `AppSelect` (src/components/app/AppSelect.jsx)

```jsx
<AppSelect mode="multiple" value={arr} onChange={setArr} options={[{ value, label: 'Mã — Tên' }]} maxTagCount={3} />  // quá 3 tag gom «+N»
```

Quy tắc:
- QD-401
- UX-L10: Mở rộng QD-367: MỌI chỗ hiển thị 1 đối tượng khác (bàn, quầy…) luôn có «Mã — Tên» hoặc 2 cột Mã · Tên, không chỉ hiện mã trơn — hàm chung `tableLabel` · `counterLabelOf` (`lib/tableTimeline.js`). Nguyên văn: *"k ở đâu chỉ hiển thị mỗi mã ấy, k ai hiểu đâu"*. · Ô chọn thông thường hiển thị `Mã — Tên` — gạch dài `—` *(U+2014)*, `1` khoảng trắng mỗi bên, áp cả chữ trong ô đã chọn lẫn từng dòng trong danh sách thả xuống. Nguyên văn: *"Tất cả các combobox thông thường nếu không có gì đặc biệt luôn hiển thị Mã - Tên (gạch là gạch dài dài nhé)"*. Không áp cho ô chọn mà đối tượng không có Mã *(trạng thái, Có/Không, số bản ghi, ngày trong tuần)* và ô hiển thị đặc biệt đã chốt riêng *(vd ô người có ảnh, CCCD)*

When to Use (Khi dùng):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Trường nhận nhiều giá trị như giảng viên phụ trách, chuyên đề, nhóm quyền.

When Not to Use (Khi không dùng):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Trường chỉ có đúng 1 giá trị thì dùng ô chọn một.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Dropdown chọn nhiều] Không để ô cao dần theo số lựa chọn làm vỡ hàng biểu mẫu.

Anatomy (Cấu tạo):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Dropdown chọn nhiều] Ô chứa tối đa 3 tag và tag +N, danh sách có ô tích từng mục, dòng «Chọn tất cả», chân «Đã chọn n / N» kèm «Bỏ chọn tất cả».

Variants & States (Biến thể và trạng thái):
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Giá trị hiện thành tag trong ô, mỗi tag có nút xóa riêng.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Ba loại — phân biệt rõ] Chọn xong không đóng danh sách.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Dropdown chọn nhiều] Hiện tối đa 3 tag trong ô, phần còn lại gom thành +N, hover hiện danh sách đầy đủ.
- [Based on Docs · PM1 DS › Dropdown & danh sách chọn › Dropdown chọn nhiều] Đầu danh sách có «Chọn tất cả», chân danh sách có «Đã chọn n / N» và «Bỏ chọn tất cả».

Do (Nên):
- [Verified · catalog.jsx · UX-L10] Nhãn mỗi mục dạng «Mã — Tên».
- [Verified · UX-A11] Ở chỗ chỉ xem (bước xác nhận, màn Chi tiết, bảng) hiện các giá trị đã chọn dạng tag.
- [Verified · UX-B6] Ô chọn nhiều đặt trọn hàng 12 cột thì không cần xét điểm tách ô với hàng bên cạnh.

Don't (Không nên):
- [Verified · UX-B3] Không vẽ khung riêng cho ô gõ tìm sau các tag đã chọn khi focus.
- [Verified · UX-L10] Không hiện mã trơn.
- [Verified · UX-L3] Không vá kích thước lớp `.ant-` bằng `!important`.

Accessibility (Truy cập và bàn phím):
- [Verified · AppSelect.jsx] Tên đọc lấy theo thứ tự `aria-label` truyền vào rồi tới placeholder.
- [Based on Docs · WAI-ARIA APG Listbox] Danh sách có `aria-multiselectable=true`, mỗi mục báo đã chọn bằng `aria-selected` hoặc `aria-checked`.
- [Based on Docs · WAI-ARIA APG Listbox] Space đổi trạng thái chọn của mục đang focus.

UX Writing (Cách viết chữ):
- [Verified · Message List I001-49] Placeholder theo I001-49 «Chọn một hoặc nhiều {0}».
- [Verified · Message List E001-03] Bỏ trống ô bắt buộc báo E001-03 «Vui lòng chọn ít nhất một {0}».

Thuộc tính `AppSelect`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `className` | string | `''` | Lớp bổ sung, ghép sau lớp `app-select` của Select antd. |
| `width` | number \| string | — | Bề rộng ô chọn, đặt vào `style.width` và bị ghi đè nếu `style` có `width`. |
| `style` | object | — | Style bổ sung của ô chọn, trộn sau `width`. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

## Nút và thao tác

### Nút chính, nút phụ, nút nguy hiểm (`buttons`)

- Component: `AppButton` (src/components/app/AppButton.jsx)

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn
- UX-F7: Popup `2` nút theo khuôn chung `MSG-CF` — nút hủy đúng chữ `Hủy` *(riêng rời trang `MSG-CF-03`: `Ở lại trang`)* · nút OK là tên hành động thật, không `OK` `Đồng ý` `Thực hiện` · tiêu đề không dấu `?` · popup xác nhận *(có icon cạnh tiêu đề `UX-F4`, hoặc `Modal.confirm`)* tiêu đề bắt đầu `Xác nhận`, trừ danh sách ngoại lệ khai trong cổng *(`Thay đổi chưa lưu` của `MSG-CF-03`)* · hộp Xóa và Vô hiệu hóa: nội dung là CÂU HỎI `Bạn có chắc chắn muốn …?` kèm cảnh báo hậu quả *(SỬA 09/10/2026 theo PM2 `QD-350` `QD-352` — luật cũ cấm `Bạn có chắc` NGƯỢC quyết định TrangNT5, hết hiệu lực)* · nút có chữ `Xóa` phải đỏ *(danger)*
- UX-L22: Ô nhập nằm TRONG BẢNG nhập liệu đệm trái `8px` cho gọn nhiều cột *(vd bảng Buồng thăm gặp ở màn Sửa quầy)*; ô nhập trong form giữ `12px`. Nút chính mọi nơi đệm `16px`, không quy tắc riêng theo ngữ cảnh (QD-372 ①)

When to Use (Khi dùng):
- [Verified · catalog.jsx] Form dùng `form-btn form-btn-primary` cho nút chính, `form-btn` cho nút phụ.
- [Verified · catalog.jsx] Danh sách và hộp thoại dùng `btn btn-primary`, `btn`, `btn btn-danger` (Xóa, đỏ).
- [Based on Docs · PM1 DS › Nút] Mỗi màn đúng 1 nút primary cho hành động chính, mọi hành động khác dùng nút viền hoặc nút chữ.
- [Based on Docs · PM1 DS › Nút] Nút cao 36px, bo góc 6px, chữ 14px đậm 500.

When Not to Use (Khi không dùng):
- [Based on Docs · catalog.jsx] Thao tác trên dòng của bảng dùng nút icon.
- [Based on Docs · PM1 DS › Nút › Nút không đổ bóng] Nút không đổ bóng, tắt primaryShadow, defaultShadow, dangerShadow của Ant Design.

Anatomy (Cấu tạo):
- [Verified · QD-387 · UX-C1] Mọi nút có chữ cao 36px bằng ô nhập, khai 1 biến `--btn-h` trong tokens.css. Nút icon trong bảng giữ 32×32 (QD-270).
- [Verified · AppButton.jsx] `AppButton` bọc antd Button, thêm lớp `app-reset` và `data-fe=AppButton`.
- [Verified · UX-C1] Cao 36, chữ 14/500, bo 6, không bóng, cỡ 28 chỉ ở thanh công cụ và trong bảng.
- [Verified · UX-L22] Nút chính đệm 16px ở mọi nơi.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] 4 biến thể: chính, phụ, nguy hiểm (đỏ), khoá (`disabled`).
- [Verified · UX-C6] Nút khoá phải đổi kiểu hiển thị, không để nút khoá mà vẫn màu đỏ.
- [Based on Docs · PM1 DS › Nút] Đang xử lý: nút tự khoá, icon xoay, nhãn đổi sang thể tiếp diễn như «Đang lưu…», «Đang xuất Excel…».
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Nút Lưu, Gửi duyệt, Duyệt, Tạo mới khoá ngay sau cú bấm đầu cho tới khi xử lý xong.

Do (Nên):
- [Verified · UX-L2] Cùng loại nút thì cùng hình dạng trên mọi màn.
- [Verified · UX-C6] Ưu tiên để nút luôn bấm được, bấm khi thiếu thì báo chữ đỏ.
- [Verified · UX-D6] Bấm lưu nhiều lần chỉ sinh 1 bản ghi, lỗi lưu thì mở khoá lại.
- [Verified · QD-421] Nút chuyển sang màn khác cùng cấp (vd «Lịch theo buồng») dùng nút viền xanh chữ xanh nền trắng (btn-outline)

Don't (Không nên):
- [Verified · UX-C5] Nút còn bấm được mà bấm im lặng là sai.
- [Verified · UX-F7] Nút có chữ `Xóa` trong popup không được để màu thường, phải đỏ (danger).

Accessibility (Truy cập và bàn phím):
- [Verified · AppButton.jsx] Nút không có chữ tự lấy `title` làm `aria-label` (WCAG 4.1.2).
- [Based on Docs · WAI-ARIA APG › Button] Tab tới nút; Enter hoặc Space bấm; nút khoá không nhận Tab.

UX Writing (Cách viết chữ):
- [Verified · UX-F7] Nhãn nút là tên hành động thật, không dùng `OK`, `Đồng ý`, `Thực hiện`.
- [Verified · UX-E3] Nhãn nút không có dấu chấm.
- [Verified · UX-C7] `Tạo mới` khi sinh chủ thể mới, `Thêm {đối tượng}` khi gắn thứ đã có.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Viết thông báo lỗi] Nút xác nhận trong modal gọi đúng tên hành động, ví dụ «Xóa hồ sơ».

Lớp CSS:
- `.btn-loading-ring` · biến thể: — · trạng thái: —

Thuộc tính `AppButton`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `className` | string | `''` | Lớp giao diện chuẩn của nút, ghép sau lớp `app-reset`. |
| `children` | ReactNode | — | Nội dung nút, không phải chữ hoặc số thì nút lấy `title` làm `aria-label` khi chưa có tên đọc riêng. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Màu nút chữ theo vai trò (`button-colors`)


Quy tắc:
- UX-L27: Màu NÚT CHỮ theo VAI TRÒ, khai `1` NƠI ở `styles/base.css` khối «MÀU NÚT CHỮ», CSS riêng màn KHÔNG khai lại hay ghi đè màu nút. Phụ `.form-btn` `.btn` *(Lưu nháp · Hủy · Quay lại)* nền trắng viền `#D9D9D9`, rê chuột viền và chữ xanh · Chính `.form-btn-primary` `.btn-primary` xanh thương hiệu, mỗi khu vực `1` nút · Đỏ đặc `.form-btn-danger` `.btn-danger` CHỈ cho nút xác nhận phá hủy TRONG HỘP THOẠI · Viền đỏ `.form-btn-danger.is-outline` `.btn-danger-ghost` cho phá hủy đặt TRÊN TRANG · Cam `.form-btn-warning` lối phụ cạnh nút chính · Xanh lá `.form-btn-success` kết quả chấm Khớp · Viền xanh nền nhạt `.btn-hl` thao tác hàng loạt · Viền thương hiệu `.btn.btn-outline` *(19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-421 ⑤)`)* nền trắng, viền và chữ màu thương hiệu, rê chuột nền nhạt — cho nút mở màn con đứng cạnh nút phụ *(mẫu `Lịch theo buồng` cạnh `Xuất Excel`)* để khác nút phụ, nguyên văn: *"Lịch theo buồng cần set button có màu gì nhỉ, viền xanh ah. Kiểu để nó khác Xuất Excel đó"*. *(20/10/2026, `Verified (TrangNT5 20/10/2026 · PM2 QD-444)`)* 2 nút chuyển bước `Quay lại bước trước` và `Tiếp tục` trong `.step-nav` cũng dùng kiểu viền thương hiệu này *(luật `#root .step-nav .form-btn` ở `base.css`, thắng luật nút phụ)*. Nguyên văn: *"Button Tiếp tục và Quay lại trang trước: nên để button trắng, viền xanh"*. Nút trang và form luôn có icon + chữ, nút popup giữ chữ trần (QD-389)
- QD-244
- QD-390

When to Use (Khi dùng):
- [Verified · UX-L27] Chọn màu nút theo VAI TRÒ của thao tác, không theo sở thích: chính xanh, phụ trắng viền xám, phá hủy đỏ.
- [Verified · QD-244] Đỏ đặc `form-btn-danger` · `btn-danger` CHỈ cho nút xác nhận phá hủy trong hộp thoại (Xóa, Xác nhận hủy lịch hẹn).
- [Verified · QD-244] Hành động phá hủy đặt trên trang dùng viền đỏ chữ đỏ nền trắng: `form-btn-danger is-outline` · `btn-danger-ghost`.
- [Verified · QD-244] Cam `form-btn-warning` cho lối phụ cạnh nút chính khi khu vực đã có nút xanh (Đăng ký chờ check-in).
- [Verified · QD-389] Nút trang và form có icon + chữ; nút trong popup giữ chữ trần theo khuôn MSG-CF.

When Not to Use (Khi không dùng):
- [Verified · UX-L27] Không khai màu nút trong CSS riêng của màn — mọi màu nút chữ khai 1 nơi ở `styles/base.css` khối «MÀU NÚT CHỮ».
- [Verified · QD-244] Không dùng đỏ đặc cho nút trên trang, không để 2 nút xanh chính trong cùng 1 khu vực.

Anatomy (Cấu tạo):
- [Verified · base.css] Màu lấy từ token: chính `--color-brand`, đỏ `--color-danger`, cam `--color-accent`; xanh lá `#059669` cho chấm Khớp.
- [Verified · base.css] Nút phụ nền trắng, viền `#D9D9D9`, chữ 88% đen, rê chuột viền và chữ xanh như antd mặc định.

Variants & States (Biến thể và trạng thái):
- [Verified · base.css] Mỗi màu có màu rê chuột đậm hơn khai cùng chỗ; nút khoá đổi kiểu hiển thị (UX-C6).

Do (Nên):
- [Verified · UX-L27] Dùng xanh lá `form-btn-success` cho kết quả chấm Khớp ở khu đối chiếu giấy tờ.
- [Verified · UX-L27] Dùng `btn-hl` viền xanh nền nhạt cho thao tác hàng loạt khi đã chọn dòng.
- [Verified · QD-244] Hủy lịch hẹn ở Chi tiết và Danh sách dùng chung 1 hộp Hủy, nút Xác nhận hủy đỏ đặc.
- [Verified · QD-244] Nút Hủy lịch hẹn dùng icon lịch có dấu X, khác icon Từ chối duyệt.
- [Verified · QD-437] Nút gửi duyệt («Lưu và gửi duyệt», «Lưu và duyệt») luôn là nút chính màu xanh chủ đạo, kể cả khi đứng ở đầu màn bước 1, 2
- [Verified · QD-439] Nhãn nút gửi theo trạng thái sau khi lưu: vào thẳng Đã duyệt thì «Lưu và duyệt», vào trạng thái chờ thì «Lưu và gửi duyệt»

Don't (Không nên):
- [Verified · UX-F7] Nút có chữ `Xóa` trong popup không được để màu thường, phải đỏ (danger).
- [Verified · UX-C6] Không để nút đang khoá mà vẫn giữ màu đỏ.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WCAG 2.2 1.4.1 · QD-389] Màu không là cách duy nhất phân biệt vai trò nút, nút trang và form luôn có icon và chữ tên hành động.
- [Verified · base.css] Nút `btn-hl` khi focus bằng bàn phím đổi nền xanh giống khi rê chuột.

UX Writing (Cách viết chữ):
- [Verified · Message List C001-14] Hộp Hủy lịch hẹn có nút đỏ `Xác nhận hủy lịch hẹn` và nút `Hủy`.
- [Verified · Message List I001-23] Nút chính trong hộp xác nhận ghi tên hành động thật như `Xóa {0}`, không dùng `Xác nhận`, `Đồng ý`, `OK`.
- [Verified · Message List §1.3 mục 6] Nhãn nút không có dấu chấm.

### Nút icon trong bảng (`icon-buttons`)

- Component: `AppButtonWithIcon`

```jsx
<AppButtonWithIcon className={'ib ib-' + tone + (danger ? ' dg' : '')} title={label} icon={…} iconRaw={…} />
Lịch hẹn: ROW_ACTIONS · ACTION_COLOR · ACTION_ICON · LIST_ICONS (listLogic.js) — Xem · Chỉnh sửa · Phê duyệt · Từ chối duyệt · Điều chỉnh · Hủy · Vắng mặt · Xóa
Quầy: ACTION_CONFIG · COUNTER_ICONS (ReceptionDeskShared/config.js) — Xem · Chỉnh sửa · Kích hoạt · Vô hiệu hóa · Xóa
Luôn có title (tooltip) · thao tác nguy hiểm thêm lớp dg
```

Quy tắc:
- UX-L5: Nút icon cùng chức năng (cùng tooltip) ⇒ cùng kích thước trên MỌI màn

When to Use (Khi dùng):
- [Verified · listLogic.js · ReceptionDeskShared/config.js] Thao tác trên từng dòng của bảng, đủ 10 loại: Xem chi tiết, Chỉnh sửa, Phê duyệt, Từ chối duyệt, Điều chỉnh thời gian và buồng thăm gặp, Hủy lịch hẹn, Đánh dấu vắng mặt, Xóa {đối tượng}, Kích hoạt, Vô hiệu hóa.
- [Based on Docs · PM1 DS › Nút › Nút riêng của từng màn trong cột Thao tác] Nút riêng của màn đặt sau Xem, Sửa, Xóa.
- [Based on Docs · PM1 DS › Nút › Nút riêng của từng màn trong cột Thao tác] Cột Thao tác mặc định rộng 120px, 160px cho 4 nút, 210px cho 5 tới 6 nút.

When Not to Use (Khi không dùng):
- [Verified · Playbook_List §1 khối 8] Không gom icon vào nút «…».

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] `AppButtonWithIcon` lớp `ib` cộng lớp màu `ib-edit`, `ib-warn`, `ib-approve`, `ib-danger dg`, kèm `title` và `icon`.
- [Verified · Playbook_List §3] Nút 32×32, svg 16, khe giữa các nút 4.

Variants & States (Biến thể và trạng thái):
- [Verified · Playbook_List §3] Màu theo ý nghĩa: Xem `#1D5FA6`, Sửa `#C2410C`, Duyệt và Kích hoạt `#0E7C6B`, Từ chối, Hủy, Xóa `#B91C1C`, Vô hiệu hóa `#A16207`.
- [Verified · Playbook_List §2 mục 5] Nút không đủ điều kiện theo trạng thái thì ẩn hẳn.
- [Based on Docs · PM1 DS › Nút › Trạng thái tương tác của nút icon trong bảng] Rê chuột: nền rgba(15,23,42,.06), bấm: nền rgba(15,23,42,.10), chuyển trong 0.15s.
- [Based on Docs · PM1 DS › Nút › Trạng thái tương tác của nút icon trong bảng] Focus bàn phím có viền 2px màu thương hiệu cách nút 2px, không được tắt outline.

Do (Nên):
- [Verified · catalog.jsx] Luôn có `title` làm tooltip.
- [Verified · UX-L5] Cùng tooltip thì cùng kích thước trên mọi màn.
- [Verified · Playbook_List §3] Khai màu đúng 1 nơi ở `styles/base.css`, không ghi đè trong màn.

Don't (Không nên):
- [Verified · UX-L5] Không ép nút co lại trong cột thao tác.
- [Verified · Playbook_List §3] Không dùng chung 1 icon cho 2 ý nghĩa, Hủy là lịch có dấu X, Từ chối là tròn có dấu X.

Accessibility (Truy cập và bàn phím):
- [Verified · AppButton.jsx] Nút chỉ có icon tự lấy `title` làm `aria-label`.
- [Based on Docs · PM1 DS › Nút › Năm quy tắc sinh từ bug] Mọi nút chỉ có icon ở cột Thao tác có cả tooltip và aria-label.
- [Based on Docs · WAI-ARIA APG › Button] Tab tới nút; Enter hoặc Space bấm; tên nút đọc từ nhãn ẩn, không chỉ từ icon.

UX Writing (Cách viết chữ):
- [Verified · UX-C2] Tooltip cố định: `Xem chi tiết`, `Chỉnh sửa`, `Hủy {đối tượng}`, `Xóa {đối tượng}`, `Phê duyệt`, `Từ chối duyệt`.

Lớp CSS:
- `.ib` · biến thể: `.dg` `.ib-approve` `.ib-danger` `.ib-edit` `.ib-neutral` `.ib-view` `.ib-warn` `.ib-x` · trạng thái: `:disabled` `:hover` `[aria-disabled="true"]`

### Thanh nút đầu màn (ghim khi cuộn) (`page-actions`)

- Component: `PageActions` (src/components/app/PageActions.jsx)

```jsx
const actions = [{ id, label, className, left? }]
<div className="page-head">…<PageHeadActions actions={actions} /></div>  // id gốc nằm ở đầu màn (engine, E2E tra theo id)
// ghim: base.css — main thôi cuộn, .shell tự cuộn, .page-head / .shell-head / .status-bar sticky top 0 (QD-393, UX-L9)
// ⛔ thanh chân: PageFooter không vẽ
```

Quy tắc:
- UX-L9: 1 THANH NÚT DUY NHẤT ở ĐẦU MÀN, GHIM mép trên khi cuộn — không thanh chân trang *(đổi 14/10/2026 theo D28 A; trước là cặp đầu và chân theo QD-323)*. Khung `.shell` tự cuộn, đầu màn (`.page-head`, `.shell-head`, `.status-bar`) dính mép trên ngay từ đầu nên không trôi, không lộ lớp, không giật — *(19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-424)`)* đầu màn ghim `top: 30px` ngay dưới breadcrumb *( Xem `UX-I4`)*. Thanh nút dựng từ `1` cấu hình `components/app/PageActions.jsx`, nút đầu màn mang id gốc (engine, E2E tra id này); `PageFooter` không vẽ. NGOẠI LỆ màn NHIỀU BƯỚC *(ĐỔI 19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-431 ④)`, thay thứ tự `4` nút trên `1` thanh của QD-420 ⑥)*: `Quay lại bước trước` *(trái)* và `Tiếp tục` *(icon mũi tên phải, phải)* đặt ở CHÂN nội dung bước *(`.step-nav`, nhóm trái · nhóm phải)* như Ant Design Steps, Material Stepper · đầu màn chỉ còn nút chính *(`Lưu nháp`, nút lưu cuối như `Lưu và gửi duyệt`)* — chi tiết ở Playbook CreateEdit khối `8`. *(20/10/2026, `Verified (TrangNT5 20/10/2026 · PM2 QD-444)`)* thanh `.step-nav` GHIM ĐÁY khung `.shell` *(`position: sticky; bottom: 0`, nền trắng, viền và bóng phía trên đối xứng đầu màn ghim)*, nội dung ngắn vẫn nằm sát đáy. Nguyên văn: *"Cho button Tiếp tục, quay lại fix ở phía dưới footer ấy"*. Nguyên văn: *"Thử tách button Quay lại và Tiếp tục đối với màn hình đặc thù nhiều Steps. Còn ở trên sẽ chỉ là button action chính"* · TrangNT5 trả lời: *"Tách: Quay lại/Tiếp tục ở cuối bước (Recommended)"*. Dải nhắc thiếu thông tin nằm ngay dưới đầu màn. Áp mọi màn gồm Danh sách. Nguyên văn: *"Chỗ này mọi ng có ý kiến không muốn có 2 bộ button"* · *"Phải xử lý các lớp đừng bị đè lộ và giật giật"* · *"Apply cả vụ pin khu vực button + button vào toàn bộ các MH PM2"*

When to Use (Khi dùng):
- [Verified · UX-L9 · QD-393] Mọi màn PM2: 1 thanh nút duy nhất ở đầu màn, ghim mép trên khi cuộn, không còn thanh chân trang.

When Not to Use (Khi không dùng):
- [Verified · UX-L9] Màn Danh sách không áp.
- [Verified · UX-L9] Không để màn tự viết 2 thanh nút riêng.

Anatomy (Cấu tạo):
- [Verified · PageActions.jsx] Màn khai 1 mảng nút `{ id, label, className, onClick, icon, disabled, hidden, title, left }` rồi truyền cho `PageHeadActions` đặt trong `.page-head`.
- [Verified · PageActions.jsx · QD-393] Nút ở đầu màn mang id gốc, engine và bộ kiểm thử E2E tra theo id này.
- [Verified · UX-L9 · QD-393] Khung `.shell` tự cuộn, đầu màn `.page-head` (hoặc `.shell-head`, `.status-bar`) là con đầu tiên nên dính mép trên ngay từ đầu, lệch 0px khi cuộn.

Variants & States (Biến thể và trạng thái):
- [Verified · PageActions.jsx] Nút có `hidden` thêm lớp `is-hidden-block`, nút có `disabled` bị khoá.
- [Verified · UX-L9] Màn nhiều bước có đủ `Quay lại bước trước` và `Tiếp tục` ở cả 2 thanh.

Do (Nên):
- [Verified · Playbook_CreateEdit §1 khối 7 · QD-393] Đặt dải nhắc thiếu thông tin ngay dưới đầu màn, sát thanh nút đang khoá.
- [Verified · UX-L9] 2 thanh cùng bộ nút, cùng thứ tự, cùng hàm xử lý ở mọi bước và mọi chế độ Xem, Sửa.
- [Verified · PageActions.jsx] Nút không icon (ví dụ Hủy) dựng bằng `AppButton` để không có khung svg rỗng.

Don't (Không nên):
- [Verified · UX-L9 · QD-393] Không dựng thanh nút chân trang, không tự viết thanh nút thứ 2.
- [Verified · QD-393] Không bọc đầu màn trong lớp có overflow hidden làm mất ghim.

Accessibility (Truy cập và bàn phím):
- [Verified · AppButton.jsx] Nút trong thanh chỉ có icon tự lấy `title` làm `aria-label`.
- [Verified · PageActions.jsx · form.css] Nút có `hidden` ẩn hẳn bằng `display:none` nên không nhận Tab.
- [Based on Docs · WAI-ARIA APG › Button] Tab tới nút, Enter hoặc Space để bấm, nút khoá không nhận Tab.

UX Writing (Cách viết chữ):
- [Verified · Playbook_CreateEdit §2 mục 7] Nút lưu ghi đúng động từ nghiệp vụ.

Lớp CSS:
- `.page-head` · biến thể: — · trạng thái: —
- `.shell` · biến thể: `.reserved-table` · trạng thái: —
- `.shell-head` · biến thể: — · trạng thái: —
- `.status-bar` · biến thể: — · trạng thái: —
- `.page-head-actions` · biến thể: — · trạng thái: —
- `.step-nav` · biến thể: — · trạng thái: —
- `.step-nav-spacer` · biến thể: — · trạng thái: —
- `.form-footer` · biến thể: `.eff` `.stepper` · trạng thái: —

### Khoảng cách giữa các nút (`button-gap`)


```jsx
/* tokens.css */ --btn-gap: 8px;
/* mọi khối nút: .nhom-nut-bang · .head-actions · .page-head-actions · .form-footer · .person-actions · .bulk-actions */ gap: var(--btn-gap);
```

Quy tắc:
- QD-384

When to Use (Khi dùng):
- [Verified · QD-384] Khoảng cách giữa 2 nút liền kề cố định 8px trên mọi thanh nút: đầu trang, chân trang, thanh nút danh sách, nút trong khối, hộp Thao tác hàng loạt.
- [Verified · QD-384] Khối nút dùng `gap: var(--btn-gap)`, biến `--btn-gap` khai 1 nơi ở `styles/tokens.css`.

When Not to Use (Khi không dùng):
- [Based on Docs · QD-384] Không gõ cứng khoảng cách giữa các nút bằng px trong CSS riêng của màn.
- [Based on Docs · QD-384] Không để khối nút thiếu khai `gap` (khối `nhom-nut-bang` từng ra 3,8px).

Anatomy (Cấu tạo):
- [Verified · base.css · form.css] Các khối nút dùng `gap: var(--btn-gap)` gồm `.nhom-nut-bang`, `.head-actions`, `.page-head-actions`, `.form-footer`, `.person-actions`, `.bulk-actions`.
- [Verified · base.css] Đầu màn `.shell-head` có nút chế độ xem cạnh thanh nút thì bù lề để khe về đúng `--btn-gap`.

Variants & States (Biến thể và trạng thái):
- [Verified · base.css] Hộp Thao tác hàng loạt `.bulk-actions` xếp lưới 3 cột, khe giữa nút vẫn là `--btn-gap`.
- [Verified · base.css] Thanh `.head-actions` xuống dòng khi thiếu chỗ, khe giữa nút giữ `--btn-gap`.

Do (Nên):
- [Verified · QD-384] Đối chiếu khe giữa cặp nút với PM1, PM1 đo 15/15 cặp nút đều 8px.

Don't (Không nên):
- [Verified · QD-384] Không để thanh nút Tạo, Sửa, Chi tiết lệch khe 10px như trước khi sửa.

Lớp CSS:
- `.nhom-nut-bang` · biến thể: — · trạng thái: —
- `.head-actions` · biến thể: — · trạng thái: —
- `.page-head-actions` · biến thể: — · trạng thái: —
- `.form-footer` · biến thể: `.eff` `.stepper` · trạng thái: —
- `.person-actions` · biến thể: — · trạng thái: —
- `.bulk-actions` · biến thể: — · trạng thái: —

### Đầu màn Tạo / Sửa / Chi tiết (nút quay lại) (`back`)

- Component: `CatalogStatusTag` (src/components/app/CatalogStatusTag.jsx)

```jsx
<div className="page-head"><AppButtonWithIcon className="page-head-back" …/><div className="page-head-text"><h1 className="page-head-row">Tiêu đề<CatalogStatusTag …/></h1></div><PageHeadActions actions={actions} /></div>
```

Quy tắc:
- UX-L9: 1 THANH NÚT DUY NHẤT ở ĐẦU MÀN, GHIM mép trên khi cuộn — không thanh chân trang *(đổi 14/10/2026 theo D28 A; trước là cặp đầu và chân theo QD-323)*. Khung `.shell` tự cuộn, đầu màn (`.page-head`, `.shell-head`, `.status-bar`) dính mép trên ngay từ đầu nên không trôi, không lộ lớp, không giật — *(19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-424)`)* đầu màn ghim `top: 30px` ngay dưới breadcrumb *( Xem `UX-I4`)*. Thanh nút dựng từ `1` cấu hình `components/app/PageActions.jsx`, nút đầu màn mang id gốc (engine, E2E tra id này); `PageFooter` không vẽ. NGOẠI LỆ màn NHIỀU BƯỚC *(ĐỔI 19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-431 ④)`, thay thứ tự `4` nút trên `1` thanh của QD-420 ⑥)*: `Quay lại bước trước` *(trái)* và `Tiếp tục` *(icon mũi tên phải, phải)* đặt ở CHÂN nội dung bước *(`.step-nav`, nhóm trái · nhóm phải)* như Ant Design Steps, Material Stepper · đầu màn chỉ còn nút chính *(`Lưu nháp`, nút lưu cuối như `Lưu và gửi duyệt`)* — chi tiết ở Playbook CreateEdit khối `8`. *(20/10/2026, `Verified (TrangNT5 20/10/2026 · PM2 QD-444)`)* thanh `.step-nav` GHIM ĐÁY khung `.shell` *(`position: sticky; bottom: 0`, nền trắng, viền và bóng phía trên đối xứng đầu màn ghim)*, nội dung ngắn vẫn nằm sát đáy. Nguyên văn: *"Cho button Tiếp tục, quay lại fix ở phía dưới footer ấy"*. Nguyên văn: *"Thử tách button Quay lại và Tiếp tục đối với màn hình đặc thù nhiều Steps. Còn ở trên sẽ chỉ là button action chính"* · TrangNT5 trả lời: *"Tách: Quay lại/Tiếp tục ở cuối bước (Recommended)"*. Dải nhắc thiếu thông tin nằm ngay dưới đầu màn. Áp mọi màn gồm Danh sách. Nguyên văn: *"Chỗ này mọi ng có ý kiến không muốn có 2 bộ button"* · *"Phải xử lý các lớp đừng bị đè lộ và giật giật"* · *"Apply cả vụ pin khu vực button + button vào toàn bộ các MH PM2"*
- UX-A3: Tag và thẻ trạng thái

When to Use (Khi dùng):
- [Verified · catalog.jsx] Đầu màn Tạo, Sửa, Chi tiết.

When Not to Use (Khi không dùng):
- [Based on Docs · catalog.jsx] Màn Danh sách dùng đầu màn Danh sách, không có nút quay lại.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] `.page-head` gồm nút `page-head-back`, ô icon `.page-head-icon`, `h1.page-head-row` (tiêu đề kèm tag trạng thái), rồi `PageHeadActions`.
- [Verified · UX-L5] Nút quay lại 34px dùng chung lớp `page-head-back`.
- [Verified · QD-376] Ô icon 28px, icon 16px, bo 6px.

Variants & States (Biến thể và trạng thái):
- [Verified · Playbook_CreateEdit §1 khối 2] Màn Sửa có tag trạng thái cạnh tiêu đề.
- [Verified · UX-A3] Tag cạnh tiêu đề màn Sửa, Chi tiết cùng 1 kiểu giữa mọi màn.
- [Verified · QD-424] Breadcrumb nằm trong khung trắng, ghim cùng đầu màn khi cuộn

Do (Nên):
- [Verified · UX-A6] Tiêu đề và tag cùng 1 đường giữa.
- [Verified · Playbook_CreateEdit §2 mục 12] Quay lại và sau khi lưu về đúng màn Danh sách theo đường đã vào.
- [Verified · UX-D7] Đang gõ dở mà bấm quay lại thì mở hộp `Thay đổi chưa lưu`.

Don't (Không nên):
- [Verified · QD-376] Không đặt câu mục đích dưới tiêu đề, mã bản ghi đưa lên cuối tiêu đề.
- [Verified · UX-L5] Không tự dựng nút quay lại kích thước riêng như `dt-back` 32px.

Accessibility (Truy cập và bàn phím):
- [Verified · catalog.jsx] Nút quay lại chỉ có icon nên có `title` «Quay lại danh sách» và `aria-label` «Quay lại».

UX Writing (Cách viết chữ):
- [Verified · Playbook_CreateEdit §1 khối 2] Tiêu đề `Tạo {đối tượng}` hoặc `Chỉnh sửa {đối tượng} {mã}`.

Lớp CSS:
- `.page-head` · biến thể: — · trạng thái: —
- `.page-head-text` · biến thể: — · trạng thái: —
- `.page-head-row` · biến thể: — · trạng thái: —
- `.page-head-back` · biến thể: — · trạng thái: `:hover`
- `.tag` · biến thể: `.catalog-status` `.tag-absent` `.tag-active` `.tag-applied` `.tag-applied-sub` `.tag-approved` `.tag-cancelled` `.tag-category` `.tag-checked-in` `.tag-completed` `.tag-discipline` `.tag-dot` `.tag-draft` `.tag-exception` `.tag-expired` `.tag-in-progress` `.tag-inactive` `.tag-penalty` `.tag-pending-approval` `.tag-registrant` `.tag-rejected` `.tag-relationship` `.tag-relationship-child` `.tag-relationship-father` `.tag-relationship-mother` `.tag-relationship-sibling` `.tag-relationship-spouse` `.tag-status` `.tag-table` `.tag-type` `.tag-unassigned` `.tag-visit-other` `.tag-visit-standard` `.tag-waiting-check-in` · trạng thái: —

Thuộc tính `CatalogStatusTag`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `status` | 'DRAFT' \| 'ACTIVE' \| 'INACTIVE' | — | Trạng thái danh mục quyết định màu: `DRAFT` lớp `tag-draft`, `ACTIVE` lớp `tag-active`, `INACTIVE` lớp `tag-inactive`. |
| `label` | string | — | Chữ hiển thị trong tag, truyền nguyên văn từ nơi gọi. |
| `className` | string | `''` | Lớp CSS thêm vào sau các lớp `tag tag-dot catalog-status`. |

### Nút chuyển dạng phân đoạn (chế độ xem) (`segmented`)

- Component: `AppSegmented` (src/components/app/AppSegmented.jsx)

```jsx
<AppSegmented value={k} onChange={setK} items={[{ key, label, icon }]} />  // dùng lại khuôn .mode/.mode-b của màn Danh sách lịch hẹn
```

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn

When to Use (Khi dùng):
- [Based on Docs · HeroUI ToggleButtonGroup] Đổi chế độ xem của cùng 1 dữ liệu.
- [Verified · AppointmentList.jsx] Màn Danh sách lịch hẹn: Danh sách · Lịch theo buồng.

When Not to Use (Khi không dùng):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Lọc dữ liệu theo trạng thái thì dùng Thanh tab.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · base.css] Dùng lại khuôn .mode/.mode-b có sẵn ở base.css.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · Material Design 3 · Segmented buttons · IBM Carbon Design System · Content switcher] Đang chọn (on) · chưa chọn · rê chuột · focus bàn phím · khoá.

Do (Nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] 2–3 chế độ, mỗi chế độ có icon và chữ.

Don't (Không nên):
- [Based on Docs · Material Design 3 · Segmented buttons] Không dùng thay nút thao tác.

Accessibility (Truy cập và bàn phím):
- [Verified · AppointmentList.jsx] role tablist, mỗi nút role tab và aria-selected.
- [Based on Docs · WAI-ARIA APG › Tabs] Tab vào nhóm; mũi tên trái phải đổi chế độ; Enter hoặc Space chọn.

UX Writing (Cách viết chữ):
- [Based on Docs · IBM Carbon Design System · Content switcher · Material Design 3 · Segmented buttons] Tên chế độ là danh từ: Danh sách, Lịch theo buồng.

Lớp CSS:
- `.mode` · biến thể: — · trạng thái: —
- `.mode-b` · biến thể: — · trạng thái: `:hover` `.on`

Thuộc tính `AppSegmented`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `items` | array | `[]` | Danh sách đoạn dạng `{ key, label, icon, iconRaw, title }`, mỗi đoạn vẽ thành 1 nút có icon. |
| `value` | string | — | Khoá của đoạn đang chọn, đoạn trùng khoá được gắn lớp `on` và `aria-selected` bằng true. |
| `onChange` | function | — | Gọi khi người dùng bấm 1 đoạn, nhận `key` của đoạn đó. |
| `label` | string | `'Chế độ xem'` | Tên đọc màn hình của thanh, gắn vào `aria-label` của khối `role=tablist`. |

### Thanh công cụ (`toolbar`)

- Component: `AppToolbar` (src/components/app/AppToolbar.jsx)

```jsx
<AppToolbar label="Thao tác với danh sách" groups={[[<nút/>, <nút/>], [<nút/>]]} />  // mũi tên trái phải đi giữa nút
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Toolbar] Gom nhiều nút thao tác cùng nhóm trên 1 vùng.
- [Based on Docs · WAI-ARIA APG · Toolbar] Thanh nút trên bảng, trên khối.

When Not to Use (Khi không dùng):
- [Based on Docs · WAI-ARIA APG · Toolbar] 1–2 nút thì đặt thẳng, không cần thanh.

Anatomy (Cấu tạo):
- [Verified · QD-406] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Based on Docs · WAI-ARIA APG · Toolbar] Các nhóm nút, giữa nhóm có vạch ngăn dọc.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WAI-ARIA APG · Toolbar] Nút khoá bị bỏ qua khi đi bằng mũi tên.

Do (Nên):
- [Verified · tokens.css] Khoảng cách giữa nút dùng biến --btn-gap.

Don't (Không nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Không trộn liên kết và nút trong 1 thanh.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG › Toolbar] Tab vào thanh 1 lần; mũi tên trái phải đi giữa nút; Home và End tới nút đầu, cuối.

UX Writing (Cách viết chữ):
- [Based on Docs · WAI-ARIA APG · Toolbar] Nhãn thanh nói rõ thao tác với gì.

Lớp CSS:
- `.app-toolbar` · biến thể: — · trạng thái: —
- `.app-toolbar-sep` · biến thể: — · trạng thái: —
- `.app-toolbar-group` · biến thể: — · trạng thái: —

Thuộc tính `AppToolbar`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `label` | string | — | Tên đọc màn hình của thanh công cụ, gắn vào `aria-label` của khối `role=toolbar`. |
| `groups` | array | `[]` | Mảng nhóm nút, mỗi nhóm vẽ trong `app-toolbar-group` và ngăn với nhóm trước bằng vạch dọc. |

## Hiển thị dữ liệu

### Bảng dữ liệu và dòng rỗng (`table`)

- Component: `AppTable` (src/components/app/AppTable.jsx), `EmptyRow` (src/components/app/EmptyRow.jsx)

```jsx
<AppTable rowKey="code" columns={cols} dataSource={rows} emptyRow={<EmptyRow colSpan={5} entity="quầy tiếp đón" hasRecords={total > 0} />} />
```

Quy tắc:
- UX-G2: Mọi bảng có khung viền bọc bo góc, GÓC liền màu tiêu đề — áp cho bảng danh sách, bảng trong form, Chi tiết và popup. Có thanh cuộn dọc thì vùng phía trên thanh cuộn tô liền màu dòng tiêu đề cột, thanh cuộn mảnh và chạy từ dưới dòng tiêu đề *(khuôn gốc `.shell-body.tbl` ở `styles/base.css`)*. Nguyên văn: *"Bo góc bảng"* và *"Góc bảng màn danh sách liền màu tiêu đề ==> Add vào nhé"* *(sửa `09/10/2026`, bản cũ chỉ ghi bo `8px`, kiểm bằng mắt)*. *(20/10/2026, `Verified (TrangNT5 20/10/2026 · PM2 QD-444)`)* Gạch ngăn dòng dữ liệu dùng CHUNG 1 mã `--color-row-line` `#E5E7EB` *(khai ở `pm1-look.css`)* cho ô bảng, khối nhãn và giá trị ở màn Chi tiết, dòng danh sách thông báo — không khai thẳng màu xám khác cho gạch ngăn dòng. Viền khung, thẻ, ô nhập vẫn `--color-line`. Nguyên văn: *"gạch xám này toàn hệ thống có dùng chung 1 mã không"* · *"D2 A dùng theo màn chi tiết ấy"*
- UX-G8: Dòng rỗng của MỌI bảng cùng `1` khuôn — *(mở rộng 09/10/2026 theo D32 A, nguyên văn: «D32 áp dụng hết»)* áp cả bảng trong tab màn Chi tiết, Sửa *(Bàn, Suất riêng, Tình hình sử dụng; riêng Lịch sử thao tác từ 19/10/2026 là dạng tiến trình `HistoryTable.jsx` theo PM2 `QD-420` ⑧, rỗng hiện `1` mục `li.tl-empty` cùng câu `I001-27`)*, không khung nét đứt hay chữ tự gõ «Không có dữ liệu» — component `components/app/EmptyRow.jsx`: màn chưa có bản ghi nào ⇒ `I001-27` *«Chưa có {đối tượng} nào»* · có bản ghi mà lọc không ra ⇒ `I001-28` · cùng màu chữ, cỡ chữ, chiều cao, đầu bảng vẫn hiện · chữ nằm giữa PHẦN KHUNG ĐANG NHÌN THẤY, không giữa cả bảng *(bảng nhiều cột rộng hơn khung thì chữ không bị đẩy lệch phải)*. Nguyên văn: *"Ơ hay cùng trường hợp không có data mà 3 màn hình khác nhau 1. Câu hiển thị mesage khác nhau 2. Có cái thì mở cả Header có cái thì không 3. Có cái text đen, cais text xám"* · *"câu này cho đồng bộ đi"*
- UX-L20: Mã trong bảng danh sách là chữ thường, không làm link sang màn Chi tiết — vào Chi tiết bằng nút thao tác của dòng. Nguồn: TrangNT5 *"Bỏ click vào mã vào đc màn chi tiết nhé ==> Nó bị lẫn"*

When to Use (Khi dùng):
- [Verified · UX-G2] Hiển thị tập bản ghi dạng hàng cột ở màn danh sách, bảng trong form, màn Chi tiết và popup
- [Verified · UX-G8] Bảng trong tab màn Chi tiết, màn Sửa (Lịch sử thao tác, Buồng, Suất riêng, Tình hình sử dụng) dùng cùng khuôn bảng và dòng rỗng
- [Based on Docs · PM1 DS › Bảng dữ liệu › Cấu trúc cột — bắt buộc] Bảng phức tạp như gộp ô, header nhiều tầng, bảng phân nhóm thì đánh giá trước rồi mới quyết có cột STT.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Sắp xếp, cuộn, chọn nhiều] Bảng có ô tích chọn nhiều bắt buộc có ô tích tổng «Chọn tất cả» ở đầu danh sách.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Chiều cao khung & vùng cuộn] Mỗi khung có đúng 1 vùng cuộn: đầu khung và chân khung đứng yên, chỉ thân bảng cuộn.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Trần chiều cao lấy từ đâu] Trần chiều cao khung là max-height 100% của vùng nội dung, không phải 1 con số px.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Trần chiều cao lấy từ đâu] Vùng cuộn của bảng ép overflow-y auto !important, thử ở mức phóng to 125% và 150% trước khi kết luận đạt.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Trần chiều cao lấy từ đâu] Khi in: bỏ trần chiều cao, bỏ vùng cuộn, ẩn thanh nút, bỏ giới hạn bề ngang bằng khối @media print.

When Not to Use (Khi không dùng):
- [Verified · Playbook_List §2 mục 12] Thông tin dài (nội dung mẫu, danh sách người nhận, mô tả thao tác) không đưa vào bảng danh sách mà để ở màn hoặc popup Chi tiết
- [Verified · Playbook_List §2 mục 3] Thông tin phụ của mã (nguồn, loại) đặt thành dòng phụ trong ô, không thêm cột
- [Verified · Playbook_List §2 mục 9] Không cho bấm tiêu đề cột để sắp xếp, thứ tự mặc định là ngày tạo mới nhất ở dòng 1
- [Based on Docs · PM1 DS › Bảng dữ liệu › Trần chiều cao lấy từ đâu] Không khoá chiều cao khung bằng calc(100vh - 64px).
- [Based on Docs · PM1 DS › Bảng dữ liệu › Trần chiều cao lấy từ đâu] Khung dùng overflow clip, không dùng overflow hidden để tránh 2 thanh cuộn lồng nhau.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Sắp xếp, cuộn, chọn nhiều] Bảng nằm trong modal hay tab thì vùng cuộn là thân bảng, không phải cả trang.

Anatomy (Cấu tạo):
- [Verified · UX-G2] Khung viền 1px bo 12px bọc ngoài bảng, góc trên liền màu dòng tiêu đề cột
- [Verified · Playbook_List §1 khối 8 · §3] Dòng tiêu đề cột ghim khi cuộn dọc, nền đỏ nhạt, cao 40px
- [Verified · Playbook_List §2 mục 2 · §3] Hàng dữ liệu cao 82px, ô chính 3 dòng gồm tên in đậm và 2 dòng phụ
- [Verified · Playbook_List §1 khối 8 · §3] Cột Thao tác ghim phải, nền đặc, icon thao tác 32×32
- [Verified · EmptyRow.jsx] Dòng rỗng EmptyRow gộp mọi cột khi bảng không có dòng nào

Variants & States (Biến thể và trạng thái):
- [Verified · Playbook_List §1 khối 8] Có dữ liệu: hàng rê chuột tô nhạt hơn nền tiêu đề 1 bậc
- [Verified · UX-G8] Màn chưa có bản ghi nào: dòng rỗng I001-27 «Chưa có {0} nào», đầu bảng vẫn hiện
- [Verified · UX-G8] Có bản ghi mà lọc không ra: dòng rỗng I001-28 «Không có dữ liệu phù hợp với điều kiện tìm kiếm»
- [Verified · UX-G4] Bản ghi vừa tạo hoặc vừa sửa: dòng tô nền #ECFDF5 trong 3 giây rồi nhạt dần
- [Verified · UX-G10] Bảng ít cột không sinh thanh cuộn ngang ở màn 1366px, bảng nhiều cột (vd Lịch hẹn 15 cột) được cuộn ngang
- [Based on Docs · PM1 DS › Bảng dữ liệu › Cấu trúc cột — bắt buộc] Cột STT đặt đầu tiên, rộng 56px, canh giữa, đánh số theo trang, không phải ID.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Hiển thị dữ liệu trong ô] Ô rỗng hiện «—», không để trắng trơn.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Sắp xếp, cuộn, chọn nhiều] Bảng nhiều cột cuộn ngang trong khung, cột đầu ghim lại, bảng rỗng không hiện thanh cuộn ngang.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Chiều cao khung & vùng cuộn] Hàng tiêu đề cột ghim khi cuộn dọc, nền đặc để dòng dữ liệu không nhìn xuyên qua.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Sắp xếp, cuộn, chọn nhiều] Nền dòng theo trạng thái: #F0FDF4 đã xử lý, #FEF2F2 cần chú ý, viền trái 3px cho mức nghiêm trọng.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Sắp xếp, cuộn, chọn nhiều] Màu nền dòng phủ cả cột STT và cột Thao tác.
- [Verified · QD-412] Màn Danh sách: vùng bảng giãn lấp phần còn lại của khung, nhiều dữ liệu thì thân bảng tự cuộn trong vùng

Do (Nên):
- [Verified · Playbook_List §2 mục 1] Căn lề theo loại dữ liệu: STT, ngày giờ, trạng thái, tag căn giữa, chữ căn trái, số căn phải
- [Verified · UX-G11] Cột Thao tác rộng theo số nút tối đa mà vai đang đăng nhập thấy ở màn đó
- [Verified · AppTable.jsx] Dựng bằng AppTable và truyền emptyRow là EmptyRow, không dùng phân trang có sẵn của antd
- [Verified · UX-G12] Bảng lọc theo điều kiện nghiệp vụ thì đặt câu hướng dẫn ngay dưới bảng bằng NoteBox line, luôn hiện kể cả khi có dòng

Don't (Không nên):
- [Verified · UX-L20] Không làm mã trong bảng danh sách thành link sang Chi tiết, vào Chi tiết bằng nút thao tác của dòng
- [Verified · Playbook_List §1 khối 8] Không gom icon thao tác vào nút «…»
- [Verified · UX-G8] Không tự gõ chữ «Không có dữ liệu» hay vẽ khung nét đứt cho bảng rỗng
- [Verified · UX-G10] Không gộp cột để né thanh cuộn ngang ở bảng nhiều cột

Accessibility (Truy cập và bàn phím):
- [Verified · PM2_MessageList §1.7 Tooltip] Nút chỉ có icon trong cột Thao tác bắt buộc có tooltip và aria-label
- [Based on Docs · AppTable.jsx · WCAG 2.1 SC 1.3.1] AppTable vẽ thẻ table thật với th cho tiêu đề cột, giữ quan hệ ô và tiêu đề cho trình đọc màn hình
- [Verified · UX-G8] Chữ dòng rỗng nằm giữa phần khung đang nhìn thấy, bảng rộng hơn khung thì chữ không bị đẩy khỏi vùng nhìn

UX Writing (Cách viết chữ):
- [Verified · Playbook_List §3] Ô 1 dòng và chuỗi dài hơn 100 ký tự cắt bằng «…»
- [Verified · PM2_MessageList §1.7 Tooltip] Tooltip nút thao tác dùng 1 động từ thống nhất: «Xem chi tiết», «Sửa», «Xóa», «Xuất Excel»
- [Verified · UX-E3] Câu dòng rỗng không có dấu chấm cuối
- [Based on Docs · PM1 DS › Bảng dữ liệu › Hiển thị dữ liệu trong ô] Số lượng và tiền canh phải, phân tách nghìn bằng dấu chấm, dùng chữ số đều bề ngang.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Hiển thị dữ liệu trong ô] Chỉ cột tên bản ghi được nhấn đậm 600 cạnh cột mã, mọi cột còn lại là chữ thường, nhấn thêm cột là mất tác dụng.
- [Based on Docs · PM1 DS › Bảng dữ liệu › Sắp xếp, cuộn, chọn nhiều] Header và ô dữ liệu cùng cột canh lề giống nhau, font đồng bộ toàn bảng.

Lớp CSS:
- `.app-reset-table` · biến thể: `.ant-table-wrapper` · trạng thái: —
- `.col-select` · biến thể: — · trạng thái: —
- `.empty-state` · biến thể: — · trạng thái: —
- `.empty-state-text` · biến thể: — · trạng thái: —

Thuộc tính `AppTable`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `columns` | array | — | Danh sách cột dạng `{ key, title, className, thClassName, thStyle, render }`, `render` nhận dòng và số thứ tự đã cộng `indexOffset`. |
| `dataSource` | array | — | Mảng dòng dữ liệu, mảng rỗng thì thân bảng hiện `emptyRow` thay cho các dòng. |
| `rowKey` | string \| function | — | Tên trường hoặc hàm lấy khoá dòng, cũng dùng ghép tên đọc «Chọn dòng» cho ô tích chọn. |
| `tableClassName` | string | `''` | Lớp CSS gắn lên thẻ `table` thật bên trong antd Table. |
| `tableId` | string | — | Mã định danh gắn lên thẻ `table` thật. |
| `tbodyId` | string | — | Mã định danh gắn lên thẻ `tbody` của bảng. |
| `emptyRow` | ReactNode | — | Dòng `tr` tự vẽ hiện khi `dataSource` rỗng, không truyền thì thân bảng để trống. |
| `rowClassName` | string \| function | — | Lớp CSS riêng cho từng thẻ `tr`, dạng hàm thì nhận dòng dữ liệu, chuyển thẳng tới antd Table. |
| `indexOffset` | number | `0` | Số cộng thêm vào chỉ số dòng trước khi truyền cho `render` của cột, dùng khi bảng đang ở trang sau. |
| `rowSelection` | object | — | Cấu hình ô tích chọn dòng của antd, mỗi ô tích được gắn sẵn tên đọc «Chọn dòng» kèm khoá dòng. |
| `selectionClassName` | string | `'col-select'` | Lớp CSS thêm vào ô tiêu đề và ô dữ liệu của cột chọn dòng. |

Thuộc tính `EmptyRow`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `colSpan` | number | — | Số cột ô rỗng trải ngang, thường bằng số cột của bảng. |
| `entity` | string | — | Tên đối tượng ghép vào câu `I001-27` khi danh sách chưa có bản ghi nào. |
| `hasRecords` | boolean | — | Có bản ghi mà bộ lọc không ra thì hiện câu `I001-28`, ngược lại hiện câu `I001-27`. |

### Tag trạng thái (`status-tags`)

- Component: `CatalogStatusTag` (src/components/app/CatalogStatusTag.jsx), `AppointmentStatusTag` (src/components/app/AppointmentStatusTag.jsx), `AppTag` (src/components/app/AppTag.jsx)

```jsx
<CatalogStatusTag status="ACTIVE" label="Hoạt động" />  ·  <AppointmentStatusTag status="APPROVED" />
```

Quy tắc:
- UX-L2: Cùng loại control ⇒ cùng hình dạng trên MỌI màn, đúng giá trị file chuẩn
- UX-A3: Tag và thẻ trạng thái

When to Use (Khi dùng):
- [Verified · QD-405] Màu tag theo 5 mức của PM1, đọc theo câu hỏi «ai đang phải ra tay»: Mặc định (Nháp, Đã hủy, Vô hiệu hóa) · Đang xử lý (Đã duyệt, Chờ check-in, Đang diễn ra) · Cần làm (Chờ duyệt, Chờ Trưởng cơ sở duyệt) · Lỗi (Từ chối duyệt, Vắng mặt) · Xong (Hoàn thành, Hoạt động).
- [Verified · AppointmentStatusTag.jsx · CatalogStatusTag.jsx] Hiển thị trạng thái bản ghi ở Danh sách, Chi tiết và cạnh tiêu đề màn Sửa
- [Verified · CatalogStatusTag.jsx] Trạng thái danh mục Nháp, Hoạt động, Vô hiệu hóa (Quầy tiếp đón, Buồng thăm gặp) dùng CatalogStatusTag, trạng thái lịch hẹn dùng AppointmentStatusTag
- [Verified · Playbook_CreateEdit §4 câu 20] Giá trị dropdown ở bước xác nhận hiển thị dạng tag
- [Based on Docs · PM1 DS › Thẻ trạng thái › Thang đo có thứ tự] Thang có thứ tự như mức độ nghiêm trọng dùng bảng gán riêng, không dùng bảng màu trạng thái.
- [Based on Docs · PM1 DS › Thẻ trạng thái › Thang đo có thứ tự] Thang 4 bậc: cao nhất nền đặc, cao error, trung bình warning, thấp default.
- [Based on Docs · PM1 DS › Thẻ trạng thái › Thang XẾP LOẠI] Thang xếp loại chạy chiều tốt dần: Tốt success, Khá default, Trung bình warning, Kém error.

When Not to Use (Khi không dùng):
- [Based on Docs · catalog.jsx (status-tags demo «Tag thường»)] Nhãn không mang trạng thái thì dùng AppTag lớp tag thường, không mượn màu của tag trạng thái
- [Based on Docs · PM1 DS › Thẻ trạng thái › Thang đo có thứ tự] Nền đặc chỉ dùng cho bậc cao nhất của 1 thang đo, không dùng cho trạng thái thường.
- [Based on Docs · PM1 DS › Thẻ trạng thái › Thang đo có thứ tự] Bậc thấp như «Nhẹ» không dùng màu xanh vì mức thấp không phải kết quả tốt.
- [Based on Docs · PM1 DS › Thẻ trạng thái › Thang XẾP LOẠI] Thang mức độ và thang xếp loại không dùng chung 1 bảng gán.

Anatomy (Cấu tạo):
- [Verified · CatalogStatusTag.jsx] Chấm màu ở đầu (lớp tag-dot) và nhãn trạng thái
- [Verified · UX-A3] Chữ 13/500, cao 24px, đệm 2px 8px, bo tròn 999px
- [Verified · QD-405] Tag Nháp màu Mặc định (xám, lớp tag-draft), dùng chung giữa lịch hẹn và danh mục

Variants & States (Biến thể và trạng thái):
- [Verified · UX-L2] Mỗi trạng thái 1 bộ nền, chữ, viền, tag cùng nhãn thì cùng màu trên mọi màn
- [Verified · CatalogStatusTag.jsx] Màu Hoạt động và Vô hiệu hóa trùng màu chấm tab trạng thái của danh sách
- [Verified · Playbook_Others §4] Riêng chip trạng thái trên lưới lịch theo buồng được cỡ chữ 11px, các màn khác giữ 13px
- [Based on Docs · PM1 DS › Thẻ trạng thái › Thang đo có thứ tự] Thẻ nền đặc: nền #B91C1C, chữ #FFFFFF, tương phản 6.47:1.

Do (Nên):
- [Verified · UX-A3] Tag cạnh tiêu đề màn Sửa, màn Chi tiết cùng 1 kiểu (cao, cỡ chữ, đệm, bo) giữa mọi màn
- [Verified · UX-A6] Tag và chữ bên cạnh nằm trên cùng 1 đường giữa, tag dùng vertical-align top
- [Verified · Playbook_List §2 mục 1] Cột trạng thái trong bảng căn giữa

Don't (Không nên):
- [Verified · UX-A3] Không tạo lớp tag riêng cho từng màn (dc-tag, tag-ad, tn-tag), mọi lớp tag vào cùng 1 dòng quy chuẩn
- [Verified · UX-L2] Không đổi màu tag cùng nhãn giữa các màn

Accessibility (Truy cập và bàn phím):
- [Based on Docs · CatalogStatusTag.jsx · WCAG 2.1 SC 1.4.1] Trạng thái luôn có chữ nhãn đi kèm, không chỉ dựa vào màu chấm

UX Writing (Cách viết chữ):
- [Verified · catalog.jsx (status-tags)] Nhãn trạng thái lấy đúng nhãn của đối tượng, vd «Nháp», «Hoạt động», «Vô hiệu hóa»
- [Verified · AppointmentStatusTag.jsx] Nhãn trạng thái lịch hẹn lấy từ hàm statusLabel, không gõ tay

Lớp CSS:
- `.tag` · biến thể: `.catalog-status` `.tag-absent` `.tag-active` `.tag-applied` `.tag-applied-sub` `.tag-approved` `.tag-cancelled` `.tag-category` `.tag-checked-in` `.tag-completed` `.tag-discipline` `.tag-dot` `.tag-draft` `.tag-exception` `.tag-expired` `.tag-in-progress` `.tag-inactive` `.tag-penalty` `.tag-pending-approval` `.tag-registrant` `.tag-rejected` `.tag-relationship` `.tag-relationship-child` `.tag-relationship-father` `.tag-relationship-mother` `.tag-relationship-sibling` `.tag-relationship-spouse` `.tag-status` `.tag-table` `.tag-type` `.tag-unassigned` `.tag-visit-other` `.tag-visit-standard` `.tag-waiting-check-in` · trạng thái: —

Thuộc tính `CatalogStatusTag`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `status` | 'DRAFT' \| 'ACTIVE' \| 'INACTIVE' | — | Trạng thái danh mục quyết định màu: `DRAFT` lớp `tag-draft`, `ACTIVE` lớp `tag-active`, `INACTIVE` lớp `tag-inactive`. |
| `label` | string | — | Chữ hiển thị trong tag, truyền nguyên văn từ nơi gọi. |
| `className` | string | `''` | Lớp CSS thêm vào sau các lớp `tag tag-dot catalog-status`. |

Thuộc tính `AppointmentStatusTag`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `status` | string | — | Trạng thái lịch hẹn quyết định nhãn và lớp màu `tag-{trạng thái}`, rỗng thì không vẽ gì. |
| `id` | string | — | Mã định danh gắn lên thẻ tag. |
| `hidden` | boolean | — | Ẩn thẻ tag bằng thuộc tính `hidden` của HTML, tag vẫn có trong DOM. |

Thuộc tính `AppTag`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `className` | string | `''` | Lớp màu của tag, ghép sau lớp `app-reset` trên Tag của antd. |
| `children` | ReactNode | — | Nội dung hiển thị bên trong tag. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Tag màu theo giá trị (Buồng thăm gặp, Quầy tiếp đón) (`value-tags`)


```jsx
import { valueTagStyle } from '@/lib/valueTagColor';
<CategoryTag value={tableLabel(r.tableCode)} tagClass="tag-table" style={valueTagStyle(r.tableCode, 'table')} />  // 'counter' cho Quầy
```

Quy tắc:
- QD-385

When to Use (Khi dùng):
- [Verified · QD-385] Cột Buồng thăm gặp và Quầy tiếp đón trên danh sách lịch hẹn: mỗi giá trị 1 màu, cùng giá trị cùng màu trên mọi dòng.
- [Verified · QD-385] Lấy màu qua hàm chung `lib/valueTagColor.js`, màu theo thứ tự mã trong danh mục.

When Not to Use (Khi không dùng):
- [Verified · QD-385] Không dùng dải đỏ và cam cho tag giá trị, dải này dành cho màu nguy hiểm và tag Ngoại lệ.
- [Based on Docs · catalog.jsx] Không dùng tag màu theo giá trị để thể hiện trạng thái, trạng thái dùng mục Tag trạng thái.

Anatomy (Cấu tạo):
- [Verified · AppointmentList.jsx] Tag là `AppTag` lớp `tag tag-table` cho Buồng, `tag tag-category` cho Quầy, màu nền, viền, chữ truyền qua `style`.
- [Verified · valueTagColor.js] Nền, viền, chữ cùng 1 sắc độ, nền sáng 91%, viền 72%, chữ 24%.

Variants & States (Biến thể và trạng thái):
- [Verified · valueTagColor.js] Quầy lệch nửa vòng sắc độ so với Buồng để không trùng màu.
- [Verified · valueTagColor.js] Mã không có trong danh mục hoặc danh mục dưới 2 mã thì màu tính theo băm của mã.
- [Verified · AppointmentList.jsx] Không có giá trị thì không vẽ tag mà hiện ô trống.

Do (Nên):
- [Verified · valueTagColor.js] Trên màn dùng `valueTagStyle(code, kind)` đọc danh mục thật, trang Design System dùng `valueTagStyleOf` với danh sách mẫu.
- [Verified · valueTagColor.js] Chia đều vòng sắc độ theo số mã và xếp xen kẽ để 2 mã liền nhau cách xa nhau về màu.

Don't (Không nên):
- [Verified · valueTagColor.js] Không dùng bảng màu cố định giới hạn số màu, mọi giá trị phải khác màu nhau.
- [Verified · UX-L2] Không đổi màu tag cùng nhãn giữa các màn.

Accessibility (Truy cập và bàn phím):
- [Verified · QD-385] Chữ trong tag tương phản với nền tối thiểu 4,5:1, đo thấp nhất 5,39:1.
- [Based on Docs · WCAG 2.2 1.4.1] Tag luôn có chữ mã và tên, màu chỉ để phân biệt nhanh, không là cách duy nhất.

UX Writing (Cách viết chữ):
- [Verified · tableTimeline.js] Chữ tag ghi «Mã — Tên» của buồng hoặc quầy, không chỗ nào chỉ hiện mã.
- [Verified · AppointmentList.jsx] Chữ tag dài rút gọn bằng `truncate`.

### Tooltip cho chữ không hiển thị hết (`tooltip-full`)


```jsx
Chữ cắt bằng CSS (text-overflow: ellipsis, line-clamp) ⇒ cơ chế chung lib/legacyUi.js tự hiện tooltip
Chữ cắt bằng code ⇒ truncate(v) tự gắn data-full
Chữ tóm tắt ⇒ <span data-full="Thân nhân đi cùng: …">+N người</span>
```

Quy tắc:
- QD-383
- UX-C3: Tooltip CHỈ hiện khi chữ bị cắt thành "…", nội dung là bản đầy đủ của chính chữ đang bị cắt · style nền đen như PM1 *(antd Tooltip: nền `rgba(0,0,0,.85)` · chữ trắng `14px` · bo `6px` · đệm `6px 8px` · rộng tối đa `400px` — SỬA `14/10/2026` PM2 `QD-405` L8, bản `250px` lệch Prototype thật)* · rê chuột trễ `400ms` mới hiện · Tab tới thì hiện ngay · không dùng `title` gốc của trình duyệt. `4` ngoại lệ đã chốt *(TrangNT5 chốt D3A 30/09/2026 · ④ PM2 QD-346 ⑧ 09/10/2026)*: ① nút icon không chữ ⇒ hiện tên thao tác · ② khối lịch ⇒ hiện thông tin nhiều dòng · ③ sidebar thu gọn ⇒ hiện tên mục · ④ nút bị khoá vì đã đạt tối đa ⇒ rê chuột hiện lý do, dùng CHUNG câu với màn đã có tình huống này *(vd nút «Thêm thân nhân đi cùng»)*, nguyên văn: *"Khi đặt max thì di chuột vào show tooltips ==> Có màn khác có TH này tương tự rồi mà k làm theo ah"*. Ngoài `4` diện này ⇒ chỉ hiện khi chữ bị cắt. *(Đổi `30/09/2026`, nguyên văn: "Tooltips chỉ nên sinh ra khi bị lấp chữ, sinh ra dấu ... ấy Chứ lúc nào cũng hiện e là hơi rối". Bản cũ "100% nút có tooltip" hết hiệu lực)*

When to Use (Khi dùng):
- [Verified · QD-383] Mọi chữ không hiển thị hết nội dung có tooltip hiện toàn bộ nội dung khi di chuột.
- [Verified · QD-383] Áp 3 loại: chữ cắt bằng CSS (cơ chế `lib/legacyUi.js` tự bắt), chữ cắt bằng code quá 200 ký tự (`truncate` gắn `data-full`), chữ tóm tắt như «+N người» (gắn `data-full`).
- [Based on Docs · PM1 DS › Tooltip & popover] Bắt buộc có tooltip ở nút chỉ có icon, sidebar thu gọn, chữ bị cắt «…» và tag «+N».
- [Based on Docs · PM1 DS › Tooltip & popover] Tag «+N» có tooltip liệt kê đủ các giá trị còn lại.
- [Based on Docs · PM1 DS › Tooltip & popover] Nhãn cột viết tắt nên có tooltip tên đầy đủ của cột.

When Not to Use (Khi không dùng):
- [Verified · UX-C3] Chữ hiển thị đủ thì không có tooltip.
- [Verified · QD-383] Vùng thông báo (chuông, Danh sách thông báo) không có tooltip.
- [Verified · UX-C3] Không dùng thuộc tính `title` gốc của trình duyệt.
- [Based on Docs · PM1 DS › Tooltip & popover] Nút có sẵn chữ không có tooltip lặp lại chữ đã hiện.
- [Based on Docs · PM1 DS › Tooltip & popover › Hành vi] Không nhét nút hay liên kết vào tooltip, cần tương tác thì dùng popover.

Anatomy (Cấu tạo):
- [Verified · base.css] Khung `.tooltip` nền `rgba(0,0,0,.85)`, chữ trắng 14px, bo 6px, đệm `6px 8px`, có mũi tên `::after` chỉ về phần tử.
- [Verified · base.css · legacyUi.js] Chữ bọc trong `.tooltip-text`, cao tối đa 8 dòng, quá thì ba chấm.
- [Verified · legacyUi.js] 1 khung tooltip dùng chung gắn vào `body`, do `installTooltip` ở `lib/legacyUi.js` điều khiển.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · PM1 DS › Tooltip & popover › Hành vi] Hiện sau 400ms con trỏ dừng lại, ẩn sau 100ms rời chuột.
- [Based on Docs · PM1 DS › Tooltip & popover › Hành vi] Đặt phía trên phần tử, tự lật xuống dưới khi sát mép trên màn hình.
- [Verified · UX-C3 (QD-410 D26)] Rộng tối đa 400px, dài hơn thì xuống dòng, không kéo ngang.
- [Based on Docs · PM1 DS › Tooltip & popover › Hành vi] Tooltip đang mở mà bấm chọn thì đóng hẳn, không nhấp nháy.

Do (Nên):
- [Verified · legacyUi.js] Vùng không dùng tooltip đánh dấu bằng `data-no-tooltip`.
- [Verified · UX-C3] Nút bị khoá vì đã đạt tối đa hiện lý do khi rê chuột, dùng chung câu với màn đã có tình huống này.
- [Verified · Message List §1.7 Tooltip] Nút vô hiệu vẫn giữ tooltip, nội dung nói lý do.

Don't (Không nên):
- [Verified · UX-C3] Không viết tooltip khác chữ đang bị cắt, tooltip là bản đầy đủ của chính chữ đó.
- [Based on Docs · WAI-ARIA APG Tooltip] Không đưa focus vào tooltip, focus luôn ở phần tử gốc.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · PM1 DS › Tooltip & popover › Hành vi] Đi bằng Tab tới phần tử cũng phải hiện tooltip khi focus.
- [Verified · legacyUi.js (QD-410 D25)] Escape tắt tooltip đang hiện, ô đang chọn giữ nguyên, Escape lần sau mới đóng hộp thoại phía sau.

UX Writing (Cách viết chữ):
- [Verified · Message List §1.3 mục 6] Tooltip không có dấu chấm cuối.
- [Verified · Message List §1.3 mục 12] Tooltip không in đậm biến.
- [Verified · QD-383] Tooltip của «+N người» ở cột Thân nhân ghi «Thân nhân đi cùng: tên, tên».
- [Verified · Message List W001-03] Nút bị vô hiệu do ràng buộc ghi `Không xóa được vì {0}`.

### Thanh tab (`tabs`)

- Component: `AppTabs` (src/components/app/AppTabs.jsx)

```jsx
<AppTabs activeKey={k} onChange={setK} items={[{ key, id, label, children }]} />  // ⛔ tự viết CSS tab riêng
```

Quy tắc:
- UX-L16: Thanh tab dùng `AppTabs` — kiểu chuẩn ĐI KÈM component *(`components/app/AppTabs.css`, lớp `.app-tabs`)*, không tự viết CSS tab riêng cho màn. Màn dùng `AppTabs` với lớp mặc định `.tabs` / `.tab-n` là đúng ngay. *(19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-421 ③)`)* hàng tab đứng ngay dưới đầu màn *(`.shell-head + .tabs`)* cách đầu màn `8px` *(`padding-top`)*, nguyên văn: *"Chỗ Tab hơi sát, cho xuống 1 xíu cho cân đối"* · *(19/10/2026, `Verified (TrangNT5 19/10/2026 · PM2 QD-423)`)* hàng tab đệm ngang đúng `--shell-gutter` ⇒ mép tab đầu, kể cả gạch chân, thẳng mép khu lọc và bảng bên dưới · `.tab-n` mọi màn đệm `12px 14px` *(cùng `.tab-btn`)*. Nguyên văn: *"Ê tab phải cho dịch vào căn chỉnh thẳng với phía dưới chứ"*. Nguồn: tab màn Sửa quầy hiện thành nút trần vì `AppTabs` trước đây không tự mang kiểu, TrangNT5: *"Vãi tab kinh thế này … Khi làm Prototype k đọc các mẫu control có sẵn ah"*
- UX-L18: Đối tượng CON chỉ sống trong 1 đối tượng CHA *(bàn trong quầy)* ⇒ quản lý ở TAB của màn cha, không dựng màn danh sách hay màn Sửa riêng cho con. Mọi thao tác của con *(Xóa · Vô hiệu hóa · Kích hoạt, Xuất Excel)* đặt ở tab con của màn Chi tiết cha và sheet phụ của file Excel cha. Nút Chỉnh sửa ở Chi tiết cha mở màn Sửa đúng tab đang xem (`?tab=`). Nguồn: TrangNT5 *"Kiểu tạo 1 màn nhiều Tab luôn nhỉ, đang thấy tạo 2 MH quay lại lk hợp lý lắm"* và *"T thấy cái màn hình này bị vô dụng á"*

When to Use (Khi dùng):
- [Verified · UX-L18] Đối tượng con chỉ sống trong 1 đối tượng cha (vd buồng trong quầy) được quản lý ở tab của màn cha
- [Verified · Playbook_ViewDetail §1 mục 3] Màn Chi tiết chia nhóm thông tin theo tab, mẫu 3 tab Thông tin chính, Người liên quan, Lịch sử thao tác
- [Verified · Playbook_List §1 khối 4 · khối 5] Danh sách có từ 2 chế độ xem trở lên dùng tab chế độ xem kiểu tab Chrome, trạng thái dùng tab gạch chân
- [Based on Docs · PM1 DS › Điều hướng, tab & menu] Tab chia nội dung trong cùng 1 bản ghi, không dùng thay điều hướng giữa các màn.

When Not to Use (Khi không dùng):
- [Verified · Playbook_ViewDetail §1 mục 3] Không thêm tab chỉ để xem mà người dùng không thao tác gì, thông tin giải trình ghi thành 1 dòng ở Lịch sử thao tác
- [Verified · UX-L18] Không dựng màn danh sách hay màn Sửa riêng cho đối tượng con thay cho tab
- [Based on Docs · PM1 DS › Điều hướng, tab & menu] Quá 7 tab thì cân nhắc tách màn.

Anatomy (Cấu tạo):
- [Verified · AppTabs.jsx] Thanh tab role=tablist, mỗi tab là nút role=tab lớp tab-n, tab đang mở thêm lớp is-current
- [Verified · AppTabs.jsx] Mỗi tab có khung nội dung lớp tab-panel, mọi tab có sẵn trong DOM (forceRender)
- [Verified · Playbook_List §1 khối 5] Tab trạng thái ở danh sách có chấm màu 8px và badge số cùng màu thẻ trạng thái

Variants & States (Biến thể và trạng thái):
- [Verified · Playbook_List §3] Tab trạng thái đang chọn: chữ 600 màu đỏ, gạch chân 2px
- [Verified · UX-G6] Tab đếm 0 vẫn hiển thị bình thường và bấm được
- [Verified · Playbook_List §1 khối 5] Số trên badge đếm sau bộ lọc
- [Based on Docs · PM1 DS › Điều hướng, tab & menu] Đổi tab không mất dữ liệu đang nhập ở tab khác.
- [Based on Docs · PM1 DS › Chuyển động & thời lượng › Thang thời lượng] Tab đổi nội dung trong 250ms.
- [Verified · QD-423] Hàng tab thẳng mép với khối bên dưới: chữ tab lùi đúng lề trong khung 16px

Do (Nên):
- [Verified · UX-L16] Dựng bằng AppTabs, kiểu chuẩn đi kèm component
- [Verified · UX-L18] Nút Chỉnh sửa ở Chi tiết cha mở màn Sửa đúng tab đang xem qua tham số ?tab=
- [Verified · UX-D9] Đổi tab thì bỏ các dòng đang tích chọn

Don't (Không nên):
- [Verified · UX-L16] Không tự viết CSS tab riêng cho màn
- [Verified · Playbook_List §5] Không đặt tooltip tab là chuỗi cứng, phải tính từ dữ liệu hoặc bỏ

Accessibility (Truy cập và bàn phím):
- [Verified · AppTabs.jsx] Khung nội dung tab không nhận focus, AppTabs gỡ tabindex mà antd gắn
- [Based on Docs · AppTabs.jsx · WAI-ARIA Authoring Practices (Tabs)] AppTabs chưa gắn aria-selected cho tab đang mở, nên bổ sung để trình đọc màn hình báo tab đang chọn

UX Writing (Cách viết chữ):
- [Based on Docs · catalog.jsx (TabsDemo)] Nhãn tab là danh từ ngắn chỉ nhóm thông tin, vd «Thông tin quầy», «Buồng thăm gặp», «Lịch sử thao tác»
- [Verified · Playbook_ViewDetail §3 câu 11] Tên vai trò trong tab Người liên quan theo thuật ngữ nghiệp vụ đã chốt, vd Thân nhân đăng ký, Thân nhân đi cùng

Lớp CSS:
- `.app-tabs` · biến thể: — · trạng thái: —
- `.tabs` · biến thể: — · trạng thái: —
- `.tab-n` · biến thể: — · trạng thái: `:hover` `.is-current`
- `.tab-panel` · biến thể: — · trạng thái: `.is-current`

Thuộc tính `AppTabs`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `items` | array | — | Danh sách tab dạng `{ key, label, id, children }`, mọi tab đều vẽ sẵn trong DOM. |
| `activeKey` | string | — | Khoá của tab đang mở, nút tab và khung nội dung trùng khoá được gắn `activeClass`. |
| `onChange` | function | — | Gọi khi người dùng bấm 1 nút tab, nhận `key` của tab đó. |
| `barClassName` | string | `'tabs'` | Lớp CSS của thanh chứa các nút tab. |
| `tabClassName` | string | `'tab-n'` | Lớp CSS của từng nút tab. |
| `paneClassName` | string | `'tab-panel'` | Lớp CSS của khung bọc nội dung mỗi tab. |
| `activeClass` | string | `'is-current'` | Lớp CSS gắn thêm cho nút tab và khung nội dung của tab đang mở. |

### Phân trang (`pager`)

- Component: `useListResult` (src/components/app/useListResult.js)

```jsx
// .pager: Trang trước · Tổng số · Trang X/Y · Chọn trang (PageSelect) · Chọn số bản ghi (AppSelect) · Trang sau — nút tắt ở biên, không tooltip (PM1)
```

Quy tắc:
- UX-G9: Số bản ghi mặc định mỗi trang là `10` ở mọi bảng có phân trang *(danh sách; riêng Lịch sử thao tác từ 19/10/2026 không phân trang mà hiện `10` mốc rồi tải thêm `10`, PM2 `QD-421` ①, Playbook ViewDetail khối `7`)*, lựa chọn `10/20/50/100`. Nguyên văn: *"Số bản ghi default 1 trang để là 10 nhé ==> Đang để là 20"*. Đè lên mức `20` của `BRD-STD-01` mục `1.9` *(Prototype là bản chốt)* · Nút `Trang trước`/`Trang sau` theo PM1 *(đo PM1 STG `14/10/2026`, PM2 `QD-373` D6 D12)*: nền trắng · viền `#BFDBFE` · bo `6px` · cao `36px` *(đổi `14/10/2026` theo PM2 `QD-387` D30 A: mọi nút có chữ `36px` bằng ô nhập)* · chữ và mũi tên `#2563EB` `14/500` · nút tắt ở trang đầu/cuối giữ màu, mờ `0.8` · rê chuột mờ `0.9` · không title, không tooltip

When to Use (Khi dùng):
- [Verified · UX-G9] Mọi bảng có phân trang: danh sách và Lịch sử thao tác
- [Verified · QD-373] Áp đồng bộ cả 5 thanh phân trang: Lịch hẹn, Quầy, Thông báo, Chi tiết lịch hẹn, Lịch sử thao tác
- [Based on Docs · PM1 DS › Phân trang › Phân trang hay cuộn vô hạn?] Mọi màn danh sách chính dùng phân trang vì cán bộ cần biết tổng số và quay lại đúng trang cũ.
- [Based on Docs · PM1 DS › Phân trang › Đặc tả] Bảng con trong modal hoặc tab vẫn phân trang 10 bản ghi mỗi trang.

When Not to Use (Khi không dùng):
- [Verified · AppTable.jsx] Không dùng phân trang có sẵn của antd Table, màn tự vẽ thanh .pager
- [Based on Docs · PM1 DS › Phân trang › Phân trang hay cuộn vô hạn?] Cuộn tải thêm chỉ dùng cho danh sách phụ như danh sách trong dropdown hoặc panel phụ.
- [Based on Docs · PM1 DS › Phân trang › Đặc tả] Danh mục dạng cây không phân trang, hiển thị trọn cấu trúc.

Anatomy (Cấu tạo):
- [Verified · Playbook_List §1 khối 9] Nút «Trang trước» ở trái, nút «Trang sau» ở phải
- [Verified · Playbook_List §1 khối 9 · QD-373] Giữa theo thứ tự: «Tổng số: n», «Trang X/Y», «Chọn trang» kèm ô PageSelect, «Chọn số bản ghi» kèm ô số, «trên 1 trang», các cụm ngăn bằng vạch
- [Verified · UX-G9] Ô số bản ghi có 4 lựa chọn 10, 20, 50, 100
- [Verified · UX-G9] Nút nền trắng, viền #BFDBFE, bo 6px, cao 32px, chữ và mũi tên #2563EB 14/500

Variants & States (Biến thể và trạng thái):
- [Verified · UX-G9] Mới mở màn: số bản ghi mỗi trang là 10
- [Verified · UX-G9] Ở trang đầu hoặc cuối: nút tương ứng tắt nhưng vẫn hiện, giữ màu và mờ 0.8
- [Verified · UX-G9] Rê chuột lên nút: mờ 0.9
- [Verified · QD-373] Đổi trang thì bỏ chọn dòng, chọn dòng chỉ trong trang đang xem
- [Based on Docs · PM1 DS › Phân trang › Bốn hành vi bắt buộc] Xóa bản ghi cuối cùng của trang thì tự về trang trước và tải lại, không đứng lại ở trang rỗng.
- [Based on Docs · PM1 DS › Phân trang › Bốn hành vi bắt buộc] Tìm kiếm hoặc đổi bộ lọc thì nhảy về trang 1, giữ nguyên số bản ghi mỗi trang.
- [Based on Docs · PM1 DS › Phân trang › Bốn hành vi bắt buộc] Đổi số bản ghi mỗi trang thì nhảy về trang 1.
- [Based on Docs · PM1 DS › Phân trang › Bốn hành vi bắt buộc] Chỉ có 1 trang vẫn hiện thanh phân trang với «Tổng số: N».
- [Verified · QD-412 · QD-431] Thanh phân trang dính đáy khung khi trang ngắn, cách bảng đúng 16px

Do (Nên):
- [Verified · Playbook_List §5] Cắt dữ liệu thật theo trang và gắn hàm cho nút Trang sau
- [Verified · Playbook_List §3] Lề 2 bên thanh phân trang bằng lề tiêu đề .shell-head, cách mép khung trắng 24px

Don't (Không nên):
- [Verified · UX-G9] Không gắn title hay tooltip cho nút Trang trước, Trang sau
- [Verified · Playbook_List §1 khối 9] Không ẩn nút ở trang đầu hoặc cuối, chỉ tắt
- [Verified · UX-G9] Không đặt mặc định 20 bản ghi mỗi trang

Accessibility (Truy cập và bàn phím):
- [Based on Docs · catalog.jsx (PagerDemo)] Nút ở biên dùng thuộc tính disabled nên không nhận focus và trình đọc màn hình báo không dùng được
- [Based on Docs · WAI-ARIA APG › Keyboard Interface] Tab đi giữa các nút trang; Enter chuyển trang; nút ở biên bị khoá thì bỏ qua.

UX Writing (Cách viết chữ):
- [Verified · QD-373] Giữ đúng chữ như PM1: «Trang trước», «Tổng số:», «Trang X/Y», «Chọn số bản ghi», «trên 1 trang», «Trang sau»

Lớp CSS:
- `.pager` · biến thể: — · trạng thái: —

Thuộc tính `useListResult`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `tableSelector` | string | — | Bộ chọn CSS của bảng, dùng tìm dòng có `data-row-key` trùng mã vừa tạo hoặc sửa để cuộn tới. |
| `created` | function | — | Gọi khi URL có `created`, nhận mã và tham số URL, trả câu toast báo tạo thành công. |
| `updated` | function | — | Gọi khi URL có `updated`, nhận mã và tham số URL, trả câu toast báo sửa thành công. |
| `deleted` | function | — | Gọi khi URL có `deleted`, nhận mã và tham số URL, trả câu toast báo xoá, không truyền thì không báo. |

### Ô chọn trang trong thanh phân trang (`page-select`)

- Component: `PageSelect` (src/components/app/PageSelect.jsx)

```jsx
import PageSelect from '@/components/app/PageSelect'
<span className="pg-i">Trang <b>{page + '/' + pageCount}</b></span><span className="pg-v" /><span className="pg-i">Chọn trang</span><PageSelect current={page} total={pageCount} onChange={setPage} />
// QD-373 D7: chữ giữ như PM1 · ô dùng chung AppSearchSelect (tìm chữ chứa) · danh sách đúng số trang đang có, 1 trang vẫn hiện ô với số 1 · nhảy theo Trang trước/sau, lọc, số bản ghi
```

Quy tắc:
- UX-G9: Số bản ghi mặc định mỗi trang là `10` ở mọi bảng có phân trang *(danh sách; riêng Lịch sử thao tác từ 19/10/2026 không phân trang mà hiện `10` mốc rồi tải thêm `10`, PM2 `QD-421` ①, Playbook ViewDetail khối `7`)*, lựa chọn `10/20/50/100`. Nguyên văn: *"Số bản ghi default 1 trang để là 10 nhé ==> Đang để là 20"*. Đè lên mức `20` của `BRD-STD-01` mục `1.9` *(Prototype là bản chốt)* · Nút `Trang trước`/`Trang sau` theo PM1 *(đo PM1 STG `14/10/2026`, PM2 `QD-373` D6 D12)*: nền trắng · viền `#BFDBFE` · bo `6px` · cao `36px` *(đổi `14/10/2026` theo PM2 `QD-387` D30 A: mọi nút có chữ `36px` bằng ô nhập)* · chữ và mũi tên `#2563EB` `14/500` · nút tắt ở trang đầu/cuối giữ màu, mờ `0.8` · rê chuột mờ `0.9` · không title, không tooltip
- UX-L1: Mỗi loại control có ĐÚNG `1` cách dựng dùng chung — màn mới không tự dựng control, không chép code control sang màn

When to Use (Khi dùng):
- [Verified · QD-373] Ô «Chọn trang» đặt ngay cạnh chữ «Trang X/Y», sau vạch ngăn và trước «Chọn số bản ghi»
- [Verified · QD-373] Áp cho mọi thanh phân trang, là chỗ lệch PM1 có chủ đích vì PM1 không có ô chọn trang

When Not to Use (Khi không dùng):
- [Verified · QD-373] Không thay chữ «Trang X/Y» bằng ô gõ số, bản làm thử ô gõ số đã bị thay
- [Verified · UX-L1] Không tự dựng ô chọn riêng, dùng PageSelect bọc ô chọn có tìm chung

Anatomy (Cấu tạo):
- [Verified · catalog.jsx (page-select)] Nhãn «Chọn trang» bên trái và ô chọn có tìm AppSearchSelect
- [Verified · QD-373] Danh sách lựa chọn là đúng các số trang đang có

Variants & States (Biến thể và trạng thái):
- [Verified · QD-373] Chỉ 1 trang: ô vẫn hiện, danh sách chỉ có số 1
- [Verified · QD-373] Bấm Trang trước, Trang sau, đổi lọc hoặc đổi số bản ghi: ô nhảy theo trang thật
- [Verified · PageSelect.jsx] Bấm x: ô trả về trang đang xem
- [Verified · PageSelect.jsx] Chọn đúng trang đang xem: không chuyển trang

Do (Nên):
- [Verified · QD-373] Tìm theo chữ chứa như mọi ô chọn có tìm khác

Don't (Không nên):
- [Verified · PageSelect.jsx] Không để ô trống, ô luôn mang số trang đang xem

Accessibility (Truy cập và bàn phím):
- [Based on Docs · PageSelect.jsx · WCAG 2.1 SC 4.1.2] Nhãn «Chọn trang» đang là span rời, nên nối với ô qua id và aria-labelledby để trình đọc đọc tên ô
- [Based on Docs · WAI-ARIA APG › Select-Only Combobox] Enter mở danh sách trang; mũi tên chọn; Enter chốt.

UX Writing (Cách viết chữ):
- [Verified · PageSelect.jsx] Lựa chọn rỗng đầu danh sách mang chữ «Chọn trang» làm gợi ý

Lớp CSS:
- `.pg-i` · biến thể: — · trạng thái: —
- `.pg-v` · biến thể: — · trạng thái: —
- `.pg-page-select` · biến thể: — · trạng thái: —

Thuộc tính `PageSelect`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Mã định danh chuyển tới ô chọn có tìm bên trong. |
| `current` | number | — | Số trang đang xem, hiện làm giá trị đã chọn của ô. |
| `total` | number | — | Tổng số trang, ô liệt kê từ 1 tới số này và luôn có ít nhất 1 trang. |
| `onChange` | function | — | Gọi khi người dùng chọn 1 trang khác trang đang xem, nhận số trang mới. |

### Khối bộ lọc danh sách (`filter-panel`)

- Component: `AppSearchInput` (src/components/app/AppSearchInput.jsx)

```jsx
// QD-377 (làm thử ở Lịch hẹn) — nguồn src/pages/AppointmentList/AppointmentList.jsx
<div className="filter-panel is-fixed">
  <div className="filter-body filter-row-main">  // dòng cố định dàn flex: từ khoá 4 · ngày 3 · Trạng thái 3 · nút rộng vừa chữ
    <AppSearchInput className="filter-cell filter-wide" …/> <DateRange …/> <div className="filter-cell filter-status">…</div>
    <div className="filter-more"><AppButtonWithIcon className="btn filter-more-btn" id="nutLoc" aria-expanded …>Tìm kiếm mở rộng</AppButtonWithIcon></div>
  </div>
  {mở && <div className="filter-body filter-row-more">…các ô còn lại, mỗi ô 3 cột…</div>}
</div>
```

Quy tắc:
- UX-B1: Lưới `12` cột. Lưới lọc danh sách: mỗi ô `span {n}` với `n` là bội số của `3`. *(14/10/2026, QD-377 · QD-382)* Dòng điều kiện CỐ ĐỊNH dựng flex tỷ lệ `4 · 3 · 3` nên chỉ kiểm kín mép phải, luật bội `3` áp cho dòng mở rộng. Form Tạo/Sửa theo `UX-B6` *(điểm tách ô `2` hàng liền nhau lồng nhau)*, không ràng buộc bội số `3` — `8 4` · `4 2 2 4` · `4 4 4` đều hợp lệ *(ví dụ của TrangNT5, PM2 `QD-310`)*

When to Use (Khi dùng):
- [Verified · Playbook_List §1 khối 6 · khối 7] Màn danh sách có điều kiện tìm kiếm
- [Verified · QD-377] Khuôn mới đang làm thử ở màn Thăm gặp trực tiếp: 1 dòng điều kiện cố định và nút «Tìm kiếm mở rộng»
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Tìm kiểu %like%, khớp ở đầu, giữa hoặc cuối chuỗi, không phân biệt hoa thường, không phân biệt dấu.
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Người dùng gõ _ hoặc % thì tìm đúng ký tự đó, không hiểu thành wildcard SQL.
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Kết hợp tìm kiếm và lọc thì kết quả thoả cả 2 điều kiện cùng lúc.

When Not to Use (Khi không dùng):
- [Verified · QD-377 · catalog.jsx (FilterPanelDemo)] Khuôn mới chưa duyệt cho màn khác, Danh sách quầy và Thông báo còn khuôn cũ với dải «Điều kiện tìm kiếm» gập được
- [Verified · Playbook_List §1 khối 6] Không dùng chip Hôm nay, Ngày mai thay cho ô khoảng ngày

Anatomy (Cấu tạo):
- [Verified · QD-377] Dòng cố định: ô từ khoá, ô khoảng ngày, ô Trạng thái, cuối dòng là nút «Tìm kiếm mở rộng»
- [Verified · QD-377 · catalog.jsx (filter-panel)] Dòng mở rộng chứa các điều kiện còn lại (Nguồn đăng ký, Buồng, Quầy, Luồng đăng ký), mỗi ô 3 cột
- [Verified · UX-B1] Lưới 12 cột, mỗi ô span bội số của 3, mọi hàng kín mép phải
- [Verified · Playbook_List §1 khối 7] Mỗi ô có nút X xoá, chữ «Tất cả …» là placeholder, không nhãn ngoài

Variants & States (Biến thể và trạng thái):
- [Verified · QD-377] Mở màn: phần mở rộng gập sẵn
- [Verified · QD-377] Bấm nút: mở dòng mở rộng, bấm lần nữa thì gập, nút không hiện số điều kiện đang áp
- [Verified · QD-377] Ở tab khác Tất cả: ô Trạng thái ẩn và ô từ khoá giãn ra
- [Verified · UX-D9] Ô lọc bị ẩn theo tab thì không còn lọc
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Nút «Xóa lọc» đưa bộ lọc, sắp xếp và phân trang về đúng trạng thái mặc định.
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Nút xóa trong ô tìm chỉ hiện khi ô có nội dung.

Do (Nên):
- [Verified · Playbook_List §2 mục 8] Dropdown lọc sinh từ dữ liệu, không gõ tay
- [Verified · Playbook_List §2 mục 8 · §5] Tooltip ô từ khoá liệt kê đủ trường được tìm, sinh từ chính danh sách trường tìm
- [Verified · Playbook_List §1 khối 7] Khoảng ngày là 1 ô, lịch 2 tháng kiểu PM1, mặc định để trống để tìm toàn bộ dữ liệu (QD-432)

Don't (Không nên):
- [Verified · QD-377] Khuôn mới không giữ dải gập «Điều kiện tìm kiếm» và số đếm điều kiện
- [Verified · Playbook_List §3] Không để khung lọc khít mép, cách mép khung trắng 24px

Accessibility (Truy cập và bàn phím):
- [Verified · catalog.jsx (filter-panel)] Nút «Tìm kiếm mở rộng» gắn aria-expanded theo trạng thái mở
- [Verified · catalog.jsx (FilterPanelDemo)] Ô lọc dạng dropdown nhận aria-label bằng chính chữ placeholder

UX Writing (Cách viết chữ):
- [Verified · PM2_MessageList §1.7 Placeholder] Placeholder ô tìm bắt đầu bằng «Tìm theo» và kể các trường tìm, vd «Tìm theo mã quầy, tên quầy»
- [Verified · Playbook_List §1 khối 7] Placeholder dropdown lọc dạng «Tất cả …», vd «Tất cả trạng thái»
- [Based on Docs · PM1 DS › Tìm kiếm & bộ lọc] Placeholder ô tìm không viết chung chung «Tìm kiếm».

Lớp CSS:
- `.filter-panel` · biến thể: — · trạng thái: `.is-fixed`
- `.filter-body` · biến thể: — · trạng thái: `.has-route`
- `.filter-cell` · biến thể: `.filter-wide` · trạng thái: —
- `.filter-more` · biến thể: — · trạng thái: —
- `.filter-row-more` · biến thể: — · trạng thái: —
- `.btn` · biến thể: `.btn-danger` `.btn-danger-ghost` `.btn-outline` `.btn-primary` · trạng thái: `:active` `:hover` `.is-primary`
- `.filter-clear` · biến thể: — · trạng thái: `:hover`

Thuộc tính `AppSearchInput`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `className` | string | `''` | Lớp bố cục của màn, ghép trước lớp `filter-search` của khung ô tìm. |
| `value` | string | — | Chữ trong ô tìm, có chữ thì thêm lớp `has-text` để hiện nút X. |
| `onChange` | function | — | Gọi khi gõ chữ hoặc bấm nút X, nhận chuỗi mới (chuỗi rỗng khi bấm X). |
| `id` | string | — | Id của ô nhập tìm kiếm. |
| `placeholder` | string | — | Chữ gợi ý hiện khi ô tìm trống. |
| `title` | string | — | Chữ chú thích hiện khi di chuột lên ô nhập. |

### Lưới lịch theo buồng (`table-calendar`)

- Component: `TableCalendar` (src/components/app/TableCalendar.jsx), `TablePicker` (src/components/app/TablePicker.jsx)

```jsx
<TableCalendar rows={tables} items={blocks} … />  ·  TablePicker (mountTablePicker) cho màn Tạo lịch hẹn, Đăng ký tại quầy
```

Quy tắc:
- QD-357

When to Use (Khi dùng):
- [Verified · QD-230] Hiện buồng theo thời gian, 1 giao diện chung cho tab Lịch theo buồng, màn Tạo mới và Đăng ký tại quầy, chỉ logic đặc thù khác nhau
- [Verified · catalog.jsx (table-calendar)] Chọn giờ và buồng trong form Tạo lịch hẹn, Đăng ký tại quầy qua TablePicker

When Not to Use (Khi không dùng):
- [Verified · UX-L14] Chưa có buồng thì không vẽ lưới rỗng, hiện SetupHint kèm link màn cài đặt
- [Verified · QD-373] Chưa chọn Quầy thì nhắc bằng I001-30, có Quầy rồi mới nhắc chọn ngày bằng I001-74

Anatomy (Cấu tạo):
- [Verified · TableCalendar.jsx] Hàng là buồng với cột tên buồng bên trái, trục ngang là giờ làm việc
- [Verified · QD-230 · TableCalendar.jsx] Dải tiêu đề buổi sáng, buổi chiều, thước vạch 5 phút nhãn 15 phút, nghỉ trưa là dải gạch hẹp
- [Verified · Playbook_Others §4] Khối lịch 3 dòng: tên người cai nghiện, «HH:MM - Tên thân nhân đăng ký», chip trạng thái
- [Verified · TableCalendar.jsx] Nhóm nút thu phóng 3 mức Thu nhỏ, Vừa, Phóng to
- [Verified · TableCalendar.jsx] Tay nắm ⠿ để kéo khối, mép phải khối để đổi thời lượng

Variants & States (Biến thể và trạng thái):
- [Verified · TableCalendar.jsx] Vùng buồng không mở hiện chữ «Ngoài giờ», vùng đã qua giờ hiện tại phủ mờ
- [Verified · Playbook_Others §1 mục 5] Khối không dời được có icon cấm trước tên, con trỏ not-allowed
- [Verified · TableCalendar.jsx] Đang kéo: thước đánh dấu đúng giờ bắt đầu ~ kết thúc, Esc huỷ kéo
- [Verified · Playbook_Others §1 mục 5] Thả đè ô đã có lịch, ô chặn hoặc chính chỗ cũ: khối tự về chỗ cũ
- [Verified · QD-230] Khối hẹp tự rút gọn nội dung, rê chuột hiện thẻ đủ thông tin
- [Verified · QD-419] Ngày đang xem không có lịch nào thì thay hẳn lưới bằng câu I001-27 «Chưa có lịch hẹn nào», không vẽ lưới rỗng
- [Verified · QD-436] Chip trạng thái trong ô lưới dùng chữ 12px như tag ở mọi màn

Do (Nên):
- [Verified · QD-357] Giờ nhận lịch cuối của ca bằng giờ kết thúc ca trừ 15 phút, cuối ca thiếu thời lượng thì tự rút về số phút còn lại
- [Verified · Playbook_Others §1 mục 9 · §4] Lưu xong vẽ lại lưới, bảng danh sách và số đếm cùng 1 bộ ở mọi đường lưu
- [Verified · Playbook_Others §4] Dùng 1 hàm tính trạng thái ô và 1 bộ chú giải cho mọi lưới

Don't (Không nên):
- [Verified · Playbook_Others §4] Không in dòng hướng dẫn thao tác trên lưới lịch (kéo thả, chạm đúp, tự làm mới)
- [Verified · UX-L1 · Playbook_Others §5] Không chép lưới sang màn mới, dùng chung TableCalendar

Accessibility (Truy cập và bàn phím):
- [Verified · TableCalendar.jsx] Tay nắm là nút có aria-label «Kéo để dời …», nhóm thu phóng có role=group và aria-label «Thu phóng lịch»
- [Verified · TableCalendar.jsx] Thông báo trên lưới đặt trong vùng role=status
- [Based on Docs · WCAG 2.2 SC 2.5.7 · Playbook_Others §1 mục 10] Thao tác kéo thả cần có đường thay thế không cần kéo, vd popup điều chỉnh giờ và buồng

UX Writing (Cách viết chữ):
- [Verified · QD-357] Lý do chặn khi bắt đầu sau giờ nhận lịch cuối: «Sau giờ nhận lịch cuối của ca (HH:mm)»
- [Verified · Playbook_Others §1 mục 7] Tooltip khối 5 dòng cố định: Mã, Thời gian, Người chính, Người đăng ký, Người đi cùng
- [Verified · QD-230] Thẻ gợi ý của khối «Đã có lịch» chỉ ghi ngày và giờ bắt đầu ~ kết thúc, không ghi buồng

Lớp CSS:
- `.table-calendar-no-drag` · biến thể: — · trạng thái: —
- `.table-calendar-grip` · biến thể: — · trạng thái: `:hover`
- `.table-calendar-text` · biến thể: — · trạng thái: `.is-tiny`
- `.table-calendar-name` · biến thể: — · trạng thái: —
- `.table-calendar-line` · biến thể: — · trạng thái: —
- `.tag` · biến thể: `.catalog-status` `.tag-absent` `.tag-active` `.tag-applied` `.tag-applied-sub` `.tag-approved` `.tag-cancelled` `.tag-category` `.tag-checked-in` `.tag-completed` `.tag-discipline` `.tag-dot` `.tag-draft` `.tag-exception` `.tag-expired` `.tag-in-progress` `.tag-inactive` `.tag-penalty` `.tag-pending-approval` `.tag-registrant` `.tag-rejected` `.tag-relationship` `.tag-relationship-child` `.tag-relationship-father` `.tag-relationship-mother` `.tag-relationship-sibling` `.tag-relationship-spouse` `.tag-status` `.tag-table` `.tag-type` `.tag-unassigned` `.tag-visit-other` `.tag-visit-standard` `.tag-waiting-check-in` · trạng thái: —
- `.table-calendar-resize` · biến thể: — · trạng thái: `:hover`
- `.table-calendar-mark` · biến thể: — · trạng thái: `.is-five` `.is-half` `.is-hour` `.is-quarter`

Thuộc tính `TableCalendar`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `rows` | array | — | Danh sách buồng, mỗi dòng `{ code, label, shifts, group, unassigned }`, giờ mở cửa các dòng dựng nên trục giờ làm việc. |
| `items` | array | — | Danh sách khối lịch, mỗi khối có `key`, `tableCode`, `start`, `duration`, `variant`, `movable`, `resizable` và `content` để vẽ lên dòng buồng. |
| `now` | number | `null` | Phút hiện tại trong ngày, nằm trong trục thì vẽ vạch giờ hiện tại và nhãn giờ trên thước. |
| `pastUntil` | number | `null` | Phút trong ngày mà phần trục trước đó được phủ lớp đã qua giờ hiện tại. |
| `minDuration` | number | `10` | Thời lượng nhỏ nhất (phút) khi kéo mép phải để đổi thời lượng khối. |
| `maxDuration` | number | `45` | Thời lượng lớn nhất (phút) khi kéo mép phải để đổi thời lượng khối. |
| `cornerLabel` | string | `'Buồng thăm gặp'` | Chữ ở ô góc trên trái, đứng đầu cột tên buồng. |
| `validate` | function | — | Gọi khi đang kéo, nhận khối, mã buồng, phút bắt đầu, thời lượng và kiểu kéo, trả về lý do không hợp lệ hoặc chuỗi rỗng. |
| `onMove` | function | — | Gọi khi thả khối ở chỗ hợp lệ khác chỗ cũ, nhận khối, `{ tableCode, start, duration }` mới và kiểu kéo `move` hoặc `resize`. |
| `onInvalidDrop` | function | — | Gọi khi thả ra ngoài lịch, thả chỗ không hợp lệ hoặc bấm Esc, nhận lý do và kiểu kéo (`cancel` khi bấm Esc). |
| `onEmptyClick` | function | — | Gọi khi bấm vào chỗ trống trên dòng buồng, nhận mã buồng, phút tại điểm bấm và `closed` nếu bấm vào vùng nghỉ trưa hoặc ngoài giờ. |
| `ghostAt` | function | — | Gọi khi rê chuột trên chỗ trống, nhận mã buồng và phút, trả về `{ tableCode, start, duration, reason }` để vẽ khối gợi ý hoặc `null` để ẩn. |
| `legend` | ReactNode | `null` | Nội dung chú giải hiện ở thanh công cụ, bên trái nút thu phóng. |
| `notice` | string | `''` | Câu thông báo hiện trên lưới lịch, hỗ trợ chữ in đậm, rỗng thì không hiện. |
| `initialScrollMinute` | number | `null` | Phút cần cuộn tới khi mở lịch, đổi `scrollKey` hoặc đổi mức thu phóng, bỏ trống thì cuộn về đầu trục. |
| `scrollKey` | string | `''` | Khoá cuộn, đổi giá trị thì lịch cuộn lại tới `initialScrollMinute`. |
| `maxHeight` | number \| string | — | Chiều cao tối đa của vùng cuộn lịch, bỏ trống thì không giới hạn. |

### Thanh đồng bộ PM1 (`pm1-sync`)

- Component: `Pm1SyncBar` (src/components/app/Pm1SyncBar.jsx)

```jsx
<Pm1SyncBar onSync={reload} />
```

Quy tắc:
- QD-328

When to Use (Khi dùng):
- [Verified · QD-328] Đặt ở tiêu đề khối Người cai nghiện của màn Tạo mới, Chỉnh sửa lịch hẹn và Đăng ký lượt thăm gặp tại quầy
- [Verified · QD-328] Cho cán bộ đọc lại thông tin người cai nghiện khi PM1 lỗi rồi làm tiếp

Anatomy (Cấu tạo):
- [Verified · Pm1SyncBar.jsx] Chữ «Đồng bộ từ PM1 lúc» kèm thời điểm in đậm dạng dd/MM/yyyy HH:mm:ss
- [Verified · Pm1SyncBar.jsx] Nút nhỏ «Đồng bộ lại» có icon làm mới

Variants & States (Biến thể và trạng thái):
- [Verified · Pm1SyncBar.jsx] Mở màn: thời điểm là lúc đọc dữ liệu
- [Verified · Pm1SyncBar.jsx] Bấm Đồng bộ lại: cập nhật thời điểm và dựng lại thẻ người cai nghiện để xét lại điều kiện thăm gặp
- [Verified · Pm1SyncBar.jsx] Prototype không nối PM1 thật, nút chỉ ghi lại giờ và gọi onSync

Do (Nên):
- [Verified · Pm1SyncBar.jsx] Truyền onSync để dựng lại mọi dữ liệu phụ thuộc thông tin người cai nghiện

Accessibility (Truy cập và bàn phím):
- [Based on Docs · Pm1SyncBar.jsx · WCAG 2.1 SC 4.1.3] Thời điểm mới chỉ đổi chữ tại chỗ, nên đặt trong vùng aria-live để trình đọc báo đã đồng bộ

UX Writing (Cách viết chữ):
- [Verified · Pm1SyncBar.jsx · QD-328] Giữ đúng chữ «Đồng bộ từ PM1 lúc» và «Đồng bộ lại»

Lớp CSS:
- `.pm1-sync-bar` · biến thể: — · trạng thái: —
- `.pm1-sync-time` · biến thể: — · trạng thái: —
- `.btn` · biến thể: `.btn-chip` `.btn-danger` `.btn-danger-ghost` `.btn-hl` `.btn-loading-ring` `.btn-outline` `.btn-primary` · trạng thái: `:active` `:hover` `.is-primary`

Thuộc tính `Pm1SyncBar`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `onSync` | function | — | Gọi khi bấm nút Đồng bộ lại, sau khi cập nhật giờ đồng bộ, không nhận đối số. |

### Thông tin thân nhân · Tra cứu điều kiện (`detail-blocks`)

- Component: `RelativeDetailBody` (src/components/app/RelativeDetailBody.jsx), `VisitConditions` (src/components/app/VisitConditions.jsx)

```jsx
<RelativeDetailBody relative={r} />  ·  <VisitConditionsLink />
```

When to Use (Khi dùng):
- [Verified · QD-262] Popup thông tin thân nhân dùng chung mọi màn: Tạo lịch hẹn, Đăng ký tại quầy, Chi tiết lịch hẹn
- [Verified · VisitConditions.jsx] Link «Tra cứu điều kiện thăm gặp» đặt góc phải tiêu đề khối Người cai nghiện ở màn Tạo mới, Chỉnh sửa, Đăng ký tại quầy
- [Verified · QD-346] Nút «Giả lập quẹt thẻ» mở bảng thân nhân mẫu kèm người cai nghiện và điều kiện thăm gặp để người test chọn

When Not to Use (Khi không dùng):
- [Verified · QD-262] Không dựng popup thân nhân riêng cho từng màn

Anatomy (Cấu tạo):
- [Verified · RelativeDetailBody.jsx] Popup thân nhân: avatar chữ tắt và họ tên ở đầu, các dòng nhãn và giá trị bên dưới
- [Verified · VisitConditions.jsx] Popup Điều kiện thăm gặp: dòng giới thiệu, mỗi dòng 1 điều kiện có số thứ tự, tên, diễn giải, căn cứ, chia theo nhóm
- [Verified · SimulatedCardPicker.jsx] Bảng giả lập quẹt thẻ: cột Số căn cước, Thân nhân, Người cai nghiện · điều kiện thăm gặp và nút «Chọn»

Variants & States (Biến thể và trạng thái):
- [Verified · SimulatedCardPicker.jsx · QD-231] Người cai nghiện đạt hết điều kiện: «Đủ điều kiện thăm gặp», không đạt: «Điều kiện {n}» kèm lý do
- [Verified · RelativeDetailBody.jsx] Chưa có thân nhân: thân popup rỗng

Do (Nên):
- [Verified · QD-231] Điều kiện xếp đúng thứ tự hệ thống kiểm, dừng ở điều kiện đầu tiên không đạt
- [Verified · UX-F3] Popup giả lập quẹt thẻ rộng min(1200px, 94vw), popup Điều kiện thăm gặp rộng 640px

Don't (Không nên):
- [Verified · SimulatedCardPicker.jsx] Không để bảng chọn thẻ cuộn ngang, popup đủ rộng để đọc trọn lý do điều kiện

Accessibility (Truy cập và bàn phím):
- [Verified · VisitConditions.jsx] Link tra cứu điều kiện có role=button, tabIndex 0, mở bằng Enter hoặc Space
- [Verified · UX-L1] Nút X đóng popup dựng bằng DialogCloseButton

UX Writing (Cách viết chữ):
- [Verified · QD-262] Tiêu đề popup thân nhân là «Thông tin chi tiết thân nhân»
- [Verified · VisitConditions.jsx] Chữ link «Tra cứu điều kiện thăm gặp», tiêu đề popup «Điều kiện thăm gặp»
- [Verified · UX-F1] Popup chỉ để xem thì nút chân ghi «Quay lại»

Lớp CSS:
- `.adjust` · biến thể: `.adjust-frame` `.exempt-info` · trạng thái: —
- `.relative-detail-head` · biến thể: — · trạng thái: —
- `.relative-avatar` · biến thể: — · trạng thái: —
- `.relative-detail-name` · biến thể: — · trạng thái: —
- `.adjust-label` · biến thể: — · trạng thái: —
- `.adjust-value` · biến thể: — · trạng thái: —
- `.visit-conditions-link` · biến thể: — · trạng thái: `:focus-visible` `:hover`
- `.dlg-h` · biến thể: — · trạng thái: —

Thuộc tính `RelativeDetailBody`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `relative` | object | — | Bản ghi thân nhân cần hiện, dựng avatar chữ tắt, họ tên và các dòng thông tin, bỏ trống thì hiện khối rỗng. |

### Avatar chữ cái đầu tên (`avatar`)

- Component: `AppAvatar` (src/components/app/AppAvatar.jsx)

```jsx
<AppAvatar name="Nguyễn Thùy Trang" size="md" />  ·  <AppAvatarGroup names={[…]} max={4} />
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Avatar] Đại diện 1 người bằng chữ cái đầu khi không có ảnh.
- [Verified · form.css .relative-avatar] Đang có dạng tương tự ở thẻ người cai nghiện, thân nhân.

When Not to Use (Khi không dùng):
- [Based on Docs · Atlassian Design System · Avatar · WCAG 2.2 · 1.1.1 Non-text Content] Không dùng thay tên người — luôn có tên đi kèm.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Chữ cái đầu của tên (từ cuối họ tên), tròn, nền màu chủ đạo, cỡ 28 · 36 · 44.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · Atlassian Design System · Avatar group] Nhóm avatar xếp chồng, quá số tối đa hiện «+n».

Do (Nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Cỡ 44 cho thẻ người, 28–36 cho dòng bảng.

Don't (Không nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Không tự đổi màu nền theo người.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · MDN · ARIA img role · WCAG 2.2 · 1.1.1 Non-text Content] Avatar có tên hiển thị bên cạnh thì ẩn khỏi trình đọc màn hình (aria-hidden). Avatar đứng một mình thì role img, nhãn là họ tên.

UX Writing (Cách viết chữ):
- [Verified · AppAvatar.jsx] Truyền đủ họ tên vào `name`, chữ hiển thị tự lấy chữ cái đầu của từ cuối và viết hoa.
- [Verified · AppAvatar.jsx] Chữ gợi ý khi rê chuột mặc định là họ tên, chỉ truyền `title` khi cần chữ khác.
- [Verified · AppAvatar.jsx] Avatar dư của nhóm hiện «+n» và trình đọc màn hình đọc «và n người khác».

Lớp CSS:
- `.app-avatar` · biến thể: — · trạng thái: `.is-lg` `.is-md` `.is-sm`
- `.app-avatar-group` · biến thể: — · trạng thái: —

Thuộc tính `AppAvatar`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `name` | string | — | Họ tên, lấy chữ cái đầu của từ cuối làm chữ hiển thị và dùng làm nhãn cho trình đọc màn hình. |
| `size` | 'sm' \| 'md' \| 'lg' | `'md'` | Cỡ avatar: `sm` 28px, `md` 36px hoặc `lg` 44px. |
| `title` | string | — | Chữ gợi ý khi rê chuột, bỏ trống thì dùng `name`. |

### Số đếm gắn vào phần tử (`count-badge`)

- Component: `AppBadge` (src/components/app/AppBadge.jsx)

```jsx
<AppBadge count={n}><AppButtonWithIcon …/></AppBadge>  // quá 99 hiện 99+ · nhãn chữ đứng riêng thì dùng tag
```

Quy tắc:
- UX-A16: Số đếm khác tag — chấm hoặc SỐ gắn vào phần tử khác *(chuông, tab, nút lọc)* dùng khuôn số đếm `UX-L26` · nhãn CHỮ đứng riêng *(trạng thái, vai người)* dùng tag `UX-A3`. Chỉ áp PM2
- UX-L26: Số đếm cùng `1` khuôn ở mọi màn *(chuông `.bell-dot` · tab `.tab-count` `.tab-number` · nút lọc `.filter-count` `.filter-unassigned-count`)*. Chỉ áp PM2

When to Use (Khi dùng):
- [Verified · UX-A16] Số hoặc chấm gắn vào phần tử khác: chuông, tab, nút lọc.
- [Based on Docs · HeroUI Badge] Báo số mục mới, chưa đọc.

When Not to Use (Khi không dùng):
- [Verified · UX-A16] Nhãn chữ đứng riêng thì dùng tag, không dùng số đếm.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · UX-L26] Chữ số đều bề ngang, rộng tối thiểu bằng cao, quá 99 hiện 99+.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · Material Design 3 · Badges] Số · chấm · ẩn khi bằng 0.

Do (Nên):
- [Verified · UX-L26] Dùng chung 1 khuôn số đếm cho chuông, tab và nút lọc ở mọi màn.
- [Verified · UX-A4] Tông màu số đếm lấy lớp `.tone-*` khai ở `styles/base.css`, không khai màu riêng ở CSS màn.
- [Verified · AppBadge.jsx] Bật `dot` khi chỉ cần báo có mục mới mà không cần số.

Don't (Không nên):
- [Verified · UX-A16] Không đặt chữ trong số đếm.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WCAG 2.2 · 4.1.3 Status Messages · MDN · ARIA status role] Số đếm gộp vào tên của phần tử chứa nó, vd nút đọc «Thông báo, 3 chưa đọc». Chỉ dùng role status khi số thay đổi lúc người dùng đang ở màn.

UX Writing (Cách viết chữ):
- [Verified · AppBadge.jsx] Bật `dot` mà bỏ trống `label` thì trình đọc màn hình đọc «Có mục mới».

Lớp CSS:
- `.app-badge-anchor` · biến thể: — · trạng thái: —
- `.app-badge` · biến thể: — · trạng thái: `.is-dot`

Thuộc tính `AppBadge`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `count` | number | `0` | Số đếm hiển thị, bằng 0 thì ẩn huy hiệu. |
| `max` | number | `99` | Ngưỡng số lớn nhất, `count` vượt ngưỡng thì hiện dạng `max+`. |
| `dot` | boolean | `false` | Chỉ hiện chấm tròn, không hiện số, kể cả khi `count` bằng 0. |
| `label` | string | — | Nhãn cho trình đọc màn hình, bỏ trống thì dùng số đếm hoặc câu `Có mục mới` khi bật `dot`. |
| `children` | ReactNode | — | Phần tử được gắn huy hiệu, như icon hoặc nút. |

### Thanh tiến độ (`progress`)

- Component: `AppProgress` (src/components/app/AppProgress.jsx)

```jsx
<AppProgress label="Quỹ thăm đã dùng" value={2} max={4} tone="brand|ok|warn" />
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI ProgressBar] Tỷ lệ đã dùng trên tổng.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Quỹ thăm đã dùng, sức chứa buồng, tiến độ đồng bộ. Quỹ thăm và sức chứa buồng là mức đo nên gắn role meter, tiến độ đồng bộ gắn role progressbar.

When Not to Use (Khi không dùng):
- [Based on Docs · IBM Carbon · Loading · Material Design 3 · Progress indicators] Chưa biết bao lâu xong thì dùng Vòng xoay đang tải.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Nhãn trái, «giá trị / tổng» phải, thanh cao 8 bo tròn.

Variants & States (Biến thể và trạng thái):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Màu chủ đạo · xanh kèm dấu tích khi xong · cam kèm số liệu khi gần đầy, ngưỡng gần đầy do từng màn quy định.

Do (Nên):
- [Based on Docs · IBM Carbon · Progress bar · WCAG 2.2 · 1.4.1 Use of Color] Hiện số cụ thể cạnh thanh.

Don't (Không nên):
- [Based on Docs · IBM Carbon · Progress bar] Không dùng màu đỏ cho tiến độ bình thường.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · HeroUI ProgressBar] role progressbar kèm aria-valuenow, min, max.

UX Writing (Cách viết chữ):
- [Based on Docs · IBM Carbon · Progress bar · WCAG 2.2 · 2.4.6 Headings and Labels] Nhãn nói rõ đo cái gì.

Lớp CSS:
- `.app-progress` · biến thể: — · trạng thái: `.is-ok` `.is-warn`
- `.app-progress-head` · biến thể: — · trạng thái: —
- `.app-progress-track` · biến thể: — · trạng thái: —
- `.app-progress-fill` · biến thể: — · trạng thái: —

Thuộc tính `AppProgress`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `label` | string | — | Nhãn bên trái phía trên thanh, đồng thời là nhãn của thanh cho trình đọc màn hình. |
| `value` | number | `0` | Giá trị đã đạt, chia cho `max` ra phần trăm tô đầy, giới hạn trong 0 tới 100. |
| `max` | number | `100` | Giá trị tổng, bằng 0 hoặc nhỏ hơn thì thanh để trống. |
| `tone` | 'brand' \| 'ok' \| 'warn' | `'brand'` | Tông màu thanh: `brand` màu chủ đạo, `ok` hoặc `warn`. |
| `showValue` | boolean | `true` | Hiện chữ `value / max` ở bên phải phía trên thanh. |

### Đường phân cách (`divider`)

- Component: `AppDivider` (src/components/app/AppDivider.jsx)

```jsx
<AppDivider />  ·  <AppDivider label="Hoặc" />  // tách khối lớn thì dùng card riêng
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Separator] Tách 2 nhóm nội dung trong cùng 1 khối.

When Not to Use (Khi không dùng):
- [Verified · UX-B8] Tách khối lớn thì dùng khối riêng (card), không kẻ đường.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Based on Docs · Material Design 3 · Divider · MDN · hr element] Đường 1px màu viền, có thể kèm nhãn ở giữa.

Variants & States (Biến thể và trạng thái):
- [Verified · AppDivider.jsx] Không có `label` thì chỉ kẻ đường ngang, có `label` thì nhãn nằm giữa 2 đoạn đường.

Do (Nên):
- [Based on Docs · Material Design 3 · Divider] Dùng ít, chỉ khi khoảng trắng chưa đủ tách.

Don't (Không nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Không kẻ đường dưới tiêu đề khối.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · HeroUI Separator] Có nhãn thì role separator kèm nhãn.

UX Writing (Cách viết chữ):
- [Verified · AppDivider.jsx] Chữ trong `label` đồng thời là nhãn của đường phân cách cho trình đọc màn hình.

Lớp CSS:
- `.app-divider` · biến thể: — · trạng thái: `.has-label`

Thuộc tính `AppDivider`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `label` | string | — | Nhãn ở giữa đường phân cách, bỏ trống thì chỉ kẻ đường ngang. |

### Khối thu gọn (`accordion`)

- Component: `AppAccordion` (src/components/app/AppAccordion.jsx)

```jsx
<AppAccordion items={[{ key, title, children, open }]} />
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Accordion] Nhiều mục nội dung phụ, mở từng mục khi cần.
- [Based on Docs · GOV.UK Design System · Accordion · Nielsen Norman Group · Accordions on Desktop] Câu hỏi thường gặp, chi tiết phụ của bản ghi.

When Not to Use (Khi không dùng):
- [Based on Docs · GOV.UK Design System · Details · Nielsen Norman Group · Accordions on Desktop] Thông tin bắt buộc phải đọc thì không giấu trong khối thu gọn.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Based on Docs · GOV.UK Design System · Details · WAI-ARIA APG · Accordion Pattern] Một mục đơn dựng bằng details/summary. Nhóm nhiều mục dựng theo mẫu Accordion của APG, tiêu đề là nút có aria-expanded đặt trong thẻ heading. Mũi tên xoay khi mở.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WCAG 2.2 · 2.4.7 Focus Visible · IBM Carbon · Accordion] Mở · đóng · rê chuột · tiêu điểm bàn phím có viền rõ.

Do (Nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Chỉ mở sẵn mục đầu khi đó là nội dung đa số người dùng cần xem, các mục khác đóng.

Don't (Không nên):
- [Based on Docs · IBM Carbon · Accordion] Không lồng khối thu gọn trong khối thu gọn.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · MDN · details element · WAI-ARIA APG · Accordion Pattern] details/summary dùng được sẵn bằng bàn phím và trình đọc màn hình. Dựng bằng nút thì phải có aria-expanded và aria-controls, mở đóng bằng Enter hoặc Space.

UX Writing (Cách viết chữ):
- [Based on Docs · GOV.UK Design System · Accordion] Tiêu đề mục là câu hỏi hoặc danh từ ngắn.

Lớp CSS:
- `.app-accordion` · biến thể: — · trạng thái: —
- `.app-accordion-item` · biến thể: — · trạng thái: —
- `.app-accordion-head` · biến thể: — · trạng thái: `:hover`
- `.app-accordion-body` · biến thể: — · trạng thái: —

Thuộc tính `AppAccordion`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `items` | array | `[]` | Danh sách mục `{ key, title, children, open }`, mỗi mục là 1 khối thu gọn, `open` cho mục mở sẵn. |

### Hiển thị ảnh và video (`media-gallery`)

- Component: `AppMediaGallery` (src/components/app/AppMediaGallery.jsx)

```jsx
<AppMediaGallery id="mediaXem" items={[{ key, type: 'image' | 'video', src, poster, title, meta, duration }]} />  // bấm ảnh thu nhỏ ⇒ hộp xem lớn · thiếu tệp ⇒ ô giữ chỗ
```

Quy tắc:
- QD-400

When to Use (Khi dùng):
- [Verified · QD-400] Xem lại bản ghi cuộc gọi video và ảnh gắn với 1 lịch hẹn hoặc 1 lượt thăm gặp.

When Not to Use (Khi không dùng):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Tệp không phải ảnh hoặc video (PDF, Excel) thì dùng Tài liệu đính kèm.

Anatomy (Cấu tạo):
- [Verified · QD-400] Control bổ sung theo góp ý Designer, chưa màn PM2 nào dùng — màn mới gọi thẳng AppMediaGallery, không tự dựng lại.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Lưới thẻ 16:9, ảnh hiển thị trọn trong khung không cắt · tên · dòng phụ · video có nút phát và thời lượng góc phải dưới · bấm thẻ mở hộp xem lớn.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WCAG 2.2 · 2.4.7 Focus Visible] Có tệp · chưa có tệp (ô giữ chỗ kèm icon) · rê chuột viền xanh · tiêu điểm bàn phím có viền rõ.

Do (Nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Dòng phụ ghi thời điểm và nơi chụp hoặc khung giờ cuộc gọi.

Don't (Không nên):
- [Based on Docs · WCAG 2.2 · 1.4.2 Audio Control] Không tự phát video khi mở hộp.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG · Dialog (Modal) Pattern · WCAG 2.2 · 4.1.2 Name, Role, Value] Mỗi thẻ là nút có tên đọc «Xem video …» hoặc «Xem ảnh …»; hộp xem lớn đóng bằng Esc.

UX Writing (Cách viết chữ):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Tên thẻ nêu đối tượng và mã bản ghi, vd «Bản ghi cuộc gọi LH-2026-0012».

Lớp CSS:
- `.app-media-thumb` · biến thể: — · trạng thái: `:focus-visible` `:hover`
- `.app-media-pic` · biến thể: — · trạng thái: —
- `.app-media-play` · biến thể: — · trạng thái: —
- `.app-media-dur` · biến thể: — · trạng thái: —
- `.app-media-cap` · biến thể: — · trạng thái: —
- `.app-media-title` · biến thể: — · trạng thái: —
- `.app-media-meta` · biến thể: — · trạng thái: —
- `.app-media-grid` · biến thể: — · trạng thái: —

Thuộc tính `AppMediaGallery`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | `'mediaXem'` | Mã của hộp xem lớn, cũng làm tiền tố mã tiêu đề hộp. |
| `items` | array | `[]` | Danh sách ảnh và video `{ key, type, src, poster, title, meta, duration }`, thiếu `src` thì hiện ô giữ chỗ kèm icon. |

### Cây thư mục, cây tổ chức (`tree`)

- Component: `AppTree` (src/components/app/AppTree.jsx)

```jsx
<AppTree treeData={[{ key, title, children }]} defaultExpandedKeys={[…]} onSelect={(key) => …} />  // có đường nối cấp, chọn 1 nút
```

Quy tắc:
- QD-400

When to Use (Khi dùng):
- [Verified · QD-400] Dữ liệu phân cấp nhiều tầng: cơ sở → dãy nhà → quầy → buồng, cây tổ chức.
- [Based on Docs · IBM Carbon · Tree view] Chọn 1 nút trong cây để lọc hoặc mở chi tiết.

When Not to Use (Khi không dùng):
- [Based on Docs · IBM Carbon · Tree view] Chỉ 1 tầng thì dùng danh sách hoặc bảng.

Anatomy (Cấu tạo):
- [Verified · QD-400] Control bổ sung theo góp ý Designer, chưa màn PM2 nào dùng — màn mới gọi thẳng AppTree, không tự dựng lại.
- [Based on Docs · IBM Carbon · Tree view] Đường nối cấp · mũi tên mở/đóng từng nhánh · nút đang chọn nền xanh nhạt.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · IBM Carbon · Tree view · WCAG 2.2 · 2.4.7 Focus Visible] Đóng · mở · đang chọn · rê chuột · focus bàn phím · vô hiệu.

Do (Nên):
- [Based on Docs · WAI-ARIA APG · Tree View Pattern · IBM Carbon · Tree view] Mở sẵn nhánh chứa nút đang chọn.

Don't (Không nên):
- [Verified · AppTree.jsx] Không dùng để chọn nhiều nút, `onSelect` chỉ trả khoá của 1 nút.
- [Based on Docs · PM1 DS › Phân trang › Đặc tả] Không phân trang danh mục dạng cây, hiển thị trọn cấu trúc.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG · Tree View Pattern] Di chuyển và mở/đóng nhánh bằng phím mũi tên (antd Tree).

UX Writing (Cách viết chữ):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Nút có mã thì ghi «Mã — Tên» như ô chọn danh mục.

Lớp CSS:
- `.app-tree` · biến thể: `.ant-tree` · trạng thái: —

Thuộc tính `AppTree`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `treeData` | array | `[]` | Dữ liệu cây, mỗi nút `{ key, title, children }`. |
| `defaultExpandedKeys` | array | — | Danh sách khoá các nhánh mở sẵn khi hiện cây. |
| `defaultExpandAll` | boolean | `false` | Mở sẵn mọi nhánh khi hiện cây. |
| `onSelect` | function | — | Gọi khi người dùng chọn 1 nút, nhận khoá của nút được chọn. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Thẻ số liệu (`stat-cards`)

- Component: `AppStatCards` (src/components/app/AppStatCards.jsx)

```jsx
<AppStatCards items={[{ key, label: 'Lịch hẹn trong tuần', value: 1284, delta: '+12 so với tuần trước', tone: 'up' }]} />  // số tự định dạng dấu chấm hàng nghìn
```

Quy tắc:
- QD-401

When to Use (Khi dùng):
- [Based on Docs · PM1 DS › Thẻ & vùng chứa] Thống kê đầu trang, ví dụ Tổng người nghiện kèm mức thay đổi so với tuần trước.

When Not to Use (Khi không dùng):
- [Based on Docs · PM1 DS › Bảng dữ liệu › Trần chiều cao lấy từ đâu] Không để khung danh sách bên dưới tự giãn tràn ra ngoài, lớp bọc phải là h-full min-h-0 flex flex-col gap-5 thay cho space-y-5.

Anatomy (Cấu tạo):
- [Based on Docs · PM1 DS › Thẻ & vùng chứa] Nhãn in hoa giãn chữ màu --text-3 đậm 600.
- [Based on Docs · PM1 DS › Thẻ & vùng chứa] Giá trị 28px đậm 700 màu --text-1, số phân tách nghìn bằng dấu chấm.
- [Based on Docs · PM1 DS › Thẻ & vùng chứa] Dòng thay đổi màu --success đậm 500.
- [Based on Docs · PM1 DS › Thẻ & vùng chứa] Khung viền 1px, bo góc lớn, đệm 16px dọc và 20px ngang.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · PM1 DS › Vỏ ứng dụng] Lưới thẻ tự co, khe giữa các thẻ 16px, mỗi thẻ tối thiểu 240px.

Do (Nên):
- [Verified · AppStatCards.jsx] Truyền `value` dạng số để thẻ tự thêm dấu chấm hàng nghìn, chuỗi thì hiện nguyên văn.
- [Verified · AppStatCards.jsx · AppPm1Controls.css] Gắn `tone` `up` cho mức tăng màu xanh, `down` cho mức giảm màu đỏ, bỏ trống là `flat` màu chữ phụ.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WCAG 2.2 · 1.4.1 Use of Color] Dòng thay đổi ghi rõ mức đổi bằng chữ, không chỉ dựa vào màu xanh đỏ.

UX Writing (Cách viết chữ):
- [Verified · UX-A15] Nhãn thẻ dùng đúng chữ màn đã có cho cùng khái niệm.

Lớp CSS:
- `.app-stat-cards` · biến thể: — · trạng thái: —
- `.app-stat` · biến thể: — · trạng thái: —
- `.app-stat-label` · biến thể: — · trạng thái: —
- `.app-stat-value` · biến thể: — · trạng thái: —
- `.app-stat-delta` · biến thể: — · trạng thái: `.is-down` `.is-up`

Thuộc tính `AppStatCards`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `items` | array | `[]` | Danh sách thẻ `{ key, label, value, delta, tone }`, giá trị số định dạng dấu chấm hàng nghìn, `tone` nhận `up`, `down` hoặc `flat`. |

### Bóng cuộn ngang (`scroll-shadow`)

- Component: `AppScrollShadow` (src/components/app/AppScrollShadow.jsx)

```jsx
<AppScrollShadow label="Bảng …"><table>…</table></AppScrollShadow>  // bóng hiện ở mép còn nội dung bị che
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI ScrollShadow] Báo người dùng vùng nội dung còn cuộn được.
- [Based on Docs · HeroUI · Scroll Shadow] Bảng danh sách rộng, dải thẻ cuộn ngang.

When Not to Use (Khi không dùng):
- [Based on Docs · HeroUI · Scroll Shadow] Vùng không cuộn thì không bọc.

Anatomy (Cấu tạo):
- [Verified · QD-406] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Bóng mờ 24px ở mép trái hoặc phải, chỉ hiện khi còn nội dung bị che.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · HeroUI · Scroll Shadow] Đầu vùng: chỉ bóng phải · giữa: 2 bên · cuối: chỉ bóng trái.

Do (Nên):
- [Verified · UX-G10] Bảng ít cột căn chỉnh để không sinh cuộn ngang trước, chỉ bọc bóng cuộn khi bảng nhiều cột thật sự phải cuộn.
- [Verified · AppScrollShadow.jsx] Bọc trực tiếp nội dung cuộn ngang, khung tự đo lại khi cuộn và khi đổi cỡ cửa sổ.

Don't (Không nên):
- [Based on Docs · Material Design 3 · Elevation] Không dùng bóng để trang trí.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG › Keyboard Interface] Vùng cuộn nhận Tab và có nhãn để cuộn bằng phím mũi tên.

Lớp CSS:
- `.app-scroll-shadow` · biến thể: — · trạng thái: `.is-end` `.is-start`
- `.app-scroll-shadow-body` · biến thể: — · trạng thái: `:focus-visible`

Thuộc tính `AppScrollShadow`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `children` | ReactNode | — | Nội dung cuộn ngang bên trong vùng có bóng mép. |
| `label` | string | — | Nhãn của vùng cuộn cho trình đọc màn hình. |
| `className` | string | `''` | Lớp CSS thêm vào khung ngoài, nối sau lớp `app-scroll-shadow`. |

### Ô mẫu màu (`color-swatch`)

- Component: `AppColorSwatch` (src/components/app/AppColorSwatch.jsx)

```jsx
<AppColorSwatch colors={[{ name: 'Chủ đạo', token: '--color-brand' }]} />  // mã màu đọc từ CSS thật
```

When to Use (Khi dùng):
- [Based on Docs · IBM Carbon · Color overview · Atlassian Design System · Color] Tra bảng màu token trên trang Design System, tài liệu bàn giao.

When Not to Use (Khi không dùng):
- [Based on Docs · IBM Carbon · Color overview] Không dùng làm ô chọn màu cho người dùng nhập.

Anatomy (Cấu tạo):
- [Verified · QD-406] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Based on Docs · IBM Carbon · Color overview] Ô màu 36px, tên, token và mã màu đọc từ CSS thật lúc chạy.

Variants & States (Biến thể và trạng thái):
- [Verified · AppColorSwatch.jsx] Mã màu chưa đọc được từ CSS thì hiện «—».
- [Verified · AppExtraControls.css] Lưới ô màu tự co, mỗi ô rộng tối thiểu 200px, khe 12px.

Do (Nên):
- [Verified · UX-A4] Màu lấy từ token, không gõ mã màu.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WCAG 2.2 · 1.4.1 Use of Color] Màu luôn đi kèm tên và mã, không chỉ dựa vào màu.

UX Writing (Cách viết chữ):
- [Based on Docs · Material Design 3 · Color roles · Atlassian Design System · Color] Tên màu theo vai trò: Chủ đạo, Thành công, Cảnh báo.

Lớp CSS:
- `.app-swatch-list` · biến thể: — · trạng thái: —
- `.app-swatch` · biến thể: — · trạng thái: —
- `.app-swatch-chip` · biến thể: — · trạng thái: —
- `.app-swatch-text` · biến thể: — · trạng thái: —
- `.app-swatch-hex` · biến thể: — · trạng thái: —

Thuộc tính `AppColorSwatch`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `colors` | array | `[]` | Danh sách màu `{ name, token }`, `token` là biến CSS, mã màu đọc từ CSS lúc chạy. |

## Phản hồi và thông báo

### Khung Lưu ý — xanh và xám (`notebox`)

- Component: `NoteBox` (src/components/app/NoteBox.jsx)

```jsx
<NoteBox items={[…]} />  XANH — nội dung cần nổi bật để nhắc nhở, hướng dẫn người dùng
<NoteBox line="…" />   XÁM — ghi chú nhắc thêm, vô hại, không cần nhấn mạnh  (QD-372)
```

Quy tắc:
- UX-L13: QD-372 ②: 2 mức nhấn mạnh — XANH (`<NoteBox items>`) cho nội dung cần nổi bật để nhắc nhở, hướng dẫn người dùng; XÁM (`<NoteBox line>`) cho ghi chú nhắc thêm, vô hại. Ghi chú trong khối form dùng component chung `components/app/NoteBox.jsx`, không viết bằng dòng chữ xám `.field-hint`. `NoteBox` đặt ở CUỐI khối, `2` biến thể *(sửa 09/10/2026 theo Q12)*: ① quy tắc nhập liệu *(vd ngày bật thăm gặp bắt buộc ít nhất `1` ca)* ⇒ khung info: nền info, viền trái `4px`, icon info, tiêu đề «Lưu ý», gạch đầu dòng, từ khoá in đậm · ② `1` câu thông tin về nguồn số liệu *(vd số đồng bộ từ C04)* ⇒ `NoteBox line=…`: khung XÁM, `1` dòng «Lưu ý: …», chữ xám, không nổi bật như khung info — nguyên văn: *"Chỗ này chỗ Lưu ý chỗ giới hạn thời lượng vẫn k ưng, nó quá nổi bật và không cần thiết. Ngoài ra icon Lưu ý có vẻ bị to so với chữ nhìn nó lệch"* · *"Cho thành 1 dòng và chỗ này để màu xám"* · *"Ý là có bọc khối như thế này nhưng là khối màu xám và câu của tớ đẻ màu xám luôn"*. Icon cùng cỡ dòng chữ, tâm icon trùng tâm dòng *(UX-A6)*. không đặt ghi chú cạnh hoặc dưới tên khối *(đã thử `3` kiểu ngày `09/10/2026`, TrangNT5 chốt: "Cho giống Lưu ý phía trên vậy")*. `.field-hint` chỉ dành cho gợi ý ngắn dưới `1` ô. Nguyên văn: *"Ai dạy bạn làm cái kiểu ghi chú hời hợt thế này, đấm cho giờ, làm tử tế vào"* · *"Cái này nên để ở đây hợp lý hơn cạnh tên khối"*. Thay dấu `*` lẻ ở `1` cột bảng bằng câu bắt buộc trong `NoteBox` *(màn Cấu hình thời gian)*
- QD-372

When to Use (Khi dùng):
- [Verified · QD-372] Khung XANH (items) cho nội dung cần nổi bật để nhắc nhở, hướng dẫn người dùng, vd quy tắc nhập liệu
- [Verified · UX-L13] Khung XÁM (line) cho 1 câu ghi chú nhắc thêm, vô hại, vd thông tin số liệu đồng bộ từ C04
- [Verified · UX-G12] Câu hướng dẫn dưới bảng lọc theo điều kiện nghiệp vụ dựng bằng NoteBox line
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Hộp thoại xác nhận] Alert trong trang dùng cho thông tin có ngữ cảnh và tồn tại lâu, đặt ở đầu trang hoặc đầu vùng liên quan.

When Not to Use (Khi không dùng):
- [Verified · UX-L13] Không viết quy tắc bắt buộc bằng dòng chữ xám .field-hint, .field-hint chỉ dành cho gợi ý ngắn dưới 1 ô
- [Verified · UX-L13] Không đặt ghi chú cạnh hoặc dưới tên khối

Anatomy (Cấu tạo):
- [Verified · UX-L13] Khung xanh: nền info, viền trái 4px, icon info, tiêu đề «Lưu ý», danh sách gạch đầu dòng
- [Verified · UX-L13] Khung xám: 1 dòng «Lưu ý: …», chữ xám
- [Verified · UX-L13] Đặt ở cuối khối form

Variants & States (Biến thể và trạng thái):
- [Verified · NoteBox.jsx] Chỉ có 2 biến thể chọn theo prop items hoặc line, không có trạng thái tương tác
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Thông báo trong trang] Alert trong trang có 4 loại: Thông tin, Thành công, Cảnh báo, Lỗi.

Do (Nên):
- [Verified · UX-L13] Từ khoá trong khung xanh in đậm
- [Verified · UX-A6] Icon cùng cỡ dòng chữ, tâm icon trùng tâm dòng
- [Verified · UX-L13] Thay dấu * lẻ ở 1 cột bảng bằng câu bắt buộc trong NoteBox

Don't (Không nên):
- [Verified · QD-372] Không dùng khung xanh cho ghi chú vô hại không cần nhấn mạnh

Accessibility (Truy cập và bàn phím):
- [Verified · NoteBox.jsx] Khung mang role=note

UX Writing (Cách viết chữ):
- [Verified · NoteBox.jsx] Tiêu đề mặc định «Lưu ý»
- [Verified · UX-G12] Câu dưới bảng theo khuôn «{Danh sách X} sẽ có giá trị nếu {điều kiện}»
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Thông báo trong trang] Câu cảnh báo nêu số và vị trí, ví dụ «Còn 3 trường bắt buộc chưa nhập ở tab Nhân thân.».

Lớp CSS:
- `.note-box` · biến thể: — · trạng thái: `.is-muted`
- `.note-box-line` · biến thể: — · trạng thái: —
- `.note-box-title` · biến thể: — · trạng thái: —

Thuộc tính `NoteBox`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Mã gắn vào khung ghi chú. |
| `title` | string | `'Lưu ý'` | Tiêu đề khung, ở dạng 1 dòng thì đứng trước câu kèm dấu hai chấm. |
| `items` | array | — | Danh sách ý, mỗi ý 1 gạch đầu dòng, bắt buộc khi không truyền `line`. |
| `line` | ReactNode | — | Câu thông tin 1 dòng, có giá trị thì hiện khung tông xám và bỏ qua `items`. |

### Khung gợi ý dưới bảng (`table-hint`)

- Component: `NoteBox` (src/components/app/NoteBox.jsx)

```jsx
// nguồn ReceptionDeskDetail.jsx (tab Tình hình sử dụng) · AppointmentList.jsx (chỉ danh sách Ngoại lệ)
<div className="table-hint"><NoteBox id="…" line="… sẽ có giá trị nếu …" /></div>   // đặt ngay dưới bảng, câu nói khi nào bảng có dữ liệu
```

Quy tắc:
- UX-L13: QD-372 ②: 2 mức nhấn mạnh — XANH (`<NoteBox items>`) cho nội dung cần nổi bật để nhắc nhở, hướng dẫn người dùng; XÁM (`<NoteBox line>`) cho ghi chú nhắc thêm, vô hại. Ghi chú trong khối form dùng component chung `components/app/NoteBox.jsx`, không viết bằng dòng chữ xám `.field-hint`. `NoteBox` đặt ở CUỐI khối, `2` biến thể *(sửa 09/10/2026 theo Q12)*: ① quy tắc nhập liệu *(vd ngày bật thăm gặp bắt buộc ít nhất `1` ca)* ⇒ khung info: nền info, viền trái `4px`, icon info, tiêu đề «Lưu ý», gạch đầu dòng, từ khoá in đậm · ② `1` câu thông tin về nguồn số liệu *(vd số đồng bộ từ C04)* ⇒ `NoteBox line=…`: khung XÁM, `1` dòng «Lưu ý: …», chữ xám, không nổi bật như khung info — nguyên văn: *"Chỗ này chỗ Lưu ý chỗ giới hạn thời lượng vẫn k ưng, nó quá nổi bật và không cần thiết. Ngoài ra icon Lưu ý có vẻ bị to so với chữ nhìn nó lệch"* · *"Cho thành 1 dòng và chỗ này để màu xám"* · *"Ý là có bọc khối như thế này nhưng là khối màu xám và câu của tớ đẻ màu xám luôn"*. Icon cùng cỡ dòng chữ, tâm icon trùng tâm dòng *(UX-A6)*. không đặt ghi chú cạnh hoặc dưới tên khối *(đã thử `3` kiểu ngày `09/10/2026`, TrangNT5 chốt: "Cho giống Lưu ý phía trên vậy")*. `.field-hint` chỉ dành cho gợi ý ngắn dưới `1` ô. Nguyên văn: *"Ai dạy bạn làm cái kiểu ghi chú hời hợt thế này, đấm cho giờ, làm tử tế vào"* · *"Cái này nên để ở đây hợp lý hơn cạnh tên khối"*. Thay dấu `*` lẻ ở `1` cột bảng bằng câu bắt buộc trong `NoteBox` *(màn Cấu hình thời gian)*
- QD-390

When to Use (Khi dùng):
- [Verified · ReceptionDeskDetail.jsx] Đặt ngay dưới bảng một câu nói KHI NÀO bảng có dữ liệu, dạng «… sẽ có giá trị nếu …».
- [Verified · AppointmentList.jsx] Dùng ở tab Tình hình sử dụng của Chi tiết quầy và danh sách lịch hẹn Ngoại lệ.

When Not to Use (Khi không dùng):
- [Verified · AppointmentList.jsx] Không thêm khung gợi ý ở danh sách thường — màn Thăm gặp trực tiếp đã bỏ để bảng rộng hơn.

Anatomy (Cấu tạo):
- [Verified · base.css] `div.table-hint` bọc `NoteBox` kiểu 1 dòng (xám), cách bảng 12px.

Variants & States (Biến thể và trạng thái):
- [Verified · UX-G12] Câu luôn hiện kể cả khi bảng có dòng.
- [Verified · AppointmentList.jsx] Ở danh sách lịch hẹn Ngoại lệ, câu ẩn khi chuyển sang chế độ lưới lịch.

Do (Nên):
- [Verified · UX-G12] Viết điều kiện từ code lọc thật hoặc từ QD trong Sổ BA.
- [Verified · UX-G12] Dùng khung xám 1 dòng `NoteBox line`, không dùng khung xanh.

Don't (Không nên):
- [Verified · UX-G12] Không dùng cho bảng chỉ lọc theo ô tìm, ô lọc người dùng nhập.
- [Verified · UX-G12] Không tự đặt điều kiện, code lọc mà không có nguồn nghiệp vụ thì hỏi TrangNT5.

Accessibility (Truy cập và bàn phím):
- [Verified · NoteBox.jsx] Khung `NoteBox` mang `role=note`.

UX Writing (Cách viết chữ):
- [Verified · UX-G12 · NoteBox.jsx] Không gõ «Lưu ý:» vào câu, component tự thêm tiền tố này.

Lớp CSS:
- `.table-hint` · biến thể: — · trạng thái: —
- `.note-box` · biến thể: — · trạng thái: `.is-muted`
- `.note-box-line` · biến thể: — · trạng thái: —
- `.note-box-title` · biến thể: — · trạng thái: —

Thuộc tính `NoteBox`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Mã gắn vào khung ghi chú. |
| `title` | string | `'Lưu ý'` | Tiêu đề khung, ở dạng 1 dòng thì đứng trước câu kèm dấu hai chấm. |
| `items` | array | — | Danh sách ý, mỗi ý 1 gạch đầu dòng, bắt buộc khi không truyền `line`. |
| `line` | ReactNode | — | Câu thông tin 1 dòng, có giá trị thì hiện khung tông xám và bỏ qua `items`. |

### Hướng dẫn cài đặt khi chưa có dữ liệu (`setup-hint`)

- Component: `SetupHint` (src/components/app/SetupHint.jsx)

```jsx
<SetupHint what="buồng thăm gặp" screen="Cài đặt quầy tiếp đón" to={ROUTES.receptionDeskList} />
```

Quy tắc:
- UX-L14: Màn CHƯA CÓ DỮ LIỆU CẦN CÀI ĐẶT TRƯỚC ⇒ để trống vùng dữ liệu, hiện câu hướng dẫn kèm LINK mở thẳng màn cài đặt. `1` component chung `components/app/SetupHint.jsx`, message `I001-94` *«Chưa có {0} nào. Vui lòng cài đặt tại {1}»*, `{1}` là tên màn cài đặt hiển thị thành link. không vẽ khung lưới hoặc bảng rỗng không lời giải thích. Nguyên văn: *"Tớ muốn có quy tắc là nếu những màn hình nào mà chưa có dữ liệu cần cài đặt thì có mgs hướng dẫn và link đến trực tiếp màn hình đó"*. Áp đầu tiên: tab Lịch theo buồng chưa có buồng ⇒ link màn Buồng thăm gặp

When to Use (Khi dùng):
- [Verified · UX-L14] Màn chưa có dữ liệu cần cài đặt trước: để trống vùng dữ liệu, hiện câu hướng dẫn kèm link mở thẳng màn cài đặt
- [Verified · UX-L14] Câu chờ cài đặt khác I001-94 (vd I001-79 ở Suất riêng khi quầy chưa có buồng) cũng dựng bằng SetupHint

When Not to Use (Khi không dùng):
- [Verified · UX-L14] Không vẽ khung lưới, bảng rỗng không lời giải thích hay khung nét đứt
- [Based on Docs · UX-G8] Bảng chưa có bản ghi thông thường dùng dòng rỗng EmptyRow I001-27, không dùng SetupHint

Anatomy (Cấu tạo):
- [Verified · I001-94 · SetupHint.jsx] Icon info và câu I001-94 «Chưa có {0} nào. Vui lòng cài đặt tại {1}», {1} hiển thị thành link
- [Verified · UX-L14] Đúng 1 link, href là route có thật trong App.jsx

Variants & States (Biến thể và trạng thái):
- [Verified · SetupHint.jsx] Mặc định: khối thay vùng dữ liệu trống
- [Verified · SetupHint.jsx] inline: gọn trong dòng, dưới 1 ô form hoặc trong ô trống của lưới chọn giờ
- [Verified · SetupHint.jsx · UX-L14] Link chuyển bước hoặc tab trong cùng màn qua onLinkClick, link kèm ?tab= hoặc #khối vẫn hợp lệ

Do (Nên):
- [Verified · UX-L14] Câu khác I001-94 giữ nguyên chữ, cụm chỉ nơi cài đặt thành link qua linkInMsg

Don't (Không nên):
- [Verified · UX-M1] Không gõ cứng câu, gọi message theo mã

Accessibility (Truy cập và bàn phím):
- [Verified · SetupHint.jsx] Khối mang role=status, link là thẻ a có href thật

UX Writing (Cách viết chữ):
- [Verified · QD-348] Viết «Vui lòng», không viết «Hãy»
- [Verified · I001-94 · ListCalendar.jsx · AppointmentForm.jsx] Ví dụ áp đầu tiên: «Chưa có buồng thăm gặp nào. Vui lòng cài đặt tại Cài đặt quầy tiếp đón»
- [Verified · UX-E3] Không chấm cuối câu, 2 câu thì dấu chấm chỉ ngăn giữa

Lớp CSS:
- `.setup-hint` · biến thể: — · trạng thái: `.is-inline`
- `.setup-hint-link` · biến thể: — · trạng thái: `:hover`

Thuộc tính `SetupHint`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `what` | string | — | Tên dữ liệu còn thiếu, điền vào chỗ {0} của câu I001-94. |
| `screen` | string | — | Tên màn cài đặt, làm chữ của link ở chỗ {1} khi không truyền `parts`. |
| `to` | string | — | Đường dẫn mở màn cài đặt, gắn vào link. |
| `id` | string | — | Mã gắn vào khối gợi ý. |
| `inline` | boolean | `false` | Hiện gọn trong dòng thay vì khối thay vùng dữ liệu trống. |
| `parts` | object | — | Câu đã cắt sẵn `{ truoc, link, sau }` dùng cho câu khác I001-94, có giá trị thì bỏ qua `what` và `screen`. |
| `onLinkClick` | function | — | Gọi khi bấm link, không nhận đối số, có giá trị thì chặn chuyển trang theo `to`. |

### Khung cảnh báo hệ quả (`warning`)


```jsx
<div className="eff is-warning"><RichText text={msg('W001-15', …)} /></div>
```

Quy tắc:
- UX-F4: Icon tiêu đề hộp xác nhận theo MỨC rủi ro, 1 hình chung — tròn chấm than `22px`, dựng bằng `components/app/DialogIcon.jsx`, không dùng dấu hỏi, không dùng tam giác. Đỏ `--color-err` + nút chính đỏ: thao tác không hoàn tác *(Xóa, Hủy lịch hẹn)* · Cam `--color-warn` + nút chính thường: thao tác có ảnh hưởng *(Vô hiệu hóa, Rời trang khi chưa lưu, Đổi khung giờ, Đổi quầy, Vắng mặt, Từ chối, Check-in khác ngày)* · Không icon: thao tác thường *(Kích hoạt, Duyệt, Điều chỉnh)*. *(Sửa `09/10/2026` theo bàn giao phiên Danh mục, bản cũ "dấu hỏi 20px vàng" hết hiệu lực)*

When to Use (Khi dùng):
- [Verified · PM2_MessageList W001-15] Nói hệ quả của thao tác ngay trong hộp xác nhận, vd vô hiệu hóa quầy hoặc buồng còn lịch chưa diễn ra (W001-15)
- [Verified · AppointmentForm.jsx · CounterRegistration.jsx] Cảnh báo tại chỗ trong form, vd cảnh báo quầy ở Tạo lịch hẹn và Đăng ký tại quầy
- [Verified · NotificationSettings.jsx] Cảnh báo lệch cấu hình ở Cài đặt thông báo (W001-21)

When Not to Use (Khi không dùng):
- [Verified · UX-E1] Báo kết quả thao tác dùng toast
- [Verified · UX-D2] Lỗi của 1 ô dùng chữ đỏ dưới ô

Anatomy (Cấu tạo):
- [Verified · catalog.jsx (warning) · UX-L12] Khung lớp eff is-warning bọc câu RichText, key trong câu in đậm

Variants & States (Biến thể và trạng thái):
- [Verified · CounterDialogs.jsx · ReceptionDeskDetail.jsx] Chỉ hiện khi có hệ quả thật, vd số lịch bị ảnh hưởng lớn hơn 0

Do (Nên):
- [Verified · UX-M1] Câu lấy từ Message List nhóm W001 qua msg(mã)
- [Verified · UX-F4] Hộp xác nhận cho thao tác có ảnh hưởng dùng icon cam và nút chính thường
- [Verified · PM2_MessageList W001-15] Nêu số liệu bị ảnh hưởng và in đậm

Don't (Không nên):
- [Verified · PM2_MessageList §1.7 Inline] W001 hiện tại chỗ thì không chặn lưu, không kèm nút, không popup
- [Verified · UX-L12] Không để dấu lọt ra màn hình

Accessibility (Truy cập và bàn phím):
- [Based on Docs · AppointmentForm.jsx · WCAG 2.1 SC 4.1.3] Khung chưa khai role, khi xuất hiện động nên gắn role=alert hoặc đặt trong vùng aria-live

UX Writing (Cách viết chữ):
- [Verified · UX-E3] Câu nói hệ quả trong hộp xác nhận có dấu chấm cuối mọi câu
- [Verified · PM2_MessageList W001-15] Khuôn W001-15: «{0} còn {1} lịch hẹn chưa diễn ra. Nếu vẫn vô hiệu hóa, toàn bộ lịch hẹn này sẽ bị hủy với lý do Buồng / Quầy ngừng hoạt động.»

Lớp CSS:
- `.eff` · biến thể: `.form-footer` · trạng thái: `.is-warning`

### Thông báo nổi (toast) (`toast`)


```jsx
toast(msg('I001-03', …))  ·  toast(msg('SE001-01', 'Lưu'), 'is-error')
```

Quy tắc:
- UX-E1: Mọi thông báo đi qua `1` toast chung

When to Use (Khi dùng):
- [Verified · UX-E1] Mọi thông báo kết quả thao tác (thành công, lỗi, cảnh báo) đi qua 1 toast chung
- [Verified · UX-E7] Lưu hỏng thì toast lỗi và ở lại màn
- [Verified · Playbook_List §2 mục 11] Về từ màn khác với ?moi= hoặc ?sua= thì toast kèm cuộn tới và tô sáng dòng

When Not to Use (Khi không dùng):
- [Verified · UX-E1] Không dùng alert() hay toast đen góc dưới
- [Verified · PM2_MessageList §1.6] Lỗi của 1 ô dùng kênh Inline dưới ô, việc cần người dùng chọn dùng Popup

Anatomy (Cấu tạo):
- [Verified · UX-E1] Đặt ở góc trên bên phải, cách mép phải 24px, dưới thanh tiêu đề; nền trắng bo 8px, đệm 11px 14px, chữ 14px
- [Verified · QD-442] Icon 16px theo loại: thành công #389E0D, lỗi #FF4D4F, cảnh báo #D48806 (đạt tương phản 3:1 trên nền trắng)
- [Verified · QD-434] Nút đóng là nút 24px căn đúng tâm dòng chữ, icon X 16px nét 2, xám rgba(0,0,0,.65) ở mọi loại toast, rê chuột đậm .88, có aria-label và tooltip «Đóng»

Variants & States (Biến thể và trạng thái):
- [Verified · legacyUi.js] 3 loại: is-success (mặc định), is-error, is-warning
- [Verified · QD-434] Hiện 5 giây, rê chuột dừng đồng hồ, rời chuột đếm lại 5 giây
- [Verified · QD-405 · QD-434] Hiện ở góc trên bên phải, dưới thanh tiêu đề, nhiều toast xếp chồng cách nhau 8px

Do (Nên):
- [Verified · UX-E2] 1 hành động chỉ 1 thông báo, lưu xong chuyển trang thì chỉ màn đích báo
- [Verified · UX-M1] Gọi theo mã, vd toast(msg('I001-03', …))
- [Verified · UX-E4] Thông báo kèm mã bản ghi

Don't (Không nên):
- [Verified · UX-E6] Tải lại trang sau khi lưu không hiện lại toast
- [Verified · UX-E3] Không hiện chữ kỹ thuật như e.message, tên hàm, mã lỗi trình duyệt

Accessibility (Truy cập và bàn phím):
- [Verified · AppLayout.jsx:168] Vùng #vungToast có aria-live=polite nên trình đọc màn hình đọc toast khi xuất hiện.
- [Based on Docs · UX-E1 · WCAG 2.1 SC 2.2.1] Dừng đồng hồ khi rê chuột và có nút đóng giúp người đọc chậm kịp đọc

UX Writing (Cách viết chữ):
- [Verified · UX-E3] Không dấu chấm cuối câu, 2 câu thì dấu chấm chỉ ngăn giữa
- [Verified · PM2_MessageList §1.7 Toast] Thành công theo khuôn «Đã {động từ} {đối tượng}», vd I001-03 «Đã cập nhật {0}»
- [Verified · PM2_MessageList SE001-01] Lỗi kỹ thuật khi lưu hoặc xuất: SE001-01 «{0} thất bại. Vui lòng thử lại»
- [Verified · UX-L12] Key trong câu in đậm bằng biến bọc {n}
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Viết thông báo lỗi] Thao tác trên bản ghi đã bị xóa ở phiên khác báo «Bản ghi không còn tồn tại hoặc đã bị xóa.», không để lỗi hệ thống lọt ra.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Viết thông báo lỗi] Trùng dữ liệu nói rõ trùng với bản ghi nào, ví dụ «Mã đã tồn tại trong bản ghi CS1-DM-012.».
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Viết thông báo lỗi] Sai định dạng nói định dạng đúng.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Viết thông báo lỗi] Không có quyền nói thiếu quyền gì và liên hệ ai, không hiện màn trắng hay bảng rỗng.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Viết thông báo lỗi] Lỗi kết xuất phải có thông báo, không im lặng.

### Thanh báo phiên bản mới (`version-notice`)

- Component: `VersionNotice` (src/components/app/VersionNotice.jsx)

```jsx
<VersionNotice />  // Prototype: chữ PM5
<VersionNotice label="TrangNT5 đã có nâng cấp phiên bản mới, bạn hãy F5 và trải nghiệm nhé!" />  // trang Design System
// xem thử không cần bản build mới: thêm ?preview=version-notice vào link
```

When to Use (Khi dùng):
- [Verified · QD-415] Báo người đang mở bản cũ rằng hệ thống vừa có bản build mới, kèm lối tải lại trang 1 bấm
- [Verified · QD-415] Đặt 1 lần ở gốc ứng dụng (App.jsx), không đặt trong từng màn
- [Verified · QD-415] Xem thử không cần bản build mới: thêm ?preview=version-notice vào link

When Not to Use (Khi không dùng):
- [Verified · QD-415] Không tự tải lại trang khi người dùng chưa bấm, tránh mất dữ liệu đang nhập
- [Verified · QD-415] Không dùng cho thông báo kết quả thao tác, việc đó dùng toast

Anatomy (Cấu tạo):
- [Verified · QD-415] Pill nổi giữa đáy màn hình, nền đỏ theo thanh tiêu đề site, viền vàng chạy vòng quanh, logo Công an chìm giữa nền
- [Verified · QD-415] Huy hiệu vàng gồm icon động và chữ «Mới», câu thông báo in hoa, «Tải lại ngay» dạng link có icon tải lại phía trước, nút X màu trắng

Variants & States (Biến thể và trạng thái):
- [Verified · QD-415] Dò lại index.html mỗi 5 phút và khi quay lại tab hoặc focus cửa sổ, các lần cách nhau tối thiểu 60 giây
- [Verified · QD-415] Ẩn khi mất mạng và 4 giây sau khi có mạng lại; bấm Đóng thì ẩn tới khi có bản build khác

Lớp CSS:
- `.vn-region` · biến thể: — · trạng thái: —
- `.vn-chip` · biến thể: — · trạng thái: —
- `.vn-seal` · biến thể: — · trạng thái: —
- `.vn-new` · biến thể: — · trạng thái: —
- `.vn-new-icon` · biến thể: — · trạng thái: —
- `.vn-label` · biến thể: — · trạng thái: —
- `.vn-action-icon` · biến thể: — · trạng thái: —
- `.vn-action` · biến thể: `.ant-btn` · trạng thái: `:focus-visible` `:hover`

Thuộc tính `VersionNotice`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `label` | string | `LABEL` | Tuỳ chọn. Chữ chính trên thanh. Mặc định là chữ PM5 «Đã có phiên bản mới của hệ thống»; trang Design System truyền câu của TrangNT5 (TrangNT5 chốt 19/10/2026). |
| `actionLabel` | string | `ACTION_LABEL` | Tuỳ chọn. Chữ nút tải lại. Mặc định «Tải lại ngay». |

### Lỗi dưới ô nhập (`field-error`)


```jsx
<div className="field-error on">{msg('E001-01', 'mã quầy')}</div>
```

Quy tắc:
- UX-L11: Dấu `*` trường bắt buộc luôn màu ĐỎ báo lỗi `var(--color-err)` `#DC2626` — không lấy màu thương hiệu *(màu thương hiệu đổi thì dấu `*` đổi theo, sai nghĩa)*. `1` lớp chung `.required-mark` cho form, popup và bộ lọc. Nguyên văn: *"Ô vãi dấu * bắt buộc cần màu đỏ nhá"*. Đo `09/10/2026` trước khi sửa: `45` dấu `*` trên `8` màn đang xanh `#076DB6`

When to Use (Khi dùng):
- [Verified · UX-D2] Bấm nút khi còn thiếu: hiện chữ đỏ dưới mọi ô bắt buộc còn trống
- [Verified · UX-C5] Nút điều hướng như Tiếp tục ở ca thiếu dữ liệu phải báo chữ đỏ dưới ô còn thiếu
- [Verified · Playbook_CreateEdit §2 mục 13] Bảng nhập nhiều dòng có dòng trùng: chữ đỏ ở cả 2 dòng
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Lỗi nghiệp vụ từ máy chủ quy được về 1 trường thì báo dưới ô đó, ví dụ trùng mã báo dưới ô Mã kèm mã bản ghi đang trùng.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Vượt dung lượng tệp báo đỏ dưới ô tải lên, ghi rõ giới hạn và dung lượng tệp vừa chọn.

When Not to Use (Khi không dùng):
- [Verified · PM2_MessageList SE001-01] Lỗi kỹ thuật khi lưu không thuộc 1 ô thì dùng toast SE001-01
- [Verified · Playbook_CreateEdit §4 câu 21] Không khoá nút thay cho báo lỗi, nút luôn bấm được và báo lỗi dưới từng ô
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Không bật hộp thoại chỉ vì 1 ô nhập sai.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx (field-error)] Ô viền đỏ (input-border-error) và dòng chữ đỏ lớp field-error on ngay dưới ô
- [Verified · UX-L11] Dấu * ở nhãn trường bắt buộc màu đỏ #DC2626, lớp chung required-mark

Variants & States (Biến thể và trạng thái):
- [Verified · UX-D2 · PM2_MessageList §1.6 Inline] Ẩn khi chưa lỗi, hiện khi bấm nút còn thiếu, chọn hoặc sửa đúng thì chữ đỏ ô đó tắt
- [Verified · UX-D3] Ô có lớp tìm kiếm: chữ đỏ dưới khung bọc. Ô ngày: dưới ô, trên link «Chọn ngày hôm nay»
- [Verified · UX-D8] Ô trong hàng bảng: chữ đỏ nằm trong ô của ô lỗi, không dồn sang cột khác
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Gõ chạm giới hạn ký tự thì chặn nhập thêm và im lặng, không báo đỏ.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Có bộ đếm ký tự thì bộ đếm chuyển màu --warning khi còn dưới 10%.
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Dán vượt giới hạn thì tự cắt phần thừa và hiện dòng --text-3 «Đã cắt bớt, tối đa N ký tự».
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Bấm Lưu còn ô lỗi thì thêm alert đầu biểu mẫu ghi số lượng, ví dụ «Còn 3 trường bắt buộc chưa nhập».
- [Based on Docs · PM1 DS › Biểu mẫu & input › Báo lỗi ở đâu] Biểu mẫu nhiều tab thì alert phải nói tab nào còn lỗi.
- [Verified · QD-431] Bấm lưu mà chữ đỏ đầu tiên nằm ngoài khung nhìn thì màn tự cuộn tới giữa và đặt con trỏ vào ô đó, chữ đỏ đã trong khung thì không cuộn

Do (Nên):
- [Verified · UX-D3] Chữ đỏ sát mép trái ô 0px, cách mép dưới ô đúng 4px
- [Verified · Playbook_CreateEdit §4 câu 1] Cuộn tới lỗi đầu tiên
- [Verified · Playbook_CreateEdit §5] Gắn lỗi theo ô đang hiện, không trỏ vào ô trong khối ẩn
- [Verified · Playbook_CreateEdit §2 mục 13] Câu báo trùng nêu đích danh giá trị trùng và dòng kia
- [Verified · QD-435] Mỗi trường bắt buộc có chỗ báo lỗi riêng ngay dưới chính nó, không dồn về ô đại diện của bước
- [Verified · QD-440] Chỗ báo lỗi đặt id theo quy ước {mã ô}Loi để chữ đỏ luôn tìm được ô của nó, kể cả ô lồng sâu

Don't (Không nên):
- [Verified · UX-D2] Không chỉ báo ô đầu tiên
- [Verified · PM2_MessageList §1.7 Inline] Không dùng câu validate trần «Bắt buộc»
- [Verified · UX-L11] Không lấy màu thương hiệu cho dấu *

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WCAG 2.1 SC 3.3.1] Prototype chưa gắn aria-invalid và aria-describedby, nên gắn để trình đọc màn hình đọc lỗi cùng ô
- [Based on Docs · WCAG 2.1 SC 1.4.1 · UX-D2] Lỗi nhận ra bằng cả chữ và viền đỏ, không chỉ bằng màu

UX Writing (Cách viết chữ):
- [Verified · PM2_MessageList E001-01 · E001-02] Ô nhập trống: E001-01 «Vui lòng nhập {0}». Ô chọn trống: E001-02 «Vui lòng chọn {0}»
- [Verified · Playbook_CreateEdit §4 câu 24] Tên trường giữa câu viết thường
- [Verified · UX-E3] Không chấm cuối câu

### Vòng xoay đang tải (`spinner`)

- Component: `AppSpinner` (src/components/app/AppSpinner.jsx)

```jsx
<AppSpinner text="Đang tải" />  ·  <AppSpinner size="lg" />
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Spinner] Báo đang xử lý khi chưa biết bao lâu xong.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Thao tác xong dưới 300ms thì không hiện chỉ báo tải.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Tải lại khi đổi bộ lọc hoặc đổi trang dùng thanh chạy 3px trên đầu vùng nội dung, không khoá cả màn.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Khoá cả màn chỉ khi nhập khẩu tệp lớn, kèm phần trăm tiến độ hoặc mô tả đang làm gì, và nút huỷ nếu có thể.

When Not to Use (Khi không dùng):
- [Based on Docs · Nielsen Norman Group · Skeleton Screens 101 · IBM Carbon · Loading pattern] Đang tải nội dung có hình dạng biết trước thì dùng Khung chờ tải.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Vòng 18px hoặc 32px, có thể kèm chữ.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WCAG 2.2 · 2.3.3 Animation from Interactions · MDN · prefers-reduced-motion] Quay chậm hoặc đứng yên khi người dùng bật giảm chuyển động, khi đứng yên phải kèm chữ «Đang tải…».
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Khi thanh chạy hiện, dữ liệu cũ vẫn hiện mờ đi cho tới khi có dữ liệu mới.

Do (Nên):
- [Verified · AppSpinner.jsx] Truyền `text` khi cần hiện chữ cạnh vòng xoay, không có chữ thì `label` làm nhãn cho trình đọc màn hình.
- [Verified · AppSpinner.jsx] Chọn cỡ `md` 18px cho vòng nằm trong dòng chữ, `lg` 32px cho vùng lớn.

Don't (Không nên):
- [Based on Docs · IBM Carbon · Loading · Atlassian Design System · Spinner] Không đặt nhiều vòng xoay trên 1 màn.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · HeroUI Spinner] role status, có nhãn «Đang tải».

Lớp CSS:
- `.app-spinner` · biến thể: — · trạng thái: `.is-lg`
- `.app-spinner-ring` · biến thể: — · trạng thái: —

Thuộc tính `AppSpinner`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `text` | string | — | Chữ hiện cạnh vòng xoay, có giá trị thì không dùng `label`. |
| `size` | 'md' \| 'lg' | `'md'` | Cỡ vòng xoay: `md` 18px hoặc `lg` 32px. |
| `label` | string | `'Đang tải'` | Nhãn cho trình đọc màn hình, chỉ dùng khi không có `text`. |

### Khung chờ tải (`skeleton`)

- Component: `AppSkeleton` (src/components/app/AppSkeleton.jsx)

```jsx
<AppSkeleton lines={4} />  // giữ đúng hình nội dung sắp hiện
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Skeleton] Giữ chỗ đúng hình nội dung sắp hiện để màn không nhảy.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Dùng khi tải lần đầu 1 màn hoặc 1 thẻ.

When Not to Use (Khi không dùng):
- [Based on Docs · IBM Carbon · Loading pattern] Thao tác lưu, gửi thì dùng trạng thái nút đang xử lý.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Không dùng vòng xoay giữa màn trắng thay cho khung chờ tải.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · AppSkeleton CSS app-shimmer · ngoại lệ đã chốt trong TrangNT5_UIUX_Rules.md (QD-407 D12)] Các dòng xám có vệt sáng chạy qua, dòng cuối ngắn 60%.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WCAG 2.2 · 2.3.3 Animation from Interactions · MDN · prefers-reduced-motion] Đứng yên khi người dùng bật giảm chuyển động.

Do (Nên):
- [Based on Docs · Nielsen Norman Group · Skeleton Screens 101] Số dòng gần bằng nội dung thật.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · MDN · aria-busy · MDN · ARIA status role · WCAG 2.2 · 4.1.3 Status Messages] Vùng đang tải đặt aria-busy=true, kèm 1 vùng role status đọc «Đang tải…», các khối xám đặt aria-hidden.

UX Writing (Cách viết chữ):
- [Verified · AppSkeleton.jsx] Nhãn mặc định cho trình đọc màn hình là «Đang tải nội dung», đổi qua prop `label`.

Lớp CSS:
- `.app-skeleton` · biến thể: — · trạng thái: —
- `.app-skeleton-line` · biến thể: — · trạng thái: —

Thuộc tính `AppSkeleton`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `lines` | number | `3` | Số dòng giữ chỗ, từ 2 dòng trở lên thì dòng cuối ngắn 60%. |
| `label` | string | `'Đang tải nội dung'` | Nhãn cho trình đọc màn hình. |

### Trạng thái rỗng và lỗi (`empty-states`)

- Component: `AppEmptyState` (src/components/app/AppEmptyState.jsx)

```jsx
<AppEmptyState kind="empty" text={msg('I001-48', 'quầy tiếp đón', 'Tạo mới')} action={<AppButtonWithIcon className="btn btn-primary" iconRaw={…}>Tạo mới</AppButtonWithIcon>} />
```

Quy tắc:
- QD-401
- UX-G8: Dòng rỗng của MỌI bảng cùng `1` khuôn — *(mở rộng 09/10/2026 theo D32 A, nguyên văn: «D32 áp dụng hết»)* áp cả bảng trong tab màn Chi tiết, Sửa *(Bàn, Suất riêng, Tình hình sử dụng; riêng Lịch sử thao tác từ 19/10/2026 là dạng tiến trình `HistoryTable.jsx` theo PM2 `QD-420` ⑧, rỗng hiện `1` mục `li.tl-empty` cùng câu `I001-27`)*, không khung nét đứt hay chữ tự gõ «Không có dữ liệu» — component `components/app/EmptyRow.jsx`: màn chưa có bản ghi nào ⇒ `I001-27` *«Chưa có {đối tượng} nào»* · có bản ghi mà lọc không ra ⇒ `I001-28` · cùng màu chữ, cỡ chữ, chiều cao, đầu bảng vẫn hiện · chữ nằm giữa PHẦN KHUNG ĐANG NHÌN THẤY, không giữa cả bảng *(bảng nhiều cột rộng hơn khung thì chữ không bị đẩy lệch phải)*. Nguyên văn: *"Ơ hay cùng trường hợp không có data mà 3 màn hình khác nhau 1. Câu hiển thị mesage khác nhau 2. Có cái thì mở cả Header có cái thì không 3. Có cái text đen, cais text xám"* · *"câu này cho đồng bộ đi"*

When to Use (Khi dùng):
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái rỗng] Chưa có dữ liệu bao giờ: câu giải thích kèm nút tạo mới.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái rỗng] Không có quyền xem: nói rõ thiếu quyền gì và liên hệ ai, không hiện bảng rỗng.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái rỗng] Tải lỗi: thông báo lỗi kèm nút thử lại, không để trắng màn.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái rỗng] Bản ghi đã bị xóa: «Bản ghi không còn tồn tại hoặc đã bị xóa» kèm nút quay lại danh sách.

When Not to Use (Khi không dùng):
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái rỗng] Không dùng chung 1 câu cho chưa có dữ liệu và lọc không ra kết quả.

Anatomy (Cấu tạo):
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái rỗng] Câu giải thích, nút hành động tiếp theo như tạo mới, xóa lọc, thử lại hoặc quay lại danh sách.
- [Based on Docs · PM1 DS › Bộ biểu tượng › Thông số] Icon trạng thái rỗng cỡ 20 tới 24px.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái rỗng] Chưa có dữ liệu, lọc không ra, không có quyền, tải lỗi, bản ghi đã bị xóa.

Do (Nên):
- [Verified · UX-M1 · AppEmptyState.jsx] Gọi câu theo mã qua `msg` rồi truyền vào `text`, không gõ cứng câu.
- [Verified · UX-L14] Màn chưa có dữ liệu cần cài đặt trước thì dùng `SetupHint` với `I001-94` kèm link màn cài đặt.

Don't (Không nên):
- [Verified · UX-G8 · AppEmptyState.jsx] Không dùng `AppEmptyState` cho bảng lọc hoặc tìm không ra, bảng dùng `EmptyRow` với `I001-28`.
- [Verified · UX-G8] Không vẽ khung nét đứt hay gõ chữ «Không có dữ liệu» cho bảng rỗng.

Accessibility (Truy cập và bàn phím):
- [Verified · AppEmptyState.jsx] Loại `error` mang `role=alert`, icon đặt `aria-hidden`.

UX Writing (Cách viết chữ):
- [Verified · Message List I001-48] Chưa có dữ liệu kèm nút tạo dùng `I001-48` «Chưa có {0} nào — bấm «{1}» để bắt đầu».
- [Verified · Message List SE001-07] Không có quyền dùng `SE001-07` «Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên để được hỗ trợ».
- [Verified · Message List SE001-01 · catalog.jsx] Tải lỗi dùng `SE001-01` «{0} thất bại. Vui lòng thử lại» với `{0}` là `Tải dữ liệu`.
- [Verified · Message List E001-15] Bản ghi không còn dùng `E001-15` «{0} không còn tồn tại. Vui lòng tải lại danh sách».
- [Verified · PM2_MessageList §1.3 quy tắc 6] Câu trạng thái rỗng không có dấu chấm cuối câu.

Lớp CSS:
- `.btn` · biến thể: `.btn-chip` `.btn-danger` `.btn-danger-ghost` `.btn-hl` `.btn-loading-ring` `.btn-outline` `.btn-primary` · trạng thái: `:active` `:hover` `.is-primary`
- `.app-empty` · biến thể: — · trạng thái: `.is-error`
- `.app-empty-icon` · biến thể: — · trạng thái: —
- `.app-empty-text` · biến thể: — · trạng thái: —
- `.app-empty-action` · biến thể: — · trạng thái: —

Thuộc tính `AppEmptyState`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `kind` | 'empty' \| 'forbidden' \| 'error' \| 'deleted' | `'empty'` | Loại trạng thái, quyết định icon, `error` thì khối mang vai trò cảnh báo. |
| `text` | string | — | Câu hiển thị dưới icon. |
| `action` | ReactNode | — | Nút hành động hiện dưới câu, như nút tạo mới hoặc Thử lại. |

## Hộp thoại

### Hộp xác nhận theo mức rủi ro (`confirm`)

- Component: `AppModal` (src/components/app/AppModal.jsx), `DialogIcon` (src/components/app/DialogIcon.jsx), `DialogCloseButton` (src/components/app/DialogCloseButton.jsx)

```jsx
<AppModal open={…} onClose={…}>  dlg-h (DialogIcon level="danger|warn" + tiêu đề) · dlg-b (msgParts(...).body) · dlg-f (Hủy + nút hành động)
```

Quy tắc:
- UX-F4: Icon tiêu đề hộp xác nhận theo MỨC rủi ro, 1 hình chung — tròn chấm than `22px`, dựng bằng `components/app/DialogIcon.jsx`, không dùng dấu hỏi, không dùng tam giác. Đỏ `--color-err` + nút chính đỏ: thao tác không hoàn tác *(Xóa, Hủy lịch hẹn)* · Cam `--color-warn` + nút chính thường: thao tác có ảnh hưởng *(Vô hiệu hóa, Rời trang khi chưa lưu, Đổi khung giờ, Đổi quầy, Vắng mặt, Từ chối, Check-in khác ngày)* · Không icon: thao tác thường *(Kích hoạt, Duyệt, Điều chỉnh)*. *(Sửa `09/10/2026` theo bàn giao phiên Danh mục, bản cũ "dấu hỏi 20px vàng" hết hiệu lực)*
- UX-F7: Popup `2` nút theo khuôn chung `MSG-CF` — nút hủy đúng chữ `Hủy` *(riêng rời trang `MSG-CF-03`: `Ở lại trang`)* · nút OK là tên hành động thật, không `OK` `Đồng ý` `Thực hiện` · tiêu đề không dấu `?` · popup xác nhận *(có icon cạnh tiêu đề `UX-F4`, hoặc `Modal.confirm`)* tiêu đề bắt đầu `Xác nhận`, trừ danh sách ngoại lệ khai trong cổng *(`Thay đổi chưa lưu` của `MSG-CF-03`)* · hộp Xóa và Vô hiệu hóa: nội dung là CÂU HỎI `Bạn có chắc chắn muốn …?` kèm cảnh báo hậu quả *(SỬA 09/10/2026 theo PM2 `QD-350` `QD-352` — luật cũ cấm `Bạn có chắc` NGƯỢC quyết định TrangNT5, hết hiệu lực)* · nút có chữ `Xóa` phải đỏ *(danger)*
- QD-350
- QD-352

When to Use (Khi dùng):
- [Verified · PM2_MessageList §2.4] Hỏi lại trước việc khó lùi như Xóa, Vô hiệu hóa, Kích hoạt, người dùng phải chọn 1 nút.
- [Based on Docs · PM1 DS › Khuôn màn hình › Mở toàn trang, modal hay drawer?] Modal biểu mẫu dùng cho biểu mẫu ngắn dưới 8 trường và không có bảng con.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Hộp thoại xác nhận] Modal xác nhận rộng tối đa 520px, modal biểu mẫu rộng tối đa 720px, đặt giữa màn hình.

When Not to Use (Khi không dùng):
- [Verified · PM2_MessageList §2.4 quy tắc 8] Hộp chỉ báo tin, không có gì để hủy thì dùng hộp 1 nút `Đã hiểu` (`I001-26`).
- [Based on Docs · PM1 DS › Khuôn màn hình › Mở toàn trang, modal hay drawer?] Cấm modal lồng modal, cần chọn lựa phức tạp thì đổi cả luồng sang trang riêng.
- [Based on Docs · PM1 DS › Khuôn màn hình › Mở toàn trang, modal hay drawer?] Modal không đổi kích thước theo dữ liệu bên trong, đặt chiều cao cố định cho vùng nội dung và cuộn bên trong.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] `AppModal` gồm `.dlg-h` (`DialogIcon`, tiêu đề, `DialogCloseButton`), `.dlg-b` (thân), `.dlg-f` (`Hủy` và nút hành động).
- [Verified · UX-F5] Bo 12, tiêu đề 18/700, thân đệm 20px, chân căn phải, nút phụ trước nút chính sau.
- [Verified · UX-F3] Hộp xác nhận rộng 520px.
- [Verified · catalog.jsx] Cảnh báo hậu quả đặt trong khung `.eff is-warning` của thân, ví dụ `W001-15`.

Variants & States (Biến thể và trạng thái):
- [Verified · UX-F4] Đỏ: thao tác không hoàn tác (Xóa, Hủy lịch hẹn), icon đỏ và nút chính đỏ.
- [Verified · UX-F4] Cam: thao tác có ảnh hưởng (Vô hiệu hóa, Rời trang khi chưa lưu), icon cam, nút chính thường.
- [Verified · UX-F4] Không icon: thao tác thường (Kích hoạt, Duyệt, Điều chỉnh).
- [Based on Docs · PM1 DS › Chuyển động & thời lượng › Đường cong & kiểu chuyển động] Lớp phủ mờ dần, hộp phóng từ 0.97 lên 1 trong 400ms.
- [Based on Docs · PM1 DS › Khuôn màn hình › Mở toàn trang, modal hay drawer?] Vùng xem trước trong modal có đệm 2 bên, không để nội dung sát mép.

Do (Nên):
- [Verified · UX-F7] Hộp Xóa và Vô hiệu hóa: thân là câu hỏi `Bạn có chắc chắn muốn …?` kèm hậu quả.
- [Verified · UX-F6] Cùng thao tác mở ở nhiều màn thì cùng tiêu đề, thao tác trên 1 bản ghi thì kèm mã.
- [Verified · UX-M1] Lấy chữ hộp qua `msgParts('C001-…')`.

Don't (Không nên):
- [Verified · PM2_MessageList §2.4 quy tắc 5] Không dùng `OK`, `Đồng ý`, `Thực hiện`, không để trống `okText` hoặc `cancelText`.
- [Verified · UX-F7] Tiêu đề không có dấu `?`.
- [Verified · UX-F4] Không dùng icon dấu hỏi hoặc tam giác.

Accessibility (Truy cập và bàn phím):
- [Verified · AppModal.jsx] Khung có `role=dialog`, `aria-modal=true`, `aria-labelledby` trỏ tiêu đề.
- [Verified · AppModal.jsx] Escape và bấm nền để đóng, focus giữ trong popup, đóng xong trả focus về phần tử lúc mở.
- [Verified · DialogCloseButton.jsx] Nút X có `aria-label` «Đóng», icon tiêu đề có `aria-hidden`.

UX Writing (Cách viết chữ):
- [Verified · UX-F7] Tiêu đề là câu khẳng định `Xác nhận {động từ} {0}`.
- [Verified · PM2_MessageList §2.4 quy tắc 5] Nút phụ luôn `Hủy`, nút chính trùng động từ ở tiêu đề.
- [Verified · UX-E3] Thân popup chấm cuối mọi câu, kể cả câu nói hệ quả.

Lớp CSS:
- `.dlg` · biến thể: `.dlg-notify` · trạng thái: —
- `.dlg-ic` · biến thể: — · trạng thái: `.is-danger`
- `.dlg-close` · biến thể: — · trạng thái: `:hover`

Thuộc tính `AppModal`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Mã định danh gắn vào lớp phủ bọc ngoài popup. |
| `open` | boolean | — | Bật thì hiện popup và nhớ phần tử đang giữ focus, tắt thì trả focus về phần tử đó. |
| `onClose` | function | — | Gọi khi người dùng nhấn Esc hoặc bấm ra nền ngoài khung popup. |
| `labelledBy` | string | — | Mã phần tử tiêu đề, gắn vào `aria-labelledby` của khung popup để trình đọc màn hình đọc tên. |
| `dlgClassName` | string | `'dlg'` | Lớp CSS của khung popup, thêm lớp riêng như `dlg dlg-notify` để đổi giao diện. |
| `dlgStyle` | object | — | Style riêng gắn thẳng vào khung `.dlg` của popup. |
| `children` | ReactNode | — | Nội dung bên trong khung popup, thường gồm phần đầu, thân và chân. |

Thuộc tính `DialogIcon`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `level` | 'warn' \| 'danger' | `'warn'` | Mức rủi ro: `danger` thêm lớp `is-danger` cho thao tác không hoàn tác, `warn` cho thao tác có ảnh hưởng. |

Thuộc tính `DialogCloseButton`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `onClick` | function | — | Gọi khi người dùng bấm nút X. |
| `title` | string | `'Đóng'` | Chữ gợi ý hiện khi rê chuột lên nút, nhãn đọc màn hình luôn là `Đóng`. |

### Hộp Xóa lịch hẹn (`delete-appointment`)

- Component: `DeleteAppointmentDialog` (src/components/app/DeleteAppointmentDialog.jsx)

```jsx
<DeleteAppointmentDialog open={o} code={code} onClose={…} onConfirm={…} />
```

Quy tắc:
- QD-320

When to Use (Khi dùng):
- [Verified · DeleteAppointmentDialog.jsx] Xóa lịch hẹn ở Danh sách lịch hẹn và Chi tiết lịch hẹn, chỉ lịch Nháp và Từ chối duyệt được xóa.

When Not to Use (Khi không dùng):
- [Verified · listLogic.js ROW_ACTIONS_BY_STATUS] Lịch Chờ duyệt, Đã duyệt, Hoàn thành check-in không có Xóa mà dùng Hộp Hủy lịch hẹn.

Anatomy (Cấu tạo):
- [Verified · DeleteAppointmentDialog.jsx] Icon đỏ và tiêu đề, nút X, thân 1 khối `.dlg-text`, chân `Hủy` và `Xóa lịch hẹn` (đỏ đặc).
- [Verified · catalog.jsx] Props: `open`, `code`, `onClose`, `onConfirm`.

Variants & States (Biến thể và trạng thái):
- [Verified · UX-F4] Mức đỏ vì thao tác không hoàn tác.

Do (Nên):
- [Verified · DeleteAppointmentDialog.jsx] Chữ hộp lấy từ `C001-01` với `{0}` là `lịch hẹn`, `{1}` là mã lịch hẹn in đậm.
- [Verified · DeleteAppointmentDialog.jsx] Dùng chung 1 hộp cho cả Danh sách và Chi tiết.
- [Verified · DeleteAppointmentDialog.jsx] Nút đỏ đặc chỉ dùng ở bước xác nhận cuối của hành động phá hủy.

Don't (Không nên):
- [Verified · UX-M1] Không viết câu riêng trong màn, gọi theo mã.

Accessibility (Truy cập và bàn phím):
- [Verified · DeleteAppointmentDialog.jsx] Hộp chưa truyền `labelledBy` cho `AppModal` nên tiêu đề chưa nối `aria-labelledby`.
- [Based on Docs · catalog.jsx] Nên truyền `labelledBy` trỏ id tiêu đề như hộp xác nhận mẫu.

UX Writing (Cách viết chữ):
- [Verified · QD-350] Tiêu đề «Xác nhận xóa lịch hẹn {mã}», thân «Bạn có chắc chắn muốn xóa lịch hẹn {mã}? Hành động này không thể hoàn tác.»
- [Verified · DeleteAppointmentDialog.jsx] Chỉ in đậm giá trị (mã lịch hẹn).

Lớp CSS:
- `.dlg-h` · biến thể: — · trạng thái: —
- `.dlg-t` · biến thể: — · trạng thái: —
- `.dlg-b` · biến thể: — · trạng thái: —
- `.dlg-text` · biến thể: — · trạng thái: —
- `.dlg-f` · biến thể: — · trạng thái: —
- `.btn` · biến thể: `.btn-danger` `.btn-danger-ghost` `.btn-outline` `.btn-primary` · trạng thái: `:active` `:hover` `.is-primary`

Thuộc tính `DeleteAppointmentDialog`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `open` | boolean | — | Bật thì hiện hộp xác nhận xóa lịch hẹn. |
| `code` | string | — | Mã lịch hẹn ghép vào tiêu đề và câu thông báo theo mã `C001-01`, hiện chữ đậm. |
| `onClose` | function | — | Gọi khi người dùng bấm Hủy, nút X, nhấn Esc hoặc bấm ra nền. |
| `onConfirm` | function | — | Gọi khi người dùng bấm nút Xóa lịch hẹn, không truyền đối số. |

### Hộp Hủy lịch hẹn (`cancel-appointment`)

- Component: `CancelAppointmentDialog` (src/components/app/CancelAppointmentDialog.jsx)

```jsx
<CancelAppointmentDialog open={o} onClose={…} onConfirm={…} visitTimes={…} records={…} />
```

Quy tắc:
- QD-334

When to Use (Khi dùng):
- [Verified · CancelAppointmentDialog.jsx] Hủy lịch hẹn ở Danh sách lịch hẹn và Chi tiết lịch hẹn, cùng 1 thao tác thì cùng 1 hộp.

When Not to Use (Khi không dùng):
- [Verified · CancelAppointmentDialog.jsx] Không dùng ô tích «Gửi thông báo cho thân nhân», thay bằng khối người nhận thông báo.

Anatomy (Cấu tạo):
- [Verified · CancelAppointmentDialog.jsx] Icon đỏ và tiêu đề `Xác nhận hủy lịch hẹn` (`C001-14`), nút X.
- [Verified · CancelAppointmentDialog.jsx] Thân: `Lý do hủy*` (ô chọn có tìm), Lưu ý hoàn lượt (`NoteBox`), `Ghi chú*` tối đa 1000 ký tự có bộ đếm, khối người nhận thông báo.
- [Verified · CancelAppointmentDialog.jsx] Chân: `Hủy`, `Hủy và đề xuất lịch thay thế`, `Xác nhận hủy lịch hẹn` (đỏ).

Variants & States (Biến thể và trạng thái):
- [Verified · CancelAppointmentDialog.jsx] Mở hộp thì xoá lý do, ghi chú và nạp lại người nhận chuẩn.
- [Verified · CancelAppointmentDialog.jsx] Thiếu lý do: chữ đỏ `E001-02` và focus ô lý do. Thiếu ghi chú: chữ đỏ `E001-01` và focus ô ghi chú.
- [Verified · CancelAppointmentDialog.jsx] Nút `Hủy và đề xuất lịch thay thế` chỉ hiện khi lý do thuộc phía cơ sở (mã bắt đầu `CS_`).

Do (Nên):
- [Verified · CancelAppointmentDialog.jsx] Lưu ý hoàn lượt hiện với mọi lý do vì hủy luôn hoàn lượt.
- [Verified · QD-334] Nút đóng ghi `Hủy`, nút thao tác ghi `Xác nhận hủy lịch hẹn` để 2 chữ Hủy không đứng trần cạnh nhau.

Don't (Không nên):
- [Verified · CancelAppointmentDialog.jsx] Không cho chọn lý do thân nhân không đến, lý do này hệ thống tự sinh khi quá giờ hẹn.

Accessibility (Truy cập và bàn phím):
- [Verified · CancelAppointmentDialog.jsx] Lỗi đưa focus về ô đầu tiên còn thiếu.
- [Verified · CancelAppointmentDialog.jsx] Hộp chưa truyền `labelledBy` cho `AppModal` nên tiêu đề chưa nối `aria-labelledby`.

UX Writing (Cách viết chữ):
- [Verified · CancelAppointmentDialog.jsx] Placeholder ghi chú «Nhập ghi chú cho lần hủy lịch hẹn này…».
- [Verified · CancelAppointmentDialog.jsx] Lưu ý «Hệ thống sẽ hoàn lại lượt thăm gặp tuần này cho người cai nghiện».

Lớp CSS:
- `.dlg-h` · biến thể: — · trạng thái: —
- `.dlg-t` · biến thể: — · trạng thái: —
- `.dlg-b` · biến thể: — · trạng thái: —
- `.fld` · biến thể: — · trạng thái: —
- `.required-mark` · biến thể: — · trạng thái: —
- `.dlg-f` · biến thể: — · trạng thái: —
- `.ta` · biến thể: — · trạng thái: —
- `.btn` · biến thể: `.btn-danger` `.btn-danger-ghost` `.btn-outline` `.btn-primary` · trạng thái: `:active` `:hover` `.is-primary`

Thuộc tính `CancelAppointmentDialog`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `open` | boolean | — | Bật thì hiện hộp hủy lịch hẹn, mỗi lần mở xóa trắng lý do, ghi chú, lỗi và nạp lại người nhận thông báo. |
| `onClose` | function | — | Gọi khi người dùng bấm Hủy, nút X, nhấn Esc hoặc bấm ra nền. |
| `onConfirm` | function | — | Gọi khi hợp lệ, nhận object gồm `reason`, `reasonLabel`, `note`, `recipients` và `withProposal`. |
| `records` | array | `[]` | Các lịch hẹn đang hủy, dùng để nạp người nhận thông báo mặc định và kiểm thiếu người nhận. |

### Chặn rời trang khi chưa lưu (`leave-guard`)

- Component: `LeaveGuard` (src/components/app/LeaveGuard.jsx)

```jsx
const guard = useLeaveGuard(dirty, 'dlgRoiTrang')  // gắn ở màn Tạo, Sửa
```

Quy tắc:
- UX-D7: Rời trang khi đang gõ dở ở form Tạo/Sửa ⇒ hộp `Thay đổi chưa lưu` *(nút `Ở lại trang`)* — mọi đường rời: nút Quay lại, breadcrumb, menu

When to Use (Khi dùng):
- [Verified · UX-D7] Gắn ở màn Tạo, Sửa, đang gõ dở mà rời trang thì hiện hộp `Thay đổi chưa lưu`.
- [Verified · UX-D7] Canh mọi đường rời: nút Quay lại, breadcrumb, menu.

When Not to Use (Khi không dùng):
- [Verified · PM2_MessageList §3.2] Phần đang nhập lưu được ngay thì dùng hộp 3 nút `C001-10`.

Anatomy (Cấu tạo):
- [Verified · LeaveGuard.jsx] `useLeaveGuard(dirty, id)` trả `{ attempt, release, dialog }`.
- [Verified · LeaveGuard.jsx] Hộp: icon cam và tiêu đề `Thay đổi chưa lưu`, thân `C001-03`, nút `Ở lại trang` và `Rời khỏi và bỏ thay đổi`.

Variants & States (Biến thể và trạng thái):
- [Verified · LeaveGuard.jsx] Không có thay đổi: `attempt(fn)` chạy ngay. Có thay đổi: mở hộp, bấm `Rời khỏi và bỏ thay đổi` mới chạy.
- [Verified · LeaveGuard.jsx] Tải lại hoặc đóng tab: hiện hộp của trình duyệt (`beforeunload`).
- [Verified · LeaveGuard.jsx] Nút nhóm menu có danh sách con không bị chặn vì chỉ mở danh sách.

Do (Nên):
- [Verified · LeaveGuard.jsx] Bọc hàm của nút Quay lại và nút Hủy bằng `attempt(fn)`.
- [Verified · LeaveGuard.jsx] Gọi `release()` ngay trước khi màn tự chuyển trang sau khi lưu xong.
- [Verified · LeaveGuard.jsx] Đặt `dialog` ở bất kỳ đâu trong màn, `AppModal` tự đưa ra body.

Don't (Không nên):
- [Verified · UX-F7] Không đổi nút phụ thành `Hủy`, hộp rời trang dùng `Ở lại trang`.

Accessibility (Truy cập và bàn phím):
- [Verified · LeaveGuard.jsx] Hộp có `aria-labelledby` trỏ tiêu đề `{id}TieuDe`.

UX Writing (Cách viết chữ):
- [Verified · PM2_MessageList §2.4 quy tắc 1] Tiêu đề `Thay đổi chưa lưu` là ngoại lệ duy nhất không bắt đầu bằng `Xác nhận`.
- [Verified · PM2_MessageList C001-03] Thân «Bạn có thay đổi chưa lưu trên trang này. Nếu rời đi, các thay đổi sẽ bị mất.»

Lớp CSS:
- `.dlg-h` · biến thể: — · trạng thái: —
- `.dlg-t` · biến thể: — · trạng thái: —
- `.dlg-b` · biến thể: — · trạng thái: —
- `.dlg-f` · biến thể: — · trạng thái: —
- `.btn` · biến thể: `.btn-danger` `.btn-danger-ghost` `.btn-outline` `.btn-primary` · trạng thái: `:active` `:hover` `.is-primary`

### Ngăn kéo bên phải (`drawer`)

- Component: `AppDrawer` (src/components/app/AppDrawer.jsx)

```jsx
<AppDrawer open={o} title="…" onClose={…} footer={<…nút…/>}>…</AppDrawer>  // nút X DialogCloseButton · Esc đóng
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Drawer] Xem hoặc sửa nhanh mà không rời màn hiện tại.
- [Based on Docs · Material Design 3 · Side sheets · Atlassian Design System · Drawer] Xem nhanh 1 bản ghi từ màn danh sách.
- [Based on Docs · PM1 DS › Khuôn màn hình › Mở toàn trang, modal hay drawer?] Mở trang riêng khi biểu mẫu trên 8 trường, có tab hoặc có bảng con bên trong.
- [Based on Docs · PM1 DS › Khuôn màn hình › Mở toàn trang, modal hay drawer?] Sửa tại chỗ chỉ khi có 1 trường giá trị đơn giản, ví dụ đổi thứ tự hiển thị.

When Not to Use (Khi không dùng):
- [Verified · UX-F7] Xác nhận thao tác rủi ro thì dùng Hộp xác nhận.
- [Based on Docs · Atlassian Design System · Drawer · Material Design 3 · Side sheets] Form dài nhiều bước thì mở màn Tạo/Sửa.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Verified · UX-L1] Nút X dùng chung DialogCloseButton.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WAI-ARIA APG · Dialog (Modal) Pattern · Material Design 3 · Side sheets] Mở · đóng bằng nút X, Esc hoặc bấm nền tối.
- [Based on Docs · PM1 DS › Chuyển động & thời lượng › Đường cong & kiểu chuyển động] Drawer trượt ngang từ mép phải trong 400ms với đường cong ease-out.

Do (Nên):
- [Verified · pm1_pm2_diff M15 · CSS clamp(360px,40vw,560px) (QD-407 D9)] Rộng 360–560px theo bề ngang màn hình, nút ở chân ngăn kéo.

Don't (Không nên):
- [Based on Docs · Atlassian Design System · Drawer · Material Design 3 · Side sheets] Không mở ngăn kéo chồng ngăn kéo.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG · Dialog (Modal) Pattern · MDN · aria-modal] role dialog, aria-modal, tiêu đề làm nhãn.
- [Based on Docs · WAI-ARIA APG › Dialog (Modal)] Mở ngăn kéo thì tiêu điểm vào ngăn kéo; Tab chỉ đi bên trong; Esc đóng.

UX Writing (Cách viết chữ):
- [Verified · UX-F6 (QD-407 D9)] Tiêu đề nêu việc và mã đối tượng, nối bằng khoảng trắng, vd «Xác nhận duyệt lịch hẹn LH-2026-0917».

Lớp CSS:
- `.app-drawer-mask` · biến thể: — · trạng thái: —
- `.app-drawer` · biến thể: — · trạng thái: —
- `.app-drawer-head` · biến thể: — · trạng thái: —
- `.app-drawer-body` · biến thể: — · trạng thái: —
- `.app-drawer-foot` · biến thể: — · trạng thái: —

Thuộc tính `AppDrawer`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `open` | boolean | — | Bật thì hiện ngăn kéo bên phải, tắt thì không vẽ gì. |
| `title` | ReactNode | — | Tiêu đề ở đầu ngăn kéo, cũng là tên đọc màn hình của ngăn kéo. |
| `onClose` | function | — | Gọi khi người dùng bấm nút X, nhấn Esc hoặc bấm ra nền tối. |
| `children` | ReactNode | — | Nội dung thân ngăn kéo. |
| `footer` | ReactNode | — | Nội dung chân ngăn kéo, thường là các nút, bỏ trống thì không có phần chân. |
| `id` | string | — | Mã định danh của ngăn kéo, tiêu đề lấy mã này thêm hậu tố `Title`, bỏ trống thì dùng `appDrawerTitle`. |

### Hộp nổi (`popover`)

- Component: `AppPopover` (src/components/app/AppPopover.jsx)

```jsx
<AppPopover triggerLabel="…" title="…">nội dung</AppPopover>  // khác Tooltip: bấm mới mở, có tiêu đề
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Popover] Giải thích ngắn hoặc vài thao tác phụ, bấm mới mở.

When Not to Use (Khi không dùng):
- [Verified · UX-C3] Chỉ cần hiện đủ chữ bị cắt thì dùng Tooltip.
- [Based on Docs · IBM Carbon · Popover] Nội dung dài hoặc có form thì dùng Ngăn kéo.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Based on Docs · IBM Carbon · Toggletip] Nút mở + hộp nổi có nội dung, tiêu đề là tuỳ chọn.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WCAG 2.2 · 1.4.13 Content on Hover or Focus · IBM Carbon · Popover] Đóng khi bấm ra ngoài hoặc Esc.

Do (Nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Nội dung 1–3 câu.

Don't (Không nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Không đặt thao tác lưu dữ liệu trong hộp nổi.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WAI-ARIA APG · Disclosure Pattern · MDN · aria-expanded] Nút có aria-expanded và aria-controls trỏ tới hộp.
- [Based on Docs · WAI-ARIA APG › Disclosure] Enter hoặc Space trên nút mở hộp; Esc đóng và trả tiêu điểm về nút.

UX Writing (Cách viết chữ):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Tiêu đề hộp là tên quy định đang giải thích.

Lớp CSS:
- `.app-popover` · biến thể: — · trạng thái: —
- `.app-popover-panel` · biến thể: — · trạng thái: —
- `.form-btn` · biến thể: `.form-btn-danger` `.form-btn-primary` `.form-btn-success` `.form-btn-warning` · trạng thái: `:active` `:hover` `.is-outline`

Thuộc tính `AppPopover`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `triggerLabel` | ReactNode | — | Chữ trên nút mở hộp nổi, cũng làm tên đọc màn hình khi không có `title`. |
| `triggerIcon` | string | — | Tên icon trong bộ `lib/icons` hiện trên nút mở hộp nổi. |
| `title` | ReactNode | — | Tiêu đề in đầu hộp nổi, bỏ trống thì không có dòng tiêu đề. |
| `children` | ReactNode | — | Nội dung bên trong hộp nổi. |
| `id` | string | `'appPopover'` | Mã định danh của hộp nổi, nút mở trỏ tới qua `aria-controls`. |

### Nhập khẩu Excel (`import-excel`)

- Component: `AppImportExcel` (src/components/app/AppImportExcel.jsx), `AppModal` (src/components/app/AppModal.jsx)

```jsx
<AppModal open={o} onClose={…} dlgStyle={{ width: 720 }}>
  <AppImportExcel labels={{ template, templateButton, pick, dropHint, preview, errorCount, errorColumn }} fileName={f} percent={p} columns={cols} rows={preview} onTemplate={…} onPick={…} />
</AppModal>  // nút Nhập dữ liệu chỉ bấm được khi 0 dòng lỗi
```

Quy tắc:
- QD-401

When to Use (Khi dùng):
- [Based on Docs · PM1 DS › Kết xuất & tệp › Tải tệp lên] Nhập dữ liệu hàng loạt từ tệp Excel.

When Not to Use (Khi không dùng):
- [Based on Docs · PM1 DS › Kết xuất & tệp › Tải tệp lên] Không ghi dữ liệu trước khi người dùng xem bảng xem trước và báo cáo lỗi.

Anatomy (Cấu tạo):
- [Based on Docs · PM1 DS › Kết xuất & tệp › Tải tệp lên] Liên kết tải mẫu, ô tải tệp lên, bảng xem trước, danh sách lỗi theo dòng, nút ghi dữ liệu.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · PM1 DS › Kết xuất & tệp › Tải tệp lên] Có mẫu tải xuống, bảng xem trước và báo cáo lỗi theo từng dòng trước khi ghi dữ liệu.
- [Based on Docs · PM1 DS › Phản hồi & lớp phủ › Trạng thái tải] Tệp lớn thì khoá cả màn kèm phần trăm tiến độ hoặc mô tả đang làm gì, và nút huỷ nếu có thể.
- [Based on Docs · PM1 DS › Chọn ngày & giờ] Ngày giờ nhập khẩu xử lý an toàn múi giờ UTC+7, không để lệch 1 ngày.
- [Based on Docs · PM1 DS › Kết xuất & tệp › Tải tệp lên] Tệp vượt 10MB thì chặn, báo lỗi rõ, không lưu.

Do (Nên):
- [Verified · AppImportExcel.jsx · catalog.jsx] Đặt `AppImportExcel` trong `AppModal` rộng 720px.
- [Verified · AppImportExcel.jsx] Nút Nhập dữ liệu ở chân hộp thoại chỉ bấm được khi 0 dòng lỗi.
- [Verified · AppImportExcel.jsx] Truyền mọi chữ hiển thị qua `labels`, `{0}` trong `errorCount` thay bằng số dòng lỗi.

Don't (Không nên):
- [Verified · AppImportExcel.jsx] Không nhận tệp khác `.xlsx`, ô chọn tệp chỉ lọc `accept=.xlsx`.

Accessibility (Truy cập và bàn phím):
- [Verified · AppImportExcel.jsx] Thanh tiến độ mang `role=progressbar`, `aria-label` «Tiến độ nhập tệp Excel» kèm `aria-valuenow`, min, max.
- [Verified · AppPm1Controls.css] Vùng thả tệp đổi viền sang màu chủ đạo khi ô chọn tệp bên trong được focus.

UX Writing (Cách viết chữ):
- [Verified · Message List E001-20] Sai định dạng tệp dùng `E001-20` «Chỉ chấp nhận tệp {0}».
- [Verified · Message List E001-14] Tệp vượt dung lượng dùng `E001-14` «Tệp vượt quá {0}», ví dụ `10MB`.
- [Verified · Message List I001-45] Nhập xong báo bằng toast `I001-45` «Đã nhập {0} bản ghi».

Lớp CSS:
- `.app-import` · biến thể: — · trạng thái: —
- `.app-import-step` · biến thể: — · trạng thái: —
- `.app-import-no` · biến thể: — · trạng thái: —
- `.app-import-drop` · biến thể: — · trạng thái: `:focus-within` `:hover`
- `.app-import-drop-icon` · biến thể: — · trạng thái: —
- `.app-import-progress` · biến thể: — · trạng thái: —
- `.app-import-table` · biến thể: — · trạng thái: —
- `.form-btn` · biến thể: `.form-btn-danger` `.form-btn-primary` `.form-btn-success` `.form-btn-warning` · trạng thái: `:active` `:hover` `.is-outline`

Thuộc tính `AppImportExcel`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `labels` | object | — | Chữ hiển thị gồm `template`, `templateButton`, `pick`, `dropHint`, `preview`, `errorCount`, `errorColumn`, trong đó `{0}` thay bằng số dòng lỗi. |
| `fileName` | string | — | Tên tệp đã chọn, hiện trong vùng chọn tệp thay cho chữ gợi ý. |
| `percent` | number | — | Tiến độ đọc tệp từ 0 tới 100, chỉ hiện thanh tiến độ khi là số. |
| `columns` | array | `[]` | Các cột bảng xem trước, mỗi cột gồm `key` và `title`, luôn thêm cột lỗi ở cuối. |
| `rows` | array | `[]` | Các dòng xem trước, dòng có trường `error` tô đỏ, mảng rỗng thì ẩn bước 3. |
| `onTemplate` | function | — | Gọi khi người dùng bấm nút tải tệp mẫu. |
| `onPick` | function | — | Gọi khi người dùng chọn tệp, nhận đối tượng tệp đầu tiên. |

Thuộc tính `AppModal`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `id` | string | — | Mã định danh gắn vào lớp phủ bọc ngoài popup. |
| `open` | boolean | — | Bật thì hiện popup và nhớ phần tử đang giữ focus, tắt thì trả focus về phần tử đó. |
| `onClose` | function | — | Gọi khi người dùng nhấn Esc hoặc bấm ra nền ngoài khung popup. |
| `labelledBy` | string | — | Mã phần tử tiêu đề, gắn vào `aria-labelledby` của khung popup để trình đọc màn hình đọc tên. |
| `dlgClassName` | string | `'dlg'` | Lớp CSS của khung popup, thêm lớp riêng như `dlg dlg-notify` để đổi giao diện. |
| `dlgStyle` | object | — | Style riêng gắn thẳng vào khung `.dlg` của popup. |
| `children` | ReactNode | — | Nội dung bên trong khung popup, thường gồm phần đầu, thân và chân. |

## Điều hướng và khung trang

### Khung trang: đầu trang · menu ngang · sidebar · breadcrumb (`shell`)

- Component: `AppLayout` (src/layout/AppLayout.jsx)

```jsx
<AppLayout menu={L.menu} sidebar={L.sidebar} breadcrumb={[…]}>…</AppLayout>  // L = operationsLayout('Tên mục') · menuConfig.js
```

Quy tắc:
- UX-I1: Màn đã dựng ⇒ menu và thanh bên bấm vào được ngay, kể cả mục đang sáng

When to Use (Khi dùng):
- [Verified · catalog.jsx] Khung chung mọi màn Prototype: đầu trang, menu ngang, sidebar, breadcrumb.
- [Based on Docs · PM1 DS › Vỏ ứng dụng] Đệm vùng nội dung 24px, giảm còn 16px dưới 768px.
- [Based on Docs · PM1 DS › Vỏ ứng dụng] Bề rộng nội dung không giới hạn để bảng nghiệp vụ tận dụng hết màn rộng.

Anatomy (Cấu tạo):
- [Verified · AppLayout.jsx] Header 56px nền đỏ thương hiệu, menu ngang kiểu PM1, sidebar của nhóm đang mở, hàng breadcrumb, rồi `main.main` chứa `section.shell`.
- [Verified · catalog.jsx] Khai bằng `<AppLayout menu sidebar breadcrumb>`, cấu hình lấy ở `menuConfig.js`.
- [Verified · Playbook_List §1 khối 1] Breadcrumb `Tổng quan` › nhóm menu › tên màn, cấp cuối đậm và không bấm được.
- [Verified · catalog.jsx] Góc tài khoản có menu đổi tài khoản.

Variants & States (Biến thể và trạng thái):
- [Verified · AppLayout.jsx] Sidebar mở rộng hoặc thu gọn bằng nút `Thu gọn`, `Mở rộng`.
- [Verified · AppLayout.jsx] Mục đang mở sáng lên và có chấm.
- [Verified · AppLayout.jsx] Mục vai hiện tại không được mở thì ẩn, nhóm có mọi mục bị ẩn thì ẩn cả nhóm.
- [Based on Docs · PM1 DS › Vỏ ứng dụng] Sidebar rộng 240px, thu gọn còn 72px chỉ hiện icon.
- [Based on Docs · PM1 DS › Vỏ ứng dụng] Header cao 56px, dính trên cùng khi cuộn.
- [Based on Docs · PM1 DS › Điều hướng, tab & menu] Mục cha tự mở khi mục con đang được chọn.
- [Based on Docs · PM1 DS › Điều hướng, tab & menu] Menu con của sidebar mở sau 150ms rê vào, đóng sau 300ms rời chuột.

Do (Nên):
- [Verified · UX-I1] Màn đã dựng thì menu và thanh bên bấm vào được ngay, kể cả mục đang sáng.
- [Verified · UX-I1] Mục chưa có màn báo «Chức năng đang phát triển».
- [Verified · UX-I3] Đường dẫn URL tiếng Việt theo PM1, ví dụ `/lich-hen/tham-gap-truc-tiep/`.

Don't (Không nên):
- [Verified · UX-I3] Không đổi route sang tiếng Anh.

Accessibility (Truy cập và bàn phím):
- [Verified · AppLayout.jsx] Sidebar là thẻ `nav` có `aria-label` bằng tên nhóm.
- [Verified · UX-C3] Sidebar thu gọn thì tooltip hiện tên mục.
- [Verified · AppLayout.jsx · base.css (QD-410 D24 D27)] Mục breadcrumb, sidebar và menu thả xuống là thẻ `a` có `href` nên Tab tới được, Tab vào nhóm menu thì menu tự mở, mục đang mở gắn `aria-current=page`.

UX Writing (Cách viết chữ):
- [Verified · Playbook_CreateEdit §1 khối 1] Breadcrumb màn Sửa thêm cấp `Chỉnh sửa {đối tượng}`.
- [Based on Docs · PM1 DS › Điều hướng, tab & menu] Breadcrumb 13px, luôn bắt đầu từ tên phân hệ, cấp cuối không bấm được.

Lớp CSS:
- `.bc` · biến thể: — · trạng thái: —
- `.nav` · biến thể: — · trạng thái: —
- `.nv` · biến thể: — · trạng thái: `:focus-within` `:hover`
- `.sb` · biến thể: `.min` · trạng thái: —
- `.sb-nav` · biến thể: — · trạng thái: —
- `.sb-g` · biến thể: — · trạng thái: —
- `.sb-i` · biến thể: — · trạng thái: `:hover` `.on`
- `.sb-dot` · biến thể: — · trạng thái: —

Thuộc tính `AppLayout`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `cluster` | string | — | Khóa cụm trong `menuConfig`, dùng lấy menu và sidebar mặc định khi không truyền riêng. |
| `menu` | array | — | Menu ngang riêng của trang, mỗi mục gồm `icon`, `label`, `href`, `active`, `children`, bỏ trống thì lấy theo `cluster`. |
| `sidebar` | object | — | Sidebar riêng của trang dạng `{ group, items }`, bỏ trống thì lấy theo `cluster`. |
| `breadcrumb` | array | — | Các mục đường dẫn dạng `{ label, href, onClick }`, mục cuối là màn hiện tại in đậm. |
| `descriptions` | object | `{}` | Chữ gợi ý theo nhãn nút, nạp vào tooltip một lần lúc dựng khung. |
| `children` | ReactNode | — | Nội dung chính của trang, đặt trong vùng `.shell`. |
| `overlays` | ReactNode | — | Các popup vẽ sau khung trang. |
| `brand` | object | — | Nhận diện riêng dạng `{ logo, alt, title, sub }`, bỏ trống thì dùng quốc huy và tên phần mềm. |
| `fixedAccount` | object | — | Tài khoản cố định dạng `{ initials, name, role }`, truyền vào thì ẩn menu đổi tài khoản. |

### Breadcrumb (đường dẫn trang) (`breadcrumb`)

- Component: `Breadcrumb`

```jsx
import { Breadcrumb } from '@/layout/AppLayout'
<Breadcrumb items={[{ label, href }, …, { label: 'Màn hiện tại' }]} />  // AppLayout tự vẽ từ prop breadcrumb — mục cuối chữ đậm, không bấm
```

Quy tắc:
- UX-I1: Màn đã dựng ⇒ menu và thanh bên bấm vào được ngay, kể cả mục đang sáng
- QD-400

When to Use (Khi dùng):
- [Verified · UX-I1] Mọi màn trong khung trang: cho biết đang ở đâu và quay lên cấp trên.
- [Verified · QD-400] Mẫu riêng theo góp ý Designer — gọi đúng component Breadcrumb của khung trang.

When Not to Use (Khi không dùng):
- [Based on Docs · Nielsen Norman Group · Breadcrumbs: 11 Design Guidelines · IBM Carbon · Breadcrumb] Không dùng breadcrumb làm nút đổi chế độ xem hay bộ lọc.

Anatomy (Cấu tạo):
- [Based on Docs · Nielsen Norman Group · Breadcrumbs: 11 Design Guidelines · WAI-ARIA APG · Breadcrumb Pattern] Các cấp trên bấm được, ngăn bằng mũi tên · cấp cuối là màn hiện tại, chữ đậm, không bấm.
- [Verified · AppointmentDetail.jsx · AppointmentList.jsx · formConfig.js · ReceptionDeskDetail.jsx · ReceptionDeskCreate.jsx] Đủ tầng: `Tổng quan` › nhóm menu › màn danh sách › màn con. Màn có URL con của danh sách (Tạo, Chi tiết, Chỉnh sửa, chế độ xem riêng như Lịch theo buồng) phải thêm 1 cấp tên màn, cấp danh sách thành liên kết quay về.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · WCAG 2.2 · 2.4.7 Focus Visible · IBM Carbon · Breadcrumb] Thường · rê chuột (chữ xanh) · có viền khi chọn bằng bàn phím.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Đang gõ dở mà bấm breadcrumb thì hiện hộp «Thay đổi chưa lưu» (useLeaveGuard).

Do (Nên):
- [Based on Docs · Nielsen Norman Group · Breadcrumbs: 11 Design Guidelines] Tên cấp khớp tên mục menu và tên màn.

Don't (Không nên):
- [Verified · TrangNT5 bắt lỗi màn Lịch theo buồng 20/10/2026] Không để màn con dùng chung breadcrumb của màn danh sách — vào thêm 1 lớp màn thì breadcrumb phải thêm 1 cấp.
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Không tự dựng thanh breadcrumb riêng trong màn — khai prop breadcrumb của AppLayout.

Accessibility (Truy cập và bàn phím):
- [Verified · AppLayout.jsx (QD-410 D24)] Mục cấp trên là thẻ `a` có `href` nên Tab tới được và Enter mở được.
- [Verified · AppLayout.jsx (QD-410 D24)] Thanh là vùng `nav` có `aria-label=Breadcrumb`, cấp cuối gắn `aria-current=page`.
- [Based on Docs · WAI-ARIA APG Breadcrumb] Thanh breadcrumb nằm trong vùng `nav` có `aria-label` hoặc `aria-labelledby`.
- [Based on Docs · WAI-ARIA APG Breadcrumb] Cấp cuối là liên kết thì đặt `aria-current=page`, không phải liên kết thì không bắt buộc.

UX Writing (Cách viết chữ):
- [Verified · AppointmentDetail.jsx · Playbook_CreateEdit dòng 29 · UX-I2 (QD-407 D9)] Cấp cuối là tên màn, không kèm mã bản ghi, vd «Chi tiết lịch hẹn». Mã bản ghi nằm ở tiêu đề màn.

### Thanh bước (`stepper`)


```jsx
<div className="stepper"> … <div className="step is-current"><span className="step-number">2</span><span className="step-title">…</span></div> … </div>
<div className={'card' + (bước !== bước đang mở ? ' is-hidden-block' : '')}> · khối theo luồng: ' is-hidden'
```

Quy tắc:
- QD-361

When to Use (Khi dùng):
- [Verified · Playbook_CreateEdit §1 khối 3] Biểu mẫu dài thì chia bước.
- [Verified · QD-361] Tạo quầy dùng 3 bước theo thứ tự phụ thuộc: Thông tin quầy, Buồng thăm gặp, Suất riêng.

When Not to Use (Khi không dùng):
- [Verified · QD-361] Sửa và Xem quầy dùng tab thay cho thanh bước.

Anatomy (Cấu tạo):
- [Verified · catalog.jsx] `.stepper` gồm các `.step` nối bằng `.step-line`, mỗi bước có `.step-number` và `.step-title`.
- [Verified · catalog.jsx] Mỗi bước 1 khối `.card`, bước không mở ẩn bằng `is-hidden-block`, khối theo luồng ẩn bằng `is-hidden`.

Variants & States (Biến thể và trạng thái):
- [Verified · catalog.jsx] Đã xong `is-done` (số thay bằng dấu ``), đang làm `is-current`, chưa tới.
- [Based on Docs · PM1 DS › Tiến trình] Không cho bấm nhảy tới bước chưa tới, bước đã qua thì bấm quay lại được.
- [Based on Docs · PM1 DS › Tiến trình] Bước đã xong tô đặc màu thương hiệu, bước hiện tại viền và nền nhạt, bước chưa tới để xám.

Do (Nên):
- [Verified · Playbook_CreateEdit §1 khối 3] Đổi bước thì tự cuộn lên đầu.
- [Verified · Playbook_CreateEdit §1 khối 7] Chân trang: trái `Quay lại bước trước` (ẩn ở bước 1), phải `Tiếp tục`.
- [Verified · QD-361] Bước ② và ③ của Tạo quầy có «Bỏ qua, khai sau».
- [Verified · UX-D9] Lùi rồi tiến mà không đổi gì thì giữ kết quả bước sau.

Don't (Không nên):
- [Verified · UX-C5] `Tiếp tục` bấm không có phản hồi là sai, màn không có bước sau thì bỏ nút.

Accessibility (Truy cập và bàn phím):
- [Verified · đo Prototype 14/10/2026 (QD-407 D6)] Bước đang làm nên có `aria-current=step` để trình đọc màn hình biết vị trí.

UX Writing (Cách viết chữ):
- [Verified · QD-361] Tên bước ngắn theo đối tượng khai, ví dụ «Thông tin quầy», «Buồng thăm gặp», «Suất riêng».

Lớp CSS:
- `.stepper` · biến thể: `.form-footer` · trạng thái: —
- `.step` · biến thể: — · trạng thái: `:hover` `.is-current` `.is-done`
- `.step-number` · biến thể: — · trạng thái: —
- `.step-title` · biến thể: — · trạng thái: —
- `.card` · biến thể: — · trạng thái: —

### Liên kết (`link`)

- Component: `AppLink` (src/components/app/AppLink.jsx)

```jsx
<AppLink href="#/…">…</AppLink>  ·  <AppLink href="https://…" external>…</AppLink>  // thao tác đổi dữ liệu thì dùng Nút
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Link] Chuyển tới màn hoặc trang khác, nằm trong câu chữ.

When Not to Use (Khi không dùng):
- [Based on Docs · IBM Carbon · Link · WAI-ARIA APG · Link Pattern] Thao tác thay đổi dữ liệu thì dùng Nút.

Anatomy (Cấu tạo):
- [Verified · QD-399] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Based on Docs · WCAG 2.2 · 1.4.1 Use of Color · IBM Carbon · Link] Màu liên kết của hệ thống, gạch chân khi rê chuột. Liên kết nằm giữa đoạn chữ luôn gạch chân hoặc màu chênh với chữ thường từ 3:1. Mở ra ngoài có icon mũi tên.

Variants & States (Biến thể và trạng thái):
- [Based on Docs · IBM Carbon · Link · WCAG 2.2 · 2.4.7 Focus Visible] Thường · rê chuột · có viền khi chọn bằng bàn phím · khoá.

Do (Nên):
- [Verified · TrangNT5 duyệt theo gợi ý (QD-408 D21)] Liên kết ra ngoài mở tab mới và báo trước bằng icon kèm chữ «mở tab mới» cho trình đọc màn hình.

Don't (Không nên):
- [Based on Docs · GOV.UK Design System · Links · WCAG 2.2 · 2.4.4 Link Purpose (In Context)] Không dùng chữ «bấm vào đây».

Accessibility (Truy cập và bàn phím):
- [Based on Docs · WCAG 2.2 · 2.4.7 Focus Visible · MDN · aria-disabled] Có viền khi chọn bằng bàn phím; khoá thì aria-disabled.

UX Writing (Cách viết chữ):
- [Based on Docs · WCAG 2.2 · 2.4.4 Link Purpose (In Context) · GOV.UK Design System · Links] Chữ liên kết nói rõ nơi đến.

Lớp CSS:
- `.app-link` · biến thể: — · trạng thái: `:focus-visible` `:hover` `.is-disabled`

Thuộc tính `AppLink`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `href` | string | — | Địa chỉ đích của liên kết, bỏ khi liên kết bị khóa. |
| `children` | ReactNode | — | Chữ hiển thị của liên kết. |
| `external` | boolean | `false` | Bật thì mở tab mới, thêm `rel` an toàn và icon mũi tên ra ngoài. |
| `disabled` | boolean | `false` | Bật thì bỏ `href`, thêm lớp `is-disabled` và `aria-disabled` nên không bấm đi được. |
| `...rest` | object | — | thuộc tính còn lại, chuyển xuống phần tử gốc |

### Phím tắt (`kbd`)

- Component: `AppKbd` (src/components/app/AppKbd.jsx)

```jsx
<AppKbd keys={['Ctrl', 'S']} />
```

When to Use (Khi dùng):
- [Based on Docs · HeroUI Kbd] Hiện tên phím trong câu hướng dẫn.

When Not to Use (Khi không dùng):
- [Based on Docs · MDN · <kbd> element] Không dùng làm nút bấm.

Anatomy (Cấu tạo):
- [Verified · QD-406] Control bổ sung, chưa màn PM2 nào dùng — màn mới gọi thẳng component, không tự dựng lại.
- [Based on Docs · MDN · <kbd> element] Thẻ kbd viền dày đáy, nhiều phím nối bằng dấu +.

Variants & States (Biến thể và trạng thái):
- [Verified · AppKbd.jsx] Chỉ có 1 kiểu hiển thị, không có trạng thái tương tác.

Do (Nên):
- [Based on Docs · Apple Human Interface Guidelines · Keyboards · MDN · <kbd> element] Viết tên phím ngắn: Ctrl, Esc, Enter.

Don't (Không nên):
- [Verified · AppKbd.jsx] Không gõ dấu `+` vào tên phím, mỗi phím là 1 phần tử của `keys` để component tự nối.

Accessibility (Truy cập và bàn phím):
- [Based on Docs · MDN · <kbd> element] Dùng thẻ kbd để đánh dấu đúng ngữ nghĩa là phím bấm.

UX Writing (Cách viết chữ):
- [Based on Docs · Apple Human Interface Guidelines · Keyboards] Tên phím viết hoa chữ đầu theo bàn phím.

Lớp CSS:
- `.app-kbd-group` · biến thể: — · trạng thái: —
- `.app-kbd-plus` · biến thể: — · trạng thái: —
- `.app-kbd` · biến thể: — · trạng thái: —

Thuộc tính `AppKbd`:

| Thuộc tính | Kiểu | Mặc định | Mô tả |
|:---|:---|:---|:---|
| `keys` | array | `[]` | Mảng tên phím, mỗi phím vẽ trong thẻ `kbd` và nối nhau bằng dấu `+`. |

## Trạng thái theo thao tác

