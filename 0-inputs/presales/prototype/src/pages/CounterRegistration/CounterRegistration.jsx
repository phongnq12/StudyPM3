/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* WEB-60 · Counter visit registration — React version
 * The page frame is drawn once (memo); interactive parts are handled by engine.js — engine.js still edits the DOM directly (see HANDOFF.md). */
import { memo, useEffect, useState } from 'react';
import AppLayout from '@/layout/AppLayout';
import { Svg } from '@/lib/icons';
import { AppButtonWithIcon } from '@/components/app/AppButton';
import { msg } from '@/lib/msg';   /* message theo mã */
import '@/styles/form.css';
import './CounterRegistration.css';
import './popup.css';
import { MENU, SIDEBAR, BREADCRUMB, DESCRIPTIONS } from './menuConfig';
import {
  boot, render, openCardSwipe, typeLookup, lookupRelative, applyVisitTypeDuration, openVisitDatePicker, selectToday, countCharacters, previousStep,
} from './engine';
import {
  CompanionTable, SummaryTable, StudentList, ParticipantList, LookupResult, WaitCheckInButton, AddCompanionButton, NextButtonAt, LookupButton, RouteChoice, ExemptionCard,
} from './blocks';
import PagePopups from './popups';
import VisitConditionsLink from '@/components/app/VisitConditions';
import Pm1SyncBar from '@/components/app/Pm1SyncBar';
import NotifyRecipientsField from '@/components/app/NotifyRecipientsField';
import { S as ENGINE_STATE, setNotifyRecipients, counterState, changeCounter } from './engine';
import { activeCounters } from '@/data/receptionDeskStore';
import { counterLabel } from '@/lib/tableTimeline';
import { RichText as CounterRichText } from '@/lib/richText';
import SearchableSelect from '@/components/app/AppSearchSelect';
import { useStore } from './blocks';
import { recordNotifyField } from '@/data/notificationStore';

/* mục chọn thông báo của lịch đăng ký tại quầy — Cán bộ tổ thăm gặp và người nhận thêm; thân nhân nhận theo lịch khi lịch được duyệt */
function CounterNotifyField() {
  useStore();   /* vẽ lại khi đổi luồng đăng ký */
  const [v, setV] = useState(() => ({ ...ENGINE_STATE.notifyRecipients }));
  const f = recordNotifyField(ENGINE_STATE.route, v);   /* đơn cần xin duyệt ⇒ thêm Trưởng cơ sở bắt buộc */
  const cs = counterState(), records = f.records.length ? f.records.map((r) => ({ ...r, counterCode: cs.resource && cs.resource.counter ? cs.resource.counter.code : '' })) : [{ counterCode: cs.resource && cs.resource.counter ? cs.resource.counter.code : '' }];   /* ⑳: khoá cán bộ phụ trách quầy */
  return <NotifyRecipientsField id="nhanThongBao" label="Người nhận thông báo của lịch hẹn" code={f.code} groups={f.groups} records={records} value={f.value}
    onChange={(x) => { setV(x); setNotifyRecipients(x); }}
    hint="Đơn xin ngoại lệ gửi duyệt: Báo Cán bộ tổ thăm gặp, Trưởng cơ sở và người nhận thêm ở đây. Lịch đăng ký vào thẳng Đã duyệt: Báo thân nhân thuộc lịch hẹn." />;
}

/* ô Quầy tiếp đón — vẽ lại theo trạng thái engine (useStore) */
function CounterSelect() {
  useStore();
  const { resource, warning } = counterState();
  return <>
    <SearchableSelect id="oQuay" disabled={!resource} value={resource && resource.counter ? resource.counter.code : ''} onChange={changeCounter}
      options={[{ label: resource ? 'Chọn quầy tiếp đón' : 'Chọn người cai nghiện trước', value: '' }].concat(activeCounters().map((c) => ({ label: counterLabel(c), value: c.code })))} />
    <span className="field-error" id="oQuayLoi" />
    {warning && <div className="eff is-warning" id="canhBaoQuay"><CounterRichText text={warning} /></div>}
  </>;
}

