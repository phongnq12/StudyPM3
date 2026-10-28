# Loại quy tắc, mức cưỡng chế, cách viết câu

Phần tra cứu của skill [`create-br`](../SKILL.md). Đọc phần lõi trước. Mọi mã trong file này là **mã minh họa** của [`vi-du-xuyen-suot.md`](../../ba-overview/reference/vi-du-xuyen-suot.md).

## 1. ĐN và HV — hai loại theo SBVR

SBVR chia quy tắc làm hai loại. Template dùng tên **ĐN — Định nghĩa** (structural rule) và **HV — Hành vi** (operative rule). Mỗi quy tắc thuộc đúng một loại; cột `Loại` của bảng quy tắc không bao giờ để trống.

**ĐN** là quy tắc đúng *theo định nghĩa của khái niệm*: phân loại, tính toán, suy ra một giá trị. Không có chuyện "vi phạm" ĐN, vì nếu hệ thống cho ra kết quả khác thì hệ thống tính sai, chứ không phải ai đó làm trái. **HV** là quy tắc quy định ai được, phải, không được làm gì; con người hoặc hệ thống ngoài có thể làm trái, nên cần một mức cưỡng chế nói hệ thống phản ứng ra sao.

Ba phép thử, dùng theo thứ tự; hai phép đầu cùng ra một kết luận là đủ.

| Phép thử | Ra ĐN khi | Ra HV khi |
|---|---|---|
| **Làm trái được không** | Không hình dung được ai làm trái — chỉ có thể tính sai | Hình dung được một người hoặc một hệ thống làm trái, ví dụ gửi yêu cầu khi đã hết lượt |
| **Hệ thống phản ứng gì** | Hệ thống **tính ra** hoặc **xếp loại ra** giá trị; không có chuyện chặn | Hệ thống **chặn, cảnh báo, hoặc cho phép ngoại lệ** |
| **Câu viết bằng động từ nào** | `là`, `được tính bằng`, `được xếp loại` | `phải`, `không được`, `chỉ được … khi` |

Ví dụ phân loại (minh họa):

| Câu | Loại | Vì sao |
|---|---|---|
| Lượt hẹn đã dùng **là** lịch hẹn ở trạng thái Chờ duyệt, Đã duyệt, Đã đến hẹn, hoặc Đã hủy muộn (`BR-A02`) | ĐN | Khái niệm "lượt đã dùng" được định nghĩa bằng trạng thái; hệ thống đếm theo đó |
| Số lượt còn lại **được tính bằng** `CH-01` trừ số lượt hẹn đã dùng trong tuần | ĐN | Công thức. Giá trị luôn đúng theo công thức, không "vi phạm" được |
| Mỗi khách **chỉ được** đặt tối đa `CH-01` lịch hẹn mỗi tuần | HV | Có thể có người cố đặt vượt quá mức; hệ thống phải chặn |
| Khách hủy lịch trước giờ hẹn ít nhất `CH-02` giờ **thì** lượt được trả lại (`BR-A03`) | ĐN | **Quy tắc suy ra**: hệ thống *tính ra* việc trả lượt từ thời điểm hủy; không ai "làm trái" được, chỉ có hệ thống tính sai. Câu có chữ "thì" nghe như nghĩa vụ nên dễ nhầm sang HV — dùng phép thử bổ sung ngay dưới bảng. Có tham số `CH-02` nên mức ⚙️ |
| Nhân viên tiếp đón **không được** duyệt lịch hẹn do chính mình đặt hộ khách (`BR-A04`) | HV | Hình dung được nhân viên tiếp đón cố duyệt; hệ thống phải chặn |

