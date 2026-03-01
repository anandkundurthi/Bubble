'use strict';
const user = Auth.requireAuth();
if (!user) throw new Error();

document.getElementById('headerMount').innerHTML    = buildHeader('profile');
document.getElementById('sidebarMount').innerHTML   = buildSidebar('profile');
document.getElementById('bottomNavMount').innerHTML = buildBottomNav('profile');

const posts = [
  { emoji:'🌆', bg:'linear-gradient(135deg,rgba(131,58,180,0.5),rgba(253,29,29,0.3)),#0d0d1a', likes:2847, comments:89 },
  { emoji:'💻', bg:'linear-gradient(135deg,rgba(15,12,41,0.9),rgba(48,43,99,0.8)),#0d0d1a', likes:780, comments:22 },
  { emoji:'🚀', bg:'linear-gradient(135deg,rgba(199,125,255,0.4),rgba(224,170,255,0.2)),#1a0530', likes:3120, comments:178 },
  { emoji:'☕', bg:'linear-gradient(135deg,rgba(120,80,40,0.5),rgba(80,50,20,0.3)),#1a1005', likes:650, comments:31 },
  { emoji:'🌅', bg:'linear-gradient(135deg,rgba(252,74,26,0.4),rgba(247,183,51,0.3)),#1a0800', likes:1200, comments:55 },
  { emoji:'🎯', bg:'linear-gradient(135deg,rgba(56,239,125,0.3),rgba(17,153,142,0.4)),#0a1a0d', likes:430, comments:14 },
];

function renderProfile() {
  // Header
  document.getElementById('profileHeader').innerHTML = `
    <div class="profile-av-wrap">
      <div class="profile-av-ring">
        <div class="profile-av-inner">
          <div class="avatar avatar-xxl" style="background:${user.gradient};width:100%;height:100%">${user.avatar}</div>
        </div>
      </div>
      <div class="profile-av-edit" onclick="openEditModal()" title="Edit photo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </div>
    </div>
    <div class="profile-info">
      <div class="profile-username">@${user.username}</div>
      <div class="profile-name">${user.name}</div>
      <div class="profile-joined">📅 Joined ${user.joined}</div>
    </div>`;

  // Stats
  document.getElementById('profileStats').innerHTML = `
    <div class="stat-item"><div class="stat-num">${user.posts || posts.length}</div><div class="stat-lbl">Posts</div></div>
    <div class="stat-item" onclick="showToast('Followers list coming soon','')"><div class="stat-num">${(user.followers||0).toLocaleString()}</div><div class="stat-lbl">Followers</div></div>
    <div class="stat-item" onclick="showToast('Following list coming soon','')"><div class="stat-num">${(user.following||0).toLocaleString()}</div><div class="stat-lbl">Following</div></div>`;

  // Bio
  document.getElementById('profileBio').innerHTML = `
    <div class="profile-bio-text">${user.bio || '✨ No bio yet — add one!'}</div>
    <a href="mailto:${user.email}" class="profile-website">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      ${user.email}
    </a>`;

  // Actions
  document.getElementById('profileActions').innerHTML = `
    <button class="btn btn-secondary" onclick="openEditModal()" style="flex:1">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Edit Profile
    </button>
    <button class="btn btn-secondary" onclick="showToast('Share link copied! 🔗','success')" style="flex:1">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
      Share Profile
    </button>
    <button class="btn btn-danger btn-sm" onclick="Auth.logout()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </button>`;
}

function renderGrid(tab) {
  const grid = document.getElementById('profileGrid');
  grid.innerHTML = '';
  if (tab === 'saved' || tab === 'tagged') {
    grid.innerHTML = `<div class="empty-grid"><div class="empty-grid-icon">${tab==='saved'?'🔖':'🏷️'}</div><div class="empty-grid-text">No ${tab} posts yet.</div></div>`;
    return;
  }
  posts.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'profile-grid-item';
    el.style.cssText = `background:${p.bg};animation-delay:${i*0.05}s`;
    el.innerHTML = `
      <span class="grid-emoji">${p.emoji}</span>
      <div class="grid-overlay">
        <span>❤️ ${p.likes.toLocaleString()}</span>
        <span>💬 ${p.comments}</span>
      </div>`;
    grid.appendChild(el);
  });
}

function switchTab(btn, tab) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGrid(tab);
}

// Edit modal
function openEditModal() {
  document.getElementById('editAvatarRow').innerHTML = `
    <div class="edit-avatar-circle" onclick="showToast('Photo upload coming soon 📸','')">
      <div class="avatar avatar-xl" style="background:${user.gradient}">${user.avatar}</div>
      <div class="edit-av-overlay">📷</div>
    </div>`;
  document.getElementById('editName').value     = user.name;
  document.getElementById('editUsername').value = user.username;
  document.getElementById('editBio').value      = user.bio || '';
  document.getElementById('editModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  document.body.style.overflow = '';
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('saveProfileBtn');
  btn.disabled = true; btn.textContent = 'Saving…';
  await fakeDelay(800);

  const updated = Auth.updateUser({
    name:     document.getElementById('editName').value.trim(),
    username: document.getElementById('editUsername').value.trim(),
    bio:      document.getElementById('editBio').value.trim(),
  });
  btn.disabled = false; btn.textContent = 'Save Changes';

  if (updated) {
    showToast('Profile updated! ✨', 'success');
    closeEditModal();
    location.reload();
  }
});

window.openEditModal  = openEditModal;
window.closeEditModal = closeEditModal;
window.switchTab      = switchTab;

renderProfile();
renderGrid('posts');