const ICON_CALENDAR = '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>';
const ICON_BACK = '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>';
const goToList = () => { location.href = '/lich-hen/tham-gap-truc-tiep'; };
const hideForever = (el) => { if (el) el.style.setProperty('display', 'none', 'important'); };

const StepMarker = ({ step, title, active }) => (
  <div className={'step' + (active ? ' is-current' : '')} data-b={step}>
    <span className="step-number">{step}</span>{' '}
    <span className="step-title">{title}</span>
  </div>
);
const BackStepButton = ({ id }) => <AppButtonWithIcon className="form-btn is-hidden-block" id={id} onClick={previousStep} iconRaw={ICON_BACK}>Quay lại bước trước</AppButtonWithIcon>;
const FieldLabel =({ text, required = true }) => <label className="field-label">{text}{required ? <span className="required-mark">*</span> : null}</label>;

const PageFrame = memo(function PageFrame() {
  return (
    <>
      <div className="page-head">
        <AppButtonWithIcon className="page-head-back" onClick={goToList} title="Quay lại danh sách lịch hẹn thăm gặp trực tiếp" aria-label="Quay lại" iconRaw={ICON_BACK} />
        <div className="page-head-text"><h1>Đăng ký lượt thăm gặp tại quầy</h1></div>
        {/* cùng bộ nút với chân trang — engine.js ẩn hiện cặp id / id+Dau như nhau */}
        <div className="page-head-actions"><WaitCheckInButton id="nutCho" /><NextButtonAt steps={[3]} /></div>
      </div>
      <div className="missing-hint is-hidden-block" id="nhacThieu" />

      <div className="stepper" id="daiBuoc" onClick={(e) => { const el = e.target.closest('.step.is-done'); const cur = document.querySelector('#daiBuoc .step.is-current'); if (!el || !cur) return; for (let k = +cur.dataset.b; k > +el.dataset.b; k--) previousStep(); }}>
        <StepMarker step={1} title="Người nghiện và thân nhân" active />
        <div className="step-line" />
        <StepMarker step={2} title="Khung giờ và buồng thăm gặp" />
        <div className="step-line" />
        <StepMarker step={3} title="Đối chiếu và xác nhận" />
      </div>

      <div className="card" data-buoc="1">
        <h2 className="card-title">Nguồn đặt lịch</h2>
        <div className="option-group">
          <div className="locked-value" title="Nguồn đặt lịch của màn này là cố định, không đổi được">
            <Svg raw={'<path d="M20 6 9 17l-5-5"/>'} />{' Đăng ký tại quầy '}
          </div>
        </div>
      </div>

      {/* chọn luồng ngay từ đầu */}
      <div className="card" data-buoc="1" id="khoiLuong">
        <h2 className="card-title">Luồng đăng ký<span className="required-mark">*</span></h2>
        <RouteChoice />
      </div>

      <div className="card" data-buoc="1" id="khoiXinDuyet" style={{ display: 'none' }}>
        <h2 className="card-title">Đơn xin Trưởng cơ sở duyệt</h2>
        <ExemptionCard />
      </div>

      <div className="card" data-buoc="1" id="khoiTraCuuTN" style={{ display: 'none' }}>
        <h2 className="card-title">Thân nhân người cai nghiện</h2>
        <div className="lookup">
          <div className="lookup-field">
            {' '}<input className="text-input" id="oTraCuu" placeholder="Nhập số căn cước công dân hoặc số điện thoại (Đây là mục bắt buộc)"
              onInput={(e) => typeLookup(e.currentTarget.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); lookupRelative(); } }} />{' '}
            <AppButtonWithIcon className="lookup-scan" onClick={openCardSwipe} title="Quẹt thẻ căn cước công dân" aria-label="Quẹt thẻ"
              iconRaw={'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>'} />{' '}
          </div>
          <div className="input-error" id="loiTraCuu" />
          <LookupButton />
        </div>
        <div id="ketQuaTra"><LookupResult /></div>
      </div>

      <div className="card is-hidden" id="khoiNCN" data-buoc="1">
        <div className="card-title-row"><h2 className="card-title">Người cai nghiện</h2><span className="card-title-tools"><Pm1SyncBar onSync={render} /><VisitConditionsLink /></span></div>
        <div className="student-list" id="dsNCN"><StudentList /></div>
      </div>

      <div className="card is-hidden-block" data-buoc="1" ref={hideForever}>
        <h2 className="card-title">Người cai nghiện và thân nhân</h2>
        <div className="form-grid">
          <div className="field span-12">
            <FieldLabel text="Người cai nghiện" />
            <div className="select-field">
              {' '}<select className="text-input" id="oNguoiCN">
                <option value="">Chọn người cai nghiện</option>
                <option value="HS-00412">Trần Văn Bình — 001189004412 — 12/04/1989</option>
                <option value="HS-00518">Lê Minh Cường — 001192005518 — 27/09/1992</option>
                <option value="HS-00623">Phạm Quốc Dũng — 001186006623 — 03/01/1986</option>
              </select>{' '}
            </div>{' '}
            <span className="field-hint">Chọn xong hệ thống sẽ báo ngay nếu người này chưa đủ điều kiện thăm gặp</span>
          </div>
          <div className="field span-6">
            <FieldLabel text="Thân nhân người cai nghiện" />
            <div className="select-field">{' '}<select className="text-input" id="oThanNhan" disabled><option>Chọn người cai nghiện trước</option></select>{' '}</div>{' '}
            <span className="field-hint">Danh sách chỉ gồm thân nhân đã được duyệt liên kết với người cai nghiện này</span>
          </div>
          <div className="field span-6">
            <FieldLabel text="Quan hệ nhân thân" required={false} />
            <input className="text-input" id="oQuanHe" defaultValue="" disabled />
          </div>
        </div>
      </div>

      <div className="card is-hidden" id="khoiDiCung" data-buoc="1">
        <h2 className="card-title">Thân nhân đi cùng</h2>
        <CompanionTable />
        <AddCompanionButton />
      </div>

      {/* gộp 2 khối của bước 2 về 1 khối — Ngày thăm gặp đứng ngay trước lưới khung giờ phụ thuộc nó */}
      <div className="card" data-buoc="2">
        <h2 className="card-title">Khung giờ và buồng thăm gặp</h2>
        <div className="form-grid">
          <div className="field span-4">
            <FieldLabel text="Loại hình thăm gặp" />
            <div className="select-field">{' '}<select className="text-input" id="oLoaiHinh" onChange={applyVisitTypeDuration} defaultValue="Thăm gặp trực tiếp tiêu chuẩn"><option value="">Chọn loại hình thăm gặp</option><option>Thăm gặp trực tiếp tiêu chuẩn</option></select>{' '}</div>
          </div>
          {/* Dãy nhà theo người cai nghiện, chỉ đọc. Quầy: mặc định theo dãy nhà, chọn được quầy Hoạt động khác */}
          <div className="field span-4">
            <label className="field-label">Dãy nhà</label>
            <div className="select-field is-readonly">{' '}<input className="text-input" id="oDayNha" readOnly defaultValue="" />{' '}</div>
          </div>
          <div className="field span-4">
            <FieldLabel text="Quầy tiếp đón" />
            <CounterSelect />
          </div>
          <div className="field span-4">
            <FieldLabel text="Ngày thăm gặp" />
            <div className="date-row">
              {' '}<AppButtonWithIcon htmlType="button" className="text-input date-input" id="nutNgayHen" onClick={openVisitDatePicker} iconClassName="date-icon" iconRaw={ICON_CALENDAR}>
                <span id="nhanNgayHen">Chọn ngày hẹn</span>
              </AppButtonWithIcon>{' '}
              <a className="quick-link" data-onclick="1" onClick={selectToday}>Chọn ngày hôm nay</a>{' '}
            </div>
          </div>
          {/* Ô Thời lượng ẩn hẳn: thời lượng chỉnh bằng kéo mép khối trên lịch theo buồng */}
          <div className="field span-4" style={{ display: 'none' }}>
            <FieldLabel text="Thời lượng" />
            <div className="select-field">{' '}<select className="text-input" id="oThoiLuong" disabled><option>Chọn người cai nghiện trước</option></select>{' '}</div>
          </div>
          <select id="oGioBatDau" style={{ display: 'none' }}><option>Chọn thời lượng trước</option></select>
          <input id="oGioKetThuc" defaultValue="" style={{ display: 'none' }} />
          <div className="span-12" id="khoiLuoiGio" style={{ display: 'none' }}>
            {' '}<div className="form-grid-title">Lịch theo buồng trong ngày</div>{' '}
            <div id="luoiGio" />{' '}
            <span className="field-hint" id="nhacGio" />{' '}
          </div>
          <div className="span-12" id="nhacChuaDu">
            {' '}<div className="hours-empty" id="nhacChuaDuChu">{msg('I001-74')}</div>{' '}
          </div>
          <div className="field span-4 is-hidden" id="khoiThoiGian">
            <label className="field-label">Khung giờ</label>
            <div className="select-field is-readonly">{' '}<input className="text-input" id="oThoiGianDaChon" readOnly placeholder="Chọn chỗ trống trên lịch" />{' '}</div>
          </div>
          <div className="field span-4 is-hidden" id="khoiBan">
            <label className="field-label">Buồng thăm gặp</label>
            <div className="select-field is-readonly">{' '}<input className="text-input" id="oBanDaChon" readOnly placeholder="Chọn chỗ trống trên lịch" />{' '}</div>
          </div>
        </div>
      </div>

      <div className="card is-hidden-block" data-buoc="3">
        <h2 className="card-title">Đối chiếu CCCD/Giấy tờ tùy thân của thân nhân</h2>
        <div id="dsNguoiThamGia"><ParticipantList /></div>
        <div id="khoiVuot" />
      </div>

      {/* bước 3 chia khối và xếp thứ tự theo màn Tạo */}
      <div className="card is-hidden-block" data-buoc="3">
        <h2 className="card-title">Người cai nghiện và thân nhân</h2>
        <div className="adjust" id="bangDoiChieu"><SummaryTable group={0} /></div>
      </div>

      <div className="card is-hidden-block" data-buoc="3">
        <h2 className="card-title">Khung giờ và buồng thăm gặp</h2>
        <div className="adjust" id="bangDoiChieuLich"><SummaryTable group={1} /></div>
        <div id="canhSuat" />
      </div>

      <div className="card" data-buoc="3">
        <h2 className="card-title">Thông tin khác</h2>
        <div className="form-grid">
          <div className="field span-12">
            <label className="field-label">Ghi chú của cán bộ</label>
            {/* cùng khuôn AppCounterInput multiline — ô không điều khiển nên engine.js countCharacters cập nhật bộ đếm */}
            <span className="app-counter-wrap is-multiline">
              <textarea className="text-input" id="oGhiChu" rows={3} placeholder="Nhập ghi chú thêm về lượt thăm gặp nếu cần" maxLength={1000} onInput={(e) => countCharacters(e.currentTarget)} />
              <span className="app-counter-foot"><span className="app-counter" id="demGhiChu" aria-hidden="true">0 / 1000</span></span>
            </span>
          </div>
        </div>
      </div>

      <div className="card" data-buoc="3">
        <h2 className="card-title">Gửi thông báo</h2>
        <CounterNotifyField />
      </div>

      {/* Quay lại bước trước và Tiếp tục ở cuối nội dung bước (engine ẩn hiện nutLui theo bước) */}
      <div className="step-nav">
        <BackStepButton id="nutLui" />
        <div className="step-nav-spacer" />
        <NextButtonAt steps={[1, 2]} />
      </div>
    </>
  );
});

export default function CounterRegistration() {
  useEffect(() => { boot(); }, []);
  return (
    <AppLayout menu={MENU} sidebar={SIDEBAR} descriptions={DESCRIPTIONS} overlays={<PagePopups />}
      breadcrumb={BREADCRUMB}>
      <PageFrame />
    </AppLayout>
  );
}
