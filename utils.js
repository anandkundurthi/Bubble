/* ═══════════════════════════════════
   BUBBLE — utils.js  (shared helpers)
   ═══════════════════════════════════ */
'use strict';

function showToast(msg, type = '', duration = 2800) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => t.remove(), 300);
  }, duration);
}

function fakeDelay(ms) { return new Promise(r => setTimeout(r, ms)); }

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'just now';
  if (m < 60)  return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24)  return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

function buildSidebar(activePage) {
  const user = Auth.getSession();
  const pages = [
    { href: 'index.html',   label: 'Home',    icon: '<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' },
    { href: 'explore.html', label: 'Explore', icon: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', stroke: true },
    { href: '#',            label: 'Upload',  icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8m-4-4h8"/>', stroke: true },
    { href: '#',            label: 'Activity',icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', stroke: true },
    { href: 'profile.html', label: 'Profile', isAvatar: true },
  ];

  return `
  <aside class="sidebar">
    <div class="sidebar-logo-wrap">
      <a href="index.html" class="bubble-logo">Bubble <span class="dot">●</span></a>
    </div>
    <nav class="sidebar-nav">
      ${pages.map(p => {
        const isActive = activePage === p.label.toLowerCase();
        if (p.isAvatar) {
          return `<a href="${p.href}" class="sidebar-item${isActive?' active':''}">
            <div class="avatar avatar-xs" style="background:${user?.gradient||'#333'}">${user?.avatar||'?'}</div>
            <span>${p.label}</span>
          </a>`;
        }
        const fill = p.stroke ? 'none' : 'currentColor';
        const stroke = p.stroke ? 'stroke="currentColor" stroke-width="2"' : '';
        return `<a href="${p.href}" class="sidebar-item${isActive?' active':''}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="${fill}" ${stroke}>${p.icon}</svg>
          <span>${p.label}</span>
        </a>`;
      }).join('')}
      <div class="sidebar-divider"></div>
      <button class="sidebar-item" onclick="Auth.logout()" style="color:var(--text-3)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        <span>Log out</span>
      </button>
    </nav>
  </aside>`;
}

function buildHeader(activePage) {
  const user = Auth.getSession();
  return `
  <header class="app-header" id="appHeader">
    <div class="header-inner">
      <a href="index.html" class="bubble-logo" style="font-size:22px">Bubble <span class="dot">●</span></a>
      <div class="header-actions">
        <a href="explore.html" class="icon-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </a>
        <button class="icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span class="badge">3</span>
        </button>
        <a href="profile.html" class="icon-btn" aria-label="Profile">
          <div class="avatar avatar-xs" style="background:${user?.gradient||'#333'}">${user?.avatar||'?'}</div>
        </a>
      </div>
    </div>
  </header>`;
}

function buildBottomNav(activePage) {
  const pages = [
    { href:'index.html',   page:'home',    icon:'<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' },
    { href:'explore.html', page:'explore', icon:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>', stroke:true },
    { href:'#',            page:'upload',  isAdd:true },
    { href:'#',            page:'activity',icon:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>', stroke:true },
    { href:'profile.html', page:'profile', isAvatar:true },
  ];
  const user = Auth.getSession();
  return `
  <nav class="bottom-nav">
    ${pages.map(p => {
      const isActive = activePage === p.page;
      if (p.isAdd) return `<button class="bnav-btn bnav-add" aria-label="Create"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>`;
      if (p.isAvatar) return `<a href="${p.href}" class="bnav-btn${isActive?' active':''}"><div class="avatar avatar-xs" style="background:${user?.gradient||'#333'}">${user?.avatar||'?'}</div></a>`;
      const fill = p.stroke ? 'none' : 'currentColor';
      const stroke = p.stroke ? 'stroke="currentColor" stroke-width="2"':'';
      return `<a href="${p.href}" class="bnav-btn${isActive?' active':''}"><svg width="24" height="24" viewBox="0 0 24 24" fill="${fill}" ${stroke}>${p.icon}</svg></a>`;
    }).join('')}
  </nav>`;
}
