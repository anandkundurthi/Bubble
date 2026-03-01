/* ════════════════════════════════════════════
   BUBBLE — auth.js  (localStorage-based auth)
   ════════════════════════════════════════════ */
'use strict';

const Auth = (() => {
  const USERS_KEY   = 'bubble_users';
  const SESSION_KEY = 'bubble_session';

  // Seed demo users on first load
  function seedDemoUsers() {
    if (getUsers().length) return;
    const demo = [
      { id: 'u1', username: 'anand.k',    name: 'Anand Kundurthi', email: 'anand@demo.com',  password: 'demo123', avatar: 'A', gradient: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)', bio: 'Full-Stack Dev 💻 | Building @Bubble', followers: 1240, following: 380, posts: 6,  joined: 'Feb 2025' },
      { id: 'u2', username: 'priya.dev',   name: 'Priya Sharma',   email: 'priya@demo.com',  password: 'demo123', avatar: 'P', gradient: 'linear-gradient(135deg,#11998e,#38ef7d)',        bio: 'UI/UX Designer 🎨 | Nature lover 🌿',  followers: 890,  following: 210, posts: 14, joined: 'Jan 2025' },
      { id: 'u3', username: 'ravi_x',      name: 'Ravi Kumar',     email: 'ravi@demo.com',   password: 'demo123', avatar: 'R', gradient: 'linear-gradient(135deg,#fc4a1a,#f7b733)',         bio: 'Entrepreneur 🔥 | Never stop hustling', followers: 3400, following: 520, posts: 23, joined: 'Dec 2024' },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demo));
  }

  function getUsers()   { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  function getSession() { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  function setSession(u){ localStorage.setItem(SESSION_KEY, JSON.stringify(u)); }
  function clearSession(){ localStorage.removeItem(SESSION_KEY); }

  function login(emailOrUsername, password) {
    const users = getUsers();
    const user  = users.find(u => (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password);
    if (!user) return { ok: false, error: 'Invalid credentials. Try demo: anand@demo.com / demo123' };
    setSession(user);
    return { ok: true, user };
  }

  function signup(name, username, email, password) {
    const users = getUsers();
    if (users.find(u => u.email === email))         return { ok: false, error: 'Email already registered.' };
    if (users.find(u => u.username === username))   return { ok: false, error: 'Username already taken.' };
    const gradients = [
      'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)',
      'linear-gradient(135deg,#11998e,#38ef7d)',
      'linear-gradient(135deg,#a18cd1,#fbc2eb)',
      'linear-gradient(135deg,#0083b0,#00b4db)',
      'linear-gradient(135deg,#f953c6,#b91d73)',
    ];
    const newUser = {
      id: 'u' + Date.now(),
      username, name, email, password,
      avatar: name.charAt(0).toUpperCase(),
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      bio: '', followers: 0, following: 0, posts: 0,
      joined: new Date().toLocaleString('default', { month: 'short', year: 'numeric' }),
    };
    users.push(newUser);
    saveUsers(users);
    setSession(newUser);
    return { ok: true, user: newUser };
  }

  function logout() { clearSession(); window.location.href = 'login.html'; }

  function requireAuth() {
    const s = getSession();
    if (!s) { window.location.href = 'login.html'; return null; }
    return s;
  }

  function redirectIfLoggedIn() {
    if (getSession()) window.location.href = 'index.html';
  }

  function updateUser(updates) {
    const session = getSession();
    if (!session) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === session.id);
    if (idx === -1) return;
    Object.assign(users[idx], updates);
    saveUsers(users);
    setSession(users[idx]);
    return users[idx];
  }

  seedDemoUsers();

  return { login, signup, logout, requireAuth, redirectIfLoggedIn, getSession, updateUser, getUsers };
})();
