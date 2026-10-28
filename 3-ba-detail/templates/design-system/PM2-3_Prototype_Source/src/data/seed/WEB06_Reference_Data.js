/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* PM2 · WEB-06 — DỮ LIỆU THAM CHIẾU DÙNG CHUNG cho 3 màn biểu mẫu (Tạo mới · Chỉnh sửa · Đăng ký tại quầy).
 Khoá tiếng Anh theo Màn hình và tài liệu luôn hiện TÊN NGHIỆP VỤ. */

/* Trạng thái tài khoản thân nhân — label: tên nghiệp vụ hiển thị */
const RELATIVE_STATUS = {
  APPROVED: { label: 'Đã duyệt' }
};

/* Tài khoản thân nhân · người cai nghiện được thăm (students) · thân nhân liên kết đi cùng được (linkedRelatives) */
const RELATIVES = [
  {
    "fullName": "Phạm Thị Lan",
    "birthDate": "1990-05-18",
    "phoneNumber": "0912345678",
    "status": "APPROVED",
    "students": [
      {
        "fullName": "Phạm Quốc Dũng",
        "citizenId": "001186006623",
        "birthDate": "1986-01-03",
        "relationship": "Vợ",
        "remainingQuota": 2,
        "managerName": "Nguyễn Văn Hùng",
        "linkedRelatives": [
          {
            "fullName": "Phạm Minh Khôi",
            "relationship": "Con",
            "citizenId": "001215008823",
            "birthDate": "2001-07-22"
          },
          {
            "fullName": "Phạm Thị Nga",
            "relationship": "Em",
            "citizenId": "001193005571",
            "birthDate": "1993-03-14"
          },
          {
            "fullName": "Nguyễn Văn Thành",
            "relationship": "Anh",
            "citizenId": "001178003096",
            "birthDate": "1978-12-08"
          }
        ],
        "studentCode": "HS-00623",
        "teamName": "Đội 1",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Phạm Minh Khôi",
        "citizenId": "001215008823",
        "birthDate": "2001-07-22",
        "relationship": "Mẹ",
        "remainingQuota": 1,
        "managerName": "Lê Thị Hạnh",
        "linkedRelatives": [
          {
            "fullName": "Phạm Quốc Dũng",
            "relationship": "Bố",
            "citizenId": "001186006623",
            "birthDate": "1986-01-03"
          }
        ],
        "studentCode": "HS-00701",
        "teamName": "Đội 3",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Phạm Văn Đức",
        "citizenId": "001198009151",
        "birthDate": "1998-05-12",
        "relationship": "Con",
        "remainingQuota": 1,
        "managerName": "Trần Đức Minh",
        "linkedRelatives": [],
        "studentCode": "HS-00915",
        "teamName": "Đội 2",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-10-01",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      }
    ],
    "citizenId": "001190004417"
  },
  {
    "fullName": "Nguyễn Thị Hoa",
    "birthDate": "1985-11-09",
    "phoneNumber": "0987654321",
    "status": "APPROVED",
    "students": [
      {
        "fullName": "Trần Văn Bình",
        "citizenId": "001189004412",
        "birthDate": "1989-04-12",
        "relationship": "Vợ",
        "remainingQuota": 3,
        "managerName": "Nguyễn Văn Hùng",
        "linkedRelatives": [
          {
            "fullName": "Trần Văn Nam",
            "relationship": "Con",
            "citizenId": "001210007755"
          },
          {
            "fullName": "Trần Thị Mai",
            "relationship": "Mẹ",
            "citizenId": "001156002190"
          }
        ],
        "studentCode": "HS-00412",
        "teamName": "Đội 1",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Trần Văn Toàn",
        "citizenId": "001191008201",
        "birthDate": "1991-11-02",
        "relationship": "Con",
        "remainingQuota": 1,
        "managerName": "Nguyễn Văn Hùng",
        "linkedRelatives": [],
        "studentCode": "HS-00820",
        "teamName": "Đội 1",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": true,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Trần Văn Hải",
        "citizenId": "001193008212",
        "birthDate": "1993-08-14",
        "relationship": "Con",
        "remainingQuota": 1,
        "managerName": "Nguyễn Văn Hùng",
        "linkedRelatives": [],
        "studentCode": "HS-00821",
        "teamName": "Đội 1",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-05-20",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      }
    ],
    "citizenId": "001185003412"
  },
  {
    "fullName": "Lê Thị Thu",
    "birthDate": "1982-02-27",
    "phoneNumber": "0903112233",
    "status": "APPROVED",
    "students": [
      {
        "fullName": "Lê Minh Cường",
        "citizenId": "001192005518",
        "birthDate": "1992-09-27",
        "relationship": "Chị",
        "remainingQuota": 0,
        "managerName": "Trần Đức Minh",
        "linkedRelatives": [
          {
            "fullName": "Lê Văn Tuấn",
            "relationship": "Bố",
            "citizenId": "001160001238"
          }
        ],
        "studentCode": "HS-00518",
        "teamName": "Đội 2",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Lê Văn Hậu",
        "citizenId": "001190008302",
        "birthDate": "1990-03-21",
        "relationship": "Em",
        "remainingQuota": 1,
        "managerName": "Trần Đức Minh",
        "linkedRelatives": [],
        "studentCode": "HS-00830",
        "teamName": "Đội 2",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_MEDICAL_TREATMENT",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Lê Văn Tài",
        "citizenId": "001194008313",
        "birthDate": "1994-07-09",
        "relationship": "Em",
        "remainingQuota": 1,
        "managerName": "Lê Thị Hạnh",
        "linkedRelatives": [],
        "studentCode": "HS-00831",
        "teamName": "Đội 3",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": {
          "reason": "điều trị lao phổi",
          "until": "2026-10-20"
        }
      },
      {
        "fullName": "Lê Văn Khải",
        "citizenId": "001195008321",
        "birthDate": "1995-02-11",
        "relationship": "Em",
        "remainingQuota": 1,
        "managerName": "Trần Đức Minh",
        "linkedRelatives": [],
        "studentCode": "HS-00832",
        "teamName": "Đội 2",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "TEMPORARILY_ABSENT",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Lê Văn Thành",
        "citizenId": "001188008322",
        "birthDate": "1988-07-09",
        "relationship": "Em",
        "remainingQuota": 1,
        "managerName": "Trần Đức Minh",
        "linkedRelatives": [],
        "studentCode": "HS-00833",
        "teamName": "Đội 2",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "COMPLETED",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Lê Văn Phong",
        "citizenId": "001192008323",
        "birthDate": "1992-11-30",
        "relationship": "Em",
        "remainingQuota": 1,
        "managerName": "Lê Thị Hạnh",
        "linkedRelatives": [],
        "studentCode": "HS-00834",
        "teamName": "Đội 3",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "TRANSFERRED",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      }
    ],
    "citizenId": "001182006604"
  },
  /* Mẫu xem duyệt tự động: đã gặp xong Bùi Xuân Khánh ở LH-2026-0918. CCCD, ngày sinh, SĐT là số giả lập */
  {
    "fullName": "Bùi Thị Thu",
    "birthDate": "1968-05-14",
    "phoneNumber": "0912000918",
    "status": "APPROVED",
    "students": [
      {
        "fullName": "Bùi Xuân Khánh",
        "citizenId": "001093034567",
        "birthDate": "1993-12-22",
        "relationship": "Mẹ",
        "remainingQuota": 1,
        "managerName": "Lê Thị Hạnh",
        "linkedRelatives": [],
        "studentCode": "HS-01033",
        "teamName": "Đội 3",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Bùi Văn Quý",
        "citizenId": "001187008404",
        "birthDate": "1987-01-30",
        "relationship": "Anh",
        "remainingQuota": 1,
        "managerName": "Nguyễn Văn Hùng",
        "linkedRelatives": [],
        "studentCode": "HS-00840",
        "teamName": "Đội 1",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": {
          "documentNo": "125/CV-CSĐT",
          "issuedDate": "2026-09-28",
          "agency": "Cơ quan Cảnh sát điều tra Công an tỉnh"
        },
        "medicalHold": null
      },
      {
        "fullName": "Bùi Văn Lực",
        "citizenId": "001189008415",
        "birthDate": "1989-12-12",
        "relationship": "Anh",
        "remainingQuota": 1,
        "managerName": "Trần Đức Minh",
        "linkedRelatives": [],
        "studentCode": "HS-00841",
        "teamName": "Đội 2",
        "linkStatus": "APPROVED",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Bùi Thị Mơ",
        "citizenId": "001196008426",
        "birthDate": "1996-04-18",
        "relationship": "Em",
        "remainingQuota": 1,
        "managerName": "Lê Thị Hạnh",
        "linkedRelatives": [],
        "studentCode": "HS-00842",
        "teamName": "Đội 3",
        "linkStatus": "PENDING_APPROVAL",
        "visitRightEnabled": true,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      },
      {
        "fullName": "Bùi Văn Tùng",
        "citizenId": "001191008431",
        "birthDate": "1991-05-14",
        "relationship": "Anh",
        "remainingQuota": 1,
        "managerName": "Nguyễn Văn Hùng",
        "linkedRelatives": [],
        "studentCode": "HS-00843",
        "teamName": "Đội 1",
        "linkStatus": "APPROVED",
        "visitRightEnabled": false,
        "managementStatus": "IN_REHAB",
        "admissionDate": "2026-06-15",
        "disciplineUnderReview": false,
        "caseAuthorityRequest": null,
        "medicalHold": null
      }
    ],
    "citizenId": "001168000918"
  }
];

