/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Điểm vào trang Design System PM2 — nạp ĐÚNG bộ CSS và theme antd như Prototype (src/main.jsx) để control hiển thị y hệt màn thật.
 * Không chạy runDataFixes, runAutoCancel: trang này không đọc ghi dữ liệu nghiệp vụ. */
import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import viVN from 'antd/locale/vi_VN';
import theme from '@/theme/antdTheme';
import '@/styles/antd-reset.css';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/toast.css';
import '@/styles/tailwind.css';
import '@/styles/pm1-look.css';
import '@/styles/form.css';   /* các màn form tự nạp file này (nút form-btn, ô nhập, lookup…) — thiếu là nút, ô hiện sai kiểu */
/* CSS riêng của các màn có khối chép sang trang (nhóm Khối màn thật) — thiếu là khối hiện khác màn thật */
import '@/pages/AppointmentList/AppointmentList.css';
import '@/pages/AppointmentForm/AppointmentForm.css';
import '@/pages/CounterRegistration/CounterRegistration.css';
import '@/pages/CounterRegistration/popup.css';
import '@/pages/VisitConfig/VisitConfig.css';
import '@/pages/ReceptionDeskDetail/ReceptionDeskDetail.css';
import '@/pages/NotificationSettings/NotificationSettings.css';
import '@/pages/ReceptionDeskShared/HistoryTable.css';
import counterFormCss from '@/pages/ReceptionDeskShared/ReceptionDeskForm.css?inline';
import './design.css';
import DesignApp from './DesignApp';
import { seedDesignData } from './seed';
import { installScrollableFocus } from './a11yScroll';

seedDesignData();
installScrollableFocus();
/* CSS riêng form Quầy CHỈ áp trong khối Buồng thăm gặp: nạp toàn trang thì luật .lookup .form-btn của nó đè nút Tra cứu ở khối Tra cứu thân nhân.
 * Lồng cả file vào :where(#item-counter-tables) bằng CSS nesting ⇒ mọi luật chỉ trúng phần tử trong khối đó, độ ưu tiên GIỮ NGUYÊN như màn thật
 * (bọc #id trần làm luật .capacity-table input thắng luật ô tích .app input[type=checkbox] ⇒ ô tích cao 36px thay vì 16px). */
{ const st = document.createElement('style'); st.dataset.scope = 'ReceptionDeskForm.css'; st.textContent = ':where(#item-counter-tables){' + counterFormCss + '}'; document.head.appendChild(st); }   /* dữ liệu mẫu riêng của trang để control (lưới lịch, ô chọn buồng…) chạy thật */


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider locale={viVN} wave={{ disabled: true }} theme={theme}>
        <DesignApp />
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
