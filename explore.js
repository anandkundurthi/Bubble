'use strict';
Auth.requireAuth();
document.getElementById('headerMount').innerHTML  = buildHeader('explore');
document.getElementById('sidebarMount').innerHTML = buildSidebar('explore');
document.getElementById('bottomNavMount').innerHTML = buildBottomNav('explore');

const tags = ['For You','Trending','Design','Tech','Travel','Food','Fitness','Art','Music'];
const allUsers = Auth.getUsers();

const gridItems = [
  { big:true,  emoji:'🌆', bg:'linear-gradient(135deg,rgba(131,58,180,0.5),rgba(253,29,29,0.3),rgba(252,176,69,0.2)),#0d0d1a', likes:4201, comments:89 },
  { big:false, emoji:'🌿', bg:'linear-gradient(135deg,rgba(17,153,142,0.5),rgba(56,239,125,0.2)),#0d1a0d', likes:1102, comments:34 },
  { big:false, emoji:'💻', bg:'linear-gradient(135deg,rgba(15,12,41,0.9),rgba(48,43,99,0.8)),#0d0d1a', likes:780, comments:22 },
  { big:false, emoji:'🔥', bg:'linear-gradient(135deg,rgba(252,74,26,0.5),rgba(247,183,51,0.3)),#1a0500', likes:3345, comments:210 },
  { big:false, emoji:'🎨', bg:'linear-gradient(135deg,rgba(161,140,209,0.5),rgba(251,194,235,0.3)),#1a0530', likes:655, comments:18 },
  { big:true,  emoji:'🌸', bg:'linear-gradient(135deg,rgba(249,83,198,0.4),rgba(185,29,115,0.3)),#1a0533', likes:2900, comments:145 },
  { big:false, emoji:'🏏', bg:'linear-gradient(135deg,rgba(0,131,176,0.5),rgba(0,180,219,0.3)),#0f2027', likes:540, comments:67 },
  { big:false, emoji:'💪', bg:'linear-gradient(135deg,rgba(86,171,47,0.5),rgba(168,224,99,0.3)),#0a2e0a', likes:1880, comments:92 },
  { big:false, emoji:'🚀', bg:'linear-gradient(135deg,rgba(199,125,255,0.4),rgba(224,170,255,0.2)),#1a0530', likes:3120, comments:178 },
];

// Render tags
const tagsEl = document.getElementById('exploreTags');
tags.forEach((t,i) => {
  const btn = document.createElement('button');
  btn.className = 'explore-tag' + (i===0?' active':'');
  btn.textContent = t;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.explore-tag').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showToast(`Showing: ${t}`, '');
  });
  tagsEl.appendChild(btn);
});

// Render grid
const grid = document.getElementById('exploreGrid');
gridItems.forEach((item, i) => {
  const el = document.createElement('div');
  el.className = 'explore-item' + (item.big ? ' big' : '');
  el.style.cssText = `background:${item.bg};animation-delay:${i*0.04}s`;
  el.innerHTML = `
    <span class="explore-item-emoji">${item.emoji}</span>
    <div class="explore-item-overlay">
      <span>❤️ ${item.likes.toLocaleString()}</span>
      <span>💬 ${item.comments}</span>
    </div>`;
  grid.appendChild(el);
});

// Search
const searchInput  = document.getElementById('searchInput');
const searchClear  = document.getElementById('searchClear');
const searchResults= document.getElementById('searchResults');
const exploreGrid  = document.getElementById('exploreGrid');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  searchClear.style.display = q ? 'block' : 'none';
  if (!q) { searchResults.style.display='none'; exploreGrid.style.display='grid'; return; }

  exploreGrid.style.display = 'none';
  searchResults.style.display = 'block';

  const matches = allUsers.filter(u => u.username.includes(q) || u.name.toLowerCase().includes(q));
  if (!matches.length) {
    searchResults.innerHTML = `<div class="no-results"><div class="no-results-icon">🔍</div><div class="no-results-text">No results for "${q}"</div></div>`;
    return;
  }
  searchResults.innerHTML = matches.map(u => `
    <div class="search-result-item" onclick="window.location.href='profile.html'">
      <div class="avatar avatar-md" style="background:${u.gradient}">${u.avatar}</div>
      <div class="search-result-meta">
        <div class="search-result-name">${u.username}</div>
        <div class="search-result-sub">${u.name} · ${u.followers} followers</div>
      </div>
      <button class="search-result-action">Follow</button>
    </div>`).join('');
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.style.display = 'none';
  searchResults.style.display = 'none';
  exploreGrid.style.display = 'grid';
  searchInput.focus();
});
