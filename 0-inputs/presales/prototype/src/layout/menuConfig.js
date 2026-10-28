/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Menu ngang + sidebar — NGUỒN DUY NHẤT của mọi màn Prototype PM3 (Quản lý kho căng tin).
 * Giữ cách dựng của PM2: menu ngang chỉ hiện TÊN NHÓM, mục con nằm ở sidebar. Mục chưa có màn ⇒ bấm báo đang phát triển.
 * Bản PM3 chỉ còn nhóm kho; các màn PM2 đã gỡ khỏi điều hướng. */

export const GOODS_GROUP = 'Hàng hóa và giá';
export const PURCHASE_PRICE_LABEL = 'Giá nhập';

const GOODS_ITEMS = [
  { icon: 'db', label: 'Mặt hàng' },
  { icon: 'users', label: 'Nhà cung cấp' },
  { icon: 'file', label: PURCHASE_PRICE_LABEL, href: '/hang-hoa/gia-nhap' },
  { icon: 'chart', label: 'Giá bán' },
];
const STOCK_ITEMS = [
  { icon: 'plus', label: 'Phiếu nhập kho' },
  { icon: 'file', label: 'Đơn đặt hàng' },
  { icon: 'db', label: 'Tồn kho' },
];

const GROUPS = [
  { icon: 'db', label: GOODS_GROUP, dropdown: false, children: GOODS_ITEMS },
  { icon: 'building', label: 'Kho căng tin', dropdown: false, children: STOCK_ITEMS },
];

/* Khung 1 màn: menu ngang sáng nhóm, sidebar = mục con của nhóm (sáng mục activeLabel), breadcrumb gốc là tên nhóm */
export function groupLayout(groupLabel, activeLabel) {
  const menu = GROUPS.map((g) => (g.label === groupLabel
    ? { ...g, active: true, children: g.children.map((c) => ({ ...c, active: c.label === activeLabel })) }
    : { ...g, active: false, children: g.children.map((c) => ({ ...c, active: false })) }));
  const group = menu.find((g) => g.label === groupLabel);
  const current = group.children.find((c) => c.label === activeLabel && c.href);
  return {
    menu,
    sidebar: { group: groupLabel, items: group.children },
    breadcrumb: [{ label: groupLabel, href: current ? current.href : (group.children.find((c) => c.href) || {}).href }],
  };
}

/* Nhóm Hàng hóa và giá */
export const goodsLayout = (activeLabel) => groupLayout(GOODS_GROUP, activeLabel);

/* Mặc định khi AppLayout không truyền menu/sidebar riêng: sáng mục Giá nhập */
const DEFAULT = goodsLayout(PURCHASE_PRICE_LABEL);
export const MENU = () => DEFAULT.menu;
export const SIDEBAR = new Proxy({}, { get: () => DEFAULT.sidebar });