**Phép thử bổ sung cho câu có "thì"** (lựa chọn của skill, ngoài ba phép trên): hỏi *"nếu kết quả khác đi, đó là ai làm trái hay hệ thống tính sai?"*. Hệ quả là một **giá trị hoặc trạng thái do hệ thống tính ra** (lượt được trả lại, mức ưu tiên, trạng thái suy) và không ai có thể làm trái → ĐN. Hệ quả là một **nghĩa vụ hay thao tác của người** (phải báo, phải duyệt) → HV.

Hai ràng buộc suy ra từ định nghĩa, để chọn mức cho đúng:

| Ràng buộc | Lý do |
|---|---|
| ĐN chỉ mang 🔒, ⚙️ hoặc ❓ | 🔑 là mở ngoại lệ, ⚠️ là cho đi tiếp khi vi phạm; ĐN không có vi phạm để mở hay cho đi tiếp. ĐN mà tham số hóa (công thức có ngưỡng) là ⚙️ |
| Ô đang phân vân ĐN hay HV thì chọn **HV** và ghi ❓ vào `Q-BR…` | HV bắt buộc phải có mức và testcase âm — nên phân vân là tín hiệu cần BA chốt, không phải chỗ để đoán |

**Phân biệt ĐN với thuật ngữ.** Thuật ngữ ở BRD mục 5 hoặc Quy trình mục 1.1 giải nghĩa một từ cho người đọc. Một câu `X là …` chỉ thành ĐN khi hệ thống *dùng* nó để phân loại hoặc tính; nếu chỉ để người đọc hiểu từ thì thuộc thuật ngữ, không cần mã BR. Một câu `X là …` chỉ lặp lại kiểu dữ liệu hay đơn vị của một trường (ví dụ "số tiền tính bằng đồng") thì thuộc ERD cột Ràng buộc, không phải BR — trừ khi quy ước ấy có căn cứ pháp lý và chạy qua nhiều thực thể (làm tròn tiền theo văn bản chẳng hạn).

## 2. Năm mức cưỡng chế

Đây là **nơi định nghĩa duy nhất** của năm mức; template mục 1.3 và `00_quy_uoc_chung` mục 5 chỉ chép ký hiệu, `SKILL.md` chỉ trỏ về đây. Phần này nói nghĩa, **cách chọn** và **hệ quả cho dev, QC**. Mỗi quy tắc đúng một mức.

**Nghĩa của 🔒** *(đã chốt — [`00_quy_uoc_chung.md`](../../../../2-ba-overview/templates/00_quy_uoc_chung.md) mục 5)*. Template gọi 🔒 là "Luật định cứng". Skill mở rộng thành **cưỡng chế cứng**: hệ thống chặn, không tham số nào, không ai bỏ qua. Mức này áp cho cả **luật, quy chế** *và* **quyết định nghiệp vụ `D-xx` mà BA đã chốt là bất biến** — một quy tắc trung tâm tự đặt mà đã được BA chốt thì cứng không kém điều luật, nên không bị đẩy sang ⚠️. ⚠️ chỉ dành cho văn bản hoặc quyết định **chỉ khuyến nghị**.

**⚙️ không phải mức SBVR thật**: template ghi "Strictly enforced theo tham số" để ánh xạ gần đúng; skill kế thừa cách ghi đó.

