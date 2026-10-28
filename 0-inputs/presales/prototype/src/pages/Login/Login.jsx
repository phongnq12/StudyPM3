/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Màn đăng nhập (PM3 dùng lại khuôn PM2) — bố cục như PM1 STG /dang-nhap: nửa trái giới thiệu hệ thống, nửa phải thẻ form.
 * Tài khoản giả lập duy nhất ở accountStore (DEMO_LOGIN). Đăng nhập xong về ?next= hoặc Giá nhập, vẫn đổi vai qua menu góc phải.
 * Chữ form chép từ PM1; chữ nửa trái AI soạn theo Business Concept PM2; thông báo lỗi lấy từ Message List (E001-01 · SE001-05). */
import { useEffect, useRef, useState } from 'react';
import logo from '@/assets/logo-cand.svg';
import { Svg } from '@/lib/icons';
import { msg } from '@/lib/msg';
import { notifyInDevelopment } from '@/lib/legacyUi';
import { DEMO_LOGIN, isLoggedIn, login } from '@/data/accountStore';
import { ROUTES } from '@/routes';
import './Login.css';

const FEATURES = [
  { label: 'Hàng hóa và giá', icon: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z"/><path d="M7 7h.01"/>' },
  { label: 'Nhập kho', icon: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/>' },
  { label: 'Đặt hàng nhà cung cấp', icon: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>' },
  { label: 'Bán hàng căng tin', icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' },
];

/* chỉ nhận đường dẫn trong trang, không cho ?next= trỏ ra ngoài */
const nextPath = () => {
  const n = new URLSearchParams(location.search).get('next') || '';
  return n.startsWith('/') && !n.startsWith('//') && !n.startsWith(ROUTES.login) ? n : ROUTES.purchasePriceList;
};

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [busy, setBusy] = useState(false);
  const userRef = useRef(null);
  const pwRef = useRef(null);

  useEffect(() => {
    document.title = 'Đăng nhập · Quản lý kho căng tin';
    if (isLoggedIn() && !navigator.webdriver) { location.replace(nextPath()); return; }
    userRef.current && userRef.current.focus();
  }, []);

  const caps = (e) => setCapsOn(!!(e.getModifierState && e.getModifierState('CapsLock')));

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!username.trim()) er.username = msg('E001-01', 'tên đăng nhập');
    if (!password) er.password = msg('E001-01', 'mật khẩu');
    setErrors(er); setAuthError('');
    if (er.username) { userRef.current.focus(); return; }
    if (er.password) { pwRef.current.focus(); return; }
    setBusy(true);
    setTimeout(() => {   /* chờ ngắn như gọi máy chủ thật, chống bấm liên tiếp */
      if (login(username, password, remember)) { location.href = nextPath(); return; }
      setBusy(false); setAuthError(msg('SE001-05'));
      setPassword(''); pwRef.current && pwRef.current.focus();
    }, 450);
  };

  return (
    <div className="lg">
      <section className="lg-hero" aria-label="Giới thiệu hệ thống">
        <div className="lg-orb lg-orb-a" aria-hidden="true" />
        <div className="lg-orb lg-orb-b" aria-hidden="true" />
        <div className="lg-hero-in">
          <div className="lg-emblem"><img src={logo} alt="Quốc huy" /></div>
          <h1 className="lg-sys">HỆ THỐNG QUẢN LÝ<br />KHO CĂNG TIN</h1>
          <div className="lg-rule" aria-hidden="true" />
          <p className="lg-lead">Hỗ trợ Cơ sở cai nghiện ma túy quản lý hàng hóa, giá nhập, giá bán và tồn kho căng tin phục vụ người cai nghiện</p>
          <ul className="lg-feat">
            {FEATURES.map((f) => <li key={f.label}><Svg raw={f.icon} /><span>{f.label}</span></li>)}
          </ul>
        </div>
        <div className="lg-hero-ft">© 2026 Trung tâm Dữ liệu Quốc gia</div>
      </section>

      <main className="lg-side">
        <form className="lg-card" onSubmit={submit} noValidate>
          <h2 className="lg-title">Đăng nhập</h2>
          <p className="lg-sub">Vui lòng nhập thông tin tài khoản của bạn</p>

          {authError && <div className="lg-alert" role="alert"><Svg raw={'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'} /><span>{authError}</span></div>}

          <div className="lg-field">
            <label htmlFor="lgUser">Tên đăng nhập<span className="required-mark">*</span></label>
            <input id="lgUser" ref={userRef} name="username" autoComplete="username" placeholder="Nhập tên đăng nhập..." value={username}
              className={errors.username ? 'is-err' : ''} aria-invalid={!!errors.username} aria-describedby={errors.username ? 'lgUserErr' : undefined}
              onChange={(e) => { setUsername(e.target.value); if (errors.username) setErrors({ ...errors, username: '' }); }} />
            {errors.username && <div className="lg-err" id="lgUserErr">{errors.username}</div>}
          </div>

          <div className="lg-field">
            <label htmlFor="lgPw">Mật khẩu<span className="required-mark">*</span></label>
            <div className="lg-pw">
              <input id="lgPw" ref={pwRef} name="password" type={showPw ? 'text' : 'password'} autoComplete="current-password" placeholder="Nhập mật khẩu..." value={password}
                className={errors.password ? 'is-err' : ''} aria-invalid={!!errors.password} aria-describedby={errors.password ? 'lgPwErr' : capsOn ? 'lgCaps' : undefined}
                onKeyUp={caps} onKeyDown={caps}
                onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: '' }); }} />
              <button type="button" className="lg-eye" aria-pressed={showPw} aria-label={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} title={showPw ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => { setShowPw(!showPw); pwRef.current && pwRef.current.focus(); }}>
                <Svg raw={showPw
                  ? '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
                  : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>'} />
              </button>
            </div>
            {errors.password && <div className="lg-err" id="lgPwErr">{errors.password}</div>}
            {!errors.password && capsOn && <div className="lg-caps" id="lgCaps">Đang bật Caps Lock</div>}
          </div>

          <label className="lg-remember"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Ghi nhớ đăng nhập</span></label>

          <button type="submit" className="lg-btn" disabled={busy} aria-busy={busy}>
            {busy && <span className="lg-spin" aria-hidden="true" />}{busy ? 'Đang đăng nhập' : 'Đăng nhập'}
          </button>

          <div className="lg-or"><span>hoặc</span></div>

          <button type="button" className="lg-sso" onClick={notifyInDevelopment}>
            <Svg raw={'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'} />Đăng nhập SSO
          </button>

          <p className="lg-demo">Bản Prototype · tài khoản dùng thử: <b>{DEMO_LOGIN.username}</b></p>
        </form>
        <div className="lg-side-ft">© Cục C04 — Bộ Công an</div>
      </main>
      <div className="toast-area" id="vungToast" aria-live="polite" />
    </div>
  );
}
