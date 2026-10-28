/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Bộ định tuyến PM3 — chỉ còn màn kho căng tin (Giá nhập theo nhà cung cấp) và màn Đăng nhập.
 * Các màn PM2 vẫn còn mã nguồn trong src/pages nhưng đã gỡ khỏi định tuyến và menu.
 * Mỗi màn nạp lười (lazy) nên CSS riêng của màn chỉ vào trang khi mở đúng màn đó.
 * Điều hướng giữa các màn dùng location.href (tải lại trang) ⇒ CSS 2 màn không chồng lên nhau. */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from './routes';
import { can, isLoggedIn, SCREEN_PURCHASE_PRICE } from './data/accountStore';
import VersionNotice from './components/app/VersionNotice';   /* báo có bản build mới, kiểu PM5 */

const PurchasePriceList = lazy(() => import('./pages/PurchasePriceList/PurchasePriceList'));
const PurchasePriceCreate = lazy(() => import('./pages/PurchasePriceCreate/PurchasePriceCreate'));
const PurchasePriceDetail = lazy(() => import('./pages/PurchasePriceDetail/PurchasePriceDetail'));
const PurchasePriceEdit = lazy(() => import('./pages/PurchasePriceEdit/PurchasePriceEdit'));
const Login = lazy(() => import('./pages/Login/Login'));

/* chưa đăng nhập ⇒ về /dang-nhap, mang theo đường dẫn đang mở để đăng nhập xong quay lại đúng màn */
function LoginGate({ children }) {
  const loc = useLocation();
  if (loc.pathname === ROUTES.login || isLoggedIn()) return children;
  return <Navigate to={ROUTES.login + '?next=' + encodeURIComponent(loc.pathname + loc.search)} replace />;
}

/* vai trò không được Thêm / Sửa mà gõ thẳng URL ⇒ chuyển về danh sách Giá nhập */
const guard = (allowed, element) => (allowed ? element : <Navigate to={ROUTES.purchasePriceList} replace />);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <LoginGate>
        <Routes>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path="/" element={<Navigate to={ROUTES.purchasePriceList} replace />} />
          <Route path={ROUTES.purchasePriceList} element={guard(can(SCREEN_PURCHASE_PRICE, 'view'), <PurchasePriceList />)} />
          <Route path={ROUTES.purchasePriceCreate} element={guard(can(SCREEN_PURCHASE_PRICE, 'create'), <PurchasePriceCreate />)} />
          <Route path={ROUTES.purchasePriceDetail} element={guard(can(SCREEN_PURCHASE_PRICE, 'view'), <PurchasePriceDetail />)} />
          <Route path={ROUTES.purchasePriceEdit} element={guard(can(SCREEN_PURCHASE_PRICE, 'edit'), <PurchasePriceEdit />)} />
          <Route path="*" element={<Navigate to={ROUTES.purchasePriceList} replace />} />
        </Routes>
        </LoginGate>
      </Suspense>
      <VersionNotice />
    </BrowserRouter>
  );
}
