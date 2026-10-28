/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Create reception counter (WEB-02) */
import AppLayout from '@/layout/AppLayout';
import ReceptionDeskForm from '@/pages/ReceptionDeskShared/ReceptionDeskForm';
import { LIST_URL, MENU_LABEL, RECEPTION_DESCRIPTIONS, counterLayout } from '@/pages/ReceptionDeskShared/config';

export default function ReceptionDeskCreate() {
  const L = counterLayout([{ label: MENU_LABEL, href: LIST_URL }, { label: 'Tạo quầy tiếp đón' }]);   /* đủ tầng như màn Chi tiết, Chỉnh sửa quầy */
  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={RECEPTION_DESCRIPTIONS} breadcrumb={L.breadcrumb}>
      <ReceptionDeskForm isEdit={false} description="Khai báo quầy tiếp đón và các dãy nhà quầy phục vụ" />
    </AppLayout>
  );
}
