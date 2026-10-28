/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/** Tailwind v3 như PM1.
 * - Tắt preflight: nền CSS đã có ở styles/tokens.css + styles/base.css, bật preflight sẽ reset lệch giao diện.
 * - prefix 'tw-': CSS hiện có dùng tên lớp trùng lớp tiện ích Tailwind (ví dụ .grid của lưới lịch), nên lớp Tailwind viết dạng tw-flex · tw-gap-2. */
export default {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
};
