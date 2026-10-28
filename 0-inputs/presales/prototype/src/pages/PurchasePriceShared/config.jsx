/* PM3 · Giá nhập theo nhà cung cấp — cấu hình dùng chung của 4 màn (Danh sách, Thêm đợt, Chi tiết, Cập nhật) */
import AppTag from '@/components/app/AppTag';
import { goodsLayout, PURCHASE_PRICE_LABEL } from '@/layout/menuConfig';
import { ROUTES } from '@/routes';
import {
  EFFECT, EFFECT_CLASS, LOCK, LOCK_CLASS, PROPOSAL_STATUS, PROPOSAL_STATUS_CLASS,
} from '@/data/purchasePriceStore';

export const LIST_URL = ROUTES.purchasePriceList;
export const MISSING_TEXT = 'Dòng giá nhập không còn tồn tại. Vui lòng tải lại danh sách';
/* Hệ quả của hai lựa chọn ở hộp Quyết định giá bán */
export const KEEP_HINT = 'Không tạo đề xuất: Giá bán giữ nguyên. Nhập kho và đặt hàng được ngay từ ngày hiệu lực';
export const CREATE_HINT = 'Tạo đề xuất: Từ ngày hiệu lực, mặt hàng bị khóa đặt hàng cho tới khi Trưởng cơ sở duyệt hoặc từ chối. Nhập kho vẫn được nhưng lô nhập về chưa bán được';

/* Khung nhóm Hàng hóa và giá; extra = các mục breadcrumb sau «Giá nhập» */
export function priceLayout(extra = []) {
  const L = goodsLayout(PURCHASE_PRICE_LABEL);
  const tail = extra.length ? [{ label: PURCHASE_PRICE_LABEL, href: LIST_URL }, ...extra] : [{ label: PURCHASE_PRICE_LABEL }];
  return { menu: L.menu, sidebar: L.sidebar, breadcrumb: [...L.breadcrumb, ...tail] };
}

/* Chữ gợi ý theo nhãn nút */
export const PRICE_DESCRIPTIONS = {
  'Xuất Excel': 'Tải toàn bộ dòng giá nhập khớp bộ lọc hiện hành ra tệp Excel',
  'Thêm đợt giá nhập': 'Khai đợt giá nhập mới cho nhiều mặt hàng của một nhà cung cấp, theo một căn cứ',
  'Thêm mặt hàng': 'Thêm một dòng mặt hàng vào đợt',
  'Thêm tất cả mặt hàng': 'Thêm mọi mặt hàng đang hoạt động của nhà cung cấp chưa có trong đợt',
  'Tìm kiếm': 'Lọc danh sách theo điều kiện đã chọn',
  'Xóa bộ lọc': 'Bỏ mọi điều kiện lọc',
  'Hủy': 'Hủy thao tác, không lưu thay đổi',
  'Quay lại': 'Quay lại danh sách giá nhập',
  'Chỉnh sửa': 'Sửa dòng giá nhập khi phiếu đề xuất giá bán gắn dòng còn Nháp',
  'Trang trước': 'Xem trang trước',
  'Trang sau': 'Xem trang sau',
};

export const PRICE_ICONS = {
  tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><path d="M7 7h.01"/>',
  view: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  delete: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  save: '<polyline points="20 6 9 17 4 12"/>',
  back: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  file: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  remove: '<path d="M18 6 6 18M6 6l12 12"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
};

const DotTag = ({ cls, children }) => <AppTag className={'tag tag-dot ' + cls}>{children}</AppTag>;
export const EffectTag = ({ value }) => <DotTag cls={EFFECT_CLASS[value]}>{EFFECT[value]}</DotTag>;
export const ProposalStatusTag = ({ value }) => <DotTag cls={PROPOSAL_STATUS_CLASS[value]}>{PROPOSAL_STATUS[value]}</DotTag>;
export const LockTag = ({ value }) => <DotTag cls={LOCK_CLASS[value]}>{LOCK[value]}</DotTag>;
export const Blank = () => <span className="is-blank">—</span>;

/* Nút bị vô hiệu vẫn hiện, rê chuột thấy lý do — bọc ngoài để tooltip chạy cả khi nút đang khoá */
export const TipWrap = ({ tip, children }) => (tip ? <span className="pp-tip" data-full={tip}>{children}</span> : children);