/* Thân nhân đã khai trong hồ sơ người cai nghiện */
const STUDENT_RELATIVES = [
  {
    "studentCode": "HS-00412",
    "relatives": [
      {
        "fullName": "Nguyễn Thị Hoa",
        "relationship": "Vợ",
        "citizenId": "001185003412"
      },
      {
        "fullName": "Trần Văn Nam",
        "relationship": "Con",
        "citizenId": "001210007755"
      },
      {
        "fullName": "Trần Thị Mai",
        "relationship": "Mẹ",
        "citizenId": "001156002190"
      }
    ]
  },
  {
    "studentCode": "HS-00518",
    "relatives": [
      {
        "fullName": "Lê Thị Thu",
        "relationship": "Chị",
        "citizenId": "001182006604"
      },
      {
        "fullName": "Lê Văn Tuấn",
        "relationship": "Bố",
        "citizenId": "001160001238"
      }
    ]
  },
  {
    "studentCode": "HS-00623",
    "relatives": [
      {
        "fullName": "Phạm Thị Lan",
        "relationship": "Vợ",
        "citizenId": "001190004417"
      },
      {
        "fullName": "Phạm Minh Khôi",
        "relationship": "Con",
        "citizenId": "001215008823",
        "birthDate": "2001-07-22"
      },
      {
        "fullName": "Nguyễn Văn Thành",
        "relationship": "Anh",
        "citizenId": "001178003096",
        "birthDate": "1978-12-08"
      },
      {
        "fullName": "Phạm Thị Nga",
        "relationship": "Em",
        "citizenId": "001193005571",
        "birthDate": "1993-03-14"
      }
    ]
  }
];

