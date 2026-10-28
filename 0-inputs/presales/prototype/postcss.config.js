/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Tailwind CHỈ xử lý src/styles/tailwind.css.
 * Lý do: Tailwind v3 gộp các luật liền nhau cùng selector trên MỌI file CSS nó chạy qua và làm rơi !important
 * (đo được: 2 luật .loc-tim input trong pm2-base.css bị gộp, mất "padding-left:40px !important", ô tìm kiếm lệch 28px).
 * CSS thiết kế đã duyệt (pm2-tokens · pm2-base · CSS riêng từng màn) phải đi nguyên vẹn. */
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const tailwindChiFileRieng = {
  postcssPlugin: 'tailwind-chi-file-rieng',
  async Once(root, { result }) {
    const file = (root.source && root.source.input && root.source.input.file) || '';
    if (!/[\\/]styles[\\/]tailwind\.css$/.test(file)) return;
    const kq = await postcss([tailwindcss()]).process(root.toString(), { from: file });
    root.removeAll();
    root.append(kq.root.nodes);
    kq.messages.forEach((m) => result.messages.push(m));
  },
};

export default { plugins: [tailwindChiFileRieng, autoprefixer()] };
