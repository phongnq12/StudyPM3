# Git và PR
- Nhánh `main` được bảo vệ: chỉ merge qua PR.
- Nhánh làm việc:
  - `du-an/khung`: tầng dự án (bước 1 `/ba-init`, bước 2 `/ba-overview`, G0). Đổi cấu trúc overview về sau:
    `du-an/<slug>`, ví dụ `du-an/chia-lai-chuc-nang`.
  - `chuc-nang/CN-xx-<slug>`: một chức năng, từ bước 3 tới G4. Ví dụ `chuc-nang/CN-05-bien-ban`.
  - `cr/CR-xxx-<slug>`: change request sau khi đã merge.
- Commit: mỗi layer một hoặc vài commit, `spec(<tầng>/<layer>): <mô tả ngắn>`.
  - Tầng dự án: `spec(du-an/0-dau-vao): danh mục đầu vào`, `spec(du-an/2-business-process): bản đồ quy trình`.
  - Chức năng: `spec(CN-05/3-erd): data dictionary biên bản`, `spec(CN-05/G2): hồ sơ gate`.
- **Không mở PR sau mỗi bước hay mỗi gate.** Mỗi tầng dự án và mỗi chức năng chỉ một PR, mở bằng `/ba-pr`:
  - Tầng dự án: sau khi G0 Đạt. Người duyệt: BA lead.
  - Chức năng: sau khi G4 Đạt và các chức năng phụ thuộc đã merge. Người duyệt: BA lead, Dev lead, QC lead.
- Mô tả PR theo templates/ho-so/pr-description.md. Nhãn: `spec`, mã tầng (`du-an` hoặc `CN-xx`).
- GitHub: `gh pr create --base main --title "<tiêu đề>" --body-file <file>`.
- GitLab: `glab mr create --target-branch main --title "<tiêu đề>" --description "$(cat <file>)"`.
