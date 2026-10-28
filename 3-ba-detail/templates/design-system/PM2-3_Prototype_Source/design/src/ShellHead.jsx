/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Đầu trang dùng chung các trang Design System — đúng khuôn shell-head của màn thật */
import { Svg } from '@/lib/icons';

export default function ShellHead({ icon, title, sub, children }) {
  return <div className="shell-head"><div className="shell-title"><Svg name={icon} /><div className="shell-text"><h1>{title}</h1><p className="shell-sub">{sub}</p></div></div>{children ? <div className="head-actions">{children}</div> : null}</div>;
}