| Mức | SBVR (theo template) | Hệ thống làm gì khi gặp vi phạm | Cái dev phải làm | QC phải có testcase |
|---|---|---|---|---|
| 🔒 Cưỡng chế cứng (template: Luật định cứng) | Strictly enforced | Chặn. Thao tác không hoàn tất, trả lỗi nghiệp vụ. Không tham số, không vai nào vượt | Kiểm ở backend, mọi cửa ghi (kể cả import, API) | Một ca âm: bị chặn dù là vai quyền cao nhất |
| ⚙️ Cấu hình được trong khung luật | Strictly enforced theo tham số | Chặn theo giá trị `CH-xx` hiện hành; cấu hình **vượt trần luật** thì bị từ chối ngay khi lưu tham số | Đọc `CH-xx`; kiểm ràng buộc giá trị của `CH-xx`; chụp giá trị vào chứng từ nếu Quy trình mục 6 yêu cầu | Ca âm ở sát biên (`CH-xx` và `CH-xx + 1`), một ca đổi `CH-xx` rồi chạy lại, một ca cấu hình vượt trần |
| 🔑 Ngoại lệ có phê duyệt | Override by pre-authorized actor | Chặn mặc định. Người **có quyền được nêu trong quy tắc** mở ngoại lệ, **bắt buộc lý do**, ghi nhật ký người mở, thời điểm, lý do | Thêm đường mở ngoại lệ, nhật ký; kiểm quyền người mở | Hai ca: không có quyền thì bị chặn; có quyền thì mở được, lý do trống bị từ chối, nhật ký có đủ dòng |
| ⚠️ Cảnh báo | Guideline | Cảnh báo, **cho đi tiếp**, ghi nhật ký việc người dùng đã thấy và vẫn tiếp tục | Hiện cảnh báo, ghi nhật ký; không chặn | Cảnh báo hiện đúng điều kiện; đi tiếp được; nhật ký có dòng |
| ❓ Cần BA hoặc khách chốt | — | Chưa hiện thực cho tới khi chốt | Không code phần này | Không có testcase cho tới khi chốt |

**Với quy tắc ĐN**, mức mang nghĩa khác vì ĐN không có vi phạm để chặn:

| Mức | Nghĩa với ĐN | Testcase |
|---|---|---|
| 🔒 | Định nghĩa **cố định** theo luật hoặc quyết định `D-xx` đã chốt, không tham số | Ca **tính đúng**: đầu vào → đầu ra theo định nghĩa, kể cả ca ở biên của định nghĩa. Không có ca âm "bị chặn" |
| ⚙️ | Định nghĩa **có tham số** `CH-xx` (công thức, ngưỡng) | Ca tính đúng ở sát biên `CH-xx` và `CH-xx + 1`, một ca đổi `CH-xx` rồi tính lại. Không có ca âm "bị chặn" |
| ❓ | Chưa chốt định nghĩa | Không có testcase cho tới khi chốt |

**Chọn mức bằng chuỗi câu hỏi** — hỏi lần lượt, dừng ở câu đầu tiên trả lời "có":

| # | Câu hỏi | Có thì |
|---|---|---|
| 1 | Nguồn có đủ chắc để biết đây là điều bắt buộc hay không? Nguồn chỉ gợi ý, quy tắc do người viết suy ra, hoặc là điều trung tâm tự đặt mà **chưa có `D-xx` BA đã chốt**? | ❓ |
| 2 | Văn bản nêu **rõ** người có thẩm quyền được cho phép ngoại lệ (hoặc cho miễn trong trường hợp nhất định)? | 🔑 — và ghi *ai* trong câu |
| 3 | Văn bản hoặc quyết định **chỉ khuyến nghị**, hướng dẫn, "nên" — vi phạm không bị hệ thống chặn? | ⚠️ |
| 4 | Con số, mốc, danh sách giá trị do trung tâm **được chọn** trong khung luật (có `CH-xx`)? | ⚙️ |
| 5 | Còn lại: luật hoặc quy chế cấm, bắt buộc, không cho điều chỉnh; **hoặc** quyết định `D-xx` BA đã chốt là bất biến mà hệ thống phải chặn, không ai bỏ qua | 🔒 |

Quy tắc ở mức ❓ vì chưa chắc, ngoài việc ghi vào cột, còn phải có một dòng `Q-BR…` ở Điểm cần chốt, với **đề xuất mặc định** nói rõ mức nào nên là mức thật. Điều này giữ cho BA chốt một câu hỏi, không phải đoán lại. Khi BA chốt, quy tắc **giữ mã** (xem phần lõi, mục "Mã và tên").

