// ==UserScript==
// @name         TNG All-in-One v9.4 Adaptive Fix
// @version      9.4.0
// @description  Fix CanhBao/Login/NS/NK/TG/CD after TNG UI update
// @match        https://bangluong.tng.vn/*
// @match        http://bangluong.tng.vn/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const path = location.pathname.toLowerCase();
  const mob = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || innerWidth <= 768;

  const SHORTCUTS = {
    LN: { url: 'https://bangluong.tng.vn/BangTinhLuongCN', label: 'Lương ngày', icon: '💰' },
    LT: { url: 'https://bangluong.tng.vn/BangLuongThang', label: 'Lương tháng', icon: '📅' },
    NS: { url: 'https://bangluong.tng.vn/NangSuatCongNhan', label: 'Năng suất CN', icon: '📊' },
    CD: { url: 'https://bangluong.tng.vn/TongHopCongDoan', label: 'Tổng hợp CĐ', icon: '📋' },
    TG: { url: 'https://bangluong.tng.vn/NhapThoiGian', label: 'Nhập thời gian', icon: '⏱️' },
    TN: { url: 'https://bangluong.tng.vn/TongThuongNam', label: 'Thưởng năm', icon: '🎁' },
    XH: { url: 'https://bangluong.tng.vn/MTKN_XepHang_CongNhan', label: 'Xếp hạng CN', icon: '🏆' },
    CL: { url: 'https://bangluong.tng.vn/CongDiLamCongNhan', label: 'Công đi làm', icon: '🗓️' },
    NK: { url: 'https://bangluong.tng.vn/NhapNhayKhau', label: 'Nhảy khâu', icon: '🧵' },
  };

  const isLogin = () => path === '/' || path.includes('/login') || path.includes('/account/login');
  const isCanhBao = () => path.includes('/canhbao');
  const isNS = () => path.includes('/nangsuatcongnhan');
  const isNK = () => path.includes('/nhapnhaykhau');
  const isTG = () => path.includes('/nhapthoigian');
  const isCD = () => path.includes('/tonghopcongdoan');

  const css = document.createElement('style');
  css.textContent = `
    :root{--tng-pri:#6366f1;--tng-ok:#10b981;--tng-err:#ef4444;--tng-font:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    .tng-fab{position:fixed;z-index:100000;border:0;border-radius:999px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:var(--tng-font);box-shadow:0 10px 30px rgba(0,0,0,.22);user-select:none;-webkit-tap-highlight-color:transparent}
    .tng-panel{position:fixed;z-index:100001;background:rgba(255,255,255,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.65);box-shadow:0 20px 60px rgba(0,0,0,.25);border-radius:22px;font-family:var(--tng-font);color:#0f172a}
    .tng-btn{border:0;border-radius:14px;padding:12px 14px;font-weight:800;font-family:var(--tng-font);cursor:pointer;background:linear-gradient(135deg,#6366f1,#818cf8);color:white}
    .tng-btn.ok{background:linear-gradient(135deg,#10b981,#34d399)}
    .tng-btn.err{background:linear-gradient(135deg,#ef4444,#f87171)}
    .tng-inp,.tng-sel{width:100%;box-sizing:border-box;border:1.5px solid #dbe3ef;border-radius:12px;padding:10px 12px;font:700 14px var(--tng-font);outline:0;background:#fff}
    .tng-row{display:grid;gap:8px;margin-bottom:10px}
    .tng-status{padding:8px 10px;border-radius:12px;text-align:center;font:700 12px var(--tng-font);display:none}
    .tng-status.i{display:block;background:#eef2ff;color:#4f46e5}
    .tng-status.s{display:block;background:#ecfdf5;color:#059669}
    .tng-status.e{display:block;background:#fef2f2;color:#dc2626}
    .tng-match{background:#fffbeb!important}
    .tng-match-cur{background:#fde68a!important;outline:2px solid #f59e0b!important}
    tr.tng-excluded{background:rgba(239,68,68,.08)!important;outline:2px solid rgba(239,68,68,.35)!important}
    .tng-short-cell{border:0;border-radius:18px;background:#f8fafc;padding:12px 6px;font-family:var(--tng-font);font-weight:800;color:#1e293b;cursor:pointer}
    .tng-short-cell:active{transform:scale(.95)}
  `;
  document.head.appendChild(css);

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const noDia = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();

  function fire(el) {
    if (!el) return;
    ['focus', 'input', 'change', 'blur'].forEach(x => {
      try { el.dispatchEvent(new Event(x, { bubbles: true, cancelable: true })); } catch {}
    });
    try { if (window.jQuery) window.jQuery(el).trigger('change'); } catch {}
    try { if (typeof el.onchange === 'function') el.onchange.call(el); } catch {}
  }

  function setNativeValue(el, value) {
    if (!el) return false;
    el.disabled = false;
    el.readOnly = false;
    el.removeAttribute('disabled');
    el.removeAttribute('readonly');
    el.classList.remove('aspNetDisabled');

    const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    const d = Object.getOwnPropertyDescriptor(proto, 'value');
    if (d?.set) d.set.call(el, value);
    else el.value = value;

    fire(el);
    return true;
  }

  function waitAsp(timeout = 4500) {
    return new Promise(resolve => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        try { obs.disconnect(); } catch {}
        resolve(true);
      };
      const obs = new MutationObserver(finish);
      try { obs.observe(document.body, { childList: true, subtree: true }); } catch {}
      try {
        if (window.Sys?.WebForms?.PageRequestManager) {
          const prm = Sys.WebForms.PageRequestManager.getInstance();
          const handler = () => {
            try { prm.remove_endRequest(handler); } catch {}
            finish();
          };
          prm.add_endRequest(handler);
        }
      } catch {}
      setTimeout(() => {
        if (!done) resolve(false);
        try { obs.disconnect(); } catch {}
      }, timeout);
    });
  }

  function postBack(el) {
    if (!el) return;
    const onchange = el.getAttribute('onchange') || '';
    try {
      if (onchange.includes('__doPostBack')) {
        new Function(onchange).call(el);
        return;
      }
    } catch {}
    try {
      if (typeof window.__doPostBack === 'function') window.__doPostBack(el.name || el.id, '');
    } catch {}
  }

  function selectByText(sel, wanted) {
    if (!sel || !wanted) return false;
    const q = noDia(wanted);
    const opts = [...sel.options || []];
    const found = opts.find(o => {
      const t = noDia(o.textContent);
      const v = noDia(o.value);
      return t === q || v === q || t.includes(q) || q.includes(t) || v.includes(q);
    });
    if (!found) return false;
    sel.selectedIndex = opts.indexOf(found);
    setNativeValue(sel, found.value);
    return true;
  }

  function autoCanhBao() {
  const clickExit = () => {
    const btn = document.querySelector('#btncloseMain') ||
      [...document.querySelectorAll('button,input[type=button],input[type=submit],a,.btn')]
        .find(e => /^(thoát|thoat)$/i.test((e.textContent || e.value || '').trim()));

    if (!btn) return false;

    sessionStorage.setItem('tng_need_auto_login', '1');

    try {
      if (typeof window.__doPostBack === 'function') {
        window.__doPostBack('btncloseMain', '');
      } else {
        btn.click();
      }
    } catch {
      btn.click();
    }

    return true;
  };

  if (clickExit()) return;

  const obs = new MutationObserver(() => {
    if (clickExit()) obs.disconnect();
  });

  obs.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => obs.disconnect(), 5000);
}

