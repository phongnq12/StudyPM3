/* PM3 · Cập nhật dòng giá nhập — trang riêng. Dòng không còn ⇒ về danh sách kèm thông báo;
 * dòng không sửa được (gõ thẳng URL) ⇒ về màn Chi tiết, màn đó báo lý do */
import { useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { purchasePriceDetailPath, readRouteId } from '@/routes';
import { editBlockReason, findLine, readDb } from '@/data/purchasePriceStore';
import LineEditForm from '@/pages/PurchasePriceShared/LineEditForm';
import { LIST_URL, PRICE_DESCRIPTIONS, priceLayout } from '@/pages/PurchasePriceShared/config';

export default function PurchasePriceEdit() {
  const [state] = useState(() => { const db = readDb(); const line = findLine(db, readRouteId()); return { line, block: line ? editBlockReason(db, line) : '' }; });
  const { line, block } = state;
  useEffect(() => {
    if (!line) location.replace(LIST_URL + '?missing=1');
    else if (block) location.replace(purchasePriceDetailPath(line.code) + '?blocked=1');
  }, [line, block]);
  const L = priceLayout([{ label: 'Cập nhật dòng giá nhập' }]);
  return (
    <AppLayout menu={L.menu} sidebar={L.sidebar} descriptions={PRICE_DESCRIPTIONS} breadcrumb={L.breadcrumb}>
      {line && !block ? <LineEditForm line={line} /> : null}
    </AppLayout>
  );
}
