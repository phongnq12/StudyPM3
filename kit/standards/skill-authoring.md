# Quy chuẩn viết và kiểm soát skill

## 1. Chọn đúng chỗ để thêm
| Muốn thêm | Đặt ở đâu | Ví dụ |
| --- | --- | --- |
| Luật áp cho mọi việc, mọi dự án | CLAUDE.md (giữ dưới ~40 dòng) | "Viết tiếng Việt" |
| Quy định chung nhiều bước dùng | standards/*.md | Quy ước ID, checklist 29148 |
| Cách làm chung cho mọi lệnh bước | standards/gate-procedure.md | Số vòng sửa, cách mở PR |
| Cách phân tích của một bước | `.claude/skills/<bước>/method.md` | Cách tách use case |
| Định nghĩa "xong" của một bước | `.claude/skills/<bước>/checklist.md` | Mỗi TR có UC |
| Khuôn tài liệu | templates/<thư mục tài liệu>/*.md (mục lục: templates/README.md) | 5-actor-usecase/use-case.md |
| Ví dụ mẫu | templates/<thư mục tài liệu>/examples/ | 2-business-process/examples/PROC-01-nghi-phep.bpmn.json |
| Một việc mới BA gõ lệnh để chạy | Skill tác vụ mới `.claude/skills/ba-<tên>/` | /ba-api |
| Kiến thức nhiều agent cần | Skill tri thức mới (`user-invocable: false`) | ba-design-system |
| Một vai trò làm việc mới | Agent mới `.claude/agents/<tên>.md` | api-analyst |
Không nhân bản nội dung: một quy định chỉ nằm ở một nơi, nơi khác trỏ tới.

## 2. Cấu trúc bắt buộc của skill tác vụ
```
.claude/skills/ba-<tên>/
├── SKILL.md        frontmatter + các bước, dưới 150 dòng
├── method.md       cách phân tích (skill bước)
└── checklist.md    bảng kiểm tra: #, kiểm tra, mức (Chặn merge / Nên sửa / Gợi ý)
```
Frontmatter bắt buộc:
```yaml
---
name: ba-<tên>
description: "<Làm gì>. <Dùng khi nào>."
argument-hint: "<bắt buộc> [tùy chọn]"
disable-model-invocation: true
metadata:
  version: 1.0.0
  owner: <người chịu trách nhiệm>
  updated: YYYY-MM-DD
---
```
Thân SKILL.md theo thứ tự: Tham số → Đọc trước → Các bước → Kiểm tra → Không được làm → Báo lại BA.

## 3. Quy tắc viết
- Mỗi bước một hành động, động từ đứng đầu. Có điều kiện thì ghi rõ "Nếu… thì…".
- Ghi rõ ai làm: phiên chính hay agent nào. Hỏi BA chỉ ở phiên chính (theo ba-questioning).
- Ghi rõ đầu ra: file nào, ở đâu, định dạng gì.
- Mỗi quy tắc trong method.md có một ví dụ ngắn đúng và sai.
- Quy tắc mới chỉ thêm khi có bằng chứng: lỗi lặp lại từ 2 lần trong review, ghi ngày và PR gốc ở cuối method.md
  (mục "Lịch sử quy tắc").

## 4. Phiên bản
- `metadata.version` theo dạng MAJOR.MINOR.PATCH:
  - PATCH: sửa câu chữ, ví dụ, không đổi kết quả.
  - MINOR: thêm quy tắc, thêm kiểm tra, thêm tham số tùy chọn.
  - MAJOR: đổi đầu ra, đổi tham số bắt buộc, đổi template — dự án đang dùng phải đọc ghi chú trước khi đồng bộ.
- Mỗi thay đổi ghi một dòng vào CHANGELOG.md của repo mẫu.
- Bộ khung gắn tag `kit-vX.Y.Z` khi phát hành; dự án ghi đang dùng bản nào trong mô tả PR của tầng dự án (G0).

## 5. Quy trình thay đổi skill
1. Mở issue (hoặc ghi chú) nêu lý do, kèm PR spec làm bằng chứng.
2. Tạo nhánh `skill/<tên>-<mô-tả>` trong repo kit (ba-kit).
3. Sửa skill; tăng `metadata.version`, `updated`; ghi CHANGELOG.md.
4. Chạy cổng máy và ca thử của skill (`cd tools/ba-verify && npm test`; lệnh kiểm skill `/ba-skill-check` làm lại ở
   đợt 6 của thiết kế). Ghi kết quả trước và sau vào mô tả PR.
5. Mở PR. Người duyệt: BA lead (theo CODEOWNERS).
6. Merge, gắn tag, đồng bộ sang dự án (README mục "Dùng cho một dự án").

## 6. Ca thử (evals)
- Mỗi skill tác vụ có ít nhất 1 ca thử trong `evals/<tên-skill>/<ca>/`: thư mục `input/` (brief + tài liệu đầu vào)
  và `expected.md` (những điều đầu ra phải có và không được có, viết dạng kiểm tra được).
- Lấy ca thử từ dự án cũ đã có tài liệu chuẩn, đã ẩn thông tin khách hàng.
- Lỗi thật gặp trong dự án → thêm thành một ca thử mới để lỗi không quay lại.
