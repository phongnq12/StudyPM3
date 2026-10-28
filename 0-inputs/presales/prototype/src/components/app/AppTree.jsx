/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Cây thư mục, cây tổ chức — bọc antd Tree như bộ App* (góp ý Designer).
 * Có đường nối cấp, mở/đóng từng nhánh, chọn 1 nút. Chưa màn PM2 nào dùng.
 * treeData: [{ key, title, children? }] · defaultExpandedKeys · onSelect(key) */
import { Tree } from 'antd';
import './AppExtraControls.css';

/**
 * Thuộc tính của AppTree (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {array} props.treeData - Dữ liệu cây, mỗi nút `{ key, title, children }`.
 * @param {array} props.defaultExpandedKeys - Danh sách khoá các nhánh mở sẵn khi hiện cây.
 * @param {boolean} props.defaultExpandAll - Mở sẵn mọi nhánh khi hiện cây.
 * @param {function} props.onSelect - Gọi khi người dùng chọn 1 nút, nhận khoá của nút được chọn.
 */
export default function AppTree({ treeData = [], defaultExpandedKeys, defaultExpandAll = false, onSelect, ...rest }) {
  return <Tree className="app-tree" data-fe="AppTree" showLine blockNode treeData={treeData}
    defaultExpandedKeys={defaultExpandedKeys} defaultExpandAll={defaultExpandAll}
    onSelect={(keys) => onSelect && onSelect(keys[0])} {...rest} />;
}
