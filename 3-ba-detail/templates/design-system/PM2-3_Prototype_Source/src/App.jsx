/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Bộ định tuyến — route theo src/routes.js: 2 cấp của PM2 + trang con theo PM1 (tao-moi · :id · :id/chinh-sua), không dấu / cuối
 * (bản HTML đã đóng băng, React là bản chuẩn — không còn giữ URL của bản HTML).
 * Mỗi màn nạp lười (lazy) nên CSS riêng của màn chỉ vào trang khi mở đúng màn đó.
 * Điều hướng giữa các màn dùng location.href (tải lại trang) ⇒ CSS 2 màn không chồng lên nhau. */
import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ROUTES } from './routes';
import { can, canOpenScreen, isLoggedIn, SCREEN_DIRECT, SCREEN_EXCEPTION, SCREEN_OPERATIONS, SCREEN_NOTIFICATION_SETTINGS } from './data/accountStore';
import VersionNotice from './components/app/VersionNotice';   /* báo có bản build mới, kiểu PM5 */

const AppointmentDetail = lazy(() => import('./pages/AppointmentDetail/AppointmentDetail'));
const AppointmentList = lazy(() => import('./pages/AppointmentList/AppointmentList'));
const AppointmentCreate = lazy(() => import('./pages/AppointmentCreate/AppointmentCreate'));
const AppointmentEdit = lazy(() => import('./pages/AppointmentEdit/AppointmentEdit'));
const CounterRegistration = lazy(() => import('./pages/CounterRegistration/CounterRegistration'));
const ReceptionDeskList = lazy(() => import('./pages/ReceptionDeskList/ReceptionDeskList'));
const ReceptionDeskCreate = lazy(() => import('./pages/ReceptionDeskCreate/ReceptionDeskCreate'));
const ReceptionDeskEdit = lazy(() => import('./pages/ReceptionDeskEdit/ReceptionDeskEdit'));
const NotificationList = lazy(() => import('./pages/NotificationList/NotificationList'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings/NotificationSettings'));
const ReceptionDeskDetail = lazy(() => import('./pages/ReceptionDeskDetail/ReceptionDeskDetail'));
const VisitConfig = lazy(() => import('./pages/VisitConfig/VisitConfig'));
const Login = lazy(() => import('./pages/Login/Login'));

/* chưa đăng nhập ⇒ về /dang-nhap, mang theo đường dẫn đang mở để đăng nhập xong quay lại đúng màn */
function LoginGate({ children }) {
  const loc = useLocation();
  if (loc.pathname === ROUTES.login || isLoggedIn()) return children;
  return <Navigate to={ROUTES.login + '?next=' + encodeURIComponent(loc.pathname + loc.search)} replace />;
}

/* Màn chưa có trong Prototype — bản public trên Vercel không được trỏ về localhost */
function NotMigratedYet() {
  return (
    <div style={{ padding: 32, fontSize: 14 }}>
      Màn này chưa có trong bản Prototype. <a href={ROUTES.appointmentList}>Quay về Lịch hẹn thăm gặp trực tiếp</a>
    </div>
  );
}

/* vai trò không được mở màn (hoặc không được Tạo mới) gõ thẳng URL ⇒ chuyển về Thăm gặp trực tiếp */
const guard = (allowed, element) => (allowed ? element : <Navigate to={ROUTES.appointmentList} replace />);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <LoginGate>
        <Routes>
          <Route path={ROUTES.login} element={<Login />} />
          <Route path="/" element={<Navigate to={ROUTES.appointmentList} replace />} />
          <Route path={ROUTES.appointmentList} element={<AppointmentList />} />
          <Route path={ROUTES.exceptionList} element={guard(canOpenScreen(SCREEN_EXCEPTION), <AppointmentList variant="exception" />)} />
          <Route path={ROUTES.appointmentCreate} element={guard(can(SCREEN_DIRECT, 'create'), <AppointmentCreate />)} />
          <Route path={ROUTES.appointmentCalendar} element={<AppointmentList />} />
          <Route path={ROUTES.exceptionCalendar} element={guard(canOpenScreen(SCREEN_EXCEPTION), <AppointmentList variant="exception" />)} />
          <Route path={ROUTES.appointmentDetail} element={<AppointmentDetail />} />
          <Route path={ROUTES.appointmentEdit} element={<AppointmentEdit />} />
          {/* đơn ngoại lệ: Chi tiết, Chỉnh sửa thuộc module Lịch hẹn gặp trực tiếp ngoại lệ */}
          <Route path={ROUTES.exceptionDetail} element={guard(canOpenScreen(SCREEN_EXCEPTION), <AppointmentDetail />)} />
          <Route path={ROUTES.exceptionEdit} element={guard(canOpenScreen(SCREEN_EXCEPTION), <AppointmentEdit />)} />
          <Route path={ROUTES.counterRegistration} element={<CounterRegistration />} />
          <Route path={ROUTES.receptionDeskList} element={guard(canOpenScreen(SCREEN_OPERATIONS), <ReceptionDeskList />)} />
          <Route path={ROUTES.receptionDeskCreate} element={guard(canOpenScreen(SCREEN_OPERATIONS), <ReceptionDeskCreate />)} />
          <Route path={ROUTES.receptionDeskEdit} element={guard(canOpenScreen(SCREEN_OPERATIONS), <ReceptionDeskEdit />)} />
          <Route path={ROUTES.notificationList} element={<NotificationList />} />
          <Route path={ROUTES.notificationSettings} element={guard(canOpenScreen(SCREEN_NOTIFICATION_SETTINGS), <NotificationSettings />)} />
          <Route path={ROUTES.receptionDeskDetail} element={guard(canOpenScreen(SCREEN_OPERATIONS), <ReceptionDeskDetail />)} />
          <Route path={ROUTES.visitConfig} element={guard(canOpenScreen(SCREEN_OPERATIONS), <VisitConfig />)} />
          <Route path={ROUTES.visitConfigEdit} element={guard(canOpenScreen(SCREEN_OPERATIONS), <VisitConfig />)} />
          <Route path="*" element={<NotMigratedYet />} />
        </Routes>
        </LoginGate>
      </Suspense>
      <VersionNotice />
    </BrowserRouter>
  );
}