Lỗi hay gặp: chọn 🔒 cho điều "luôn đúng trong thực tế" mà văn bản và `D-xx` đều không nói như vậy; đẩy một bất biến đã chốt ở `D-xx` xuống ⚠️ chỉ vì nó không phải điều luật; chọn ⚙️ mà không có `CH-xx` (là con số trần); chọn 🔑 mà không nêu ai mở được; chọn ⚠️ để "cho nhẹ" một quy tắc mà văn bản dùng chữ *phải*.

## 3. RuleSpeak — mẫu câu

Template quy định năm mẫu. Chủ thể là một **khái niệm có trong từ vựng** (tác nhân của Quy trình mục 2, thực thể của ERD, thuật ngữ ở BRD mục 5) — không phải "hệ thống" trừ khi chính hệ thống là bên có nghĩa vụ.

| Mẫu | Dùng cho | Ví dụ (minh họa) |
|---|---|---|
| `{Chủ thể} phải {hành động} [khi {điều kiện}]` | HV — nghĩa vụ | Nhân viên tiếp đón phải duyệt hoặc từ chối lịch hẹn trước ngày hẹn |
| `{Chủ thể} không được {hành động} [khi {điều kiện}]` | HV — cấm | Lịch hẹn đã duyệt không được sửa số người đi cùng |
| `{Chủ thể} chỉ được {hành động} khi {điều kiện}` | HV — điều kiện cần | Khách chỉ được gửi yêu cầu đặt lịch khi còn lượt trong tuần |
| `{Khái niệm} là {định nghĩa}` | ĐN — phân loại | Lượt hẹn đã dùng là lịch hẹn ở trạng thái Chờ duyệt, Đã duyệt, Đã đến hẹn, hoặc Đã hủy muộn |
| `{Giá trị} được tính bằng {công thức}` | ĐN — tính toán | Số lượt còn lại được tính bằng `CH-01` trừ số lượt hẹn đã dùng trong tuần |

Dùng "thì" để nối điều kiện với hệ quả khi hệ quả là một giá trị hoặc một trạng thái được ghi nhận (`BR-A03` của ví dụ xuyên suốt, là ĐN suy ra); còn nghĩa vụ và cấm dùng mẫu `phải` / `không được`.

| Viết thế này | Đừng viết thế này | Vì sao |
|---|---|---|
| Khách chỉ được gửi yêu cầu đặt lịch khi còn lượt trong tuần | Nút "Gửi yêu cầu" bị ẩn khi hết lượt | Nút là giải pháp màn hình; quy tắc đúng kể cả khi gọi thẳng API |
| Lịch hẹn phải được nhân viên tiếp đón duyệt trước ngày hẹn | Sau khi khách gửi, nhân viên tiếp đón duyệt rồi hệ thống báo lại | Có trình tự "sau khi … rồi"; bước thuộc Quy trình |
| Mỗi khách chỉ được đặt tối đa `CH-01` lịch hẹn mỗi tuần | Mỗi khách chỉ được đặt tối đa 2 lịch hẹn mỗi tuần | Số cấu hình là con số trần; đổi `CH-01` thì câu sai mà không ai biết |
| Khách hủy lịch trước giờ hẹn ít nhất `CH-02` giờ thì lượt được trả lại | Khách hủy sớm thì lượt được trả lại | "Sớm" không kiểm chứng được. Ghi mốc, đơn vị, và chiều của biên |
| Lịch hẹn ở trạng thái Đã duyệt không được sửa số người đi cùng | Lịch `APPROVED` không được sửa `so_nguoi` | `00_quy_uoc_chung` mục 7: BR dùng tên tiếng Việt cho giá trị liệt kê; tên trường là của ERD và SRS |
| Nhân viên tiếp đón phải duyệt hoặc từ chối lịch | Lịch phải được duyệt | Câu bị động không nói ai có nghĩa vụ; không biết cấp quyền cho vai nào |
| Lịch hẹn chỉ được duyệt khi ngày hẹn chưa qua | Lịch hẹn không được duyệt khi ngày hẹn không còn ở phía trước | Phủ định kép khó kiểm chứng. Dùng `chỉ được … khi` |
| Khách phải xuất trình giấy tờ tùy thân hợp lệ tại cổng | Khách phải có giấy tờ hợp lệ | Từ "hợp lệ" phải được định nghĩa ở một quy tắc ĐN khác hoặc ở thuật ngữ; nếu chưa có thì ghi ❓ |

