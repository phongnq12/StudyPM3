/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Ô nhập chữ có bộ đếm "n / max": ô 1 dòng thì bộ đếm nằm trong ô sát phải, textarea thì bộ đếm dưới ô canh phải.
 * Textarea: dưới ô là 1 HÀNG CHÂN [chữ đỏ | bộ đếm] — chữ đỏ canh trái sát ô 4px, bộ đếm canh phải, cùng 1 hàng; chữ đỏ dài xuống dòng bên trái, không đè bộ đếm
 * (chữ đỏ đặt sát ô, không trôi xuống xa). error: phần tử chữ đỏ của nơi gọi (giữ nguyên id, lớp field-error) — không lỗi thì hàng chân chỉ có bộ đếm như cũ.
 * Ô 1 dòng: error bỏ qua, chữ đỏ vẫn đặt dưới ô như hiện nay. */
import './AppCounterInput.css';

/**
 * Thuộc tính của AppCounterInput (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {boolean} props.multiline - Dùng textarea với bộ đếm ở hàng chân dưới ô thay cho ô 1 dòng có bộ đếm nằm trong ô.
 * @param {number} props.maxLength - Số ký tự tối đa được nhập, đồng thời là mẫu số của bộ đếm `n / max`.
 * @param {string} props.value - Nội dung ô nhập, độ dài của nó là tử số của bộ đếm.
 * @param {string} props.counterId - Id gán cho phần tử bộ đếm.
 * @param {string} props.className - Lớp bổ sung, ghép sau lớp `text-input` của ô nhập.
 * @param {object} props.style - Style của ô nhập, ô 1 dòng luôn bị ghi đè `paddingRight` để chừa chỗ cho bộ đếm.
 * @param {ReactNode} props.error - Chữ đỏ đặt bên trái bộ đếm ở hàng chân, chỉ dùng khi `multiline` bật, ô 1 dòng bỏ qua.
 */
export default function AppCounterInput({ multiline = false, maxLength, value = '', counterId, className = '', style, error = null, ...rest }) {
  const text = String(value || '').length + ' / ' + maxLength;
  const counter = <span className="app-counter" id={counterId} aria-hidden="true">{text}</span>;
  if (multiline) {
    return <span className="app-counter-wrap is-multiline">
      <textarea className={'text-input ' + className} maxLength={maxLength} value={value} style={style} {...rest} />
      <span className="app-counter-foot">{error}{counter}</span>
    </span>;
  }
  const room = 'calc(' + (String(maxLength).length * 2 + 3) + 'ch + 16px)';
  return <span className="app-counter-wrap">
    <input className={'text-input ' + className} maxLength={maxLength} value={value} style={{ ...style, paddingRight: room }} {...rest} />
    {counter}
  </span>;
}
