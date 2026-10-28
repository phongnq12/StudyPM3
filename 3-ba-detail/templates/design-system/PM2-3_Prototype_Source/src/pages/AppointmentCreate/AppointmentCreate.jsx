/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-06 · Tạo lịch hẹn thăm gặp */
import AppLayout from '@/layout/AppLayout';
import { toast } from '@/lib/legacyUi';
import { FormBody, useAppointmentForm } from '../AppointmentForm/AppointmentForm';
import { FormDialogs } from '../AppointmentForm/FormDialogs';
import { FORM_DESCRIPTIONS, FORM_SIDEBAR, buildFormBreadcrumb, buildFormMenu } from '../AppointmentForm/formConfig';

const MENU = buildFormMenu('create');
const BREADCRUMB = buildFormBreadcrumb('create');

export default function AppointmentCreate() {
  const form = useAppointmentForm('create', toast);
  return (
    <AppLayout cluster="appointments" menu={MENU} sidebar={FORM_SIDEBAR} descriptions={FORM_DESCRIPTIONS} breadcrumb={BREADCRUMB} overlays={<FormDialogs form={form} />}>
      <FormBody form={form} />
    </AppLayout>
  );
}