/* Phòng thăm gặp · buổi · quầy · buồng · khung giờ đã có lịch (busySlots) */
const VISIT_ROOMS = [
  {
    "name": "TC01 — Phòng thăm gặp chung số 1",
    "shifts": [
      {
        "name": "Buổi sáng",
        "openTime": "07:00",
        "closeTime": "11:00"
      },
      {
        "name": "Buổi chiều",
        "openTime": "14:00",
        "closeTime": "17:00"
      }
    ],
    "counterCodes": [
      "Q01",
      "Q02"
    ],
    "tables": [
      {
        "code": "TC01-01",
        "busySlots": []
      },
      {
        "code": "TC01-02",
        "busySlots": []
      },
      {
        "code": "TC01-03",
        "busySlots": []
      },
      {
        "code": "TC01-04",
        "busySlots": []
      },
      {
        "code": "TC01-05",
        "busySlots": []
      },
      {
        "code": "TC01-06",
        "busySlots": []
      },
      {
        "code": "TC01-07",
        "busySlots": []
      },
      {
        "code": "TC01-08",
        "busySlots": []
      },
      {
        "code": "TC01-09",
        "busySlots": []
      },
      {
        "code": "TC01-10",
        "busySlots": []
      },
      {
        "code": "TC01-11",
        "busySlots": []
      },
      {
        "code": "TC01-12",
        "busySlots": []
      }
    ]
  },
  {
    "name": "TC02 — Phòng thăm gặp chung số 2",
    "shifts": [
      {
        "name": "Buổi sáng",
        "openTime": "07:00",
        "closeTime": "11:00"
      },
      {
        "name": "Buổi chiều",
        "openTime": "14:00",
        "closeTime": "17:00"
      }
    ],
    "counterCodes": [
      "Q01"
    ],
    "tables": [
      {
        "code": "TC02-01",
        "busySlots": []
      },
      {
        "code": "TC02-02",
        "busySlots": []
      }
    ]
  }
];

