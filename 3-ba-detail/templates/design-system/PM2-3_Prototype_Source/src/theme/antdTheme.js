/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Cấu hình Ant Design của PM2 — NGUỒN DUY NHẤT quyết định màu, cỡ chữ, bo góc của control antd.
 * Kế thừa chuẩn PM1, chỉ khác hệ màu thương hiệu (xanh dương #076DB6).
 * Đỏ thương hiệu cũ và đỏ lỗi #DC2626 là 2 mã khác nghĩa, không gộp.
 * CSS chỉ ghi đè kích thước và bố cục; riêng bảng màu thẻ trạng thái trong styles/tokens.css được ép màu vì lý do tương phản. */
const theme = {
  token: {
    colorPrimary: '#076DB6',            // xanh dương thương hiệu PM2 — màu hành động chính
    colorLink: '#2563EB',               // xanh dương — CHỈ liên kết văn bản
    colorLinkHover: '#1D4ED8',
    colorSuccess: '#047857',
    colorWarning: '#B45309',
    colorError: '#DC2626',              // đỏ LỖI — khác đỏ thương hiệu, giữ tách nhau
    colorInfo: '#1D4ED8',
    colorText: '#334155',               // ink-2 — nội dung chính
    colorTextHeading: '#0C1A2E',        // ink-1 — tiêu đề
    colorTextSecondary: '#64748B',      // ink-3 — 4.76:1, đạt WCAG AA
    colorTextPlaceholder: '#94A3B8',    // ink-4 — chỉ dùng ở đây
    colorBgLayout: '#F1F5F9',
    colorBgContainer: '#FFFFFF',
    colorBgMask: 'rgba(15,23,42,.45)',
    colorBorder: '#E5E7EB',
    colorBorderSecondary: '#F3F4F6',
    borderRadius: 8,
    borderRadiusSM: 6,
    borderRadiusLG: 8,
    controlHeight: 36,
    controlHeightSM: 28,
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    motionDurationFast: '0.15s',
    motionDurationMid: '0.25s',
    motionDurationSlow: '0.4s',
  },
  components: {
    // Ant Design mặc định thả một vệt đổ bóng đặc dưới đáy nút (primaryShadow
    // '0 2px 0 …') khiến nút trông như có một nút thứ hai sẫm màu nằm phía sau.
    // Design system không dùng bóng cho nút — độ nổi của nút do màu nền quyết định.
    Button: {
      borderRadius: 6, fontWeight: 500, paddingInline: 16,
      primaryShadow: 'none', defaultShadow: 'none', dangerShadow: 'none',
    },
    Table: {
      headerBg: '#F9FAFB',
      headerColor: '#374151',
      rowHoverBg: '#F9FAFB',
      borderColor: '#E5E7EB',
      cellPaddingBlock: 12,
      cellPaddingInline: 24,
    },
    Input: {
      activeBorderColor: '#076DB6',
      hoverBorderColor: '#2A87CF',
      activeShadow: '0 0 0 2px rgba(208,32,43,.14)',
    },
    // PM1 chưa khai InputNumber; PM2 dùng nên bổ sung, bám đúng Input ở trên.
    InputNumber: {
      activeBorderColor: '#076DB6',
      hoverBorderColor: '#2A87CF',
    },
    Select: {
      optionActiveBg: '#F8FAFC',
      optionSelectedBg: '#E6F1FA',
      optionHeight: 36,
      listHeight: 260,               // 7 dòng trọn + lộ nửa dòng thứ 8
    },
    DatePicker: { activeBorderColor: '#076DB6', cellActiveWithRangeBg: '#E6F1FA' },
    Tabs: { inkBarColor: '#076DB6', itemSelectedColor: '#076DB6', itemHoverColor: '#2A87CF' },
    Steps: { colorPrimary: '#076DB6' },
    Pagination: { itemActiveBg: '#E6F1FA' },
    Descriptions: { labelBg: '#F9FAFB' },
    Modal: { titleFontSize: 16, borderRadiusLG: 8, footerBg: '#F9FAFB' },
    Tag: { borderRadiusSM: 9999, defaultBg: '#F1F5F9', defaultColor: '#334155' },
    Tooltip: { colorBgSpotlight: '#0F172A', borderRadius: 6 },
    // PM1 chưa khai Segmented; PM2 dùng nên bổ sung, lấy brand-weak làm nền mục
    // đang chọn và brand-active làm màu chữ.
    Segmented: { itemSelectedBg: '#E6F1FA', itemSelectedColor: '#055A96' },
  },
};

export default theme;
