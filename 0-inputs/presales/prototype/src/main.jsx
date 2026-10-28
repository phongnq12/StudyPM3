/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Điểm vào ứng dụng.
 * Thứ tự CSS: token → nền → CSS riêng của từng màn (nạp theo route). Tailwind chỉ bật lớp tiện ích, tắt preflight. */
import '@ant-design/v5-patch-for-react-19';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import viVN from 'antd/locale/vi_VN';
import theme from './theme/antdTheme';
import logo from '@/assets/logo-cand.svg';
import './styles/antd-reset.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/toast.css';
import './styles/tailwind.css';
import './styles/pm1-look.css';   /* phối màu theo PM1: thao tác xanh dương, đỏ chỉ dùng cho nhận diện và hành động nguy hiểm */
import App from './App';
import { installFieldErrorA11y } from './lib/fieldErrorA11y';

document.querySelector('link[rel=icon]').href = logo;
installFieldErrorA11y();   /* nối chữ báo lỗi với ô nhập cho trình đọc màn hình */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyleProvider layer>
      <ConfigProvider locale={viVN} wave={{ disabled: true }} theme={theme}>
        <App />
      </ConfigProvider>
    </StyleProvider>
  </StrictMode>,
);
