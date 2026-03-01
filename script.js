/* ═══════════════════════════════════
   BUBBLE — script.js  (Home feed)
   ═══════════════════════════════════ */
'use strict';

const user = Auth.requireAuth();
if (!user) throw new Error('Not logged in');

// Mount nav chrome
document.getElementById('headerMount').innerHTML  = buildHeader('home');
document.getElementById('sidebarMount').innerHTML = buildSidebar('home');
document.getElementById('bottomNavMount').innerHTML = buildBottomNav('home');

// ── Data ──────────────────────────────────────────────────────────────
const stories = [
  { id:0, username:'Your Story', isYours:true,  gradient:'linear-gradient(135deg,#2a2a3a,#18182a)', initial:'🫧', seen:false, content:{emoji:'📸',text:'Add to your story',bg:'linear-gradient(160deg,#0d0d1a,#1a1030)'}, time:'Now' },
  { id:1, username:'anand.k',    gradient:'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)', initial:'A', seen:false, content:{emoji:'💻',text:'Shipped a feature today 🚀',bg:'linear-gradient(160deg,#0f0c29,#302b63)'}, time:'2m ago' },
  { id:2, username:'priya.dev',  gradient:'linear-gradient(135deg,#11998e,#38ef7d)',         initial:'P', seen:false, content:{emoji:'🌿',text:'Morning walk & coffee ☕',bg:'linear-gradient(160deg,#0a1f0a,#134e5e)'}, time:'15m ago' },
  { id:3, username:'ravi_x',     gradient:'linear-gradient(135deg,#fc4a1a,#f7b733)',         initial:'R', seen:true,  content:{emoji:'🔥',text:'Hustle mode: ON',bg:'linear-gradient(160deg,#1a0500,#6f0000)'},          time:'1h ago' },
  { id:4, username:'sneha.ui',   gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)',         initial:'S', seen:false, content:{emoji:'🎨',text:'New design system dropped!',bg:'linear-gradient(160deg,#1a0530,#2d1b69)'},time:'2h ago' },
  { id:5, username:'karthik99',  gradient:'linear-gradient(135deg,#0083b0,#00b4db)',         initial:'K', seen:true,  content:{emoji:'🏏',text:'Weekend cricket 🏆',bg:'linear-gradient(160deg,#0f2027,#2c5364)'},        time:'3h ago' },
  { id:6, username:'meera.art',  gradient:'linear-gradient(135deg,#f953c6,#b91d73)',         initial:'M', seen:false, content:{emoji:'🌸',text:'Sketch of the day 🖌️',bg:'linear-gradient(160deg,#1a0533,#4a0a4a)'},     time:'5h ago' },
];

const posts = [
  { id:'p1', username:'anand.k', gradient:'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)', initial:'A', location:'Hyderabad, India', emoji:'🌆', likes:2847, caption:'Shipped a new feature today 🚀 Full-stack life hits different. #buildinpublic', time:'2 hours ago', unseen:false },
  { id:'p2', username:'priya.dev', gradient:'linear-gradient(135deg,#11998e,#38ef7d)', initial:'P', location:'Bangalore, India', emoji:'🌿', likes:1204, caption:'Morning walks clear the mind. Design is everywhere 🌱 #uidesign #morningvibes', time:'5 hours ago', unseen:true },
  { id:'p3', username:'ravi_x', gradient:'linear-gradient(135deg,#fc4a1a,#f7b733)', initial:'R', location:'Mumbai, India', emoji:'🔥', likes:5621, caption:'3rd consecutive 5AM wake-up. The grind is real 💪 #entrepreneur #mindset', time:'8 hours ago', unseen:false },
  { id:'p4', username:'sneha.ui', gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)', initial:'S', location:'Pune, India', emoji:'🎨', likes:988, caption:'Just dropped my new design system — 200+ components, dark mode, fully accessible ✨', time:'1 day ago', unseen:true },
];

const suggestions = [
  { username:'dev.nisha',  sub:'Suggested for you',   gradient:'linear-gradient(135deg,#f7971e,#ffd200)', initial:'N' },
  { username:'sam.builds', sub:'Followed by anand.k', gradient:'linear-gradient(135deg,#4776e6,#8e54e9)', initial:'S' },
  { username:'tara.codes', sub:'New to Bubble',        gradient:'linear-gradient(135deg,#ee0979,#ff6a00)', initial:'T' },
  { username:'rishi.io',   sub:'Suggested for you',   gradient:'linear-gradient(135deg,#00c6ff,#0072ff)', initial:'R' },
];

// ── Render stories ────────────────────────────────────────────────────
function renderStories() {
  const row = document.getElementById('storiesRow');
  row.innerHTML = '';
  stories.forEach((s, i) => {
    const b = document.createElement('div');
    b.className = 'story-bubble' + (s.isYours ? ' your-story':'');
    b.style.animationDelay = `${i*0.055}s`;

    const wrap = document.createElement('div');
    wrap.id = `ring-${s.id}`;
    wrap.className = 'story-ring-wrap ' + (s.isYours ? 'seen' : s.seen ? 'seen' : 'unseen');
    wrap.style.cssText = `width:68px;height:68px;position:relative;`;

    const inner = document.createElement('div');
    inner.className = 'story-ring-inner-border';
    inner.style.cssText = `width:100%;height:100%;`;

    const av = document.createElement('div');
    av.className = 'avatar';
    av.style.cssText = `width:100%;height:100%;background:${s.gradient};font-size:${s.isYours?'24px':'22px'}`;
    av.textContent = s.initial;

    inner.appendChild(av);
    wrap.appendChild(inner);

    if (s.isYours) {
      const add = document.createElement('div');
      add.className = 'story-add-icon';
      add.textContent = '+';
      wrap.appendChild(add);
    }

    const lbl = document.createElement('div');
    lbl.className = 'story-label';
    lbl.textContent = s.isYours ? 'Your Story' : s.username;

    b.appendChild(wrap);
    b.appendChild(lbl);
    b.addEventListener('click', () => openStory(i));
    row.appendChild(b);
  });
}

// ── Render posts ──────────────────────────────────────────────────────
function renderPosts() {
  const section = document.getElementById('feedPosts');
  section.innerHTML = '';
  posts.forEach((p, i) => {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.style.animationDelay = `${i*0.09}s`;
    article.innerHTML = `
      <div class="post-header">
        <div class="post-av-ring ${p.unseen?'unseen':''}" style="width:42px;height:42px">
          <div class="post-av-inner" style="width:100%;height:100%">
            <div class="avatar" style="width:100%;height:100%;background:${p.gradient};font-size:16px">${p.initial}</div>
          </div>
        </div>
        <div class="post-meta">
          <span class="post-username">${p.username}</span>
          <span class="post-location">📍 ${p.location}</span>
        </div>
        <button class="action-btn post-more" aria-label="More">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
        </button>
      </div>
      <div class="post-image" style="background:linear-gradient(135deg,rgba(40,40,60,0.8),rgba(20,20,35,0.9))">
        <span class="post-image-placeholder">${p.emoji}</span>
      </div>
      <div class="post-actions">
        <div class="post-actions-left">
          <button class="action-btn like-btn" data-post="${p.id}" aria-label="Like">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <button class="action-btn" aria-label="Comment">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="action-btn" aria-label="Share">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <button class="action-btn save-btn" data-post="${p.id}" aria-label="Save">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <div class="post-likes" id="likes-${p.id}">${p.likes.toLocaleString()} likes</div>
      <div class="post-caption"><strong>${p.username}</strong> ${p.caption}</div>
      <div class="post-time">${p.time}</div>
    `;
    section.appendChild(article);
  });

  // Like / save interactions
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.post;
      btn.classList.toggle('liked');
      const post = posts.find(p => p.id === pid);
      if (post) {
        post.likes += btn.classList.contains('liked') ? 1 : -1;
        document.getElementById(`likes-${pid}`).textContent = post.likes.toLocaleString() + ' likes';
      }
    });
  });
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('saved');
      showToast(btn.classList.contains('saved') ? 'Saved to collection ✨' : 'Removed from collection', btn.classList.contains('saved') ? 'success' : '');
    });
  });
}

