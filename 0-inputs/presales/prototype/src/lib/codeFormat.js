/* Copyright © 2026 TrangNT5 — All Rights Reserved. */
import { msg } from './msg.js';
/* Mã nhập tay của danh mục (mã quầy, mã buồng): khuôn và câu lỗi theo Message List MSG-VL-07 */
export const CODE_MAX = 10;
export const CODE_PATTERN = /^[A-Z0-9_-]+$/;
export const CODE_HINT = 'Chữ cái in HOA, số, dấu gạch ngang và gạch dưới';
export const CODE_FORMAT_ERROR = msg('E001-08');   /* message theo mã */
