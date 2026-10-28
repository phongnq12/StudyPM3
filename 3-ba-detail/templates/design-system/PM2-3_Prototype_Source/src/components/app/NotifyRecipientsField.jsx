/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* NotifyRecipientsField — trường «Gửi thông báo cho» dùng chung.
 * Có ở mục Gửi thông báo của lịch hẹn (Tạo/Sửa, Đăng ký tại quầy) và ở mỗi popup thao tác (Phê duyệt, Từ chối duyệt, Hủy, Điều chỉnh, kéo thả, Vắng mặt).
 * Mỗi nhóm người nhận 1 dòng: ô tick (mặc định tick, bỏ tick ⇒ không gửi cho nhóm đó) + 1 ô CHỌN NHIỀU dùng chung với màn khác
 * (AppSelect mode=multiple như ô Dãy nhà phục vụ của màn Quầy) — giá trị mặc định do luồng đặt, thêm hay bỏ người ngay trong ô.
 * Nhóm bắt buộc (REQUIRED_GROUPS): đang tick thì phải có ít nhất 1 người, thiếu ⇒ chữ đỏ E001-02 (nơi gọi chặn lưu bằng notifyMissing).
 * code: mã thông báo của thao tác — đang Tắt ở màn Cài đặt thông báo thì ẩn cả trường. groups: bỏ trống ⇒ lấy theo thao tác. */
import AppSelect from './AppSelect';
import { RECIPIENTS, isNotificationEnabled } from '@/data/notificationSettingsStore';
import { REQUIRED_GROUPS, candidatesOf, groupsFor, isGroupOff, mandatoryOf } from '@/data/notificationStore';
import { msg } from '@/lib/msg';
import './NotifyRecipientsField.css';

const PLACEHOLDER = { VISIT_TEAM: 'Chọn cán bộ tổ thăm gặp', RELATIVE: 'Chọn thân nhân thuộc lịch hẹn', FACILITY_HEAD: 'Chọn Trưởng cơ sở', EXTRA: 'Chọn cán bộ nhận thêm' };

/**
 * Thuộc tính của NotifyRecipientsField (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Id của khối trường, cũng là tiền tố id ô chọn mỗi nhóm `{id}-{nhóm}`.
 * @param {string} props.code - Mã thông báo của thao tác, đang tắt ở Cài đặt thông báo thì ẩn cả trường và dùng để suy nhóm, người bắt buộc.
 * @param {array} props.groups - Danh sách mã nhóm người nhận cần hiện, bỏ trống thì lấy theo `code` và `records`.
 * @param {array} props.records - Bản ghi đang thao tác, dùng để suy nhóm, danh sách người gợi ý và người bắt buộc nhận.
 * @param {object} props.value - Người nhận theo từng nhóm dạng `{ [nhóm]: [id], off: [nhóm bỏ tick] }`.
 * @param {function} props.onChange - Gọi khi tick hoặc bỏ tick nhóm, hay đổi người trong ô chọn, nhận object giá trị mới đã trộn thay đổi.
 * @param {string} props.label - Nhãn của trường.
 * @param {string} props.hint - Chữ hướng dẫn dưới trường, bỏ trống thì dùng câu mặc định về nhóm và người bắt buộc.
 */
export default function NotifyRecipientsField({ id, code, groups, records, value, onChange, label = 'Gửi thông báo cho', hint }) {
  if (code && !isNotificationEnabled(code)) return null;
  const shown = groups || groupsFor(code, records);
  if (!shown.length) return null;
  const v = value || {};
  const set = (patch) => onChange && onChange({ ...v, ...patch });
  const toggle = (g, on) => set({ off: on ? (v.off || []).filter((x) => x !== g) : (v.off || []).concat(g) });
  return (
    <div className="fld notify-field" id={id}>
      <label>{label}</label>
      <div className="notify-groups">
        {/* 2 khối cho người dùng thấy rõ — nhóm theo luồng nghiệp vụ và người nhận thêm; không bắt thao tác */}
        {[['Gửi theo mặc định', shown.filter((g) => g !== 'EXTRA')], ['Gửi thêm', shown.filter((g) => g === 'EXTRA')]].filter(([, list]) => list.length).map(([blockTitle, list]) => (
        <div className="notify-block" key={blockTitle} data-block={blockTitle}>
        <div className="notify-block-title">{blockTitle}</div>
        {list.map((g) => {
          /* người bắt buộc nhận (người vận hành chính) khoá trong ô — tag không có nút bỏ, nhóm có người bắt buộc thì ô tick khoá */
          const locked = mandatoryOf(code, records, g);
          /* nhóm bắt buộc (*) ⇒ ô tick khoá ở trạng thái tick, không bỏ được; chỉ nhóm đang tick VÀ có tên người mới được gửi */
          const required = REQUIRED_GROUPS.indexOf(g) >= 0 || locked.length > 0;
          /* ⑳: người bắt buộc (cán bộ phụ trách quầy …) luôn hiện trong ô dù giá trị đang giữ thiếu họ */
          const off = !required && isGroupOff(v, g), chosen = locked.concat((v[g] || []).filter((x) => locked.indexOf(x) < 0));
          const all = candidatesOf(g, records);
          /* người đã chọn mà không còn trong danh sách gợi ý (vd thân nhân đã đổi) vẫn hiện để bỏ được */
          const options = all.map((c) => ({ value: c.id, label: c.label, disabled: locked.indexOf(c.id) >= 0 })).concat(chosen.filter((x) => !all.some((c) => c.id === x)).map((x) => ({ value: x, label: x, disabled: locked.indexOf(x) >= 0 })));
          const missing = !off && required && !chosen.length;
          return (
            <div className={'notify-group' + (off ? ' is-off' : '')} key={g} data-group={g}>
              <label className="chk notify-group-label">
                <input type="checkbox" checked={!off} disabled={required} title={required ? 'Nhóm bắt buộc nhận thông báo, không bỏ tick được' : undefined} onChange={(e) => toggle(g, e.target.checked)} />
                <span>{RECIPIENTS[g]}{required && <span className="required-mark">*</span>}</span>
              </label>
              <div className="notify-group-body">
                <AppSelect id={id + '-' + g} mode="multiple" showSearch optionFilterProp="label" style={{ width: '100%' }} disabled={off}
                  placeholder={PLACEHOLDER[g]} options={options} value={chosen} onChange={(list) => set({ [g]: locked.filter((x) => list.indexOf(x) < 0).concat(list) })} status={missing ? 'error' : undefined} />
                {missing && <span className="field-error on">{msg('E001-02', RECIPIENTS[g].toLowerCase() + ' nhận thông báo')}</span>}
              </div>
            </div>
          );
        })}
        </div>))}
      </div>
      <span className="hint">{hint || 'Mặc định theo luồng nghiệp vụ. Nhóm bắt buộc (*) không bỏ tick được, người bắt buộc nhận (cán bộ phụ trách quầy, thân nhân đăng ký) không bỏ được. Chỉ gửi cho người có tên trong ô của nhóm đang tick, nhóm bỏ tick thì không gửi dù trong ô có tên.'}</span>
    </div>
  );
}
