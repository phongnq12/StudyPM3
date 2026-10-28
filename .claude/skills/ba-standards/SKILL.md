---
name: ba-standards
description: "Quy chuẩn BA của công ty: ID và mã gốc (presales, điều khoản), checklist chất lượng 29148, văn phong, quy trình bước và gate, nhánh và PR; bảng tiêu chuẩn quốc tế mà từng loại tài liệu của kit theo. Nạp sẵn cho mọi agent BA."
user-invocable: false
metadata:
  version: 2.1.0
  owner: BA lead
  updated: 2026-10-26
---

# Quy chuẩn BA (tham chiếu)

Khi viết hoặc review tài liệu spec, tuân thủ các file sau (đọc khi cần, không chép lại):
- kit/standards/id-convention.md — tiền tố ID (CN, MP, PH…), mã gốc presales `PS:<mã>`, mã điều khoản `PL:<mã>`,
  overview và chi tiết, dải ID của chức năng, trạng thái theo gate, cột trace.csv
- kit/standards/requirement-quality.md — 8 đặc tính, nhất quán chéo, 3 mức lỗi
- kit/standards/writing-style.md — văn phong, từ cấm
- kit/standards/gate-procedure.md — lệnh điều phối, một bước, gate, mức chặn khi hỏi BA
- kit/standards/notation.md — quy ước sơ đồ (chỗ lệch với kit hiện tại: skill ba-notation)
- kit/standards/git-flow.md — nhánh theo tầng và chức năng, commit theo layer, một PR mỗi tầng hoặc chức năng

Cách dẫn nguồn, mã kèm tên, con số kèm biên, ba giá trị đặc biệt (`n/a`, `[CẦN XÁC NHẬN: Q-xxx]`, `[CẦN XÁC NHẬN]`):
skill ba-agent-protocol mục "Nguồn, giả định, con số".

Bốn luật không bao giờ được vi phạm:
1. Không tự điền con số nghiệp vụ.
2. Mọi nội dung có nguồn (ID, `PS:`, `PL:`, `MP-`, [SRC]) hoặc [ASM-xxx].
3. Không sửa kit/standards/, 0-inputs/ (trừ ghi `0-inputs/answers-<ngày>.md`) và không commit lên main.
4. Không chọn hộ khi nguồn mâu thuẫn.

## Tiêu chuẩn quốc tế kit dựa vào
Kit không chép tiêu chuẩn; template và method lấy phần cốt lõi phù hợp mục đích "làm chi tiết từng chức năng, dựng
ngược từ presales và luật". Mỗi template ghi dòng "Căn cứ chuẩn" trỏ về bảng này.

| Tài liệu, việc | Tiêu chuẩn | Phần dùng |
| --- | --- | --- |
| Yêu cầu, đặc tính yêu cầu, bộ yêu cầu | ISO/IEC/IEEE 29148:2018 mục 5.2 | 9 đặc tính một yêu cầu (necessary, appropriate, unambiguous, complete, singular, feasible, verifiable, correct, conforming), 5 đặc tính bộ yêu cầu; kit/standards/requirement-quality.md hiện có 8 đặc tính (chưa có "appropriate": đúng mức trừu tượng, không lẫn giải pháp) |
| BRD overview, BRD chức năng | ISO/IEC/IEEE 29148:2018 mục 9.3 (BRS), 9.4 (StRS); BABOK v3 | Mục đích, phạm vi, mục tiêu, stakeholder, chính sách và rule, ràng buộc; phân loại business / stakeholder / solution / transition requirement |
| Truy vết | ISO/IEC/IEEE 29148:2018 mục 6.5; BABOK v3 "Trace Requirements" | trace.csv, mapping, ma trận nguồn → REQ |
| Quy trình nghiệp vụ | BPMN 2.0.2 (OMG, ISO/IEC 19510:2013); BABOK v3 "Process Modelling" | Skill ba-bpmn |
| ERD, data dictionary | BABOK v3 "Data Modelling", "Data Dictionary"; ISO/IEC 11179-3 (thuộc tính siêu dữ liệu); ký hiệu Information Engineering (crow's foot) | Tên, định nghĩa, kiểu, miền giá trị, đơn vị, bản số, nguồn |
| Vòng đời | UML 2.5.1 State Machine (OMG) | Trạng thái, chuyển (trigger [guard] / effect), đầu, kết thúc, chuyển bị cấm |
| Use case | UML 2.5.1; A. Cockburn, *Writing Effective Use Cases* (fully dressed); tiêu chí nghiệm thu dạng Given–When–Then | Skill ba-usecase |
| Business rule, bảng quyết định | Business Rules Manifesto; OMG SBVR 1.5 (rule định nghĩa / rule hành vi); OMG DMN 1.4 (decision table, hit policy); BABOK v3 "Business Rules Analysis", "Decision Modelling" | Skill ba-rules |
| Prototype, đặc tả màn hình | ISO 9241-110:2020 (nguyên tắc tương tác); WCAG 2.2 (tiếp cận); BABOK v3 "Prototyping" | Skill ba-screens, ba-design-system |
| SRS chung, SRS module | ISO/IEC/IEEE 29148:2018 mục 9.6 (SRS); ISO/IEC 25010:2023 (đặc tính chất lượng cho yêu cầu phi chức năng) | Skill ba-srs |
| Review ở gate | ISO/IEC 20246:2017 (work product review, đọc theo checklist); IEEE 1028-2008 | Skill ba-gate, agent quality-reviewer |
| Change request | BABOK v3 "Assess Requirements Changes"; IEEE 828-2012 (quản lý cấu hình) | Skill ba-cr |
