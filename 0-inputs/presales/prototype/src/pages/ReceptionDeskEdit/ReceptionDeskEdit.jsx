/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Edit reception counter (WEB-02) */
import { useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import ReceptionDeskForm, { readEditTarget } from '@/pages/ReceptionDeskShared/ReceptionDeskForm';
import { LIST_URL, MENU_LABEL, RECEPTION_DESCRIPTIONS, counterLayout } from '@/pages/ReceptionDeskShared/config';

export default function ReceptionDeskEdit() {
  const [target] = useState(readEditTarget);
  const L = counterLayout([{ label: MENU_LABEL, href: LIST_URL }, { label: 'Chỉnh sửa quầy tiếp đón' }]);
  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={RECEPTION_DESCRIPTIONS} breadcrumb={L.breadcrumb}>
      <ReceptionDeskForm isEdit counter={target.counter} requestedCode={target.code} description="Chỉnh sửa thông tin của quầy tiếp đón" />
    </AppLayout>
  );
}
