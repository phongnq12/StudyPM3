/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô chọn theo cây — bọc antd TreeSelect như bộ App*, đối chiếu Design System PM1.
 * Dùng khi giá trị nằm trong cây nhiều cấp (đơn vị › phòng ban › tổ). Có tìm, dòng 36px, danh sách cao tối đa 260px như ô chọn có tìm.
 * treeData: [{ value, title, children? }] · multiple: chọn nhiều nhánh */
import { TreeSelect } from 'antd';
import './AppPm1Controls.css';

/**
 * Thuộc tính của AppTreeSelect (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.treeData - Cây lựa chọn dạng `{ value, title, children }`, ô tìm lọc theo `title`.
 * @param {string | array} props.value - Giá trị đang chọn, là 1 giá trị khi chọn đơn hoặc mảng giá trị khi bật `multiple`.
 * @param {function} props.onChange - Gọi khi người dùng chọn, bỏ chọn hoặc xoá, chuyển thẳng tới `onChange` của antd TreeSelect.
 * @param {string} props.placeholder - Chữ gợi ý khi chưa chọn, đồng thời làm `aria-label` mặc định của ô.
 * @param {boolean} props.multiple - Cho chọn nhiều nhánh bằng ô tích, chỉ hiện nút cha khi chọn đủ nhánh con và gom thẻ thừa thành số.
 */
export default function AppTreeSelect({ treeData = [], value, onChange, placeholder, multiple = false, ...rest }) {
  return <TreeSelect className="app-tree-select" data-fe="AppTreeSelect" treeData={treeData} value={value} onChange={onChange}
    placeholder={placeholder} showSearch treeNodeFilterProp="title" allowClear listHeight={260} popupMatchSelectWidth
    multiple={multiple} treeCheckable={multiple} showCheckedStrategy={TreeSelect.SHOW_PARENT} maxTagCount={multiple ? 'responsive' : undefined}
    style={{ width: '100%' }} aria-label={placeholder} {...rest} />;   /* tên đọc màn hình cho ô tìm bên trong (WCAG 4.1.2 — cổng axe «label»); nơi gọi truyền aria-label riêng thì đè */
}