// ── Render right panel ────────────────────────────────────────────────
function renderRightPanel() {
  const rp = document.getElementById('rightPanel');
  if (!rp) return;
  rp.innerHTML = `
    <div class="rp-profile">
      <div class="avatar avatar-md" style="background:${user.gradient}">${user.avatar}</div>
      <div class="rp-meta">
        <div class="rp-uname">${user.username}</div>
        <div class="rp-name">${user.name}</div>
      </div>
      <button class="rp-switch" onclick="Auth.logout()">Log out</button>
    </div>
    <div class="rp-section-title">Suggested for you</div>
    <div class="rp-suggestions">
      ${suggestions.map((s,i) => `
        <div class="rp-sug" style="animation-delay:${i*0.07}s">
          <div class="avatar avatar-sm" style="background:${s.gradient}">${s.initial}</div>
          <div class="rp-sug-info">
            <div class="rp-sug-uname">${s.username}</div>
            <div class="rp-sug-sub">${s.sub}</div>
          </div>
          <button class="rp-follow-btn" onclick="this.classList.toggle('following');this.textContent=this.classList.contains('following')?'Following':'Follow'">Follow</button>
        </div>`).join('')}
    </div>
    <div class="rp-footer">About · Help · Privacy · Terms<br><span style="opacity:0.4;font-size:10px">© 2025 Bubble</span></div>
  `;
}

