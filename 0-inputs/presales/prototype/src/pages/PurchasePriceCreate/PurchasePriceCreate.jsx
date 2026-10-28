/* PM3 · Thêm đợt giá nhập — trang riêng */
import AppLayout from '@/layout/AppLayout';
import BatchForm from '@/pages/PurchasePriceShared/BatchForm';
import { PRICE_DESCRIPTIONS, priceLayout } from '@/pages/PurchasePriceShared/config';

export default function PurchasePriceCreate() {
  const L = priceLayout([{ label: 'Thêm đợt giá nhập' }]);
  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={PRICE_DESCRIPTIONS} breadcrumb={L.breadcrumb}>
      <BatchForm />
    </AppLayout>
  );
}