/* Cấu hình đặt lịch (phút) */
const BOOKING_CONFIG = {
  "slotStepMinutes": 15,
  "remindBeforeMinutes": 10,
  "durationMinutes": [
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45
  ],
  "cleanupMinutes": 0
};

/* Thời lượng theo loại hình thăm gặp (phút) */
const VISIT_TYPE_DURATIONS = [
  {
    "visitTypeName": "Thăm gặp trực tiếp tiêu chuẩn",
    "durationMinutes": 45
  }
];

/* Lớp chuyển đổi — CHỈ dùng trong Prototype: dựng lại các bảng khoá cũ mà logic màn đang đọc. FE bỏ qua phần này */
function referenceToLegacy() {
  const dmy = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('/') : d;
  const ngc = (o, bang, ngay) => { const r = {}; Object.keys(o).forEach(function (k) { const cu = bang[k]; if (cu) r[cu] = (ngay || []).indexOf(k) >= 0 ? dmy(o[k]) : o[k]; }); return r; };
  const LK = { fullName: 'ten', relationship: 'qh', citizenId: 'gt', birthDate: 'ns' };
  const NC = { fullName: 'ten', citizenId: 'cccd', birthDate: 'ns', relationship: 'qh', remainingQuota: 'quy' };
  const THAN_NHAN = {}; RELATIVES.forEach(function (r) {
    const t = ngc(r, { fullName: 'ten', birthDate: 'ns', phoneNumber: 'sdt' }, ['birthDate']); t.trangThai = RELATIVE_STATUS[r.status].label;
    if (r.students) t.ncn = r.students.map(function (s) { const n = ngc(s, NC, ['birthDate']); if (s.studentCode !== undefined) n.hs = s.teamName ? s.studentCode + ' · ' + s.teamName : s.studentCode; if (s.linkedRelatives) n.lienKet = s.linkedRelatives.map(function (l) { return ngc(l, LK, ['birthDate']); }); return n; });
    THAN_NHAN[r.citizenId] = t; });
  const HO_SO = {}; STUDENT_RELATIVES.forEach(function (s) { HO_SO[s.studentCode] = s.relatives.map(function (l) { return ngc(l, LK, ['birthDate']); }); });
  const TAI_NGUYEN = {}; VISIT_ROOMS.forEach(function (p) { TAI_NGUYEN[p.name] = { ca: p.shifts.map(function (c) { return { ten: c.name, mo: c.openTime, dong: c.closeTime }; }), quay: p.counterCodes, ban: p.tables.map(function (b) { return { ma: b.code, ban: b.busySlots.map(function (x) { return [x.from, x.to]; }) }; }) }; });
  const CAU_HINH = { buocChiaKhung: BOOKING_CONFIG.slotStepMinutes, thoiLuong: BOOKING_CONFIG.durationMinutes, donDep: BOOKING_CONFIG.cleanupMinutes };
  const THOI_LUONG = {}; VISIT_TYPE_DURATIONS.forEach(function (x) { THOI_LUONG[x.visitTypeName] = x.durationMinutes; });
  return { THAN_NHAN: THAN_NHAN, HO_SO: HO_SO, TAI_NGUYEN: TAI_NGUYEN, CAU_HINH: CAU_HINH, THOI_LUONG: THOI_LUONG };
}
const LEGACY_REFERENCE = referenceToLegacy();