Những từ cấm trong phát biểu vì không kiểm chứng được: *nên, có thể, cần, thường, kịp thời, phù hợp, hợp lý, đầy đủ* (khi không định nghĩa "đầy đủ" là gì). Trích nguyên văn điều khoản thì giữ chữ gốc nhưng đặt trong ngoặc kép và vẫn kèm một câu RuleSpeak tương đương nếu chữ gốc không kiểm chứng được.

## 4. Có căn cứ, suy luận, chờ chốt — không trộn lẫn

Template ghi: quy tắc không có căn cứ được đánh dấu rõ là **suy luận** hoặc **chờ chốt**, không trộn lẫn. Template chưa nói đánh dấu ở đâu nên skill quy định như sau.

| Loại | Dấu hiệu | Ô `Căn cứ` ghi | Ô `Cưỡng chế` | Kèm |
|---|---|---|---|---|
| **Có căn cứ** | Một điều, khoản, điểm hoặc một mã lớp trước **nói thẳng** nội dung quy tắc | `QC01 Đ5.1` hoặc `GS-06 Làm tròn tiền` | 🔒 · ⚙️ · 🔑 · ⚠️ | — |
| **Suy luận** | Có điều khoản làm cơ sở, nhưng quy tắc là **kết luận của người viết**: ghép hai điều khoản, suy theo thứ tự, mở rộng sang trường hợp điều khoản không nêu | `**Suy luận** từ QC01 Đ5.1 + Đ7.2: <một cụm nói bước suy>` | ❓ | Một dòng `Q-BR…` với đề xuất mặc định |
| **Chờ chốt** | Không điều khoản nào, không mã lớp nào, nhưng có dấu hiệu cần quy tắc (lớp khác đang giả định ngầm, khách nhắc miệng) | AI: ❓ `[CẦN BA CHỐT] <phát biểu>`. Người đã được BA chấp nhận đề xuất: `GD-xxxx` bôi đỏ | ❓ | Một dòng `Q-BR…` |

Suy luận có thể trở thành có căn cứ khi BA hoặc khách xác nhận một cách đối chiếu được; khi đó đổi ô Căn cứ sang dẫn điều khoản **hoặc** `GD-xxxx`, bỏ chữ *Suy luận*, đổi mức thật, và sửa cột Quyết định của `Q-BR…`. Không có đường tắt "suy luận mà chắc nên ghi 🔒". Lỗi hay gặp nhất là nhìn một con số trong văn bản dành cho đối tượng này rồi áp sang đối tượng khác mà văn bản không nói.

## 5. Tách quy tắc ghép

Một mã một quy tắc, vì mọi chỗ khác dẫn mã để nói "tôi tuân theo điều này": nếu mã chứa hai nghĩa vụ thì dẫn mã không còn nói rõ đang tuân theo cái nào, và testcase âm không biết bắt vế nào.

Phép thử: **có thể một vế bị bỏ hoặc đổi trong khi vế kia còn nguyên không?** Có thì tách. Hoặc: *đếm số testcase âm độc lập* — từ hai trở lên thì tách.

