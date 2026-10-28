/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
/* Khung «Ví dụ» của từng mục — học HeroUI: mỗi biến thể hoặc trạng thái 1 ví dụ chạy component thật, code ngay bên dưới.
 * Dữ liệu ví dụ nằm ở design/src/examples/Examples*.jsx (tách file để nhiều phiên không sửa chồng catalog.jsx). Tên tiếng Anh (luật). */
import { Component } from 'react';
import { Frame } from './GuidePages';
import A from './examples/ExamplesA';
import B from './examples/ExamplesB';
import C from './examples/ExamplesC';
import D from './examples/ExamplesD';
import E from './examples/ExamplesE';   /* date-time */
import F from './examples/ExamplesF';   /* 9 control còn thiếu ví dụ */
import './ItemExamples.css';

const ALL = { ...A, ...B, ...C, ...D, ...E, ...F };
export const exampleCount = (id) => (ALL[id] ? ALL[id].length : 0);

/* 1 ví dụ hỏng thì chỉ ô đó báo lỗi, cả trang vẫn chạy */
class Guard extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() { return this.state.err ? <span className="sd-muted">Ví dụ chưa chạy được: {String(this.state.err.message || this.state.err)}</span> : this.props.children; }
}

export function ItemExamples({ id }) {
  const list = ALL[id];
  if (!list || !list.length) return null;
  return <Frame title={'Examples (Ví dụ) · ' + list.length}>
    <div className="sd-ex-grid">{list.map((ex, i) => { const Demo = ex.Demo; return <div className="sd-ex" key={i}>
      <div className="sd-ex-head"><span className="sd-ex-title">{ex.title}</span>{ex.desc ? <span className="sd-ex-desc">{ex.desc}</span> : null}</div>
      <div className="sd-ex-stage"><Guard><Demo /></Guard></div>
      <pre className="sd-code sd-ex-code"><code>{ex.code}</code></pre>
    </div>; })}</div>
  </Frame>;
}
