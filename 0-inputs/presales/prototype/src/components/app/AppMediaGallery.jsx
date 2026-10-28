/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Hiển thị ảnh và video — lưới ảnh thu nhỏ, bấm để xem lớn trong hộp (góp ý Designer:
 * PM2 giám sát cuộc gọi video nên cần chỗ xem bản ghi và ảnh). Chưa màn PM2 nào dùng — chờ SRS màn giám sát.
 * items: [{ key, type: 'image' | 'video', src?, poster?, title, meta?, duration? }] — thiếu src thì hiện ô giữ chỗ cùng icon. */
import { useState } from 'react';
import AppModal from './AppModal';
import DialogCloseButton from './DialogCloseButton';
import { Svg } from '@/lib/icons';
import './AppExtraControls.css';

function Thumb({ it, onOpen }) {
  const pic = it.type === 'video' ? it.poster : it.src;
  return <button type="button" className="app-media-thumb" onClick={() => onOpen(it)} aria-label={(it.type === 'video' ? 'Xem video ' : 'Xem ảnh ') + it.title}>
    <span className="app-media-pic">
      {pic ? <img src={pic} alt="" /> : <Svg name={it.type === 'video' ? 'video' : 'file'} />}
      {it.type === 'video' ? <span className="app-media-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span> : null}
      {it.duration ? <span className="app-media-dur">{it.duration}</span> : null}
    </span>
    <span className="app-media-cap"><span className="app-media-title">{it.title}</span>{it.meta ? <span className="app-media-meta">{it.meta}</span> : null}</span>
  </button>;
}

/**
 * Thuộc tính của AppMediaGallery (mô tả hiện ở bảng thuộc tính trên Design System).
 * @param {object} props
 * @param {string} props.id - Mã của hộp xem lớn, cũng làm tiền tố mã tiêu đề hộp.
 * @param {array} props.items - Danh sách ảnh và video `{ key, type, src, poster, title, meta, duration }`, thiếu `src` thì hiện ô giữ chỗ kèm icon.
 */
export default function AppMediaGallery({ id = 'mediaXem', items = [] }) {
  const [view, setView] = useState(null);
  return <>
    <div className="app-media-grid">{items.map((it) => <Thumb key={it.key} it={it} onOpen={setView} />)}</div>
    <AppModal id={id} open={!!view} onClose={() => setView(null)} labelledBy={id + 'TieuDe'} dlgClassName="dlg app-media-dlg">
      {view ? <>
        <div className="dlg-h"><h3 id={id + 'TieuDe'} className="dlg-t">{view.title}</h3><DialogCloseButton onClick={() => setView(null)} /></div>
        <div className="dlg-b">
          <div className="app-media-stage">
            {view.type === 'video'
              ? (view.src ? <video src={view.src} poster={view.poster} controls /> : <span className="app-media-empty"><Svg name="video" />Chưa có tệp bản ghi</span>)
              : (view.src ? <img src={view.src} alt={view.title} /> : <span className="app-media-empty"><Svg name="file" />Chưa có tệp ảnh</span>)}
          </div>
          {view.meta ? <div className="app-media-meta">{view.meta}</div> : null}
        </div>
      </> : null}
    </AppModal>
  </>;
}