| Câu | Kết luận | Cách xử lý |
|---|---|---|
| Khách phải xuất trình giấy tờ **và** nhân viên tiếp đón phải đối chiếu giấy tờ | Hai chủ thể, hai nghĩa vụ | Tách hai mã |
| Lịch phải được duyệt trước ngày hẹn **và** khách phải được báo kết quả duyệt | Hai nghĩa vụ; vế sau là bước quy trình | Giữ vế đầu là BR; vế sau về Quy trình (`LH-01 bước 4`) |
| Lịch đã duyệt không được sửa, **trừ khi** Giám đốc trung tâm cho phép | **Một** quy tắc, mức 🔑 | Giữ một mã. "Trừ khi" là ngoại lệ có phê duyệt, thể hiện bằng mức 🔑 chứ không sinh quy tắc thứ hai |
| Khách thuộc diện hạn chế thì đặt tối đa `CH-07` lịch hẹn mỗi tháng, ngược lại tối đa `CH-01` lịch hẹn mỗi tuần | Một quy tắc nhiều điều kiện | Bảng quyết định (xem `bang-quyet-dinh-dmn.md`), một mã |
| Hết lượt thì chặn gửi yêu cầu; còn không quá `CH-08` lượt thì cảnh báo | Hai mức khác nhau trong một câu | Tách: một HV 🔒 và một HV ⚠️ |
| Mỗi lịch hẹn tối đa 3 người, **tính cả** người đại diện | Một quy tắc | "Tính cả" chỉ làm rõ cách đếm, không thêm nghĩa vụ |

Quy tắc khi tách: mã cũ nếu chưa phát hành thì giữ cho vế chính, vế còn lại lấy số kế tiếp; đã phát hành thì bỏ mã cũ, cấp hai mã mới (theo mục "Mã và tên" ở phần lõi; mã chưa phát hành thì sửa tại chỗ).

## 6. Ánh xạ bảy loại của một hệ phân loại khác — chỉ để tham khảo

Một số dự án trước đã dùng bảy loại quy tắc để phân loại phụ. **Không bắt buộc**; template chỉ có ĐN và HV, và cột `Loại` vẫn chỉ ghi ĐN hoặc HV. Nếu người dùng muốn gắn nhãn phụ để lọc, ghi nhãn ở đầu cột `Nội dung` hoặc trong lưu ý thuật ngữ của mục 1.3 thì dùng bảng dưới để đổi sang ĐN/HV, không đưa thêm cột.

| Loại cũ | Ánh xạ | Ghi chú |
|---|---|---|
| Ràng buộc | HV — nếu cấm hoặc bắt buộc theo ngữ cảnh. Nếu chỉ nhìn một thuộc tính là đủ thì **không phải BR**, về ERD | Phép thử ERD ↔ BR ở `ranh-gioi-cac-lop.md` |
| Tính toán | ĐN | Công thức: `được tính bằng` |
| Điều kiện kích hoạt | HV — mẫu `chỉ được … khi` | Kích hoạt một chuyển trạng thái thì SM chỉ dẫn mã BR này ở ô Điều kiện |
| Thời hạn | HV — mẫu `phải … trước/trong …`. Mốc là `CH-xx` nếu cấu hình được | Có tác vụ nền canh hạn thì thuộc `N-xx`, BR chỉ phát biểu hạn |
| Quyền | HV nếu là **nghĩa vụ hay cấm có căn cứ** (tách nhiệm, người lập không tự duyệt). Nếu chỉ là vai nào được thao tác gì thì **không phải BR**, về ma trận lớp 5 | |
| Suy diễn | ĐN — phân loại, suy ra giá trị theo định nghĩa | **Không lẫn** với "quy tắc suy luận" ở mục 4 của file này: hai thứ khác nhau hoàn toàn. Suy diễn là một kiểu quy tắc *có căn cứ*; suy luận là quy tắc *chưa có căn cứ trực tiếp* |
| Lưu giữ, bảo mật | HV nếu là nghĩa vụ pháp lý ("phải lưu hồ sơ tối thiểu …"). Nếu là yêu cầu kỹ thuật (mã hóa, sao lưu) thì thuộc NFR ở BRD mục 9 | |
