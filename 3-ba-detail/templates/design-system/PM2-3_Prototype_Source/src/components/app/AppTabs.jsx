/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* AppTabs — bọc antd Tabs như PM1. Thanh tab vẽ bằng renderTabBar theo khuôn thiết kế đã duyệt (.tabs > .tab-n · tab đang mở .dang),
 * nội dung mỗi tab bọc .tab-noi (.dang khi mở). forceRender: mọi tab có sẵn trong DOM như bản HTML.
 * items: [{ key, label, id, children }] · barClassName / tabClassName / paneClassName đổi lớp khi màn dùng khuôn tab khác. */
import { useLayoutEffect } from 'react';
import { Tabs } from 'antd';
import { AppButton } from './AppButton';
import './AppTabs.css';   /* kiểu tab chuẩn đi kèm component */

/**
 * Thuộc tính của AppTabs (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.items - Danh sách tab dạng `{ key, label, id, children }`, mọi tab đều vẽ sẵn trong DOM.
 * @param {string} props.activeKey - Khoá của tab đang mở, nút tab và khung nội dung trùng khoá được gắn `activeClass`.
 * @param {function} props.onChange - Gọi khi người dùng bấm 1 nút tab, nhận `key` của tab đó.
 * @param {string} props.barClassName - Lớp CSS của thanh chứa các nút tab.
 * @param {string} props.tabClassName - Lớp CSS của từng nút tab.
 * @param {string} props.paneClassName - Lớp CSS của khung bọc nội dung mỗi tab.
 * @param {string} props.activeClass - Lớp CSS gắn thêm cho nút tab và khung nội dung của tab đang mở.
 */
export default function AppTabs({ items, activeKey, onChange, barClassName = 'tabs', tabClassName = 'tab-n', paneClassName = 'tab-panel', activeClass = 'is-current' }) {
  /* antd gắn tabIndex=0 cho khung nội dung tab ⇒ bấm vào nội dung là khung nhận focus và hiện viền focus sau khi gõ phím.
 * Thiết kế đã duyệt: khung nội dung KHÔNG nhận focus ⇒ bỏ tabindex sau mỗi lần vẽ (đổi tab thì antd gắn lại, hiệu ứng chạy lại) */
  useLayoutEffect(() => { document.querySelectorAll('.app-reset.ant-tabs .ant-tabs-tabpane[tabindex]').forEach((p) => p.removeAttribute('tabindex')); });
  return (
    <Tabs
      className="app-reset app-tabs"
      activeKey={activeKey}
      onChange={onChange}
      renderTabBar={() => (
        <div className={barClassName} role="tablist" data-fe="AppTabs">
          {items.map((it) => (
            <AppButton key={it.key} className={tabClassName + (it.key === activeKey ? ' ' + activeClass : '')} role="tab" onClick={() => onChange(it.key)}>{it.label}</AppButton>
          ))}
        </div>
      )}
      items={items.map((it) => ({
        key: it.key, label: it.label, forceRender: true,
        children: <div className={paneClassName + (it.key === activeKey ? ' ' + activeClass : '')} id={it.id}>{it.children}</div>,
      }))}
    />
  );
}
