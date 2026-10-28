/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Link «Tra cứu điều kiện thăm gặp» + popup — đặt ở góc phải tiêu đề khối NGƯỜI CAI NGHIỆN của màn Tạo mới / Chỉnh sửa / Đăng ký tại quầy.
 * Cùng khuôn với popup «Hướng dẫn thao tác» của tab Lịch theo buồng (GridGuide.jsx): mỗi dòng 1 điều kiện · căn cứ · dòng lưu ý xám nhạt.
 * Nội dung lấy từ chuỗi điều kiện của BPD Thăm gặp trực tiếp (BRD-APP-03 + 5.1 đến 5.4 bổ sung), đúng thứ tự hệ thống kiểm. */
import { useState } from 'react';
import AppModal from '@/components/app/AppModal';
import { AppButton } from '@/components/app/AppButton';
import { VISIT_CONDITIONS } from '@/lib/visitEligibility';
import { Svg } from '@/lib/icons';
import './VisitConditions.css';
import DialogCloseButton from '@/components/app/DialogCloseButton';

export default function VisitConditionsLink() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a className="visit-conditions-link" id="lnkDieuKienThamGap" role="button" tabIndex={0} onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); } }}>Tra cứu điều kiện thăm gặp</a>
      <AppModal id="dlgDieuKienThamGap" open={open} onClose={() => setOpen(false)} dlgClassName="dlg visit-conditions-dlg">
        <div className="dlg-h"><h3>Điều kiện thăm gặp</h3>
          <DialogCloseButton onClick={() => setOpen(false)} /></div>
        <div className="dlg-b visit-conditions-body">
          <div className="missing-hint visit-conditions-intro"><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'} /><div>Người cai nghiện phải đạt đủ các điều kiện dưới đây mới đặt được lịch thăm gặp. Hệ thống kiểm theo thứ tự từ trên xuống và dừng ở điều kiện đầu tiên không đạt, lý do hiện ngay trên thẻ người cai nghiện.</div></div>
          <ul className="visit-conditions-rows">
            {VISIT_CONDITIONS.map((c, i) => (
              <li key={c.code} className="visit-conditions-row-wrap">
                {i === 0 || VISIT_CONDITIONS[i - 1].group !== c.group ? <div className="visit-conditions-group">{c.group}</div> : null}
                <div className="visit-conditions-row">
                <span className="visit-conditions-code">{i + 1}</span>
                <span className="visit-conditions-text"><span className="visit-conditions-name">{c.title}</span><span className="visit-conditions-desc">{c.detail}</span></span>
                <span className="visit-conditions-source">{c.source}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="visit-conditions-note">Điều kiện về tài khoản và hồ sơ của thân nhân được kiểm ở thẻ thân nhân. Chưa đủ điều kiện thì quỹ thăm gặp hiện 0 và thẻ người cai nghiện bị khoá.</div>
        </div>
        <div className="dlg-f"><AppButton className="btn" onClick={() => setOpen(false)}>Quay lại</AppButton></div>
      </AppModal>
    </>
  );
}