function autoLogin() {
  const shouldAuto =
    sessionStorage.getItem('tng_need_auto_login') === '1' ||
    path.includes('/login') ||
    document.querySelector('#btnLogin');

  if (!shouldAuto) return;

  const tryClick = () => {
    const btn =
      document.querySelector('#btnLogin') ||
      document.querySelector('input[name="btnLogin"]') ||
      [...document.querySelectorAll('button,input[type=submit],input[type=button],a,.btn')]
        .find(e => /đăng nhập|dang nhap|login|sign in/i.test((e.textContent || e.value || '').trim()));

    const user = document.querySelector('#txtmans');
    const pass = document.querySelector('#txtpass');

    if (!btn || !user || !pass) return false;
    if (!user.value || !pass.value) return false;

    sessionStorage.removeItem('tng_need_auto_login');
    btn.click();
    return true;
  };

  let count = 0;
  const timer = setInterval(() => {
    if (tryClick() || ++count >= 20) clearInterval(timer);
  }, 300);

  setTimeout(tryClick, 800);
}

  function unlockInputs() {
    const selectors = [
      'input[disabled]', 'textarea[disabled]', 'select[disabled]',
      'input[readonly]', 'textarea[readonly]',
      '.aspNetDisabled'
    ].join(',');
    document.querySelectorAll(selectors).forEach(el => {
      el.disabled = false;
      el.readOnly = false;
      el.removeAttribute('disabled');
      el.removeAttribute('readonly');
      el.classList.remove('aspNetDisabled');
      el.style.pointerEvents = '';
      el.tabIndex = 0;
    });
  }

  function autoUnlock() {
    unlockInputs();
    let timer = 0;
    new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(unlockInputs, 200);
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'readonly', 'class'] });

    let n = 0;
    const t = setInterval(() => {
      try {
        if (window.Sys?.WebForms?.PageRequestManager) {
          Sys.WebForms.PageRequestManager.getInstance().add_endRequest(unlockInputs);
          clearInterval(t);
        }
      } catch {}
      if (++n > 10) clearInterval(t);
    }, 1000);
  }

  function getNsInputs() {
    return [...document.querySelectorAll(
      'input[id*="txtThucHien_NhanVienToMay"],input[name*="txtThucHien_NhanVienToMay"]'
    )].filter(e => e.type === 'number' || e.type === 'text' || !e.type);
  }

  function getNsRows() {
    return getNsInputs().map((input, index) => ({ input, index, tr: input.closest('tr') })).filter(x => x.tr);
  }

  function clickSave() {
    const btn = [...document.querySelectorAll('button,input[type=submit],input[type=button],a,.btn')]
      .find(e => /^(lưu|luu|save|cập nhật|cap nhat|update)$/i.test((e.textContent || e.value || '').trim()));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }

  async function auto5Sao(statusEl) {
    const star5 = document.querySelector('input[name="rating"][value="5"]') || document.querySelector('#star5');
    if (!star5) {
      if (statusEl) { statusEl.className = 'tng-status e'; statusEl.textContent = '⚠️ Không thấy 5 sao'; }
      return false;
    }

    star5.checked = true;
    fire(star5);
    try { star5.click(); } catch {}

    await sleep(150);

    const btn = document.querySelector('#MainContent_ibtnDanhGia,input[id*="ibtnDanhGia"]');
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('disabled');
      btn.click();
    }

    if (statusEl) { statusEl.className = 'tng-status s'; statusEl.textContent = '⭐ Đã chọn 5 sao'; }
    return true;
  }

  function buildFillNS() {
    if (!isNS()) return;

    const wait = setInterval(() => {
      if (!getNsInputs().length && !document.querySelector('#MainContent_ddlMaHang')) return;
      clearInterval(wait);
      renderFillNS();
    }, 500);
    setTimeout(() => clearInterval(wait), 15000);
  }

  function renderFillNS() {
    if (document.querySelector('#tng-ns-wrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'tng-ns-wrap';

    const fab = document.createElement('button');
    fab.className = 'tng-fab';
    fab.textContent = '📋';
    fab.style.cssText = `
      left:${mob ? '12px' : '14px'};bottom:${mob ? 'calc(86px + env(safe-area-inset-bottom,0px))' : '18px'};
      width:${mob ? '54px' : '48px'};height:${mob ? '54px' : '48px'};
      background:linear-gradient(135deg,#10b981,#34d399);color:#fff;font-size:24px;
    `;

    const panel = document.createElement('div');
    panel.className = 'tng-panel';
    panel.style.cssText = mob
      ? 'display:none;left:10px;right:10px;bottom:calc(150px + env(safe-area-inset-bottom,0px));max-height:62vh;overflow:auto;padding:14px;'
      : 'display:none;left:14px;bottom:78px;width:340px;max-height:76vh;overflow:auto;padding:16px;';

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <b>⚡ Fill Năng Suất</b>
        <span style="font-size:11px;color:#64748b;background:#eef2ff;padding:3px 8px;border-radius:999px">v9.4</span>
      </div>

      <div class="tng-row">
        <label style="font-weight:800;font-size:12px">🏷️ Mã hàng</label>
        <input id="tng-ma-search" class="tng-inp" placeholder="Tìm mã hàng..." autocomplete="off">
        <select id="tng-ma-sel" class="tng-sel"></select>
      </div>

      <div class="tng-row">
        <label style="font-weight:800;font-size:12px">👤 TKC / Người hướng dẫn</label>
        <input id="tng-tkc-search" class="tng-inp" placeholder="Tìm TKC..." autocomplete="off">
        <select id="tng-tkc-sel" class="tng-sel"></select>
      </div>

      <label style="display:flex;align-items:center;justify-content:space-between;background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:10px;margin-bottom:10px;font-weight:800;font-size:13px;color:#9a3412">
        <span>⭐ Auto 5 sao</span>
        <input id="tng-auto5" type="checkbox" checked style="width:20px;height:20px">
      </label>

      <div class="tng-row">
        <label style="font-weight:800;font-size:12px">💰 NS chung</label>
        <input id="tng-ns-value" class="tng-inp" type="number" inputmode="decimal" placeholder="VD: 180" style="text-align:center;font-size:18px">
      </div>

      <div style="background:#f8fafc;border-radius:14px;padding:10px;margin-bottom:10px;font-size:12px;text-align:center">
        Tổng dòng NS: <b id="tng-total">0</b>
      </div>

      <button id="tng-fill-btn" class="tng-btn" style="width:100%">🚀 Điền tất cả</button>
      <div id="tng-status" class="tng-status"></div>
    `;

    wrap.appendChild(fab);
    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    const maSearch = panel.querySelector('#tng-ma-search');
    const maSel = panel.querySelector('#tng-ma-sel');
    const tkcSearch = panel.querySelector('#tng-tkc-search');
    const tkcSel = panel.querySelector('#tng-tkc-sel');
    const inp = panel.querySelector('#tng-ns-value');
    const btn = panel.querySelector('#tng-fill-btn');
    const st = panel.querySelector('#tng-status');
    const auto5 = panel.querySelector('#tng-auto5');
    const total = panel.querySelector('#tng-total');

    const realMa = () => document.querySelector('#MainContent_ddlMaHang,select[id*="ddlMaHang"]');
    const realTkc = () => document.querySelector('#MainContent_cmbThietkeChuyen,select[id*="cmbThietkeChuyen"]');

    function renderSelect(target, source, keyword, empty) {
      target.innerHTML = '';
      const opt0 = document.createElement('option');
      opt0.value = '';
      opt0.textContent = empty;
      target.appendChild(opt0);

      const q = noDia(keyword);
      [...source?.options || []].forEach(o => {
        const text = (o.textContent || '').trim();
        if (!text || o.value === '-1') return;
        if (q && !noDia(text + ' ' + o.value).includes(q)) return;
        const opt = document.createElement('option');
        opt.value = text;
        opt.textContent = text;
        target.appendChild(opt);
      });
    }

    function refresh() {
      renderSelect(maSel, realMa(), maSearch.value, 'Không đổi mã hàng');
      renderSelect(tkcSel, realTkc(), tkcSearch.value, 'Không đổi TKC');
      total.textContent = getNsInputs().length;
    }

    maSearch.addEventListener('input', refresh);
    tkcSearch.addEventListener('input', refresh);

    maSel.addEventListener('change', async () => {
      if (!maSel.value) return;
      const sel = realMa();
      st.className = 'tng-status i';
      st.textContent = 'Đang đổi mã hàng...';
      if (selectByText(sel, maSel.value)) {
        postBack(sel);
        await waitAsp(5000);
        st.className = 'tng-status s';
        st.textContent = '✅ Đã đổi mã hàng';
        setTimeout(refresh, 600);
      } else {
        st.className = 'tng-status e';
        st.textContent = '⚠️ Không chọn được mã hàng';
      }
    });

    tkcSel.addEventListener('change', async () => {
      if (!tkcSel.value) return;
      const sel = realTkc();
      if (selectByText(sel, tkcSel.value)) {
        localStorage.setItem('tng_v94_tkc', tkcSel.value);
        postBack(sel);
        st.className = 'tng-status s';
        st.textContent = '✅ Đã chọn TKC';
      }
    });

    let open = false;
    fab.addEventListener('click', () => {
      open = !open;
      panel.style.display = open ? 'block' : 'none';
      fab.textContent = open ? '✕' : '📋';
      fab.style.background = open ? 'linear-gradient(135deg,#ef4444,#f87171)' : 'linear-gradient(135deg,#10b981,#34d399)';
      if (open) {
        refresh();
        setTimeout(() => inp.focus(), 80);
      }
    });

    btn.addEventListener('click', async () => {
      const value = inp.value.trim();
      if (!value) {
        st.className = 'tng-status e';
        st.textContent = '⚠️ Nhập NS trước';
        inp.focus();
        return;
      }

      btn.disabled = true;

      if (auto5.checked) {
        st.className = 'tng-status i';
        st.textContent = 'Đang chọn 5 sao...';
        await auto5Sao(st);
        await sleep(250);
      }

      let els = getNsInputs();
      if (!els.length) {
        st.className = 'tng-status e';
        st.textContent = '⚠️ Không thấy ô nhập NS';
        btn.disabled = false;
        return;
      }

      st.className = 'tng-status i';
      st.textContent = `Đang điền 0/${els.length}`;

      let i = 0;
      const chunk = () => {
        const end = Math.min(i + 50, els.length);
        for (; i < end; i++) setNativeValue(els[i], value);

        st.textContent = `Đang điền ${i}/${els.length}`;

        if (i < els.length) {
          requestAnimationFrame(chunk);
          return;
        }

        st.className = 'tng-status s';
        st.textContent = `✅ Đã điền ${els.length} dòng → ${value}`;

        setTimeout(() => {
          const saved = clickSave();
          st.textContent = saved ? `✅ Đã điền ${els.length} dòng và bấm Lưu` : `✅ Đã điền ${els.length} dòng, chưa thấy nút Lưu`;
          btn.disabled = false;
        }, 250);
      };
      chunk();
    });

    refresh();
  }

  function getSearchTables() {
    const ids = [
      '#MainContent_gridNangSuatNhayKhau',
      '#MainContent_gridNangSuatToMay',
      '#MainContent_gridNhapThoiGian',
      '#MainContent_gridKyNangCongNhan'
    ];
    const arr = ids.map(s => document.querySelector(s)).filter(Boolean);
    if (arr.length) return arr;

    return [...document.querySelectorAll('table[id*="grid"],table')]
      .filter(t => t.querySelectorAll('tr').length > 2)
      .sort((a, b) => b.querySelectorAll('tr').length - a.querySelectorAll('tr').length)
      .slice(0, 3);
  }

  function getDataRows() {
    const rows = [];
    getSearchTables().forEach(tbl => {
      tbl.querySelectorAll('tr').forEach(tr => {
        if (tr.querySelector('th')) return;
        if (!tr.textContent.trim()) return;
        if (tr.querySelector('table')) return;
        rows.push(tr);
      });
    });
    return rows;
  }

function quickSearch() {
  if (!isNK()) return;
  if (document.querySelector('#tng-qs-host')) return;

  function noDiaQS(s) {
    try {
      return String(s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
    } catch {
      return String(s || '').toLowerCase().trim();
    }
  }

  function getTables() {
    const preferred = [
      '#MainContent_gridNangSuatNhayKhau',
      '#MainContent_gridNangSuatToMay',
      '#MainContent_gridNhapThoiGian',
      '#MainContent_gridKyNangCongNhan',
      'table[id*="NhayKhau"]',
      'table[id*="NangSuat"]',
      'table[id*="NhapThoiGian"]',
      'table[id*="grid"]'
    ];

    const found = [];
    preferred.forEach(sel => {
      document.querySelectorAll(sel).forEach(t => {
        if (!found.includes(t) && t.querySelectorAll('tr').length > 1) found.push(t);
      });
    });

    if (found.length) return found;

    return [...document.querySelectorAll('table')]
      .filter(t => t.querySelectorAll('tr').length > 2);
  }

  function getRows() {
    const rows = [];
    getTables().forEach(tbl => {
      tbl.querySelectorAll('tr').forEach(tr => {
        if (!tr.textContent.trim()) return;
        if (tr.querySelector('th')) return;
        if (tr.querySelector('table')) return;
        rows.push(tr);
      });
    });
    return rows;
  }

  let allRows = [];
  let matched = [];
  let hidden = [];
  let cur = -1;

  function restoreAll() {
    [...hidden, ...matched].forEach(r => {
      r.style.display = r._tngQsDisplay ?? '';
      r.classList.remove('tng-match', 'tng-match-cur');
    });
    hidden = [];
    matched = [];
    cur = -1;
  }

  function showCur() {
    matched.forEach((r, i) => {
      r.classList.toggle('tng-match', true);
      r.classList.toggle('tng-match-cur', i === cur);
    });

    if (matched[cur]) {
      matched[cur].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }

    updateBadge();
  }

  function updateBadge() {
    const badge = shadow.querySelector('.badge');
    if (!badge) return;

    if (!matched.length) {
      badge.textContent = input.value.trim() ? '0 kết quả' : '';
      badge.className = input.value.trim() ? 'badge empty' : 'badge';
      return;
    }

    badge.textContent = `${cur + 1}/${matched.length}`;
    badge.className = 'badge show';
  }

  function doFilter(q) {
    restoreAll();

    const norm = noDiaQS(q);
    allRows = getRows();

    if (!norm) {
      updateBadge();
      return;
    }

    allRows.forEach(r => {
      if (r._tngQsDisplay === undefined) r._tngQsDisplay = r.style.display || '';

      const txt = noDiaQS(r.textContent);
      if (txt.includes(norm)) {
        matched.push(r);
        r.classList.add('tng-match');
      } else {
        hidden.push(r);
        r.style.display = 'none';
      }
    });

    if (matched.length) {
      cur = 0;
      showCur();
    } else {
      updateBadge();
    }
  }

  function nav(dir) {
    if (!matched.length) return;
    cur = (cur + dir + matched.length) % matched.length;
    showCur();
  }

  const host = document.createElement('div');
  host.id = 'tng-qs-host';
  host.style.cssText = `
    all:initial!important;
    position:fixed!important;
    top:0!important;
    left:0!important;
    width:0!important;
    height:0!important;
    overflow:visible!important;
    z-index:2147483647!important;
    pointer-events:none!important;
  `;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  shadow.innerHTML = `
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      .bar{
        position:fixed;
        top:calc(10px + env(safe-area-inset-top,0px));
        left:50%;
        transform:translateX(-50%);
        width:${mob ? 'calc(100vw - 20px)' : '460px'};
        display:none;
        align-items:center;
        gap:7px;
        padding:9px;
        background:rgba(255,255,255,.98);
        backdrop-filter:blur(22px) saturate(1.8);
        -webkit-backdrop-filter:blur(22px) saturate(1.8);
        border:1px solid rgba(0,0,0,.08);
        border-radius:18px;
        box-shadow:0 12px 36px rgba(0,0,0,.22);
        pointer-events:auto;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }
      .bar.open{display:flex}
      input{
        flex:1;
        min-width:0;
        border:1.5px solid #e5e7eb;
        border-radius:12px;
        padding:${mob ? '11px 12px' : '9px 12px'};
        font:${mob ? '17px' : '15px'} -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        outline:none;
        background:#f9fafb;
      }
      input:focus{
        border-color:#6366f1;
        background:#fff;
        box-shadow:0 0 0 3px rgba(99,102,241,.12);
      }
      button{
        width:${mob ? '40px' : '34px'};
        height:${mob ? '40px' : '34px'};
        border:0;
        border-radius:11px;
        font-weight:900;
        cursor:pointer;
        background:#eef2ff;
        color:#4f46e5;
        -webkit-tap-highlight-color:transparent;
      }
      .close{background:#fee2e2;color:#dc2626}
      .badge{
        display:none;
        white-space:nowrap;
        padding:7px 9px;
        border-radius:10px;
        background:#ecfdf5;
        color:#059669;
        font:800 12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }
      .badge.show{display:block}
      .badge.empty{display:block;background:#fef2f2;color:#dc2626}
      .fab{
        position:fixed;
        right:14px;
        bottom:calc(86px + env(safe-area-inset-bottom,0px));
        width:${mob ? '54px' : '48px'};
        height:${mob ? '54px' : '48px'};
        border:0;
        border-radius:999px;
        background:linear-gradient(135deg,#6366f1,#818cf8);
        color:white;
        font-size:22px;
        box-shadow:0 10px 30px rgba(0,0,0,.25);
        pointer-events:auto;
      }
    </style>

    <div class="bar">
      <span style="font-size:18px">🔎</span>
      <input placeholder="Tìm công đoạn, mã hàng, tên..." />
      <span class="badge"></span>
      <button class="prev">↑</button>
      <button class="next">↓</button>
      <button class="close">×</button>
    </div>
    <button class="fab">🔎</button>
  `;

  const bar = shadow.querySelector('.bar');
  const fab = shadow.querySelector('.fab');
  const input = shadow.querySelector('input');
  function syncQuickSearchWithActionCenter() {
  const actionPanel =
    document.querySelector('#tng-action-center .tng-panel') ||
    document.querySelector('#tng-action-center [class*="panel"]');

  if (!actionPanel) return;

  const isActionOpen = getComputedStyle(actionPanel).display !== 'none';

  if (isActionOpen) {
    fab.style.display = 'none';
    bar.classList.remove('open');
    restoreAll();
    input.value = '';
    updateBadge();
  } else {
    if (!bar.classList.contains('open')) {
      fab.style.display = 'block';
    }
  }
}

setInterval(syncQuickSearchWithActionCenter, 200);

  fab.addEventListener('click', () => {
  const actionPanel =
    document.querySelector('#tng-action-center .tng-panel') ||
    document.querySelector('#tng-action-center [class*="panel"]');

  if (actionPanel && getComputedStyle(actionPanel).display !== 'none') return;

  bar.classList.add('open');
  fab.style.display = 'none';
  setTimeout(() => input.focus(), 50);
});

  shadow.querySelector('.close').addEventListener('click', () => {
    restoreAll();
    input.value = '';
    updateBadge();
    bar.classList.remove('open');
    fab.style.display = 'block';
  });

  shadow.querySelector('.prev').addEventListener('click', () => nav(-1));
  shadow.querySelector('.next').addEventListener('click', () => nav(1));

  input.addEventListener('input', () => doFilter(input.value));

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nav(e.shiftKey ? -1 : 1);
    }
    if (e.key === 'Escape') {
      restoreAll();
      input.value = '';
      updateBadge();
      bar.classList.remove('open');
      fab.style.display = 'block';
    }
  });

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      bar.classList.add('open');
      fab.style.display = 'none';
      setTimeout(() => input.focus(), 50);
    }
  });
}

  function actionCenter() {
    if (isLogin() || isCanhBao()) return;
    if (document.querySelector('#tng-action-center')) return;

    const box = document.createElement('div');
    box.id = 'tng-action-center';

    const fab = document.createElement('button');
    fab.className = 'tng-fab';
    fab.textContent = '⚡';
    fab.style.cssText = `
      right:14px;bottom:${mob ? 'calc(18px + env(safe-area-inset-bottom,0px))' : '18px'};
      width:${mob ? '54px' : '48px'};height:${mob ? '54px' : '48px'};
      background:linear-gradient(135deg,#111827,#334155);color:#fff;font-size:24px;
    `;

    const panel = document.createElement('div');
    panel.className = 'tng-panel';
    panel.style.cssText = mob
      ? 'display:none;left:10px;right:10px;bottom:calc(86px + env(safe-area-inset-bottom,0px));padding:14px'
      : 'display:none;right:14px;bottom:78px;width:360px;padding:16px';

    panel.innerHTML = `
      <div style="font-weight:900;margin-bottom:12px">⚡ TNG Action Center</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
        ${Object.entries(SHORTCUTS).map(([k, v]) => `
          <button class="tng-short-cell" data-url="${v.url}">
            <div style="font-size:22px">${v.icon}</div>
            <div style="font-size:12px">${k}</div>
            <div style="font-size:10px;color:#64748b">${v.label}</div>
          </button>
        `).join('')}
      </div>
    `;

    box.appendChild(fab);
    box.appendChild(panel);
    document.body.appendChild(box);

    let open = false;
    fab.addEventListener('click', () => {
      open = !open;
      panel.style.display = open ? 'block' : 'none';
      fab.textContent = open ? '×' : '⚡';
    });

    panel.querySelectorAll('[data-url]').forEach(b => {
      b.addEventListener('click', () => location.href = b.dataset.url);
    });
  }

  function init() {
    autoUnlock();

    if (isCanhBao()) autoCanhBao();
    if (isLogin()) autoLogin();

    actionCenter();
    buildFillNS();
    quickSearch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();