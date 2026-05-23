// ==UserScript==
// @name         TNG All-in-One v9.3.7 Keep Action Center UX Fix
// @version      9.3.7
// @description  Keep Action Center, restore NK search v9.1, compact Fill NS, MaHang postback/TKC/5 sao
// @match        https://bangluong.tng.vn/*
// @match        http://bangluong.tng.vn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ══════════════════════════════════════════
    //  CONFIG
    // ══════════════════════════════════════════

    const SHORTCUTS = {
        'LN': { url: 'https://bangluong.tng.vn/BangTinhLuongCN',        label: 'Lương ngày',      icon: '💰' },
        'LT': { url: 'https://bangluong.tng.vn/bangluongthang',         label: 'Lương tháng',     icon: '📅' },
        'NS': { url: 'https://bangluong.tng.vn/NangSuatCongNhan',       label: 'Năng suất CN',    icon: '📊' },
        'CD': { url: 'https://bangluong.tng.vn/TongHopCongDoan',        label: 'Tổng hợp CĐ',    icon: '📋' },
        'TG': { url: 'https://bangluong.tng.vn/NhapThoiGian',           label: 'Nhập thời gian',  icon: '⏱️' },
        'TN': { url: 'https://bangluong.tng.vn/TongThuongNam',          label: 'Tổng thưởng năm', icon: '🎁' },
        'XH': { url: 'https://bangluong.tng.vn/MTKN_XepHang_CongNhan', label: 'Xếp hạng CN',    icon: '🏆' },
        'CL': { url: 'https://bangluong.tng.vn/CongDiLamCongNhan',      label: 'Công đi làm CN',  icon: '🗓️' },
        'NK': { url: 'https://bangluong.tng.vn/NhapNhayKhau',           label: 'Nhập nhảy khâu',  icon: '🧵' },
    };

    const path = window.location.pathname.toLowerCase();
    const mob = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // ══════════════════════════════════════════
    //  INJECT STYLES
    // ══════════════════════════════════════════

    const css = document.createElement('style');
    css.textContent = `
        :root {
            --tng-pri: #6366f1; --tng-pri2: #818cf8;
            --tng-ok: #10b981;  --tng-ok2: #059669;
            --tng-err: #ef4444; --tng-err2: #dc2626;
            --tng-font: -apple-system, 'SF Pro Display', 'Helvetica Neue', system-ui, sans-serif;
            --tng-shadow: 0 12px 40px rgba(0,0,0,.22);
            --tng-shadow-sm: 0 4px 16px rgba(0,0,0,.12);
            --tng-glass: rgba(255,255,255,.92);
            --tng-r: 20px;
            --safe-b: env(safe-area-inset-bottom, 0px);
            --safe-l: env(safe-area-inset-left, 0px);
            --safe-r: env(safe-area-inset-right, 0px);
        }
        @keyframes tng-in     { from{opacity:0;transform:translateY(8px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes tng-up     { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tng-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.35)} 50%{box-shadow:0 0 0 10px rgba(99,102,241,0)} }
        @keyframes tng-spin   { to{transform:rotate(360deg)} }
        @keyframes tng-pop    { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        @keyframes tng-fadein { from{opacity:0} to{opacity:1} }

        .tng-fab {
            position: fixed;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            z-index: 100000;
            transition: all .28s cubic-bezier(.4,0,.2,1);
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        }
        .tng-fab:active { transform: scale(.88); }

        /* Glass panel – shared */
        .tng-glass {
            background: var(--tng-glass);
            -webkit-backdrop-filter: blur(28px) saturate(1.9);
            backdrop-filter: blur(28px) saturate(1.9);
            border: 1px solid rgba(255,255,255,.45);
            border-radius: var(--tng-r);
            box-shadow: var(--tng-shadow);
        }

        /* Mobile bottom-sheet panel */
        .tng-sheet {
            position: fixed !important;
            left: 0 !important; right: 0 !important; bottom: 0 !important;
            border-radius: 24px 24px 0 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding-bottom: calc(16px + var(--safe-b)) !important;
            animation: tng-up .3s cubic-bezier(.32,1,.23,1);
        }
        .tng-sheet-handle {
            width: 40px; height: 5px; border-radius: 3px;
            background: rgba(0,0,0,.12);
            margin: 0 auto 14px;
        }

        /* Desktop panel */
        .tng-desktop-panel {
            animation: tng-in .25s ease;
        }

        .tng-inp {
            width: 100%;
            padding: ${mob ? '14px 16px' : '10px 14px'};
            font: 500 ${mob ? 17 : 15}px var(--tng-font);
            border: 1.5px solid #e2e8f0;
            border-radius: 14px;
            outline: 0;
            box-sizing: border-box;
            background: #fff;
            color: #1e293b;
            transition: all .2s;
            -webkit-appearance: none;
            appearance: none;
        }
        .tng-inp:focus { border-color: var(--tng-pri); box-shadow: 0 0 0 4px rgba(99,102,241,.1); }
        .tng-inp::placeholder { color: #a0aec0; font-weight: 400; }

        .tng-btn1 {
            width: 100%;
            padding: ${mob ? '16px' : '12px'};
            font: 700 ${mob ? 16 : 14}px var(--tng-font);
            background: linear-gradient(135deg,var(--tng-pri),var(--tng-pri2));
            color: #fff; border: 0; border-radius: 14px;
            cursor: pointer; transition: all .3s;
            position: relative; overflow: hidden;
            -webkit-tap-highlight-color: transparent;
        }
        .tng-btn1:active { transform: scale(.97); }
        .tng-btn1:disabled { opacity: .6; cursor: not-allowed; }
        .tng-btn1.ok { background: linear-gradient(135deg,var(--tng-ok),#34d399) !important; }

        .tng-st { font: 500 13px var(--tng-font); text-align: center; padding: 8px 12px; border-radius: 12px; margin-top: 8px; transition: all .3s; }
        .tng-st.i { background: rgba(99,102,241,.08); color: var(--tng-pri); }
        .tng-st.s { background: rgba(16,185,129,.1); color: var(--tng-ok2); animation: tng-pop .3s; }
        .tng-st.e { background: rgba(239,68,68,.08); color: var(--tng-err); }

        .tng-pw { width: 100%; height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden; margin-top: 10px; }
        .tng-pb { height: 100%; background: linear-gradient(90deg,var(--tng-pri),var(--tng-ok)); border-radius: 3px; transition: width .12s; }

        .tng-tw { display: flex; align-items: center; gap: 10px; font: 500 14px var(--tng-font); color: #475569; cursor: pointer; padding: 8px 0; -webkit-tap-highlight-color: transparent; }
        .tng-tg { position: relative; width: 48px; height: 28px; background: #cbd5e1; border-radius: 14px; transition: background .2s; cursor: pointer; flex-shrink: 0; }
        .tng-tg::after { content: ''; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px; background: #fff; border-radius: 50%; transition: transform .22s cubic-bezier(.4,0,.2,1); box-shadow: 0 1px 4px rgba(0,0,0,.2); }
        .tng-tg.on { background: var(--tng-pri); }
        .tng-tg.on::after { transform: translateX(20px); }

        .tng-kbd { position: fixed; bottom: 16px; right: 72px; background: linear-gradient(135deg,var(--tng-pri),var(--tng-pri2)); color: #fff; padding: 6px 14px; border-radius: 10px; font: 700 13px 'SF Mono','Fira Code',monospace; z-index: 99999; box-shadow: var(--tng-shadow); display: none; animation: tng-in .2s; letter-spacing: 1px; }

        /* Shortcut cell */
        .tng-cell {
            display: flex; flex-direction: column; align-items: center;
            gap: ${mob ? 6 : 5}px;
            padding: ${mob ? '14px 4px 12px' : '12px 2px 8px'};
            border: 0; cursor: pointer;
            border-radius: ${mob ? 18 : 14}px;
            transition: all .22s cubic-bezier(.4,0,.2,1);
            -webkit-tap-highlight-color: transparent;
            position: relative; overflow: hidden;
            touch-action: manipulation;
        }
        .tng-cell:active { transform: scale(.91); }

        /* Calendar */
        .tng-cal { user-select: none; -webkit-user-select: none; }
        .tng-cal-hdr { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .tng-cal-nav { width: 34px; height: 34px; border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff; cursor: pointer; font-size: 13px; color: #475569; display: flex; align-items: center; justify-content: center; transition: all .15s; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .tng-cal-nav:active { transform: scale(.9); background: #f1f5f9; }
        .tng-cal-title { font: 700 15px var(--tng-font); color: #1e293b; }
        .tng-cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 3px; text-align: center; }
        .tng-cal-dow { font: 600 11px var(--tng-font); color: #94a3b8; padding: 5px 0; }
        .tng-cal-day { font: 500 ${mob ? 15 : 13}px var(--tng-font); color: #334155; padding: ${mob ? 9 : 6}px 0; border-radius: 10px; cursor: pointer; transition: all .15s; border: 0; background: 0; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .tng-cal-day:active { transform: scale(.85); }
        .tng-cal-day.today { font-weight: 700; color: var(--tng-pri); background: rgba(99,102,241,.1); }
        .tng-cal-day.selected { background: var(--tng-pri) !important; color: #fff !important; font-weight: 700; }
        .tng-cal-day.other { color: #cbd5e1; }

        /* Row badges for NS */
        .tng-row-badge {
            display: inline-flex; align-items: center; justify-content: center;
            width: 22px; height: 22px; border-radius: 50%;
            font: 700 11px var(--tng-font); color: #64748b;
            background: #f1f5f9; border: 1.5px solid #e2e8f0;
            position: absolute; left: -28px; top: 50%; transform: translateY(-50%);
            z-index: 10; transition: all .2s; pointer-events: none;
        }
        .tng-row-badge.excluded { background: #fef2f2; color: #ef4444; border-color: #fca5a5; font-weight: 800; }
        tr.tng-selectable { cursor: pointer; transition: background .15s; position: relative; }
        tr.tng-selectable:active { background: rgba(99,102,241,.06) !important; }
        tr.tng-excluded { background: rgba(239,68,68,.06) !important; outline: 2px solid rgba(239,68,68,.25) !important; outline-offset: -1px; }
        tr.tng-excluded td:first-child { position: relative; }

        /* Search filter highlight */
        tr.tng-match { background: #fffbeb !important; }
        tr.tng-match-cur { background: #fef3c7 !important; outline: 2px solid #f59e0b !important; outline-offset: -1px; }
    `;
    document.head.appendChild(css);

    // ══════════════════════════════════════════
    //  HELPERS
    // ══════════════════════════════════════════

    const $ = (tag, styles) => {
        const e = document.createElement(tag);
        if (styles) Object.assign(e.style, styles);
        return e;
    };

    function formatDateDDMMYYYY(y, m, d) {
        return String(d).padStart(2,'0') + '/' + String(m+1).padStart(2,'0') + '/' + y;
    }

    // ══════════════════════════════════════════
    //  PAGE DETECTION
    // ══════════════════════════════════════════

    const isLogin   = () => path === '/' || path === '' || path.includes('/account/login') || path.includes('/login');
    const isCanhBao = () => {
        const b = (document.body?.innerText || '').toLowerCase();
        return path.includes('/canhbao') || b.includes('phòng chống lừa đảo') || b.includes('4 không');
    };
    const isSSLWarn = () => {
        const b = (document.body?.innerText || '').toLowerCase();
        const kw = ['your connection is not private','kết nối của bạn không phải là kết nối riêng tư','net::err_cert','sec_error'];
        return kw.some(k => b.includes(k)) && !!(document.querySelector('#details-button') || document.querySelector('#advancedButton') || document.querySelector('[id*="proceed"]'));
    };
    const isNS = () => path.includes('/nangsuatcongnhan');
    const isNK = () => path.includes('/nhapnhaykhau');

    // ══════════════════════════════════════════
    //  MODULE 0: BYPASS SSL
    // ══════════════════════════════════════════

    function bypassSSL() {
        ['#details-button','#advancedButton','button[id*="advance"]'].forEach(s => {
            const b = document.querySelector(s); if (b) b.click();
        });
        setTimeout(() => {
            ['#proceed-link','#exceptionDialogButton','a[id*="proceed"]','button[id*="proceed"]'].forEach(s => {
                const b = document.querySelector(s); if (b) { b.click(); return; }
            });
        }, 500);
    }

    // ══════════════════════════════════════════
    //  MODULE 1: AUTO LOGIN
    // ══════════════════════════════════════════

    function autoLogin() {
        const flag = 'tng_login_done';
        if (sessionStorage.getItem(flag) === path) return;
        setTimeout(() => {
            for (const b of document.querySelectorAll('button, input[type="submit"], a.btn, .btn')) {
                if (/NHÂN VIÊN ĐĂNG NHẬP|Đăng nhập|Login|Sign in/i.test((b.textContent || b.value || '').trim())) {
                    sessionStorage.setItem(flag, path);
                    b.click(); return;
                }
            }
        }, 500);
    }

    // ══════════════════════════════════════════
    //  MODULE 2: AUTO THOÁT CẢNH BÁO
    // ══════════════════════════════════════════

    function autoCanhBao() {
        function click() {
            for (const e of document.querySelectorAll('button, a, .btn')) {
                const t = (e.textContent || e.value || '').trim().toLowerCase();
                if (t === 'thoát' || t === 'thoat') { e.click(); return true; }
            }
            return false;
        }
        if (click()) return;
        const obs = new MutationObserver(() => { if (click()) obs.disconnect(); });
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => obs.disconnect(), 5000);
    }

    // ══════════════════════════════════════════
    //  MODULE 3: ENABLE NĂNG SUẤT INPUTS
    // ══════════════════════════════════════════

    function enableNS() {
        const SEL = 'input[disabled][id*="gridNangSuatToMay"],textarea[disabled][id*="gridNangSuatToMay"],select[disabled][id*="gridNangSuatToMay"],input[readonly][id*="gridNangSuatToMay"],textarea[readonly][id*="gridNangSuatToMay"]';
        function unlock() {
            document.querySelectorAll(SEL).forEach(e => {
                e.disabled = false; e.removeAttribute('disabled'); e.removeAttribute('readonly');
                e.readOnly = false; e.classList.remove('aspNetDisabled');
                e.style.pointerEvents = ''; e.style.backgroundColor = ''; e.tabIndex = 0;
            });
        }
        unlock();
        let unlockTimer = 0;
        function throttledUnlock() { if (!unlockTimer) { unlockTimer = setTimeout(() => { unlockTimer = 0; unlock(); }, 150); } }
        new MutationObserver(throttledUnlock).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled','readonly'] });
        let n = 0;
        const t = setInterval(() => {
            if (typeof Sys !== 'undefined' && Sys.WebForms?.PageRequestManager) {
                Sys.WebForms.PageRequestManager.getInstance().add_endRequest(unlock); clearInterval(t);
            }
            if (++n >= 10) clearInterval(t);
        }, 1000);
    }

    // ══════════════════════════════════════════
    //  MODULE 3b: AUTO UNLOCK DATE INPUTS
    // ══════════════════════════════════════════

    const DATE_SEL = 'input[id*="Ngay"],input[id*="ngay"],input[id*="Date"],input[id*="date"],input[id*="txtTu"],input[id*="txtDen"],input[name*="Ngay"],input[name*="ngay"]';

    function getDateInputs() {
        return Array.from(document.querySelectorAll(DATE_SEL)).filter(el => {
            const t = (el.type || '').toLowerCase();
            return t === 'text' || t === 'date' || t === '';
        });
    }

    function unlockDateInputs() {
        const inputs = getDateInputs();
        let count = 0;
        inputs.forEach(el => {
            if (el.disabled || el.readOnly) count++;
            el.disabled = false; el.removeAttribute('disabled');
            el.readOnly = false; el.removeAttribute('readonly');
            el.classList.remove('aspNetDisabled');
            el.style.pointerEvents = ''; el.style.backgroundColor = '#fffbeb';
            el.tabIndex = 0;
        });
        document.querySelectorAll('select[id*="Ngay"],select[id*="ngay"],select[disabled][id*="Thang"],select[disabled][id*="thang"],select[disabled][id*="Nam"],select[disabled][id*="nam"]').forEach(el => {
            if (el.disabled) count++;
            el.disabled = false; el.removeAttribute('disabled');
            el.removeAttribute('readonly'); el.classList.remove('aspNetDisabled');
        });
        return { total: inputs.length, unlocked: count };
    }

    function autoUnlockDates() {
        unlockDateInputs();
        let n = 0;
        const t = setInterval(() => {
            if (typeof Sys !== 'undefined' && Sys.WebForms?.PageRequestManager) {
                Sys.WebForms.PageRequestManager.getInstance().add_endRequest(() => unlockDateInputs());
                clearInterval(t);
            }
            if (++n >= 10) clearInterval(t);
        }, 1000);
        let timer = 0;
        new MutationObserver(() => {
            if (!timer) timer = setTimeout(() => { timer = 0; unlockDateInputs(); }, 300);
        }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled','readonly'] });
    }

    // ══════════════════════════════════════════
    //  MODULE 4: FILL NĂNG SUẤT (v9.3.7)
    // ══════════════════════════════════════════

    function fillNS() {
        
        if (!isNS()) return;
const SEL = 'input[id*="txtThucHien_NhanVienToMay"]';

        function setVal(el, v) {
            el.disabled = false; el.removeAttribute('disabled');
            el.readOnly = false; el.removeAttribute('readonly');
            el.classList.remove('aspNetDisabled');
            const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            if (d?.set) d.set.call(el, v); else el.value = v;
            ['focus','input','change','blur'].forEach(n => el.dispatchEvent(new Event(n, { bubbles: true })));
        }

        function clickSave() {
            for (const b of document.querySelectorAll('button, input[type="submit"], .btn')) {
                if (/^(Lưu|Luu|Save|Cập nhật|Cap nhat|Update)$/i.test((b.textContent || b.value || '').trim())) { b.click(); return; }
            }
        }

        const ADV_ID = {
            maHang: 'MainContent_ddlMaHang',
            tkc: 'MainContent_cmbThietkeChuyen',
            lanDG: 'MainContent_ddlLanDanhGia',
            diemDG: 'MainContent_cmbDiemDanhGia',
            btnDG: 'MainContent_ibtnDanhGia'
        };
        const ADV_LS = {
            tkc: 'tng_v933_tkc',
            auto5: 'tng_v933_auto5',
            collapsed: 'tng_v933_adv_collapsed'
        };
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const byId = id => document.getElementById(id);
        function noDiaNS(s) {
            try { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim(); }
            catch(e) { return String(s || '').toLowerCase().trim(); }
        }
        function fireNS(el) {
            if (!el) return;
            ['focus','input','change','blur'].forEach(n => { try { el.dispatchEvent(new Event(n, { bubbles:true, cancelable:true })); } catch(e){} });
            try { if (window.jQuery) window.jQuery(el).trigger('change'); } catch(e) {}
            try { if (typeof el.onchange === 'function') el.onchange.call(el); } catch(e) {}
        }
        function setSelectExact(id, wanted) {
            const sel = byId(id);
            if (!sel || !wanted) return false;
            const q = noDiaNS(wanted);
            let found = null;
            Array.from(sel.options || []).forEach((opt, idx) => {
                const text = noDiaNS(opt.textContent);
                const val = noDiaNS(opt.value);
                if (!found && (text === q || val === q || text.includes(q) || q.includes(text) || val.includes(q))) found = { opt, idx };
            });
            if (!found) return false;
            sel.disabled = false; sel.removeAttribute('disabled');
            sel.selectedIndex = found.idx; sel.value = found.opt.value; found.opt.selected = true;
            try { const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value'); if (d?.set) d.set.call(sel, found.opt.value); } catch(e) {}
            fireNS(sel);
            return true;
        }
        function waitForAspNetOrDom(timeout = 3500) {
            return new Promise(resolve => {
                let done = false;
                const finish = () => { if (!done) { done = true; try { obs.disconnect(); } catch(e) {} resolve(true); } };
                const obs = new MutationObserver(() => finish());
                try { obs.observe(document.body, { childList:true, subtree:true }); } catch(e) {}
                try {
                    if (typeof Sys !== 'undefined' && Sys.WebForms?.PageRequestManager) {
                        const prm = Sys.WebForms.PageRequestManager.getInstance();
                        const handler = () => { try { prm.remove_endRequest(handler); } catch(e) {} finish(); };
                        prm.add_endRequest(handler);
                    }
                } catch(e) {}
                setTimeout(() => { if (!done) resolve(false); try { obs.disconnect(); } catch(e) {} }, timeout);
            });
        }
        async function postBackSelectExact(id) {
            const sel = byId(id);
            if (!sel) return false;
            const before = document.querySelectorAll(SEL).length;
            const onchange = sel.getAttribute('onchange') || '';
            try {
                if (onchange && onchange.includes('__doPostBack')) {
                    new Function(onchange).call(sel);
                    await waitForAspNetOrDom(4500);
                    return true;
                }
            } catch(e) {}
            try {
                if (typeof window.__doPostBack === 'function') {
                    window.__doPostBack(sel.name || id, '');
                    await waitForAspNetOrDom(4500);
                    return true;
                }
            } catch(e) {}
            await sleep(before ? 700 : 1200);
            return false;
        }
        function getSelectOptionsExact(id, keyword) {
            const sel = byId(id); if (!sel) return [];
            const q = noDiaNS(keyword || '');
            return Array.from(sel.options || []).map(o => ({ value:o.value || '', text:(o.textContent || o.value || '').trim() })).filter(o => {
                const t = noDiaNS(o.text + ' ' + o.value);
                if (!o.text || o.value === '-1') return false;
                if (q && !t.includes(q)) return false;
                return true;
            });
        }
        function renderSelectExact(target, sourceId, keyword, emptyText, lastText) {
            target.innerHTML = '';
            const empty = document.createElement('option'); empty.value = ''; empty.textContent = emptyText; target.appendChild(empty);
            getSelectOptionsExact(sourceId, keyword).forEach(o => {
                const opt = document.createElement('option'); opt.value = o.text; opt.textContent = o.text;
                if (lastText && noDiaNS(lastText) === noDiaNS(o.text)) opt.selected = true;
                target.appendChild(opt);
            });
        }
        async function applyMaHangNow(maText, statusEl) {
            if (!maText) return false;
            const realSel = byId(ADV_ID.maHang);
            if (!realSel) { if (statusEl) { statusEl.style.display='block'; statusEl.className='tng-st e'; statusEl.textContent='⚠️ Không thấy ô mã hàng của web'; } return false; }
            const oldVal = realSel.value;
            if (statusEl) { statusEl.style.display='block'; statusEl.className='tng-st i'; statusEl.textContent='Đang đổi mã hàng trên web...'; }
            const ok = setSelectExact(ADV_ID.maHang, maText);
            if (!ok) { if (statusEl) { statusEl.className='tng-st e'; statusEl.textContent='⚠️ Không chọn được mã hàng'; } return false; }
            // Với dropdown ASP.NET, đổi value tại DOM chưa đủ. Phải postback để web tải lại công đoạn/khâu.
            await postBackSelectExact(ADV_ID.maHang);
            await sleep(700);
            const afterSel = byId(ADV_ID.maHang);
            const changed = afterSel && afterSel.value !== oldVal;
            if (statusEl) { statusEl.className='tng-st s'; statusEl.textContent='✅ Đã gửi yêu cầu đổi mã hàng. Nếu khâu chưa hiện, đợi web tải xong.'; }
            return changed || ok;
        }
        async function auto5SaoExact(statusEl) {
            const diem = byId(ADV_ID.diemDG);
            if (!diem) { if (statusEl) statusEl.textContent = '⚠️ Không thấy ô điểm đánh giá'; return false; }
            const ok = setSelectExact(ADV_ID.diemDG, '5 sao');
            await sleep(150);
            const btnDG = byId(ADV_ID.btnDG);
            if (btnDG) { btnDG.disabled = false; btnDG.removeAttribute('disabled'); try { btnDG.click(); } catch(e) { fireNS(btnDG); } }
            if (statusEl) statusEl.textContent = ok ? '⭐ Đã chọn 5 sao' : '⚠️ Không chọn được 5 sao';
            return ok;
        }

        function getRowsWithInputs() {
            const inputs = Array.from(document.querySelectorAll(SEL));
            const rows = [];
            inputs.forEach((inp, idx) => {
                const tr = inp.closest('tr');
                if (tr) rows.push({ tr, input: inp, index: idx });
            });
            return rows;
        }

        const excludedRows = new Set();
        let rowBadges = [];
        let selectMode = false;

        const selCss = document.createElement('style');
        selCss.textContent = `
            tr.tng-selectable:active { background: rgba(99,102,241,.06) !important; }
        `;
        document.head.appendChild(selCss);

        function enableRowSelection() {
            disableRowSelection();
            const rows = getRowsWithInputs();
            rows.forEach(({ tr, index }) => {
                tr.classList.add('tng-selectable');
                if (excludedRows.has(index)) tr.classList.add('tng-excluded');
                const firstTd = tr.querySelector('td');
                if (firstTd) {
                    firstTd.style.position = 'relative';
                    const badge = document.createElement('span');
                    badge.className = 'tng-row-badge' + (excludedRows.has(index) ? ' excluded' : '');
                    badge.textContent = index + 1;
                    badge.style.pointerEvents = 'none';
                    firstTd.appendChild(badge);
                    rowBadges.push({ badge, td: firstTd });
                }
                const handler = (e) => {
                    if (!selectMode) return;
                    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
                    e.preventDefault();
                    if (excludedRows.has(index)) {
                        excludedRows.delete(index);
                        tr.classList.remove('tng-excluded');
                        const b = tr.querySelector('.tng-row-badge'); if (b) b.classList.remove('excluded');
                    } else {
                        excludedRows.add(index);
                        tr.classList.add('tng-excluded');
                        const b = tr.querySelector('.tng-row-badge'); if (b) b.classList.add('excluded');
                    }
                    updateExcludeInfo();
                };
                tr.addEventListener('click', handler);
                tr._tngHandler = handler;
            });
            selectMode = true;
        }

        function disableRowSelection() {
            selectMode = false;
            rowBadges.forEach(({ badge }) => badge.remove());
            rowBadges = [];
            document.querySelectorAll('tr.tng-selectable').forEach(tr => {
                tr.classList.remove('tng-selectable', 'tng-excluded');
                if (tr._tngHandler) { tr.removeEventListener('click', tr._tngHandler); delete tr._tngHandler; }
            });
        }

        const wait = setInterval(() => {
            if (!document.querySelectorAll(SEL).length && !document.getElementById('MainContent_ddlMaHang')) return;
            clearInterval(wait); buildFillUI();
        }, 500);
        setTimeout(() => clearInterval(wait), 15000);

        let updateExcludeInfo = () => {};

        function buildFillUI() {
            
        if (typeof isNS === 'function' && !isNS()) return;
// FAB NS — bottom-left with safe area
            const wrap = $('div', {
                position: 'fixed',
                bottom: mob ? 'calc(80px + env(safe-area-inset-bottom, 0px))' : '14px',
                left: mob ? '12px' : '10px',
                zIndex: '100000',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'flex-start'
            });

            let floatingDone = null;

            const fab = $('div');
            fab.className = 'tng-fab';
            Object.assign(fab.style, {
                background: 'linear-gradient(135deg,var(--tng-ok),#34d399)',
                color: '#fff',
                width: mob ? '52px' : '44px',
                height: mob ? '52px' : '44px',
                fontSize: mob ? '24px' : '18px',
                boxShadow: '0 4px 20px rgba(16,185,129,.4)'
            });
            fab.textContent = '📋';
            wrap.appendChild(fab);

            const panel = $('div');
            panel.className = 'tng-glass';
            if (mob) {
                panel.style.cssText = `display:none;box-sizing:border-box;padding:10px 10px calc(10px + env(safe-area-inset-bottom, 0px));position:fixed;left:10px;right:10px;bottom:calc(72px + env(safe-area-inset-bottom,0px));border-radius:20px;z-index:100001;max-height:58vh;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;animation:tng-up .3s cubic-bezier(.32,1,.23,1);`;
            } else {
                panel.style.cssText = 'display:none;box-sizing:border-box;padding:14px;min-width:300px;max-width:360px;position:absolute;bottom:54px;left:0;max-height:76vh;overflow-y:auto;overflow-x:hidden;animation:tng-in .25s ease;';
            }

            // Handle (mobile)
            if (mob) {
                const handle = $('div');
                handle.style.cssText = 'width:44px;height:5px;border-radius:3px;background:rgba(0,0,0,.12);margin:0 auto 14px;';
                panel.appendChild(handle);
            }

            // Header
            const hdr = $('div', { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' });
            const titleEl = $('div', { fontFamily:'var(--tng-font)', fontWeight:'700', fontSize: mob ? '17px' : '15px', color:'#1e293b' });
            titleEl.innerHTML = '⚡ Fill Năng Suất';
            const ver = $('span', { fontSize:'11px', color:'#94a3b8', fontFamily:'var(--tng-font)', fontWeight:'600', background:'rgba(99,102,241,.08)', padding:'2px 8px', borderRadius:'8px' });
            ver.textContent = 'v9.3.7';
            hdr.style.position = 'sticky'; hdr.style.top = '0'; hdr.style.zIndex = '2'; hdr.style.background = 'linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,255,255,.86))'; hdr.style.backdropFilter = 'blur(16px)'; hdr.style.WebkitBackdropFilter = 'blur(16px)'; hdr.style.padding = '4px 0 8px';
            hdr.appendChild(titleEl); hdr.appendChild(ver);
            panel.appendChild(hdr);

            const totalInfo = $('div', { fontFamily:'var(--tng-font)', fontSize:'13px', color:'#64748b', textAlign:'center', marginBottom:'12px', padding:'8px', background:'rgba(241,245,249,.8)', borderRadius:'12px' });
            const totalRows = document.querySelectorAll(SEL).length;
            totalInfo.innerHTML = '📊 Tổng cộng <b style="color:var(--tng-pri)">' + totalRows + '</b> dòng năng suất';
            panel.appendChild(totalInfo);

            // Advanced compact controls: TKC + Ma hang + auto 5 sao
            const advBox = $('div', { background:'linear-gradient(180deg,rgba(236,254,255,.96),rgba(255,255,255,.98))', border:'1.5px solid rgba(14,116,144,.18)', borderRadius:'18px', padding: mob ? '9px' : '10px', marginBottom:'12px', boxShadow:'0 6px 20px rgba(15,23,42,.07)' });
            const advHead = $('div', { display:'flex', alignItems:'center', justifyContent:'space-between', gap:'8px', marginBottom:'8px' });
            const advTitle = $('b', { fontFamily:'var(--tng-font)', fontSize:'13px', color:'#0f172a' });
            advTitle.innerHTML = '⚡ Nâng cao <span style="font:700 10px var(--tng-font);color:#64748b;background:#e0f2fe;border-radius:999px;padding:2px 6px;margin-left:4px">TKC · Mã · 5⭐</span>';
            const advToggle = $('button'); advToggle.type = 'button';
            advToggle.style.cssText = 'border:0;border-radius:999px;padding:5px 10px;background:#0e7490;color:#fff;font:800 12px var(--tng-font);cursor:pointer;-webkit-tap-highlight-color:transparent;';
            advHead.appendChild(advTitle); advHead.appendChild(advToggle); advBox.appendChild(advHead);
            const advBody = $('div'); advBody.style.cssText = 'display:grid;gap:8px;'; advBox.appendChild(advBody);

            function makeAdvBlock(label, color, searchPh) {
                const block = $('div', { marginBottom:'6px' });
                const lab = $('div', { fontFamily:'var(--tng-font)', fontSize:'12px', fontWeight:'800', color, marginBottom:'4px' });
                lab.textContent = label; block.appendChild(lab);
                const search = $('input'); search.placeholder = searchPh; search.autocomplete = 'off';
                search.style.cssText = 'width:100%;box-sizing:border-box;padding:7px 9px;border:1.5px solid #d1d5db;border-radius:10px;font:600 12px var(--tng-font);margin-bottom:4px;outline:0;background:#fff;';
                const sel = $('select');
                sel.style.cssText = 'width:100%;box-sizing:border-box;padding:7px;border:1.5px solid #d1d5db;border-radius:10px;font:700 12px var(--tng-font);background:#fff;';
                block.appendChild(search); block.appendChild(sel);
                return { block, search, sel };
            }
            const tkcUI = makeAdvBlock('👤 TKC', '#7c3aed', 'Tìm TKC...');
            const maUI  = makeAdvBlock('🏷️ Mã hàng', '#0e7490', 'Tìm mã hàng hiện tại...');
            advBody.appendChild(tkcUI.block); advBody.appendChild(maUI.block);

            const advActions = $('div', { display:'flex', gap:'6px', marginBottom:'8px' });
            const refreshAdv = $('button'); refreshAdv.type='button'; refreshAdv.textContent='↻ Làm mới mã/TKC';
            refreshAdv.style.cssText = 'flex:1;padding:8px;border:1px dashed #94a3b8;border-radius:10px;background:#f8fafc;color:#475569;font:800 12px var(--tng-font);cursor:pointer;';
            advActions.appendChild(refreshAdv); advBody.appendChild(advActions);

            const auto5Wrap = $('label');
            auto5Wrap.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;padding:8px 10px;border-radius:12px;background:#fff7ed;border:1px solid #fed7aa;font:800 13px var(--tng-font);color:#9a3412;';
            const auto5Text = $('span'); auto5Text.textContent = '⭐ Auto 5 sao khi Điền tất cả';
            const auto5 = $('input'); auto5.type = 'checkbox'; auto5.style.cssText = 'width:20px;height:20px;';
            auto5.checked = localStorage.getItem(ADV_LS.auto5) !== '0';
            auto5Wrap.appendChild(auto5Text); auto5Wrap.appendChild(auto5); advBody.appendChild(auto5Wrap);
            const advStatus = $('div');
            advStatus.className = 'tng-st i';
            advStatus.style.cssText = 'display:none;margin-top:7px;font-size:12px;padding:7px 9px;';
            advBody.appendChild(advStatus);
            panel.appendChild(advBox);

            function renderAdv() {
                renderSelectExact(tkcUI.sel, ADV_ID.tkc, tkcUI.search.value, 'Không đổi TKC', localStorage.getItem(ADV_LS.tkc));
                // Mã hàng đổi thường xuyên nên không tự nhớ/chọn lại mã cũ; luôn lấy danh sách hiện tại trên web.
                renderSelectExact(maUI.sel, ADV_ID.maHang, maUI.search.value, 'Không đổi mã hàng', '');
            }
            renderAdv();
            tkcUI.search.addEventListener('input', renderAdv);
            maUI.search.addEventListener('input', renderAdv);
            refreshAdv.addEventListener('click', renderAdv);
            maUI.sel.addEventListener('change', async () => {
                const maText = maUI.sel.value;
                if (!maText) return;
                maUI.sel.disabled = true;
                await applyMaHangNow(maText, advStatus);
                maUI.sel.disabled = false;
                // Sau postback partial, danh sách có thể đổi. Làm mới lại từ DOM thật.
                setTimeout(renderAdv, 800);
            });
            tkcUI.sel.addEventListener('change', () => {
                const tkcText = tkcUI.sel.value;
                if (tkcText && setSelectExact(ADV_ID.tkc, tkcText)) {
                    localStorage.setItem(ADV_LS.tkc, tkcText);
                    advStatus.style.display='block'; advStatus.className='tng-st s'; advStatus.textContent='✅ Đã chọn TKC';
                }
            });
            auto5.addEventListener('change', () => localStorage.setItem(ADV_LS.auto5, auto5.checked ? '1' : '0'));
            const advState = localStorage.getItem(ADV_LS.collapsed);
            const advCollapsed = advState === null ? mob : advState === '1';
            advBody.style.display = advCollapsed ? 'none' : 'grid'; advToggle.textContent = advCollapsed ? 'Mở' : 'Thu gọn';
            advToggle.addEventListener('click', () => {
                const openAdv = advBody.style.display !== 'none';
                advBody.style.display = openAdv ? 'none' : 'grid';
                advToggle.textContent = openAdv ? 'Mở' : 'Thu gọn';
                localStorage.setItem(ADV_LS.collapsed, openAdv ? '1' : '0');
            });

            const lbl1 = $('div', { fontFamily:'var(--tng-font)', fontSize:'13px', fontWeight:'600', color:'#475569', marginBottom:'6px' });
            lbl1.textContent = '💰 NS chung (tất cả dòng bình thường)';
            panel.appendChild(lbl1);

            const inp = $('input'); inp.className = 'tng-inp';
            Object.assign(inp, { type:'number', inputMode:'decimal', placeholder:'VD: 180' });
            inp.style.textAlign = 'center'; inp.style.marginBottom = '14px';
            panel.appendChild(inp);

            panel.appendChild($('div', { height:'1px', background:'linear-gradient(90deg,transparent,rgba(239,68,68,.2),transparent)', margin:'0 0 12px' }));

            // Exclude section
            const excSection = $('div', { background:'rgba(239,68,68,.03)', border:'1.5px solid rgba(239,68,68,.12)', borderRadius:'14px', padding:'14px', marginBottom:'14px' });

            const excTitle = $('div', { fontFamily:'var(--tng-font)', fontSize:'13px', fontWeight:'700', color:'var(--tng-err)', marginBottom:'8px' });
            excTitle.textContent = '🚫 Dòng loại trừ (tùy chọn)';
            excSection.appendChild(excTitle);

            const excDesc = $('div', { fontFamily:'var(--tng-font)', fontSize:'12px', color:'#64748b', marginBottom:'10px', lineHeight:'1.5' });
            excDesc.textContent = 'Chọn dòng trên bảng → điền NS riêng hoặc bỏ qua.';
            excSection.appendChild(excDesc);

            const selectBtn = $('button');
            selectBtn.type = 'button';
            selectBtn.style.cssText = `width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:${mob?'13px':'10px'};border:1.5px dashed var(--tng-err);border-radius:12px;background:rgba(239,68,68,.04);color:var(--tng-err);cursor:pointer;font:600 ${mob?14:12}px var(--tng-font);transition:all .2s;margin-bottom:10px;-webkit-tap-highlight-color:transparent;touch-action:manipulation;`;
            selectBtn.innerHTML = '👆 Chọn dòng loại trừ trên bảng';
            excSection.appendChild(selectBtn);

            const excludeInfo = $('div', { fontFamily:'var(--tng-font)', fontSize:'12px', color:'#64748b', textAlign:'center', marginBottom:'8px', display:'none' });
            excSection.appendChild(excludeInfo);

            const resetBtn = $('button');
            resetBtn.type = 'button';
            resetBtn.style.cssText = `width:100%;padding:6px;border:0;border-radius:8px;background:0;color:#94a3b8;cursor:pointer;font:500 ${mob?12:11}px var(--tng-font);transition:all .15s;margin-bottom:8px;-webkit-tap-highlight-color:transparent;`;
            resetBtn.textContent = '↺ Bỏ chọn tất cả';
            resetBtn.addEventListener('click', () => {
                excludedRows.clear(); excludedRowValues.clear();
                disableRowSelection(); clearExcludeHighlight(); updateExcludeInfo();
                selectBtn.innerHTML = '👆 Chọn dòng loại trừ trên bảng';
            });
            excSection.appendChild(resetBtn);

            const excRowListLbl = $('div', { fontFamily:'var(--tng-font)', fontSize:'12px', fontWeight:'600', color:'#b91c1c', marginBottom:'6px', display:'none' });
            excRowListLbl.textContent = 'NS riêng cho từng dòng loại trừ:';
            excSection.appendChild(excRowListLbl);

            const excRowList = $('div');
            excRowList.style.cssText = 'max-height:200px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;';
            excSection.appendChild(excRowList);

            const excludedRowValues = new Map();

            function rebuildRowInputs() {
                excRowList.innerHTML = '';
                if (excludedRows.size === 0) { excRowListLbl.style.display = 'none'; return; }
                excRowListLbl.style.display = 'block';
                Array.from(excludedRows).sort((a,b) => a - b).forEach(idx => {
                    const row = $('div');
                    row.style.cssText = 'display:flex;align-items:center;gap:8px;';
                    const lbl = $('span');
                    lbl.style.cssText = 'font:600 13px var(--tng-font);color:#b91c1c;min-width:60px;white-space:nowrap;';
                    lbl.textContent = 'Dòng ' + (idx + 1) + ':';
                    const rowInp = $('input');
                    rowInp.type = 'number'; rowInp.inputMode = 'decimal'; rowInp.placeholder = 'NS riêng';
                    rowInp.value = excludedRowValues.get(idx) || '';
                    rowInp.style.cssText = `flex:1;padding:${mob?'10px':'7px'} 10px;font:600 ${mob?15:13}px var(--tng-font);border:1.5px solid #fca5a5;border-radius:10px;outline:0;background:#fff;color:#1e293b;text-align:center;min-width:0;-webkit-appearance:none;`;
                    rowInp.addEventListener('input', () => {
                        if (rowInp.value.trim()) excludedRowValues.set(idx, rowInp.value.trim());
                        else excludedRowValues.delete(idx);
                        updatePreview();
                    });
                    rowInp.addEventListener('keydown', ev => { if (ev.key === 'Enter') btn.click(); });
                    row.appendChild(lbl); row.appendChild(rowInp);
                    excRowList.appendChild(row);
                });
            }

            panel.appendChild(excSection);

            updateExcludeInfo = () => {
                const n = excludedRows.size;
                if (floatingDone && floatingDone.style.display !== 'none') {
                    floatingDone.innerHTML = '✅ Xong chọn (' + n + ' dòng)';
                }
                for (const k of excludedRowValues.keys()) { if (!excludedRows.has(k)) excludedRowValues.delete(k); }
                if (n > 0) {
                    excludeInfo.style.display = 'block';
                    const nums = Array.from(excludedRows).sort((a,b)=>a-b).map(i=>i+1).join(', ');
                    excludeInfo.innerHTML = 'Đã chọn <b style="color:var(--tng-err)">' + n + '</b> dòng: <b>' + nums + '</b>';
                } else {
                    excludeInfo.style.display = 'none';
                }
                rebuildRowInputs(); updatePreview();
            };

            const preview = $('div', { fontFamily:'var(--tng-font)', fontSize:'12px', color:'#475569', textAlign:'center', padding:'10px', background:'rgba(99,102,241,.04)', borderRadius:'12px', marginBottom:'12px', display:'none', lineHeight:'1.6' });
            panel.appendChild(preview);

            function updatePreview() {
                const vMain = inp.value.trim();
                const total = document.querySelectorAll(SEL).length;
                const excN = excludedRows.size;
                const normalN = total - excN;
                if (!vMain && excN === 0) { preview.style.display = 'none'; return; }
                preview.style.display = 'block';
                let html = '📝 <b>Xem trước:</b><br>';
                if (vMain) html += '• <span style="color:var(--tng-pri)">' + normalN + '</span> dòng → <b>' + vMain + '</b><br>';
                if (excN > 0) {
                    const withVal = Array.from(excludedRows).filter(i => excludedRowValues.has(i) && excludedRowValues.get(i));
                    const withoutVal = excN - withVal.length;
                    withVal.sort((a,b) => a - b).forEach(i => {
                        html += '• Dòng <span style="color:var(--tng-err)">' + (i+1) + '</span> → <b>' + excludedRowValues.get(i) + '</b><br>';
                    });
                    if (withoutVal > 0) html += '• <span style="color:#94a3b8">' + withoutVal + '</span> dòng loại trừ → <i>bỏ qua</i>';
                }
                preview.innerHTML = html;
            }

            inp.addEventListener('input', updatePreview);

            // Floating done button
            floatingDone = $('button');
            floatingDone.type = 'button';
            floatingDone.style.cssText = `
                position:fixed; bottom:calc(${mob?'28px':'24px'} + env(safe-area-inset-bottom, 0px));
                left:50%; transform:translateX(-50%);
                z-index:100002; display:none;
                padding:${mob?'17px 36px':'13px 30px'};
                font:700 ${mob?17:14}px var(--tng-font);
                background:linear-gradient(135deg,var(--tng-ok),#34d399); color:#fff;
                border:none; border-radius:50px; cursor:pointer;
                box-shadow:0 6px 28px rgba(16,185,129,.45), 0 0 0 4px rgba(16,185,129,.15);
                transition:all .25s cubic-bezier(.4,0,.2,1);
                -webkit-tap-highlight-color:transparent; touch-action:manipulation;
            `;
            floatingDone.innerHTML = '✅ Xong chọn (0 dòng)';
            floatingDone.addEventListener('touchstart', () => { floatingDone.style.transform = 'translateX(-50%) scale(.93)'; }, { passive: true });
            floatingDone.addEventListener('touchend', () => { floatingDone.style.transform = 'translateX(-50%) scale(1)'; }, { passive: true });
            document.body.appendChild(floatingDone);

            let isSelecting = false;

            function enterSelectMode() {
                isSelecting = true;
                enableRowSelection();
                wrap.style.display = 'none';
                panel.style.display = 'none';
                floatingDone.style.display = 'block';
                floatingDone.innerHTML = '✅ Xong chọn (' + excludedRows.size + ' dòng)';
            }

            function exitSelectMode() {
                isSelecting = false;
                disableRowSelection(); reapplyExcludeHighlight();
                floatingDone.style.display = 'none';
                wrap.style.display = 'flex';
                panel.style.display = 'block';
                updateExcludeInfo();
                selectBtn.innerHTML = excludedRows.size > 0 ? '✏️ Chọn lại (' + excludedRows.size + ' đã chọn)' : '👆 Chọn dòng loại trừ trên bảng';
            }

            selectBtn.addEventListener('click', () => { enterSelectMode(); });
            floatingDone.addEventListener('click', () => { exitSelectMode(); });

            // Auto save toggle
            let autoSave = true;
            const tw = $('div'); tw.className = 'tng-tw';
            const tg = $('div'); tg.className = 'tng-tg on';
            const tl = $('span'); tl.textContent = 'Tự động Lưu sau khi điền';
            tw.appendChild(tg); tw.appendChild(tl);
            tw.addEventListener('click', () => { autoSave = !autoSave; tg.classList.toggle('on', autoSave); });
            panel.appendChild(tw);
            panel.appendChild($('div', { height:'12px' }));

            const btn = $('button'); btn.className = 'tng-btn1'; btn.type = 'button'; btn.textContent = '🚀  Điền tất cả';
            panel.appendChild(btn);

            const pw = $('div'); pw.className = 'tng-pw'; pw.style.display = 'none';
            const pb = $('div'); pb.className = 'tng-pb'; pb.style.width = '0%';
            pw.appendChild(pb); panel.appendChild(pw);

            const st = $('div'); st.className = 'tng-st'; st.style.display = 'none';
            panel.appendChild(st);

            wrap.appendChild(panel);
            document.body.appendChild(wrap);

            function reapplyExcludeHighlight() {
                getRowsWithInputs().forEach(({ tr, index }) => {
                    if (excludedRows.has(index)) {
                        tr.style.background = 'rgba(239,68,68,.06)';
                        tr.style.outline = '2px solid rgba(239,68,68,.25)';
                        tr.style.outlineOffset = '-1px';
                    }
                });
            }
            function clearExcludeHighlight() {
                getRowsWithInputs().forEach(({ tr }) => {
                    tr.style.background = ''; tr.style.outline = ''; tr.style.outlineOffset = '';
                });
            }

            let open = false;
            fab.addEventListener('click', () => {
                if (isSelecting) return;
                open = !open;
                panel.style.display = open ? 'block' : 'none';
                fab.textContent = open ? '✕' : '📋';
                fab.style.background = open ? 'linear-gradient(135deg,var(--tng-err),#f87171)' : 'linear-gradient(135deg,var(--tng-ok),#34d399)';
                fab.style.boxShadow = open ? '0 4px 20px rgba(239,68,68,.4)' : '0 4px 20px rgba(16,185,129,.4)';
                if (open) { renderAdv(); setTimeout(() => inp.focus(), 60); updatePreview(); }
            });

            // Close on outside tap (mobile)
            if (mob) {
                document.addEventListener('touchstart', e => {
                    if (open && !panel.contains(e.target) && !fab.contains(e.target)) {
                        open = false; panel.style.display = 'none';
                        fab.textContent = '📋';
                        fab.style.background = 'linear-gradient(135deg,var(--tng-ok),#34d399)';
                        fab.style.boxShadow = '0 4px 20px rgba(16,185,129,.4)';
                    }
                }, { passive: true });
            }

            inp.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });

            btn.addEventListener('click', async () => {
                const vMain = inp.value.trim();
                if (!vMain) { st.style.display = 'block'; st.className = 'tng-st e'; st.textContent = '⚠️ Nhập giá trị NS chung trước'; inp.focus(); return; }
                if (isSelecting) { disableRowSelection(); isSelecting = false; }

                btn.disabled = true;
                st.style.display = 'block'; st.className = 'tng-st i';
                const tkcText = tkcUI.sel.value;
                const maText = maUI.sel.value;
                if (tkcText) {
                    btn.innerHTML = '<span style="display:inline-block;animation:tng-spin .8s linear infinite">👤</span>  Đang chọn TKC...';
                    st.textContent = 'Đang chọn TKC...';
                    if (setSelectExact(ADV_ID.tkc, tkcText)) { localStorage.setItem(ADV_LS.tkc, tkcText); await sleep(250); }
                    else { st.className = 'tng-st e'; st.textContent = '⚠️ Không chọn được TKC'; }
                }
                if (maText) {
                    const realMa = byId(ADV_ID.maHang);
                    const currentText = realMa?.options?.[realMa.selectedIndex]?.textContent || '';
                    if (noDiaNS(currentText) !== noDiaNS(maText)) {
                        btn.innerHTML = '<span style="display:inline-block;animation:tng-spin .8s linear infinite">🏷️</span>  Đang đổi mã hàng trên web...';
                        st.textContent = 'Đang đổi mã hàng trên web để tải khâu...';
                        await applyMaHangNow(maText, st);
                        renderAdv();
                        await sleep(500);
                    }
                }
                let els = Array.from(document.querySelectorAll(SEL));
                if (!els.length) { btn.disabled = false; btn.textContent = '🚀  Điền tất cả'; st.style.display = 'block'; st.className = 'tng-st e'; st.textContent = '⚠️ Chưa thấy khâu/ô NS sau khi đổi mã. Đợi web tải xong rồi bấm lại.'; return; }
                if (auto5.checked) {
                    btn.innerHTML = '<span style="display:inline-block;animation:tng-spin .8s linear infinite">⭐</span>  Đang đánh giá 5 sao...';
                    st.textContent = 'Đang đánh giá 5 sao...';
                    await auto5SaoExact(st);
                    await sleep(250);
                }

                btn.innerHTML = '<span style="display:inline-block;animation:tng-spin .8s linear infinite">⏳</span>  Đang điền...';
                pw.style.display = 'block'; pb.style.width = '0%';
                st.style.display = 'block'; st.className = 'tng-st i'; st.textContent = '0 / ' + els.length;

                let i = 0, filled = 0, skipped = 0, altFilled = 0;
                const total = els.length;
                (function chunk() {
                    const end = Math.min(i + 50, total);
                    for (; i < end; i++) {
                        if (excludedRows.has(i)) {
                            const rowVal = excludedRowValues.get(i);
                            if (rowVal) { setVal(els[i], rowVal); altFilled++; }
                            else skipped++;
                        } else {
                            setVal(els[i], vMain); filled++;
                        }
                    }
                    pb.style.width = Math.round(i / total * 100) + '%';
                    st.textContent = i + ' / ' + total;
                    if (i < total) { requestAnimationFrame(chunk); return; }

                    let msg = '✅ ' + filled + ' ô → ' + vMain;
                    if (altFilled) msg += ' | ' + altFilled + ' ô NS riêng';
                    if (skipped)   msg += ' | ' + skipped + ' ô bỏ qua';
                    st.className = 'tng-st s'; st.textContent = msg;

                    if (autoSave) {
                        btn.innerHTML = '<span style="display:inline-block;animation:tng-spin .8s linear infinite">💾</span>  Đang lưu...';
                        setTimeout(() => { clickSave(); setTimeout(() => {
                            btn.disabled = false; btn.className = 'tng-btn1 ok'; btn.textContent = '✅  Xong!';
                            st.textContent = msg + ' → đã Lưu!';
                            setTimeout(() => { btn.className = 'tng-btn1'; btn.textContent = '🚀  Điền tất cả'; pw.style.display = 'none'; clearExcludeHighlight(); }, 2500);
                        }, 800); }, 200);
                    } else {
                        btn.disabled = false; btn.textContent = '🚀  Điền tất cả';
                        st.textContent = msg + ' (chưa Lưu)';
                        setTimeout(() => { pw.style.display = 'none'; }, 2000);
                    }
                })();
            });
        }
    }

    // ══════════════════════════════════════════
    //  MODULE 5: QUICK SEARCH — FILTER MODE
    //  v9.1: gõ là ẩn dòng không khớp,
    //  chỉ giữ dòng match → nhìn như gom nhóm
    // ══════════════════════════════════════════

    function quickSearch() {

        function noDia(s) {
            try { return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D'); }
            catch(e) { return s; }
        }

        function getTable() {
            const tables = Array.from(document.querySelectorAll('table'));
            const grid = tables.find(t => t.id && /grid/i.test(t.id));
            if (grid) return grid;
            let max = 0, tbl = null;
            tables.forEach(t => {
                const n = t.querySelectorAll(':scope > tbody > tr, :scope > tr').length;
                if (n > max) { max = n; tbl = t; }
            });
            return tbl;
        }

        function getDataRows(tbl) {
            if (!tbl) return [];
            const rows = [];
            tbl.querySelectorAll(':scope > tbody > tr, :scope > tr').forEach(tr => {
                if (!tr.querySelector('th') && !tr.querySelector('table') && tr.textContent.trim()) rows.push(tr);
            });
            return rows;
        }

        let allRows = [];       // tất cả data rows
        let matched = [];       // rows khớp search
        let hidden = [];        // rows bị ẩn
        let cur = -1;
        let filtering = false;

        // Lưu display gốc trước khi filter
        function saveDisplay(rows) {
            rows.forEach(r => { if (r._tngOrig === undefined) r._tngOrig = r.style.display || ''; });
        }

        function restoreAll() {
            hidden.forEach(r => {
                r.style.display = r._tngOrig !== undefined ? r._tngOrig : '';
                delete r._tngOrig;
            });
            matched.forEach(r => {
                r.classList.remove('tng-match','tng-match-cur');
                delete r._tngOrig;
            });
            hidden = []; matched = []; cur = -1; filtering = false;
        }

        function doFilter(q) {
            restoreAll();
            const tbl = getTable();
            allRows = getDataRows(tbl);
            const norm = noDia(q.toLowerCase().trim());
            if (!norm) return '';

            saveDisplay(allRows);
            filtering = true;
            matched = []; hidden = [];

            allRows.forEach(r => {
                if (noDia(r.textContent.toLowerCase()).includes(norm)) {
                    matched.push(r);
                    r.classList.add('tng-match');
                } else {
                    hidden.push(r);
                    r.style.display = 'none';
                }
            });

            if (matched.length) {
                cur = 0; showCur();
                return matched.length + ' kết quả';
            }
            return '0 kết quả';
        }

        function showCur() {
            matched.forEach((r, i) => {
                r.classList.toggle('tng-match', true);
                r.classList.toggle('tng-match-cur', i === cur);
            });
            if (matched[cur]) {
                matched[cur].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        function navTo(dir) {
            if (!matched.length) return '';
            matched[cur]?.classList.remove('tng-match-cur');
            cur = (cur + dir + matched.length) % matched.length;
            showCur();
            return (cur + 1) + ' / ' + matched.length;
        }

        // ─── Shadow DOM UI ───
        const host = document.createElement('div');
        host.style.cssText = 'all:initial!important;position:fixed!important;top:0!important;left:0!important;width:0!important;height:0!important;overflow:visible!important;z-index:2147483647!important;pointer-events:none!important;';
        document.body.appendChild(host);
        const shadow = host.attachShadow({ mode: 'closed' });

        const safeTop = mob ? 'top: calc(8px + env(safe-area-inset-top, 0px));' : 'top: 10px;';

        shadow.innerHTML = `
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .bar {
                    position: fixed;
                    ${safeTop}
                    ${mob ? 'left: 10px; right: 10px;' : 'left: 50%; transform: translateX(-50%); min-width: 440px;'}
                    display: none; align-items: center; gap: 8px;
                    padding: ${mob ? '10px 12px' : '8px 12px'};
                    background: rgba(255,255,255,.97);
                    -webkit-backdrop-filter: blur(24px) saturate(1.8);
                    backdrop-filter: blur(24px) saturate(1.8);
                    border: 1px solid rgba(0,0,0,.1);
                    border-radius: 18px;
                    box-shadow: 0 8px 36px rgba(0,0,0,.18);
                    pointer-events: auto;
                    font-family: -apple-system,'SF Pro Display','Helvetica Neue',system-ui,sans-serif;
                    animation: slideIn .22s cubic-bezier(.32,1,.23,1);
                }
                .bar.open { display: flex; }
                @keyframes slideIn {
                    from { opacity: 0; transform: ${mob ? 'translateY(-12px)' : 'translateX(-50%) translateY(-10px)'}; }
                    to   { opacity: 1; transform: ${mob ? 'translateY(0)' : 'translateX(-50%) translateY(0)'}; }
                }
                .icon { font-size: 16px; flex-shrink: 0; }
                input {
                    flex: 1; min-width: 0;
                    padding: ${mob ? '10px 12px' : '8px 12px'};
                    font-size: ${mob ? 17 : 15}px; font-weight: 500;
                    font-family: -apple-system,'SF Pro Display','Helvetica Neue',system-ui,sans-serif;
                    border: 1.5px solid #e5e7eb; border-radius: 12px;
                    outline: none; background: #f9fafb; color: #111827;
                    caret-color: #6366f1;
                    -webkit-appearance: none; appearance: none;
                    transition: all .18s;
                }
                input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 3px rgba(99,102,241,.12); }
                input::placeholder { color: #9ca3af; font-weight: 400; }

                /* Result badge */
                .badge {
                    display: none; align-items: center; gap: 6px;
                    background: #f3f4f6; border-radius: 10px;
                    padding: 5px 10px; flex-shrink: 0; white-space: nowrap;
                }
                .badge.show { display: flex; }
                .badge-num {
                    font: 700 ${mob ? 14 : 13}px -apple-system,'SF Pro Display',system-ui;
                    color: #059669;
                }
                .badge-num.empty { color: #ef4444; }
                .badge-pos {
                    font: 500 ${mob ? 12 : 11}px -apple-system,system-ui;
                    color: #6b7280;
                }

                /* Nav */
                .nav { display: flex; gap: 4px; flex-shrink: 0; }
                button {
                    width: ${mob ? 40 : 32}px; height: ${mob ? 40 : 32}px;
                    border: 1.5px solid #e5e7eb; border-radius: 10px;
                    background: #fff; cursor: pointer;
                    font-size: ${mob ? 15 : 13}px; color: #374151;
                    display: flex; align-items: center; justify-content: center;
                    transition: all .15s;
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                }
                button:active { background: #f3f4f6; transform: scale(.88); }
                button.nav-btn:active { border-color: #6366f1; color: #6366f1; }
                button.close-btn { color: #ef4444; border-color: #fecaca; }
                button.close-btn:active { background: #fef2f2; }

                /* Restore hint */
                .hint {
                    display: none; position: fixed;
                    ${safeTop}
                    ${mob ? 'left: 10px; right: 10px;' : 'left: 50%; transform: translateX(-50%);'}
                    pointer-events: auto;
                    font: 600 ${mob ? 13 : 12}px -apple-system,system-ui;
                    background: #fef3c7; color: #92400e;
                    border: 1px solid #fde68a; border-radius: 12px;
                    padding: 7px 14px;
                    text-align: center;
                    box-shadow: 0 4px 16px rgba(0,0,0,.1);
                    margin-top: ${mob ? '68px' : '60px'};
                    animation: fadeIn .2s ease;
                }
                .hint.show { display: block; }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
            </style>

            <div class="bar" id="bar">
                <span class="icon">🔍</span>
                <input type="text" id="inp"
                    placeholder="${mob ? 'Tìm khâu...' : 'Tìm khâu... (Enter ↓  Shift+Enter ↑)'}"
                    autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                />
                <div class="badge" id="badge">
                    <span class="badge-num" id="badge-num">0</span>
                    <span class="badge-pos" id="badge-pos"></span>
                </div>
                <div class="nav">
                    <button class="nav-btn" id="prev" title="Trước">▲</button>
                    <button class="nav-btn" id="next" title="Tiếp">▼</button>
                    <button class="close-btn" id="cls" title="Đóng">✕</button>
                </div>
            </div>
            <div class="hint" id="hint">⚠️ Đang lọc — nhấn ✕ để hiện lại tất cả dòng</div>
        `;

        const bar      = shadow.getElementById('bar');
        const inp      = shadow.getElementById('inp');
        const badge    = shadow.getElementById('badge');
        const badgeNum = shadow.getElementById('badge-num');
        const badgePos = shadow.getElementById('badge-pos');
        const hint     = shadow.getElementById('hint');
        const btnPrev  = shadow.getElementById('prev');
        const btnNext  = shadow.getElementById('next');
        const btnClose = shadow.getElementById('cls');

        function updateBadge(result, pos) {
            if (!result) { badge.classList.remove('show'); hint.classList.remove('show'); return; }
            badge.classList.add('show');
            const n = matched.length;
            badgeNum.textContent = n === 0 ? '0 kết quả' : n + ' kết quả';
            badgeNum.className = 'badge-num' + (n === 0 ? ' empty' : '');
            badgePos.textContent = n > 0 && pos ? pos : '';
            hint.classList.toggle('show', n > 0 && filtering);
        }

        function openSearch() {
            bar.classList.add('open');
            inp.value = '';
            badge.classList.remove('show');
            hint.classList.remove('show');
            setTimeout(() => inp.focus(), 40);
        }

        function close() {
            bar.classList.remove('open');
            inp.value = '';
            restoreAll();
            badge.classList.remove('show');
            hint.classList.remove('show');
        }

        // Expose for Action Center
        window.__tngOpenSearch = (fn) => {};
        window.__tngOpenSearch._open = openSearch;

        btnClose.addEventListener('click', close);
        btnPrev.addEventListener('click', () => {
            if (matched.length) { const p = navTo(-1); updateBadge('x', p); }
        });
        btnNext.addEventListener('click', () => {
            if (matched.length) { const p = navTo(1); updateBadge('x', p); }
        });

        inp.addEventListener('input', () => {
            const q = inp.value;
            if (!q.trim()) { restoreAll(); badge.classList.remove('show'); hint.classList.remove('show'); return; }
            const result = doFilter(q);
            updateBadge(result, matched.length ? '1 / ' + matched.length : '');
        });

        inp.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (matched.length) { const p = navTo(e.shiftKey ? -1 : 1); updateBadge('x', p); }
            }
            if (e.key === 'Escape') { e.preventDefault(); close(); }
        });

        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); openSearch(); }
            if (e.key === 'Escape' && bar.classList.contains('open')) close();
        });

        console.log('[TNG Search] ✓ v9.1 Filter mode – NK only');
    }

    // ══════════════════════════════════════════
    //  CALENDAR PICKER
    // ══════════════════════════════════════════

    function createCalendarPicker(container, onSelect) {
        const now = new Date();
        let viewYear = now.getFullYear(), viewMonth = now.getMonth();
        let selectedDate = { y: viewYear, m: viewMonth, d: now.getDate() };
        const DAYS_VN   = ['T2','T3','T4','T5','T6','T7','CN'];
        const MONTHS_VN = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
        const cal = $('div'); cal.className = 'tng-cal';

        function render() {
            cal.innerHTML = '';
            const hdr = $('div'); hdr.className = 'tng-cal-hdr';
            const prevBtn = $('button'); prevBtn.type = 'button'; prevBtn.className = 'tng-cal-nav'; prevBtn.textContent = '◀';
            const nextBtn = $('button'); nextBtn.type = 'button'; nextBtn.className = 'tng-cal-nav'; nextBtn.textContent = '▶';
            const title = $('span'); title.className = 'tng-cal-title';
            title.textContent = MONTHS_VN[viewMonth] + ' ' + viewYear;
            hdr.appendChild(prevBtn); hdr.appendChild(title); hdr.appendChild(nextBtn);
            cal.appendChild(hdr);
            prevBtn.addEventListener('click', () => { viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render(); });
            nextBtn.addEventListener('click', () => { viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render(); });

            const grid = $('div'); grid.className = 'tng-cal-grid';
            DAYS_VN.forEach(d => { const dow = $('span'); dow.className = 'tng-cal-dow'; dow.textContent = d; grid.appendChild(dow); });

            const firstDay = new Date(viewYear, viewMonth, 1).getDay();
            const startDow = firstDay === 0 ? 6 : firstDay - 1;
            const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
            const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();
            const today = new Date();

            for (let i = startDow - 1; i >= 0; i--) {
                const btn = $('button'); btn.type = 'button'; btn.className = 'tng-cal-day other';
                btn.textContent = daysInPrev - i;
                const pd = daysInPrev - i, pm = viewMonth - 1 < 0 ? 11 : viewMonth - 1, py = viewMonth - 1 < 0 ? viewYear - 1 : viewYear;
                btn.addEventListener('click', async () => { selectedDate = { y:py, m:pm, d:pd }; viewMonth = pm; viewYear = py; onSelect(formatDateDDMMYYYY(py,pm,pd)); render(); });
                grid.appendChild(btn);
            }
            for (let d = 1; d <= daysInMonth; d++) {
                const btn = $('button'); btn.type = 'button'; btn.className = 'tng-cal-day';
                btn.textContent = d;
                if (d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) btn.classList.add('today');
                if (d === selectedDate.d && viewMonth === selectedDate.m && viewYear === selectedDate.y) btn.classList.add('selected');
                const dd = d;
                btn.addEventListener('click', async () => { selectedDate = { y:viewYear, m:viewMonth, d:dd }; onSelect(formatDateDDMMYYYY(viewYear,viewMonth,dd)); render(); });
                grid.appendChild(btn);
            }
            const totalCells = startDow + daysInMonth;
            const remaining = (7 - (totalCells % 7)) % 7;
            for (let i = 1; i <= remaining; i++) {
                const btn = $('button'); btn.type = 'button'; btn.className = 'tng-cal-day other';
                btn.textContent = i;
                const nd = i, nm = viewMonth + 1 > 11 ? 0 : viewMonth + 1, ny = viewMonth + 1 > 11 ? viewYear + 1 : viewYear;
                btn.addEventListener('click', async () => { selectedDate = { y:ny, m:nm, d:nd }; viewMonth = nm; viewYear = ny; onSelect(formatDateDDMMYYYY(ny,nm,nd)); render(); });
                grid.appendChild(btn);
            }
            cal.appendChild(grid);
        }

        render();
        container.appendChild(cal);
        onSelect(formatDateDDMMYYYY(selectedDate.y, selectedDate.m, selectedDate.d));
        return { getDate: () => formatDateDDMMYYYY(selectedDate.y, selectedDate.m, selectedDate.d) };
    }

    // ══════════════════════════════════════════
    //  MODULE 6: TNG ACTION CENTER v9.3.5
    //  Mobile: bottom sheet, 3-col grid, safe area
    // ══════════════════════════════════════════

    function menuUI() {
        const tngSVG  = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 34"><text x="1" y="27" font-family="Arial Black,Impact,sans-serif" font-weight="900" font-size="28" fill="#1a56db" letter-spacing="0">TNG</text><text x="55" y="13" font-family="Arial,sans-serif" font-size="12" fill="#1a56db">\u2665</text></svg>';
        const tngLogoSrc  = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(tngSVG);
        const tngLogoHTML = '<img src="' + tngLogoSrc + '" style="height:' + (mob?18:16) + 'px;pointer-events:none;display:block;margin:auto" alt="TNG">';

        // FAB — right side with safe area
        const fab = $('div'); fab.className = 'tng-fab';
        Object.assign(fab.style, {
            bottom: mob ? 'calc(14px + env(safe-area-inset-bottom, 0px))' : '10px',
            right:  mob ? 'calc(14px + env(safe-area-inset-right, 0px))'  : '10px',
            background: '#fff',
            border: '2px solid #1a56db',
            animation: 'tng-pulse 2.5s infinite',
            width:  mob ? '54px' : '44px',
            height: mob ? '54px' : '44px',
            boxShadow: '0 4px 20px rgba(26,86,219,.25)'
        });
        fab.innerHTML = tngLogoHTML;
        document.body.appendChild(fab);

        // Overlay
        const overlay = $('div');
        Object.assign(overlay.style, {
            position:'fixed', inset:'0',
            background: mob ? 'rgba(15,23,42,.24)' : 'rgba(15,23,42,.35)',
            backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
            zIndex: '99998', display: 'none', transition: 'opacity .25s', opacity: '0'
        });
        document.body.appendChild(overlay);

        // Panel
        const panel = $('div'); panel.className = 'tng-glass';

        if (mob) {
            // Bottom sheet on mobile
            Object.assign(panel.style, {
                position: 'fixed', zIndex: '99999', display: 'none',
                left: '12px', right: '12px', bottom: 'calc(78px + env(safe-area-inset-bottom, 0px))',
                borderRadius: '24px',
                padding: '0 12px 14px',
                maxHeight: '72vh', overflowY: 'auto', width: 'auto', overscrollBehavior: 'contain'
            });
        } else {
            Object.assign(panel.style, {
                position:'fixed', zIndex:'99999', display:'none',
                padding: '18px 16px 22px',
                borderRadius: '18px',
                maxWidth: '340px', width: '340px',
                bottom: '62px', right: '10px',
                maxHeight: '85vh', overflowY: 'auto',
                animation: 'tng-in .25s ease'
            });
        }

        // Sheet handle (mobile only)
        if (mob) {
            const handle = $('div');
            handle.style.cssText = 'width:40px;height:5px;border-radius:3px;background:rgba(0,0,0,.13);margin:10px auto 12px;';
            panel.appendChild(handle);
        }

        // Header
        const hdr = $('div', { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px', padding:'0 2px' });
        const titleWrap = $('div', { display:'flex', alignItems:'center', gap:'8px' });
        const tngLogoBadge = $('span');
        tngLogoBadge.style.cssText = 'display:inline-flex;align-items:center;background:#fff;padding:4px 8px;border-radius:8px;border:2px solid #1a56db;';
        tngLogoBadge.innerHTML = '<img src="' + tngLogoSrc + '" style="height:18px;display:block" alt="TNG">';
        const titleText = $('span');
        titleText.style.cssText = 'font:700 ' + (mob?'17':'15') + 'px var(--tng-font);color:#1e293b;';
        titleText.textContent = 'Action Center';
        titleWrap.appendChild(tngLogoBadge); titleWrap.appendChild(titleText);
        const ver = $('span');
        ver.style.cssText = 'font:600 10px var(--tng-font);color:#94a3b8;background:rgba(99,102,241,.08);padding:3px 8px;border-radius:8px;';
        ver.textContent = 'v9.3.7';
        hdr.appendChild(titleWrap); hdr.appendChild(ver);
        panel.appendChild(hdr);

        panel.appendChild($('div', { height:'1px', background:'linear-gradient(90deg,transparent,rgba(99,102,241,.15),transparent)', margin:'0 0 14px' }));

        // Tabs
        const tabBar = $('div');
        tabBar.style.cssText = 'display:flex;gap:0;margin-bottom:12px;background:rgba(241,245,249,.92);border-radius:16px;padding:4px;position:sticky;top:0;z-index:2;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);';
        const tabStyle = (on) =>
            'flex:1;padding:' + (mob?'11px':'9px') + ';border:0;border-radius:10px;cursor:pointer;font:600 ' + (mob?'14':'12') + 'px var(--tng-font);transition:all .22s;-webkit-tap-highlight-color:transparent;text-align:center;touch-action:manipulation;' +
            (on ? 'background:#fff;color:var(--tng-pri);box-shadow:0 2px 10px rgba(0,0,0,.08);' : 'background:transparent;color:#6b7280;');
        const tab1Btn = $('button'); tab1Btn.type = 'button'; tab1Btn.textContent = '📋 Trang'; tab1Btn.style.cssText = tabStyle(true);
        const tab2Btn = $('button'); tab2Btn.type = 'button'; tab2Btn.textContent = '🛠 Công cụ'; tab2Btn.style.cssText = tabStyle(false);
        tabBar.appendChild(tab1Btn); tabBar.appendChild(tab2Btn);
        panel.appendChild(tabBar);

        // ─── TAB 1: SHORTCUTS ───
        const tab1 = $('div');
        const cols = mob ? 3 : 4; // 3 cols on mobile — bigger, easier to tap
        const grid = $('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(' + cols + ',1fr);gap:' + (mob?10:10) + 'px;';

        for (const [code, info] of Object.entries(SHORTCUTS)) {
            const active = window.location.href.toLowerCase().includes(info.url.toLowerCase().replace('https://bangluong.tng.vn',''));
            const cell = $('button'); cell.type = 'button'; cell.className = 'tng-cell';
            Object.assign(cell.style, {
                background: active ? 'linear-gradient(135deg,rgba(99,102,241,.13),rgba(16,185,129,.08))' : 'rgba(248,250,252,.8)',
                boxShadow:  active ? '0 0 0 2px rgba(99,102,241,.3), 0 2px 8px rgba(99,102,241,.1)' : '0 1px 4px rgba(0,0,0,.06)'
            });

            const iconSz = mob ? 38 : 38;
            const iconCircle = $('div');
            Object.assign(iconCircle.style, {
                width: iconSz+'px', height: iconSz+'px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: mob ? '18px' : '17px',
                background: active ? 'linear-gradient(135deg,var(--tng-pri),var(--tng-pri2))' : '#eef2ff',
                boxShadow: active ? '0 4px 12px rgba(99,102,241,.35)' : 'none',
                transition: 'all .2s'
            });
            iconCircle.textContent = info.icon;

            const label = $('span');
            Object.assign(label.style, {
                font: (active?'700':'600') + ' ' + (mob?'11':'11') + 'px var(--tng-font)',
                color: active ? 'var(--tng-pri)' : '#374151',
                textAlign: 'center', lineHeight: '1.3',
                wordBreak: 'break-word', maxWidth: '100%'
            });
            label.textContent = info.label;

            cell.appendChild(iconCircle); cell.appendChild(label);

            // Desktop hover
            if (!mob) {
                const badge = $('span');
                badge.style.cssText = 'position:absolute;top:4px;right:4px;font:700 8px monospace;background:' + (active?'var(--tng-pri)':'rgba(99,102,241,.1)') + ';color:' + (active?'#fff':'var(--tng-pri)') + ';padding:1px 5px;border-radius:4px;letter-spacing:.5px;opacity:0;transition:opacity .2s;';
                badge.textContent = code;
                cell.appendChild(badge);
                cell.addEventListener('mouseenter', () => { badge.style.opacity='1'; if(!active){cell.style.background='rgba(99,102,241,.07)';cell.style.transform='translateY(-2px)';cell.style.boxShadow='0 5px 18px rgba(99,102,241,.14)';} });
                cell.addEventListener('mouseleave', () => { badge.style.opacity='0'; if(!active){cell.style.background='rgba(248,250,252,.8)';cell.style.transform='none';cell.style.boxShadow='0 1px 4px rgba(0,0,0,.06)';} });
            }

            cell.addEventListener('click', () => {
                label.textContent = '...';
                iconCircle.style.background = 'linear-gradient(135deg,var(--tng-ok),#34d399)';
                window.location.href = info.url;
            });
            grid.appendChild(cell);
        }
        tab1.appendChild(grid);
        panel.appendChild(tab1);

        // ─── TAB 2: TOOLS ───
        const tab2 = $('div'); tab2.style.display = 'none';

        // Quick Search button (NK only)
        if (isNK()) {
            const searchBtn = $('button'); searchBtn.type = 'button';
            searchBtn.style.cssText = `width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:${mob?'14px':'11px'};border:1.5px dashed var(--tng-pri);border-radius:14px;background:rgba(99,102,241,.04);color:var(--tng-pri);cursor:pointer;font:600 ${mob?14:12}px var(--tng-font);transition:all .2s;margin-bottom:14px;-webkit-tap-highlight-color:transparent;touch-action:manipulation;`;
            searchBtn.innerHTML = '🔍 Tìm &amp; lọc khâu (Ctrl+F)';
            searchBtn.addEventListener('click', () => {
                closeMenu();
                setTimeout(() => { if (window.__tngOpenSearch?._open) window.__tngOpenSearch._open(); }, 100);
            });
            tab2.appendChild(searchBtn);
            tab2.appendChild($('div', { height:'1px', background:'linear-gradient(90deg,transparent,rgba(245,158,11,.2),transparent)', margin:'0 0 14px' }));
        }

        // Date tools
        const dateLbl = $('div', { fontFamily:'var(--tng-font)', fontSize: mob?'15px':'13px', fontWeight:'700', color:'#374151', marginBottom:'12px' });
        dateLbl.innerHTML = '📅 Chọn ngày nhanh';
        tab2.appendChild(dateLbl);

        const toggleCalBtn = $('button'); toggleCalBtn.type = 'button';
        toggleCalBtn.style.cssText = `width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:${mob?'12px':'10px'};border:0;border-radius:14px;background:linear-gradient(135deg,#e0f2fe,#eef2ff);color:#0e7490;cursor:pointer;font:800 ${mob?13:12}px var(--tng-font);margin-bottom:10px;-webkit-tap-highlight-color:transparent;`;
        toggleCalBtn.textContent = mob ? '📅 Mở lịch chọn ngày' : '📅 Ẩn/hiện lịch chọn ngày';
        tab2.appendChild(toggleCalBtn);

        const calWrap = $('div');
        calWrap.style.cssText = 'background:rgba(248,250,252,.8);border-radius:16px;padding:14px;margin-bottom:10px;border:1px solid rgba(0,0,0,.06);' + (mob ? 'display:none;' : '');
        toggleCalBtn.addEventListener('click', () => {
            const hidden = calWrap.style.display === 'none';
            calWrap.style.display = hidden ? 'block' : 'none';
            toggleCalBtn.textContent = hidden ? '📅 Thu gọn lịch' : '📅 Mở lịch chọn ngày';
        });

        let selectedDateStr = '';
        const selectedLbl = $('div', { fontFamily:'var(--tng-font)', fontSize:'13px', color:'#374151', textAlign:'center', marginTop:'12px', padding:'8px', background:'rgba(99,102,241,.06)', borderRadius:'10px' });

        createCalendarPicker(calWrap, (dateStr) => {
            selectedDateStr = dateStr;
            selectedLbl.innerHTML = '📌 Ngày đã chọn: <b style="color:var(--tng-pri)">' + dateStr + '</b>';
        });
        calWrap.appendChild(selectedLbl);

        const applyBtn = $('button'); applyBtn.type = 'button';
        applyBtn.style.cssText = `width:100%;padding:${mob?'14px':'11px'};font:700 ${mob?'15px':'13px'} var(--tng-font);background:linear-gradient(135deg,var(--tng-pri),var(--tng-pri2));color:#fff;border:0;border-radius:14px;cursor:pointer;transition:all .25s;margin-top:12px;-webkit-tap-highlight-color:transparent;touch-action:manipulation;`;
        applyBtn.textContent = '📅 Áp dụng ngày vào trang';
        applyBtn.addEventListener('click', () => {
            if (!selectedDateStr) {
                applyBtn.textContent = '⚠️ Chọn ngày trước!';
                setTimeout(() => { applyBtn.textContent = '📅 Áp dụng ngày vào trang'; }, 1500);
                return;
            }
            unlockDateInputs();
            const inputs = getDateInputs();
            let applied = 0;
            inputs.forEach(el => {
                el.disabled = false; el.removeAttribute('disabled');
                el.readOnly = false; el.removeAttribute('readonly');
                let dateValue = selectedDateStr;
                if ((el.type||'').toLowerCase() === 'date') {
                    const parts = selectedDateStr.split('/');
                    if (parts.length === 3) dateValue = parts[2] + '-' + parts[1] + '-' + parts[0];
                }
                const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
                if (desc && desc.set) desc.set.call(el, dateValue);
                el.value = dateValue; el.setAttribute('value', dateValue);
                el.dispatchEvent(new Event('focus',  {bubbles:true}));
                el.dispatchEvent(new Event('keydown',{bubbles:true}));
                try { el.dispatchEvent(new InputEvent('input',{bubbles:true,data:dateValue})); } catch(e2) { el.dispatchEvent(new Event('input',{bubbles:true})); }
                el.dispatchEvent(new Event('keyup',  {bubbles:true}));
                el.dispatchEvent(new Event('change', {bubbles:true}));
                el.dispatchEvent(new Event('blur',   {bubbles:true}));
                if (typeof el.onchange === 'function') try { el.onchange(); } catch(e3) {}
                if (typeof el.oninput  === 'function') try { el.oninput();  } catch(e4) {}
                if (typeof ValidatorOnChange === 'function') try { ValidatorOnChange({srcElement:el,target:el}); } catch(e5) {}
                el.style.backgroundColor = '#ecfdf5';
                applied++;
            });
            if (applied > 0) {
                applyBtn.textContent = '✅ Đã áp dụng → ' + applied + ' ô';
                applyBtn.style.background = 'linear-gradient(135deg,var(--tng-ok),#34d399)';
                setTimeout(() => {
                    inputs.forEach(el => {
                        if (el.id && typeof __doPostBack === 'function') {
                            try { __doPostBack(el.id.replace(/_/g,'$'), ''); } catch(e) {}
                        }
                    });
                }, 300);
            } else {
                applyBtn.textContent = '⚠️ Không tìm thấy ô ngày';
            }
            setTimeout(() => {
                applyBtn.textContent = '📅 Áp dụng ngày vào trang';
                applyBtn.style.background = 'linear-gradient(135deg,var(--tng-pri),var(--tng-pri2))';
            }, 2500);
        });
        calWrap.appendChild(applyBtn);

        const dateInfo = $('div', { fontFamily:'var(--tng-font)', fontSize:'12px', color:'#94a3b8', textAlign:'center', marginTop:'8px' });
        function updateDateInfo() {
            const inputs = getDateInputs();
            if (inputs.length > 0) {
                dateInfo.innerHTML = '📋 Phát hiện <b style="color:#059669">' + inputs.length + '</b> ô ngày trên trang';
                dateInfo.style.color = '#059669';
            } else {
                dateInfo.textContent = '💤 Không phát hiện ô ngày trên trang này';
                dateInfo.style.color = '#94a3b8';
            }
        }
        calWrap.appendChild(dateInfo);
        tab2.appendChild(calWrap);

        panel.appendChild(tab2);
        document.body.appendChild(panel);

        // Tab switching
        function switchTab(n) {
            tab1.style.display = n === 1 ? 'block' : 'none';
            tab2.style.display = n === 2 ? 'block' : 'none';
            tab1Btn.style.cssText = tabStyle(n === 1);
            tab2Btn.style.cssText = tabStyle(n === 2);
            if (n === 2) updateDateInfo();
        }
        tab1Btn.addEventListener('click', () => switchTab(1));
        tab2Btn.addEventListener('click', () => switchTab(2));

        // Open/close
        let open = false;
        function openMenu() {
            open = true;
            panel.style.display = 'block';
            if (mob) panel.style.animation = 'tng-up .3s cubic-bezier(.32,1,.23,1)';
            overlay.style.display = 'block';
            requestAnimationFrame(() => { overlay.style.opacity = '1'; });
            fab.innerHTML = '<span style="font:800 '+(mob?17:15)+'px var(--tng-font);color:#ef4444">✕</span>';
            fab.style.background = '#fff5f5';
            fab.style.border = '2px solid #ef4444';
            fab.style.boxShadow = '0 4px 20px rgba(239,68,68,.25)';
            fab.style.animation = 'none';
        }
        function closeMenu() {
            open = false;
            panel.style.display = 'none';
            overlay.style.opacity = '0';
            setTimeout(() => { overlay.style.display = 'none'; }, 250);
            fab.innerHTML = tngLogoHTML;
            fab.style.background = '#fff';
            fab.style.border = '2px solid #1a56db';
            fab.style.boxShadow = '0 4px 20px rgba(26,86,219,.25)';
            fab.style.animation = 'tng-pulse 2.5s infinite';
        }

        fab.addEventListener('click', e => { e.stopPropagation(); open ? closeMenu() : openMenu(); });
        overlay.addEventListener('click', e => { if (e.target === overlay) closeMenu(); });

        if (mob) {
            // Swipe-down-to-close on the panel handle area
            let startY = 0;
            panel.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
            panel.addEventListener('touchend', e => {
                const dy = e.changedTouches[0].clientY - startY;
                if (dy > 80) closeMenu(); // swipe down 80px → close
            }, { passive: true });
        }

        // Desktop keyboard shortcuts
        if (!mob) {
            let buf = '', t = null;
            const kbd = $('div'); kbd.className = 'tng-kbd'; document.body.appendChild(kbd);
            document.addEventListener('keydown', e => {
                const tag = (e.target.tagName || '').toLowerCase();
                if (['input','textarea','select'].includes(tag) || e.ctrlKey || e.altKey || e.metaKey) return;
                const k = e.key.toUpperCase();
                if (!/^[A-Z0-9]$/.test(k)) return;
                kbd.style.display = 'block'; buf += k; kbd.textContent = buf + '▎';
                kbd.style.background = 'linear-gradient(135deg,var(--tng-pri),var(--tng-pri2))';
                if (t) clearTimeout(t);
                const m = SHORTCUTS[buf];
                if (m) { kbd.textContent='✓ '+buf; kbd.style.background='linear-gradient(135deg,var(--tng-ok),#34d399)'; window.location.href=m.url; return; }
                if (!Object.keys(SHORTCUTS).some(c => c.startsWith(buf))) {
                    kbd.textContent='✗ '+buf; kbd.style.background='linear-gradient(135deg,var(--tng-err),#f87171)';
                    setTimeout(() => { buf=''; kbd.style.display='none'; }, 600); return;
                }
                t = setTimeout(() => { buf=''; kbd.style.display='none'; }, 2000);
            });
        }

        console.log('[TNG] ✓ v9.3.4 Action Center – Ready!');
    }

    // ══════════════════════════════════════════
    //  MAIN
    // ══════════════════════════════════════════

    if (!isLogin()) sessionStorage.removeItem('tng_login_done');

    if (isSSLWarn())      bypassSSL();
    else if (isCanhBao()) autoCanhBao();
    else if (isLogin())   autoLogin();

    if (!isLogin() && !isSSLWarn() && !isCanhBao()) {
        try { autoUnlockDates(); } catch(e) { console.error('[TNG] autoUnlockDates error:', e); }
    }

    try { menuUI(); } catch(e) { console.error('[TNG] menuUI error:', e); }

    if (isNS()) { try { enableNS(); fillNS(); } catch(e) { console.error('[TNG] NS error:', e); } }
    if (isNK()) { try { quickSearch(); } catch(e) { console.error('[TNG] Search error:', e); } try { fillNS(); } catch(e) { console.error('[TNG] fillNS(NK) error:', e); } }

    function cleanupNSFillOutsideNS() {
        if (isNS()) return;
        [
            '#tng-932-box',
            '#tng-931-box',
            '#tng-bridge-box',
            '#tng-fill-advanced-box'
        ].forEach(s => document.querySelectorAll(s).forEach(e => e.remove()));
        document.querySelectorAll('.tng-fab').forEach(e => {
            if ((e.textContent || '').includes('📋')) {
                const wrap = e.parentElement;
                if (wrap && wrap.style && wrap.style.position === 'fixed') wrap.remove();
            }
        });
    }

    cleanupNSFillOutsideNS();
})();