// ── Story viewer ──────────────────────────────────────────────────────
let activeIdx = null, progressTimer = null, progressVal = 0;
const DURATION = 5000;

function openStory(idx) {
  if (idx < 0 || idx >= stories.length) return;
  activeIdx = idx;
  const s = stories[idx];
  s.seen = true;
  updateRing(s.id);

  buildSegs(idx);
  const av = document.getElementById('svAvatar');
  av.style.background = s.gradient;
  av.textContent = s.initial;
  document.getElementById('svName').textContent = s.isYours ? 'Your Story' : s.username;
  document.getElementById('svTime').textContent = s.time;
  document.getElementById('storyViewer').style.background = s.content.bg;
  document.getElementById('storyContent').innerHTML = `
    <div class="story-content-inner">
      <div class="story-emoji">${s.content.emoji}</div>
      <div class="story-text">${s.content.text}</div>
    </div>`;
  document.getElementById('storyModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  startProgress();
}

function buildSegs(cur) {
  const segs = document.getElementById('storySegments');
  segs.innerHTML = '';
  stories.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.className = 'story-seg' + (i < cur ? ' done' : '');
    seg.id = `seg-${i}`;
    const fill = document.createElement('div');
    fill.className = 'story-seg-fill';
    if (i < cur) fill.style.width = '100%';
    seg.appendChild(fill);
    segs.appendChild(seg);
  });
}

function closeStory() {
  clearTimer();
  document.getElementById('storyModal').classList.remove('open');
  document.body.style.overflow = '';
  activeIdx = null; progressVal = 0;
}
function nextStory() { clearTimer(); activeIdx < stories.length-1 ? openStory(activeIdx+1) : closeStory(); }
function prevStory() { clearTimer(); activeIdx > 0 ? openStory(activeIdx-1) : restartStory(); }
function restartStory() {
  clearTimer(); progressVal = 0;
  const f = document.querySelector(`#seg-${activeIdx} .story-seg-fill`);
  if (f) f.style.width = '0%';
  startProgress();
}
function startProgress() {
  progressVal = 0;
  const fill = document.querySelector(`#seg-${activeIdx} .story-seg-fill`);
  if (fill) { fill.style.transition='none'; fill.style.width='0%'; }
  progressTimer = setInterval(() => {
    progressVal = Math.min(progressVal + (50/DURATION)*100, 100);
    if (fill) fill.style.width = progressVal + '%';
    if (progressVal >= 100) { clearTimer(); nextStory(); }
  }, 50);
}
function clearTimer() { if (progressTimer) { clearInterval(progressTimer); progressTimer = null; } }
function updateRing(id) {
  const r = document.getElementById(`ring-${id}`);
  if (!r || !r.classList.contains('unseen')) return;
  r.classList.replace('unseen','just-seen');
  setTimeout(() => r.classList.replace('just-seen','seen'), 700);
}

document.getElementById('storyCloseBtn').addEventListener('click', closeStory);
document.getElementById('storyBackdrop').addEventListener('click', closeStory);
document.getElementById('storyTapRight').addEventListener('click', nextStory);
document.getElementById('storyTapLeft').addEventListener('click', prevStory);
document.addEventListener('keydown', e => {
  if (!document.getElementById('storyModal').classList.contains('open')) return;
  if (e.key==='ArrowRight') nextStory();
  if (e.key==='ArrowLeft')  prevStory();
  if (e.key==='Escape')     closeStory();
});

// Touch swipe
let tx = 0;
document.getElementById('storyViewer').addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive:true});
document.getElementById('storyViewer').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) dx > 0 ? prevStory() : nextStory();
}, {passive:true});

// ── Init ──────────────────────────────────────────────────────────────
renderStories();
renderPosts();
renderRightPanel();
