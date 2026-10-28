/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-06 · Chỉnh sửa lịch hẹn thăm gặp */
import { Navigate } from 'react-router-dom';
import AppLayout from '@/layout/AppLayout';
import { appointmentsLayout } from '@/layout/menuConfig';
import { can, canOpenScreen } from '@/data/accountStore';
import { ROUTES, readRouteId } from '@/routes';
import { buildAppointments, screenOf } from '../AppointmentList/listLogic';
import { listPathOf, canonicalPathOf, inExceptionUrl } from '@/data/approvalRoute';
import { toast } from '@/lib/legacyUi';
import { FormBody, useAppointmentForm } from '../AppointmentForm/AppointmentForm';
import { FormDialogs } from '../AppointmentForm/FormDialogs';
import { FORM_DESCRIPTIONS, FORM_SIDEBAR, buildFormBreadcrumb, buildFormMenu } from '../AppointmentForm/formConfig';

const MENU = buildFormMenu('edit');
const EXCEPTION_LAYOUT = appointmentsLayout('Lịch hẹn gặp trực tiếp ngoại lệ');   /* đơn ngoại lệ: menu, sidebar sáng mục ngoại lệ như màn Danh sách, Chi tiết */

/* không có quyền Chỉnh sửa lịch này ⇒ về danh sách của lịch (màn không được mở ⇒ Thăm gặp trực tiếp) */
export default function AppointmentEdit() {
  const record = buildAppointments().find((x) => x.code === readRouteId()) || null;
  if (record && !can(screenOf(record), 'edit', record)) return <Navigate to={canOpenScreen(screenOf(record)) ? listPathOf(record) : ROUTES.appointmentList} replace />;
  if (!record && !can('direct', 'edit')) return <Navigate to={ROUTES.appointmentList} replace />;
  /* đơn ngoại lệ ⇔ module ngoại lệ: mở sai module thì chuyển sang đúng đường dẫn */
  if (record && canonicalPathOf(record, true) !== location.pathname) return <Navigate to={canonicalPathOf(record, true) + location.search} replace />;
  return <AppointmentEditPage exception={inExceptionUrl()} />;   /* menu, sidebar theo URL đang mở */
}

function AppointmentEditPage({ exception }) {
  const form = useAppointmentForm('edit', toast);
  return (
    <AppLayout cluster="appointments" menu={exception ? EXCEPTION_LAYOUT.menu : MENU} sidebar={exception ? EXCEPTION_LAYOUT.sidebar : FORM_SIDEBAR} descriptions={FORM_DESCRIPTIONS} breadcrumb={buildFormBreadcrumb('edit', form.model.editRecord)} overlays={<FormDialogs form={form} />}>
      <FormBody form={form} />
    </AppLayout>
  );
}
